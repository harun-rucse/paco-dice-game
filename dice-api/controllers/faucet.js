const { Worker } = require("worker_threads");
const Faucet = require("../models/Faucet");
const Account = require("../models/Account");
const catchAsync = require("../utils/catch-async");
const decimal = require("../utils/decimal");
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

  // if reward === 125 create standard ticket
  if (reward >= 125) {
    const worker = new Worker("./workers/create-tickets.js", {
      workerData: {
        reqBody: { type: "STANDARD", amount: 1 },
        accountId: req.account._id?.toString(),
      },
    });

    worker.on("message", (message) => {
      account.paco = decimal.addition(account.paco, 100);
    });

    worker.on("error", (error) => {
      next(error);
    });
  }

  if (reward >= 500) {
    const worker = new Worker("./workers/create-tickets.js", {
      workerData: {
        reqBody: { type: "MEGA", amount: 1 },
        accountId: req.account._id?.toString(),
      },
    });

    worker.on("message", (message) => {
      account.paco = decimal.addition(account.paco, 200);
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

  const faucet = await Faucet.findOne({ account: req.account._id });
  if (faucet.lastMultiplier === "1") {
    faucet.totalWagerAmount = decimal.addition(faucet.totalWagerAmount, reward);
  }

  const account = await Account.findById(req.account._id);

  if (faucet.lastMultiplier == "1048576") {
    const totalReward = decimal.multiply(faucet.lastMultiplier, reward);
    account.paco = decimal.addition(account.paco, totalReward);
    await account.save();

    faucet.lastMultiplier = "1";
    faucet.lastClaimedDate = new Date();
    await faucet.save();

    return res.status(200).json({ status: "claimed" });
  }

  if (status === "lost") {
    const totalReward = decimal.multiply(faucet.lastMultiplier, reward);
    account.paco = decimal.addition(account.paco, totalReward);
    await account.save();

    faucet.lastMultiplier = "1";
    faucet.lastClaimedDate = new Date();
  } else {
    faucet.lastMultiplier = decimal.multiply(faucet.lastMultiplier, 2);
  }

  await faucet.save();

  res.status(200).json({ status });
});

/**
 * @desc    Get faucet tournament prize
 * @route   POST /api/faucet/tournament
 * @access  Public
 */
const getFaucetTournament = catchAsync(async (req, res, next) => {
  const totalPaco = 1000000; // 1M paco
  const distributionPercentages = [
    0.5, 0.25, 0.1, 0.06, 0.03, 0.02, 0.01, 0.01, 0.01, 0.01,
  ];

  const faucets = await Faucet.find()
    .populate("account", "username")
    .sort({ totalWagerAmount: -1 })
    .limit(10);

  const resData = [];

  for (let i = 0; i < faucets.length; i++) {
    const prizeAmount = totalPaco * distributionPercentages[i];

    resData.push({ ...faucets[i]._doc, reward: prizeAmount });
  }

  res.status(200).json(resData);
});

// Schedule of Transfer faucet reward of 1M PACO to 10 users
const transferFaucetPrize = async () => {
  const totalPaco = 1000000; // 1M paco
  const distributionPercentages = [
    0.5, 0.25, 0.1, 0.06, 0.03, 0.02, 0.01, 0.01, 0.01, 0.01,
  ];

  const faucets = await Faucet.find().sort({ totalWagerAmount: -1 }).limit(10);

  for (let i = 0; i < faucets.length; i++) {
    const prizeAmount = totalPaco * distributionPercentages[i];

    const account = await Account.findById(faucets[i].account);
    account.paco = decimal.addition(account.paco, prizeAmount);
    await account.save();
  }
};

module.exports = {
  getMyFaucet,
  claimFaucetReward,
  gambleReward,
  getFaucetTournament,
  transferFaucetPrize,
};
