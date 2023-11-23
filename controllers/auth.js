const Web3 = require("web3");
const { generateFromEmail } = require("unique-username-generator");
const Account = require("../models/Account");
const tokenService = require("../services/token-service");
const Email = require("../services/email-service");
const catchAsync = require("../utils/catch-async");
const AppError = require("../utils/app-error");

const web3 = new Web3(process.env.RPC);

/**
 * @desc    Create new account
 * @route   GET /api/auth/register
 * @access  Public
 */
const register = catchAsync(async (req, res, next) => {
  const { email, password, promoCode } = req.body;

  if (!email || !password)
    return next(new AppError("Email and password is required!", 400));

  // Return error if account already exitsts
  const isExist = await Account.findOne({ email });
  if (isExist) return next(new AppError("Account already exists", 400));

  const { address, privateKey } = await web3.eth.accounts.create();

  const username = generateFromEmail(email, 3);

  const newAccount = new Account({
    username,
    email,
    password,
    promoCode,
    privateKey,
    publicKey: address,
  });

  await newAccount.save();

  const token = tokenService.generateJwtToken({ id: newAccount._id });

  res.status(201).json(token);
});

/**
 * @desc    Login to the account
 * @route   GET /api/auth/login
 * @access  Public
 */
const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return next(new AppError("Email and password is required", 400));

  const account = await Account.findOne({ email }).select("+password");

  const isMatch = await account?.correctPassword(password, account.password);

  if (!isMatch) {
    return next(new AppError("Invallid email or password", 400));
  }

  const token = tokenService.generateJwtToken({ id: account._id });

  // Listen for events

  res.status(200).json(token);
});

/**
 * @desc    Get current user account
 * @route   GET /api/auth/current-user
 * @access  Private
 */
const currentUser = catchAsync(async (req, res, next) => {
  const account = await Account.findOne({ publicKey: req.account.publicKey });

  if (!account) {
    return next(new AppError("Account not found", 400));
  }

  res.status(200).json(account);
});

/**
 * @desc    Update password
 * @route   PATCH /api/auth/update-password
 * @access  Private
 */
const updatePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, password } = req.body;

  if (!currentPassword || !password) {
    return next(new AppError("password is required.", 400));
  }

  const account = await Account.findOne({
    publicKey: req.account.publicKey,
  }).select("password");

  const isMatch = await account?.correctPassword(
    currentPassword,
    account.password
  );
  if (!isMatch) {
    return next(new AppError("Incorrect old password", 400));
  }

  account.password = password;
  await account.save();

  const token = tokenService.generateJwtToken({ id: account._id });

  res.status(200).json(token);
});

/**
 * @desc    Forgot password request
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
const forgotPassword = catchAsync(async (req, res, next) => {
  if (!req.body.email) {
    return next(new AppError("Email address is required.", 400));
  }

  const account = await Account.findOne({ email: req.body.email });
  if (!account) {
    throw new AppError("There is no user with email address.", 404);
  }

  const resetToken = tokenService.generateRandomToken();
  account.passwordResetToken = tokenService.hashToken(resetToken);
  account.passwordResetExpired =
    Date.now() + process.env.PASSWORD_RESET_TOKEN_EXPIRES_IN * 60 * 1000;
  await account.save({ validateBeforeSave: false });

  // send email
  const resetURL = `${process.env.FRONTEND_BASE_URL}/reset-password/${resetToken}`;
  try {
    await new Email(account, resetURL).sendPasswordReset();
  } catch (err) {
    // 7) If there is an error sending the email, remove the password reset token and expiration
    account.passwordResetToken = undefined;
    account.passwordResetExpired = undefined;
    await account.save({ validateBeforeSave: false });

    return next(new AppError("There was an error sending the email.", 500));
  }

  res.status(200).json({
    status: "success",
    message: "Reset Token sent to your email!",
  });
});

/**
 * @desc    Reset the password
 * @route   PATCH /api/auth/reset-password/resetToken
 * @access  Public
 */
const resetPassword = catchAsync(async (req, res, next) => {
  if (!req.body.password) {
    return next(new AppError("password is required.", 400));
  }

  const hashedToken = tokenService.hashToken(req.params.resetToken);
  const account = await Account.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpired: { $gt: Date.now() },
  });

  if (!account) {
    throw new AppError("Token is invalid or has expired.", 400);
  }

  account.password = req.body.password;
  account.passwordResetToken = undefined;
  account.passwordResetExpired = undefined;
  account.save();

  const token = tokenService.generateJwtToken({ id: account._id });

  res.status(200).json(token);
});

module.exports = {
  register,
  login,
  currentUser,
  updatePassword,
  forgotPassword,
  resetPassword,
};
