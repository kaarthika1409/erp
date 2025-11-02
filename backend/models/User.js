const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: function() { return this.role !== 'admin'; }
  },
  email: {
    type: String,
    required: function() { return this.role === 'admin'; },
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'faculty', 'student'],
    required: true
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: function() { return this.role !== 'admin'; }
  },
  enrollmentNumber: {
    type: String,
    required: function() { return this.role === 'student'; },
    unique: true,
    sparse: true,
    default: undefined
  },
  employeeId: {
    type: String,
    required: function() { return this.role === 'faculty'; }
  },
  phone: String,
  address: String,
  semester: {
    type: Number,
    required: function() { return this.role === 'student'; }
  },
  dob: Date,
  gender: String,
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function(passwordInput) {
  return await bcrypt.compare(passwordInput, this.password);
};

module.exports = mongoose.model('User', UserSchema);