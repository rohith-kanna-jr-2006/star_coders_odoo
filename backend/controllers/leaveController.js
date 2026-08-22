import Leave from '../models/Leave.js'

export const applyLeave = async (req, res, next) => {
  try {
    const { leaveType, startDate, endDate, reason } = req.body

    if (!leaveType || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'leaveType, startDate and endDate are required',
      })
    }

    const start = new Date(startDate)
    const end = new Date(endDate)

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date provided',
      })
    }

    if (end < start) {
      return res.status(400).json({
        success: false,
        message: 'endDate must be greater than or equal to startDate',
      })
    }

    const leave = await Leave.create({
      user: req.user.id,
      employeeId: req.user.employeeId,
      employeeName: req.user.name,
      leaveType,
      startDate: startDate.toString().slice(0, 10),
      endDate: endDate.toString().slice(0, 10),
      reason: reason || '',
      status: 'Pending',
    })

    return res.status(201).json({
      success: true,
      message: 'Leave applied successfully',
      data: leave,
    })
  } catch (error) {
    next(error)
  }
}

export const getEmployeeLeaves = async (req, res, next) => {
  try {
    const leaves = await Leave.find({ user: req.user.id }).sort({ createdAt: -1 })

    return res.status(200).json({
      success: true,
      message: 'Leave history retrieved successfully',
      data: leaves,
    })
  } catch (error) {
    next(error)
  }
}

export const getHrLeaves = async (req, res, next) => {
  try {
    const leaves = await Leave.find().populate('user', 'name email employeeId role').sort({ createdAt: -1 })

    return res.status(200).json({
      success: true,
      message: 'Leave requests retrieved successfully',
      data: leaves,
    })
  } catch (error) {
    next(error)
  }
}

export const approveLeave = async (req, res, next) => {
  try {
    const leave = await Leave.findById(req.params.id)

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: 'Leave request not found',
      })
    }

    if (leave.status !== 'Pending') {
      return res.status(409).json({
        success: false,
        message: 'Leave request is not pending',
      })
    }

    leave.status = 'Approved'
    leave.approvedBy = req.user.id
    leave.approvedAt = new Date()
    leave.rejectionReason = ''

    await leave.save()

    return res.status(200).json({
      success: true,
      message: 'Leave approved successfully',
      data: leave,
    })
  } catch (error) {
    next(error)
  }
}

export const rejectLeave = async (req, res, next) => {
  try {
    const { rejectionReason } = req.body
    const leave = await Leave.findById(req.params.id)

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: 'Leave request not found',
      })
    }

    if (leave.status !== 'Pending') {
      return res.status(409).json({
        success: false,
        message: 'Leave request is not pending',
      })
    }

    leave.status = 'Rejected'
    leave.rejectionReason = rejectionReason || 'Not specified'
    leave.approvedBy = req.user.id
    leave.approvedAt = new Date()

    await leave.save()

    return res.status(200).json({
      success: true,
      message: 'Leave rejected successfully',
      data: leave,
    })
  } catch (error) {
    next(error)
  }
}
