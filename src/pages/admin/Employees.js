import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getEmployees } from '../../services/employeeService';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const res = await getEmployees(search);
        setEmployees(res.data);
        setError(null);
      } catch (err) {
        setError('Failed to load employees.');
      } finally {
        setLoading(false);
      }
    };
    
    // Simple debounce could be added here, but direct fetch on search change for hackathon simplicity
    const timer = setTimeout(() => {
      fetchEmployees();
    }, 300);
    
    return () => clearTimeout(timer);
  }, [search]);

  return React.createElement(
    'div',
    { className: 'page' },
    React.createElement(
      'div',
      { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' } },
      React.createElement('h1', { className: 'page-title', style: { margin: 0 } }, 'Employee Management'),
      React.createElement('input', {
        type: 'text',
        placeholder: 'Search employee...',
        value: search,
        onChange: (e) => setSearch(e.target.value),
        style: { padding: '8px 12px', borderRadius: '4px', border: '1px solid #ccc', minWidth: '250px' }
      })
    ),
    error ? React.createElement('div', { className: 'error-state' }, error) : null,
    loading ? React.createElement('div', { className: 'loading-state' }, 'Loading employees...') : 
      React.createElement(
        'div',
        { className: 'table-container card', style: { border: '1px solid #ddd', borderRadius: '8px', overflowX: 'auto' } },
        React.createElement(
          'table',
          { className: 'data-table', style: { width: '100%', textAlign: 'left', borderCollapse: 'collapse' } },
          React.createElement(
            'thead',
            null,
            React.createElement(
              'tr',
              null,
              React.createElement('th', { style: { borderBottom: '2px solid #ddd', padding: '12px' } }, 'ID'),
              React.createElement('th', { style: { borderBottom: '2px solid #ddd', padding: '12px' } }, 'Name'),
              React.createElement('th', { style: { borderBottom: '2px solid #ddd', padding: '12px' } }, 'Department'),
              React.createElement('th', { style: { borderBottom: '2px solid #ddd', padding: '12px' } }, 'Designation'),
              React.createElement('th', { style: { borderBottom: '2px solid #ddd', padding: '12px' } }, 'Email'),
              React.createElement('th', { style: { borderBottom: '2px solid #ddd', padding: '12px' } }, 'Status'),
              React.createElement('th', { style: { borderBottom: '2px solid #ddd', padding: '12px' } }, 'Action')
            )
          ),
          React.createElement(
            'tbody',
            null,
            employees.length > 0
              ? employees.map(emp =>
                  React.createElement(
                    'tr',
                    { key: emp.id },
                    React.createElement('td', { style: { borderBottom: '1px solid #eee', padding: '12px' } }, emp.id),
                    React.createElement('td', { style: { borderBottom: '1px solid #eee', padding: '12px' } }, emp.name),
                    React.createElement('td', { style: { borderBottom: '1px solid #eee', padding: '12px' } }, emp.department),
                    React.createElement('td', { style: { borderBottom: '1px solid #eee', padding: '12px' } }, emp.designation),
                    React.createElement('td', { style: { borderBottom: '1px solid #eee', padding: '12px' } }, emp.email),
                    React.createElement('td', { style: { borderBottom: '1px solid #eee', padding: '12px' } }, emp.status),
                    React.createElement(
                      'td',
                      { style: { borderBottom: '1px solid #eee', padding: '12px' } },
                      React.createElement(
                        'button',
                        { 
                          onClick: () => navigate(`/admin/employees/${emp.id}`),
                          style: { cursor: 'pointer', padding: '4px 8px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }
                        },
                        'View'
                      )
                    )
                  )
                )
              : React.createElement(
                  'tr',
                  null,
                  React.createElement('td', { colSpan: 7, style: { padding: '12px', textAlign: 'center' } }, 'No employees found.')
                )
          )
        )
      )
  );
};

export default Employees;
