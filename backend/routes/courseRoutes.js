const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  getCoursesByDepartment,
  getCoursesByFaculty,
  assignFaculty
} = require('../controllers/courseController');

// Public routes
router.get('/department/:departmentId', protect, getCoursesByDepartment);
router.get('/faculty/:facultyId', protect, getCoursesByFaculty);

// Protected routes (require authentication)
router.route('/')
  .get(protect, getCourses)
  .post(protect, admin, createCourse);

router.route('/:id')
  .put(protect, admin, updateCourse)
  .delete(protect, admin, deleteCourse);

// Assign faculty to course
router.put('/:id/assign-faculty', protect, admin, assignFaculty);

module.exports = router;
