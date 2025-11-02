# Setup Guide - College ERP System

This guide will help you set up and run the College ERP System locally.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js v14 or higher
- npm (comes with Node.js)
- MongoDB (local or Atlas account)
- Git
- A text editor (VS Code recommended)

## Quick Start

### 1. Clone or Extract the Project

```bash
cd /path/to/pavakie
```

### 2. Backend Setup

#### 2.1 Install Dependencies
```bash
cd backend
npm install
```

#### 2.2 Create Environment File
Create a `.env` file in the `backend` directory:

```env
# Database Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/college-erp?retryWrites=true&w=majority

# Or for local MongoDB:
# MONGODB_URI=mongodb://localhost:27017/college-erp

# JWT Secret (use a strong random string in production)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Server Port
PORT=5000

# Environment
NODE_ENV=development
```

#### 2.3 Configure MongoDB

**Option A: Use MongoDB Atlas (Cloud)**
1. Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster
4. Create a database user
5. Whitelist your IP
6. Copy the connection string
7. Paste in `.env` as `MONGODB_URI`

**Option B: Local MongoDB**
1. Install MongoDB Community Edition
2. Start MongoDB service
3. Use `mongodb://localhost:27017/college-erp` as `MONGODB_URI`

#### 2.4 Start Backend Server
```bash
# Development mode (with auto-reload)
npm run dev

# Or production mode
npm start
```

You should see:
```
Server running on port 5000
MongoDB connected
```

### 3. Frontend Setup

#### 3.1 Open New Terminal & Install Dependencies
```bash
cd frontend
npm install
```

#### 3.2 Create Environment File
Create a `.env` file in the `frontend` directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

#### 3.3 Start Frontend Development Server
```bash
npm start
```

The application will automatically open at `http://localhost:3000`

## Database Initialization

### Adding Demo Data

The system comes with demo credentials but no initial data. To add departments and users:

#### Option 1: Using MongoDB GUI
1. Use MongoDB Compass or Atlas UI
2. Create collections: users, departments, courses
3. Insert sample data

#### Option 2: Using API Calls
Use Postman or any API client:

**1. Login as Admin**
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@college.com",
  "password": "admin123"
}
```

**2. Create Department**
```
POST http://localhost:5000/api/departments
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Computer Science",
  "code": "CS",
  "description": "Department of Computer Science and Engineering"
}
```

**3. Create User**
```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@college.com",
  "password": "password123",
  "role": "student",
  "department": "<department_id>",
  "enrollmentNumber": "CS001",
  "semester": 1
}
```

## Default Credentials

| Role | Email | Password | Purpose |
|------|-------|----------|---------|
| Admin | admin@college.com | admin123 | System administration |
| Faculty | faculty@college.com | faculty123 | Mark attendance, enter marks |
| Student | student@college.com | student123 | View attendance, marks, leaves |

## Project Structure

```
pavakie/
├── backend/
│   ├── models/              # Database schemas
│   ├── routes/              # API endpoints
│   ├── controllers/         # Business logic
│   ├── middleware/          # Authentication middleware
│   ├── server.js            # Main server file
│   ├── package.json         # Dependencies
│   └── .env                 # Environment variables
│
├── frontend/
│   ├── public/              # Static files
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── context/         # React context
│   │   ├── App.js           # Main App
│   │   └── index.js         # Entry point
│   ├── package.json         # Dependencies
│   └── .env                 # Environment variables
│
├── README.md                # Project documentation
├── DEPLOYMENT.md            # Deployment guide
└── SETUP.md                 # This file
```

## API Testing

### Using Postman
1. Download [Postman](https://www.postman.com/downloads/)
2. Import the API collection:
   - Create a new collection
   - Add the endpoints mentioned in README.md
   - Set environment variables: `base_url` = `http://localhost:5000/api`

### Using cURL
```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@college.com","password":"admin123"}'

# Get departments
curl http://localhost:5000/api/departments \
  -H "Authorization: Bearer <token>"
```

## Common Issues & Solutions

### Issue: MongoDB Connection Failed
**Solution:**
- Verify MongoDB is running
- Check connection string in `.env`
- Ensure IP is whitelisted (for MongoDB Atlas)
- Check username/password are correct

### Issue: CORS Error
**Solution:**
- Ensure backend is running
- Check `REACT_APP_API_URL` is correct
- Verify frontend port is 3000

### Issue: Node Modules Error
**Solution:**
```bash
# Remove node_modules and reinstall
rm -r node_modules package-lock.json
npm install
```

### Issue: Port Already in Use
**Solution:**
```bash
# Change PORT in .env or kill process on port
# For backend:
PORT=5001

# For frontend (in package.json):
"start": "PORT=3001 react-scripts start"
```

### Issue: Frontend Won't Load
**Solution:**
1. Clear browser cache (Ctrl+Shift+Delete)
2. Restart development server
3. Check browser console for errors
4. Verify backend is running

## Features Overview

### Admin Dashboard
- Create and manage departments
- Manage all users
- Process leave requests
- View system statistics

### Faculty Dashboard
- Mark student attendance
- Enter student marks
- Request leaves
- View announcements

### Student Dashboard
- View attendance percentage
- Check marks and CGPA
- Request leaves
- View announcements

## Data Models

### User Model
- Name, Email, Password
- Role: admin, faculty, student
- Department, Enrollment Number
- Contact Information

### Department Model
- Name, Code
- Description
- Head of Department
- Courses

### Attendance Model
- Course, Student, Faculty
- Date, Status (present/absent/late)
- Remarks

### Marks Model
- Course, Student, Faculty
- Exam Type (midterm/endterm/quiz/assignment)
- Marks Obtained, Total Marks, Grade

### Leave Model
- User, Leave Type
- Start/End Date, Number of Days
- Reason, Status (pending/approved/rejected)

### Announcement Model
- Title, Content
- Created by, Target Role
- Priority (low/medium/high)

## Development Tips

1. **Use React DevTools**: Install React DevTools browser extension
2. **Use Redux DevTools**: For state management debugging
3. **Enable Logging**: Set `NODE_ENV=development` for detailed logs
4. **Use Postman**: Test API endpoints before using in frontend
5. **Check Console**: Monitor browser console for errors

## Building for Production

### Backend
```bash
cd backend
# Already production-ready
# Just deploy .env with production values
```

### Frontend
```bash
cd frontend
npm run build
# Creates optimized build in `build/` directory
# Deploy this directory to Vercel
```

## Performance Monitoring

### Useful Tools
- **MongoDB Compass**: Visual database management
- **Postman**: API testing
- **Redux DevTools**: State debugging
- **React Profiler**: Performance analysis

## Git Workflow

```bash
# Initialize git (if not already done)
git init

# Add remote repository
git remote add origin <your-github-repo-url>

# Make changes and commit
git add .
git commit -m "Your commit message"

# Push to GitHub
git push origin main
```

## Next Steps

1. ✅ Complete local setup
2. ✅ Test all features with demo credentials
3. ✅ Customize with your college data
4. ✅ Add your logo and branding
5. ✅ Deploy to production (Render + Vercel)

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review README.md and DEPLOYMENT.md
3. Check browser console for errors
4. Check server logs in terminal

## Resources

- [Node.js Documentation](https://nodejs.org/docs)
- [Express.js Guide](https://expressjs.com)
- [MongoDB Documentation](https://docs.mongodb.com)
- [React Documentation](https://react.dev)
- [JWT Introduction](https://jwt.io/introduction)

---

Happy coding! 🎉