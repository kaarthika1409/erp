const mongoose = require('mongoose');
const Course = require('../models/Course');
const User = require('../models/User');
const Department = require('../models/Department');

// Ensure models are properly loaded
if (!mongoose.models.User) {
  console.error('User model not found in mongoose.registry');
}

// @desc    Get all courses
// @route   GET /api/courses
// @access  Private
const getCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate('department', 'name')
      .populate('faculty', 'name email');
    res.json(courses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a course
// @route   POST /api/courses
// @access  Private/Admin
const createCourse = async (req, res) => {
  try {
    const { code, name, credits, department, semester, description } = req.body;

    // Check if course code already exists
    let course = await Course.findOne({ code });
    if (course) {
      return res.status(400).json({ message: 'Course with this code already exists' });
    }

    // Check if department exists
    const dept = await Department.findById(department);
    if (!dept) {
      return res.status(400).json({ message: 'Department not found' });
    }

    // Create new course
    course = new Course({
      code,
      name,
      credits,
      department,
      semester: parseInt(semester),
      description: description || ''
    });

    await course.save();
    
    // Populate the department and faculty references before sending the response
    const savedCourse = await Course.findById(course._id)
      .populate('department', 'name')
      .populate('faculty', 'name email');

    res.status(201).json(savedCourse);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update a course
// @route   PUT /api/courses/:id
// @access  Private/Admin
const updateCourse = async (req, res) => {
  try {
    const { code, name, credits, department, faculty, semester, description } = req.body;

    // Check if course exists
    let course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // If code is being updated, check if new code already exists
    if (code && code !== course.code) {
      const existingCourse = await Course.findOne({ code });
      if (existingCourse) {
        return res.status(400).json({ message: 'Course with this code already exists' });
      }
    }

    // Update course fields
    course.code = code || course.code;
    course.name = name || course.name;
    course.credits = credits || course.credits;
    course.department = department || course.department;
    course.semester = semester ? parseInt(semester) : course.semester;
    course.description = description || course.description;
    
    // Only update faculty if provided
    if (faculty) {
      course.faculty = faculty;
    }

    await course.save();
    
    // Populate the department and faculty references before sending the response
    const updatedCourse = await Course.findById(course._id)
      .populate('department', 'name')
      .populate('faculty', 'name email');

    res.json(updatedCourse);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a course
// @route   DELETE /api/courses/:id
// @access  Private/Admin
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    await course.remove();
    res.json({ message: 'Course removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get courses by department
// @route   GET /api/courses/department/:departmentId
// @access  Private
const getCoursesByDepartment = async (req, res) => {
  try {
    const courses = await Course.find({ department: req.params.departmentId })
      .populate('faculty', 'name email')
      .select('-students');
    res.json(courses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get courses by faculty
// @route   GET /api/courses/faculty/:facultyId
// @access  Private
const getCoursesByFaculty = async (req, res) => {
  try {
    const facultyId = req.params.facultyId;
    console.log('🔍 Fetching courses for faculty ID:', facultyId);
    
    // First, check if faculty exists
    // Ensure facultyId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(facultyId)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid faculty ID format',
        facultyId: facultyId
      });
    }
    
    // Find faculty user
    const faculty = await mongoose.model('User').findById(facultyId).select('name email department');
    if (!faculty) {
      console.log(`❌ Faculty with ID ${facultyId} not found`);
      return res.status(404).json({ 
        success: false,
        message: 'Faculty not found',
        facultyId: facultyId
      });
    }
    
    console.log(`✅ Faculty found: ${faculty.name} (${faculty.email})`);
    
    // Find all courses where the faculty field matches the facultyId
    // Also include courses where faculty is in the faculty array if using multiple faculty per course
    const courses = await Course.find({
      $or: [
        { faculty: facultyId },
        { faculty: { $in: [facultyId] } } // If using array of faculty
      ]
    })
    .populate('department', 'name')
    .populate('faculty', 'name email')
    .select('-students')
    .lean();
    
    console.log(`📊 Found ${courses.length} courses for faculty ${faculty.name}`);
    
    if (courses.length === 0) {
      console.log('ℹ️ No courses found for this faculty. Checking for department courses...');
      
      // If no courses assigned directly, try to find courses in the same department
      if (faculty.department) {
        const deptCourses = await Course.find({
          department: faculty.department,
          faculty: { $exists: false } // Courses not assigned to any faculty
        })
        .populate('department', 'name')
        .lean();
        
        if (deptCourses.length > 0) {
          console.log(`📚 Found ${deptCourses.length} unassigned courses in department`);
          return res.json(deptCourses);
        }
      }
      
      console.log('ℹ️ No unassigned courses found in department either');
      return res.json([]);
    }
    
    res.json(courses);
  } catch (err) {
    console.error('Error in getCoursesByFaculty:', {
      message: err.message,
      stack: err.stack,
      params: req.params,
      query: req.query
    });
    res.status(500).json({ 
      message: 'Error fetching faculty courses',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// @desc    Assign faculty to course
// @route   PUT /api/courses/:id/assign-faculty
// @access  Private/Admin
const assignFaculty = async (req, res) => {
  try {
    const { facultyId } = req.body;

    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    course.faculty = facultyId;
    await course.save();

    const updatedCourse = await Course.findById(course._id)
      .populate('department', 'name')
      .populate('faculty', 'name email');

    res.json(updatedCourse);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  getCoursesByDepartment,
  getCoursesByFaculty,
  assignFaculty
};
