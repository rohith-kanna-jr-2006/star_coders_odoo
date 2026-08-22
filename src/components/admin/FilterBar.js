import React from 'react';

const FilterBar = ({ searchPlaceholder, searchValue, onSearchChange, children }) => {
  return React.createElement(
    'div',
    { className: 'filter-bar card', style: { padding: '20px', border: '1px solid var(--border, #ddd)', borderRadius: '8px', marginBottom: '20px', display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'center' } },
    React.createElement(
      'div',
      { className: 'filter-group', style: { flex: '1 1 200px' } },
      React.createElement('input', {
        type: 'text',
        placeholder: searchPlaceholder || 'Search...',
        value: searchValue,
        onChange: (e) => onSearchChange(e.target.value),
        style: { width: '100%', padding: '8px 12px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }
      })
    ),
    children
  );
};

export default FilterBar;
