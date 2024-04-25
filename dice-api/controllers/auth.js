const Web3 = require("web3");
const { generateFromEmail } = require("unique-username-generator");
const Account = require("../models/Account");
const tokenService = require("../services/token-service");
const Email = require("../services/email-service");
const catchAsync = require("../utils/catch-async");
const AppError = require("../utils/app-error");

const web3 = new Web3(process.env.RPC);

const cookieOptions = {
  maxAge: 1000 * 60 * 60 * 24 * 30,
  httpOnly: true,
  sameSite: "None",
  secure: true,
};

const _generateAndSendTokens = async (statusCode, account, res) => {
  const { accessToken, refreshToken } = tokenService.generateTokens({
    id: account._id,
  });
  await tokenService.removeRefreshToken(account._id);
  await tokenService.storeRefreshToken(refreshToken, account._id);

  res.cookie("access_token", accessToken, cookieOptions);
  res.cookie("refresh_token", refreshToken, cookieOptions);

  res.status(statusCode).json({ success: true });
};

/**
 * @desc    Create new account
 * @route   GET /api/auth/register
 * @access  Public
 */
const register = catchAsync(async (req, res, next) => {
  const { email, password, promoCode } = req.body;

  if (!email || !password)
    return next(new AppError("Email and password is required!", 400));

  // Validate email address
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email))
    return next(new AppError("Email address is invalid!", 400));

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

  _generateAndSendTokens(201, newAccount, res);
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

  _generateAndSendTokens(200, account, res);
});

/**
 * @desc    Logout user
 * @route   POST /api/auth/logout
 * @access  Private
 */
const logout = catchAsync(async (req, res, next) => {
  await tokenService.removeRefreshToken(req.account._id);

  res.clearCookie("access_token", cookieOptions);
  res.clearCookie("refresh_token", cookieOptions);

  res.status(200).json("Logout successful");
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

  _generateAndSendTokens(200, account, res);
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

  _generateAndSendTokens(200, account, res);
});

/**
 * @desc    Generate new access-token from refresh-token
 * @route   GET /api/auth/refresh-token
 * @access  Public
 */
const refreshAccessToken = catchAsync(async (req, res, next) => {
  // Get refreshToken from cookie or req body
  const refreshToken = req.cookies.refresh_token;
  if (!refreshToken)
    return next(new AppError("Refresh token is required", 400));

  // Verify refreshToken
  const decoded = await tokenService.verifyRefreshToken(refreshToken);

  // Check it exits in db for this user
  const account = await Account.findById(decoded.id);
  if (!account)
    return next(
      new AppError("The user belonging to this token does no longer exist", 401)
    );

  const token = await tokenService.findRefreshToken(refreshToken, account._id);
  if (!token) return next(new AppError("Invalid refresh token", 401));

  // Generate new tokens and send
  _generateAndSendTokens(200, account, res);
});

/**
 * @desc    Update profile
 * @route   PATCH /api/auth/profile
 * @access  Private
 */
const updateProfile = catchAsync(async (req, res, next) => {
  const { username, email } = req.body;

  const account = await Account.findOneAndUpdate(
    { publicKey: req.account.publicKey },
    {
      username,
      email,
    },
    { new: true }
  );

  res.status(200).json(account);
});

module.exports = {
  register,
  login,
  currentUser,
  updatePassword,
  forgotPassword,
  resetPassword,
  updateProfile,
  refreshAccessToken,
  logout,
};
