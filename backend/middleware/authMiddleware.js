import jwt from 'jsonwebtoken'
import User from '../models/User.js'

/**
 * Middleware to protect routes: validates Bearer JWT, extracts identity, verifies user status
 */
export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: token missing or invalid Bearer format',
    })
  }

  const token = authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: token missing',
    })
  }

  try {
    const secret = process.env.JWT_SECRET || 'dayflow_default_jwt_secret_key_2026'
    const decoded = jwt.verify(token, secret)

    const userId = decoded.id || decoded.userId
    if (!decoded || !userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: invalid token payload',
      })
    }

    const user = await User.findById(userId).select('-password')

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: user no longer exists',
      })
    }

    if (user.status === 'inactive') {
      return res.status(403).json({
        success: false,
        message: 'Access denied: account is inactive',
      })
    }

    // Attach full authenticated user document to request object
    req.user = user

    return next()
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: token expired',
      })
    }

    return res.status(401).json({
      success: false,
      message: 'Unauthorized: invalid token',
    })
  }
}

export default protect
