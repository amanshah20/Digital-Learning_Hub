import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Plus, Edit2, Trash2, Users, Calendar } from 'lucide-react';
import api from '../../../utils/api';
import toast from 'react-hot-toast';

const AcademicControl = () => {
  const [activeTab, setActiveTab] = useState('subjects');
  const [subjects, setSubjects] = useState([]);
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    credits: 3,
    semester: 1,
    courseId: '',
    teacherId: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [subjectsRes, coursesRes, usersRes] = await Promise.all([
        api.get('/admin/subjects'),
        api.get('/admin/courses'),
        api.get('/admin/users')
      ]);

      if (subjectsRes.data.success) setSubjects(subjectsRes.data.subjects);
      if (coursesRes.data.success) setCourses(coursesRes.data.courses);
      if (usersRes.data.success) {
        const teacherUsers = usersRes.data.users.filter(u => u.role === 'teacher');
        setTeachers(teacherUsers);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/admin/subjects', formData);
      if (res.data.success) {
        toast.success('Subject created successfully');
        fetchData();
        setShowModal(false);
        resetForm();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create subject');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this subject?')) return;
    
    try {
      const res = await api.delete(`/admin/subjects/${id}`);
      if (res.data.success) {
        toast.success('Subject deleted successfully');
        fetchData();
      }
    } catch (error) {
      toast.error('Failed to delete subject');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      description: '',
      credits: 3,
      semester: 1,
      courseId: '',
      teacherId: ''
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6"
      >
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Academic Control</h1>
            <p className="text-slate-600 dark:text-slate-400">
              Manage subjects, semesters, and academic structure
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Subject
          </button>
        </div>
      </motion.div>

      {/* Subjects List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6"
      >
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-primary-500" />
          All Subjects
        </h2>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="loading-spinner"></div>
          </div>
        ) : subjects.length > 0 ? (
          <div className="grid gap-4">
            {subjects.map((subject) => (
              <div
                key={subject.id}
                className="flex items-center justify-between p-4 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{subject.name}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {subject.code} • {subject.credits} Credits • Semester {subject.semester}
                  </p>
                  {subject.Course && (
                    <p className="text-sm text-slate-500 mt-1">
                      Course: {subject.Course.name}
                    </p>
                  )}
                  {subject.Teacher && (
                    <p className="text-sm text-slate-500 flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      Teacher: {subject.Teacher.User?.firstName} {subject.Teacher.User?.lastName}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDelete(subject.id)}
                    className="btn-outline p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-500">
            <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>No subjects found. Create your first subject!</p>
          </div>
        )}
      </motion.div>

      {/* Add Subject Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-2xl font-bold mb-4">Add New Subject</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Subject Name</label>
                  <input
                    type="text"
                    required
                    className="input-modern"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Subject Code</label>
                  <input
                    type="text"
                    required
                    className="input-modern"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  className="input-modern"
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Credits</label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="10"
                    className="input-modern"
                    value={formData.credits}
                    onChange={(e) => setFormData({ ...formData, credits: parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Semester</label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="12"
                    className="input-modern"
                    value={formData.semester}
                    onChange={(e) => setFormData({ ...formData, semester: parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Course</label>
                  <select
                    required
                    className="input-modern"
                    value={formData.courseId}
                    onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                  >
                    <option value="">Select Course</option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Assign Teacher</label>
                <select
                  className="input-modern"
                  value={formData.teacherId}
                  onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
                >
                  <option value="">No Teacher Assigned</option>
                  {teachers.map((teacher) => (
                    <option key={teacher.id} value={teacher.Teacher?.id}>
                      {teacher.firstName} {teacher.lastName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 justify-end pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="btn-outline"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Create Subject
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AcademicControl;
