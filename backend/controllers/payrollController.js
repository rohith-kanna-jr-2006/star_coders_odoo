import Payroll from '../models/Payroll.js'
import User from '../models/User.js'

/**
 * @desc    Get authenticated employee's payroll details (Read-Only)
 * @route   GET /api/payroll
 * @access  Private (Employee)
 */
export const getEmployeePayroll = async (req, res, next) => {
  try {
    // Find latest payroll record for the authenticated employee
    const payroll = await Payroll.findOne({ user: req.user._id }).sort({ year: -1, createdAt: -1 })

    if (!payroll) {
      // If no specific historical payroll generated, return standard template
      return res.status(200).json({
        success: true,
        message: 'Payroll details retrieved.',
        data: {
          payroll: {
            employeeId: req.user.employeeId,
            employeeName: req.user.name,
            basicSalary: 50000,
            allowances: 15000,
            deductions: 5000,
            netSalary: 60000,
            month: 'Current',
            year: new Date().getFullYear(),
          },
        },
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Payroll details retrieved successfully.',
      data: {
        payroll,
      },
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @desc    Get all employee payroll records (HR / Admin)
 * @route   GET /api/hr/payroll
 * @access  Private (HR, Admin)
 */
export const getHrPayroll = async (req, res, next) => {
  try {
    const payrolls = await Payroll.find()
      .populate('user', 'name email department designation employeeId')
      .sort({ year: -1, createdAt: -1 })

    return res.status(200).json({
      success: true,
      message: 'Company payroll records retrieved.',
      data: payrolls,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @desc    Create or update employee payroll record (HR / Admin)
 * @route   POST /api/hr/payroll or PUT /api/hr/payroll/:id
 * @access  Private (HR, Admin)
 */
export const createOrUpdatePayroll = async (req, res, next) => {
  try {
    const { employeeId, basicSalary, allowances, deductions, month, year } = req.body

    if (!employeeId || basicSalary === undefined || !month || !year) {
      return res.status(400).json({
        success: false,
        message: 'Please provide employeeId, basicSalary, month, and year.',
      })
    }

    const parsedBasic = Number(basicSalary)
    const parsedAllowances = Number(allowances || 0)
    const parsedDeductions = Number(deductions || 0)

    if (parsedBasic < 0 || parsedAllowances < 0 || parsedDeductions < 0) {
      return res.status(400).json({
        success: false,
        message: 'Salary amounts cannot be negative.',
      })
    }

    // Verify employee exists
    const employee = await User.findOne({ employeeId: employeeId.toUpperCase().trim() })
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: `Employee with ID '${employeeId}' was not found.`,
      })
    }

    // Server calculates net salary
    const netSalary = parsedBasic + parsedAllowances - parsedDeductions

    const payroll = await Payroll.findOneAndUpdate(
      {
        user: employee._id,
        month: String(month).trim(),
        year: Number(year),
      },
      {
        user: employee._id,
        employeeId: employee.employeeId,
        employeeName: employee.name,
        basicSalary: parsedBasic,
        allowances: parsedAllowances,
        deductions: parsedDeductions,
        netSalary,
        month: String(month).trim(),
        year: Number(year),
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    )

    return res.status(200).json({
      success: true,
      message: 'Payroll record saved successfully.',
      data: payroll,
    })
  } catch (error) {
    next(error)
  }
}
