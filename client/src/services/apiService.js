import api from './api';

export const authService = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.success) {
      const { user, tokens } = response.data.data;
      localStorage.setItem('accessToken', tokens.accessToken);
      localStorage.setItem('refreshToken', tokens.refreshToken);
      localStorage.setItem('user', JSON.stringify(user));
    }
    return response.data;
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put('/auth/profile', profileData);
    return response.data;
  },

  changePassword: async (passwordData) => {
    const response = await api.put('/auth/change-password', passwordData);
    return response.data;
  },
};

export const courseService = {
  getAllCourses: async (params) => {
    const response = await api.get('/courses', { params });
    return response.data;
  },

  getCourseById: async (id) => {
    const response = await api.get(`/courses/${id}`);
    return response.data;
  },

  createCourse: async (courseData) => {
    const response = await api.post('/courses', courseData);
    return response.data;
  },

  updateCourse: async (id, courseData) => {
    const response = await api.put(`/courses/${id}`, courseData);
    return response.data;
  },

  enrollCourse: async (courseId) => {
    const response = await api.post('/courses/enroll', { courseId });
    return response.data;
  },

  getEnrolledCourses: async () => {
    const response = await api.get('/courses/enrolled/my-courses');
    return response.data;
  },

  getCourseProgress: async (courseId) => {
    const response = await api.get(`/courses/${courseId}/progress`);
    return response.data;
  },

  publishCourse: async (id) => {
    const response = await api.post(`/courses/${id}/publish`);
    return response.data;
  },

  addModule: async (courseId, moduleData) => {
    const response = await api.post(`/courses/${courseId}/modules`, moduleData);
    return response.data;
  },
};

export const attendanceService = {
  createSession: async (sessionData) => {
    const response = await api.post('/attendance/session', sessionData);
    return response.data;
  },

  markAttendance: async (sessionId, attendanceData) => {
    const response = await api.post(`/attendance/mark/${sessionId}`, attendanceData);
    return response.data;
  },

  bulkMarkAttendance: async (sessionId, studentsData) => {
    const response = await api.post(`/attendance/session/${sessionId}/bulk-mark`, studentsData);
    return response.data;
  },

  getAttendanceSession: async (sessionId) => {
    const response = await api.get(`/attendance/session/${sessionId}`);
    return response.data;
  },

  getCourseAttendance: async (courseId, params) => {
    const response = await api.get(`/attendance/course/${courseId}`, { params });
    return response.data;
  },

  getStudentAttendance: async (studentId, params) => {
    const response = await api.get(`/attendance/student/${studentId}`, { params });
    return response.data;
  },

  closeSession: async (sessionId) => {
    const response = await api.post(`/attendance/session/${sessionId}/close`);
    return response.data;
  },

  getAnomalies: async (sessionId) => {
    const response = await api.get(`/attendance/session/${sessionId}/anomalies`);
    return response.data;
  },
};

export const assignmentService = {
  getCourseAssignments: async (courseId) => {
    const response = await api.get(`/assignments/course/${courseId}`);
    return response.data;
  },

  getAssignmentById: async (id) => {
    const response = await api.get(`/assignments/${id}`);
    return response.data;
  },

  createAssignment: async (assignmentData) => {
    const response = await api.post('/assignments', assignmentData);
    return response.data;
  },

  updateAssignment: async (id, assignmentData) => {
    const response = await api.put(`/assignments/${id}`, assignmentData);
    return response.data;
  },

  submitAssignment: async (assignmentId, formData) => {
    const response = await api.post(`/assignments/${assignmentId}/submit`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  getMySubmission: async (assignmentId) => {
    const response = await api.get(`/assignments/${assignmentId}/my-submission`);
    return response.data;
  },

  getSubmissions: async (assignmentId, params) => {
    const response = await api.get(`/assignments/${assignmentId}/submissions`, { params });
    return response.data;
  },

  gradeSubmission: async (submissionId, gradeData) => {
    const response = await api.post(`/assignments/submission/${submissionId}/grade`, gradeData);
    return response.data;
  },

  deleteAssignment: async (id) => {
    const response = await api.delete(`/assignments/${id}`);
    return response.data;
  },
};

export const examService = {
  getCourseExams: async (courseId) => {
    const response = await api.get(`/exams/course/${courseId}`);
    return response.data;
  },

  getExamById: async (id) => {
    const response = await api.get(`/exams/${id}`);
    return response.data;
  },

  createExam: async (examData) => {
    const response = await api.post('/exams', examData);
    return response.data;
  },

  updateExam: async (id, examData) => {
    const response = await api.put(`/exams/${id}`, examData);
    return response.data;
  },

  startExam: async (examId) => {
    const response = await api.post(`/exams/${examId}/start`);
    return response.data;
  },

  submitExam: async (resultId, answers) => {
    const response = await api.post(`/exams/result/${resultId}/submit`, { answers });
    return response.data;
  },

  getMyResult: async (examId) => {
    const response = await api.get(`/exams/${examId}/my-result`);
    return response.data;
  },

  getSubmissions: async (examId) => {
    const response = await api.get(`/exams/${examId}/submissions`);
    return response.data;
  },

  gradeSubjective: async (resultId, gradedAnswers) => {
    const response = await api.post(`/exams/result/${resultId}/grade`, { gradedAnswers });
    return response.data;
  },

  recordViolation: async (resultId, violationData) => {
    const response = await api.post(`/exams/result/${resultId}/violation`, violationData);
    return response.data;
  },
};

export const notificationService = {
  getNotifications: async (params) => {
    const response = await api.get('/notifications', { params });
    return response.data;
  },

  getUnreadCount: async () => {
    const response = await api.get('/notifications/unread-count');
    return response.data;
  },

  markAsRead: async (id) => {
    const response = await api.put(`/notifications/${id}/read`);
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await api.put('/notifications/mark-all-read');
    return response.data;
  },

  deleteNotification: async (id) => {
    const response = await api.delete(`/notifications/${id}`);
    return response.data;
  },
};

export const adminService = {
  getAllUsers: async (params) => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  getUserById: async (id) => {
    const response = await api.get(`/admin/users/${id}`);
    return response.data;
  },

  createUser: async (userData) => {
    const response = await api.post('/admin/users', userData);
    return response.data;
  },

  updateUser: async (id, userData) => {
    const response = await api.put(`/admin/users/${id}`, userData);
    return response.data;
  },

  toggleUserStatus: async (id) => {
    const response = await api.put(`/admin/users/${id}/toggle-status`);
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  },

  getPlatformStats: async () => {
    const response = await api.get('/admin/statistics');
    return response.data;
  },

  getActivityLogs: async (params) => {
    const response = await api.get('/admin/activity-logs', { params });
    return response.data;
  },

  getSecurityLogs: async (params) => {
    const response = await api.get('/admin/security-logs', { params });
    return response.data;
  },

  sendBulkNotification: async (notificationData) => {
    const response = await api.post('/admin/notifications/bulk', notificationData);
    return response.data;
  },
};
