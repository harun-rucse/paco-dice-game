const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const ticketPoolSchema = new Schema(
  {
    MINOR_JACKPOT: {
      type: String,
      default: "0",
    },
    MEGA_JACKPOT: {
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
  },
  {
    timestamps: true,
  }
);

const TicketPool = model("TicketPool", ticketPoolSchema);
module.exports = TicketPool;
