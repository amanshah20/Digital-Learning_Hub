const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Lesson title is required'],
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
    required: true
  },
  order: {
    type: Number,
    required: true
  },
  
  // Content
  contentType: {
    type: String,
    enum: ['video', 'document', 'presentation', 'quiz', 'assignment', 'live'],
    required: true
  },
  videoUrl: {
    type: String,
    default: null
  },
  videoDuration: {
    type: Number, // in seconds
    default: 0
  },
  documents: [{
    title: String,
    url: String,
    fileType: String,
    fileSize: Number,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Live Session
  liveSession: {
    scheduledAt: Date,
    duration: Number, // in minutes
    meetingUrl: String,
    meetingId: String,
    password: String,
    isRecorded: {
      type: Boolean,
      default: false
    },
    recordingUrl: String
  },
  
  // Content Details
  content: {
    type: String, // HTML or Markdown content
    default: ''
  },
  duration: {
    type: Number, // estimated duration in minutes
    default: 0
  },
  
  // Tracking
  views: {
    type: Number,
    default: 0
  },
  completions: [{
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    completedAt: {
      type: Date,
      default: Date.now
    },
    timeSpent: {
      type: Number, // in seconds
      default: 0
    }
  }],
  
  // Settings
  isPublished: {
    type: Boolean,
    default: false
  },
  isFree: {
    type: Boolean,
    default: false
  },
  isDownloadable: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
lessonSchema.index({ course: 1, order: 1 });
lessonSchema.index({ module: 1 });
lessonSchema.index({ 'completions.student': 1 });

// Mark lesson as completed
lessonSchema.methods.markCompleted = async function(studentId, timeSpent = 0) {
  const alreadyCompleted = this.completions.some(
    c => c.student.toString() === studentId.toString()
  );
  
  if (!alreadyCompleted) {
    this.completions.push({
      student: studentId,
      completedAt: new Date(),
      timeSpent
    });
    await this.save();
  }
};

// Get completion status for student
lessonSchema.methods.isCompletedBy = function(studentId) {
  return this.completions.some(
    c => c.student.toString() === studentId.toString()
  );
};

module.exports = mongoose.model('Lesson', lessonSchema);
