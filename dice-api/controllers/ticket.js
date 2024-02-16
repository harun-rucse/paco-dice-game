const TicketSettings = require("../models/TicketSettings");
const TicketTier = require("../models/TicketTier");
const Ticket = require("../models/Ticket");
const Account = require("../models/Account");
const DailyTicket = require("../models/DailyTicket");
const AppError = require("../utils/app-error");
const catchAsync = require("../utils/catch-async");
const decimal = require("../utils/decimal");

function getRandomString(min, max) {
  var strings = ["ONE", "TWO", "THREE", "FOUR", "FIVE"];
  var randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
  return strings[randomNumber - 1];
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
 * @access  Private
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
  const { ONE, TWO, THREE, FOUR, FIVE } = req.body;
  if (!ONE || !TWO || !THREE || !FOUR || !FIVE)
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

    response = await newTicketTier.save();
  } else {
    ticketTier.ONE = ONE;
    ticketTier.TWO = TWO;
    ticketTier.THREE = THREE;
    ticketTier.FOUR = FOUR;
    ticketTier.FIVE = FIVE;

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

  const accountId = req.account._id;
  const price = ticketSetting[type];
  const requiredPaco = amount * price;

  // Check account have sufficient paco balance for buy ticket
  const account = await Account.findById(accountId);
  if (decimal.compare(account.paco, requiredPaco, "lt"))
    return next(new AppError("Insufficient balance for buy ticket", 400));

  // Get the previous date ticket round number
  const prevDayTicket = await Ticket.findOne({ buyAt: { $lt: new Date() } });
  const round = prevDayTicket ? prevDayTicket.round + 1 : 1;

  let rewardAmount = 0;
  let poolAmount = 0;

  await Promise.all(
    Array(amount)
      .fill()
      .map(async () => {
        // Generate random tier for each ticket
        const tier = getRandomString(1, 5);

        const newTicket = new Ticket({
          account: accountId,
          type,
          price,
          tier,
          reward: ticketTier[tier],
          round,
        });

        await newTicket.save();

        // Calculate pool amount
        rewardAmount += newTicket.reward;
        poolAmount +=
          newTicket.reward < newTicket.price
            ? newTicket.price - newTicket.reward
            : 0;
      })
  );

  // Find daily ticket document for this account
  const todayStart = new Date();
  todayStart.setHours(3, 0, 0, 0);

  const tomorrowStart = new Date();
  tomorrowStart.setDate(tomorrowStart.getDate() + 1);
  tomorrowStart.setHours(3, 0, 0, 0);

  // Create daily ticket document for same account in a day [3AM - 3AM]
  const dailyTicket = await DailyTicket.findOne({
    account: accountId,
    date: {
      $gte: todayStart,
      $lt: tomorrowStart,
    },
  });

  if (!dailyTicket) {
    const newDailyTicket = new DailyTicket({
      account: accountId,
      rewardAmount,
      poolAmount,
    });

    await newDailyTicket.save();
  } else {
    dailyTicket.rewardAmount = rewardAmount;
    dailyTicket.poolAmount = poolAmount;

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

  const today = new Date();
  today.setHours(3, 0, 0, 0);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(3, 0, 0, 0);

  const count = await Ticket.countDocuments({
    account: req.account._id,
    round,
  });

  const tickets = await Ticket.aggregate([
    {
      $match: {
        account: req.account._id,
        round,
      },
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
            {
              $and: [
                { $gte: ["$buyAt", today] },
                { $lt: ["$buyAt", tomorrow] },
              ],
            },
            "Waiting Results",
            "Drawn",
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
      },
    },
    {
      $skip: limit * (page - 1),
    },
    {
      $limit: limit,
    },
  ]);

  res.status(200).json({ tickets, count });
});

module.exports = {
  createTicketSetting,
  getTicketSetting,
  createTicketTier,
  getTicketTier,
  createTicket,
  getAllTickets,
  getMyTickets,
};
