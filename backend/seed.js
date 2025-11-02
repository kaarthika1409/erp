const mongoose = require('mongoose');
const User = require('./models/User');
const Department = require('./models/Department');
require('dotenv').config();

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Department.deleteMany({});
    console.log('Cleared existing data');

    // Create departments
    const csDept = new Department({
      name: 'Computer Science',
      code: 'CS',
      description: 'Department of Computer Science'
    });
    await csDept.save();

    const eeDept = new Department({
      name: 'Electrical Engineering',
      code: 'EE',
      description: 'Department of Electrical Engineering'
    });
    await eeDept.save();

    console.log('Departments created');

    // Create admin user
    const admin = new User({
      name: 'Admin User',
      email: 'admin@college.com',
      password: 'admin123',
      role: 'admin'
    });
    await admin.save();

    // Create faculty user
    const faculty = new User({
      name: 'Faculty User',
      email: 'faculty@college.com',
      password: 'faculty123',
      role: 'faculty',
      department: csDept._id,
      employeeId: 'FAC001'
    });
    await faculty.save();

    // Create student user
    const student = new User({
      name: 'Student User',
      email: 'student@college.com',
      password: 'student123',
      role: 'student',
      department: csDept._id,
      enrollmentNumber: 'STU001',
      semester: 4
    });
    await student.save();

    console.log('Users created');
    console.log('Demo credentials:');
    console.log('Admin: admin@college.com / admin123');
    console.log('Faculty: Faculty User / faculty123');
    console.log('Student: Student User / student123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
