const Account = require("../models/Account");
const Stake = require("../models/Stake");
const StakePool = require("../models/StakePool");
const AppError = require("../utils/app-error");
const catchAsync = require("../utils/catch-async");
const decimal = require("../utils/decimal");

const _calcStakePercentage = (amount, totalAmount) => {
  return decimal.divide(decimal.multiply(100, amount), totalAmount);
};

const _calcStakeReward = (amount, stakePercentage) => {
  return decimal.multiply(
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
};
