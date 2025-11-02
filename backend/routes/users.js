const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { auth, authorize } = require('../middleware/auth');

router.get('/', auth, userController.getAllUsers);
router.get('/role/:role', auth, userController.getUsersByRole);
router.get('/department/:departmentId', auth, userController.getUsersByDepartment);
router.get('/:id', auth, userController.getUser);
router.put('/:id', auth, userController.updateUser);
router.delete('/:id', auth, authorize('admin'), userController.deleteUser);
router.patch('/:id/status', auth, authorize('admin'), userController.updateUserStatus);
router.patch('/change-password', auth, userController.changePassword);

module.exports = router;
