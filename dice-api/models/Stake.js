const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const stakeSchema = new Schema(
  {
    account: {
      type: Schema.Types.ObjectId,
      ref: "Account",
    },
    amount: {
      type: String,
      required: true,
    },
    tokenName: {
      type: String,
      default: "paco",
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

const Stake = model("Stake", stakeSchema);
module.exports = Stake;
