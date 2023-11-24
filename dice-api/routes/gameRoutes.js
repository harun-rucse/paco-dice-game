const express = require("express");
const gameController = require("../controllers/game");
const { auth } = require("../middlewares/auth");

const router = express.Router();

router.post("/", auth, gameController.createGame);
router.get("/", auth, gameController.getGamesHistory);

module.exports = router;
