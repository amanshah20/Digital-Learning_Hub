const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');
const tokenManager = require('../utils/tokenManager');
const logger = require('../utils/logger');
const { ROLES, ACTIVITY_TYPES } = require('../config/constants');
const { asyncHandler } = require('../middleware/errorHandler');

// Register new user
exports.register = asyncHandler(async (req, res) => {
  const { email, password, firstName, lastName, role, phone, dateOfBirth } = req.body;
  
  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: 'User with this email already exists'
    });
  }
  
  // Create user
  const userData = {
    email,
    password,
    firstName,
    lastName,
    role,
    phone,
    dateOfBirth
  };
  
  // Generate unique IDs for students and teachers
  if (role === ROLES.STUDENT) {
    const studentCount = await User.countDocuments({ role: ROLES.STUDENT });
    userData.studentId = `STU${String(studentCount + 1).padStart(6, '0')}`;
    userData.enrollmentDate = new Date();
  } else if (role === ROLES.TEACHER) {
    const teacherCount = await User.countDocuments({ role: ROLES.TEACHER });
    userData.teacherId = `TCH${String(teacherCount + 1).padStart(6, '0')}`;
  }
  
  const user = await User.create(userData);
  
  // Log activity
  await ActivityLog.logActivity({
    user: user._id,
    activityType: ACTIVITY_TYPES.USER_CREATE,
    description: `User registered: ${user.email}`,
    ipAddress: req.ip,
    userAgent: req.get('user-agent')
  });
  
  logger.info('User registered', {
    userId: user._id,
    email: user.email,
    role: user.role
  });
  
  // Generate tokens
  const tokens = tokenManager.generateTokenPair(user._id, user.role, user.email);
  
  // Save refresh token
  user.refreshToken = tokens.refreshToken;
  user.refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await user.save();
  
  res.status(201).json({
    success: true,
    message: 'Registration successful',
    data: {
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        studentId: user.studentId,
        teacherId: user.teacherId
      },
      tokens
    }
  });
});

// Login
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  
  // Find user and include password
  const user = await User.findOne({ email }).select('+password +refreshToken');
  
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password'
    });
  }
  
  // Check if account is locked
  if (user.isLocked()) {
    return res.status(403).json({
      success: false,
      message: 'Account is temporarily locked due to multiple failed login attempts'
    });
  }
  
  // Check if account is active
  if (!user.isActive) {
    return res.status(403).json({
      success: false,
      message: 'Account is deactivated. Please contact administrator.'
    });
  }
  
  // Verify password
  const isPasswordValid = await user.comparePassword(password);
  
  if (!isPasswordValid) {
    await user.incLoginAttempts();
    
    logger.security('Failed login attempt', {
      email,
      ip: req.ip
    });
    
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password'
    });
  }
  
  // Reset login attempts on successful login
  await user.resetLoginAttempts();
  
  // Generate tokens
  const tokens = tokenManager.generateTokenPair(user._id, user.role, user.email);
  
  // Update user
  user.refreshToken = tokens.refreshToken;
  user.refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  user.lastLogin = new Date();
  await user.save();
  
  // Log activity
  await ActivityLog.logActivity({
    user: user._id,
    activityType: ACTIVITY_TYPES.LOGIN,
    description: 'User logged in',
    ipAddress: req.ip,
    userAgent: req.get('user-agent')
  });
  
  logger.info('User logged in', {
    userId: user._id,
    email: user.email,
    role: user.role
  });
  
  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        role: user.role,
        profilePicture: user.profilePicture,
        studentId: user.studentId,
        teacherId: user.teacherId
      },
      tokens
    }
  });
});

// Refresh token
exports.refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  
  if (!refreshToken) {
    return res.status(400).json({
      success: false,
      message: 'Refresh token required'
    });
  }
  
  // Verify refresh token
  const decoded = tokenManager.verifyRefreshToken(refreshToken);
  
  // Find user
  const user = await User.findById(decoded.userId).select('+refreshToken +refreshTokenExpiry');
  
  if (!user || user.refreshToken !== refreshToken) {
    return res.status(401).json({
      success: false,
      message: 'Invalid refresh token'
    });
  }
  
  // Check if refresh token is expired
  if (user.refreshTokenExpiry < new Date()) {
    return res.status(401).json({
      success: false,
      message: 'Refresh token expired. Please login again.'
    });
  }
  
  // Generate new tokens
  const tokens = tokenManager.generateTokenPair(user._id, user.role, user.email);
  
  // Update refresh token
  user.refreshToken = tokens.refreshToken;
  user.refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await user.save();
  
  res.json({
    success: true,
    message: 'Token refreshed successfully',
    data: { tokens }
  });
});

// Logout
exports.logout = asyncHandler(async (req, res) => {
  const user = await User.findById(req.userId);
  
  if (user) {
    user.refreshToken = null;
    user.refreshTokenExpiry = null;
    await user.save();
    
    // Log activity
    await ActivityLog.logActivity({
      user: user._id,
      activityType: ACTIVITY_TYPES.LOGOUT,
      description: 'User logged out',
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });
  }
  
  res.json({
    success: true,
    message: 'Logout successful'
  });
});

// Get current user profile
exports.getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.userId)
    .populate('enrolledCourses', 'title courseCode thumbnail')
    .select('-password -refreshToken');
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }
  
  res.json({
    success: true,
    data: { user }
  });
});

// Update profile
exports.updateProfile = asyncHandler(async (req, res) => {
  const { firstName, lastName, phone, address, department, qualification, specialization } = req.body;
  
  const updateData = {};
  if (firstName) updateData.firstName = firstName;
  if (lastName) updateData.lastName = lastName;
  if (phone) updateData.phone = phone;
  if (address) updateData.address = address;
  
  // Teacher-specific fields
  if (req.userRole === ROLES.TEACHER) {
    if (department) updateData.department = department;
    if (qualification) updateData.qualification = qualification;
    if (specialization) updateData.specialization = specialization;
  }
  
  const user = await User.findByIdAndUpdate(
    req.userId,
    updateData,
    { new: true, runValidators: true }
  ).select('-password -refreshToken');
  
  // Log activity
  await ActivityLog.logActivity({
    user: user._id,
    activityType: ACTIVITY_TYPES.USER_UPDATE,
    description: 'User updated profile',
    ipAddress: req.ip,
    userAgent: req.get('user-agent')
  });
  
  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: { user }
  });
});

// Change password
exports.changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  
  const user = await User.findById(req.userId).select('+password');
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }
  
  // Verify current password
  const isPasswordValid = await user.comparePassword(currentPassword);
  
  if (!isPasswordValid) {
    return res.status(401).json({
      success: false,
      message: 'Current password is incorrect'
    });
  }
  
  // Update password
  user.password = newPassword;
  await user.save();
  
  logger.security('Password changed', {
    userId: user._id,
    email: user.email,
    ip: req.ip
  });
  
  res.json({
    success: true,
    message: 'Password changed successfully'
  });
});

module.exports = exports;
