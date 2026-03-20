import { DataTypes } from 'sequelize';
import sequelize from '../database/connection.js';

const Attendance = sequelize.define('Attendance', {
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
  classId: {
    type: DataTypes.UUID,
    allowNull: true
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('present', 'absent', 'late'),
    allowNull: false
  },
  method: {
    type: DataTypes.ENUM('manual', 'qr', 'face', 'geo'),
    defaultValue: 'manual'
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  location: {
    type: DataTypes.JSON,
    allowNull: true // {lat, lng}
  },
  verificationData: {
    type: DataTypes.JSON,
    allowNull: true // Additional verification info
  }
}, {
  timestamps: true,
  indexes: [
    {
      fields: ['studentId', 'date']
    },
    {
      fields: ['subjectId', 'date']
    }
  ]
});

export default Attendance;
