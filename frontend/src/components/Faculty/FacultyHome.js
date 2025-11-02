import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import courseService from '../../services/courseService';
import { 
  Box, 
  Typography, 
  Card, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  CircularProgress, 
  Alert, 
  Button 
} from '@mui/material';

const FacultyHome = () => {
  const { user } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        if (!user?._id) {
          console.error('No user ID found in user object:', user);
          setError('User not properly authenticated. Please log in again.');
          return;
        }
        
        setLoading(true);
        setError('');
        
        console.log('🔍 Fetching courses for faculty ID:', user._id);
        const response = await courseService.getCoursesByFaculty(user._id);
        
        console.log('📦 Courses API Response:', response);
        
        // Handle different response formats
        let coursesData = [];
        if (Array.isArray(response)) {
          coursesData = response; // Direct array response
        } else if (response && Array.isArray(response.data)) {
          coursesData = response.data; // Response with data array
        } else if (response?.data === null || response?.data?.length === 0) {
          console.log('No courses found for this faculty');
          // Don't set error here, just show empty state
        } else {
          console.warn('Unexpected API response format:', response);
          throw new Error('Unexpected response format from server');
        }
        
        console.log('✅ Processed courses data:', coursesData);
        setCourses(coursesData || []);
        
      } catch (err) {
        console.error('❌ Error fetching courses:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
          stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
        
        let errorMessage = 'Failed to load courses. ';
        if (err.response?.status === 404) {
          errorMessage = 'Faculty record not found. Please contact support.';
        } else if (err.response?.data?.message) {
          errorMessage = err.response.data.message;
        } else {
          errorMessage += err.message || 'Please try again later.';
        }
        
        setError(errorMessage);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    // Fetch courses when component mounts or when user changes
    if (user?._id) {
      console.log('User ID detected, fetching courses...');
      fetchCourses();
    } else {
      console.log('No user ID found, cannot fetch courses');
      setError('User information not available. Please log in again.');
      setLoading(false);
    }
  }, [user?._id]); // Changed from user?.id to user?._id

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>Faculty Dashboard</Typography>
      
      <Card title={`Welcome, ${user?.name || 'Faculty'}`}>
        <Typography>You can manage your courses, mark attendance, and handle student records from this dashboard.</Typography>
      </Card>

      <Box sx={{ mt: 3 }}>
        <Card title="My Courses">
          {loading ? (
            <Box display="flex" flexDirection="column" alignItems="center" p={4}>
              <CircularProgress size={40} thickness={4} />
              <Typography variant="body1" sx={{ mt: 2, color: 'text.secondary' }}>
                Loading your courses...
              </Typography>
              <Typography variant="caption" color="textSecondary" sx={{ mt: 1 }}>
                Fetching course information from the server
              </Typography>
            </Box>
          ) : error ? (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 2,
                '& .MuiAlert-message': { width: '100%' }
              }}
            >
              <Box>
                <Typography variant="subtitle1" fontWeight="bold">Couldn't Load Courses</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>{error}</Typography>
                
                <Box sx={{ mt: 2, p: 2, bgcolor: 'rgba(0,0,0,0.05)', borderRadius: 1 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    <strong>Debug Information:</strong>
                  </Typography>
                  <Box component="pre" sx={{ 
                    fontSize: '0.75rem', 
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    fontFamily: 'monospace',
                    margin: 0
                  }}>
                    User ID: {user?._id || 'Not available'}
                  </Box>
                </Box>
                
                <Button 
                  variant="outlined" 
                  size="small" 
                  onClick={() => window.location.reload()}
                  sx={{ mt: 2 }}
                >
                  Retry Loading
                </Button>
              </Box>
            </Alert>
          ) : courses.length === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Box sx={{ maxWidth: 400, mx: 'auto' }}>
                <img 
                  src="/images/no-courses.svg" 
                  alt="No courses" 
                  style={{ width: 200, marginBottom: 16 }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
                <Typography variant="h6" gutterBottom>
                  No Courses Assigned
                </Typography>
                <Typography variant="body1" color="textSecondary" paragraph>
                  You don't have any courses assigned to you yet.
                </Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                  Please contact your department administrator to get assigned to courses.
                </Typography>
                
                <Box sx={{ mt: 3, p: 2, bgcolor: 'background.default', borderRadius: 1, textAlign: 'left' }}>
                  <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ marginRight: 8 }}>🔍</span> Debug Information
                  </Typography>
                  <Box sx={{ 
                    fontFamily: 'monospace', 
                    fontSize: '0.75rem',
                    backgroundColor: 'rgba(0,0,0,0.02)',
                    p: 1,
                    borderRadius: 1,
                    maxHeight: 150,
                    overflowY: 'auto'
                  }}>
                    <div><strong>User ID:</strong> {user?._id || 'Not available'}</div>
                    <div><strong>User Role:</strong> {user?.role || 'Not available'}</div>
                    <div><strong>Department:</strong> {user?.department?.name || 'Not assigned'}</div>
                  </Box>
                </Box>
              </Box>
            </Box>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Course Code</strong></TableCell>
                    <TableCell><strong>Course Name</strong></TableCell>
                    <TableCell><strong>Department</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {courses.map((course) => {
                    const isAssigned = course.faculty?._id === user?._id || 
                                    (Array.isArray(course.faculty) && 
                                     course.faculty.some(f => f._id === user?._id));
                    
                    return (
                      <TableRow 
                        key={course._id}
                        hover 
                        sx={{ 
                          '&:hover': { cursor: 'pointer', backgroundColor: 'action.hover' },
                          backgroundColor: isAssigned ? 'rgba(25, 118, 210, 0.04)' : 'inherit'
                        }}
                        onClick={() => {
                          // Navigate to course details or attendance page
                          console.log('Viewing course:', course._id);
                        }}
                      >
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {isAssigned && (
                              <span style={{ marginRight: 8, color: '#1976d2' }}>✓</span>
                            )}
                            {course.code}
                          </Box>
                        </TableCell>
                        <TableCell>{course.name}</TableCell>
                        <TableCell>{course.department?.name || 'N/A'}</TableCell>
                        <TableCell>
                          <Button 
                            variant="outlined" 
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Navigate to mark attendance
                              console.log('Mark attendance for course:', course._id);
                            }}
                          >
                            Mark Attendance
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Card>
      </Box>

      <Box sx={{ mt: 3 }}>
        <Card title="Quick Actions">
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1, minWidth: '200px' }}>
              <Typography variant="h6">Mark Attendance</Typography>
              <Typography variant="body2">Take attendance for your courses</Typography>
            </Box>
            <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1, minWidth: '200px' }}>
              <Typography variant="h6">Enter Marks</Typography>
              <Typography variant="body2">Update student marks and grades</Typography>
            </Box>
            <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1, minWidth: '200px' }}>
              <Typography variant="h6">Leave Requests</Typography>
              <Typography variant="body2">Manage your leave applications</Typography>
            </Box>
          </Box>
        </Card>
      </Box>
    </Box>
  );
};

export default FacultyHome;