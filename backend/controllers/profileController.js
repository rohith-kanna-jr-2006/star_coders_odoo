import User from '../models/User.js'

/**
 * @desc    Get current authenticated employee profile
 * @route   GET /api/profile
 * @access  Private (Employee, HR, Admin)
 */
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password')
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Employee profile not found.',
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Profile retrieved successfully.',
      data: user,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @desc    Update editable fields of current authenticated employee profile
 * @route   PUT /api/profile
 * @access  Private (Employee, HR, Admin)
 */
export const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Employee profile not found.',
      })
    }

    // Strictly whitelist editable fields only
    const { phone, address, profilePicture } = req.body

    if (phone !== undefined) user.phone = String(phone).trim()
    if (address !== undefined) user.address = String(address).trim()
    if (profilePicture !== undefined) user.profilePicture = String(profilePicture).trim()

    // Note: Any incoming changes to employeeId, email, role, department, designation, salary, status are explicitly ignored
    await user.save()

    const updatedUser = await User.findById(user._id).select('-password')

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      data: updatedUser,
    })
  } catch (error) {
    next(error)
  }
}
