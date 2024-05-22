const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const tokenPriceSchema = new Schema(
  {
    btc: {
      type: String,
      default: 0,
    },
    usdt: {
      type: String,
      default: 1,
    },
    paco: {
      type: String,
      default: 0,
    },
    eth: {
      type: String,
      default: 0,
    },
    bnb: {
      type: String,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const TokenPrice = model("TokenPrice", tokenPriceSchema);
module.exports = TokenPrice;
