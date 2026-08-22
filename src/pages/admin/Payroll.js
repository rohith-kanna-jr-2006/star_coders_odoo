import React, { useState, useEffect } from 'react';
import { getPayrollRecords } from '../../services/payrollService';
import FilterBar from '../../components/admin/FilterBar';
import StatusBadge from '../../components/admin/StatusBadge';
import Modal from '../../components/admin/Modal';
import { notify } from '../../components/admin/Notification';

const Payroll = () => {
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [generateModal, setGenerateModal] = useState(null);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getPayrollRecords();
      let data = res.data || [];
      
      if (search) {
        data = data.filter(r => r.employeeName.toLowerCase().includes(search.toLowerCase()) || r.employeeId.includes(search));
      }
      if (status) {
        data = data.filter(r => r.status === status);
      }
      
      setRecords(data);
    } catch (err) {
      setError('Unable to load payroll data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchRecords();
    }, 300);
    return () => clearTimeout(timer);
  }, [search, status]);

  const handleReset = () => {
    setSearch('');
    setStatus('');
  };

  const confirmGenerate = () => {
    if (!generateModal) return;
    notify(`Payslip generated for ${generateModal.employeeName}`, 'success');
    setGenerateModal(null);
    // Real implementation would call API
    fetchRecords();
  };

  return React.createElement(
    'div',
    { className: 'page' },
    React.createElement('h1', { className: 'page-title' }, 'Payroll Management'),
    
    React.createElement(
      FilterBar,
      { searchPlaceholder: 'Search employee...', searchValue: search, onSearchChange: setSearch },
      React.createElement(
        'div',
        { className: 'form-group', style: { flex: '1 1 150px' } },
        React.createElement('label', null, 'Status:'),
        React.createElement(
          'select',
          { className: 'form-control', value: status, onChange: e => setStatus(e.target.value) },
          React.createElement('option', { value: '' }, 'All Status'),
          React.createElement('option', { value: 'Paid' }, 'Paid'),
          React.createElement('option', { value: 'Pending' }, 'Pending')
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
      React.createElement('button', { className: 'btn btn-primary', onClick: fetchRecords }, 'Retry')
    ),
    
    !error && loading && React.createElement('div', { className: 'loading-state' }, 'Loading payroll...'),
    
    !error && !loading && (records.length === 0 ? 
      React.createElement('div', { className: 'empty-state card', style: { padding: '20px', textAlign: 'center', border: '1px solid var(--border)' } }, 'No payroll records found.') : 
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
              React.createElement('th', null, 'Employee ID'),
              React.createElement('th', null, 'Name'),
              React.createElement('th', null, 'Basic Salary'),
              React.createElement('th', null, 'Allowances'),
              React.createElement('th', null, 'Deductions'),
              React.createElement('th', null, 'Net Salary'),
              React.createElement('th', null, 'Status'),
              React.createElement('th', null, 'Actions')
            )
          ),
          React.createElement(
            'tbody',
            null,
            records.map(record =>
              React.createElement(
                'tr',
                { key: record.id },
                React.createElement('td', null, record.employeeId),
                React.createElement('td', null, record.employeeName),
                React.createElement('td', null, `$${record.basicSalary}`),
                React.createElement('td', null, `$${record.allowances}`),
                React.createElement('td', null, `$${record.deductions}`),
                React.createElement('td', null, React.createElement('strong', null, `$${record.netSalary}`)),
                React.createElement('td', null, React.createElement(StatusBadge, { status: record.status })),
                React.createElement(
                  'td',
                  null,
                  React.createElement(
                    'button',
                    { 
                      className: 'btn btn-primary',
                      onClick: () => setGenerateModal(record)
                    },
                    record.status === 'Paid' ? 'View Payslip' : 'Generate Payslip'
                  )
                )
              )
            )
          )
        )
      )
    ),

    generateModal && React.createElement(
      Modal,
      {
        title: generateModal.status === 'Paid' ? 'View Payslip' : 'Generate Payslip',
        onClose: () => setGenerateModal(null),
        footer: [
          React.createElement('button', { key: 'cancel', className: 'btn btn-secondary', onClick: () => setGenerateModal(null) }, 'Close'),
          generateModal.status !== 'Paid' && React.createElement('button', { key: 'confirm', className: 'btn btn-success', onClick: confirmGenerate }, 'Confirm Generate')
        ]
      },
      React.createElement(
        'div',
        { style: { display: 'flex', flexDirection: 'column', gap: '10px' } },
        React.createElement('p', null, React.createElement('strong', null, 'Employee: '), generateModal.employeeName),
        React.createElement('p', null, React.createElement('strong', null, 'Net Salary: '), `$${generateModal.netSalary}`),
        generateModal.status === 'Paid' ? React.createElement('p', null, 'This payslip has already been processed and paid.') : React.createElement('p', null, 'Are you sure you want to generate the payslip for this employee?')
      )
    )
  );
};

export default Payroll;
