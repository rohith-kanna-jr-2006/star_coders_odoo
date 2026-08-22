import api, { ENDPOINTS } from './api'

/**
 * Fetches all leave requests and history for the authenticated employee
 * @returns List of leave requests
 */
export const getLeaves = async () => {
  const response = await api.get(ENDPOINTS.LEAVES.GET)
  return response.data
}

/**
 * Submits a new leave request
 * @param {{ leaveType: string, startDate: string, endDate: string, remarks?: string }} details
 * @returns Submitted leave details
 */
export const applyLeave = async (details) => {
  const response = await api.post(ENDPOINTS.LEAVES.APPLY, details)
  return response.data
}
