import api, { ENDPOINTS } from './api'

/**
 * Fetches salary and payroll breakdown for the authenticated employee
 * @returns Payroll information
 */
export const getPayroll = async () => {
  const response = await api.get(ENDPOINTS.PAYROLL.GET)
  return response.data
}
