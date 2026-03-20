import express from 'express';
import passport from 'passport';
import { User, Student, Teacher } from '../models/index.js';
import { generateToken } from '../middleware/auth.js';
import { AuditLog } from '../models/index.js';

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public (for students/teachers)
router.post('/register', async (req, res) => {
  try {
    const { email, password, role, firstName, lastName, enrollmentNumber, employeeId } = req.body;

    // Validation
    if (!email || !password || !role || !firstName || !lastName) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    if (role === 'admin') {
      return res.status(403).json({ success: false, message: 'Cannot register as admin' });
    }

    if (role === 'student' && !enrollmentNumber) {
      return res.status(400).json({ success: false, message: 'Enrollment number is required for students' });
    }

    if (role === 'teacher' && !employeeId) {
      return res.status(400).json({ success: false, message: 'Employee ID is required for teachers' });
    }

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
    if (role === 'student') {
      await Student.create({
        userId: user.id,
        enrollmentNumber
      });
    } else if (role === 'teacher') {
      await Teacher.create({
        userId: user.id,
        employeeId
      });
    }

    // Generate token
    const token = generateToken(user.id);

    // Log audit
    await AuditLog.create({
      userId: user.id,
      action: 'REGISTER',
      resource: 'User',
      resourceId: user.id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      status: 'success'
    });

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: 'Server error during registration' });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    // Find user
    const user = await User.findOne({ 
      where: { email },
      include: [
        { model: Student, required: false },
        { model: Teacher, required: false }
      ]
    });

    if (!user) {
      await AuditLog.create({
        userId: null,
        action: 'LOGIN_FAILED',
        resource: 'User',
        details: { email },
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        status: 'failure'
      });
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (!await user.comparePassword(password)) {
      await AuditLog.create({
        userId: user.id,
        action: 'LOGIN_FAILED',
        resource: 'User',
        details: { email },
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        status: 'failure'
      });
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Account is inactive' });
    }

    // Update login stats
    user.lastLogin = new Date();
    user.loginCount += 1;
    await user.save();

    // Generate token
    const token = generateToken(user.id);

    // Log audit
    await AuditLog.create({
      userId: user.id,
      action: 'LOGIN',
      resource: 'User',
      resourceId: user.id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      status: 'success'
    });

    const userResponse = {
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar
    };

    if (user.Student) {
      userResponse.studentProfile = {
        id: user.Student.id,
        enrollmentNumber: user.Student.enrollmentNumber,
        semester: user.Student.semester,
        level: user.Student.level,
        xpPoints: user.Student.xpPoints
      };
    }

    if (user.Teacher) {
      userResponse.teacherProfile = {
        id: user.Teacher.id,
        employeeId: user.Teacher.employeeId,
        department: user.Teacher.department
      };
    }

    res.json({
      success: true,
      token,
      user: userResponse
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
});

// @route   GET /api/auth/google
// @desc    Google OAuth
// @access  Public
router.get('/google', (req, res, next) => {
  const { role } = req.query;
  if (!role || !['student', 'teacher'].includes(role)) {
    return res.status(400).json({ success: false, message: 'Valid role required' });
  }
  req.session.registrationRole = role;
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});

// @route   GET /api/auth/google/callback
// @desc    Google OAuth callback
// @access  Public
router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  async (req, res) => {
    try {
      if (!req.user && req.authInfo?.profile) {
        // New Google user - need to complete registration
        const profile = req.authInfo.profile;
        const role = req.session.registrationRole || 'student';

        // Create user
        const user = await User.create({
          email: profile.emails[0].value,
          googleId: profile.id,
          role,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          avatar: profile.photos[0]?.value,
          isActive: true
        });

        // Create role-specific profile - needs to be completed later
        if (role === 'student') {
          await Student.create({
            userId: user.id,
            enrollmentNumber: `TEMP-${Date.now()}` // Temporary, needs update
          });
        } else if (role === 'teacher') {
          await Teacher.create({
            userId: user.id,
            employeeId: `TEMP-${Date.now()}` // Temporary, needs update
          });
        }

        req.user = user;
      }

      const token = generateToken(req.user.id);
      
      // Redirect to frontend with token
      res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}`);
    } catch (error) {
      console.error('Google callback error:', error);
      res.redirect(`${process.env.CLIENT_URL}/login?error=authentication_failed`);
    }
  }
);

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] },
      include: [
        { model: Student, required: false },
        { model: Teacher, required: false }
      ]
    });

    res.json({ success: true, user });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/auth/change-password
// @desc    Change password
// @access  Private
router.post('/change-password', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Please provide both passwords' });
    }

    const user = await User.findByPk(req.user.id);

    if (user.password && !await user.comparePassword(currentPassword)) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    await AuditLog.create({
      userId: user.id,
      action: 'PASSWORD_CHANGE',
      resource: 'User',
      resourceId: user.id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      status: 'success'
    });

    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;
