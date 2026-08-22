import Payroll from '../models/Payroll.js'
import User from '../models/User.js'

export const getEmployeePayroll = async (req, res, next) => {
  try {
    const payrolls = await Payroll.find({ user: req.user.id }).sort({ year: -1, month: -1 })

    return res.status(200).json({
      success: true,
      message: 'Payroll retrieved successfully',
      data: payrolls,
    })
  } catch (error) {
    next(error)
  }
}

export const getHrPayroll = async (req, res, next) => {
  try {
    const payrolls = await Payroll.find().populate('user', 'name email employeeId department').sort({ year: -1, month: -1 })

    return res.status(200).json({
      success: true,
      message: 'Payroll records retrieved successfully',
      data: payrolls,
    })
  } catch (error) {
    next(error)
  }
}

export const createOrUpdatePayroll = async (req, res, next) => {
  try {
    const { employeeId, basicSalary, allowances = 0, deductions = 0, month, year } = req.body

    if (req.params.id) {
      const payroll = await Payroll.findById(req.params.id)
      if (!payroll) {
        return res.status(404).json({
          success: false,
          message: 'Payroll record not found',
        })
      }

      const parsedBasic = Number(basicSalary ?? payroll.basicSalary)
      const parsedAllowances = Number(allowances ?? payroll.allowances)
      const parsedDeductions = Number(deductions ?? payroll.deductions)
      const parsedMonth = Number(month ?? payroll.month)
      const parsedYear = Number(year ?? payroll.year)

      if (parsedBasic < 0 || parsedAllowances < 0 || parsedDeductions < 0) {
        return res.status(400).json({
          success: false,
          message: 'Salary values cannot be negative',
        })
      }

      if (parsedMonth < 1 || parsedMonth > 12) {
        return res.status(400).json({
          success: false,
          message: 'Month must be between 1 and 12',
        })
      }

      if (!parsedYear || parsedYear < 2000) {
        return res.status(400).json({
          success: false,
          message: 'Year is invalid',
        })
      }

      payroll.basicSalary = parsedBasic
      payroll.allowances = parsedAllowances
      payroll.deductions = parsedDeductions
      payroll.month = parsedMonth
      payroll.year = parsedYear
      payroll.netSalary = parsedBasic + parsedAllowances - parsedDeductions

      await payroll.save()

      return res.status(200).json({
        success: true,
        message: 'Payroll updated successfully',
        data: payroll,
      })
    }

    if (!employeeId || basicSalary === undefined || month === undefined || year === undefined) {
      return res.status(400).json({
        success: false,
        message: 'employeeId, basicSalary, month and year are required',
      })
    }

    const parsedBasic = Number(basicSalary)
    const parsedAllowances = Number(allowances)
    const parsedDeductions = Number(deductions)
    const parsedMonth = Number(month)
    const parsedYear = Number(year)

    if (parsedBasic < 0 || parsedAllowances < 0 || parsedDeductions < 0) {
      return res.status(400).json({
        success: false,
        message: 'Salary values cannot be negative',
      })
    }

    if (parsedMonth < 1 || parsedMonth > 12) {
      return res.status(400).json({
        success: false,
        message: 'Month must be between 1 and 12',
      })
    }

    if (!parsedYear || parsedYear < 2000) {
      return res.status(400).json({
        success: false,
        message: 'Year is invalid',
      })
    }

    const employee = await User.findOne({ employeeId: employeeId.toUpperCase().trim() })
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found',
      })
    }

    const netSalary = parsedBasic + parsedAllowances - parsedDeductions

    const payroll = await Payroll.findOneAndUpdate(
      { user: employee._id, month: parsedMonth, year: parsedYear },
      {
        user: employee._id,
        employeeId: employee.employeeId,
        employeeName: employee.name,
        basicSalary: parsedBasic,
        allowances: parsedAllowances,
        deductions: parsedDeductions,
        netSalary,
        month: parsedMonth,
        year: parsedYear,
      },
      { new: true, upsert: true, runValidators: true }
    )

    return res.status(200).json({
      success: true,
      message: 'Payroll saved successfully',
      data: payroll,
    })
  } catch (error) {
    next(error)
  }
}
