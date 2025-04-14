const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const mainRoutes = require("./src/routes/mainRoutes");
const academicProgramRoutes = require("./src/routes/academicProgramRoutes");
const academicContentRoutes = require("./src/routes/academicContentRoutes");
const homeContentRoutes = require("./src/routes/homeContentRoutes");
const adminRoutes = require("./src/routes/adminRoutes");
const aboutRoutes = require("./src/routes/aboutRoutes");
const activityRoutes = require("./src/routes/activityRoutes");
const admissionRoutes = require("./src/routes/admissionRoutes");
const teacherRoutes = require("./src/routes/teacherRoutes");
const galleryRoutes = require("./src/routes/galleryRoutes");
const contactRoutes = require("./src/routes/contactRoutes");
const documentRoutes = require("./src/routes/documentRoutes");
const cors = require("cors");
const expressLayouts = require("express-ejs-layouts");
const methodOverride = require("method-override");
require("dotenv").config();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src/views"));

// Configure express-ejs-layouts
// app.use(expressLayouts);
// app.set("layout extractScripts", true);
// app.set("layout extractStyles", true);
//   app.set("layout", "layout/admin");

// Use admin layout for admin routes

app.use(express.static(path.join(__dirname, "src/public")));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(methodOverride("_method"));
// Middleware to fetch logo data for all views
const Logo = require("./src/models/Logo");
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

app.use("/admin", (req, res, next) => {
  app.use(expressLayouts);
  app.set("layout", "layout/admin");
  res.locals.layout = "admin/layouts/admin";
  next();
});

app.use("/", mainRoutes);
app.use("/about", aboutRoutes);
app.use("/", academicProgramRoutes);
app.use("/", academicContentRoutes);
app.use("/home-content", homeContentRoutes);
app.use("/admin", adminRoutes);
app.use("/activities", activityRoutes);
app.use("/admin/activities", activityRoutes);
app.use("/", admissionRoutes);
app.use("/", teacherRoutes);
app.use("/", galleryRoutes);
app.use("/contact", contactRoutes);
app.use("/", documentRoutes);

mongoose
  .connect("mongodb://127.0.0.1:27017/schoolwebsite")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Exit process with failure
  });

app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});
