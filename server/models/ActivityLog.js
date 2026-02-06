const mongoose = require('mongoose');
const { ACTIVITY_TYPES } = require('../config/constants');

const activityLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  activityType: {
    type: String,
    enum: Object.values(ACTIVITY_TYPES),
    required: true
  },
  
  description: {
    type: String,
    required: true
  },
  
  // Related Entity
  relatedEntity: {
    entityType: {
      type: String,
      enum: ['user', 'course', 'assignment', 'exam', 'attendance', 'submission', 'lesson'],
      default: null
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null
    }
  },
  
  // Request Details
  ipAddress: {
    type: String,
    default: null
  },
  userAgent: {
    type: String,
    default: null
  },
  
  // Additional Data
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {}
  },
  
  // Status
  status: {
    type: String,
    enum: ['success', 'failed', 'warning'],
    default: 'success'
  },
  
  // Error Details (if failed)
  errorMessage: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Indexes
activityLogSchema.index({ user: 1, createdAt: -1 });
activityLogSchema.index({ activityType: 1 });
activityLogSchema.index({ 'relatedEntity.entityType': 1, 'relatedEntity.entityId': 1 });
activityLogSchema.index({ status: 1 });
activityLogSchema.index({ createdAt: -1 });

// Static method to log activity
activityLogSchema.statics.logActivity = async function({
  user,
  activityType,
  description,
  relatedEntity = {},
  ipAddress = null,
  userAgent = null,
  metadata = {},
  status = 'success',
  errorMessage = null
}) {
  try {
    const log = new this({
      user,
      activityType,
      description,
      relatedEntity,
      ipAddress,
      userAgent,
      metadata,
      status,
      errorMessage
    });
    
    await log.save();
    return log;
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};

// Static method to get user activity timeline
activityLogSchema.statics.getUserTimeline = async function(userId, options = {}) {
  const {
    limit = 50,
    skip = 0,
    activityTypes = null,
    startDate = null,
    endDate = null
  } = options;
  
  const query = { user: userId };
  
  if (activityTypes && activityTypes.length > 0) {
    query.activityType = { $in: activityTypes };
  }
  
  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }
  
  return await this.find(query)
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip)
    .populate('user', 'firstName lastName email')
    .lean();
};

// Static method to get system-wide activity
activityLogSchema.statics.getSystemActivity = async function(options = {}) {
  const {
    limit = 100,
    skip = 0,
    activityTypes = null,
    status = null,
    startDate = null,
    endDate = null
  } = options;
  
  const query = {};
  
  if (activityTypes && activityTypes.length > 0) {
    query.activityType = { $in: activityTypes };
  }
  
  if (status) {
    query.status = status;
  }
  
  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }
  
  return await this.find(query)
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip)
    .populate('user', 'firstName lastName email role')
    .lean();
};

module.exports = mongoose.model('ActivityLog', activityLogSchema);
