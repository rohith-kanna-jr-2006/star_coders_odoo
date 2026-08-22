/**
 * Custom application error class
 */
export class AppError extends Error {
  constructor(message, statusCode) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = true
    Error.captureStackTrace(this, this.constructor)
  }
}

/**
 * Central Express error-handling middleware
 */
export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500
  let message = err.message || 'Internal Server Error'

  // Handle Mongoose Bad ObjectId (CastError)
  if (err.name === 'CastError') {
    statusCode = 400
    message = `Invalid resource identifier: ${err.value}`
  }

  // Handle Mongoose Duplicate Key Error (E11000)
  if (err.code === 11000) {
    statusCode = 409
    const field = Object.keys(err.keyValue || {})[0] || 'field'
    const value = err.keyValue ? err.keyValue[field] : ''
    message = `A record with this ${field} ('${value}') already exists.`
  }

  // Handle Mongoose Schema Validation Errors
  if (err.name === 'ValidationError') {
    statusCode = 400
    const errors = Object.values(err.errors).map((el) => el.message)
    message = errors.join('. ')
  }

  // Handle JWT Verification Errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401
    message = 'Invalid authentication token. Please sign in again.'
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401
    message = 'Authentication token expired. Please sign in again.'
  }

  return res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
}
