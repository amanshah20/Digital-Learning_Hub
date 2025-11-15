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

// Student credentials (8-digit IDs + name)
let students = [
    {id: "10000001", password: null, name: null},
    {id: "10000002", password: null, name: null},
    {id: "10000003", password: null, name: null},
    {id: "10000004", password: null, name: null},
    {id: "10000005", password: null, name: null},
    {id: "10000006", password: null, name: null},
    {id: "10000007", password: null, name: null},
    {id: "10000008", password: null, name: null},
    {id: "10000009", password: null, name: null},
    {id: "10000010", password: null, name: null}
];

// Dashboard URLs
const teacherDashboard = "file:///G:/Semester-7/Capdtone_Project/digital-edu-hub/src/Teacher_Dashboard/Teacher.html";
const studentDashboard = "file:///G:/Semester-7/Capstone_Project/digital-edu-hub/src/Student_Dashboard/Student.html";

// DOM elements
const userTypeInput = document.getElementById("userType");
const userIdInput = document.getElementById("userId");
const passwordInput = document.getElementById("password");
const nameInput = document.getElementById("studentName");
const loginBtn = document.querySelector("button");
const errorDiv = document.getElementById("error");

// Disable login button initially
loginBtn.disabled = true;
loginBtn.style.opacity = "0.5";

// Load saved passwords & names
if(localStorage.getItem("teachers")) teachers = JSON.parse(localStorage.getItem("teachers"));
if(localStorage.getItem("students")) students = JSON.parse(localStorage.getItem("students"));

// Password validation
function isValidPassword(pwd) {
    return /^[a-zA-Z]{8,}$/.test(pwd);
}

// Student name validation
function isValidName(name) {
    return /^[A-Za-z ]{1,20}$/.test(name);
}

// Show name field for student only
userTypeInput.addEventListener("change", () => {
    if (userTypeInput.value === "student") {
        nameInput.style.display = "block";
    } else {
        nameInput.style.display = "none";
        nameInput.value = "";
    }
    checkCredentials();
});

// Check credentials
function checkCredentials() {
    const userType = userTypeInput.value;
    const userId = userIdInput.value.trim();
    const password = passwordInput.value.trim();
    const name = nameInput.value.trim();

    if (!userId || !password || (userType === "student" && !name)) {
        loginBtn.disabled = true;
        loginBtn.style.opacity = "0.5";
        errorDiv.innerText = "";
        return;
    }

    let userArray = userType === "teacher" ? teachers : students;
    let user = userArray.find(u => u.id === userId);

    if (!user) {
        errorDiv.innerText = "Invalid ID!";
        loginBtn.disabled = true;
        loginBtn.style.opacity = "0.5";
        return;
    }

    // FIRST-TIME STUDENT NAME SAVE
    if (userType === "student" && user.name === null) {
        if (!isValidName(name)) {
            errorDiv.innerText = "Name must be letters only (max 20).";
            loginBtn.disabled = true;
            return;
        }
        user.name = name;
        localStorage.setItem("students", JSON.stringify(userArray));
        errorDiv.innerText = "Name saved!";
    }

    // First-time password save
    if (user.password === null) {
        if (!isValidPassword(password)) {
            errorDiv.innerText = "Password must be 8 letters only!";
            loginBtn.disabled = true;
            return;
        }
        user.password = password;
        localStorage.setItem(userType === "teacher" ? "teachers" : "students", JSON.stringify(userArray));
        errorDiv.innerText = "Password saved!";
    }

    // Compare password
    if (user.password === password) {
        loginBtn.disabled = false;
        loginBtn.style.opacity = "1";
        errorDiv.innerText = "";
    } else {
        loginBtn.disabled = true;
        loginBtn.style.opacity = "0.5";
        errorDiv.innerText = "Incorrect Password!";
    }
}

// Reset password
function resetPassword() {
    const userType = userTypeInput.value;
    const userId = userIdInput.value.trim();

    if (!userId || !userType) {
        errorDiv.innerText = "Select user type and enter ID!";
        return;
    }

    let userArray = userType === "teacher" ? teachers : students;
    let user = userArray.find(u => u.id === userId);

    if (!user) {
        errorDiv.innerText = "Invalid ID!";
        return;
    }

    user.password = null;
    localStorage.setItem(userType === "teacher" ? "teachers" : "students", JSON.stringify(userArray));
    passwordInput.value = "";
    errorDiv.innerText = "Password reset successfully!";
    loginBtn.disabled = true;
    loginBtn.style.opacity = "0.5";
}

// Login
function login() {
    const userType = userTypeInput.value;
    const userId = userIdInput.value.trim();
    const password = passwordInput.value.trim();

    let userArray = userType === "teacher" ? teachers : students;
    let user = userArray.find(u => u.id === userId);

    if (user && user.password === password) {

        if (userType === "student") {
            localStorage.setItem("currentStudentName", user.name);
        }

        if (userType === "teacher") {
            localStorage.setItem("currentTeacherId", userId);
        }

        window.location.href = userType === "teacher" ? teacherDashboard : studentDashboard;
    } else {
        errorDiv.innerText = "Invalid credentials!";
    }
}

// Event listeners
userIdInput.addEventListener("input", checkCredentials);
passwordInput.addEventListener("input", checkCredentials);
nameInput.addEventListener("input", checkCredentials);
