import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import EmployeeLayout from './components/EmployeeLayout';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Dashboard from './pages/employee/Dashboard';
import Profile from './pages/employee/Profile';
import Attendance from './pages/employee/Attendance';
import Leave from './pages/employee/Leave';
import Payroll from './pages/employee/Payroll';
export default function App() {
  return /*#__PURE__*/React.createElement(AuthProvider, null, /*#__PURE__*/React.createElement(Routes, null, /*#__PURE__*/React.createElement(Route, {
    path: "/login",
    element: /*#__PURE__*/React.createElement(Login, null)
  }), /*#__PURE__*/React.createElement(Route, {
    path: "/signup",
    element: /*#__PURE__*/React.createElement(Signup, null)
  }), /*#__PURE__*/React.createElement(Route, {
    element: /*#__PURE__*/React.createElement(ProtectedRoute, null)
  }, /*#__PURE__*/React.createElement(Route, {
    element: /*#__PURE__*/React.createElement(EmployeeLayout, null)
  }, /*#__PURE__*/React.createElement(Route, {
    path: "/employee/dashboard",
    element: /*#__PURE__*/React.createElement(Dashboard, null)
  }), /*#__PURE__*/React.createElement(Route, {
    path: "/employee/profile",
    element: /*#__PURE__*/React.createElement(Profile, null)
  }), /*#__PURE__*/React.createElement(Route, {
    path: "/employee/attendance",
    element: /*#__PURE__*/React.createElement(Attendance, null)
  }), /*#__PURE__*/React.createElement(Route, {
    path: "/employee/leave",
    element: /*#__PURE__*/React.createElement(Leave, null)
  }), /*#__PURE__*/React.createElement(Route, {
    path: "/employee/payroll",
    element: /*#__PURE__*/React.createElement(Payroll, null)
  }))), /*#__PURE__*/React.createElement(Route, {
    path: "*",
    element: /*#__PURE__*/React.createElement(Navigate, {
      to: "/login",
      replace: true
    })
  })));
}