// Teacher Dashboard JS (collapsible + per-teacher storage)

// Helpers
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));
function niceTime(ts = Date.now()) {
  const d = new Date(ts);
  return d.toLocaleString();
}

// Get current logged-in teacher id from localStorage
const currentTeacherId = localStorage.getItem("currentTeacherId") || null;
if (!currentTeacherId) {
  // If none set, show a message / fallback
  alert("No teacher is currently logged in. Please login as a teacher first.");
  // Optionally redirect to login: window.location.href = 'login.html';
}

// Build per-teacher storage key
function teacherKey(id) { return `teacherData_${id}`; }
function loadTeacherData(id) {
  const raw = localStorage.getItem(teacherKey(id));
  if (!raw) {
    const init = { assignments: [], attendanceRecords: [], schedules: [], notifications: [] };
    localStorage.setItem(teacherKey(id), JSON.stringify(init));
    return init;
  }
  return JSON.parse(raw);
}
function saveTeacherData(id, obj) {
  localStorage.setItem(teacherKey(id), JSON.stringify(obj));
}

// UI elements
const teacherInfoDiv = $("#teacher-info");
const classScheduleList = $("#class-schedule");
const studentsList = $("#students-list");
const totalStudentsSpan = $("#total-students");
const totalStudentsSpan2 = $("#total-students-2");
const studentTableBody = $("#student-table tbody");
const markAttendanceBtn = $("#mark-attendance");
const viewAttendanceHistoryBtn = $("#view-attendance-history");
const attendanceHistoryDiv = $("#attendance-history");

const assignmentFileInput = $("#assignment-file");
const uploadBtn = $("#upload-btn");
const uploadMsg = $("#upload-msg");
const assignmentsListDiv = $("#assignments-list");

const notificationsDiv = $("#notifications");
const clearNotificationsBtn = $("#clear-notifications");

const addClassBtn = $("#add-class-btn");
const newClassTitle = $("#new-class-title");
const schedulesHistoryDiv = $("#schedules-history");

// Collapsible behavior
$$(".card-header.clickable").forEach(header => {
  header.addEventListener("click", () => {
    const body = header.nextElementSibling;
    const btn = header.querySelector(".toggle-btn");
    const expanded = body.classList.toggle("collapsed") ? false : true;
    btn.textContent = expanded ? "Close" : "Open";
    btn.setAttribute("aria-expanded", expanded);
  });
});

// Show teacher name/id
teacherInfoDiv.textContent = currentTeacherId ? `Logged in: ${currentTeacherId}` : "No teacher";

// Load teacher-specific data
const teacherData = loadTeacherData(currentTeacherId);

// GLOBAL students logged in (from login page)
function getLoggedInStudents() {
  return JSON.parse(localStorage.getItem("loggedInStudents")) || [];
}

// --- SCHEDULES ---
function renderSchedules() {
  classScheduleList.innerHTML = "";
  // show current schedules (teacher-specific)
  teacherData.schedules.forEach(s => {
    const li = document.createElement("li");
    li.textContent = `${s.title} — ${niceTime(s.ts)}`;
    classScheduleList.appendChild(li);
  });
  // also show schedules history area
  schedulesHistoryDiv.innerHTML = "";
  if (teacherData.schedules.length === 0) {
    schedulesHistoryDiv.textContent = "No schedules yet.";
    return;
  }
  teacherData.schedules.slice().reverse().forEach(s => {
    const d = document.createElement("div");
    d.className = "small-note";
    d.textContent = `${s.title} — added ${niceTime(s.ts)}`;
    schedulesHistoryDiv.appendChild(d);
  });
}
addClassBtn.addEventListener("click", () => {
  const title = newClassTitle.value.trim();
  if (!title) return alert("Enter class info like 'Math - 10:00 AM'");
  teacherData.schedules.push({ title, ts: Date.now() });
  saveTeacherData(currentTeacherId, teacherData);
  newClassTitle.value = "";
  renderSchedules();
  pushNotification(`Class scheduled: ${title}`);
});

// --- STUDENTS ---
function renderStudentsList() {
  const students = getLoggedInStudents();
  studentsList.innerHTML = "";
  if (students.length === 0) studentsList.textContent = "No students logged in.";
  students.forEach(id => {
    const li = document.createElement("li");
    li.textContent = id;
    studentsList.appendChild(li);
  });
  totalStudentsSpan.textContent = students.length;
  totalStudentsSpan2.textContent = students.length;
  // Build attendance table rows
  renderAttendanceTable(students);
}

// --- ATTENDANCE
function renderAttendanceTable(students) {
  studentTableBody.innerHTML = "";
  students.forEach(id => {
    const tr = document.createElement("tr");
    const tdId = document.createElement("td"); tdId.textContent = id;
    const tdCheck = document.createElement("td");
    const cb = document.createElement("input"); cb.type = "checkbox";
    tdCheck.appendChild(cb);
    tr.appendChild(tdId); tr.appendChild(tdCheck);
    studentTableBody.appendChild(tr);
  });
}
markAttendanceBtn.addEventListener("click", () => {
  const rows = Array.from(studentTableBody.querySelectorAll("tr"));
  const record = {
    ts: Date.now(),
    entries: rows.map(r => ({ id: r.children[0].textContent, present: r.children[1].children[0].checked }))
  };
  teacherData.attendanceRecords.push(record);
  saveTeacherData(currentTeacherId, teacherData);
  pushNotification(`Attendance saved (${record.entries.filter(e=>e.present).length}/${record.entries.length})`);
  alert("Attendance saved.");
});
viewAttendanceHistoryBtn.addEventListener("click", () => {
  attendanceHistoryDiv.innerHTML = "";
  if (teacherData.attendanceRecords.length === 0) {
    attendanceHistoryDiv.textContent = "No attendance history yet.";
    return;
  }
  teacherData.attendanceRecords.slice().reverse().forEach(rec => {
    const container = document.createElement("div");
    container.className = "history-item";
    const header = document.createElement("div");
    header.className = "small-note";
    header.textContent = `Record: ${niceTime(rec.ts)} — Present: ${rec.entries.filter(e=>e.present).length}/${rec.entries.length}`;
    container.appendChild(header);
    const list = document.createElement("ul");
    list.style.marginLeft = "18px";
    rec.entries.forEach(e => {
      const li = document.createElement("li");
      li.textContent = `${e.id} — ${e.present ? "Present" : "Absent"}`;
      list.appendChild(li);
    });
    container.appendChild(list);
    attendanceHistoryDiv.appendChild(container);
  });
});

// --- ASSIGNMENTS ---
function renderAssignments() {
  assignmentsListDiv.innerHTML = "";
  if (teacherData.assignments.length === 0) {
    assignmentsListDiv.textContent = "No assignments uploaded yet.";
    return;
  }
  teacherData.assignments.slice().reverse().forEach(a => {
    const box = document.createElement("div");
    box.className = "assignment-item small-note";
    const title = document.createElement("div");
    title.textContent = `${a.name} — uploaded ${niceTime(a.ts)}`;
    const actions = document.createElement("div");
    actions.style.marginTop = "6px";
    const download = document.createElement("button");
    download.textContent = "Download";
    download.addEventListener("click", () => {
      // create blob from dataURL & download
      const link = document.createElement("a");
      link.href = a.dataUrl;
      link.download = a.name;
      document.body.appendChild(link);
      link.click();
      link.remove();
    });
    const remove = document.createElement("button");
    remove.textContent = "Remove";
    remove.style.marginLeft = "8px";
    remove.addEventListener("click", () => {
      if (!confirm("Remove this assignment?")) return;
      const idx = teacherData.assignments.findIndex(x => x.ts === a.ts && x.name === a.name);
      if (idx > -1) {
        teacherData.assignments.splice(idx, 1);
        saveTeacherData(currentTeacherId, teacherData);
        renderAssignments();
        pushNotification(`Assignment removed: ${a.name}`);
      }
    });
    actions.appendChild(download);
    actions.appendChild(remove);
    box.appendChild(title);
    box.appendChild(actions);
    assignmentsListDiv.appendChild(box);
  });
}

uploadBtn.addEventListener("click", () => {
  const file = assignmentFileInput.files[0];
  if (!file) {
    uploadMsg.textContent = "Please select a file!";
    uploadMsg.style.color = "salmon";
    return;
  }
  const allowed = /(\.pdf|\.doc|\.docx)$/i;
  if (!allowed.exec(file.name)) {
    uploadMsg.textContent = "Only PDF/DOC/DOCX allowed!";
    uploadMsg.style.color = "salmon";
    return;
  }
  const reader = new FileReader();
  reader.onload = function(e) {
    const dataUrl = e.target.result;
    const item = { name: file.name, ts: Date.now(), dataUrl };
    teacherData.assignments.push(item);
    saveTeacherData(currentTeacherId, teacherData);
    uploadMsg.textContent = `Uploaded: ${file.name}`;
    uploadMsg.style.color = "lightgreen";
    assignmentFileInput.value = "";
    renderAssignments();
    pushNotification(`Assignment uploaded: ${file.name}`);
  };
  reader.readAsDataURL(file);
});

// --- NOTIFICATIONS ---
function pushNotification(msg) {
  teacherData.notifications.push({ msg, ts: Date.now() });
  saveTeacherData(currentTeacherId, teacherData);
  renderNotifications();
}
function renderNotifications() {
  notificationsDiv.innerHTML = "";
  if (!teacherData.notifications || teacherData.notifications.length === 0) {
    notificationsDiv.textContent = "No notifications yet.";
    return;
  }
  teacherData.notifications.slice().reverse().forEach(n => {
    const div = document.createElement("div");
    div.className = "notification";
    div.textContent = `${n.msg} — ${niceTime(n.ts)}`;
    notificationsDiv.appendChild(div);
  });
}
clearNotificationsBtn.addEventListener("click", () => {
  if (!confirm("Clear all notifications?")) return;
  teacherData.notifications = [];
  saveTeacherData(currentTeacherId, teacherData);
  renderNotifications();
});

// --- Poll for new global student logins (and show one-time notifications for new students) ---
let knownStudentsGlobal = JSON.parse(localStorage.getItem("knownStudentsGlobal_" + (currentTeacherId||"anonymous"))) || [];
function checkNewStudentsGlobal() {
  const loggedIn = getLoggedInStudents();
  loggedIn.forEach(sid => {
    if (!knownStudentsGlobal.includes(sid)) {
      // only notify teacher once per new global login
      pushNotification(`Student logged in: ${sid}`);
      knownStudentsGlobal.push(sid);
    }
  });
  localStorage.setItem("knownStudentsGlobal_" + (currentTeacherId||"anonymous"), JSON.stringify(knownStudentsGlobal));
  renderStudentsList();
}
setInterval(checkNewStudentsGlobal, 2000);

// --- INITIAL RENDER ---
renderSchedules();
renderStudentsList();
renderAssignments();
renderNotifications();

// If teacherData was empty earlier (fresh), show hint
if (teacherData.assignments.length === 0 && teacherData.attendanceRecords.length === 0 && teacherData.schedules.length === 0) {
  pushNotification("Welcome! Your dashboard is ready. Actions you take are saved only for this teacher.");
}
