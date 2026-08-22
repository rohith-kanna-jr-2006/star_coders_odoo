export const errorMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || 500
  const message = err.message || 'Internal server error'

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: Object.values(err.errors).map((item) => item.message).join(', '),
    })
  }

  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      message: 'Duplicate record detected',
    })
  }

  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid resource identifier',
    })
  }

  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: invalid or expired token',
    })
  }

  if (statusCode === 404) {
    return res.status(404).json({
      success: false,
      message: 'Resource not found',
    })
  }

  if (statusCode === 403) {
    return res.status(403).json({
      success: false,
      message: 'Access denied',
    })
  }

  return res.status(statusCode).json({
    success: false,
    message,
  })
}

export default errorMiddleware
