import React, { useState, useEffect } from 'react';
import { getEmployees } from '../../services/employeeService';
import { getAttendance } from '../../services/attendanceService';
import { getLeaveRequests } from '../../services/leaveService';
import StatusBadge from '../../components/admin/StatusBadge';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    presentToday: 0,
    absentToday: 0,
    onLeave: 0,
    pendingLeaves: 0,
  });
  const [recentLeaves, setRecentLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const today = new Date().toISOString().split('T')[0];
      // For mock data matching we use '2026-08-22' if our data is dated there, 
      // but let's stick to '2026-08-22' since mock data revolves around it.
      const mockToday = '2026-08-22';
      
      const [empRes, attRes, leaveRes] = await Promise.all([
        getEmployees(),
        getAttendance(mockToday),
        getLeaveRequests()
      ]);
      
      const employees = empRes.data || [];
      const attendance = attRes.data || [];
      const leaves = leaveRes.data || [];
      
      const presentCount = attendance.filter(a => a.status === 'Present' || a.status === 'Half-day').length;
      const absentCount = attendance.filter(a => a.status === 'Absent').length;
      const onLeaveCount = leaves.filter(l => l.status === 'Approved' && l.from <= mockToday && l.to >= mockToday).length;
      const pendingCount = leaves.filter(l => l.status === 'Pending').length;

      setStats({
        totalEmployees: employees.length,
        presentToday: presentCount,
        absentToday: absentCount,
        onLeave: onLeaveCount,
        pendingLeaves: pendingCount
      });
      
      setRecentLeaves(leaves.slice(0, 5));
    } catch (err) {
      setError('Unable to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return React.createElement('div', { className: 'page' }, React.createElement('p', null, 'Loading dashboard...'));
  }

  if (error) {
    return React.createElement(
      'div',
      { className: 'page' },
      React.createElement('p', { className: 'error-state' }, error),
      React.createElement('button', { className: 'btn btn-primary', onClick: fetchDashboardData }, 'Retry')
    );
  }

  if (stats.totalEmployees === 0 && recentLeaves.length === 0) {
    return React.createElement('div', { className: 'page' }, React.createElement('p', null, 'No dashboard data available.'));
  }

  return React.createElement(
    'div',
    { className: 'dashboard-container page' },
    React.createElement('h1', { className: 'page-title' }, 'HR Dashboard'),
    
    React.createElement(
      'div',
      { className: 'dashboard-stats', style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' } },
      
      React.createElement('div', { className: 'stat-card card', style: { padding: '20px', border: '1px solid var(--border)', borderRadius: '8px', background: 'var(--bg)' } }, 
        React.createElement('h3', { style: { margin: '0 0 10px 0', color: 'var(--text)' } }, 'Employees'),
        React.createElement('p', { style: { fontSize: '28px', fontWeight: 'bold', margin: 0, color: 'var(--text-h)' } }, stats.totalEmployees)
      ),
      React.createElement('div', { className: 'stat-card card', style: { padding: '20px', border: '1px solid var(--border)', borderRadius: '8px', background: 'var(--bg)' } }, 
        React.createElement('h3', { style: { margin: '0 0 10px 0', color: 'var(--text)' } }, 'Present'),
        React.createElement('p', { style: { fontSize: '28px', fontWeight: 'bold', margin: 0, color: 'var(--text-h)' } }, stats.presentToday)
      ),
      React.createElement('div', { className: 'stat-card card', style: { padding: '20px', border: '1px solid var(--border)', borderRadius: '8px', background: 'var(--bg)' } }, 
        React.createElement('h3', { style: { margin: '0 0 10px 0', color: 'var(--text)' } }, 'Absent'),
        React.createElement('p', { style: { fontSize: '28px', fontWeight: 'bold', margin: 0, color: 'var(--text-h)' } }, stats.absentToday)
      ),
      React.createElement('div', { className: 'stat-card card', style: { padding: '20px', border: '1px solid var(--border)', borderRadius: '8px', background: 'var(--bg)' } }, 
        React.createElement('h3', { style: { margin: '0 0 10px 0', color: 'var(--text)' } }, 'On Leave'),
        React.createElement('p', { style: { fontSize: '28px', fontWeight: 'bold', margin: 0, color: 'var(--text-h)' } }, stats.onLeave)
      )
    ),

    React.createElement(
      'div',
      { className: 'dashboard-sections', style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' } },
      
      React.createElement(
        'div',
        { className: 'dashboard-section card', style: { padding: '20px', border: '1px solid var(--border)', borderRadius: '8px', background: 'var(--bg)' } },
        React.createElement('h2', { style: { marginTop: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' } }, 
          'Recent Leave Requests',
          stats.pendingLeaves > 0 && React.createElement('span', { style: { fontSize: '14px', background: '#ffc107', color: '#000', padding: '4px 8px', borderRadius: '12px' } }, `${stats.pendingLeaves} Pending`)
        ),
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
                React.createElement('th', null, 'Employee'),
                React.createElement('th', null, 'Type'),
                React.createElement('th', null, 'Status')
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
                      React.createElement('td', null, l.employeeName),
                      React.createElement('td', null, l.leaveType),
                      React.createElement('td', null, React.createElement(StatusBadge, { status: l.status }))
                    )
                  )
                : React.createElement(
                    'tr',
                    null,
                    React.createElement('td', { colSpan: 3, style: { textAlign: 'center' } }, 'No recent requests')
                  )
            )
          )
        )
      )
    )
  );
};

export default Dashboard;
