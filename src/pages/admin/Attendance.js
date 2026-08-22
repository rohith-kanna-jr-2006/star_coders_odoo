import React, { useState, useEffect } from 'react';
import { getAttendance } from '../../services/attendanceService';
import FilterBar from '../../components/admin/FilterBar';
import StatusBadge from '../../components/admin/StatusBadge';

const Attendance = () => {
  const [date, setDate] = useState('2026-08-22');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [department, setDepartment] = useState('');
  
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      setError(null);
      // The mock service supports date, employeeId, status
      // We pass search to employeeId for now
      const res = await getAttendance(date, search, status);
      let data = res.data || [];
      
      // Client-side filter for department if available in records
      // Note: Mock data might not have department for attendance, but we handle if it does.
      if (department) {
        data = data.filter(r => r.department === department);
      }
      
      setRecords(data);
    } catch (err) {
      setError('Unable to load attendance data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAttendance();
    }, 300);
    return () => clearTimeout(timer);
  }, [date, search, status, department]);

  const handleReset = () => {
    setDate('2026-08-22');
    setSearch('');
    setStatus('');
    setDepartment('');
  };

  // Helper to calculate work hours if checkIn and checkOut are valid
  const getWorkHours = (checkIn, checkOut) => {
    if (!checkIn || !checkOut || checkIn === '--' || checkOut === '--') return '--';
    const [inH, inM] = checkIn.split(':').map(Number);
    const [outH, outM] = checkOut.split(':').map(Number);
    if (isNaN(inH) || isNaN(inM) || isNaN(outH) || isNaN(outM)) return '--';
    
    let diff = (outH * 60 + outM) - (inH * 60 + inM);
    if (diff < 0) diff += 24 * 60; // handle overnight slightly
    const h = Math.floor(diff / 60);
    const m = diff % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

  return React.createElement(
    'div',
    { className: 'page' },
    React.createElement('h1', { className: 'page-title' }, 'Attendance Management'),
    
    React.createElement(
      FilterBar,
      { searchPlaceholder: 'Search employee...', searchValue: search, onSearchChange: setSearch },
      React.createElement(
        'div',
        { className: 'form-group', style: { flex: '1 1 150px' } },
        React.createElement('label', null, 'Date:'),
        React.createElement('input', {
          type: 'date',
          className: 'form-control',
          value: date,
          onChange: (e) => setDate(e.target.value)
        })
      ),
      React.createElement(
        'div',
        { className: 'form-group', style: { flex: '1 1 150px' } },
        React.createElement('label', null, 'Status:'),
        React.createElement(
          'select',
          { className: 'form-control', value: status, onChange: e => setStatus(e.target.value) },
          React.createElement('option', { value: '' }, 'All Status'),
          React.createElement('option', { value: 'Present' }, 'Present'),
          React.createElement('option', { value: 'Absent' }, 'Absent'),
          React.createElement('option', { value: 'Half-day' }, 'Half-day'),
          React.createElement('option', { value: 'Leave' }, 'Leave')
        )
      ),
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
        { style: { display: 'flex', gap: '10px', marginTop: 'auto', marginBottom: '15px' } },
        React.createElement('button', { className: 'btn btn-secondary', onClick: handleReset }, 'Reset')
      )
    ),

    error && React.createElement(
      'div',
      { className: 'error-state' },
      React.createElement('p', null, error),
      React.createElement('button', { className: 'btn btn-primary', onClick: fetchAttendance }, 'Retry')
    ),
    
    !error && loading && React.createElement('div', { className: 'loading-state' }, 'Loading attendance...'),
    
    !error && !loading && (records.length === 0 ? 
      React.createElement('div', { className: 'empty-state card', style: { padding: '20px', textAlign: 'center', border: '1px solid var(--border)' } }, 'No attendance records found.') : 
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
              React.createElement('th', null, 'Date'),
              React.createElement('th', null, 'Employee ID'),
              React.createElement('th', null, 'Employee Name'),
              React.createElement('th', null, 'Check-in'),
              React.createElement('th', null, 'Check-out'),
              React.createElement('th', null, 'Work Hours'),
              React.createElement('th', null, 'Status')
            )
          ),
          React.createElement(
            'tbody',
            null,
            records.map(record =>
              React.createElement(
                'tr',
                { key: record.id },
                React.createElement('td', null, record.date),
                React.createElement('td', null, record.employeeId),
                React.createElement('td', null, record.employeeName),
                React.createElement('td', null, record.checkIn),
                React.createElement('td', null, record.checkOut),
                React.createElement('td', null, getWorkHours(record.checkIn, record.checkOut)),
                React.createElement('td', null, React.createElement(StatusBadge, { status: record.status }))
              )
            )
          )
        )
      )
    )
  );
};

export default Attendance;
