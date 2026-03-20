import User from './User.js';
import Student from './Student.js';
import Teacher from './Teacher.js';
import Course from './Course.js';
import Subject from './Subject.js';
import Attendance from './Attendance.js';
import { Assignment, AssignmentSubmission } from './Assignment.js';
import { Quiz, QuizAttempt } from './Quiz.js';
import { Material, MaterialView } from './Material.js';
import Class from './Class.js';
import Grade from './Grade.js';
import Announcement from './Announcement.js';
import Certificate from './Certificate.js';
import AuditLog from './AuditLog.js';
import { Fee, Payment } from './Fee.js';

// User Associations
User.hasOne(Student, { foreignKey: 'userId', onDelete: 'CASCADE' });
Student.belongsTo(User, { foreignKey: 'userId' });

User.hasOne(Teacher, { foreignKey: 'userId', onDelete: 'CASCADE' });
Teacher.belongsTo(User, { foreignKey: 'userId' });

// Course Associations
Course.hasMany(Subject, { foreignKey: 'courseId', onDelete: 'CASCADE' });
Subject.belongsTo(Course, { foreignKey: 'courseId' });

Course.hasMany(Student, { foreignKey: 'courseId' });
Student.belongsTo(Course, { foreignKey: 'courseId' });

// Subject Associations
Teacher.hasMany(Subject, { foreignKey: 'teacherId' });
Subject.belongsTo(Teacher, { foreignKey: 'teacherId' });

Subject.hasMany(Class, { foreignKey: 'subjectId', onDelete: 'CASCADE' });
Class.belongsTo(Subject, { foreignKey: 'subjectId' });

Subject.hasMany(Assignment, { foreignKey: 'subjectId', onDelete: 'CASCADE' });
Assignment.belongsTo(Subject, { foreignKey: 'subjectId' });

Subject.hasMany(Quiz, { foreignKey: 'subjectId', onDelete: 'CASCADE' });
Quiz.belongsTo(Subject, { foreignKey: 'subjectId' });

Subject.hasMany(Material, { foreignKey: 'subjectId', onDelete: 'CASCADE' });
Material.belongsTo(Subject, { foreignKey: 'subjectId' });

Subject.hasMany(Attendance, { foreignKey: 'subjectId', onDelete: 'CASCADE' });
Attendance.belongsTo(Subject, { foreignKey: 'subjectId' });

Subject.hasMany(Grade, { foreignKey: 'subjectId', onDelete: 'CASCADE' });
Grade.belongsTo(Subject, { foreignKey: 'subjectId' });

// Teacher Associations
Teacher.hasMany(Class, { foreignKey: 'teacherId' });
Class.belongsTo(Teacher, { foreignKey: 'teacherId' });

Teacher.hasMany(Assignment, { foreignKey: 'teacherId' });
Assignment.belongsTo(Teacher, { foreignKey: 'teacherId' });

Teacher.hasMany(Quiz, { foreignKey: 'teacherId' });
Quiz.belongsTo(Teacher, { foreignKey: 'teacherId' });

Teacher.hasMany(Material, { foreignKey: 'teacherId' });
Material.belongsTo(Teacher, { foreignKey: 'teacherId' });

// Student Associations
Student.hasMany(Attendance, { foreignKey: 'studentId', onDelete: 'CASCADE' });
Attendance.belongsTo(Student, { foreignKey: 'studentId' });

Student.hasMany(AssignmentSubmission, { foreignKey: 'studentId', onDelete: 'CASCADE' });
AssignmentSubmission.belongsTo(Student, { foreignKey: 'studentId' });

Student.hasMany(QuizAttempt, { foreignKey: 'studentId', onDelete: 'CASCADE' });
QuizAttempt.belongsTo(Student, { foreignKey: 'studentId' });

Student.hasMany(Grade, { foreignKey: 'studentId', onDelete: 'CASCADE' });
Grade.belongsTo(Student, { foreignKey: 'studentId' });

Student.hasMany(MaterialView, { foreignKey: 'studentId', onDelete: 'CASCADE' });
MaterialView.belongsTo(Student, { foreignKey: 'studentId' });

Student.hasMany(Certificate, { foreignKey: 'studentId', onDelete: 'CASCADE' });
Certificate.belongsTo(Student, { foreignKey: 'studentId' });

// Fee and Payment Associations
Student.hasMany(Fee, { foreignKey: 'studentId', onDelete: 'CASCADE' });
Fee.belongsTo(Student, { foreignKey: 'studentId' });

Student.hasMany(Payment, { foreignKey: 'studentId', onDelete: 'CASCADE' });
Payment.belongsTo(Student, { foreignKey: 'studentId' });

Fee.hasMany(Payment, { foreignKey: 'feeId', onDelete: 'CASCADE' });
Payment.belongsTo(Fee, { foreignKey: 'feeId' });

User.hasMany(Payment, { foreignKey: 'receivedBy' });
Payment.belongsTo(User, { foreignKey: 'receivedBy', as: 'receiver' });

// Assignment Associations
Assignment.hasMany(AssignmentSubmission, { foreignKey: 'assignmentId', onDelete: 'CASCADE' });
AssignmentSubmission.belongsTo(Assignment, { foreignKey: 'assignmentId' });

// Quiz Associations
Quiz.hasMany(QuizAttempt, { foreignKey: 'quizId', onDelete: 'CASCADE' });
QuizAttempt.belongsTo(Quiz, { foreignKey: 'quizId' });

// Material Associations
Material.hasMany(MaterialView, { foreignKey: 'materialId', onDelete: 'CASCADE' });
MaterialView.belongsTo(Material, { foreignKey: 'materialId' });

// Class Associations
Class.hasMany(Attendance, { foreignKey: 'classId', onDelete: 'SET NULL' });
Attendance.belongsTo(Class, { foreignKey: 'classId' });

export {
  User,
  Student,
  Teacher,
  Course,
  Subject,
  Attendance,
  Assignment,
  AssignmentSubmission,
  Quiz,
  QuizAttempt,
  Material,
  MaterialView,
  Class,
  Grade,
  Announcement,
  Certificate,
  AuditLog,
  Fee,
  Payment
};
