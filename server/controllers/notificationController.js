const Notification = require('../models/Notification');
const { asyncHandler } = require('../middleware/errorHandler');

// Get user notifications
exports.getNotifications = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, isRead, type } = req.query;
  
  const query = { recipient: req.userId };
  if (isRead !== undefined) query.isRead = isRead === 'true';
  if (type) query.type = type;
  
  const skip = (parseInt(page) - 1) * parseInt(limit);
  
  const notifications = await Notification.find(query)
    .populate('sender', 'firstName lastName profilePicture')
    .sort({ createdAt: -1 })
    .limit(parseInt(limit))
    .skip(skip);
  
  const total = await Notification.countDocuments(query);
  const unreadCount = await Notification.countDocuments({
    recipient: req.userId,
    isRead: false
  });
  
  res.json({
    success: true,
    data: {
      notifications,
      unreadCount,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    }
  });
});

// Mark notification as read
exports.markAsRead = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const notification = await Notification.findOne({
    _id: id,
    recipient: req.userId
  });
  
  if (!notification) {
    return res.status(404).json({
      success: false,
      message: 'Notification not found'
    });
  }
  
  await notification.markAsRead();
  
  res.json({
    success: true,
    message: 'Notification marked as read'
  });
});

// Mark all as read
exports.markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.markAllAsRead(req.userId);
  
  res.json({
    success: true,
    message: 'All notifications marked as read'
  });
});

// Delete notification
exports.deleteNotification = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const notification = await Notification.findOneAndDelete({
    _id: id,
    recipient: req.userId
  });
  
  if (!notification) {
    return res.status(404).json({
      success: false,
      message: 'Notification not found'
    });
  }
  
  res.json({
    success: true,
    message: 'Notification deleted'
  });
});

// Get unread count
exports.getUnreadCount = asyncHandler(async (req, res) => {
  const count = await Notification.countDocuments({
    recipient: req.userId,
    isRead: false
  });
  
  res.json({
    success: true,
    data: { unreadCount: count }
  });
});

module.exports = exports;
