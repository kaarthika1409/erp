const Marks = require('../models/Marks');

// Create marks
exports.createMarks = async (req, res) => {
  try {
    const { course, student, faculty, examType, marksObtained, totalMarks, grade, remarks } = req.body;

    const marks = new Marks({
      course,
      student,
      faculty,
      examType,
      marksObtained,
      totalMarks,
      grade,
      remarks
    });

    await marks.save();
    res.status(201).json(marks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get student marks
exports.getStudentMarks = async (req, res) => {
  try {
    const { studentId } = req.params;
    
    const marks = await Marks.find({ student: studentId })
      .populate('course')
      .populate('faculty');
    
    // Calculate CGPA
    let totalPoints = 0;
    let totalCredits = 0;
    
    for (let mark of marks) {
      const course = mark.course;
      const gradePoints = getGradePoints(mark.grade);
      totalPoints += gradePoints * course.credits;
      totalCredits += course.credits;
    }
    
    const cgpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0;

    res.json({
      marks,
      cgpa
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get course marks
exports.getCourseMarks = async (req, res) => {
  try {
    const { courseId } = req.params;
    
    const marks = await Marks.find({ course: courseId })
      .populate('student')
      .populate('faculty');
    
    res.json(marks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all marks
exports.getAllMarks = async (req, res) => {
  try {
    const marks = await Marks.find()
      .populate('course')
      .populate('student')
      .populate('faculty');
    
    res.json(marks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update marks
exports.updateMarks = async (req, res) => {
  try {
    const { marksObtained, grade, remarks } = req.body;
    
    let marks = await Marks.findById(req.params.id);
    if (!marks) {
      return res.status(404).json({ error: 'Marks record not found' });
    }

    if (marksObtained) marks.marksObtained = marksObtained;
    if (grade) marks.grade = grade;
    if (remarks) marks.remarks = remarks;

    await marks.save();
    
    res.json(marks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete marks
exports.deleteMarks = async (req, res) => {
  try {
    const marks = await Marks.findByIdAndDelete(req.params.id);
    
    if (!marks) {
      return res.status(404).json({ error: 'Marks record not found' });
    }
    
    res.json({ message: 'Marks deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Helper function to get grade points
function getGradePoints(grade) {
  const gradeMap = { 'A': 4.0, 'B': 3.0, 'C': 2.0, 'D': 1.0, 'F': 0.0 };
  return gradeMap[grade] || 0;
}