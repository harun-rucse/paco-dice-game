const mongoose = require("mongoose");
const { parentPort, workerData } = require("worker_threads");
const TicketSettings = require("../models/TicketSettings");
const TicketTier = require("../models/TicketTier");
const TicketPool = require("../models/TicketPool");
const Account = require("../models/Account");
const DailyTicket = require("../models/DailyTicket");
const AppError = require("../utils/app-error");
const decimal = require("../utils/decimal");
const db = require("../config/db");
const Referral = require("../models/Referral");
const { LOTTERY_COMMISSION } = require("../utils/referral-constants");

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

const { reqBody, accountId } = workerData;
const { type, amount } = reqBody;

// database connection
db()
  .then(() => {
    console.log("Thread DB Connect success!");
    createTicket();
  })
  .catch((err) => console.log("Thread DB Connect failed!", err));

const createTicket = async () => {
  try {
    if (!type || !amount)
      throw new AppError("Ticket type & amount is required", 400);

    // Get ticket setting
    const ticketSetting = await TicketSettings.findOne();
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
    const id = new mongoose.Types.ObjectId(accountId);
    const account = await Account.findById(id);
    if (decimal.compare(account.paco, requiredPaco, "lt"))
      throw new AppError("Insufficient balance for buying ticket", 400);

    // Get the todays round number
    const round = ticketSetting.round;

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

    let tier0 = 0,
      tier1 = 0,
      tier2 = 0,
      tier3 = 0,
      tier4 = 0,
      tier5 = 0,
      tier6 = 0,
      tier7 = 0,
      tier8 = 0,
      tier9 = 0,
      tier10 = 0,
      tier11 = 0,
      tier12 = 0,
      tier13 = 0,
      tier14 = 0;
    for (let i = 0; i < parseInt(amount); i++) {
      // Generate random tier for each ticket
      const tier = weightedRandomNumber();

      if (tier === "ZERO") tier0++;
      if (tier === "ONE") tier1++;
      if (tier === "TWO") tier2++;
      if (tier === "THREE") tier3++;
      if (tier === "FOUR") tier4++;
      if (tier === "FIVE") tier5++;
      if (tier === "SIX") tier6++;
      if (tier === "SEVEN") tier7++;
      if (tier === "EIGHT") tier8++;
      if (tier === "NINE") tier9++;
      if (tier === "TEN") tier10++;
      if (tier === "ELEVEN") tier11++;
      if (tier === "TWELVE") tier12++;
      if (tier === "THIRTEEN") tier13++;
      if (tier === "FOURTEEN") tier14++;

      // Calculate reward for mega and minor jackpot
      let reward = 0;

      if (tier === "ELEVEN") {
        // 50% of the minor jackpot
        reward = decimal.multiply(ticketPool["MINOR_JACKPOT"], 0.5);
        minorJackpotReduceAmount = decimal.addition(
          minorJackpotReduceAmount,
          reward
        );

        rewardAmount = decimal.addition(rewardAmount, reward);
      } else if (tier === "TWELVE") {
        // 80% of the minor jackpot
        reward = decimal.multiply(ticketPool["MINOR_JACKPOT"], 0.8);
        minorJackpotReduceAmount = decimal.addition(
          minorJackpotReduceAmount,
          reward
        );

        rewardAmount = decimal.addition(rewardAmount, reward);
      } else if (tier === "THIRTEEN") {
        // 50% of the mega jackpot
        reward = decimal.multiply(ticketPool["MEGA_JACKPOT"], 0.5);
        megaJackpotReduceAmount = decimal.addition(
          megaJackpotReduceAmount,
          reward
        );

        rewardAmount = decimal.addition(rewardAmount, reward);
      } else if (tier === "FOURTEEN") {
        // 80% of the mega jackpot
        reward = decimal.multiply(ticketPool["MEGA_JACKPOT"], 0.8);
        megaJackpotReduceAmount = decimal.addition(
          megaJackpotReduceAmount,
          reward
        );

        rewardAmount = decimal.addition(rewardAmount, reward);
      }
    }

    // Calculate for tier ZERO
    if (tier0) {
      const totalLostAmount = decimal.multiply(tier0, ticketSetting[type]);

      // 60% goes to the revenue-sharing pool
      poolAmount = decimal.addition(
        poolAmount,
        decimal.multiply(totalLostAmount, 0.6)
      );

      // 15% goes to the mega jackpot
      megaJackpotAmount = decimal.addition(
        megaJackpotAmount,
        decimal.multiply(totalLostAmount, 0.15)
      );

      // 5% goes to the minor jackpot
      minorJackpotAmount = decimal.addition(
        minorJackpotAmount,
        decimal.multiply(totalLostAmount, 0.05)
      );

      // 1% goes to the reserve
      reserveAmount = decimal.addition(
        reserveAmount,
        decimal.multiply(totalLostAmount, 0.01)
      );

      // 1.5% goes to bonuses
      bonusAmount = decimal.addition(
        bonusAmount,
        decimal.multiply(totalLostAmount, 0.015)
      );

      // 17% Team
      teamAmount = decimal.addition(
        teamAmount,
        decimal.multiply(totalLostAmount, 0.17)
      );

      // 0.25% burn
      pacoBurntAmount = decimal.addition(
        pacoBurntAmount,
        decimal.multiply(totalLostAmount, 0.0025)
      );

      // 0.25 % fee
      feeAmount = decimal.addition(
        feeAmount,
        decimal.multiply(totalLostAmount, 0.0025)
      );
    }

    // calculate tier ONE to TEN
    if (tier1) {
      rewardAmount = decimal.addition(
        rewardAmount,
        decimal.multiply(ticketTier["ONE"], tier1)
      );
    }
    if (tier2) {
      rewardAmount = decimal.addition(
        rewardAmount,
        decimal.multiply(ticketTier["TWO"], tier2)
      );
    }
    if (tier3) {
      rewardAmount = decimal.addition(
        rewardAmount,
        decimal.multiply(ticketTier["THREE"], tier3)
      );
    }
    if (tier4) {
      rewardAmount = decimal.addition(
        rewardAmount,
        decimal.multiply(ticketTier["FOUR"], tier4)
      );
    }
    if (tier5) {
      rewardAmount = decimal.addition(
        rewardAmount,
        decimal.multiply(ticketTier["FIVE"], tier5)
      );
    }
    if (tier6) {
      rewardAmount = decimal.addition(
        rewardAmount,
        decimal.multiply(ticketTier["SIX"], tier6)
      );
    }
    if (tier7) {
      rewardAmount = decimal.addition(
        rewardAmount,
        decimal.multiply(ticketTier["SEVEN"], tier7)
      );
    }
    if (tier8) {
      rewardAmount = decimal.addition(
        rewardAmount,
        decimal.multiply(ticketTier["EIGHT"], tier8)
      );
    }
    if (tier9) {
      rewardAmount = decimal.addition(
        rewardAmount,
        decimal.multiply(ticketTier["NINE"], tier9)
      );
    }
    if (tier10) {
      rewardAmount = decimal.addition(
        rewardAmount,
        decimal.multiply(ticketTier["TEN"], tier10)
      );
    }

    // Create daily ticket document for the same account in a day [3AM - 3AM]
    const dailyTicket = await DailyTicket.findOne({
      account: accountId,
      round: round,
    });

    if (!dailyTicket) {
      const newDailyTicket = new DailyTicket({
        account: accountId,
        round: round,
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
        TIER_ZERO: tier0,
        TIER_ONE: tier1,
        TIER_TWO: tier2,
        TIER_THREE: tier3,
        TIER_FOUR: tier4,
        TIER_FIVE: tier5,
        TIER_SIX: tier6,
        TIER_SEVEN: tier7,
        TIER_EIGHT: tier8,
        TIER_NINE: tier9,
        TIER_TEN: tier10,
        TIER_ELEVEN: tier11,
        TIER_TWELVE: tier12,
        TIER_THIRTEEN: tier13,
        TIER_FOURTEEN: tier14,
        PACO_SPENT: requiredPaco,
      });

      if (type === "STANDARD") {
        newDailyTicket.STANDARD = amount;
        if (tier0) newDailyTicket.STANDARD_LOOSING = tier0;
      } else if (type === "MEGA") {
        newDailyTicket.MEGA = amount;
        if (tier0) newDailyTicket.MEGA_LOOSING = tier0;
      }

      newDailyTicket.save();
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

      dailyTicket.TIER_ZERO = decimal.addition(tier0, dailyTicket.TIER_ZERO);
      dailyTicket.TIER_ONE = decimal.addition(tier1, dailyTicket.TIER_ONE);
      dailyTicket.TIER_TWO = decimal.addition(tier2, dailyTicket.TIER_TWO);
      dailyTicket.TIER_THREE = decimal.addition(tier3, dailyTicket.TIER_THREE);
      dailyTicket.TIER_FOUR = decimal.addition(tier4, dailyTicket.TIER_FOUR);
      dailyTicket.TIER_FIVE = decimal.addition(tier5, dailyTicket.TIER_FIVE);
      dailyTicket.TIER_SIX = decimal.addition(tier6, dailyTicket.TIER_SIX);
      dailyTicket.TIER_SEVEN = decimal.addition(tier7, dailyTicket.TIER_SEVEN);
      dailyTicket.TIER_EIGHT = decimal.addition(tier8, dailyTicket.TIER_EIGHT);
      dailyTicket.TIER_NINE = decimal.addition(tier9, dailyTicket.TIER_NINE);
      dailyTicket.TIER_TEN = decimal.addition(tier10, dailyTicket.TIER_TEN);
      dailyTicket.TIER_ELEVEN = decimal.addition(
        tier11,
        dailyTicket.TIER_ELEVEN
      );
      dailyTicket.TIER_TWELVE = decimal.addition(
        tier12,
        dailyTicket.TIER_TWELVE
      );
      dailyTicket.TIER_THIRTEEN = decimal.addition(
        tier13,
        dailyTicket.TIER_THIRTEEN
      );
      dailyTicket.TIER_FOURTEEN = decimal.addition(
        tier14,
        dailyTicket.TIER_FOURTEEN
      );

      if (type === "STANDARD") {
        dailyTicket.STANDARD = decimal.addition(dailyTicket.STANDARD, amount);
        if (tier0) {
          dailyTicket.STANDARD_LOOSING = decimal.addition(
            dailyTicket.STANDARD_LOOSING,
            tier0
          );
        }
      } else if (type === "MEGA") {
        dailyTicket.MEGA = decimal.addition(dailyTicket.MEGA, amount);
        if (tier0) {
          dailyTicket.MEGA_LOOSING = decimal.addition(
            dailyTicket.MEGA_LOOSING,
            tier0
          );
        }
      }

      dailyTicket.PACO_SPENT = decimal.addition(
        dailyTicket.PACO_SPENT,
        requiredPaco
      );

      dailyTicket.save();
    }

    // Reduce paco balance from account
    account.paco = decimal.subtract(account.paco, requiredPaco);
    account.save();

    // Add commission reward to the referral
    const lotteryReferral = await Referral.findOne({
      account: accountId,
      type: "lottery",
    });

    if (lotteryReferral) {
      const lotteryReward = decimal.multiply(requiredPaco, LOTTERY_COMMISSION);
      lotteryReferral["paco"] = decimal.addition(
        lotteryReferral["paco"],
        lotteryReward
      );

      lotteryReferral.save();
    }

    // Post message to parent thread with success response
    parentPort.postMessage(`${amount} Tickets bought successfully`);
  } catch (error) {
    // Post message to parent thread with error response
    // console.log(error);
    // parentPort.postMessage(error.message);
    throw error;
  }
};
