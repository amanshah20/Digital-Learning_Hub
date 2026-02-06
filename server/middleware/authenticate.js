const tokenManager = require('../utils/tokenManager');
const User = require('../models/User');
const logger = require('../utils/logger');

const authenticate = async (req, res, next) => {
  try {
    // Extract token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. No token provided.'
      });
    }
    
    const token = authHeader.substring(7);
    
    // Verify token
    const decoded = tokenManager.verifyAccessToken(token);
    
    // Fetch user
    const user = await User.findById(decoded.userId).select('-password -refreshToken');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found. Invalid token.'
      });
    }
    
    // Check if user is active
    if (!user.isActive) {
      logger.security('Inactive user attempted access', {
        userId: user._id,
        email: user.email,
        ip: req.ip
      });
      
      return res.status(403).json({
        success: false,
        message: 'Account is deactivated. Please contact administrator.'
      });
    }
    
    // Check if account is locked
    if (user.isLocked()) {
      return res.status(403).json({
        success: false,
        message: 'Account is temporarily locked due to multiple failed login attempts.'
      });
    }
    
    // Attach user to request
    req.user = user;
    req.userId = user._id;
    req.userRole = user.role;
    
    next();
  } catch (error) {
    logger.error('Authentication error', error, {
      ip: req.ip,
      path: req.path
    });
    
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token. Please login again.'
    });
  }
};

module.exports = authenticate;
