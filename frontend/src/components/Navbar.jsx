import { Menu } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Navbar({ onMenu }) {
  const { user } = useAuth()
  return <header className="topbar"><button className="icon-button mobile-only" onClick={onMenu} aria-label="Open menu"><Menu size={21} /></button><div className="topbar-title">Employee workspace</div><div className="user-chip"><span className="avatar small">{(user?.name || user?.fullName || 'E').slice(0, 1).toUpperCase()}</span><span>{user?.name || user?.fullName || 'Employee'}</span></div></header>
}
