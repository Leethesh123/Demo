const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

const auth = async (req, res, next) => {
  try {
    const token =
      req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.redirect("/admin/login");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });

    if (!admin) {
      return res.redirect("/admin/login");
    }

    req.token = token;
    req.admin = admin;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.redirect("/admin/login");
  }
};

module.exports = auth;
