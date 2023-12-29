const Account = require("../models/Account");
const Stake = require("../models/Stake");
const StakePool = require("../models/StakePool");
const AppError = require("../utils/app-error");
const catchAsync = require("../utils/catch-async");

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
const getStakePayouts = catchAsync(async (req, res, next) => {
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

module.exports = {
  createStake,
  getStakePayouts,
  getStakePool,
};
