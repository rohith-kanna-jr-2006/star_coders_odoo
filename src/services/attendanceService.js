import api from './api';
import { mockAttendance } from './mock/mockAttendance';

export const getAttendance = async (date = '', employeeId = '', status = '') => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let data = [...mockAttendance];
      if (date) {
        data = data.filter(a => a.date === date);
      }
      if (employeeId) {
        data = data.filter(a => a.employeeId.toLowerCase().includes(employeeId.toLowerCase()));
      }
      if (status) {
        data = data.filter(a => a.status === status);
      }
      resolve({ data });
    }, 500);
  });
};
