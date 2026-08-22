import { useEffect, useState } from 'react'
import {
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  LogOut as CheckOutIcon,
  RotateCcw,
} from 'lucide-react'
import PageHeader from '../../components/PageHeader'
import Loading from '../../components/Loading'
import ErrorMessage from '../../components/ErrorMessage'
import StatusBadge from '../../components/StatusBadge'
import { checkIn, checkOut, getAttendance } from '../../services/attendanceService'
import { getApiError } from '../../services/api'

// Helper to unwrap nested response payloads
const unwrap = (result, key) =>
  result?.[key] || result?.data?.[key] || result?.data || result || []

export default function Attendance() {
  const [attendanceData, setAttendanceData] = useState(null)
  const [weeklyRecords, setWeeklyRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState('')
  const [error, setError] = useState('')
  const [feedbackMessage, setFeedbackMessage] = useState('')
  const [weekOffset, setWeekOffset] = useState(0) // 0: current week, -1: prev week, +1: next week

  const fetchAttendanceRecords = async () => {
    setLoading(true)
    setError('')
    try {
      const result = await getAttendance({ weekOffset })
      const todayRecord = unwrap(result, 'today') || {}
      const weeklyList = unwrap(result, 'weekly') || unwrap(result, 'week') || []
      const dailyList = unwrap(result, 'daily') || unwrap(result, 'records') || []

      setAttendanceData({
        ...todayRecord,
        daily: Array.isArray(dailyList) ? dailyList : [],
      })
      setWeeklyRecords(Array.isArray(weeklyList) ? weeklyList : [])
    } catch (err) {
      setError(getApiError(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAttendanceRecords()
  }, [weekOffset])

  const handleCheckIn = async () => {
    setActionLoading('check-in')
    setError('')
    setFeedbackMessage('')

    try {
      await checkIn()
      setFeedbackMessage('Check-in successful.')
      await fetchAttendanceRecords()
    } catch (err) {
      setError(getApiError(err))
    } finally {
      setActionLoading('')
    }
  }

  const handleCheckOut = async () => {
    setActionLoading('check-out')
    setError('')
    setFeedbackMessage('')

    try {
      await checkOut()
      setFeedbackMessage('Check-out successful.')
      await fetchAttendanceRecords()
    } catch (err) {
      setError(getApiError(err))
    } finally {
      setActionLoading('')
    }
  }

  if (loading && !attendanceData) {
    return <Loading label="Loading attendance details..." />
  }

  if (error && !attendanceData) {
    return <ErrorMessage message={error} onRetry={fetchAttendanceRecords} />
  }

  const today = attendanceData || {}
  const hasCheckedIn = Boolean(today.checkIn || today.checkInTime)
  const hasCheckedOut = Boolean(today.checkOut || today.checkOutTime)

  // Daily records list
  const dailyRows = Array.isArray(today.daily)
    ? today.daily
    : Array.isArray(attendanceData)
    ? attendanceData
    : []

  const formattedTodayDate =
    today.date ||
    new Date().toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })

  const getWeekLabel = () => {
    if (weekOffset === 0) return 'Current Week'
    if (weekOffset === -1) return 'Previous Week'
    if (weekOffset === 1) return 'Next Week'
    return weekOffset < 0 ? `${Math.abs(weekOffset)} Weeks Ago` : `In ${weekOffset} Weeks`
  }

  return (
    <>
      <PageHeader
        eyebrow="TIME & ATTENDANCE"
        title="Attendance & Time Tracking"
        description="Record your daily check-in, review shift logs, and inspect weekly attendance patterns."
      />

      {/* Today's Attendance Overview Hero */}
      <section className="attendance-hero">
        <div className="attendance-hero-info">
          <div className="eyebrow">TODAY'S ATTENDANCE</div>
          <h2>{formattedTodayDate}</h2>
          <div className="attendance-status-row">
            <StatusBadge status={today.status || (hasCheckedIn ? 'Present' : 'Not Recorded')} />
            {(today.workingHours || today.hours) && (
              <span className="working-hours-pill">
                {today.workingHours || today.hours} total recorded
              </span>
            )}
          </div>
        </div>

        <div className="attendance-actions">
          {feedbackMessage && <div className="form-success compact">{feedbackMessage}</div>}
          {error && <div className="form-error compact">{error}</div>}

          <div className="action-buttons-group">
            <button
              className="primary-button"
              disabled={hasCheckedIn || Boolean(actionLoading)}
              onClick={handleCheckIn}
            >
              {actionLoading === 'check-in' ? (
                'Checking in...'
              ) : (
                <>
                  <Check size={16} />
                  <span>Check In</span>
                </>
              )}
            </button>

            <button
              className="secondary-button"
              disabled={!hasCheckedIn || hasCheckedOut || Boolean(actionLoading)}
              onClick={handleCheckOut}
            >
              {actionLoading === 'check-out' ? (
                'Checking out...'
              ) : (
                <>
                  <CheckOutIcon size={16} />
                  <span>Check Out</span>
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Today's Metrics Bar */}
      <section className="time-row large-time">
        <div>
          <span className="time-label">
            <Clock3 size={15} /> Check-In Time
          </span>
          <strong className="time-value">{today.checkIn || today.checkInTime || '—'}</strong>
        </div>
        <div>
          <span className="time-label">
            <Clock3 size={15} /> Check-Out Time
          </span>
          <strong className="time-value">{today.checkOut || today.checkOutTime || '—'}</strong>
        </div>
        <div>
          <span className="time-label">
            <CalendarDays size={15} /> Working Hours
          </span>
          <strong className="time-value">{today.workingHours || today.hours || '—'}</strong>
        </div>
      </section>

      {/* Daily Attendance Records Table */}
      <section className="section-card">
        <div className="card-heading">
          <div>
            <div className="eyebrow">DAILY LOGS</div>
            <h2 className="card-title">Daily Attendance History</h2>
          </div>
          <div className="week-controls">
            <button
              className="icon-button"
              onClick={() => setWeekOffset((prev) => prev - 1)}
              aria-label="Previous week"
              title="Previous week"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="current-week-tag">{getWeekLabel()}</span>
            <button
              className="icon-button"
              onClick={() => setWeekOffset((prev) => prev + 1)}
              aria-label="Next week"
              title="Next week"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Check-in</th>
                <th>Check-out</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {dailyRows.length > 0 ? (
                dailyRows.map((row, index) => (
                  <tr key={row._id || row.id || index}>
                    <td>{row.date || row.day || '—'}</td>
                    <td>{row.checkIn || row.checkInTime || '—'}</td>
                    <td>{row.checkOut || row.checkOutTime || '—'}</td>
                    <td>
                      <StatusBadge status={row.status || 'Present'} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="empty-cell">
                    No attendance records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Weekly View Grid */}
      <section className="section-card mt-4">
        <div className="eyebrow">WEEKLY SUMMARY</div>
        <h2 className="card-title">Weekly Attendance Breakdown</h2>
        <div className="week-grid">
          {weeklyRecords.length > 0 ? (
            weeklyRecords.map((day, index) => (
              <div key={day.date || index} className="week-day-card">
                <span className="week-day-title">{day.day || day.name || day.date}</span>
                <StatusBadge status={day.status || 'Not Recorded'} />
                {day.hours && <small className="muted">{day.hours} worked</small>}
              </div>
            ))
          ) : (
            <p className="muted empty-state-note">
              No weekly summary records found for this period.
            </p>
          )}
        </div>
      </section>
    </>
  )
}
