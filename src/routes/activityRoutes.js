const express = require("express");
const router = express.Router();
const activityController = require("../controllers/activityController");
const auth = require("../middleware/auth");
const upload = require("../middleware/fileUpload");

// Public routes
router.get("/", (req, res, next) => {
  if (req.baseUrl === "/admin/activities") {
    return activityController.renderAdminActivities(req, res, next);
  }
  return activityController.getAllActivities(req, res, next);
});

// Public activity detail route
router.get("/:id", (req, res, next) => {
  if (req.baseUrl === "/admin/activities") {
    return next();
  }
  return activityController.getActivityById(req, res, next);
});

// Admin routes
router.post(
  "/",
  auth,
  upload.single("image"),
  activityController.createActivity
);
router.put("/:id", auth, activityController.updateActivity);
router.delete("/:id", auth, activityController.deleteActivity);

// Admin activity management route
router.get("/manage", auth, (req, res) => {
  res.render("admin/activities/index", {
    title: "Manage Activities",
    layout: "admin/layouts/admin",
  });
});

module.exports = router;
