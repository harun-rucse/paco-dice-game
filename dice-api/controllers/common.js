const Game = require("../models/Game");
const Account = require("../models/Account");
const catchAsync = require("../utils/catch-async");
const coinPrice = require("../services/token-price-service");
const redisClient = require("../config/redis-client");

// Function to fetch coin prices
const fetchCoinPrices = async () => {
  const btc = await coinPrice("btc");
  const paco = await coinPrice("paco");
  const eth = await coinPrice("eth");
  const bnb = await coinPrice("bnb");
  const usdt = await coinPrice("usdt");

  return { btc, paco, eth, bnb, usdt };
};

/**
 * @desc    Get all bet histories
 * @route   GET /api/common/bet-histories
 * @access  Public
 */
const getBetHistory = catchAsync(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const count = await Game.countDocuments();
  const betHistories = await Game.find()
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
 * @desc    Get coin price
 * @route   GET /api/common/coin-price
 * @access  Public
 */
const getCoinPrice = catchAsync(async (req, res) => {
  const cacheValue = await redisClient.get("coin-price");
  if (cacheValue) {
    return res.status(200).json(JSON.parse(cacheValue));
  }

  const prices = await fetchCoinPrices();
  await redisClient.set("coin-price", JSON.stringify(prices));
  await redisClient.expire("coin-price", process.env.REDIS_EXPIRES_IN);

  res.status(200).json(prices);
});

module.exports = { getBetHistory, getCoinPrice };
