const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const { auth, authorize } = require('../middleware/auth');

router.post('/', auth, authorize('faculty', 'admin'), attendanceController.createAttendance);
router.post('/bulk', auth, authorize('faculty', 'admin'), attendanceController.bulkCreateAttendance);
router.get('/', auth, attendanceController.getAllAttendance);
router.get('/student/:studentId', auth, attendanceController.getStudentAttendance);
router.get('/course/:courseId', auth, attendanceController.getCourseAttendance);
router.put('/:id', auth, authorize('faculty', 'admin'), attendanceController.updateAttendance);
router.delete('/:id', auth, authorize('faculty', 'admin'), attendanceController.deleteAttendance);

module.exports = router;