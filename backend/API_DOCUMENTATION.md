# Dayflow HRMS API Documentation

## Base API

### GET /api
- Authentication: None
- Required role: None
- Response:
  {
    "success": true,
    "message": "Dayflow HRMS API is running"
  }

---

## Authentication

### POST /api/auth/signup
- Authentication: None
- Required role: None
- Request body:
  {
    "employeeId": "EMP001",
    "name": "Ragul",
    "email": "ragul@example.com",
    "password": "Password123",
    "role": "employee"
  }
- Success response: 201
  {
    "success": true,
    "message": "Signup successful",
    "data": {
      "user": {
        "employeeId": "EMP001",
        "name": "Ragul",
        "email": "ragul@example.com",
        "role": "employee"
      }
    }
  }
- Error response: 400, 409
  {
    "success": false,
    "message": "Email already registered"
  }

### POST /api/auth/login
- Authentication: None
- Required role: None
- Request body:
  {
    "email": "ragul@example.com",
    "password": "Password123"
  }
- Success response: 200
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "token": "JWT_TOKEN",
      "user": {
        "id": "...",
        "employeeId": "EMP001",
        "name": "Ragul",
        "email": "ragul@example.com",
        "role": "employee"
      }
    }
  }
- Error response: 401
  {
    "success": false,
    "message": "Invalid credentials"
  }

---

## Profile

### GET /api/profile
- Authentication: Required
- Required role: employee, hr, admin
- Header:
  Authorization: Bearer <JWT>
- Success response: 200
  {
    "success": true,
    "message": "Profile retrieved successfully",
    "data": {
      "employeeId": "EMP001",
      "name": "Ragul",
      "email": "ragul@example.com",
      "phone": "9876543210",
      "address": "Address",
      "department": "CSE",
      "designation": "Software Developer",
      "joiningDate": "2026-08-01",
      "role": "employee",
      "status": "active"
    }
  }

### PUT /api/profile
- Authentication: Required
- Required role: employee, hr, admin
- Request body:
  {
    "phone": "9876543210",
    "address": "New Address"
  }
- Success response: 200
  {
    "success": true,
    "message": "Profile updated successfully",
    "data": {
      "phone": "9876543210",
      "address": "New Address"
    }
  }

---

## Attendance

### GET /api/attendance
- Authentication: Required
- Required role: employee, hr, admin
- Success response: 200
  {
    "success": true,
    "message": "Attendance retrieved successfully",
    "data": [
      {
        "date": "2026-08-22",
        "checkIn": "09:00 AM",
        "checkOut": "06:00 PM",
        "status": "Present",
        "workHours": "9h 0m"
      }
    ]
  }

### POST /api/attendance/check-in
- Authentication: Required
- Required role: employee, hr, admin
- Success response: 201
  {
    "success": true,
    "message": "Check-in successful",
    "data": {
      "date": "2026-08-22",
      "checkIn": "09:00 AM",
      "status": "Present"
    }
  }
- Error response: 409
  {
    "success": false,
    "message": "Already checked in today"
  }

### POST /api/attendance/check-out
- Authentication: Required
- Required role: employee, hr, admin
- Success response: 200
  {
    "success": true,
    "message": "Check-out successful",
    "data": {
      "date": "2026-08-22",
      "checkIn": "09:00 AM",
      "checkOut": "06:00 PM",
      "status": "Present",
      "workHours": "9h 0m"
    }
  }

---

## Leave

### GET /api/leaves
- Authentication: Required
- Required role: employee, hr, admin
- Success response: 200
  {
    "success": true,
    "message": "Leave history retrieved successfully",
    "data": [
      {
        "leaveType": "Paid",
        "startDate": "2026-08-25",
        "endDate": "2026-08-27",
        "reason": "Personal work",
        "status": "Pending"
      }
    ]
  }

### POST /api/leaves
- Authentication: Required
- Required role: employee, hr, admin
- Request body:
  {
    "leaveType": "Paid",
    "startDate": "2026-08-25",
    "endDate": "2026-08-27",
    "reason": "Personal work"
  }
- Success response: 201
  {
    "success": true,
    "message": "Leave applied successfully",
    "data": {
      "leaveType": "Paid",
      "startDate": "2026-08-25",
      "endDate": "2026-08-27",
      "status": "Pending"
    }
  }

### GET /api/hr/leaves
- Authentication: Required
- Required role: hr, admin
- Success response: 200
  {
    "success": true,
    "message": "Leave requests retrieved successfully",
    "data": []
  }

### PUT /api/hr/leaves/:id/approve
- Authentication: Required
- Required role: hr, admin
- Success response: 200
  {
    "success": true,
    "message": "Leave approved successfully",
    "data": {
      "status": "Approved"
    }
  }

### PUT /api/hr/leaves/:id/reject
- Authentication: Required
- Required role: hr, admin
- Request body:
  {
    "rejectionReason": "Insufficient leave balance"
  }
- Success response: 200
  {
    "success": true,
    "message": "Leave rejected successfully",
    "data": {
      "status": "Rejected",
      "rejectionReason": "Insufficient leave balance"
    }
  }

---

## Payroll

### GET /api/payroll
- Authentication: Required
- Required role: employee, hr, admin
- Success response: 200
  {
    "success": true,
    "message": "Payroll retrieved successfully",
    "data": [
      {
        "basicSalary": 30000,
        "allowances": 5000,
        "deductions": 2000,
        "netSalary": 33000,
        "month": 8,
        "year": 2026
      }
    ]
  }

### GET /api/hr/payroll
- Authentication: Required
- Required role: hr, admin
- Success response: 200
  {
    "success": true,
    "message": "Payroll records retrieved successfully",
    "data": []
  }

### POST /api/hr/payroll
- Authentication: Required
- Required role: hr, admin
- Request body:
  {
    "employeeId": "EMP001",
    "basicSalary": 30000,
    "allowances": 5000,
    "deductions": 2000,
    "month": 8,
    "year": 2026
  }
- Success response: 200
  {
    "success": true,
    "message": "Payroll saved successfully",
    "data": {
      "netSalary": 33000,
      "month": 8,
      "year": 2026
    }
  }

---

## Security Notes

- Passwords are hashed before storage.
- JWTs are sent in the Authorization header using Bearer format.
- Employee identity is always derived from the authenticated user, not from request body values.
- Access control is enforced on the backend via role checks.
- Invalid or expired JWTs return 401.
- Unauthorized roles return 403.

## Common Errors

- 400: Bad request or validation failure
- 401: Invalid or missing JWT
- 403: Role not allowed
- 404: Resource not found
- 409: Duplicate or conflict
- 500: Server error
