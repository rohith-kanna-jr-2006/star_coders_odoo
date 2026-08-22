import jwt from 'jsonwebtoken'
import User from '../models/User.js'

/**
 * Protects routes by validating Bearer JWT and attaching authenticated user
 */
export const protect = async (req, res, next) => {
  let token

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No authentication token provided.',
    })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Retrieve active user from database using decoded ID
    const user = await User.findById(decoded.id).select('-password')

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'The user belonging to this token no longer exists.',
      })
    }

    if (user.status === 'inactive') {
      return res.status(403).json({
        success: false,
        message: 'Your account is deactivated. Please contact HR.',
      })
    }

    // Attach authenticated identity to request object
    req.user = user
    next()
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Session expired. Please sign in again.',
      })
    }
    return res.status(401).json({
      success: false,
      message: 'Invalid or malformed authentication token.',
    })
  }
}

export default protect
