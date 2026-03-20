import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, TrendingUp, Users, AlertCircle, CheckCircle, 
  Plus, X, Download, Filter, Search, Edit, Trash2, Receipt 
} from 'lucide-react';
import api from '../../../utils/api';

const FeeManagement = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalRevenue: 0,
    paidStudents: 0,
    pendingPayments: 0,
    thisMonthRevenue: 0
  });
  const [fees, setFees] = useState([]);
  const [payments, setPayments] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddFeeModal, setShowAddFeeModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedFee, setSelectedFee] = useState(null);
  
  const [feeForm, setFeeForm] = useState({
    studentId: '',
    feeType: 'tuition',
    amount: '',
    dueDate: '',
    semester: '',
    academicYear: new Date().getFullYear().toString(),
    description: ''
  });

  const [paymentForm, setPaymentForm] = useState({
    feeId: '',
    studentId: '',
    amount: '',
    paymentMethod: 'cash',
    transactionId: '',
    remarks: ''
  });

  const [reportFilters, setReportFilters] = useState({
    type: 'all',
    startDate: '',
    endDate: '',
    status: '',
    feeType: ''
  });

  useEffect(() => {
    fetchStats();
    fetchFees();
    fetchPayments();
    fetchStudents();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/fees/stats');
      if (response.data.success) {
        const { stats: feeStats } = response.data;
        setStats({
          totalRevenue: feeStats.totalRevenue,
          paidStudents: feeStats.paidStudents,
          pendingPayments: feeStats.pendingPayments,
          thisMonthRevenue: feeStats.thisMonthRevenue
        });
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const fetchFees = async () => {
    try {
      const response = await api.get('/admin/fees');
      if (response.data.success) {
        setFees(response.data.fees);
      }
    } catch (error) {
      console.error('Failed to fetch fees:', error);
    }
  };

  const fetchPayments = async () => {
    try {
      const response = await api.get('/admin/payments');
      if (response.data.success) {
        setPayments(response.data.payments);
      }
    } catch (error) {
      console.error('Failed to fetch payments:', error);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await api.get('/admin/users');
      if (response.data.success) {
        const studentUsers = response.data.users
          .filter(user => user.role === 'student' && user.Student)
          .map(user => ({
            id: user.Student.id,
            userId: user.id,
            name: `${user.firstName} ${user.lastName}`,
            enrollmentNumber: user.Student.enrollmentNumber,
            email: user.email
          }));
        setStudents(studentUsers);
      }
    } catch (error) {
      console.error('Failed to fetch students:', error);
    }
  };

  const handleAddFee = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/admin/fees', feeForm);
      if (response.data.success) {
        alert('Fee added successfully!');
        setShowAddFeeModal(false);
        setFeeForm({
          studentId: '',
          feeType: 'tuition',
          amount: '',
          dueDate: '',
          semester: '',
          academicYear: new Date().getFullYear().toString(),
          description: ''
        });
        fetchFees();
        fetchStats();
      }
    } catch (error) {
      console.error('Failed to add fee:', error);
      alert('Failed to add fee');
    } finally {
      setLoading(false);
    }
  };

  const handleRecordPayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/admin/payments', paymentForm);
      if (response.data.success) {
        alert('Payment recorded successfully!');
        setShowPaymentModal(false);
        setPaymentForm({
          feeId: '',
          studentId: '',
          amount: '',
          paymentMethod: 'cash',
          transactionId: '',
          remarks: ''
        });
        fetchFees();
        fetchPayments();
        fetchStats();
      }
    } catch (error) {
      console.error('Failed to record payment:', error);
      alert('Failed to record payment');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFee = async (feeId) => {
    if (!window.confirm('Are you sure you want to delete this fee?')) return;
    
    try {
      const response = await api.delete(`/admin/fees/${feeId}`);
      if (response.data.success) {
        alert('Fee deleted successfully');
        fetchFees();
        fetchStats();
      }
    } catch (error) {
      console.error('Failed to delete fee:', error);
      alert('Failed to delete fee');
    }
  };

  const handleGenerateReport = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(reportFilters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      
      const response = await api.get(`/admin/fees/report?${params}`);
      if (response.data.success) {
        // Convert report to downloadable format
        const reportData = JSON.stringify(response.data.report, null, 2);
        const blob = new Blob([reportData], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `fee-report-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        alert('Report generated and downloaded!');
      }
    } catch (error) {
      console.error('Failed to generate report:', error);
      alert('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const statsCards = [
    { icon: DollarSign, label: 'Total Revenue', value: formatCurrency(stats.totalRevenue), change: '+12%', color: 'from-green-500 to-green-600' },
    { icon: Users, label: 'Paid Students', value: stats.paidStudents, change: '87%', color: 'from-blue-500 to-blue-600' },
    { icon: AlertCircle, label: 'Pending Payments', value: stats.pendingPayments, change: '13%', color: 'from-orange-500 to-orange-600' },
    { icon: TrendingUp, label: 'This Month', value: formatCurrency(stats.thisMonthRevenue), change: '+8%', color: 'from-purple-500 to-purple-600' }
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6"
      >
        <h1 className="text-3xl font-bold mb-2">Fee Management</h1>
        <p className="text-slate-600 dark:text-slate-400">
          Track payments, manage dues, and generate reports
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, index) => (
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
            <div className="text-xs text-green-600 dark:text-green-400 mt-1">{stat.change} from last month</div>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="glass-card p-2">
        <div className="flex gap-2 flex-wrap">
          {['overview', 'manage-dues', 'payments', 'reports'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === tab
                  ? 'bg-blue-500 text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {tab.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          {/* Recent Payments */}
          <div className="glass-card p-6">
            <h2 className="text-xl font-bold mb-4">Recent Payments</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="text-left py-3 px-4">Student</th>
                    <th className="text-left py-3 px-4">Fee Type</th>
                    <th className="text-left py-3 px-4">Amount</th>
                    <th className="text-left py-3 px-4">Date</th>
                    <th className="text-left py-3 px-4">Method</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.slice(0, 10).map((payment) => (
                    <tr key={payment.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="py-3 px-4 font-medium">
                        {payment.Student?.User ? `${payment.Student.User.firstName} ${payment.Student.User.lastName}` : 'N/A'}
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400 capitalize">
                        {payment.Fee?.feeType || 'N/A'}
                      </td>
                      <td className="py-3 px-4 font-semibold">{formatCurrency(payment.amount)}</td>
                      <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">
                        {formatDate(payment.paymentDate)}
                      </td>
                      <td className="py-3 px-4 capitalize">
                        <span className="badge badge-info">{payment.paymentMethod}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Fee Structure */}
          <div className="glass-card p-6">
            <h2 className="text-xl font-bold mb-4">Fee Structure</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">Tuition Fee</h3>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">$1,200/semester</p>
              </div>
              <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                <h3 className="font-semibold text-green-900 dark:text-green-300 mb-2">Lab Fee</h3>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">$200/semester</p>
              </div>
              <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
                <h3 className="font-semibold text-purple-900 dark:text-purple-300 mb-2">Library Fee</h3>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">$50/semester</p>
              </div>
              <div className="p-4 rounded-xl bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
                <h3 className="font-semibold text-orange-900 dark:text-orange-300 mb-2">Sports Fee</h3>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">$30/semester</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {activeTab === 'manage-dues' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <div className="glass-card p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Manage Student Dues</h2>
              <button
                onClick={() => setShowAddFeeModal(true)}
                className="btn-primary flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add New Fee
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="text-left py-3 px-4">Student</th>
                    <th className="text-left py-3 px-4">Enrollment No</th>
                    <th className="text-left py-3 px-4">Fee Type</th>
                    <th className="text-left py-3 px-4">Amount</th>
                    <th className="text-left py-3 px-4">Paid</th>
                    <th className="text-left py-3 px-4">Balance</th>
                    <th className="text-left py-3 px-4">Due Date</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {fees.map((fee) => {
                    const balance = parseFloat(fee.amount) - parseFloat(fee.paidAmount);
                    return (
                      <tr key={fee.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="py-3 px-4 font-medium">
                          {fee.Student?.User ? `${fee.Student.User.firstName} ${fee.Student.User.lastName}` : 'N/A'}
                        </td>
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                          {fee.Student?.enrollmentNumber || 'N/A'}
                        </td>
                        <td className="py-3 px-4 capitalize">{fee.feeType}</td>
                        <td className="py-3 px-4 font-semibold">{formatCurrency(fee.amount)}</td>
                        <td className="py-3 px-4 text-green-600">{formatCurrency(fee.paidAmount)}</td>
                        <td className="py-3 px-4 text-orange-600 font-semibold">{formatCurrency(balance)}</td>
                        <td className="py-3 px-4 text-sm">{formatDate(fee.dueDate)}</td>
                        <td className="py-3 px-4">
                          {fee.status === 'paid' ? (
                            <span className="badge badge-success flex items-center gap-1 w-fit">
                              <CheckCircle className="w-3 h-3" />
                              Paid
                            </span>
                          ) : fee.status === 'partial' ? (
                            <span className="badge badge-info flex items-center gap-1 w-fit">
                              Partial
                            </span>
                          ) : (
                            <span className="badge badge-warning flex items-center gap-1 w-fit">
                              <AlertCircle className="w-3 h-3" />
                              {fee.status}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setPaymentForm({
                                  ...paymentForm,
                                  feeId: fee.id,
                                  studentId: fee.studentId,
                                  amount: balance.toString()
                                });
                                setShowPaymentModal(true);
                              }}
                              className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                              title="Record Payment"
                            >
                              <Receipt className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteFee(fee.id)}
                              className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      {activeTab === 'payments' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card p-6"
        >
          <h2 className="text-xl font-bold mb-6">Payment History</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-3 px-4">Date</th>
                  <th className="text-left py-3 px-4">Student</th>
                  <th className="text-left py-3 px-4">Fee Type</th>
                  <th className="text-left py-3 px-4">Amount</th>
                  <th className="text-left py-3 px-4">Method</th>
                  <th className="text-left py-3 px-4">Transaction ID</th>
                  <th className="text-left py-3 px-4">Received By</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="py-3 px-4">{formatDate(payment.paymentDate)}</td>
                    <td className="py-3 px-4 font-medium">
                      {payment.Student?.User ? `${payment.Student.User.firstName} ${payment.Student.User.lastName}` : 'N/A'}
                    </td>
                    <td className="py-3 px-4 capitalize">{payment.Fee?.feeType || 'N/A'}</td>
                    <td className="py-3 px-4 font-semibold text-green-600">{formatCurrency(payment.amount)}</td>
                    <td className="py-3 px-4 capitalize">
                      <span className="badge badge-info">{payment.paymentMethod}</span>
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">
                      {payment.transactionId || '-'}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      {payment.receiver ? `${payment.receiver.firstName} ${payment.receiver.lastName}` : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {activeTab === 'reports' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card p-6"
        >
          <h2 className="text-xl font-bold mb-6">Generate Reports</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2">Report Type</label>
              <select
                value={reportFilters.type}
                onChange={(e) => setReportFilters({ ...reportFilters, type: e.target.value })}
                className="input-field"
              >
                <option value="all">All</option>
                <option value="detailed">Detailed</option>
                <option value="summary">Summary</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select
                value={reportFilters.status}
                onChange={(e) => setReportFilters({ ...reportFilters, status: e.target.value })}
                className="input-field"
              >
                <option value="">All</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="partial">Partial</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Fee Type</label>
              <select
                value={reportFilters.feeType}
                onChange={(e) => setReportFilters({ ...reportFilters, feeType: e.target.value })}
                className="input-field"
              >
                <option value="">All</option>
                <option value="tuition">Tuition</option>
                <option value="lab">Lab</option>
                <option value="library">Library</option>
                <option value="sports">Sports</option>
                <option value="exam">Exam</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Start Date</label>
              <input
                type="date"
                value={reportFilters.startDate}
                onChange={(e) => setReportFilters({ ...reportFilters, startDate: e.target.value })}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">End Date</label>
              <input
                type="date"
                value={reportFilters.endDate}
                onChange={(e) => setReportFilters({ ...reportFilters, endDate: e.target.value })}
                className="input-field"
              />
            </div>
          </div>

          <button
            onClick={handleGenerateReport}
            disabled={loading}
            className="btn-primary flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            {loading ? 'Generating...' : 'Generate & Download Report'}
          </button>
        </motion.div>
      )}

      {/* Add Fee Modal */}
      {showAddFeeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Add New Fee</h3>
              <button onClick={() => setShowAddFeeModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddFee} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Student</label>
                <select
                  value={feeForm.studentId}
                  onChange={(e) => setFeeForm({ ...feeForm, studentId: e.target.value })}
                  className="input-field"
                  required
                >
                  <option value="">Select Student</option>
                  {students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.name} ({student.enrollmentNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Fee Type</label>
                <select
                  value={feeForm.feeType}
                  onChange={(e) => setFeeForm({ ...feeForm, feeType: e.target.value })}
                  className="input-field"
                  required
                >
                  <option value="tuition">Tuition</option>
                  <option value="lab">Lab</option>
                  <option value="library">Library</option>
                  <option value="sports">Sports</option>
                  <option value="exam">Exam</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Amount ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={feeForm.amount}
                  onChange={(e) => setFeeForm({ ...feeForm, amount: e.target.value })}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Due Date</label>
                <input
                  type="date"
                  value={feeForm.dueDate}
                  onChange={(e) => setFeeForm({ ...feeForm, dueDate: e.target.value })}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Semester</label>
                <input
                  type="text"
                  value={feeForm.semester}
                  onChange={(e) => setFeeForm({ ...feeForm, semester: e.target.value })}
                  className="input-field"
                  placeholder="e.g., Fall 2026"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Academic Year</label>
                <input
                  type="text"
                  value={feeForm.academicYear}
                  onChange={(e) => setFeeForm({ ...feeForm, academicYear: e.target.value })}
                  className="input-field"
                  placeholder="e.g., 2026"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={feeForm.description}
                  onChange={(e) => setFeeForm({ ...feeForm, description: e.target.value })}
                  className="input-field"
                  rows="3"
                  placeholder="Additional details..."
                />
              </div>

              <div className="flex gap-3">
                <button type="submit" disabled={loading} className="btn-primary flex-1">
                  {loading ? 'Adding...' : 'Add Fee'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddFeeModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Record Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-6 max-w-md w-full"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Record Payment</h3>
              <button onClick={() => setShowPaymentModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRecordPayment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Amount ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={paymentForm.amount}
                  onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Payment Method</label>
                <select
                  value={paymentForm.paymentMethod}
                  onChange={(e) => setPaymentForm({ ...paymentForm, paymentMethod: e.target.value })}
                  className="input-field"
                  required
                >
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                  <option value="online">Online</option>
                  <option value="cheque">Cheque</option>
                  <option value="bank_transfer">Bank Transfer</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Transaction ID (Optional)</label>
                <input
                  type="text"
                  value={paymentForm.transactionId}
                  onChange={(e) => setPaymentForm({ ...paymentForm, transactionId: e.target.value })}
                  className="input-field"
                  placeholder="Enter transaction ID"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Remarks</label>
                <textarea
                  value={paymentForm.remarks}
                  onChange={(e) => setPaymentForm({ ...paymentForm, remarks: e.target.value })}
                  className="input-field"
                  rows="3"
                  placeholder="Additional notes..."
                />
              </div>

              <div className="flex gap-3">
                <button type="submit" disabled={loading} className="btn-primary flex-1">
                  {loading ? 'Recording...' : 'Record Payment'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default FeeManagement;
