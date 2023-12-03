const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const withdrawableSchema = new Schema(
  {
    account: {
      type: Schema.Types.ObjectId,
      ref: "Account",
    },
    amount: {
      type: Number,
      required: true,
    },
    tokenName: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "success"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const Withdrawable = model("Withdrawable", withdrawableSchema);
module.exports = Withdrawable;
