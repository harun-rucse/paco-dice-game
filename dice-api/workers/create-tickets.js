const { parentPort, workerData } = require("worker_threads");
const TicketSettings = require("../models/TicketSettings");
const TicketTier = require("../models/TicketTier");
const Ticket = require("../models/Ticket");
const TicketPool = require("../models/TicketPool");
const Account = require("../models/Account");
const DailyTicket = require("../models/DailyTicket");
const AppError = require("../utils/app-error");
const decimal = require("../utils/decimal");
const { date } = require("../utils/date");

function weightedRandomNumber() {
  const strings = [
    "ZERO",
    "ONE",
    "TWO",
    "THREE",
    "FOUR",
    "FIVE",
    "SIX",
    "SEVEN",
    "EIGHT",
    "NINE",
    "TEN",
    "ELEVEN",
    "TWELVE",
    "THIRTEEN",
    "FOURTEEN",
  ];

  // Define the numbers and their corresponding weights
  const numbers = [...Array(14).keys()]; // Numbers from 0 to 14
  const weights = [
    71.70538592505, 25, 3, 0.25, 0.035, 0.005, 0.00395, 0.000595, 0.0000645,
    0.00000395, 0.000000435, 0.0000001, 0.00000005, 0.000000025, 0.00000001495,
  ];

  // Calculate the total weight
  const totalWeight = weights.reduce((a, b) => a + b, 0);

  // Generate a random number between 0 and the total weight
  const randomNumber = Math.random() * totalWeight;

  // Loop through the weights to find the corresponding number
  let cumulativeWeight = 0;
  for (let i = 0; i < numbers.length; i++) {
    cumulativeWeight += weights[i];
    if (randomNumber < cumulativeWeight) {
      return strings[numbers[i]];
    }
  }
}

const dateQuery = (field) => ({
  [field]: {
    $gt: date.todaysDate,
    $lte: date.nextDate,
  },
});

const { reqBody, accountId } = workerData;
const { type, amount } = reqBody;

const createTicket = async () => {
  try {
    if (!type || !amount)
      throw new AppError("Ticket type & amount is required", 400);

    // Get ticket setting
    const ticketSetting = await TicketSettings.findOne().maxTimeMS(20000);
    if (!ticketSetting) throw new AppError("Ticket setting not found", 404);

    // Get ticket tier
    const ticketTier = await TicketTier.findOne();
    if (!ticketTier) throw new AppError("Ticket tier not found", 404);

    // Get mega and minor jackpot amount from ticket pool
    const ticketPool = await TicketPool.findOne();
    if (!ticketPool) throw new AppError("Ticket pool not found", 404);

    const price = ticketSetting[type];
    const requiredPaco = amount * price;

    // Check account has sufficient paco balance to buy ticket
    const account = await Account.findById(accountId);
    if (decimal.compare(account.paco, requiredPaco, "lt"))
      throw new AppError("Insufficient balance for buying ticket", 400);

    // Get the previous ticket round number
    const prevTicket = await Ticket.findOne({
      buyAt: { $lte: dateQuery("date") },
    }).sort("-buyAt");
    const round = prevTicket ? prevTicket.round + 1 : 1;

    let rewardAmount = "0";
    let poolAmount = "0";
    let minorJackpotAmount = "0";
    let megaJackpotAmount = "0";
    let minorJackpotReduceAmount = "0";
    let megaJackpotReduceAmount = "0";
    let reserveAmount = "0";
    let bonusAmount = "0";
    let teamAmount = "0";
    let pacoBurntAmount = "0";
    let feeAmount = "0";

    await Promise.all(
      Array(amount)
        .fill()
        .map(async () => {
          // Generate random tier for each ticket
          const tier = weightedRandomNumber();

          // Calculate reward for mega and minor jackpot
          let reward;

          if (tier === "ELEVEN") {
            // 50% of the minor jackpot
            reward = decimal.multiply(ticketPool["MINOR_JACKPOT"], 0.5);
            minorJackpotReduceAmount = decimal.addition(
              minorJackpotReduceAmount,
              reward
            );
          } else if (tier === "TWELVE") {
            // 80% of the minor jackpot
            reward = decimal.multiply(ticketPool["MINOR_JACKPOT"], 0.8);
            minorJackpotReduceAmount = decimal.addition(
              minorJackpotReduceAmount,
              reward
            );
          } else if (tier === "THIRTEEN") {
            // 50% of the mega jackpot
            reward = decimal.multiply(ticketPool["MEGA_JACKPOT"], 0.5);
            minorJackpotReduceAmount = decimal.addition(
              megaJackpotReduceAmount,
              reward
            );
          } else if (tier === "FOURTEEN") {
            // 80% of the mega jackpot
            reward = decimal.multiply(ticketPool["MEGA_JACKPOT"], 0.8);
            minorJackpotReduceAmount = decimal.addition(
              megaJackpotReduceAmount,
              reward
            );
          } else {
            reward = ticketTier[tier];
          }

          const newTicket = new Ticket({
            account: accountId,
            type,
            price,
            tier,
            reward,
            round,
          });

          await newTicket.save();

          // Calculate pool amount
          if (tier !== "ZERO") {
            rewardAmount = decimal.addition(rewardAmount, newTicket.reward);
          }

          if (tier === "ZERO") {
            // 60% goes to the revenue-sharing pool
            poolAmount = decimal.addition(poolAmount, newTicket.price * 0.6);
            // 15% goes to the mega jackpot
            megaJackpotAmount = decimal.addition(
              megaJackpotAmount,
              newTicket.price * 0.15
            );
            // 5% goes to the minor jackpot
            minorJackpotAmount = decimal.addition(
              minorJackpotAmount,
              newTicket.price * 0.05
            );
            // 1% goes to the reserve
            reserveAmount = decimal.addition(
              reserveAmount,
              newTicket.price * 0.01
            );
            // 1.5% goes to bonuses
            bonusAmount = decimal.addition(
              bonusAmount,
              newTicket.price * 0.015
            );
            // 17% Team
            teamAmount = decimal.addition(teamAmount, newTicket.price * 0.17);
            // 0.25% burn
            pacoBurntAmount = decimal.addition(
              pacoBurntAmount,
              newTicket.price * 0.0025
            );
            // 0.25 % fee
            feeAmount = decimal.addition(feeAmount, newTicket.price * 0.0025);
          }
        })
    );

    // Create daily ticket document for the same account in a day [3AM - 3AM]
    const dailyTicket = await DailyTicket.findOne({
      account: accountId,
      ...dateQuery("date"),
    });

    if (!dailyTicket) {
      const newDailyTicket = new DailyTicket({
        account: accountId,
        REWARD: rewardAmount,
        REVENUE_SHARING_POOL: poolAmount,
        MINOR_JACKPOT: minorJackpotAmount,
        MEGA_JACKPOT: megaJackpotAmount,
        MINOR_JACKPOT_REDUCE: minorJackpotReduceAmount,
        MEGA_JACKPOT_REDUCE: megaJackpotReduceAmount,
        RESERVE: reserveAmount,
        BONUS: bonusAmount,
        TEAM: teamAmount,
        PACO_BURNT: pacoBurntAmount,
        FEE: feeAmount,
      });

      await newDailyTicket.save();
    } else {
      dailyTicket.REWARD = decimal.addition(dailyTicket.REWARD, rewardAmount);
      dailyTicket.REVENUE_SHARING_POOL = decimal.addition(
        dailyTicket.REVENUE_SHARING_POOL,
        poolAmount
      );
      dailyTicket.MINOR_JACKPOT = decimal.addition(
        dailyTicket.MINOR_JACKPOT,
        minorJackpotAmount
      );
      dailyTicket.MEGA_JACKPOT = decimal.addition(
        dailyTicket.MEGA_JACKPOT,
        megaJackpotAmount
      );
      dailyTicket.MINOR_JACKPOT_REDUCE = decimal.addition(
        dailyTicket.MINOR_JACKPOT_REDUCE,
        minorJackpotReduceAmount
      );
      dailyTicket.MEGA_JACKPOT_REDUCE = decimal.addition(
        dailyTicket.MEGA_JACKPOT_REDUCE,
        megaJackpotReduceAmount
      );
      dailyTicket.RESERVE = decimal.addition(
        dailyTicket.RESERVE,
        reserveAmount
      );
      dailyTicket.BONUS = decimal.addition(dailyTicket.BONUS, bonusAmount);
      dailyTicket.TEAM = decimal.addition(dailyTicket.TEAM, teamAmount);
      dailyTicket.PACO_BURNT = decimal.addition(
        dailyTicket.PACO_BURNT,
        pacoBurntAmount
      );
      dailyTicket.FEE = decimal.addition(dailyTicket.FEE, feeAmount);

      await dailyTicket.save();
    }

    // Reduce paco balance from account
    account.paco = decimal.subtract(account.paco, requiredPaco);
    await account.save();

    // Post message to parent thread with success response
    parentPort.postMessage(`${amount} Tickets bought successfully`);
  } catch (error) {
    // Post message to parent thread with error response
    console.log(error);
    parentPort.postMessage(error.message);
  }
};

// Execute the createTicket function
createTicket();
