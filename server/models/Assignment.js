const mongoose = require('mongoose');
const { ASSIGNMENT_STATUS } = require('../config/constants');

const assignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Assignment title is required'],
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  module: {
    type: mongoose.Schema.Types.ObjectId,
    default: null
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Assignment Details
  instructions: {
    type: String,
    default: ''
  },
  attachments: [{
    title: String,
    url: String,
    fileType: String,
    fileSize: Number,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Grading
  totalMarks: {
    type: Number,
    required: true,
    min: 1
  },
  passingMarks: {
    type: Number,
    default: function() {
      return Math.ceil(this.totalMarks * 0.4);
    }
  },
  weightage: {
    type: Number, // percentage contribution to final grade
    default: 10
  },
  
  // Dates
  assignedDate: {
    type: Date,
    default: Date.now
  },
  dueDate: {
    type: Date,
    required: true
  },
  lateSubmissionAllowed: {
    type: Boolean,
    default: false
  },
  lateSubmissionDeadline: {
    type: Date,
    default: null
  },
  latePenalty: {
    type: Number, // percentage deduction
    default: 10
  },
  
  // Settings
  isPublished: {
    type: Boolean,
    default: false
  },
  allowResubmission: {
    type: Boolean,
    default: false
  },
  maxResubmissions: {
    type: Number,
    default: 1
  },
  submissionType: {
    type: String,
    enum: ['file', 'text', 'both'],
    default: 'file'
  },
  maxFileSize: {
    type: Number, // in bytes
    default: 10485760 // 10MB
  },
  allowedFileTypes: [{
    type: String
  }],
  
  // Statistics
  totalSubmissions: {
    type: Number,
    default: 0
  },
  gradedSubmissions: {
    type: Number,
    default: 0
  },
  averageScore: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes
assignmentSchema.index({ course: 1, dueDate: 1 });
assignmentSchema.index({ teacher: 1 });
assignmentSchema.index({ assignedDate: -1 });

// Check if assignment is overdue
assignmentSchema.virtual('isOverdue').get(function() {
  return new Date() > this.dueDate;
});

// Update statistics
assignmentSchema.methods.updateStatistics = async function() {
  const Submission = mongoose.model('Submission');
  
  const submissions = await Submission.find({ assignment: this._id });
  
  this.totalSubmissions = submissions.length;
  this.gradedSubmissions = submissions.filter(s => s.status === ASSIGNMENT_STATUS.GRADED).length;
  
  const gradedScores = submissions
    .filter(s => s.status === ASSIGNMENT_STATUS.GRADED && s.marksObtained !== null)
    .map(s => s.marksObtained);
  
  if (gradedScores.length > 0) {
    this.averageScore = gradedScores.reduce((a, b) => a + b, 0) / gradedScores.length;
  }
  
  await this.save();
};

module.exports = mongoose.model('Assignment', assignmentSchema);
