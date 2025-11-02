const Leave = require('../models/Leave');

// Apply for leave
exports.applyLeave = async (req, res) => {
  try {
    const { leaveType, startDate, endDate, numberOfDays, reason, attachments } = req.body;

    const leave = new Leave({
      user: req.user.id,
      leaveType,
      startDate,
      endDate,
      numberOfDays,
      reason,
      attachments
    });

    await leave.save();
    await leave.populate('user', 'name email');
    
    res.status(201).json(leave);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all leave requests
exports.getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find()
      .populate('user', 'name email role')
      .populate('approvedBy', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get pending leaves
exports.getPendingLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({ status: 'pending' })
      .populate('user', 'name email role')
      .sort({ createdAt: -1 });
    
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get user's leaves
exports.getUserLeaves = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const leaves = await Leave.find({ user: userId })
      .populate('approvedBy', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get my leaves
exports.getMyLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({ user: req.user.id })
      .populate('approvedBy', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single leave
exports.getLeave = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id)
      .populate('user', 'name email')
      .populate('approvedBy', 'name email');
    
    if (!leave) {
      return res.status(404).json({ error: 'Leave request not found' });
    }
    
    res.json(leave);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Approve leave
exports.approveLeave = async (req, res) => {
  try {
    const { remarks } = req.body;
    
    let leave = await Leave.findById(req.params.id);
    if (!leave) {
      return res.status(404).json({ error: 'Leave request not found' });
    }

    leave.status = 'approved';
    leave.approvedBy = req.user.id;
    if (remarks) leave.remarks = remarks;
    leave.updatedAt = new Date();

    await leave.save();
    
    res.json(leave);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Reject leave
exports.rejectLeave = async (req, res) => {
  try {
    const { remarks } = req.body;
    
    let leave = await Leave.findById(req.params.id);
    if (!leave) {
      return res.status(404).json({ error: 'Leave request not found' });
    }

    leave.status = 'rejected';
    leave.approvedBy = req.user.id;
    if (remarks) leave.remarks = remarks;
    leave.updatedAt = new Date();

    await leave.save();
    
    res.json(leave);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update leave
exports.updateLeave = async (req, res) => {
  try {
    const { leaveType, startDate, endDate, numberOfDays, reason } = req.body;
    
    let leave = await Leave.findById(req.params.id);
    if (!leave) {
      return res.status(404).json({ error: 'Leave request not found' });
    }

    if (leave.status !== 'pending') {
      return res.status(400).json({ error: 'Cannot update approved or rejected leave' });
    }

    if (leaveType) leave.leaveType = leaveType;
    if (startDate) leave.startDate = startDate;
    if (endDate) leave.endDate = endDate;
    if (numberOfDays) leave.numberOfDays = numberOfDays;
    if (reason) leave.reason = reason;

    await leave.save();
    
    res.json(leave);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete leave
exports.deleteLeave = async (req, res) => {
  try {
    const leave = await Leave.findByIdAndDelete(req.params.id);
    
    if (!leave) {
      return res.status(404).json({ error: 'Leave request not found' });
    }
    
    res.json({ message: 'Leave request deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};