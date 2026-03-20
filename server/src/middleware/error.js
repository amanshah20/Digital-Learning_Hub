import logger from '../utils/logger.js';
import { AuditLog } from '../models/index.js';

export const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  logger.error(err);

  // Sequelize validation errors
  if (err.name === 'SequelizeValidationError') {
    const message = Object.values(err.errors).map(e => e.message);
    error.message = message;
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }

  // Sequelize unique constraint errors
  if (err.name === 'SequelizeUniqueConstraintError') {
    const message = 'Duplicate field value entered';
    error.message = message;
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    error.message = message;
    return res.status(401).json({
      success: false,
      message: error.message
    });
  }

  // JWT expiration
  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    error.message = message;
    return res.status(401).json({
      success: false,
      message: error.message
    });
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error'
  });
};

export const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
};

export const auditLogger = async (req, res, next) => {
  if (req.user && req.method !== 'GET') {
    try {
      await AuditLog.create({
        userId: req.user.id,
        action: `${req.method}_${req.baseUrl}${req.path}`,
        resource: req.baseUrl.split('/').pop(),
        details: {
          body: req.body,
          query: req.query
        },
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        status: 'success'
      });
    } catch (error) {
      logger.error('Audit log error:', error);
    }
  }
  next();
};
