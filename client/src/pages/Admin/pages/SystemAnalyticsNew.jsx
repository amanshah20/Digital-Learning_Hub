import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, BookOpen, Activity } from 'lucide-react';

const SystemAnalytics = () => {
  const monthlyData = [
    { month: 'Jan', students: 120, teachers: 15, courses: 8 },
    { month: 'Feb', students: 145, teachers: 18, courses: 9 },
    { month: 'Mar', students: 168, teachers: 20, courses: 11 },
    { month: 'Apr', students: 192, teachers: 22, courses: 12 },
    { month: 'May', students: 218, teachers: 25, courses: 14 },
    { month: 'Jun', students: 245, teachers: 28, courses: 16 },
  ];

  const courseDistribution = [
    { name: 'Engineering', value: 45 },
    { name: 'Science', value: 30 },
    { name: 'Arts', value: 15 },
    { name: 'Commerce', value: 10 },
  ];

  const statsCards = [
    { label: 'Total Students', value: 245, growth: '+12%', icon: Users, color: 'from-blue-600 to-blue-400' },
    { label: 'Total Teachers', value: 28, growth: '+8%', icon: Activity, color: 'from-green-600 to-green-400' },
    { label: 'Active Courses', value: 16, growth: '+15%', icon: BookOpen, color: 'from-purple-600 to-purple-400' },
    { label: 'System Health', value: '98%', growth: '+2%', icon: TrendingUp, color: 'from-orange-600 to-orange-400' },
  ];

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#6366F1'];

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
        <h2 className="text-xl font-bold mb-4">Department Performance</h2>
        <div className="space-y-3">
          {[
            { dept: 'Engineering', perf: 92 },
            { dept: 'Science', perf: 88 },
            { dept: 'Arts', perf: 85 },
            { dept: 'Commerce', perf: 90 },
          ].map((item, idx) => (
            <div key={idx} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{item.dept}</span>
                <span className="text-primary-500 font-bold">{item.perf}%</span>
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
