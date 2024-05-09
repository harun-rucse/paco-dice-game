const express = require("express");
const stakeController = require("../controllers/stake");
const { auth, restrictTo } = require("../middlewares/auth");

const router = express.Router();

router.get("/stake-histories", stakeController.getStakeHistories);
router.post("/", auth, stakeController.createStake);
router.get("/payouts", auth, stakeController.getMyStakePayouts);
router.get("/pool", stakeController.getStakePool);
router.get("/calculator", auth, stakeController.getStakeCalculator);
router.post("/claim", auth, stakeController.claimMyStakeReward);
router.post("/unstake", auth, stakeController.unStake);
router.post(
  "/reset-burn",
  [auth, restrictTo("admin")],
  stakeController.resetBurn
);

module.exports = router;
