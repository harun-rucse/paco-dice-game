const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const dailyTicketSchema = new Schema(
  {
    account: {
      type: Schema.Types.ObjectId,
      ref: "Account",
    },
    REWARD: {
      type: String,
      default: "0",
    },
    REVENUE_SHARING_POOL: {
      type: String,
      default: "0",
    },
    MINOR_JACKPOT: {
      type: String,
      default: "0",
    },
    MEGA_JACKPOT: {
      type: String,
      default: "0",
    },
    MINOR_JACKPOT_REDUCE: {
      type: String,
      default: "0",
    },
    MEGA_JACKPOT_REDUCE: {
      type: String,
      default: "0",
    },
    RESERVE: {
      type: String,
      default: "0",
    },
    BONUS: {
      type: String,
      default: "0",
    },
    TEAM: {
      type: String,
      default: "0",
    },
    PACO_BURNT: {
      type: String,
      default: "0",
    },
    FEE: {
      type: String,
      default: "0",
    },
    TIER_ZERO: {
      type: String,
      default: "0",
    },
    TIER_ONE: {
      type: String,
      default: "0",
    },
    TIER_TWO: {
      type: String,
      default: "0",
    },
    TIER_THREE: {
      type: String,
      default: "0",
    },
    TIER_FOUR: {
      type: String,
      default: "0",
    },
    TIER_FIVE: {
      type: String,
      default: "0",
    },
    TIER_SIX: {
      type: String,
      default: "0",
    },
    TIER_SEVEN: {
      type: String,
      default: "0",
    },
    TIER_EIGHT: {
      type: String,
      default: "0",
    },
    TIER_NINE: {
      type: String,
      default: "0",
    },
    TIER_TEN: {
      type: String,
      default: "0",
    },
    TIER_ELEVEN: {
      type: String,
      default: "0",
    },
    TIER_TWELVE: {
      type: String,
      default: "0",
    },
    TIER_THIRTEEN: {
      type: String,
      default: "0",
    },
    TIER_FOURTEEN: {
      type: String,
      default: "0",
    },
    STANDARD: {
      type: String,
      default: "0",
    },
    MEGA: {
      type: String,
      default: "0",
    },
    STANDARD_LOOSING: {
      type: String,
      default: "0",
    },
    MEGA_LOOSING: {
      type: String,
      default: "0",
    },
    PACO_SPENT: {
      type: String,
      default: "0",
    },
    round: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const DailyTicket = model("DailyTicket", dailyTicketSchema);
module.exports = DailyTicket;
