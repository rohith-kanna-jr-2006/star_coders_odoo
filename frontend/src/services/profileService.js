import api from './api'
export const getProfile = async () => (await api.get('/profile')).data
export const updateProfile = async (details) => (await api.put('/profile', details)).data
