const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const referralEarnedSchema = new Schema(
  {
    account: {
      type: Schema.Types.ObjectId,
      ref: "Account",
      unique: true,
    },
    btc: {
      type: String,
      default: "0",
    },
    usdt: {
      type: String,
      default: "0",
    },
    paco: {
      type: String,
      default: "0",
    },
    eth: {
      type: String,
      default: "0",
    },
    bnb: {
      type: String,
      default: "0",
    },
  },
  {
    timestamps: true,
  }
);

const ReferralEarned = model("ReferralEarned", referralEarnedSchema);
module.exports = ReferralEarned;
