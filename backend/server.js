import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectDB from './config/db.js'
import { errorHandler } from './utils/errorHandler.js'

// Import Route Handlers
import authRoutes from './routes/authRoutes.js'
import profileRoutes from './routes/profileRoutes.js'
import attendanceRoutes from './routes/attendanceRoutes.js'
import leaveRoutes from './routes/leaveRoutes.js'
import payrollRoutes from './routes/payrollRoutes.js'

// Import HR Controllers & Middleware for top-level /api/hr mount
import { getHrLeaves, approveLeave, rejectLeave } from './controllers/leaveController.js'
import { getHrPayroll, createOrUpdatePayroll } from './controllers/payrollController.js'
import { protect } from './middleware/authMiddleware.js'
import { requireRole } from './middleware/roleMiddleware.js'

// 1. Load Environment Configuration
dotenv.config()

// 2. Initialize Express Application
const app = express()

// 3. Connect to MongoDB
connectDB()

// 4. Global Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// 5. API Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Dayflow HRMS Backend API is operational.',
    timestamp: new Date().toISOString(),
  })
})

// 6. Mount Core Modules
// Member 3 (Identity & Access)
app.use('/api/auth', authRoutes)
app.use('/api/profile', profileRoutes)

// Member 4 (Employee Operations)
app.use('/api/attendance', attendanceRoutes)
app.use('/api/leaves', leaveRoutes)
app.use('/api/payroll', payrollRoutes)

// Mount Dedicated HR Operational Routes
const hrRouter = express.Router()
hrRouter.use(protect, requireRole('hr', 'admin'))
hrRouter.get('/leaves', getHrLeaves)
hrRouter.put('/leaves/:id/approve', approveLeave)
hrRouter.put('/leaves/:id/reject', rejectLeave)
hrRouter.get('/payroll', getHrPayroll)
hrRouter.post('/payroll', createOrUpdatePayroll)
hrRouter.put('/payroll/:id', createOrUpdatePayroll)
app.use('/api/hr', hrRouter)

// 7. Handle Unmatched 404 Routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint '${req.originalUrl}' does not exist on this server.`,
  })
})

// 8. Centralized Error Handling Middleware
app.use(errorHandler)

// 9. Start Server Listener
const PORT = process.env.PORT || 5000
const server = app.listen(PORT, () => {
  console.log(`[Dayflow HRMS Server] Running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`)
})

export default app
