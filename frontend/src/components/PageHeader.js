import React from 'react';
export default function PageHeader({
  eyebrow,
  title,
  description,
  action
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "page-header"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow"
  }, eyebrow), /*#__PURE__*/React.createElement("h1", null, title), description && /*#__PURE__*/React.createElement("p", null, description)), action);
}