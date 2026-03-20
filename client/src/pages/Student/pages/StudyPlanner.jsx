import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, Calendar, Clock, Plus, Trash2, CheckCircle, Circle } from 'lucide-react';

const StudyPlanner = () => {
  const [tasks, setTasks] = useState([
    { id: 1, subject: 'Database', topic: 'SQL Joins', duration: 120, date: '2026-03-14', priority: 'high', completed: false },
    { id: 2, subject: 'Data Structures', topic: 'Binary Trees', duration: 90, date: '2026-03-14', priority: 'medium', completed: false },
    { id: 3, subject: 'Web Dev', topic: 'React Hooks', duration: 60, date: '2026-03-15', priority: 'low', completed: true },
    { id: 4, subject: 'System Design', topic: 'Microservices', duration: 150, date: '2026-03-15', priority: 'high', completed: false },
    { id: 5, subject: 'Software Eng', topic: 'Design Patterns', duration: 75, date: '2026-03-16', priority: 'medium', completed: false },
  ]);
  const [newTask, setNewTask] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [newDuration, setNewDuration] = useState('');

  const toggleTask = (id) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
  };

  const addTask = () => {
    if (newTask && newSubject && newDuration) {
      setTasks([...tasks, {
        id: Date.now(),
        subject: newSubject,
        topic: newTask,
        duration: parseInt(newDuration),
        date: new Date().toISOString().split('T')[0],
        priority: 'medium',
        completed: false
      }]);
      setNewTask('');
      setNewSubject('');
      setNewDuration('');
    }
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const totalMinutes = tasks.reduce((acc, task) => acc + task.duration, 0);
  const completedTasks = tasks.filter(t => t.completed).length;
  const todaysTasks = tasks.filter(t => t.date === new Date().toISOString().split('T')[0]);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30';
      case 'medium': return 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/30';
      default: return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 lg:p-8"
      >
        <h1 className="text-3xl lg:text-4xl font-bold mb-2">Smart Study Planner</h1>
        <p className="text-slate-600 dark:text-slate-400">Organize your study schedule efficiently</p>
      </motion.div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-4"
        >
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Total Tasks</p>
          <p className="text-3xl font-bold">{tasks.length}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-4"
        >
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Completed</p>
          <p className="text-3xl font-bold text-green-600">{completedTasks}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-4"
        >
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Today's Tasks</p>
          <p className="text-3xl font-bold">{todaysTasks.length}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-4"
        >
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Total Minutes</p>
          <p className="text-3xl font-bold">{totalMinutes}</p>
        </motion.div>
      </div>

      {/* Add Task Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-6"
      >
        <h2 className="text-xl font-bold mb-4">Add New Study Task</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input
            type="text"
            placeholder="Subject..."
            value={newSubject}
            onChange={(e) => setNewSubject(e.target.value)}
            className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 backdrop-blur focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <input
            type="text"
            placeholder="Topic/Task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 backdrop-blur focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <input
            type="number"
            placeholder="Duration (min)"
            value={newDuration}
            onChange={(e) => setNewDuration(e.target.value)}
            className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 backdrop-blur focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <button
            onClick={addTask}
            className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-all font-medium flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Task
          </button>
        </div>
      </motion.div>

      {/* Tasks List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-6"
      >
        <h2 className="text-xl font-bold mb-4">Study Tasks</h2>
        <div className="space-y-3">
          {tasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.05 }}
              className={`p-4 rounded-lg border ${
                task.completed
                  ? 'bg-green-500/10 border-green-500/30'
                  : 'bg-white/30 dark:bg-slate-800/30 border-slate-200 dark:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <button
                  onClick={() => toggleTask(task.id)}
                  className="mt-1 flex-shrink-0"
                >
                  {task.completed ? (
                    <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                  ) : (
                    <Circle className="w-6 h-6 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" />
                  )}
                </button>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className={`font-semibold ${task.completed ? 'line-through text-slate-500' : ''}`}>
                      {task.topic}
                    </h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(task.priority)}`}>
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Target className="w-4 h-4" />
                      {task.subject}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {task.duration} min
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(task.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => deleteTask(task.id)}
                  className="p-2 rounded-lg hover:bg-red-500/20 text-red-600 dark:text-red-400 transition-all"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default StudyPlanner;
