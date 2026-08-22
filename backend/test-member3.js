import generateToken from './utils/generateToken.js'
import { protect } from './middleware/authMiddleware.js'
import { requireRole, authorizeRoles } from './middleware/roleMiddleware.js'
import User from './models/User.js'
import jwt from 'jsonwebtoken'

async function runMember3TestSuite() {
  console.log('====================================================')
  console.log('   DAYFLOW HRMS — MEMBER 3 VERIFICATION SUITE')
  console.log('====================================================\n')

  let passed = 0
  let failed = 0

  function assert(condition, message) {
    if (condition) {
      console.log(`[PASS] ${message}`)
      passed++
    } else {
      console.error(`[FAIL] ${message}`)
      failed++
    }
  }

  // 1. Test JWT Generation & Token Utility
  const mockUser = {
    _id: '66c6112233445566778899aa',
    employeeId: 'EMP999',
    role: 'employee',
  }
  process.env.JWT_SECRET = 'test_secret_key_member3_2026'
  process.env.JWT_EXPIRES_IN = '7d'

  const token = generateToken(mockUser)
  assert(typeof token === 'string' && token.length > 20, 'JWT generateToken returns signed string')

  const decoded = jwt.verify(token, process.env.JWT_SECRET)
  assert(decoded.id === mockUser._id && decoded.role === 'employee', 'JWT payload contains correct id and role')

  // 2. Test Auth Middleware (protect)
  let req = { headers: {} }
  let resStatus = null
  let resJson = null
  let nextCalled = false

  let res = {
    status(code) {
      resStatus = code
      return this
    },
    json(data) {
      resJson = data
      return this
    },
  }

  // Test missing token
  await protect(req, res, () => { nextCalled = true })
  assert(resStatus === 401 && resJson.success === false, 'Auth Middleware rejects request without token with 401')

  // Test malformed token header
  req = { headers: { authorization: 'Basic 12345' } }
  nextCalled = false
  await protect(req, res, () => { nextCalled = true })
  assert(resStatus === 401 && resJson.success === false, 'Auth Middleware rejects non-Bearer header with 401')

  // 3. Test Role Middleware (requireRole / authorizeRoles)
  const hrMiddleware = requireRole('hr', 'admin')
  
  // Test unauthorized role (employee attempting HR route)
  req = { user: { role: 'employee' } }
  nextCalled = false
  hrMiddleware(req, res, () => { nextCalled = true })
  assert(resStatus === 403 && resJson.success === false, 'Role Middleware blocks employee from HR routes with 403 Forbidden')

  // Test authorized role (HR user accessing HR route)
  req = { user: { role: 'hr' } }
  nextCalled = false
  hrMiddleware(req, res, () => { nextCalled = true })
  assert(nextCalled === true, 'Role Middleware allows HR user to access HR route')

  // Test Admin role access
  req = { user: { role: 'admin' } }
  nextCalled = false
  hrMiddleware(req, res, () => { nextCalled = true })
  assert(nextCalled === true, 'Role Middleware allows Admin user to access HR route')

  // 4. Test User Model toJSON sanitization
  const dummyDoc = new User({
    employeeId: 'EMP101',
    name: 'Test User',
    email: 'test@example.com',
    password: 'SuperSecretPassword123',
    phone: '9876543210',
    role: 'employee',
  })

  const jsonOutput = dummyDoc.toJSON()
  assert(jsonOutput.password === undefined, 'User.toJSON() strips password hash from output')
  assert(jsonOutput.__v === undefined, 'User.toJSON() strips internal Mongoose versioning __v')
  assert(jsonOutput.email === 'test@example.com', 'User.toJSON() preserves safe email field')
  assert(jsonOutput.profilePictureUrl !== undefined, 'User.toJSON() guarantees profilePictureUrl field present')

  console.log('\n----------------------------------------------------')
  console.log(` SUMMARY: Passed: ${passed} | Failed: ${failed}`)
  console.log('----------------------------------------------------')

  if (failed > 0) {
    process.exit(1)
  }
  process.exit(0)
}

runMember3TestSuite()
