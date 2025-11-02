const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ✅ Allowed origins (add your Vercel frontend link later)
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5000',
  'https://erp-clg.vercel.app/login' // Replace with actual deployed frontend URL
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like Postman or mobile apps)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  credentials: true,
  maxAge: 86400 // 24 hours
};

// ✅ Apply CORS and JSON parsing middleware
app.options('*', cors(corsOptions));
app.use(cors(corsOptions));
app.use(express.json());

// ✅ Load all Mongoose models
require('./models');

// ✅ MongoDB Connection using Atlas URI from environment variable
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('✅ MongoDB Atlas connected successfully');

    // ✅ Routes
    app.use('/api/auth', require('./routes/auth'));
    app.use('/api/users', require('./routes/users'));
    app.use('/api/departments', require('./routes/departments'));
    app.use('/api/attendance', require('./routes/attendance'));
    app.use('/api/marks', require('./routes/marks'));
    app.use('/api/announcements', require('./routes/announcements'));
    app.use('/api/courses', require('./routes/courseRoutes'));
    app.use('/api/leaves', require('./routes/leaves'));

    // ✅ Basic health route
    app.get('/', (req, res) => {
      res.json({ message: 'College ERP System API is running ✅' });
    });

    // ✅ Error handler (keep at the bottom)
    app.use((err, req, res, next) => {
      console.error('🔥 Error:', err.stack);
      res.status(500).json({ error: err.message });
    });

    // ✅ Start the server
    const PORT = process.env.PORT || 5001;
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

    // ✅ Handle server errors
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`⚠️ Port ${PORT} is already in use. Please stop the other process or use a different port.`);
      } else {
        console.error('Server error:', error);
      }
      process.exit(1);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB Atlas connection error:', err);
    process.exit(1);
  });
