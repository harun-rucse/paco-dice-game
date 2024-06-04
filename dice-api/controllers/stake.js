const Account = require("../models/Account");
const Referral = require("../models/Referral");
const MyStakeHistory = require("../models/MyStakeHistory");
const Stake = require("../models/Stake");
const StakeHistory = require("../models/StakeHistory");
const StakePool = require("../models/StakePool");
const AppError = require("../utils/app-error");
const catchAsync = require("../utils/catch-async");
const decimal = require("../utils/decimal");
const { STAKING_COMMISSION } = require("../utils/referral-constants");

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
 * @desc    Get All Payouts stake histories
 * @route   GET /api/stakes/stake-histories?fromDate=date&toDate=date
 * @param   fromDate 2024-04-23
 * @param   toDate 2024-04-24
 * @access  Public
 */
const getStakeHistories = catchAsync(async (req, res) => {
  const fromDate = new Date(req.query.fromDate);
  const toDate = new Date(req.query.toDate);

  const query = {
    $expr: {
      $or: [
        {
          $eq: [
            { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
            { $dateToString: { format: "%Y-%m-%d", date: fromDate } },
          ],
        },
        {
          $eq: [
            { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
            { $dateToString: { format: "%Y-%m-%d", date: toDate } },
          ],
        },
      ],
    },
  };

  const count = await StakeHistory.countDocuments(query);
  const stakeHistories = await StakeHistory.find(query).sort({
    date: -1,
  });

  const resData = [];

  await Promise.all(
    stakeHistories.map(async (stakeHistory, i) => {
      resData.push({
        date: stakeHistory.date,
        stakedPaco: stakeHistory.totalStakePaco,
        payouts: stakeHistory.btc,
        coinName: "btc",
        index: i + 1,
      });
      resData.push({
        date: stakeHistory.date,
        stakedPaco: stakeHistory.totalStakePaco,
        payouts: stakeHistory.paco,
        coinName: "paco",
        index: i + 1,
      });
      resData.push({
        date: stakeHistory.date,
        stakedPaco: stakeHistory.totalStakePaco,
        payouts: stakeHistory.eth,
        coinName: "eth",
        index: i + 1,
      });
      resData.push({
        date: stakeHistory.date,
        stakedPaco: stakeHistory.totalStakePaco,
        payouts: stakeHistory.usdt,
        coinName: "usdt",
        index: i + 1,
      });
      resData.push({
        date: stakeHistory.date,
        stakedPaco: stakeHistory.totalStakePaco,
        payouts: stakeHistory.bnb,
        coinName: "bnb",
        index: i + 1,
      });
    })
  );

  res.status(200).json({ result: resData, count });
});

/**
 * @desc    Get My Payouts stake histories
 * @route   GET /api/stakes/my-stake-histories?fromDate=date&toDate=date
 * @param   fromDate 2024-04-23
 * @param   toDate 2024-04-24
 * @access  Private
 */
const getMyStakeHistories = catchAsync(async (req, res) => {
  const fromDate = new Date(req.query.fromDate);
  const toDate = new Date(req.query.toDate);

  const query = {
    $expr: {
      $or: [
        {
          $eq: [
            { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
            { $dateToString: { format: "%Y-%m-%d", date: fromDate } },
          ],
        },
        {
          $eq: [
            { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
            { $dateToString: { format: "%Y-%m-%d", date: toDate } },
          ],
        },
      ],
    },
    account: req.account._id,
  };

  const count = await MyStakeHistory.countDocuments(query);
  const myStakeHistories = await MyStakeHistory.find(query).sort({
    date: -1,
  });

  const resData = [];

  await Promise.all(
    myStakeHistories.map(async (myStakeHistory, i) => {
      resData.push({
        date: myStakeHistory.date,
        stakedPaco: myStakeHistory.totalStakePaco,
        payouts: myStakeHistory.btc,
        coinName: "btc",
        index: i + 1,
      });
      resData.push({
        date: myStakeHistory.date,
        stakedPaco: myStakeHistory.totalStakePaco,
        payouts: myStakeHistory.paco,
        coinName: "paco",
        index: i + 1,
      });
      resData.push({
        date: myStakeHistory.date,
        stakedPaco: myStakeHistory.totalStakePaco,
        payouts: myStakeHistory.eth,
        coinName: "eth",
        index: i + 1,
      });
      resData.push({
        date: myStakeHistory.date,
        stakedPaco: myStakeHistory.totalStakePaco,
        payouts: myStakeHistory.usdt,
        coinName: "usdt",
        index: i + 1,
      });
      resData.push({
        date: myStakeHistory.date,
        stakedPaco: myStakeHistory.totalStakePaco,
        payouts: myStakeHistory.bnb,
        coinName: "bnb",
        index: i + 1,
      });
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

  let totalStakePaco = 0;
  let totalPayoutPaco = 0;
  let totalPayoutBtc = 0;
  let totalPayoutUsdt = 0;
  let totalPayoutBnb = 0;
  let totalPayoutEth = 0;

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

      // Calculate total payout amount for all payout histories
      totalStakePaco = decimal.addition(totalStakePaco, stakeHolder?.amount);
      totalPayoutPaco = decimal.addition(totalPayoutPaco, rewardPaco);
      totalPayoutBtc = decimal.addition(totalPayoutBtc, rewardBtc);
      totalPayoutBnb = decimal.addition(totalPayoutBnb, rewardBnb);
      totalPayoutEth = decimal.addition(totalPayoutEth, rewardEth);
      totalPayoutUsdt = decimal.addition(totalPayoutUsdt, rewardUsdt);

      // Save stake history for My Payouts
      const myStakeHistory = new MyStakeHistory();
      myStakeHistory.account = stakeHolder?.account;
      myStakeHistory.totalStakePaco = stakeHolder?.amount;
      myStakeHistory.tokenName = "paco";

      // Save previous day because this script run 12:00 AM (next day)
      const date = new Date();
      myStakeHistory.date = date.setDate(date.getDate() - 1);

      // Save payout amount
      myStakeHistory.paco = rewardPaco;
      myStakeHistory.btc = rewardBtc;
      myStakeHistory.usdt = rewardUsdt;
      myStakeHistory.eth = rewardEth;
      myStakeHistory.bnb = rewardBnb;

      await stakeHistory.save();

      // Add commission reward to the referral
      const stakingReferral = await Referral.findOne({
        account: stakeHolder?.account,
        type: "staking",
      });

      if (stakingReferral) {
        const stakingPacoReward = decimal.multiply(
          rewardPaco,
          STAKING_COMMISSION
        );
        stakingReferral["paco"] = decimal.addition(
          stakingReferral["paco"],
          stakingPacoReward
        );

        const stakingBtcReward = decimal.multiply(
          rewardBtc,
          STAKING_COMMISSION
        );
        stakingReferral["btc"] = decimal.addition(
          stakingReferral["btc"],
          stakingBtcReward
        );

        const stakingEthReward = decimal.multiply(
          rewardEth,
          STAKING_COMMISSION
        );
        stakingReferral["eth"] = decimal.addition(
          stakingReferral["eth"],
          stakingEthReward
        );

        const stakingBnbReward = decimal.multiply(
          rewardBnb,
          STAKING_COMMISSION
        );
        stakingReferral["bnb"] = decimal.addition(
          stakingReferral["bnb"],
          stakingBnbReward
        );

        const stakingUsdtReward = decimal.multiply(
          rewardUsdt,
          STAKING_COMMISSION
        );
        stakingReferral["usdt"] = decimal.addition(
          stakingReferral["usdt"],
          stakingUsdtReward
        );

        stakingReferral.save();
      }
      await myStakeHistory.save();
    })
  );

  await stakePool.save();

  // Save stake history for All Payouts
  const stakeHistory = new StakeHistory();
  stakeHistory.totalStakePaco = totalStakePaco;
  stakeHistory.tokenName = "paco";

  // Save previous day because this script run 12:00 AM (next day)
  const date = new Date();
  stakeHistory.date = date.setDate(date.getDate() - 1);

  // Save payout amount
  stakeHistory.paco = totalPayoutPaco;
  stakeHistory.btc = totalPayoutBtc;
  stakeHistory.usdt = totalPayoutUsdt;
  stakeHistory.eth = totalPayoutEth;
  stakeHistory.bnb = totalPayoutBnb;

  await stakeHistory.save();
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
  getMyStakeHistories,
};
