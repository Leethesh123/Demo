const HomeContent = require("../models/HomeContent");
const Principal = require("../models/Principal");
const Logo = require("../models/Logo");

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
