import React, { useState, useEffect } from 'react';
import { getPayrolls, updateSalaryStructure } from '../../services/payrollService';
import FilterBar from '../../components/admin/FilterBar';
import StatusBadge from '../../components/admin/StatusBadge';
import Modal from '../../components/admin/Modal';
import { notify } from '../../components/admin/Notification';
import { useAuth } from '../../context/AuthContext';

const Payroll = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [editModal, setEditModal] = useState(null);
  const [formData, setFormData] = useState({ basicSalary: '', allowances: '', deductions: '' });
  const [formError, setFormError] = useState('');
  const fetchRecords = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getPayrolls();
      let data = res.data || [];

      if (user?.role === 'hr' && user?.department) {
        data = data.filter(r => (r.department || r.user?.department || '').toLowerCase() === String(user.department).toLowerCase());
      }
      
      if (search) {
        data = data.filter(r => (r.employeeName || '').toLowerCase().includes(search.toLowerCase()) || r.employeeId.includes(search));
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

  const handleEditClick = (record) => {
    setEditModal(record);
    setFormData({
      basicSalary: record.basicSalary || 0,
      allowances: record.allowances || 0,
      deductions: record.deductions || 0,
    });
    setFormError('');
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFormError('');
  };

  const calculateNetSalary = () => {
    const basic = Number(formData.basicSalary) || 0;
    const allowances = Number(formData.allowances) || 0;
    const deductions = Number(formData.deductions) || 0;
    return basic + allowances - deductions;
  };

  const confirmSave = async () => {
    if (!editModal) return;
    
    const basic = Number(formData.basicSalary);
    const allowances = Number(formData.allowances);
    const deductions = Number(formData.deductions);

    if (isNaN(basic) || isNaN(allowances) || isNaN(deductions) || formData.basicSalary === '' || formData.allowances === '' || formData.deductions === '') {
      setFormError('All salary fields are required and must be numeric.');
      return;
    }
    
    if (basic < 0 || allowances < 0 || deductions < 0) {
      setFormError('Salary values cannot be negative.');
      return;
    }

    try {
      await updateSalaryStructure(editModal.employeeId, {
        basicSalary: basic,
        allowances,
        deductions,
        month: editModal.month || 'Current',
        year: editModal.year || new Date().getFullYear(),
      });
      notify(`Payroll updated for ${editModal.employeeName || editModal.employeeId}`, 'success');
      setEditModal(null);
      fetchRecords();
    } catch (err) {
      notify('Unable to update payroll.', 'error');
    }
  };

  return React.createElement(
    'div',
    { className: 'page' },
    React.createElement('h1', { className: 'page-title' }, 'Payroll Management'),
    
    React.createElement(
      FilterBar,
      { searchPlaceholder: 'Search employee payroll...', searchValue: search, onSearchChange: setSearch },
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
              React.createElement('th', null, 'Actions')
            )
          ),
          React.createElement(
            'tbody',
            null,
            records.map(record =>
              React.createElement(
                'tr',
                { key: record._id || record.employeeId },
                React.createElement('td', null, record.employeeId),
                React.createElement('td', null, record.employeeName || record.user?.name),
                React.createElement('td', null, `₹${record.basicSalary}`),
                React.createElement('td', null, `₹${record.allowances}`),
                React.createElement('td', null, `₹${record.deductions}`),
                React.createElement('td', null, React.createElement('strong', null, `₹${record.netSalary}`)),
                React.createElement(
                  'td',
                  null,
                  React.createElement(
                    'button',
                    { 
                      className: 'btn btn-primary',
                      onClick: () => handleEditClick(record)
                    },
                    'Edit'
                  )
                )
              )
            )
          )
        )
      )
    ),

    editModal && React.createElement(
      Modal,
      {
        title: 'Edit Payroll',
        onClose: () => setEditModal(null),
        footer: [
          React.createElement('button', { key: 'cancel', className: 'btn btn-secondary', onClick: () => setEditModal(null) }, 'Cancel'),
          React.createElement('button', { key: 'save', className: 'btn btn-success', onClick: confirmSave }, 'Save')
        ]
      },
      React.createElement(
        'div',
        { style: { display: 'flex', flexDirection: 'column', gap: '15px' } },
        React.createElement(
          'div',
          null,
          React.createElement('p', { style: { margin: '0 0 5px 0' } }, React.createElement('strong', null, 'Employee: '), editModal.employeeName || editModal.employeeId)
        ),
        React.createElement(
          'div',
          { className: 'form-group' },
          React.createElement('label', null, 'Basic Salary (₹)'),
          React.createElement('input', {
            type: 'number',
            className: 'form-control',
            name: 'basicSalary',
            value: formData.basicSalary,
            onChange: handleFormChange,
            min: '0'
          })
        ),
        React.createElement(
          'div',
          { className: 'form-group' },
          React.createElement('label', null, 'Allowances (₹)'),
          React.createElement('input', {
            type: 'number',
            className: 'form-control',
            name: 'allowances',
            value: formData.allowances,
            onChange: handleFormChange,
            min: '0'
          })
        ),
        React.createElement(
          'div',
          { className: 'form-group' },
          React.createElement('label', null, 'Deductions (₹)'),
          React.createElement('input', {
            type: 'number',
            className: 'form-control',
            name: 'deductions',
            value: formData.deductions,
            onChange: handleFormChange,
            min: '0'
          })
        ),
        React.createElement(
          'div',
          { style: { marginTop: '10px', padding: '10px', background: 'var(--bg-highlight, #f8f9fa)', borderRadius: '4px', border: '1px solid var(--border)' } },
          React.createElement('p', { style: { margin: '0 0 5px 0' } }, 'Net Salary Preview:'),
          React.createElement('p', { style: { margin: 0, fontSize: '18px', fontWeight: 'bold' } }, `₹${calculateNetSalary()}`)
        ),
        formError && React.createElement('p', { style: { color: 'red', fontSize: '14px', marginTop: '5px' } }, formError)
      )
    )
  );
};

export default Payroll;
