import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './Sidebar/AdminSidebar';
import AdminNavbar from './Navbar/AdminNavbar';

const AdminLayout = () => {
  return React.createElement(
    'div',
    { className: 'admin-layout' },
    React.createElement(AdminSidebar, null),
    React.createElement(
      'div',
      { className: 'admin-main-content' },
      React.createElement(AdminNavbar, null),
      React.createElement(
        'main',
        { className: 'admin-page-content' },
        React.createElement(Outlet, null)
      )
    )
  );
};

export default AdminLayout;
