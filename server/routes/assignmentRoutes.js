const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignmentController');
const authenticate = require('../middleware/authenticate');
const { authorize, authorizeCourseOwnership } = require('../middleware/authorize');
const { uploadMultiple } = require('../middleware/upload');
const validators = require('../utils/validators');
const { ROLES } = require('../config/constants');

// Get assignments
router.get('/course/:courseId', authenticate, assignmentController.getCourseAssignments);
router.get('/:id', authenticate, validators.idParam, assignmentController.getAssignmentById);

// Student routes
router.post(
  '/:assignmentId/submit',
  authenticate,
  authorize(ROLES.STUDENT),
  uploadMultiple('files', 5),
  assignmentController.submitAssignment
);

router.get(
  '/:assignmentId/my-submission',
  authenticate,
  authorize(ROLES.STUDENT),
  assignmentController.getStudentSubmission
);

// Teacher/Admin routes
router.post(
  '/',
  authenticate,
  authorize(ROLES.TEACHER, ROLES.ADMIN),
  validators.createAssignment,
  assignmentController.createAssignment
);

router.put(
  '/:id',
  authenticate,
  authorize(ROLES.TEACHER, ROLES.ADMIN),
  assignmentController.updateAssignment
);

router.delete(
  '/:id',
  authenticate,
  authorize(ROLES.TEACHER, ROLES.ADMIN),
  assignmentController.deleteAssignment
);

router.get(
  '/:assignmentId/submissions',
  authenticate,
  authorize(ROLES.TEACHER, ROLES.ADMIN),
  assignmentController.getAssignmentSubmissions
);

router.post(
  '/submission/:submissionId/grade',
  authenticate,
  authorize(ROLES.TEACHER, ROLES.ADMIN),
  assignmentController.gradeSubmission
);

module.exports = router;
