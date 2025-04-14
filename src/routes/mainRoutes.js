const express = require("express");
const router = express.Router();
const homeController = require("../controllers/homeController");
const mainRouter = require("./main");

// Home page route
router.get("/", homeController.getHomePage);

// Include other route files
router.use("/admin", require("./adminRoutes"));
router.use("/api/home-content", require("./homeContentRoutes"));

// Include main routes (including academics)
router.use("/", mainRouter);

module.exports = router;
