import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/AdminLayout';

// Pages
import Login from './pages/auth/Login';
import Dashboard from './pages/admin/Dashboard';
import Employees from './pages/admin/Employees';
import Attendance from './pages/admin/Attendance';
import LeaveRequests from './pages/admin/LeaveRequests';
import Payroll from './pages/admin/Payroll';

// Placeholder for Employee (Member 1) module
const EmployeeDashboard = () => React.createElement(
  'div',
  { style: { padding: '2rem' } },
  React.createElement('h1', null, 'Employee Dashboard'),
  React.createElement('p', null, "Member 1's Module")
);

function App() {
  return React.createElement(
    BrowserRouter,
    null,
    React.createElement(
      Routes,
      null,
      React.createElement(Route, { path: '/', element: React.createElement(Navigate, { to: '/login', replace: true }) }),
      React.createElement(Route, { path: '/login', element: React.createElement(Login, null) }),
      
      // Admin Routes
      React.createElement(
        Route,
        {
          path: '/admin',
          element: React.createElement(
            ProtectedRoute,
            { allowedRoles: ['admin', 'hr'] },
            React.createElement(AdminLayout, null)
          )
        },
        React.createElement(Route, { index: true, element: React.createElement(Navigate, { to: '/admin/dashboard', replace: true }) }),
        React.createElement(Route, { path: 'dashboard', element: React.createElement(Dashboard, null) }),
        React.createElement(Route, { path: 'employees', element: React.createElement(Employees, null) }),
        React.createElement(Route, { path: 'attendance', element: React.createElement(Attendance, null) }),
        React.createElement(Route, { path: 'leave', element: React.createElement(LeaveRequests, null) }),
        React.createElement(Route, { path: 'payroll', element: React.createElement(Payroll, null) })
      ),

      // Employee Routes (Member 1)
      React.createElement(
        Route,
        {
          path: '/employee',
          element: React.createElement(
            ProtectedRoute,
            { allowedRoles: ['employee'] },
            React.createElement(EmployeeDashboard, null)
          )
        },
        React.createElement(Route, { path: 'dashboard', element: React.createElement(EmployeeDashboard, null) })
      )
    )
  );
}

export default App;
