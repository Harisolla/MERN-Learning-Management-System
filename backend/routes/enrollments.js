import express from "express";
import auth from "../middleware/auth.js";
import Enrollment from "../models/Enrollment.js";
import Course from "../models/Course.js";

const router = express.Router();

// @route   POST /api/enrollments/:courseId
//  Enroll student in a course
router.post("/:courseId", auth, async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({ message: "Only students can enroll" });
    }

    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const enrollment = new Enrollment({
      student: req.user.id,
      course: course._id,
    });

    await enrollment.save();
    res.status(201).json({ message: "Enrolled successfully" });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "Already enrolled in this course" });
    }
    console.error("Enrollment error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/enrollments/my
//     Get logged-in student's enrolled courses
router.get("/my", auth, async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({ message: "Only students can view enrollments" });
    }

    const enrollments = await Enrollment.find({
      student: req.user.id,
    }).populate({
      path: "course",
      populate: {
        path: "instructor",
        select: "name", 
      },
    });
    const courses = enrollments.map((e) => e.course).filter((c) => c !== null); 

    res.json(courses);
  } catch (err) {
    console.error("Get enrollments error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});



export default router;
