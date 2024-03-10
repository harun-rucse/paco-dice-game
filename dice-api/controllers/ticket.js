const { Worker } = require("worker_threads");
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
    $gt: date.todaysDate,
    $lte: date.nextDate,
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
  const worker = new Worker("./workers/create-tickets.js", {
    workerData: { reqBody: req.body, accountId: req.account._id },
  });

  worker.on("message", (message) => {
    res.status(201).json(message);
  });

  worker.on("error", (error) => {
    next(error);
  });
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
            { $lte: ["$buyAt", new Date(date.todaysDate)] },
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
    buyAt: { $lte: date.todaysDate },
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

  let query = { round, buyAt: { $lte: date.todaysDate } };
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
  const ticketsInPlay = await Ticket.countDocuments({ ...dateQuery("buyAt") });

  return res
    .status(200)
    .json({ minorJackpot, megaJackpot, pacoBurnt, ticketsInPlay });
});

// Schedule of Transfer ticket reward & other calculated data to ticket pool and Staking pool
const transferDailyTicketToTicketPool = async () => {
  // Get daily tickets
  const dailyTickets = await DailyTicket.find({ ...dateQuery("date") });
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
