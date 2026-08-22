import { NavLink } from 'react-router-dom'
import { BarChart3, CalendarDays, CircleDollarSign, LayoutDashboard, LogOut, UserRound, X } from 'lucide-react'

const links = [['/employee/dashboard', 'Dashboard', LayoutDashboard], ['/employee/profile', 'Profile', UserRound], ['/employee/attendance', 'Attendance', CalendarDays], ['/employee/leave', 'Leave', BarChart3], ['/employee/payroll', 'Payroll', CircleDollarSign]]

export default function Sidebar({ open, onClose, onLogout }) {
  return <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}><div className="brand"><span className="brand-mark">D</span><span>dayflow</span><button className="icon-button mobile-only" onClick={onClose} aria-label="Close menu"><X size={20} /></button></div><nav>{links.map(([to, label, Icon]) => <NavLink key={to} to={to} onClick={onClose} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}><Icon size={18} />{label}</NavLink>)}</nav><button className="nav-link logout-link" onClick={onLogout}><LogOut size={18} />Log out</button></aside>
}
