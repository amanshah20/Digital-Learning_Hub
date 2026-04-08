import "./AdminDashboard.css";

const users = [
  { name: "Rajan", role: "Student", status: "Active" },
  { name: "Anjali", role: "Teacher", status: "Active" },
  { name: "Karan", role: "Student", status: "Inactive" },
  { name: "Meera", role: "Teacher", status: "Active" },
];

const alerts = [
  "2 new course approvals pending",
  "Server backup completed successfully",
  "Payment reconciliation report ready",
];

function AdminDashboard() {
  return (
    <section className="admin-dashboard">
      <aside className="admin-sidebar">
        <h2>Admin</h2>
        <ul>
          <li className="active">Overview</li>
          <li>Users</li>
          <li>Courses</li>
          <li>Reports</li>
          <li>Settings</li>
        </ul>
      </aside>

      <main className="admin-main">
        <h2>Welcome, System Admin</h2>

        <div className="admin-cards">
          <article className="admin-card">
            <h3>Total Users</h3>
            <p>1,248</p>
          </article>
          <article className="admin-card">
            <h3>Active Courses</h3>
            <p>42</p>
          </article>
          <article className="admin-card">
            <h3>Pending Requests</h3>
            <p>9</p>
          </article>
          <article className="admin-card">
            <h3>Platform Uptime</h3>
            <p>99.98%</p>
          </article>
        </div>

        <section className="admin-panel">
          <h3>Recent Alerts</h3>
          <ul className="admin-alerts">
            {alerts.map((alert) => (
              <li key={alert}>{alert}</li>
            ))}
          </ul>
        </section>

        <section className="admin-panel">
          <h3>User Activity</h3>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={`${user.name}-${user.role}`}>
                    <td>{user.name}</td>
                    <td>{user.role}</td>
                    <td>
                      <span
                        className={user.status === "Active" ? "status active" : "status inactive"}
                      >
                        {user.status}
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

export default AdminDashboard;
