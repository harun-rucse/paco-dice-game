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
      required: true,
    },
    reward: {
      type: Number,
      required: true,
      select: false,
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
