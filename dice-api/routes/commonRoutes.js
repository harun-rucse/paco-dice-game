const express = require("express");
const commonController = require("../controllers/common");

const router = express.Router();

router.get("/bet-histories", commonController.getBetHistory);

module.exports = router;
