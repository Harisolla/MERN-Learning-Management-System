import express from "express";
import Course from "../models/Course.js";
import auth from "../middleware/auth.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// ---------------- Multer setup ----------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "./uploads/pdfs";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
  // Replace spaces with underscores and remove unsafe characters
  const safeName = file.originalname.replace(/\s+/g, "_").replace(/[^\w.-]/g, "");
  cb(null, safeName);
},

});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") cb(null, true);
    else cb(new Error("Only PDF files are allowed"));
  },
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
});

// ---------------- Create Course ----------------
router.post("/", auth, upload.array("pdfs", 5), async (req, res) => {
  try {
    if (req.user.role !== "instructor")
      return res.status(403).json({ message: "Only instructors can create courses" });

    const { title, description, sections } = req.body;
    const parsedSections = sections ? JSON.parse(sections) : []; // sections must be JSON string from frontend

    const pdfs = req.files ? req.files.map(f => f.path.replace(/\\/g, "/")) : [];

    const course = new Course({
      title,
      description,
      instructor: req.user.id,
      sections: parsedSections,
      attachments: pdfs,
    });

    await course.save();
    res.status(201).json(course);
  } catch (err) {
    console.error("Create course error:", err.message, err.stack);
    res.status(500).json({ message: "Failed to create course" });
  }
});


// ---------------- Get All Courses ----------------
router.get("/", auth, async (req, res) => {
  try {
    const courses = await Course.find().populate("instructor", "name email");
    res.json(courses);
  } catch (err) {
    console.error("Get courses error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------- Get My Courses ----------------
router.get("/mine", auth, async (req, res) => {
  try {
    if (req.user.role !== "instructor")
      return res.status(403).json({ message: "Only instructors can view this" });

    const courses = await Course.find({ instructor: req.user.id }).populate(
      "instructor",
      "name email"
    );
    res.json(courses);
  } catch (err) {
    console.error("Get instructor courses error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------- Get Single Course ----------------
router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate("instructor", "name email");

    if (!course) return res.status(404).json({ message: "Course not found" });

    // Defensive defaults
    course.sections = Array.isArray(course.sections) ? course.sections : [];
    course.attachments = Array.isArray(course.attachments) ? course.attachments : [];
    course.sections.forEach(section => {
      section.lessons = Array.isArray(section.lessons) ? section.lessons : [];
    });

    res.json(course);
  } catch (err) {
    console.error("Fetch course error:", err.message, err.stack);
    res.status(500).json({ message: "Server error" });
  }
});


// ---------------- Add Section ----------------
router.post("/:courseId/sections", auth, async (req, res) => {
  try {
    if (req.user.role !== "instructor") return res.status(403).json({ message: "Not allowed" });

    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    course.sections.push({ title: req.body.title, lessons: [] });
    await course.save();

    res.json(course);
  } catch (err) {
    console.error("Add section error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------- Update Section ----------------
router.put("/:courseId/sections/:sectionId", auth, async (req, res) => {
  try {
    if (req.user.role !== "instructor") return res.status(403).json({ message: "Not allowed" });

    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const section = course.sections.id(req.params.sectionId);
    if (!section) return res.status(404).json({ message: "Section not found" });

    section.title = req.body.title || section.title;
    await course.save();

    res.json(course);
  } catch (err) {
    console.error("Update section error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------- Delete Section ----------------
router.delete("/:courseId/sections/:sectionId", auth, async (req, res) => {
  try {
    if (req.user.role !== "instructor")
      return res.status(403).json({ message: "Not allowed" });

    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    course.sections.pull({ _id: req.params.sectionId });
    await course.save();

    res.json(course);
  } catch (err) {
    console.error("Delete section error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------- Add Lesson ----------------
router.post("/:courseId/sections/:sectionId/lessons", auth, async (req, res) => {
  try {
    if (req.user.role !== "instructor") return res.status(403).json({ message: "Not allowed" });

    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const section = course.sections.id(req.params.sectionId);
    if (!section) return res.status(404).json({ message: "Section not found" });

    section.lessons.push({
      title: req.body.title,
      content: req.body.content || "",
      videoUrl: req.body.videoUrl || "",
    });

    await course.save();
    res.json(course);
  } catch (err) {
    console.error("Add lesson error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------- Update Lesson ----------------
router.put("/:courseId/sections/:sectionId/lessons/:lessonId", auth, async (req, res) => {
  try {
    if (req.user.role !== "instructor") return res.status(403).json({ message: "Not allowed" });

    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const section = course.sections.id(req.params.sectionId);
    if (!section) return res.status(404).json({ message: "Section not found" });

    const lesson = section.lessons.id(req.params.lessonId);
    if (!lesson) return res.status(404).json({ message: "Lesson not found" });

    lesson.title = req.body.title || lesson.title;
    lesson.content = req.body.content || lesson.content;
    lesson.videoUrl = req.body.videoUrl || lesson.videoUrl;

    await course.save();
    res.json(course);
  } catch (err) {
    console.error("Update lesson error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------- Delete Lesson ----------------
router.delete("/:courseId/sections/:sectionId/lessons/:lessonId", auth, async (req, res) => {
  try {
    if (req.user.role !== "instructor") return res.status(403).json({ message: "Not allowed" });

    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const section = course.sections.id(req.params.sectionId);
    if (!section) return res.status(404).json({ message: "Section not found" });

    section.lessons.pull({ _id: req.params.lessonId });
    await course.save();

    res.json(course);
  } catch (err) {
    console.error("Delete lesson error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});


// ---------------- Add Global PDFs ----------------
router.post("/:courseId/pdf", auth, upload.array("pdfs", 5), async (req, res) => {
  try {
    if (req.user.role !== "instructor") return res.status(403).json({ message: "Not allowed" });

    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    if (!req.files || req.files.length === 0)
      return res.status(400).json({ message: "No PDFs uploaded" });

    if (!Array.isArray(course.attachments)) course.attachments = [];

    const pdfPaths = req.files.map(f => f.path.replace(/\\/g, "/"));
    course.attachments.push(...pdfPaths);

    await course.save();
    res.json({ message: "PDFs added", attachments: course.attachments });
  } catch (err) {
    console.error("Add global PDFs error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});


// DELETE a course
router.delete("/:courseId", auth, async (req, res) => {
  try {
    const { courseId } = req.params;
    if (!courseId) return res.status(400).json({ message: "No course ID provided" });

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    // Only instructor can delete
    if (req.user.role !== "instructor") {
      return res.status(403).json({ message: "Not allowed" });
    }

    // Combine all PDF paths: attachments + globalPdfs
    const allPDFs = [
      ...(Array.isArray(course.attachments) ? course.attachments : []),
      ...(Array.isArray(course.globalPdfs) ? course.globalPdfs : []),
    ];

    // Delete PDF files from server
    allPDFs.forEach((filePath) => {
      const fullPath = path.join(__dirname, "..", filePath); // already relative to uploads/pdfs
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
        console.log(`Deleted file: ${fullPath}`);
      }
    });

    // Delete course from database
    await Course.findByIdAndDelete(courseId);

    res.json({ message: "Course and all related PDFs deleted successfully" });
  } catch (err) {
    console.error("Delete course error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});








export default router;
