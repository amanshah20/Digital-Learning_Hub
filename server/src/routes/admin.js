import express from 'express';
import { User, Student, Teacher, Course, Fee, Payment } from '../models/index.js';
import { authenticateToken, authorize } from '../middleware/auth.js';
import { AuditLog } from '../models/index.js';
import { Op } from 'sequelize';

const router = express.Router();

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Private (Admin only)
router.get('/users', authenticateToken, authorize('admin'), async (req, res) => {
  try {
    const users = await User.findAll({
      include: [
        { model: Student, required: false },
        { model: Teacher, required: false }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({ success: true, users });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch users' });
  }
});

// @route   POST /api/admin/users
// @desc    Create new user
// @access  Private (Admin only)
router.post('/users', authenticateToken, authorize('admin'), async (req, res) => {
  try {
    const { email, password, role, firstName, lastName, enrollmentNumber, employeeId } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      email,
      password,
      role,
      firstName,
      lastName,
      isActive: true
    });

    // Create role-specific profile
    if (role === 'student' && enrollmentNumber) {
      await Student.create({
        userId: user.id,
        enrollmentNumber
      });
    } else if (role === 'teacher' && employeeId) {
      await Teacher.create({
        userId: user.id,
        employeeId
      });
    }

    await AuditLog.create({
      userId: req.user.id,
      action: 'CREATE_USER',
      resource: 'User',
      resourceId: user.id,
      details: { email, role },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      status: 'success'
    });

    res.status(201).json({ success: true, user });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ success: false, message: 'Failed to create user' });
  }
});

// @route   PUT /api/admin/users/:id
// @desc    Update user
// @access  Private (Admin only)
router.put('/users/:id', authenticateToken, authorize('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, isActive } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    await user.update({ firstName, lastName, email, isActive });

    await AuditLog.create({
      userId: req.user.id,
      action: 'UPDATE_USER',
      resource: 'User',
      resourceId: id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      status: 'success'
    });

    res.json({ success: true, user });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ success: false, message: 'Failed to update user' });
  }
});

// @route   DELETE /api/admin/users/:id
// @desc    Delete user
// @access  Private (Admin only)
router.delete('/users/:id', authenticateToken, authorize('admin'), async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    await user.destroy();

    await AuditLog.create({
      userId: req.user.id,
      action: 'DELETE_USER',
      resource: 'User',
      resourceId: id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      status: 'success'
    });

    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete user' });
  }
});

// @route   GET /api/admin/courses
// @desc    Get all courses
// @access  Private (Admin only)
router.get('/courses', authenticateToken, authorize('admin'), async (req, res) => {
  try {
    const courses = await Course.findAll({
      order: [['createdAt', 'DESC']]
    });

    res.json({ success: true, courses });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch courses' });
  }
});

// @route   POST /api/admin/courses
// @desc    Create new course
// @access  Private (Admin only)
router.post('/courses', authenticateToken, authorize('admin'), async (req, res) => {
  try {
    const { name, code, description, duration, department } = req.body;

    const course = await Course.create({
      name,
      code,
      description,
      duration,
      department,
      isActive: true
    });

    await AuditLog.create({
      userId: req.user.id,
      action: 'CREATE_COURSE',
      resource: 'Course',
      resourceId: course.id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      status: 'success'
    });

    res.status(201).json({ success: true, course });
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({ success: false, message: 'Failed to create course' });
  }
});

// @route   PUT /api/admin/courses/:id
// @desc    Update course
// @access  Private (Admin only)
router.put('/courses/:id', authenticateToken, authorize('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, code, description, duration, department, isActive } = req.body;

    const course = await Course.findByPk(id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    await course.update({ name, code, description, duration, department, isActive });

    res.json({ success: true, course });
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({ success: false, message: 'Failed to update course' });
  }
});

// @route   DELETE /api/admin/courses/:id
// @desc    Delete course
// @access  Private (Admin only)
router.delete('/courses/:id', authenticateToken, authorize('admin'), async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findByPk(id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    await course.destroy();

    res.json({ success: true, message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete course' });
  }
});

// @route   GET /api/admin/stats
// @desc    Get dashboard statistics
// @access  Private (Admin only)
router.get('/stats', authenticateToken, authorize('admin'), async (req, res) => {
  try {
    const totalStudents = await Student.count();
    const totalTeachers = await Teacher.count();
    const totalCourses = await Course.count({ where: { isActive: true } });

    res.json({
      success: true,
      stats: {
        totalStudents,
        totalTeachers,
        totalCourses
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch stats' });
  }
});

// ============= SUBJECTS MANAGEMENT =============

// @route   GET /api/admin/subjects
// @desc    Get all subjects
// @access  Private (Admin only)
router.get('/subjects', authenticateToken, authorize('admin'), async (req, res) => {
  try {
    const { Subject } = await import('../models/index.js');
    const subjects = await Subject.findAll({
      include: [
        { model: Course, attributes: ['name', 'code'] },
        { 
          model: Teacher,
          include: [{ 
            model: User, 
            attributes: ['firstName', 'lastName'] 
          }]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({ success: true, subjects });
  } catch (error) {
    console.error('Get subjects error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch subjects' });
  }
});

// @route   POST /api/admin/subjects
// @desc    Create new subject
// @access  Private (Admin only)
router.post('/subjects', authenticateToken, authorize('admin'), async (req, res) => {
  try {
    const { Subject } = await import('../models/index.js');
    const { name, code, description, credits, semester, courseId, teacherId } = req.body;

    const subject = await Subject.create({
      name,
      code,
      description,
      credits,
      semester,
      courseId,
      teacherId: teacherId || null,
      isActive: true
    });

    res.status(201).json({ success: true, subject });
  } catch (error) {
    console.error('Create subject error:', error);
    res.status(500).json({ success: false, message: 'Failed to create subject' });
  }
});

// @route   DELETE /api/admin/subjects/:id
// @desc    Delete subject
// @access  Private (Admin only)
router.delete('/subjects/:id', authenticateToken, authorize('admin'), async (req, res) => {
  try {
    const { Subject } = await import('../models/index.js');
    const { id } = req.params;

    const subject = await Subject.findByPk(id);
    if (!subject) {
      return res.status(404).json({ success: false, message: 'Subject not found' });
    }

    await subject.destroy();

    res.json({ success: true, message: 'Subject deleted successfully' });
  } catch (error) {
    console.error('Delete subject error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete subject' });
  }
});

// ============= FEE MANAGEMENT =============

// @route   GET /api/admin/fees
// @desc    Get all fees with student details
// @access  Private (Admin only)
router.get('/fees', authenticateToken, authorize('admin'), async (req, res) => {
  try {
    const fees = await Fee.findAll({
      include: [
        {
          model: Student,
          include: [{ model: User, attributes: ['firstName', 'lastName', 'email'] }]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({ success: true, fees });
  } catch (error) {
    console.error('Get fees error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch fees' });
  }
});

// @route   GET /api/admin/fees/student/:studentId
// @desc    Get fees for a specific student
// @access  Private (Admin only)
router.get('/fees/student/:studentId', authenticateToken, authorize('admin'), async (req, res) => {
  try {
    const { studentId } = req.params;
    
    const fees = await Fee.findAll({
      where: { studentId },
      include: [
        {
          model: Payment,
          include: [
            { model: User, as: 'receiver', attributes: ['firstName', 'lastName'] }
          ]
        }
      ],
      order: [['dueDate', 'DESC']]
    });

    res.json({ success: true, fees });
  } catch (error) {
    console.error('Get student fees error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch student fees' });
  }
});

// @route   POST /api/admin/fees
// @desc    Add new fee for a student
// @access  Private (Admin only)
router.post('/fees', authenticateToken, authorize('admin'), async (req, res) => {
  try {
    const { studentId, feeType, amount, dueDate, semester, academicYear, description } = req.body;

    // Check if student exists
    const student = await Student.findByPk(studentId);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const fee = await Fee.create({
      studentId,
      feeType,
      amount,
      dueDate,
      semester,
      academicYear,
      description,
      status: 'pending',
      paidAmount: 0
    });

    await AuditLog.create({
      userId: req.user.id,
      action: 'CREATE_FEE',
      resource: 'Fee',
      resourceId: fee.id,
      details: { studentId, feeType, amount },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      status: 'success'
    });

    res.status(201).json({ success: true, fee });
  } catch (error) {
    console.error('Create fee error:', error);
    res.status(500).json({ success: false, message: 'Failed to create fee' });
  }
});

// @route   PUT /api/admin/fees/:id
// @desc    Update fee details
// @access  Private (Admin only)
router.put('/fees/:id', authenticateToken, authorize('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { feeType, amount, dueDate, semester, academicYear, description, status } = req.body;

    const fee = await Fee.findByPk(id);
    if (!fee) {
      return res.status(404).json({ success: false, message: 'Fee not found' });
    }

    await fee.update({
      feeType,
      amount,
      dueDate,
      semester,
      academicYear,
      description,
      status
    });

    res.json({ success: true, fee });
  } catch (error) {
    console.error('Update fee error:', error);
    res.status(500).json({ success: false, message: 'Failed to update fee' });
  }
});

// @route   DELETE /api/admin/fees/:id
// @desc    Delete fee
// @access  Private (Admin only)
router.delete('/fees/:id', authenticateToken, authorize('admin'), async (req, res) => {
  try {
    const { id } = req.params;

    const fee = await Fee.findByPk(id);
    if (!fee) {
      return res.status(404).json({ success: false, message: 'Fee not found' });
    }

    await fee.destroy();

    res.json({ success: true, message: 'Fee deleted successfully' });
  } catch (error) {
    console.error('Delete fee error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete fee' });
  }
});

// @route   POST /api/admin/payments
// @desc    Record a payment
// @access  Private (Admin only)
router.post('/payments', authenticateToken, authorize('admin'), async (req, res) => {
  try {
    const { feeId, studentId, amount, paymentMethod, transactionId, remarks } = req.body;

    // Check if fee exists
    const fee = await Fee.findByPk(feeId);
    if (!fee) {
      return res.status(404).json({ success: false, message: 'Fee not found' });
    }

    // Create payment
    const payment = await Payment.create({
      feeId,
      studentId,
      amount,
      paymentMethod,
      transactionId,
      remarks,
      receivedBy: req.user.id,
      paymentDate: new Date()
    });

    // Update fee paid amount and status
    const newPaidAmount = parseFloat(fee.paidAmount) + parseFloat(amount);
    let status = 'pending';
    
    if (newPaidAmount >= parseFloat(fee.amount)) {
      status = 'paid';
    } else if (newPaidAmount > 0) {
      status = 'partial';
    }

    await fee.update({
      paidAmount: newPaidAmount,
      status
    });

    await AuditLog.create({
      userId: req.user.id,
      action: 'RECORD_PAYMENT',
      resource: 'Payment',
      resourceId: payment.id,
      details: { feeId, studentId, amount, paymentMethod },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      status: 'success'
    });

    res.status(201).json({ success: true, payment, fee });
  } catch (error) {
    console.error('Record payment error:', error);
    res.status(500).json({ success: false, message: 'Failed to record payment' });
  }
});

// @route   GET /api/admin/payments
// @desc    Get all payments
// @access  Private (Admin only)
router.get('/payments', authenticateToken, authorize('admin'), async (req, res) => {
  try {
    const payments = await Payment.findAll({
      include: [
        {
          model: Student,
          include: [{ model: User, attributes: ['firstName', 'lastName', 'email'] }]
        },
        {
          model: Fee,
          attributes: ['feeType', 'amount', 'semester', 'academicYear']
        },
        {
          model: User,
          as: 'receiver',
          attributes: ['firstName', 'lastName']
        }
      ],
      order: [['paymentDate', 'DESC']],
      limit: 50
    });

    res.json({ success: true, payments });
  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch payments' });
  }
});

// @route   GET /api/admin/fees/stats
// @desc    Get fee statistics
// @access  Private (Admin only)
router.get('/fees/stats', authenticateToken, authorize('admin'), async (req, res) => {
  try {
    const totalRevenue = await Payment.sum('amount') || 0;
    const totalDues = await Fee.sum('amount') || 0;
    const totalPaid = await Fee.sum('paidAmount') || 0;
    const pendingAmount = totalDues - totalPaid;

    const paidStudents = await Fee.count({
      where: { status: 'paid' },
      distinct: true,
      col: 'studentId'
    });

    const pendingPayments = await Fee.count({
      where: { status: { [Op.in]: ['pending', 'partial'] } }
    });

    const overduePayments = await Fee.count({
      where: { 
        status: { [Op.in]: ['pending', 'partial'] },
        dueDate: { [Op.lt]: new Date() }
      }
    });

    // Get current month revenue
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const thisMonthRevenue = await Payment.sum('amount', {
      where: {
        paymentDate: {
          [Op.gte]: startOfMonth
        }
      }
    }) || 0;

    res.json({
      success: true,
      stats: {
        totalRevenue,
        totalDues,
        totalPaid,
        pendingAmount,
        paidStudents,
        pendingPayments,
        overduePayments,
        thisMonthRevenue
      }
    });
  } catch (error) {
    console.error('Get fee stats error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch fee statistics' });
  }
});

// @route   GET /api/admin/fees/report
// @desc    Generate fee report
// @access  Private (Admin only)
router.get('/fees/report', authenticateToken, authorize('admin'), async (req, res) => {
  try {
    const { type = 'all', startDate, endDate, status, feeType } = req.query;

    let whereClause = {};
    if (status) whereClause.status = status;
    if (feeType) whereClause.feeType = feeType;
    if (startDate && endDate) {
      whereClause.dueDate = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    const fees = await Fee.findAll({
      where: whereClause,
      include: [
        {
          model: Student,
          include: [{ 
            model: User, 
            attributes: ['firstName', 'lastName', 'email'] 
          }]
        },
        {
          model: Payment
        }
      ],
      order: [['dueDate', 'DESC']]
    });

    // Calculate summary
    const summary = {
      totalFees: fees.length,
      totalAmount: fees.reduce((sum, fee) => sum + parseFloat(fee.amount), 0),
      totalPaid: fees.reduce((sum, fee) => sum + parseFloat(fee.paidAmount), 0),
      totalPending: fees.reduce((sum, fee) => {
        return sum + (parseFloat(fee.amount) - parseFloat(fee.paidAmount));
      }, 0),
      byStatus: {
        paid: fees.filter(f => f.status === 'paid').length,
        pending: fees.filter(f => f.status === 'pending').length,
        partial: fees.filter(f => f.status === 'partial').length,
        overdue: fees.filter(f => f.status === 'overdue').length
      },
      byType: {}
    };

    // Group by fee type
    fees.forEach(fee => {
      if (!summary.byType[fee.feeType]) {
        summary.byType[fee.feeType] = {
          count: 0,
          amount: 0,
          paid: 0
        };
      }
      summary.byType[fee.feeType].count++;
      summary.byType[fee.feeType].amount += parseFloat(fee.amount);
      summary.byType[fee.feeType].paid += parseFloat(fee.paidAmount);
    });

    res.json({
      success: true,
      report: {
        fees,
        summary,
        generatedAt: new Date(),
        filters: { type, startDate, endDate, status, feeType }
      }
    });
  } catch (error) {
    console.error('Generate report error:', error);
    res.status(500).json({ success: false, message: 'Failed to generate report' });
  }
});

export default router;
