import jwt from 'jsonwebtoken'
import User from '../models/User.js'

/**
 * Helper to generate signed JWT token with user ID and role
 */
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      employeeId: user.employeeId,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '7d',
    }
  )
}

/**
 * @desc    Register a new user / employee
 * @route   POST /api/auth/signup
 * @access  Public
 */
export const signup = async (req, res, next) => {
  try {
    const { employeeId, name, email, password, role, department, designation, phone, address } = req.body

    // 1. Required field validations
    if (!employeeId || !name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide employeeId, name, email, and password.',
      })
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      })
    }

    // 2. Check for duplicate email
    const emailExists = await User.findOne({ email: email.toLowerCase().trim() })
    if (emailExists) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists.',
      })
    }

    // 3. Check for duplicate employeeId
    const employeeIdExists = await User.findOne({ employeeId: employeeId.toUpperCase().trim() })
    if (employeeIdExists) {
      return res.status(409).json({
        success: false,
        message: `Employee ID '${employeeId.toUpperCase()}' is already registered.`,
      })
    }

    // 4. Validate role if provided
    const validRoles = ['employee', 'hr', 'admin']
    const assignedRole = role ? role.toLowerCase().trim() : 'employee'
    if (!validRoles.includes(assignedRole)) {
      return res.status(400).json({
        success: false,
        message: `Invalid role specified. Supported roles: ${validRoles.join(', ')}`,
      })
    }

    // 5. Create user record (Password hashing handled automatically by User pre-save hook)
    const user = await User.create({
      employeeId: employeeId.toUpperCase().trim(),
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: assignedRole,
      department: department || 'General',
      designation: designation || 'Employee',
      phone: phone || '',
      address: address || '',
    })

    // 6. Generate authentication token
    const token = generateToken(user)

    return res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      data: {
        token,
        user: {
          id: user._id,
          employeeId: user.employeeId,
          name: user.name,
          email: user.email,
          role: user.role,
          department: user.department,
          designation: user.designation,
          status: user.status,
        },
      },
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @desc    Authenticate user and return JWT
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    // 1. Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      })
    }

    // 2. Find user including password field for verification
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password')
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      })
    }

    // 3. Verify password hash using bcrypt
    const isMatch = await user.matchPassword(password)
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      })
    }

    // 4. Verify account status
    if (user.status === 'inactive') {
      return res.status(403).json({
        success: false,
        message: 'Your account is deactivated. Please contact HR.',
      })
    }

    // 5. Generate token
    const token = generateToken(user)

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      data: {
        token,
        user: {
          id: user._id,
          employeeId: user.employeeId,
          name: user.name,
          email: user.email,
          role: user.role,
          department: user.department,
          designation: user.designation,
          phone: user.phone,
          address: user.address,
          profilePicture: user.profilePicture,
          status: user.status,
        },
      },
    })
  } catch (error) {
    next(error)
  }
}
