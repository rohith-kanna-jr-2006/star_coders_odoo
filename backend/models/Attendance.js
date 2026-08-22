import mongoose from 'mongoose'

const attendanceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    employeeId: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
    date: {
      type: String, // Format: YYYY-MM-DD for deterministic calendar querying
      required: true,
      index: true,
    },
    checkInTime: {
      type: Date,
    },
    checkOutTime: {
      type: Date,
    },
    checkIn: {
      type: String, // Format: "09:04 AM"
      default: '',
    },
    checkOut: {
      type: String, // Format: "06:02 PM"
      default: '',
    },
    status: {
      type: String,
      enum: ['Present', 'Absent', 'Half-day', 'Leave'],
      default: 'Present',
    },
    workHours: {
      type: String, // Format: "08h 58m"
      default: '',
    },
  },
  {
    timestamps: true,
  }
)

// Prevent duplicate attendance records for the same employee on the same date
attendanceSchema.index({ user: 1, date: 1 }, { unique: true })

const Attendance = mongoose.model('Attendance', attendanceSchema)
export default Attendance
