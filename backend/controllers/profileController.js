import User from '../models/User.js'

/**
 * @desc    Get profile for currently authenticated user
 * @route   GET /api/profile
 * @access  Private (Employee, HR, Admin)
 */
export const getProfile = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id
    const user = await User.findById(userId).select('-password')

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Employee profile not found.',
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Profile retrieved successfully',
      data: user,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @desc    Update editable fields of current employee profile
 * @route   PUT /api/profile
 * @access  Private (Employee, HR, Admin)
 */
export const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id
    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Employee profile not found.',
      })
    }

    // Whitelist editable profile fields for ordinary employees
    const { phone, address, profilePicture, profilePictureUrl, department } = req.body

    let updated = false

    if (phone !== undefined) {
      user.phone = String(phone).trim()
      updated = true
    }
    if (address !== undefined) {
      user.address = String(address).trim()
      updated = true
    }
    if (department !== undefined) {
      user.department = String(department).trim() || 'General'
      updated = true
    }

    const newPicture = profilePictureUrl !== undefined ? profilePictureUrl : profilePicture
    if (newPicture !== undefined) {
      user.profilePicture = String(newPicture).trim()
      updated = true
    }

    if (updated) {
      await user.save()
    }

    const updatedUser = await User.findById(user._id).select('-password')

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser,
    })
  } catch (error) {
    next(error)
  }
}
