const mongoose = require("mongoose");
const Activity = require("./src/models/Activity");
const dbConfig = require("./src/config/dbConfig");

const activities = [
  {
    title: "Basketball Club",
    description:
      "Join our competitive basketball team! We focus on developing fundamental skills, teamwork, and strategy through regular practice sessions and friendly matches.",
    category: "Sports",
    schedule: "Monday and Wednesday, 4:00 PM - 6:00 PM",
    instructor: "Coach Mike Johnson",
    maxParticipants: 15,
    image:
      "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800",
    isActive: true,
  },
  {
    title: "Science Club",
    description:
      "Explore the wonders of science through hands-on experiments, research projects, and fascinating discussions about various scientific topics.",
    category: "Academic",
    schedule: "Tuesday, 3:30 PM - 5:00 PM",
    instructor: "Dr. Sarah Williams",
    maxParticipants: 20,
    image:
      "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800",
    isActive: true,
  },
  {
    title: "Art Workshop",
    description:
      "Express your creativity through various art forms including painting, drawing, and sculpture. Perfect for both beginners and experienced artists.",
    category: "Arts",
    schedule: "Thursday, 4:00 PM - 5:30 PM",
    instructor: "Ms. Emily Chen",
    maxParticipants: 12,
    image:
      "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=800",
    isActive: true,
  },
  {
    title: "Debate Club",
    description:
      "Develop critical thinking and public speaking skills through engaging debates on current events and various topics.",
    category: "Academic",
    schedule: "Friday, 3:30 PM - 5:00 PM",
    instructor: "Mr. James Wilson",
    maxParticipants: 16,
    image:
      "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800",
    isActive: true,
  },
  {
    title: "Chess Club",
    description:
      "Learn strategic thinking and problem-solving skills through the game of chess. All skill levels welcome!",
    category: "Games",
    schedule: "Wednesday, 3:30 PM - 5:00 PM",
    instructor: "Mr. Robert Lee",
    maxParticipants: 20,
    image:
      "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=800",
    isActive: true,
  },
];

async function seedActivities() {
  try {
    await mongoose.connect(dbConfig.uri, dbConfig.options);
    console.log("Connected to MongoDB successfully");

    // Clear existing activities
    await Activity.deleteMany({});
    console.log("Cleared existing activities");

    // Insert new activities
    await Activity.insertMany(activities);
    console.log("Sample activities seeded successfully");

    mongoose.connection.close();
  } catch (error) {
    console.error("Error seeding activities:", error);
    process.exit(1);
  }
}

seedActivities();
