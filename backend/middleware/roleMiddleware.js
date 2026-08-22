/**
 * Role authorization middleware factory
 * @param  {...string} roles Allowed roles (e.g. 'hr', 'admin')
 */
export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized. Authentication required before role check.',
      })
    }

    const normalizedRoles = roles.map((r) => r.toLowerCase())
    const userRole = (req.user.role || '').toLowerCase()

    if (!normalizedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden. Role '${req.user.role}' does not have permission to access this resource.`,
      })
    }

    next()
  }
}

export const authorize = requireRole
export default requireRole
