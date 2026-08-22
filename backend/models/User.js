import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      required: [true, 'Employee ID is required'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false, // Never return by default in queries
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    address: {
      type: String,
      trim: true,
      default: '',
    },
    profilePicture: {
      type: String,
      trim: true,
      default: '',
    },
    department: {
      type: String,
      trim: true,
      default: 'General',
    },
    designation: {
      type: String,
      trim: true,
      default: 'Employee',
    },
    joiningDate: {
      type: Date,
      default: Date.now,
    },
    role: {
      type: String,
      enum: {
        values: ['employee', 'hr', 'admin'],
        message: '{VALUE} is not a supported role. Supported: employee, hr, admin',
      },
      default: 'employee',
      lowercase: true,
    },
    status: {
      type: String,
      enum: {
        values: ['active', 'inactive'],
        message: '{VALUE} is not a valid status',
      },
      default: 'active',
      lowercase: true,
    },
  },
  {
    timestamps: true,
  }
)

// Pre-save hook: Hash plain-text password with bcrypt
userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return
  }
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

// Instance method: Compare input password with stored password hash
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

// Transform output to remove password hash and internal mongoose versioning
userSchema.methods.toJSON = function () {
  const obj = this.toObject()
  obj.profilePictureUrl = obj.profilePictureUrl || obj.profilePicture || ''
  delete obj.password
  delete obj.__v
  return obj
}

const User = mongoose.model('User', userSchema)
export default User
