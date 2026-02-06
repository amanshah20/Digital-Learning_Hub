import React from 'react';
import DashboardLayout from '../../../components/DashboardLayout';
import { FaBook, FaChartBar, FaClipboardCheck, FaTasks, FaCalendar } from 'react-icons/fa';

const navigation = [
  { path: '/teacher', label: 'Dashboard', icon: FaChartBar },
  { path: '/teacher/courses', label: 'My Courses', icon: FaBook },
  { path: '/teacher/attendance', label: 'Attendance', icon: FaClipboardCheck },
  { path: '/teacher/assignments', label: 'Assignments', icon: FaTasks },
  { path: '/teacher/exams', label: 'Exams', icon: FaCalendar },
];

const TeacherAssignments = () => {
  return (
    <DashboardLayout navigation={navigation}>
      <h1 className="text-2xl font-bold mb-6">Assignments & Grading</h1>
      <p>Teacher assignments content</p>
    </DashboardLayout>
  );
};

export default TeacherAssignments;
