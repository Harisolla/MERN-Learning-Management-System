import express from "express";
import User from "../models/User.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

// ---------------- Get all students ----------------
router.get("/students", adminAuth, async (req, res) => {
  const students = await User.find({ role: "student" }).select("-password");
  res.json(students);
});

// ---------------- Get all instructors ----------------
router.get("/instructors", adminAuth, async (req, res) => {
  const instructors = await User.find({ role: "instructor" }).select("-password");
  res.json(instructors);
});

// ---------------- Delete user ----------------
router.delete("/user/:id", adminAuth, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted successfully" });
});

// ---------------- Update user role ----------------
router.put("/user/:id/role", adminAuth, async (req, res) => {
  const { role } = req.body;
  if (!["student", "instructor", "admin"].includes(role)) return res.status(400).json({ message: "Invalid role" });

  const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select("-password");
  res.json(user);
});

export default router;
