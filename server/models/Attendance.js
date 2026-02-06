const mongoose = require('mongoose');
const { ATTENDANCE_STATUS } = require('../config/constants');

const attendanceRecordSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: Object.values(ATTENDANCE_STATUS),
    required: true
  },
  markedAt: {
    type: Date,
    default: Date.now
  },
  deviceInfo: {
    ip: String,
    userAgent: String,
    deviceType: String,
    location: {
      latitude: Number,
      longitude: Number
    }
  },
  markedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  remarks: {
    type: String,
    default: ''
  },
  isModified: {
    type: Boolean,
    default: false
  },
  modificationHistory: [{
    previousStatus: String,
    newStatus: String,
    modifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    modifiedAt: {
      type: Date,
      default: Date.now
    },
    reason: String
  }]
});

const attendanceSessionSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  lesson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
    default: null
  },
  sessionDate: {
    type: Date,
    required: true
  },
  sessionType: {
    type: String,
    enum: ['lecture', 'lab', 'tutorial', 'exam', 'other'],
    default: 'lecture'
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Attendance Configuration
  attendanceWindow: {
    openTime: {
      type: Date,
      required: true
    },
    closeTime: {
      type: Date,
      required: true
    }
  },
  
  lateThreshold: {
    type: Number, // minutes after start time
    default: 15
  },
  
  // Security & Validation
  locationRequired: {
    type: Boolean,
    default: false
  },
  allowedLocation: {
    latitude: Number,
    longitude: Number,
    radius: Number // in meters
  },
  ipWhitelist: [{
    type: String
  }],
  requireUniqueDevice: {
    type: Boolean,
    default: true
  },
  
  // Attendance Records
  records: [attendanceRecordSchema],
  
  // Statistics
  totalStudents: {
    type: Number,
    default: 0
  },
  presentCount: {
    type: Number,
    default: 0
  },
  absentCount: {
    type: Number,
    default: 0
  },
  lateCount: {
    type: Number,
    default: 0
  },
  excusedCount: {
    type: Number,
    default: 0
  },
  attendancePercentage: {
    type: Number,
    default: 0
  },
  
  // Status
  isActive: {
    type: Boolean,
    default: true
  },
  isClosed: {
    type: Boolean,
    default: false
  },
  closedAt: {
    type: Date,
    default: null
  },
  
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Indexes
attendanceSessionSchema.index({ course: 1, sessionDate: 1 });
attendanceSessionSchema.index({ teacher: 1 });
attendanceSessionSchema.index({ 'records.student': 1 });
attendanceSessionSchema.index({ sessionDate: -1 });

// Mark attendance for a student
attendanceSessionSchema.methods.markAttendance = async function(studentId, status, markedBy, deviceInfo = {}, remarks = '') {
  // Check if attendance window is open
  const now = new Date();
  if (now < this.attendanceWindow.openTime || now > this.attendanceWindow.closeTime) {
    throw new Error('Attendance window is closed');
  }
  
  // Check if already marked
  const existingRecord = this.records.find(
    r => r.student.toString() === studentId.toString()
  );
  
  if (existingRecord) {
    // Store modification history
    existingRecord.modificationHistory.push({
      previousStatus: existingRecord.status,
      newStatus: status,
      modifiedBy,
      modifiedAt: new Date(),
      reason: remarks || 'Manual modification'
    });
    
    existingRecord.status = status;
    existingRecord.isModified = true;
    existingRecord.remarks = remarks;
  } else {
    // Create new record
    this.records.push({
      student: studentId,
      status,
      markedAt: new Date(),
      deviceInfo,
      markedBy,
      remarks
    });
  }
  
  // Update statistics
  this.updateStatistics();
  await this.save();
};

// Update statistics
attendanceSessionSchema.methods.updateStatistics = function() {
  this.presentCount = this.records.filter(r => r.status === ATTENDANCE_STATUS.PRESENT).length;
  this.absentCount = this.records.filter(r => r.status === ATTENDANCE_STATUS.ABSENT).length;
  this.lateCount = this.records.filter(r => r.status === ATTENDANCE_STATUS.LATE).length;
  this.excusedCount = this.records.filter(r => r.status === ATTENDANCE_STATUS.EXCUSED).length;
  
  if (this.totalStudents > 0) {
    this.attendancePercentage = Math.round(
      ((this.presentCount + this.lateCount) / this.totalStudents) * 100
    );
  }
};

// Close attendance session
attendanceSessionSchema.methods.closeSession = async function() {
  this.isClosed = true;
  this.isActive = false;
  this.closedAt = new Date();
  this.updateStatistics();
  await this.save();
};

// Check if student can mark attendance
attendanceSessionSchema.methods.canMarkAttendance = function(deviceInfo = {}) {
  const now = new Date();
  
  // Check time window
  if (now < this.attendanceWindow.openTime || now > this.attendanceWindow.closeTime) {
    return { allowed: false, reason: 'Attendance window is closed' };
  }
  
  // Check if session is closed
  if (this.isClosed) {
    return { allowed: false, reason: 'Session is closed' };
  }
  
  // Check IP whitelist
  if (this.ipWhitelist.length > 0 && deviceInfo.ip) {
    if (!this.ipWhitelist.includes(deviceInfo.ip)) {
      return { allowed: false, reason: 'IP address not allowed' };
    }
  }
  
  return { allowed: true };
};

// Detect anomalies
attendanceSessionSchema.methods.detectAnomalies = function() {
  const anomalies = [];
  const deviceMap = new Map();
  
  this.records.forEach(record => {
    if (record.deviceInfo && record.deviceInfo.ip) {
      const key = record.deviceInfo.ip;
      if (!deviceMap.has(key)) {
        deviceMap.set(key, []);
      }
      deviceMap.get(key).push(record.student.toString());
    }
  });
  
  // Check for multiple students from same device
  deviceMap.forEach((students, device) => {
    if (students.length > 1) {
      anomalies.push({
        type: 'SAME_DEVICE',
        device,
        students,
        message: `${students.length} students marked attendance from same device`
      });
    }
  });
  
  return anomalies;
};

module.exports = mongoose.model('AttendanceSession', attendanceSessionSchema);
