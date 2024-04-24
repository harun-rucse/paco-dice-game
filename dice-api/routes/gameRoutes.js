const express = require("express");
const gameController = require("../controllers/game");
const { auth, checkAuth } = require("../middlewares/auth");

const router = express.Router();

router.post("/", auth, gameController.createGame);
router.get("/", auth, gameController.getGamesHistory);
router.get("/bet-histories", checkAuth, gameController.getBetHistory);
router.get("/live-chart", checkAuth, gameController.getLiveChart);

module.exports = router;
