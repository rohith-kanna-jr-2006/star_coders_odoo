import api from './api';
import { mockPayroll } from './mockData';

export const getPayrolls = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data: [...mockPayroll] });
    }, 500);
  });
};

export const getPayrollByEmployeeId = async (employeeId) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const payroll = mockPayroll.find(p => p.employeeId === employeeId);
      if (payroll) resolve({ data: payroll });
      else reject(new Error("Payroll record not found"));
    }, 500);
  });
};

export const updateSalaryStructure = async (employeeId, data) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockPayroll.findIndex(p => p.employeeId === employeeId);
      const netSalary = parseFloat(data.basicSalary || 0) + parseFloat(data.allowances || 0) + parseFloat(data.other || 0) - parseFloat(data.deductions || 0);
      
      if (index !== -1) {
        mockPayroll[index] = { ...mockPayroll[index], ...data, netSalary };
        resolve({ data: mockPayroll[index] });
      } else {
        // Create new if not exists for mock purposes
        const newRecord = { employeeId, ...data, netSalary };
        mockPayroll.push(newRecord);
        resolve({ data: newRecord });
      }
    }, 500);
  });
};
