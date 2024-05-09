const Account = require("../models/Account");
const Stake = require("../models/Stake");
const StakeHistory = require("../models/StakeHistory");
const StakePool = require("../models/StakePool");
const getCoinPrice = require("../services/token-price-service");
const AppError = require("../utils/app-error");
const catchAsync = require("../utils/catch-async");
const decimal = require("../utils/decimal");

const _calcStakePercentage = (amount, totalAmount) => {
  return decimal.divide(decimal.multiply(100, amount), totalAmount);
};

const _calcStakeReward = (amount, stakePercentage) => {
  return amount <= 0
    ? 0
    : decimal.multiply(
        decimal.multiply(amount, 0.01),
        decimal.divide(stakePercentage, 100)
      );
};

/**
 * @desc    Create new stake
 * @route   POST /api/stakes
 * @access  Private
 */
const createStake = catchAsync(async (req, res, next) => {
  const amount = req.body.amount;
  if (!amount) return next(new AppError("Amount is required", 400));

  // Check user account has enough balance for stake
  if (decimal.compare(req.account.paco, amount, "lt"))
    return next(new AppError("Insufficient balance for stake", 400));

  const stake = await Stake.findOne({ account: req.account._id });

  if (!stake) {
    const newStake = new Stake();
    newStake.account = req.account._id;
    newStake.amount = amount;
    newStake.tokenName = "paco";

    await newStake.save();
  } else {
    stake.amount = decimal.addition(stake.amount, amount);
    await stake.save();
  }

  // Save stake history
  const stakeHistory = new StakeHistory();
  stakeHistory.account = req.account._id;
  stakeHistory.amount = amount;
  stakeHistory.tokenName = "paco";

  await stakeHistory.save();

  // Reduce paco amount from account
  const account = await Account.findById(req.account._id);
  account.paco = decimal.subtract(account.paco, amount);
  await account.save();

  res.status(200).json({ message: "Stake successful" });
});

/**
 * @desc    Get user stake payouts
 * @route   GET /api/stakes/payouts
 * @access  Private
 */
const getMyStakePayouts = catchAsync(async (req, res, next) => {
  const stake = await Stake.findOne({ account: req.account._id });

  res.status(200).json(stake);
});

/**
 * @desc    Get stake pool
 * @route   GET /api/stakes/pool
 * @access  Private
 */
const getStakePool = catchAsync(async (req, res, next) => {
  const stakePool = await StakePool.findOne();
  const result = await Stake.aggregate([
    {
      $group: {
        _id: null,
        totalAmount: {
          $sum: {
            $convert: {
              input: "$amount",
              to: "decimal",
              onError: 0,
              onNull: 0,
            },
          },
        },
      },
    },
  ]);

  const totalAmount = Number(result?.[0]?.totalAmount) || 0;

  res.status(200).json({ ...stakePool?._doc, totalStakePaco: totalAmount });
});

/**
 * @desc    Get stake calculator
 * @route   GET /api/stakes/calculator/?paco=0
 * @access  Private
 */
const getStakeCalculator = catchAsync(async (req, res, next) => {
  const paco = req.query.paco;
  if (!paco) return next(new AppError("Paco amount is required!", 400));

  const result = await Stake.aggregate([
    {
      $group: {
        _id: null,
        totalAmount: {
          $sum: {
            $convert: {
              input: "$amount",
              to: "decimal",
              onError: 0,
              onNull: 0,
            },
          },
        },
      },
    },
  ]);

  const totalAmount = Number(result?.[0]?.totalAmount) || 0;

  const stakePool = await StakePool.findOne();

  const stakePercentage = _calcStakePercentage(
    paco,
    decimal.addition(totalAmount, paco)
  );

  // Calculate paco reward from pool for this stake holder
  const rewardPaco = _calcStakeReward(stakePool.paco, stakePercentage);

  // Calculate btc reward from pool for this stake holder
  const rewardBtc = _calcStakeReward(stakePool.btc, stakePercentage);

  // Calculate eth reward from pool for this stake holder
  const rewardEth = _calcStakeReward(stakePool.eth, stakePercentage);

  // Calculate bnb reward from pool for this stake holder
  const rewardBnb = _calcStakeReward(stakePool.bnb, stakePercentage);

  // Calculate usdt reward from pool for this stake holder
  const rewardUsdt = _calcStakeReward(stakePool.usdt, stakePercentage);

  res
    .status(200)
    .json({ rewardPaco, rewardBtc, rewardEth, rewardBnb, rewardUsdt });
});

/**
 * @desc    Claim my staking reward
 * @route   POST /api/stakes/claim
 * @access  Private
 */
const claimMyStakeReward = catchAsync(async (req, res, next) => {
  const stake = await Stake.findOne({ account: req.account._id });
  if (!stake) return next(new AppError("You have no stake yet", 404));

  const account = await Account.findById(req.account._id);
  if (!account) return next(new AppError("Account not found", 404));

  // If total reward is 0 then return error
  if (
    decimal.compare(stake.paco, "0", "eq") &&
    decimal.compare(stake.btc, "0", "eq") &&
    decimal.compare(stake.eth, "0", "eq") &&
    decimal.compare(stake.bnb, "0", "eq") &&
    decimal.compare(stake.usdt, "0", "eq")
  )
    return next(new AppError("You have no reward to claim", 400));

  // Add stake reward to account
  account.paco = decimal.addition(account.paco, stake.paco);
  account.btc = decimal.addition(account.btc, stake.btc);
  account.eth = decimal.addition(account.eth, stake.eth);
  account.bnb = decimal.addition(account.bnb, stake.bnb);
  account.usdt = decimal.addition(account.usdt, stake.usdt);
  await account.save();

  // Reset stake reward
  stake.paco = "0";
  stake.btc = "0";
  stake.eth = "0";
  stake.bnb = "0";
  stake.usdt = "0";
  await stake.save();

  res.status(200).json({ message: "Stake reward claim successful" });
});

/**
 * @desc    Un-stake
 * @route   POST /api/stakes/unstake
 * @access  Private
 */
const unStake = catchAsync(async (req, res, next) => {
  const { amount } = req.body;
  if (!amount) return next(new AppError("Amount is required", 400));

  const stake = await Stake.findOne({ account: req.account._id });
  if (!stake) return next(new AppError("You have no stake yet", 404));

  // Check user account has enough balance for un-stake
  if (decimal.compare(stake.amount, amount, "lt"))
    return next(new AppError("Insufficient balance for un-stake", 400));

  // Add stake amount to account
  const account = await Account.findById(req.account._id);
  account.paco = decimal.addition(account.paco, amount);
  await account.save();

  // Reduce stake amount from stake
  stake.amount = decimal.subtract(stake.amount, amount);
  await stake.save();

  res.status(200).json({ message: "Un-stake successful" });
});

/**
 * @desc    Un-stake
 * @route   POST /api/stakes/reset-burn
 * @access  Private(admin)
 */
const resetBurn = catchAsync(async (req, res, next) => {
  const stakePool = await StakePool.findOne();
  // Send already burned if burn is 0
  if (decimal.compare(stakePool.burn, "0", "eq"))
    return next(new AppError("Already burned", 400));

  stakePool.burn = "0";
  await stakePool.save();

  res.status(200).json({ message: "Reset burn successful" });
});

/**
 * @desc    Get live chart statistics
 * @route   GET /api/stakes/stake-histories?date=
 * @param   date 2024-04-24
 * @access  Public
 */
const getStakeHistories = catchAsync(async (req, res) => {
  const date = new Date(req.query.date);
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Get totalStakePaco
  const result = await StakeHistory.aggregate([
    {
      $group: {
        _id: null,
        totalAmount: {
          $sum: {
            $convert: {
              input: "$amount",
              to: "decimal",
              onError: 0,
              onNull: 0,
            },
          },
        },
      },
    },
  ]);

  const totalAmount = Number(result?.[0]?.totalAmount) || 0;
  const stakePool = await StakePool.findOne();

  const query = {
    $expr: {
      $eq: [
        { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        { $dateToString: { format: "%Y-%m-%d", date: date } },
      ],
    },
  };

  const count = await StakeHistory.countDocuments(query);
  const stakeHistories = await StakeHistory.aggregate([
    {
      $match: query,
    },
    {
      $group: {
        _id: "$createdAt",
        totalStakePaco: {
          $sum: {
            $convert: {
              input: "$amount",
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
        totalStakePaco: { $toString: "$totalStakePaco" },
      },
    },
    {
      $sort: { _id: -1 },
    },
    {
      $skip: skip,
    },
    {
      $limit: limit,
    },
  ]);

  const resData = await Promise.all(
    stakeHistories.map(async (stakeHolder) => {
      const stakePercentage = _calcStakePercentage(
        stakeHolder?.totalStakePaco,
        totalAmount
      );

      // Calculate paco reward from pool for this stake holder
      const rewardPaco = _calcStakeReward(stakePool.paco, stakePercentage);
      const pacoInUSD = await getCoinPrice("paco");
      const rewardPacoInUSD = decimal.multiply(pacoInUSD, rewardPaco);

      // Calculate btc reward from pool for this stake holder
      const rewardBtc = _calcStakeReward(stakePool.btc, stakePercentage);
      const btcInUSD = await getCoinPrice("btc");
      const rewardBtcInUSD = decimal.multiply(btcInUSD, rewardBtc);

      // Calculate eth reward from pool for this stake holder
      const rewardEth = _calcStakeReward(stakePool.eth, stakePercentage);
      const ethInUSD = await getCoinPrice("eth");
      const rewardEthInUSD = decimal.multiply(ethInUSD, rewardEth);

      // Calculate bnb reward from pool for this stake holder
      const rewardBnb = _calcStakeReward(stakePool.bnb, stakePercentage);
      const bnbInUSD = await getCoinPrice("bnb");
      const rewardBnbInUSD = decimal.multiply(bnbInUSD, rewardBnb);

      // Calculate usdt reward from pool for this stake holder
      const rewardUsdt = _calcStakeReward(stakePool.usdt, stakePercentage);
      const usdtInUSD = await getCoinPrice("usdt");
      const rewardUsdtInUSD = decimal.multiply(usdtInUSD, rewardUsdt);

      const totalPayoutInUSD = decimal.addition(
        rewardPacoInUSD,
        rewardBtcInUSD,
        rewardEthInUSD,
        rewardBnbInUSD,
        rewardUsdtInUSD
      );

      return {
        date: stakeHolder?._id,
        stakedPaco: stakeHolder?.totalStakePaco,
        payouts: totalPayoutInUSD,
      };
    })
  );

  res.status(200).json({ result: resData, count });
});

// Schedule of Transfer 1% of stake pool to the stake holder
const transferPoolToStakeHolder = async () => {
  const result = await Stake.aggregate([
    {
      $group: {
        _id: null,
        totalAmount: {
          $sum: {
            $convert: {
              input: "$amount",
              to: "decimal",
              onError: 0,
              onNull: 0,
            },
          },
        },
      },
    },
  ]);

  const totalAmount = Number(result?.[0]?.totalAmount) || 0;

  const stakePool = await StakePool.findOne();
  const stakeHolders = await Stake.find();

  await Promise.all(
    stakeHolders.map(async (stakeHolder) => {
      const stakePercentage = _calcStakePercentage(
        stakeHolder?.amount,
        totalAmount
      );

      // Calculate paco reward from pool for this stake holder
      const rewardPaco = _calcStakeReward(stakePool.paco, stakePercentage);
      stakeHolder.paco = decimal.addition(stakeHolder.paco, rewardPaco);
      stakePool.paco = decimal.subtract(stakePool.paco, rewardPaco);

      // Calculate btc reward from pool for this stake holder
      const rewardBtc = _calcStakeReward(stakePool.btc, stakePercentage);
      stakeHolder.btc = decimal.addition(stakeHolder.btc, rewardBtc);
      stakePool.btc = decimal.subtract(stakePool.btc, rewardBtc);

      // Calculate eth reward from pool for this stake holder
      const rewardEth = _calcStakeReward(stakePool.eth, stakePercentage);
      stakeHolder.eth = decimal.addition(stakeHolder.eth, rewardEth);
      stakePool.eth = decimal.subtract(stakePool.eth, rewardEth);

      // Calculate bnb reward from pool for this stake holder
      const rewardBnb = _calcStakeReward(stakePool.bnb, stakePercentage);
      stakeHolder.bnb = decimal.addition(stakeHolder.bnb, rewardBnb);
      stakePool.bnb = decimal.subtract(stakePool.bnb, rewardBnb);

      // Calculate usdt reward from pool for this stake holder
      const rewardUsdt = _calcStakeReward(stakePool.usdt, stakePercentage);
      stakeHolder.usdt = decimal.addition(stakeHolder.usdt, rewardUsdt);
      stakePool.usdt = decimal.subtract(stakePool.usdt, rewardUsdt);

      await stakeHolder.save();
    })
  );

  await stakePool.save();
};

module.exports = {
  createStake,
  getMyStakePayouts,
  getStakePool,
  transferPoolToStakeHolder,
  getStakeCalculator,
  claimMyStakeReward,
  unStake,
  resetBurn,
  getStakeHistories,
};
