import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useAuth } from '../context/AuthContext';
export default function EmployeeLayout() {
  const [open, setOpen] = useState(false);
  const {
    logout
  } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "app-shell"
  }, /*#__PURE__*/React.createElement(Sidebar, {
    open: open,
    onClose: () => setOpen(false),
    onLogout: handleLogout
  }), open && /*#__PURE__*/React.createElement("div", {
    className: "sidebar-scrim",
    onClick: () => setOpen(false)
  }), /*#__PURE__*/React.createElement("div", {
    className: "app-main"
  }, /*#__PURE__*/React.createElement(Navbar, {
    onMenu: () => setOpen(true)
  }), /*#__PURE__*/React.createElement("main", {
    className: "page-content"
  }, /*#__PURE__*/React.createElement(Outlet, null))));
}