import React from 'react';
export default function ErrorMessage({
  message,
  onRetry
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "error-box",
    role: "alert"
  }, /*#__PURE__*/React.createElement("strong", null, "We hit a snag."), /*#__PURE__*/React.createElement("span", null, message), onRetry && /*#__PURE__*/React.createElement("button", {
    className: "text-button",
    onClick: onRetry
  }, "Try again"));
}