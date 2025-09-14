import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useInView from "../hooks/useInView";

export default function Home() {
  const { auth } = useAuth();
   const [featuresRef, featuresInView] = useInView();
   const [ctaRef, ctaInView] = useInView();
   const [testimonialsRef, testimonialsInView] = useInView();

  return (
    <div className="font-sans bg-gray-200">
      {/* Hero Section */}
      <section className="flex min-h-[80vh] items-center justify-center p-6 relative">
        <div className="relative z-10 text-center max-w-3xl bg-white/20 p-8 sm:p-10 rounded-3xl animate-slideUp animate-fadeIn">
          <h1 className="text-5xl font-extrabold text-gray-900 sm:text-6xl md:text-7xl animate-slideUp">
            Welcome to <span className="text-green-600">MERN-LMS</span>
          </h1>
          <p className="mt-3 text-xl text-gray-700 sm:mt-4 sm:text-2xl animate-fadeIn animate-delay-200">
            Learn, Teach, and Manage Courses with Ease.
          </p>
          <div className="mt-6 flex justify-center gap-4 flex-wrap animate-fadeIn animate-delay-400">
            {auth?.token ? (
              <Link
                to="/dashboard"
                className="rounded-lg bg-green-600 px-8 py-3 text-lg font-semibold text-white shadow-md hover:scale-105 hover:bg-green-700 transition-transform transition-colors"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-lg bg-green-600 px-8 py-3 text-lg font-semibold text-white shadow-md hover:scale-105 hover:bg-green-700 transition-transform transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="rounded-lg bg-gray-200 px-8 py-3 text-lg font-semibold text-gray-700 shadow-md hover:scale-105 hover:bg-gray-300 transition-transform transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        ref={featuresRef}
        className={`mt-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-700 ${
          featuresInView
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10"
        }`}
      >
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
          Why Choose MERN-LMS?
        </h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              iconColor: "text-green-500",
              title: "Interactive Courses",
              text: "Engaging content with sections and lessons to keep students motivated.",
            },
            {
              iconColor: "text-blue-500",
              title: "Instructor Tools",
              text: "Create, manage, and track courses easily with our intuitive dashboard.",
            },
            {
              iconColor: "text-purple-500",
              title: "Progress Tracking",
              text: "Students can track their learning progress and revisit lessons anytime.",
            },
            {
              iconColor: "text-yellow-500",
              title: "Anytime Access",
              text: "Learn on your own schedule from anywhere with our online platform.",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl hover:scale-105 transition-transform transition-shadow text-center animate-fadeIn animate-delay-[200*i]"
            >
              <svg
                className={`h-10 w-10 ${feature.iconColor} mb-4 mx-auto`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 14l9-5-9-5-9 5 9 5z"
                />
              </svg>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call-to-Action Banner */}
      {!auth?.token && (
        <section
          ref={ctaRef}
          className={`mt-16 bg-green-600 text-white py-12 rounded-xl mx-4 sm:mx-6 lg:mx-8 text-center shadow-lg transition-all duration-700 ${
            ctaInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h2 className="text-3xl font-bold mb-4">Ready to Start Learning?</h2>
          <p className="mb-6 text-lg">
            Sign up today and access all courses instantly!
          </p>
          <Link
            to="/register"
            className="inline-block px-8 py-3 bg-white text-green-600 font-semibold rounded-lg shadow-md hover:scale-105 hover:bg-gray-100 transition-transform transition-colors"
          >
            Get Started
          </Link>
        </section>
      )}

      {/* Testimonials */}
      <section
        ref={testimonialsRef}
        className={`mt-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-700 ${
          testimonialsInView
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10"
        }`}
      >
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12 animate-fadeIn">
          What Our Users Say
        </h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              text: "“The MERN-LMS platform made learning web development fun and interactive!”",
              name: "Jane Doe",
            },
            {
              text: "“As an instructor, managing my courses has never been easier.”",
              name: "John Smith",
            },
            {
              text: "“I love tracking my progress and revisiting lessons anytime.”",
              name: "Alice Lee",
            },
          ].map((testimonial, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-xl shadow-md animate-fadeIn animate-delay-[150*i]"
            >
              <p className="text-gray-600 mb-4">{testimonial.text}</p>
              <h3 className="font-semibold text-gray-900">
                — {testimonial.name}
              </h3>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-16 bg-gray-800 text-white py-6 text-center">
        <p className="text-gray-300">
          &copy; {new Date().getFullYear()} MERN-LMS. All rights reserved.
        </p>
        <div className="mt-2 flex justify-center gap-4">
          <a href="#" className="hover:text-white text-gray-400 transition">
            About
          </a>
          <a href="#" className="hover:text-white text-gray-400 transition">
            Contact
          </a>
          <a href="#" className="hover:text-white text-gray-400 transition">
            Privacy Policy
          </a>
        </div>
      </footer>
    </div>
  );
}
