import React from 'react';
import { Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
export default function Navbar({
  onMenu
}) {
  const {
    user
  } = useAuth();
  return /*#__PURE__*/React.createElement("header", {
    className: "topbar"
  }, /*#__PURE__*/React.createElement("button", {
    className: "icon-button mobile-only",
    onClick: onMenu,
    "aria-label": "Open menu"
  }, /*#__PURE__*/React.createElement(Menu, {
    size: 21
  })), /*#__PURE__*/React.createElement("div", {
    className: "topbar-title"
  }, "Employee workspace"), /*#__PURE__*/React.createElement("div", {
    className: "user-chip"
  }, /*#__PURE__*/React.createElement("span", {
    className: "avatar small"
  }, (user?.name || user?.fullName || 'E').slice(0, 1).toUpperCase()), /*#__PURE__*/React.createElement("span", null, user?.name || user?.fullName || 'Employee')));
}