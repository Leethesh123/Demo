const mongoose = require("mongoose");
const dbConfig = require("./src/config/dbConfig");
const About = require("./src/models/About");

const sampleAboutContent = {
  mission:
    "Our mission is to provide quality education that empowers students to achieve academic excellence and develop into responsible global citizens. We strive to create an inclusive learning environment that fosters creativity, critical thinking, and personal growth.",
  vision:
    "To be a leading educational institution that inspires innovation, promotes lifelong learning, and prepares students for success in an ever-changing world. We envision our graduates as confident leaders who contribute positively to society.",
  history:
    "Founded with a commitment to educational excellence, our school has been serving the community for over two decades. Throughout our journey, we have consistently evolved our teaching methods and facilities while maintaining our core values of integrity, respect, and academic excellence.",
  image: "/uploads/about-image.jpg",
  updatedAt: new Date(),
};

async function seedAboutContent() {
  try {
    await mongoose.connect(dbConfig.uri, dbConfig.options);
    console.log("Connected to MongoDB");

    await About.deleteMany({});
    console.log("Cleared existing about content");

    await About.create(sampleAboutContent);
    console.log("Successfully seeded about content data");

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("Error seeding about content:", err);
    process.exit(1);
  }
}

seedAboutContent();
