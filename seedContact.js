const mongoose = require("mongoose");
const dbConfig = require("./src/config/dbConfig");
const Contact = require("./src/models/Contact");

const initialContact = {
  address: "123 School Street, City, State, ZIP",
  phone: "+1 (555) 123-4567",
  email: "contact@school.edu",
  formSubmissions: [],
};

async function seedContact() {
  try {
    await mongoose.connect(dbConfig.uri, dbConfig.options);
    console.log("Connected to MongoDB");

    // Check if contact document exists
    const existingContact = await Contact.findOne();
    if (!existingContact) {
      await Contact.create(initialContact);
      console.log("Contact information seeded successfully");
    } else {
      console.log("Contact information already exists");
    }
  } catch (error) {
    console.error("Error seeding contact information:", error);
  } finally {
    await mongoose.connection.close();
    console.log("Database connection closed");
  }
}

seedContact();
