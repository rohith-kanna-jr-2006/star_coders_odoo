# Dayflow HRMS — Backend API Architecture

Robust, secure, and production-ready REST API backend for **Dayflow HRMS** built with **Node.js**, **Express.js**, **MongoDB**, and **Mongoose**.

---

## 👥 Strict Responsibility Boundary

| Module / Component | Owner | Responsibilities |
|---|---|---|
| **Identity & Access** | **Member 3** | Project Foundation, MongoDB Connection, User Model, Signup, Login, Password Hashing (`bcryptjs`), JWT Generation/Verification, Role Authorization, Employee Profile (GET/PUT), Central Error Handling. |
| **Employee Operations** | **Member 4** | Attendance Module (Check-in/out, work hours), Leave Module (Apply, Employee History, HR Approval/Rejection), Payroll Module (Read-only for Employee, HR Management, Net Salary calculation). |

*Note: Member 4 strictly reuses Member 3's `authMiddleware.js` and `roleMiddleware.js`.*

---

## 📁 Project Structure

```text
backend/
├── .env
├── .env.example
├── .gitignore
├── package.json
├── README.md
├── server.js
│
├── config/
│   └── db.js                    # Reusable MongoDB connection function
│
├── models/
│   ├── User.js                  # Member 3: User schema, password hashing & JWT
│   ├── Attendance.js            # Member 4: Attendance schema & duplicate prevention
│   ├── Leave.js                 # Member 4: Leave request schema with audit fields
│   └── Payroll.js               # Member 4: Payroll schema & net salary calculation
│
├── controllers/
│   ├── authController.js        # Member 3: Signup & Login logic
│   ├── profileController.js     # Member 3: Profile fetch & restricted update
│   ├── attendanceController.js  # Member 4: Check-in, check-out & daily/weekly logs
│   ├── leaveController.js       # Member 4: Leave application & HR approval/rejection
│   └── payrollController.js     # Member 4: Employee read-only payroll & HR updates
│
├── routes/
│   ├── authRoutes.js            # Member 3: /api/auth
│   ├── profileRoutes.js         # Member 3: /api/profile
│   ├── attendanceRoutes.js      # Member 4: /api/attendance
│   ├── leaveRoutes.js           # Member 4: /api/leaves
│   └── payrollRoutes.js         # Member 4: /api/payroll
│
├── middleware/
│   ├── authMiddleware.js        # Member 3: JWT Bearer token validator
│   ├── roleMiddleware.js        # Member 3: Role-based access control (RBAC)
│   └── errorHandler.js          # Member 3: Centralized Express error handler
│
└── utils/
    └── errorHandler.js          # Custom AppError & centralized error formatting
```

---

## ⚙️ Environment Variables

Create `.env` in `backend/`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/dayflow_hrms
JWT_SECRET=dayflow_super_secure_jwt_secret_key_2026
NODE_ENV=development
```

---

## 🚀 Getting Started

```bash
# 1. Navigate to backend directory
cd backend

# 2. Install dependencies
npm install

# 3. Start development server with auto-reload
npm run dev

# 4. Start production server
npm start
```

Server endpoint: `http://localhost:5000`
Health check: `GET http://localhost:5000/api/health`

---

## 📑 Complete API Contract

### 1. Authentication (Member 3)

#### `POST /api/auth/signup`
- **Access**: Public
- **Request Body**:
  ```json
  {
    "employeeId": "EMP001",
    "name": "Rahul Sharma",
    "email": "rahul@company.com",
    "password": "password123",
    "role": "employee"
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "success": true,
    "message": "Account registered successfully.",
    "data": {
      "token": "<JWT_TOKEN>",
      "user": {
        "id": "64f1a2b3...",
        "employeeId": "EMP001",
        "name": "Rahul Sharma",
        "email": "rahul@company.com",
        "role": "employee",
        "department": "General",
        "designation": "Employee",
        "status": "active"
      }
    }
  }
  ```

#### `POST /api/auth/login`
- **Access**: Public
- **Request Body**:
  ```json
  {
    "email": "rahul@company.com",
    "password": "password123"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Login successful.",
    "data": {
      "token": "<JWT_TOKEN>",
      "user": {
        "id": "64f1a2b3...",
        "employeeId": "EMP001",
        "name": "Rahul Sharma",
        "email": "rahul@company.com",
        "role": "employee",
        "status": "active"
      }
    }
  }
  ```

---

### 2. Employee Profile (Member 3)

#### `GET /api/profile`
- **Access**: Private (Bearer Token)
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Profile retrieved successfully.",
    "data": {
      "_id": "64f1a2b3...",
      "employeeId": "EMP001",
      "name": "Rahul Sharma",
      "email": "rahul@company.com",
      "phone": "9876543210",
      "address": "123 Tech Park, Bengaluru",
      "department": "Engineering",
      "designation": "Software Engineer",
      "role": "employee",
      "status": "active"
    }
  }
  ```

#### `PUT /api/profile`
- **Access**: Private (Bearer Token)
- **Editable Fields**: `phone`, `address`, `profilePicture` *(All other fields are ignored/protected)*
- **Request Body**:
  ```json
  {
    "phone": "9876543210",
    "address": "456 Silicon Valley, Bengaluru",
    "profilePicture": "https://example.com/avatar.jpg"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Profile updated successfully.",
    "data": { ... }
  }
  ```

---

### 3. Attendance Module (Member 4)

#### `GET /api/attendance`
- **Access**: Private (Bearer Token)
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Attendance records retrieved successfully.",
    "data": {
      "today": {
        "date": "2026-08-22",
        "checkIn": "09:04 AM",
        "checkOut": "06:02 PM",
        "status": "Present",
        "workHours": "08h 58m"
      },
      "daily": [ ... ],
      "weekly": [ ... ]
    }
  }
  ```

#### `POST /api/attendance/check-in`
- **Access**: Private (Bearer Token)
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Check-in successful.",
    "data": {
      "date": "2026-08-22",
      "checkIn": "09:04 AM",
      "status": "Present"
    }
  }
  ```

#### `POST /api/attendance/check-out`
- **Access**: Private (Bearer Token)
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Check-out successful.",
    "data": {
      "date": "2026-08-22",
      "checkIn": "09:04 AM",
      "checkOut": "06:02 PM",
      "status": "Present",
      "workHours": "08h 58m"
    }
  }
  ```

---

### 4. Leave Module (Member 4)

#### `POST /api/leaves`
- **Access**: Private (Bearer Token)
- **Request Body**:
  ```json
  {
    "leaveType": "Paid",
    "startDate": "2026-08-25",
    "endDate": "2026-08-27",
    "reason": "Personal family event"
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "success": true,
    "message": "Leave request submitted successfully.",
    "data": {
      "leaveType": "Paid",
      "startDate": "2026-08-25",
      "endDate": "2026-08-27",
      "status": "Pending"
    }
  }
  ```

#### `GET /api/leaves`
- **Access**: Private (Bearer Token)
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Leave requests retrieved successfully.",
    "data": {
      "leaves": [ ... ]
    }
  }
  ```

#### `GET /api/hr/leaves`
- **Access**: Private (HR / Admin role required)
- **Response (200 OK)**: Returns all company leave requests.

#### `PUT /api/hr/leaves/:id/approve`
- **Access**: Private (HR / Admin role required)
- **Response (200 OK)**: Returns updated leave with `status: "Approved"`, `approvedBy`, and `approvedAt`.

#### `PUT /api/hr/leaves/:id/reject`
- **Access**: Private (HR / Admin role required)
- **Request Body**: `{ "rejectionReason": "Project deadlines" }`
- **Response (200 OK)**: Returns updated leave with `status: "Rejected"`.

---

### 5. Payroll Module (Member 4)

#### `GET /api/payroll`
- **Access**: Private (Bearer Token, Read-Only for Employees)
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Payroll details retrieved successfully.",
    "data": {
      "payroll": {
        "employeeId": "EMP001",
        "employeeName": "Rahul Sharma",
        "basicSalary": 50000,
        "allowances": 15000,
        "deductions": 5000,
        "netSalary": 60000,
        "month": "August",
        "year": 2026
      }
    }
  }
  ```

#### `GET /api/hr/payroll`
- **Access**: Private (HR / Admin role required)
- **Response (200 OK)**: Returns list of all company payroll records.

#### `POST /api/hr/payroll`
- **Access**: Private (HR / Admin role required)
- **Request Body**:
  ```json
  {
    "employeeId": "EMP001",
    "basicSalary": 60000,
    "allowances": 18000,
    "deductions": 6000,
    "month": "August",
    "year": 2026
  }
  ```
- **Response (200 OK)**: Returns saved payroll with calculated `netSalary: 72000`.
