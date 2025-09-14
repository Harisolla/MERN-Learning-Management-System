import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CourseCard from "../components/CourseCard";
import { useAuth } from "../context/AuthContext";
import API from "../utils/axios";
import toast from "react-hot-toast";   // ✅ import toast

export default function Dashboard() {
  const { auth } = useAuth();
  const role = auth?.role?.toLowerCase();

  const [courses, setCourses] = useState([]);
  const [enrolledIds, setEnrolledIds] = useState([]);

useEffect(() => {
    if (role === "student") {
      const fetchEnrolled = async () => {
        try {
          const { data } = await API.get("/enrollments/my");
          // Store enrolled course IDs
          const ids = data.map((c) => c._id);
          setEnrolledIds(ids);
        } catch (err) {
          console.error("Failed to fetch enrolled courses:", err);
        }
      };
      fetchEnrolled();
    }
  }, [role]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await API.get("/courses");
        setCourses(data);
      } catch (err) {
        console.error("Failed to fetch courses:", err);
      }
    };
    fetchCourses();
  }, []);

  const handleEnroll = async (id) => {
    try {
      await API.post(`/enrollments/${id}`);
      setEnrolledIds((prev) => [...prev, id]); // ✅ update state
      toast.success("Enrolled successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error enrolling");
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 sm:gap-0">
  {/* Left side: Welcome message */}
  <div className="text-center sm:text-left">
    <h1 className="text-4xl font-extrabold text-gray-900">Dashboard</h1>
    <p className="mt-2 text-lg text-gray-600">
      Welcome, you are logged in as{" "}
      <span className="font-bold capitalize text-green-600">{role}</span>.
    </p>
  </div>

  {/* Right side: Action buttons */}
  <div className="flex flex-wrap gap-3">
    {/* Instructor: Create Course */}
    {role === "instructor" && (
      <Link
        to="/create-course"
        className="inline-flex items-center px-6 py-3 text-base font-medium rounded-lg shadow-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
      >
        + Create Course
      </Link>
    )}

    {/* Instructor: My Courses */}
    {role === "instructor" && (
      <Link
        to="/instructor-courses"
        className="inline-flex items-center px-6 py-3 text-base font-medium rounded-lg shadow-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
      >
        📘 My Courses
      </Link>
    )}

    {/* Student: My Courses */}
    {role === "student" && (
      <Link
        to="/my-courses"
        className="inline-flex items-center px-6 py-3 text-base font-medium rounded-lg shadow-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
      >
        📚 My Courses
      </Link>
    )}
  </div>
</header>


        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {role === "student" ? "All Courses" : "My Courses"}
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {courses.length > 0 ? (
              courses.map((c) => (
                <Link key={c._id} to={`/courses/${c._id}`}>
                <CourseCard
                  title={c.title}
                  description={c.description}
                  instructor={c.instructor?.name}
                  onEnroll={
                    role === "student" ? () => handleEnroll(c._id) : null
                  }
                  enrolled={enrolledIds.includes(String(c._id))} // ✅ fix check
                />
                </Link>
              ))
            ) : (
              <p className="text-gray-600">No courses available yet.</p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
