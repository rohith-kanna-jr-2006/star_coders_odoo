import api from './api';

export const getLeaveRequests = async (status = '') => {
  const res = await api.get('/hr/leaves');
  let data = res.data.data || [];
  if (status) {
    data = data.filter(l => l.status === status);
  }
  return { data };
};

export const getLeaveById = async (id) => {
  const res = await api.get('/hr/leaves');
  const leave = res.data.data?.find(l => l._id === id || l.id === id);
  if (leave) return { data: leave };
  throw new Error("Leave request not found");
};

export const approveLeave = async (id) => {
  const res = await api.put(`/hr/leaves/${id}/approve`);
  return { data: res.data.data };
};

export const rejectLeave = async (id, comment) => {
  if (!comment) throw new Error("Comment is required for rejection");
  const res = await api.put(`/hr/leaves/${id}/reject`, { rejectionReason: comment });
  return { data: res.data.data };
};

export const updateLeaveStatus = async (id, status, comment = '') => {
  if (status === 'Approved') {
    return approveLeave(id);
  } else if (status === 'Rejected') {
    return rejectLeave(id, comment);
  } else {
    return Promise.reject(new Error("Invalid status update"));
  }
};

