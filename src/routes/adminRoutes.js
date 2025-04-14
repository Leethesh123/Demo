const express = require("express");
const router = express.Router();
const Admin = require("../models/Admin");
const HomeContent = require("../models/HomeContent");
const About = require("../models/About");
const auth = require("../middleware/auth");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const upload = require("../middleware/fileUpload");
const Student = require("../models/Student");
const Teacher = require("../models/Teacher");
const Course = require("../models/Course");
// const Class = require("../models/");
const Activity = require("../models/Activity");
const Academic = require("../models/Academic");
const fs = require("fs");
// Multer setup for image uploads
// const storage = multer.diskStorage({
//   destination: "public/uploads/",
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));
//   },
// });
// const upload = multer({ storage });

router.use(cookieParser());
// Login route
router.get("/login", (req, res) => {
  res.render("admin/login", {
    error: null,
    username: "",
    title: "Admin Login",
  });
});

router.post("/login", async (req, res) => {
  console.log("Login request received");
  console.log("Request body:", req.body);
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).render("admin/login", {
        error: "Username and password are required",
        username: username,
      });
      return;
    }

    const admin = await Admin.findOne({ username });
    if (!admin) {
      res.status(401).render("admin/login", {
        error: "Invalid username or password",
        username: username,
      });
      return;
    }

    const passwordMatch = await bcrypt.compare(password, admin.password);
    if (!passwordMatch) {
      res.status(401).render("admin/login", {
        error: "Invalid username or password",
        username: username,
      });
      return;
    }

    const token = jwt.sign({ userId: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    res.redirect("/admin/dashboard");
  } catch (error) {
    console.error("Login error:", error.message, error.stack);
    res.status(500).render("admin/login", {
      error: "Login failed. Please try again.",
      username: req.body.username,
    });
  }
});

// Protected admin dashboard

router.get("/dashboard", auth, async (req, res) => {
  try {
    // Fetch all necessary data in parallel
    const [students, teachers, courses, activities] = await Promise.all([
      Student.find({ isActive: true }),
      Teacher.find({ isActive: true }),
      Course.find({ isActive: true }),
      Activity.find().sort({ createdAt: -1 }).limit(5),
    ]);

    // Prepare the data for the dashboard
    const dashboardData = {
      title: "Admin Dashboard",
      admin: req.admin,
      teachers: teachers,
      programs: courses, // Using courses as programs
      activities: activities,
      stats: {
        totalStudents: students.length,
        totalTeachers: teachers.length,
        totalCourses: courses.length,
      },
    };

    // Render the dashboard with the data
    res.render("admin/dashboard", dashboardData);
  } catch (error) {
    console.error("Error loading dashboard:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load dashboard data",
      error: error.message,
    });
  }
});

// Contact Management Routes
router.get("/contact/submissions", auth, async (req, res) => {
  try {
    const Contact = require("../models/Contact");
    const contact = await Contact.findOne();
    const submissions = contact ? contact.formSubmissions : [];
    res.render("admin/contact/submissions", {
      submissions,
      admin: req.admin,
      title: "Contact Submissions",
    });
  } catch (error) {
    console.error("Error fetching contact submissions:", error);
    res.status(500).send("Server Error");
  }
});

router.get("/contact/manage", auth, async (req, res) => {
  try {
    const Contact = require("../models/Contact");
    const contact = await Contact.findOne();
    res.render("admin/contact/manage", { contact, admin: req.admin });
  } catch (error) {
    console.error("Error fetching contact info:", error);
    res.status(500).send("Server Error");
  }
});

router.post("/contact/update", auth, async (req, res) => {
  try {
    const Contact = require("../models/Contact");
    const { address, phone, email } = req.body;
    let contact = await Contact.findOne();

    if (contact) {
      contact.address = address;
      contact.phone = phone;
      contact.email = email;
    } else {
      contact = new Contact({ address, phone, email });
    }

    await contact.save();
    res
      .status(200)
      .json({ message: "Contact information updated successfully" });
  } catch (error) {
    console.error("Error updating contact info:", error);
    res.status(500).json({ error: "Server Error" });
  }
});

// Home content management page
router.get("/home", auth, async (req, res) => {
  console.log("Home content management page");
  try {
    let homeContent = (await HomeContent.findOne()) || new HomeContent({});
    res.render("admin/home/edit", {
      bannerSlides: homeContent.bannerSlides || [],
      welcomeTitle: homeContent.welcomeTitle || "",
      welcomeContent: homeContent.welcomeContent || "",
      featuredSections: homeContent.featuredSections || [],
      admin: req.admin,
      title: "Home Content Management",
    });
  } catch (error) {
    console.error("Error loading home content:", error.message);
    console.error("Stack trace:", error.stack);
    res.status(500).render("admin/home/edit", {
      error: "Failed to load home content",
      bannerSlides: [],
      welcomeTitle: "",
      welcomeContent: "",
      featuredSections: [],
      admin: req.admin,
      title: "Home Content Management",
    });
  }
});

// Home content edit page
router.get("/home/edit", auth, async (req, res) => {
  try {
    let homeContent = (await HomeContent.findOne()) || new HomeContent({});
    res.render("admin/home/edit", {
      bannerSlides: homeContent.bannerSlides || [],
      welcomeTitle: homeContent.welcomeTitle || "",
      welcomeContent: homeContent.welcomeContent || "",
      featuredSections: homeContent.featuredSections || [],
      admin: req.admin,
      title: "Edit Home Content",
    });
    // res.render("/admin/home/edit");
    // res.render("admin/home/edit", {
    //   title: "Edit Home Content",
    // });
  } catch (error) {
    console.error("Error loading home content:", error.message);
    console.error("Stack trace:", error.stack);
    res.status(500).render("admin/home/edit", {
      error: "Failed to load home content. Please try again later.",
      bannerSlides: [],
      welcomeTitle: "",
      welcomeContent: "",
      featuredSections: [],
      admin: req.admin,
      title: "Edit Home Content",
    });
  }
});

// Update home content
router.post(
  "/home/update",
  auth,
  upload.fields([
    { name: "bannerSlides[0][image]", maxCount: 1 },
    { name: "bannerSlides[1][image]", maxCount: 1 },
    { name: "bannerSlides[2][image]", maxCount: 1 },
    { name: "bannerSlides[3][image]", maxCount: 1 },
    { name: "bannerSlides[4][image]", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      let homeContent = (await HomeContent.findOne()) || new HomeContent({});
      console.log(homeContent);

      // Update welcome section
      homeContent.welcomeTitle = req.body.welcomeTitle;
      homeContent.welcomeContent = req.body.welcomeContent;

      // Update banner slides
      if (Array.isArray(req.body.bannerSlides)) {
        const processedSlides = [];
        for (let i = 0; i < req.body.bannerSlides.length; i++) {
          const slide = req.body.bannerSlides[i];
          const slideImage = req.files
            ? req.files[`bannerSlides[${i}][image]`]?.[0]
            : null;

          processedSlides.push({
            _id: slide._id,
            imageUrl: slideImage
              ? `/uploads/${slideImage.filename}`
              : slide.imageUrl,
            title: slide.title,
            subtitle: slide.subtitle,
            ctaText: slide.ctaText,
            ctaLink: slide.ctaLink,
            isActive: slide.isActive === "on",
            order: parseInt(slide.order) || 0,
          });
          console.log(processedSlides[i]);
        }
        homeContent.bannerSlides = processedSlides;
      }

      // Update featured sections
      if (req.body.featuredSections) {
        homeContent.featuredSections = req.body.featuredSections.map(
          (section) => ({
            title: section.title,
            content: section.content,
            icon: section.icon,
            link: section.link,
          })
        );
      }

      await homeContent.save();
      res.redirect("/admin/home/edit");
    } catch (error) {
      console.error("Error updating home content:", error.message);
      console.error("Stack trace:", error.stack);

      // Attempt to retrieve existing content as fallback
      let existingContent;
      try {
        existingContent = await HomeContent.findOne();
      } catch (err) {
        existingContent = null;
      }

      res.status(500).render("admin/home/edit", {
        error:
          "Failed to update home content. Please ensure all required fields are filled and try again.",
        bannerSlides:
          existingContent?.bannerSlides || req.body.bannerSlides || [],
        welcomeTitle:
          existingContent?.welcomeTitle || req.body.welcomeTitle || "",
        welcomeContent:
          existingContent?.welcomeContent || req.body.welcomeContent || "",
        featuredSections:
          existingContent?.featuredSections || req.body.featuredSections || [],
        admin: req.admin,
        title: "Edit Home Content",
      });
    }
  }
);

// About page management routes
router.get("/about", auth, async (req, res) => {
  try {
    const about = await About.findOne();
    res.render("admin/about/edit", {
      missionTitle: about?.missionTitle || "",
      missionContent: about?.mission || "",
      visionTitle: about?.visionTitle || "",
      visionContent: about?.vision || "",
      historyTitle: about?.historyTitle || "",
      historyContent: about?.history || "",
      admin: req.admin,
      image: about.image || "",
      title: "About Content Management",
    });
  } catch (error) {
    console.error("Error loading about content:", error);
    res.status(500).render("admin/about/edit", {
      error: "Failed to load about content",
      image,
      missionTitle: "",
      missionContent: "",
      visionTitle: "",
      visionContent: "",
      historyTitle: "",
      historyContent: "",
      admin: req.admin,
      title: "About Content Management",
    });
  }
});

// Add the edit route handler
router.get("/about/edit", auth, async (req, res) => {
  try {
    // Set headers to prevent caching
    res.set({
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    });

    // Find existing about document
    const about = await About.findOne();

    // If no document exists, create one with default values
    if (!about) {
      const defaultAbout = new About({
        missionTitle: "Our Mission",
        mission: "",
        visionTitle: "Our Vision",
        vision: "",
        historyTitle: "Our History",
        history: "",
        image: "",
      });
      await defaultAbout.save();
      return res.render("admin/about/edit", {
        about: defaultAbout,
        missionTitle: defaultAbout.missionTitle,
        missionContent: defaultAbout.mission,
        visionTitle: defaultAbout.visionTitle,
        visionContent: defaultAbout.vision,
        historyTitle: defaultAbout.historyTitle,
        historyContent: defaultAbout.history,
        image: defaultAbout.image,
      });
    }

    // Prepare the data to pass to the template
    const templateData = {
      about,
      missionTitle: about.missionTitle,
      missionContent: about.mission,
      visionTitle: about.visionTitle,
      visionContent: about.vision,
      historyTitle: about.historyTitle,
      historyContent: about.history,
      image: about.image || null,
      admin: req.admin,
      title: "Edit About Content",
    };

    // Only add image if it exists
    if (about.image) {
      templateData.image = about.image;
    }

    // Render the edit page with existing content
    res.render("admin/about/edit", templateData);
  } catch (error) {
    console.error("Error rendering about edit page:", error);
    res.status(500).json({
      error: "Failed to load about edit page",
      message: "Please try again later",
    });
  }
});

// Add the update route handler
router.post("/about/update", auth, upload.single("image"), async (req, res) => {
  try {
    const {
      missionTitle,
      missionContent,
      visionTitle,
      visionContent,
      historyTitle,
      historyContent,
    } = req.body;

    // Create update data object with default values if fields are empty
    const updateData = {
      missionTitle: missionTitle || "Our Mission",
      mission: missionContent || "",
      visionTitle: visionTitle || "Our Vision",
      vision: visionContent || "",
      historyTitle: historyTitle || "Our History",
      history: historyContent || "",
    };

    // Handle file upload
    if (req.file) {
      if (!req.file.mimetype.startsWith("image/")) {
        return res.status(400).json({
          error: "Please upload a valid image file (JPG, PNG, GIF)",
          message: "Invalid file type",
        });
      }
      updateData.image = `/uploads/${req.file.filename}`;
    }

    // Find existing about document or create new one
    let about = await About.findOne();
    if (!about) {
      about = new About(updateData);
    } else {
      Object.assign(about, updateData);
    }

    // Save the document
    await about.save();

    // Send success response
    res.status(200).json({
      success: true,
      message: "About content updated successfully",
    });
  } catch (error) {
    console.error("Error updating about content:", error);
    res.status(500).json({
      error: "Failed to update about content",
      message: "Please try again later",
    });
  }
});

// Academics Management Routes
router.get("/academics", auth, async (req, res) => {
  try {
    const academic = await Academic.findOne();
    res.render("admin/academics/index", {
      title: academic?.title || "Our Academics",
      description: academic?.description || "",
      image: academic?.image || "",
      programs: academic?.programs || [],
      admin: req.admin,
    });
  } catch (error) {
    console.error("Error loading academics content:", error);
    res.status(500).render("admin/academics/index", {
      error: "Failed to load academics content",
      title: "Our Academics",
      description: "",
      image: "",
      programs: [],
      admin: req.admin,
    });
  }
});

// Add the update route handler
router.post(
  "/academics/update",
  auth,
  upload.single("image"),
  async (req, res) => {
    try {
      const { title, description, programs } = req.body;

      // Create update data object with default values
      const updateData = {
        title: title || "Our Academics",
        description: description || "",
        programs: [], // Initialize empty programs array
      };

      // Handle programs data if it exists
      if (programs) {
        try {
          const parsedPrograms =
            typeof programs === "string" ? JSON.parse(programs) : programs;
          if (Array.isArray(parsedPrograms) && parsedPrograms.length > 0) {
            updateData.programs = parsedPrograms.map((program) => ({
              title: program.title || "",
              description: program.description || "",
              duration: program.duration || "",
              requirements: program.requirements || "",
              curriculum: program.curriculum || "",
            }));
          }
        } catch (error) {
          console.error("Error parsing programs data:", error);
          // Continue with empty programs array
        }
      }

      // Handle file upload
      if (req.file) {
        if (!req.file.mimetype.startsWith("image/")) {
          return res.status(400).json({
            success: false,
            error: "Invalid file type",
            message: "Please upload a valid image file (JPG, PNG, GIF)",
          });
        }

        // Check file size (max 2MB)
        if (req.file.size > 2 * 1024 * 1024) {
          return res.status(400).json({
            success: false,
            error: "File too large",
            message: "Image file size should be less than 2MB",
          });
        }

        updateData.image = `/uploads/${req.file.filename}`;
      }

      // Find existing academic document or create new one
      let academic = await Academic.findOne();
      if (!academic) {
        academic = new Academic(updateData);
      } else {
        // If new image is uploaded, delete the old one
        if (req.file && academic.image) {
          const oldImagePath = path.join(
            __dirname,
            "..",
            "public",
            academic.image
          );
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
        Object.assign(academic, updateData);
      }

      // Save the document
      await academic.save();

      res.status(200).json({
        success: true,
        message: "Academics content updated successfully",
        data: {
          title: academic.title,
          description: academic.description,
          image: academic.image,
          programs: academic.programs,
        },
      });
    } catch (error) {
      console.error("Error updating academics:", error);
      res.status(500).json({
        success: false,
        error: "Failed to update academics content",
        message: "Please try again later",
      });
    }
  }
);

// Activities Routes
router.get("/activities", async (req, res) => {
  try {
    const activity = await Activity.findOne().sort({ createdAt: -1 });
    res.render("admin/activities/index", {
      title: activity?.title || "",
      description: activity?.description || "",
      image: activity?.image || "",
      activities: activity?.activities || [],
    });
  } catch (error) {
    console.error("Error fetching activities:", error);
    res.status(500).json({
      success: false,
      message: "Error loading activities page",
      error: error.message,
    });
  }
});

router.post("/activities/update", upload.single("image"), async (req, res) => {
  try {
    const updateData = {
      title: req.body.title,
      description: req.body.description,
      activities: [],
    };

    // Parse activities data
    if (req.body.activities) {
      try {
        const activities = JSON.parse(req.body.activities);
        if (Array.isArray(activities)) {
          updateData.activities = activities.filter(
            (activity) =>
              activity.title &&
              activity.description &&
              activity.schedule &&
              activity.location &&
              activity.participants
          );
        }
      } catch (error) {
        console.error("Error parsing activities:", error);
        return res.status(400).json({
          success: false,
          message: "Invalid activities data format",
        });
      }
    }

    // Handle image upload
    if (req.file) {
      // Validate file type
      if (!req.file.mimetype.startsWith("image/")) {
        return res.status(400).json({
          success: false,
          message: "Please upload a valid image file",
        });
      }

      // Validate file size (2MB limit)
      if (req.file.size > 2 * 1024 * 1024) {
        return res.status(400).json({
          success: false,
          message: "Image file size should be less than 2MB",
        });
      }

      // Delete old image if exists
      const oldActivity = await Activity.findOne().sort({ createdAt: -1 });
      if (oldActivity && oldActivity.image) {
        const oldImagePath = path.join(
          __dirname,
          "..",
          "public",
          oldActivity.image
        );
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      // Save new image
      const imagePath = `/uploads/activities/${Date.now()}-${
        req.file.originalname
      }`;
      const fullPath = path.join(__dirname, "..", "public", imagePath);
      fs.mkdirSync(path.dirname(fullPath), { recursive: true });
      fs.renameSync(req.file.path, fullPath);
      updateData.image = imagePath;
    }

    // Find or create activity document
    let activity = await Activity.findOne().sort({ createdAt: -1 });
    if (!activity) {
      activity = new Activity(updateData);
    } else {
      Object.assign(activity, updateData);
    }

    await activity.save();

    res.json({
      success: true,
      message: "Activities updated successfully",
      data: {
        title: activity.title,
        description: activity.description,
        image: activity.image,
        activities: activity.activities,
      },
    });
  } catch (error) {
    console.error("Error updating activities:", error);
    res.status(500).json({
      success: false,
      message: "Error updating activities",
      error: error.message,
    });
  }
});

// Logout route
router.get("/logout", auth, async (req, res) => {
  try {
    req.admin.tokens = req.admin.tokens.filter(
      (token) => token.token !== req.token
    );
    await req.admin.save();
    res.clearCookie("token");
    res.redirect("/admin/login");
  } catch (error) {
    res.status(500).send();
  }
});

module.exports = router;
