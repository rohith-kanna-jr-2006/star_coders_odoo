import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('dayflow_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const getApiError = (error) => {
  if (!error.response) return 'Unable to connect to the server.'
  return error.response.data?.message || error.response.data?.error || 'Something went wrong. Please try again.'
}

export default api
