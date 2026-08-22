import api, { ENDPOINTS } from './api'

/**
 * Authenticates user credentials with backend
 * @param {{ email: string, password: string }} credentials
 * @returns {Promise<Object>} Backend response containing user and token
 */
export const login = async (credentials) => {
  const response = await api.post(ENDPOINTS.AUTH.LOGIN, credentials)
  return response.data
}

/**
 * Registers a new employee account
 * @param {{ employeeId: string, email: string, password: string, role: string }} details
 * @returns {Promise<Object>} Backend confirmation
 */
export const signup = async (details) => {
  const response = await api.post(ENDPOINTS.AUTH.SIGNUP, details)
  return response.data
}
