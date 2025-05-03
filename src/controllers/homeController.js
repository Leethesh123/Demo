const HomeContent = require("../models/HomeContent");
const Principal = require("../models/Principal");
const Logo = require("../models/Logo");
const path = require("path");
const fs = require("fs").promises;

exports.getHomePage = async (req, res) => {
  try {
    const homeContent = (await HomeContent.findOne()) || new HomeContent({});
    const principal = await Principal.findOne();
    const logo = await Logo.findOne();
    res.render("pages/home", {
      homeContent,
      principal,
      logo,
      pageTitle: "Home",
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

exports.getEditPage = async (req, res) => {
  try {
    const homeContent = (await HomeContent.findOne()) || new HomeContent({});
    res.render("admin/home/edit", {
      homeContent,
      title: "Edit Home Content",
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

exports.updateContent = async (req, res) => {
  try {
    let homeContent = (await HomeContent.findOne()) || new HomeContent();

    // Handle banner slides
    const bannerSlidesData = JSON.parse(req.body.bannerSlides || "[]");
    const files = req.files || [];
    let fileIndex = 0;

    // Process each banner slide
    homeContent.bannerSlides = bannerSlidesData.map((slideData, index) => {
      const slide = {
        title: slideData.title,
        subtitle: slideData.subtitle,
        ctaText: slideData.ctaText,
        ctaLink: slideData.ctaLink,
        order: index,
      };

      // If this is an existing slide with an image
      if (slideData.imageUrl) {
        slide.imageUrl = slideData.imageUrl;
      }

      // If a new image is uploaded for this slide
      if (files[fileIndex]) {
        // If there was an old image, delete it
        if (slideData.imageUrl) {
          try {
            fs.unlink(path.join("public", slideData.imageUrl)).catch(
              console.error
            );
          } catch (error) {
            console.error("Error deleting old image:", error);
          }
        }
        slide.imageUrl = `/uploads/banners/${files[fileIndex].filename}`;
        fileIndex++;
      }

      return slide;
    });

    // Update other home content
    homeContent.welcomeTitle = req.body.welcomeTitle;
    homeContent.welcomeContent = req.body.welcomeContent;
    homeContent.featuredSections = JSON.parse(
      req.body.featuredSections || "[]"
    );

    await homeContent.save();

    // Redirect back to edit page
    res.redirect("/admin/home/edit");
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
