import React from 'react';

const StatusBadge = ({ status }) => {
  let bgColor = '#e2e3e5';
  let textColor = '#383d41';

  switch (status) {
    case 'Active':
    case 'Present':
    case 'Approved':
      bgColor = '#d4edda';
      textColor = '#155724';
      break;
    case 'Inactive':
    case 'Absent':
    case 'Rejected':
      bgColor = '#f8d7da';
      textColor = '#721c24';
      break;
    case 'Half-day':
    case 'Pending':
      bgColor = '#fff3cd';
      textColor = '#856404';
      break;
    case 'Leave':
      bgColor = '#cce5ff';
      textColor = '#004085';
      break;
    default:
      break;
  }

  return React.createElement(
    'span',
    {
      style: {
        padding: '4px 8px',
        borderRadius: '12px',
        fontSize: '0.85em',
        backgroundColor: bgColor,
        color: textColor,
        display: 'inline-block',
        whiteSpace: 'nowrap'
      }
    },
    status
  );
};

export default StatusBadge;
