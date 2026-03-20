import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { IndianRupee, Plus, Edit2, Trash2, X, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../../utils/api';

const FeeManagement = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({ studentId: '', name: '', amount: 0, paid: 0 });

  useEffect(() => {
    fetchFeeRecords();
  }, []);

  const fetchFeeRecords = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/fees');
      setRecords(response.data.fees || []);
    } catch (error) {
      console.error('Failed to fetch fee records:', error);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredRecords = records.filter(r =>
    r.Student?.User?.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.Student?.enrollmentNumber?.includes(searchTerm)
  );

  const totalRevenue = records.reduce((sum, r) => sum + r.amountPaid, 0);
  const totalPending = records.reduce((sum, r) => sum + (r.totalAmount - r.amountPaid), 0);
  const completedCount = records.filter(r => r.amountPaid >= r.totalAmount).length;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingRecord) {
        await api.put(`/admin/fees/${editingRecord.id}`, formData);
        toast.success('Fee record updated');
      } else {
        await api.post('/admin/fees', formData);
        toast.success('Fee record created');
      }
      await fetchFeeRecords();
      setShowModal(false);
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this record?')) return;
    try {
      await api.delete(`/admin/fees/${id}`);
      toast.success('Record deleted');
      await fetchFeeRecords();
    } catch (error) {
      toast.error('Failed to delete record');
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'paid': return 'bg-green-500/20 text-green-700';
      case 'partial': return 'bg-yellow-500/20 text-yellow-700';
      case 'pending': return 'bg-red-500/20 text-red-700';
      default: return 'bg-slate-500/20 text-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card p-6 bg-gradient-to-br from-green-600/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Total Collected</p>
              <p className="text-3xl font-bold mt-2">₹{totalRevenue.toLocaleString()}</p>
            </div>
            <div className="bg-green-500 p-3 rounded-lg text-white"><IndianRupee className="w-6 h-6" /></div>
          </div>
        </div>
        <div className="glass-card p-6 bg-gradient-to-br from-red-600/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Pending Amount</p>
              <p className="text-3xl font-bold mt-2">₹{totalPending.toLocaleString()}</p>
            </div>
            <div className="bg-red-500 p-3 rounded-lg text-white"><IndianRupee className="w-6 h-6" /></div>
          </div>
        </div>
        <div className="glass-card p-6 bg-gradient-to-br from-blue-600/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Fees Completed</p>
              <p className="text-3xl font-bold mt-2">{completedCount}/{records.length}</p>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg text-white">{records.length > 0 ? Math.round((completedCount/records.length)*100) : 0}%</div>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold mb-2">Fee Management</h1>
            <p className="text-slate-600 dark:text-slate-400">Track student fees</p>
          </div>
          <button onClick={() => {setShowModal(true); setEditingRecord(null);}} className="bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-all font-medium flex items-center gap-2 w-full lg:w-auto justify-center">
            <Plus className="w-5 h-5" /> Add Record
          </button>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
          <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-primary-500" />
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-6 overflow-x-auto">
        {loading ? (
          <div className="flex justify-center py-8"><div>Loading records...</div></div>
        ) : filteredRecords.length === 0 ? (
          <div className="flex justify-center py-8"><div>No records found</div></div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left p-3">Student</th>
                <th className="text-left p-3">Total Fee</th>
                <th className="text-left p-3">Paid</th>
                <th className="text-left p-3">Pending</th>
                <th className="text-left p-3">Status</th>
                <th className="text-right p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map(r => {
                const pending = r.totalAmount - r.amountPaid;
                const status = r.amountPaid >= r.totalAmount ? 'paid' : r.amountPaid > 0 ? 'partial' : 'pending';
                return (
                  <tr key={r.id} className="border-b border-slate-200 dark:border-slate-700 hover:bg-white/30 dark:hover:bg-slate-800/30">
                    <td className="p-3">{r.Student?.User?.firstName} {r.Student?.User?.lastName}</td>
                    <td className="p-3">₹{r.totalAmount}</td>
                    <td className="p-3 text-green-600">₹{r.amountPaid}</td>
                    <td className="p-3 text-red-600">₹{pending}</td>
                    <td className="p-3"><span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(status)}`}>{status.toUpperCase()}</span></td>
                    <td className="p-3">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => {setEditingRecord(r); setFormData(r); setShowModal(true);}} className="p-2 hover:bg-blue-500/10 rounded text-blue-600">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(r.id)} className="p-2 hover:bg-red-500/10 rounded text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </motion.div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-6 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">{editingRecord ? 'Edit Record' : 'Add Record'}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" placeholder="Student ID" value={formData.studentId} onChange={(e) => setFormData({...formData, studentId: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-primary-500" required />
              <input type="number" placeholder="Total Amount" value={formData.amount} onChange={(e) => setFormData({...formData, amount: parseInt(e.target.value)})} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-primary-500" required />
              <input type="number" placeholder="Amount Paid" value={formData.paid} onChange={(e) => setFormData({...formData, paid: parseInt(e.target.value)})} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-primary-500" required />
              <div className="flex gap-3 justify-end pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2 rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 font-medium">{editingRecord ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default FeeManagement;
