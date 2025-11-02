const Department = require('../models/Department');

// Create department
exports.createDepartment = async (req, res) => {
  try {
    const { name, code, description, headOfDepartment } = req.body;

    let dept = await Department.findOne({ code });
    if (dept) {
      return res.status(400).json({ error: 'Department already exists' });
    }

    dept = new Department({
      name,
      code,
      description,
      headOfDepartment
    });

    await dept.save();
    res.status(201).json(dept);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all departments
exports.getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find()
      .populate('headOfDepartment')
      .populate('courses');
    
    res.json(departments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single department
exports.getDepartment = async (req, res) => {
  try {
    const dept = await Department.findById(req.params.id)
      .populate('headOfDepartment')
      .populate('courses');
    
    if (!dept) {
      return res.status(404).json({ error: 'Department not found' });
    }
    
    res.json(dept);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update department
exports.updateDepartment = async (req, res) => {
  try {
    const { name, description, headOfDepartment } = req.body;
    
    let dept = await Department.findById(req.params.id);
    if (!dept) {
      return res.status(404).json({ error: 'Department not found' });
    }

    if (name) dept.name = name;
    if (description) dept.description = description;
    if (headOfDepartment) dept.headOfDepartment = headOfDepartment;

    await dept.save();
    
    res.json(dept);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete department
exports.deleteDepartment = async (req, res) => {
  try {
    const dept = await Department.findByIdAndDelete(req.params.id);
    
    if (!dept) {
      return res.status(404).json({ error: 'Department not found' });
    }
    
    res.json({ message: 'Department deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};