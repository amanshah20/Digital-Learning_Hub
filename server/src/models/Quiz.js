import { DataTypes } from 'sequelize';
import sequelize from '../database/connection.js';

const Quiz = sequelize.define('Quiz', {
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
  duration: {
    type: DataTypes.INTEGER, // in minutes
    allowNull: false
  },
  totalMarks: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  startTime: {
    type: DataTypes.DATE,
    allowNull: true
  },
  endTime: {
    type: DataTypes.DATE,
    allowNull: true
  },
  questions: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  difficultyLevel: {
    type: DataTypes.ENUM('easy', 'medium', 'hard'),
    defaultValue: 'medium'
  }
}, {
  timestamps: true
});

const QuizAttempt = sequelize.define('QuizAttempt', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  quizId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  studentId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  answers: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  score: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  startedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  submittedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  timeTaken: {
    type: DataTypes.INTEGER, // in seconds
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('in-progress', 'completed'),
    defaultValue: 'in-progress'
  }
}, {
  timestamps: true
});

export { Quiz, QuizAttempt };
