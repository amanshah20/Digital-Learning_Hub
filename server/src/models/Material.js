import { DataTypes } from 'sequelize';
import sequelize from '../database/connection.js';

const Material = sequelize.define('Material', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  subjectId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  teacherId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('pdf', 'video', 'ppt', 'document', 'link'),
    allowNull: false
  },
  fileUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  fileName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  fileSize: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  duration: {
    type: DataTypes.INTEGER, // for videos in seconds
    allowNull: true
  },
  thumbnail: {
    type: DataTypes.STRING,
    allowNull: true
  },
  // Analytics
  viewCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  downloadCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  averageWatchTime: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: true
});

const MaterialView = sequelize.define('MaterialView', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  materialId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  studentId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  watchTime: {
    type: DataTypes.INTEGER, // in seconds
    defaultValue: 0
  },
  completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  lastPosition: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  timestamps: true
});

export { Material, MaterialView };
