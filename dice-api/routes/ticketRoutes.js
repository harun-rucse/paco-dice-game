const express = require("express");
const ticketController = require("../controllers/ticket");
const { auth, restrictTo } = require("../middlewares/auth");

const router = express.Router();

router.get("/my-tickets", auth, ticketController.getMyTickets);

router
  .route("/")
  .get([auth, restrictTo("admin")], ticketController.getAllTickets)
  .post(auth, ticketController.createTicket);

router.use([auth, restrictTo("admin")]);
router
  .route("/setting")
  .post(ticketController.createTicketSetting)
  .get(ticketController.getTicketSetting);

router
  .route("/tier")
  .post(ticketController.createTicketTier)
  .get(ticketController.getTicketTier);

module.exports = router;
