import { DataTypes } from 'sequelize';
import sequelize from '../database/connection.js';

const Teacher = sequelize.define('Teacher', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  employeeId: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  department: {
    type: DataTypes.STRING,
    allowNull: true
  },
  designation: {
    type: DataTypes.STRING,
    allowNull: true
  },
  qualification: {
    type: DataTypes.STRING,
    allowNull: true
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  specialization: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  performanceMetrics: {
    type: DataTypes.JSON,
    defaultValue: {
      totalClasses: 0,
      averageAttendance: 0,
      studentSatisfaction: 0
    }
  }
}, {
  timestamps: true
});

export default Teacher;
