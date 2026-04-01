import "./TeacherDashboard.css";

const submissions = [
  { student: "Anjali", subject: "React Basics", status: "Reviewed" },
  { student: "Karan", subject: "Node API", status: "Pending" },
  { student: "Meera", subject: "Database Design", status: "Reviewed" },
  { student: "Aman", subject: "CSS Layout", status: "Pending" },
];

function TeacherDashboard() {
  return (
    <section className="teacher-dashboard">
      <aside className="teacher-sidebar">
        <h2>Teacher</h2>
        <ul>
          <li className="active">Dashboard</li>
          <li>Classes</li>
          <li>Students</li>
          <li>Submissions</li>
          <li>Analytics</li>
        </ul>
      </aside>

      <main className="teacher-main">
        <h2>Welcome, Professor Rajan</h2>

        <div className="teacher-cards">
          <article className="teacher-card">
            <h3>Total Classes</h3>
            <p>8</p>
          </article>
          <article className="teacher-card">
            <h3>Active Students</h3>
            <p>124</p>
          </article>
          <article className="teacher-card">
            <h3>Assignments to Review</h3>
            <p>17</p>
          </article>
          <article className="teacher-card">
            <h3>Average Class Score</h3>
            <p>84%</p>
          </article>
        </div>

        <section className="teacher-panel">
          <h3>Recent Submissions</h3>
          <div className="teacher-table-wrap">
            <table className="teacher-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Assignment</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((row) => (
                  <tr key={`${row.student}-${row.subject}`}>
                    <td>{row.student}</td>
                    <td>{row.subject}</td>
                    <td>
                      <span className={row.status === "Reviewed" ? "badge reviewed" : "badge pending"}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </section>
  );
}

export default TeacherDashboard;