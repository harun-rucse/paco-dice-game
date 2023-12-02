const express = require("express");
const accountController = require("../controllers/account");
const { auth, restrictTo } = require("../middlewares/auth");

const router = express.Router();

router.get(
  "/user-transactions/:type",
  auth,
  accountController.getAllUserTransactions
);

router.get(
  "/withdraws",
  [auth, restrictTo("admin")],
  accountController.getAllWithdraw
);
router.get(
  "/withdrawables",
  [auth, restrictTo("admin")],
  accountController.getAllWithdrawables
);
router.patch(
  "/confirm-withdrawable/:id",
  [auth, restrictTo("admin")],
  accountController.confirmWithdrawableClaim
);
router.post("/withdraw", auth, accountController.withdraw);
router.patch(
  "/approve-withdraw/:id",
  [auth, restrictTo("admin")],
  accountController.confirmWithdraw
);
router.get("/stats", [auth, restrictTo("admin")], accountController.getStats);
router.get(
  "/withdrawable-stats",
  [auth, restrictTo("admin")],
  accountController.getWithdrawableStats
);

module.exports = router;
