import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import API from "../utils/axios";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function CourseViewer() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [openSection, setOpenSection] = useState(null);
  const [completedLessons, setCompletedLessons] = useState([]);
  const role = localStorage.getItem("role"); // "student" or "instructor"

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await API.get(`/courses/${id}`);
        console.log("Course fetched:", data);

        // Ensure arrays exist
        data.sections = Array.isArray(data.sections) ? data.sections : [];
        data.sections.forEach((section) => {
          section.lessons = Array.isArray(section.lessons) ? section.lessons : [];
        });

        // Combine PDFs from attachments + globalPdfs
        const allPDFs = [
          ...(Array.isArray(data.attachments) ? data.attachments : []),
          ...(Array.isArray(data.globalPdfs) ? data.globalPdfs : [])
        ];

        // Fix server paths for display
        data.allPDFs = allPDFs.map((pdf) => {
          if (pdf.startsWith("uploads/")) return pdf;
          return `uploads/pdfs/${pdf.split("/").pop()}`;
        });

        setCourse(data);

        // Fetch student progress
        if (role === "student") {
          const progressRes = await API.get("/progress/user");
          setCompletedLessons(progressRes.data.completedLessons || []);
        }
      } catch (err) {
        console.error("Course load error:", err.message);
        toast.error("Failed to load course");
      }
    };
    fetchData();
  }, [id, role]);

  // Toggle lesson completion
  const toggleLesson = async (sectionId, lessonId) => {
    try {
      const { data } = await API.post("/progress/lesson", {
        courseId: course._id,
        sectionId,
        lessonId,
      });
      setCompletedLessons(data.completedLessons || []);
    } catch (err) {
      console.error("Toggle lesson error:", err.message);
      toast.error("Failed to update lesson completion");
    }
  };

  // Check if a lesson is completed
  const isCompleted = (sectionId, lessonId) =>
    completedLessons.some(
      (l) => l.course === course._id && l.section === sectionId && l.lesson === lessonId
    );

  // Progress calculation
  const totalLessons = course?.sections?.reduce(
    (sum, sec) => sum + (sec.lessons?.length || 0),
    0
  );
  const completedCount = completedLessons.filter((l) => l.course === course?._id).length;
  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  if (!course) return <p className="text-center py-10">Course not found</p>;

  return (
    <main className="max-w-4xl mx-auto py-10 px-4">
      {/* Course Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-8 rounded-2xl shadow-md mb-6">
        <h1 className="text-4xl font-bold">{course.title}</h1>
        <p className="mt-2 text-lg opacity-90">{course.description}</p>
        <p className="mt-3 text-sm">Instructor: {course.instructor?.name}</p>
      </div>

      {/* Course Resources (Global PDFs) */}
      {course.allPDFs?.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-md mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Course Resources
          </h2>
          <ul className="space-y-2">
            {course.allPDFs.map((pdf, index) => (
              <li key={index} className="flex items-center space-x-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="size-6"
                >
                  <path d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625Z" />
                  <path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z" />
                </svg>

                <a
                  href={`http://localhost:5000/${pdf}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-blue-600 hover:underline truncate"
                >
                  {pdf.split("/").pop()}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Progress bar */}
      {role === "student" && (
        <div className="mb-8">
          <p className="text-gray-700 font-semibold mb-1">
            Progress: {progressPercent}%
          </p>
          <div className="w-full bg-gray-200 h-4 rounded-full overflow-hidden">
            <motion.div
              className="h-4 bg-green-500"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      )}

      {/* Sections */}
      {course.sections.length > 0 ? (
        <div className="space-y-4">
          {course.sections.map((section, sIndex) => (
            <div
              key={section._id || sIndex}
              className="border rounded-xl shadow-sm overflow-hidden"
            >
              <button
                onClick={() =>
                  setOpenSection(openSection === sIndex ? null : sIndex)
                }
                className="w-full flex justify-between items-center px-6 py-4 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <span className="font-semibold text-lg text-gray-800">
                  {section.title}
                </span>
                <span className="text-gray-600">
                  {openSection === sIndex ? "−" : "+"}
                </span>
              </button>

              <AnimatePresence initial={false}>
                {openSection === sIndex && (
                  <motion.div
                    key="content"
                    initial={{ opacity: 0, maxHeight: 0 }}
                    animate={{ opacity: 1, maxHeight: 1000 }} // large enough maxHeight
                    exit={{ opacity: 0, maxHeight: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="px-6 py-4 bg-white space-y-3 overflow-hidden"
                  >
                    {/* Lessons */}
                    {section.lessons.length > 0 ? (
                      section.lessons.map((lesson, lIndex) => {
                        const completed = isCompleted(section._id, lesson._id);
                        const videoUrl = lesson.videoUrl
                          ? `http://localhost:5000/${lesson.videoUrl}`
                          : null;

                        return (
                          <motion.div
                            key={lesson._id || lIndex}
                            className="p-4 border rounded-lg shadow-sm bg-gray-50 hover:bg-gray-100 flex justify-between items-start gap-4"
                            whileHover={{ scale: 1.01 }}
                          >
                            <div className="flex-1">
                              <h3 className="font-bold text-lg text-indigo-700">
                                {lesson.title}
                              </h3>
                              <p className="text-gray-700 mt-1 text-sm">
                                {lesson.content}
                              </p>

                              {videoUrl && (
                                <video
                                  controls
                                  className="w-full rounded-lg shadow mt-3"
                                  src={videoUrl}
                                />
                              )}
                            </div>
                            {role === "student" && (
                              <button
                                onClick={() =>
                                  toggleLesson(section._id, lesson._id)
                                }
                                className={`w-8 h-8 flex items-center justify-center rounded-full border-2 transition-colors ${
                                  completed
                                    ? "bg-green-500 border-green-500 text-white"
                                    : "bg-white border-gray-300 text-gray-400 hover:bg-green-100"
                                }`}
                              >
                                {completed ? "✔" : ""}
                              </button>
                            )}
                          </motion.div>
                        );
                      })
                    ) : (
                      <p className="text-gray-500 italic">No lessons yet.</p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">This course has no sections yet.</p>
      )}
    </main>
  );
}