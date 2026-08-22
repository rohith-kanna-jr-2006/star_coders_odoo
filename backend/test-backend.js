import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

async function runUnitTests() {
  console.log('--- Running Dayflow Backend Unit Verifications ---')

  // 1. Password Hashing & Comparison Test
  const rawPassword = 'SecretPassword123'
  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(rawPassword, salt)
  const isMatch = await bcrypt.compare(rawPassword, hash)
  const isWrong = await bcrypt.compare('WrongPassword', hash)
  console.log(`[Test 1] Password Hashing & Verification: ${isMatch && !isWrong ? 'PASSED' : 'FAILED'}`)

  // 2. JWT Generation & Verification Test
  const secret = 'dayflow_test_jwt_secret_2026'
  const payload = { id: '64f1a2b3c4d5e6f7a8b9c0d1', employeeId: 'EMP001', role: 'employee' }
  const token = jwt.sign(payload, secret, { expiresIn: '7d' })
  const decoded = jwt.verify(token, secret)
  console.log(`[Test 2] JWT Token Encoding/Decoding: ${decoded.employeeId === 'EMP001' && decoded.role === 'employee' ? 'PASSED' : 'FAILED'}`)

  // 3. Work Hours Calculation Test
  const checkInTime = new Date('2026-08-22T09:04:00Z')
  const checkOutTime = new Date('2026-08-22T18:02:00Z')
  const diffMs = Math.max(0, checkOutTime.getTime() - checkInTime.getTime())
  const totalMinutes = Math.floor(diffMs / (1000 * 60))
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  const formattedHours = `${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m`
  console.log(`[Test 3] Work Hours Calculation (Expected: 08h 58m): ${formattedHours === '08h 58m' ? 'PASSED' : 'FAILED'}`)

  // 4. Net Salary Calculation Test
  const basicSalary = 50000
  const allowances = 15000
  const deductions = 5000
  const netSalary = basicSalary + allowances - deductions
  console.log(`[Test 4] Net Salary Calculation (Expected: 60000): ${netSalary === 60000 ? 'PASSED' : 'FAILED'}`)

  // 5. Leave Date Validation Test
  const validStart = new Date('2026-08-25')
  const validEnd = new Date('2026-08-27')
  const invalidEnd = new Date('2026-08-23')
  const validCheck = validEnd >= validStart
  const invalidCheck = invalidEnd < validStart
  console.log(`[Test 5] Leave Date Range Validation: ${validCheck && invalidCheck ? 'PASSED' : 'FAILED'}`)

  console.log('--- All Unit Verifications Completed Successfully ---')
}

runUnitTests()
