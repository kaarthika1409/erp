import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import attendanceService from '../../services/attendanceService';
import courseService from '../../services/courseService';
import userService from '../../services/userService';
import { 
  Box, Button, TextField, Typography, 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Select, 
  MenuItem, FormControl, InputLabel, Alert, Snackbar
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';

const AttendanceManagement = () => {
  const { user } = useContext(AuthContext);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [courseId, setCourseId] = useState('');
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleAddRow = () => {
    setAttendanceRecords([
      ...attendanceRecords,
      { studentId: '', status: 'present', remarks: '' }
    ]);
  };

  const handleUpdateRow = (index, field, value) => {
    const newRecords = [...attendanceRecords];
    newRecords[index][field] = value;
    setAttendanceRecords(newRecords);
  };

  const handleRemoveRow = (index) => {
    setAttendanceRecords(attendanceRecords.filter((_, i) => i !== index));
  };

  // Fetch courses taught by the faculty
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await courseService.getCoursesByFaculty(user?.id);
        setCourses(response.data || []);
        if (response.data?.length > 0) {
          setCourseId(response.data[0]._id);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
        setError('Failed to load courses');
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchCourses();
    }
  }, [user?.id]);

  // Fetch students when course changes
  useEffect(() => {
    const fetchStudents = async () => {
      if (!courseId) return;
      
      try {
        setLoading(true);
        const response = await userService.getUsersByRole('student');
        setStudents(response.data || []);
      } catch (error) {
        console.error('Error fetching students:', error);
        setError('Failed to load students');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [courseId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!courseId) {
      setError('Please select a course');
      return;
    }

    if (attendanceRecords.length === 0) {
      setError('Please add at least one attendance record');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const records = attendanceRecords.map(record => ({
        course: courseId,
        student: record.studentId,
        faculty: user?.id,
        date,
        status: record.status,
        remarks: record.remarks || ''
      }));

      console.log('Submitting attendance records:', records);
      
      const response = await attendanceService.bulkCreateAttendance({ 
        attendanceRecords: records 
      });
      
      console.log('Attendance submission response:', response);
      
      setSuccess('Attendance marked successfully!');
      setAttendanceRecords([]);
    } catch (err) {
      console.error('Error submitting attendance:', err);
      setError(err.message || 'Failed to mark attendance. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>Mark Attendance</Typography>
      
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

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <TextField
              type="date"
              label="Date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
            />
            
            <FormControl fullWidth>
              <InputLabel>Course</InputLabel>
              <Select
                value={courseId}
                label="Course"
                onChange={(e) => setCourseId(e.target.value)}
                required
                disabled={loading}
              >
                {courses.map((course) => (
                  <MenuItem key={course._id} value={course._id}>
                    {course.name} ({course.code})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <Button
              variant="contained"
              onClick={handleAddRow}
              startIcon={<AddIcon />}
              disabled={!courseId || loading}
            >
              Add Student
            </Button>
          </Box>

          {attendanceRecords.length > 0 && (
            <TableContainer component={Paper} sx={{ mb: 3 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Student</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Remarks</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {attendanceRecords.map((record, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <FormControl fullWidth size="small">
                          <Select
                            value={record.studentId}
                            onChange={(e) => handleUpdateRow(index, 'studentId', e.target.value)}
                            displayEmpty
                            required
                            disabled={loading}
                          >
                            <MenuItem value="" disabled>Select Student</MenuItem>
                            {students.map((student) => (
                              <MenuItem key={student._id} value={student._id}>
                                {student.name} ({student.rollNumber || 'N/A'})
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={record.status}
                          onChange={(e) => handleUpdateRow(index, 'status', e.target.value)}
                          disabled={loading}
                          size="small"
                          fullWidth
                        >
                          <MenuItem value="present">Present</MenuItem>
                          <MenuItem value="absent">Absent</MenuItem>
                          <MenuItem value="late">Late</MenuItem>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <TextField
                          fullWidth
                          size="small"
                          value={record.remarks || ''}
                          onChange={(e) => handleUpdateRow(index, 'remarks', e.target.value)}
                          placeholder="Remarks"
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          onClick={() => handleRemoveRow(index)}
                          disabled={loading}
                          startIcon={<DeleteIcon />}
                        >
                          Remove
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Button
              variant="contained"
              type="submit"
              disabled={loading}
            >
              Submit Attendance
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default AttendanceManagement;