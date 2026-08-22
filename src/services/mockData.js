export const mockEmployees = [
  { id: 'EMP001', name: 'Ravi Kumar', department: 'CSE', designation: 'Developer', email: 'ravi@email.com', status: 'Active', phone: '9876543210', address: '123 Tech Park, Bangalore', joiningDate: '2023-01-15' },
  { id: 'EMP002', name: 'Arun Kumar', department: 'HR', designation: 'Executive', email: 'arun@email.com', status: 'Active', phone: '8765432109', address: '456 HR Hub, Mumbai', joiningDate: '2022-11-01' },
  { id: 'EMP003', name: 'Priya Sharma', department: 'Design', designation: 'UI/UX Designer', email: 'priya@email.com', status: 'Inactive', phone: '7654321098', address: '789 Creative St, Pune', joiningDate: '2024-03-10' },
  { id: 'EMP004', name: 'Vikram Singh', department: 'Finance', designation: 'Manager', email: 'vikram@email.com', status: 'Active', phone: '6543210987', address: '321 Money Ave, Delhi', joiningDate: '2021-08-20' },
];

export const mockLeaves = [
  { id: 'L001', employeeId: 'EMP001', employeeName: 'Ravi Kumar', leaveType: 'Paid', from: '2026-08-25', to: '2026-08-27', status: 'Pending', remarks: 'Personal work', days: 3 },
  { id: 'L002', employeeId: 'EMP002', employeeName: 'Arun Kumar', leaveType: 'Sick', from: '2026-08-22', to: '2026-08-22', status: 'Approved', remarks: 'Fever', days: 1 },
  { id: 'L003', employeeId: 'EMP004', employeeName: 'Vikram Singh', leaveType: 'Unpaid', from: '2026-09-01', to: '2026-09-10', status: 'Rejected', remarks: 'Vacation', days: 10, adminComment: 'Not enough staffing during this period.' },
];

export const mockAttendance = [
  { id: 'A001', date: '2026-08-22', employeeId: 'EMP001', employeeName: 'Ravi Kumar', checkIn: '09:02', checkOut: '18:00', status: 'Present' },
  { id: 'A002', date: '2026-08-22', employeeId: 'EMP002', employeeName: 'Arun Kumar', checkIn: '09:30', checkOut: '--', status: 'Present' },
  { id: 'A003', date: '2026-08-22', employeeId: 'EMP003', employeeName: 'Priya Sharma', checkIn: '--', checkOut: '--', status: 'Absent' },
  { id: 'A004', date: '2026-08-22', employeeId: 'EMP004', employeeName: 'Vikram Singh', checkIn: '09:15', checkOut: '14:00', status: 'Half-day' },
];

export const mockPayroll = [
  { employeeId: 'EMP001', employeeName: 'Ravi Kumar', department: 'CSE', basicSalary: 50000, allowances: 5000, deductions: 2000, other: 1000, netSalary: 54000 },
  { employeeId: 'EMP002', employeeName: 'Arun Kumar', department: 'HR', basicSalary: 40000, allowances: 4000, deductions: 1500, other: 500, netSalary: 43000 },
];

export const mockUser = {
  id: 'ADMIN01',
  name: 'HR Admin',
  role: 'admin',
  email: 'admin@dayflow.com'
};
