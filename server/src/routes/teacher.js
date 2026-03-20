import express from 'express';
import { Teacher, User, Subject, Class, Assignment, Student } from '../models/index.js';
import { authenticateToken, authorize } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/teacher/dashboard
// @desc    Get teacher dashboard data
// @access  Private (Teacher only)
router.get('/dashboard', authenticateToken, authorize('teacher'), async (req, res) => {
  try {
    const teacher = await Teacher.findOne({
      where: { userId: req.user.id },
      include: [{ model: User }]
    });

    if (!teacher) {
      return res.status(404).json({ success: false, message: 'Teacher profile not found' });
    }

    // Get total classes
    const totalClasses = await Class.count({
      where: { teacherId: teacher.id }
    });

    // Get total subjects
    const totalSubjects = await Subject.count({
      where: { teacherId: teacher.id, isActive: true }
    });

    // Get total students (count from all classes)
    const subjects = await Subject.findAll({
      where: { teacherId: teacher.id }
    });

    res.json({
      success: true,
      stats: {
        totalClasses: totalClasses,
        totalSubjects: totalSubjects,
        totalStudents: 0, // Will be calculated based on enrollment
        avgAttendance: 88
      }
    });
  } catch (error) {
    console.error('Teacher dashboard error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch dashboard data' });
  }
});

// @route   GET /api/teacher/classes
// @desc    Get teacher classes
// @access  Private (Teacher only)
router.get('/classes', authenticateToken, authorize('teacher'), async (req, res) => {
  try {
    const teacher = await Teacher.findOne({
      where: { userId: req.user.id }
    });

    if (!teacher) {
      return res.status(404).json({ success: false, message: 'Teacher profile not found' });
    }

    const classes = await Class.findAll({
      where: { teacherId: teacher.id },
      include: [{ model: Subject }],
      order: [['date', 'DESC'], ['startTime', 'DESC']],
      limit: 20
    });

    res.json({ success: true, classes });
  } catch (error) {
    console.error('Get classes error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch classes' });
  }
});

// @route   GET /api/teacher/subjects
// @desc    Get teacher subjects
// @access  Private (Teacher only)
router.get('/subjects', authenticateToken, authorize('teacher'), async (req, res) => {
  try {
    const teacher = await Teacher.findOne({
      where: { userId: req.user.id }
    });

    if (!teacher) {
      return res.status(404).json({ success: false, message: 'Teacher profile not found' });
    }

    const subjects = await Subject.findAll({
      where: { teacherId: teacher.id, isActive: true }
    });

    res.json({ success: true, subjects });
  } catch (error) {
    console.error('Get subjects error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch subjects' });
  }
});

// @route   POST /api/teacher/assignments
// @desc    Create new assignment
// @access  Private (Teacher only)
router.post('/assignments', authenticateToken, authorize('teacher'), async (req, res) => {
  try {
    const teacher = await Teacher.findOne({
      where: { userId: req.user.id }
    });

    const { title, description, subjectId, dueDate, maxMarks } = req.body;

    const assignment = await Assignment.create({
      title,
      description,
      subjectId,
      teacherId: teacher.id,
      dueDate,
      maxMarks,
      isActive: true
    });

    res.status(201).json({ success: true, assignment });
  } catch (error) {
    console.error('Create assignment error:', error);
    res.status(500).json({ success: false, message: 'Failed to create assignment' });
  }
});

export default router;
