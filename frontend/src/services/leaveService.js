import api from './api';

export const leaveService = {
  applyLeave: (data) => api.post('/leaves', data),
  getAllLeaves: () => api.get('/leaves'),
  getPendingLeaves: () => api.get('/leaves/pending'),
  getMyLeaves: () => api.get('/leaves/my-leaves'),
  getUserLeaves: (userId) => api.get(`/leaves/user/${userId}`),
  getLeave: (id) => api.get(`/leaves/${id}`),
  approveLeave: (id, data) => api.patch(`/leaves/${id}/approve`, data),
  rejectLeave: (id, data) => api.patch(`/leaves/${id}/reject`, data),
  updateLeave: (id, data) => api.put(`/leaves/${id}`, data),
  deleteLeave: (id) => api.delete(`/leaves/${id}`),
};

export default leaveService;