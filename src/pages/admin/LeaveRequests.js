import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLeaveRequests } from '../../services/leaveService';

const LeaveRequests = () => {
  const [activeTab, setActiveTab] = useState('Pending');
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        setLoading(true);
        const res = await getLeaveRequests(activeTab);
        setLeaves(res.data);
        setError(null);
      } catch (err) {
        setError('Failed to load leave requests.');
      } finally {
        setLoading(false);
      }
    };
    fetchLeaves();
  }, [activeTab]);

  const tabs = ['Pending', 'Approved', 'Rejected'];

  return React.createElement(
    'div',
    { className: 'page' },
    React.createElement('h1', { className: 'page-title' }, 'Leave Management'),
    
    React.createElement(
      'div',
      { className: 'tabs', style: { display: 'flex', borderBottom: '1px solid #ddd', marginBottom: '20px' } },
      tabs.map(tab => 
        React.createElement(
          'button',
          {
            key: tab,
            onClick: () => setActiveTab(tab),
            style: {
              padding: '10px 20px',
              border: 'none',
              backgroundColor: 'transparent',
              borderBottom: activeTab === tab ? '3px solid #007bff' : '3px solid transparent',
              color: activeTab === tab ? '#007bff' : '#333',
              fontWeight: activeTab === tab ? 'bold' : 'normal',
              cursor: 'pointer',
              fontSize: '16px'
            }
          },
          tab
        )
      )
    ),

    error ? React.createElement('div', { className: 'error-state' }, error) : null,
    
    loading ? React.createElement('div', { className: 'loading-state' }, 'Loading leave requests...') : 
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
              React.createElement('th', { style: { borderBottom: '2px solid #ddd', padding: '12px' } }, 'Employee'),
              React.createElement('th', { style: { borderBottom: '2px solid #ddd', padding: '12px' } }, 'Leave Type'),
              React.createElement('th', { style: { borderBottom: '2px solid #ddd', padding: '12px' } }, 'From'),
              React.createElement('th', { style: { borderBottom: '2px solid #ddd', padding: '12px' } }, 'To'),
              React.createElement('th', { style: { borderBottom: '2px solid #ddd', padding: '12px' } }, 'Status'),
              React.createElement('th', { style: { borderBottom: '2px solid #ddd', padding: '12px' } }, 'Action')
            )
          ),
          React.createElement(
            'tbody',
            null,
            leaves.length > 0
              ? leaves.map(leave =>
                  React.createElement(
                    'tr',
                    { key: leave.id },
                    React.createElement('td', { style: { borderBottom: '1px solid #eee', padding: '12px' } }, leave.employeeName),
                    React.createElement('td', { style: { borderBottom: '1px solid #eee', padding: '12px' } }, leave.leaveType),
                    React.createElement('td', { style: { borderBottom: '1px solid #eee', padding: '12px' } }, leave.from),
                    React.createElement('td', { style: { borderBottom: '1px solid #eee', padding: '12px' } }, leave.to),
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
                            backgroundColor: leave.status === 'Approved' ? '#d4edda' : 
                                             leave.status === 'Rejected' ? '#f8d7da' : '#fff3cd',
                            color: leave.status === 'Approved' ? '#155724' : 
                                   leave.status === 'Rejected' ? '#721c24' : '#856404'
                          } 
                        },
                        leave.status
                      )
                    ),
                    React.createElement(
                      'td',
                      { style: { borderBottom: '1px solid #eee', padding: '12px' } },
                      React.createElement(
                        'button',
                        { 
                          onClick: () => navigate(`/admin/leave/${leave.id}`),
                          style: { cursor: 'pointer', padding: '4px 8px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }
                        },
                        'View'
                      )
                    )
                  )
                )
              : React.createElement(
                  'tr',
                  null,
                  React.createElement('td', { colSpan: 6, style: { padding: '12px', textAlign: 'center' } }, `No ${activeTab.toLowerCase()} leave requests.`)
                )
          )
        )
      )
  );
};

export default LeaveRequests;
