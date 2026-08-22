import api, { ENDPOINTS } from './api'

/**
 * Fetches the authenticated employee profile
 * @returns Employee profile data
 */
export const getProfile = async () => {
  const response = await api.get(ENDPOINTS.PROFILE.GET)
  return response.data
}

/**
 * Updates editable employee profile fields (phone, address, profilePicture)
 * @param {{ phone?: string, address?: string, profilePicture?: string }} details
 * @returns Updated profile data
 */
export const updateProfile = async (details) => {
  const response = await api.put(ENDPOINTS.PROFILE.UPDATE, details)
  return response.data
}
