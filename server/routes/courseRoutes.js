const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const authenticate = require('../middleware/authenticate');
const { authorize, authorizeCourseOwnership, authorizeEnrollment } = require('../middleware/authorize');
const validators = require('../utils/validators');
const { ROLES } = require('../config/constants');

// Public/Student routes
router.get('/', authenticate, validators.pagination, courseController.getAllCourses);
router.get('/:id', authenticate, courseController.getCourseById);

// Student-specific routes
router.post('/enroll', authenticate, authorize(ROLES.STUDENT), courseController.enrollStudent);
router.get('/enrolled/my-courses', authenticate, authorize(ROLES.STUDENT), courseController.getEnrolledCourses);
router.get('/:courseId/progress', authenticate, authorize(ROLES.STUDENT), authorizeEnrollment, courseController.getCourseProgress);

// Teacher/Admin routes
router.post(
  '/',
  authenticate,
  authorize(ROLES.TEACHER, ROLES.ADMIN),
  validators.createCourse,
  courseController.createCourse
);

router.put(
  '/:id',
  authenticate,
  authorize(ROLES.TEACHER, ROLES.ADMIN),
  authorizeCourseOwnership,
  courseController.updateCourse
);

router.post(
  '/:id/publish',
  authenticate,
  authorize(ROLES.TEACHER, ROLES.ADMIN),
  authorizeCourseOwnership,
  courseController.publishCourse
);

router.post(
  '/:courseId/modules',
  authenticate,
  authorize(ROLES.TEACHER, ROLES.ADMIN),
  authorizeCourseOwnership,
  courseController.addModule
);

router.delete(
  '/:id',
  authenticate,
  authorize(ROLES.ADMIN),
  courseController.deleteCourse
);

module.exports = router;
