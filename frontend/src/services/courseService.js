import api from './api';

const courseService = {
  // Get all courses
  getAllCourses: async () => {
    try {
      const response = await api.get('/courses');
      return { data: response.data };
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw error.response?.data || error.message;
    }
  },

  // Get courses by department
  getCoursesByDepartment: async (departmentId) => {
    try {
      const response = await api.get(`/courses/department/${departmentId}`);
      return { data: response.data };
    } catch (error) {
      console.error('Error fetching department courses:', error);
      throw error.response?.data || error.message;
    }
  },

  // Get courses by faculty
  getCoursesByFaculty: async (facultyId) => {
    try {
      const response = await api.get(`/courses/faculty/${facultyId}`);
      return { data: response.data };
    } catch (error) {
      console.error('Error fetching faculty courses:', error);
      throw error.response?.data || error.message;
    }
  },

  // Create a new course
  createCourse: async (courseData) => {
    try {
      const response = await api.post('/courses', courseData);
      return { data: response.data };
    } catch (error) {
      console.error('Error creating course:', error);
      throw error.response?.data || error.message;
    }
  },

  // Update a course
  updateCourse: async (id, courseData) => {
    try {
      const response = await api.put(`/courses/${id}`, courseData);
      return { data: response.data };
    } catch (error) {
      console.error('Error updating course:', error);
      throw error.response?.data || error.message;
    }
  },

  // Delete a course
  deleteCourse: async (id) => {
    try {
      const response = await api.delete(`/courses/${id}`);
      return { data: response.data };
    } catch (error) {
      console.error('Error deleting course:', error);
      throw error.response?.data || error.message;
    }
  },

  // Assign faculty to course
  assignFaculty: async (courseId, facultyId) => {
    try {
      const response = await api.put(`/courses/${courseId}/assign-faculty`, { facultyId });
      return { data: response.data };
    } catch (error) {
      console.error('Error assigning faculty to course:', error);
      throw error.response?.data || error.message;
    }
  }
};

export default courseService;
