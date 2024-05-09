const Game = require("../models/Game");
const Account = require("../models/Account");
const StakePool = require("../models/StakePool");
const { generateUniqueBet, generateRandomNumber } = require("../utils");
const catchAsync = require("../utils/catch-async");
const AppError = require("../utils/app-error");
const getCoinPrice = require("../services/token-price-service");
const decimal = require("../utils/decimal");

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

  const isInsufficientBalance = decimal.compare(
    account[paymentType ? paymentType : "btc"],
    betAmount,
    "lt"
  );
  if (isInsufficientBalance)
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
    betCoin: paymentType,
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
  // account[paymentType] = account[paymentType] - betAmount;
  account[paymentType] = decimal.subtract(account[paymentType], betAmount);

  // add paco balance reward
  if (paymentType !== "paco") {
    // account["paco"] =
    //   account["paco"] + Number(await caclPacoReward(betAmount, paymentType));
    account["paco"] = decimal.addition(
      account["paco"],
      await caclPacoReward(betAmount, paymentType)
    );
  }

  // If win add win Reward
  if (game.status === "win") {
    game.rewardAmount = Number(betAmount) * multiplier;
    // account[paymentType] = account[paymentType] + game.rewardAmount;
    account[paymentType] = decimal.addition(
      account[paymentType],
      game.rewardAmount
    );

    const stakePool = await StakePool.findOne();
    if (!stakePool) {
      const newStakePool = new StakePool();

      // Reduce 60% from the stake pool
      newStakePool[paymentType] = decimal.subtract(
        newStakePool[paymentType],
        decimal.multiply(decimal.subtract(game.rewardAmount, betAmount), 0.6)
      );

      // Reduce 2% to the burn
      newStakePool["burn"] = decimal.subtract(
        newStakePool["burn"],
        decimal.multiply(decimal.subtract(game.rewardAmount, betAmount), 0.02)
      );

      if (newStakePool["burn"] < 0) {
        newStakePool["burn"] = 0;
      }
      await newStakePool.save();
    } else {
      // Reduce 60% from the stake pool
      stakePool[paymentType] = decimal.subtract(
        stakePool[paymentType],
        decimal.multiply(decimal.subtract(game.rewardAmount, betAmount), 0.6)
      );

      // Reduce 2% from the burn
      stakePool["burn"] = decimal.subtract(
        stakePool["burn"],
        decimal.multiply(decimal.subtract(game.rewardAmount, betAmount), 0.02)
      );

      if (stakePool["burn"] < 0) {
        stakePool["burn"] = 0;
      }

      await stakePool.save();
    }
  }

  // If lost add 60% to the stake pool
  if (game.status === "lost") {
    const amount = decimal.multiply(betAmount, 0.6);

    const stakePool = await StakePool.findOne();

    if (!stakePool) {
      const newStakePool = new StakePool();
      newStakePool[paymentType] = decimal.addition(
        newStakePool[paymentType],
        amount
      );

      // Add 2% to the burn
      newStakePool["burn"] = decimal.addition(
        newStakePool["burn"],
        decimal.multiply(betAmount, 0.02)
      );

      await newStakePool.save();
    } else {
      stakePool[paymentType] = decimal.addition(stakePool[paymentType], amount);

      // Add 2% to the burn
      stakePool["burn"] = decimal.addition(
        stakePool["burn"],
        decimal.multiply(betAmount, 0.02)
      );
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

/**
 * @desc    Get all bet histories
 * @route   GET /api/games/bet-histories
 * @access  Public/Private
 */
const getBetHistory = catchAsync(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const type = req.query.type;

  const filter =
    type === "My Bets" ? { publicKey: req.account?.publicKey } : {};

  const count = await Game.countDocuments(filter);
  const betHistories = await Game.find(filter)
    .sort({
      createdAt: -1,
    })
    .limit(limit)
    .skip(limit * (page - 1));

  const histories = await Promise.all(
    betHistories.map(async (betHistory) => {
      const user = await Account.findOne({ publicKey: betHistory.publicKey });

      const history = betHistory._doc;
      const rollType =
        history.prediction > history.winNumber === "win"
          ? "rollUnder"
          : "rollOver";

      const dto = {
        game: "Dice",
        time: history.createdAt,
        user: {
          username: user.username,
          avatar: user.avatar,
        },
        betAmount: history.betAmount,
        betCoin: history.betCoin,
        multiplier:
          rollType === "rollUnder"
            ? (100 / Number(history.prediction)) * (1 - 0.02)
            : (100 / (100 - Number(history.prediction) - 1)) * (1 - 0.02),
        payout: history.rewardAmount,
        status: history.status,
      };

      return dto;
    })
  );

  res.status(200).json({ result: histories, count });
});

/**
 * @desc    Get live chart statistics
 * @route   GET /api/games/live-chart
 * @access  Public
 */
const getLiveChart = catchAsync(async (req, res) => {
  const winStats = await Game.aggregate([
    {
      $match: { status: "win" },
    },
    {
      $group: {
        _id: null,
        totalRewardAmount: {
          $sum: {
            $convert: {
              input: "$rewardAmount",
              to: "decimal",
              onError: 0,
              onNull: 0,
            },
          },
        },
        totalBetAmount: {
          $sum: {
            $convert: {
              input: "$betAmount",
              to: "decimal",
              onError: 0,
              onNull: 0,
            },
          },
        },
        win: { $sum: 1 },
      },
    },
    {
      $project: {
        totalRewardAmount: { $toString: "$totalRewardAmount" },
        totalBetAmount: { $toString: "$totalBetAmount" },
        win: 1,
      },
    },
  ]);

  const lostStats = await Game.aggregate([
    {
      $match: { status: "lost" },
    },
    {
      $group: {
        _id: null,
        totalBetAmount: {
          $sum: {
            $convert: {
              input: "$betAmount",
              to: "decimal",
              onError: 0,
              onNull: 0,
            },
          },
        },
        looses: { $sum: 1 },
      },
    },
    {
      $project: {
        totalBetAmount: { $toString: "$totalBetAmount" },
        looses: 1,
      },
    },
  ]);

  let profit = 0;
  let win = 0;
  let wager = 0;
  let looses = 0;

  const pacoPriceInUSD = await getCoinPrice("paco");

  const winGame = winStats[0];
  if (winStats.length) {
    profit = decimal.multiply(
      decimal.subtract(winGame.totalRewardAmount, winGame.totalBetAmount),
      pacoPriceInUSD
    );
    win = winGame.win;
  }

  const lostGame = lostStats[0];
  if (lostStats.length) {
    wager = decimal.multiply(lostGame.totalBetAmount, pacoPriceInUSD);
    looses = lostGame.looses;
  }

  res.status(200).json({ profit, win, wager, looses });
});

module.exports = {
  hello,
  createGame,
  getGamesHistory,
  getBetHistory,
  getLiveChart,
};
