import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <ShieldAlert className="w-24 h-24 mx-auto text-red-500 mb-4" />
        <h1 className="text-4xl font-bold mb-2">Access Denied</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          You don't have permission to access this page.
        </p>
        <Link to="/login" className="btn-primary inline-block">
          Go to Login
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
