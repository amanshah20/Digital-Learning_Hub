import express from 'express';
import { Op } from 'sequelize';
import { Student, User, Subject, Assignment, Attendance, Course, Grade } from '../models/index.js';
import { authenticateToken, authorize } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/student/dashboard
// @desc    Get student dashboard data
// @access  Private (Student only)
router.get('/dashboard', authenticateToken, authorize('student'), async (req, res) => {
  try {
    const student = await Student.findOne({
      where: { userId: req.user.id },
      include: [{ model: User }, { model: Course }]
    });

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    // Get enrolled subjects count
    const subjectsCount = await Subject.count({
      where: { courseId: student.courseId, semester: student.semester }
    });

    // Get attendance stats
    const totalClasses = await Attendance.count({
      where: { studentId: student.id }
    });
    const presentClasses = await Attendance.count({
      where: { studentId: student.id, status: 'present' }
    });
    const attendanceRate = totalClasses > 0 ? Math.round((presentClasses / totalClasses) * 100) : 0;

    // Get pending assignments
    const pendingAssignments = await Assignment.count({
      where: { subjectId: student.courseId },
      // Add logic to check if submitted
    });

    res.json({
      success: true,
      stats: {
        subjectsEnrolled: subjectsCount,
        attendanceRate: attendanceRate,
        pendingAssignments: pendingAssignments,
        currentGPA: student.xpPoints || 0
      }
    });
  } catch (error) {
    console.error('Student dashboard error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch dashboard data' });
  }
});

// @route   GET /api/student/subjects
// @desc    Get student subjects
// @access  Private (Student only)
router.get('/subjects', authenticateToken, authorize('student'), async (req, res) => {
  try {
    const student = await Student.findOne({
      where: { userId: req.user.id }
    });

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    const subjects = await Subject.findAll({
      where: { 
        courseId: student.courseId,
        semester: student.semester,
        isActive: true
      }
    });

    res.json({ success: true, data: subjects });
  } catch (error) {
    console.error('Get subjects error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch subjects' });
  }
});

// @route   GET /api/student/attendance
// @desc    Get student attendance
// @access  Private (Student only)
router.get('/attendance', authenticateToken, authorize('student'), async (req, res) => {
  try {
    const student = await Student.findOne({
      where: { userId: req.user.id }
    });

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    const attendance = await Attendance.findAll({
      where: { studentId: student.id },
      include: [{ model: Subject }],
      order: [['date', 'DESC']],
      limit: 50
    });

    const totalClasses = attendance.length;
    const presentClasses = attendance.filter(a => a.status === 'present').length;
    const absentClasses = attendance.filter(a => a.status === 'absent').length;
    const lateClasses = attendance.filter(a => a.status === 'late').length;

    res.json({
      success: true,
      stats: {
        overall: totalClasses > 0 ? Math.round((presentClasses / totalClasses) * 100) : 0,
        present: presentClasses,
        absent: absentClasses,
        late: lateClasses
      },
      history: attendance.map(a => ({
        id: a.id,
        date: a.date,
        status: a.status,
        method: a.method,
        subject: a.Subject?.name || 'Unknown Subject'
      }))
    });
  } catch (error) {
    console.error('Get attendance error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch attendance' });
  }
});

// @route   POST /api/student/attendance/mark
// @desc    Mark attendance with various methods (QR, Face, Geolocation, Manual)
// @access  Private (Student only)
router.post('/attendance/mark', authenticateToken, authorize('student'), async (req, res) => {
  try {
    const { method, qrCode, faceImage, latitude, longitude, accuracy, subjectId } = req.body;

    // Validate subject
    if (!subjectId) {
      return res.status(400).json({ success: false, message: 'Subject ID is required' });
    }

    // Get student
    const student = await Student.findOne({
      where: { userId: req.user.id }
    });

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    // Verify student is enrolled in this subject
    const subject = await Subject.findOne({
      where: { 
        id: subjectId,
        courseId: student.courseId,
        semester: student.semester
      }
    });

    if (!subject) {
      return res.status(403).json({ success: false, message: 'Not enrolled in this subject' });
    }

    // Check if already marked today for this subject
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const existingAttendance = await Attendance.findOne({
      where: {
        studentId: student.id,
        subjectId: subjectId,
        date: {
          [Op.gte]: today
        }
      }
    });

    if (existingAttendance) {
      return res.status(400).json({ 
        success: false, 
        message: 'Already marked attendance for this subject today' 
      });
    }

    let status = 'present';
    let verificationData = {};
    let location = null;

    // Process based on method
    if (method === 'qr') {
      if (!qrCode) {
        return res.status(400).json({ success: false, message: 'QR code is required' });
      }
      verificationData.qrCode = qrCode;
      // In production, validate QR code format/content
    } 
    else if (method === 'face') {
      if (!faceImage) {
        return res.status(400).json({ success: false, message: 'Face image is required' });
      }
      verificationData.faceImageSize = faceImage.length;
      // In production, use face recognition API (AWS Rekognition, Azure Face API, etc.)
      // For now, we accept it as valid
    } 
    else if (method === 'geolocation') {
      if (!latitude || !longitude) {
        return res.status(400).json({ success: false, message: 'Location coordinates required' });
      }
      
      location = { lat: latitude, lng: longitude };
      verificationData.accuracy = accuracy || 0;

      // Verify location is within acceptable range from class venue
      // Example: Check if within 100 meters of campus
      // For production, configure actual venue coordinates
      const ALLOWED_RADIUS = 1000; // 1000 meters
      const CAMPUS_LAT = 24.8607; // Example coordinates (Karachi)
      const CAMPUS_LON = 67.0011;

      const distance = calculateDistance(latitude, longitude, CAMPUS_LAT, CAMPUS_LON);
      
      if (distance > ALLOWED_RADIUS) {
        return res.status(400).json({ 
          success: false, 
          message: `You are ${Math.round(distance)}m away from the venue. Minimum distance allowed is ${ALLOWED_RADIUS}m` 
        });
      }
    } 
    else if (method === 'manual') {
      verificationData.manualEntry = true;
      // Manual entries might have lower priority or require approval
    } 
    else {
      return res.status(400).json({ success: false, message: 'Invalid attendance method' });
    }

    // Determine if late (if marked after 10 AM)
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    
    if (hours > 10 || (hours === 10 && minutes > 0)) {
      status = 'late';
    }

    // Create attendance record
    const attendance = await Attendance.create({
      studentId: student.id,
      subjectId: subjectId,
      date: new Date(),
      status: status,
      method: method === 'geolocation' ? 'geo' : method,
      location: location,
      verificationData: verificationData,
      timestamp: new Date()
    });

    res.json({
      success: true,
      message: `Attendance marked as ${status}!`,
      data: {
        id: attendance.id,
        status: attendance.status,
        method: attendance.method,
        date: attendance.date
      }
    });
  } catch (error) {
    console.error('Mark attendance error:', error);
    res.status(500).json({ success: false, message: 'Failed to mark attendance' });
  }
});

// Helper function to calculate distance between two coordinates (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000; // Earth's radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

export default router;
