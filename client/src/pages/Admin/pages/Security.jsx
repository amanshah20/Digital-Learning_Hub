import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle, CheckCircle, Activity, Clock, User } from 'lucide-react';

const Security = () => {
  const securityMetrics = [
    { icon: Shield, label: 'Security Score', value: '98%', status: 'excellent', color: 'from-green-500 to-green-600' },
    { icon: AlertTriangle, label: 'Failed Login Attempts', value: '3', status: 'low', color: 'from-orange-500 to-orange-600' },
    { icon: CheckCircle, label: 'Active Sessions', value: '127', status: 'normal', color: 'from-blue-500 to-blue-600' },
    { icon: Activity, label: 'API Requests Today', value: '2.4K', status: 'normal', color: 'from-purple-500 to-purple-600' }
  ];

  const recentActivities = [
    { user: 'System Administrator', action: 'User created', resource: 'User: john.doe@example.com', time: '2 minutes ago', status: 'success' },
    { user: 'admin@eduverse.com', action: 'Login successful', resource: 'Admin Panel', time: '5 minutes ago', status: 'success' },
    { user: 'Unknown', action: 'Failed login attempt', resource: 'IP: 192.168.1.45', time: '10 minutes ago', status: 'warning' },
    { user: 'System', action: 'Database backup', resource: 'eduverse.db', time: '1 hour ago', status: 'success' },
    { user: 'admin@eduverse.com', action: 'Course updated', resource: 'Course: Computer Science', time: '2 hours ago', status: 'success' },
  ];

  const securitySettings = [
    { name: 'Two-Factor Authentication', status: true, description: 'Require 2FA for admin accounts' },
    { name: 'Session Timeout', status: true, description: '30 minutes of inactivity' },
    { name: 'IP Whitelist', status: false, description: 'Restrict access by IP address' },
    { name: 'Audit Logging', status: true, description: 'Log all user actions' },
    { name: 'Password Policy', status: true, description: 'Minimum 8 characters with special chars' },
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6"
      >
        <h1 className="text-3xl font-bold mb-2">Security & Audit</h1>
        <p className="text-slate-600 dark:text-slate-400">
          Monitor system security, view audit logs, and manage security settings
        </p>
      </motion.div>

      {/* Security Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {securityMetrics.map((metric, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="stat-card"
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${metric.color} flex items-center justify-center mb-4`}>
              <metric.icon className="w-6 h-6 text-white" />
            </div>
            <div className="text-3xl font-bold mb-1">{metric.value}</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">{metric.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity Log */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6"
      >
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary-500" />
          Recent Activity Log
        </h2>
        <div className="space-y-3">
          {recentActivities.map((activity, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  activity.status === 'success' ? 'bg-green-100 dark:bg-green-900/30' :
                  activity.status === 'warning' ? 'bg-orange-100 dark:bg-orange-900/30' :
                  'bg-red-100 dark:bg-red-900/30'
                }`}>
                  <User className={`w-5 h-5 ${
                    activity.status === 'success' ? 'text-green-600' :
                    activity.status === 'warning' ? 'text-orange-600' :
                    'text-red-600'
                  }`} />
                </div>
                <div className="flex-1">
                  <div className="font-medium">{activity.action}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    {activity.user} • {activity.resource}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Clock className="w-4 h-4" />
                {activity.time}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Security Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6"
      >
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary-500" />
          Security Settings
        </h2>
        <div className="space-y-4">
          {securitySettings.map((setting, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700"
            >
              <div className="flex-1">
                <div className="font-semibold">{setting.name}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">{setting.description}</div>
              </div>
              <div className={`px-4 py-2 rounded-full font-medium text-sm ${
                setting.status
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
              }`}>
                {setting.status ? 'Enabled' : 'Disabled'}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
export default Security;
