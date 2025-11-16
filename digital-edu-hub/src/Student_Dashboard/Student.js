/* Student Dashboard JS - Glass UI */

// --- helpers
const $ = s => document.querySelector(s);
const create = (t)=> document.createElement(t);
const TIME = ()=> new Date().toLocaleString();

// Get logged-in student info (try multiple fallbacks)
let studentId = localStorage.getItem("currentStudentId") || null;
let studentName = localStorage.getItem("currentStudentName") || null;

// Fallback: use last loggedInStudents array
if(!studentId){
  const logged = JSON.parse(localStorage.getItem("loggedInStudents") || "[]");
  if(logged.length) studentId = logged[logged.length-1];
}

// Final fallback: small prompt (non-blocking)
if(!studentId){
  // no id found — let user enter (will be stored temporarily)
  studentId = prompt("Enter your student ID (for demo):") || "demo0000";
  localStorage.setItem("currentStudentId", studentId);
}
if(!studentName){
  studentName = prompt("Enter your name (for demo):") || "Student";
  localStorage.setItem("currentStudentName", studentName);
}

// UI bind
$("#student-name").textContent = studentName;
$("#student-id").textContent = "ID: " + studentId;
$("#avatar").textContent = (studentName||"S").slice(0,1).toUpperCase();

// Navigation
document.querySelectorAll('.nav li').forEach(li=>{
  li.addEventListener('click', ()=>{
    document.querySelectorAll('.nav li').forEach(x=>x.classList.remove('active'));
    li.classList.add('active');
    navigateTo(li.dataset.page);
  });
});

// search and refresh
$("#search").addEventListener("keyup", e=> {
  const q = e.target.value.trim().toLowerCase();
  if(!q) return;
  navigateTo('overview', q);
});
$("#refreshBtn").addEventListener("click", ()=> renderCurrent());

// helper to find all teacherData keys and parse them
function allTeacherData(){
  const data = [];
  Object.keys(localStorage).forEach(k=>{
    if(k.startsWith("teacherData_")){
      try{
        const parsed = JSON.parse(localStorage.getItem(k));
        data.push({key:k, data: parsed});
      }catch(e){}
    }
  });
  return data;
}

// Collect global assignments (from all teachers)
function collectAssignments(){
  const teachers = allTeacherData();
  const out = [];
  teachers.forEach(t=>{
    const arr = t.data.assignments || t.data.assignmentsList || t.data.assignments || [];
    (arr||[]).forEach(a=>{
      out.push({
        name: a.name || a.title || "Assignment",
        time: a.time || a.ts || a.uploadedAt || "",
        dataUrl: a.file || a.dataUrl || a.data || null,
        teacher: t.key.replace("teacherData_","")
      });
    });
  });
  // also global fallback: single globalAssignments
  const global = JSON.parse(localStorage.getItem("globalAssignments") || "[]");
  global.forEach(g=> out.push(g));
  return out.sort((a,b)=> (b.time||"").localeCompare(a.time||""));
}

// Collect live classes from teachers
function collectLiveClasses(){
  const teachers = allTeacherData();
  const out = [];
  teachers.forEach(t=>{
    const arr = t.data.classes || t.data.schedules || [];
    (arr||[]).forEach(s=>{
      out.push({
        subject: s.subject || s.title || s.name || "Class",
        time: s.time || s.ts || s.add || "",
        room: s.room || s.roomNo || s.roomNumber || s.room || "",
        teacher: t.key.replace("teacherData_","")
      });
    });
  });
  return out;
}

// Collect attendance records for this student across teachers
function collectAttendanceRecords(){
  const teachers = allTeacherData();
  const records = [];
  teachers.forEach(t=>{
    const arr = t.data.attendance || t.data.attendanceRecords || t.data.attendance || [];
    (arr||[]).forEach(rec=>{
      const time = rec.time || rec.ts || rec.timestamp || rec.addedAt || rec.ts || TIME();
      const list = rec.list || rec.entries || rec.att || [];
      const found = (list||[]).find(e => (e.id + "") === (studentId + ""));
      if(found){
        records.push({teacher: t.key.replace("teacherData_",""), time, present: !!found.present});
      } else {
        if(Array.isArray(list) && list.includes && list.includes(studentId)){
          records.push({teacher: t.key.replace("teacherData_",""), time, present: true});
        }
      }
    });
  });
  // also check local key studentQRChecks maybe used by QR marking
  const q = JSON.parse(localStorage.getItem("studentQRChecks_"+studentId) || "[]");
  q.forEach(item=> records.push({teacher:"qr", time: item.time, present:true}));
  return records.sort((a,b)=> new Date(b.time) - new Date(a.time));
}

// compute attendance percent (simple)
function attendanceSummary(){
  const records = collectAttendanceRecords();
  if(records.length===0) return {present:0,total:0, percent:0, records:[]};
  const total = records.length;
  const present = records.filter(r=>r.present).length;
  const percent = Math.round((present/total)*100);
  return {present,total,percent, records};
}

// render overview
function renderOverview(searchQuery){
  const summary = attendanceSummary();
  const assignments = collectAssignments();
  const classes = collectLiveClasses();
  const q = (searchQuery || "").toLowerCase();

  $("#page").innerHTML = `
    <div class="card grid">
      <div class="kpi glass">
        <div class="label">Attendance</div>
        <div class="value">${summary.percent}%</div>
        <div id="attendanceCanvasWrap"><canvas id="attendanceCanvas"></canvas></div>
        <div class="label">(${summary.present}/${summary.total})</div>
      </div>

      <div class="card" style="padding:14px;">
        <h3>Upcoming / Recent Live Classes</h3>
        <div id="liveList">${classes.length ? classes.slice(0,5).map(c=>`<div style="padding:8px 0;">${c.subject} • ${c.time} • Room ${c.room} • ${c.teacher}</div>`).join("") : "<div class='small'>No classes</div>"}</div>
        <hr/>
        <h3>Latest Assignments</h3>
        <div id="assignList">${assignments.length ? assignments.slice(0,6).map(a=>`<div class="assign-item"><div class="meta"><strong>${a.name}</strong><small>${a.teacher} • ${a.time}</small></div><div><button data-name="${a.name}" data-url="${a.dataUrl?encodeURIComponent(a.dataUrl):""}">Download</button></div></div>`).join("") : "<div class='small'>No assignments</div>"}</div>
      </div>
    </div>

    <div class="card">
      <h3>Notifications</h3>
      <div id="notifArea"></div>
    </div>

    <div class="card">
      <h3>Recent Messages</h3>
      <div id="messagesArea"></div>
    </div>
  `;

  document.querySelectorAll('#assignList button').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const u = decodeURIComponent(btn.dataset.url || "");
      const name = btn.dataset.name || "assignment";
      if(u){
        const link = document.createElement('a');
        link.href = u;
        link.download = name;
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        alert("No downloadable file available for this assignment.");
      }
    });
  });

  renderNotifications();
  renderMessages();
  drawAttendanceCanvas(summary.percent);
}

// draw a circular progress on attendanceCanvas
function drawAttendanceCanvas(percent){
  const c = $("#attendanceCanvas");
  const w = c.clientWidth || 260;
  const h = 120;
  c.width = w * devicePixelRatio;
  c.height = h * devicePixelRatio;
  c.style.width = w + 'px';
  c.style.height = h + 'px';
  const ctx = c.getContext('2d');
  ctx.scale(devicePixelRatio, devicePixelRatio);
  ctx.clearRect(0,0,w,h);

  const cx = 60, cy = 60, r = 40;
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.strokeStyle = 'rgba(255,255,255,0.08)';
  ctx.arc(cx,cy,r, -Math.PI*0.75, Math.PI*0.75);
  ctx.stroke();

  const end = -Math.PI*0.75 + ( (Math.PI*1.5) * (percent/100) );
  const grad = ctx.createLinearGradient(0,0,120,0);
  grad.addColorStop(0, 'rgba(255,183,77,0.95)');
  grad.addColorStop(1, 'rgba(122,94,255,0.95)');
  ctx.beginPath();
  ctx.strokeStyle = grad;
  ctx.arc(cx,cy,r, -Math.PI*0.75, end);
  ctx.lineCap = 'round';
  ctx.stroke();

  ctx.fillStyle = 'rgba(255,255,255,0.95)';
  ctx.font = '16px system-ui';
  ctx.fillText(percent + '%', cx + 90, cy + 6);
}

// render attendance page
function renderAttendance(){
  const records = collectAttendanceRecords();
  const summary = attendanceSummary();
  $("#page").innerHTML = `
    <div class="card">
      <h2>Your Attendance</h2>
      <p>Present: ${summary.present} / ${summary.total} (${summary.percent}%)</p>
      <canvas id="attendanceChart" style="width:100%;height:160px;"></canvas>
      <h3>Records</h3>
      <table class="table"><thead><tr><th>When</th><th>Teacher</th><th>Status</th></tr></thead>
      <tbody>
        ${records.map(r=>`<tr><td>${r.time}</td><td>${r.teacher}</td><td>${r.present? 'Present':'Absent'}</td></tr>`).join("")}
      </tbody></table>

      <hr/>
      <h3>Mark Attendance (QR)</h3>
      <div style="display:flex;gap:8px;align-items:center;">
        <input id="qrInput" placeholder="Paste QR code string or token"/>
        <button id="qrBtn">Submit QR</button>
      </div>
    </div>
  `;

  const canvas = $("#attendanceChart");
  const ctx = canvas.getContext('2d');
  const w = canvas.clientWidth;
  canvas.width = w * devicePixelRatio;
  canvas.height = 160 * devicePixelRatio;
  ctx.scale(devicePixelRatio, devicePixelRatio);
  ctx.clearRect(0,0,w,160);

  const last = collectAttendanceRecords().slice(0,10).reverse();
  const barW = (w - 40) / (last.length||1);
  last.forEach((r,i)=>{
    const h = r.present ? 100 : 20;
    ctx.fillStyle = r.present ? 'rgba(122,94,255,0.95)' : 'rgba(255,255,255,0.08)';
    ctx.fillRect(20 + i*barW, 140 - h, barW*0.8, h);
  });

  $("#qrBtn").addEventListener('click', ()=>{
    const token = $("#qrInput").value.trim();
    if(!token){ alert("Paste QR token"); return; }
    const entry = {time: TIME(), token};
    const key = "studentQRChecks_" + studentId;
    const arr = JSON.parse(localStorage.getItem(key) || "[]");
    arr.push(entry);
    localStorage.setItem(key, JSON.stringify(arr));
    alert("QR recorded locally. Teacher may pick it up if integrated.");
    renderAttendance();
  });
}

// render assignments page
function renderAssignments(){
  const assigns = collectAssignments();
  $("#page").innerHTML = `
    <div class="card">
      <h2>Your Assignments</h2>
      <div id="assignmentsWrap">${assigns.length ? assigns.map(a=>`
        <div class="assign-item">
          <div class="meta"><strong>${a.name}</strong><small>${a.teacher} • ${a.time}</small></div>
          <div>
            <button class="dl" data-url="${encodeURIComponent(a.dataUrl||'')}" data-name="${a.name}">Download</button>
          </div>
        </div>
      `).join("") : '<div class="small">No assignments yet</div>'}</div>
    </div>
  `;
  document.querySelectorAll('.dl').forEach(b=>{
    b.addEventListener('click', ()=>{
      const u = decodeURIComponent(b.dataset.url || "");
      if(!u) { alert("No file available"); return; }
      const link = document.createElement('a'); link.href = u; link.download = b.dataset.name || 'file';
      document.body.appendChild(link); link.click(); link.remove();
    });
  });
}

// render live classes
function renderLive(){
  const classes = collectLiveClasses();
  $("#page").innerHTML = `
    <div class="card">
      <h2>Live Classes & Schedule</h2>
      ${classes.length ? `<table class="table"><thead><tr><th>Subject</th><th>Time</th><th>Room</th><th>Teacher</th></tr></thead><tbody>
        ${classes.map(c=>`<tr><td>${c.subject}</td><td>${c.time}</td><td>${c.room}</td><td>${c.teacher}</td></tr>`).join("")}
      </tbody></table>` : '<div class="small">No live classes scheduled</div>'}
    </div>
  `;
}

// render messages
function renderMessages(){
  const key = "messages_" + studentId;
  const arr = JSON.parse(localStorage.getItem(key) || "[]");
  const out = arr.length ? arr.slice().reverse().map(m=>`<div style="padding:8px;border-radius:8px;background:rgba(255,255,255,0.02);margin-bottom:8px;"><strong>From: ${m.from}</strong><div style="opacity:0.9">${m.msg}</div><div style="font-size:12px;opacity:0.7">${m.time||''}</div></div>`).join("") : "<div class='small'>No messages</div>";
  if($("#messagesArea")) $("#messagesArea").innerHTML = out;
  return arr;
}

// notifications: gather from all teachers
function renderNotifications(){
  const data = allTeacherData();
  const nots = [];
  data.forEach(t=>{
    (t.data.notifications || []).forEach(n=> nots.push({teacher:t.key.replace('teacherData_',''), text: n.msg || n.text || n, time: n.ts || n.time || TIME()}));
  });
  const localN = JSON.parse(localStorage.getItem("studentNotifications_"+studentId)||"[]");
  localN.forEach(n=> nots.push(n));
  const area = $("#notifArea");
  if(area) area.innerHTML = nots.length ? nots.slice().reverse().map(n=>`<div class="notification">${n.text} • <small style="opacity:0.8">${n.time}</small></div>`).join("") : "<div class='small'>No notifications</div>";

  const badge = $("#notif-count");
  if(nots.length>0){ badge.style.display='inline-block'; badge.textContent = nots.length; } else badge.style.display='none';
}

// info/settings
function renderSettings(){
  $("#page").innerHTML = `
    <div class="card">
      <h2>Settings</h2>
      <p><strong>ID:</strong> ${studentId}</p>
      <p><strong>Name:</strong> ${studentName}</p>
      <button id="logout">Logout</button>
    </div>
  `;
  $("#logout").addEventListener('click', ()=>{
    localStorage.removeItem('currentStudentId');
    localStorage.removeItem('currentStudentName');
    alert("Logged out (local). You will be redirected to login.");
    location.href = "login.html";
  });
}

// navigation router
function navigateTo(page, q){
  if(page === 'overview') renderOverview(q);
  if(page === 'attendance') renderAttendance();
  if(page === 'assignments') renderAssignments();
  if(page === 'live') renderLive();
  if(page === 'messages'){ 
    $("#page").innerHTML = `<div class="card"><h2>Messages</h2><div id="messagesArea"></div></div>`; 
    renderMessages(); 
  }
  if(page === 'courses') {
    const courseURL = "../Student_Courses/courses.html";
    $("#page").innerHTML = `
      <div class="card">
        <h2>Online Courses</h2>
        <p>Open your course portal below:</p>
        <p><a id="courseLink" href="${courseURL}" target="_blank">Open Course</a></p>
      </div>
    `;
  }
  if(page === 'settings') renderSettings();
}

// render current selected nav
function renderCurrent(){
  const active = document.querySelector('.nav li.active');
  if(active) navigateTo(active.dataset.page);
  else navigateTo('overview');
}

// initial render
renderCurrent();

// initial notifications & messages
renderNotifications();
renderMessages();
