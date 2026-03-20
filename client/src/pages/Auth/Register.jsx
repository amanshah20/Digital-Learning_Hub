import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, GraduationCap, CreditCard } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';
import api from '../../utils/api';
import Background3D from '../../components/Background3D';

const Register = () => {
  const [role, setRole] = useState('student');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    enrollmentNumber: '',
    employeeId: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      return toast.error('Passwords do not match');
    }

    if (role === 'student' && !formData.enrollmentNumber) {
      return toast.error('Enrollment number is required');
    }

    if (role === 'teacher' && !formData.employeeId) {
      return toast.error('Employee ID is required');
    }

    setLoading(true);

    try {
      const response = await api.post('/auth/register', {
        ...formData,
        role
      });
      
      if (response.data.success && response.data.user && response.data.token) {
        login(response.data.user, response.data.token);
        toast.success('Registration successful!');
        
        const roleRoute = { student: '/student', teacher: '/teacher' };
        navigate(roleRoute[role]);
      } else {
        toast.error('Invalid response from server');
      }
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = (selectedRole) => {
    window.location.href = `http://localhost:5000/api/auth/google?role=${selectedRole}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-primary-500 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-secondary-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-accent-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>
      
      <Background3D />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl z-10"
      >
        <div className="glass-card p-8">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 mb-4 shadow-2xl"
            >
              <GraduationCap className="w-10 h-10 text-white" />
            </motion.div>
            <h1 className="text-4xl font-display font-bold text-gradient mb-2">
              Join EduVerse
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Start your learning adventure today
            </p>
          </div>

          {/* Role Selection */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              type="button"
              onClick={() => setRole('student')}
              className={`p-4 rounded-xl border-2 transition-all ${
                role === 'student'
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-slate-200 dark:border-slate-700 hover:border-primary-300'
              }`}
            >
              <GraduationCap className={`w-8 h-8 mx-auto mb-2 ${
                role === 'student' ? 'text-primary-600' : 'text-slate-400'
              }`} />
              <div className="font-semibold">Student</div>
            </button>
            <button
              type="button"
              onClick={() => setRole('teacher')}
              className={`p-4 rounded-xl border-2 transition-all ${
                role === 'teacher'
                  ? 'border-secondary-500 bg-secondary-50 dark:bg-secondary-900/20'
                  : 'border-slate-200 dark:border-slate-700 hover:border-secondary-300'
              }`}
            >
              <User className={`w-8 h-8 mx-auto mb-2 ${
                role === 'teacher' ? 'text-secondary-600' : 'text-slate-400'
              }`} />
              <div className="font-semibold">Teacher</div>
            </button>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">First Name</label>
                <input
                  type="text"
                  required
                  className="input-modern"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Last Name</label>
                <input
                  type="text"
                  required
                  className="input-modern"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  required
                  className="input-modern pl-11"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            {role === 'student' && (
              <div>
                <label className="block text-sm font-medium mb-2">Enrollment Number</label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    required
                    className="input-modern pl-11"
                    placeholder="ENR2024001"
                    value={formData.enrollmentNumber}
                    onChange={(e) => setFormData({ ...formData, enrollmentNumber: e.target.value })}
                  />
                </div>
              </div>
            )}

            {role === 'teacher' && (
              <div>
                <label className="block text-sm font-medium mb-2">Employee ID</label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    required
                    className="input-modern pl-11"
                    placeholder="EMP2024001"
                    value={formData.employeeId}
                    onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="password"
                    required
                    className="input-modern pl-11"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="password"
                    required
                    className="input-modern pl-11"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? <div className="loading-spinner border-white"></div> : 'Create Account'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-300 dark:border-slate-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white/70 dark:bg-slate-900/70 text-slate-500">
                Or register with
              </span>
            </div>
          </div>

          {/* Google Register */}
          <button
            type="button"
            onClick={() => handleGoogleRegister(role)}
            className="glass-button w-full py-3 flex items-center justify-center gap-3 font-medium"
          >
            <FcGoogle className="w-5 h-5" />
            Continue with Google
          </button>

          {/* Login Link */}
          <p className="text-center text-sm text-slate-600 dark:text-slate-400 mt-6">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-primary-600 dark:text-primary-400 font-semibold hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
