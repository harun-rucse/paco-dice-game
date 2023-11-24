const Game = require("../models/Game");
const Account = require("../models/Account");
const { generateUniqueBet, generateRandomNumber } = require("../utils");
const catchAsync = require("../utils/catch-async");
const AppError = require("../utils/app-error");
const getCoinPrice = require("../services/token-price-service");

async function caclPacoReward(amount, coinName) {
  let reward = 0;
  if (coinName === "btc") {
    let price = await getCoinPrice("btc");
    // price = price * 1000;
    const satoshiPrice = price / 100000000;
    console.log("satoshiPrice", satoshiPrice);
    reward = amount / satoshiPrice;
  } else if (coinName === "usdt") {
    let _btcPrice = await getCoinPrice("btc");
    let _satoshiPrice = _btcPrice / 100000000;
    reward = amount / _satoshiPrice;
  } else if (coinName === "paco") {
    reward = 0;
  } else if (coinName === "eth") {
    let _btcPrice = await getCoinPrice("btc");
    let _ethPrice = await getCoinPrice("eth");
    const _amountPrice = amount * _ethPrice;
    const _satoshiPrice = _btcPrice / 100000000;
    console.log("satoshiPrice", _satoshiPrice);
    reward = _amountPrice / _satoshiPrice;
  } else if (coinName === "bnb") {
    let _btcPrice = await getCoinPrice("btc");
    let _bnbPrice = await getCoinPrice("bnb");
    const _amountPrice = amount * _bnbPrice;
    const _satoshiPrice = _btcPrice / 100000000;
    console.log("satoshiPrice", _satoshiPrice);
    reward = _amountPrice / _satoshiPrice;
  }

  return reward;
}

async function checkMaxBetAmount(amount, coinName) {
  if (coinName === "btc") {
    const _btcPrice = await getCoinPrice("btc");
    const _betedUsd = amount * _btcPrice;
    if (_betedUsd > 100) {
      return false;
    } else {
      return true;
    }
  } else if (coinName === "usdt") {
    if (amount > 100) {
      return false;
    } else {
      return true;
    }
  } else if (coinName === "eth") {
    const _ethPrice = await getCoinPrice("eth");
    const _betedUsd = amount * _ethPrice;
    if (_betedUsd > 100) {
      return false;
    } else {
      return true;
    }
  } else if (coinName === "bnb") {
    const _bnbPrice = await getCoinPrice("bnb");
    const _betedUsd = amount * _bnbPrice;
    if (_betedUsd > 100) {
      return false;
    } else {
      return true;
    }
  } else if (coinName === "paco") {
    if (amount > 100000000) {
      return false;
    } else {
      return true;
    }
  }
}

/**
 * @desc    Get Hello World message
 * @route   GET /api/hello
 * @access  Public
 */
const hello = (req, res) => {
  res.send("Hello World!");
};

/**
 * @desc    Create new Game
 * @route   POST /api/games
 * @access  Private
 */
const createGame = catchAsync(async (req, res, next) => {
  const { paymentType, betAmount, prediction, rollType } = req.body;
  const publicKey = req.account.publicKey;

  // Validate request
  if (!betAmount || !prediction || !rollType) {
    return next(new AppError("All fields are required!", 400));
  }

  const _checkMaxBetAmount = await checkMaxBetAmount(betAmount, paymentType);

  if (!_checkMaxBetAmount) {
    return next(new AppError("Bet amount is more than Max bet amount", 400));
  }

  if (rollType === "rollUnder") {
    if (prediction < 1 || prediction > 95)
      return new next(AppError("Invalid prediction", 400));
  } else {
    if (prediction < 4 || prediction > 98)
      return new next(AppError("Invalid prediction", 400));
  }

  const account = await Account.findOne({ publicKey });
  if (!account)
    return next(new AppError("Account not found with that public key", 400));

  if (account[paymentType ? paymentType : "btc"] < betAmount)
    return next(new AppError("Insufficient Balance for play", 400));

  const betId = generateUniqueBet(publicKey);
  const winNumber = generateRandomNumber(betId, 100);
  const multiplier =
    rollType === "rollUnder"
      ? (100 / Number(prediction)) * (1 - 0.02)
      : (100 / (100 - Number(prediction) - 1)) * (1 - 0.02);

  // Create new game
  const game = new Game({
    publicKey,
    prediction,
    betAmount,
    winNumber,
    rewardAmount: 0,
    status:
      rollType === "rollUnder"
        ? prediction > winNumber
          ? "win"
          : "lost"
        : prediction < winNumber
        ? "win"
        : "lost",
  });

  // reduce balance amount of betAmount
  account[paymentType] = account[paymentType] - betAmount;

  // add paco balance reward
  if (paymentType !== "paco") {
    console.log("paco reward", account["paco"]);
    console.log("paco reward", await caclPacoReward(betAmount, paymentType));
    account["paco"] =
      account["paco"] + Number(await caclPacoReward(betAmount, paymentType));
  }

  // If win add win Reward
  if (game.status === "win") {
    game.rewardAmount = Number(betAmount) * multiplier;
    account[paymentType] = account[paymentType] + game.rewardAmount;
  }

  await account.save();
  await game.save();

  res.json(game);
});

/**
 * @desc    Get games history
 * @route   GET /api/games
 * @access  Private
 */
const getGamesHistory = catchAsync(async (req, res) => {
  const games = await Game.find({ publicKey: req.account.publicKey })
    .sort({
      createdAt: -1,
    })
    .limit(100);

  res.json(games);
});

module.exports = {
  hello,
  createGame,
  getGamesHistory,
};
