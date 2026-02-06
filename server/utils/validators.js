const { body, param, query, validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }))
    });
  }
  next();
};

const validators = {
  // User Registration
  register: [
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .withMessage('Password must contain uppercase, lowercase, number, and special character'),
    body('firstName').trim().notEmpty().withMessage('First name required'),
    body('lastName').trim().notEmpty().withMessage('Last name required'),
    body('role').isIn(['student', 'teacher', 'admin']).withMessage('Invalid role'),
    validate
  ],

  // User Login
  login: [
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password required'),
    validate
  ],

  // Course Creation
  createCourse: [
    body('title').trim().notEmpty().withMessage('Course title required'),
    body('description').trim().notEmpty().withMessage('Description required'),
    body('category').trim().notEmpty().withMessage('Category required'),
    body('duration').isInt({ min: 1 }).withMessage('Valid duration required'),
    validate
  ],

  // Assignment Creation
  createAssignment: [
    body('title').trim().notEmpty().withMessage('Assignment title required'),
    body('description').trim().notEmpty().withMessage('Description required'),
    body('courseId').isMongoId().withMessage('Valid course ID required'),
    body('dueDate').isISO8601().withMessage('Valid due date required'),
    body('totalMarks').isInt({ min: 1 }).withMessage('Total marks required'),
    validate
  ],

  // Attendance Marking
  markAttendance: [
    body('courseId').isMongoId().withMessage('Valid course ID required'),
    body('sessionId').isMongoId().withMessage('Valid session ID required'),
    body('students').isArray().withMessage('Students array required'),
    body('students.*.studentId').isMongoId().withMessage('Valid student ID required'),
    body('students.*.status').isIn(['present', 'absent', 'late', 'excused']).withMessage('Valid status required'),
    validate
  ],

  // ID Parameter
  idParam: [
    param('id').isMongoId().withMessage('Valid ID required'),
    validate
  ],

  // Pagination
  pagination: [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    validate
  ]
};

module.exports = validators;
