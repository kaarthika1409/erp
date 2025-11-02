const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/departmentController');
const { auth, authorize } = require('../middleware/auth');

router.post('/', auth, authorize('admin'), departmentController.createDepartment);
router.get('/', auth, departmentController.getAllDepartments);
router.get('/:id', auth, departmentController.getDepartment);
router.put('/:id', auth, authorize('admin'), departmentController.updateDepartment);
router.delete('/:id', auth, authorize('admin'), departmentController.deleteDepartment);

module.exports = router;