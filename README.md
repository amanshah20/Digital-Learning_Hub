# 📘 AcademyOne – Login System Guide

Welcome to **AcademyOne**, a digital learning and management platform designed for **faculty** and **students**.  
This file contains **all login information, rules, and instructions** in a single place.

---

## 🔐 Login Credentials

AcademyOne has **two types of users**:

1. **Faculty (Teacher)**
2. **Student**

---

### 1️⃣ Faculty (Teacher) Login

- Login ID: **5-digit Faculty ID**  
- First-time login requires **setting a new password**.  
- Password is saved **permanently using localStorage**.  
- Use the password carefully; it persists until cleared.

**Default Teacher Data (first-time passwords not set):**

```javascript
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
2️⃣ Student Login
Login ID: 8-digit Student ID

First-time login requires entering your name + setting a new password.

Both name and password are saved permanently in localStorage.

Use the password carefully; it persists until cleared.

Default Student Data (first-time passwords not set):

javascript
Copy code
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
💾 Permanent Data Saving
Once a user sets a password (teacher or student), data is saved as:

php-template
Copy code
teacherData_<ID>
studentData_<ID>
Data remains stored until browser storage is cleared.

Ensures persistent login even after page refresh or browser closure.

🔁 Refresh Requirement
After first-time password setup, refresh the page once to load saved data properly.

Skipping this step may cause login issues.

♻️ Reset Password Feature
Users can reset their password anytime from the dashboard.

⚠️ Warning: Resetting will remove old login data. Handle carefully.

📌 Notes & Recommendations
Enter credentials carefully.

Set strong passwords during first login.

Always refresh the page after first-time password setup.

Reset passwords only when necessary.

Teacher IDs = 5 digits, Student IDs = 8 digits.

Student login requires name entry during first login.

✔ Summary Table
User Type	Login ID	First-Time Setup	Saved Permanently
Faculty	5-digit ID	Set new password	Password
Student
