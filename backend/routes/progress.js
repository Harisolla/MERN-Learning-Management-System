import express from "express";
import auth from "../middleware/auth.js";
import Progress from "../models/Progress.js";

const router = express.Router();

// Get user progress (only for students)
router.get("/user", auth, async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.json({ completedLessons: [] }); // Instructors get no progress
    }

    const progress = await Progress.findOne({ user: req.user.id });
    res.json(progress || { completedLessons: [] });
  } catch (err) {
    console.error("Fetch progress error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Toggle lesson completion
router.post("/lesson", auth, async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({ message: "Only students can track progress" });
    }

    const { courseId, sectionId, lessonId } = req.body;
    let progress = await Progress.findOne({ user: req.user.id });

    if (!progress) {
      progress = new Progress({ user: req.user.id, completedLessons: [] });
    }

    const existingIndex = progress.completedLessons.findIndex(
      (l) =>
        l.course.toString() === courseId &&
        l.section.toString() === sectionId &&
        l.lesson.toString() === lessonId
    );

    if (existingIndex >= 0) {
      // Untick: Remove lesson from completed
      progress.completedLessons.splice(existingIndex, 1);
    } else {
      // Tick: Add lesson to completed
      progress.completedLessons.push({ course: courseId, section: sectionId, lesson: lessonId });
    }

    await progress.save();
    res.json(progress);
  } catch (err) {
    console.error("Toggle lesson error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
