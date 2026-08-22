import React, { useState, useEffect } from 'react';

export const notify = (message, type = 'info') => {
  const event = new CustomEvent('show-notification', { detail: { message, type } });
  window.dispatchEvent(event);
};

const Notification = () => {
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const handleNotification = (e) => {
      setToast(e.detail);
      setTimeout(() => setToast(null), 3000);
    };
    window.addEventListener('show-notification', handleNotification);
    return () => window.removeEventListener('show-notification', handleNotification);
  }, []);

  if (!toast) return null;

  let bgColor = '#17a2b8';
  if (toast.type === 'success') bgColor = '#28a745';
  if (toast.type === 'error') bgColor = '#dc3545';
  if (toast.type === 'warning') bgColor = '#ffc107';

  return React.createElement(
    'div',
    {
      style: {
        position: 'fixed', top: '20px', right: '20px', zIndex: 9999,
        backgroundColor: bgColor, color: '#fff', padding: '12px 20px',
        borderRadius: '4px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        transition: 'opacity 0.3s'
      }
    },
    toast.message
  );
};

export default Notification;
