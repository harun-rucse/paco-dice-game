const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const TokenSchema = new Schema(
  {
    token: {
      type: String,
      required: true,
    },
    account: {
      type: Schema.Types.ObjectId,
      ref: "Account",
    },
  },
  {
    timestamps: true,
  }
);

const Token = model("Token", TokenSchema);
module.exports = Token;
