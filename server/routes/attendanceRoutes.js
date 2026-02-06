const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const authenticate = require('../middleware/authenticate');
const { authorize, authorizeCourseOwnership } = require('../middleware/authorize');
const validators = require('../utils/validators');
const { ROLES } = require('../config/constants');

// Teacher routes - Create and manage sessions
router.post(
  '/session',
  authenticate,
  authorize(ROLES.TEACHER, ROLES.ADMIN),
  validators.markAttendance,
  attendanceController.createAttendanceSession
);

router.post(
  '/session/:sessionId/bulk-mark',
  authenticate,
  authorize(ROLES.TEACHER, ROLES.ADMIN),
  attendanceController.bulkMarkAttendance
);

router.post(
  '/session/:sessionId/close',
  authenticate,
  authorize(ROLES.TEACHER, ROLES.ADMIN),
  attendanceController.closeAttendanceSession
);

router.get(
  '/session/:sessionId/anomalies',
  authenticate,
  authorize(ROLES.TEACHER, ROLES.ADMIN),
  attendanceController.getAttendanceAnomalies
);

// Student routes - Mark attendance
router.post(
  '/mark/:sessionId',
  authenticate,
  authorize(ROLES.STUDENT),
  attendanceController.markAttendance
);

// Common routes
router.get(
  '/session/:sessionId',
  authenticate,
  attendanceController.getAttendanceSession
);

router.get(
  '/course/:courseId',
  authenticate,
  validators.pagination,
  attendanceController.getCourseAttendance
);

router.get(
  '/student/:studentId',
  authenticate,
  attendanceController.getStudentAttendance
);

module.exports = router;
