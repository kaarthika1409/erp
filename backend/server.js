const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ✅ Allow only your deployed frontend (Vercel)
const allowedOrigins = [
  'https://clgerp.vercel.app' // your correct Vercel frontend URL
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`❌ CORS blocked request from: ${origin}`);
      callback(new Error('CORS not allowed from this origin'), false);
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  credentials: true,
  maxAge: 86400
};

// ✅ Apply middleware
app.use(cors(corsOptions));
app.use(express.json());

// ✅ MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
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

  // ✅ Health check route
  app.get('/', (req, res) => {
    res.json({ message: 'College ERP System API is running ✅' });
  });

  // ✅ Global error handler
  app.use((err, req, res, next) => {
    console.error('🔥 Error:', err.stack);
    res.status(500).json({ error: err.message });
  });

  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
})
.catch((err) => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

