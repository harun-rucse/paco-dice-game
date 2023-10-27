const Account = require("../models/Account");
const catchAsync = require("../utils/catch-async");
const AppError = require("../utils/app-error");

/**
 * @desc    Make a Deposite
 * @route   PATCH /api/account/deposite
 * @access  Private
 */
const deposite = catchAsync(async (req, res, next) => {
  const { paymentType, amount } = req.body;

  if (!paymentType || !amount)
    return next(new AppError("PaymentType and amount is required", 400));

  const account = await Account.findOne({ publicKey: req.account.publicKey });
  if (!account) {
    return next(new AppError("Account not found with that public key", 400));
  }

  account[paymentType] = account[paymentType] + Number(amount);
  await account.save();

  res.status(200).send("Deposite successfull");
});

/**
 * @desc    Make a Withdraw
 * @route   PATCH /api/account/withdraw
 * @access  Private
 */
const withdraw = catchAsync(async (req, res, next) => {
  const { paymentType, amount } = req.body;

  if (!paymentType || !amount)
    return next(new AppError("PaymentType and amount is required", 400));

  const account = await Account.findOne({ publicKey: req.account.publicKey });
  if (!account) {
    return next(new AppError("Account not found with that public key", 400));
  }

  if (account[paymentType] < amount) {
    return next(new AppError("Insufficent balace for withdraw", 400));
  }

  account[paymentType] = account[paymentType] - Number(amount);
  await account.save();

  res.status(200).send("Withdraw successfull");
});

module.exports = {
  deposite,
  withdraw,
};
