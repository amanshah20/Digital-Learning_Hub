import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Plus, Edit2, Trash2, X, Search } from 'lucide-react';
import toast from 'react-hot-toast';

const CourseManagement = () => {
  const [courses, setCourses] = useState([
    { id: 1, name: 'Data Structures', code: 'CS201', credits: 4, semester: 3, students: 45, status: 'active' },
    { id: 2, name: 'Database Management', code: 'CS301', credits: 3, semester: 5, students: 38, status: 'active' },
    { id: 3, name: 'Web Development', code: 'CS202', credits: 3, semester: 4, students: 52, status: 'active' },
    { id: 4, name: 'Machine Learning', code: 'CS401', credits: 4, semester: 6, students: 30, status: 'active' },
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    credits: 3,
    semester: 1,
    description: ''
  });

  const filteredCourses = courses.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingCourse) {
      setCourses(courses.map(c => c.id === editingCourse.id ? {...c, ...formData} : c));
      toast.success('Course updated successfully');
    } else {
      setCourses([...courses, {
        id: Date.now(),
        ...formData,
        students: 0,
        status: 'active'
      }]);
      toast.success('Course created successfully');
    }
    setShowModal(false);
    setFormData({ name: '', code: '', credits: 3, semester: 1, description: '' });
  };

  const handleDelete = (id) => {
    if (confirm('Delete this course?')) {
      setCourses(courses.filter(c => c.id !== id));
      toast.success('Course deleted successfully');
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
            <h1 className="text-3xl lg:text-4xl font-bold mb-2">Course Management</h1>
            <p className="text-slate-600 dark:text-slate-400">Create and manage courses</p>
          </div>
          <button
            onClick={() => {setShowModal(true); setEditingCourse(null);}}
            className="bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-all font-medium flex items-center gap-2 w-full lg:w-auto justify-center"
          >
            <Plus className="w-5 h-5" /> Add Course
          </button>
        </div>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-4 lg:p-6"
      >
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </motion.div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCourses.map((course) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 card-hover"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold">{course.name}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">{course.code}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => {setEditingCourse(course); setFormData(course); setShowModal(true);}} className="p-2 hover:bg-blue-500/10 rounded-lg text-blue-600">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(course.id)} className="p-2 hover:bg-red-500/10 rounded-lg text-red-600">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <p>Credits: <span className="font-semibold">{course.credits}</span></p>
              <p>Semester: <span className="font-semibold">{course.semester}</span></p>
              <p>Students: <span className="font-semibold">{course.students}</span></p>
              <p className="pt-2"><span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-600">{course.status}</span></p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-6 max-w-2xl w-full"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">{editingCourse ? 'Edit Course' : 'Add Course'}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Course Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
              <input
                type="text"
                placeholder="Course Code"
                value={formData.code}
                onChange={(e) => setFormData({...formData, code: e.target.value})}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  min="1"
                  max="6"
                  placeholder="Semester"
                  value={formData.semester}
                  onChange={(e) => setFormData({...formData, semester: parseInt(e.target.value)})}
                  className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
                <input
                  type="number"
                  min="1"
                  max="4"
                  placeholder="Credits"
                  value={formData.credits}
                  onChange={(e) => setFormData({...formData, credits: parseInt(e.target.value)})}
                  className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                rows="3"
              />

              <div className="flex gap-3 justify-end pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2 rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-all font-medium">
                  {editingCourse ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default CourseManagement;
