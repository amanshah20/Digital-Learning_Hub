import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DashboardLayout from '../../../components/DashboardLayout';
import { fetchTeacherCourses } from '../../../redux/slices/courseSlice';
import { courseService, attendanceService } from '../../../services/apiService';
import { FaBook, FaUserGraduate, FaClipboardCheck, FaTasks, FaChartBar, FaCalendar } from 'react-icons/fa';

const navigation = [
  { path: '/teacher', label: 'Dashboard', icon: FaChartBar },
  { path: '/teacher/courses', label: 'My Courses', icon: FaBook },
  { path: '/teacher/attendance', label: 'Attendance', icon: FaClipboardCheck },
  { path: '/teacher/assignments', label: 'Assignments', icon: FaTasks },
  { path: '/teacher/exams', label: 'Exams', icon: FaCalendar },
];

const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
  <div className="card hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600 mb-1">{title}</p>
        <p className={`text-3xl font-bold ${color}`}>{value}</p>
        {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
      </div>
      <div className={`p-4 rounded-full ${color.replace('text', 'bg')} bg-opacity-10`}>
        <Icon className={`text-2xl ${color}`} />
      </div>
    </div>
  </div>
);

const TeacherDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { teacherCourses } = useSelector((state) => state.courses);
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeCourses: 0,
    pendingSubmissions: 0,
    avgAttendance: 0,
  });

  useEffect(() => {
    dispatch(fetchTeacherCourses());
    loadDashboardData();
  }, [dispatch]);

  const loadDashboardData = async () => {
    try {
      if (teacherCourses.length > 0) {
        // Calculate total students across all courses
        const totalStudents = teacherCourses.reduce((sum, course) => {
          return sum + (course.enrolledStudents?.length || 0);
        }, 0);

        setStats(prev => ({
          ...prev,
          totalStudents,
          activeCourses: teacherCourses.filter(c => c.status === 'active').length
        }));
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  return (
    <DashboardLayout navigation={navigation}>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-8 text-white">
          <h1 className="text-3xl font-bold mb-2">
            Welcome, {user?.firstName} {user?.lastName}
          </h1>
          <p className="text-purple-100">
            Teacher ID: {user?.teacherId}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Active Courses"
            value={stats.activeCourses}
            icon={FaBook}
            color="text-blue-600"
            subtitle="Currently teaching"
          />
          <StatCard
            title="Total Students"
            value={stats.totalStudents}
            icon={FaUserGraduate}
            color="text-green-600"
            subtitle="Across all courses"
          />
          <StatCard
            title="Pending Reviews"
            value={stats.pendingSubmissions}
            icon={FaTasks}
            color="text-orange-600"
            subtitle="Assignments to grade"
          />
          <StatCard
            title="Avg. Attendance"
            value={`${stats.avgAttendance}%`}
            icon={FaClipboardCheck}
            color="text-purple-600"
            subtitle="Last 30 days"
          />
        </div>

        {/* My Courses */}
        <div className="card">
          <h2 className="text-xl font-bold mb-4">My Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teacherCourses.map(course => (
              <div key={course._id} className="border border-gray-200 rounded-lg p-4 hover:border-purple-500 transition-colors cursor-pointer">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{course.title}</h3>
                    <p className="text-sm text-gray-500">{course.courseCode}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    course.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {course.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600">Students Enrolled</span>
                  <span className="font-semibold text-purple-600">
                    {course.enrolledStudents?.length || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Lessons</span>
                  <span className="font-semibold text-gray-900">
                    {course.lessons?.length || 0}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <h2 className="text-xl font-bold mb-4">Recent Submissions</h2>
            <div className="text-center text-gray-500 py-8">
              No recent submissions
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-bold mb-4">Upcoming Classes</h2>
            <div className="text-center text-gray-500 py-8">
              No scheduled classes
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TeacherDashboard;
