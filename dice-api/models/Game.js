const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const gameSchema = new Schema(
  {
    publicKey: {
      type: String,
      required: true,
    },
    betAmount: {
      type: String,
      required: true,
    },
    betCoin: {
      type: String,
      required: true,
    },
    rewardAmount: {
      type: String,
      required: true,
    },
    prediction: {
      type: Number,
      required: true,
    },
    winNumber: {
      type: Number,
      required: true,
    },
    randomSeed: {
      type: String,
      required: true,
    },
    hashRound: {
      type: String,
      required: true,
    },
    multiplier: {
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
