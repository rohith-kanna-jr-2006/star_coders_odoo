import express from 'express'
import { getEmployeePayroll } from '../controllers/payrollController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.use(protect)

router.get('/', getEmployeePayroll)

export default router
