const express = require("express");
const ticketController = require("../controllers/ticket");
const { auth, restrictTo } = require("../middlewares/auth");

const router = express.Router();

router.use(auth);
router.get("/last-round", ticketController.getLastRound);
router.get("/my-tickets", ticketController.getMyTickets);
router.get("/my-histories", ticketController.getMyHistories);

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
