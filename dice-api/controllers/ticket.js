const { Worker } = require("worker_threads");
const TicketSettings = require("../models/TicketSettings");
const TicketTier = require("../models/TicketTier");
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

function convertNumberString(num) {
  const stringMapping = {
    0: "ZERO",
    1: "ONE",
    2: "TWO",
    3: "THREE",
    4: "FOUR",
    5: "FIVE",
    6: "SIX",
    7: "SEVEN",
    8: "EIGHT",
    9: "NINE",
    10: "TEN",
    11: "ELEVEN",
    12: "TWELVE",
    13: "THIRTEEN",
    14: "FOURTEEN",
  };

  return stringMapping[num];
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

  // Total active ticket
  const activeTicketStats = await DailyTicket.aggregate([
    {
      $match: { account: req.account._id, round },
    },
    {
      $group: {
        _id: null,
        totalStandard: {
          $sum: {
            $convert: {
              input: "$STANDARD",
              to: "decimal",
              onError: 0,
              onNull: 0,
            },
          },
        },
        totalMega: {
          $sum: {
            $convert: {
              input: "$MEGA",
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
        totalStandard: { $toString: "$totalStandard" },
        totalMega: { $toString: "$totalMega" },
      },
    },
  ]);

  // Total allTime ticket
  const allTimeTicketStats = await DailyTicket.aggregate([
    {
      $match: { account: req.account._id },
    },
    {
      $group: {
        _id: null,
        totalStandard: {
          $sum: {
            $convert: {
              input: "$STANDARD",
              to: "decimal",
              onError: 0,
              onNull: 0,
            },
          },
        },
        totalMega: {
          $sum: {
            $convert: {
              input: "$MEGA",
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
        totalStandard: { $toString: "$totalStandard" },
        totalMega: { $toString: "$totalMega" },
      },
    },
  ]);

  // active
  let active;
  let activeTicket;
  let activeTotalStandardTicket = 0;
  let activeTotalMegaTicket = 0;

  if (activeTicketStats.length === 0) {
    active = {
      standard: 0,
      mega: 0,
    };
  } else {
    activeTicket = activeTicketStats[0];
    activeTotalStandardTicket = activeTicket.totalStandard;
    activeTotalMegaTicket = activeTicket.totalMega;

    active = {
      standard: activeTotalStandardTicket,
      mega: activeTotalMegaTicket,
    };
  }

  // allTime
  let allTime;
  let allTimeTicket;
  let allTimeTotalStandardTicket = 0;
  let allTimeTotalMegaTicket = 0;

  if (allTimeTicketStats.length === 0) {
    allTime = {
      standard: 0,
      mega: 0,
    };
  } else {
    allTimeTicket = allTimeTicketStats[0];
    allTimeTotalStandardTicket = allTimeTicket.totalStandard;
    allTimeTotalMegaTicket = allTimeTicket.totalMega;

    allTime = {
      standard: allTimeTotalStandardTicket,
      mega: allTimeTotalMegaTicket,
    };
  }

  const totalPacoSpentForStandard = decimal.multiply(
    allTimeTotalStandardTicket,
    ticketSetting.STANDARD
  );
  const totalPacoSpentForMega = decimal.multiply(
    allTimeTotalMegaTicket,
    ticketSetting.MEGA
  );

  const totalPacoSpent = decimal.addition(
    totalPacoSpentForStandard,
    totalPacoSpentForMega
  );

  res.status(200).json({
    active,
    allTime,
    totalPacoSpent: totalPacoSpent,
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
 * @route   GET /api/tickets/my-histories?round=1&type=winning
 * @query   round number
 * @query   type = loosing, winning
 * @access  Private
 */
const getMyHistories = catchAsync(async (req, res, next) => {
  const round = Number(req.query.round || 1);
  const type = req.query.type;

  // winning bets
  if (type === "winning") {
    const ticketTier = await TicketTier.findOne();
    const ticketPool = await TicketPool.findOne();

    const dailyTicketStats = await DailyTicket.aggregate([
      {
        $match: { account: req.account._id, round },
      },
      {
        $project: {
          ONE: {
            $sum: {
              $convert: {
                input: "$TIER_ONE",
                to: "decimal",
                onError: 0,
                onNull: 0,
              },
            },
          },
          TWO: {
            $sum: {
              $convert: {
                input: "$TIER_TWO",
                to: "decimal",
                onError: 0,
                onNull: 0,
              },
            },
          },
          THREE: {
            $sum: {
              $convert: {
                input: "$TIER_THREE",
                to: "decimal",
                onError: 0,
                onNull: 0,
              },
            },
          },
          FOUR: {
            $sum: {
              $convert: {
                input: "$TIER_FOUR",
                to: "decimal",
                onError: 0,
                onNull: 0,
              },
            },
          },
          FIVE: {
            $sum: {
              $convert: {
                input: "$TIER_FIVE",
                to: "decimal",
                onError: 0,
                onNull: 0,
              },
            },
          },
          SIX: {
            $sum: {
              $convert: {
                input: "$TIER_SIX",
                to: "decimal",
                onError: 0,
                onNull: 0,
              },
            },
          },
          SEVEN: {
            $sum: {
              $convert: {
                input: "$TIER_SEVEN",
                to: "decimal",
                onError: 0,
                onNull: 0,
              },
            },
          },
          EIGHT: {
            $sum: {
              $convert: {
                input: "$TIER_EIGHT",
                to: "decimal",
                onError: 0,
                onNull: 0,
              },
            },
          },
          NINE: {
            $sum: {
              $convert: {
                input: "$TIER_NINE",
                to: "decimal",
                onError: 0,
                onNull: 0,
              },
            },
          },
          TEN: {
            $sum: {
              $convert: {
                input: "$TIER_TEN",
                to: "decimal",
                onError: 0,
                onNull: 0,
              },
            },
          },
          ELEVEN: {
            $sum: {
              $convert: {
                input: "$TIER_ELEVEN",
                to: "decimal",
                onError: 0,
                onNull: 0,
              },
            },
          },
          TWELVE: {
            $sum: {
              $convert: {
                input: "$TIER_TWELVE",
                to: "decimal",
                onError: 0,
                onNull: 0,
              },
            },
          },
          THIRTEEN: {
            $sum: {
              $convert: {
                input: "$TIER_THIRTEEN",
                to: "decimal",
                onError: 0,
                onNull: 0,
              },
            },
          },
          FOURTEEN: {
            $sum: {
              $convert: {
                input: "$TIER_FOURTEEN",
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
          ONE: { $toString: "$ONE" },
          TWO: { $toString: "$TWO" },
          THREE: { $toString: "$THREE" },
          FOUR: { $toString: "$FOUR" },
          FIVE: { $toString: "$FIVE" },
          SIX: { $toString: "$SIX" },
          SEVEN: { $toString: "$SEVEN" },
          EIGHT: { $toString: "$EIGHT" },
          NINE: { $toString: "$NINE" },
          TEN: { $toString: "$TEN" },
          ELEVEN: { $toString: "$ELEVEN" },
          TWELVE: { $toString: "$TWELVE" },
          THIRTEEN: { $toString: "$THIRTEEN" },
          FOURTEEN: { $toString: "$FOURTEEN" },
        },
      },
    ]);

    if (dailyTicketStats.length === 0) {
      return res.status(200).json({ histories: [] });
    }

    // Prepare for response data
    const ticket = dailyTicketStats[0];
    const data = [];

    for (let i = 1; i <= 14; i++) {
      data.push({
        tier: getWinningTierName(convertNumberString(i)),
        prize: getPrize(convertNumberString(i), ticketTier),
        round,
        winningTickets: ticket[convertNumberString(i)],
        totalWinnings: getTotalWinnings(
          ticket[convertNumberString(i)],
          convertNumberString(i),
          ticketPool,
          ticketTier
        ),
      });
    }

    return res.status(200).json({ histories: data });
  }

  // Loosing bets
  if (type === "loosing") {
    const query = {
      account: req.account._id,
      round,
      tier: { $eq: "ZERO" },
    };

    const ticketSetting = await TicketSettings.findOne();

    const dailyTicketStats = await DailyTicket.aggregate([
      {
        $match: { account: req.account._id, round },
      },
      {
        $project: {
          STANDARD_LOOSING: {
            $sum: {
              $convert: {
                input: "$STANDARD_LOOSING",
                to: "decimal",
                onError: 0,
                onNull: 0,
              },
            },
          },
          MEGA_LOOSING: {
            $sum: {
              $convert: {
                input: "$MEGA_LOOSING",
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
          STANDARD_LOOSING: { $toString: "$STANDARD_LOOSING" },
          MEGA_LOOSING: { $toString: "$MEGA_LOOSING" },
        },
      },
    ]);

    if (dailyTicketStats.length === 0) {
      return res.status(200).json({ histories: [] });
    }

    const ticket = dailyTicketStats[0];

    const data = [
      {
        ticketType: "STANDARD",
        loosingTickets: ticket.STANDARD_LOOSING,
        round: `Round ${round}`,
        totalPacoSpent: decimal.multiply(
          ticket.STANDARD_LOOSING,
          ticketSetting["STANDARD"]
        ),
      },
      {
        ticketType: "MEGA",
        loosingTickets: ticket.MEGA_LOOSING,
        round: `Round ${round}`,
        totalPacoSpent: decimal.multiply(
          ticket.MEGA_LOOSING,
          ticketSetting["MEGA"]
        ),
      },
    ];

    // let tickets = await Ticket.aggregate([
    //   {
    //     $match: query,
    //   },
    //   {
    //     $group: {
    //       _id: "$type",
    //       loosingTickets: { $sum: 1 },
    //       round: { $first: "$round" },
    //     },
    //   },
    //   {
    //     $project: {
    //       _id: 1,
    //       ticketType: { $toUpper: "$_id" },
    //       loosingTickets: 1,
    //       round: { $concat: ["Round ", { $toString: "$round" }] },
    //       typeOrder: {
    //         $switch: {
    //           branches: [
    //             { case: { $eq: ["$_id", "STANDARD"] }, then: 1 },
    //             { case: { $eq: ["$_id", "MEGA"] }, then: 2 },
    //           ],
    //           default: 999,
    //         },
    //       },
    //     },
    //   },
    //   {
    //     $sort: { typeOrder: 1 },
    //   },
    //   {
    //     $project: {
    //       _id: 0,
    //       typeOrder: 0,
    //     },
    //   },
    // ]);

    // tickets = tickets.map((ticket) => ({
    //   ...ticket,
    //   totalPacoSpent: decimal.multiply(
    //     ticket.loosingTickets,
    //     ticketSetting[ticket.ticketType]
    //   ),
    // }));

    return res.status(200).json({ histories: data });
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

  const dailyTicketStats = await DailyTicket.aggregate([
    {
      $match: query,
    },
    {
      $group: {
        _id: null,
        ZERO: {
          $sum: {
            $convert: {
              input: "$TIER_ZERO",
              to: "decimal",
              onError: 0,
              onNull: 0,
            },
          },
        },
        ONE: {
          $sum: {
            $convert: {
              input: "$TIER_ONE",
              to: "decimal",
              onError: 0,
              onNull: 0,
            },
          },
        },
        TWO: {
          $sum: {
            $convert: {
              input: "$TIER_TWO",
              to: "decimal",
              onError: 0,
              onNull: 0,
            },
          },
        },
        THREE: {
          $sum: {
            $convert: {
              input: "$TIER_THREE",
              to: "decimal",
              onError: 0,
              onNull: 0,
            },
          },
        },
        FOUR: {
          $sum: {
            $convert: {
              input: "$TIER_FOUR",
              to: "decimal",
              onError: 0,
              onNull: 0,
            },
          },
        },
        FIVE: {
          $sum: {
            $convert: {
              input: "$TIER_FIVE",
              to: "decimal",
              onError: 0,
              onNull: 0,
            },
          },
        },
        SIX: {
          $sum: {
            $convert: {
              input: "$TIER_SIX",
              to: "decimal",
              onError: 0,
              onNull: 0,
            },
          },
        },
        SEVEN: {
          $sum: {
            $convert: {
              input: "$TIER_SEVEN",
              to: "decimal",
              onError: 0,
              onNull: 0,
            },
          },
        },
        EIGHT: {
          $sum: {
            $convert: {
              input: "$TIER_EIGHT",
              to: "decimal",
              onError: 0,
              onNull: 0,
            },
          },
        },
        NINE: {
          $sum: {
            $convert: {
              input: "$TIER_NINE",
              to: "decimal",
              onError: 0,
              onNull: 0,
            },
          },
        },
        TEN: {
          $sum: {
            $convert: {
              input: "$TIER_TEN",
              to: "decimal",
              onError: 0,
              onNull: 0,
            },
          },
        },
        ELEVEN: {
          $sum: {
            $convert: {
              input: "$TIER_ELEVEN",
              to: "decimal",
              onError: 0,
              onNull: 0,
            },
          },
        },
        TWELVE: {
          $sum: {
            $convert: {
              input: "$TIER_TWELVE",
              to: "decimal",
              onError: 0,
              onNull: 0,
            },
          },
        },
        THIRTEEN: {
          $sum: {
            $convert: {
              input: "$TIER_THIRTEEN",
              to: "decimal",
              onError: 0,
              onNull: 0,
            },
          },
        },
        FOURTEEN: {
          $sum: {
            $convert: {
              input: "$TIER_FOURTEEN",
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
        ZERO: { $toString: "$ZERO" },
        ONE: { $toString: "$ONE" },
        TWO: { $toString: "$TWO" },
        THREE: { $toString: "$THREE" },
        FOUR: { $toString: "$FOUR" },
        FIVE: { $toString: "$FIVE" },
        SIX: { $toString: "$SIX" },
        SEVEN: { $toString: "$SEVEN" },
        EIGHT: { $toString: "$EIGHT" },
        NINE: { $toString: "$NINE" },
        TEN: { $toString: "$TEN" },
        ELEVEN: { $toString: "$ELEVEN" },
        TWELVE: { $toString: "$TWELVE" },
        THIRTEEN: { $toString: "$THIRTEEN" },
        FOURTEEN: { $toString: "$FOURTEEN" },
      },
    },
  ]);

  if (dailyTicketStats.length === 0) {
    return res.status(200).json({ allBets: [] });
  }

  // Prepare for response data
  const ticket = dailyTicketStats[0];
  const data = [];

  for (let i = 0; i <= 14; i++) {
    data.push({
      tier: getWinningTierName(convertNumberString(i)),
      prize: getPrize(convertNumberString(i), ticketTier),
      round,
      winningTickets: ticket[convertNumberString(i)],
      totalWinnings: getTotalWinnings(
        ticket[convertNumberString(i)],
        convertNumberString(i),
        ticketPool,
        ticketTier
      ),
    });
  }

  return res.status(200).json({ allBets: data });
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

  const dailyTicketStats = await DailyTicket.aggregate([
    {
      $match: { round: { $lt: round } },
    },
    {
      $group: {
        _id: null,
        ZERO: {
          $sum: {
            $convert: {
              input: "$TIER_ZERO",
              to: "decimal",
              onError: 0,
              onNull: 0,
            },
          },
        },
        ONE: {
          $sum: {
            $convert: {
              input: "$TIER_ONE",
              to: "decimal",
              onError: 0,
              onNull: 0,
            },
          },
        },
        TWO: {
          $sum: {
            $convert: {
              input: "$TIER_TWO",
              to: "decimal",
              onError: 0,
              onNull: 0,
            },
          },
        },
        THREE: {
          $sum: {
            $convert: {
              input: "$TIER_THREE",
              to: "decimal",
              onError: 0,
              onNull: 0,
            },
          },
        },
        FOUR: {
          $sum: {
            $convert: {
              input: "$TIER_FOUR",
              to: "decimal",
              onError: 0,
              onNull: 0,
            },
          },
        },
        FIVE: {
          $sum: {
            $convert: {
              input: "$TIER_FIVE",
              to: "decimal",
              onError: 0,
              onNull: 0,
            },
          },
        },
        SIX: {
          $sum: {
            $convert: {
              input: "$TIER_SIX",
              to: "decimal",
              onError: 0,
              onNull: 0,
            },
          },
        },
        SEVEN: {
          $sum: {
            $convert: {
              input: "$TIER_SEVEN",
              to: "decimal",
              onError: 0,
              onNull: 0,
            },
          },
        },
        EIGHT: {
          $sum: {
            $convert: {
              input: "$TIER_EIGHT",
              to: "decimal",
              onError: 0,
              onNull: 0,
            },
          },
        },
        NINE: {
          $sum: {
            $convert: {
              input: "$TIER_NINE",
              to: "decimal",
              onError: 0,
              onNull: 0,
            },
          },
        },
        TEN: {
          $sum: {
            $convert: {
              input: "$TIER_TEN",
              to: "decimal",
              onError: 0,
              onNull: 0,
            },
          },
        },
        ELEVEN: {
          $sum: {
            $convert: {
              input: "$TIER_ELEVEN",
              to: "decimal",
              onError: 0,
              onNull: 0,
            },
          },
        },
        TWELVE: {
          $sum: {
            $convert: {
              input: "$TIER_TWELVE",
              to: "decimal",
              onError: 0,
              onNull: 0,
            },
          },
        },
        THIRTEEN: {
          $sum: {
            $convert: {
              input: "$TIER_THIRTEEN",
              to: "decimal",
              onError: 0,
              onNull: 0,
            },
          },
        },
        FOURTEEN: {
          $sum: {
            $convert: {
              input: "$TIER_FOURTEEN",
              to: "decimal",
              onError: 0,
              onNull: 0,
            },
          },
        },
        REWARD: {
          $sum: {
            $convert: {
              input: "$REWARD",
              to: "decimal",
              onError: 0,
              onNull: 0,
            },
          },
        },
        PACO_SPENT: {
          $sum: {
            $convert: {
              input: "$PACO_SPENT",
              to: "decimal",
              onError: 0,
              onNull: 0,
            },
          },
        },
        STANDARD: {
          $sum: {
            $convert: {
              input: "$STANDARD",
              to: "decimal",
              onError: 0,
              onNull: 0,
            },
          },
        },
        MEGA: {
          $sum: {
            $convert: {
              input: "$MEGA",
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
        ZERO: { $toString: "$ZERO" },
        ONE: { $toString: "$ONE" },
        TWO: { $toString: "$TWO" },
        THREE: { $toString: "$THREE" },
        FOUR: { $toString: "$FOUR" },
        FIVE: { $toString: "$FIVE" },
        SIX: { $toString: "$SIX" },
        SEVEN: { $toString: "$SEVEN" },
        EIGHT: { $toString: "$EIGHT" },
        NINE: { $toString: "$NINE" },
        TEN: { $toString: "$TEN" },
        ELEVEN: { $toString: "$ELEVEN" },
        TWELVE: { $toString: "$TWELVE" },
        THIRTEEN: { $toString: "$THIRTEEN" },
        FOURTEEN: { $toString: "$FOURTEEN" },
        REWARD: { $toString: "$REWARD" },
        PACO_SPENT: { $toString: "$PACO_SPENT" },
        STANDARD: { $toString: "$STANDARD" },
        MEGA: { $toString: "$MEGA" },
      },
    },
  ]);

  if (dailyTicketStats.length === 0) {
    return res.status(200).json({
      allTime: [],
      stats: {
        totalPacoWon: 0,
        totalPacoSpent: 0,
        totalStandardTicket: 0,
        totalMegaTicket: 0,
      },
    });
  }

  // Prepare for response data
  const ticket = dailyTicketStats[0];
  const data = [];

  for (let i = 0; i <= 14; i++) {
    data.push({
      tier: getWinningTierName(convertNumberString(i)),
      prize: getPrize(convertNumberString(i), ticketTier),
      totalTickets: ticket[convertNumberString(i)],
      totalWinnings: getTotalWinnings(
        ticket[convertNumberString(i)],
        convertNumberString(i),
        ticketPool,
        ticketTier
      ),
    });
  }

  const totalPacoWon = ticket.REWARD;

  // Calculate for totalPacoSpent include todays round
  const pacoSpentStats = await DailyTicket.aggregate([
    {
      $match: { round: { $lte: round } },
    },
    {
      $group: {
        _id: null,
        PACO_SPENT: {
          $sum: {
            $convert: {
              input: "$PACO_SPENT",
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
        PACO_SPENT: { $toString: "$PACO_SPENT" },
      },
    },
  ]);

  let totalPacoSpent;
  if (pacoSpentStats.length === 0) {
    totalPacoSpent = 0;
  } else {
    totalPacoSpent = pacoSpentStats[0].PACO_SPENT;
  }

  const totalStandardTicket = ticket.STANDARD;
  const totalMegaTicket = ticket.MEGA;

  return res.status(200).json({
    allTime: data,
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
  const stats = await DailyTicket.aggregate([
    {
      $match: { round },
    },
    {
      $group: {
        _id: null,
        ZERO: {
          $sum: {
            $convert: {
              input: "$TIER_ZERO",
              to: "decimal",
              onError: 0,
              onNull: 0,
            },
          },
        },
        ONE: {
          $sum: {
            $convert: {
              input: "$TIER_ONE",
              to: "decimal",
              onError: 0,
              onNull: 0,
            },
          },
        },
        TWO: {
          $sum: {
            $convert: {
              input: "$TIER_TWO",
              to: "decimal",
              onError: 0,
              onNull: 0,
            },
          },
        },
        THREE: {
          $sum: {
            $convert: {
              input: "$TIER_THREE",
              to: "decimal",
              onError: 0,
              onNull: 0,
            },
          },
        },
        FOUR: {
          $sum: {
            $convert: {
              input: "$TIER_FOUR",
              to: "decimal",
              onError: 0,
              onNull: 0,
            },
          },
        },
        FIVE: {
          $sum: {
            $convert: {
              input: "$TIER_FIVE",
              to: "decimal",
              onError: 0,
              onNull: 0,
            },
          },
        },
        SIX: {
          $sum: {
            $convert: {
              input: "$TIER_SIX",
              to: "decimal",
              onError: 0,
              onNull: 0,
            },
          },
        },
        SEVEN: {
          $sum: {
            $convert: {
              input: "$TIER_SEVEN",
              to: "decimal",
              onError: 0,
              onNull: 0,
            },
          },
        },
        EIGHT: {
          $sum: {
            $convert: {
              input: "$TIER_EIGHT",
              to: "decimal",
              onError: 0,
              onNull: 0,
            },
          },
        },
        NINE: {
          $sum: {
            $convert: {
              input: "$TIER_NINE",
              to: "decimal",
              onError: 0,
              onNull: 0,
            },
          },
        },
        TEN: {
          $sum: {
            $convert: {
              input: "$TIER_TEN",
              to: "decimal",
              onError: 0,
              onNull: 0,
            },
          },
        },
        ELEVEN: {
          $sum: {
            $convert: {
              input: "$TIER_ELEVEN",
              to: "decimal",
              onError: 0,
              onNull: 0,
            },
          },
        },
        TWELVE: {
          $sum: {
            $convert: {
              input: "$TIER_TWELVE",
              to: "decimal",
              onError: 0,
              onNull: 0,
            },
          },
        },
        THIRTEEN: {
          $sum: {
            $convert: {
              input: "$TIER_THIRTEEN",
              to: "decimal",
              onError: 0,
              onNull: 0,
            },
          },
        },
        FOURTEEN: {
          $sum: {
            $convert: {
              input: "$TIER_FOURTEEN",
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
        ZERO: { $toString: "$ZERO" },
        ONE: { $toString: "$ONE" },
        TWO: { $toString: "$TWO" },
        THREE: { $toString: "$THREE" },
        FOUR: { $toString: "$FOUR" },
        FIVE: { $toString: "$FIVE" },
        SIX: { $toString: "$SIX" },
        SEVEN: { $toString: "$SEVEN" },
        EIGHT: { $toString: "$EIGHT" },
        NINE: { $toString: "$NINE" },
        TEN: { $toString: "$TEN" },
        ELEVEN: { $toString: "$ELEVEN" },
        TWELVE: { $toString: "$TWELVE" },
        THIRTEEN: { $toString: "$THIRTEEN" },
        FOURTEEN: { $toString: "$FOURTEEN" },
      },
    },
  ]);

  if (stats.length === 0) {
    return res.status(200).json({
      minorJackpot: 0,
      megaJackpot: 0,
      pacoBurnt: 0,
      ticketsInPlay: 0,
      round,
    });
  }

  const ticketStats = stats[0];
  const ticketsInPlay = decimal.addition(
    ticketStats.ZERO,
    ticketStats.ONE,
    ticketStats.TWO,
    ticketStats.THREE,
    ticketStats.FOUR,
    ticketStats.FIVE,
    ticketStats.SIX,
    ticketStats.SEVEN,
    ticketStats.EIGHT,
    ticketStats.NINE,
    ticketStats.TEN,
    ticketStats.ELEVEN,
    ticketStats.TWELVE,
    ticketStats.THIRTEEN,
    ticketStats.FOURTEEN
  );

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
