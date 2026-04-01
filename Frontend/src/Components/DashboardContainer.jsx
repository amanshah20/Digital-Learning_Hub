import { useState } from "react";
import StudentDashboard from "./StudentDashboard";
import TeacherDashboard from "./TeacherDashboard";
import "./DashboardContainer.css";

function DashboardContainer() {
  const [activeDashboard, setActiveDashboard] = useState("student");

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
        </div>
      </header>

      {activeDashboard === "student" ? <StudentDashboard /> : <TeacherDashboard />}
    </div>
  );
}

export default DashboardContainer;