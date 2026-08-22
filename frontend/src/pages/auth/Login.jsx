import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { ArrowRight, LockKeyhole, Mail } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { getApiError } from '../../services/api'

export default function Login() {
  const { isAuthenticated, login } = useAuth()
  const navigate = useNavigate(); const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' }); const [error, setError] = useState(''); const [loading, setLoading] = useState(false)
  if (isAuthenticated) return <Navigate to="/employee/dashboard" replace />
  const submit = async (event) => { event.preventDefault(); setError(''); if (!form.email || !form.password) return setError('Enter your email and password.') ; setLoading(true); try { await login(form); navigate(location.state?.from?.pathname || '/employee/dashboard', { replace: true }) } catch (err) { setError(err.message || getApiError(err)) } finally { setLoading(false) } }
  return <div className="auth-layout"><div className="auth-aside"><div className="brand auth-brand"><span className="brand-mark">D</span><span>dayflow</span></div><div className="auth-quote"><div className="eyebrow">YOUR WORK, IN FLOW</div><h1>A calmer way to manage your workday.</h1><p>One focused space for your attendance, time off, profile and pay.</p></div><div className="auth-aside-footer">Employee workspace · Secure access</div></div><main className="auth-panel"><div className="auth-form-wrap"><div className="mobile-auth-brand brand"><span className="brand-mark">D</span><span>dayflow</span></div><div className="eyebrow">WELCOME BACK</div><h2>Sign in to Dayflow</h2><p className="muted">Use your work credentials to continue.</p><form onSubmit={submit} className="form-stack"><label>Email address<div className="input-wrap"><Mail size={18}/><input type="email" autoComplete="email" placeholder="you@company.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}/></div></label><label>Password<div className="input-wrap"><LockKeyhole size={18}/><input type="password" autoComplete="current-password" placeholder="Enter your password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}/></div></label>{error && <div className="form-error">{error}</div>}<button className="primary-button full" disabled={loading}>{loading ? 'Signing in...' : <>Sign in <ArrowRight size={17}/></>}</button></form><p className="auth-switch">New to Dayflow? <Link to="/signup">Create an account</Link></p></div></main></div>
}
