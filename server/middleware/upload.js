const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { MAX_FILE_SIZE, FILE_TYPES } = require('../config/constants');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let subfolder = 'general';
    
    if (req.path.includes('assignment')) {
      subfolder = 'assignments';
    } else if (req.path.includes('course')) {
      subfolder = 'courses';
    } else if (req.path.includes('profile')) {
      subfolder = 'profiles';
    } else if (req.path.includes('lesson')) {
      subfolder = 'lessons';
    }
    
    const dest = path.join(uploadDir, subfolder);
    
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9]/g, '_')
      .substring(0, 50);
    
    cb(null, `${basename}-${uniqueSuffix}${ext}`);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase().substring(1);
  const allowedTypes = [
    ...FILE_TYPES.DOCUMENT,
    ...FILE_TYPES.VIDEO,
    ...FILE_TYPES.IMAGE,
    ...FILE_TYPES.PRESENTATION
  ];
  
  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`File type .${ext} is not allowed`), false);
  }
};

// Multer configuration
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || MAX_FILE_SIZE
  }
});

// Upload middleware variants
const uploadSingle = (fieldName) => upload.single(fieldName);
const uploadMultiple = (fieldName, maxCount = 5) => upload.array(fieldName, maxCount);
const uploadFields = (fields) => upload.fields(fields);

// Clean up uploaded files on error
const cleanupFiles = (files) => {
  if (!files) return;
  
  const fileArray = Array.isArray(files) ? files : [files];
  
  fileArray.forEach(file => {
    if (file && file.path && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
  });
};

module.exports = {
  uploadSingle,
  uploadMultiple,
  uploadFields,
  cleanupFiles
};
