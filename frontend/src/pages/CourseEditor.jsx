import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import API from "../utils/axios";
import toast from "react-hot-toast";

export default function CourseEditor() {
  const { id } = useParams(); // Course ID
  const [course, setCourse] = useState(null);
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [editingSectionTitles, setEditingSectionTitles] = useState({});
  const [newLessons, setNewLessons] = useState({});
  const [editingLessons, setEditingLessons] = useState({});
  const [newPdfs, setNewPdfs] = useState([]);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const { data } = await API.get(`/courses/${id}`);
        data.attachments = Array.isArray(data.attachments) ? data.attachments : [];
        setCourse(data);
      } catch (err) {
        toast.error("Failed to load course");
      }
    };
    fetchCourse();
  }, [id]);

  // ------------------ Section CRUD ------------------
  const addSection = async () => {
    if (!newSectionTitle) return toast.error("Section title required");
    try {
      const { data } = await API.post(`/courses/${id}/sections`, { title: newSectionTitle });
      setCourse(data);
      setNewSectionTitle("");
      toast.success("Section added successfully!");
    } catch {
      toast.error("Failed to add section");
    }
  };

  const updateSection = async (sectionId, title) => {
    if (!title) return toast.error("Section title cannot be empty");
    try {
      const { data } = await API.put(`/courses/${id}/sections/${sectionId}`, { title });
      setCourse(data);
      // Reset local editing state
      setEditingSectionTitles(prev => {
        const copy = { ...prev };
        delete copy[sectionId];
        return copy;
      });
      toast.success("Section updated!");
    } catch {
      toast.error("Failed to update section");
    }
  };

  const deleteSection = async (sectionId) => {
    if (!window.confirm("Delete this section? All lessons inside will be deleted too.")) return;
    try {
      const { data } = await API.delete(`/courses/${id}/sections/${sectionId}`);
      setCourse(data);
      toast.success("Section deleted!");
    } catch {
      toast.error("Failed to delete section");
    }
  };

  // ------------------ Lesson CRUD ------------------
  const addLesson = async (sectionId) => {
    const lessonData = newLessons[sectionId] || {};
    if (!lessonData.title) return toast.error("Lesson title required");

    try {
      const { data } = await API.post(`/courses/${id}/sections/${sectionId}/lessons`, {
        title: lessonData.title,
        content: lessonData.content || "",
      });

      setCourse(data);
      setNewLessons({ ...newLessons, [sectionId]: {} });
      toast.success("Lesson added!");
    } catch (err) {
      console.error("Add lesson error:", err);
      toast.error("Failed to add lesson");
    }
  };

  const updateLesson = async (sectionId, lessonId) => {
    const lessonData = editingLessons[`${sectionId}-${lessonId}`];
    if (!lessonData || !lessonData.title) {
        toast.error("Lesson title is required for update.");
        return;
    }

    try {
        const { data } = await API.put(`/courses/${id}/sections/${sectionId}/lessons/${lessonId}`, lessonData);
        setCourse(data);
        setEditingLessons(prev => {
            const newState = { ...prev };
            delete newState[`${sectionId}-${lessonId}`];
            return newState;
        });
        toast.success("Lesson updated!");
    } catch (err) {
        console.error("Update lesson error:", err);
        toast.error("Failed to update lesson.");
    }
};

  const deleteLesson = async (sectionId, lessonId) => {
    if (!window.confirm("Delete this lesson?")) return;
    try {
      const { data } = await API.delete(`/courses/${id}/sections/${sectionId}/lessons/${lessonId}`);
      setCourse(data);
      toast.success("Lesson deleted!");
    } catch {
      toast.error("Failed to delete lesson");
    }
  };

  // ------------------ Add Global PDFs ------------------
  const handleAddGlobalPDFs = async () => {
    if (!newPdfs.length) return toast.error("Select PDF(s) to upload");

    const formData = new FormData();
    newPdfs.forEach((pdf) => formData.append("pdfs", pdf));

    try {
      const { data } = await API.post(`/courses/${id}/pdf`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setCourse((prevCourse) => ({
        ...prevCourse,
        attachments: [...(prevCourse.attachments || []), ...data.attachments.filter(
          (pdf) => !(prevCourse.attachments || []).includes(pdf)
        )],
      }));

      setNewPdfs([]);
      toast.success("PDFs added successfully");
    } catch (err) {
      console.error("Add PDFs error:", err);
      toast.error("Failed to add PDFs");
    }
  };

  if (!course) return <div className="flex justify-center items-center h-screen"><p className="text-xl text-gray-600">Loading course...</p></div>;

  return (
    <main className="max-w-6xl mx-auto py-12 px-4 md:px-6">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Edit Course</h1>
      <p className="text-xl text-gray-600 mb-8">{course.title}</p>
      
      {/* Global Course Resources */}
      <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Course Resources (PDFs)</h2>
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <input
            type="file"
            multiple
            accept=".pdf"
            onChange={(e) => setNewPdfs([...e.target.files])}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
          />
          <button onClick={handleAddGlobalPDFs} className="w-full sm:w-auto bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors">
            Add PDFs
          </button>
        </div>

        {course.attachments?.length > 0 && (
          <div>
            <h3 className="font-semibold mb-2 text-gray-700">Attached PDFs:</h3>
            <ul className="space-y-2">
              {course.attachments.map((pdf, i) => (
                <li key={i} className="flex items-center">
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
      </div>

      {/* Course Sections */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Course Content</h2>
        
        {/* Add Section */}
        <div className="flex flex-col sm:flex-row gap-2 mb-6">
          <input
            type="text"
            placeholder="New Section Title"
            value={newSectionTitle}
            onChange={(e) => setNewSectionTitle(e.target.value)}
            className="flex-1 border-b-2 border-gray-300 focus:border-indigo-500 outline-none px-2 py-2 text-lg transition-colors"
          />
          <button onClick={addSection} className="w-full sm:w-auto bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
            Add Section
          </button>
        </div>

        {/* Sections & Lessons List */}
        <div className="space-y-6">
          {course.sections?.map((section) => (
            <div key={section._id} className="bg-gray-50 p-6 rounded-lg shadow-sm">
              {/* Section Header with Save Button */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                <div className="flex items-center gap-2 flex-1">
                  <input
                    type="text"
                    value={editingSectionTitles[section._id] ?? section.title}
                    onChange={(e) =>
                      setEditingSectionTitles(prev => ({ ...prev, [section._id]: e.target.value }))
                    }
                    className="font-bold text-xl flex-1 border-b-2 border-gray-300 focus:border-purple-500 outline-none pr-4 pb-1 transition-colors bg-transparent"
                  />
                  <button
                    onClick={() => updateSection(section._id, editingSectionTitles[section._id] ?? section.title)}
                    className="bg-indigo-600 text-white px-4 py-1 rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Save
                  </button>
                </div>
                <button onClick={() => deleteSection(section._id)} className="text-red-600 hover:text-red-800 transition-colors mt-2 sm:mt-0">
                  Delete Section
                </button>
              </div>

              {/* Lessons List */}
              <div className="pl-4 space-y-4 border-l-2 border-gray-200">
                {section.lessons?.map((lesson) => {
                  const lessonKey = `${section._id}-${lesson._id}`;
                  const isEditing = editingLessons[lessonKey];
                  const lessonData = isEditing || lesson;

                  return (
                    <div key={lesson._id} className="bg-white p-4 rounded-lg shadow-md flex flex-col md:flex-row justify-between items-start md:items-center">
                      <div className="flex-1 space-y-2">
                        <input
                            type="text"
                            value={lessonData.title}
                            onChange={(e) => setEditingLessons(prev => ({
                                ...prev,
                                [lessonKey]: {...(prev[lessonKey] || lesson), title: e.target.value}
                            }))}
                            className="text-md font-semibold text-gray-800 w-full border-b border-gray-200 focus:border-blue-500 outline-none"
                        />
                        <textarea
                            value={lessonData.content}
                            onChange={(e) => setEditingLessons(prev => ({
                                ...prev,
                                [lessonKey]: {...(prev[lessonKey] || lesson), content: e.target.value}
                            }))}
                            className="text-gray-600 text-sm w-full border rounded-md p-1 focus:ring focus:ring-blue-200 outline-none"
                        />
                      </div>
                      <div className="flex flex-col gap-2 mt-4 md:mt-0 md:ml-4">
                        <button
                          onClick={() => updateLesson(section._id, lesson._id)}
                          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => deleteLesson(section._id, lesson._id)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Add Lesson Form */}
              <div className="mt-6 p-4 border border-dashed rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-2">Add a New Lesson</h4>
                <div className="flex flex-col gap-3">
                  <input
                    type="text"
                    placeholder="Lesson Title"
                    value={newLessons[section._id]?.title || ""}
                    onChange={(e) =>
                      setNewLessons({ ...newLessons, [section._id]: { ...newLessons[section._id], title: e.target.value } })
                    }
                    className="border px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <textarea
                    placeholder="Lesson Content"
                    value={newLessons[section._id]?.content || ""}
                    onChange={(e) =>
                      setNewLessons({ ...newLessons, [section._id]: { ...newLessons[section._id], content: e.target.value } })
                    }
                    className="border px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none h-24"
                  />
                  <button
                    onClick={() => addLesson(section._id)}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                  >
                    Add Lesson
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
