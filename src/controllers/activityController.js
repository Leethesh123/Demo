const Activity = require("../models/Activity");

const activityController = {
  // Get all activities
  getAllActivities: async (req, res) => {
    try {
      const activities = await Activity.find({ isActive: true });
      console.log(activities)
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
        return res.status(404).json({ error: "Activity not found" });
      }
      res.json(activity);
    } catch (error) {
      console.error("Error fetching activity:", error);
      res.status(500).json({ error: "Error fetching activity" });
    }
  },

  // Admin: Create new activity
  createActivity: async (req, res) => {
    try {
      // Validate required fields
      const requiredFields = ['title', 'description', 'schedule', 'location', 'participants', 'category'];
      const missingFields = requiredFields.filter(field => !req.body[field]);
      
      if (missingFields.length > 0) {
        return res.status(400).json({ 
          error: `Missing required fields: ${missingFields.join(', ')}` 
        });
      }

      const activityData = {
        title: req.body.title,
        description: req.body.description,
        schedule: req.body.schedule,
        location: req.body.location,
        participants: req.body.participants,
        category: req.body.category,
        isActive: true
      };

      if (req.file) {
        activityData.image = `/uploads/${req.file.filename}`;
      }

      const newActivity = new Activity(activityData);
      await newActivity.save();
      
      res.json({ 
        success: true, 
        message: "Activity created successfully",
        activity: newActivity 
      });
    } catch (error) {
      console.error("Error creating activity:", error);
      res.status(500).json({ 
        error: error.message || "Error creating activity" 
      });
    }
  },

  // Admin: Update activity
  updateActivity: async (req, res) => {
    try {
      // Validate required fields
      const requiredFields = ['title', 'description', 'schedule', 'location', 'participants', 'category'];
      const missingFields = requiredFields.filter(field => !req.body[field]);
      
      if (missingFields.length > 0) {
        return res.status(400).json({ 
          error: `Missing required fields: ${missingFields.join(', ')}` 
        });
      }

      const activityData = {
        title: req.body.title,
        description: req.body.description,
        schedule: req.body.schedule,
        location: req.body.location,
        participants: req.body.participants,
        category: req.body.category,
        updatedAt: Date.now()
      };

      if (req.file) {
        activityData.image = `/uploads/${req.file.filename}`;
      }

      const updatedActivity = await Activity.findByIdAndUpdate(
        req.params.id,
        activityData,
        { new: true, runValidators: true }
      );

      if (!updatedActivity) {
        return res.status(404).json({ error: "Activity not found" });
      }

      res.json({
        success: true,
        message: "Activity updated successfully",
        activity: updatedActivity
      });
    } catch (error) {
      console.error("Error updating activity:", error);
      res.status(500).json({ 
        error: error.message || "Error updating activity" 
      });
    }
  },

  // Admin: Delete activity
  deleteActivity: async (req, res) => {
    try {
      const deletedActivity = await Activity.findByIdAndDelete(req.params.id);
      if (!deletedActivity) {
        return res.status(404).json({ error: "Activity not found" });
      }
      res.json({ 
        success: true, 
        message: "Activity deleted successfully" 
      });
    } catch (error) {
      console.error("Error deleting activity:", error);
      res.status(500).json({ 
        error: error.message || "Error deleting activity" 
      });
    }
  },

  // Admin: Render activity management page
  renderAdminActivities: async (req, res) => {
    try {
      const activities = await Activity.find().sort({ createdAt: -1 });
      res.render("admin/activities/index", { activities });
    } catch (error) {
      console.error("Error fetching activities:", error);
      res.status(500).send("Error fetching activities");
    }
  },
};

module.exports = activityController;
