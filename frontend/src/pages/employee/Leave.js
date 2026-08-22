import { useEffect, useState } from 'react'
import { Send, Calendar, Clock, AlertCircle, FileText, CheckCircle2 } from 'lucide-react'
import PageHeader from '../../components/PageHeader'
import Loading from '../../components/Loading'
import ErrorMessage from '../../components/ErrorMessage'
import StatusBadge from '../../components/StatusBadge'
import { applyLeave, getLeaves } from '../../services/leaveService'
import { getApiError } from '../../services/api'

const unwrap = (result) =>
  result?.leaves || result?.data?.leaves || result?.data || result || []

export default function Leave() {
  const [leaves, setLeaves] = useState([])
  const [form, setForm] = useState({
    leaveType: '',
    startDate: '',
    endDate: '',
    remarks: '',
  })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [validationError, setValidationError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const fetchLeaveHistory = async () => {
    setLoading(true)
    setError('')
    try {
      const data = unwrap(await getLeaves())
      setLeaves(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(getApiError(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLeaveHistory()
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setValidationError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setValidationError('')
    setSuccessMessage('')

    // Client-side validations
    if (!form.leaveType) {
      return setValidationError('Please select a leave type.')
    }
    if (!form.startDate) {
      return setValidationError('Please choose a start date (From Date).')
    }
    if (!form.endDate) {
      return setValidationError('Please choose an end date (To Date).')
    }
    if (new Date(form.endDate) < new Date(form.startDate)) {
      return setValidationError('End date cannot be before start date.')
    }

    setSubmitting(true)
    try {
      await applyLeave({
        leaveType: form.leaveType,
        startDate: form.startDate,
        endDate: form.endDate,
        remarks: form.remarks.trim(),
      })

      setForm({ leaveType: '', startDate: '', endDate: '', remarks: '' })
      setSuccessMessage('Leave request submitted successfully.')
      await fetchLeaveHistory()
    } catch (err) {
      setValidationError(getApiError(err))
    } finally {
      setSubmitting(false)
    }
  }

  if (loading && !leaves.length) {
    return <Loading label="Loading leave requests..." />
  }

  if (error && !leaves.length) {
    return <ErrorMessage message={error} onRetry={fetchLeaveHistory} />
  }

  // Count summaries
  const pendingCount = leaves.filter(
    (l) => String(l.status || '').toLowerCase() === 'pending'
  ).length
  const approvedCount = leaves.filter(
    (l) => String(l.status || '').toLowerCase() === 'approved'
  ).length
  const rejectedCount = leaves.filter(
    (l) => String(l.status || '').toLowerCase() === 'rejected'
  ).length

  return (
    <>
      <PageHeader
        eyebrow="TIME OFF MANAGEMENT"
        title="Leave Management"
        description="Submit time-off requests, monitor approval status, and view historical leave records."
      />

      {/* Leave Status Metrics */}
      <section className="metric-grid mb-4">
        <div className="metric-card">
          <div className="metric-icon">
            <Clock size={19} />
          </div>
          <span className="metric-label">Pending Review</span>
          <strong className="metric-value">{pendingCount}</strong>
          <small className="metric-subtext">Awaiting HR / Manager approval</small>
        </div>

        <div className="metric-card">
          <div className="metric-icon green">
            <CheckCircle2 size={19} />
          </div>
          <span className="metric-label">Approved Requests</span>
          <strong className="metric-value">{approvedCount}</strong>
          <small className="metric-subtext">Granted time off</small>
        </div>

        <div className="metric-card">
          <div className="metric-icon blue">
            <FileText size={19} />
          </div>
          <span className="metric-label">Total Applications</span>
          <strong className="metric-value">{leaves.length}</strong>
          <small className="metric-subtext">{rejectedCount} rejected</small>
        </div>
      </section>

      <div className="leave-grid">
        {/* Left Card: Apply Leave Form */}
        <section className="section-card">
          <div className="eyebrow">NEW LEAVE REQUEST</div>
          <h2 className="card-title">Apply for Time Off</h2>

          <form onSubmit={handleSubmit} className="form-stack">
            <label>
              Leave Type <span className="required-star">*</span>
              <select
                name="leaveType"
                value={form.leaveType}
                onChange={handleChange}
                required
              >
                <option value="">-- Select Leave Category --</option>
                <option value="Paid">Paid Leave</option>
                <option value="Sick">Sick Leave</option>
                <option value="Unpaid">Unpaid Leave</option>
              </select>
            </label>

            <div className="two-col">
              <label>
                From Date <span className="required-star">*</span>
                <input
                  type="date"
                  name="startDate"
                  value={form.startDate}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                To Date <span className="required-star">*</span>
                <input
                  type="date"
                  name="endDate"
                  value={form.endDate}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>

            <label>
              Reason / Remarks <span className="optional">(Optional)</span>
              <textarea
                rows="4"
                name="remarks"
                placeholder="Provide context or explanation for your time-off request..."
                value={form.remarks}
                onChange={handleChange}
              />
            </label>

            {validationError && <div className="form-error">{validationError}</div>}
            {successMessage && <div className="form-success">{successMessage}</div>}

            <button type="submit" className="primary-button" disabled={submitting}>
              {submitting ? (
                'Submitting...'
              ) : (
                <>
                  <Send size={16} />
                  <span>Submit Leave Request</span>
                </>
              )}
            </button>
          </form>
        </section>

        {/* Right Card: Leave History Table */}
        <section className="section-card">
          <div className="card-heading">
            <div>
              <div className="eyebrow">RECORDS</div>
              <h2 className="card-title">Leave History & Status</h2>
            </div>
          </div>

          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Leave Type</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {leaves.length > 0 ? (
                  leaves.map((leave, index) => (
                    <tr key={leave._id || leave.id || index}>
                      <td>
                        <strong>{leave.leaveType || leave.type || '—'}</strong>
                        {leave.remarks && (
                          <small className="table-subtext">{leave.remarks}</small>
                        )}
                      </td>
                      <td>{leave.startDate || leave.from || '—'}</td>
                      <td>{leave.endDate || leave.to || '—'}</td>
                      <td>
                        <StatusBadge status={leave.status || 'Pending'} />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="empty-cell">
                      No leave requests found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  )
}
