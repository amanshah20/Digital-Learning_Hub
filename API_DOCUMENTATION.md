# API Documentation - DLH LMS

Complete REST API reference with request/response examples.

**Base URL**: `http://localhost:5000/api`

**Authentication**: Most endpoints require JWT token in Authorization header:
```
Authorization: Bearer <access_token>
```

---

## Authentication Endpoints

### Register User
Create a new user account.

**Endpoint**: `POST /auth/register`

**Request Body**:
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "SecurePass123!",
  "role": "student"
}
```

**Response** (201):
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "role": "student",
      "studentId": "STU-2024-001234"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### Login
Authenticate user and receive tokens.

**Endpoint**: `POST /auth/login`

**Request Body**:
```json
{
  "email": "john.doe@example.com",
  "password": "SecurePass123!"
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "firstName": "John",
      "lastName": "Doe",
      "fullName": "John Doe",
      "email": "john.doe@example.com",
      "role": "student",
      "studentId": "STU-2024-001234"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response** (401):
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

**Account Locked** (403):
```json
{
  "success": false,
  "message": "Account locked due to too many failed login attempts. Try again after 2 hours."
}
```

---

### Refresh Token
Get new access token using refresh token.

**Endpoint**: `POST /auth/refresh-token`

**Request Body**:
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### Logout
Invalidate refresh token.

**Endpoint**: `POST /auth/logout`

**Headers**: `Authorization: Bearer <token>`

**Response** (200):
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### Get Profile
Retrieve authenticated user's profile.

**Endpoint**: `GET /auth/profile`

**Headers**: `Authorization: Bearer <token>`

**Response** (200):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "role": "student",
      "studentId": "STU-2024-001234",
      "bio": "Computer Science student",
      "phone": "+1234567890",
      "isActive": true,
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

---

### Update Profile
Update user profile information.

**Endpoint**: `PUT /auth/profile`

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "phone": "+1234567890",
  "bio": "Updated bio"
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user": { /* updated user object */ }
  }
}
```

---

## Course Endpoints

### Get All Courses
Retrieve all available courses.

**Endpoint**: `GET /courses`

**Query Parameters**:
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search by title or code

**Example**: `GET /courses?page=1&limit=10&search=python`

**Response** (200):
```json
{
  "success": true,
  "data": {
    "courses": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "title": "Introduction to Python",
        "courseCode": "CS101",
        "description": "Learn Python programming from scratch",
        "instructor": {
          "_id": "507f1f77bcf86cd799439012",
          "firstName": "Jane",
          "lastName": "Teacher",
          "teacherId": "TCH-2024-001"
        },
        "duration": 40,
        "maxStudents": 50,
        "enrolledStudents": [],
        "status": "active",
        "semester": "Spring 2024",
        "lessons": 12,
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "total": 25,
      "page": 1,
      "pages": 3
    }
  }
}
```

---

### Create Course
Create a new course (Teacher only).

**Endpoint**: `POST /courses`

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "title": "Advanced JavaScript",
  "courseCode": "CS201",
  "description": "Deep dive into JavaScript ES6+",
  "duration": 50,
  "maxStudents": 30,
  "semester": "Fall 2024",
  "prerequisites": ["CS101"]
}
```

**Response** (201):
```json
{
  "success": true,
  "message": "Course created successfully",
  "data": {
    "course": {
      "_id": "507f1f77bcf86cd799439013",
      "title": "Advanced JavaScript",
      "courseCode": "CS201",
      "instructor": "507f1f77bcf86cd799439012",
      "status": "active"
    }
  }
}
```

---

### Enroll in Course
Student enrolls in a course.

**Endpoint**: `POST /courses/:courseId/enroll`

**Headers**: `Authorization: Bearer <token>`

**Response** (200):
```json
{
  "success": true,
  "message": "Successfully enrolled in course",
  "data": {
    "enrollment": {
      "student": "507f1f77bcf86cd799439011",
      "enrolledAt": "2024-01-15T10:30:00.000Z",
      "progress": 0
    }
  }
}
```

---

### Get Enrolled Courses
Retrieve courses student is enrolled in.

**Endpoint**: `GET /courses/enrolled`

**Headers**: `Authorization: Bearer <token>`

**Response** (200):
```json
{
  "success": true,
  "data": {
    "courses": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "title": "Introduction to Python",
        "courseCode": "CS101",
        "instructor": {
          "firstName": "Jane",
          "lastName": "Teacher"
        },
        "progress": 35,
        "enrolledAt": "2024-01-10T00:00:00.000Z"
      }
    ]
  }
}
```

---

### Get Teacher Courses
Retrieve courses taught by authenticated teacher.

**Endpoint**: `GET /courses/teacher`

**Headers**: `Authorization: Bearer <token>`

**Response** (200):
```json
{
  "success": true,
  "data": {
    "courses": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "title": "Introduction to Python",
        "courseCode": "CS101",
        "enrolledStudents": [
          {
            "student": {
              "_id": "507f1f77bcf86cd799439015",
              "firstName": "John",
              "lastName": "Doe",
              "studentId": "STU-2024-001234"
            },
            "progress": 35,
            "enrolledAt": "2024-01-10T00:00:00.000Z"
          }
        ],
        "status": "active"
      }
    ]
  }
}
```

---

## Attendance Endpoints

### Create Attendance Session
Teacher creates attendance session (with geolocation).

**Endpoint**: `POST /attendance`

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "course": "507f1f77bcf86cd799439011",
  "sessionType": "lecture",
  "date": "2024-01-15",
  "startTime": "09:00",
  "endTime": "10:30",
  "location": {
    "latitude": 40.7128,
    "longitude": -74.0060,
    "radius": 100
  },
  "allowedIPs": ["192.168.1.1"],
  "lateThresholdMinutes": 15
}
```

**Response** (201):
```json
{
  "success": true,
  "message": "Attendance session created",
  "data": {
    "session": {
      "_id": "507f1f77bcf86cd799439020",
      "course": "507f1f77bcf86cd799439011",
      "sessionType": "lecture",
      "status": "open",
      "qrCode": "data:image/png;base64,..."
    }
  }
}
```

---

### Mark Attendance
Student marks attendance for a session.

**Endpoint**: `POST /attendance/:sessionId/mark`

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "location": {
    "latitude": 40.7130,
    "longitude": -74.0062
  },
  "deviceFingerprint": "unique-device-id-123",
  "ipAddress": "192.168.1.100"
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Attendance marked successfully",
  "data": {
    "attendance": {
      "student": "507f1f77bcf86cd799439011",
      "status": "present",
      "markedAt": "2024-01-15T09:05:00.000Z",
      "isLate": false
    }
  }
}
```

**Error - Out of range** (400):
```json
{
  "success": false,
  "message": "You are not within the allowed location radius"
}
```

---

### Get Student Attendance
Retrieve attendance records for a student.

**Endpoint**: `GET /attendance/student/:studentId`

**Headers**: `Authorization: Bearer <token>`

**Query Parameters**:
- `course` (optional): Filter by course ID
- `startDate` (optional): From date
- `endDate` (optional): To date

**Response** (200):
```json
{
  "success": true,
  "data": {
    "attendance": [
      {
        "_id": "507f1f77bcf86cd799439030",
        "course": {
          "title": "Introduction to Python",
          "courseCode": "CS101"
        },
        "date": "2024-01-15",
        "status": "present",
        "isLate": false,
        "markedAt": "2024-01-15T09:05:00.000Z"
      }
    ],
    "statistics": {
      "totalSessions": 20,
      "attended": 18,
      "absent": 2,
      "late": 1,
      "attendancePercentage": 90
    }
  }
}
```

---

### Detect Anomalies
Check attendance session for anomalies.

**Endpoint**: `GET /attendance/:sessionId/anomalies`

**Headers**: `Authorization: Bearer <token>`

**Response** (200):
```json
{
  "success": true,
  "data": {
    "anomalies": [
      {
        "student": {
          "firstName": "John",
          "lastName": "Doe",
          "studentId": "STU-2024-001234"
        },
        "type": "location_mismatch",
        "description": "Marked from unusual location",
        "severity": "medium"
      }
    ]
  }
}
```

---

## Assignment Endpoints

### Get Course Assignments
Retrieve all assignments for a course.

**Endpoint**: `GET /assignments/course/:courseId`

**Headers**: `Authorization: Bearer <token>`

**Response** (200):
```json
{
  "success": true,
  "data": {
    "assignments": [
      {
        "_id": "507f1f77bcf86cd799439040",
        "title": "Python Basics Quiz",
        "description": "Complete the Python fundamentals quiz",
        "dueDate": "2024-01-20T23:59:59.000Z",
        "maxPoints": 100,
        "submissionType": "file",
        "status": "active"
      }
    ]
  }
}
```

---

### Create Assignment
Teacher creates a new assignment.

**Endpoint**: `POST /assignments`

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "course": "507f1f77bcf86cd799439011",
  "title": "Python Project",
  "description": "Build a calculator application",
  "dueDate": "2024-02-01T23:59:59.000Z",
  "maxPoints": 100,
  "submissionType": "file",
  "allowedFileTypes": [".py", ".zip"]
}
```

**Response** (201):
```json
{
  "success": true,
  "message": "Assignment created successfully",
  "data": {
    "assignment": {
      "_id": "507f1f77bcf86cd799439041",
      "title": "Python Project",
      "dueDate": "2024-02-01T23:59:59.000Z"
    }
  }
}
```

---

### Submit Assignment
Student submits assignment solution.

**Endpoint**: `POST /assignments/:assignmentId/submit`

**Headers**: 
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Form Data**:
- `file`: Assignment file
- `comments`: Optional submission comments

**Response** (201):
```json
{
  "success": true,
  "message": "Assignment submitted successfully",
  "data": {
    "submission": {
      "_id": "507f1f77bcf86cd799439050",
      "assignment": "507f1f77bcf86cd799439041",
      "student": "507f1f77bcf86cd799439011",
      "fileUrl": "/uploads/assignments/file.zip",
      "submittedAt": "2024-01-25T15:30:00.000Z",
      "status": "submitted"
    }
  }
}
```

---

### Grade Submission
Teacher grades student submission.

**Endpoint**: `PUT /assignments/submissions/:submissionId/grade`

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "points": 85,
  "feedback": "Good work! Consider edge cases for validation."
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Submission graded successfully",
  "data": {
    "submission": {
      "_id": "507f1f77bcf86cd799439050",
      "points": 85,
      "feedback": "Good work! Consider edge cases for validation.",
      "gradedAt": "2024-01-26T10:00:00.000Z",
      "status": "graded"
    }
  }
}
```

---

## Exam Endpoints

### Get Course Exams
Retrieve exams for a course.

**Endpoint**: `GET /exams/course/:courseId`

**Headers**: `Authorization: Bearer <token>`

**Response** (200):
```json
{
  "success": true,
  "data": {
    "exams": [
      {
        "_id": "507f1f77bcf86cd799439060",
        "title": "Midterm Exam",
        "startTime": "2024-02-15T09:00:00.000Z",
        "endTime": "2024-02-15T11:00:00.000Z",
        "duration": 120,
        "totalMarks": 100,
        "status": "scheduled"
      }
    ]
  }
}
```

---

### Submit Exam
Student submits exam answers.

**Endpoint**: `POST /exams/:examId/submit`

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "answers": [
    {
      "questionId": "q1",
      "answer": "A"
    },
    {
      "questionId": "q2",
      "answer": "Event-driven architecture"
    }
  ]
}
```

**Response** (201):
```json
{
  "success": true,
  "message": "Exam submitted successfully",
  "data": {
    "result": {
      "_id": "507f1f77bcf86cd799439070",
      "exam": "507f1f77bcf86cd799439060",
      "student": "507f1f77bcf86cd799439011",
      "score": 85,
      "totalMarks": 100,
      "percentage": 85
    }
  }
}
```

---

## Notification Endpoints

### Get Notifications
Retrieve user notifications.

**Endpoint**: `GET /notifications`

**Headers**: `Authorization: Bearer <token>`

**Query Parameters**:
- `page` (optional)
- `limit` (optional)
- `read` (optional): Filter by read status (true/false)

**Response** (200):
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "_id": "507f1f77bcf86cd799439080",
        "type": "attendance",
        "title": "New Attendance Session",
        "message": "Attendance session created for CS101",
        "priority": "high",
        "isRead": false,
        "createdAt": "2024-01-15T08:55:00.000Z"
      }
    ],
    "unreadCount": 5
  }
}
```

---

### Mark Notification as Read
Mark a notification as read.

**Endpoint**: `PUT /notifications/:notificationId/read`

**Headers**: `Authorization: Bearer <token>`

**Response** (200):
```json
{
  "success": true,
  "message": "Notification marked as read"
}
```

---

## Admin Endpoints

### Get All Users
Retrieve all platform users (Admin only).

**Endpoint**: `GET /admin/users`

**Headers**: `Authorization: Bearer <token>`

**Query Parameters**:
- `role` (optional): Filter by role
- `page`, `limit`

**Response** (200):
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john.doe@example.com",
        "role": "student",
        "studentId": "STU-2024-001234",
        "isActive": true,
        "createdAt": "2024-01-10T00:00:00.000Z"
      }
    ],
    "pagination": {
      "total": 150,
      "page": 1,
      "pages": 15
    }
  }
}
```

---

### Get Platform Analytics
Retrieve platform-wide statistics.

**Endpoint**: `GET /admin/analytics`

**Headers**: `Authorization: Bearer <token>`

**Response** (200):
```json
{
  "success": true,
  "data": {
    "users": {
      "total": 150,
      "students": 120,
      "teachers": 28,
      "admins": 2,
      "activeToday": 45
    },
    "courses": {
      "total": 25,
      "active": 20,
      "avgEnrollment": 30
    },
    "attendance": {
      "avgRate": 87.5,
      "totalSessions": 500
    },
    "assignments": {
      "totalSubmissions": 1200,
      "pendingGrading": 45
    }
  }
}
```

---

### Get Activity Logs
Retrieve activity logs (Admin only).

**Endpoint**: `GET /admin/logs`

**Headers**: `Authorization: Bearer <token>`

**Query Parameters**:
- `userId` (optional)
- `action` (optional)
- `startDate`, `endDate`

**Response** (200):
```json
{
  "success": true,
  "data": {
    "logs": [
      {
        "_id": "507f1f77bcf86cd799439090",
        "user": {
          "firstName": "John",
          "lastName": "Doe"
        },
        "action": "login",
        "details": "Successful login",
        "ipAddress": "192.168.1.100",
        "createdAt": "2024-01-15T09:00:00.000Z"
      }
    ]
  }
}
```

---

## Error Responses

### Validation Error (400)
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### Unauthorized (401)
```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

### Forbidden (403)
```json
{
  "success": false,
  "message": "You do not have permission to access this resource"
}
```

### Not Found (404)
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### Rate Limit (429)
```json
{
  "success": false,
  "message": "Too many requests. Please try again later."
}
```

### Server Error (500)
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## Rate Limits

- **Auth endpoints**: 5 requests per 15 minutes
- **API endpoints**: 100 requests per 15 minutes
- **Upload endpoints**: 50 requests per hour

---

## Testing with Postman

1. Import this collection
2. Set environment variable `baseUrl` = `http://localhost:5000/api`
3. After login, save `accessToken` to environment
4. Use `{{accessToken}}` in Authorization headers

**Sample Postman Environment**:
```json
{
  "baseUrl": "http://localhost:5000/api",
  "accessToken": "",
  "refreshToken": ""
}
```

---

## Webhooks (Future Implementation)

Planned webhook events:
- `user.created`
- `course.enrolled`
- `assignment.submitted`
- `attendance.marked`

---

**API Version**: 1.0.0  
**Last Updated**: January 2024
