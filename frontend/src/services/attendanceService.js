import api from './api'
export const getAttendance = async (params) => (await api.get('/attendance', { params })).data
export const checkIn = async () => (await api.post('/attendance/check-in')).data
export const checkOut = async () => (await api.post('/attendance/check-out')).data
