const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const withdrawableSchema = new Schema(
  {
    privateKey: {
      type: String,
      required: true,
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
    tokenName: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "success"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const Withdrawable = model("Withdrawable", withdrawableSchema);
module.exports = Withdrawable;
