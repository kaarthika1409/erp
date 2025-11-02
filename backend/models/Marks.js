const mongoose = require('mongoose');

const MarksSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  faculty: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  examType: {
    type: String,
    enum: ['midterm', 'endterm', 'quiz', 'assignment'],
    required: true
  },
  marksObtained: {
    type: Number,
    required: true
  },
  totalMarks: {
    type: Number,
    required: true
  },
  percentage: {
    type: Number
  },
  grade: {
    type: String,
    enum: ['A', 'B', 'C', 'D', 'F'],
    required: true
  },
  remarks: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Calculate percentage before saving
MarksSchema.pre('save', function(next) {
  this.percentage = (this.marksObtained / this.totalMarks) * 100;
  next();
});

module.exports = mongoose.model('Marks', MarksSchema);