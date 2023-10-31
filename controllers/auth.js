const Web3 = require("web3");
const { generateFromEmail } = require("unique-username-generator");
const Account = require("../models/Account");
const tokenService = require("../services/token-service");
const catchAsync = require("../utils/catch-async");
const AppError = require("../utils/app-error");

const web3 = new Web3(
  "wss://mainnet.infura.io/ws/v3/650fe48d07f143f9b110e717c48bae4d"
);

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

  const account = await Account.findOne({ email }).select("password");

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

module.exports = {
  register,
  login,
  currentUser,
};
