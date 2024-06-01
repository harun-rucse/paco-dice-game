const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const referredUserSchema = new Schema(
  {
    account: {
      type: Schema.Types.ObjectId,
      ref: "Account",
    },
    referredBy: {
      type: Schema.Types.ObjectId,
      ref: "Account",
    },
  },
  {
    timestamps: true,
  }
);

const ReferredUser = model("ReferredUser", referredUserSchema);
module.exports = ReferredUser;
