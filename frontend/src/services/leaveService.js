import api from './api'
export const getLeaves = async () => (await api.get('/leaves')).data
export const applyLeave = async (details) => (await api.post('/leaves', details)).data
