# Complete Folder Structure - College ERP System

## Full Directory Tree

```
pavakie/
│
├── backend/
│   ├── models/
│   │   ├── User.js                    # User schema (admin, faculty, student)
│   │   ├── Department.js              # Department schema
│   │   ├── Course.js                  # Course schema
│   │   ├── Attendance.js              # Attendance records schema
│   │   ├── Marks.js                   # Marks/Results schema
│   │   ├── Announcement.js            # Announcements schema
│   │   └── Leave.js                   # Leave requests schema
│   │
│   ├── routes/
│   │   ├── auth.js                    # Authentication routes (login, register)
│   │   ├── users.js                   # User management routes
│   │   ├── departments.js             # Department routes
│   │   ├── attendance.js              # Attendance management routes
│   │   ├── marks.js                   # Marks management routes
│   │   ├── announcements.js           # Announcements routes
│   │   └── leaves.js                  # Leave management routes
│   │
│   ├── controllers/
│   │   ├── authController.js          # Authentication logic
│   │   ├── userController.js          # User management logic
│   │   ├── departmentController.js    # Department operations
│   │   ├── attendanceController.js    # Attendance operations
│   │   ├── marksController.js         # Marks operations
│   │   ├── announcementController.js  # Announcements operations
│   │   └── leaveController.js         # Leave management logic
│   │
│   ├── middleware/
│   │   └── auth.js                    # JWT authentication middleware
│   │
│   ├── config/
│   │   └── (future configuration files)
│   │
│   ├── server.js                      # Main Express server
│   ├── package.json                   # Node dependencies
│   ├── .env                           # Environment variables
│   ├── .gitignore                     # Git ignore rules
│   └── README.md                      # Backend documentation
│
├── frontend/
│   ├── public/
│   │   ├── index.html                 # Main HTML file
│   │   └── favicon.ico
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── Admin/
│   │   │   │   ├── AdminHome.js       # Admin dashboard home
│   │   │   │   ├── AdminHome.css
│   │   │   │   ├── UserManagement.js  # User CRUD operations
│   │   │   │   ├── DepartmentManagement.js    # Department management
│   │   │   │   └── LeaveManagement.js # Leave approval/rejection
│   │   │   │
│   │   │   ├── Faculty/
│   │   │   │   ├── FacultyHome.js     # Faculty dashboard
│   │   │   │   ├── AttendanceManagement.js    # Mark attendance
│   │   │   │   ├── MarksManagement.js # Enter student marks
│   │   │   │   └── LeaveRequest.js    # Request leaves
│   │   │   │
│   │   │   ├── Student/
│   │   │   │   ├── StudentHome.js     # Student dashboard
│   │   │   │   ├── ViewAttendance.js  # View attendance
│   │   │   │   ├── ViewMarks.js       # View results & CGPA
│   │   │   │   ├── ViewAnnouncements.js       # View announcements
│   │   │   │   └── LeaveRequest.js    # Request leaves
│   │   │   │
│   │   │   ├── Sidebar.js             # Navigation sidebar
│   │   │   ├── Sidebar.css
│   │   │   ├── Card.js                # Reusable card component
│   │   │   ├── Card.css
│   │   │   ├── Modal.js               # Reusable modal component
│   │   │   ├── Modal.css
│   │   │   └── PrivateRoute.js        # Protected route wrapper
│   │   │
│   │   ├── pages/
│   │   │   ├── Login.js               # Login page
│   │   │   ├── Login.css
│   │   │   ├── AdminDashboard.js      # Admin dashboard layout
│   │   │   ├── FacultyDashboard.js    # Faculty dashboard layout
│   │   │   ├── StudentDashboard.js    # Student dashboard layout
│   │   │   └── Dashboard.css          # Dashboard styles
│   │   │
│   │   ├── services/
│   │   │   ├── api.js                 # Axios instance configuration
│   │   │   ├── userService.js         # User API calls
│   │   │   ├── departmentService.js   # Department API calls
│   │   │   ├── attendanceService.js   # Attendance API calls
│   │   │   ├── marksService.js        # Marks API calls
│   │   │   ├── announcementService.js # Announcements API calls
│   │   │   └── leaveService.js        # Leave API calls
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.js         # Authentication context
│   │   │
│   │   ├── styles/
│   │   │   └── variables.css          # CSS variables
│   │   │
│   │   ├── App.js                     # Main app component
│   │   ├── App.css
│   │   ├── index.js                   # React entry point
│   │   └── index.css                  # Global styles
│   │
│   ├── package.json                   # React dependencies
│   ├── .env                           # Environment variables
│   ├── tailwind.config.js             # Tailwind configuration
│   └── .gitignore
│
├── README.md                          # Main project documentation
├── SETUP.md                           # Setup & installation guide
├── DEPLOYMENT.md                      # Deployment instructions
├── FOLDER_STRUCTURE.md                # This file
└── .gitignore                         # Root git ignore
```

## File Descriptions

### Backend Files

#### Models (Database Schemas)
- **User.js**: Stores user information, roles, and authentication details
- **Department.js**: College departments and courses
- **Course.js**: Course information and enrollments
- **Attendance.js**: Daily attendance records
- **Marks.js**: Student marks and grades
- **Announcement.js**: Important announcements
- **Leave.js**: Leave applications and approvals

#### Routes
- **auth.js**: `/api/auth/*` - Login, registration, user info
- **users.js**: `/api/users/*` - User management
- **departments.js**: `/api/departments/*` - Department CRUD
- **attendance.js**: `/api/attendance/*` - Attendance operations
- **marks.js**: `/api/marks/*` - Marks management
- **announcements.js**: `/api/announcements/*` - Announcements
- **leaves.js**: `/api/leaves/*` - Leave management

#### Controllers
Business logic for each route handler

#### Middleware
- **auth.js**: JWT verification and role authorization

### Frontend Files

#### Components
- **Admin Components**: Dashboard, user management, departments, leaves
- **Faculty Components**: Home, attendance marking, marks entry, leave requests
- **Student Components**: Home, view attendance, view marks, announcements, leaves
- **Shared Components**: Sidebar, cards, modals, private routes

#### Pages
- **Login.js**: Authentication page
- **AdminDashboard.js**: Admin main layout
- **FacultyDashboard.js**: Faculty main layout
- **StudentDashboard.js**: Student main layout

#### Services
API service modules for each resource

#### Context
- **AuthContext.js**: Global authentication state management

## Data Flow

### Authentication Flow
```
Login Page → AuthContext → API (auth/login) → JWT Token → localStorage → Axios Header
```

### User Actions Flow
```
Component (e.g., AdminHome) → Service (e.g., userService) → API Call → Backend
Backend → Controller → Model → Database
Database → Response → Frontend → Component State Update → Re-render
```

### State Management
- **Global State**: Authentication context (user, token, login/logout)
- **Local State**: Component-specific data (forms, lists, loading states)

## Database Collections

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String (hashed),
  role: String (admin/faculty/student),
  department: ObjectId (ref: Department),
  enrollmentNumber: String (for students),
  employeeId: String (for faculty),
  phone: String,
  address: String,
  semester: Number (for students),
  dob: Date,
  gender: String,
  status: String (active/inactive),
  createdAt: Date
}
```

### Departments Collection
```javascript
{
  _id: ObjectId,
  name: String,
  code: String,
  description: String,
  headOfDepartment: ObjectId (ref: User),
  courses: [ObjectId] (ref: Course),
  createdAt: Date
}
```

### Attendance Collection
```javascript
{
  _id: ObjectId,
  course: ObjectId (ref: Course),
  student: ObjectId (ref: User),
  faculty: ObjectId (ref: User),
  date: Date,
  status: String (present/absent/late),
  remarks: String,
  createdAt: Date
}
```

### Marks Collection
```javascript
{
  _id: ObjectId,
  course: ObjectId (ref: Course),
  student: ObjectId (ref: User),
  faculty: ObjectId (ref: User),
  examType: String (midterm/endterm/quiz/assignment),
  marksObtained: Number,
  totalMarks: Number,
  percentage: Number,
  grade: String (A/B/C/D/F),
  remarks: String,
  createdAt: Date
}
```

### Leave Collection
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User),
  leaveType: String (casual/sick/earned/emergency/study),
  startDate: Date,
  endDate: Date,
  numberOfDays: Number,
  reason: String,
  status: String (pending/approved/rejected),
  approvedBy: ObjectId (ref: User),
  remarks: String,
  attachments: [String],
  createdAt: Date,
  updatedAt: Date
}
```

## API Endpoint Structure

```
Base URL: http://localhost:5000/api

Authentication:
├── POST /auth/register
├── POST /auth/login
└── GET /auth/me

Users:
├── GET /users
├── GET /users/role/:role
├── GET /users/:id
├── PUT /users/:id
├── DELETE /users/:id
└── PATCH /users/:id/status

Departments:
├── POST /departments
├── GET /departments
├── GET /departments/:id
├── PUT /departments/:id
└── DELETE /departments/:id

Attendance:
├── POST /attendance
├── POST /attendance/bulk
├── GET /attendance
├── GET /attendance/student/:studentId
├── GET /attendance/course/:courseId
├── PUT /attendance/:id
└── DELETE /attendance/:id

Marks:
├── POST /marks
├── GET /marks
├── GET /marks/student/:studentId
├── GET /marks/course/:courseId
├── PUT /marks/:id
└── DELETE /marks/:id

Announcements:
├── POST /announcements
├── GET /announcements
├── GET /announcements/role/:role
├── GET /announcements/:id
├── PUT /announcements/:id
└── DELETE /announcements/:id

Leaves:
├── POST /leaves
├── GET /leaves
├── GET /leaves/pending
├── GET /leaves/my-leaves
├── GET /leaves/user/:userId
├── GET /leaves/:id
├── PATCH /leaves/:id/approve
├── PATCH /leaves/:id/reject
├── PUT /leaves/:id
└── DELETE /leaves/:id
```

## Key Technologies & Libraries

### Backend
- **express**: Web framework
- **mongoose**: MongoDB ORM
- **bcryptjs**: Password hashing
- **jsonwebtoken**: JWT tokens
- **cors**: Cross-origin requests
- **dotenv**: Environment variables

### Frontend
- **react**: UI library
- **react-router-dom**: Routing
- **axios**: HTTP client
- **react-icons**: Icon library
- **chart.js**: Data visualization
- **tailwindcss**: CSS framework

## Development Workflow

1. **Backend Development**
   - Modify models in `models/`
   - Create routes in `routes/`
   - Implement logic in `controllers/`
   - Add middleware in `middleware/`
   - Test with Postman

2. **Frontend Development**
   - Create components in `components/`
   - Add services in `services/`
   - Create pages in `pages/`
   - Update context in `context/`
   - Test in browser

3. **Integration**
   - Ensure API endpoints match
   - Test authentication flow
   - Verify role-based access
   - Test data display

## Best Practices

- ✅ Keep components small and reusable
- ✅ Use services for API calls
- ✅ Store auth state in context
- ✅ Add error handling everywhere
- ✅ Validate input on both frontend & backend
- ✅ Use environment variables for config
- ✅ Add comments for complex logic
- ✅ Test thoroughly before deployment

---

This structure is scalable and maintainable for future enhancements!