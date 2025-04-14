const mongoose = require("mongoose");
const Content = require("./src/models/content");
const dbConfig = require("./src/config/dbConfig");

const sampleContent = [
  {
    page: "academics",
    title: "Academic Excellence",
    description:
      "Our institution is committed to providing high-quality education through diverse academic programs. We focus on both theoretical knowledge and practical skills to prepare students for successful careers.",
    image: "/uploads/academic-excellence.jpg",
    order: 1,
    isActive: true,
  },
  {
    page: "academics",
    title: "Student Support",
    description:
      "We provide comprehensive support services to help students succeed in their academic journey. This includes academic advising, tutoring, and career guidance.",
    image: "/uploads/student-support.jpg",
    order: 2,
    isActive: true,
  },
  {
    page: "academics",
    title: "Research Opportunities",
    description:
      "Students have access to various research opportunities across different fields. We encourage collaboration between students and faculty members on innovative research projects.",
    image: "/uploads/research.jpg",
    order: 3,
    isActive: true,
  },
];

async function seedAcademicContent() {
  try {
    await mongoose.connect(dbConfig.uri, dbConfig.options);
    console.log("Connected to MongoDB");

    // Clear existing academic content
    await Content.deleteMany({ page: "academics" });
    console.log("Cleared existing academic content");

    // Insert new academic content
    await Content.insertMany(sampleContent);
    console.log("Successfully seeded academic content data");

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("Error seeding academic content:", err);
    process.exit(1);
  }
}

seedAcademicContent();
