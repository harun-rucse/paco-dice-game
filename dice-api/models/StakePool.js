const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const stakePoolSchema = new Schema(
  {
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

const StakePool = model("StakePool", stakePoolSchema);
module.exports = StakePool;
