const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authenticate = require('../middleware/authenticate');
const { authorize } = require('../middleware/authorize');
const validators = require('../utils/validators');
const { ROLES } = require('../config/constants');

// All routes require admin authentication
router.use(authenticate);
router.use(authorize(ROLES.ADMIN));

// User management
router.get('/users', validators.pagination, adminController.getAllUsers);
router.get('/users/:id', validators.idParam, adminController.getUserById);
router.post('/users', validators.register, adminController.createUser);
router.put('/users/:id', validators.idParam, adminController.updateUser);
router.put('/users/:id/toggle-status', validators.idParam, adminController.toggleUserStatus);
router.delete('/users/:id', validators.idParam, adminController.deleteUser);

// Statistics and monitoring
router.get('/statistics', adminController.getPlatformStats);
router.get('/activity-logs', validators.pagination, adminController.getActivityLogs);
router.get('/security-logs', validators.pagination, adminController.getSecurityLogs);

// Notifications
router.post('/notifications/bulk', adminController.sendBulkNotification);

module.exports = router;
