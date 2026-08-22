import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { ArrowRight, LockKeyhole, Mail, ShieldCheck } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { getApiError } from '../../services/api'

export default function Login() {
  const { isAuthenticated, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Redirect to dashboard if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/employee/dashboard" replace />
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!form.email || !form.password) {
      return setError('Please enter both your email address and password.')
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      return setError('Please enter a valid email address.')
    }

    setLoading(true)
    try {
      await login(form)
      const redirectPath = location.state?.from?.pathname || '/employee/dashboard'
      navigate(redirectPath, { replace: true })
    } catch (err) {
      setError(getApiError(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-layout">
      {/* Brand Hero Panel */}
      <div className="auth-aside">
        <div className="brand auth-brand">
          <span className="brand-mark">D</span>
          <div className="brand-text">
            <span className="brand-title">Dayflow</span>
            <span className="brand-subtitle">HRMS PORTAL</span>
          </div>
        </div>

        <div className="auth-quote">
          <div className="eyebrow">YOUR WORK, IN FLOW</div>
          <h1>A calmer, unified way to manage your workday.</h1>
          <p>
            One focused space for your attendance tracking, leave requests, employee profile, and
            payroll details.
          </p>
        </div>

        <div className="auth-aside-footer">
          <ShieldCheck size={16} />
          <span>Enterprise Employee Portal · Secure Access</span>
        </div>
      </div>

      {/* Form Interaction Panel */}
      <main className="auth-panel">
        <div className="auth-form-wrap">
          <div className="mobile-auth-brand brand">
            <span className="brand-mark">D</span>
            <div className="brand-text">
              <span className="brand-title">Dayflow</span>
            </div>
          </div>

          <div className="eyebrow">EMPLOYEE SIGN IN</div>
          <h2>Welcome back</h2>
          <p className="muted">Enter your work credentials to access your portal.</p>

          <form onSubmit={handleSubmit} className="form-stack">
            <label>
              Work Email Address
              <div className="input-wrap">
                <Mail size={18} />
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder="employee@company.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </label>

            <label>
              Password
              <div className="input-wrap">
                <LockKeyhole size={18} />
                <input
                  type="password"
                  name="password"
                  autoComplete="current-password"
                  placeholder="Enter your account password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </label>

            {error && <div className="form-error">{error}</div>}

            <button type="submit" className="primary-button full" disabled={loading}>
              {loading ? (
                'Signing in...'
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={17} />
                </>
              )}
            </button>
          </form>

          <p className="auth-switch">
            New to Dayflow? <Link to="/signup">Create an employee account</Link>
          </p>
        </div>
      </main>
    </div>
  )
}
