const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const gameSchema = new Schema(
  {
    playerAddress: {
      type: String,
      required: true,
    },
    betAmount: {
      type: Number,
      required: true,
    },
    rewardAmount: {
      type: Number,
      required: true,
    },
    betNumber: {
      type: Number,
      required: true,
    },
    winNumber: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["lost", "win"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Game = model("Game", gameSchema);
module.exports = Game;
