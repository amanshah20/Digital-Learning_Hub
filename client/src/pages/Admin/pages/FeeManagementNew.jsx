import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { IndianRupee, Plus, Edit2, Trash2, X, Search, Download } from 'lucide-react';
import toast from 'react-hot-toast';

const FeeManagement = () => {
  const [records, setRecords] = useState([
    { id: 1, studentId: 'S001', name: 'Abhishek Singh', amount: 250000, paid: 250000, pending: 0, status: 'completed', dueDate: '2024-06-30', lastPayment: '2024-06-28' },
    { id: 2, studentId: 'S002', name: 'Priya Sharma', amount: 250000, paid: 125000, pending: 125000, status: 'partial', dueDate: '2024-07-30', lastPayment: '2024-06-15' },
    { id: 3, studentId: 'S003', name: 'Rahul Kumar', amount: 250000, paid: 0, pending: 250000, status: 'pending', dueDate: '2024-06-30', lastPayment: null },
    { id: 4, studentId: 'S004', name: 'Neha Gupta', amount: 250000, paid: 250000, pending: 0, status: 'completed', dueDate: '2024-06-30', lastPayment: '2024-06-20' },
  ]);
  
  const [showModal, setShowModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({ studentId: '', name: '', amount: 250000, paid: 0 });

  const filteredRecords = records.filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.studentId.includes(searchTerm)
  );

  const totalRevenue = records.reduce((sum, r) => sum + r.paid, 0);
  const totalPending = records.reduce((sum, r) => sum + r.pending, 0);
  const completedCount = records.filter(r => r.status === 'completed').length;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingRecord) {
      setRecords(records.map(r => r.id === editingRecord.id ? {...r, ...formData, status: formData.paid === formData.amount ? 'completed' : formData.paid > 0 ? 'partial' : 'pending'} : r));
      toast.success('Fee record updated');
    } else {
      setRecords([...records, {
        id: Date.now(),
        ...formData,
        pending: formData.amount - formData.paid,
        status: formData.paid === formData.amount ? 'completed' : formData.paid > 0 ? 'partial' : 'pending',
        dueDate: '2024-07-30',
        lastPayment: null
      }]);
      toast.success('Fee record created');
    }
    setShowModal(false);
    setFormData({ studentId: '', name: '', amount: 250000, paid: 0 });
  };

  const handleDelete = (id) => {
    if (confirm('Delete this fee record?')) {
      setRecords(records.filter(r => r.id !== id));
      toast.success('Record deleted');
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'bg-green-500/20 text-green-700';
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
              <p className="text-slate-600 dark:text-slate-400 text-sm">Completed Fees</p>
              <p className="text-3xl font-bold mt-2">{completedCount}/{records.length}</p>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg text-white">{Math.round((completedCount/records.length)*100)}%</div>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold mb-2">Fee Management</h1>
            <p className="text-slate-600 dark:text-slate-400">Track student fee payments</p>
          </div>
          <button onClick={() => {setShowModal(true); setEditingRecord(null);}} className="bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-all font-medium flex items-center gap-2 w-full lg:w-auto justify-center">
            <Plus className="w-5 h-5" /> Add Record
          </button>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
          <input type="text" placeholder="Search by name or ID..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-primary-500" />
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700">
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Total Fee</th>
              <th className="text-left p-3">Paid</th>
              <th className="text-left p-3">Pending</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">Due Date</th>
              <th className="text-right p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.map(r => (
              <tr key={r.id} className="border-b border-slate-200 dark:border-slate-700 hover:bg-white/30 dark:hover:bg-slate-800/30">
                <td className="p-3 font-semibold">{r.name}</td>
                <td className="p-3">₹{r.amount.toLocaleString()}</td>
                <td className="p-3 text-green-600 font-semibold">₹{r.paid.toLocaleString()}</td>
                <td className="p-3 text-red-600 font-semibold">₹{r.pending.toLocaleString()}</td>
                <td className="p-3"><span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(r.status)}`}>{r.status.capitalize()}</span></td>
                <td className="p-3">{r.dueDate}</td>
                <td className="p-3">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => {setEditingRecord(r); setFormData(r); setShowModal(true);}} className="p-2 hover:bg-blue-500/10 rounded-lg text-blue-600">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(r.id)} className="p-2 hover:bg-red-500/10 rounded-lg text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-6 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">{editingRecord ? 'Edit Fee Record' : 'Add Fee Record'}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" placeholder="Student ID" value={formData.studentId} onChange={(e) => setFormData({...formData, studentId: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-primary-500" required />
              <input type="text" placeholder="Student Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-primary-500" required />
              <div className="grid grid-cols-2 gap-4">
                <input type="number" placeholder="Total Fee" value={formData.amount} onChange={(e) => setFormData({...formData, amount: parseInt(e.target.value)})} className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-primary-500" required />
                <input type="number" placeholder="Amount Paid" value={formData.paid} onChange={(e) => setFormData({...formData, paid: parseInt(e.target.value)})} className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-primary-500" required />
              </div>
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

String.prototype.capitalize = function() { return this.charAt(0).toUpperCase() + this.slice(1); };

export default FeeManagement;
