const express = require('express');
const router = express.Router();
const leaveController = require('../controllers/leaveController');
const { auth, authorize } = require('../middleware/auth');

router.post('/', auth, leaveController.applyLeave);
router.get('/', auth, authorize('admin'), leaveController.getAllLeaves);
router.get('/pending', auth, authorize('admin'), leaveController.getPendingLeaves);
router.get('/my-leaves', auth, leaveController.getMyLeaves);
router.get('/user/:userId', auth, authorize('admin'), leaveController.getUserLeaves);
router.get('/:id', auth, leaveController.getLeave);
router.patch('/:id/approve', auth, authorize('admin'), leaveController.approveLeave);
router.patch('/:id/reject', auth, authorize('admin'), leaveController.rejectLeave);
router.put('/:id', auth, leaveController.updateLeave);
router.delete('/:id', auth, leaveController.deleteLeave);

module.exports = router;