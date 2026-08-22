import React, { useEffect } from 'react';

const Modal = ({ title, onClose, children, footer }) => {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return React.createElement(
    'div',
    {
      className: 'modal-overlay',
      style: {
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
        alignItems: 'center', justifyContent: 'center', zIndex: 1000,
        padding: '20px'
      },
      onClick: (e) => {
        if (e.target.className === 'modal-overlay') onClose();
      }
    },
    React.createElement(
      'div',
      {
        className: 'modal-content card',
        style: {
          backgroundColor: 'var(--bg, #fff)', borderRadius: '8px',
          width: '100%', maxWidth: '500px', maxHeight: '90vh',
          display: 'flex', flexDirection: 'column',
          boxShadow: 'var(--shadow, 0 10px 15px -3px rgba(0,0,0,0.1))',
          color: 'var(--text, #333)'
        }
      },
      React.createElement(
        'div',
        {
          className: 'modal-header',
          style: { padding: '20px', borderBottom: '1px solid var(--border, #eee)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }
        },
        React.createElement('h2', { style: { margin: 0, fontSize: '20px', color: 'var(--text-h, #000)' } }, title),
        React.createElement(
          'button',
          {
            onClick: onClose,
            style: { background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', lineHeight: 1, color: 'var(--text, #333)' }
          },
          '×'
        )
      ),
      React.createElement(
        'div',
        {
          className: 'modal-body',
          style: { padding: '20px', overflowY: 'auto' }
        },
        children
      ),
      footer && React.createElement(
        'div',
        {
          className: 'modal-footer',
          style: { padding: '20px', borderTop: '1px solid var(--border, #eee)', display: 'flex', justifyContent: 'flex-end', gap: '10px' }
        },
        footer
      )
    )
  );
};

export default Modal;
