const mongoose = require('mongoose');
const { NOTIFICATION_TYPES } = require('../config/constants');

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  
  type: {
    type: String,
    enum: Object.values(NOTIFICATION_TYPES),
    required: true
  },
  
  title: {
    type: String,
    required: true,
    trim: true
  },
  
  message: {
    type: String,
    required: true
  },
  
  // Related Entity
  relatedEntity: {
    entityType: {
      type: String,
      enum: ['course', 'assignment', 'exam', 'attendance', 'submission', 'user'],
      default: null
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null
    }
  },
  
  // Action Link
  actionUrl: {
    type: String,
    default: null
  },
  
  // Status
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date,
    default: null
  },
  
  // Priority
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  
  // Metadata
  metadata: {
    type: Map,
    of: String,
    default: {}
  }
}, {
  timestamps: true
});

// Indexes
notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ isRead: 1, recipient: 1 });
notificationSchema.index({ type: 1 });
notificationSchema.index({ 'relatedEntity.entityType': 1, 'relatedEntity.entityId': 1 });

// Mark as read
notificationSchema.methods.markAsRead = async function() {
  if (!this.isRead) {
    this.isRead = true;
    this.readAt = new Date();
    await this.save();
  }
};

// Static method to create notification
notificationSchema.statics.createNotification = async function(data) {
  const notification = new this(data);
  await notification.save();
  
  // Emit real-time notification via Socket.IO
  const io = require('../server').io;
  if (io) {
    io.to(data.recipient.toString()).emit('notification', notification);
  }
  
  return notification;
};

// Static method to mark all as read for a user
notificationSchema.statics.markAllAsRead = async function(userId) {
  return await this.updateMany(
    { recipient: userId, isRead: false },
    { isRead: true, readAt: new Date() }
  );
};

module.exports = mongoose.model('Notification', notificationSchema);
