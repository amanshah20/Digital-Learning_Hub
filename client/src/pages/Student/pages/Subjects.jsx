import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Clock, Users, FileText } from 'lucide-react';
import api from '../../../utils/api';
import toast from 'react-hot-toast';

const Subjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/student/subjects');
      if (data.success) {
        setSubjects(data.subjects);
      }
    } catch (error) {
      console.error('Error fetching subjects:', error);
      toast.error('Failed to load subjects');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6"
      >
        <h1 className="text-3xl font-bold mb-2">My Subjects</h1>
        <p className="text-slate-600 dark:text-slate-400">
          Semester 7 - Academic Year 2025-26
        </p>
      </motion.div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="loading-spinner"></div>
        </div>
      ) : subjects.length > 0 ? (
      <div className="grid lg:grid-cols-2 gap-6">
        {subjects.map((subject, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card p-6 card-hover group"
          >
            <div className={`w-full h-2 rounded-full bg-gradient-to-r ${subject.color} mb-4`} />
            
            <h3 className="text-xl font-bold mb-2">{subject.name}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              {subject.code} • {subject.credits} Credits
            </p>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center p-3 rounded-xl bg-white/50 dark:bg-slate-800/50">
                <div className="text-2xl font-bold text-primary-600">{subject.attendance}%</div>
                <div className="text-xs text-slate-600 dark:text-slate-400">Attendance</div>
              </div>
              <div className="text-center p-3 rounded-xl bg-white/50 dark:bg-slate-800/50">
                <div className="text-2xl font-bold text-green-600">{subject.grade}</div>
                <div className="text-xs text-slate-600 dark:text-slate-400">Grade</div>
              </div>
              <div className="text-center p-3 rounded-xl bg-white/50 dark:bg-slate-800/50">
                <div className="text-2xl font-bold text-purple-600">{subject.credits}</div>
                <div className="text-xs text-slate-600 dark:text-slate-400">Credits</div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm mb-4">
              <Users className="w-4 h-4 text-slate-500" />
              <span className="text-slate-600 dark:text-slate-400">{subject.teacher}</span>
            </div>

            <div className="flex gap-2">
              <button className="btn-primary flex-1 py-2 text-sm">View Materials</button>
              <button className="btn-outline flex-1 py-2 text-sm">Assignments</button>
            </div>
          </motion.div>
        ))}
      </div>
      ) : (
        <div className="glass-card p-12 text-center">
          <p className="text-slate-500">No subjects enrolled</p>
        </div>
      )}
    </div>
  );
};

export default Subjects;
