const AttendanceSession = require('../models/Attendance');
const Course = require('../models/Course');
const User = require('../models/User');
const Notification = require('../models/Notification');
const ActivityLog = require('../models/ActivityLog');
const { asyncHandler } = require('../middleware/errorHandler');
const { ATTENDANCE_STATUS, ROLES, ACTIVITY_TYPES, NOTIFICATION_TYPES } = require('../config/constants');

// Create attendance session (Teacher)
exports.createAttendanceSession = asyncHandler(async (req, res) => {
  const {
    courseId,
    lessonId,
    sessionDate,
    sessionType,
    startTime,
    endTime,
    attendanceWindow,
    lateThreshold,
    locationRequired,
    allowedLocation,
    ipWhitelist
  } = req.body;
  
  const course = await Course.findById(courseId);
  
  if (!course) {
    return res.status(404).json({
      success: false,
      message: 'Course not found'
    });
  }
  
  const session = await AttendanceSession.create({
    course: courseId,
    lesson: lessonId,
    sessionDate,
    sessionType: sessionType || 'lecture',
    startTime,
    endTime,
    teacher: req.userId,
    attendanceWindow: attendanceWindow || {
      openTime: startTime,
      closeTime: endTime
    },
    lateThreshold: lateThreshold || 15,
    locationRequired: locationRequired || false,
    allowedLocation,
    ipWhitelist: ipWhitelist || [],
    totalStudents: course.enrolledStudents.length,
    isActive: true
  });
  
  // Notify all enrolled students
  const notifications = course.enrolledStudents.map(enrollment => ({
    recipient: enrollment.student,
    type: NOTIFICATION_TYPES.ATTENDANCE,
    title: 'Attendance Session Started',
    message: `Attendance is now open for ${course.title}`,
    relatedEntity: {
      entityType: 'attendance',
      entityId: session._id
    },
    actionUrl: `/attendance/mark/${session._id}`,
    priority: 'high'
  }));
  
  await Promise.all(notifications.map(n => Notification.createNotification(n)));
  
  // Log activity
  await ActivityLog.logActivity({
    user: req.userId,
    activityType: ACTIVITY_TYPES.ATTENDANCE_MARK,
    description: `Created attendance session for ${course.title}`,
    relatedEntity: {
      entityType: 'attendance',
      entityId: session._id
    },
    ipAddress: req.ip,
    userAgent: req.get('user-agent')
  });
  
  res.status(201).json({
    success: true,
    message: 'Attendance session created successfully',
    data: { session }
  });
});

// Mark attendance (Student)
exports.markAttendance = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;
  const studentId = req.userId;
  const { latitude, longitude } = req.body;
  
  const session = await AttendanceSession.findById(sessionId).populate('course', 'title');
  
  if (!session) {
    return res.status(404).json({
      success: false,
      message: 'Attendance session not found'
    });
  }
  
  const deviceInfo = {
    ip: req.ip,
    userAgent: req.get('user-agent'),
    deviceType: req.get('user-agent').match(/(mobile|tablet|iphone|ipad|android)/i) ? 'mobile' : 'desktop',
    location: latitude && longitude ? { latitude, longitude } : null
  };
  
  // Check if student can mark attendance
  const canMark = session.canMarkAttendance(deviceInfo);
  if (!canMark.allowed) {
    return res.status(400).json({
      success: false,
      message: canMark.reason
    });
  }
  
  // Validate location if required
  if (session.locationRequired && session.allowedLocation) {
    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Location is required for this attendance session'
      });
    }
    
    // Calculate distance (simplified)
    const distance = calculateDistance(
      latitude,
      longitude,
      session.allowedLocation.latitude,
      session.allowedLocation.longitude
    );
    
    if (distance > session.allowedLocation.radius) {
      return res.status(400).json({
        success: false,
        message: 'You are not within the allowed location range'
      });
    }
  }
  
  // Determine status (present or late)
  const now = new Date();
  const lateTime = new Date(session.startTime.getTime() + session.lateThreshold * 60000);
  const status = now > lateTime ? ATTENDANCE_STATUS.LATE : ATTENDANCE_STATUS.PRESENT;
  
  try {
    await session.markAttendance(studentId, status, req.userId, deviceInfo);
    
    // Send notification
    await Notification.createNotification({
      recipient: studentId,
      type: NOTIFICATION_TYPES.ATTENDANCE,
      title: 'Attendance Marked',
      message: `Your attendance has been marked as ${status} for ${session.course.title}`,
      relatedEntity: {
        entityType: 'attendance',
        entityId: session._id
      }
    });
    
    res.json({
      success: true,
      message: 'Attendance marked successfully',
      data: { status }
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Bulk mark attendance (Teacher)
exports.bulkMarkAttendance = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;
  const { students } = req.body; // Array of { studentId, status, remarks }
  
  const session = await AttendanceSession.findById(sessionId);
  
  if (!session) {
    return res.status(404).json({
      success: false,
      message: 'Attendance session not found'
    });
  }
  
  const results = {
    success: [],
    failed: []
  };
  
  for (const student of students) {
    try {
      await session.markAttendance(
        student.studentId,
        student.status,
        req.userId,
        { ip: req.ip, userAgent: 'Manual by teacher' },
        student.remarks || ''
      );
      
      results.success.push(student.studentId);
      
      // Send notification
      await Notification.createNotification({
        recipient: student.studentId,
        type: NOTIFICATION_TYPES.ATTENDANCE,
        title: 'Attendance Marked',
        message: `Your attendance has been marked as ${student.status}`,
        relatedEntity: {
          entityType: 'attendance',
          entityId: session._id
        }
      });
    } catch (error) {
      results.failed.push({
        studentId: student.studentId,
        error: error.message
      });
    }
  }
  
  res.json({
    success: true,
    message: 'Bulk attendance marking completed',
    data: results
  });
});

// Get attendance session
exports.getAttendanceSession = asyncHandler(async (req, res) => {
  const session = await AttendanceSession.findById(req.params.sessionId)
    .populate('course', 'title courseCode')
    .populate('lesson', 'title')
    .populate('teacher', 'firstName lastName email')
    .populate('records.student', 'firstName lastName email studentId profilePicture')
    .populate('records.markedBy', 'firstName lastName email');
  
  if (!session) {
    return res.status(404).json({
      success: false,
      message: 'Attendance session not found'
    });
  }
  
  res.json({
    success: true,
    data: { session }
  });
});

// Get course attendance sessions
exports.getCourseAttendance = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const { page = 1, limit = 20, startDate, endDate } = req.query;
  
  const query = { course: courseId };
  
  if (startDate || endDate) {
    query.sessionDate = {};
    if (startDate) query.sessionDate.$gte = new Date(startDate);
    if (endDate) query.sessionDate.$lte = new Date(endDate);
  }
  
  const skip = (parseInt(page) - 1) * parseInt(limit);
  
  const sessions = await AttendanceSession.find(query)
    .populate('teacher', 'firstName lastName')
    .sort({ sessionDate: -1 })
    .limit(parseInt(limit))
    .skip(skip);
  
  const total = await AttendanceSession.countDocuments(query);
  
  res.json({
    success: true,
    data: {
      sessions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    }
  });
});

// Get student attendance history
exports.getStudentAttendance = asyncHandler(async (req, res) => {
  const { studentId } = req.params;
  const { courseId, startDate, endDate } = req.query;
  
  const query = { 'records.student': studentId };
  
  if (courseId) {
    query.course = courseId;
  }
  
  if (startDate || endDate) {
    query.sessionDate = {};
    if (startDate) query.sessionDate.$gte = new Date(startDate);
    if (endDate) query.sessionDate.$lte = new Date(endDate);
  }
  
  const sessions = await AttendanceSession.find(query)
    .populate('course', 'title courseCode')
    .populate('lesson', 'title')
    .sort({ sessionDate: -1 });
  
  // Extract student's attendance records
  const attendanceHistory = sessions.map(session => {
    const record = session.records.find(
      r => r.student.toString() === studentId.toString()
    );
    
    return {
      sessionId: session._id,
      course: session.course,
      lesson: session.lesson,
      sessionDate: session.sessionDate,
      sessionType: session.sessionType,
      status: record ? record.status : ATTENDANCE_STATUS.ABSENT,
      markedAt: record ? record.markedAt : null,
      remarks: record ? record.remarks : ''
    };
  });
  
  // Calculate statistics
  const totalSessions = attendanceHistory.length;
  const presentCount = attendanceHistory.filter(a => a.status === ATTENDANCE_STATUS.PRESENT).length;
  const lateCount = attendanceHistory.filter(a => a.status === ATTENDANCE_STATUS.LATE).length;
  const absentCount = attendanceHistory.filter(a => a.status === ATTENDANCE_STATUS.ABSENT).length;
  const attendancePercentage = totalSessions > 0 
    ? Math.round(((presentCount + lateCount) / totalSessions) * 100)
    : 0;
  
  res.json({
    success: true,
    data: {
      attendanceHistory,
      statistics: {
        totalSessions,
        presentCount,
        lateCount,
        absentCount,
        attendancePercentage
      }
    }
  });
});

// Close attendance session
exports.closeAttendanceSession = asyncHandler(async (req, res) => {
  const session = await AttendanceSession.findById(req.params.sessionId);
  
  if (!session) {
    return res.status(404).json({
      success: false,
      message: 'Attendance session not found'
    });
  }
  
  await session.closeSession();
  
  res.json({
    success: true,
    message: 'Attendance session closed successfully',
    data: { session }
  });
});

// Get attendance anomalies
exports.getAttendanceAnomalies = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;
  
  const session = await AttendanceSession.findById(sessionId);
  
  if (!session) {
    return res.status(404).json({
      success: false,
      message: 'Attendance session not found'
    });
  }
  
  const anomalies = session.detectAnomalies();
  
  res.json({
    success: true,
    data: { anomalies }
  });
});

// Helper function to calculate distance between two coordinates
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;
  
  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  return R * c;
}

module.exports = exports;
