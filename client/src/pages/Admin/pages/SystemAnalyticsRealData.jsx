import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, BookOpen, Activity } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../../utils/api';

const SystemAnalytics = () => {
  const [stats, setStats] = useState({ students: 0, teachers: 0, courses: 0, activeUsers: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const [usersRes, coursesRes] = await Promise.all([
        api.get('/admin/users'),
        api.get('/admin/courses')
      ]);

      const users = usersRes.data.users || [];
      const courses = coursesRes.data.courses || [];

      const students = users.filter(u => u.role === 'student').length;
      const teachers = users.filter(u => u.role === 'teacher').length;
      const activeUsers = users.filter(u => u.isActive).length;

      setStats({
        students,
        teachers,
        courses: courses.length,
        activeUsers
      });
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const monthlyData = [
    { month: 'Jan', students: Math.max(0, stats.students - 15), teachers: Math.max(0, stats.teachers - 5), courses: Math.max(0, stats.courses - 3) },
    { month: 'Feb', students: Math.max(0, stats.students - 12), teachers: Math.max(0, stats.teachers - 4), courses: Math.max(0, stats.courses - 2) },
    { month: 'Mar', students: Math.max(0, stats.students - 8), teachers: Math.max(0, stats.teachers - 2), courses: Math.max(0, stats.courses - 1) },
    { month: 'Apr', students: Math.max(0, stats.students - 4), teachers: Math.max(0, stats.teachers - 1), courses: stats.courses - 1 },
    { month: 'May', students: Math.max(0, stats.students - 2), teachers: stats.teachers, courses: stats.courses },
    { month: 'Jun', students: stats.students, teachers: stats.teachers, courses: stats.courses }
  ];

  const courseDistribution = [
    { name: 'Science', value: Math.ceil(stats.courses * 0.3) },
    { name: 'Engineering', value: Math.ceil(stats.courses * 0.4) },
    { name: 'Arts', value: Math.ceil(stats.courses * 0.2) },
    { name: 'Commerce', value: Math.ceil(stats.courses * 0.1) }
  ];

  const statsCards = [
    { label: 'Total Students', value: stats.students, growth: '+12%', icon: Users, color: 'from-blue-600 to-blue-400' },
    { label: 'Total Teachers', value: stats.teachers, growth: '+8%', icon: Activity, color: 'from-green-600 to-green-400' },
    { label: 'Active Courses', value: stats.courses, growth: '+15%', icon: BookOpen, color: 'from-purple-600 to-purple-400' },
    { label: 'System Health', value: '98%', growth: '+2%', icon: TrendingUp, color: 'from-orange-600 to-orange-400' },
  ];

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#6366F1'];

  if (loading) {
    return <div className="flex justify-center py-12"><div className="text-slate-500">Loading analytics...</div></div>;
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className={`glass-card p-6 bg-gradient-to-br ${stat.color}/10`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`bg-gradient-to-br ${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-green-600 font-semibold text-sm">{stat.growth}</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-sm">{stat.label}</p>
              <p className="text-3xl font-bold mt-2">{stat.value}</p>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-6">
          <h2 className="text-xl font-bold mb-4">Growth Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
              <XAxis dataKey="month" stroke="rgba(148,163,184,0.5)" />
              <YAxis stroke="rgba(148,163,184,0.5)" />
              <Tooltip contentStyle={{ backgroundColor: 'rgba(15,23,42,0.8)', border: 'none', borderRadius: '8px', color: '#f1f5f9' }} />
              <Legend />
              <Line type="monotone" dataKey="students" stroke="#3B82F6" strokeWidth={2} dot={{ fill: '#3B82F6', r: 4 }} />
              <Line type="monotone" dataKey="teachers" stroke="#10B981" strokeWidth={2} dot={{ fill: '#10B981', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-6">
          <h2 className="text-xl font-bold mb-4">Course Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={courseDistribution} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}`} outerRadius={100} fill="#3B82F6" dataKey="value">
                {courseDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: 'rgba(15,23,42,0.8)', border: 'none', borderRadius: '8px', color: '#f1f5f9' }} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-6">
        <h2 className="text-xl font-bold mb-4">Monthly Activity</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
            <XAxis dataKey="month" stroke="rgba(148,163,184,0.5)" />
            <YAxis stroke="rgba(148,163,184,0.5)" />
            <Tooltip contentStyle={{ backgroundColor: 'rgba(15,23,42,0.8)', border: 'none', borderRadius: '8px', color: '#f1f5f9' }} />
            <Legend />
            <Bar dataKey="students" fill="#3B82F6" radius={[8, 8, 0, 0]} />
            <Bar dataKey="courses" fill="#10B981" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-6">
        <h2 className="text-xl font-bold mb-4">System Performance</h2>
        <div className="space-y-3">
          {[
            { dept: 'Teachers', perf: Math.min(100, (stats.teachers / 50) * 100) },
            { dept: 'Courses Active', perf: Math.min(100, (stats.courses / 20) * 100) },
            { dept: 'Students Enrolled', perf: Math.min(100, (stats.students / 500) * 100) },
            { dept: 'System Uptime', perf: 98 }
          ].map((item, idx) => (
            <div key={idx} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{item.dept}</span>
                <span className="text-primary-500 font-bold">{Math.round(item.perf)}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-primary-500 to-blue-500 h-2 rounded-full" style={{ width: `${item.perf}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default SystemAnalytics;
