const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const aboutController = require("../controllers/aboutController");

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: "public/uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Public route for viewing about page
router.get("/", aboutController.getAboutPage);

// Admin routes for managing about content
router.get("/admin/about/edit", aboutController.getAdminAboutEdit);
router.post(
  "/admin/about/edit",
  upload.single("image"),
  aboutController.updateAboutContent
);

module.exports = router;
