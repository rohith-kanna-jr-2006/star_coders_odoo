import React from 'react';
export default function Modal({
  title,
  children,
  onClose
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "modal-backdrop",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal",
    onClick: event => event.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-heading"
  }, /*#__PURE__*/React.createElement("h2", null, title), /*#__PURE__*/React.createElement("button", {
    className: "icon-button",
    onClick: onClose,
    "aria-label": "Close"
  }, "Ã—")), children));
}