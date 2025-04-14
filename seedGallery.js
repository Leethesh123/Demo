const mongoose = require("mongoose");
const Gallery = require("./src/models/Gallery");
const dbConfig = require("./src/config/dbConfig");

const sampleGalleryImages = [
  {
    title: "School Campus",
    description:
      "Beautiful view of our modern school campus with state-of-the-art facilities.",
    image: "/uploads/campus-1.jpg",
    isActive: true,
  },
  {
    title: "Science Lab",
    description:
      "Students engaged in hands-on experiments in our well-equipped science laboratory.",
    image: "/uploads/science-lab.jpg",
    isActive: true,
  },
  {
    title: "Library",
    description:
      "Our extensive library collection with modern digital facilities and study areas.",
    image: "/uploads/library.jpg",
    isActive: true,
  },
  {
    title: "Sports Complex",
    description:
      "Multi-purpose sports complex for various indoor and outdoor activities.",
    image: "/uploads/sports.jpg",
    isActive: true,
  },
];

async function seedGallery() {
  try {
    await mongoose.connect(dbConfig.uri, dbConfig.options);
    console.log("Connected to MongoDB");

    await Gallery.deleteMany({});
    console.log("Cleared existing gallery images");

    await Gallery.insertMany(sampleGalleryImages);
    console.log("Successfully seeded gallery images data");

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("Error seeding gallery images:", err);
    process.exit(1);
  }
}

seedGallery();
