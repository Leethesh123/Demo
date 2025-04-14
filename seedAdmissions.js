const mongoose = require("mongoose");
const Admission = require("./src/models/Admission");
require("dotenv").config();

const admissionData = [
  {
    title: "Fall 2024 Admission",
    description:
      "Join our prestigious institution for the Fall 2024 semester. We offer comprehensive education programs with state-of-the-art facilities.",
    requirements: [
      "Completed application form",
      "Official academic transcripts",
      "Two letters of recommendation",
      "Personal statement",
      "Valid ID proof",
      "Recent passport-size photograph",
    ],
    deadline: new Date("2024-07-31"),
    applicationProcess: [
      {
        step: "Online Application",
        description:
          "Complete the online application form with personal and academic details",
      },
      {
        step: "Document Submission",
        description:
          "Submit all required documents including transcripts and recommendations",
      },
      {
        step: "Application Review",
        description:
          "Admission committee reviews your application and documents",
      },
      {
        step: "Interview",
        description: "Selected candidates will be called for an interview",
      },
    ],
    fees: 250,
    status: "open",
  },
  {
    title: "Spring 2025 Admission",
    description:
      "Applications are now open for Spring 2025 semester. Early applicants will receive priority consideration.",
    requirements: [
      "Completed application form",
      "Official academic transcripts",
      "Letter of recommendation",
      "Statement of purpose",
      "Valid ID proof",
    ],
    deadline: new Date("2024-12-15"),
    applicationProcess: [
      {
        step: "Online Registration",
        description: "Register and create your application account",
      },
      {
        step: "Application Submission",
        description:
          "Fill out the application form and submit required documents",
      },
      {
        step: "Document Verification",
        description: "Admission team verifies submitted documents",
      },
      {
        step: "Final Decision",
        description: "Admission decision will be communicated via email",
      },
    ],
    fees: 200,
    status: "open",
  },
];

mongoose
  .connect("mongodb://localhost:27017/schoolwebsite", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("Connected to MongoDB");
    try {
      // Clear existing admissions
      await Admission.deleteMany({});
      console.log("Cleared existing admissions");

      // Insert new admission data
      const insertedAdmissions = await Admission.insertMany(admissionData);
      console.log(`Inserted ${insertedAdmissions.length} admissions`);

      console.log("Seed completed successfully");
    } catch (error) {
      console.error("Error seeding data:", error);
    } finally {
      mongoose.connection.close();
    }
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });
