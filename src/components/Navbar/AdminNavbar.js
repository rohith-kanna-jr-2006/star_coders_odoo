import React from 'react';

const AdminNavbar = () => {
  return React.createElement(
    'header',
    { className: 'admin-navbar' },
    React.createElement(
      'div',
      { className: 'navbar-title' },
      React.createElement('h3', null, 'Admin / HR Portal')
    ),
    React.createElement(
      'div',
      { className: 'navbar-profile' },
      React.createElement('span', { className: 'profile-name' }, 'Welcome, HR Admin')
    )
  );
};

export default AdminNavbar;
