import { DataTypes } from 'sequelize';
import sequelize from '../database/connection.js';

const Class = sequelize.define('Class', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  subjectId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  teacherId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  startTime: {
    type: DataTypes.TIME,
    allowNull: false
  },
  endTime: {
    type: DataTypes.TIME,
    allowNull: false
  },
  room: {
    type: DataTypes.STRING,
    allowNull: true
  },
  type: {
    type: DataTypes.ENUM('lecture', 'lab', 'tutorial', 'online'),
    defaultValue: 'lecture'
  },
  meetingLink: {
    type: DataTypes.STRING,
    allowNull: true
  },
  qrCode: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  qrExpiry: {
    type: DataTypes.DATE,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('scheduled', 'ongoing', 'completed', 'cancelled'),
    defaultValue: 'scheduled'
  },
  attendanceMethod: {
    type: DataTypes.JSON,
    defaultValue: ['manual'] // ['manual', 'qr', 'face', 'geo']
  }
}, {
  timestamps: true
});

export default Class;
