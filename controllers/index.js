const Web3 = require("web3");
const { generateFromEmail } = require("unique-username-generator");

const Game = require("../models/Game");
const Account = require("../models/Account");
const { generateUniqueBet, generateRandomNumber } = require("../utils");
const tokenService = require("../services/token-service");

const web3 = new Web3(
  "wss://mainnet.infura.io/ws/v3/650fe48d07f143f9b110e717c48bae4d"
);

/**
 * @desc    Get Hello World message
 * @route   GET /api/hello
 * @access  Public
 */
const hello = (req, res) => {
  res.send("Hello World!");
};

/**
 * @desc    Create new account
 * @route   GET /api/register
 * @access  Public
 */
const register = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password)
      return res.status(400).send("All Field are required!");

    // Return error if account already exitsts
    const isExist = await Account.findOne({ email });

    if (isExist) return res.status(400).send("Account already exists");

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
  } catch (err) {
    res.status(500).send("Something went wrong");
  }
};

/**
 * @desc    Login to the account
 * @route   GET /api/login
 * @access  Public
 */
const login = async (req, res) => {
  const { userName, password } = req.body;

  try {
    if (!userName || !password)
      return res.status(400).send("Username and password is required");

    const account = await Account.findOne({
      $or: [{ email: userName }, { userName }],
    });

    const isMatch = await account?.correctPassword(password, account.password);

    if (!isMatch) {
      return res.status(400).send("Invallid credential.");
    }

    const token = tokenService.generateJwtToken({ id: account._id });

    res.status(200).json(token);
  } catch (err) {
    res.status(500).send("Something went wrong");
  }
};

/**
 * @desc    Create new Game
 * @route   POST /api/games
 * @access  Private
 */
const createGame = async (req, res) => {
  const { playerAddress, betAmount, betNumber, rollType } = req.body;

  try {
    // Validate request
    if (!playerAddress || !betAmount || !betNumber || !rollType) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    const betId = generateUniqueBet(playerAddress);
    const winNumber = generateRandomNumber(betId, 100);

    // Create new game
    const game = await Game.create({
      playerAddress,
      betAmount,
      rewardAmount: 0,
      betNumber,
      winNumber,
      status:
        rollType === "rollUnder"
          ? betNumber > winNumber
            ? "win"
            : "lost"
          : betNumber < winNumber
          ? "win"
          : "lost",
    });

    res.json(game);
  } catch (err) {
    res.status(500).send("Something went wrong");
  }
};

/**
 * @desc    Get games history
 * @route   GET /api/games
 * @access  Private
 */
const getGamesHistory = async (req, res) => {
  try {
    const games = await Game.find().sort({ createdAt: 1 }).limit(100);
  
    res.json(games);

  }catch (err) {
    res.status(500).send("Something went wrong");
  }
};

module.exports = { hello, register, login, createGame, getGamesHistory };
