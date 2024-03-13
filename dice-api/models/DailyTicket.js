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
