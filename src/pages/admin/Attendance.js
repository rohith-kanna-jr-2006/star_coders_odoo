import React, { useState, useEffect } from 'react';
import { getAttendance } from '../../services/attendanceService';

const Attendance = () => {
  // Use a default date matching mock data
  const [date, setDate] = useState('2026-08-22');
  const [employeeId, setEmployeeId] = useState('');
  const [status, setStatus] = useState('');
  
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        setLoading(true);
        const res = await getAttendance(date, employeeId, status);
        setRecords(res.data);
        setError(null);
      } catch (err) {
        setError('Failed to load attendance records.');
      } finally {
        setLoading(false);
      }
    };
    
    const timer = setTimeout(() => {
      fetchAttendance();
    }, 300);
    
    return () => clearTimeout(timer);
  }, [date, employeeId, status]);

  return React.createElement(
    'div',
    { className: 'page' },
    React.createElement('h1', { className: 'page-title' }, 'Attendance Management'),
    
    React.createElement(
      'div',
      { className: 'filters card', style: { padding: '20px', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '20px', display: 'flex', gap: '20px', alignItems: 'center' } },
      React.createElement(
        'div',
        null,
        React.createElement('label', { style: { marginRight: '10px', fontWeight: 'bold' } }, 'Date:'),
        React.createElement('input', {
          type: 'date',
          value: date,
          onChange: (e) => setDate(e.target.value),
          style: { padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }
        })
      ),
      React.createElement(
        'div',
        null,
        React.createElement('label', { style: { marginRight: '10px', fontWeight: 'bold' } }, 'Employee ID/Name:'),
        React.createElement('input', {
          type: 'text',
          placeholder: 'Search...',
          value: employeeId,
          onChange: (e) => setEmployeeId(e.target.value),
          style: { padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }
        })
      ),
      React.createElement(
        'div',
        null,
        React.createElement('label', { style: { marginRight: '10px', fontWeight: 'bold' } }, 'Status:'),
        React.createElement(
          'select',
          {
            value: status,
            onChange: (e) => setStatus(e.target.value),
            style: { padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }
          },
          React.createElement('option', { value: '' }, 'All'),
          React.createElement('option', { value: 'Present' }, 'Present'),
          React.createElement('option', { value: 'Absent' }, 'Absent'),
          React.createElement('option', { value: 'Half-day' }, 'Half-day'),
          React.createElement('option', { value: 'Leave' }, 'Leave')
        )
      )
    ),

    error ? React.createElement('div', { className: 'error-state' }, error) : null,
    
    loading ? React.createElement('div', { className: 'loading-state' }, 'Loading attendance...') : 
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
              React.createElement('th', { style: { borderBottom: '2px solid #ddd', padding: '12px' } }, 'Date'),
              React.createElement('th', { style: { borderBottom: '2px solid #ddd', padding: '12px' } }, 'Employee ID'),
              React.createElement('th', { style: { borderBottom: '2px solid #ddd', padding: '12px' } }, 'Employee Name'),
              React.createElement('th', { style: { borderBottom: '2px solid #ddd', padding: '12px' } }, 'Check-in'),
              React.createElement('th', { style: { borderBottom: '2px solid #ddd', padding: '12px' } }, 'Check-out'),
              React.createElement('th', { style: { borderBottom: '2px solid #ddd', padding: '12px' } }, 'Status')
            )
          ),
          React.createElement(
            'tbody',
            null,
            records.length > 0
              ? records.map(record =>
                  React.createElement(
                    'tr',
                    { key: record.id },
                    React.createElement('td', { style: { borderBottom: '1px solid #eee', padding: '12px' } }, record.date),
                    React.createElement('td', { style: { borderBottom: '1px solid #eee', padding: '12px' } }, record.employeeId),
                    React.createElement('td', { style: { borderBottom: '1px solid #eee', padding: '12px' } }, record.employeeName),
                    React.createElement('td', { style: { borderBottom: '1px solid #eee', padding: '12px' } }, record.checkIn),
                    React.createElement('td', { style: { borderBottom: '1px solid #eee', padding: '12px' } }, record.checkOut),
                    React.createElement(
                      'td',
                      { style: { borderBottom: '1px solid #eee', padding: '12px' } },
                      React.createElement(
                        'span',
                        { 
                          style: { 
                            padding: '4px 8px', 
                            borderRadius: '12px', 
                            fontSize: '0.85em',
                            backgroundColor: record.status === 'Present' ? '#d4edda' : 
                                             record.status === 'Absent' ? '#f8d7da' : 
                                             record.status === 'Half-day' ? '#fff3cd' : '#e2e3e5',
                            color: record.status === 'Present' ? '#155724' : 
                                   record.status === 'Absent' ? '#721c24' : 
                                   record.status === 'Half-day' ? '#856404' : '#383d41'
                          } 
                        },
                        record.status
                      )
                    )
                  )
                )
              : React.createElement(
                  'tr',
                  null,
                  React.createElement('td', { colSpan: 6, style: { padding: '12px', textAlign: 'center' } }, 'No attendance records for the selected filters.')
                )
          )
        )
      )
  );
};

export default Attendance;
