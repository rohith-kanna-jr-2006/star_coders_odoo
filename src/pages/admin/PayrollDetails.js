import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPayrollByEmployeeId, updateSalaryStructure } from '../../services/payrollService';
import { getEmployeeById } from '../../services/employeeService';

const PayrollDetails = () => {
  const { employeeId } = useParams();
  const navigate = useNavigate();
  
  const [payroll, setPayroll] = useState(null);
  const [employee, setEmployee] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    basicSalary: 0,
    allowances: 0,
    deductions: 0,
    other: 0
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch employee details first
        let empData = null;
        try {
          const empRes = await getEmployeeById(employeeId);
          empData = empRes.data;
          setEmployee(empData);
        } catch (e) {
          setError('Employee not found.');
          setLoading(false);
          return;
        }

        // Then fetch payroll
        try {
          const payrollRes = await getPayrollByEmployeeId(employeeId);
          setPayroll(payrollRes.data);
          setFormData({
            basicSalary: payrollRes.data.basicSalary || 0,
            allowances: payrollRes.data.allowances || 0,
            deductions: payrollRes.data.deductions || 0,
            other: payrollRes.data.other || 0
          });
        } catch (e) {
          // No payroll record found, setup default
          const defaultPayroll = {
            employeeId: empData.id,
            employeeName: empData.name,
            department: empData.department,
            basicSalary: 0, allowances: 0, deductions: 0, other: 0, netSalary: 0
          };
          setPayroll(defaultPayroll);
          setFormData({ basicSalary: 0, allowances: 0, deductions: 0, other: 0 });
        }
        
        setError(null);
      } catch (err) {
        setError('Failed to load payroll details.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [employeeId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Allow empty string for backspace, but parse to float eventually
    setFormData(prev => ({ ...prev, [name]: value === '' ? '' : Number(value) }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      
      const payload = {
        employeeName: employee.name,
        department: employee.department,
        basicSalary: Number(formData.basicSalary) || 0,
        allowances: Number(formData.allowances) || 0,
        deductions: Number(formData.deductions) || 0,
        other: Number(formData.other) || 0
      };

      const res = await updateSalaryStructure(employeeId, payload);
      setPayroll(res.data);
      setIsEditing(false);
      setSuccess('Salary structure updated successfully.');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update salary structure.');
    } finally {
      setSaving(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  if (loading) return React.createElement('div', { className: 'loading-state' }, 'Loading payroll details...');
  if (error && !payroll) return React.createElement('div', { className: 'error-state' }, error, React.createElement('button', { onClick: () => navigate('/admin/payroll'), style: { marginLeft: '10px' } }, 'Back to List'));

  const renderField = (label, name, value, isNegative = false) => {
    return React.createElement(
      'div',
      { style: { marginBottom: '15px' } },
      React.createElement('label', { style: { display: 'block', fontWeight: 'bold', marginBottom: '5px' } }, label),
      isEditing
        ? React.createElement('input', {
            type: 'number',
            name: name,
            value: formData[name],
            onChange: handleChange,
            style: { width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }
          })
        : React.createElement(
            'div', 
            { style: { padding: '8px', backgroundColor: '#f9f9f9', border: '1px solid #eee', borderRadius: '4px', color: isNegative ? '#dc3545' : '#28a745', fontWeight: 'bold' } }, 
            (isNegative ? '- ' : '+ ') + formatCurrency(value)
          )
    );
  };

  return React.createElement(
    'div',
    { className: 'page' },
    React.createElement(
      'div',
      { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' } },
      React.createElement('h1', { className: 'page-title', style: { margin: 0 } }, `Payroll Details: ${employee?.name || employeeId}`),
      React.createElement(
        'button',
        { 
          onClick: () => navigate('/admin/payroll'),
          style: { cursor: 'pointer', padding: '8px 16px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px' }
        },
        'Back'
      )
    ),
    
    success ? React.createElement('div', { className: 'success-state', style: { color: 'green', marginBottom: '15px', padding: '10px', backgroundColor: '#d4edda', border: '1px solid #c3e6cb', borderRadius: '4px' } }, success) : null,
    error ? React.createElement('div', { className: 'error-state', style: { color: 'red', marginBottom: '15px', padding: '10px', backgroundColor: '#f8d7da', border: '1px solid #f5c6cb', borderRadius: '4px' } }, error) : null,

    React.createElement(
      'div',
      { className: 'card', style: { padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: 'white' } },
      React.createElement(
        'div',
        { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #eee' } },
        React.createElement(
          'div',
          null,
          React.createElement('h3', { style: { margin: '0 0 10px 0' } }, 'Employee Information'),
          React.createElement('p', { style: { margin: '5px 0' } }, React.createElement('strong', null, 'ID: '), payroll.employeeId),
          React.createElement('p', { style: { margin: '5px 0' } }, React.createElement('strong', null, 'Department: '), payroll.department)
        ),
        React.createElement(
          'div',
          { style: { textAlign: 'right' } },
          !isEditing ? React.createElement(
            'button',
            { 
              onClick: () => setIsEditing(true),
              style: { cursor: 'pointer', padding: '8px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }
            },
            'Edit Salary Structure'
          ) : React.createElement(
            'div',
            { style: { display: 'flex', gap: '10px' } },
            React.createElement(
              'button',
              { 
                onClick: () => {
                  setIsEditing(false);
                  setFormData({
                    basicSalary: payroll.basicSalary || 0,
                    allowances: payroll.allowances || 0,
                    deductions: payroll.deductions || 0,
                    other: payroll.other || 0
                  });
                },
                style: { cursor: 'pointer', padding: '8px 16px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px' }
              },
              'Cancel'
            ),
            React.createElement(
              'button',
              { 
                onClick: handleSave,
                disabled: saving,
                style: { cursor: saving ? 'not-allowed' : 'pointer', padding: '8px 16px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }
              },
              saving ? 'Saving...' : 'Save Structure'
            )
          )
        )
      ),
      
      React.createElement(
        'div',
        { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' } },
        React.createElement(
          'div',
          null,
          React.createElement('h3', null, 'Earnings'),
          renderField('Basic Salary', 'basicSalary', payroll.basicSalary),
          renderField('Allowances', 'allowances', payroll.allowances),
          renderField('Other Components', 'other', payroll.other)
        ),
        React.createElement(
          'div',
          null,
          React.createElement('h3', null, 'Deductions'),
          renderField('Deductions', 'deductions', payroll.deductions, true)
        )
      ),

      React.createElement(
        'div',
        { style: { marginTop: '30px', paddingTop: '20px', borderTop: '2px dashed #ddd', display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
        React.createElement('h2', { style: { margin: 0 } }, 'Net Salary'),
        React.createElement('h2', { style: { margin: 0, color: '#007bff' } }, formatCurrency(payroll.netSalary))
      )
    )
  );
};

export default PayrollDetails;
