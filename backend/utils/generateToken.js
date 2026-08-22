import jwt from 'jsonwebtoken'

/**
 * Generate a signed JWT for authenticated user
 * Payload contains non-sensitive identity fields: id/userId, employeeId, role
 * Secrets and expiration duration are populated from environment variables
 * 
 * @param {Object} user - User document from Mongoose
 * @returns {string} Signed JSON Web Token
 */
export const generateToken = (user) => {
  const payload = {
    id: user._id,
    userId: user._id,
    employeeId: user.employeeId,
    role: user.role,
  }

  const secret = process.env.JWT_SECRET || 'dayflow_default_jwt_secret_key_2026'
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d'

  return jwt.sign(payload, secret, { expiresIn })
}

export default generateToken
