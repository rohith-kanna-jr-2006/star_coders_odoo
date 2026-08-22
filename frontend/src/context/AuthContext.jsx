import { createContext, useContext, useMemo, useState } from 'react'
import { login as loginRequest } from '../services/authService'

const AuthContext = createContext(null)

const savedUser = localStorage.getItem('dayflow_user')

export function AuthProvider({ children }) {
  const [user, setUser] = useState(savedUser ? JSON.parse(savedUser) : null)

  const login = async (credentials) => {
    const result = await loginRequest(credentials)
    const token = result.token || result.accessToken || result.session?.token
    const nextUser = result.user || result.data?.user || result.employee
    if (!token || !nextUser) throw new Error('The server returned an incomplete login response.')
    localStorage.setItem('dayflow_token', token)
    localStorage.setItem('dayflow_user', JSON.stringify(nextUser))
    setUser(nextUser)
  }

  const logout = () => {
    localStorage.removeItem('dayflow_token')
    localStorage.removeItem('dayflow_user')
    setUser(null)
  }

  const value = useMemo(() => ({ user, login, logout, isAuthenticated: Boolean(user && localStorage.getItem('dayflow_token')) }), [user])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
