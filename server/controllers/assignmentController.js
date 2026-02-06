const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const Course = require('../models/Course');
const Notification = require('../models/Notification');
const ActivityLog = require('../models/ActivityLog');
const { asyncHandler } = require('../middleware/errorHandler');
const { ASSIGNMENT_STATUS, NOTIFICATION_TYPES, ACTIVITY_TYPES } = require('../config/constants');

// Create assignment (Teacher)
exports.createAssignment = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    courseId,
    moduleId,
    instructions,
    totalMarks,
    passingMarks,
    weightage,
    dueDate,
    lateSubmissionAllowed,
    lateSubmissionDeadline,
    latePenalty,
    allowResubmission,
    maxResubmissions,
    submissionType,
    allowedFileTypes
  } = req.body;
  
  const assignment = await Assignment.create({
    title,
    description,
    course: courseId,
    module: moduleId,
    teacher: req.userId,
    instructions,
    totalMarks,
    passingMarks,
    weightage,
    dueDate,
    lateSubmissionAllowed,
    lateSubmissionDeadline,
    latePenalty,
    allowResubmission,
    maxResubmissions,
    submissionType,
    allowedFileTypes,
    isPublished: true
  });
  
  // Notify enrolled students
  const course = await Course.findById(courseId);
  if (course) {
    const notifications = course.enrolledStudents.map(enrollment => ({
      recipient: enrollment.student,
      type: NOTIFICATION_TYPES.ASSIGNMENT,
      title: 'New Assignment Posted',
      message: `New assignment "${title}" has been posted in ${course.title}`,
      relatedEntity: {
        entityType: 'assignment',
        entityId: assignment._id
      },
      actionUrl: `/assignments/${assignment._id}`,
      priority: 'high'
    }));
    
    await Promise.all(notifications.map(n => Notification.createNotification(n)));
  }
  
  // Log activity
  await ActivityLog.logActivity({
    user: req.userId,
    activityType: 'assignment_create',
    description: `Created assignment: ${title}`,
    relatedEntity: {
      entityType: 'assignment',
      entityId: assignment._id
    },
    ipAddress: req.ip,
    userAgent: req.get('user-agent')
  });
  
  res.status(201).json({
    success: true,
    message: 'Assignment created successfully',
    data: { assignment }
  });
});

// Get all assignments for a course
exports.getCourseAssignments = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  
  const assignments = await Assignment.find({ course: courseId, isPublished: true })
    .populate('teacher', 'firstName lastName email')
    .sort({ dueDate: 1 });
  
  res.json({
    success: true,
    data: { assignments }
  });
});

// Get assignment by ID
exports.getAssignmentById = asyncHandler(async (req, res) => {
  const assignment = await Assignment.findById(req.params.id)
    .populate('course', 'title courseCode')
    .populate('teacher', 'firstName lastName email');
  
  if (!assignment) {
    return res.status(404).json({
      success: false,
      message: 'Assignment not found'
    });
  }
  
  res.json({
    success: true,
    data: { assignment }
  });
});

// Submit assignment (Student)
exports.submitAssignment = asyncHandler(async (req, res) => {
  const { assignmentId } = req.params;
  const { textContent } = req.body;
  const studentId = req.userId;
  
  const assignment = await Assignment.findById(assignmentId);
  
  if (!assignment) {
    return res.status(404).json({
      success: false,
      message: 'Assignment not found'
    });
  }
  
  // Check if past due date
  const now = new Date();
  const isLate = now > assignment.dueDate;
  
  if (isLate && !assignment.lateSubmissionAllowed) {
    return res.status(400).json({
      success: false,
      message: 'Late submissions are not allowed for this assignment'
    });
  }
  
  if (isLate && assignment.lateSubmissionDeadline && now > assignment.lateSubmissionDeadline) {
    return res.status(400).json({
      success: false,
      message: 'Late submission deadline has passed'
    });
  }
  
  // Check existing submissions
  const existingSubmissions = await Submission.countDocuments({
    assignment: assignmentId,
    student: studentId
  });
  
  if (existingSubmissions > 0 && !assignment.allowResubmission) {
    return res.status(400).json({
      success: false,
      message: 'Resubmission is not allowed for this assignment'
    });
  }
  
  if (existingSubmissions >= assignment.maxResubmissions) {
    return res.status(400).json({
      success: false,
      message: `Maximum ${assignment.maxResubmissions} submissions allowed`
    });
  }
  
  // Handle file uploads (files should be in req.files from upload middleware)
  const files = req.files ? req.files.map(file => ({
    title: file.originalname,
    url: file.path,
    fileType: file.mimetype,
    fileSize: file.size
  })) : [];
  
  const submission = await Submission.create({
    assignment: assignmentId,
    student: studentId,
    course: assignment.course,
    textContent,
    files,
    isLate,
    latePenaltyApplied: isLate ? assignment.latePenalty : 0,
    attemptNumber: existingSubmissions + 1
  });
  
  // Update assignment statistics
  await assignment.updateStatistics();
  
  // Notify teacher
  await Notification.createNotification({
    recipient: assignment.teacher,
    type: NOTIFICATION_TYPES.ASSIGNMENT,
    title: 'New Assignment Submission',
    message: `A student has submitted the assignment "${assignment.title}"`,
    relatedEntity: {
      entityType: 'submission',
      entityId: submission._id
    },
    actionUrl: `/assignments/${assignmentId}/submissions`
  });
  
  // Log activity
  await ActivityLog.logActivity({
    user: studentId,
    activityType: ACTIVITY_TYPES.ASSIGNMENT_SUBMIT,
    description: `Submitted assignment: ${assignment.title}`,
    relatedEntity: {
      entityType: 'submission',
      entityId: submission._id
    },
    ipAddress: req.ip,
    userAgent: req.get('user-agent')
  });
  
  res.status(201).json({
    success: true,
    message: 'Assignment submitted successfully',
    data: { submission }
  });
});

// Get assignment submissions (Teacher)
exports.getAssignmentSubmissions = asyncHandler(async (req, res) => {
  const { assignmentId } = req.params;
  const { status } = req.query;
  
  const query = { assignment: assignmentId };
  if (status) query.status = status;
  
  const submissions = await Submission.find(query)
    .populate('student', 'firstName lastName email studentId profilePicture')
    .sort({ submittedAt: -1 });
  
  res.json({
    success: true,
    data: { submissions }
  });
});

// Get student's submission
exports.getStudentSubmission = asyncHandler(async (req, res) => {
  const { assignmentId } = req.params;
  const studentId = req.userId;
  
  const submissions = await Submission.find({
    assignment: assignmentId,
    student: studentId
  }).sort({ attemptNumber: -1 });
  
  res.json({
    success: true,
    data: { submissions }
  });
});

// Grade submission (Teacher)
exports.gradeSubmission = asyncHandler(async (req, res) => {
  const { submissionId } = req.params;
  const { marks, feedback, bonusPoints = 0 } = req.body;
  
  const submission = await Submission.findById(submissionId)
    .populate('assignment', 'title totalMarks')
    .populate('student', 'firstName lastName email');
  
  if (!submission) {
    return res.status(404).json({
      success: false,
      message: 'Submission not found'
    });
  }
  
  // Validate marks
  if (marks < 0 || marks > submission.assignment.totalMarks) {
    return res.status(400).json({
      success: false,
      message: `Marks must be between 0 and ${submission.assignment.totalMarks}`
    });
  }
  
  await submission.grade(marks, feedback, req.userId, bonusPoints);
  
  // Notify student
  await Notification.createNotification({
    recipient: submission.student._id,
    type: NOTIFICATION_TYPES.GRADE,
    title: 'Assignment Graded',
    message: `Your submission for "${submission.assignment.title}" has been graded`,
    relatedEntity: {
      entityType: 'submission',
      entityId: submission._id
    },
    actionUrl: `/assignments/${submission.assignment._id}/my-submission`,
    priority: 'high'
  });
  
  // Log activity
  await ActivityLog.logActivity({
    user: req.userId,
    activityType: ACTIVITY_TYPES.GRADE_ASSIGN,
    description: `Graded submission for ${submission.assignment.title}`,
    relatedEntity: {
      entityType: 'submission',
      entityId: submission._id
    },
    metadata: new Map([
      ['marks', marks.toString()],
      ['studentId', submission.student._id.toString()]
    ]),
    ipAddress: req.ip,
    userAgent: req.get('user-agent')
  });
  
  res.json({
    success: true,
    message: 'Submission graded successfully',
    data: { submission }
  });
});

// Update assignment
exports.updateAssignment = asyncHandler(async (req, res) => {
  const assignment = await Assignment.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );
  
  if (!assignment) {
    return res.status(404).json({
      success: false,
      message: 'Assignment not found'
    });
  }
  
  res.json({
    success: true,
    message: 'Assignment updated successfully',
    data: { assignment }
  });
});

// Delete assignment
exports.deleteAssignment = asyncHandler(async (req, res) => {
  const assignment = await Assignment.findByIdAndDelete(req.params.id);
  
  if (!assignment) {
    return res.status(404).json({
      success: false,
      message: 'Assignment not found'
    });
  }
  
  // Also delete all submissions
  await Submission.deleteMany({ assignment: assignment._id });
  
  res.json({
    success: true,
    message: 'Assignment deleted successfully'
  });
});

module.exports = exports;
