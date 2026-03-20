import { DataTypes } from 'sequelize';
import sequelize from '../database/connection.js';

const Certificate = sequelize.define('Certificate', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  studentId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('completion', 'achievement', 'participation', 'degree'),
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  issueDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  certificateUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  verificationCode: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  blockchainHash: {
    type: DataTypes.STRING,
    allowNull: true
  },
  metadata: {
    type: DataTypes.JSON,
    defaultValue: {}
  }
}, {
  timestamps: true
});

export default Certificate;
