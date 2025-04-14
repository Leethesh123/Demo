const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { getLogo, updateLogo } = require("../controllers/logoController");

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "..", "public", "uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, "logo-" + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Only image files are allowed!"));
  },
});

// Routes
router.get("/", getLogo);
router.post("/update", upload.single("logo"), updateLogo);

module.exports = router;
