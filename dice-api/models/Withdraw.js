const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const withdrawSchema = new Schema(
  {
    account: {
      type: Schema.Types.ObjectId,
      ref: "Account",
    },
    amount: {
      type: String,
      required: true,
    },
    receivedAddress: {
      type: String,
      required: true,
    },
    trxId: String,
    tokenName: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "success", "fail"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const Withdraw = model("Withdraw", withdrawSchema);
module.exports = Withdraw;
