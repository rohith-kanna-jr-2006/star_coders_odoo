import React from 'react';
import { NavLink } from 'react-router-dom';
import { BarChart3, CalendarDays, CircleDollarSign, LayoutDashboard, LogOut, UserRound, X } from 'lucide-react';
const links = [['/employee/dashboard', 'Dashboard', LayoutDashboard], ['/employee/profile', 'Profile', UserRound], ['/employee/attendance', 'Attendance', CalendarDays], ['/employee/leave', 'Leave', BarChart3], ['/employee/payroll', 'Payroll', CircleDollarSign]];
export default function Sidebar({
  open,
  onClose,
  onLogout
}) {
  return /*#__PURE__*/React.createElement("aside", {
    className: `sidebar ${open ? 'sidebar-open' : ''}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "brand"
  }, /*#__PURE__*/React.createElement("span", {
    className: "brand-mark"
  }, "D"), /*#__PURE__*/React.createElement("span", null, "dayflow"), /*#__PURE__*/React.createElement("button", {
    className: "icon-button mobile-only",
    onClick: onClose,
    "aria-label": "Close menu"
  }, /*#__PURE__*/React.createElement(X, {
    size: 20
  }))), /*#__PURE__*/React.createElement("nav", null, links.map(([to, label, Icon]) => /*#__PURE__*/React.createElement(NavLink, {
    key: to,
    to: to,
    onClick: onClose,
    className: ({
      isActive
    }) => isActive ? 'nav-link active' : 'nav-link'
  }, /*#__PURE__*/React.createElement(Icon, {
    size: 18
  }), label))), /*#__PURE__*/React.createElement("button", {
    className: "nav-link logout-link",
    onClick: onLogout
  }, /*#__PURE__*/React.createElement(LogOut, {
    size: 18
  }), "Log out"));
}