import api from './api';

export const announcementService = {
  createAnnouncement: (data) => api.post('/announcements', data),
  getAllAnnouncements: () => api.get('/announcements'),
  getAnnouncementsByRole: (role) => api.get(`/announcements/role/${role}`),
  getAnnouncement: (id) => api.get(`/announcements/${id}`),
  updateAnnouncement: (id, data) => api.put(`/announcements/${id}`, data),
  deleteAnnouncement: (id) => api.delete(`/announcements/${id}`),
};

export default announcementService;