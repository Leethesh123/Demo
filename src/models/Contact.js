const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  latitude: {
    type: Number,
    required: true,
    default: 0,
  },
  longitude: {
    type: Number,
    required: true,
    default: 0,
  },
  address: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  formSubmissions: [
    {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      subject: {
        type: String,
        required: true,
      },
      message: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

module.exports = mongoose.model("Contact", contactSchema);
