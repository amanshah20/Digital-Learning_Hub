import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Users, CheckSquare, TrendingUp, QrCode } from 'lucide-react';
import api from '../../../utils/api';
import toast from 'react-hot-toast';

const TeacherOverview = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/teacher/dashboard');
      if (data.success && data.stats) {
        const mappedStats = [
          { icon: BookOpen, label: 'Total Classes', value: data.stats.totalClasses.toString(), color: 'from-blue-500 to-blue-600' },
          { icon: Users, label: 'Total Students', value: data.stats.totalStudents.toString(), color: 'from-green-500 to-green-600' },
          { icon: CheckSquare, label: 'Total Subjects', value: data.stats.totalSubjects.toString(), color: 'from-purple-500 to-purple-600' },
          { icon: TrendingUp, label: 'Avg Attendance', value: `${data.stats.avgAttendance}%`, color: 'from-orange-500 to-orange-600' }
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

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6"
      >
        <h1 className="text-3xl font-bold mb-2">Teacher Dashboard</h1>
        <p className="text-slate-600 dark:text-slate-400">
          Welcome back! Here's your teaching overview
        </p>
      </motion.div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="loading-spinner"></div>
        </div>
      ) : stats.length > 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="stat-card"
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center mb-4`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            <div className="text-3xl font-bold mb-1">{stat.value}</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</div>
          </motion.div>
        ))}
      </div>
      ) : (
        <div className="glass-card p-12 text-center">
          <p className="text-slate-500">No statistics available</p>
        </div>
      )}

      <div className="glass-card p-6">
        <h2 className="text-xl font-bold mb-4">Today's Schedule</h2>
        <p>Your classes and activities for today will appear here</p>
      </div>
    </div>
  );
};

export default TeacherOverview;
