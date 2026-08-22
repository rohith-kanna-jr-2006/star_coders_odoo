import { useEffect, useState } from 'react'
import { ArrowUpRight, CalendarCheck, Clock3, FileText, UserRound } from 'lucide-react'
import { Link } from 'react-router-dom'
import PageHeader from '../../components/PageHeader'
import StatusBadge from '../../components/StatusBadge'
import Loading from '../../components/Loading'
import ErrorMessage from '../../components/ErrorMessage'
import { useAuth } from '../../context/AuthContext'
import { getAttendance } from '../../services/attendanceService'
import { getLeaves } from '../../services/leaveService'
import { getApiError } from '../../services/api'

const unwrap = (result, key) => result?.[key] || result?.data?.[key] || result?.data || result || []
export default function Dashboard() { const { user } = useAuth(); const [data, setData] = useState({ attendance: null, leaves: [] }); const [loading, setLoading] = useState(true); const [error, setError] = useState('')
  const load = async () => { setLoading(true); setError(''); try { const [attendance, leaves] = await Promise.all([getAttendance(), getLeaves()]); setData({ attendance: unwrap(attendance, 'today') || unwrap(attendance, 'attendance'), leaves: unwrap(leaves, 'leaves') }) } catch (err) { setError(getApiError(err)) } finally { setLoading(false) } }
  useEffect(() => { load() }, [])
  const today = data.attendance || {}; const name = user?.name || user?.fullName || 'there'; const pending = data.leaves.filter((leave) => String(leave.status).toLowerCase() === 'pending').length
  return <><PageHeader eyebrow="OVERVIEW" title={`Good morning, ${name.split(' ')[0]}.`} description="Here’s the shape of your workday." />{loading ? <Loading label="Loading your workspace..."/> : error ? <ErrorMessage message={error} onRetry={load}/> : <><section className="metric-grid"><div className="metric-card accent"><div className="metric-icon"><Clock3 size={19}/></div><span>Today’s status</span><strong>{today.status || 'Not recorded'}</strong><small>{today.checkIn || today.checkInTime ? `In at ${today.checkIn || today.checkInTime}` : 'No check-in yet'}</small></div><div className="metric-card"><div className="metric-icon green"><CalendarCheck size={19}/></div><span>Leave requests</span><strong>{pending}</strong><small>Pending review</small></div><div className="metric-card"><div className="metric-icon blue"><UserRound size={19}/></div><span>Employee ID</span><strong>{user?.employeeId || user?.id || '—'}</strong><small>Active employee</small></div></section><section className="dashboard-grid"><div className="section-card"><div className="card-heading"><div><div className="eyebrow">QUICK ACCESS</div><h2>Keep moving</h2></div></div><div className="quick-links"><Link to="/employee/profile"><UserRound size={20}/><span>Profile<small>Personal details</small></span><ArrowUpRight size={17}/></Link><Link to="/employee/attendance"><Clock3 size={20}/><span>Attendance<small>Track your hours</small></span><ArrowUpRight size={17}/></Link><Link to="/employee/leave"><FileText size={20}/><span>Leave<small>{pending ? `${pending} request pending` : 'Plan time away'}</small></span><ArrowUpRight size={17}/></Link></div></div><div className="section-card"><div className="card-heading"><div><div className="eyebrow">TODAY</div><h2>Attendance pulse</h2></div><StatusBadge status={today.status || 'Not recorded'}/></div><div className="time-row"><div><span>Check-in</span><strong>{today.checkIn || today.checkInTime || '—'}</strong></div><div><span>Check-out</span><strong>{today.checkOut || today.checkOutTime || '—'}</strong></div><div><span>Hours</span><strong>{today.workingHours || today.hours || '—'}</strong></div></div><Link className="card-link" to="/employee/attendance">Open attendance <ArrowUpRight size={15}/></Link></div></section></>}</>
}
