# College ERP System

A comprehensive Enterprise Resource Planning (ERP) system for college management with role-based access control for Admin, Faculty, and Students.

## Features

### Core Features
- **Role-based Login**: Admin, Faculty, Student with JWT authentication
- **Admin Panel**: 
  - Manage departments
  - Manage users (Faculty, Students, Admin)
  - Approve/Reject leave requests
  - View system statistics
  
- **Faculty Features**:
  - Mark and manage attendance
  - Enter and update student marks
  - Request leaves
  - View announcements
  
- **Student Features**:
  - View attendance percentage
  - View results and CGPA
  - Request leaves
  - View announcements

### Advanced Features
- **Leave Management System**:
  - Multiple leave types (Casual, Sick, Earned, Emergency, Study)
  - Leave request workflow with approval/rejection
  - Admin dashboard for leave management
  
- **Attendance Tracking**:
  - Bulk attendance marking
  - Attendance percentage calculation
  - View attendance records
  
- **Marks Management**:
  - Multiple exam types (Midterm, Endterm, Quiz, Assignment)
  - CGPA calculation
  - Grade assignment
  
- **Announcements**:
  - Role-based announcements
  - Priority levels
  - Department-specific announcements

- **Data Visualization**:
  - Attendance statistics
  - CGPA tracking
  - Leave statistics

## Technical Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs

### Frontend
- **Library**: React 18
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **UI Components**: Custom CSS
- **Charts**: Chart.js with react-chartjs-2
- **Icons**: React Icons

## Deployment

### Frontend Deployment (Vercel)
1. Push code to GitHub
2. Connect GitHub repository to Vercel
3. Set environment variables:
   ```
   REACT_APP_API_URL=<your-backend-url>
   ```
4. Deploy

### Backend Deployment (Render)
1. Push code to GitHub
2. Connect repository to Render
3. Set environment variables:
   ```
   MONGODB_URI=<your-mongodb-connection-string>
   JWT_SECRET=<your-secret-key>
   NODE_ENV=production
   ```
4. Deploy

## Installation & Setup

### Prerequisites
- Node.js (v14+)
- MongoDB
- Git

### Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/college-erp?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
PORT=5000
NODE_ENV=development
```

Run the server:
```bash
npm start
# or for development with auto-reload
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
```

Create `.env` file:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

Run the application:
```bash
npm start
```

## Project Structure

```
college-erp/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Department.js
│   │   ├── Course.js
│   │   ├── Attendance.js
│   │   ├── Marks.js
│   │   ├── Announcement.js
│   │   └── Leave.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── departments.js
│   │   ├── attendance.js
│   │   ├── marks.js
│   │   ├── announcements.js
│   │   └── leaves.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── departmentController.js
│   │   ├── attendanceController.js
│   │   ├── marksController.js
│   │   ├── announcementController.js
│   │   └── leaveController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Admin/
│   │   │   │   ├── AdminHome.js
│   │   │   │   ├── UserManagement.js
│   │   │   │   ├── DepartmentManagement.js
│   │   │   │   └── LeaveManagement.js
│   │   │   ├── Faculty/
│   │   │   │   ├── FacultyHome.js
│   │   │   │   ├── AttendanceManagement.js
│   │   │   │   ├── MarksManagement.js
│   │   │   │   └── LeaveRequest.js
│   │   │   ├── Student/
│   │   │   │   ├── StudentHome.js
│   │   │   │   ├── ViewAttendance.js
│   │   │   │   ├── ViewMarks.js
│   │   │   │   ├── ViewAnnouncements.js
│   │   │   │   └── LeaveRequest.js
│   │   │   ├── Sidebar.js
│   │   │   ├── Card.js
│   │   │   ├── Modal.js
│   │   │   └── PrivateRoute.js
│   │   ├── pages/
│   │   │   ├── Login.js
│   │   │   ├── AdminDashboard.js
│   │   │   ├── FacultyDashboard.js
│   │   │   └── StudentDashboard.js
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── userService.js
│   │   │   ├── departmentService.js
│   │   │   ├── attendanceService.js
│   │   │   ├── marksService.js
│   │   │   ├── announcementService.js
│   │   │   └── leaveService.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── styles/
│   │   │   └── variables.css
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   ├── package.json
│   └── .env
│
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users` - Get all users
- `GET /api/users/role/:role` - Get users by role
- `GET /api/users/:id` - Get single user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `PATCH /api/users/:id/status` - Update user status

### Departments
- `POST /api/departments` - Create department (Admin only)
- `GET /api/departments` - Get all departments
- `GET /api/departments/:id` - Get single department
- `PUT /api/departments/:id` - Update department (Admin only)
- `DELETE /api/departments/:id` - Delete department (Admin only)

### Attendance
- `POST /api/attendance` - Create attendance record (Faculty/Admin)
- `POST /api/attendance/bulk` - Bulk create attendance (Faculty/Admin)
- `GET /api/attendance` - Get all attendance
- `GET /api/attendance/student/:studentId` - Get student attendance
- `GET /api/attendance/course/:courseId` - Get course attendance
- `PUT /api/attendance/:id` - Update attendance (Faculty/Admin)
- `DELETE /api/attendance/:id` - Delete attendance (Faculty/Admin)

### Marks
- `POST /api/marks` - Create marks (Faculty/Admin)
- `GET /api/marks` - Get all marks
- `GET /api/marks/student/:studentId` - Get student marks
- `GET /api/marks/course/:courseId` - Get course marks
- `PUT /api/marks/:id` - Update marks (Faculty/Admin)
- `DELETE /api/marks/:id` - Delete marks (Faculty/Admin)

### Announcements
- `POST /api/announcements` - Create announcement (Admin/Faculty)
- `GET /api/announcements` - Get all announcements
- `GET /api/announcements/role/:role` - Get announcements by role
- `GET /api/announcements/:id` - Get single announcement
- `PUT /api/announcements/:id` - Update announcement (Admin/Faculty)
- `DELETE /api/announcements/:id` - Delete announcement (Admin/Faculty)

### Leaves
- `POST /api/leaves` - Apply for leave
- `GET /api/leaves` - Get all leaves (Admin only)
- `GET /api/leaves/pending` - Get pending leaves (Admin only)
- `GET /api/leaves/my-leaves` - Get user's leaves
- `GET /api/leaves/user/:userId` - Get user's leaves (Admin only)
- `GET /api/leaves/:id` - Get single leave
- `PATCH /api/leaves/:id/approve` - Approve leave (Admin)
- `PATCH /api/leaves/:id/reject` - Reject leave (Admin)
- `PUT /api/leaves/:id` - Update leave
- `DELETE /api/leaves/:id` - Delete leave

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@college.com | admin123 |
| Faculty | faculty@college.com | faculty123 |
| Student | student@college.com | student123 |

## Future Enhancements

1. **Courses Management**: Create and manage courses
2. **Time Table**: Generate and display timetables
3. **Fees Management**: Online fee payment system
4. **Library Management**: Book issue/return system
5. **Exam Schedule**: Automated exam scheduling
6. **Result Analysis**: Advanced analytics and reports
7. **Mobile App**: React Native mobile application
8. **Email Notifications**: Automated email alerts
9. **SMS Notifications**: SMS for important updates
10. **Data Export**: Export records to PDF/Excel

## License

This project is open source and available under the MIT License.

## Support

For support, email support@collegeerp.com or create an issue in the GitHub repository.

## Contributing

Contributions are welcome! Please fork the repository and create a pull request.

## Authors

- Development Team
- College ERP Contributors

---

**Version**: 1.0.0
**Last Updated**: 2024