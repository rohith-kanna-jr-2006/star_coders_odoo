# Dayflow HRMS - Employee Frontend Module

A modern, responsive, and robust Employee HRMS Frontend built with **React.js**, **React Router v6**, **Axios**, and **Context API**.

Designed for seamless integration with a Node.js / Express.js / MongoDB REST API backend, tailored for enterprise HR management and hackathon project demonstrations.

---

## 📑 Table of Contents
1. [Key Features](#key-features)
2. [Technology Stack](#technology-stack)
3. [Project Setup & Installation](#project-setup--installation)
4. [Folder Structure](#folder-structure)
5. [Application Routes](#application-routes)
6. [Central Axios & API Service Layer](#central-axios--api-service-layer)
7. [Authentication & Route Guarding](#authentication--route-guarding)
8. [Module Details & Pages](#module-details--pages)
9. [Configuring API Endpoints for Backend Integration](#configuring-api-endpoints-for-backend-integration)
10. [Git & Branching](#git--branching)

---

## 1. Key Features

- **Employee Authentication**: Sign up with Employee ID & role selection, sign in with email/password, validation, and session hydration.
- **Protected Employee Workspace**: Session guard redirection (`/login` ⇄ `/employee/dashboard`) with state memory.
- **Executive Dashboard**: Daily status overview, leave metrics, quick action triggers, and attendance pulse.
- **Employee Profile**: View comprehensive job & personal records, edit phone/address/avatar, and inspect salary tier.
- **Time & Attendance**: One-click check-in/check-out with status tracking, daily attendance table, and weekly breakdown with pagination.
- **Leave Management**: Submit time-off requests with date validation (preventing start > end date errors), view pending/approved/rejected counts, and inspect application history.
- **Payroll & Compensation**: Strict read-only salary structure breakdown (Basic, Allowances, Deductions, Net Salary).
- **Responsive & Accessible**: Fully adaptive desktop sidebar and mobile overlay navigation.

---

## 2. Technology Stack

- **Framework**: React.js (Vite)
- **Routing**: React Router DOM (v6)
- **HTTP Client**: Axios with central request/response interceptors
- **Icons**: Lucide React
- **Styling**: Modern Vanilla CSS Design System with responsive grid layouts & status badges
- **State Management**: React Context API (`AuthContext`)

---

## 3. Project Setup & Installation

### Prerequisites
- Node.js (v18 or higher recommended)
- npm (v9 or higher)

### Setup Steps
```bash
# 1. Navigate to the frontend directory
cd frontend

# 2. Install required packages
npm install

# 3. Configure environment variables
cp .env.example .env

# 4. Start local development server
npm run dev
```

The application will be accessible at: `http://localhost:5173`

---

## 4. Folder Structure

```text
frontend/
│
├── src/
│   ├── components/
│   │   ├── EmployeeLayout.js    # Layout shell linking Navbar + Sidebar + Scrim
│   │   ├── ErrorMessage.js      # Reusable alert box with retry button
│   │   ├── Loading.js           # Accessible spinner loading state
│   │   ├── Modal.js             # Modal dialog component
│   │   ├── Navbar.js            # Top navigation bar with user chip & logout
│   │   ├── PageHeader.js        # Standardized page title, eyebrow, and actions
│   │   ├── ProtectedRoute.js    # Route guard checking authentication state
│   │   ├── Sidebar.js           # Responsive navigation sidebar
│   │   └── StatusBadge.js       # Multi-state badge (Present, Leave, Pending, etc.)
│   │
│   ├── context/
│   │   └── AuthContext.js       # Central auth provider (user, login, logout, token)
│   │
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── Login.js         # Employee sign-in page
│   │   │   └── Signup.js        # Employee registration page
│   │   │
│   │   └── employee/
│   │       ├── Attendance.js    # Check-in/out, daily table, weekly schedule
│   │       ├── Dashboard.js     # Welcome metrics, quick links, attendance pulse
│   │       ├── Leave.js         # Leave application form, status badges, history
│   │       ├── Payroll.js       # Read-only salary breakdown & net pay
│   │       └── Profile.js       # Personal profile, editable fields & job details
│   │
│   ├── services/
│   │   ├── api.js               # Central Axios instance & ENDPOINTS dictionary
│   │   ├── attendanceService.js # Check-in, check-out, and attendance fetchers
│   │   ├── authService.js       # Login and signup API calls
│   │   ├── leaveService.js      # Leave submission and history retrieval
│   │   ├── payrollService.js    # Payroll data fetcher
│   │   └── profileService.js    # Profile retrieval and update APIs
│   │
│   ├── App.js                   # Main router definitions
│   ├── index.css                # Global design system & responsive styling
│   └── main.js                  # React root bootstrap
│
├── .env.example                 # Example environment configuration
├── package.json
└── README.md
```

---

## 5. Application Routes

| Route | Type | Description |
|---|---|---|
| `/login` | Public | Employee login page |
| `/signup` | Public | Employee registration page |
| `/employee/dashboard` | Protected | Main overview dashboard |
| `/employee/profile` | Protected | View records & update contact details |
| `/employee/attendance` | Protected | Check in/out & attendance logs |
| `/employee/leave` | Protected | Apply for leave & track history |
| `/employee/payroll` | Protected | Read-only salary & compensation |

---

## 6. Central Axios & API Service Layer

All REST API communications pass through `src/services/api.js`.

```javascript
import axios from 'axios'

export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
  },
  PROFILE: {
    GET: '/profile',
    UPDATE: '/profile',
  },
  ATTENDANCE: {
    GET: '/attendance',
    CHECK_IN: '/attendance/check-in',
    CHECK_OUT: '/attendance/check-out',
  },
  LEAVES: {
    GET: '/leaves',
    APPLY: '/leaves',
  },
  PAYROLL: {
    GET: '/payroll',
  },
}
```

---

## 7. Configuring API Endpoints for Backend Integration

To link this frontend to a real Node.js backend:
1. Update `VITE_API_URL` in `.env`:
   ```env
   VITE_API_URL=https://api.yourdomain.com/api
   ```
2. If your backend uses alternative endpoint names (e.g. `/api/v1/auth/signin`), simply adjust the `ENDPOINTS` dictionary in `src/services/api.js`. No page component code needs to be modified!

---

## 8. Git & Branching

Developed and committed on branch:
```bash
git checkout -b feature/frontend-employee
git add .
git commit -m "feat: complete Dayflow HRMS employee frontend module"
```
