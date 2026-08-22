import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return React.createElement('div', { className: 'loading-screen' }, 'Loading...');
  }

  if (!user) {
    return React.createElement(Navigate, { to: '/login', replace: true });
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If not allowed, redirect to a fallback or their respective dashboard
    if (user.role === 'employee') {
      return React.createElement(Navigate, { to: '/employee/dashboard', replace: true });
    }
    return React.createElement(Navigate, { to: '/unauthorized', replace: true });
  }

  return children;
};

export default ProtectedRoute;
