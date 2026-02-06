const User = require('../models/User');
const Course = require('../models/Course');
const AttendanceSession = require('../models/Attendance');
const Assignment = require('../models/Assignment');
const Exam = require('../models/Exam');
const ActivityLog = require('../models/ActivityLog');
const Notification = require('../models/Notification');
const { asyncHandler } = require('../middleware/errorHandler');
const { ROLES, ACTIVITY_TYPES, NOTIFICATION_TYPES } = require('../config/constants');

// Get all users (Admin)
exports.getAllUsers = asyncHandler(async (req, res) => {
  const { role, search, page = 1, limit = 20, isActive } = req.query;
  
  const query = {};
  if (role) query.role = role;
  if (isActive !== undefined) query.isActive = isActive === 'true';
  
  if (search) {
    query.$or = [
      { firstName: { $regex: search, $options: 'i' } },
      { lastName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { studentId: { $regex: search, $options: 'i' } },
      { teacherId: { $regex: search, $options: 'i' } }
    ];
  }
  
  const skip = (parseInt(page) - 1) * parseInt(limit);
  
  const users = await User.find(query)
    .select('-password -refreshToken')
    .sort({ createdAt: -1 })
    .limit(parseInt(limit))
    .skip(skip);
  
  const total = await User.countDocuments(query);
  
  res.json({
    success: true,
    data: {
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    }
  });
});

// Get user by ID (Admin)
exports.getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
    .select('-password -refreshToken')
    .populate('enrolledCourses', 'title courseCode');
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }
  
  res.json({
    success: true,
    data: { user }
  });
});

// Create user (Admin)
exports.createUser = asyncHandler(async (req, res) => {
  const {
    email,
    password,
    firstName,
    lastName,
    role,
    phone,
    dateOfBirth,
    department,
    qualification
  } = req.body;
  
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: 'User with this email already exists'
    });
  }
  
  const userData = {
    email,
    password,
    firstName,
    lastName,
    role,
    phone,
    dateOfBirth,
    isVerified: true,
    isActive: true
  };
  
  if (role === ROLES.STUDENT) {
    const studentCount = await User.countDocuments({ role: ROLES.STUDENT });
    userData.studentId = `STU${String(studentCount + 1).padStart(6, '0')}`;
    userData.enrollmentDate = new Date();
  } else if (role === ROLES.TEACHER) {
    const teacherCount = await User.countDocuments({ role: ROLES.TEACHER });
    userData.teacherId = `TCH${String(teacherCount + 1).padStart(6, '0')}`;
    userData.department = department;
    userData.qualification = qualification;
  }
  
  const user = await User.create(userData);
  
  // Log activity
  await ActivityLog.logActivity({
    user: req.userId,
    activityType: ACTIVITY_TYPES.USER_CREATE,
    description: `Admin created user: ${user.email}`,
    relatedEntity: {
      entityType: 'user',
      entityId: user._id
    },
    ipAddress: req.ip,
    userAgent: req.get('user-agent')
  });
  
  res.status(201).json({
    success: true,
    message: 'User created successfully',
    data: { user }
  });
});

// Update user (Admin)
exports.updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  
  // Prevent updating certain fields
  delete updates.password;
  delete updates.studentId;
  delete updates.teacherId;
  delete updates.email;
  
  const user = await User.findByIdAndUpdate(
    id,
    updates,
    { new: true, runValidators: true }
  ).select('-password -refreshToken');
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }
  
  // Log activity
  await ActivityLog.logActivity({
    user: req.userId,
    activityType: ACTIVITY_TYPES.USER_UPDATE,
    description: `Admin updated user: ${user.email}`,
    relatedEntity: {
      entityType: 'user',
      entityId: user._id
    },
    ipAddress: req.ip,
    userAgent: req.get('user-agent')
  });
  
  res.json({
    success: true,
    message: 'User updated successfully',
    data: { user }
  });
});

// Deactivate/Activate user (Admin)
exports.toggleUserStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const user = await User.findById(id);
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }
  
  user.isActive = !user.isActive;
  await user.save();
  
  // Log activity
  await ActivityLog.logActivity({
    user: req.userId,
    activityType: ACTIVITY_TYPES.USER_UPDATE,
    description: `Admin ${user.isActive ? 'activated' : 'deactivated'} user: ${user.email}`,
    relatedEntity: {
      entityType: 'user',
      entityId: user._id
    },
    ipAddress: req.ip,
    userAgent: req.get('user-agent')
  });
  
  res.json({
    success: true,
    message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
    data: { user }
  });
});

// Delete user (Admin)
exports.deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const user = await User.findByIdAndDelete(id);
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }
  
  // Log activity
  await ActivityLog.logActivity({
    user: req.userId,
    activityType: ACTIVITY_TYPES.USER_DELETE,
    description: `Admin deleted user: ${user.email}`,
    metadata: new Map([
      ['deletedUserId', user._id.toString()],
      ['deletedUserEmail', user.email]
    ]),
    ipAddress: req.ip,
    userAgent: req.get('user-agent')
  });
  
  res.json({
    success: true,
    message: 'User deleted successfully'
  });
});

// Get platform statistics (Admin)
exports.getPlatformStats = asyncHandler(async (req, res) => {
  const [
    totalStudents,
    totalTeachers,
    totalCourses,
    totalAssignments,
    totalExams,
    activeUsers,
    recentActivities
  ] = await Promise.all([
    User.countDocuments({ role: ROLES.STUDENT }),
    User.countDocuments({ role: ROLES.TEACHER }),
    Course.countDocuments(),
    Assignment.countDocuments(),
    Exam.countDocuments(),
    User.countDocuments({ isActive: true }),
    ActivityLog.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('user', 'firstName lastName email role')
  ]);
  
  // Calculate total enrollments
  const courses = await Course.find().select('enrolledStudents');
  const totalEnrollments = courses.reduce((sum, course) => sum + course.enrolledStudents.length, 0);
  
  // Get attendance statistics
  const attendanceSessions = await AttendanceSession.find();
  const avgAttendance = attendanceSessions.length > 0
    ? attendanceSessions.reduce((sum, session) => sum + session.attendancePercentage, 0) / attendanceSessions.length
    : 0;
  
  res.json({
    success: true,
    data: {
      statistics: {
        users: {
          total: totalStudents + totalTeachers,
          students: totalStudents,
          teachers: totalTeachers,
          activeUsers
        },
        courses: {
          total: totalCourses,
          totalEnrollments
        },
        assignments: {
          total: totalAssignments
        },
        exams: {
          total: totalExams
        },
        attendance: {
          averagePercentage: Math.round(avgAttendance)
        }
      },
      recentActivities
    }
  });
});

// Get activity logs (Admin)
exports.getActivityLogs = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 50,
    userId,
    activityType,
    startDate,
    endDate,
    status
  } = req.query;
  
  const options = {
    limit: parseInt(limit),
    skip: (parseInt(page) - 1) * parseInt(limit),
    activityTypes: activityType ? [activityType] : null,
    status,
    startDate,
    endDate
  };
  
  const logs = userId 
    ? await ActivityLog.getUserTimeline(userId, options)
    : await ActivityLog.getSystemActivity(options);
  
  const total = userId
    ? await ActivityLog.countDocuments({ user: userId })
    : await ActivityLog.countDocuments();
  
  res.json({
    success: true,
    data: {
      logs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    }
  });
});

// Get security logs (Admin)
exports.getSecurityLogs = asyncHandler(async (req, res) => {
  const { page = 1, limit = 50 } = req.query;
  
  const logs = await ActivityLog.find({
    activityType: { $in: [ACTIVITY_TYPES.LOGIN, ACTIVITY_TYPES.LOGOUT] }
  })
    .populate('user', 'firstName lastName email role')
    .sort({ createdAt: -1 })
    .limit(parseInt(limit))
    .skip((parseInt(page) - 1) * parseInt(limit));
  
  const total = await ActivityLog.countDocuments({
    activityType: { $in: [ACTIVITY_TYPES.LOGIN, ACTIVITY_TYPES.LOGOUT] }
  });
  
  res.json({
    success: true,
    data: {
      logs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    }
  });
});

// Send bulk notification (Admin)
exports.sendBulkNotification = asyncHandler(async (req, res) => {
  const { role, title, message, priority = 'medium' } = req.body;
  
  const query = {};
  if (role) query.role = role;
  
  const users = await User.find(query).select('_id');
  
  const notifications = users.map(user => ({
    recipient: user._id,
    type: NOTIFICATION_TYPES.SYSTEM,
    title,
    message,
    priority
  }));
  
  await Promise.all(notifications.map(n => Notification.createNotification(n)));
  
  res.json({
    success: true,
    message: `Notification sent to ${users.length} users`
  });
});

module.exports = exports;
