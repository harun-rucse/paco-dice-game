const { Worker } = require("worker_threads");
const Faucet = require("../models/Faucet");
const Account = require("../models/Account");
const Referral = require("../models/Referral");
const catchAsync = require("../utils/catch-async");
const decimal = require("../utils/decimal");
const { FAUCET_COMMISSION } = require("../utils/referral-constants");
const AppError = require("../utils/app-error");

/**
 * @desc    Get my faucet
 * @route   GET /api/faucet/my
 * @access  Private
 */
const getMyFaucet = catchAsync(async (req, res, next) => {
  const myFaucet = await Faucet.findOne({ account: req.account._id });

  res.status(200).json(myFaucet);
});

/**
 * @desc    Claim my faucet reward
 * @route   POST /api/faucet/claim-reward
 * @access  Private
 */
const claimFaucetReward = catchAsync(async (req, res, next) => {
  const { reward } = req.body;

  const account = await Account.findById(req.account._id);
  account.paco = decimal.addition(account.paco, reward);

  const faucet = await Faucet.findOne({ account: req.account._id });
  faucet.lastClaimedDate = new Date();
  faucet.totalClaimedAmount = decimal.addition(
    faucet.totalClaimedAmount,
    reward
  );
  faucet.totalWagerAmount = decimal.addition(faucet.totalWagerAmount, reward);
  await faucet.save();

  // Add claim reward to the referral
  const faucetReferral = await Referral.findOne({
    account: req.account._id,
    type: "faucet",
  });

  if (faucetReferral) {
    const bonus = decimal.multiply(reward, FAUCET_COMMISSION);
    faucetReferral["paco"] = decimal.addition(faucetReferral["paco"], bonus);
    await faucetReferral.save();
  }

  // if reward === 125 create standard ticket
  if (
    reward == 125 ||
    reward == 250 ||
    reward == 500 ||
    reward == 1000 ||
    reward == 2000
  ) {
    const worker = new Worker("./workers/create-tickets.js", {
      workerData: {
        reqBody: { type: "STANDARD", amount: 1, isTicketReward: true },
        accountId: req.account._id?.toString(),
      },
    });

    worker.on("message", async (message) => {
      console.log("Ticket reward successfully");
    });

    worker.on("error", (error) => {
      next(error);
    });
  }

  if (reward == 500 || reward == 1000 || reward == 2000) {
    const worker = new Worker("./workers/create-tickets.js", {
      workerData: {
        reqBody: { type: "MEGA", amount: 1, isTicketReward: true },
        accountId: req.account._id?.toString(),
      },
    });

    worker.on("message", async (message) => {
      console.log("Ticket reward successfully");
    });

    worker.on("error", (error) => {
      next(error);
    });
  }

  await account.save();

  res.status(200).json({ success: true });
});

/**
 * @desc    Gamble reward
 * @route   POST /api/faucet/gamble-reward
 * @access  Private
 */
const gambleReward = catchAsync(async (req, res, next) => {
  const { reward } = req.body;

  let randomNumber = Math.floor(Math.random() * 100);
  const status = randomNumber < 50 ? "lost" : "won";
  // const status = "won";

  const faucet = await Faucet.findOne({ account: req.account._id });
  if (faucet.lastMultiplier == "1048576")
    return res
      .status(400)
      .json({ status, message: "Already in Final multiplier!" });

  if (faucet.lastMultiplier === "1") {
    faucet.lastClaimedDate = new Date();
    faucet.initialGambleAmount = reward;
  }

  faucet.totalWagerAmount = decimal.addition(faucet.totalWagerAmount, reward);

  if (status === "lost") {
    faucet.availableGambleAmount = "0";
    faucet.lastMultiplier = "1";
    faucet.initialGambleAmount = "0";
  } else {
    faucet.lastMultiplier = decimal.multiply(faucet.lastMultiplier, 2);
    faucet.availableGambleAmount = decimal.multiply(
      faucet.lastMultiplier,
      faucet.initialGambleAmount
    );

    // Add gamble reward to the referral
    const faucetReferral = await Referral.findOne({
      account: req.account._id,
      type: "faucet",
    });

    if (faucetReferral) {
      const bonus = decimal.multiply(reward, 0.00125);
      faucetReferral["paco"] = decimal.addition(faucetReferral["paco"], bonus);
      await faucetReferral.save();
    }
  }

  await faucet.save();

  res.status(200).json({ status });
});

/**
 * @desc    Get faucet tournament prize
 * @route   GET /api/faucet/tournament
 * @access  Public
 */
const getFaucetTournament = catchAsync(async (req, res, next) => {
  const totalPaco = 1000000; // 1M paco
  const distributionPercentages = [
    0.5, 0.25, 0.1, 0.06, 0.03, 0.02, 0.01, 0.01, 0.01, 0.01,
  ];

  const faucets = await Faucet.find().populate("account", "username").exec();

  faucets.sort(
    (a, b) => parseFloat(b.totalWagerAmount) - parseFloat(a.totalWagerAmount)
  );
  const topFaucets = faucets.slice(0, 10);

  const resData = [];

  for (let i = 0; i < topFaucets.length; i++) {
    const prizeAmount = totalPaco * distributionPercentages[i];

    resData.push({ ...topFaucets[i]._doc, reward: prizeAmount });
  }

  res.status(200).json(resData);
});

/**
 * @desc    Collect gamble reward
 * @route   POST /api/faucet/collect-gamble-reward
 * @access  Private
 */
const collectGambleReward = catchAsync(async (req, res, next) => {
  const faucet = await Faucet.findOne({ account: req.account._id });
  if (!faucet) return next(new AppError("No faucet found", 404));

  if (faucet.availableGambleAmount === "0") {
    return next(new AppError("Nothing available to claim!", 400));
  }

  const account = await Account.findById(faucet.account._id);
  // calculate collect amount
  let calAmount = 0;

  while (
    decimal.compare(
      faucet.initialGambleAmount,
      faucet.availableGambleAmount,
      "lt"
    )
  ) {
    calAmount = decimal.addition(calAmount, faucet.availableGambleAmount);
    faucet.availableGambleAmount = decimal.divide(
      faucet.availableGambleAmount,
      2
    );
  }

  account.paco = decimal.addition(account.paco, calAmount);
  await account.save();

  faucet.availableGambleAmount = "0";
  faucet.lastMultiplier = "1";
  faucet.initialGambleAmount = "0";
  await faucet.save();

  res.status(200).json({ success: true });
});

// Schedule of Transfer faucet reward of 1M PACO to 10 users
const transferFaucetPrize = async () => {
  const totalPaco = 1000000; // 1M paco
  const distributionPercentages = [
    0.5, 0.25, 0.1, 0.06, 0.03, 0.02, 0.01, 0.01, 0.01, 0.01,
  ];

  const faucets = await Faucet.aggregate([
    {
      $addFields: {
        totalWagerAmountDouble: { $toDouble: "$totalWagerAmount" },
      },
    },
    {
      $sort: { totalWagerAmountDouble: -1 },
    },
    {
      $limit: 10,
    },
  ]);

  for (let i = 0; i < faucets.length; i++) {
    const prizeAmount = totalPaco * distributionPercentages[i];

    const account = await Account.findById(faucets[i].account);
    account.paco = decimal.addition(account.paco, prizeAmount);
    await account.save();
  }

  // Reset totalWagerAmount for all faucet users
  await Faucet.updateMany({}, { $set: { totalWagerAmount: "0" } });
};

module.exports = {
  getMyFaucet,
  claimFaucetReward,
  gambleReward,
  getFaucetTournament,
  transferFaucetPrize,
  collectGambleReward,
};
