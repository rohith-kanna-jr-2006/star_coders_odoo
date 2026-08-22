import express from 'express'
import { getAttendance, checkIn, checkOut } from '../controllers/attendanceController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

// All attendance routes require Member 3's protect middleware
router.use(protect)

router.get('/', getAttendance)
router.post('/check-in', checkIn)
router.post('/check-out', checkOut)

export default router
