import axios from 'axios'

// Configurable API Endpoints - Easily adjust paths to match final backend routes
export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
  },
  PROFILE: {
    GET: '/profile',
    UPDATE: '/profile',
  },
  ATTENDANCE: {
    GET: '/attendance',
    CHECK_IN: '/attendance/check-in',
    CHECK_OUT: '/attendance/check-out',
  },
  LEAVES: {
    GET: '/leaves',
    APPLY: '/leaves',
  },
  PAYROLL: {
    GET: '/payroll',
  },
}

// Create centralized Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

// Request Interceptor: Attach Bearer token to protected API calls
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('dayflow_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response Interceptor: Handle common response codes (e.g. 401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If token expired or invalid, optionally clear stored session
      // localStorage.removeItem('dayflow_token')
      // localStorage.removeItem('dayflow_user')
    }
    return Promise.reject(error)
  }
)

/**
 * Standardizes API error messages across all pages and services
 * @param {Error} error Axios error object
 * @returns {string} User-friendly error message
 */
export const getApiError = (error) => {
  if (!error.response) {
    return 'Unable to connect to the server. Please check your network.'
  }
  const data = error.response.data
  return data?.message || data?.error || 'Something went wrong. Please try again.'
}

export default api
