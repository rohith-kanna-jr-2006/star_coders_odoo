import { useEffect, useState } from 'react'
import { Save, UserRound, Mail, Phone, MapPin, Briefcase, Calendar, ShieldAlert, FileText, Image } from 'lucide-react'
import PageHeader from '../../components/PageHeader'
import Loading from '../../components/Loading'
import ErrorMessage from '../../components/ErrorMessage'
import { getProfile, updateProfile } from '../../services/profileService'
import { getApiError } from '../../services/api'
import { useAuth } from '../../context/AuthContext'

const unwrap = (result) =>
  result?.profile || result?.data?.profile || result?.data || result || {}

export default function Profile() {
  const { updateUser } = useAuth()
  const [profile, setProfile] = useState(null)
  const [form, setForm] = useState({ phone: '', address: '', profilePicture: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const fetchProfile = async () => {
    setLoading(true)
    setError('')
    try {
      const data = unwrap(await getProfile())
      setProfile(data)
      setForm({
        phone: data.phone || data.contactNumber || '',
        address: data.address || '',
        profilePicture: data.profilePicture || data.profileImage || data.avatar || '',
      })
    } catch (err) {
      setError(getApiError(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  const handleUpdate = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    setSuccessMessage('')

    try {
      const updated = unwrap(await updateProfile(form))
      const merged = { ...profile, ...form, ...(updated && typeof updated === 'object' ? updated : {}) }
      setProfile(merged)
      updateUser(merged)
      setSuccessMessage('Profile updated successfully.')
    } catch (err) {
      setError('Unable to update profile. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <Loading label="Loading employee profile..." />
  }

  if (error && !profile) {
    return <ErrorMessage message={error} onRetry={fetchProfile} />
  }

  const employeeName = profile?.name || profile?.fullName || 'Employee'
  const initials = employeeName.slice(0, 1).toUpperCase()

  const readOnlyJobFields = [
    { label: 'Employee ID', value: profile?.employeeId || profile?.id || '—', icon: Briefcase },
    { label: 'Official Email', value: profile?.email || '—', icon: Mail },
    { label: 'Department', value: profile?.department || 'General', icon: Briefcase },
    { label: 'Designation', value: profile?.designation || 'Specialist', icon: Briefcase },
    { label: 'Joining Date', value: profile?.joiningDate || profile?.joinedAt || '—', icon: Calendar },
    { label: 'Employment Type', value: profile?.employmentType || 'Full-time Permanent', icon: Briefcase },
  ]

  const documents = Array.isArray(profile?.documents) ? profile.documents : []

  return (
    <>
      <PageHeader
        eyebrow="MY PROFILE"
        title="Employee Profile"
        description="View your official employment records and manage your contact information."
      />

      <div className="profile-grid">
        {/* Left Column: Personal Information & Editable Profile */}
        <section className="section-card profile-card">
          <div className="profile-hero">
            {profile?.profilePicture || form.profilePicture ? (
              <img
                src={form.profilePicture || profile?.profilePicture}
                alt={employeeName}
                className="avatar-img large"
                onError={(e) => {
                  e.target.style.display = 'none'
                }}
              />
            ) : (
              <div className="avatar large">{initials}</div>
            )}
            <div className="profile-hero-info">
              <h2>{employeeName}</h2>
              <p className="designation-tag">{profile?.designation || 'Staff Member'}</p>
              <span className="dept-tag">{profile?.department || 'Operations'}</span>
            </div>
          </div>

          <div className="profile-section-divider" />

          <div className="eyebrow profile-label">EDITABLE PERSONAL DETAILS</div>
          <p className="muted small-note">
            You may update your personal phone, physical address, and profile picture avatar.
          </p>

          <form onSubmit={handleUpdate} className="form-stack">
            <label>
              Phone Number
              <div className="input-wrap">
                <Phone size={17} />
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
            </label>

            <label>
              Residential Address
              <div className="input-wrap textarea-wrap">
                <MapPin size={17} className="textarea-icon" />
                <textarea
                  rows="3"
                  placeholder="Enter full residential address"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                />
              </div>
            </label>

            <label>
              Profile Picture URL
              <div className="input-wrap">
                <Image size={17} />
                <input
                  type="url"
                  placeholder="https://example.com/avatar.jpg"
                  value={form.profilePicture}
                  onChange={(e) => setForm({ ...form, profilePicture: e.target.value })}
                />
              </div>
            </label>

            {error && <div className="form-error">{error}</div>}
            {successMessage && <div className="form-success">{successMessage}</div>}

            <button type="submit" className="primary-button" disabled={saving}>
              <Save size={16} />
              <span>{saving ? 'Updating profile...' : 'Save Profile Changes'}</span>
            </button>
          </form>
        </section>

        {/* Right Column: Read-Only Job Details, Salary Info, and Documents */}
        <div className="profile-right-column">
          {/* Job Details Section */}
          <section className="section-card">
            <div className="eyebrow">JOB DETAILS</div>
            <h2 className="card-title">Employment Records (Read-Only)</h2>
            <div className="detail-list">
              {readOnlyJobFields.map(({ label, value, icon: Icon }) => (
                <div key={label} className="detail-row">
                  <span className="detail-label">
                    <Icon size={14} className="detail-icon" />
                    {label}
                  </span>
                  <strong className="detail-value">{value}</strong>
                </div>
              ))}
            </div>
          </section>

          {/* Salary Structure Section */}
          <section className="section-card mt-4">
            <div className="eyebrow">COMPENSATION OVERVIEW</div>
            <h2 className="card-title">Applicable Salary Structure</h2>
            <div className="salary-readonly">
              <span className="salary-label">Base Structure Tier</span>
              <strong className="salary-value">
                {profile?.salary?.structure || profile?.salary?.tier || 'Standard Grade Salary'}
              </strong>
              <small className="muted">
                Detailed breakdowns, allowances, and deductions are accessible under the Payroll tab.
              </small>
            </div>
          </section>

          {/* Employee Documents Section */}
          <section className="section-card mt-4">
            <div className="eyebrow">OFFICIAL DOCUMENTS</div>
            <h2 className="card-title">Employee Files</h2>
            {documents.length > 0 ? (
              <ul className="doc-list">
                {documents.map((doc, idx) => (
                  <li key={idx} className="doc-item">
                    <FileText size={16} />
                    <span>{doc.name || `Document #${idx + 1}`}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="muted empty-state-note">No documents available.</p>
            )}
          </section>
        </div>
      </div>
    </>
  )
}
