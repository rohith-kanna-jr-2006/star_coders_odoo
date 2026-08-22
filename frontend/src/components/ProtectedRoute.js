import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
export default function ProtectedRoute() {
  const {
    isAuthenticated
  } = useAuth();
  const location = useLocation();
  return isAuthenticated ? /*#__PURE__*/React.createElement(Outlet, null) : /*#__PURE__*/React.createElement(Navigate, {
    to: "/login",
    replace: true,
    state: {
      from: location
    }
  });
}