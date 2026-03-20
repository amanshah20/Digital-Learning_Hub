import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle, LogOut, Search, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

const Security = () => {
  const [auditLogs, setAuditLogs] = useState([
    { id: 1, user: 'admin@univ.edu', action: 'Login Successful', timestamp: '2024-07-20 14:32:15', ipAddress: '192.168.1.100', status: 'success' },
    { id: 2, user: 'teacher@univ.edu', action: 'Created Assignment', timestamp: '2024-07-20 14:15:42', ipAddress: '192.168.1.105', status: 'success' },
    { id: 3, user: 'unknown', action: 'Failed Login Attempt', timestamp: '2024-07-20 13:45:20', ipAddress: '203.0.113.45', status: 'failed' },
    { id: 4, user: 'student@univ.edu', action: 'Submitted Assignment', timestamp: '2024-07-20 13:22:10', ipAddress: '192.168.1.110', status: 'success' },
    { id: 5, user: 'admin@univ.edu', action: 'User Role Changed', timestamp: '2024-07-20 12:55:33', ipAddress: '192.168.1.100', status: 'success' },
    { id: 6, user: 'username', action: 'Failed Login Attempt', timestamp: '2024-07-20 11:30:50', ipAddress: '198.51.100.50', status: 'failed' },
  ]);

  const [securityScores] = useState([
    { category: 'Password Security', score: 95 },
    { category: 'Session Management', score: 88 },
    { category: 'API Security', score: 91 },
    { category: 'Data Encryption', score: 96 },
    { category: 'Access Control', score: 89 },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredLogs = auditLogs.filter(log =>
    (log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.ipAddress.includes(searchTerm)) &&
    (filterStatus === 'all' || log.status === filterStatus)
  );

  const failedAttempts = auditLogs.filter(l => l.status === 'failed').length;
  const avgSecurityScore = Math.round(securityScores.reduce((sum, s) => sum + s.score, 0) / securityScores.length);

  const getStatusIcon = (status) => {
    return status === 'success' ? '✓' : '✕';
  };

  const getStatusColor = (status) => {
    return status === 'success' ? 'bg-green-500/20 text-green-700' : 'bg-red-500/20 text-red-700';
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card p-6 bg-gradient-to-br from-blue-600/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Security Score</p>
              <p className="text-3xl font-bold mt-2">{avgSecurityScore}%</p>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg text-white"><Shield className="w-6 h-6" /></div>
          </div>
        </div>

        <div className="glass-card p-6 bg-gradient-to-br from-green-600/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Active Sessions</p>
              <p className="text-3xl font-bold mt-2">24</p>
            </div>
            <div className="bg-green-500 p-3 rounded-lg text-white"><Eye className="w-6 h-6" /></div>
          </div>
        </div>

        <div className="glass-card p-6 bg-gradient-to-br from-red-600/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Failed Attempts</p>
              <p className="text-3xl font-bold mt-2">{failedAttempts}</p>
            </div>
            <div className="bg-red-500 p-3 rounded-lg text-white"><AlertTriangle className="w-6 h-6" /></div>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-6">
        <h2 className="text-xl font-bold mb-4">Security Metrics</h2>
        <div className="space-y-4">
          {securityScores.map((item, idx) => (
            <div key={idx} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{item.category}</span>
                <span className="text-primary-500 font-bold">{item.score}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full bg-gradient-to-r ${
                    item.score >= 90 ? 'from-green-500 to-emerald-500' :
                    item.score >= 75 ? 'from-yellow-500 to-orange-500' :
                    'from-red-500 to-pink-500'
                  }`}
                  style={{ width: `${item.score}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold">Audit Log</h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm">System activity and security events</p>
          </div>
          <div className="flex gap-2">
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option value="all">All Events</option>
              <option value="success">Success</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>

        <div className="mb-4 relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
          <input type="text" placeholder="Search logs..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-primary-500" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left p-3">User</th>
                <th className="text-left p-3">Action</th>
                <th className="text-left p-3">IP Address</th>
                <th className="text-left p-3">Timestamp</th>
                <th className="text-left p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map(log => (
                <tr key={log.id} className="border-b border-slate-200 dark:border-slate-700 hover:bg-white/30 dark:hover:bg-slate-800/30">
                  <td className="p-3 font-semibold">{log.user}</td>
                  <td className="p-3">{log.action}</td>
                  <td className="p-3 font-mono text-xs text-slate-600 dark:text-slate-400">{log.ipAddress}</td>
                  <td className="p-3 text-xs text-slate-600 dark:text-slate-400">{log.timestamp}</td>
                  <td className="p-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit ${getStatusColor(log.status)}`}>
                      {getStatusIcon(log.status)} {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
        <h2 className="text-xl font-bold mb-4">Session Management</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-slate-100/50 dark:bg-slate-800/50 rounded-lg">
            <div>
              <p className="font-semibold">Current Session</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">192.168.1.100 • 2 hours active</p>
            </div>
            <span className="px-3 py-1 bg-green-500/20 text-green-700 rounded-full text-xs font-semibold">Active</span>
          </div>
          <button className="w-full px-4 py-2 bg-red-500/10 text-red-600 hover:bg-red-500/20 rounded-lg font-medium transition-all flex items-center gap-2 justify-center">
            <LogOut className="w-4 h-4" /> Logout All Sessions
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Security;
