import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  UserRound,
  CalendarDays,
  BarChart3,
  CircleDollarSign,
  LogOut,
  X,
} from 'lucide-react'

const navItems = [
  { to: '/employee/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/employee/profile', label: 'My Profile', icon: UserRound },
  { to: '/employee/attendance', label: 'Attendance', icon: CalendarDays },
  { to: '/employee/leave', label: 'Leave', icon: BarChart3 },
  { to: '/employee/payroll', label: 'Payroll', icon: CircleDollarSign },
]

export default function Sidebar({ open, onClose, onLogout }) {
  return (
    <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
      <div className="brand">
        <span className="brand-mark">D</span>
        <div className="brand-text">
          <span className="brand-title">Dayflow</span>
          <span className="brand-subtitle">HRMS PORTAL</span>
        </div>
        <button className="icon-button mobile-only close-sidebar-btn" onClick={onClose} aria-label="Close menu">
          <X size={20} />
        </button>
      </div>

      <div className="sidebar-section-title">MAIN NAVIGATION</div>

      <nav className="sidebar-nav">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            <Icon size={19} className="nav-icon" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="nav-link logout-link" onClick={onLogout}>
          <LogOut size={19} className="nav-icon" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}
