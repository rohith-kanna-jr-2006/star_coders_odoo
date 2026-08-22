import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPayrolls } from '../../services/payrollService';

const Payroll = () => {
  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPayrolls = async () => {
      try {
        setLoading(true);
        const res = await getPayrolls();
        setPayrolls(res.data);
        setError(null);
      } catch (err) {
        setError('Failed to load payroll records.');
      } finally {
        setLoading(false);
      }
    };
    fetchPayrolls();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return React.createElement(
    'div',
    { className: 'page' },
    React.createElement('h1', { className: 'page-title' }, 'Payroll Management'),
    
    error ? React.createElement('div', { className: 'error-state' }, error) : null,
    
    loading ? React.createElement('div', { className: 'loading-state' }, 'Loading payroll data...') : 
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
              React.createElement('th', { style: { borderBottom: '2px solid #ddd', padding: '12px' } }, 'Employee ID'),
              React.createElement('th', { style: { borderBottom: '2px solid #ddd', padding: '12px' } }, 'Name'),
              React.createElement('th', { style: { borderBottom: '2px solid #ddd', padding: '12px' } }, 'Department'),
              React.createElement('th', { style: { borderBottom: '2px solid #ddd', padding: '12px' } }, 'Basic Salary'),
              React.createElement('th', { style: { borderBottom: '2px solid #ddd', padding: '12px' } }, 'Net Salary'),
              React.createElement('th', { style: { borderBottom: '2px solid #ddd', padding: '12px' } }, 'Action')
            )
          ),
          React.createElement(
            'tbody',
            null,
            payrolls.length > 0
              ? payrolls.map(payroll =>
                  React.createElement(
                    'tr',
                    { key: payroll.employeeId },
                    React.createElement('td', { style: { borderBottom: '1px solid #eee', padding: '12px' } }, payroll.employeeId),
                    React.createElement('td', { style: { borderBottom: '1px solid #eee', padding: '12px' } }, payroll.employeeName),
                    React.createElement('td', { style: { borderBottom: '1px solid #eee', padding: '12px' } }, payroll.department),
                    React.createElement('td', { style: { borderBottom: '1px solid #eee', padding: '12px' } }, formatCurrency(payroll.basicSalary)),
                    React.createElement('td', { style: { borderBottom: '1px solid #eee', padding: '12px', fontWeight: 'bold' } }, formatCurrency(payroll.netSalary)),
                    React.createElement(
                      'td',
                      { style: { borderBottom: '1px solid #eee', padding: '12px' } },
                      React.createElement(
                        'button',
                        { 
                          onClick: () => navigate(`/admin/payroll/${payroll.employeeId}`),
                          style: { cursor: 'pointer', padding: '4px 8px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }
                        },
                        'Details'
                      )
                    )
                  )
                )
              : React.createElement(
                  'tr',
                  null,
                  React.createElement('td', { colSpan: 6, style: { padding: '12px', textAlign: 'center' } }, 'No payroll records available.')
                )
          )
        )
      )
  );
};

export default Payroll;
