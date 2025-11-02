const Announcement = require('../models/Announcement');

// Create announcement
exports.createAnnouncement = async (req, res) => {
  try {
    const { title, content, department, targetRole, priority, attachments } = req.body;

    const announcement = new Announcement({
      title,
      content,
      createdBy: req.user.id,
      department,
      targetRole,
      priority,
      attachments
    });

    await announcement.save();
    await announcement.populate('createdBy', 'name email');
    
    res.status(201).json(announcement);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all announcements
exports.getAllAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find()
      .populate('createdBy', 'name email')
      .populate('department')
      .sort({ createdAt: -1 });
    
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get announcements by role
exports.getAnnouncementsByRole = async (req, res) => {
  try {
    const { role } = req.params;
    
    const announcements = await Announcement.find({
      $or: [
        { targetRole: role },
        { targetRole: 'all' }
      ]
    })
      .populate('createdBy', 'name email')
      .populate('department')
      .sort({ createdAt: -1 });
    
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single announcement
exports.getAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('department');
    
    if (!announcement) {
      return res.status(404).json({ error: 'Announcement not found' });
    }
    
    res.json(announcement);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update announcement
exports.updateAnnouncement = async (req, res) => {
  try {
    const { title, content, priority } = req.body;
    
    let announcement = await Announcement.findById(req.params.id);
    if (!announcement) {
      return res.status(404).json({ error: 'Announcement not found' });
    }

    if (title) announcement.title = title;
    if (content) announcement.content = content;
    if (priority) announcement.priority = priority;

    await announcement.save();
    
    res.json(announcement);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete announcement
exports.deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndDelete(req.params.id);
    
    if (!announcement) {
      return res.status(404).json({ error: 'Announcement not found' });
    }
    
    res.json({ message: 'Announcement deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};