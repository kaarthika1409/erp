import axios from 'axios';

// ✅ Use your live Render backend URL
const API_BASE_URL = 'https://erp-6-xp5w.onrender.com'; // updated to your deployed backend

// ✅ Create axios instance
const api = axios.create({
  baseURL: `${API_BASE_URL}/api`, // all requests go to /api/*
  withCredentials: true, // allow cookies if needed
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ✅ Request Interceptor — attach JWT token if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn('⚠️ No auth token found in localStorage');
    }
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// ✅ Response Interceptor — handle 401 or token expiry
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle token expiry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshResponse = await api.post('/auth/refresh-token');
        if (refreshResponse.status === 200) {
          const { token } = refreshResponse.data;
          localStorage.setItem('token', token);
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error('🔴 Token refresh failed:', refreshError);
        localStorage.removeItem('token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Log detailed error info for debugging
    console.error('🚨 API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });

    // If unauthorized, force logout
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }

    return Promise.reject(
      error.response?.data?.error || error.message || 'An unknown error occurred'
    );
  }
);

export default api;


