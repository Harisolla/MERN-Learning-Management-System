import { useState } from "react";
import { useNavigate } from "react-router-dom"; // <-- import useNavigate
import API from "../utils/axios";
import toast from "react-hot-toast";

export default function CreateCourse() {
  const navigate = useNavigate(); // <-- initialize navigate
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [sections, setSections] = useState([]);
  const [pdfs, setPdfs] = useState([]);

  const addSection = () => {
    setSections([...sections, { title: "", lessons: [] }]);
  };

  const updateSection = (index, value) => {
    const updated = [...sections];
    updated[index].title = value;
    setSections(updated);
  };

  const addLesson = (sectionIndex) => {
    const updated = [...sections];
    updated[sectionIndex].lessons.push({ title: "", content: "" });
    setSections(updated);
  };

  const updateLesson = (sIndex, lIndex, field, value) => {
    const updated = [...sections];
    updated[sIndex].lessons[lIndex][field] = value;
    setSections(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);

      // Add sections and lessons as JSON string
      formData.append("sections", JSON.stringify(sections));

      // Add PDFs
      pdfs.forEach((file) => {
        formData.append("pdfs", file);
      });

      const { data } = await API.post("/courses", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Course created successfully!");

      // Reset form
      setTitle("");
      setDescription("");
      setSections([]);
      setPdfs([]);

      // Redirect to dashboard
      navigate("/dashboard"); // <-- redirect
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Error creating course");
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Create New Course</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Course Title */}
        <input
          type="text"
          placeholder="Course Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-gray-300 p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />

        {/* Course Description */}
        <textarea
          placeholder="Course Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-gray-300 p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          rows={4}
        />

        {/* PDF Upload */}
        <div className="flex items-center border border-gray-300 rounded-lg p-2 bg-white shadow-sm">
          <input
            type="file"
            accept=".pdf"
            multiple
            onChange={(e) => setPdfs(Array.from(e.target.files))}
            className="w-full text-gray-700 focus:outline-none"
          />
        </div>

        {/* Sections */}
        <h2 className="text-2xl font-semibold text-gray-800">Sections</h2>
        {sections.map((section, sIndex) => (
          <div key={sIndex} className="border border-gray-200 p-4 rounded-xl shadow-sm mb-6 bg-white">
            <input
              type="text"
              placeholder="Section Title"
              value={section.title}
              onChange={(e) => updateSection(sIndex, e.target.value)}
              className="w-full border border-gray-300 p-2 rounded-md mb-3 shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
            />

            <h3 className="text-lg font-medium text-gray-700 mb-2">Lessons</h3>
            {section.lessons.map((lesson, lIndex) => (
              <div key={lIndex} className="ml-4 mb-4 p-3 border border-gray-100 rounded-lg bg-gray-50">
                <input
                  type="text"
                  placeholder="Lesson Title"
                  value={lesson.title}
                  onChange={(e) => updateLesson(sIndex, lIndex, "title", e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded-md mb-2 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                <textarea
                  placeholder="Lesson Content"
                  value={lesson.content}
                  onChange={(e) => updateLesson(sIndex, lIndex, "content", e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  rows={3}
                />
              </div>
            ))}

            <button
              type="button"
              onClick={() => addLesson(sIndex)}
              className="mt-2 inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            >
              + Add Lesson
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={addSection}
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        >
          + Add Section
        </button>

        <button
          type="submit"
          className="w-full mt-6 px-6 py-3 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition font-semibold"
        >
          Create Course
        </button>
      </form>
    </div>
  );
}
