const mongoose = require("mongoose");
const HomeContent = require("./src/models/HomeContent");
const dbConfig = require("./src/config/dbConfig");

const sampleData = {
  bannerSlides: [
    {
      imageUrl: "/uploads/banner1.jpg",
      title: "Quality Education",
      subtitle: "Excellence in teaching and learning",
      ctaText: "Learn More",
      ctaLink: "/about",
      isActive: true,
      order: 1,
    },
    {
      imageUrl: "/uploads/banner2.jpg",
      title: "Modern Facilities",
      subtitle: "State-of-the-art learning environment",
      ctaText: "View Gallery",
      ctaLink: "/gallery",
      isActive: true,
      order: 2,
    },
    {
      imageUrl: "/uploads/banner3.jpg",
      title: "Experienced Teachers",
      subtitle: "Dedicated and qualified staff",
      ctaText: "Meet Our Team",
      ctaLink: "/teachers",
      isActive: true,
      order: 3,
    },
  ],
  welcomeTitle: "Welcome to Our School",
  welcomeContent:
    "We provide a nurturing environment where students can grow academically, socially, and emotionally. Our dedicated staff and modern facilities create the perfect learning environment.",
  featuredSections: [
    {
      title: "Academic Programs",
      content: "Comprehensive curriculum designed for excellence",
      icon: "fas fa-book",
      link: "/academics",
    },
    {
      title: "Extracurricular",
      content: "Sports, arts, and clubs for all interests",
      icon: "fas fa-futbol",
      link: "/activities",
    },
    {
      title: "Admissions",
      content: "Join our learning community today",
      icon: "fas fa-user-graduate",
      link: "/admissions",
    },
  ],
};

async function seedHomeContent() {
  try {
    // Connect to MongoDB
    await mongoose.connect(dbConfig.uri, dbConfig.options);
    console.log("Connected to MongoDB");

    // Clear existing home content
    await HomeContent.deleteMany({});
    console.log("Cleared existing home content");

    // Insert sample data
    await HomeContent.create(sampleData);
    console.log("Successfully seeded home content data");

    // Disconnect
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("Error seeding home content:", err);
    process.exit(1);
  }
}

seedHomeContent();
