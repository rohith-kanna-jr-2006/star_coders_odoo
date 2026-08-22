import React from 'react';
export default function StatusBadge({
  status
}) {
  const value = String(status || 'Unknown');
  return /*#__PURE__*/React.createElement("span", {
    className: `status status-${value.toLowerCase().replace(/[^a-z]+/g, '-')}`
  }, value);
}