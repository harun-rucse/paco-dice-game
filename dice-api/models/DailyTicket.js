const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const dailyTicketSchema = new Schema(
  {
    account: {
      type: Schema.Types.ObjectId,
      ref: "Account",
    },
    rewardAmount: {
      type: Number,
      required: true,
    },
    poolAmount: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    timestamps: true,
  }
);

const DailyTicket = model("DailyTicket", dailyTicketSchema);
module.exports = DailyTicket;
