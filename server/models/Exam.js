const mongoose = require('mongoose');
const { EXAM_STATUS } = require('../config/constants');

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true
  },
  questionType: {
    type: String,
    enum: ['multiple-choice', 'true-false', 'short-answer', 'essay'],
    required: true
  },
  options: [{
    text: String,
    isCorrect: Boolean
  }],
  correctAnswer: {
    type: String,
    default: null
  },
  marks: {
    type: Number,
    required: true,
    min: 1
  },
  order: {
    type: Number,
    required: true
  }
});

const examSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Exam title is required'],
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
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Exam Configuration
  examType: {
    type: String,
    enum: ['quiz', 'midterm', 'final', 'assignment'],
    default: 'quiz'
  },
  duration: {
    type: Number, // in minutes
    required: true
  },
  totalMarks: {
    type: Number,
    required: true
  },
  passingMarks: {
    type: Number,
    required: true
  },
  
  // Questions
  questions: [questionSchema],
  
  // Schedule
  scheduledAt: {
    type: Date,
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  
  // Settings
  status: {
    type: String,
    enum: Object.values(EXAM_STATUS),
    default: EXAM_STATUS.SCHEDULED
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  shuffleQuestions: {
    type: Boolean,
    default: false
  },
  shuffleOptions: {
    type: Boolean,
    default: false
  },
  showResultsImmediately: {
    type: Boolean,
    default: false
  },
  allowReview: {
    type: Boolean,
    default: true
  },
  allowRetake: {
    type: Boolean,
    default: false
  },
  maxAttempts: {
    type: Number,
    default: 1
  },
  
  // Proctoring
  requireCamera: {
    type: Boolean,
    default: false
  },
  requireFullScreen: {
    type: Boolean,
    default: false
  },
  preventTabSwitch: {
    type: Boolean,
    default: false
  },
  
  // Statistics
  totalAttempts: {
    type: Number,
    default: 0
  },
  averageScore: {
    type: Number,
    default: 0
  },
  highestScore: {
    type: Number,
    default: 0
  },
  lowestScore: {
    type: Number,
    default: null
  }
}, {
  timestamps: true
});

// Indexes
examSchema.index({ course: 1, scheduledAt: 1 });
examSchema.index({ teacher: 1 });
examSchema.index({ status: 1 });
examSchema.index({ startTime: 1, endTime: 1 });

// Check if exam is active
examSchema.methods.isActive = function() {
  const now = new Date();
  return now >= this.startTime && now <= this.endTime && this.status === EXAM_STATUS.ONGOING;
};

// Start exam
examSchema.methods.start = async function() {
  this.status = EXAM_STATUS.ONGOING;
  await this.save();
};

// End exam
examSchema.methods.end = async function() {
  this.status = EXAM_STATUS.COMPLETED;
  await this.save();
};

// Update statistics
examSchema.methods.updateStatistics = async function() {
  const Result = mongoose.model('Result');
  
  const results = await Result.find({ exam: this._id, isSubmitted: true });
  
  if (results.length === 0) return;
  
  this.totalAttempts = results.length;
  
  const scores = results.map(r => r.totalMarks);
  this.averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;
  this.highestScore = Math.max(...scores);
  this.lowestScore = Math.min(...scores);
  
  await this.save();
};

module.exports = mongoose.model('Exam', examSchema);
