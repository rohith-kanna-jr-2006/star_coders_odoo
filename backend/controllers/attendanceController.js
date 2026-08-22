import Attendance from '../models/Attendance.js'

const getTodayDateString = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const formatTimeString = (date) => {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}

const calculateWorkHours = (checkInTime, checkOutTime) => {
  const diffMs = Math.max(0, checkOutTime.getTime() - checkInTime.getTime())
  const totalMinutes = Math.floor(diffMs / (1000 * 60))
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  return `${hours}h ${minutes}m`
}

export const getAttendance = async (req, res, next) => {
  try {
    const records = await Attendance.find({ user: req.user.id })
      .sort({ date: -1 })
      .select('date checkIn checkOut status workHours')

    return res.status(200).json({
      success: true,
      message: 'Attendance retrieved successfully',
      data: records,
    })
  } catch (error) {
    next(error)
  }
}

export const checkIn = async (req, res, next) => {
  try {
    const today = getTodayDateString()
    const now = new Date()

    const existingRecord = await Attendance.findOne({
      user: req.user.id,
      date: today,
    })

    if (existingRecord && existingRecord.checkIn) {
      return res.status(409).json({
        success: false,
        message: 'Already checked in today',
      })
    }

    const attendance = existingRecord || new Attendance({
      user: req.user.id,
      employeeId: req.user.employeeId,
      date: today,
    })

    attendance.checkInTime = now
    attendance.checkIn = formatTimeString(now)
    attendance.status = 'Present'
    attendance.checkOut = ''
    attendance.workHours = ''

    await attendance.save()

    return res.status(201).json({
      success: true,
      message: 'Check-in successful',
      data: attendance,
    })
  } catch (error) {
    next(error)
  }
}

export const checkOut = async (req, res, next) => {
  try {
    const today = getTodayDateString()
    const now = new Date()

    const attendance = await Attendance.findOne({
      user: req.user.id,
      date: today,
    })

    if (!attendance || !attendance.checkIn) {
      return res.status(400).json({
        success: false,
        message: 'No check-in found for today',
      })
    }

    if (attendance.checkOut) {
      return res.status(409).json({
        success: false,
        message: 'Already checked out today',
      })
    }

    attendance.checkOutTime = now
    attendance.checkOut = formatTimeString(now)
    attendance.workHours = calculateWorkHours(attendance.checkInTime, now)
    attendance.status = 'Present'

    await attendance.save()

    return res.status(200).json({
      success: true,
      message: 'Check-out successful',
      data: attendance,
    })
  } catch (error) {
    next(error)
  }
}
