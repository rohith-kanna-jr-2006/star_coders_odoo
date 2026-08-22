export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: authentication required',
      })
    }

    const allowedRoles = roles.map((role) => role.toLowerCase())
    const userRole = (req.user.role || '').toLowerCase()

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      })
    }

    return next()
  }
}

export const authorize = requireRole
export default requireRole
