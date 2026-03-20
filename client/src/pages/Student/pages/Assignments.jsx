import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Upload, CheckCircle, Clock, AlertCircle, Filter, Search } from 'lucide-react';
import api from '../../../utils/api';
import toast from 'react-hot-toast';

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const mockAssignments = [
    {
      id: 1,
      title: 'Database Design Project',
      subject: 'Database Management',
      description: 'Design a normalized database schema for an e-commerce platform',
      dueDate: '2026-03-20',
      status: 'pending',
      priority: 'high',
      attachments: 1,
      submissions: 0
    },
    {
      id: 2,
      title: 'Data Structures Implementation',
      subject: 'Data Structures',
      description: 'Implement AVL trees and BST with all operations',
      dueDate: '2026-03-18',
      status: 'in-progress',
      priority: 'high',
      attachments: 2,
      submissions: 0
    },
    {
      id: 3,
      title: 'Web Development Assignment',
      subject: 'Web Technologies',
      description: 'Create a responsive website using React and Tailwind CSS',
      dueDate: '2026-03-22',
      status: 'pending',
      priority: 'medium',
      attachments: 3,
      submissions: 0
    },
    {
      id: 4,
      title: 'Software Engineering Case Study',
      subject: 'Software Engineering',
      description: 'Analyze and document a real-world software project',
      dueDate: '2026-03-15',
      status: 'submitted',
      priority: 'medium',
      attachments: 1,
      submissions: 1
    },
    {
      id: 5,
      title: 'System Design Document',
      subject: 'System Design',
      description: 'Design a scalable microservices architecture',
      dueDate: '2026-03-25',
      status: 'pending',
      priority: 'low',
      attachments: 2,
      submissions: 0
    },
    {
      id: 6,
      title: 'AI/ML Model Implementation',
      subject: 'Machine Learning',
      description: 'Build and train a neural network for image classification',
      dueDate: '2026-03-30',
      status: 'pending',
      priority: 'medium',
      attachments: 4,
      submissions: 0
    }
  ];

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      // const { data } = await api.get('/student/assignments');
      // setAssignments(data.assignments);
      setAssignments(mockAssignments);
    } catch (error) {
      console.error('Error fetching assignments:', error);
      toast.error('Failed to load assignments');
      setAssignments(mockAssignments);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'submitted':
        return 'bg-green-500/10 border-green-500/30 text-green-600 dark:text-green-400';
      case 'in-progress':
        return 'bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400';
      case 'pending':
        return 'bg-orange-500/10 border-orange-500/30 text-orange-600 dark:text-orange-400';
      default:
        return 'bg-slate-500/10 border-slate-500/30 text-slate-600 dark:text-slate-400';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/10 text-red-600 dark:text-red-400';
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400';
      case 'low':
        return 'bg-green-500/10 text-green-600 dark:text-green-400';
      default:
        return 'bg-slate-500/10 text-slate-600 dark:text-slate-400';
    }
  };

  const getDaysUntilDue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diff = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const filteredAssignments = assignments.filter(assignment => {
    const matchesFilter = filter === 'all' || assignment.status === filter;
    const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.subject.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = [
    { label: 'Total', value: assignments.length, icon: FileText, color: 'from-blue-500 to-blue-600' },
    { label: 'Pending', value: assignments.filter(a => a.status === 'pending').length, icon: Clock, color: 'from-orange-500 to-orange-600' },
    { label: 'In Progress', value: assignments.filter(a => a.status === 'in-progress').length, icon: AlertCircle, color: 'from-purple-500 to-purple-600' },
    { label: 'Submitted', value: assignments.filter(a => a.status === 'submitted').length, icon: CheckCircle, color: 'from-green-500 to-green-600' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 lg:p-8"
      >
        <h1 className="text-3xl lg:text-4xl font-bold mb-2">Assignments</h1>
        <p className="text-slate-600 dark:text-slate-400">Submit and track all your assignments</p>
      </motion.div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{stat.label}</p>
                <p className="text-3xl font-bold">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} text-white`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Search and Filter */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-4 lg:p-6"
      >
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search assignments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 backdrop-blur focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {['all', 'pending', 'in-progress', 'submitted'].map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === status
                    ? 'bg-primary-500 text-white'
                    : 'bg-white/50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 hover:bg-white/75 dark:hover:bg-slate-800/75'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Assignments List */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="loading-spinner"></div>
        </div>
      ) : filteredAssignments.length > 0 ? (
        <div className="space-y-4">
          {filteredAssignments.map((assignment, index) => {
            const daysLeft = getDaysUntilDue(assignment.dueDate);
            return (
              <motion.div
                key={assignment.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass-card p-6 card-hover group border border-slate-200 dark:border-slate-700"
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="p-3 rounded-xl bg-blue-500/10 group-hover:scale-110 transition-transform">
                        <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-1">{assignment.title}</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{assignment.subject}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">{assignment.description}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(assignment.status)}`}>
                        {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1).replace('-', ' ')}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(assignment.priority)}`}>
                        {assignment.priority.charAt(0).toUpperCase() + assignment.priority.slice(1)} Priority
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 lg:text-right">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Due Date</p>
                      <p className="font-semibold">{new Date(assignment.dueDate).toLocaleDateString()}</p>
                      <p className={`text-sm font-medium ${daysLeft <= 3 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                        {daysLeft > 0 ? `${daysLeft} days left` : daysLeft === 0 ? 'Due today' : 'Overdue'}
                      </p>
                    </div>

                    <div className="flex gap-2 justify-end">
                      {assignment.status !== 'submitted' ? (
                        <button className="px-4 py-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600 transition-all font-medium flex items-center gap-2">
                          <Upload className="w-4 h-4" />
                          Submit
                        </button>
                      ) : (
                        <button className="px-4 py-2 rounded-lg bg-green-500 text-white opacity-75 font-medium flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          Submitted
                        </button>
                      )}
                      <button className="px-4 py-2 rounded-lg bg-slate-500/20 hover:bg-slate-500/30 font-medium transition-all">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card p-12 text-center"
        >
          <FileText className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No assignments found</h3>
          <p className="text-slate-600 dark:text-slate-400">Try adjusting your filters or search term</p>
        </motion.div>
      )}
    </div>
  );
};

export default Assignments;
