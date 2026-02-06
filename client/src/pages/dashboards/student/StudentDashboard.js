import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DashboardLayout from '../../../components/DashboardLayout';
import { fetchEnrolledCourses } from '../../../redux/slices/courseSlice';
import { attendanceService, assignmentService } from '../../../services/apiService';
import { FaBook, FaClipboardCheck, FaTasks, FaChartLine, FaCalendar, FaClock } from 'react-icons/fa';

const navigation = [
  { path: '/student', label: 'Dashboard', icon: FaChartLine },
  { path: '/student/courses', label: 'My Courses', icon: FaBook },
  { path: '/student/attendance', label: 'Attendance', icon: FaClipboardCheck },
  { path: '/student/assignments', label: 'Assignments', icon: FaTasks },
  { path: '/student/exams', label: 'Exams', icon: FaCalendar },
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

const StudentDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { enrolledCourses } = useSelector((state) => state.courses);
  const [stats, setStats] = useState({
    attendance: 0,
    pendingAssignments: 0,
    upcomingExams: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    dispatch(fetchEnrolledCourses());
    loadDashboardData();
  }, [dispatch]);

  const loadDashboardData = async () => {
    try {
      // Fetch attendance stats
      const attendanceRes = await attendanceService.getStudentAttendance(user.id);
      setStats(prev => ({
        ...prev,
        attendance: attendanceRes.data.statistics.attendancePercentage
      }));

      // Fetch pending assignments count
      const assignments = await Promise.all(
        enrolledCourses.map(course => assignmentService.getCourseAssignments(course._id))
      );
      const pending = assignments.reduce((count, res) => {
        return count + res.data.assignments.filter(a => {
          const dueDate = new Date(a.dueDate);
          return dueDate > new Date();
        }).length;
      }, 0);
      
      setStats(prev => ({ ...prev, pendingAssignments: pending }));
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  return (
    <DashboardLayout navigation={navigation}>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-8 text-white">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="text-primary-100">
            Here's your learning progress overview
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Enrolled Courses"
            value={enrolledCourses.length}
            icon={FaBook}
            color="text-blue-600"
            subtitle="Active learning paths"
          />
          <StatCard
            title="Attendance Rate"
            value={`${stats.attendance}%`}
            icon={FaClipboardCheck}
            color="text-green-600"
            subtitle="Keep it up!"
          />
          <StatCard
            title="Pending Assignments"
            value={stats.pendingAssignments}
            icon={FaTasks}
            color="text-orange-600"
            subtitle="Due this week"
          />
          <StatCard
            title="Upcoming Exams"
            value={stats.upcomingExams}
            icon={FaCalendar}
            color="text-purple-600"
            subtitle="Next 30 days"
          />
        </div>

        {/* Recent Courses */}
        <div className="card">
          <h2 className="text-xl font-bold mb-4">My Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {enrolledCourses.slice(0, 6).map(course => (
              <div key={course._id} className="border border-gray-200 rounded-lg p-4 hover:border-primary-500 transition-colors cursor-pointer">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{course.title}</h3>
                    <p className="text-sm text-gray-500">{course.courseCode}</p>
                  </div>
                </div>
                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium text-primary-600">
                      {course.enrolledStudents?.find(e => e.student === user.id)?.progress || 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full transition-all"
                      style={{
                        width: `${course.enrolledStudents?.find(e => e.student === user.id)?.progress || 0}%`
                      }}
                    />
                  </div>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <FaClock className="mr-1" />
                  <span>{course.duration} hours</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {recentActivity.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No recent activity</p>
            ) : (
              recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0">
                  <div>
                    <p className="font-medium text-gray-900">{activity.title}</p>
                    <p className="text-sm text-gray-500">{activity.description}</p>
                  </div>
                  <span className="text-xs text-gray-400">{activity.time}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
