import generateToken from '../utils/generateToken.js'
import User from '../models/User.js'

/**
 * @desc    Register a new user / employee
 * @route   POST /api/auth/signup
 * @access  Public
 */
export const signup = async (req, res, next) => {
  try {
    const { employeeId, name, email, password, role, department, designation, phone, address, profilePicture, profilePictureUrl } = req.body

    // 1. Required field validations
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password.',
      })
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      })
    }

    const normalizedEmail = String(email).toLowerCase().trim()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address.',
      })
    }

    // 2. Check for duplicate email
    const emailExists = await User.findOne({ email: normalizedEmail })
    if (emailExists) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists.',
      })
    }

    // 3. Determine employeeId (use provided or auto-generate)
    let finalEmployeeId = employeeId ? String(employeeId).toUpperCase().trim() : `EMP${Math.floor(100000 + Math.random() * 900000)}`
    
    if (employeeId) {
      const employeeIdExists = await User.findOne({ employeeId: finalEmployeeId })
      if (employeeIdExists) {
        return res.status(409).json({
          success: false,
          message: `Employee ID '${finalEmployeeId}' is already registered.`,
        })
      }
    }

    // 4. Validate role if provided
    const validRoles = ['employee', 'hr', 'admin']
    const assignedRole = role ? String(role).toLowerCase().trim() : 'employee'
    if (!validRoles.includes(assignedRole)) {
      return res.status(400).json({
        success: false,
        message: `Invalid role specified. Supported roles: ${validRoles.join(', ')}`,
      })
    }

    if (assignedRole === 'employee' && !designation) {
      return res.status(400).json({
        success: false,
        message: 'Employee Type (designation) is required for Employees.',
      })
    }

    if (assignedRole === 'hr' && !department) {
      return res.status(400).json({
        success: false,
        message: 'Department is required for HR.',
      })
    }

    const picture = profilePictureUrl || profilePicture || ''

    // 5. Create user record (Password hashing handled automatically by User pre-save hook)
    const user = await User.create({
      employeeId: finalEmployeeId,
      name: String(name).trim(),
      email: normalizedEmail,
      password,
      role: assignedRole,
      department: department ? String(department).trim() : 'General',
      designation: designation ? String(designation).trim() : 'Employee',
      phone: phone ? String(phone).trim() : '',
      address: address ? String(address).trim() : '',
      profilePicture: picture,
    })

    // 6. Generate authentication token
    const token = generateToken(user)
    const safeUser = user.toJSON()

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        token,
        user: safeUser,
      },
    })
  } catch (error) {
    next(error)
  }
}

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      })
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password')

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      })
    }

    const isMatch = await user.matchPassword(password)
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      })
    }

    if (user.status === 'inactive') {
      return res.status(403).json({
        success: false,
        message: 'Account inactive',
      })
    }

    const token = generateToken(user)
    const safeUser = user.toJSON()

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: safeUser,
      },
    })
  } catch (error) {
    next(error)
  }
}
