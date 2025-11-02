# Quick Start Guide - College ERP System

## 🚀 Get Running in 5 Minutes

### Step 1: Backend Setup (Terminal 1)
```bash
cd backend
npm install
npm run dev
```
✅ Backend running at `http://localhost:5000`

### Step 2: Frontend Setup (Terminal 2)
```bash
cd frontend
npm install
npm start
```
✅ Frontend running at `http://localhost:3000`

### Step 3: Login
Use these demo credentials:
- **Admin**: admin@college.com / admin123
- **Faculty**: faculty@college.com / faculty123
- **Student**: student@college.com / student123

---

## 📁 Important Files to Configure

### Backend
```
backend/.env (required)
- MONGODB_URI=your_connection_string
- JWT_SECRET=your_secret_key
```

### Frontend
```
frontend/.env (required)
- REACT_APP_API_URL=http://localhost:5000/api
```

---

## 🎯 What Each Role Can Do

### 👨‍💼 Admin
- Manage users (create, update, delete)
- Manage departments
- Approve/reject leave requests
- View system statistics

### 👨‍🏫 Faculty
- Mark attendance
- Enter student marks
- Request leaves
- View announcements

### 👨‍🎓 Student
- View attendance
- Check marks & CGPA
- Request leaves
- View announcements

---

## 📝 Create Sample Data

### Via MongoDB Atlas/Compass:
1. Create a new database: `college-erp`
2. Insert sample departments and users

### Via API (using Postman):
1. Login to get admin token
2. Create department
3. Create users
4. Create courses

---

## 🔧 Common Commands

```bash
# Backend
cd backend && npm run dev        # Development with auto-reload
cd backend && npm start          # Production

# Frontend
cd frontend && npm start         # Development
cd frontend && npm run build     # Production build

# Database
# Check MongoDB connection in browser
# Create/view data in MongoDB Atlas
```

---

## 🌐 Deployment

### Frontend → Vercel
1. Push to GitHub
2. Import project on Vercel
3. Add `REACT_APP_API_URL` environment variable
4. Deploy

### Backend → Render
1. Push to GitHub
2. Create new Web Service on Render
3. Add environment variables (MONGODB_URI, JWT_SECRET)
4. Deploy

---

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| MongoDB connection error | Check `.env` file and connection string |
| CORS error | Verify backend is running and API URL is correct |
| Can't login | Check database has test users, verify credentials |
| Port in use | Change PORT in `.env` or kill process |
| npm install fails | Delete `node_modules` and `package-lock.json`, then reinstall |

---

## 📚 File Structure Summary

```
backend/
├── models/      (Database schemas)
├── routes/      (API endpoints)
├── controllers/ (Business logic)
└── server.js    (Main file)

frontend/
├── components/  (React components)
├── pages/       (Page components)
├── services/    (API calls)
└── App.js       (Main app)
```

---

## 🚢 Before Deployment

- [ ] Change JWT_SECRET to secure random string
- [ ] Update MongoDB credentials
- [ ] Test all features locally
- [ ] Add your college logo
- [ ] Customize colors/branding
- [ ] Set NODE_ENV=production

---

## 📞 Need Help?

1. Check SETUP.md for detailed installation
2. Check DEPLOYMENT.md for deployment steps
3. Check FOLDER_STRUCTURE.md for project layout
4. Check README.md for full documentation

---

**Happy coding! 🎉**