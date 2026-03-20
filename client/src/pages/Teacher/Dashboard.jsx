import React, { useState } from 'react';
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  CheckSquare,
  FileText,
  BarChart3,
  MessageSquare,
  QrCode,
  LogOut,
  Menu,
  Bell,
  Settings
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import Background3D from '../../components/Background3D';

// Teacher Pages
import TeacherOverview from './pages/Overview';
import MyClasses from './pages/MyClasses';
import Students from './pages/Students';
import ManageAttendance from './pages/ManageAttendance';
import AssignmentsQuizzes from './pages/AssignmentsQuizzes';
import Analytics from './pages/Analytics';
import Communication from './pages/Communication';

const TeacherDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const navItems = [
    { path: '', icon: LayoutDashboard, label: 'Overview' },
    { path: 'classes', icon: BookOpen, label: 'My Classes' },
    { path: 'students', icon: Users, label: 'Students' },
    { path: 'attendance', icon: CheckSquare, label: 'Attendance' },
    { path: 'assignments', icon: FileText, label: 'Assignments & Quizzes' },
    { path: 'analytics', icon: BarChart3, label: 'Analytics' },
    { path: 'communication', icon: MessageSquare, label: 'Communication' }
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
          className="lg:hidden p-2 rounded-lg hover:bg-white/50"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-3 ml-4 lg:ml-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary-500 to-accent-500 flex items-center justify-center">
            <span className="text-white font-bold text-lg">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </span>
          </div>
          <div>
            <h2 className="font-semibold text-sm">
              {user?.firstName} {user?.lastName}
            </h2>
            <p className="text-xs text-slate-500">Teacher</p>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button className="p-2 rounded-lg hover:bg-white/50 relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <button className="p-2 rounded-lg hover:bg-white/50">
            <Settings className="w-5 h-5" />
          </button>
          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="p-2 rounded-lg hover:bg-red-500/10 text-red-600"
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
              className="fixed lg:sticky top-16 left-0 bottom-0 w-72 glass-card border-r p-4 overflow-y-auto scrollbar-thin z-30"
            >
              <nav className="space-y-1">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={`/teacher/${item.path}`}
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
        <main className="flex-1 p-4 lg:p-8">
          <Routes>
            <Route index element={<TeacherOverview />} />
            <Route path="classes" element={<MyClasses />} />
            <Route path="students" element={<Students />} />
            <Route path="attendance" element={<ManageAttendance />} />
            <Route path="assignments" element={<AssignmentsQuizzes />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="communication" element={<Communication />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default TeacherDashboard;
