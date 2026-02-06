const express = require('express');
const router = express.Router();
const examController = require('../controllers/examController');
const authenticate = require('../middleware/authenticate');
const { authorize } = require('../middleware/authorize');
const { examLimiter } = require('../middleware/rateLimiter');
const { ROLES } = require('../config/constants');

// Get exams
router.get('/course/:courseId', authenticate, examController.getCourseExams);
router.get('/:id', authenticate, examController.getExamById);

// Student routes
router.post(
  '/:examId/start',
  authenticate,
  authorize(ROLES.STUDENT),
  examController.startExam
);

router.post(
  '/result/:resultId/submit',
  authenticate,
  authorize(ROLES.STUDENT),
  examLimiter,
  examController.submitExam
);

router.get(
  '/:examId/my-result',
  authenticate,
  authorize(ROLES.STUDENT),
  examController.getExamResult
);

router.post(
  '/result/:resultId/violation',
  authenticate,
  authorize(ROLES.STUDENT),
  examController.recordViolation
);

// Teacher/Admin routes
router.post(
  '/',
  authenticate,
  authorize(ROLES.TEACHER, ROLES.ADMIN),
  examController.createExam
);

router.put(
  '/:id',
  authenticate,
  authorize(ROLES.TEACHER, ROLES.ADMIN),
  examController.updateExam
);

router.get(
  '/:examId/submissions',
  authenticate,
  authorize(ROLES.TEACHER, ROLES.ADMIN),
  examController.getExamSubmissions
);

router.post(
  '/result/:resultId/grade',
  authenticate,
  authorize(ROLES.TEACHER, ROLES.ADMIN),
  examController.gradeSubjectiveAnswers
);

module.exports = router;
