import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DashboardLayout from '../../../components/DashboardLayout';
import { adminService } from '../../../services/apiService';
import { FaUsers, FaBook, FaChartLine, FaExclamationTriangle, FaUserShield, FaChalkboardTeacher } from 'react-icons/fa';

const navigation = [
  { path: '/admin', label: 'Dashboard', icon: FaChartLine },
  { path: '/admin/users', label: 'User Management', icon: FaUsers },
  { path: '/admin/courses', label: 'Course Management', icon: FaBook },
  { path: '/admin/analytics', label: 'Analytics', icon: FaChartLine },
  { path: '/admin/logs', label: 'Activity Logs', icon: FaUserShield },
];

const StatCard = ({ title, value, icon: Icon, color, subtitle, trend }) => (
  <div className="card hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600 mb-1">{title}</p>
        <p className={`text-3xl font-bold ${color}`}>{value}</p>
        {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        {trend && (
          <span className={`text-xs font-medium ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend > 0 ? '+' : ''}{trend}% from last month
          </span>
        )}
      </div>
      <div className={`p-4 rounded-full ${color.replace('text', 'bg')} bg-opacity-10`}>
        <Icon className={`text-2xl ${color}`} />
      </div>
    </div>
  </div>
);

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStudents: 0,
    totalTeachers: 0,
    totalCourses: 0,
    activeCourses: 0,
    recentActivities: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [usersRes, coursesRes, logsRes] = await Promise.all([
        adminService.getAllUsers(),
        adminService.getAllCourses(),
        adminService.getActivityLogs({ limit: 10 })
      ]);

      const users = usersRes.data.users;
      const courses = coursesRes.data.courses;

      setStats({
        totalUsers: users.length,
        totalStudents: users.filter(u => u.role === 'student').length,
        totalTeachers: users.filter(u => u.role === 'teacher').length,
        totalCourses: courses.length,
        activeCourses: courses.filter(c => c.status === 'active').length,
        recentActivities: logsRes.data.logs
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout navigation={navigation}>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-xl p-8 text-white">
          <h1 className="text-3xl font-bold mb-2">
            Admin Dashboard
          </h1>
          <p className="text-indigo-100">
            Platform Overview & Management
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon={FaUsers}
            color="text-blue-600"
            subtitle="Platform registered"
            trend={12}
          />
          <StatCard
            title="Students"
            value={stats.totalStudents}
            icon={FaUsers}
            color="text-green-600"
            subtitle="Active learners"
            trend={8}
          />
          <StatCard
            title="Teachers"
            value={stats.totalTeachers}
            icon={FaChalkboardTeacher}
            color="text-purple-600"
            subtitle="Instructors"
            trend={5}
          />
          <StatCard
            title="Courses"
            value={stats.totalCourses}
            icon={FaBook}
            color="text-orange-600"
            subtitle={`${stats.activeCourses} active`}
            trend={15}
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button className="card text-left hover:shadow-lg transition-all hover:scale-105">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FaUsers className="text-2xl text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Manage Users</h3>
                <p className="text-sm text-gray-500">Add, edit, or remove users</p>
              </div>
            </div>
          </button>

          <button className="card text-left hover:shadow-lg transition-all hover:scale-105">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <FaBook className="text-2xl text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Manage Courses</h3>
                <p className="text-sm text-gray-500">Organize course catalog</p>
              </div>
            </div>
          </button>

          <button className="card text-left hover:shadow-lg transition-all hover:scale-105">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <FaChartLine className="text-2xl text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">View Analytics</h3>
                <p className="text-sm text-gray-500">Platform insights</p>
              </div>
            </div>
          </button>
        </div>

        {/* Recent Activity & System Health */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {stats.recentActivities.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No recent activity</p>
              ) : (
                stats.recentActivities.map((activity) => (
                  <div key={activity._id} className="flex items-start space-x-3 border-b border-gray-100 pb-3 last:border-0">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{activity.action}</p>
                      <p className="text-sm text-gray-500">
                        {activity.user?.firstName} {activity.user?.lastName}
                      </p>
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(activity.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-bold mb-4">System Health</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Server Status</span>
                  <span className="font-medium text-green-600">Operational</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '100%' }} />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Database Connection</span>
                  <span className="font-medium text-green-600">Connected</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '100%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">API Response Time</span>
                  <span className="font-medium text-blue-600">45ms</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
