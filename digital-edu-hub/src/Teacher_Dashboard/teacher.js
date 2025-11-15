// -------------------------
// BASIC HELPERS
// -------------------------
const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);
const TIME = () => new Date().toLocaleString();

// Get current teacher ID
const teacherId = localStorage.getItem("currentTeacherId");
if(!teacherId){
    alert("Login required");
    location.href="login.html";
}

// Load teacher storage
function key(id){ return "teacherData_"+id; }

function load(){
    let d = localStorage.getItem(key(teacherId));
    if(!d){
        d = {students:[],attendance:[],assignments:[],classes:[],notifications:[],messages:[]};
        localStorage.setItem(key(teacherId),JSON.stringify(d));
        return d;
    }
    return JSON.parse(d);
}

function save(d){
    localStorage.setItem(key(teacherId),JSON.stringify(d));
}

let DB = load();

// Show teacher ID
$("#teacher-info").textContent = "ID: "+teacherId;

// -------------------------
// PAGE SWITCHING (SIDEBAR)
// -------------------------
$$('.menu li').forEach(li=>{
    li.addEventListener("click",()=>{
        $$('.menu li').forEach(x=>x.classList.remove('active'));
        li.classList.add('active');
        loadPage(li.dataset.page);
    });
});

// default page
loadPage("dashboard");

// -------------------------
// PAGE CONTENT LOADER
// -------------------------
function loadPage(page){
    if(page=="dashboard") showDashboard();
    if(page=="students") showStudents();
    if(page=="attendance") showAttendance();
    if(page=="qr-attendance") showQR();
    if(page=="assignments") showAssignments();
    if(page=="live-class") showLiveClass();
    if(page=="messages") showMessages();
    if(page=="notifications") showNotifications();
    if(page=="info") showInfo();
}

// -------------------------
// DASHBOARD HOME
// -------------------------
function showDashboard(){
    $("#page-content").innerHTML = `
        <div class="card">
            <h2>Welcome Teacher</h2>
            <p>Use the sidebar to manage attendance, classes, assignments and students.</p>
        </div>
    `;
}

// -------------------------
// STUDENT LIST
// -------------------------
function getStudents(){
    return JSON.parse(localStorage.getItem("allStudents")) || [];
}

function showStudents(){
    let s = getStudents();
    $("#page-content").innerHTML = `
        <div class="card">
            <h2>Students List</h2>
            <table class="table">
                <tr><th>ID</th><th>Name</th></tr>
                ${s.map(x=>`<tr><td>${x.id}</td><td>${x.name}</td></tr>`).join("")}
            </table>
        </div>
    `;
}

// search bar
$("#search-input").addEventListener("keyup",()=>{
    let q = $("#search-input").value.toLowerCase();
    let s = getStudents().filter(x=>x.id.includes(q)||x.name.toLowerCase().includes(q));
    $("#page-content").innerHTML = `
        <div class="card">
            <h2>Search Results</h2>
            <table class="table">
                <tr><th>ID</th><th>Name</th></tr>
                ${s.map(x=>`<tr><td>${x.id}</td><td>${x.name}</td></tr>`).join("")}
            </table>
        </div>`;
});

// -------------------------
// ATTENDANCE
// -------------------------
function showAttendance(){
    let students = getStudents();
    $("#page-content").innerHTML = `
        <div class="card">
            <h2>Mark Attendance</h2>
            <table class="table">
                <tr><th>ID</th><th>Name</th><th>Present</th></tr>
                ${students.map(s=>`
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

    $("#save-att").onclick = ()=>{
        let list = [...document.querySelectorAll(".att")].map(x=>({
            id:x.dataset.id,
            present:x.checked
        }));

        DB.attendance.push({time:TIME(),list});
        save(DB);
        alert("Attendance Saved!");
    }
}

// -------------------------
// QR ATTENDANCE
// -------------------------
function showQR(){
    $("#page-content").innerHTML = `
        <div class="card qr-box">
            <h2>QR Attendance</h2>
            <p>Scan QR from student dashboard.</p>
            <div id="qr"></div>
            <button onclick="generateQR()">Generate QR</button>
        </div>
    `;
}

function generateQR(){
    let data = "ATTEND_"+TIME();
    $("#qr").innerHTML = `<img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${data}" />`;
}

// -------------------------
// ASSIGNMENTS
// -------------------------
function showAssignments(){
    $("#page-content").innerHTML = `
        <div class="card">
            <h2>Upload Assignment</h2>
            <input type="file" id="file"/>
            <button id="upload">Upload</button>

            <h3>Your Assignments</h3>
            <div id="alist"></div>
        </div>
    `;

    $("#upload").onclick = ()=>{
        let f = $("#file").files[0];
        if(!f) return;

        let r = new FileReader();
        r.onload = e=>{
            DB.assignments.push({name:f.name,file:e.target.result,time:TIME()});
            save(DB);
            showAssignments();
        };
        r.readAsDataURL(f);
    };

    let out = "";
    DB.assignments.forEach(a=>{
        out+=`<p>${a.name} - ${a.time}</p>`;
    });
    $("#alist").innerHTML = out;
}

// -------------------------
// LIVE CLASS
// -------------------------
function showLiveClass(){
    $("#page-content").innerHTML = `
        <div class="card">
            <h2>Schedule Live Class</h2>
            <input id="sub" placeholder="Subject"/><br><br>
            <input id="time" placeholder="Time eg: 10:00 AM"/><br><br>
            <input id="room" placeholder="Room No"/><br><br>
            <button id="save-class">Save</button>

            <h3>Upcoming Classes</h3>
            <div id="class-list"></div>
        </div>
    `;

    $("#save-class").onclick = ()=>{
        DB.classes.push({
            subject:$("#sub").value,
            time:$("#time").value,
            room:$("#room").value,
            add:TIME()
        });
        save(DB);
        showLiveClass();
    };

    $("#class-list").innerHTML = DB.classes.map(c=>`
        <p>${c.subject} | ${c.time} | Room ${c.room}</p>
    `).join("");
}

// -------------------------
// MESSAGE TO STUDENT
// -------------------------
function showMessages(){
    $("#page-content").innerHTML = `
        <div class="card">
            <h2>Send Message to Student</h2>
            <input id="sid" placeholder="Student ID"/><br><br>
            <textarea id="smsg" placeholder="Enter message" style="width:100%;height:100px"></textarea><br><br>
            <button id="send-msg">Send</button>
        </div>
    `;

    $("#send-msg").onclick = ()=>{
        let id=$("#sid").value;
        let msg=$("#smsg").value;

        let inbox = JSON.parse(localStorage.getItem("messages_"+id)) || [];
        inbox.push({from:teacherId,msg,time:TIME()});
        localStorage.setItem("messages_"+id,JSON.stringify(inbox));

        alert("Message Sent!");
    };
}

// -------------------------
// NOTIFICATIONS
// -------------------------
function showNotifications(){
    $("#page-content").innerHTML = `
        <div class="card">
            <h2>Notifications</h2>
            ${DB.notifications.map(n=>`<div class='notification'>${n.text} - ${n.time}</div>`).join("")}
        </div>
    `;
}

// -------------------------
// SAVED DATA
// -------------------------
function showInfo(){
    $("#page-content").innerHTML = `
        <div class="card">
            <h2>Saved Data</h2>
            <pre>${JSON.stringify(DB,null,2)}</pre>
        </div>
    `;
}
