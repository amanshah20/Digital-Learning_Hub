const { ROLES } = require('../config/constants');
const logger = require('../utils/logger');

const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.userRole) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }
    
    if (!allowedRoles.includes(req.userRole)) {
      logger.security('Unauthorized access attempt', {
        userId: req.userId,
        role: req.userRole,
        attemptedRole: allowedRoles,
        path: req.path,
        ip: req.ip
      });
      
      return res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions.'
      });
    }
    
    next();
  };
};

// Check if user owns the resource (for student/teacher specific routes)
const authorizeOwnership = (resourceField = 'userId') => {
  return (req, res, next) => {
    const resourceOwnerId = req.params[resourceField] || req.body[resourceField];
    
    // Admins can access any resource
    if (req.userRole === ROLES.ADMIN) {
      return next();
    }
    
    // Check if user owns the resource
    if (resourceOwnerId && resourceOwnerId.toString() !== req.userId.toString()) {
      logger.security('Unauthorized resource access attempt', {
        userId: req.userId,
        attemptedResourceOwner: resourceOwnerId,
        path: req.path,
        ip: req.ip
      });
      
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only access your own resources.'
      });
    }
    
    next();
  };
};

// Check if teacher owns the course
const authorizeCourseOwnership = async (req, res, next) => {
  try {
    const Course = require('../models/Course');
    const courseId = req.params.courseId || req.body.courseId || req.params.id;
    
    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: 'Course ID required'
      });
    }
    
    // Admins can access any course
    if (req.userRole === ROLES.ADMIN) {
      return next();
    }
    
    const course = await Course.findById(courseId);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    
    // Check if teacher owns the course
    if (req.userRole === ROLES.TEACHER && course.instructor.toString() !== req.userId.toString()) {
      logger.security('Unauthorized course access attempt', {
        userId: req.userId,
        courseId: courseId,
        actualInstructor: course.instructor,
        path: req.path,
        ip: req.ip
      });
      
      return res.status(403).json({
        success: false,
        message: 'Access denied. You are not the instructor of this course.'
      });
    }
    
    req.course = course;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error checking course ownership'
    });
  }
};

// Check if student is enrolled in course
const authorizeEnrollment = async (req, res, next) => {
  try {
    const Course = require('../models/Course');
    const courseId = req.params.courseId || req.body.courseId;
    
    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: 'Course ID required'
      });
    }
    
    // Admins and teachers can bypass enrollment check
    if (req.userRole === ROLES.ADMIN || req.userRole === ROLES.TEACHER) {
      return next();
    }
    
    const course = await Course.findById(courseId);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    
    // Check if student is enrolled
    const isEnrolled = course.enrolledStudents.some(
      enrollment => enrollment.student.toString() === req.userId.toString()
    );
    
    if (!isEnrolled) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You are not enrolled in this course.'
      });
    }
    
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error checking enrollment'
    });
  }
};

module.exports = {
  authorize,
  authorizeOwnership,
  authorizeCourseOwnership,
  authorizeEnrollment
};
