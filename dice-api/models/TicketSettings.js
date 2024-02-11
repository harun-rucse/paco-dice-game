const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const ticketSettingSchema = new Schema(
  {
    STANDARD: {
      type: Number,
      required: true,
    },
    MEGA: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const TicketSetting = model("TicketSetting", ticketSettingSchema);
module.exports = TicketSetting;
