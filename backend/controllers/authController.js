import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id.toString(),
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )
}

export const signup = async (req, res, next) => {
  try {
    const { employeeId, name, email, password, role } = req.body

    if (!employeeId || !name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'employeeId, name, email and password are required',
      })
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailPattern.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address',
      })
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
      })
    }

    const cleanedEmail = email.toLowerCase().trim()
    const cleanedEmployeeId = employeeId.toUpperCase().trim()
    const normalizedRole = role ? role.toLowerCase().trim() : 'employee'
    const allowedPublicRoles = ['employee']

    if (!allowedPublicRoles.includes(normalizedRole)) {
      return res.status(400).json({
        success: false,
        message: 'Public signup is limited to employee accounts. Contact HR to create HR or admin accounts.',
      })
    }

    const existingEmail = await User.findOne({ email: cleanedEmail })
    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered',
      })
    }

    const existingEmployeeId = await User.findOne({ employeeId: cleanedEmployeeId })
    if (existingEmployeeId) {
      return res.status(409).json({
        success: false,
        message: 'Employee ID already registered',
      })
    }

    const user = await User.create({
      employeeId: cleanedEmployeeId,
      name: name.trim(),
      email: cleanedEmail,
      password,
      role: 'employee',
    })

    return res.status(201).json({
      success: true,
      message: 'Signup successful',
      data: {
        user: {
          employeeId: user.employeeId,
          name: user.name,
          email: user.email,
          role: user.role,
        },
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

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user._id.toString(),
          employeeId: user.employeeId,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    })
  } catch (error) {
    next(error)
  }
}
