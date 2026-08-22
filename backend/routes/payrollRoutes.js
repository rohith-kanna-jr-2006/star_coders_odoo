import express from 'express'
import {
  getEmployeePayroll,
  getHrPayroll,
  createOrUpdatePayroll,
} from '../controllers/payrollController.js'
import { protect } from '../middleware/authMiddleware.js'
import { requireRole } from '../middleware/roleMiddleware.js'

const router = express.Router()

// All payroll routes require authentication
router.use(protect)

// Employee route (Read-Only)
router.get('/', getEmployeePayroll)

// HR / Admin routes
router.get('/hr/all', requireRole('hr', 'admin'), getHrPayroll)
router.post('/hr', requireRole('hr', 'admin'), createOrUpdatePayroll)
router.put('/hr/:id', requireRole('hr', 'admin'), createOrUpdatePayroll)

export default router
