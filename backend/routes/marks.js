const express = require('express');
const router = express.Router();
const marksController = require('../controllers/marksController');
const { auth, authorize } = require('../middleware/auth');

router.post('/', auth, authorize('faculty', 'admin'), marksController.createMarks);
router.get('/', auth, marksController.getAllMarks);
router.get('/student/:studentId', auth, marksController.getStudentMarks);
router.get('/course/:courseId', auth, marksController.getCourseMarks);
router.put('/:id', auth, authorize('faculty', 'admin'), marksController.updateMarks);
router.delete('/:id', auth, authorize('faculty', 'admin'), marksController.deleteMarks);

module.exports = router;