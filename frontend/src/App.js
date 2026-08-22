import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import EmployeeLayout from './components/EmployeeLayout'
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import Dashboard from './pages/employee/Dashboard'
import Profile from './pages/employee/Profile'
import Attendance from './pages/employee/Attendance'
import Leave from './pages/employee/Leave'
import Payroll from './pages/employee/Payroll'

// Root redirector based on authentication status
function RootRedirect() {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return null
  return <Navigate to={isAuthenticated ? '/employee/dashboard' : '/login'} replace />
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Authentication Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Employee Workspace Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<EmployeeLayout />}>
            <Route path="/employee/dashboard" element={<Dashboard />} />
            <Route path="/employee/profile" element={<Profile />} />
            <Route path="/employee/attendance" element={<Attendance />} />
            <Route path="/employee/leave" element={<Leave />} />
            <Route path="/employee/payroll" element={<Payroll />} />
          </Route>
        </Route>

        {/* Root and Catch-All Fallback */}
        <Route path="/" element={<RootRedirect />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  )
}
