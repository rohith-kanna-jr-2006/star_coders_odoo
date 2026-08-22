import api from './api';

export const getPayrolls = async () => {
  const res = await api.get('/hr/payroll');
  return { data: res.data.data };
};

export const getPayrollByEmployeeId = async (employeeId) => {
  const res = await api.get('/hr/payroll');
  const payroll = res.data.data?.find(p => p.employeeId === employeeId);
  if (payroll) return { data: payroll };
  throw new Error("Payroll record not found");
};

export const updateSalaryStructure = async (employeeId, data) => {
  const res = await api.post('/hr/payroll', {
    employeeId,
    basicSalary: data.basicSalary,
    allowances: data.allowances,
    deductions: data.deductions,
    month: data.month || 'Current',
    year: data.year || new Date().getFullYear()
  });
  return { data: res.data.data };
};
