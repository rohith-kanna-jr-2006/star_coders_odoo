import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getLeaveById, approveLeave, rejectLeave } from '../../services/leaveService';

const LeaveDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [leave, setLeave] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');
  
  const [adminComment, setAdminComment] = useState('');
  const [showRejectConfirm, setShowRejectConfirm] = useState(false);
  const [showApproveConfirm, setShowApproveConfirm] = useState(false);

  useEffect(() => {
    const fetchLeave = async () => {
      try {
        setLoading(true);
        const res = await getLeaveById(id);
        setLeave(res.data);
        setError(null);
      } catch (err) {
        setError('Unable to load leave request.');
      } finally {
        setLoading(false);
      }
    };
    fetchLeave();
  }, [id]);

  const handleApprove = async () => {
    try {
      setActionLoading(true);
      setError(null);
      const res = await approveLeave(id, adminComment);
      setLeave(res.data);
      setSuccess('Leave request approved successfully.');
      setShowApproveConfirm(false);
    } catch (err) {
      setError('Unable to approve this leave request. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!adminComment.trim()) {
      setError('Rejection reason is required.');
      return;
    }
    try {
      setActionLoading(true);
      setError(null);
      const res = await rejectLeave(id, adminComment);
      setLeave(res.data);
      setSuccess('Leave request rejected successfully.');
      setShowRejectConfirm(false);
    } catch (err) {
      setError('Unable to reject this leave request. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return React.createElement('div', { className: 'loading-state' }, 'Loading leave details...');
  if (error && !leave) return React.createElement('div', { className: 'error-state' }, error, React.createElement('button', { onClick: () => navigate('/admin/leave'), style: { marginLeft: '10px' } }, 'Back to List'));
  if (!leave) return React.createElement('div', { className: 'empty-state' }, 'Not available');

  const renderField = (label, value) => {
    return React.createElement(
      'div',
      { style: { marginBottom: '15px' } },
      React.createElement('div', { style: { fontWeight: 'bold', marginBottom: '5px', color: '#555' } }, label),
      React.createElement('div', { style: { padding: '8px', backgroundColor: '#f9f9f9', border: '1px solid #eee', borderRadius: '4px' } }, value || 'Not available')
    );
  };

  return React.createElement(
    'div',
    { className: 'page' },
    React.createElement(
      'div',
      { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' } },
      React.createElement('h1', { className: 'page-title', style: { margin: 0 } }, `Leave Details: ${leave.id}`),
      React.createElement(
        'button',
        { 
          onClick: () => navigate('/admin/leave'),
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
        { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' } },
        React.createElement(
          'div',
          null,
          renderField('Employee', `${leave.employeeId} - ${leave.employeeName}`),
          renderField('Leave Type', leave.leaveType),
          renderField('From', leave.from),
          renderField('To', leave.to)
        ),
        React.createElement(
          'div',
          null,
          renderField('Number of Days', leave.days),
          renderField('Remarks (from employee)', leave.remarks),
          React.createElement(
            'div',
            { style: { marginBottom: '15px' } },
            React.createElement('div', { style: { fontWeight: 'bold', marginBottom: '5px', color: '#555' } }, 'Status'),
            React.createElement(
              'span',
              { 
                style: { 
                  padding: '6px 12px', 
                  borderRadius: '12px', 
                  fontSize: '0.9em',
                  fontWeight: 'bold',
                  display: 'inline-block',
                  backgroundColor: leave.status === 'Approved' ? '#d4edda' : leave.status === 'Rejected' ? '#f8d7da' : '#fff3cd',
                  color: leave.status === 'Approved' ? '#155724' : leave.status === 'Rejected' ? '#721c24' : '#856404'
                } 
              },
              leave.status
            )
          ),
          leave.status !== 'Pending' ? renderField('Admin Comment', leave.adminComment) : null
        )
      ),

      // Action Area for Pending Leaves
      leave.status === 'Pending' ? React.createElement(
        'div',
        { style: { marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #ddd' } },
        React.createElement(
          'div',
          { style: { marginBottom: '15px' } },
          React.createElement('label', { style: { display: 'block', fontWeight: 'bold', marginBottom: '5px' } }, 'Admin Comment (Required for Rejection)'),
          React.createElement('textarea', {
            value: adminComment,
            onChange: (e) => setAdminComment(e.target.value),
            placeholder: 'Enter comments...',
            style: { width: '100%', minHeight: '80px', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }
          })
        ),
        
        // Buttons
        !showApproveConfirm && !showRejectConfirm ? React.createElement(
          'div',
          { style: { display: 'flex', gap: '15px' } },
          React.createElement(
            'button',
            {
              onClick: () => setShowApproveConfirm(true),
              style: { cursor: 'pointer', padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold' }
            },
            'Approve'
          ),
          React.createElement(
            'button',
            {
              onClick: () => setShowRejectConfirm(true),
              style: { cursor: 'pointer', padding: '10px 20px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold' }
            },
            'Reject'
          )
        ) : null,

        // Approve Confirm
        showApproveConfirm ? React.createElement(
          'div',
          { style: { padding: '15px', backgroundColor: '#f8f9fa', border: '1px solid #ddd', borderRadius: '4px' } },
          React.createElement('p', { style: { marginTop: 0, fontWeight: 'bold' } }, 'Are you sure you want to approve this leave?'),
          React.createElement(
            'div',
            { style: { display: 'flex', gap: '10px' } },
            React.createElement(
              'button',
              {
                onClick: () => setShowApproveConfirm(false),
                disabled: actionLoading,
                style: { cursor: 'pointer', padding: '8px 16px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px' }
              },
              'Cancel'
            ),
            React.createElement(
              'button',
              {
                onClick: handleApprove,
                disabled: actionLoading,
                style: { cursor: actionLoading ? 'not-allowed' : 'pointer', padding: '8px 16px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }
              },
              actionLoading ? 'Approving...' : 'Confirm Approve'
            )
          )
        ) : null,

        // Reject Confirm
        showRejectConfirm ? React.createElement(
          'div',
          { style: { padding: '15px', backgroundColor: '#f8f9fa', border: '1px solid #ddd', borderRadius: '4px' } },
          React.createElement('p', { style: { marginTop: 0, fontWeight: 'bold', color: '#dc3545' } }, 'Are you sure you want to reject this leave?'),
          React.createElement(
            'div',
            { style: { display: 'flex', gap: '10px' } },
            React.createElement(
              'button',
              {
                onClick: () => setShowRejectConfirm(false),
                disabled: actionLoading,
                style: { cursor: 'pointer', padding: '8px 16px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px' }
              },
              'Cancel'
            ),
            React.createElement(
              'button',
              {
                onClick: handleReject,
                disabled: actionLoading,
                style: { cursor: actionLoading ? 'not-allowed' : 'pointer', padding: '8px 16px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }
              },
              actionLoading ? 'Rejecting...' : 'Confirm Rejection'
            )
          )
        ) : null

      ) : null
    )
  );
};

export default LeaveDetails;
