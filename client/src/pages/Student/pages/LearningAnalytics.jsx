import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, TrendingUp, BarChart3, PieChart as PieChartIcon, Clock } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../../../utils/api';
import toast from 'react-hot-toast';

const LearningAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [learningTime, setLearningTime] = useState([]);
  const [topicCoverage, setTopicCoverage] = useState([]);
  const [skillScore, setSkillScore] = useState([]);

  const mockLearningTime = [
    { day: 'Mon', hours: 2.5 },
    { day: 'Tue', hours: 3.2 },
    { day: 'Wed', hours: 2.8 },
    { day: 'Thu', hours: 3.5 },
    { day: 'Fri', hours: 4.1 },
    { day: 'Sat', hours: 2.3 },
    { day: 'Sun', hours: 1.8 }
  ];

  const mockTopicCoverage = [
    { name: 'Database Concepts', value: 85 },
    { name: 'Data Structures', value: 72 },
    { name: 'Web Development', value: 88 },
    { name: 'Software Design', value: 68 },
    { name: 'System Architecture', value: 75 }
  ];

  const mockSkillScore = [
    { name: 'Problem Solving', score: 85 },
    { name: 'Coding', score: 88 },
    { name: 'Communication', score: 76 },
    { name: 'Analytical', score: 82 },
    { name: 'Time Management', score: 79 },
    { name: 'Collaboration', score: 81 }
  ];

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      // const { data } = await api.get('/student/analytics');
      setLearningTime(mockLearningTime);
      setTopicCoverage(mockTopicCoverage);
      setSkillScore(mockSkillScore);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics');
      setLearningTime(mockLearningTime);
      setTopicCoverage(mockTopicCoverage);
      setSkillScore(mockSkillScore);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];
  const totalLearningTime = learningTime.reduce((acc, curr) => acc + curr.hours, 0);
  const avgDailyTime = (totalLearningTime / learningTime.length).toFixed(1);

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
        <h1 className="text-3xl lg:text-4xl font-bold mb-2">Learning Analytics</h1>
        <p className="text-slate-600 dark:text-slate-400">AI-powered insights into your learning patterns</p>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-5 h-5 text-blue-500" />
            <span className="text-sm text-slate-600 dark:text-slate-400">Total Learning Time</span>
          </div>
          <p className="text-3xl font-bold">{totalLearningTime.toFixed(1)}h</p>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">This week</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="w-5 h-5 text-green-500" />
            <span className="text-sm text-slate-600 dark:text-slate-400">Daily Average</span>
          </div>
          <p className="text-3xl font-bold">{avgDailyTime}h</p>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">Per day</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-purple-500" />
            <span className="text-sm text-slate-600 dark:text-slate-400">Topics Covered</span>
          </div>
          <p className="text-3xl font-bold">{topicCoverage.length}</p>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">Active topics</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <Brain className="w-5 h-5 text-orange-500" />
            <span className="text-sm text-slate-600 dark:text-slate-400">Avg Skill Score</span>
          </div>
          <p className="text-3xl font-bold">{(skillScore.reduce((a, b) => a + b.score, 0) / skillScore.length).toFixed(0)}</p>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">Out of 100</p>
        </motion.div>
      </div>

      {/* Learning Time Chart */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-6"
      >
        <h2 className="text-xl font-bold mb-4">Weekly Learning Time</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={learningTime}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.2)" />
            <XAxis dataKey="day" stroke="rgba(100,116,139,0.5)" />
            <YAxis stroke="rgba(100,116,139,0.5)" />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                borderRadius: '8px'
              }}
              labelStyle={{ color: '#fff' }}
            />
            <Bar dataKey="hours" fill="#3b82f6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Topic Coverage & Skills */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Topic Coverage */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6"
        >
          <h2 className="text-xl font-bold mb-4">Topic Coverage</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={topicCoverage}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {topicCoverage.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Skill Scores */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6"
        >
          <h2 className="text-xl font-bold mb-4">Skill Assessment</h2>
          <div className="space-y-4">
            {skillScore.map((skill, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-sm">{skill.name}</span>
                  <span className="text-sm font-bold text-primary-600">{skill.score}</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.score}%` }}
                    transition={{ delay: 0.3 + index * 0.1, duration: 0.8 }}
                    className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                  ></motion.div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card p-6"
      >
        <h2 className="text-xl font-bold mb-4">Learning Insights</h2>
        <div className="space-y-3">
          <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
            <p className="text-sm">
              <span className="font-semibold">💡 Peak Learning Hours:</span> You learn best between 10 AM - 12 PM. Consider scheduling important sessions during this time.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
            <p className="text-sm">
              <span className="font-semibold">✨ Strength:</span> Your problem-solving skills are excellent (85%). Keep focusing on complex challenges.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/30">
            <p className="text-sm">
              <span className="font-semibold">🎯 Development Area:</span> Communication skills (76%) need improvement. Try presenting ideas more frequently.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/30">
            <p className="text-sm">
              <span className="font-semibold">📈 Recommendation:</span> Increase study time for System Architecture topics to improve overall performance.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LearningAnalytics;
