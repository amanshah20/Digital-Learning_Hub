import React, { useState } from "react";
import "./index.css";

function App() {
  const [tasks, setTasks] = useState([
    { id: 1, text: "Complete React Project", done: true },
    { id: 2, text: "Study DSA", done: false },
    { id: 3, text: "Submit Assignment", done: false },
  ]);

  const toggleTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    );
  };

  const completed = tasks.filter((t) => t.done).length;
  const progress = Math.round((completed / tasks.length) * 100);

  return (
    <div className="container">
      {/* Sidebar */}
      <div className="sidebar">
        <h2>🎓 Student</h2>
        <ul>
          <li className="active">Dashboard</li>
          <li>Courses</li>
          <li>Assignments</li>
          <li>Profile</li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main">
        <h1>Welcome, Rajan 👋</h1>

        {/* Stats */}
        <div className="cards">
          <div className="card">
            <h3>Courses</h3>
            <p>5</p>
          </div>
          <div className="card">
            <h3>Assignments</h3>
            <p>3</p>
          </div>
          <div className="card">
            <h3>Progress</h3>
            <p>{progress}%</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="progress-section">
          <h3>Overall Progress</h3>
          <div className="progress-bar">
            <div
              className="progress"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Task List */}
        <div className="tasks">
          <h3>Your Tasks</h3>
          {tasks.map((task) => (
            <div key={task.id} className="task">
              <input
                type="checkbox"
                checked={task.done}
                onChange={() => toggleTask(task.id)}
              />
              <span className={task.done ? "done" : ""}>
                {task.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;