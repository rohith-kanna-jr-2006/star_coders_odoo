import React, { useState, useEffect } from 'react';
import { getLeaveRequests, updateLeaveStatus } from '../../services/leaveService';
import FilterBar from '../../components/admin/FilterBar';
import StatusBadge from '../../components/admin/StatusBadge';
import Modal from '../../components/admin/Modal';
import { notify } from '../../components/admin/Notification';

const LeaveRequests = () => {
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [type, setType] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [actionModal, setActionModal] = useState(null);
  const [actionComment, setActionComment] = useState('');
  const [actionError, setActionError] = useState('');

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getLeaveRequests();
      let data = res.data || [];
      
      if (search) {
        data = data.filter(r => r.employeeName.toLowerCase().includes(search.toLowerCase()) || r.employeeId.includes(search));
      }
      if (status) {
        data = data.filter(r => r.status === status);
      }
      if (type) {
        data = data.filter(r => r.leaveType === type);
      }
      
      setRequests(data);
    } catch (err) {
      setError('Unable to load leave requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchRequests();
    }, 300);
    return () => clearTimeout(timer);
  }, [search, status, type]);

  const handleReset = () => {
    setSearch('');
    setStatus('');
    setType('');
  };

  const handleActionClick = (req, newStatus) => {
    setActionModal({ request: req, newStatus });
    setActionComment('');
    setActionError('');
  };

  const confirmAction = async () => {
    if (!actionModal) return;
    if (actionModal.newStatus === 'Rejected' && !actionComment.trim()) {
      setActionError('Rejection reason is required.');
      return;
    }
    try {
      await updateLeaveStatus(actionModal.request._id || actionModal.request.id, actionModal.newStatus, actionComment);
      notify(`Leave request ${actionModal.newStatus.toLowerCase()} successfully`, 'success');
      setActionModal(null);
      fetchRequests(); // Refresh data
    } catch (err) {
      notify('Unable to update leave request.', 'error');
    }
  };

  return React.createElement(
    'div',
    { className: 'page' },
    React.createElement('h1', { className: 'page-title' }, 'Leave Management'),
    
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
          React.createElement('option', { value: 'Pending' }, 'Pending'),
          React.createElement('option', { value: 'Approved' }, 'Approved'),
          React.createElement('option', { value: 'Rejected' }, 'Rejected')
        )
      ),
      React.createElement(
        'div',
        { className: 'form-group', style: { flex: '1 1 150px' } },
        React.createElement('label', null, 'Leave Type:'),
        React.createElement(
          'select',
          { className: 'form-control', value: type, onChange: e => setType(e.target.value) },
          React.createElement('option', { value: '' }, 'All Types'),
          React.createElement('option', { value: 'Sick' }, 'Sick'),
          React.createElement('option', { value: 'Casual' }, 'Casual'),
          React.createElement('option', { value: 'Paid' }, 'Paid')
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
      React.createElement('button', { className: 'btn btn-primary', onClick: fetchRequests }, 'Retry')
    ),
    
    !error && loading && React.createElement('div', { className: 'loading-state' }, 'Loading leave requests...'),
    
    !error && !loading && (requests.length === 0 ? 
      React.createElement('div', { className: 'empty-state card', style: { padding: '20px', textAlign: 'center', border: '1px solid var(--border)' } }, 'No leave requests found.') : 
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
              React.createElement('th', null, 'Employee Name'),
              React.createElement('th', null, 'Leave Type'),
              React.createElement('th', null, 'From'),
              React.createElement('th', null, 'To'),
              React.createElement('th', null, 'Reason'),
              React.createElement('th', null, 'Status'),
              React.createElement('th', null, 'Actions')
            )
          ),
          React.createElement(
            'tbody',
            null,
            requests.map(req =>
              React.createElement(
                'tr',
                { key: req._id || req.id },
                React.createElement('td', null, req.employeeName || req.user?.name),
                React.createElement('td', null, req.leaveType),
                React.createElement('td', null, req.startDate || req.from),
                React.createElement('td', null, req.endDate || req.to),
                React.createElement('td', null, req.reason),
                React.createElement('td', null, React.createElement(StatusBadge, { status: req.status })),
                React.createElement(
                  'td',
                  null,
                  req.status === 'Pending' ? React.createElement(
                    'div',
                    { style: { display: 'flex', gap: '5px' } },
                    React.createElement('button', { className: 'btn btn-success', onClick: () => handleActionClick(req, 'Approved') }, 'Approve'),
                    React.createElement('button', { className: 'btn btn-danger', onClick: () => handleActionClick(req, 'Rejected') }, 'Reject')
                  ) : React.createElement('span', { style: { color: '#6c757d' } }, 'Processed')
                )
              )
            )
          )
        )
      )
    ),

    actionModal && React.createElement(
      Modal,
      {
        title: actionModal.newStatus === 'Approved' ? 'Approve Leave Request' : 'Reject Leave Request',
        onClose: () => setActionModal(null),
        footer: [
          React.createElement('button', { key: 'cancel', className: 'btn btn-secondary', onClick: () => setActionModal(null) }, 'Cancel'),
          React.createElement('button', { key: 'confirm', className: actionModal.newStatus === 'Approved' ? 'btn btn-success' : 'btn btn-danger', onClick: confirmAction }, actionModal.newStatus === 'Approved' ? 'Approve' : 'Reject')
        ]
      },
      React.createElement(
        'div',
        { style: { display: 'flex', flexDirection: 'column', gap: '15px' } },
        React.createElement(
          'div',
          null,
          React.createElement('p', { style: { margin: '0 0 5px 0' } }, React.createElement('strong', null, 'Employee: '), actionModal.request.employeeName || actionModal.request.user?.name),
          React.createElement('p', { style: { margin: '0 0 5px 0' } }, React.createElement('strong', null, 'Type: '), actionModal.request.leaveType),
          React.createElement('p', { style: { margin: '0 0 5px 0' } }, React.createElement('strong', null, 'Dates: '), `${actionModal.request.startDate || actionModal.request.from} to ${actionModal.request.endDate || actionModal.request.to}`)
        ),
        React.createElement(
          'div',
          { className: 'form-group' },
          React.createElement('label', null, actionModal.newStatus === 'Approved' ? 'Comment (Optional):' : 'Reason (Required):'),
          React.createElement('textarea', {
            className: 'form-control',
            style: { width: '100%', minHeight: '80px', marginTop: '5px' },
            value: actionComment,
            onChange: e => {
              setActionComment(e.target.value);
              if (e.target.value.trim()) setActionError('');
            }
          }),
          actionError && React.createElement('p', { style: { color: 'red', fontSize: '14px', marginTop: '5px' } }, actionError)
        )
      )
    )
  );
};

export default LeaveRequests;
