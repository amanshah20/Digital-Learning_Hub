import React, { useState } from 'react';
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  GraduationCap,
  BarChart3,
  DollarSign,
  Shield,
  Settings as SettingsIcon,
  LogOut,
  Menu,
  Bell
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import Background3D from '../../components/Background3D';

// Admin Pages - Using Real Data From API
import AdminOverview from './pages/OverviewNew';
import UserManagement from './pages/UserManagementRealData';
import CourseManagement from './pages/CourseManagementRealData';
import AcademicControl from './pages/AcademicControlRealData';
import SystemAnalytics from './pages/SystemAnalyticsRealData';
import FeeManagement from './pages/FeeManagementRealData';
import Security from './pages/SecurityRealData';
import Settings from './pages/SettingsNew';

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const navItems = [
    { path: '', icon: LayoutDashboard, label: 'Dashboard' },
    { path: 'users', icon: Users, label: 'User Management' },
    { path: 'courses', icon: GraduationCap, label: 'Courses' },
    { path: 'academic', icon: BookOpen, label: 'Academic Control' },
    { path: 'analytics', icon: BarChart3, label: 'Analytics' },
    { path: 'fees', icon: DollarSign, label: 'Fee Management' },
    { path: 'security', icon: Shield, label: 'Security' },
    { path: 'settings', icon: SettingsIcon, label: 'Settings' }
  ];

  return (
    <div className="min-h-screen relative">
      <Background3D />
      
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
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-sm">Admin Panel</h2>
            <p className="text-xs text-slate-500">System Administrator</p>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button className="p-2 rounded-lg hover:bg-white/50 relative">
            <Bell className="w-5 h-5" />
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
                    to={`/admin/${item.path}`}
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

        <main className="flex-1 p-4 lg:p-8">
          <Routes>
            <Route index element={<AdminOverview />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="courses" element={<CourseManagement />} />
            <Route path="academic" element={<AcademicControl />} />
            <Route path="analytics" element={<SystemAnalytics />} />
            <Route path="fees" element={<FeeManagement />} />
            <Route path="security" element={<Security />} />
            <Route path="settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
