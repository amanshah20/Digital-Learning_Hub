import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, GraduationCap, BookOpen, Activity } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../../../utils/api';
import toast from 'react-hot-toast';

const SystemAnalytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/admin/stats');
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const statsData = stats ? [
    { icon: Users, label: 'Total Students', value: stats.totalStudents, color: 'from-blue-500 to-blue-600', bgColor: 'bg-blue-500/10' },
    { icon: GraduationCap, label: 'Total Teachers', value: stats.totalTeachers, color: 'from-green-500 to-green-600', bgColor: 'bg-green-500/10' },
    { icon: BookOpen, label: 'Active Courses', value: stats.totalCourses, color: 'from-purple-500 to-purple-600', bgColor: 'bg-purple-500/10' },
    { icon: Activity, label: 'Total Subjects', value: stats.totalSubjects || 0, color: 'from-orange-500 to-orange-600', bgColor: 'bg-orange-500/10' }
  ] : [];

  const growthData = [
    { month: 'Jan', students: 120, teachers: 15 },
    { month: 'Feb', students: 145, teachers: 18 },
    { month: 'Mar', students: 178, teachers: 22 },
    { month: 'Apr', students: 201, teachers: 25 },
    { month: 'May', students: 234, teachers: 28 },
    { month: 'Jun', students: 267, teachers: 32 }
  ];

  const courseDistribution = [
    { name: 'Computer Science', value: 45 },
    { name: 'Engineering', value: 30 },
    { name: 'Business', value: 15 },
    { name: 'Arts', value: 10 }
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6"
      >
        <h1 className="text-3xl font-bold mb-2">System Analytics</h1>
        <p className="text-slate-600 dark:text-slate-400">
          View institutional analytics and performance metrics
        </p>
      </motion.div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="loading-spinner"></div>
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {statsData.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
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
                </div>
              </motion.div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Growth Trend */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card p-6"
            >
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary-500" />
                Growth Trend
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={growthData}>
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
                  <Line type="monotone" dataKey="students" stroke="#3b82f6" strokeWidth={2} name="Students" />
                  <Line type="monotone" dataKey="teachers" stroke="#10b981" strokeWidth={2} name="Teachers" />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Course Distribution */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card p-6"
            >
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary-500" />
                Course Distribution
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={courseDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {courseDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6"
          >
            <h2 className="text-xl font-bold mb-4">System Health</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="font-semibold text-green-700 dark:text-green-400">All Systems Operational</span>
                </div>
                <p className="text-sm text-green-600 dark:text-green-500 mt-2">Server uptime: 99.9%</p>
              </div>
              <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                <div className="font-semibold text-blue-700 dark:text-blue-400">Database Status</div>
                <p className="text-sm text-blue-600 dark:text-blue-500 mt-2">Healthy • 2.3GB used</p>
              </div>
              <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
                <div className="font-semibold text-purple-700 dark:text-purple-400">Active Users</div>
                <p className="text-sm text-purple-600 dark:text-purple-500 mt-2">{stats.totalStudents + stats.totalTeachers} registered</p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
};

export default SystemAnalytics;
