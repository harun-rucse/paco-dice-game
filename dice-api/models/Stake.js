const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const stakeSchema = new Schema(
  {
    account: {
      type: Schema.Types.ObjectId,
      ref: "Account",
    },
    amount: {
      type: Number,
      required: true,
    },
    tokenName: {
      type: String,
      default: "paco",
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
  },
  {
    timestamps: true,
  }
);

const Stake = model("Stake", stakeSchema);
module.exports = Stake;
