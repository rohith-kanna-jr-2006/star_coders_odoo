import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, ShieldCheck, UserCheck } from 'lucide-react'
import { signup } from '../../services/authService'
import { getApiError } from '../../services/api'

export default function Signup() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    employeeId: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Employee',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')

    // Validate required fields
    if (!form.employeeId.trim()) {
      return setError('Employee ID is required.')
    }
    if (!form.email.trim()) {
      return setError('Email address is required.')
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      return setError('Please enter a valid email address.')
    }
    if (!form.password) {
      return setError('Password is required.')
    }
    if (form.password.length < 8) {
      return setError('Password must be at least 8 characters long.')
    }
    if (form.password !== form.confirmPassword) {
      return setError('Passwords do not match. Please verify.')
    }
    if (!form.role) {
      return setError('Please select a valid role.')
    }

    setLoading(true)
    try {
      await signup({
        employeeId: form.employeeId.trim(),
        email: form.email.trim(),
        password: form.password,
        role: form.role,
      })

      setSuccess('Account created successfully! Redirecting to sign in...')
      setTimeout(() => {
        navigate('/login')
      }, 1200)
    } catch (err) {
      setError(getApiError(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-layout">
      {/* Hero Aside */}
      <div className="auth-aside">
        <div className="brand auth-brand">
          <span className="brand-mark">D</span>
          <div className="brand-text">
            <span className="brand-title">Dayflow</span>
            <span className="brand-subtitle">HRMS PORTAL</span>
          </div>
        </div>

        <div className="auth-quote">
          <div className="eyebrow">A BETTER WORKDAY</div>
          <h1>Join your team's single source of truth.</h1>
          <p>
            Experience seamless daily operations with modern attendance management, time-off
            planning, and payroll visibility.
          </p>
        </div>

        <div className="auth-aside-footer">
          <ShieldCheck size={16} />
          <span>Enterprise Employee Portal · Secure Registration</span>
        </div>
      </div>

      {/* Signup Form */}
      <main className="auth-panel">
        <div className="auth-form-wrap signup-wrap">
          <div className="mobile-auth-brand brand">
            <span className="brand-mark">D</span>
            <div className="brand-text">
              <span className="brand-title">Dayflow</span>
            </div>
          </div>

          <div className="eyebrow">GET STARTED</div>
          <h2>Create Employee Account</h2>
          <p className="muted">Use your designated organization Employee ID and work email.</p>

          <form onSubmit={handleSubmit} className="form-stack two-col">
            <label>
              Employee ID
              <input
                type="text"
                placeholder="e.g. EMP-1001"
                value={form.employeeId}
                onChange={(e) => updateField('employeeId', e.target.value)}
                required
              />
            </label>

            <label>
              Work Email Address
              <input
                type="email"
                placeholder="you@company.com"
                value={form.email}
                onChange={(e) => updateField('email', e.target.value)}
                required
              />
            </label>

            <label>
              Password (8+ chars)
              <input
                type="password"
                placeholder="At least 8 characters"
                value={form.password}
                onChange={(e) => updateField('password', e.target.value)}
                required
              />
            </label>

            <label>
              Confirm Password
              <input
                type="password"
                placeholder="Re-enter password"
                value={form.confirmPassword}
                onChange={(e) => updateField('confirmPassword', e.target.value)}
                required
              />
            </label>

            <label className="span-two">
              Assigned Role
              <select value={form.role} onChange={(e) => updateField('role', e.target.value)}>
                <option value="Employee">Employee</option>
                <option value="Intern">Intern</option>
                <option value="Contractor">Contractor</option>
              </select>
            </label>

            {error && <div className="form-error span-two">{error}</div>}
            {success && <div className="form-success span-two">{success}</div>}

            <button type="submit" className="primary-button full span-two" disabled={loading}>
              {loading ? (
                'Creating account...'
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight size={17} />
                </>
              )}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </main>
    </div>
  )
}
