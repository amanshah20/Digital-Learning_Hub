import { useMemo, useState } from "react";
import "./StudentDashboard.css";

function StudentDashboard() {
  const [tasks, setTasks] = useState([
    { id: 1, text: "Complete React Project", done: true },
    { id: 2, text: "Study DSA", done: false },
    { id: 3, text: "Submit Assignment", done: false },
    { id: 4, text: "Prepare for Quiz", done: false },
  ]);

  const toggleTask = (id) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    );
  };

  const completed = useMemo(() => tasks.filter((task) => task.done).length, [tasks]);
  const progress = Math.round((completed / tasks.length) * 100);

  return (
    <section className="student-dashboard">
      <aside className="student-sidebar">
        <h2>Student</h2>
        <ul>
          <li className="active">Dashboard</li>
          <li>Courses</li>
          <li>Assignments</li>
          <li>Exams</li>
          <li>Profile</li>
        </ul>
      </aside>

      <main className="student-main">
        <h2>Welcome, Rajan</h2>

        <div className="student-cards">
          <article className="student-card">
            <h3>Enrolled Courses</h3>
            <p>6</p>
          </article>
          <article className="student-card">
            <h3>Pending Assignments</h3>
            <p>4</p>
          </article>
          <article className="student-card">
            <h3>Overall Progress</h3>
            <p>{progress}%</p>
          </article>
        </div>

        <section className="student-progress-panel">
          <h3>Semester Progress</h3>
          <div className="student-progress-bar">
            <div className="student-progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </section>

        <section className="student-tasks-panel">
          <h3>My Task List</h3>
          {tasks.map((task) => (
            <label key={task.id} className="student-task-row">
              <input
                type="checkbox"
                checked={task.done}
                onChange={() => toggleTask(task.id)}
              />
              <span className={task.done ? "done" : ""}>{task.text}</span>
            </label>
          ))}
        </section>
      </main>
    </section>
  );
}

export default StudentDashboard;