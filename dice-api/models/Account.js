const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { Schema, model } = mongoose;

const accountSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    promoCode: String,
    privateKey: {
      type: String,
      required: true,
      select: false,
    },
    publicKey: {
      type: String,
      required: true,
    },
    btc: {
      type: Number,
      default: 0.0,
    },
    usdt: {
      type: Number,
      default: 0.0,
    },
    paco: {
      type: Number,
      default: 0.0,
    },
    eth: {
      type: Number,
      default: 0.0,
    },
    bnb: {
      type: Number,
      default: 0.0,
    },
    avatar: {
      type: String,
      default: "default.png",
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    passwordChangeAt: Date,
    passwordResetToken: String,
    passwordResetExpired: Date,
  },
  {
    timestamps: true,
  }
);

// Pre save hook that hash the password
accountSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Pre save hook that add passwordChangeAt when password is changed
accountSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangeAt = Date.now() - 1000;

  next();
});

// Return true if password is correct, otherwise return false
accountSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Return true if password is changed after JWT issued
accountSchema.methods.passwordChangeAfter = function (JWTTimestamp) {
  if (this.passwordChangeAt) {
    const passwordChangeTimestamp = parseInt(
      this.passwordChangeAt.getTime() / 1000,
      10
    );
    return passwordChangeTimestamp > JWTTimestamp;
  }

  return false;
};

const Account = model("Account", accountSchema);
module.exports = Account;
