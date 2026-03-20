import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <FileQuestion className="w-24 h-24 mx-auto text-primary-500 mb-4" />
        <h1 className="text-6xl font-bold mb-2">404</h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 mb-6">
          Page not found
        </p>
        <Link to="/login" className="btn-primary inline-block">
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
