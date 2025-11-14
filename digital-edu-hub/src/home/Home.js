// Teacher credentials (5-digit IDs)
let teachers = [
    {id: "12345", password: null},
    {id: "23456", password: null},
    {id: "34567", password: null},
    {id: "45678", password: null},
    {id: "56789", password: null},
    {id: "67890", password: null},
    {id: "78901", password: null},
    {id: "89012", password: null},
    {id: "90123", password: null},
    {id: "01234", password: null}
];

// Student credentials (8-digit IDs)
let students = [
    {id: "10000001", password: null},
    {id: "10000002", password: null},
    {id: "10000003", password: null},
    {id: "10000004", password: null},
    {id: "10000005", password: null},
    {id: "10000006", password: null},
    {id: "10000007", password: null},
    {id: "10000008", password: null},
    {id: "10000009", password: null},
    {id: "10000010", password: null}
];

// Dashboard URLs
const teacherDashboard = "file:///G:/Semester-7/Capdtone_Project/digital-edu-hub/src/Teacher_Dashboard/Teacher.html";
const studentDashboard = "student_dashboard.html";

// DOM elements
const userTypeInput = document.getElementById("userType");
const userIdInput = document.getElementById("userId");
const passwordInput = document.getElementById("password");
const loginBtn = document.querySelector("button");
const errorDiv = document.getElementById("error");

// Disable login button initially
loginBtn.disabled = true;
loginBtn.style.opacity = "0.5";

// Load saved passwords
if(localStorage.getItem("teachers")) teachers = JSON.parse(localStorage.getItem("teachers"));
if(localStorage.getItem("students")) students = JSON.parse(localStorage.getItem("students"));

// Password validation: only letters, min 8 chars
function isValidPassword(pwd) {
    return /^[a-zA-Z]{8,}$/.test(pwd);
}

// Check credentials
function checkCredentials() {
    const userType = userTypeInput.value;
    const userId = userIdInput.value.trim();
    const password = passwordInput.value.trim();

    if(!userId || !password) {
        loginBtn.disabled = true;
        loginBtn.style.opacity = "0.5";
        errorDiv.innerText = "";
        return;
    }

    let userArray = userType === "teacher" ? teachers : students;
    let user = userArray.find(u => u.id === userId);

    if(!user) {
        errorDiv.innerText = "Invalid ID!";
        loginBtn.disabled = true;
        loginBtn.style.opacity = "0.5";
        return;
    }

    // First-time password
    if(user.password === null) {
        if(!isValidPassword(password)) {
            errorDiv.innerText = "Password must be at least 8 letters only!";
            loginBtn.disabled = true;
            loginBtn.style.opacity = "0.5";
            return;
        }

        user.password = password;
        localStorage.setItem(userType === "teacher" ? "teachers" : "students", JSON.stringify(userArray));
        errorDiv.innerText = "Password saved! Click Login to continue.";
    }

    // Check saved password match
    if(user.password === password) {
        loginBtn.disabled = false;
        loginBtn.style.opacity = "1";
        errorDiv.innerText = "";
    } else {
        loginBtn.disabled = true;
        loginBtn.style.opacity = "0.5";
        errorDiv.innerText = "Incorrect Password!";
    }
}

// Reset password function
function resetPassword() {
    const userType = userTypeInput.value;
    const userId = userIdInput.value.trim();

    if(!userId || !userType) {
        errorDiv.innerText = "Select user type and enter ID to reset password!";
        return;
    }

    let userArray = userType === "teacher" ? teachers : students;
    let user = userArray.find(u => u.id === userId);

    if(!user) {
        errorDiv.innerText = "Invalid ID!";
        return;
    }

    user.password = null;
    localStorage.setItem(userType === "teacher" ? "teachers" : "students", JSON.stringify(userArray));
    errorDiv.innerText = "Password reset! Enter new password to save.";
    passwordInput.value = "";
    loginBtn.disabled = true;
    loginBtn.style.opacity = "0.5";
}

// Event listeners
userTypeInput.addEventListener("change", checkCredentials);
userIdInput.addEventListener("input", checkCredentials);
passwordInput.addEventListener("input", checkCredentials);

// ---------------------- UPDATED LOGIN BLOCK ----------------------
function login() {
    const userType = userTypeInput.value;
    const userId = userIdInput.value.trim();
    const password = passwordInput.value.trim();

    let userArray = userType === "teacher" ? teachers : students;
    let user = userArray.find(u => u.id === userId);

    if(user && user.password === password) {

        // Track logged in students
        if(userType === "student") {
            let loggedInStudents = JSON.parse(localStorage.getItem("loggedInStudents")) || [];
            if(!loggedInStudents.includes(userId)) {
                loggedInStudents.push(userId);
                localStorage.setItem("loggedInStudents", JSON.stringify(loggedInStudents));
            }
        }

        // 🔥 NEW: save current teacher ID for dashboard personalization
        if(userType === "teacher") {
            localStorage.setItem("currentTeacherId", userId);
        }

        window.location.href = userType === "teacher" ? teacherDashboard : studentDashboard;

    } else {
        errorDiv.innerText = "Invalid credentials!";
    }
}
