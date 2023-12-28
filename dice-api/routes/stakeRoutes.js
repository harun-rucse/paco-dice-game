const express = require("express");
const stakeController = require("../controllers/stake");
const { auth } = require("../middlewares/auth");

const router = express.Router();

router.post("/", auth, stakeController.createStake);
router.get("/payouts", auth, stakeController.getStakePayouts);

module.exports = router;
