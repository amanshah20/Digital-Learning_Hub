const Exam = require('../models/Exam');
const Result = require('../models/Result');
const Course = require('../models/Course');
const Notification = require('../models/Notification');
const { asyncHandler } = require('../middleware/errorHandler');
const { EXAM_STATUS, NOTIFICATION_TYPES } = require('../config/constants');

// Create exam (Teacher)
exports.createExam = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    courseId,
    examType,
    duration,
    totalMarks,
    passingMarks,
    questions,
    scheduledAt,
    startTime,
    endTime,
    shuffleQuestions,
    shuffleOptions,
    showResultsImmediately,
    allowRetake,
    maxAttempts,
    requireCamera,
    requireFullScreen,
    preventTabSwitch
  } = req.body;
  
  const exam = await Exam.create({
    title,
    description,
    course: courseId,
    teacher: req.userId,
    examType,
    duration,
    totalMarks,
    passingMarks,
    questions,
    scheduledAt,
    startTime,
    endTime,
    shuffleQuestions,
    shuffleOptions,
    showResultsImmediately,
    allowRetake,
    maxAttempts,
    requireCamera,
    requireFullScreen,
    preventTabSwitch,
    isPublished: true
  });
  
  // Notify enrolled students
  const course = await Course.findById(courseId);
  if (course) {
    const notifications = course.enrolledStudents.map(enrollment => ({
      recipient: enrollment.student,
      type: NOTIFICATION_TYPES.ASSIGNMENT,
      title: 'New Exam Scheduled',
      message: `Exam "${title}" has been scheduled for ${course.title}`,
      relatedEntity: {
        entityType: 'exam',
        entityId: exam._id
      },
      actionUrl: `/exams/${exam._id}`,
      priority: 'urgent'
    }));
    
    await Promise.all(notifications.map(n => Notification.createNotification(n)));
  }
  
  res.status(201).json({
    success: true,
    message: 'Exam created successfully',
    data: { exam }
  });
});

// Get exam by ID
exports.getExamById = asyncHandler(async (req, res) => {
  const exam = await Exam.findById(req.params.id)
    .populate('course', 'title courseCode')
    .populate('teacher', 'firstName lastName email');
  
  if (!exam) {
    return res.status(404).json({
      success: false,
      message: 'Exam not found'
    });
  }
  
  // For students, hide correct answers until exam is completed
  if (req.userRole === 'student' && exam.status !== EXAM_STATUS.COMPLETED) {
    exam.questions = exam.questions.map(q => {
      const question = q.toObject();
      if (question.options) {
        question.options = question.options.map(opt => ({ text: opt.text }));
      }
      delete question.correctAnswer;
      return question;
    });
  }
  
  res.json({
    success: true,
    data: { exam }
  });
});

// Start exam (Student)
exports.startExam = asyncHandler(async (req, res) => {
  const { examId } = req.params;
  const studentId = req.userId;
  
  const exam = await Exam.findById(examId);
  
  if (!exam) {
    return res.status(404).json({
      success: false,
      message: 'Exam not found'
    });
  }
  
  // Check if exam is active
  if (!exam.isActive()) {
    return res.status(400).json({
      success: false,
      message: 'Exam is not currently active'
    });
  }
  
  // Check existing attempts
  const existingAttempts = await Result.countDocuments({
    exam: examId,
    student: studentId
  });
  
  if (existingAttempts >= exam.maxAttempts) {
    return res.status(400).json({
      success: false,
      message: `Maximum ${exam.maxAttempts} attempts allowed`
    });
  }
  
  // Create result entry
  const result = await Result.create({
    exam: examId,
    student: studentId,
    course: exam.course,
    attemptNumber: existingAttempts + 1,
    totalMarks: exam.totalMarks,
    ipAddress: req.ip,
    userAgent: req.get('user-agent')
  });
  
  res.json({
    success: true,
    message: 'Exam started successfully',
    data: {
      resultId: result._id,
      duration: exam.duration,
      startTime: result.startedAt
    }
  });
});

// Submit exam (Student)
exports.submitExam = asyncHandler(async (req, res) => {
  const { resultId } = req.params;
  const { answers } = req.body;
  
  const result = await Result.findById(resultId).populate('exam');
  
  if (!result) {
    return res.status(404).json({
      success: false,
      message: 'Exam result not found'
    });
  }
  
  if (result.isSubmitted) {
    return res.status(400).json({
      success: false,
      message: 'Exam already submitted'
    });
  }
  
  // Update answers
  result.answers = answers;
  
  // Submit exam
  await result.submit();
  
  // Notify student if results are immediate
  if (result.exam.showResultsImmediately && result.isGraded) {
    await Notification.createNotification({
      recipient: result.student,
      type: NOTIFICATION_TYPES.GRADE,
      title: 'Exam Results Available',
      message: `Your results for "${result.exam.title}" are now available`,
      relatedEntity: {
        entityType: 'result',
        entityId: result._id
      },
      actionUrl: `/exams/${result.exam._id}/result`,
      priority: 'high'
    });
  }
  
  res.json({
    success: true,
    message: 'Exam submitted successfully',
    data: {
      result: result.isGraded ? {
        marksObtained: result.marksObtained,
        totalMarks: result.totalMarks,
        percentage: result.percentage,
        passed: result.passed
      } : null
    }
  });
});

// Get exam results (Student)
exports.getExamResult = asyncHandler(async (req, res) => {
  const { examId } = req.params;
  const studentId = req.userId;
  
  const results = await Result.find({
    exam: examId,
    student: studentId,
    isSubmitted: true
  }).populate('exam', 'title totalMarks passingMarks showResultsImmediately')
    .sort({ attemptNumber: -1 });
  
  res.json({
    success: true,
    data: { results }
  });
});

// Get all exam submissions (Teacher)
exports.getExamSubmissions = asyncHandler(async (req, res) => {
  const { examId } = req.params;
  
  const results = await Result.find({
    exam: examId,
    isSubmitted: true
  }).populate('student', 'firstName lastName email studentId profilePicture')
    .sort({ submittedAt: -1 });
  
  res.json({
    success: true,
    data: { results }
  });
});

// Grade subjective answers (Teacher)
exports.gradeSubjectiveAnswers = asyncHandler(async (req, res) => {
  const { resultId } = req.params;
  const { gradedAnswers } = req.body; // Array of { questionId, marksObtained }
  
  const result = await Result.findById(resultId);
  
  if (!result) {
    return res.status(404).json({
      success: false,
      message: 'Result not found'
    });
  }
  
  // Update marks for subjective answers
  gradedAnswers.forEach(graded => {
    const answer = result.answers.find(a => 
      a.questionId.toString() === graded.questionId.toString()
    );
    if (answer) {
      answer.marksObtained = graded.marksObtained;
    }
  });
  
  // Recalculate total score
  await result.calculateScore();
  
  result.isGraded = true;
  result.gradedBy = req.userId;
  result.gradedAt = new Date();
  await result.save();
  
  // Notify student
  await Notification.createNotification({
    recipient: result.student,
    type: NOTIFICATION_TYPES.GRADE,
    title: 'Exam Graded',
    message: `Your exam has been graded. Score: ${result.percentage.toFixed(2)}%`,
    relatedEntity: {
      entityType: 'result',
      entityId: result._id
    },
    actionUrl: `/exams/${result.exam}/result`,
    priority: 'high'
  });
  
  res.json({
    success: true,
    message: 'Exam graded successfully',
    data: { result }
  });
});

// Record exam violation
exports.recordViolation = asyncHandler(async (req, res) => {
  const { resultId } = req.params;
  const { type, details } = req.body;
  
  const result = await Result.findById(resultId);
  
  if (!result) {
    return res.status(404).json({
      success: false,
      message: 'Result not found'
    });
  }
  
  await result.recordViolation(type, details);
  
  res.json({
    success: true,
    message: 'Violation recorded'
  });
});

// Update exam
exports.updateExam = asyncHandler(async (req, res) => {
  const exam = await Exam.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );
  
  if (!exam) {
    return res.status(404).json({
      success: false,
      message: 'Exam not found'
    });
  }
  
  res.json({
    success: true,
    message: 'Exam updated successfully',
    data: { exam }
  });
});

// Get course exams
exports.getCourseExams = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  
  const exams = await Exam.find({ course: courseId, isPublished: true })
    .populate('teacher', 'firstName lastName')
    .sort({ scheduledAt: -1 });
  
  res.json({
    success: true,
    data: { exams }
  });
});

module.exports = exports;
