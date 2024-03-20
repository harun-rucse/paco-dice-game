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

function getWinningTierName(tier) {
  const tierMapping = {
    ZERO: "Lost",
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

function getTotalWinnings(winningTickets, tierName, ticketPool, ticketTier) {
  switch (tierName) {
    case "ELEVEN": {
      return decimal.multiply(
        winningTickets,
        decimal.multiply(ticketPool["MINOR_JACKPOT"], 0.5)
      );
    }
    case "TWELVE": {
      return decimal.multiply(
        winningTickets,
        decimal.multiply(ticketPool["MINOR_JACKPOT"], 0.8)
      );
    }
    case "THIRTEEN": {
      return decimal.multiply(
        winningTickets,
        decimal.multiply(ticketPool["MEGA_JACKPOT"], 0.5)
      );
    }
    case "FOURTEEN": {
      return decimal.multiply(
        winningTickets,
        decimal.multiply(ticketPool["MEGA_JACKPOT"], 0.8)
      );
    }

    default: {
      return decimal.multiply(winningTickets, ticketTier[tierName]);
    }
  }
}

function getPrize(tierName, ticketTier) {
  switch (tierName) {
    case "ELEVEN": {
      return "50% of minor jackpot";
    }
    case "TWELVE": {
      return "80% of minor jackpot";
    }
    case "THIRTEEN": {
      return "50% of mega jackpot";
    }
    case "FOURTEEN": {
      return "80% of mega jackpot ";
    }

    default: {
      return ticketTier[tierName];
    }
  }
}

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
    workerData: { reqBody: req.body, accountId: req.account._id?.toString() },
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
 * @route   GET /api/tickets/my-tickets
 * @access  Private
 */
const getMyTickets = catchAsync(async (req, res, next) => {
  const ticketSetting = await TicketSettings.findOne();
  const round = ticketSetting.round;

  // Total active standard ticket
  const activeTotalStandardTicket = await Ticket.countDocuments({
    account: req.account._id,
    type: "STANDARD",
    round,
  });

  // Total active mega ticket
  const activeTotalMegaTicket = await Ticket.countDocuments({
    account: req.account._id,
    type: "MEGA",
    round,
  });

  // Total allTime standard ticket
  const allTimeTotalStandardTicket = await Ticket.countDocuments({
    account: req.account._id,
    type: "STANDARD",
  });

  // Total allTime mega ticket
  const allTimeTotalMegaTicket = await Ticket.countDocuments({
    account: req.account._id,
    type: "MEGA",
  });

  const totalPacoSpent =
    allTimeTotalStandardTicket * ticketSetting.STANDARD +
    allTimeTotalMegaTicket * ticketSetting.MEGA;

  res.status(200).json({
    active: {
      standard: activeTotalStandardTicket || 0,
      mega: activeTotalMegaTicket || 0,
    },
    allTime: {
      standard: allTimeTotalStandardTicket || 0,
      mega: allTimeTotalMegaTicket || 0,
    },
    totalPacoSpent: totalPacoSpent || 0,
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
  const ticketSetting = await TicketSettings.findOne();
  if (!ticketSetting) return next(new AppError("No ticket setting found", 404));

  res.status(200).json(ticketSetting.round);
});

/**
 * @desc    Get My Histories
 * @route   GET /api/tickets/my-histories?page=1&limit=10&type=winning
 * @query   round number
 * @query   type = loosing, winning
 * @access  Private
 */
const getMyHistories = catchAsync(async (req, res, next) => {
  const round = Number(req.query.round || 1);
  const type = req.query.type;

  // winning bets
  if (type === "winning") {
    const query = {
      account: req.account._id,
      round,
      tier: { $ne: "ZERO" },
    };

    const ticketTier = await TicketTier.findOne();
    const ticketPool = await TicketPool.findOne();

    let tickets = await Ticket.aggregate([
      {
        $match: query,
      },
      {
        $group: {
          _id: "$tier",
          winningTickets: { $sum: 1 },
          round: { $first: "$round" },
        },
      },
      {
        $project: {
          _id: 1,
          tier: "$_id",
          winningTickets: 1,
          round: { $concat: ["Round ", { $toString: "$round" }] },
          tierOrder: {
            $switch: {
              branches: [
                { case: { $eq: ["$_id", "ONE"] }, then: 1 },
                { case: { $eq: ["$_id", "TWO"] }, then: 2 },
                { case: { $eq: ["$_id", "THREE"] }, then: 3 },
                { case: { $eq: ["$_id", "FOUR"] }, then: 4 },
                { case: { $eq: ["$_id", "FIVE"] }, then: 5 },
                { case: { $eq: ["$_id", "SIX"] }, then: 6 },
                { case: { $eq: ["$_id", "SEVEN"] }, then: 7 },
                { case: { $eq: ["$_id", "EIGHT"] }, then: 8 },
                { case: { $eq: ["$_id", "NINE"] }, then: 9 },
                { case: { $eq: ["$_id", "TEN"] }, then: 10 },
                { case: { $eq: ["$_id", "ELEVEN"] }, then: 11 },
                { case: { $eq: ["$_id", "TWELVE"] }, then: 12 },
                { case: { $eq: ["$_id", "THIRTEEN"] }, then: 13 },
                { case: { $eq: ["$_id", "FOURTEEN"] }, then: 14 },
              ],
              default: 999,
            },
          },
        },
      },
      {
        $sort: { tierOrder: 1 },
      },
      {
        $project: {
          _id: 0,
          tierOrder: 0,
        },
      },
    ]);

    tickets = tickets.map((ticket) => ({
      ...ticket,
      tier: getWinningTierName(ticket.tier),
      prize: getPrize(ticket.tier, ticketTier),
      totalWinnings: getTotalWinnings(
        ticket.winningTickets,
        ticket.tier,
        ticketPool,
        ticketTier
      ),
    }));

    return res.status(200).json({ histories: tickets });
  }

  // Loosing bets
  if (type === "loosing") {
    const query = {
      account: req.account._id,
      round,
      tier: { $eq: "ZERO" },
    };

    const ticketSetting = await TicketSettings.findOne();

    let tickets = await Ticket.aggregate([
      {
        $match: query,
      },
      {
        $group: {
          _id: "$type",
          loosingTickets: { $sum: 1 },
          round: { $first: "$round" },
        },
      },
      {
        $project: {
          _id: 1,
          ticketType: { $toUpper: "$_id" },
          loosingTickets: 1,
          round: { $concat: ["Round ", { $toString: "$round" }] },
          typeOrder: {
            $switch: {
              branches: [
                { case: { $eq: ["$_id", "STANDARD"] }, then: 1 },
                { case: { $eq: ["$_id", "MEGA"] }, then: 2 },
              ],
              default: 999,
            },
          },
        },
      },
      {
        $sort: { typeOrder: 1 },
      },
      {
        $project: {
          _id: 0,
          typeOrder: 0,
        },
      },
    ]);

    tickets = tickets.map((ticket) => ({
      ...ticket,
      totalPacoSpent: decimal.multiply(
        ticket.loosingTickets,
        ticketSetting[ticket.ticketType]
      ),
    }));

    return res.status(200).json({ histories: tickets });
  }
});

/**
 * @desc    Get All bets
 * @route   GET /api/tickets/all-bets
 * @query   round number
 * @access  Private
 */
const getAllBets = catchAsync(async (req, res, next) => {
  const round = Number(req.query.round || 1);
  const query = { round };

  const ticketTier = await TicketTier.findOne();
  const ticketPool = await TicketPool.findOne();

  let tickets = await Ticket.aggregate([
    {
      $match: query,
    },
    {
      $group: {
        _id: "$tier",
        winningTickets: { $sum: 1 },
        round: { $first: "$round" },
      },
    },
    {
      $project: {
        _id: 1,
        tier: "$_id",
        winningTickets: 1,
        round: { $concat: ["Round ", { $toString: "$round" }] },
        tierOrder: {
          $switch: {
            branches: [
              { case: { $eq: ["$_id", "ZERO"] }, then: 1 },
              { case: { $eq: ["$_id", "ONE"] }, then: 2 },
              { case: { $eq: ["$_id", "TWO"] }, then: 3 },
              { case: { $eq: ["$_id", "THREE"] }, then: 4 },
              { case: { $eq: ["$_id", "FOUR"] }, then: 5 },
              { case: { $eq: ["$_id", "FIVE"] }, then: 6 },
              { case: { $eq: ["$_id", "SIX"] }, then: 7 },
              { case: { $eq: ["$_id", "SEVEN"] }, then: 8 },
              { case: { $eq: ["$_id", "EIGHT"] }, then: 9 },
              { case: { $eq: ["$_id", "NINE"] }, then: 10 },
              { case: { $eq: ["$_id", "TEN"] }, then: 11 },
              { case: { $eq: ["$_id", "ELEVEN"] }, then: 12 },
              { case: { $eq: ["$_id", "TWELVE"] }, then: 13 },
              { case: { $eq: ["$_id", "THIRTEEN"] }, then: 14 },
              { case: { $eq: ["$_id", "FOURTEEN"] }, then: 15 },
            ],
            default: 999,
          },
        },
      },
    },
    {
      $sort: { tierOrder: 1 },
    },
    {
      $project: {
        _id: 0,
        tierOrder: 0,
      },
    },
  ]);

  tickets = tickets.map((ticket) => ({
    ...ticket,
    tier: getWinningTierName(ticket.tier),
    prize: getPrize(ticket.tier, ticketTier),
    totalWinnings: getTotalWinnings(
      ticket.winningTickets,
      ticket.tier,
      ticketPool,
      ticketTier
    ),
  }));

  // Other tier ticket
  for (let i = tickets.length; i <= 15; i++) {
    tickets.push({
      tier: `Tier ${i}`,
      prize: "-",
      round: `Round ${round}`,
      winningTickets: "-",
      totalWinnings: "-",
    });
  }

  return res.status(200).json({ allBets: tickets });
});

/**
 * @desc    Get All time
 * @route   GET /api/tickets/all-time
 * @query   round number
 * @access  Private
 */
const getAllTime = catchAsync(async (req, res, next) => {
  const ticketTier = await TicketTier.findOne();
  const ticketPool = await TicketPool.findOne();

  const ticketSetting = await TicketSettings.findOne();
  const round = ticketSetting.round;

  let tickets = await Ticket.aggregate([
    {
      $match: { round: { $lt: round } },
    },
    {
      $group: {
        _id: "$tier",
        totalTickets: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 1,
        tier: "$_id",
        totalTickets: 1,
        tierOrder: {
          $switch: {
            branches: [
              { case: { $eq: ["$_id", "ZERO"] }, then: 1 },
              { case: { $eq: ["$_id", "ONE"] }, then: 2 },
              { case: { $eq: ["$_id", "TWO"] }, then: 3 },
              { case: { $eq: ["$_id", "THREE"] }, then: 4 },
              { case: { $eq: ["$_id", "FOUR"] }, then: 5 },
              { case: { $eq: ["$_id", "FIVE"] }, then: 6 },
              { case: { $eq: ["$_id", "SIX"] }, then: 7 },
              { case: { $eq: ["$_id", "SEVEN"] }, then: 8 },
              { case: { $eq: ["$_id", "EIGHT"] }, then: 9 },
              { case: { $eq: ["$_id", "NINE"] }, then: 10 },
              { case: { $eq: ["$_id", "TEN"] }, then: 11 },
              { case: { $eq: ["$_id", "ELEVEN"] }, then: 12 },
              { case: { $eq: ["$_id", "TWELVE"] }, then: 13 },
              { case: { $eq: ["$_id", "THIRTEEN"] }, then: 14 },
              { case: { $eq: ["$_id", "FOURTEEN"] }, then: 15 },
            ],
            default: 999,
          },
        },
      },
    },
    {
      $sort: { tierOrder: 1 },
    },
    {
      $project: {
        _id: 0,
        tierOrder: 0,
      },
    },
  ]);

  tickets = tickets.map((ticket) => ({
    ...ticket,
    tier: getWinningTierName(ticket.tier),
    prize: getPrize(ticket.tier, ticketTier),
    totalWinnings: getTotalWinnings(
      ticket.totalTickets,
      ticket.tier,
      ticketPool,
      ticketTier
    ),
  }));

  // Other tier ticket
  for (let i = tickets.length; i <= 15; i++) {
    tickets.push({
      tier: `Tier ${i}`,
      prize: "-",
      totalTickets: "-",
      totalWinnings: "-",
    });
  }

  const pacoWon = await Ticket.aggregate([
    {
      $match: { tier: { $ne: "ZERO" }, round: { $lt: round } },
    },
    {
      $group: {
        _id: null,
        totalPacoWon: {
          $sum: {
            $convert: {
              input: "$reward",
              to: "decimal",
              onError: 0,
              onNull: 0,
            },
          },
        },
      },
    },
    {
      $project: {
        totalPacoWon: { $toString: "$totalPacoWon" },
      },
    },
  ]);

  const pacoSpent = await Ticket.aggregate([
    {
      $group: {
        _id: null,
        totalPacoSpent: { $sum: "$price" },
      },
    },
  ]);

  const { totalPacoWon } = pacoWon[0];
  const { totalPacoSpent } = pacoSpent[0];

  const totalStandardTicket = await Ticket.countDocuments({
    type: "STANDARD",
  });

  const totalMegaTicket = await Ticket.countDocuments({
    type: "MEGA",
  });

  return res.status(200).json({
    allTime: tickets,
    stats: {
      totalPacoWon,
      totalPacoSpent,
      totalStandardTicket,
      totalMegaTicket,
    },
  });
});

/**
 * @desc    Get Ticket statistics
 * @route   GET /api/tickets/statistics
 * @access  Public
 */
const getTicketStatistics = catchAsync(async (req, res, next) => {
  const ticketPool = await TicketPool.findOne();
  const ticketSetting = await TicketSettings.findOne();
  const round = ticketSetting.round;

  const minorJackpot = ticketPool ? ticketPool.MINOR_JACKPOT : 0;
  const megaJackpot = ticketPool ? ticketPool.MEGA_JACKPOT : 0;
  const pacoBurnt = ticketPool ? ticketPool.PACO_BURNT : 0;

  // Calculate ticketsInPlay
  const ticketsInPlay = await Ticket.countDocuments({
    round,
  });

  return res.status(200).json({
    minorJackpot,
    megaJackpot,
    pacoBurnt,
    ticketsInPlay,
    round,
  });
});

// Schedule of Transfer ticket reward & other calculated data to ticket pool and Staking pool
const transferDailyTicketToTicketPool = async () => {
  // Get daily tickets
  const ticketSetting = await TicketSettings.findOne();
  const dailyTickets = await DailyTicket.find({ round: ticketSetting.round });
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

  // Update todays round
  ticketSetting.round = ticketSetting.round + 1;
  await ticketSetting.save();
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
  getAllTime,
};
