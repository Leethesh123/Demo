const mongoose = require("mongoose");

const bannerSlideSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  title: { type: String, required: true },
  subtitle: { type: String },
  ctaText: { type: String },
  ctaLink: { type: String },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

const homeContentSchema = new mongoose.Schema({
  bannerSlides: [bannerSlideSchema],
  welcomeTitle: { type: String, default: "Welcome to Our School" },
  welcomeContent: { type: String },
  featuredSections: [
    {
      title: String,
      content: String,
      icon: String,
      link: String,
    },
  ],
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("HomeContent", homeContentSchema);
