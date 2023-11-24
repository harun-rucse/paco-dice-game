const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const depositSchema = new Schema(
  {
    account: {
      type: Schema.Types.ObjectId,
      ref: "Account",
    },
    amount: {
      type: Number,
      required: true,
    },
    trxId: {
      type: String,
      required: true,
    },
    tokenName: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["success", "fail"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Deposit = model("Deposit", depositSchema);
module.exports = Deposit;
