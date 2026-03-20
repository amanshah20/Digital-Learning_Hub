import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Award, BarChart3, LineChart as LineChartIcon } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../../../utils/api';
import toast from 'react-hot-toast';

const Performance = () => {
  const [performanceData, setPerformanceData] = useState([]);
  const [subjectGrades, setSubjectGrades] = useState([]);
  const [gpaHistory, setGpaHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentGPA, setCurrentGPA] = useState(8.5);

  const mockPerformanceData = [
    { month: 'Jan', score: 75, target: 80 },
    { month: 'Feb', score: 78, target: 80 },
    { month: 'Mar', score: 82, target: 80 },
    { month: 'Apr', score: 85, target: 85 },
    { month: 'May', score: 88, target: 85 },
    { month: 'Jun', score: 87, target: 90 }
  ];

  const mockSubjectData = [
    { name: 'Database', grade: 'A', score: 92 },
    { name: 'Data Structures', grade: 'A', score: 88 },
    { name: 'Web Dev', grade: 'B+', score: 84 },
    { name: 'Software Eng', grade: 'A-', score: 86 },
    { name: 'System Design', grade: 'B+', score: 83 }
  ];

  const mockGPAHistory = [
    { semester: 'Sem 5', gpa: 7.8 },
    { semester: 'Sem 6', gpa: 8.2 },
    { semester: 'Sem 7', gpa: 8.5 }
  ];

  useEffect(() => {
    fetchPerformanceData();
  }, []);

  const fetchPerformanceData = async () => {
    try {
      setLoading(true);
      // const { data } = await api.get('/student/performance');
      setPerformanceData(mockPerformanceData);
      setSubjectGrades(mockSubjectData);
      setGpaHistory(mockGPAHistory);
    } catch (error) {
      console.error('Error fetching performance data:', error);
      toast.error('Failed to load performance data');
      setPerformanceData(mockPerformanceData);
      setSubjectGrades(mockSubjectData);
      setGpaHistory(mockGPAHistory);
    } finally {
      setLoading(false);
    }
  };

  const getGradeColor = (grade) => {
    if (grade.includes('A')) return 'from-green-500 to-green-600 text-white';
    if (grade.includes('B')) return 'from-blue-500 to-blue-600 text-white';
    if (grade.includes('C')) return 'from-yellow-500 to-yellow-600 text-white';
    return 'from-red-500 to-red-600 text-white';
  };

  const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4'];

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 lg:p-8"
      >
        <h1 className="text-3xl lg:text-4xl font-bold mb-2">Performance Analytics</h1>
        <p className="text-slate-600 dark:text-slate-400">Track your academic performance and progress</p>
      </motion.div>

      {/* GPA Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-600 dark:text-slate-400">Current GPA</h3>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-4xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
            {currentGPA}
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Out of 10.0</p>
          <div className="mt-4 w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full" style={{width: `${(currentGPA/10)*100}%`}}></div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-600 dark:text-slate-400">Rank</h3>
            <Award className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-4xl font-bold">12</p>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Out of 120 students</p>
          <div className="mt-4 text-sm text-blue-600 dark:text-blue-400">Top 10% • +2 positions</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-600 dark:text-slate-400">Attendance</h3>
            <BarChart3 className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-4xl font-bold">92%</p>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Excellent attendance</p>
          <div className="mt-4 w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" style={{width: '92%'}}></div>
          </div>
        </motion.div>
      </div>

      {/* Performance Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Line Chart - Score Trend */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6"
        >
          <h2 className="text-xl font-bold mb-4">Score Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.2)" />
              <XAxis dataKey="month" stroke="rgba(100,116,139,0.5)" />
              <YAxis stroke="rgba(100,116,139,0.5)" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid rgba(148, 163, 184, 0.2)',
                  borderRadius: '8px'
                }}
                labelStyle={{ color: '#fff' }}
              />
              <Legend />
              <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', r: 5 }} name="Your Score" />
              <Line type="monotone" dataKey="target" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" dot={{ fill: '#10b981', r: 5 }} name="Target" />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Bar Chart - Subject Scores */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6"
        >
          <h2 className="text-xl font-bold mb-4">Subject Performance</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={subjectGrades}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.2)" />
              <XAxis dataKey="name" stroke="rgba(100,116,139,0.5)" />
              <YAxis stroke="rgba(100,116,139,0.5)" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid rgba(148, 163, 184, 0.2)',
                  borderRadius: '8px'
                }}
                labelStyle={{ color: '#fff' }}
              />
              <Bar dataKey="score" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Subject Grades Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card p-6"
      >
        <h2 className="text-xl font-bold mb-4">Subject Grades</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {subjectGrades.map((subject, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + index * 0.05 }}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-center"
            >
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{subject.name}</p>
              <div className={`p-3 rounded-lg bg-gradient-to-br ${getGradeColor(subject.grade)} mb-2`}>
                <p className="text-2xl font-bold">{subject.grade}</p>
              </div>
              <p className="text-sm font-semibold">{subject.score}%</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* GPA History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card p-6"
      >
        <h2 className="text-xl font-bold mb-4">GPA History</h2>
        <div className="space-y-3">
          {gpaHistory.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-white/30 dark:bg-slate-800/30">
              <span className="font-medium">{item.semester}</span>
              <div className="flex items-center gap-3">
                <div className="w-24 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full" style={{width: `${(item.gpa/10)*100}%`}}></div>
                </div>
                <span className="font-bold min-w-12">{item.gpa}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Performance;
