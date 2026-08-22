import express from 'express'
import {
  applyLeave,
  getEmployeeLeaves,
  getHrLeaves,
  approveLeave,
  rejectLeave,
} from '../controllers/leaveController.js'
import { protect } from '../middleware/authMiddleware.js'
import { requireRole } from '../middleware/roleMiddleware.js'

const router = express.Router()

// All leave endpoints require authentication
router.use(protect)

// Employee routes
router.route('/')
  .get(getEmployeeLeaves)
  .post(applyLeave)

// HR & Admin routes
router.get('/hr/all', requireRole('hr', 'admin'), getHrLeaves)
router.put('/:id/approve', requireRole('hr', 'admin'), approveLeave)
router.put('/:id/reject', requireRole('hr', 'admin'), rejectLeave)

export default router
