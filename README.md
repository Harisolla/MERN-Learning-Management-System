# EduSphere – Role-Based Enterprise Learning Platform

> A high-performance, full-stack Learning Management System (LMS) designed for scalable educational delivery, featuring multi-role dashboards, secure content management, and real-time progress tracking.

Built with the **MERN Stack (MongoDB, Express.js, React.js, Node.js)**, this project demonstrates advanced Role-Based Access Control (RBAC), secure document handling, and complex state management.

---

## ✅ Why This Project Stands Out

✅ **Enterprise-Grade RBAC:** Three distinct user tiers (Student, Instructor, Admin) with granular permissions.  
✅ **Asynchronous Content Delivery:** Efficient handling of lessons, sections, and PDF-based study materials.  
✅ **Dynamic Progress Engine:** Real-time completion tracking and automated percentage calculations.  
✅ **Secure Document Handling:** Protected access to intellectual property and course materials.  
✅ **State-Driven UX:** Centralized state management for a seamless, synchronized learning experience.

This is a **production-ready educational ecosystem** designed for high-concurrency environments.

---

## 🛠️ Key Features

### 🎓 Student Experience
- Secure onboarding and profile management.
- Intuitive course discovery and enrollment.
- Visual progress tracking with lesson "mark-complete" functionality.
- High-speed PDF material viewer and downloader.

### 👨‍🏫 Instructor Suite
- Comprehensive course architecting (Sections, Lessons, Resources).
- Dynamic content management and real-time updates.
- Centralized PDF material upload and asset management.

### 🛡️ Administrative Governance
- Global user oversight (Student & Instructor management).
- Dynamic Role Switching (Elevate students to instructors).
- System-wide data integrity and account deletion controls.

---

## 💻 Tech Stack

### Backend
- **Node.js & Express.js**
- **MongoDB** (NoSQL Database)
- **Mongoose ODM** (Schema Design)
- **JWT** (Security Middleware)

### Frontend
- **React.js** (Functional Components & Hooks)
- **React Router** (Role-Based Routing)
- **Tailwind CSS** (Responsive Design)

---

## 🏗️ System Architecture

EduSphere utilizes a **Decoupled 3-Tier Architecture** to ensure independent scaling of the frontend and backend layers.



**Frontend Layer**
- React-based Single Page Application (SPA).
- Implements Private Routes to prevent unauthorized access.

**Backend Layer**
- RESTful API logic powered by Express.js.
- Implements JWT-based interceptors for every protected request.

---

## 🔑 Authentication & Role-Based Flow

1. **Verification:** User attempts to access a protected dashboard.
2. **Middleware Check:** Express middleware extracts the **JWT** from the header.
3. **Role Validation:** System checks the `userRole` payload against the requested route.
4. **Access Control:** Prevents unauthorized content manipulation.



---

## 📊 Database Design (Mongoose Schemas)

The system leverages a non-relational model optimized for **low-latency reads**:

| Collection | Key Fields |
|------------|------------|
| `Users` | Name, Email, Hash, Role (Enum: Student, Instructor, Admin) |
| `Courses` | Title, Description, InstructorID, LessonsCount |
| `Enrollments` | UserID, CourseID, CompletedLessons[], Progress% |

---

## ⚙️ Engineering Highlights

✅ **State Synchronization:** Real-time updates to student progress across devices.  
✅ **Schema Optimization:** Utilized Mongoose population for complex course trees.  
✅ **Granular Security:** Prevented unauthorized access via backend-level permission checks.  
✅ **Tailwind-Driven UI:** 100% responsive design for mobile and desktop learning.  

---

## 🚀 Installation

1. Clone the repo: `git clone https://github.com/yourusername/edusphere.git`
2. Install dependencies: `npm install`
3. Start the server: `npm start`
