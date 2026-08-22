import React from 'react';
export default function Loading({
  label = 'Loading...'
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "loading-state"
  }, /*#__PURE__*/React.createElement("span", {
    className: "spinner",
    "aria-hidden": "true"
  }), label);
}