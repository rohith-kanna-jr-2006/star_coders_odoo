/**
 * Role-Based Authorization Middleware
 * Usage: requireRole('hr', 'admin') or authorizeRoles('hr', 'admin')
 * 
 * @param  {...string} roles Allowed roles for accessing the route
 */
export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: authentication required before authorization',
      })
    }

    const allowedRoles = roles.map((role) => role.toLowerCase().trim())
    const userRole = (req.user.role || '').toLowerCase().trim()

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: role '${req.user.role}' is not authorized to access this resource`,
      })
    }

    return next()
  }
}

export const authorize = requireRole
export const authorizeRoles = requireRole
export default requireRole
