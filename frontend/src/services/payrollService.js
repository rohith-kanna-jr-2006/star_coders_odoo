import api from './api'
export const getPayroll = async () => (await api.get('/payroll')).data
