import mongoose from 'mongoose'

const leaveSchema = new mongoose.Schema(
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
    employeeName: {
      type: String,
      trim: true,
    },
    leaveType: {
      type: String,
      required: [true, 'Leave type is required'],
      enum: {
        values: ['Paid', 'Sick', 'Unpaid'],
        message: '{VALUE} is not a supported leave type (Paid, Sick, Unpaid)',
      },
    },
    startDate: {
      type: String, // Format: YYYY-MM-DD
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: String, // Format: YYYY-MM-DD
      required: [true, 'End date is required'],
    },
    reason: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
      index: true,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    approvedAt: {
      type: Date,
    },
    rejectionReason: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
)

const Leave = mongoose.model('Leave', leaveSchema)
export default Leave
