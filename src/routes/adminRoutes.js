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
const AcademicProgram = require("../models/AcademicProgram");
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

    const token = await admin.generateAuthToken();

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
  console.log(req.body);
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
        historyTitle: "Our Inspiration",
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
      historyTitle: historyTitle || "Our Inspiration",
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
    // Fetch all academic programs
    const programs = await AcademicProgram.find().sort({ createdAt: -1 });

    // Pass success and error from query params or null
    const success = req.query.success || null;
    const error = req.query.error || null;

    // Render the page with programs and messages
    res.render("admin/academics/index", {
      programs,
      success,
      error,
      admin: req.admin,
      title: "Academic Programs Management",
    });
  } catch (error) {
    console.error("Error loading academic programs:", error);
    res.status(500).render("admin/academics/index", {
      programs: [],
      error: "Failed to load academic programs",
      admin: req.admin,
      title: "Academic Programs Management",
    });
  }
});

// Delete program route
router.delete("/academics/delete/:id", auth, async (req, res) => {
  try {
    const program = await AcademicProgram.findById(req.params.id);
    if (!program) {
      return res
        .status(404)
        .json({ success: false, error: "Program not found" });
    }

    // Delete the program's image if it exists
    if (program.image) {
      const imagePath = path.join(__dirname, "..", "public", program.image);
      try {
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      } catch (err) {
        console.error("Error deleting program image:", err);
      }
    }

    await program.deleteOne();
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting program:", error);
    res.status(500).json({ success: false, error: "Error deleting program" });
  }
});

router.post(
  "/admin/academics/update-main",
  auth,
  upload.single("image"),
  async (req, res) => {
    try {
      const { title, description } = req.body;
      let mainContent = await AcademicProgram.findOne({ isMainContent: true });

      if (!mainContent) {
        mainContent = new AcademicProgram({
          title,
          description,
          isMainContent: true,
        });
      } else {
        mainContent.title = title;
        mainContent.description = description;
      }

      // Handle image upload
      if (req.file) {
        // Delete old image if exists
        if (mainContent.image) {
          const oldImagePath = path.join(
            __dirname,
            "..",
            "public",
            mainContent.image
          );
          try {
            if (fs.existsSync(oldImagePath)) {
              fs.unlinkSync(oldImagePath);
            }
          } catch (err) {
            console.error("Error deleting old image:", err);
          }
        }
        mainContent.image = `/uploads/${req.file.filename}`;
      }

      await mainContent.save();
      res.send("success", "Academic content updated successfully");
      return res.redirect("/admin/academics");
    } catch (error) {
      console.error("Error updating academic content:", error);
      res.send("error", "Error updating academic content");
      return res.redirect("/admin/academics");
    }
  }
);

// Edit program route

router.get("/academics/edit/:id", auth, async (req, res) => {
  try {
    const program = await AcademicProgram.findById(req.params.id);
    if (!program) {
      // Redirect with error query param
      return res.redirect("/admin/academics?error=Academic program not found");
    }

    // Pass success and error from query params or null
    const success = req.query.success || null;
    const error = req.query.error || null;

    res.render("admin/academics/edit", {
      program,
      success,
      error,
      admin: req.admin,
      title: "Edit Academic Program",
    });
  } catch (error) {
    console.error("Error loading program for edit:", error);
    return res.redirect(
      "/admin/academics?error=Error loading academic program"
    );
  }
});

// Update program
// Update program
router.post(
  "/academics/edit/:id",
  auth,
  upload.single("image"),
  async (req, res) => {
    try {
      console.log("Received edit request for program ID:", req.params.id);
      console.log("Request body:", req.body);

      const { title, description, duration, requirements, curriculum, level } =
        req.body;

      // Find the academic program by ID
      const academicProgram = await AcademicProgram.findById(req.params.id);
      if (!academicProgram) {
        return res.status(404).json({
          success: false,
          error: "Academic program not found",
        });
      }

      // Handle image upload
      if (req.file) {
        // Validate file type
        if (!req.file.mimetype.startsWith("image/")) {
          return res.status(400).json({
            success: false,
            error: "Please upload a valid image file",
          });
        }

        // Validate file size (2MB limit)
        if (req.file.size > 2 * 1024 * 1024) {
          return res.status(400).json({
            success: false,
            error: "Image file size should be less than 2MB",
          });
        }

        // Delete old image if it exists
        if (academicProgram.image) {
          const oldImagePath = path.join(
            __dirname,
            "..",
            "public",
            academicProgram.image
          );
          try {
            if (fs.existsSync(oldImagePath)) {
              fs.unlinkSync(oldImagePath);
              console.log("Old image deleted successfully");
            }
          } catch (err) {
            console.error("Error deleting old image:", err);
          }
        }

        academicProgram.image = `/uploads/${req.file.filename}`;
      }

      // Update fields
      academicProgram.title = title || academicProgram.title;
      academicProgram.description = description || academicProgram.description;
      academicProgram.duration = duration || academicProgram.duration;
      academicProgram.level = level || academicProgram.level;
      academicProgram.requirements =
        requirements || academicProgram.requirements;
      academicProgram.curriculum = curriculum || academicProgram.curriculum;
      academicProgram.isActive = req.body.isActive === "on";
      academicProgram.updatedAt = new Date();

      // Save the updated document
      await academicProgram.save();
      return res.redirect("/admin/academics");
    } catch (error) {
      console.error("Error updating academic program:", error);
      res.redirect(`/admin/academics/index`);
      return res.status(500).render("admin/academics", {
        success: false,
        error: "Failed to update program",
        message: error.message,
      });
    }
    return res.redirect("/admin/academics");
  }
);

// Add new program form route

router.get("/academics/add", auth, (req, res) => {
  // Pass success and error from query params or null
  const success = req.query.success || null;
  const error = req.query.error || null;

  res.render("admin/academics/add", {
    title: "Add Academic Program",
    success,
    error,
    admin: req.admin,
  });
});

// Add new program submission route
router.post(
  "/academics/add",
  auth,
  upload.single("image"),
  async (req, res) => {
    try {
      const {
        title,
        description,
        duration,
        level,
        requirements,
        curriculum,
        isActive,
      } = req.body;

      // Input validation
      if (!title || !description || !duration || !level) {
        res.send(
          "error",
          "Title, description, duration and level are required"
        );
        return res.redirect("/admin/academics/add");
      }

      // Create new program
      const newProgram = new AcademicProgram({
        title: title.trim(),
        description: description.trim(),
        duration: duration.trim(),
        level: level.trim(),
        requirements: requirements ? requirements.trim() : "",
        curriculum: curriculum ? curriculum.trim() : "",
        isActive: isActive === "on",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Handle image upload
      if (req.file) {
        newProgram.image = `/uploads/${req.file.filename}`;
      }

      // Save the program
      await newProgram.save();

      res.send("success", "Academic program added successfully");
      return res.redirect("/admin/academics");
    } catch (error) {
      console.error("Error adding program:", error);
      res.send("error", error.message || "Error adding academic program");
      return res.redirect("/admin/academics/add");
    }
  }
);

router.get("/academics/sections", auth, async (req, res) => {
  try {
    const Content = require("../models/content");
    console.log("Content:", Content);
    // Find all academic sections
    const sections = await Content.find({
      page: "academics",
      isActive: true,
    }).sort({ order: 1 });

    // Log for debugging
    console.log("Fetched sections:", sections);

    // Get the content for each section
    // const content = {
    //   excellence: sections.find((s) => s.title === "Academic Excellence") || {},
    //   support: sections.find((s) => s.title === "Student Support") || {},
    //   research:
    //     sections.find((s) => s.title === "Research Opportunities") || {},
    // };

    // Pass success and error from query params or null
    const success = req.query.success || null;
    const error = req.query.error || null;

    return res.render("admin/academics/sections", {
      sections,
      title: "Manage Academic Sections",
      success,
      error,
    });
  } catch (error) {
    console.error("Error loading academic sections:", error);
    // Redirect with error query param
    return res.redirect(
      "/admin/academics?error=Error loading academic sections"
    );
  }
});

// Update individual section content

router.post(
  "/academics/sections/update",
  auth,
  upload.single("image"),
  async (req, res) => {
    try {
      const Content = require("../models/content");
      const { title, description, order } = req.body;

      let section = await Content.findOne({ page: "academics", order });

      if (!section) {
        section = new Content({
          page: "academics",
          title,
          description,
          order,
          isActive: true,
        });
      } else {
        section.title = title;
        section.description = description;
      }

      // Handle new image
      if (req.file) {
        // Delete old image if exists
        if (section.image) {
          const oldImagePath = path.join(
            __dirname,
            "..",
            "public",
            section.image
          );
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }

        // Save new image path
        section.image = `/uploads/${req.file.filename}`;
      }

      await section.save();

      // Redirect after successful save
      return res.redirect("/admin/academics/sections");
    } catch (error) {
      console.error("Error updating academic section:", error);

      // Redirect with error (optionally flash or query param)
      return res.redirect("/admin/academics/sections");
    }
  }
);
// Update academic programs
router.post("/admin/academics/update/programs", auth, async (req, res) => {
  try {
    const { programs } = req.body;
    let parsedPrograms;

    try {
      parsedPrograms =
        typeof programs === "string" ? JSON.parse(programs) : programs;
      if (!Array.isArray(parsedPrograms)) {
        parsedPrograms = [parsedPrograms];
      }

      parsedPrograms = parsedPrograms
        .filter((program) => program && typeof program === "object")
        .map((program) => ({
          title: program.title?.trim() || "",
          description: program.description?.trim() || "",
          duration: program.duration?.trim() || "",
          requirements: program.requirements?.trim() || "",
          curriculum: program.curriculum?.trim() || "",
        }))
        .filter((program) =>
          Object.values(program).some((value) => value !== "")
        );
    } catch (error) {
      console.error("Error parsing programs data:", error);
      res.send("error", "Invalid programs data format");
      return res.redirect("/admin/academics/edit");
    }

    let academic = await Content.findOne();
    if (!academic) {
      academic = new Content();
    }

    academicProgram = parsedPrograms;
    academic.updatedAt = new Date();
    await academic.save();

    return res.json({
      success: true,
      message: "Academic programs updated successfully",
      redirect: "/admin/academics",
    });
  } catch (error) {
    console.error("Error updating academic programs:", error);
    res.send("error", "Failed to update academic programs");
    return res.redirect("/admin/academics/edit");
  }
});

// Delete academic content
router.delete("/admin/academics/:id", auth, async (req, res) => {
  try {
    await Content.findByIdAndDelete(req.params.id);
    res.redirect("/admin/academics");
  } catch (error) {
    console.error("Error deleting academic content:", error);
    res.status(500).json({ error: "Error deleting academic content" });
  }
});

// Activities Routes
router.get("/activities", auth, async (req, res) => {
  try {
    const activities = await Activity.find().sort({ createdAt: -1 });
    res.render("admin/activities/index", {
      activities: activities
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

// Get single activity for editing
router.get("/activities/:id", auth, async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);
    if (!activity) {
      return res.status(404).json({
        success: false,
        message: "Activity not found"
      });
    }
    res.json(activity);
  } catch (error) {
    console.error("Error fetching activity:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching activity",
      error: error.message
    });
  }
});

// Create new activity
router.post("/activities", auth, upload.single("image"), async (req, res) => {
  try {
    const { title, description, category, schedule, location, participants } = req.body;
    
    const activity = new Activity({
      title,
      description,
      category,
      schedule,
      location,
      participants,
      isActive: true
    });

    if (req.file) {
      activity.image = `/uploads/${req.file.filename}`;
    }

    await activity.save();
    res.json({
      success: true,
      message: "Activity created successfully",
      activity
    });
  } catch (error) {
    console.error("Error creating activity:", error);
    res.status(500).json({
      success: false,
      message: "Error creating activity",
      error: error.message
    });
  }
});

// Update activity
router.post("/activities/update/:id", auth, upload.single("image"), async (req, res) => {
  try {
    const { title, description, category, schedule, location, participants } = req.body;
    
    const activity = await Activity.findById(req.params.id);
    if (!activity) {
      return res.status(404).json({
        success: false,
        message: "Activity not found"
      });
    }

    // Update fields
    activity.title = title;
    activity.description = description;
    activity.category = category;
    activity.schedule = schedule;
    activity.location = location;
    activity.participants = participants;

    // Handle image upload
    if (req.file) {
      // Delete old image if exists
      if (activity.image) {
        const oldImagePath = path.join(__dirname, "..", "public", activity.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      activity.image = `/uploads/${req.file.filename}`;
    }

    await activity.save();
    res.json({
      success: true,
      message: "Activity updated successfully",
      activity
    });
  } catch (error) {
    console.error("Error updating activity:", error);
    res.status(500).json({
      success: false,
      message: "Error updating activity",
      error: error.message
    });
  }
});

// Delete activity
router.delete("/activities/:id", auth, async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);
    if (!activity) {
      return res.status(404).json({
        success: false,
        message: "Activity not found"
      });
    }

    // Delete the activity image if it exists
    if (activity.image) {
      const imagePath = path.join(__dirname, "..", "public", activity.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await activity.deleteOne();
    res.json({
      success: true,
      message: "Activity deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting activity:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting activity",
      error: error.message
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
