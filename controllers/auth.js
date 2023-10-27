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
  const { email, password } = req.body;

  if (!email || !password)
    return next(new AppError("Email and password is required!", 400));

  // Return error if account already exitsts
  const isExist = await Account.findOne({ email });
  if (isExist) return next(new AppError("Account already exists", 400));

  const { address, privateKey } = await web3.eth.accounts.create();

  const userName = generateFromEmail(email, 3);

  const newAccount = new Account({
    userName,
    email,
    password,
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
  const { userName, password } = req.body;

  if (!userName || !password)
    return next(new AppError("Username and password is required", 400));

  const account = await Account.findOne({
    $or: [{ email: userName }, { userName }],
  });

  const isMatch = await account?.correctPassword(password, account.password);

  if (!isMatch) {
    return next(new AppError("Invallid credential", 400));
  }

  const token = tokenService.generateJwtToken({ id: account._id });

  res.status(200).json(token);
});

module.exports = {
  register,
  login,
};
