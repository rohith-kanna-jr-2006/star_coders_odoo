import Leave from '../models/Leave.js'

/**
 * @desc    Apply for leave (Employee)
 * @route   POST /api/leaves
 * @access  Private (Employee)
 */
export const applyLeave = async (req, res, next) => {
  try {
    const { leaveType, startDate, endDate, reason, remarks } = req.body

    // 1. Validate required fields
    if (!leaveType || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide leaveType, startDate, and endDate.',
      })
    }

    // 2. Validate date logic
    const start = new Date(startDate)
    const end = new Date(endDate)

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format provided.',
      })
    }

    if (end < start) {
      return res.status(400).json({
        success: false,
        message: 'End date cannot be before start date.',
      })
    }

    // 3. Create leave request strictly with server-controlled defaults
    const leave = await Leave.create({
      user: req.user._id,
      employeeId: req.user.employeeId,
      employeeName: req.user.name,
      leaveType,
      startDate: String(startDate).slice(0, 10),
      endDate: String(endDate).slice(0, 10),
      reason: reason || remarks || '',
      status: 'Pending', // Enforced server-side
    })

    return res.status(201).json({
      success: true,
      message: 'Leave request submitted successfully.',
      data: leave,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @desc    Get leave requests for authenticated employee only
 * @route   GET /api/leaves
 * @access  Private (Employee)
 */
export const getEmployeeLeaves = async (req, res, next) => {
  try {
    const leaves = await Leave.find({ user: req.user._id }).sort({ createdAt: -1 })

    return res.status(200).json({
      success: true,
      message: 'Leave requests retrieved successfully.',
      data: {
        leaves,
      },
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @desc    Get all leave requests across the company (HR / Admin)
 * @route   GET /api/hr/leaves
 * @access  Private (HR, Admin)
 */
export const getHrLeaves = async (req, res, next) => {
  try {
    const leaves = await Leave.find()
      .populate('user', 'name email department designation')
      .sort({ createdAt: -1 })

    return res.status(200).json({
      success: true,
      message: 'All company leave requests retrieved successfully.',
      data: leaves,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @desc    Approve an employee leave request (HR / Admin)
 * @route   PUT /api/hr/leaves/:id/approve
 * @access  Private (HR, Admin)
 */
export const approveLeave = async (req, res, next) => {
  try {
    const leave = await Leave.findById(req.params.id)

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: 'Leave request not found.',
      })
    }

    // Security check: Employee cannot approve their own leave
    if (String(leave.user) === String(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'You cannot approve your own leave request.',
      })
    }

    leave.status = 'Approved'
    leave.approvedBy = req.user._id
    leave.approvedAt = new Date()
    leave.rejectionReason = ''

    await leave.save()

    return res.status(200).json({
      success: true,
      message: 'Leave request approved successfully.',
      data: leave,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @desc    Reject an employee leave request (HR / Admin)
 * @route   PUT /api/hr/leaves/:id/reject
 * @access  Private (HR, Admin)
 */
export const rejectLeave = async (req, res, next) => {
  try {
    const { rejectionReason } = req.body
    const leave = await Leave.findById(req.params.id)

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: 'Leave request not found.',
      })
    }

    // Security check: Employee cannot reject their own leave
    if (String(leave.user) === String(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'You cannot reject your own leave request.',
      })
    }

    leave.status = 'Rejected'
    leave.rejectionReason = rejectionReason ? String(rejectionReason).trim() : 'Not specified'
    leave.approvedBy = req.user._id
    leave.approvedAt = new Date()

    await leave.save()

    return res.status(200).json({
      success: true,
      message: 'Leave request rejected.',
      data: leave,
    })
  } catch (error) {
    next(error)
  }
}
