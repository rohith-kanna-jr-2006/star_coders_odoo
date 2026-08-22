import mongoose from 'mongoose'

const payrollSchema = new mongoose.Schema(
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
    basicSalary: {
      type: Number,
      required: [true, 'Basic salary is required'],
      min: [0, 'Basic salary cannot be negative'],
    },
    allowances: {
      type: Number,
      default: 0,
      min: [0, 'Allowances cannot be negative'],
    },
    deductions: {
      type: Number,
      default: 0,
      min: [0, 'Deductions cannot be negative'],
    },
    netSalary: {
      type: Number,
      required: true,
    },
    month: {
      type: String,
      required: [true, 'Payroll month is required'],
      trim: true,
    },
    year: {
      type: Number,
      required: [true, 'Payroll year is required'],
      min: [2000, 'Invalid year'],
    },
  },
  {
    timestamps: true,
  }
)

// Prevent duplicate payroll records for the same employee in the same month/year
payrollSchema.index({ user: 1, month: 1, year: 1 }, { unique: true })

const Payroll = mongoose.model('Payroll', payrollSchema)
export default Payroll
