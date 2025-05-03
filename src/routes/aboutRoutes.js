const express = require("express");
const router = express.Router();
const multer = require("multer");
const aboutController = require("../controllers/aboutController");
const upload = require("../middleware/fileUpload");

// Public route for viewing about page
router.get("/", aboutController.getAboutPage);

// Admin routes for managing about content
router.get("/admin/about/edit", aboutController.getAdminAboutEdit);
router.post(
  "/admin/about/update",
  upload.single("image"),
  aboutController.updateAboutContent
);

module.exports = router;
