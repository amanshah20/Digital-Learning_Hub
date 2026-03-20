import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Calendar,
  CheckSquare,
  TrendingUp,
  Award,
  Clock,
  AlertCircle,
  Target,
  Zap
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAuthStore } from '../../../store/authStore';
import api from '../../../utils/api';
import toast from 'react-hot-toast';

const Overview = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState([]);
  const [upcomingClasses, setUpcomingClasses] = useState([]);
  const [pendingAssignments, setPendingAssignments] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);
  const [subjectMarks, setSubjectMarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/student/dashboard');
      if (data.success && data.stats) {
        // Map API stats to the expected format
        const mappedStats = [
          {
            icon: BookOpen,
            label: 'Subjects Enrolled',
            value: data.stats.subjectsEnrolled.toString(),
            change: 'Current semester',
            color: 'from-blue-500 to-blue-600',
            bgColor: 'bg-blue-500/10'
          },
          {
            icon: Calendar,
            label: 'Attendance Rate',
            value: `${data.stats.attendanceRate}%`,
            change: 'Overall performance',
            color: 'from-green-500 to-green-600',
            bgColor: 'bg-green-500/10'
          },
          {
            icon: CheckSquare,
            label: 'Pending Assignments',
            value: data.stats.pendingAssignments.toString(),
            change: 'Due soon',
            color: 'from-orange-500 to-orange-600',
            bgColor: 'bg-orange-500/10'
          },
          {
            icon: TrendingUp,
            label: 'XP Points',
            value: data.stats.currentGPA.toString(),
            change: 'Keep it up!',
            color: 'from-purple-500 to-purple-600',
            bgColor: 'bg-purple-500/10'
          }
        ];
        setStats(mappedStats);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 lg:p-8"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl lg:text-4xl font-display font-bold mb-2">
              Welcome back, <span className="text-gradient">{user?.firstName}</span>!
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Here's your learning journey for today
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 mb-2 shadow-lg">
                <Award className="w-8 h-8 text-white" />
              </div>
              <div className="text-sm font-semibold">Level {user?.studentProfile?.level || 1}</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-500 to-orange-600 mb-2 shadow-lg">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <div className="text-sm font-semibold">{user?.studentProfile?.xpPoints || 0} XP</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="loading-spinner"></div>
        </div>
      ) : (
        <>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {stats.length > 0 ? stats.map((stat, index) => (
          <motion.div
            key={index}
            variants={item}
            className="stat-card group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bgColor} group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-6 h-6 text-current" />
              </div>
            </div>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">{stat.label}</p>
              <h3 className="text-3xl font-bold mb-1">{stat.value}</h3>
              <p className="text-xs text-slate-500">{stat.change}</p>
            </div>
          </motion.div>
        )) : (
          <div className="col-span-4 text-center text-slate-500 py-8">
            No statistics available
          </div>
        )}
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upcoming Classes */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary-500" />
              Today's Schedule
            </h2>
          </div>
          <div className="space-y-3">
            {upcomingClasses.length > 0 ? upcomingClasses.map((cls, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-white/50 to-transparent dark:from-slate-800/50 dark:to-transparent border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all"
              >
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{cls.subject}</h3>
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <Clock className="w-4 h-4" />
                    <span>{cls.time}</span>
                    <span>•</span>
                    <span>{cls.room}</span>
                  </div>
                </div>
                <span className="badge badge-info">{cls.type}</span>
              </div>
            )) : (
              <p className="text-center text-slate-500 py-8">No classes scheduled for today</p>
            )}
          </div>
        </motion.div>

        {/* Pending Assignments */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-500" />
              Pending Assignments
            </h2>
          </div>
          <div className="space-y-3">
            {pendingAssignments.length > 0 ? pendingAssignments.map((assignment, index) => (
              <div
                key={index}
                className="p-4 rounded-xl bg-gradient-to-r from-white/50 to-transparent dark:from-slate-800/50 dark:to-transparent border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold flex-1">{assignment.title}</h3>
                  <span className={`badge ${
                    assignment.priority === 'high' ? 'badge-danger' :
                    assignment.priority === 'medium' ? 'badge-warning' :
                    'badge-info'
                  }`}>
                    {assignment.priority}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">{assignment.subject}</span>
                  <span className="flex items-center gap-1 text-orange-600 dark:text-orange-400 font-medium">
                    <Target className="w-4 h-4" />
                    Due in {assignment.due}
                  </span>
                </div>
              </div>
            )) : (
              <p className="text-center text-slate-500 py-8">No pending assignments</p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Performance Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* GPA & Attendance Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6"
        >
          <h2 className="text-xl font-bold mb-4">Performance Trend</h2>
          {performanceData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={performanceData}>
              <defs>
                <linearGradient id="gpaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="attendanceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
              <XAxis dataKey="month" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.9)',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#fff'
                }}
              />
              <Legend />
              <Area type="monotone" dataKey="gpa" stroke="#8b5cf6" fillOpacity={1} fill="url(#gpaGradient)" name="GPA" />
              <Area type="monotone" dataKey="attendance" stroke="#10b981" fillOpacity={1} fill="url(#attendanceGradient)" name="Attendance %" />
            </AreaChart>
          </ResponsiveContainer>
          ) : (
            <p className="text-center text-slate-500 py-20">No performance data available</p>
          )}
        </motion.div>

        {/* Subject-wise Marks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-6"
        >
          <h2 className="text-xl font-bold mb-4">Subject-wise Performance</h2>
          {subjectMarks.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={subjectMarks}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
              <XAxis dataKey="subject" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.9)',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#fff'
                }}
              />
              <Bar dataKey="marks" fill="url(#barGradient)" radius={[8, 8, 0, 0]} />
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
          ) : (
            <p className="text-center text-slate-500 py-20">No subject data available</p>
          )}
        </motion.div>
      </div>
        </>
      )}

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass-card p-6"
      >
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="btn-primary flex flex-col items-center gap-2 py-4">
            <CheckSquare className="w-6 h-6" />
            <span>Mark Attendance</span>
          </button>
          <button className="btn-secondary flex flex-col items-center gap-2 py-4">
            <BookOpen className="w-6 h-6" />
            <span>Study Materials</span>
          </button>
          <button className="btn-outline flex flex-col items-center gap-2 py-4">
            <Target className="w-6 h-6" />
            <span>Set Goal</span>
          </button>
          <button className="glass-button flex flex-col items-center gap-2 py-4">
            <Award className="w-6 h-6" />
            <span>View Badges</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Overview;
