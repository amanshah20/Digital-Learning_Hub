import { useState } from "react";
import StudentDashboard from "./StudentDashboard";
import TeacherDashboard from "./TeacherDashboard";
import AdminDashboard from "./AdminDashboard";
import CoursesModule from "./CoursesModule";
import "./DashboardContainer.css";

function DashboardContainer() {
  const [activeDashboard, setActiveDashboard] = useState("student");

  const renderModule = () => {
    if (activeDashboard === "student") {
      return <StudentDashboard />;
    }

    if (activeDashboard === "teacher") {
      return <TeacherDashboard />;
    }

    if (activeDashboard === "admin") {
      return <AdminDashboard />;
    }

    return <CoursesModule />;
  };

  return (
    <div className="dashboards-root">
      <header className="dashboard-header">
        <h1>Digital Learning Hub</h1>
        <div className="dashboard-switch">
          <button
            className={activeDashboard === "student" ? "switch-btn active" : "switch-btn"}
            onClick={() => setActiveDashboard("student")}
          >
            Student Dashboard
          </button>
          <button
            className={activeDashboard === "teacher" ? "switch-btn active" : "switch-btn"}
            onClick={() => setActiveDashboard("teacher")}
          >
            Teacher Dashboard
          </button>
          <button
            className={activeDashboard === "admin" ? "switch-btn active" : "switch-btn"}
            onClick={() => setActiveDashboard("admin")}
          >
            Admin Dashboard
          </button>
          <button
            className={activeDashboard === "courses" ? "switch-btn active" : "switch-btn"}
            onClick={() => setActiveDashboard("courses")}
          >
            Courses Module
          </button>
        </div>
      </header>

      {renderModule()}
    </div>
  );
}

export default DashboardContainer;