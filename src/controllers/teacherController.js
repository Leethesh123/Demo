const Teacher = require("../models/Teacher");
const upload = require("../middleware/fileUpload");

exports.getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find({ isActive: true });
    res.render("pages/teachers", { teachers });
  } catch (error) {
    console.error("Error fetching teachers:", error);
    res.status(500).send("Error fetching teachers");
  }
};

exports.getAdminTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find();
    res.render("admin/teachers/index", { teachers, title: "Manage Teachers" });
  } catch (error) {
    console.error("Error fetching teachers:", error);
    res.status(500).send("Error fetching teachers");
  }
};

exports.getAddTeacher = (req, res) => {
  res.render("admin/teachers/add", { title: "Add New Teacher" });
};

exports.addTeacher = [
  upload.single("image"),
  async (req, res) => {
    try {
      const teacherData = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phone: req.body.phone,
        qualification: req.body.qualifications,
        specialization: req.body.specialization,
        image: req.file ? `/uploads/${req.file.filename}` : "",
      };

      const teacher = new Teacher(teacherData);
      await teacher.save();
      res.redirect("/admin/teachers");
    } catch (error) {
      console.error("Error adding teacher:", error);
      if (error.name === "ValidationError") {
        return res.status(400).render("admin/teachers/add", {
          title: "Add New Teacher",
          error: error.message,
          formData: req.body,
        });
      }
      res.status(500).send("Error adding teacher");
    }
  },
];

exports.getEditTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) {
      return res.status(404).send("Teacher not found");
    }
    res.render("admin/teachers/edit", { teacher, title: "Edit Teacher" });
  } catch (error) {
    console.error("Error fetching teacher:", error);
    res.status(500).send("Error fetching teacher");
  }
};

exports.updateTeacher = [
  upload.single("image"),
  async (req, res) => {
    try {
      const teacherData = {
        name: req.body.name,
        subject: req.body.subject,
        qualifications: req.body.qualifications,
        experience: req.body.experience,
        bio: req.body.bio,
        email: req.body.email,
        phone: req.body.phone,
        specialization: req.body.specialization,
        achievements: req.body.achievements?.split("\n").filter(Boolean) || [],
        image: req.body.image,
        updatedAt: Date.now(),
      };

      const teacher = await Teacher.findByIdAndUpdate(
        req.params.id,
        teacherData,
        { new: true }
      );

      if (!teacher) {
        return res.status(404).send("Teacher not found");
      }

      res.redirect("/admin/teachers");
    } catch (error) {
      console.error("Error updating teacher:", error);
      res.status(500).send("Error updating teacher");
    }
  },
];

exports.deleteTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndDelete(req.params.id);
    if (!teacher) {
      return res.status(404).send("Teacher not found");
    }
    res.redirect("/admin/teachers");
  } catch (error) {
    console.error("Error deleting teacher:", error);
    res.status(500).send("Error deleting teacher");
  }
};
