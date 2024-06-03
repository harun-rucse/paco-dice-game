const Account = require("../models/Account");
const Referral = require("../models/Referral");
const ReferralEarned = require("../models/ReferralEarned");
const ReferredUser = require("../models/ReferredUser");
const catchAsync = require("../utils/catch-async");
const { addition, divide } = require("../utils/decimal");
const {
  GAMING_COMMISSION,
  STAKING_COMMISSION,
  FAUCET_COMMISSION,
  LOTTERY_COMMISSION,
  MINED_COMMISSION,
} = require("../utils/referral-constants");

async function aggregateReferral(referral, type) {
  return await Referral.aggregate([
    {
      $match: { account: referral.account._id, type },
    },
    {
      $addFields: {
        btcConverted: {
          $add: [
            {
              $convert: { input: "$btc", to: "decimal", onError: 0, onNull: 0 },
            },
            {
              $convert: {
                input: "$totalBtc",
                to: "decimal",
                onError: 0,
                onNull: 0,
              },
            },
          ],
        },
        pacoConverted: {
          $add: [
            {
              $convert: {
                input: "$paco",
                to: "decimal",
                onError: 0,
                onNull: 0,
              },
            },
            {
              $convert: {
                input: "$totalPaco",
                to: "decimal",
                onError: 0,
                onNull: 0,
              },
            },
          ],
        },
        usdtConverted: {
          $add: [
            {
              $convert: {
                input: "$usdt",
                to: "decimal",
                onError: 0,
                onNull: 0,
              },
            },
            {
              $convert: {
                input: "$totalUsdt",
                to: "decimal",
                onError: 0,
                onNull: 0,
              },
            },
          ],
        },
        ethConverted: {
          $add: [
            {
              $convert: { input: "$eth", to: "decimal", onError: 0, onNull: 0 },
            },
            {
              $convert: {
                input: "$totalEth",
                to: "decimal",
                onError: 0,
                onNull: 0,
              },
            },
          ],
        },
        bnbConverted: {
          $add: [
            {
              $convert: { input: "$bnb", to: "decimal", onError: 0, onNull: 0 },
            },
            {
              $convert: {
                input: "$totalBnb",
                to: "decimal",
                onError: 0,
                onNull: 0,
              },
            },
          ],
        },
      },
    },
    {
      $group: {
        _id: "$type",
        btc: { $sum: "$btcConverted" },
        paco: { $sum: "$pacoConverted" },
        usdt: { $sum: "$usdtConverted" },
        eth: { $sum: "$ethConverted" },
        bnb: { $sum: "$bnbConverted" },
      },
    },
    {
      $project: {
        btc: { $toString: "$btc" },
        paco: { $toString: "$paco" },
        usdt: { $toString: "$usdt" },
        eth: { $toString: "$eth" },
        bnb: { $toString: "$bnb" },
      },
    },
  ]);
}

async function aggregateForCurrentCommissionReferral(referral) {
  return await Referral.aggregate([
    {
      $match: { account: referral.account._id },
    },
    {
      $group: {
        _id: null,
        paco: {
          $sum: {
            $convert: {
              input: "$paco",
              to: "decimal",
              onError: 0,
              onNull: 0,
            },
          },
        },
        btc: {
          $sum: {
            $convert: {
              input: "$btc",
              to: "decimal",
              onError: 0,
              onNull: 0,
            },
          },
        },
        eth: {
          $sum: {
            $convert: {
              input: "$eth",
              to: "decimal",
              onError: 0,
              onNull: 0,
            },
          },
        },
        usdt: {
          $sum: {
            $convert: {
              input: "$usdt",
              to: "decimal",
              onError: 0,
              onNull: 0,
            },
          },
        },
        bnb: {
          $sum: {
            $convert: {
              input: "$bnb",
              to: "decimal",
              onError: 0,
              onNull: 0,
            },
          },
        },
      },
    },
    {
      $project: {
        btc: { $toString: "$btc" },
        paco: { $toString: "$paco" },
        usdt: { $toString: "$usdt" },
        eth: { $toString: "$eth" },
        bnb: { $toString: "$bnb" },
      },
    },
  ]);
}

/**
 * @desc    Get all referred users
 * @route   GET /api/referrals
 * @access  Private
 */
const getMyAllReferredUsers = catchAsync(async (req, res, next) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const query = { referredBy: req.account._id };

  const count = await ReferredUser.countDocuments(query);
  const allReferredUser = await ReferredUser.find(query)
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(limit * (page - 1))
    .populate("account", "username createdAt");

  const data = [];
  // Aggregation
  await Promise.all(
    allReferredUser.map(async (referral) => {
      const gamingReferral = await aggregateReferral(referral, "gaming");
      const stakingReferral = await aggregateReferral(referral, "staking");
      const faucetReferral = await aggregateReferral(referral, "faucet");
      const lotteryReferral = await aggregateReferral(referral, "lottery");
      const minedReferral = await aggregateReferral(referral, "mining");

      if (
        gamingReferral.length === 0 &&
        stakingReferral.length === 0 &&
        faucetReferral.length === 0 &&
        lotteryReferral.length === 0 &&
        minedReferral.length === 0
      ) {
        data.push({
          _id: referral._id,
          user: referral.account.username,
          memberSince: referral.account.createdAt,
          wagered: {
            btc: 0,
            paco: 0,
            eth: 0,
            bnb: 0,
            usdt: 0,
          },
          commission: {
            btc: 0,
            paco: 0,
            eth: 0,
            bnb: 0,
            usdt: 0,
          },
        });
      } else {
        const gamingBtc = gamingReferral?.[0]?.btc || 0;
        const stakingBtc = stakingReferral?.[0]?.btc || 0;
        const faucetBtc = faucetReferral?.[0]?.btc || 0;
        const lotteryBtc = lotteryReferral?.[0]?.btc || 0;
        const minedBtc = minedReferral?.[0]?.btc || 0;

        const totalBtc = addition(
          gamingBtc,
          stakingBtc,
          faucetBtc,
          lotteryBtc,
          minedBtc
        );

        const gamingPaco = gamingReferral?.[0]?.paco || 0;
        const stakingPaco = stakingReferral?.[0]?.paco || 0;
        const faucetPaco = faucetReferral?.[0]?.paco || 0;
        const lotteryPaco = lotteryReferral?.[0]?.paco || 0;
        const minedPaco = minedReferral?.[0]?.paco || 0;

        const totalPaco = addition(
          gamingPaco,
          stakingPaco,
          faucetPaco,
          lotteryPaco,
          minedPaco
        );

        const gamingUsdt = gamingReferral?.[0]?.usdt || 0;
        const stakingUsdt = stakingReferral?.[0]?.usdt || 0;
        const faucetUsdt = faucetReferral?.[0]?.usdt || 0;
        const lotteryUsdt = lotteryReferral?.[0]?.usdt || 0;
        const minedUsdt = minedReferral?.[0]?.usdt || 0;

        const totalUsdt = addition(
          gamingUsdt,
          stakingUsdt,
          faucetUsdt,
          lotteryUsdt,
          minedUsdt
        );

        const gamingEth = gamingReferral?.[0]?.eth || 0;
        const stakingEth = stakingReferral?.[0]?.eth || 0;
        const faucetEth = faucetReferral?.[0]?.eth || 0;
        const lotteryEth = lotteryReferral?.[0]?.eth || 0;
        const minedEth = minedReferral?.[0]?.eth || 0;

        const totalEth = addition(
          gamingEth,
          stakingEth,
          faucetEth,
          lotteryEth,
          minedEth
        );

        const gamingBnb = gamingReferral?.[0]?.bnb || 0;
        const stakingBnb = stakingReferral?.[0]?.bnb || 0;
        const faucetBnb = faucetReferral?.[0]?.bnb || 0;
        const lotteryBnb = lotteryReferral?.[0]?.bnb || 0;
        const minedBnb = minedReferral?.[0]?.bnb || 0;

        const totalBnb = addition(
          gamingBnb,
          stakingBnb,
          faucetBnb,
          lotteryBnb,
          minedBnb
        );

        // Wagered calculation
        const gamingWageredBtc = divide(gamingBtc, GAMING_COMMISSION);
        const stakingWageredBtc = divide(stakingBtc, STAKING_COMMISSION);
        const faucetWageredBtc = divide(faucetBtc, FAUCET_COMMISSION);
        const lotteryWageredBtc = divide(lotteryBtc, LOTTERY_COMMISSION);
        const minedWageredBtc = divide(minedBtc, MINED_COMMISSION);

        const gamingWageredPaco = divide(gamingPaco, GAMING_COMMISSION);
        const stakingWageredPaco = divide(stakingPaco, STAKING_COMMISSION);
        const faucetWageredPaco = divide(faucetPaco, FAUCET_COMMISSION);
        const lotteryWageredPaco = divide(lotteryPaco, LOTTERY_COMMISSION);
        const minedWageredPaco = divide(minedPaco, MINED_COMMISSION);

        const gamingWageredEth = divide(gamingEth, GAMING_COMMISSION);
        const stakingWageredEth = divide(stakingEth, STAKING_COMMISSION);
        const faucetWageredEth = divide(faucetEth, FAUCET_COMMISSION);
        const lotteryWageredEth = divide(lotteryEth, LOTTERY_COMMISSION);
        const minedWageredEth = divide(minedEth, MINED_COMMISSION);

        const gamingWageredUsdt = divide(gamingUsdt, GAMING_COMMISSION);
        const stakingWageredUsdt = divide(stakingUsdt, STAKING_COMMISSION);
        const faucetWageredUsdt = divide(faucetUsdt, FAUCET_COMMISSION);
        const lotteryWageredUsdt = divide(lotteryUsdt, LOTTERY_COMMISSION);
        const minedWageredUsdt = divide(minedUsdt, MINED_COMMISSION);

        const gamingWageredBnb = divide(gamingBnb, GAMING_COMMISSION);
        const stakingWageredBnb = divide(stakingBnb, STAKING_COMMISSION);
        const faucetWageredBnb = divide(faucetBnb, FAUCET_COMMISSION);
        const lotteryWageredBnb = divide(lotteryBnb, LOTTERY_COMMISSION);
        const minedWageredBnb = divide(minedBnb, MINED_COMMISSION);

        data.push({
          _id: referral._id,
          user: referral.account.username,
          memberSince: referral.account.createdAt,
          wagered: {
            btc: addition(
              gamingWageredBtc,
              stakingWageredBtc,
              faucetWageredBtc,
              lotteryWageredBtc,
              minedWageredBtc
            ),
            paco: addition(
              gamingWageredPaco,
              stakingWageredPaco,
              faucetWageredPaco,
              lotteryWageredPaco,
              minedWageredPaco
            ),
            eth: addition(
              gamingWageredEth,
              stakingWageredEth,
              faucetWageredEth,
              lotteryWageredEth,
              minedWageredEth
            ),
            bnb: addition(
              gamingWageredBnb,
              stakingWageredBnb,
              faucetWageredBnb,
              lotteryWageredBnb,
              minedWageredBnb
            ),
            usdt: addition(
              gamingWageredUsdt,
              stakingWageredUsdt,
              faucetWageredUsdt,
              lotteryWageredUsdt,
              minedWageredUsdt
            ),
          },
          commission: {
            btc: totalBtc,
            paco: totalPaco,
            eth: totalEth,
            bnb: totalBnb,
            usdt: totalUsdt,
          },
        });
      }
    })
  );

  res.status(200).json({ result: data, count });
});

/**
 * @desc    Get commission details
 * @route   GET /api/referrals/commission-details
 * @access  Private
 */
const getCommissionDetails = catchAsync(async (req, res, next) => {
  const allReferredUser = await ReferredUser.find({
    referredBy: req.account._id,
  });

  let totalGamingBtc = 0;
  let totalGamingPaco = 0;
  let totalGamingUsdt = 0;
  let totalGamingEth = 0;
  let totalGamingBnb = 0;

  let totalStakingBtc = 0;
  let totalStakingPaco = 0;
  let totalStakingUsdt = 0;
  let totalStakingEth = 0;
  let totalStakingBnb = 0;

  let totalFaucetPaco = 0;
  let totalLotteryPaco = 0;
  let totalMinedPaco = 0;

  await Promise.all(
    allReferredUser.map(async (referral) => {
      const gamingReferral = await aggregateReferral(referral, "gaming");
      const stakingReferral = await aggregateReferral(referral, "staking");
      const faucetReferral = await aggregateReferral(referral, "faucet");
      const lotteryReferral = await aggregateReferral(referral, "lottery");
      const minedReferral = await aggregateReferral(referral, "mining");

      if (
        gamingReferral.length === 0 &&
        stakingReferral.length === 0 &&
        faucetReferral.length === 0 &&
        lotteryReferral.length === 0 &&
        minedReferral.length === 0
      ) {
        data.push({
          gaming: {
            btc: 0,
            paco: 0,
            eth: 0,
            bnb: 0,
            usdt: 0,
          },
          staking: {
            btc: 0,
            paco: 0,
            eth: 0,
            bnb: 0,
            usdt: 0,
          },
          faucet: { paco: 0 },
          lottery: { paco: 0 },
          mined: { paco: 0 },
        });
      } else {
        const gamingBtc = gamingReferral?.[0]?.btc || 0;
        const gamingPaco = gamingReferral?.[0]?.paco || 0;
        const gamingUsdt = gamingReferral?.[0]?.usdt || 0;
        const gamingEth = gamingReferral?.[0]?.eth || 0;
        const gamingBnb = gamingReferral?.[0]?.bnb || 0;

        const stakingBtc = stakingReferral?.[0]?.btc || 0;
        const stakingPaco = stakingReferral?.[0]?.paco || 0;
        const stakingUsdt = stakingReferral?.[0]?.usdt || 0;
        const stakingEth = stakingReferral?.[0]?.eth || 0;
        const stakingBnb = stakingReferral?.[0]?.bnb || 0;

        const faucetPaco = faucetReferral?.[0]?.paco || 0;
        const lotteryPaco = lotteryReferral?.[0]?.paco || 0;
        const minedPaco = minedReferral?.[0]?.paco || 0;

        totalGamingBtc = addition(totalGamingBtc, gamingBtc);
        totalGamingPaco = addition(totalGamingPaco, gamingPaco);
        totalGamingEth = addition(totalGamingEth, gamingEth);
        totalGamingUsdt = addition(totalGamingUsdt, gamingUsdt);
        totalGamingBnb = addition(totalGamingBnb, gamingBnb);

        totalStakingBtc = addition(totalStakingBtc, stakingBtc);
        totalStakingPaco = addition(totalStakingPaco, stakingPaco);
        totalStakingEth = addition(totalStakingEth, stakingEth);
        totalStakingUsdt = addition(totalStakingUsdt, stakingUsdt);
        totalStakingBnb = addition(totalStakingBnb, stakingBnb);

        totalFaucetPaco = addition(totalFaucetPaco, faucetPaco);
        totalLotteryPaco = addition(totalLotteryPaco, lotteryPaco);
        totalMinedPaco = addition(totalMinedPaco, minedPaco);
      }
    })
  );

  const data = {
    gaming: {
      btc: totalGamingBtc,
      paco: totalGamingPaco,
      eth: totalGamingEth,
      bnb: totalGamingBnb,
      usdt: totalGamingUsdt,
    },
    staking: {
      btc: totalStakingBtc,
      paco: totalStakingPaco,
      eth: totalStakingEth,
      bnb: totalStakingBnb,
      usdt: totalStakingUsdt,
    },
    faucet: { paco: totalFaucetPaco },
    lottery: { paco: totalLotteryPaco },
    mined: { paco: totalMinedPaco },
  };

  res.status(200).json(data);
});

/**
 * @desc    Get referral stats
 * @route   GET /api/referrals/stats
 * @access  Private
 */
const getReferralStats = catchAsync(async (req, res, next) => {
  const query = { referredBy: req.account._id };
  // My total referral
  const totalReferral = await ReferredUser.countDocuments(query);

  // My total earned
  const referralEarned = await ReferralEarned.aggregate([
    {
      $match: { account: req.account._id },
    },
    {
      $group: {
        _id: null,
        paco: {
          $sum: {
            $convert: {
              input: "$paco",
              to: "decimal",
              onError: 0,
              onNull: 0,
            },
          },
        },
        btc: {
          $sum: {
            $convert: {
              input: "$btc",
              to: "decimal",
              onError: 0,
              onNull: 0,
            },
          },
        },
        usdt: {
          $sum: {
            $convert: {
              input: "$usdt",
              to: "decimal",
              onError: 0,
              onNull: 0,
            },
          },
        },
        eth: {
          $sum: {
            $convert: {
              input: "$eth",
              to: "decimal",
              onError: 0,
              onNull: 0,
            },
          },
        },
        bnb: {
          $sum: {
            $convert: {
              input: "$bnb",
              to: "decimal",
              onError: 0,
              onNull: 0,
            },
          },
        },
      },
    },
    {
      $project: {
        btc: { $toString: "$btc" },
        paco: { $toString: "$paco" },
        usdt: { $toString: "$usdt" },
        eth: { $toString: "$eth" },
        bnb: { $toString: "$bnb" },
      },
    },
  ]);

  // Get total commission and wager
  const allReferredUser = await ReferredUser.find(query);

  let totalGamingBtc = 0;
  let totalGamingPaco = 0;
  let totalGamingEth = 0;
  let totalGamingUsdt = 0;
  let totalGamingBnb = 0;

  let totalStakingBtc = 0;
  let totalStakingPaco = 0;
  let totalStakingEth = 0;
  let totalStakingUsdt = 0;
  let totalStakingBnb = 0;

  let totalFaucetPaco = 0;
  let totalLotteryPaco = 0;
  let totalMinedPaco = 0;

  // Commission
  let totalBtc = 0;
  let totalPaco = 0;
  let totalUsdt = 0;
  let totalEth = 0;
  let totalBnb = 0;

  await Promise.all(
    allReferredUser.map(async (referral) => {
      // Wager
      const gamingReferral = await aggregateReferral(referral, "gaming");
      const stakingReferral = await aggregateReferral(referral, "staking");
      const faucetReferral = await aggregateReferral(referral, "faucet");
      const lotteryReferral = await aggregateReferral(referral, "lottery");
      const minedReferral = await aggregateReferral(referral, "mining");

      if (gamingReferral.length > 0) {
        const gamingBtc = gamingReferral?.[0]?.btc || 0;
        totalGamingBtc = addition(totalGamingBtc, gamingBtc);

        const gamingPaco = gamingReferral?.[0]?.paco || 0;
        totalGamingPaco = addition(totalGamingPaco, gamingPaco);

        const gamingEth = gamingReferral?.[0]?.eth || 0;
        totalGamingEth = addition(totalGamingEth, gamingEth);

        const gamingUsdt = gamingReferral?.[0]?.usdt || 0;
        totalGamingUsdt = addition(totalGamingUsdt, gamingUsdt);

        const gamingBnb = gamingReferral?.[0]?.bnb || 0;
        totalGamingBnb = addition(totalGamingBnb, gamingBnb);
      }

      if (stakingReferral.length > 0) {
        const stakingBtc = stakingReferral?.[0]?.btc || 0;
        totalStakingBtc = addition(totalStakingBtc, stakingBtc);

        const stakingPaco = stakingReferral?.[0]?.paco || 0;
        totalStakingPaco = addition(totalStakingPaco, stakingPaco);

        const stakingEth = stakingReferral?.[0]?.eth || 0;
        totalStakingEth = addition(totalStakingEth, stakingEth);

        const stakingUsdt = stakingReferral?.[0]?.usdt || 0;
        totalStakingUsdt = addition(totalStakingUsdt, stakingUsdt);

        const stakingBnb = stakingReferral?.[0]?.bnb || 0;
        totalStakingBnb = addition(totalStakingBnb, stakingBnb);
      }

      if (faucetReferral.length > 0) {
        const faucetPaco = faucetReferral?.[0]?.paco || 0;
        totalFaucetPaco = addition(totalFaucetPaco, faucetPaco);
      }

      if (lotteryReferral.length > 0) {
        const lotteryPaco = lotteryReferral?.[0]?.paco || 0;
        totalLotteryPaco = addition(totalLotteryPaco, lotteryPaco);
      }

      if (minedReferral.length > 0) {
        const minedPaco = minedReferral?.[0]?.paco || 0;
        totalMinedPaco = addition(totalMinedPaco, minedPaco);
      }

      // Commission calculation
      const commissions = await aggregateForCurrentCommissionReferral(referral);
      if (commissions.length > 0) {
        totalBtc = addition(totalBtc, commissions?.[0]?.btc || 0);
        totalPaco = addition(totalPaco, commissions?.[0]?.paco || 0);
        totalUsdt = addition(totalUsdt, commissions?.[0]?.usdt || 0);
        totalEth = addition(totalEth, commissions?.[0]?.eth || 0);
        totalBnb = addition(totalBnb, commissions?.[0]?.bnb || 0);
      }
    })
  );

  // Wager calculation
  const gamingWageredBtc = divide(totalGamingBtc, GAMING_COMMISSION);
  const stakingWageredBtc = divide(totalStakingBtc, STAKING_COMMISSION);

  const gamingWageredPaco = divide(totalGamingPaco, GAMING_COMMISSION);
  const stakingWageredPaco = divide(totalStakingPaco, STAKING_COMMISSION);
  const faucetWageredPaco = divide(totalFaucetPaco, FAUCET_COMMISSION);
  const lotteryWageredPaco = divide(totalLotteryPaco, LOTTERY_COMMISSION);
  const minedWageredPaco = divide(totalMinedPaco, MINED_COMMISSION);

  const gamingWageredEth = divide(totalGamingEth, GAMING_COMMISSION);
  const stakingWageredEth = divide(totalStakingEth, STAKING_COMMISSION);

  const gamingWageredUsdt = divide(totalGamingUsdt, GAMING_COMMISSION);
  const stakingWageredUsdt = divide(totalStakingUsdt, STAKING_COMMISSION);

  const gamingWageredBnb = divide(totalGamingBnb, GAMING_COMMISSION);
  const stakingWageredBnb = divide(totalStakingBnb, STAKING_COMMISSION);

  let data = {
    totalReferral,
    totalEarned: {
      paco: "0",
      eth: "0",
      btc: "0",
      usdt: "0",
      bnb: "0",
    },
    wagered: {
      btc: addition(gamingWageredBtc, stakingWageredBtc),
      paco: addition(
        gamingWageredPaco,
        stakingWageredPaco,
        faucetWageredPaco,
        lotteryWageredPaco,
        minedWageredPaco
      ),
      eth: addition(gamingWageredEth, stakingWageredEth),
      bnb: addition(gamingWageredBnb, stakingWageredBnb),
      usdt: addition(gamingWageredUsdt, stakingWageredUsdt),
    },
    commission: {
      btc: totalBtc,
      paco: totalPaco,
      eth: totalEth,
      bnb: totalBnb,
      usdt: totalUsdt,
    },
  };

  if (referralEarned.length === 0) {
    return res.status(200).json(data);
  }

  const totalEarning = referralEarned[0];

  data = {
    ...data,
    totalEarned: {
      paco: totalEarning.paco,
      eth: totalEarning.eth,
      btc: totalEarning.btc,
      usdt: totalEarning.usdt,
      bnb: totalEarning.bnb,
    },
  };

  res.status(200).json(data);
});

/**
 * @desc    Create claim commission
 * @route   POST /api/referrals/claim-commission
 * @access  Private
 */
const createClaimCommission = catchAsync(async (req, res, next) => {
  const allReferredUser = await ReferredUser.find({
    referredBy: req.account._id,
  });
  const referralEarned = await ReferralEarned.findOne({
    account: req.account._id,
  });

  const account = await Account.findById(req.account._id);

  let totalValue = "0";

  await Promise.all(
    allReferredUser.map(async (referredUser) => {
      const referrals = await Referral.find({
        account: referredUser.account,
      });

      await Promise.all(
        referrals.map(async (referral) => {
          referralEarned.paco = addition(referralEarned.paco, referral.paco);
          referral.totalPaco = addition(referral.totalPaco, referral.paco);
          account.paco = addition(account.paco, referral.paco);
          totalValue = addition(totalValue, referral.paco);
          referral.paco = "0";

          referralEarned.btc = addition(referralEarned.btc, referral.btc);
          referral.totalBtc = addition(referral.totalBtc, referral.btc);
          account.btc = addition(account.btc, referral.btc);
          totalValue = addition(totalValue, referral.btc);
          referral.btc = "0";

          referralEarned.usdt = addition(referralEarned.usdt, referral.usdt);
          referral.totalUsdt = addition(referral.totalUsdt, referral.usdt);
          account.usdt = addition(account.usdt, referral.usdt);
          totalValue = addition(totalValue, referral.usdt);
          referral.usdt = "0";

          referralEarned.eth = addition(referralEarned.eth, referral.eth);
          referral.totalEth = addition(referral.totalEth, referral.eth);
          account.eth = addition(account.eth, referral.eth);
          totalValue = addition(totalValue, referral.eth);
          referral.eth = "0";

          referralEarned.bnb = addition(referralEarned.bnb, referral.bnb);
          referral.totalBnb = addition(referral.totalBnb, referral.bnb);
          account.bnb = addition(account.bnb, referral.bnb);
          totalValue = addition(totalValue, referral.bnb);
          referral.bnb = "0";

          await referral.save();
        })
      );
    })
  );

  await referralEarned.save();
  await account.save();

  if (totalValue == "0") {
    return res.status(200).json({ success: false });
  }

  res.status(200).json({ success: true });
});

module.exports = {
  getMyAllReferredUsers,
  getCommissionDetails,
  getReferralStats,
  createClaimCommission,
};
