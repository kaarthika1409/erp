import api from './api';

const attendanceService = {
  // Get attendance records
  getAttendance: async (filters = {}) => {
    try {
      const response = await api.get('/attendance', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error fetching attendance:', error);
      throw error.response?.data || error.message;
    }
  },

  // Create attendance record
  createAttendance: async (attendanceData) => {
    try {
      const response = await api.post('/attendance', attendanceData);
      return response.data;
    } catch (error) {
      console.error('Error creating attendance:', error);
      throw error.response?.data || error.message;
    }
  },

  // Bulk create attendance
  bulkCreateAttendance: async (attendanceData) => {
    try {
      console.log('Sending attendance data:', attendanceData); // Debug log
      const response = await api.post('/api/attendance/bulk', attendanceData);
      return response.data;
    } catch (error) {
      console.error('Error in bulk attendance creation:', error);
      throw error.response?.data || error.message;
    }
  },

  // Update attendance record
  updateAttendance: async (id, updates) => {
    try {
      const response = await api.put(`/attendance/${id}`, updates);
      return response.data;
    } catch (error) {
      console.error('Error updating attendance:', error);
      throw error.response?.data || error.message;
    }
  },

  // Delete attendance record
  deleteAttendance: async (id) => {
    try {
      const response = await api.delete(`/attendance/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting attendance:', error);
      throw error.response?.data || error.message;
    }
  },

  // Get attendance by course
  getAttendanceByCourse: async (courseId) => {
    try {
      const response = await api.get(`/api/attendance/course/${courseId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching course attendance:', error);
      throw error.response?.data || error.message;
    }
  },

  // Get attendance by student
  getAttendanceByStudent: async (studentId) => {
    try {
      const response = await api.get(`/api/attendance/student/${studentId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching student attendance:', error);
      throw error.response?.data || error.message;
    }
  }
};

export default attendanceService;