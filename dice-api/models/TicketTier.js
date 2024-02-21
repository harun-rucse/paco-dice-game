const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const tickerTierSchema = new Schema(
  {
    ZERO: {
      type: Number,
      default: 0,
    },
    ONE: {
      type: Number,
      required: true,
    },
    TWO: {
      type: Number,
      required: true,
    },
    THREE: {
      type: Number,
      required: true,
    },
    FOUR: {
      type: Number,
      required: true,
    },
    FIVE: {
      type: Number,
      required: true,
    },
    MINOR_JACKPOT: {
      type: Number,
      required: true,
    },
    MEGA_JACKPOT: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const TickerTier = model("TickerTier", tickerTierSchema);
module.exports = TickerTier;
