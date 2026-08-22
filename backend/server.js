import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import profileRoutes from './routes/profileRoutes.js'
import attendanceRoutes from './routes/attendanceRoutes.js'
import leaveRoutes from './routes/leaveRoutes.js'
import payrollRoutes from './routes/payrollRoutes.js'
import { protect } from './middleware/authMiddleware.js'
import { requireRole } from './middleware/roleMiddleware.js'
import { getHrLeaves, approveLeave, rejectLeave } from './controllers/leaveController.js'
import { getHrPayroll, createOrUpdatePayroll } from './controllers/payrollController.js'
import { errorMiddleware } from './middleware/errorMiddleware.js'

dotenv.config()

const app = express()

connectDB()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/api', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Dayflow HRMS API is running',
  })
})

app.use('/api/auth', authRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/attendance', attendanceRoutes)
app.use('/api/leaves', leaveRoutes)
app.use('/api/payroll', payrollRoutes)

const hrRouter = express.Router()
hrRouter.use(protect, requireRole('hr', 'admin'))
hrRouter.get('/leaves', getHrLeaves)
hrRouter.put('/leaves/:id/approve', approveLeave)
hrRouter.put('/leaves/:id/reject', rejectLeave)
hrRouter.get('/payroll', getHrPayroll)
hrRouter.post('/payroll', createOrUpdatePayroll)
hrRouter.put('/payroll/:id', createOrUpdatePayroll)
app.use('/api/hr', hrRouter)

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint '${req.originalUrl}' not found`,
  })
})

app.use(errorMiddleware)

const PORT = Number(process.env.PORT) || 5000
app.listen(PORT, () => {
  console.log(`[Dayflow HRMS] Server running on port ${PORT}`)
})

export default app
