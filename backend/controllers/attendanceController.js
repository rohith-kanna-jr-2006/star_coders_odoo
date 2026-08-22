import Attendance from '../models/Attendance.js'

/**
 * Format helper for ISO Date YYYY-MM-DD
 */
const getTodayDateString = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Format helper for 12-hour AM/PM string
 */
const formatTimeString = (date) => {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}

/**
 * Calculate working hours difference in "08h 58m" format
 */
const calculateWorkHours = (startTime, endTime) => {
  const diffMs = Math.max(0, endTime.getTime() - startTime.getTime())
  const totalMinutes = Math.floor(diffMs / (1000 * 60))
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  return `${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m`
}

/**
 * @desc    Get attendance records belonging strictly to the authenticated employee
 * @route   GET /api/attendance
 * @access  Private (Employee)
 */
export const getAttendance = async (req, res, next) => {
  try {
    const todayStr = getTodayDateString()

    // 1. Find today's attendance record
    const todayRecord = await Attendance.findOne({
      user: req.user._id,
      date: todayStr,
    })

    // 2. Find historical daily attendance (latest first)
    const dailyRecords = await Attendance.find({ user: req.user._id })
      .sort({ date: -1 })
      .limit(30)

    // 3. Build weekly summary
    const weeklySummary = dailyRecords.slice(0, 7).map((r) => ({
      date: r.date,
      day: new Date(r.date).toLocaleDateString('en-US', { weekday: 'long' }),
      status: r.status,
      hours: r.workHours || '—',
    }))

    return res.status(200).json({
      success: true,
      message: 'Attendance records retrieved successfully.',
      data: {
        today: todayRecord || {
          date: todayStr,
          status: 'Not Recorded',
          checkIn: '',
          checkOut: '',
          workingHours: '',
        },
        daily: dailyRecords,
        weekly: weeklySummary,
      },
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @desc    Record employee check-in for today
 * @route   POST /api/attendance/check-in
 * @access  Private (Employee)
 */
export const checkIn = async (req, res, next) => {
  try {
    const todayStr = getTodayDateString()
    const now = new Date()
    const timeStr = formatTimeString(now)

    // Check if attendance record already exists for today
    let record = await Attendance.findOne({
      user: req.user._id,
      date: todayStr,
    })

    if (record && record.checkIn) {
      return res.status(400).json({
        success: false,
        message: `You have already checked in today at ${record.checkIn}.`,
      })
    }

    if (!record) {
      record = new Attendance({
        user: req.user._id,
        employeeId: req.user.employeeId,
        date: todayStr,
        checkInTime: now,
        checkIn: timeStr,
        status: 'Present',
      })
    } else {
      record.checkInTime = now
      record.checkIn = timeStr
      record.status = 'Present'
    }

    await record.save()

    return res.status(200).json({
      success: true,
      message: 'Check-in successful.',
      data: record,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @desc    Record employee check-out for today
 * @route   POST /api/attendance/check-out
 * @access  Private (Employee)
 */
export const checkOut = async (req, res, next) => {
  try {
    const todayStr = getTodayDateString()
    const now = new Date()
    const timeStr = formatTimeString(now)

    const record = await Attendance.findOne({
      user: req.user._id,
      date: todayStr,
    })

    if (!record || !record.checkInTime) {
      return res.status(400).json({
        success: false,
        message: 'Cannot check out without checking in first.',
      })
    }

    if (record.checkOut) {
      return res.status(400).json({
        success: false,
        message: `You have already checked out today at ${record.checkOut}.`,
      })
    }

    record.checkOutTime = now
    record.checkOut = timeStr
    record.workHours = calculateWorkHours(record.checkInTime, now)

    await record.save()

    return res.status(200).json({
      success: true,
      message: 'Check-out successful.',
      data: record,
    })
  } catch (error) {
    next(error)
  }
}
