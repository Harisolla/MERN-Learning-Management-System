export default function CourseCard({ title, description, instructor, onEnroll, enrolled }) {
  return (
    <div className="flex flex-col rounded-xl bg-white p-6 shadow-md transition-all duration-300 hover:shadow-xl bg-gradient-to-br from-blue-100 to-purple-100">
      <h3 className="text-2xl font-bold  text-gray-900">{title}</h3>
      <p className="mt-2 flex-grow text-gray-600">{description}</p>
      
      {instructor && (
        <p className="mt-4 text-sm font-medium text-gray-500">
          Instructor: <span className="font-semibold text-gray-700">{instructor}</span>
        </p>
      )}

      {/* Student Enroll Button */}
      {onEnroll && !enrolled && (
        <button
          onClick={onEnroll}
          disabled={enrolled}
          className="mt-4 w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Enroll Now
        </button>
      )}

      {enrolled && (
        <div className="mt-4 flex items-center justify-center rounded-lg bg-green-50 px-4 py-2 text-sm font-semibold text-green-700">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="mr-2 h-5 w-5">
            <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9.5 13.5a.75.75 0 01-1.141.026l-5.5-5.5a.75.75 0 011.06-1.06l4.97 4.97L19.708 5.666a.75.75 0 011.04-.208z" clipRule="evenodd" />
          </svg>
          Enrolled
        </div>
      )}
    </div>
  );
}