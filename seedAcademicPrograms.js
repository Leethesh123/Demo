const mongoose = require("mongoose");
const AcademicProgram = require("./src/models/AcademicProgram");
const dbConfig = require("./src/config/dbConfig");

const samplePrograms = [
  {
    title: "Computer Science",
    description:
      "A comprehensive program covering software development, algorithms, and computer systems.",
    duration: "4 years",
    level: "Bachelor's Degree",
    requirements: "High school diploma with strong mathematics background",
    curriculum:
      "Core courses include Programming, Data Structures, Algorithms, Database Systems, and Software Engineering",
    image: "/uploads/cs-program.jpg",
    isActive: true,
  },
  {
    title: "Business Administration",
    description:
      "Develop essential business skills and knowledge for modern organizational management.",
    duration: "4 years",
    level: "Bachelor's Degree",
    requirements: "High school diploma",
    curriculum:
      "Courses include Management, Marketing, Finance, Accounting, and Business Strategy",
    image: "/uploads/business-program.jpg",
    isActive: true,
  },
  {
    title: "Data Science",
    description:
      "Learn to analyze and interpret complex data sets using modern tools and techniques.",
    duration: "2 years",
    level: "Master's Degree",
    requirements: "Bachelor's degree in related field",
    curriculum:
      "Advanced Statistics, Machine Learning, Big Data Analytics, and Data Visualization",
    image: "/uploads/data-science-program.jpg",
    isActive: true,
  },
];

async function seedAcademicPrograms() {
  try {
    await mongoose.connect(dbConfig.uri, dbConfig.options);
    console.log("Connected to MongoDB");

    await AcademicProgram.deleteMany({});
    console.log("Cleared existing academic programs");

    await AcademicProgram.insertMany(samplePrograms);
    console.log("Successfully seeded academic programs data");

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("Error seeding academic programs:", err);
    process.exit(1);
  }
}

seedAcademicPrograms();
