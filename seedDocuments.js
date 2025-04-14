const mongoose = require("mongoose");
const Document = require("./src/models/Document");
const dbConfig = require("./src/config/dbConfig");

// Sample CBSE documents data
const documents = [
  {
    title: "CBSE Exam Guidelines 2024",
    description: "Official guidelines for CBSE board examinations 2024",
    fileUrl: "/uploads/documents/exam-guidelines-2024.pdf",
    fileType: ".pdf",
    uploadDate: new Date("2024-01-15"),
    isActive: true,
  },
  {
    title: "Academic Calendar 2023-24",
    description: "Detailed academic calendar for the current academic year",
    fileUrl: "/uploads/documents/academic-calendar.xlsx",
    fileType: ".xlsx",
    uploadDate: new Date("2023-12-01"),
    isActive: true,
  },
  {
    title: "Admission Process Document",
    description: "Complete guide for admission process and requirements",
    fileUrl: "/uploads/documents/admission-process.docx",
    fileType: ".docx",
    uploadDate: new Date("2023-11-20"),
    isActive: true,
  },
  {
    title: "Fee Structure 2024",
    description: "Detailed fee structure for all classes",
    fileUrl: "/uploads/documents/fee-structure.pdf",
    fileType: ".pdf",
    uploadDate: new Date("2024-01-10"),
    isActive: true,
  },
  {
    title: "Sports Activities Schedule",
    description: "Annual sports activities and events schedule",
    fileUrl: "/uploads/documents/sports-schedule.xlsx",
    fileType: ".xlsx",
    uploadDate: new Date("2023-12-15"),
    isActive: true,
  },
];

// Connect to MongoDB
mongoose
  .connect(dbConfig.uri, dbConfig.options)
  .then(() => {
    console.log("Connected to MongoDB");
    return Document.deleteMany({}); // Clear existing documents
  })
  .then(() => {
    return Document.insertMany(documents);
  })
  .then((docs) => {
    console.log(`${docs.length} documents seeded successfully`);
    mongoose.connection.close();
  })
  .catch((error) => {
    console.error("Error seeding documents:", error);
    mongoose.connection.close();
  });
