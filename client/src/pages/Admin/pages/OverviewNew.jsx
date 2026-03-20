import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, GraduationCap, BookOpen, Activity, TrendingUp, UserCheck } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';
import api from '../../../utils/api';

const AdminOverview = () => {
  const [stats, setStats] = useState({ totalStudents: 0, totalTeachers: 0, totalCourses: 0, activeUsers: 0 });
  const [loading, setLoading] = useState(true);
  const [auditLogs, setAuditLogs] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [usersRes, coursesRes, auditRes] = await Promise.all([
        api.get('/admin/users'),
        api.get('/admin/courses'),
        api.get('/admin/audit-logs?limit=6')
      ]);

      const users = usersRes.data.users || [];
      const courses = coursesRes.data.courses || [];
      const logs = auditRes.data.logs || [];

      const students = users.filter(u => u.role === 'student').length;
      const teachers = users.filter(u => u.role === 'teacher').length;
      const activeUsers = users.filter(u => u.isActive).length;

      setStats({
        totalStudents: students,
        totalTeachers: teachers,
        totalCourses: courses.length,
        activeUsers
      });

      setAuditLogs(logs);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const growthData = [
    { month: 'Dec', students: stats.totalStudents - 15, teachers: stats.totalTeachers - 5 },
    { month: 'Jan', students: stats.totalStudents - 12, teachers: stats.totalTeachers - 4 },
    { month: 'Feb', students: stats.totalStudents - 8, teachers: stats.totalTeachers - 2 },
    { month: 'Mar', students: stats.totalStudents - 4, teachers: stats.totalTeachers - 1 },
    { month: 'Apr', students: stats.totalStudents - 2, teachers: stats.totalTeachers },
    { month: 'May', students: stats.totalStudents, teachers: stats.totalTeachers }
  ];

  const activityData = [
    { month: 'Week 1', enrollments: 15, assignments: 12, submissions: 10 },
    { month: 'Week 2', enrollments: 22, assignments: 18, submissions: 15 },
    { month: 'Week 3', enrollments: 18, assignments: 14, submissions: 12 },
    { month: 'Week 4', enrollments: 25, assignments: 20, submissions: 18 }
  ];

  const formatActivityType = (action) => {
    const actionMap = {
      'CREATE_USER': 'User Created',
      'CREATE_COURSE': 'Course Added',
      'UPDATE_USER': 'User Updated',
      'CREATE_ASSIGNMENT': 'Assignment Created',
      'SUBMIT_ASSIGNMENT': 'Assignment Submitted'
    };
    return actionMap[action] || action.replace(/_/g, ' ');
  };

  const formatActivityDescription = (log) => {
    return `${log.action} by ${log.User?.firstName || 'Admin'} ${log.User?.lastName || ''}`;
  };

  const getActivityIcon = (action) => {
    const iconMap = {
      'CREATE_USER': Users,
      'CREATE_COURSE': BookOpen,
      'UPDATE_USER': Activity,
      'CREATE_ASSIGNMENT': BookOpen,
      'SUBMIT_ASSIGNMENT': UserCheck
    };
    return iconMap[action] || Activity;
  };

  const recentActivities = auditLogs.map((log, idx) => ({
    id: log.id,
    type: formatActivityType(log.action),
    description: formatActivityDescription(log),
    time: new Date(log.createdAt).toLocaleTimeString(),
    icon: getActivityIcon(log.action),
    color: ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-indigo-500', 'bg-pink-500'][idx % 6]
  }));

  const statCards = [
    { icon: Users, label: 'Total Students', value: stats.totalStudents, change: '+12%', color: 'from-blue-600 to-blue-400', bgColor: 'bg-blue-500/10' },
    { icon: GraduationCap, label: 'Total Teachers', value: stats.totalTeachers, change: '+8%', color: 'from-green-600 to-green-400', bgColor: 'bg-green-500/10' },
    { icon: BookOpen, label: 'Active Courses', value: stats.totalCourses, change: '+15%', color: 'from-purple-600 to-purple-400', bgColor: 'bg-purple-500/10' },
    { icon: Activity, label: 'Active Users', value: stats.activeUsers, change: '+5%', color: 'from-orange-600 to-orange-400', bgColor: 'bg-orange-500/10' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`glass-card p-6 bg-gradient-to-br ${stat.bgColor}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`bg-gradient-to-br ${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-green-600 font-semibold text-sm">{stat.change}</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-sm">{stat.label}</p>
              <p className="text-3xl font-bold mt-2">{stat.value}</p>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-6"
        >
          <h2 className="text-xl font-bold mb-4">Student & Teacher Growth</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={growthData}>
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

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6"
        >
          <h2 className="text-xl font-bold mb-4">Weekly Activity</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
              <XAxis dataKey="month" stroke="rgba(148,163,184,0.5)" />
              <YAxis stroke="rgba(148,163,184,0.5)" />
              <Tooltip contentStyle={{ backgroundColor: 'rgba(15,23,42,0.8)', border: 'none', borderRadius: '8px', color: '#f1f5f9' }} />
              <Legend />
              <Bar dataKey="enrollments" fill="#3B82F6" radius={[8, 8, 0, 0]} />
              <Bar dataKey="submissions" fill="#10B981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Recent Activities */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-6"
      >
        <h2 className="text-xl font-bold mb-4">Recent Activities</h2>
        <div className="space-y-3">
          {recentActivities.map((activity, idx) => {
            const Icon = activity.icon;
            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="flex items-center gap-4 p-4 rounded-lg hover:bg-white/30 dark:hover:bg-slate-800/30 transition-all"
              >
                <div className={`${activity.color} p-3 rounded-lg`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{activity.type}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 truncate">{activity.description}</p>
                </div>
                <span className="text-xs text-slate-500 whitespace-nowrap">{activity.time}</span>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-6"
      >
        <h2 className="text-xl font-bold mb-4">System Performance</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 rounded-lg bg-white/20 dark:bg-slate-800/50">
            <p className="text-2xl font-bold text-primary-500">98%</p>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Uptime</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-white/20 dark:bg-slate-800/50">
            <p className="text-2xl font-bold text-green-500">45ms</p>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Response Time</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-white/20 dark:bg-slate-800/50">
            <p className="text-2xl font-bold text-blue-500">12.5GB</p>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Storage Used</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-white/20 dark:bg-slate-800/50">
            <p className="text-2xl font-bold text-orange-500">2.1GB</p>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Available</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminOverview;
