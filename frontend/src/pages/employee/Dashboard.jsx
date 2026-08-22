import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowUpRight,
  CalendarCheck,
  Clock3,
  FileText,
  UserRound,
  CircleDollarSign,
  Briefcase,
  Layers,
} from 'lucide-react'
import PageHeader from '../../components/PageHeader'
import StatusBadge from '../../components/StatusBadge'
import Loading from '../../components/Loading'
import ErrorMessage from '../../components/ErrorMessage'
import { useAuth } from '../../context/AuthContext'
import { getAttendance } from '../../services/attendanceService'
import { getLeaves } from '../../services/leaveService'
import { getApiError } from '../../services/api'

// Helper to unwrap flexible backend response shapes
const unwrap = (result, key) =>
  result?.[key] || result?.data?.[key] || result?.data || result || []

export default function Dashboard() {
  const { user } = useAuth()
  const [data, setData] = useState({ attendance: null, leaves: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchDashboardData = async () => {
    setLoading(true)
    setError('')
    try {
      const [attendanceRes, leavesRes] = await Promise.allSettled([
        getAttendance(),
        getLeaves(),
      ])

      const attendanceData =
        attendanceRes.status === 'fulfilled'
          ? unwrap(attendanceRes.value, 'today') || unwrap(attendanceRes.value, 'attendance')
          : null

      const leavesData =
        leavesRes.status === 'fulfilled'
          ? unwrap(leavesRes.value, 'leaves')
          : []

      setData({
        attendance: attendanceData,
        leaves: Array.isArray(leavesData) ? leavesData : [],
      })
    } catch (err) {
      setError(getApiError(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const employeeName = user?.name || user?.fullName || user?.email?.split('@')[0] || 'Employee'
  const firstName = employeeName.split(' ')[0]
  const today = data.attendance || {}

  // Compute leave stats safely from received backend data
  const leaveList = Array.isArray(data.leaves) ? data.leaves : []
  const pendingLeaves = leaveList.filter(
    (l) => String(l.status || '').toLowerCase() === 'pending'
  ).length
  const approvedLeaves = leaveList.filter(
    (l) => String(l.status || '').toLowerCase() === 'approved'
  ).length

  return (
    <>
      <PageHeader
        eyebrow="OVERVIEW"
        title={`Welcome back, ${firstName}`}
        description="Here is the summary of your daily attendance, leave activity, and quick access tools."
      />

      {loading ? (
        <Loading label="Loading your dashboard workspace..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={fetchDashboardData} />
      ) : (
        <>
          {/* Employee Identity & Quick Metrics Bar */}
          <section className="metric-grid">
            <div className="metric-card accent">
              <div className="metric-icon">
                <Clock3 size={20} />
              </div>
              <span className="metric-label">Today's Attendance</span>
              <strong className="metric-value">{today.status || 'Not Recorded'}</strong>
              <small className="metric-subtext">
                {today.checkIn || today.checkInTime
                  ? `In: ${today.checkIn || today.checkInTime}`
                  : 'No check-in recorded today'}
              </small>
            </div>

            <div className="metric-card">
              <div className="metric-icon green">
                <CalendarCheck size={20} />
              </div>
              <span className="metric-label">Leave Status</span>
              <strong className="metric-value">{pendingLeaves} Pending</strong>
              <small className="metric-subtext">
                {approvedLeaves > 0 ? `${approvedLeaves} approved this cycle` : 'All requests up to date'}
              </small>
            </div>

            <div className="metric-card">
              <div className="metric-icon blue">
                <Briefcase size={20} />
              </div>
              <span className="metric-label">Employee ID / Dept</span>
              <strong className="metric-value">{user?.employeeId || user?.id || 'EMP-Active'}</strong>
              <small className="metric-subtext">
                {user?.department || user?.designation || 'Active Member'}
              </small>
            </div>
          </section>

          {/* Quick Actions and Attendance Pulse Grid */}
          <section className="dashboard-grid">
            {/* Quick Actions Card */}
            <div className="section-card">
              <div className="card-heading">
                <div>
                  <div className="eyebrow">QUICK ACTIONS</div>
                  <h2 className="card-title">Employee Actions</h2>
                </div>
              </div>

              <div className="quick-links">
                <Link to="/employee/profile" className="quick-link-item">
                  <div className="quick-link-icon-wrap">
                    <UserRound size={18} />
                  </div>
                  <div className="quick-link-info">
                    <span className="quick-link-title">My Profile</span>
                    <small>View & edit contact details</small>
                  </div>
                  <ArrowUpRight size={17} className="quick-link-arrow" />
                </Link>

                <Link to="/employee/attendance" className="quick-link-item">
                  <div className="quick-link-icon-wrap">
                    <Clock3 size={18} />
                  </div>
                  <div className="quick-link-info">
                    <span className="quick-link-title">Attendance</span>
                    <small>Check in, check out, & logs</small>
                  </div>
                  <ArrowUpRight size={17} className="quick-link-arrow" />
                </Link>

                <Link to="/employee/leave" className="quick-link-item">
                  <div className="quick-link-icon-wrap">
                    <FileText size={18} />
                  </div>
                  <div className="quick-link-info">
                    <span className="quick-link-title">Leave Portal</span>
                    <small>Apply for time off & history</small>
                  </div>
                  <ArrowUpRight size={17} className="quick-link-arrow" />
                </Link>

                <Link to="/employee/payroll" className="quick-link-item">
                  <div className="quick-link-icon-wrap">
                    <CircleDollarSign size={18} />
                  </div>
                  <div className="quick-link-info">
                    <span className="quick-link-title">Payroll</span>
                    <small>Salary details & payslips</small>
                  </div>
                  <ArrowUpRight size={17} className="quick-link-arrow" />
                </Link>
              </div>
            </div>

            {/* Today's Attendance Pulse Card */}
            <div className="section-card">
              <div className="card-heading">
                <div>
                  <div className="eyebrow">TODAY'S ACTIVITY</div>
                  <h2 className="card-title">Attendance Pulse</h2>
                </div>
                <StatusBadge status={today.status || 'Not Recorded'} />
              </div>

              <div className="time-row">
                <div>
                  <span>Check-in</span>
                  <strong>{today.checkIn || today.checkInTime || '—'}</strong>
                </div>
                <div>
                  <span>Check-out</span>
                  <strong>{today.checkOut || today.checkOutTime || '—'}</strong>
                </div>
                <div>
                  <span>Working Hours</span>
                  <strong>{today.workingHours || today.hours || '—'}</strong>
                </div>
              </div>

              <div className="dashboard-pulse-footer">
                <p className="muted small-note">
                  Official timestamps are securely recorded and synchronized with HR logs.
                </p>
                <Link className="card-link" to="/employee/attendance">
                  <span>Open Full Attendance Tracker</span>
                  <ArrowUpRight size={15} />
                </Link>
              </div>
            </div>
          </section>
        </>
      )}
    </>
  )
}
