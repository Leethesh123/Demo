const mongoose = require("mongoose");

const logoSchema = new mongoose.Schema({
  logoUrl: {
    type: String,
    required: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Logo", logoSchema);
