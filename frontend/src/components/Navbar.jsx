import { Menu, LogOut, User } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar({ onMenu }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const displayName = user?.name || user?.fullName || user?.email || 'Employee'
  const displayInitials = (user?.name || user?.fullName || 'E').slice(0, 1).toUpperCase()
  const department = user?.department || user?.designation || 'Workspace'

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="icon-button mobile-only" onClick={onMenu} aria-label="Open menu">
          <Menu size={22} />
        </button>
        <span className="topbar-breadcrumb">Dayflow HRMS / {department}</span>
      </div>

      <div className="topbar-right">
        <Link to="/employee/profile" className="user-chip" title="View Profile">
          <span className="avatar small">{displayInitials}</span>
          <span className="user-name">{displayName}</span>
        </Link>
        <button
          className="icon-button logout-icon-btn"
          onClick={handleLogout}
          title="Sign out"
          aria-label="Sign out"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  )
}
