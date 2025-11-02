const mongoose = require('mongoose');

const AnnouncementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department'
  },
  targetRole: {
    type: String,
    enum: ['admin', 'faculty', 'student', 'all'],
    default: 'all'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  attachments: [String],
  createdAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: Date
});

module.exports = mongoose.model('Announcement', AnnouncementSchema);