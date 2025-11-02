import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  MenuItem, IconButton, Snackbar, Alert, Box, Typography, CircularProgress
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import courseService from '../../services/courseService';
import departmentService from '../../services/departmentService';
import userService from '../../services/userService';

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentCourse, setCurrentCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    credits: '',
    department: '',
    faculty: '',
    semester: '',
    description: ''
  });

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [coursesRes, deptsRes] = await Promise.all([
        courseService.getAllCourses(),
        departmentService.getAllDepartments()
      ]);
      
      setCourses(coursesRes.data);
      setDepartments(deptsRes.data);
      
      // If we have departments, fetch faculties from the first department
      if (deptsRes.data.length > 0) {
        fetchFaculties(deptsRes.data[0]._id);
      }
    } catch (err) {
      setError('Failed to fetch data. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFaculties = async (departmentId) => {
    if (!departmentId) {
      setFaculties([]);
      return;
    }

    console.log('Fetching faculties for department:', departmentId);
    const res = await userService.getUsersByDepartment(departmentId);
    console.log('Faculty API response:', res);
    
    const facultyList = Array.isArray(res.data) 
      ? res.data.filter(user => user.role === 'faculty' || user.role === 'hod') 
      : [];
      
    console.log('Filtered faculty list:', facultyList);
    setFaculties(facultyList);
    
    // Reset faculty selection
    return facultyList;
  };

  const handleOpen = () => {
    setOpen(true);
    setEditMode(false);
    setFormData({
      code: '',
      name: '',
      credits: '',
      department: departments[0]?._id || '',
      faculty: '',
      semester: '1',
      description: ''
    });
  };

  const handleEdit = (course) => {
    setCurrentCourse(course);
    setEditMode(true);
    setFormData({
      code: course.code,
      name: course.name,
      credits: course.credits,
      department: course.department._id,
      faculty: course.faculty?._id || '',
      semester: course.semester.toString(),
      description: course.description || ''
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentCourse(null);
    setError('');
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;
    
    // Update form data
    const newFormData = {
      ...formData,
      [name]: value
    };
    
    setFormData(newFormData);

    // If department changes, fetch faculties for that department
    if (name === 'department') {
      console.log('Department changed to:', value);
      try {
        setLoading(true);
        await fetchFaculties(value);
      } catch (error) {
        console.error('Error fetching faculties:', error);
        setError('Failed to load faculty members. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      
      const courseData = {
        ...formData,
        credits: parseInt(formData.credits),
        semester: parseInt(formData.semester)
      };

      if (editMode && currentCourse) {
        await courseService.updateCourse(currentCourse._id, courseData);
        setSuccess('Course updated successfully');
      } else {
        await courseService.createCourse(courseData);
        setSuccess('Course created successfully');
      }
      
      fetchData();
      handleClose();
    } catch (err) {
      setError(err.message || 'Failed to save course');
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await courseService.deleteCourse(id);
        setSuccess('Course deleted successfully');
        fetchData();
      } catch (err) {
        setError('Failed to delete course');
        console.error(err);
      }
    }
  };

  const handleAssignFaculty = async (courseId, facultyId) => {
    try {
      await courseService.assignFaculty(courseId, facultyId);
      setSuccess('Faculty assigned successfully');
      fetchData();
    } catch (err) {
      setError('Failed to assign faculty');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">Course Management</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpen}
        >
          Add Course
        </Button>
      </Box>

      {/* Success/Error Messages */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {/* Courses Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Code</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Credits</TableCell>
              <TableCell>Semester</TableCell>
              <TableCell>Faculty</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {courses.length > 0 ? (
              courses.map((course) => (
                <TableRow key={course._id}>
                  <TableCell>{course.code}</TableCell>
                  <TableCell>{course.name}</TableCell>
                  <TableCell>{course.department?.name || 'N/A'}</TableCell>
                  <TableCell>{course.credits}</TableCell>
                  <TableCell>{course.semester}</TableCell>
                  <TableCell>
                    <select
                      value={course.faculty?._id || ''}
                      onChange={(e) => handleAssignFaculty(course._id, e.target.value)}
                      style={{
                        padding: '5px',
                        borderRadius: '4px',
                        border: '1px solid #ccc'
                      }}
                    >
                      <option value="">Select Faculty</option>
                      {faculties.map((faculty) => (
                        <option key={faculty._id} value={faculty._id}>
                          {faculty.name}
                        </option>
                      ))}
                    </select>
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(course)} color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(course._id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No courses found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Course Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editMode ? 'Edit Course' : 'Add New Course'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Course Code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              disabled={editMode}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Course Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              type="number"
              label="Credits"
              name="credits"
              value={formData.credits}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              select
              label="Faculty"
              name="faculty"
              value={formData.faculty || ''}
              onChange={handleChange}
              disabled={!formData.department || loading}
              helperText={!formData.department ? 'Please select a department first' : ''}
            >
              {loading ? (
                <MenuItem disabled>
                  <Box display="flex" alignItems="center" width="100%">
                    <CircularProgress size={20} style={{ marginRight: 10 }} />
                    Loading faculty...
                  </Box>
                </MenuItem>
              ) : faculties.length > 0 ? (
                faculties.map((faculty) => (
                  <MenuItem key={faculty._id} value={faculty._id}>
                    {faculty.name} ({faculty.employeeId || 'No ID'})
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>
                  No faculty found for this department
                </MenuItem>
              )}
            </TextField>
            <TextField
              margin="normal"
              required
              fullWidth
              select
              label="Semester"
              name="semester"
              value={formData.semester}
              onChange={handleChange}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                <MenuItem key={sem} value={sem}>
                  {sem}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              margin="normal"
              fullWidth
              multiline
              rows={3}
              label="Description (Optional)"
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              {editMode ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={() => setSuccess('')}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setSuccess('')} severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>
    </>
  );
};

export default CourseManagement;
