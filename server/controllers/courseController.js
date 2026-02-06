const Course = require('../models/Course');
const User = require('../models/User');
const Lesson = require('../models/Lesson');
const ActivityLog = require('../models/ActivityLog');
const Notification = require('../models/Notification');
const { asyncHandler } = require('../middleware/errorHandler');
const { ROLES, COURSE_STATUS, ACTIVITY_TYPES, NOTIFICATION_TYPES } = require('../config/constants');

// Create new course (Teacher/Admin)
exports.createCourse = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    category,
    duration,
    level,
    maxStudents,
    startDate,
    endDate,
    schedule,
    prerequisites,
    learningOutcomes
  } = req.body;
  
  // Generate unique course code
  const courseCount = await Course.countDocuments();
  const courseCode = `CRS${String(courseCount + 1).padStart(6, '0')}`;
  
  const course = await Course.create({
    title,
    description,
    courseCode,
    category,
    instructor: req.userId,
    duration,
    level,
    maxStudents,
    startDate,
    endDate,
    schedule,
    prerequisites,
    learningOutcomes,
    status: COURSE_STATUS.DRAFT
  });
  
  // Log activity
  await ActivityLog.logActivity({
    user: req.userId,
    activityType: ACTIVITY_TYPES.COURSE_CREATE,
    description: `Created course: ${course.title}`,
    relatedEntity: {
      entityType: 'course',
      entityId: course._id
    },
    ipAddress: req.ip,
    userAgent: req.get('user-agent')
  });
  
  res.status(201).json({
    success: true,
    message: 'Course created successfully',
    data: { course }
  });
});

// Get all courses
exports.getAllCourses = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    category,
    level,
    status,
    search,
    instructor
  } = req.query;
  
  const query = {};
  
  // Filters
  if (category) query.category = category;
  if (level) query.level = level;
  if (status) query.status = status;
  if (instructor) query.instructor = instructor;
  
  // Students can only see published courses
  if (req.userRole === ROLES.STUDENT) {
    query.status = COURSE_STATUS.PUBLISHED;
    query.isPublished = true;
  }
  
  // Teachers can see their own courses
  if (req.userRole === ROLES.TEACHER) {
    query.instructor = req.userId;
  }
  
  // Search
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { courseCode: { $regex: search, $options: 'i' } }
    ];
  }
  
  const skip = (parseInt(page) - 1) * parseInt(limit);
  
  const courses = await Course.find(query)
    .populate('instructor', 'firstName lastName email profilePicture')
    .sort({ createdAt: -1 })
    .limit(parseInt(limit))
    .skip(skip);
  
  const total = await Course.countDocuments(query);
  
  res.json({
    success: true,
    data: {
      courses,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    }
  });
});

// Get course by ID
exports.getCourseById = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id)
    .populate('instructor', 'firstName lastName email profilePicture department qualification')
    .populate('enrolledStudents.student', 'firstName lastName email profilePicture studentId')
    .populate({
      path: 'modules.lessons',
      select: 'title description contentType duration isPublished'
    });
  
  if (!course) {
    return res.status(404).json({
      success: false,
      message: 'Course not found'
    });
  }
  
  // Check access permissions
  if (req.userRole === ROLES.STUDENT) {
    if (!course.isPublished) {
      return res.status(403).json({
        success: false,
        message: 'This course is not published yet'
      });
    }
  }
  
  res.json({
    success: true,
    data: { course }
  });
});

// Update course
exports.updateCourse = asyncHandler(async (req, res) => {
  const courseId = req.params.id;
  const updates = req.body;
  
  // Prevent updating certain fields
  delete updates.courseCode;
  delete updates.instructor;
  delete updates.enrolledStudents;
  
  const course = await Course.findByIdAndUpdate(
    courseId,
    updates,
    { new: true, runValidators: true }
  ).populate('instructor', 'firstName lastName email');
  
  if (!course) {
    return res.status(404).json({
      success: false,
      message: 'Course not found'
    });
  }
  
  // Log activity
  await ActivityLog.logActivity({
    user: req.userId,
    activityType: ACTIVITY_TYPES.COURSE_UPDATE,
    description: `Updated course: ${course.title}`,
    relatedEntity: {
      entityType: 'course',
      entityId: course._id
    },
    ipAddress: req.ip,
    userAgent: req.get('user-agent')
  });
  
  res.json({
    success: true,
    message: 'Course updated successfully',
    data: { course }
  });
});

// Publish course
exports.publishCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  
  if (!course) {
    return res.status(404).json({
      success: false,
      message: 'Course not found'
    });
  }
  
  course.status = COURSE_STATUS.PUBLISHED;
  course.isPublished = true;
  await course.save();
  
  res.json({
    success: true,
    message: 'Course published successfully',
    data: { course }
  });
});

// Enroll student in course
exports.enrollStudent = asyncHandler(async (req, res) => {
  const { courseId } = req.body;
  const studentId = req.userId;
  
  const course = await Course.findById(courseId);
  
  if (!course) {
    return res.status(404).json({
      success: false,
      message: 'Course not found'
    });
  }
  
  if (!course.isPublished || !course.allowEnrollment) {
    return res.status(400).json({
      success: false,
      message: 'Course enrollment is not available'
    });
  }
  
  try {
    await course.enrollStudent(studentId);
    
    // Update user's enrolled courses
    await User.findByIdAndUpdate(studentId, {
      $addToSet: { enrolledCourses: courseId }
    });
    
    // Send notification
    await Notification.createNotification({
      recipient: studentId,
      type: NOTIFICATION_TYPES.COURSE,
      title: 'Enrollment Successful',
      message: `You have successfully enrolled in ${course.title}`,
      relatedEntity: {
        entityType: 'course',
        entityId: courseId
      },
      actionUrl: `/courses/${courseId}`
    });
    
    res.json({
      success: true,
      message: 'Successfully enrolled in course',
      data: { course }
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Get student's enrolled courses
exports.getEnrolledCourses = asyncHandler(async (req, res) => {
  const student = await User.findById(req.userId).populate({
    path: 'enrolledCourses',
    populate: {
      path: 'instructor',
      select: 'firstName lastName email'
    }
  });
  
  if (!student) {
    return res.status(404).json({
      success: false,
      message: 'Student not found'
    });
  }
  
  res.json({
    success: true,
    data: { courses: student.enrolledCourses }
  });
});

// Get course progress for student
exports.getCourseProgress = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const studentId = req.userId;
  
  const course = await Course.findById(courseId).populate('modules.lessons');
  
  if (!course) {
    return res.status(404).json({
      success: false,
      message: 'Course not found'
    });
  }
  
  const enrollment = course.enrolledStudents.find(
    e => e.student.toString() === studentId.toString()
  );
  
  if (!enrollment) {
    return res.status(404).json({
      success: false,
      message: 'Not enrolled in this course'
    });
  }
  
  res.json({
    success: true,
    data: {
      progress: enrollment.progress,
      completedLessons: enrollment.completedLessons,
      enrolledAt: enrollment.enrolledAt
    }
  });
});

// Add module to course
exports.addModule = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const { title, description, order } = req.body;
  
  const course = await Course.findById(courseId);
  
  if (!course) {
    return res.status(404).json({
      success: false,
      message: 'Course not found'
    });
  }
  
  course.modules.push({
    title,
    description,
    order,
    lessons: []
  });
  
  await course.save();
  
  res.status(201).json({
    success: true,
    message: 'Module added successfully',
    data: { course }
  });
});

// Delete course
exports.deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  
  if (!course) {
    return res.status(404).json({
      success: false,
      message: 'Course not found'
    });
  }
  
  // Archive instead of hard delete
  course.status = COURSE_STATUS.ARCHIVED;
  course.isPublished = false;
  await course.save();
  
  res.json({
    success: true,
    message: 'Course archived successfully'
  });
});

module.exports = exports;
