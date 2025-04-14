require("dotenv").config();
const app = require("./src/config/appConfig");
const mongoose = require("mongoose");
const dbConfig = require("./src/config/dbConfig");
const port = process.env.PORT || 3000;

// Database connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Exit process with failure
  });

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Visit: http://localhost:${port}`);
});
