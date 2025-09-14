import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CourseCard from "../components/CourseCard";
import { useAuth } from "../context/AuthContext";
import API from "../utils/axios";


export default function MyCourses() {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const { auth } = useAuth();

  useEffect(() => {
    const fetchEnrolled = async () => {
      try {
        const { data } = await API.get("/enrollments/my");
        setEnrolledCourses(data);
      } catch (err) {
        console.error(err);
      }
    };
    if (auth?.token) fetchEnrolled();
  }, [auth]);

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-6">
          My Courses
        </h1>
        {enrolledCourses.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {enrolledCourses
              .filter((c) => c) // remove null courses
              .map((c) => (
                <Link key={c._id} to={`/courses/${c._id}`}>
                  <CourseCard
                    title={c.title}
                    description={c.description}
                    instructor={c.instructor?.name || "Unknown"}
                  />
                </Link>
              ))}
          </div>
        ) : (
          <p className="text-center text-xl text-gray-500">
            You haven’t enrolled in any courses yet.
          </p>
        )}
      </div>
    </main>
  );
}
