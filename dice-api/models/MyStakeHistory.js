const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const myStakeHistorySchema = new Schema(
  {
    account: {
      type: Schema.Types.ObjectId,
      ref: "Account",
    },
    totalStakePaco: {
      type: String,
      required: true,
    },
    tokenName: {
      type: String,
      default: "paco",
    },
    btc: {
      type: String,
      default: "0",
    },
    usdt: {
      type: String,
      default: "0",
    },
    paco: {
      type: String,
      default: "0",
    },
    eth: {
      type: String,
      default: "0",
    },
    bnb: {
      type: String,
      default: "0",
    },
    date: Date,
  },
  {
    timestamps: true,
  }
);

const MyStakeHistory = model("MyStakeHistory", myStakeHistorySchema);
module.exports = MyStakeHistory;
