import axios from 'axios';

// ✅ Use your actual Render backend URL here (replace if different)
const API_BASE_URL = 'https://erp-5-khxf.onrender.com'; // no spaces, correct base URL

// Create axios instance
const api = axios.create({
  baseURL: `${API_BASE_URL}/api`, // ensures all requests hit your /api routes
  withCredentials: true, // needed if backend uses cookies/sessions
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// ✅ Request Interceptor — adds auth token if available
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

// ✅ Response Interceptor — handles expired tokens & errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle expired token (401 Unauthorized)
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

    // General API error handler
    const errorMessage =
      error.response?.data?.error || error.message || 'An unknown error occurred';

    console.error('🚨 API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });

    // Force logout if token is invalid or expired
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }

    return Promise.reject(errorMessage);
  }
);

export default api;

