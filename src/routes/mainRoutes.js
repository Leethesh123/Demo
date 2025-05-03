const express = require("express");
const router = express.Router();
const mainRouter = require("./main");

// Include main routes (including home page and academics)
router.use("/", mainRouter);

// Include admin routes
router.use("/admin", require("./adminRoutes"));
router.use("/admin", require("./userRoutes"));

module.exports = router;
