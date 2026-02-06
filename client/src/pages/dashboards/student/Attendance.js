import React from 'react';
import DashboardLayout from '../../../components/DashboardLayout';
import { FaBook, FaChartLine, FaClipboardCheck, FaTasks, FaCalendar } from 'react-icons/fa';

const navigation = [
  { path: '/student', label: 'Dashboard', icon: FaChartLine },
  { path: '/student/courses', label: 'My Courses', icon: FaBook },
  { path: '/student/attendance', label: 'Attendance', icon: FaClipboardCheck },
  { path: '/student/assignments', label: 'Assignments', icon: FaTasks },
  { path: '/student/exams', label: 'Exams', icon: FaCalendar },
];

const StudentAttendance = () => {
  return (
    <DashboardLayout navigation={navigation}>
      <h1 className="text-2xl font-bold mb-6">Attendance Records</h1>
      <p>Student attendance content</p>
    </DashboardLayout>
  );
};

export default StudentAttendance;
