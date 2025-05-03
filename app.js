const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const mainRoutes = require("./src/routes/mainRoutes");
const academicProgramRoutes = require("./src/routes/academicProgramRoutes");
const academicContentRoutes = require("./src/routes/academicContentRoutes");
const homeContentRoutes = require("./src/routes/homeContentRoutes");
// const adminHomeContentRoutes = require("./src/routes/admin/homeContent");
// const adminAdmissionsRoutes = require("./src/routes/admin/admissions");
const adminRoutes = require("./src/routes/adminRoutes");
const aboutRoutes = require("./src/routes/aboutRoutes");
const activityRoutes = require("./src/routes/activityRoutes");
const admissionRoutes = require("./src/routes/admissionRoutes");
const teacherRoutes = require("./src/routes/teacherRoutes");
const galleryRoutes = require("./src/routes/galleryRoutes");
const contactRoutes = require("./src/routes/contactRoutes");
const documentRoutes = require("./src/routes/documentRoutes");
const logoRouter = require("./src/routes/logoRoutes");
const cors = require("cors");
const expressLayouts = require("express-ejs-layouts");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");
const adminViewMiddleware = require("./src/middleware/adminView");

require("dotenv").config();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src/views"));

// Session and flash configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());

app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "public", "uploads")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(methodOverride("_method"));

// Import models after DB connection
const Logo = require("./src/models/Logo");

// Middleware to fetch logo data for all views
app.use(async (req, res, next) => {
  try {
    const logo = await Logo.findOne();
    res.locals.logo = logo;
    next();
  } catch (error) {
    console.error("Error fetching logo:", error);
    res.locals.logo = null;
    next();
  }
});

// Middleware to fetch contact info for all views
const contactMiddleware = require("./src/middleware/contact");
app.use(contactMiddleware);

// Admin layout middleware
app.use("/admin", (req, res, next) => {
  app.set("layout", "layout/admin");
  res.locals.layout = "admin/layouts/admin";
  next();
});

// Admin view middleware
app.use("/admin", adminRoutes); // Register admin routes first
app.use("/admin/logo", logoRouter); // Register logo routes under /admin path
app.use("/", mainRoutes);
app.use("/about", aboutRoutes);
app.use("/home-content", homeContentRoutes);
app.use("/activities", activityRoutes);
app.use("/admin/activities", activityRoutes);
app.use("/", admissionRoutes);
app.use("/", teacherRoutes);
app.use("/", galleryRoutes);
app.use("/contact", contactRoutes);
app.use("/", documentRoutes);
app.use("/", require("./src/routes/testimonialRoutes"));

// Database connection
mongoose
  .connect("mongodb://127.0.0.1:27017/schoolwebsite")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
