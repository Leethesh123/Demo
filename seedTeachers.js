const mongoose = require("mongoose");
const Teacher = require("./src/models/Teacher");
const dbConfig = require("./src/config/dbConfig");

const sampleTeachers = [
  {
    name: "Dr. Sarah Johnson",
    subject: "Mathematics",
    qualifications: "Ph.D. in Mathematics",
    experience: "15 years",
    bio: "Dr. Johnson specializes in advanced calculus and has published numerous research papers in mathematical journals. She is passionate about making complex mathematical concepts accessible to students.",
    email: "sarah.johnson@school.edu",
    phone: "555-0101",
    specialization: "Advanced Calculus",
    achievements: [
      "Best Teacher Award 2022",
      "Published in International Mathematics Journal",
      "Mathematics Department Head 2020-2023",
    ],
    image: "/uploads/teacher-1.jpg",
    isActive: true,
  },
  {
    name: "Prof. Michael Chen",
    subject: "Physics",
    qualifications: "Ph.D. in Physics",
    experience: "12 years",
    bio: "Prof. Chen is an expert in quantum mechanics and has conducted groundbreaking research in particle physics. He brings practical applications and real-world examples into his teaching.",
    email: "michael.chen@school.edu",
    phone: "555-0102",
    specialization: "Quantum Physics",
    achievements: [
      "Innovation in Teaching Award 2023",
      "Research Grant Recipient",
      "Published Physics Textbook",
    ],
    image: "/uploads/teacher-2.jpg",
    isActive: true,
  },
  {
    name: "Ms. Emily Rodriguez",
    subject: "English Literature",
    qualifications: "M.A. in English Literature",
    experience: "8 years",
    bio: "Ms. Rodriguez brings literature to life through interactive discussions and creative writing workshops. She specializes in contemporary literature and poetry analysis.",
    email: "emily.rodriguez@school.edu",
    phone: "555-0103",
    specialization: "Contemporary Literature",
    achievements: [
      "Creative Writing Program Director",
      "Published Poet",
      "Student Mentor of the Year 2022",
    ],
    image: "/uploads/teacher-3.jpg",
    isActive: true,
  },
];

async function seedTeachers() {
  try {
    await mongoose.connect(dbConfig.uri, dbConfig.options);
    console.log("Connected to MongoDB");

    await Teacher.deleteMany({});
    console.log("Cleared existing teachers");

    await Teacher.insertMany(sampleTeachers);
    console.log("Successfully seeded teachers data");

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("Error seeding teachers:", err);
    process.exit(1);
  }
}

seedTeachers();
