import React, { useState } from 'react';
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  CheckSquare,
  BarChart3,
  Trophy,
  Target,
  Brain,
  Heart,
  FileText,
  LogOut,
  Menu,
  X,
  Bell,
  Settings,
  User
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import Background3D from '../../components/Background3D';

// Dashboard Pages
import Overview from './pages/Overview';
import Subjects from './pages/Subjects';
import Attendance from './pages/Attendance';
import Assignments from './pages/Assignments';
import Performance from './pages/Performance';
import Gamification from './pages/Gamification';
import StudyPlanner from './pages/StudyPlanner';
import LearningAnalytics from './pages/LearningAnalytics';
import MoodTracker from './pages/MoodTracker';
import StudentRecord from './pages/StudentRecord';

const StudentDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '', icon: LayoutDashboard, label: 'Overview' },
    { path: 'subjects', icon: BookOpen, label: 'My Subjects' },
    { path: 'attendance', icon: Calendar, label: 'Attendance' },
    { path: 'assignments', icon: CheckSquare, label: 'Assignments' },
    { path: 'performance', icon: BarChart3, label: 'Performance' },
    { path: 'gamification', icon: Trophy, label: 'Achievements' },
    { path: 'planner', icon: Target, label: 'Study Planner' },
    { path: 'analytics', icon: Brain, label: 'Analytics' },
    { path: 'mood', icon: Heart, label: 'Wellness' },
    { path: 'record', icon: FileText, label: 'My Record' }
  ];

  return (
    <div className="min-h-screen relative">
      <Background3D />
      
      {/* Top Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 h-16 glass-card border-b z-40 flex items-center px-4 lg:px-6"
      >
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden p-2 rounded-lg hover:bg-white/50 dark:hover:bg-slate-800/50"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        <div className="flex items-center gap-3 ml-4 lg:ml-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
            <span className="text-white font-bold text-lg">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </span>
          </div>
          <div>
            <h2 className="font-semibold text-sm">
              {user?.firstName} {user?.lastName}
            </h2>
            <p className="text-xs text-slate-500">
              Level {user?.studentProfile?.level || 1} • {user?.studentProfile?.xpPoints || 0} XP
            </p>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button className="p-2 rounded-lg hover:bg-white/50 dark:hover:bg-slate-800/50 relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <button className="p-2 rounded-lg hover:bg-white/50 dark:hover:bg-slate-800/50">
            <Settings className="w-5 h-5" />
          </button>
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg hover:bg-red-500/10 text-red-600 dark:text-red-400"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </motion.nav>

      <div className="flex pt-16">
        {/* Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed lg:sticky top-16 left-0 bottom-0 w-72 glass-card border-r p-4 overflow-y-auto scrollbar-thin z-30"
            >
              <nav className="space-y-1">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={`/student/${item.path}`}
                    end={item.path === ''}
                    className={({ isActive }) =>
                      isActive ? 'sidebar-link-active' : 'sidebar-link'
                    }
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </NavLink>
                ))}
              </nav>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-x-hidden">
          <Routes>
            <Route index element={<Overview />} />
            <Route path="subjects" element={<Subjects />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="assignments" element={<Assignments />} />
            <Route path="performance" element={<Performance />} />
            <Route path="gamification" element={<Gamification />} />
            <Route path="planner" element={<StudyPlanner />} />
            <Route path="analytics" element={<LearningAnalytics />} />
            <Route path="mood" element={<MoodTracker />} />
            <Route path="record" element={<StudentRecord />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;
