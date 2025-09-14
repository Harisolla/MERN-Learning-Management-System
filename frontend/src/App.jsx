import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateCourse from "./pages/CreateCourse";
import ProtectedRoute from "./components/ProtectedRoute";
import { Toaster } from "react-hot-toast";
import MyCourses from "./pages/MyCourses";
import InstructorCourses from "./pages/InstructorCourses";
import CourseViewer from "./pages/CourseViewer";
import CourseEditor from "./pages/CourseEditor";
import AdminDashboard from "./pages/AdminDashboard";


// src/App.jsx
export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 p-4 bg-gray-100">
        <Toaster
          position="top-center" // ✅ move popup to middle top
          toastOptions={{
            style: {
              fontSize: "16px",
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
            },
          }}
        />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create-course" element={<CreateCourse />} />
            <Route path="/my-courses" element={<MyCourses />} />
            <Route path="/instructor-courses" element={<InstructorCourses />} />
            <Route path="/courses/:id" element={<CourseViewer />} />
            <Route path="/course-editor/:id" element={<CourseEditor />} />
            <Route path="/adminDashboard" element={<AdminDashboard />} />



          </Route>
        </Routes>
      </main>
    </div>
  );
}

