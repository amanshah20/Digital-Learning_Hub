module.exports = {
  ROLES: {
    STUDENT: 'student',
    TEACHER: 'teacher',
    ADMIN: 'admin'
  },

  ATTENDANCE_STATUS: {
    PRESENT: 'present',
    ABSENT: 'absent',
    LATE: 'late',
    EXCUSED: 'excused'
  },

  COURSE_STATUS: {
    DRAFT: 'draft',
    PUBLISHED: 'published',
    ARCHIVED: 'archived'
  },

  ASSIGNMENT_STATUS: {
    PENDING: 'pending',
    SUBMITTED: 'submitted',
    GRADED: 'graded',
    LATE: 'late'
  },

  NOTIFICATION_TYPES: {
    ASSIGNMENT: 'assignment',
    GRADE: 'grade',
    ATTENDANCE: 'attendance',
    COURSE: 'course',
    SYSTEM: 'system',
    MESSAGE: 'message'
  },

  EXAM_STATUS: {
    SCHEDULED: 'scheduled',
    ONGOING: 'ongoing',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled'
  },

  FILE_TYPES: {
    DOCUMENT: ['pdf', 'doc', 'docx', 'txt'],
    VIDEO: ['mp4', 'avi', 'mov', 'mkv'],
    IMAGE: ['jpg', 'jpeg', 'png', 'gif'],
    PRESENTATION: ['ppt', 'pptx']
  },

  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB

  ACTIVITY_TYPES: {
    LOGIN: 'login',
    LOGOUT: 'logout',
    COURSE_CREATE: 'course_create',
    COURSE_UPDATE: 'course_update',
    ASSIGNMENT_SUBMIT: 'assignment_submit',
    ATTENDANCE_MARK: 'attendance_mark',
    GRADE_ASSIGN: 'grade_assign',
    USER_CREATE: 'user_create',
    USER_UPDATE: 'user_update',
    USER_DELETE: 'user_delete'
  }
};
