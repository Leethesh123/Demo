const mongoose = require("mongoose");

const aboutSchema = new mongoose.Schema({
  missionTitle: {
    type: String,
    required: true,
  },
  mission: {
    type: String,
    required: true,
  },
  visionTitle: {
    type: String,
    required: true,
  },
  vision: {
    type: String,
    required: true,
  },
  historyTitle: {
    type: String,
    required: true,
  },
  history: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: null,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("About", aboutSchema);
