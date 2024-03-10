const TicketSettings = require("../models/TicketSettings");
const TicketTier = require("../models/TicketTier");
const Ticket = require("../models/Ticket");
const TicketPool = require("../models/TicketPool");
const Account = require("../models/Account");
const DailyTicket = require("../models/DailyTicket");
const StakePool = require("../models/StakePool");
const AppError = require("../utils/app-error");
const catchAsync = require("../utils/catch-async");
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

function getWinningTierName(tier) {
  const tierMapping = {
    ZERO: "-",
    ONE: "Tier 1",
    TWO: "Tier 2",
    THREE: "Tier 3",
    FOUR: "Tier 4",
    FIVE: "Tier 5",
    SIX: "Tier 6",
    SEVEN: "Tier 7",
    EIGHT: "Tier 8",
    NINE: "Tier 9",
    TEN: "Tier 10",
    ELEVEN: "Tier 11",
    TWELVE: "Tier 12",
    THIRTEEN: "Tier 13",
    FOURTEEN: "Tier 14",
  };

  return tierMapping[tier];
}

const dateQuery = (field) => ({
  [field]: {
    $gt: new Date(date.todaysDate),
    $lte: new Date(date.nextDate),
  },
});

/**
 * @desc    Create new ticket setting
 * @route   POST /api/tickets/setting
 * @access  Private(admin)
 */
const createTicketSetting = catchAsync(async (req, res, next) => {
  const { STANDARD, MEGA } = req.body;
  if (!STANDARD || !MEGA)
    return next(new AppError("Standard & mega ticket price is required", 400));

  const ticketSetting = await TicketSettings.findOne();

  let response;
  if (!ticketSetting) {
    const newTicketSetting = new TicketSettings();
    newTicketSetting.STANDARD = STANDARD;
    newTicketSetting.MEGA = MEGA;

    response = await newTicketSetting.save();
  } else {
    ticketSetting.STANDARD = STANDARD;
    ticketSetting.MEGA = MEGA;

    response = await ticketSetting.save();
  }

  res.status(200).json(response);
});

/**
 * @desc    Get ticket setting
 * @route   GET /api/tickets/setting
 * @access  Public
 */
const getTicketSetting = catchAsync(async (req, res, next) => {
  const ticketSetting = await TicketSettings.findOne();
  if (!ticketSetting) return next(new AppError("No ticket setting found", 404));

  res.status(200).json(ticketSetting);
});

/**
 * @desc    Create new ticket setting
 * @route   POST /api/tickets/tier
 * @access  Private(admin)
 */
const createTicketTier = catchAsync(async (req, res, next) => {
  const {
    ONE,
    TWO,
    THREE,
    FOUR,
    FIVE,
    SIX,
    SEVEN,
    EIGHT,
    NINE,
    TEN,
    ELEVEN,
    TWELVE,
    THIRTEEN,
    FOURTEEN,
  } = req.body;
  if (
    !ONE ||
    !TWO ||
    !THREE ||
    !FOUR ||
    !FIVE ||
    !SIX ||
    !SEVEN ||
    !EIGHT ||
    !NINE ||
    !TEN ||
    !ELEVEN ||
    !TWELVE ||
    !THIRTEEN ||
    !FOURTEEN
  )
    return next(new AppError("All fields are required", 400));

  const ticketTier = await TicketTier.findOne();

  let response;
  if (!ticketTier) {
    const newTicketTier = new TicketTier();
    newTicketTier.ONE = ONE;
    newTicketTier.TWO = TWO;
    newTicketTier.THREE = THREE;
    newTicketTier.FOUR = FOUR;
    newTicketTier.FIVE = FIVE;
    newTicketTier.SIX = SIX;
    newTicketTier.SEVEN = SEVEN;
    newTicketTier.EIGHT = EIGHT;
    newTicketTier.NINE = NINE;
    newTicketTier.TEN = TEN;
    newTicketTier.ELEVEN = ELEVEN;
    newTicketTier.TWELVE = TWELVE;
    newTicketTier.THIRTEEN = THIRTEEN;
    newTicketTier.FOURTEEN = FOURTEEN;

    response = await newTicketTier.save();
  } else {
    ticketTier.ONE = ONE;
    ticketTier.TWO = TWO;
    ticketTier.THREE = THREE;
    ticketTier.FOUR = FOUR;
    ticketTier.FIVE = FIVE;
    ticketTier.SIX = SIX;
    ticketTier.SEVEN = SEVEN;
    ticketTier.EIGHT = EIGHT;
    ticketTier.NINE = NINE;
    ticketTier.TEN = TEN;
    ticketTier.ELEVEN = ELEVEN;
    ticketTier.TWELVE = TWELVE;
    ticketTier.THIRTEEN = THIRTEEN;
    ticketTier.FOURTEEN = FOURTEEN;

    response = await ticketTier.save();
  }

  res.status(200).json(response);
});

/**
 * @desc    Get ticket tier
 * @route   GET /api/tickets/tier
 * @access  Private(admin)
 */
const getTicketTier = catchAsync(async (req, res, next) => {
  const ticketTier = await TicketTier.findOne();
  if (!ticketTier) return next(new AppError("No ticket tier found", 404));

  res.status(200).json(ticketTier);
});

/**
 * @desc    Create new ticket
 * @route   POST /api/tickets
 * @access  Private
 */
const createTicket = catchAsync(async (req, res, next) => {
  const type = req.body.type;
  const amount = Number(req.body.amount);
  if (!type || !amount)
    return next(new AppError("Ticket type & amount is required", 400));

  // Get ticket setting
  const ticketSetting = await TicketSettings.findOne();
  if (!ticketSetting)
    return next(new AppError("Ticket setting not found", 404));

  // Get ticket tier
  const ticketTier = await TicketTier.findOne();
  if (!ticketTier) return next(new AppError("Ticket tier not found", 404));

  // Get mega and minor jackpot amount from ticket pool
  const ticketPool = await TicketPool.findOne();
  if (!ticketPool) return next(new AppError("Ticket pool not found", 404));

  const accountId = req.account._id;
  const price = ticketSetting[type];
  const requiredPaco = amount * price;

  // Check account have sufficient paco balance for buy ticket
  const account = await Account.findById(accountId);
  if (decimal.compare(account.paco, requiredPaco, "lt"))
    return next(new AppError("Insufficient balance for buy ticket", 400));

  // Get the previous ticket round number
  const prevTicket = await Ticket.findOne({
    buyAt: { $lte: date.todaysDate },
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
          // 50% of the mega  jackpot
          reward = decimal.multiply(ticketPool["MEGA_JACKPOT"], 0.5);
          minorJackpotReduceAmount = decimal.addition(
            megaJackpotReduceAmount,
            reward
          );
        } else if (tier === "FOURTEEN") {
          // 80% of the mega  jackpot
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
          bonusAmount = decimal.addition(bonusAmount, newTicket.price * 0.015);
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

  // Create daily ticket document for same account in a day [3AM - 3AM]
  const dailyTicket = await DailyTicket.findOne({
    account: accountId,
    ...dateQuery("createdAt"),
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
    dailyTicket.RESERVE = decimal.addition(dailyTicket.RESERVE, reserveAmount);
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

  res.status(201).json({ message: `${amount} Tickets buy successful` });
});

/**
 * @desc    Get All tickets
 * @route   GET /api/tickets?page=1&limit=10
 * @access  Private(admin)
 */
const getAllTickets = catchAsync(async (req, res, next) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 10);

  const count = await Ticket.countDocuments({ account: req.account._id });
  const tickets = await Ticket.find()
    .select("+reward")
    .limit(limit)
    .skip(limit * (page - 1));

  res.status(200).json({ tickets, count });
});

/**
 * @desc    Get My tickets
 * @route   GET /api/tickets/my-tickets?page=1&limit=10
 * @access  Private
 */
const getMyTickets = catchAsync(async (req, res, next) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 10);
  const round = Number(req.query.round || 1);

  const query = { account: req.account._id, round };
  const count = await Ticket.countDocuments(query);

  const tickets = await Ticket.aggregate([
    {
      $match: query,
    },
    {
      $lookup: {
        from: "accounts",
        localField: "account",
        foreignField: "_id",
        as: "account",
      },
    },
    {
      $unwind: "$account",
    },
    {
      $addFields: {
        status: {
          $cond: [
            { $lte: ["$createdAt", new Date(date.todaysDate)] },
            "Drawn",
            "Waiting Results",
          ],
        },
      },
    },
    {
      $project: {
        _id: 1,
        username: "$account.username",
        status: 1,
        type: "$type",
        round: { $concat: ["Round ", { $toString: "$round" }] },
        buyAt: 1,
      },
    },
    {
      $skip: limit * (page - 1),
    },
    {
      $limit: limit,
    },
  ]);

  res.status(200).json({
    tickets,
    count,
  });
});

/**
 * @desc    Get My total tickets count
 * @route   GET /api/tickets/my-tickets-count
 * @access  Private
 */
const getMyTicketsCount = catchAsync(async (req, res, next) => {
  const myTotalStandardTicket = await Ticket.countDocuments({
    account: req.account._id,
    type: "STANDARD",
  });
  const myTotalMegaTicket = await Ticket.countDocuments({
    account: req.account._id,
    type: "MEGA",
  });

  res.status(200).json({
    totalStandardToken: myTotalStandardTicket,
    totalMegaToken: myTotalMegaTicket,
  });
});

/**
 * @desc    Get Last ticket round
 * @route   GET /api/tickets/last-round
 * @access  Public
 */
const getLastRound = catchAsync(async (req, res, next) => {
  const ticket = await Ticket.findOne().sort("-buyAt");
  if (!ticket) return next(new AppError("No ticket found", 400));

  res.status(200).json(ticket.round);
});

/**
 * @desc    Get My Histories
 * @route   GET /api/tickets/my-histories?page=1&limit=10&type=all
 * @query   page number
 * @query   limit number
 * @query   round number
 * @query   type = all, losing, winning
 * @access  Private
 */
const getMyHistories = catchAsync(async (req, res, next) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 10);
  const round = Number(req.query.round || 1);
  const type = req.query.type;

  let query = {
    account: req.account._id,
    round,
    createdAt: { $lte: new Date(date.todaysDate) },
  };
  if (type === "winning") {
    query = { ...query, tier: { $ne: "ZERO" } };
  } else if (type === "losing") {
    query = { ...query, tier: { $eq: "ZERO" } };
  }

  const count = await Ticket.countDocuments(query);

  let tickets = await Ticket.aggregate([
    {
      $match: query,
    },
    {
      $lookup: {
        from: "accounts",
        localField: "account",
        foreignField: "_id",
        as: "account",
      },
    },
    {
      $unwind: "$account",
    },
    {
      $project: {
        _id: 1,
        username: "$account.username",
        type: "$type",
        round: { $concat: ["Round ", { $toString: "$round" }] },
        tier: "$tier",
        buyAt: 1,
        prize: "$reward",
        reward: 1,
      },
    },
    {
      $skip: limit * (page - 1),
    },
    {
      $limit: limit,
    },
  ]);

  tickets = tickets.map((ticket) => ({
    ...ticket,
    winningTier: getWinningTierName(ticket.tier),
  }));

  res.status(200).json({ histories: tickets, count });
});

/**
 * @desc    Get All bets
 * @route   GET /api/tickets/all-bets?page=1&limit=10&type=all
 * @query   page number
 * @query   limit number
 * @query   round number
 * @query   type = all, losing, winning
 * @access  Private
 */
const getAllBets = catchAsync(async (req, res, next) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 10);
  const round = Number(req.query.round || 1);
  const type = req.query.type;

  let query = { round, createdAt: { $lte: new Date(date.todaysDate) } };
  if (type === "winning") {
    query = { ...query, tier: { $ne: "ZERO" } };
  } else if (type === "losing") {
    query = { ...query, tier: { $eq: "ZERO" } };
  }

  const count = await Ticket.countDocuments(query);

  let tickets = await Ticket.aggregate([
    {
      $match: query,
    },
    {
      $lookup: {
        from: "accounts",
        localField: "account",
        foreignField: "_id",
        as: "account",
      },
    },
    {
      $unwind: "$account",
    },
    {
      $project: {
        _id: 1,
        username: "$account.username",
        type: "$type",
        round: { $concat: ["Round ", { $toString: "$round" }] },
        tier: "$tier",
        buyAt: 1,
        prize: "$reward",
        reward: 1,
      },
    },
    {
      $skip: limit * (page - 1),
    },
    {
      $limit: limit,
    },
  ]);

  tickets = tickets.map((ticket) => ({
    ...ticket,
    winningTier: getWinningTierName(ticket.tier),
  }));

  res.status(200).json({ allBets: tickets, count });
});

/**
 * @desc    Get Ticket statistics
 * @route   GET /api/tickets/statistics
 * @access  Public
 */
const getTicketStatistics = catchAsync(async (req, res, next) => {
  const ticketPool = await TicketPool.findOne();

  const minorJackpot = ticketPool ? ticketPool.MINOR_JACKPOT : 0;
  const megaJackpot = ticketPool ? ticketPool.MEGA_JACKPOT : 0;
  const pacoBurnt = ticketPool ? ticketPool.PACO_BURNT : 0;

  // Calculate ticketsInPlay
  const ticketsInPlay = await Ticket.countDocuments({
    ...dateQuery("createdAt"),
  });

  return res
    .status(200)
    .json({ minorJackpot, megaJackpot, pacoBurnt, ticketsInPlay });
});

// Schedule of Transfer ticket reward & other calculated data to ticket pool and Staking pool
const transferDailyTicketToTicketPool = async () => {
  // Get daily tickets
  const dailyTickets = await DailyTicket.find({ ...dateQuery("createdAt") });
  if (!dailyTickets.length) return;

  await Promise.all(
    dailyTickets.map(async (dailyTicket) => {
      // Transfer ticket reward to the account
      const account = await Account.findById(dailyTicket.account);
      account.paco = decimal.addition(account.paco, dailyTicket.REWARD);
      await account.save();

      // Transfer pool amount to the paco burnt pool
      const ticketPool = await TicketPool.findOne();
      if (!ticketPool) {
        const newTicketPool = new TicketPool();

        // Transfer REVENUE_SHARING_POOL to Staking pool
        const stakePool = await StakePool.findOne();
        if (!stakePool) {
          const newStakePool = new StakePool();
          newStakePool.paco = decimal.addition(
            newStakePool.paco,
            dailyTicket.REVENUE_SHARING_POOL
          );

          await newStakePool.save();
        } else {
          stakePool.paco = decimal.addition(
            stakePool.paco,
            dailyTicket.REVENUE_SHARING_POOL
          );

          await stakePool.save();
        }

        // Transfer MINOR_JACKPOT
        newTicketPool.MINOR_JACKPOT = decimal.addition(
          newTicketPool.MINOR_JACKPOT,
          dailyTicket.MINOR_JACKPOT
        );

        // Transfer MEGA_JACKPOT
        newTicketPool.MEGA_JACKPOT = decimal.addition(
          newTicketPool.MEGA_JACKPOT,
          dailyTicket.MEGA_JACKPOT
        );

        // Transfer RESERVE
        newTicketPool.RESERVE = decimal.addition(
          newTicketPool.RESERVE,
          dailyTicket.RESERVE
        );

        // Transfer BONUS
        newTicketPool.BONUS = decimal.addition(
          newTicketPool.BONUS,
          dailyTicket.BONUS
        );

        // Transfer TEAM
        newTicketPool.TEAM = decimal.addition(
          newTicketPool.TEAM,
          dailyTicket.TEAM
        );

        // Transfer PACO_BURNT
        newTicketPool.PACO_BURNT = decimal.addition(
          newTicketPool.PACO_BURNT,
          dailyTicket.PACO_BURNT
        );

        // Transfer FEE
        newTicketPool.FEE = decimal.addition(
          newTicketPool.FEE,
          dailyTicket.FEE
        );

        // Subtract MINOR_JACKPOT_REDUCE to the Ticket pool
        newTicketPool.MINOR_JACKPOT = decimal.subtract(
          newTicketPool.MINOR_JACKPOT,
          dailyTicket.MINOR_JACKPOT_REDUCE
        );

        // Subtract MEGA_JACKPOT_REDUCE to the Ticket pool
        newTicketPool.MEGA_JACKPOT = decimal.subtract(
          newTicketPool.MEGA_JACKPOT,
          dailyTicket.MEGA_JACKPOT_REDUCE
        );

        await newTicketPool.save();
      } else {
        // Transfer MINOR_JACKPOT
        ticketPool.MINOR_JACKPOT = decimal.addition(
          ticketPool.MINOR_JACKPOT,
          dailyTicket.MINOR_JACKPOT
        );

        // Transfer MEGA_JACKPOT
        ticketPool.MEGA_JACKPOT = decimal.addition(
          ticketPool.MEGA_JACKPOT,
          dailyTicket.MEGA_JACKPOT
        );

        // Transfer RESERVE
        ticketPool.RESERVE = decimal.addition(
          ticketPool.RESERVE,
          dailyTicket.RESERVE
        );

        // Transfer BONUS
        ticketPool.BONUS = decimal.addition(
          ticketPool.BONUS,
          dailyTicket.BONUS
        );

        // Transfer TEAM
        ticketPool.TEAM = decimal.addition(ticketPool.TEAM, dailyTicket.TEAM);

        // Transfer PACO_BURNT
        ticketPool.PACO_BURNT = decimal.addition(
          ticketPool.PACO_BURNT,
          dailyTicket.PACO_BURNT
        );

        // Transfer FEE
        ticketPool.FEE = decimal.addition(ticketPool.FEE, dailyTicket.FEE);

        // Subtract MINOR_JACKPOT_REDUCE to the Ticket pool
        ticketPool.MINOR_JACKPOT = decimal.subtract(
          ticketPool.MINOR_JACKPOT,
          dailyTicket.MINOR_JACKPOT_REDUCE
        );

        // Subtract MEGA_JACKPOT_REDUCE to the Ticket pool
        ticketPool.MEGA_JACKPOT = decimal.subtract(
          ticketPool.MEGA_JACKPOT,
          dailyTicket.MEGA_JACKPOT_REDUCE
        );

        await ticketPool.save();
      }

      // Delete daily ticket document from db
      await DailyTicket.findByIdAndDelete(dailyTicket._id);
    })
  );
};

module.exports = {
  createTicketSetting,
  getTicketSetting,
  createTicketTier,
  getTicketTier,
  createTicket,
  getAllTickets,
  getMyTickets,
  getLastRound,
  getMyHistories,
  getAllBets,
  getTicketStatistics,
  transferDailyTicketToTicketPool,
  getMyTicketsCount,
};
