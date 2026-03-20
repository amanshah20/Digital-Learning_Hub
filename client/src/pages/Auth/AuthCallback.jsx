import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuthStore();

  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams.get('token');
      const error = searchParams.get('error');

      if (error) {
        toast.error('Authentication failed');
        navigate('/login');
        return;
      }

      if (token) {
        try {
          // Get user data with token
          const { data } = await api.get('/auth/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          login(data.user, token);
          toast.success('Welcome to EduVerse!');

          // Route based on role
          const roleRoute = {
            student: '/student',
            teacher: '/teacher',
            admin: '/admin'
          };
          navigate(roleRoute[data.user.role]);
        } catch (error) {
          toast.error('Failed to authenticate');
          navigate('/login');
        }
      } else {
        navigate('/login');
      }
    };

    handleCallback();
  }, [searchParams, navigate, login]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="loading-spinner mb-4"></div>
        <p className="text-slate-600 dark:text-slate-400">Completing authentication...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
