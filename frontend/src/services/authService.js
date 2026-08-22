import api from './api'

export const login = async (credentials) => (await api.post('/auth/login', credentials)).data
export const signup = async (details) => (await api.post('/auth/signup', details)).data
