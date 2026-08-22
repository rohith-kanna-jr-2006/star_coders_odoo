import api from './api';
import { mockEmployees } from './mockData';

export const getEmployees = async (search = '') => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let data = [...mockEmployees];
      if (search) {
        const lowerSearch = search.toLowerCase();
        data = data.filter(e => 
          e.id.toLowerCase().includes(lowerSearch) ||
          e.name.toLowerCase().includes(lowerSearch) ||
          e.email.toLowerCase().includes(lowerSearch)
        );
      }
      resolve({ data });
    }, 500);
  });
};

export const getEmployeeById = async (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const emp = mockEmployees.find(e => e.id === id);
      if (emp) resolve({ data: emp });
      else reject(new Error("Employee not found"));
    }, 500);
  });
};

export const updateEmployee = async (id, data) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockEmployees.findIndex(e => e.id === id);
      if (index !== -1) {
        mockEmployees[index] = { ...mockEmployees[index], ...data };
        resolve({ data: mockEmployees[index] });
      } else {
        reject(new Error("Employee not found"));
      }
    }, 500);
  });
};
