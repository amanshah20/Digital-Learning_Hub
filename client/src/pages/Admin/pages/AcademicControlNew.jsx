import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Users, Plus, Edit2, Trash2, X, Search } from 'lucide-react';
import toast from 'react-hot-toast';

const AcademicControl = () => {
  const [activeTab, setActiveTab] = useState('subjects');
  const [subjects, setSubjects] = useState([
    { id: 1, name: 'Data Structures', code: 'CS201', credits: 4, semester: 3, teacher: 'Dr. Sharma' },
    { id: 2, name: 'Database Systems', code: 'CS301', credits: 3, semester: 5, teacher: 'Prof. Kumar' },
    { id: 3, name: 'Web Technologies', code: 'CS202', credits: 3, semester: 4, teacher: 'Dr. Patel' },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    credits: 3,
    semester: 1,
    teacher: ''
  });
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSubjects = subjects.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingSubject) {
      setSubjects(subjects.map(s => s.id === editingSubject.id ? {...s, ...formData} : s));
      toast.success('Subject updated');
    } else {
      setSubjects([...subjects, {id: Date.now(), ...formData}]);
      toast.success('Subject created');
    }
    setShowModal(false);
    setFormData({ name: '', code: '', credits: 3, semester: 1, teacher: '' });
  };

  const handleDelete = (id) => {
    if (confirm('Delete this subject?')) {
      setSubjects(subjects.filter(s => s.id !== id));
      toast.success('Subject deleted');
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 lg:p-8"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold mb-2">Academic Control</h1>
            <p className="text-slate-600 dark:text-slate-400">Manage subjects and curriculum</p>
          </div>
          <button
            onClick={() => {setShowModal(true); setEditingSubject(null);}}
            className="bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-all font-medium flex items-center gap-2 w-full lg:w-auto justify-center"
          >
            <Plus className="w-5 h-5" /> Add Subject
          </button>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="glass-card p-2 flex gap-2">
        {['subjects', 'semesters', 'curriculum'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === tab
                ? 'bg-primary-500 text-white'
                : 'hover:bg-white/30 dark:hover:bg-slate-800/30'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Search */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search subjects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </motion.div>

      {/* Content */}
      {activeTab === 'subjects' && (
        <div className="glass-card p-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left p-3">Name</th>
                <th className="text-left p-3">Code</th>
                <th className="text-left p-3">Semester</th>
                <th className="text-left p-3">Credits</th>
                <th className="text-left p-3">Teacher</th>
                <th className="text-right p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubjects.map(s => (
                <tr key={s.id} className="border-b border-slate-200 dark:border-slate-700 hover:bg-white/30 dark:hover:bg-slate-800/30">
                  <td className="p-3 font-semibold">{s.name}</td>
                  <td className="p-3">{s.code}</td>
                  <td className="p-3">{s.semester}</td>
                  <td className="p-3">{s.credits}</td>
                  <td className="p-3">{s.teacher}</td>
                  <td className="p-3">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => {setEditingSubject(s); setFormData(s); setShowModal(true);}} className="p-2 hover:bg-blue-500/10 rounded-lg text-blue-600">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(s.id)} className="p-2 hover:bg-red-500/10 rounded-lg text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-6 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">{editingSubject ? 'Edit Subject' : 'Add Subject'}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" placeholder="Subject Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-primary-500" required />
              <input type="text" placeholder="Code" value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-primary-500" required />
              <input type="text" placeholder="Teacher Name" value={formData.teacher} onChange={(e) => setFormData({...formData, teacher: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-primary-500" required />
              <div className="grid grid-cols-2 gap-4">
                <input type="number" min="1" max="6" placeholder="Semester" value={formData.semester} onChange={(e) => setFormData({...formData, semester: parseInt(e.target.value)})} className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-primary-500" required />
                <input type="number" min="1" max="4" placeholder="Credits" value={formData.credits} onChange={(e) => setFormData({...formData, credits: parseInt(e.target.value)})} className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-primary-500" required />
              </div>
              <div className="flex gap-3 justify-end pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2 rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 font-medium">{editingSubject ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AcademicControl;
