const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// CORS Configuration
const allowedOrigins = ['http://localhost:3000', 'http://localhost:5000'];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar'],
  credentials: true,
  maxAge: 86400 // 24 hours
};

// Enable pre-flight across-the-board
app.options('*', cors(corsOptions));

// Apply CORS to all routes
app.use(cors(corsOptions));
app.use(express.json());

// First load all models
require('./models');

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected');
    
    // Initialize routes
    app.use('/api/auth', require('./routes/auth'));
    app.use('/api/users', require('./routes/users'));
    app.use('/api/departments', require('./routes/departments'));
    app.use('/api/attendance', require('./routes/attendance'));
    app.use('/api/marks', require('./routes/marks'));
    app.use('/api/announcements', require('./routes/announcements'));
    app.use('/api/courses', require('./routes/courseRoutes'));
    app.use('/api/leaves', require('./routes/leaves'));
    
    // Basic route
    app.get('/', (req, res) => {
      res.json({ message: 'College ERP System API' });
    });
    
    // Error handling middleware (should be the last middleware)
    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).json({ error: err.message });
    });
    
    // Start the server
    const PORT = process.env.PORT || 5001;
    const server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
    
    // Handle server errors
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Please stop the other process or use a different port.`);
      } else {
        console.error('Server error:', error);
      }
      process.exit(1);
    });
    
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });