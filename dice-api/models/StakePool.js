const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const stakePoolSchema = new Schema(
  {
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

const StakePool = model("StakePool", stakePoolSchema);
module.exports = StakePool;
