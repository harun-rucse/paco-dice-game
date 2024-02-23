const express = require("express");
const ticketController = require("../controllers/ticket");
const { auth, restrictTo } = require("../middlewares/auth");

const router = express.Router();

router.get("/last-round", ticketController.getLastRound);

router.use(auth);
router.get("/my-tickets", ticketController.getMyTickets);
router.get("/my-histories", ticketController.getMyHistories);
router.get("/all-bets", ticketController.getAllBets);
router.get("/statistics", ticketController.getTicketStatistics);

router
  .route("/")
  .get(restrictTo("admin"), ticketController.getAllTickets)
  .post(ticketController.createTicket);

router
  .route("/setting")
  .post(restrictTo("admin"), ticketController.createTicketSetting)
  .get(ticketController.getTicketSetting);

router.use(restrictTo("admin"));
router
  .route("/tier")
  .post(ticketController.createTicketTier)
  .get(ticketController.getTicketTier);

module.exports = router;
