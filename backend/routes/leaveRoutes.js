import express from 'express'
import { applyLeave, getEmployeeLeaves } from '../controllers/leaveController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.use(protect)

router.route('/')
  .get(getEmployeeLeaves)
  .post(applyLeave)

export default router
