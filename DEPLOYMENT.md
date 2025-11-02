# Deployment Guide - College ERP System

## Table of Contents
1. [Backend Deployment (Render)](#backend-deployment-render)
2. [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
3. [Database Setup (MongoDB Atlas)](#database-setup-mongodb-atlas)
4. [Environment Variables](#environment-variables)
5. [Post-Deployment](#post-deployment)

## Backend Deployment (Render)

### Step 1: Prepare GitHub Repository
```bash
# Push your backend code to GitHub
git add .
git commit -m "Initial commit"
git push origin main
```

### Step 2: Deploy on Render
1. Go to [render.com](https://render.com)
2. Sign up or log in with GitHub
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Configure deployment settings:
   - **Name**: `college-erp-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. Click "Advanced" to add environment variables

### Step 3: Add Environment Variables
In Render dashboard, add these environment variables:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/college-erp?retryWrites=true&w=majority
JWT_SECRET=your_very_secure_random_string_here
PORT=5000
NODE_ENV=production
```

### Step 4: Deploy
Click "Deploy" and wait for deployment to complete.
Your backend URL will be: `https://college-erp-backend.onrender.com`

## Frontend Deployment (Vercel)

### Step 1: Prepare Frontend Code
```bash
# In frontend directory
npm run build
```

### Step 2: Deploy on Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up or log in with GitHub
3. Click "Add New..." → "Project"
4. Import your GitHub repository
5. Configure settings:
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`

### Step 3: Add Environment Variables
In Vercel project settings → Environment Variables:
```
REACT_APP_API_URL=https://college-erp-backend.onrender.com/api
```

### Step 4: Deploy
Click "Deploy" and wait for completion.
Your frontend URL will be: `https://college-erp.vercel.app`

## Database Setup (MongoDB Atlas)

### Step 1: Create MongoDB Atlas Account
1. Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Sign up with email or Google
3. Create a new organization and project

### Step 2: Create Cluster
1. Click "Create" → Choose free tier (M0)
2. Select your preferred region
3. Click "Create Cluster"
4. Wait for cluster to be ready

### Step 3: Create Database User
1. Go to "Database Access"
2. Click "Add New Database User"
3. Enter username and password
4. Enable "Read and write to any database"
5. Click "Add User"

### Step 4: Whitelist IP Address
1. Go to "Network Access"
2. Click "Add IP Address"
3. Select "Allow Access from Anywhere" (for development)
4. For production, add specific IPs

### Step 5: Get Connection String
1. Click "Connect" on your cluster
2. Select "Connect your application"
3. Copy the connection string
4. Replace username, password, and database name

**Connection String Format**:
```
mongodb+srv://username:password@cluster.mongodb.net/college-erp?retryWrites=true&w=majority
```

## Environment Variables

### Backend (.env)
```env
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/college-erp?retryWrites=true&w=majority

# JWT
JWT_SECRET=your_super_secret_key_min_32_characters_long

# Server
PORT=5000
NODE_ENV=production
```

### Frontend (.env)
```env
REACT_APP_API_URL=https://college-erp-backend.onrender.com/api
```

## Post-Deployment

### Step 1: Test the Application
1. Visit your Vercel URL
2. Try logging in with demo credentials
3. Test each role's functionality

### Step 2: Create Initial Data
```bash
# SSH into Render backend or use MongoDB Atlas interface
# Create initial departments, courses, and users
```

### Step 3: Monitor Performance
1. Check Render logs for errors
2. Monitor MongoDB usage
3. Set up error tracking (e.g., Sentry)

### Step 4: Security Checklist
- [ ] Change JWT_SECRET to a strong random value
- [ ] Update MongoDB credentials
- [ ] Enable SSL/TLS
- [ ] Configure CORS properly
- [ ] Set up HTTPS
- [ ] Use strong database credentials
- [ ] Enable database backups
- [ ] Set up monitoring and alerts

### Step 5: Enable CI/CD
Both Render and Vercel automatically redeploy on GitHub push:
- Push code to main branch → Auto deploy
- Monitor deployment status in dashboard

## Troubleshooting

### Backend Issues
```
# Check logs on Render
# Look for connection errors, missing env variables, etc.
```

### Frontend Issues
```
# Check browser console for errors
# Verify REACT_APP_API_URL is correct
# Check CORS settings on backend
```

### Database Connection Issues
```
# Verify connection string in MONGODB_URI
# Check IP whitelist in MongoDB Atlas
# Verify database user credentials
```

### SSL Certificate Issues
```
# Both Render and Vercel provide free SSL
# Should be automatic, check certificate status
```

## Performance Optimization

1. **Caching**: Enable caching headers in production
2. **Database Indexing**: Add indexes for frequently queried fields
3. **CDN**: Vercel uses CDN automatically
4. **Compression**: Enable gzip compression
5. **Image Optimization**: Optimize images before deployment

## Backup & Recovery

### MongoDB Backups
1. Enable automatic backups in MongoDB Atlas
2. Set backup frequency to daily
3. Keep minimum 7-day backup retention

### Database Export
```bash
# Export database
mongoexport --uri "mongodb+srv://username:password@cluster.mongodb.net/college-erp" --collection users --out users.json

# Import database
mongoimport --uri "mongodb+srv://username:password@cluster.mongodb.net/college-erp" --collection users --file users.json
```

## Scaling for Growth

1. **Increase MongoDB Storage**: Upgrade cluster tier
2. **Add Read Replicas**: For better performance
3. **Implement Caching**: Use Redis for frequently accessed data
4. **API Rate Limiting**: Prevent abuse
5. **Load Balancing**: Use multiple backend instances

---

For detailed documentation on each platform:
- [Render Docs](https://render.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com)