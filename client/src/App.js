import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import socketService from './services/socketService';
import { addNotification } from './redux/slices/notificationSlice';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Student Dashboard
import StudentDashboard from './pages/dashboards/student/StudentDashboard';
import StudentCourses from './pages/dashboards/student/Courses';
import StudentAttendance from './pages/dashboards/student/Attendance';
import StudentAssignments from './pages/dashboards/student/Assignments';
import StudentExams from './pages/dashboards/student/Exams';

// Teacher Dashboard
import TeacherDashboard from './pages/dashboards/teacher/TeacherDashboard';
import TeacherCourses from './pages/dashboards/teacher/Courses';
import TeacherAttendance from './pages/dashboards/teacher/Attendance';
import TeacherAssignments from './pages/dashboards/teacher/Assignments';
import TeacherExams from './pages/dashboards/teacher/Exams';

// Admin Dashboard
import AdminDashboard from './pages/dashboards/admin/AdminDashboard';
import AdminUsers from './pages/dashboards/admin/Users';
import AdminCourses from './pages/dashboards/admin/Courses';
import AdminAnalytics from './pages/dashboards/admin/Analytics';
import AdminLogs from './pages/dashboards/admin/Logs';

// Components
import PrivateRoute from './components/PrivateRoute';
import RoleBasedRoute from './components/RoleBasedRoute';

function App() {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated && user) {
      socketService.connect(user.id);

      // Listen for real-time notifications
      socketService.onNotification((notification) => {
        dispatch(addNotification(notification));
      });

      return () => {
        socketService.disconnect();
      };
    }
  }, [isAuthenticated, user, dispatch]);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Student Routes */}
      <Route
        path="/student"
        element={
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={['student']}>
              <StudentDashboard />
            </RoleBasedRoute>
          </PrivateRoute>
        }
      />
      <Route
        path="/student/courses"
        element={
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={['student']}>
              <StudentCourses />
            </RoleBasedRoute>
          </PrivateRoute>
        }
      />
      <Route
        path="/student/attendance"
        element={
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={['student']}>
              <StudentAttendance />
            </RoleBasedRoute>
          </PrivateRoute>
        }
      />
      <Route
        path="/student/assignments"
        element={
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={['student']}>
              <StudentAssignments />
            </RoleBasedRoute>
          </PrivateRoute>
        }
      />
      <Route
        path="/student/exams"
        element={
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={['student']}>
              <StudentExams />
            </RoleBasedRoute>
          </PrivateRoute>
        }
      />

      {/* Teacher Routes */}
      <Route
        path="/teacher"
        element={
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={['teacher']}>
              <TeacherDashboard />
            </RoleBasedRoute>
          </PrivateRoute>
        }
      />
      <Route
        path="/teacher/courses"
        element={
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={['teacher']}>
              <TeacherCourses />
            </RoleBasedRoute>
          </PrivateRoute>
        }
      />
      <Route
        path="/teacher/attendance"
        element={
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={['teacher']}>
              <TeacherAttendance />
            </RoleBasedRoute>
          </PrivateRoute>
        }
      />
      <Route
        path="/teacher/assignments"
        element={
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={['teacher']}>
              <TeacherAssignments />
            </RoleBasedRoute>
          </PrivateRoute>
        }
      />
      <Route
        path="/teacher/exams"
        element={
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={['teacher']}>
              <TeacherExams />
            </RoleBasedRoute>
          </PrivateRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </RoleBasedRoute>
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={['admin']}>
              <AdminUsers />
            </RoleBasedRoute>
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/courses"
        element={
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={['admin']}>
              <AdminCourses />
            </RoleBasedRoute>
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/analytics"
        element={
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={['admin']}>
              <AdminAnalytics />
            </RoleBasedRoute>
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/logs"
        element={
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={['admin']}>
              <AdminLogs />
            </RoleBasedRoute>
          </PrivateRoute>
        }
      />

      {/* Default Redirect */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            user?.role === 'student' ? (
              <Navigate to="/student" replace />
            ) : user?.role === 'teacher' ? (
              <Navigate to="/teacher" replace />
            ) : user?.role === 'admin' ? (
              <Navigate to="/admin" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
