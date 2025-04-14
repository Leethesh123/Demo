const express = require("express");
const router = express.Router();
const Content = require("../models/content");
const Logo = require("../models/Logo");
const Admin = require("../models/Admin");
const auth = require("../middleware/auth");
const multer = require("multer");
const path = require("path");
const jwt = require("jsonwebtoken");
const { getLogo, updateLogo } = require("../controllers/logoController");
const cookieParser = require("cookie-parser");

router.use(cookieParser());
router.use(express.json());

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: "public/uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

console.log(auth);
// Authentication routes moved to adminRoutes.js

router.get("/dashboard", auth, async (req, res) => {
  try {
    const contents = await Content.find();
    const logo = await Logo.findOne();
    const teachers = await require("../models/Teacher").find();
    const programs = await require("../models/AcademicProgram").find();
    const activities = await require("../models/Activity").find();
    res.render("admin/dashboard", {
      contents,
      logo,
      admin: req.admin,
      title: "Admin Dashboard",
      teachers,
      programs,
      activities,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res
      .status(500)
      .render("admin/dashboard", { error: "Failed to load dashboard content" });
  }
});

router.get("/edit/:id", async (req, res) => {
  const content = await Content.findById(req.params.id);
  res.render("admin/edit", { content });
});

router.post("/edit/:id", upload.single("image"), async (req, res) => {
  const updateData = {
    title: req.body.title,
    description: req.body.description,
  };
  if (req.file) {
    updateData.image = "/uploads/" + req.file.filename;
  }
  await Content.findByIdAndUpdate(req.params.id, updateData);
  res.redirect("/admin/dashboard");
});

// Logo management routes
router.get("/logo", async (req, res) => {
  const logo = await Logo.findOne();
  res.render("admin/logo/manage", { logo });
});

router.post("/logo/update", upload.single("logo"), updateLogo);

module.exports = router;
