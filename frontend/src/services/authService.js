import api from './api'

export const login = async (credentials) => (await api.post('/auth/login', credentials)).data
export const signup = async (details) => (await api.post('/auth/signup', details)).data
export const logout = () => {
	localStorage.removeItem('dayflow_token')
	localStorage.removeItem('dayflow_user')
}
export const getToken = () => localStorage.getItem('dayflow_token')
export const isLoggedIn = () => Boolean(getToken())
export const getCurrentUser = () => {
	const saved = localStorage.getItem('dayflow_user')
	return saved ? JSON.parse(saved) : null
}
