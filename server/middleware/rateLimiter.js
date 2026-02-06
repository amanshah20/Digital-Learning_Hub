const rateLimit = require('express-rate-limit');
const logger = require('../utils/logger');

// General API rate limiter
const apiLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.security('Rate limit exceeded', {
      ip: req.ip,
      path: req.path,
      method: req.method
    });
    
    res.status(429).json({
      success: false,
      message: 'Too many requests. Please try again later.'
    });
  }
});

// Strict limiter for authentication routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  skipSuccessfulRequests: true,
  message: {
    success: false,
    message: 'Too many login attempts, please try again after 15 minutes.'
  },
  handler: (req, res) => {
    logger.security('Auth rate limit exceeded', {
      ip: req.ip,
      email: req.body.email,
      path: req.path
    });
    
    res.status(429).json({
      success: false,
      message: 'Too many login attempts. Account temporarily locked.'
    });
  }
});

// Limiter for file uploads
const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50,
  message: {
    success: false,
    message: 'Too many upload requests, please try again later.'
  }
});

// Limiter for password reset requests
const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,
  message: {
    success: false,
    message: 'Too many password reset requests, please try again later.'
  }
});

// Limiter for exam submission
const examLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  message: {
    success: false,
    message: 'Too many exam submission requests, please slow down.'
  }
});

module.exports = {
  apiLimiter,
  authLimiter,
  uploadLimiter,
  passwordResetLimiter,
  examLimiter
};
