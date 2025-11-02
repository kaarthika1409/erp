import api from './api';

const handleResponse = async (promise) => {
  try {
    const response = await promise;
    return response;
  } catch (error) {
    console.error('Department Service Error:', error);
    throw error;
  }
};

export const departmentService = {
  // Create a new department
  createDepartment: async (departmentData) => {
    try {
      const response = await api.post('/departments', departmentData);
      return response.data;
    } catch (error) {
      console.error('Create Department Error:', error);
      throw error;
    }
  },

  // Get all departments
  getAllDepartments: async () => {
    try {
      console.log('Fetching all departments...');
      const response = await api.get('/departments');
      console.log('Departments API response:', response.data);
      
      // Return consistent response format with data property
      return { 
        data: Array.isArray(response.data) ? response.data : [] 
      };
      
    } catch (error) {
      console.error('Get All Departments Error:', error);
      // Return consistent format even on error
      return { data: [] };
    }
  },

  // Get single department by ID
  getDepartment: async (id) => {
    try {
      const response = await api.get(`/departments/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get Department Error:', error);
      throw error;
    }
  },

  // Update department
  updateDepartment: async (id, departmentData) => {
    try {
      const response = await api.put(`/departments/${id}`, departmentData);
      return response.data;
    } catch (error) {
      console.error('Update Department Error:', error);
      throw error;
    }
  },

  // Delete department
  deleteDepartment: async (id) => {
    try {
      const response = await api.delete(`/departments/${id}`);
      return response.data;
    } catch (error) {
      console.error('Delete Department Error:', error);
      throw error;
    }
  }
};

export default departmentService;