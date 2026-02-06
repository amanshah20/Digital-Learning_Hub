const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  selectedOption: {
    type: String,
    default: null
  },
  textAnswer: {
    type: String,
    default: ''
  },
  isCorrect: {
    type: Boolean,
    default: null
  },
  marksObtained: {
    type: Number,
    default: 0
  },
  timeSpent: {
    type: Number, // in seconds
    default: 0
  }
});

const resultSchema = new mongoose.Schema({
  exam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam',
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
  
  // Attempt Details
  attemptNumber: {
    type: Number,
    default: 1
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  submittedAt: {
    type: Date,
    default: null
  },
  timeSpent: {
    type: Number, // in seconds
    default: 0
  },
  
  // Answers
  answers: [answerSchema],
  
  // Scoring
  totalMarks: {
    type: Number,
    default: 0
  },
  marksObtained: {
    type: Number,
    default: 0
  },
  percentage: {
    type: Number,
    default: 0
  },
  passed: {
    type: Boolean,
    default: false
  },
  
  // Status
  isSubmitted: {
    type: Boolean,
    default: false
  },
  isGraded: {
    type: Boolean,
    default: false
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
  
  // Security & Tracking
  ipAddress: {
    type: String,
    default: null
  },
  userAgent: {
    type: String,
    default: null
  },
  tabSwitches: {
    type: Number,
    default: 0
  },
  violations: [{
    type: {
      type: String,
      enum: ['tab-switch', 'copy-paste', 'fullscreen-exit', 'timeout']
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    details: String
  }],
  
  // Feedback
  feedback: {
    type: String,
    default: ''
  },
  
  // Rankings
  rank: {
    type: Number,
    default: null
  }
}, {
  timestamps: true
});

// Indexes
resultSchema.index({ exam: 1, student: 1, attemptNumber: 1 }, { unique: true });
resultSchema.index({ student: 1, submittedAt: -1 });
resultSchema.index({ course: 1 });
resultSchema.index({ isSubmitted: 1, isGraded: 1 });

// Calculate score
resultSchema.methods.calculateScore = async function() {
  const Exam = mongoose.model('Exam');
  const exam = await Exam.findById(this.exam);
  
  if (!exam) throw new Error('Exam not found');
  
  this.totalMarks = exam.totalMarks;
  let obtainedMarks = 0;
  
  // Calculate marks for each answer
  this.answers.forEach(answer => {
    const question = exam.questions.id(answer.questionId);
    if (!question) return;
    
    if (question.questionType === 'multiple-choice' || question.questionType === 'true-false') {
      // Auto-grade objective questions
      const correctOption = question.options.find(opt => opt.isCorrect);
      if (correctOption && answer.selectedOption === correctOption.text) {
        answer.isCorrect = true;
        answer.marksObtained = question.marks;
        obtainedMarks += question.marks;
      } else {
        answer.isCorrect = false;
        answer.marksObtained = 0;
      }
    } else {
      // Subjective questions need manual grading
      if (answer.marksObtained) {
        obtainedMarks += answer.marksObtained;
      }
    }
  });
  
  this.marksObtained = obtainedMarks;
  this.percentage = (obtainedMarks / this.totalMarks) * 100;
  this.passed = this.marksObtained >= exam.passingMarks;
  
  await this.save();
};

// Submit exam
resultSchema.methods.submit = async function() {
  this.submittedAt = new Date();
  this.isSubmitted = true;
  this.timeSpent = Math.floor((this.submittedAt - this.startedAt) / 1000);
  
  await this.calculateScore();
  
  // Check if all questions are auto-gradable
  const Exam = mongoose.model('Exam');
  const exam = await Exam.findById(this.exam);
  
  const needsManualGrading = exam.questions.some(q => 
    q.questionType === 'short-answer' || q.questionType === 'essay'
  );
  
  if (!needsManualGrading) {
    this.isGraded = true;
    this.gradedAt = new Date();
  }
  
  await this.save();
  
  // Update exam statistics
  await exam.updateStatistics();
};

// Record violation
resultSchema.methods.recordViolation = async function(type, details = '') {
  this.violations.push({
    type,
    timestamp: new Date(),
    details
  });
  
  if (type === 'tab-switch') {
    this.tabSwitches += 1;
  }
  
  await this.save();
};

module.exports = mongoose.model('Result', resultSchema);
