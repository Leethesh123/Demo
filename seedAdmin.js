const mongoose = require("mongoose");
const Admin = require("./src/models/Admin");
const dbConfig = require("./src/config/dbConfig");

const adminData = {
  username: "admin",
  password: "admin123", // This will be hashed automatically
  email: "admin@school.com",
};

async function seedAdmin() {
  try {
    await mongoose.connect(dbConfig.uri, dbConfig.options);
    console.log("Connected to MongoDB");

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username: adminData.username });
    if (existingAdmin) {
      console.log("Admin user already exists");
      await mongoose.disconnect();
      return;
    }

    // Create new admin
    const admin = new Admin(adminData);
    await admin.save();
    console.log("Admin user created successfully");

    await mongoose.disconnect();
  } catch (error) {
    console.error("Error seeding admin:", error);
    await mongoose.disconnect();
  }
}

seedAdmin();
