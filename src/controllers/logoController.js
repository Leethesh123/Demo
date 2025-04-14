const Logo = require("../models/Logo");
const path = require("path");
const fs = require("fs");

exports.getLogo = async (req, res) => {
  try {
    const logo = await Logo.findOne();
    res.json(logo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateLogo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const logoUrl = `/uploads/${req.file.filename}`;
    let logo = await Logo.findOne();

    if (logo) {
      // Delete old logo file if it exists
      if (logo.logoUrl) {
        const oldLogoPath = path.join(__dirname, "..", "public", logo.logoUrl);
        if (fs.existsSync(oldLogoPath)) {
          fs.unlinkSync(oldLogoPath);
        }
      }
      logo.logoUrl = logoUrl;
      await logo.save();
    } else {
      logo = new Logo({ logoUrl });
      await logo.save();
    }

    res.json(logo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
