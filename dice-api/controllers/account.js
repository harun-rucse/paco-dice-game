const Account = require("../models/Account");
const Withdraw = require("../models/Withdraw");
const Deposit = require("../models/Deposit");
const catchAsync = require("../utils/catch-async");
const AppError = require("../utils/app-error");
const { transfer } = require("../services/transaction-service");

const getFee = (tokenName) => {
  if (tokenName === "usdt") return 0.5;
  else if (tokenName === "btc") return 0.000025;
  else if (tokenName === "paco") return 25000000;
  else if (tokenName === "eth") return 0.0005;
  else if (tokenName === "bnb") return 0.001;
  else return 0;
};

const isValidAmount = (tokenName, amount) => {
  if (tokenName === "usdt") return amount >= 1;
  else if (tokenName === "btc") return amount >= 0.00005;
  else if (tokenName === "paco") return amount >= 50000000;
  else if (tokenName === "eth") return amount >= 0.001;
  else if (tokenName === "bnb") return amount >= 0.005;
  else return false;
};

/**
 * @desc    Make a Withdraw
 * @route   POST /api/account/withdraw
 * @access  Private
 */

const withdraw = catchAsync(async (req, res, next) => {
  const { tokenName, amount, address } = req.body;

  if (!tokenName || !amount || !address)
    return next(new AppError("TokenName, amount & address is required", 400));

  if (amount <= 0) return next(new AppError("Please select valid amount", 400));
  if (isValidAmount(tokenName, amount) === false)
    return next(new AppError("Please select valid amount", 400));
  const account = await Account.findOne({ publicKey: req.account.publicKey });
  if (!account) {
    return next(new AppError("Account not found with that public key", 400));
  }
  // console.log(account[tokenName], amount, getFee(tokenName));
  if (account[tokenName] < Number(amount) + Number(getFee(tokenName))) {
    return next(new AppError("Insufficent balace for withdraw", 400));
  }

  const newWithdraw = new Withdraw({
    account: account._id,
    amount,
    receivedAddress: address,
    tokenName,
  });

  await newWithdraw.save();

  account[tokenName] =
    Number(account[tokenName]) - Number(amount) - Number(getFee(tokenName));
  await account.save();

  res.status(200).send("Withdraw successfull! Please wait for admin approval");
});

/**
 * @desc    Get all Withdraw
 * @route   GET /api/account/withdraw
 * @access  Private(admin)
 */
const getAllWithdraw = catchAsync(async (req, res, next) => {
  const page = Number(req.query.page);
  const limit = Number(req.query.limit);

  const count = await Withdraw.countDocuments();
  const withdraws = await Withdraw.find()
    .populate("account")
    .limit(limit)
    .skip(limit * (page - 1));

  res.status(200).json({ withdraws, count });
});

/**
 * @desc    Send to Withdrawl address
 * @route   PATCH /api/account/approve-withdraw/:id
 * @access  Private(admin)
 */
const confirmWithdraw = catchAsync(async (req, res, next) => {
  const { status } = req.body;

  const withdraw = await Withdraw.findById(req.params.id);
  if (!withdraw) return next(new AppError("No withdraw found", 404));

  if (withdraw.status !== "pending")
    return next(new AppError("Already approved!", 404));

  if (status == "success") {
    // send amount
    const receipt = await transfer(
      withdraw.tokenName,
      withdraw.receivedAddress,
      withdraw.amount
    );
  } else {
    const account = await Account.findById(withdraw.account);
    account[withdraw.tokenName] =
      Number(account[withdraw.tokenName]) + Number(withdraw.amount);
    await account.save();
  }

  // update status
  withdraw.status = status;
  await withdraw.save();

  res.status(200).send("Withdraw approval success");
});

/**
 * @desc    Get stats
 * @route   GET /api/account/stats
 * @access  Private(admin)
 */
const getStats = catchAsync(async (req, res, next) => {
  const [deposits] = await Deposit.aggregate([
    {
      $group: {
        _id: null,
        totalAmount: { $sum: "$amount" },
      },
    },
  ]);

  const [successWithdraws] = await Withdraw.aggregate([
    { $match: { status: "success" } },
    {
      $group: {
        _id: null,
        totalAmount: { $sum: "$amount" },
      },
    },
  ]);

  const [pendingWithdraws] = await Withdraw.aggregate([
    { $match: { status: "pending" } },
    {
      $group: {
        _id: null,
        totalAmount: { $sum: "$amount" },
      },
    },
  ]);

  res.status(200).json({
    totalDeposit: deposits ? deposits.totalAmount : 0,
    totalWithdraw: successWithdraws ? successWithdraws.totalAmount : 0,
    pendingWithdraw: pendingWithdraws ? pendingWithdraws.totalAmount : 0,
  });
});

/**
 * @desc    Get all user Withdraw
 * @route   GET /api/account/user-transactions/:type
 * @access  Private(user)
 */
const getAllUserTransactions = catchAsync(async (req, res, next) => {
  const page = Number(req.query.page);
  const limit = Number(req.query.limit);
  const { type } = req.params;

  let count;
  let data;

  if (type === "deposits") {
    count = await Deposit.countDocuments({ account: req.account._id });
    data = await Deposit.find({ account: req.account._id })
      .limit(limit)
      .skip(limit * (page - 1));
  } else {
    count = await Withdraw.countDocuments({ account: req.account._id });
    data = await Withdraw.find({ account: req.account._id })
      .limit(limit)
      .skip(limit * (page - 1));
  }

  res.status(200).json({ result: data, count });
});

module.exports = {
  withdraw,
  getAllWithdraw,
  confirmWithdraw,
  getStats,
  getAllUserTransactions,
};
