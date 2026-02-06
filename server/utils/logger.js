const fs = require('fs');
const path = require('path');

const logDir = path.join(__dirname, '../logs');

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const logger = {
  info: (message, meta = {}) => {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level: 'INFO',
      message,
      ...meta
    };
    console.log(JSON.stringify(logEntry));
    writeToFile('info.log', logEntry);
  },

  error: (message, error = null, meta = {}) => {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level: 'ERROR',
      message,
      error: error ? {
        message: error.message,
        stack: error.stack
      } : null,
      ...meta
    };
    console.error(JSON.stringify(logEntry));
    writeToFile('error.log', logEntry);
  },

  warn: (message, meta = {}) => {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level: 'WARN',
      message,
      ...meta
    };
    console.warn(JSON.stringify(logEntry));
    writeToFile('warn.log', logEntry);
  },

  security: (message, meta = {}) => {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level: 'SECURITY',
      message,
      ...meta
    };
    console.log(JSON.stringify(logEntry));
    writeToFile('security.log', logEntry);
  }
};

function writeToFile(filename, entry) {
  const filePath = path.join(logDir, filename);
  const logLine = JSON.stringify(entry) + '\n';
  
  fs.appendFile(filePath, logLine, (err) => {
    if (err) console.error('Failed to write to log file:', err);
  });
}

module.exports = logger;
