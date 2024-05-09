const express = require("express");
const commonController = require("../controllers/common");

const router = express.Router();

router.get("/bet-histories", commonController.getBetHistory);
router.get("/coin-price", commonController.getCoinPrice);

module.exports = router;
