const mongoose = require("mongoose");
const {
  GAMINGREFERRAL,
  STAKINGREFERRAL,
  FAUCETREFERRAL,
  LOTTERYREFERRAL,
  MININGREFERRAL,
} = require("../constants/ReferralTypes");
const { Schema, model } = mongoose;

const referralSchema = new Schema(
  {
    account: {
      type: Schema.Types.ObjectId,
      ref: "Account",
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
    totalBtc: {
      type: String,
      default: "0",
    },
    totalUsdt: {
      type: String,
      default: "0",
    },
    totalPaco: {
      type: String,
      default: "0",
    },
    totalEth: {
      type: String,
      default: "0",
    },
    totalBnb: {
      type: String,
      default: "0",
    },
    totalUsd: {
      type: String,
      default: "0",
    },
    type: {
      type: String,
      enum: [
        GAMINGREFERRAL,
        STAKINGREFERRAL,
        FAUCETREFERRAL,
        LOTTERYREFERRAL,
        MININGREFERRAL,
      ],
    },
  },
  {
    timestamps: true,
  }
);

const Referral = model("Referral", referralSchema);
module.exports = Referral;
