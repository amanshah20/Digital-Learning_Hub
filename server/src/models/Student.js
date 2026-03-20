import { DataTypes } from 'sequelize';
import sequelize from '../database/connection.js';

const Student = sequelize.define('Student', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  enrollmentNumber: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  dateOfBirth: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  semester: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  courseId: {
    type: DataTypes.UUID,
    allowNull: true
  },
  // Gamification
  xpPoints: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  level: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  badges: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  studyStreak: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  lastStudyDate: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  // Analytics
  totalStudyHours: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  focusLevel: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  engagementScore: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  // Career Tracking
  skills: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  placementReadiness: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  // Health
  moodHistory: {
    type: DataTypes.JSON,
    defaultValue: []
  }
}, {
  timestamps: true
});

export default Student;
