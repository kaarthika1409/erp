import axios from 'axios';

// ✅ Use your Render backend API URL here
const API_BASE_URL = 'https://erp-kh8t.vercel.app/'; // <-- change this to your actual Render backend URL

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for cookies/sessions
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn('No auth token found in localStorage');
      // Optional redirect if not logged in
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle 401 Unauthorized errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;

    // Handle expired token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      return api.post('/auth/refresh-token')
        .then((response) => {
          if (response.status === 200) {
            const { token } = response.data;
            localStorage.setItem('token', token);
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          }
        })
        .catch((refreshError) => {
          console.error('Token refresh failed:', refreshError);
          localStorage.removeItem('token');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        });
    }

    // General error handler
    const errorMessage = error.response?.data?.error || error.message || 'An error occurred';
    console.error('API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });

    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      if (!window.location.pathname.includes('login')) {
        window.location.href = '/login';
      }
    }

    return Promise.reject(errorMessage);
  }
);

export default api;
