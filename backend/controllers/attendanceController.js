const Attendance = require('../models/Attendance');

// Create attendance record
exports.createAttendance = async (req, res) => {
  try {
    const { course, student, faculty, date, status, remarks } = req.body;

    const attendance = new Attendance({
      course,
      student,
      faculty,
      date,
      status,
      remarks
    });

    await attendance.save();
    res.status(201).json(attendance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Bulk create attendance
exports.bulkCreateAttendance = async (req, res) => {
  try {
    const { attendanceRecords } = req.body;

    const attendance = await Attendance.insertMany(attendanceRecords);
    res.status(201).json(attendance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get attendance for student
exports.getStudentAttendance = async (req, res) => {
  try {
    const { studentId } = req.params;
    
    const attendance = await Attendance.find({ student: studentId })
      .populate('course')
      .populate('faculty');
    
    // Calculate attendance percentage
    const present = attendance.filter(a => a.status === 'present').length;
    const total = attendance.length;
    const percentage = total > 0 ? (present / total) * 100 : 0;

    res.json({
      attendance,
      percentage: percentage.toFixed(2),
      total,
      present
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get attendance for course
exports.getCourseAttendance = async (req, res) => {
  try {
    const { courseId } = req.params;
    
    const attendance = await Attendance.find({ course: courseId })
      .populate('student')
      .populate('faculty');
    
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all attendance
exports.getAllAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find()
      .populate('course')
      .populate('student')
      .populate('faculty');
    
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update attendance
exports.updateAttendance = async (req, res) => {
  try {
    const { status, remarks } = req.body;
    
    let attendance = await Attendance.findById(req.params.id);
    if (!attendance) {
      return res.status(404).json({ error: 'Attendance record not found' });
    }

    if (status) attendance.status = status;
    if (remarks) attendance.remarks = remarks;

    await attendance.save();
    
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete attendance
exports.deleteAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findByIdAndDelete(req.params.id);
    
    if (!attendance) {
      return res.status(404).json({ error: 'Attendance record not found' });
    }
    
    res.json({ message: 'Attendance deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};