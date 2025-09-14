import { useEffect, useState } from "react";
import API from "../utils/axios";
import toast from "react-hot-toast";

export default function AdminDashboard() {
  const [students, setStudents] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const [s, i] = await Promise.all([
        API.get("/admin/students"),
        API.get("/admin/instructors")
      ]);
      setStudents(s.data);
      setInstructors(i.data);
    } catch (err) {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await API.delete(`/admin/user/${id}`);
      toast.success("User deleted");
      fetchUsers();
    } catch {
      toast.error("Failed to delete user");
    }
  };

  const changeRole = async (id, role) => {
    try {
      await API.put(`/admin/user/${id}/role`, { role });
      toast.success("Role updated");
      fetchUsers();
    } catch {
      toast.error("Failed to update role");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading users...</p>;

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Students Section */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Students</h2>
        {students.map((u) => (
          <div
            key={u._id}
            className="flex justify-between items-center mb-2 p-3 bg-gray-100 rounded-lg shadow-sm"
          >
            <p>{u.name} ({u.email})</p>
            <div className="flex gap-2">
              <button
                onClick={() => deleteUser(u._id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
              <button
                onClick={() => changeRole(u._id, "instructor")}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              >
                Make Instructor
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Instructors Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Instructors</h2>
        {instructors.map((u) => (
          <div
            key={u._id}
            className="flex justify-between items-center mb-2 p-3 bg-gray-100 rounded-lg shadow-sm"
          >
            <p>{u.name} ({u.email})</p>
            <div className="flex gap-2">
              <button
                onClick={() => deleteUser(u._id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
              <button
                onClick={() => changeRole(u._id, "student")}
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
              >
                Make Student
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
