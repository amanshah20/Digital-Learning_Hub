const mongoose = require('mongoose');
const { COURSE_STATUS } = require('../config/constants');

const moduleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  order: {
    type: Number,
    required: true
  },
  lessons: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson'
  }],
  duration: {
    type: Number, // in minutes
    default: 0
  }
}, { timestamps: true });

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Course title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Course description is required']
  },
  courseCode: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  thumbnail: {
    type: String,
    default: null
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: Object.values(COURSE_STATUS),
    default: COURSE_STATUS.DRAFT
  },
  
  // Course Structure
  modules: [moduleSchema],
  
  // Enrollment
  enrolledStudents: [{
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    enrolledAt: {
      type: Date,
      default: Date.now
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    completedLessons: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lesson'
    }]
  }],
  
  maxStudents: {
    type: Number,
    default: null // null = unlimited
  },
  
  // Course Details
  duration: {
    type: Number, // total duration in hours
    required: true
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner'
  },
  language: {
    type: String,
    default: 'English'
  },
  prerequisites: [{
    type: String
  }],
  learningOutcomes: [{
    type: String
  }],
  
  // Schedule
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  schedule: [{
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    },
    startTime: String,
    endTime: String,
    room: String
  }],
  
  // Analytics
  totalEnrollments: {
    type: Number,
    default: 0
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalRatings: {
    type: Number,
    default: 0
  },
  
  // Settings
  isPublished: {
    type: Boolean,
    default: false
  },
  allowEnrollment: {
    type: Boolean,
    default: true
  },
  certificateEnabled: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
courseSchema.index({ courseCode: 1 });
courseSchema.index({ instructor: 1 });
courseSchema.index({ status: 1 });
courseSchema.index({ category: 1 });
courseSchema.index({ 'enrolledStudents.student': 1 });

// Virtual for enrolled count
courseSchema.virtual('enrolledCount').get(function() {
  return this.enrolledStudents.length;
});

// Check if course is full
courseSchema.methods.isFull = function() {
  if (!this.maxStudents) return false;
  return this.enrolledStudents.length >= this.maxStudents;
};

// Enroll student
courseSchema.methods.enrollStudent = async function(studentId) {
  if (this.isFull()) {
    throw new Error('Course is full');
  }
  
  const alreadyEnrolled = this.enrolledStudents.some(
    enrollment => enrollment.student.toString() === studentId.toString()
  );
  
  if (alreadyEnrolled) {
    throw new Error('Student already enrolled');
  }
  
  this.enrolledStudents.push({
    student: studentId,
    enrolledAt: new Date(),
    progress: 0,
    completedLessons: []
  });
  
  this.totalEnrollments += 1;
  await this.save();
};

// Update student progress
courseSchema.methods.updateStudentProgress = async function(studentId, lessonId) {
  const enrollment = this.enrolledStudents.find(
    e => e.student.toString() === studentId.toString()
  );
  
  if (!enrollment) {
    throw new Error('Student not enrolled in this course');
  }
  
  if (!enrollment.completedLessons.includes(lessonId)) {
    enrollment.completedLessons.push(lessonId);
    
    // Calculate progress
    const totalLessons = this.modules.reduce((sum, module) => sum + module.lessons.length, 0);
    enrollment.progress = totalLessons > 0 
      ? Math.round((enrollment.completedLessons.length / totalLessons) * 100)
      : 0;
    
    await this.save();
  }
};

module.exports = mongoose.model('Course', courseSchema);
