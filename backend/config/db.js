import mongoose from 'mongoose'

/**
 * Reusable MongoDB connection function using Mongoose
 */
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI
    if (!mongoUri) {
      throw new Error('MONGO_URI is not defined in environment variables.')
    }

    const conn = await mongoose.connect(mongoUri)
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}/${conn.connection.name}`)
  } catch (error) {
    console.error(`[MongoDB Connection Error] ${error.message}`)
    process.exit(1)
  }
}

export default connectDB
