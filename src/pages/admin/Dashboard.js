import React, { useState, useEffect } from 'react';
import { getEmployees } from '../../services/employeeService';
import { getAttendance } from '../../services/attendanceService';
import { getLeaveRequests } from '../../services/leaveService';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    presentToday: 0,
    onLeave: 0,
    pendingLeaves: 0,
  });
  const [recentLeaves, setRecentLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Using '2026-08-22' to match mock data
        const today = '2026-08-22';
        
        const [empRes, attRes, leaveRes] = await Promise.all([
          getEmployees(),
          getAttendance(today, '', 'Present'),
          getLeaveRequests()
        ]);
        
        const leaves = leaveRes.data;
        const pending = leaves.filter(l => l.status === 'Pending');
        const activeLeaves = leaves.filter(l => l.status === 'Approved' && l.from <= today && l.to >= today);

        setStats({
          totalEmployees: empRes.data.length,
          presentToday: attRes.data.length,
          onLeave: activeLeaves.length,
          pendingLeaves: pending.length
        });
        
        setRecentLeaves(leaves.slice(0, 5));
      } catch (err) {
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return React.createElement('div', { className: 'loading-state' }, 'Loading dashboard...');
  }

  if (error) {
    return React.createElement('div', { className: 'error-state' }, error);
  }

  return React.createElement(
    'div',
    { className: 'dashboard-container page' },
    React.createElement('h1', { className: 'page-title' }, 'Admin Dashboard'),
    React.createElement(
      'div',
      { className: 'dashboard-stats', style: { display: 'flex', gap: '20px', marginBottom: '30px' } },
      React.createElement('div', { className: 'stat-card card', style: { padding: '20px', border: '1px solid #ddd', borderRadius: '8px', flex: 1 } }, 
        React.createElement('h3', null, 'Total Employees'),
        React.createElement('p', { style: { fontSize: '24px', fontWeight: 'bold' } }, stats.totalEmployees)
      ),
      React.createElement('div', { className: 'stat-card card', style: { padding: '20px', border: '1px solid #ddd', borderRadius: '8px', flex: 1 } }, 
        React.createElement('h3', null, 'Present Today'),
        React.createElement('p', { style: { fontSize: '24px', fontWeight: 'bold' } }, stats.presentToday)
      ),
      React.createElement('div', { className: 'stat-card card', style: { padding: '20px', border: '1px solid #ddd', borderRadius: '8px', flex: 1 } }, 
        React.createElement('h3', null, 'On Leave'),
        React.createElement('p', { style: { fontSize: '24px', fontWeight: 'bold' } }, stats.onLeave)
      ),
      React.createElement('div', { className: 'stat-card card', style: { padding: '20px', border: '1px solid #ddd', borderRadius: '8px', flex: 1 } }, 
        React.createElement('h3', null, 'Pending Leaves'),
        React.createElement('p', { style: { fontSize: '24px', fontWeight: 'bold' } }, stats.pendingLeaves)
      )
    ),
    React.createElement(
      'div',
      { className: 'dashboard-sections' },
      React.createElement(
        'div',
        { className: 'dashboard-section card', style: { padding: '20px', border: '1px solid #ddd', borderRadius: '8px' } },
        React.createElement('h2', { style: { marginTop: 0 } }, 'Recent Leave Requests'),
        React.createElement(
          'table',
          { className: 'data-table', style: { width: '100%', textAlign: 'left', borderCollapse: 'collapse' } },
          React.createElement(
            'thead',
            null,
            React.createElement(
              'tr',
              null,
              React.createElement('th', { style: { borderBottom: '2px solid #ddd', padding: '10px' } }, 'Employee'),
              React.createElement('th', { style: { borderBottom: '2px solid #ddd', padding: '10px' } }, 'Type'),
              React.createElement('th', { style: { borderBottom: '2px solid #ddd', padding: '10px' } }, 'Status')
            )
          ),
          React.createElement(
            'tbody',
            null,
            recentLeaves.length > 0
              ? recentLeaves.map(l =>
                  React.createElement(
                    'tr',
                    { key: l.id },
                    React.createElement('td', { style: { borderBottom: '1px solid #ddd', padding: '10px' } }, l.employeeName),
                    React.createElement('td', { style: { borderBottom: '1px solid #ddd', padding: '10px' } }, l.leaveType),
                    React.createElement('td', { style: { borderBottom: '1px solid #ddd', padding: '10px' } }, l.status)
                  )
                )
              : React.createElement(
                  'tr',
                  null,
                  React.createElement('td', { colSpan: 3, style: { padding: '10px' } }, 'No recent requests')
                )
          )
        )
      )
    )
  );
};

export default Dashboard;
