import axios from 'axios';

// Use the full URL to the backend
const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for cookies/sessions
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add token to requests if it exists
api.interceptors.request.use(
  (config) => {
    // Always get the latest token from localStorage
    const token = localStorage.getItem('token');
    
    console.log('API Request Interceptor - Current token:', token ? 'Token exists' : 'No token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Added auth token to request headers:', {
        hasToken: !!token,
        url: config.url,
        method: config.method,
        headers: config.headers
      });
    } else {
      console.warn('No auth token found in localStorage');
      // If we're not on the login page and there's no token, redirect to login
      if (window.location.pathname !== '/login') {
        console.log('Redirecting to login...');
        window.location.href = '/login';
      }
    }
    
    console.log('Making request to:', config.method?.toUpperCase(), config.url);
    if (config.data) {
      console.log('Request data:', config.data);
    }
    
    // Log the final config being sent
    console.log('Request config:', {
      url: config.url,
      method: config.method,
      headers: config.headers,
      withCredentials: config.withCredentials
    });
    
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle 401 Unauthorized errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and we haven't tried to refresh the token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log('Token expired, attempting to refresh...');
      
      // Prevent infinite loops
      originalRequest._retry = true;
      
      // Try to refresh the token
      return api.post('/auth/refresh-token')
        .then(response => {
          if (response.status === 200) {
            const { token } = response.data;
            localStorage.setItem('token', token);
            
            // Update the Authorization header
            originalRequest.headers.Authorization = `Bearer ${token}`;
            
            // Retry the original request with the new token
            return api(originalRequest);
          }
        })
        .catch(refreshError => {
          console.error('Failed to refresh token:', refreshError);
          // If refresh token fails, redirect to login
          if (window.location.pathname !== '/login') {
            localStorage.removeItem('token');
            window.location.href = '/login';
          }
          return Promise.reject(refreshError);
        });
    }
    
    // If the error is not 401 or we've already tried to refresh, just reject
    return Promise.reject(error);
  }
);

// Handle responses
api.interceptors.response.use(
  (response) => {
    console.log('Response from', response.config.url, ':', response.data);
    return response;
  },
  (error) => {
    const errorMessage = error.response?.data?.error || error.message || 'An error occurred';
    
    console.error('API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // Only redirect if not already on login page
      if (!window.location.pathname.includes('login')) {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(errorMessage);
  }
);

export default api;