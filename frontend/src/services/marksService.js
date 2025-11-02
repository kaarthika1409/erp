import api from './api';

export const marksService = {
  createMarks: (data) => api.post('/marks', data),
  getAllMarks: () => api.get('/marks'),
  getStudentMarks: (studentId) => api.get(`/marks/student/${studentId}`),
  getCourseMarks: (courseId) => api.get(`/marks/course/${courseId}`),
  updateMarks: (id, data) => api.put(`/marks/${id}`, data),
  deleteMarks: (id) => api.delete(`/marks/${id}`),
};

export default marksService;