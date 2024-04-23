const Game = require("../models/Game");
const Account = require("../models/Account");
const catchAsync = require("../utils/catch-async");

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

module.exports = { getBetHistory };
