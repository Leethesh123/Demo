const Activity = require("../models/Activity");

const activityController = {
  // Get all activities
  getAllActivities: async (req, res) => {
    try {
      const activities = await Activity.find({ isActive: true });
      res.render("pages/activity", { activities });
    } catch (error) {
      console.error("Error fetching activities:", error);
      res.status(500).send("Error fetching activities");
    }
  },

  // Get single activity by ID
  getActivityById: async (req, res) => {
    try {
      const activity = await Activity.findById(req.params.id);
      if (!activity) {
        return res.status(404).send("Activity not found");
      }
      res.render("pages/activity-detail", { activity });
    } catch (error) {
      console.error("Error fetching activity:", error);
      res.status(500).send("Error fetching activity");
    }
  },

  // Admin: Create new activity
  createActivity: async (req, res) => {
    try {
      const activityData = req.body;
      if (req.file) {
        activityData.image = `/uploads/${req.file.filename}`;
      }
      const newActivity = new Activity(activityData);
      await newActivity.save();
      res.redirect("/admin/activities");
    } catch (error) {
      console.error("Error creating activity:", error);
      res.status(500).send("Error creating activity");
    }
  },

  // Admin: Update activity
  updateActivity: async (req, res) => {
    try {
      const updatedActivity = await Activity.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      res.redirect("/admin/activities");
    } catch (error) {
      console.error("Error updating activity:", error);
      res.status(500).send("Error updating activity");
    }
  },

  // Admin: Delete activity
  deleteActivity: async (req, res) => {
    try {
      await Activity.findByIdAndDelete(req.params.id);
      res.redirect("/admin/activities");
    } catch (error) {
      console.error("Error deleting activity:", error);
      res.status(500).send("Error deleting activity");
    }
  },

  // Admin: Render activity management page
  renderAdminActivities: async (req, res) => {
    try {
      const activities = await Activity.find();
      res.render("admin/activities/index", { activities });
    } catch (error) {
      console.error("Error fetching activities:", error);
      res.status(500).send("Error fetching activities");
    }
  },
};

module.exports = activityController;
