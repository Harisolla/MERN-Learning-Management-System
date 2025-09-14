import { useEffect, useState } from "react";
import API from "../utils/axios";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function InstructorCourses() {
  const [courses, setCourses] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await API.get("/courses/mine");
        setCourses(data);
      } catch (err) {
        console.error("Fetch courses error:", err.message);
        toast.error("Failed to load courses");
      }
    };
    fetchCourses();
  }, []);

  const handleDeleteCourse = async (courseId) => {
    if (!courseId) {
      console.error("No course ID provided");
      return;
    }

    setLoadingId(courseId);
    try {
      await API.delete(`/courses/${courseId}`);
      toast.success("Course deleted successfully");
      setCourses((prev) => prev.filter((c) => c._id !== courseId));
      setConfirmDelete(null);
    } catch (err) {
      console.error("Delete course error:", err);
      toast.error("Failed to delete course");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <main className="max-w-6xl mx-auto py-10 px-4 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">My Courses</h1>

      {/* Confirm Delete Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-80 text-center">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">Delete Course</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete <b>{confirmDelete.title}</b>?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteCourse(confirmDelete._id)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                {loadingId === confirmDelete._id ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Course Cards Grid */}
      {courses.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence>
            {courses.map((course) => (
              <motion.div
                key={course._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-gradient-to-br from-blue-200 to-purple-100 rounded-xl shadow-md p-5 flex flex-col justify-between hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 line-clamp-2">
                    {course.title}
                  </h2>
                  <p className="text-gray-600 text-sm mt-2 line-clamp-3">
                    {course.description}
                  </p>
                </div>

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => (window.location.href = `/course-editor/${course._id}`)}
                    className="flex-1 px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setConfirmDelete(course)}
                    className="flex-1 px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    {loadingId === course._id ? (
                      <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4 inline-block"></span>
                    ) : (
                      "Delete"
                    )}
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <p className="text-gray-500 text-center">No courses found.</p>
      )}
    </main>
  );
}