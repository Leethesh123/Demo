const About = require("../models/About");
const path = require("path");
const fs = require("fs");

const { getTestimonialsForAboutPage } = require("./testimonialController");

exports.getAboutPage = async (req, res) => {
  try {
    const [about, testimonials] = await Promise.all([
      About.findOne(),
      getTestimonialsForAboutPage(),
    ]);
    res.render("pages/about", { about, testimonials });
  } catch (error) {
    console.error("Error fetching about content:", error);
    res.status(500).send("Error loading about page");
  }
};

exports.getAdminAboutEdit = async (req, res) => {
  try {
    const about = await About.findOne();
    res.render("admin/about/edit", { about });
  } catch (error) {
    console.error("Error fetching about content for edit:", error);
    res.status(500).send("Error loading edit page");
  }
};

exports.updateAboutContent = async (req, res) => {
  try {
    const { mission, vision, history } = req.body;
    let updateData = { mission, vision, history };

    if (req.file) {
      // Delete old image if exists
      const existingAbout = await About.findOne();
      if (existingAbout && existingAbout.image) {
        const oldImagePath = path.join("public", existingAbout.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      updateData.image = `/uploads/${req.file.filename}`;
    }

    await About.findOneAndUpdate({}, updateData, { upsert: true, new: true });
    res.redirect("/admin/about/edit");
  } catch (error) {
    console.error("Error updating about content:", error);
    res.status(500).send("Error updating about content");
  }
};
