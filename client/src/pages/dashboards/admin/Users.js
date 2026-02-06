import React from 'react';
import DashboardLayout from '../../../components/DashboardLayout';
import { FaUsers, FaBook, FaChartLine, FaUserShield } from 'react-icons/fa';

const navigation = [
  { path: '/admin', label: 'Dashboard', icon: FaChartLine },
  { path: '/admin/users', label: 'User Management', icon: FaUsers },
  { path: '/admin/courses', label: 'Course Management', icon: FaBook },
  { path: '/admin/analytics', label: 'Analytics', icon: FaChartLine },
  { path: '/admin/logs', label: 'Activity Logs', icon: FaUserShield },
];

const AdminUsers = () => {
  return (
    <DashboardLayout navigation={navigation}>
      <h1 className="text-2xl font-bold mb-6">User Management</h1>
      <p>Admin user management content</p>
    </DashboardLayout>
  );
};

export default AdminUsers;
