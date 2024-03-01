const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const tickerTierSchema = new Schema(
  {
    ZERO: {
      type: String,
      default: "0",
    },
    ONE: {
      type: String,
      required: true,
    },
    TWO: {
      type: String,
      required: true,
    },
    THREE: {
      type: String,
      required: true,
    },
    FOUR: {
      type: String,
      required: true,
    },
    FIVE: {
      type: String,
      required: true,
    },
    SIX: {
      type: String,
      required: true,
    },
    SEVEN: {
      type: String,
      required: true,
    },
    EIGHT: {
      type: String,
      required: true,
    },
    NINE: {
      type: String,
      required: true,
    },
    TEN: {
      type: String,
      required: true,
    },
    ELEVEN: {
      type: String,
      default: "0",
    },
    TWELVE: {
      type: String,
      default: "0",
    },
    THIRTEEN: {
      type: String,
      default: "0",
    },
    FOURTEEN: {
      type: String,
      default: "0",
    },
  },
  {
    timestamps: true,
  }
);

const TickerTier = model("TickerTier", tickerTierSchema);
module.exports = TickerTier;
