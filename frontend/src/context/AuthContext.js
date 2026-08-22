import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { login as loginRequest } from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Initialize auth state from local storage on initial mount
  useEffect(() => {
    try {
      const savedToken = localStorage.getItem('dayflow_token')
      const savedUser = localStorage.getItem('dayflow_user')
      if (savedToken && savedUser) {
        setUser(JSON.parse(savedUser))
      }
    } catch (err) {
      console.error('Failed to parse saved user state', err)
      localStorage.removeItem('dayflow_token')
      localStorage.removeItem('dayflow_user')
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Flexible login handler that adapts to various backend response structures
   * @param {{ email: string, password: string }} credentials
   */
  const login = async (credentials) => {
    const result = await loginRequest(credentials)

    // Adaptively extract token from backend response
    const token =
      result.token ||
      result.accessToken ||
      result.data?.token ||
      result.data?.accessToken ||
      result.session?.token

    // Adaptively extract user object from backend response
    const nextUser =
      result.user ||
      result.data?.user ||
      result.employee ||
      result.data?.employee ||
      (result.data && typeof result.data === 'object' && !result.data.token ? result.data : null) ||
      result

    if (!token || !nextUser) {
      throw new Error('The server returned an unexpected login response structure.')
    }

    localStorage.setItem('dayflow_token', token)
    localStorage.setItem('dayflow_user', JSON.stringify(nextUser))
    setUser(nextUser)
    return nextUser
  }

  /**
   * Logs out user and clears local session
   */
  const logout = () => {
    localStorage.removeItem('dayflow_token')
    localStorage.removeItem('dayflow_user')
    setUser(null)
  }

  /**
   * Updates current user object in state and localStorage
   * @param {Object} updatedUser
   */
  const updateUser = (updatedUser) => {
    const merged = { ...user, ...updatedUser }
    localStorage.setItem('dayflow_user', JSON.stringify(merged))
    setUser(merged)
  }

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user && localStorage.getItem('dayflow_token')),
      login,
      logout,
      updateUser,
    }),
    [user, loading]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
