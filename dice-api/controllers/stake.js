const Account = require("../models/Account");
const Stake = require("../models/Stake");
const StakePool = require("../models/StakePool");
const AppError = require("../utils/app-error");
const catchAsync = require("../utils/catch-async");

const _calcStakePercentage = (amount, totalAmount) => {
  return (100 * amount) / totalAmount;
};

const _calcStakeReward = (amount, stakePercentage) => {
  return amount * 0.01 * stakePercentage;
};

/**
 * @desc    Create new stake
 * @route   POST /api/stakes
 * @access  Private
 */
const createStake = catchAsync(async (req, res, next) => {
  const amount = Number(req.body.amount);
  if (!amount) return next(new AppError("Amount is required", 400));

  // Check user account has enough balance for stake
  if (req.account.paco < amount)
    return next(new AppError("Insufficient balance for stake", 400));

  const stake = await Stake.findOne({ account: req.account._id });

  if (!stake) {
    const newStake = new Stake();
    newStake.account = req.account._id;
    newStake.amount = amount;
    newStake.tokenName = "paco";
    newStake.paco = amount;

    await newStake.save();
  } else {
    stake.amount += amount;
    stake.paco += amount;
    await stake.save();
  }

  // Reduce paco amount from account
  const account = await Account.findById(req.account._id);
  account.paco -= amount;
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

  res.status(200).json(stakePool);
});

// Schedule of Transfer 1% of stake pool to the stake holder
const transferPoolToStakeHolder = async () => {
  // const stakeHolders = await Stake.find();
  const result = await Stake.aggregate([
    {
      $group: {
        _id: null,
        totalAmount: { $sum: "$amount" },
      },
    },
  ]);

  const totalAmount = result?.[0]?.totalAmount;

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
      stakeHolder.paco += rewardPaco;
      stakePool.paco -= rewardPaco;

      // Calculate btc reward from pool for this stake holder
      const rewardBtc = _calcStakeReward(stakePool.btc, stakePercentage);
      stakeHolder.btc += rewardBtc;
      stakePool.btc -= rewardBtc;

      // Calculate eth reward from pool for this stake holder
      const rewardEth = _calcStakeReward(stakePool.eth, stakePercentage);
      stakeHolder.eth += rewardEth;
      stakePool.eth -= rewardEth;

      // Calculate bnb reward from pool for this stake holder
      const rewardBnb = _calcStakeReward(stakePool.bnb, stakePercentage);
      stakeHolder.bnb += rewardBnb;
      stakePool.bnb -= rewardBnb;

      // Calculate usdt reward from pool for this stake holder
      const rewardUsdt = _calcStakeReward(stakePool.usdt, stakePercentage);
      stakeHolder.usdt += rewardUsdt;
      stakePool.usdt -= rewardUsdt;

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
};
