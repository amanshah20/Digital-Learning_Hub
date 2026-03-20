import { DataTypes } from 'sequelize';
import sequelize from '../database/connection.js';

const Grade = sequelize.define('Grade', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  studentId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  subjectId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  semester: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  examType: {
    type: DataTypes.ENUM('midterm', 'final', 'internal', 'practical'),
    allowNull: false
  },
  marksObtained: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  totalMarks: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  grade: {
    type: DataTypes.STRING,
    allowNull: true
  },
  gradePoints: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  remarks: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  timestamps: true
});

export default Grade;
