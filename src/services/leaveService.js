import api from './api';
import { mockLeaves } from './mockData';

export const getLeaveRequests = async (status = '') => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let data = [...mockLeaves];
      if (status) {
        data = data.filter(l => l.status === status);
      }
      resolve({ data });
    }, 500);
  });
};

export const getLeaveById = async (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const leave = mockLeaves.find(l => l.id === id);
      if (leave) resolve({ data: leave });
      else reject(new Error("Leave request not found"));
    }, 500);
  });
};

export const approveLeave = async (id, comment) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockLeaves.findIndex(l => l.id === id);
      if (index !== -1) {
        mockLeaves[index] = { ...mockLeaves[index], status: 'Approved', adminComment: comment };
        resolve({ data: mockLeaves[index] });
      } else {
        reject(new Error("Leave not found"));
      }
    }, 500);
  });
};

export const rejectLeave = async (id, comment) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!comment) return reject(new Error("Comment is required for rejection"));
      const index = mockLeaves.findIndex(l => l.id === id);
      if (index !== -1) {
        mockLeaves[index] = { ...mockLeaves[index], status: 'Rejected', adminComment: comment };
        resolve({ data: mockLeaves[index] });
      } else {
        reject(new Error("Leave not found"));
      }
    }, 500);
  });
};

export const updateLeaveStatus = async (id, status, comment = 'Status updated by Admin') => {
  if (status === 'Approved') {
    return approveLeave(id, comment);
  } else if (status === 'Rejected') {
    return rejectLeave(id, comment);
  } else {
    return Promise.reject(new Error("Invalid status update"));
  }
};

