// ------------------------------------------------
// BASIC HELPERS
// ------------------------------------------------
const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);
const TIME = () => new Date().toLocaleString();

// ------------------------------------------------
// LOGIN CHECK
// ------------------------------------------------
const teacherId = localStorage.getItem("currentTeacherId");
if (!teacherId) {
    alert("Login required");
    location.href = "login.html";
}

// ------------------------------------------------
// TEACHER DATABASE LOADER
// ------------------------------------------------
function key(id) { return "teacherData_" + id; }

function load() {
    let d = localStorage.getItem(key(teacherId));
    if (!d) {
        d = {
            removedStudents: [],
            attendance: [],
            assignments: [],
            classes: [],
            notifications: [],
            messages: []
        };
        localStorage.setItem(key(teacherId), JSON.stringify(d));
        return d;
    }
    return JSON.parse(d);
}

function save(d) {
    localStorage.setItem(key(teacherId), JSON.stringify(d));
}

let DB = load();

// Show teacher ID
$("#teacher-info").textContent = "ID: " + teacherId;

// ------------------------------------------------
// SIDEBAR PAGE SWITCHING
// ------------------------------------------------
$$('.menu li').forEach(li => {
    li.addEventListener("click", () => {
        $$('.menu li').forEach(x => x.classList.remove('active'));
        li.classList.add('active');
        loadPage(li.dataset.page);
    });
});

// Default page
loadPage("dashboard");

// ------------------------------------------------
// PAGE ROUTER
// ------------------------------------------------
function loadPage(page) {
    if (page == "dashboard") showDashboard();
    if (page == "students") showStudents();
    if (page == "attendance") showAttendance();
    if (page == "qr-attendance") showQR();
    if (page == "assignments") showAssignments();
    if (page == "live-class") showLiveClass();
    if (page == "messages") showMessages();
    if (page == "notifications") showNotifications();
    if (page == "info") showInfo();
}

// ------------------------------------------------
// DASHBOARD PAGE
// ------------------------------------------------
function showDashboard() {
    $("#page-content").innerHTML = `
        <div class="card">
            <h2>Welcome Teacher</h2>
            <p>Use the sidebar to manage attendance, classes, assignments, students, and notifications.</p>
        </div>
    `;
}

// ------------------------------------------------
// STUDENTS MANAGEMENT
// ------------------------------------------------
function loadStudentsList() {
    let allStudents = JSON.parse(localStorage.getItem("allStudents")) || [];
    return allStudents.filter(s => !DB.removedStudents.includes(s.id));
}

function removeStudent(id) {
    if (!DB.removedStudents.includes(id)) DB.removedStudents.push(id);
    save(DB);

    // Also remove messages for student if needed
    localStorage.setItem("messages_" + id, JSON.stringify([]));

    DB.notifications.push({ text: `Student ${id} removed`, time: TIME() });
    save(DB);

    showStudents();
}

function showStudents() {
    $("#page-content").innerHTML = `
        <div class="card">
            <h2>Students List</h2>
            <input type="text" id="search-input" placeholder="Search by ID or Name" style="width:100%;padding:8px;margin-bottom:10px;"/>
            <table class="table">
                <thead>
                    <tr><th>ID</th><th>Name</th><th>Action</th></tr>
                </thead>
                <tbody id="studentsTableBody"></tbody>
            </table>
        </div>
    `;

    renderStudentsTable(loadStudentsList());

    // Attach search event
    const topbarSearch = $("#search-input");
    topbarSearch.addEventListener("keyup", () => {
        let q = topbarSearch.value.toLowerCase();
        let filtered = loadStudentsList().filter(s =>
            s.id.toLowerCase().includes(q) || s.name.toLowerCase().includes(q)
        );
        renderStudentsTable(filtered);
    });
}

// ------------------------------------------------
// Render Students Table
// ------------------------------------------------
function renderStudentsTable(list) {
    const table = $("#studentsTableBody");
    if (!table) return;
    table.innerHTML = "";
    list.forEach(s => {
        table.innerHTML += `
            <tr>
                <td>${s.id}</td>
                <td>${s.name}</td>
                <td><button onclick="removeStudent('${s.id}')">Remove</button></td>
            </tr>
        `;
    });
}

// ------------------------------------------------
// ATTENDANCE
// ------------------------------------------------
function showAttendance() {
    let students = loadStudentsList();

    $("#page-content").innerHTML = `
        <div class="card">
            <h2>Mark Attendance</h2>
            <table class="table">
                <tr><th>ID</th><th>Name</th><th>Present</th></tr>
                ${students.map(s => `
                    <tr>
                        <td>${s.id}</td>
                        <td>${s.name}</td>
                        <td><input type='checkbox' class='att' data-id='${s.id}'/></td>
                    </tr>
                `).join("")}
            </table>
            <button id="save-att">Save Attendance</button>
        </div>
    `;

    $("#save-att").onclick = () => {
        let list = [...document.querySelectorAll(".att")].map(x => ({
            id: x.dataset.id,
            present: x.checked
        }));

        DB.attendance.push({ time: TIME(), list });
        save(DB);
        alert("Attendance Saved!");
    };
}

// ------------------------------------------------
// QR ATTENDANCE
// ------------------------------------------------
function showQR() {
    $("#page-content").innerHTML = `
        <div class="card qr-box">
            <h2>QR Attendance</h2>
            <p>Scan this QR from student dashboard.</p>
            <div id="qr"></div>
            <button onclick="generateQR()">Generate QR</button>
        </div>
    `;
}

function generateQR() {
    let data = "ATTEND_" + TIME();
    $("#qr").innerHTML = `<img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${data}" />`;
}

// ------------------------------------------------
// ASSIGNMENTS WITH DELETE
// ------------------------------------------------
function showAssignments() {
    $("#page-content").innerHTML = `
        <div class="card">
            <h2>Upload Assignment</h2>
            <input type="file" id="file"/>
            <button id="upload">Upload</button>

            <h3>Your Assignments</h3>
            <div id="alist"></div>
        </div>
    `;

    const renderAssignments = () => {
        let out = "";
        DB.assignments.forEach((a, i) => {
            out += `<p>${a.name} - ${a.time} 
                <button onclick="deleteAssignment(${i})" style="background:red;margin-left:10px;">Delete</button></p>`;
        });
        $("#alist").innerHTML = out;
    };

    $("#upload").onclick = () => {
        let f = $("#file").files[0];
        if (!f) return alert("Select a file to upload!");

        let r = new FileReader();
        r.onload = e => {
            DB.assignments.push({
                name: f.name,
                file: e.target.result,
                time: TIME()
            });
            save(DB);
            showAssignments();
        };
        r.readAsDataURL(f);
    };

    renderAssignments();
}

function deleteAssignment(index) {
    DB.assignments.splice(index, 1);
    save(DB);
    showAssignments();
}

// ------------------------------------------------
// LIVE CLASS WITH DELETE
// ------------------------------------------------
function showLiveClass() {
    $("#page-content").innerHTML = `
        <div class="card">
            <h2>Schedule Live Class</h2>
            <input id="sub" placeholder="Subject"/><br><br>
            <input id="time" placeholder="Time (eg: 10:00 AM)"/><br><br>
            <input id="room" placeholder="Room No"/><br><br>
            <button id="save-class">Save</button>

            <h3>Upcoming Classes</h3>
            <div id="class-list"></div>
        </div>
    `;

    const renderClasses = () => {
        $("#class-list").innerHTML = DB.classes.map((c,i)=>`
            <p>${c.subject} | ${c.time} | Room ${c.room} 
            <button onclick="deleteClass(${i})" style="background:red;margin-left:10px;">Delete</button></p>
        `).join("");
    };

    $("#save-class").onclick = () => {
        if (!$("#sub").value || !$("#time").value || !$("#room").value) return alert("Fill all fields");
        DB.classes.push({
            subject: $("#sub").value,
            time: $("#time").value,
            room: $("#room").value,
            add: TIME()
        });
        save(DB);
        showLiveClass();
    };

    renderClasses();
}

function deleteClass(index) {
    DB.classes.splice(index,1);
    save(DB);
    showLiveClass();
}

// ------------------------------------------------
// MESSAGES WITH CLEAR OPTION
// ------------------------------------------------
function showMessages() {
    $("#page-content").innerHTML = `
        <div class="card">
            <h2>Send Message to Student</h2>
            <input id="sid" placeholder="Student ID"/><br><br>
            <textarea id="smsg" placeholder="Enter message" style="width:100%;height:100px"></textarea><br><br>
            <button id="send-msg">Send</button>
            <button id="clear-msg" style="background:red;margin-left:10px;">Clear Messages</button>
        </div>
    `;

    $("#send-msg").onclick = () => {
        let id = $("#sid").value;
        let msg = $("#smsg").value;
        if(!id || !msg) return alert("Fill both fields");

        let inbox = JSON.parse(localStorage.getItem("messages_" + id)) || [];
        inbox.push({ from: teacherId, msg, time: TIME() });
        localStorage.setItem("messages_" + id, JSON.stringify(inbox));
        alert("Message Sent!");
        $("#smsg").value = "";
    };

    $("#clear-msg").onclick = () => {
        let id = $("#sid").value;
        if(!id) return alert("Enter Student ID to clear messages");
        localStorage.setItem("messages_" + id, JSON.stringify([]));
        alert("Messages cleared for " + id);
    };
}

// ------------------------------------------------
// NOTIFICATIONS WITH CLEAR OPTION
// ------------------------------------------------
function showNotifications() {
    $("#page-content").innerHTML = `
        <div class="card">
            <h2>Notifications</h2>
            <button id="clear-noti" style="background:red;margin-bottom:10px;">Clear Notifications</button>
            ${DB.notifications.map(n => `<div class='notification'>${n.text} - ${n.time}</div>`).join("")}
        </div>
    `;

    $("#clear-noti").onclick = () => {
        DB.notifications = [];
        save(DB);
        showNotifications();
    };
}

// ------------------------------------------------
// FULL DATA
// ------------------------------------------------
function showInfo() {
    $("#page-content").innerHTML = `
        <div class="card">
            <h2>Saved Data</h2>
            <pre>${JSON.stringify(DB, null, 2)}</pre>
        </div>
    `;
}

// ------------------------------------------------
// NEW STUDENT NOTIFICATION CHECK
// ------------------------------------------------
function checkNewStudent() {
    let lastAll = JSON.parse(localStorage.getItem("allStudents")) || [];
    let newLogin = JSON.parse(localStorage.getItem("students")) || [];

    newLogin.forEach(s => {
        if (!DB.removedStudents.includes(s.id) && !lastAll.find(x => x.id === s.id)) {
            DB.notifications.push({ text: `New student logged in: ${s.name} (${s.id})`, time: TIME() });
            save(DB);
        }
    });

    localStorage.setItem("allStudents", JSON.stringify(newLogin));
}

// Run new student notification check on load
checkNewStudent();
