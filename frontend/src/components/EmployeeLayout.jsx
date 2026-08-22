import { Outlet, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import { useAuth } from '../context/AuthContext'

export default function EmployeeLayout() {
  const [open, setOpen] = useState(false)
  const { logout } = useAuth()
  const navigate = useNavigate()
  const handleLogout = () => { logout(); navigate('/login') }
  return <div className="app-shell"><Sidebar open={open} onClose={() => setOpen(false)} onLogout={handleLogout} />{open && <div className="sidebar-scrim" onClick={() => setOpen(false)} /> }<div className="app-main"><Navbar onMenu={() => setOpen(true)} /><main className="page-content"><Outlet /></main></div></div>
}
