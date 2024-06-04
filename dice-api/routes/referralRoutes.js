const express = require("express");
const referralController = require("../controllers/referral");
const { auth } = require("../middlewares/auth");

const router = express.Router();

router.use(auth);
router.route("/").get(referralController.getMyAllReferredUsers);
router.route("/stats").get(referralController.getReferralStats);
router
  .route("/claim-commission")
  .post(referralController.createClaimCommission);
router
  .route("/commission-details")
  .get(referralController.getCommissionDetails);

module.exports = router;
