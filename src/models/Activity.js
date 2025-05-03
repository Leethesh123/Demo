const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    schedule: { type: String, required: true },
    location: { type: String, required: true },
    participants: { type: String, required: true },
    image: { type: String },
    isActive: { type: Boolean, default: true }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Activity", activitySchema);
