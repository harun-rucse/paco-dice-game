const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const ticketSchema = new Schema(
  {
    account: {
      type: Schema.Types.ObjectId,
      ref: "Account",
    },
    type: {
      type: String,
      enum: ["STANDARD", "MEGA"],
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    tier: {
      type: String,
      enum: [
        "ZERO",
        "ONE",
        "TWO",
        "THREE",
        "FOUR",
        "FIVE",
        "MINOR_JACKPOT",
        "MEGA_JACKPOT",
      ],
      required: true,
    },
    reward: {
      type: Number,
      required: true,
      select: false,
    },
    round: {
      type: Number,
    },
    buyAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    timestamps: true,
  }
);

const Ticket = model("Ticket", ticketSchema);
module.exports = Ticket;
