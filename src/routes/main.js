const express = require("express");
const router = express.Router();
const Content = require("../models/content");
const Message = require("../models/message");
const HomeContent = require("../models/HomeContent");
const AcademicProgram = require("../models/AcademicProgram");
const About = require("../models/About");

router.get("/", async (req, res) => {
  console.log(res);
  try {
    const [content, homeContent, principal] = await Promise.all([
      Content.findOne(),
      HomeContent.findOne(),
      require("../models/Principal").findOne(),
    ]);

    res.render("pages/home", {
      content,
      homeContent,
      principal,
      title: "Home",
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading home page");
  }
});

router.get("/about", async (req, res) => {
  try {
    const about = await About.findOne();
    res.render("pages/about", { about, title: "About Us" });
  } catch (error) {
    console.error("Error loading about page:", error);
    res.status(500).send("Error loading about page");
  }
});

router.get("/teachers", async (req, res) => {
  try {
    const Teacher = require("../models/Teacher");
    const teachers = await Teacher.find({ isActive: true });
    console.log(teachers);
    res.render("pages/teachers", { teachers, title: "Our Teachers" });
  } catch (error) {
    console.error("Error loading teachers page:", error);
    res.status(500).send("Error loading teachers page");
  }
});

router.get("/academics", async (req, res) => {
  try {
    const [programs, content] = await Promise.all([
      AcademicProgram.find({ isActive: true }).sort({ createdAt: -1 }),
      Content.find({ page: "academics", isActive: true }).sort({ order: 1 }),
    ]);
    res.render("pages/academics", {
      programs,
      content,
      title: "Academic Programs",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error loading academic programs");
  }
});

router.get("/contact", async (req, res) => {
  try {
    const Contact = require("../models/Contact");
    const contactInfo = await Contact.findOne();
    res.render("pages/contact", { title: "Contact Us", contactInfo });
  } catch (error) {
    console.error("Error loading contact page:", error);
    res.status(500).send("Error loading contact page");
  }
});

router.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;
  await Message.create({ name, email, message });
  res.redirect("/contact");
});

module.exports = router;
