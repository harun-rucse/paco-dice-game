const express = require("express");
const faucetController = require("../controllers/faucet");
const { auth } = require("../middlewares/auth");

const router = express.Router();

router.get("/my", auth, faucetController.getMyFaucet);
router.post("/claim-reward", auth, faucetController.claimFaucetReward);
router.post("/gamble-reward", auth, faucetController.gambleReward);

module.exports = router;
