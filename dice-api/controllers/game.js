const Game = require("../models/Game");
const Account = require("../models/Account");
const StakePool = require("../models/StakePool");
const { generateUniqueBet, generateRandomNumber } = require("../utils");
const catchAsync = require("../utils/catch-async");
const AppError = require("../utils/app-error");
const getCoinPrice = require("../services/token-price-service");

/*

1 BTC 100.000.000 paco
18.39 ETH 100.000.000 paco
163.54 BNB 100.000.000 paco
36977.54 USDT 100.000.000 paco

*/

async function caclPacoReward(amount, coinName) {
  let reward = 0;

  if (coinName === "btc") {
    reward = amount * 100000000;
  } else if (coinName === "eth") {
    reward = (100000000 / 18.39) * amount;
  } else if (coinName === "paco") {
    reward = 0;
  } else if (coinName === "usdt") {
    reward = (100000000 / 36977.54) * amount;
  } else if (coinName === "bnb") {
    reward = (100000000 / 163.54) * amount;
  }

  return reward;
}

// async function checkMaxBetAmount(amount, coinName) {
//   return 5;
//   // if (coinName === "btc") {
//   //   const _btcPrice = await getCoinPrice("btc");
//   //   const _betedUsd = amount * _btcPrice;
//   //   if (_betedUsd > 100) {
//   //     return false;
//   //   } else {
//   //     return true;
//   //   }
//   // } else if (coinName === "usdt") {
//   //   if (amount > 100) {
//   //     return false;
//   //   } else {
//   //     return true;
//   //   }
//   // } else if (coinName === "eth") {
//   //   const _ethPrice = await getCoinPrice("eth");
//   //   const _betedUsd = amount * _ethPrice;
//   //   if (_betedUsd > 100) {
//   //     return false;
//   //   } else {
//   //     return true;
//   //   }
//   // } else if (coinName === "bnb") {
//   //   const _bnbPrice = await getCoinPrice("bnb");
//   //   const _betedUsd = amount * _bnbPrice;
//   //   if (_betedUsd > 100) {
//   //     return false;
//   //   } else {
//   //     return true;
//   //   }
//   // } else if (coinName === "paco") {
//   //   if (amount > 100000000) {
//   //     return false;
//   //   } else {
//   //     return true;
//   //   }
//   // }
// }

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

  const seed = generateUniqueBet();
  const { randomSeed, hashedValue, number } = generateRandomNumber(seed, 100);
  const multiplier =
    rollType === "rollUnder"
      ? (100 / Number(prediction)) * (1 - 0.02)
      : (100 / (100 - Number(prediction) - 1)) * (1 - 0.02);

  // Create new game
  const game = new Game({
    publicKey,
    prediction,
    betAmount,
    winNumber: number,
    randomSeed,
    hashRound: hashedValue,
    rewardAmount: 0,
    status:
      rollType === "rollUnder"
        ? prediction > number
          ? "win"
          : "lost"
        : prediction < number
        ? "win"
        : "lost",
  });

  // reduce balance amount of betAmount
  account[paymentType] = account[paymentType] - betAmount;

  // add paco balance reward
  if (paymentType !== "paco") {
    account["paco"] =
      account["paco"] + Number(await caclPacoReward(betAmount, paymentType));
  }

  // If win add win Reward
  if (game.status === "win") {
    game.rewardAmount = Number(betAmount) * multiplier;
    account[paymentType] = account[paymentType] + game.rewardAmount;
  }

  // If lost add 60% to the stake pool
  if (game.status === "lost") {
    const amount = Number(betAmount) * 0.6;

    const stakePool = await StakePool.findOne();

    if (!stakePool) {
      const newStakePool = new StakePool();
      newStakePool[paymentType] = newStakePool[paymentType] + amount;
      await newStakePool.save();
    } else {
      stakePool[paymentType] = stakePool[paymentType] + amount;
      await stakePool.save();
    }

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
