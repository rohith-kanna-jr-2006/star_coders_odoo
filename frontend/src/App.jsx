import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import EmployeeLayout from './components/EmployeeLayout'
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import Dashboard from './pages/employee/Dashboard'
import Profile from './pages/employee/Profile'
import Attendance from './pages/employee/Attendance'
import Leave from './pages/employee/Leave'
import Payroll from './pages/employee/Payroll'

export default function App() {
  return <AuthProvider><Routes><Route path="/login" element={<Login />} /><Route path="/signup" element={<Signup />} /><Route element={<ProtectedRoute />}><Route element={<EmployeeLayout />}><Route path="/employee/dashboard" element={<Dashboard />} /><Route path="/employee/profile" element={<Profile />} /><Route path="/employee/attendance" element={<Attendance />} /><Route path="/employee/leave" element={<Leave />} /><Route path="/employee/payroll" element={<Payroll />} /></Route></Route><Route path="*" element={<Navigate to="/login" replace />} /></Routes></AuthProvider>
}
