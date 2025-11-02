const express = require('express');
const router = express.Router();
const announcementController = require('../controllers/announcementController');
const { auth, authorize } = require('../middleware/auth');

router.post('/', auth, authorize('admin', 'faculty'), announcementController.createAnnouncement);
router.get('/', auth, announcementController.getAllAnnouncements);
router.get('/role/:role', auth, announcementController.getAnnouncementsByRole);
router.get('/:id', auth, announcementController.getAnnouncement);
router.put('/:id', auth, authorize('admin', 'faculty'), announcementController.updateAnnouncement);
router.delete('/:id', auth, authorize('admin', 'faculty'), announcementController.deleteAnnouncement);

module.exports = router;