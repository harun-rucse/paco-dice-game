const express = require("express");
const accountController = require("../controllers/account");
const { auth, restrictTo } = require("../middlewares/auth");

const router = express.Router();
router.get(
  "/withdraws",
  [auth, restrictTo("admin")],
  accountController.getAllWithdraw
);
router.post("/withdraw", auth, accountController.withdraw);
router.patch(
  "/approve-withdraw/:id",
  [auth, restrictTo("admin")],
  accountController.confirmWithdraw
);
router.get("/stats", [auth, restrictTo("admin")], accountController.getStats);

module.exports = router;
