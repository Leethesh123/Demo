const express = require("express");
const router = express.Router();
const HomeContent = require("../models/HomeContent");

// Get home content
router.get("/", async (req, res) => {
  try {
    const content = (await HomeContent.findOne()) || new HomeContent({});
    res.json(content);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update home content
router.post("/", async (req, res) => {
  try {
    let content = (await HomeContent.findOne()) || new HomeContent({});

    if (req.body.bannerSlides) content.bannerSlides = req.body.bannerSlides;
    if (req.body.welcomeTitle) content.welcomeTitle = req.body.welcomeTitle;
    if (req.body.welcomeContent)
      content.welcomeContent = req.body.welcomeContent;
    if (req.body.featuredSections)
      content.featuredSections = req.body.featuredSections;

    content.updatedAt = Date.now();
    await content.save();

    res.json(content);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Add banner slide
router.post("/banner", async (req, res) => {
  try {
    let content = (await HomeContent.findOne()) || new HomeContent({});
    content.bannerSlides.push(req.body);
    await content.save();
    res.status(201).json(content);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update banner slide
router.put("/banner/:slideId", async (req, res) => {
  try {
    const content = await HomeContent.findOne();
    const slide = content.bannerSlides.id(req.params.slideId);

    if (!slide) return res.status(404).json({ message: "Slide not found" });

    slide.set(req.body);
    await content.save();
    res.json(content);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
