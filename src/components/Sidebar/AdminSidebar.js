import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const AdminSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard' },
    { name: 'Employees', path: '/admin/employees' },
    { name: 'Attendance', path: '/admin/attendance' },
    { name: 'Leave', path: '/admin/leave' },
    { name: 'Payroll', path: '/admin/payroll' }
  ];

  return React.createElement(
    'div',
    { className: 'admin-sidebar' },
    React.createElement(
      'div',
      { className: 'sidebar-header' },
      React.createElement('h2', null, 'DAYFLOW')
    ),
    React.createElement(
      'nav',
      { className: 'sidebar-nav' },
      navItems.map(item => 
        React.createElement(
          NavLink,
          {
            key: item.name,
            to: item.path,
            className: ({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link',
            end: item.path === '/admin/dashboard'
          },
          item.name
        )
      )
    ),
    React.createElement(
      'div',
      { className: 'sidebar-footer' },
      React.createElement(
        'button',
        { className: 'logout-button', onClick: handleLogout },
        'Logout'
      )
    )
  );
};

export default AdminSidebar;
