import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getEmployees } from '../../services/employeeService';
import FilterBar from '../../components/admin/FilterBar';
import StatusBadge from '../../components/admin/StatusBadge';
import Modal from '../../components/admin/Modal';
import { notify } from '../../components/admin/Notification';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [status, setStatus] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [selectedEmp, setSelectedEmp] = useState(null);
  const navigate = useNavigate();

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getEmployees(search);
      let data = res.data || [];
      
      // Client-side filtering since mock service might only handle search
      if (department) {
        data = data.filter(e => e.department === department);
      }
      if (status) {
        data = data.filter(e => e.status === status);
      }
      
      setEmployees(data);
    } catch (err) {
      setError('Unable to load employee data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchEmployees();
    }, 300);
    return () => clearTimeout(timer);
  }, [search, department, status]);

  const handleReset = () => {
    setSearch('');
    setDepartment('');
    setStatus('');
  };

  const handleView = (emp) => {
    setSelectedEmp(emp);
  };

  return React.createElement(
    'div',
    { className: 'page' },
    React.createElement('h1', { className: 'page-title' }, 'Employee Management'),
    
    React.createElement(
      FilterBar,
      { searchPlaceholder: 'Search employee...', searchValue: search, onSearchChange: setSearch },
      React.createElement(
        'div',
        { className: 'form-group', style: { flex: '1 1 150px' } },
        React.createElement('label', null, 'Department:'),
        React.createElement(
          'select',
          { className: 'form-control', value: department, onChange: e => setDepartment(e.target.value) },
          React.createElement('option', { value: '' }, 'All Departments'),
          React.createElement('option', { value: 'CSE' }, 'CSE'),
          React.createElement('option', { value: 'HR' }, 'HR'),
          React.createElement('option', { value: 'Design' }, 'Design'),
          React.createElement('option', { value: 'Finance' }, 'Finance')
        )
      ),
      React.createElement(
        'div',
        { className: 'form-group', style: { flex: '1 1 150px' } },
        React.createElement('label', null, 'Status:'),
        React.createElement(
          'select',
          { className: 'form-control', value: status, onChange: e => setStatus(e.target.value) },
          React.createElement('option', { value: '' }, 'All Status'),
          React.createElement('option', { value: 'Active' }, 'Active'),
          React.createElement('option', { value: 'Inactive' }, 'Inactive')
        )
      ),
      React.createElement(
        'div',
        { style: { display: 'flex', gap: '10px', marginTop: 'auto', marginBottom: '15px' } },
        React.createElement('button', { className: 'btn btn-secondary', onClick: handleReset }, 'Reset')
      )
    ),

    error && React.createElement(
      'div',
      { className: 'error-state' },
      React.createElement('p', null, error),
      React.createElement('button', { className: 'btn btn-primary', onClick: fetchEmployees }, 'Retry')
    ),
    
    !error && loading && React.createElement('div', { className: 'loading-state' }, 'Loading employees...'),
    
    !error && !loading && (employees.length === 0 ? 
      React.createElement('div', { className: 'empty-state card', style: { padding: '20px', textAlign: 'center', border: '1px solid var(--border)' } }, 'No employees found.') : 
      React.createElement(
        'div',
        { className: 'table-container' },
        React.createElement(
          'table',
          { className: 'data-table', style: { width: '100%', textAlign: 'left', borderCollapse: 'collapse' } },
          React.createElement(
            'thead',
            null,
            React.createElement(
              'tr',
              null,
              React.createElement('th', null, 'ID'),
              React.createElement('th', null, 'Name'),
              React.createElement('th', null, 'Department'),
              React.createElement('th', null, 'Designation'),
              React.createElement('th', null, 'Email'),
              React.createElement('th', null, 'Status'),
              React.createElement('th', null, 'Actions')
            )
          ),
          React.createElement(
            'tbody',
            null,
            employees.map(emp =>
              React.createElement(
                'tr',
                { key: emp.id },
                React.createElement('td', null, emp.id),
                React.createElement('td', null, emp.name),
                React.createElement('td', null, emp.department),
                React.createElement('td', null, emp.designation),
                React.createElement('td', null, emp.email),
                React.createElement('td', null, React.createElement(StatusBadge, { status: emp.status })),
                React.createElement(
                  'td',
                  null,
                  React.createElement(
                    'button',
                    { 
                      className: 'btn btn-primary',
                      onClick: () => handleView(emp)
                    },
                    'View'
                  )
                )
              )
            )
          )
        )
      )
    ),

    selectedEmp && React.createElement(
      Modal,
      {
        title: 'Employee Details',
        onClose: () => setSelectedEmp(null),
        footer: [
          React.createElement('button', { key: 'close', className: 'btn btn-secondary', onClick: () => setSelectedEmp(null) }, 'Close'),
          React.createElement('button', { key: 'payroll', className: 'btn btn-primary', onClick: () => navigate(`/admin/payroll`) }, 'View Payroll')
        ]
      },
      React.createElement(
        'div',
        { style: { display: 'flex', flexDirection: 'column', gap: '15px' } },
        React.createElement('p', null, React.createElement('strong', null, 'ID: '), selectedEmp.id),
        React.createElement('p', null, React.createElement('strong', null, 'Name: '), selectedEmp.name),
        React.createElement('p', null, React.createElement('strong', null, 'Email: '), selectedEmp.email),
        React.createElement('p', null, React.createElement('strong', null, 'Department: '), selectedEmp.department),
        React.createElement('p', null, React.createElement('strong', null, 'Designation: '), selectedEmp.designation),
        React.createElement('p', null, React.createElement('strong', null, 'Joining Date: '), selectedEmp.joiningDate || 'Not available'),
        React.createElement('p', null, React.createElement('strong', null, 'Phone: '), selectedEmp.phone || 'Not available'),
        React.createElement('p', null, React.createElement('strong', null, 'Status: '), React.createElement(StatusBadge, { status: selectedEmp.status }))
      )
    )
  );
};

export default Employees;
