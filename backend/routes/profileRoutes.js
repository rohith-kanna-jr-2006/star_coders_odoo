import express from 'express'
import { getProfile, updateProfile } from '../controllers/profileController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

// All profile routes require authentication
router.use(protect)

router.route('/')
  .get(getProfile)
  .put(updateProfile)

export default router
