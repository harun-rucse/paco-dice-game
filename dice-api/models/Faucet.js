const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const faucetSchema = new Schema(
  {
    account: {
      type: Schema.Types.ObjectId,
      ref: "Account",
    },
    totalClaimedAmount: {
      type: String,
      default: "0",
    },
    lastClaimedDate: {
      type: Date,
      default: Date.now,
    },
    totalWagerAmount: {
      type: String,
      default: "0",
    },
    availableGambleAmount: {
      type: String,
      default: "0",
    },
    lastMultiplier: {
      type: String,
      default: "1",
    },
    level: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

const Faucet = model("Faucet", faucetSchema);
module.exports = Faucet;
