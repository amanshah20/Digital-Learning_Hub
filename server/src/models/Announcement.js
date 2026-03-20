import { DataTypes } from 'sequelize';
import sequelize from '../database/connection.js';

const Announcement = sequelize.define('Announcement', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  authorId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  authorRole: {
    type: DataTypes.ENUM('teacher', 'admin'),
    allowNull: false
  },
  targetAudience: {
    type: DataTypes.JSON,
    defaultValue: [] // ['all', 'students', 'teachers', specific IDs]
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
    defaultValue: 'medium'
  },
  attachments: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  expiryDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: true
});

export default Announcement;
