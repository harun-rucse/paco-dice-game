const express = require("express");
const authController = require("../controllers/auth");
const { auth } = require("../middlewares/auth");

const router = express.Router();

router.post("/login", authController.login);
router.post("/register", authController.register);
router.post("/forgot-password", authController.forgotPassword);
router.patch("/reset-password/:resetToken", authController.resetPassword);

router.get("/current-user", auth, authController.currentUser);
router.patch("/update-password", auth, authController.updatePassword);

module.exports = router;
