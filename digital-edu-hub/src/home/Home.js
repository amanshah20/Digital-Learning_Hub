// ---------------------------------------------
// TEACHER & STUDENT LOGIN SYSTEM
// ---------------------------------------------

// Teacher credentials (5-digit IDs)
let teachers = [
    { id: "12345", password: null },
    { id: "23456", password: null },
    { id: "34567", password: null },
    { id: "45678", password: null },
    { id: "56789", password: null },
    { id: "67890", password: null },
    { id: "78901", password: null },
    { id: "89012", password: null },
    { id: "90123", password: null },
    { id: "01234", password: null }
];

// Student credentials (8-digit IDs + name)
let students = [
    { id: "10000001", password: null, name: null },
    { id: "10000002", password: null, name: null },
    { id: "10000003", password: null, name: null },
    { id: "10000004", password: null, name: null },
    { id: "10000005", password: null, name: null },
    { id: "10000006", password: null, name: null },
    { id: "10000007", password: null, name: null },
    { id: "10000008", password: null, name: null },
    { id: "10000009", password: null, name: null },
    { id: "10000010", password: null, name: null }
];

// Dashboard URLs
const teacherDashboard = "../Teacher_Dashboard/Teacher.html";
const studentDashboard = "../Student_Dashboard/Student.html";

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
if (localStorage.getItem("teachers")) teachers = JSON.parse(localStorage.getItem("teachers"));
if (localStorage.getItem("students")) students = JSON.parse(localStorage.getItem("students"));

// Password validation
function isValidPassword(pwd) {
    return /^[a-zA-Z]{8,}$/.test(pwd);
}

// Student name validation
function isValidName(name) {
    return /^[A-Za-z ]{1,20}$/.test(name);
}

// Show name field for students
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

    // First-time student name save
    if (userType === "student" && user.name === null) {
        if (!isValidName(name)) {
            errorDiv.innerText = "Name must be letters only (max 20).";
            loginBtn.disabled = true;
            return;
        }
        user.name = name;
        localStorage.setItem("students", JSON.stringify(students));
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

    // Verify password match
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

// ------------------------------------------------------------
// ✅ FINAL UPDATED LOGIN FUNCTION
// ------------------------------------------------------------
function login() {
    const userType = userTypeInput.value;
    const userId = userIdInput.value.trim();
    const password = passwordInput.value.trim();

    let userArray = userType === "teacher" ? teachers : students;
    let user = userArray.find(u => u.id === userId);

    if (user && user.password === password) {

        // 🌟 STUDENT LOGIN — Save everything permanently
        if (userType === "student") {

            let studentName = nameInput.value.trim();

            // Always keep student name saved
            if (studentName && studentName !== "") {
                user.name = studentName;
                localStorage.setItem("students", JSON.stringify(students));
            }

            // Save student ID for dashboard
            localStorage.setItem("currentStudentId", userId);

            // Save student name for dashboard
            localStorage.setItem("currentStudentName", user.name);

            // Save in global list
            let allStudents = JSON.parse(localStorage.getItem("allStudents")) || [];
            let exists = allStudents.find(s => s.id === userId);

            if (!exists) {
                allStudents.push({
                    id: userId,
                    name: user.name
                });
                localStorage.setItem("allStudents", JSON.stringify(allStudents));
            }
        }

        // 🌟 TEACHER LOGIN — Save ID only
        if (userType === "teacher") {
            localStorage.setItem("currentTeacherId", userId);
        }

        // Redirect
        window.location.href =
            userType === "teacher" ? teacherDashboard : studentDashboard;

    } else {
        errorDiv.innerText = "Invalid credentials!";
    }
}

// ------------------------------------------------------------
// ✅ NEW FUNCTION — UPDATE STUDENT ID
// ------------------------------------------------------------
function updateStudentId(oldId, newId) {
    // Check if newId already exists
    if (students.find(s => s.id === newId)) {
        alert("This ID is already taken!");
        return;
    }

    let student = students.find(s => s.id === oldId);
    if (!student) {
        alert("Student not found!");
        return;
    }

    // Update student object
    student.id = newId;
    localStorage.setItem("students", JSON.stringify(students));

    // Update current student ID if logged in
    if (localStorage.getItem("currentStudentId") === oldId) {
        localStorage.setItem("currentStudentId", newId);
    }

    // Update allStudents array
    let allStudents = JSON.parse(localStorage.getItem("allStudents")) || [];
    let globalStudent = allStudents.find(s => s.id === oldId);
    if (globalStudent) globalStudent.id = newId;
    localStorage.setItem("allStudents", JSON.stringify(allStudents));

    alert(`Student ID updated from ${oldId} to ${newId}`);
}

// Event listeners
userIdInput.addEventListener("input", checkCredentials);
passwordInput.addEventListener("input", checkCredentials);
nameInput.addEventListener("input", checkCredentials);
loginBtn.addEventListener("click", login);
