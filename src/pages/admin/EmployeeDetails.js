import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEmployeeById, updateEmployee } from '../../services/employeeService';

const EmployeeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [employee, setEmployee] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        setLoading(true);
        const res = await getEmployeeById(id);
        setEmployee(res.data);
        setFormData(res.data);
        setError(null);
      } catch (err) {
        setError('Unable to load employee records.');
      } finally {
        setLoading(false);
      }
    };
    fetchEmployee();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      const res = await updateEmployee(id, formData);
      setEmployee(res.data);
      setIsEditing(false);
      setSuccess('Employee updated successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update employee.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return React.createElement('div', { className: 'loading-state' }, 'Loading employee details...');
  if (error && !employee) return React.createElement('div', { className: 'error-state' }, error, React.createElement('button', { onClick: () => navigate('/admin/employees'), style: { marginLeft: '10px' } }, 'Back to List'));
  if (!employee) return React.createElement('div', { className: 'empty-state' }, 'Not available');

  const renderField = (label, name, value) => {
    return React.createElement(
      'div',
      { style: { marginBottom: '15px' } },
      React.createElement('label', { style: { display: 'block', fontWeight: 'bold', marginBottom: '5px' } }, label),
      isEditing
        ? React.createElement('input', {
            type: 'text',
            name: name,
            value: formData[name] || '',
            onChange: handleChange,
            style: { width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }
          })
        : React.createElement('div', { style: { padding: '8px', backgroundColor: '#f9f9f9', border: '1px solid #eee', borderRadius: '4px' } }, value || 'Not available')
    );
  };

  return React.createElement(
    'div',
    { className: 'page' },
    React.createElement(
      'div',
      { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' } },
      React.createElement('h1', { className: 'page-title', style: { margin: 0 } }, `Employee Details: ${employee.name}`),
      React.createElement(
        'button',
        { 
          onClick: () => navigate('/admin/employees'),
          style: { cursor: 'pointer', padding: '8px 16px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px' }
        },
        'Back'
      )
    ),
    
    success ? React.createElement('div', { className: 'success-state', style: { color: 'green', marginBottom: '15px' } }, success) : null,
    error && employee ? React.createElement('div', { className: 'error-state', style: { color: 'red', marginBottom: '15px' } }, error) : null,

    React.createElement(
      'div',
      { className: 'card', style: { padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: 'white' } },
      React.createElement(
        'div',
        { style: { display: 'flex', justifyContent: 'flex-end', marginBottom: '15px' } },
        !isEditing ? React.createElement(
          'button',
          { 
            onClick: () => setIsEditing(true),
            style: { cursor: 'pointer', padding: '8px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }
          },
          'Edit'
        ) : React.createElement(
          'div',
          { style: { display: 'flex', gap: '10px' } },
          React.createElement(
            'button',
            { 
              onClick: () => { setIsEditing(false); setFormData(employee); },
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
            saving ? 'Saving...' : 'Save'
          )
        )
      ),
      React.createElement(
        'div',
        { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' } },
        React.createElement(
          'div',
          null,
          React.createElement('h3', null, 'Personal Information'),
          renderField('Full Name', 'name', employee.name),
          renderField('Email', 'email', employee.email),
          renderField('Phone', 'phone', employee.phone),
          renderField('Address', 'address', employee.address)
        ),
        React.createElement(
          'div',
          null,
          React.createElement('h3', null, 'Job Information'),
          renderField('Employee ID', 'id', employee.id),
          renderField('Department', 'department', employee.department),
          renderField('Designation', 'designation', employee.designation),
          renderField('Status', 'status', employee.status),
          renderField('Joining Date', 'joiningDate', employee.joiningDate)
        )
      )
    )
  );
};

export default EmployeeDetails;
