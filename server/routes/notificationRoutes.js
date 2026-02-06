const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const authenticate = require('../middleware/authenticate');
const validators = require('../utils/validators');

router.get('/', authenticate, validators.pagination, notificationController.getNotifications);
router.get('/unread-count', authenticate, notificationController.getUnreadCount);
router.put('/:id/read', authenticate, validators.idParam, notificationController.markAsRead);
router.put('/mark-all-read', authenticate, notificationController.markAllAsRead);
router.delete('/:id', authenticate, validators.idParam, notificationController.deleteNotification);

module.exports = router;
