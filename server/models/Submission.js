const mongoose = require('mongoose');
const { ASSIGNMENT_STATUS } = require('../config/constants');

const submissionSchema = new mongoose.Schema({
  assignment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assignment',
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  
  // Submission Content
  textContent: {
    type: String,
    default: ''
  },
  files: [{
    title: String,
    url: String,
    fileType: String,
    fileSize: Number,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Submission Details
  submittedAt: {
    type: Date,
    default: Date.now
  },
  isLate: {
    type: Boolean,
    default: false
  },
  attemptNumber: {
    type: Number,
    default: 1
  },
  
  // Grading
  status: {
    type: String,
    enum: Object.values(ASSIGNMENT_STATUS),
    default: ASSIGNMENT_STATUS.SUBMITTED
  },
  marksObtained: {
    type: Number,
    default: null,
    min: 0
  },
  feedback: {
    type: String,
    default: ''
  },
  gradedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  gradedAt: {
    type: Date,
    default: null
  },
  
  // Penalties/Bonuses
  latePenaltyApplied: {
    type: Number,
    default: 0
  },
  bonusPoints: {
    type: Number,
    default: 0
  },
  finalMarks: {
    type: Number,
    default: null
  },
  
  // Review History
  reviewHistory: [{
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reviewedAt: {
      type: Date,
      default: Date.now
    },
    comments: String,
    marksGiven: Number
  }]
}, {
  timestamps: true
});

// Indexes
submissionSchema.index({ assignment: 1, student: 1 });
submissionSchema.index({ student: 1, submittedAt: -1 });
submissionSchema.index({ course: 1 });
submissionSchema.index({ status: 1 });

// Calculate final marks with penalties
submissionSchema.methods.calculateFinalMarks = function() {
  if (this.marksObtained === null) return null;
  
  let final = this.marksObtained;
  
  // Apply late penalty
  if (this.isLate && this.latePenaltyApplied > 0) {
    final -= (this.marksObtained * this.latePenaltyApplied / 100);
  }
  
  // Add bonus
  final += this.bonusPoints;
  
  // Ensure within bounds
  const Assignment = mongoose.model('Assignment');
  Assignment.findById(this.assignment).then(assignment => {
    if (assignment) {
      final = Math.max(0, Math.min(final, assignment.totalMarks));
    }
  });
  
  this.finalMarks = Math.round(final * 100) / 100;
  return this.finalMarks;
};

// Grade submission
submissionSchema.methods.grade = async function(marks, feedback, gradedBy, bonusPoints = 0) {
  this.marksObtained = marks;
  this.feedback = feedback;
  this.gradedBy = gradedBy;
  this.gradedAt = new Date();
  this.bonusPoints = bonusPoints;
  this.status = ASSIGNMENT_STATUS.GRADED;
  
  this.calculateFinalMarks();
  
  // Add to review history
  this.reviewHistory.push({
    reviewedBy: gradedBy,
    reviewedAt: new Date(),
    comments: feedback,
    marksGiven: marks
  });
  
  await this.save();
  
  // Update assignment statistics
  const Assignment = mongoose.model('Assignment');
  const assignment = await Assignment.findById(this.assignment);
  if (assignment) {
    await assignment.updateStatistics();
  }
};

module.exports = mongoose.model('Submission', submissionSchema);
