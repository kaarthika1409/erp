import api from './api';

const handleResponse = async (promise) => {
  try {
    const response = await promise;
    return response;
  } catch (error) {
    console.error('User Service Error:', error);
    throw error;
  }
};

export const userService = {
  getAllUsers: async () => {
    try {
      const response = await api.get('/users');
      return { data: Array.isArray(response.data) ? response.data : [] };
    } catch (error) {
      console.error('Get All Users Error:', error);
      return { data: [] };
    }
  },
  
  getUsersByRole: async (role) => {
    try {
      const response = await api.get(`/users/role/${role}`);
      return { data: Array.isArray(response.data) ? response.data : [] };
    } catch (error) {
      console.error(`Get Users by Role (${role}) Error:`, error);
      return { data: [] };
    }
  },
  
  getUsersByDepartment: async (departmentId) => {
    try {
      const response = await api.get(`/users/department/${departmentId}`);
      return { data: Array.isArray(response.data) ? response.data : [] };
    } catch (error) {
      console.error(`Get Users by Department (${departmentId}) Error:`, error);
      return { data: [] };
    }
  },
  
  getUser: (id) => handleResponse(api.get(`/users/${id}`)),
  createUser: (data) => handleResponse(api.post('/auth/register', data)),
  updateUser: (id, data) => handleResponse(api.put(`/users/${id}`, data)),
  deleteUser: (id) => handleResponse(api.delete(`/users/${id}`)),
  updateUserStatus: (id, status) => handleResponse(api.patch(`/users/${id}/status`, { status })),
  changePassword: (data) => handleResponse(api.patch('/users/change-password', data)),
};

export default userService;