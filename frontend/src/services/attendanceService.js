import api, { ENDPOINTS } from './api'

/**
 * Fetches attendance data (today, daily, and weekly)
 * @param params Optional query parameters (e.g. date range or week offset)
 * @returns Attendance records
 */
export const getAttendance = async (params) => {
  const response = await api.get(ENDPOINTS.ATTENDANCE.GET, { params })
  return response.data
}

/**
 * Records employee check-in
 * @returns Check-in confirmation with timestamp
 */
export const checkIn = async () => {
  const response = await api.post(ENDPOINTS.ATTENDANCE.CHECK_IN)
  return response.data
}

/**
 * Records employee check-out
 * @returns Check-out confirmation with timestamp
 */
export const checkOut = async () => {
  const response = await api.post(ENDPOINTS.ATTENDANCE.CHECK_OUT)
  return response.data
}
