import React, { createContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Set token in localStorage and axios header
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Get current user on mount if token exists
  useEffect(() => {
    if (token) {
      fetchCurrentUser();
    }
  }, [token]);

  const fetchCurrentUser = async () => {
    try {
      setLoading(true);
      const response = await api.get('/auth/me');
      setUser(response.data);
    } catch (err) {
      console.error('Error fetching user:', err);
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Attempting login with:', { email });
      
      const response = await api.post('/auth/login', { 
        email: email.trim(),
        password: password.trim()
      });
      
      console.log('Login response:', {
        status: response.status,
        data: response.data,
        hasToken: !!(response.data && response.data.token)
      });
      
      if (response.data && response.data.token) {
        console.log('Setting token in localStorage and state');
        localStorage.setItem('token', response.data.token);
        setToken(response.data.token);
        setUser(response.data.user);
        
        // Verify token was set correctly
        const storedToken = localStorage.getItem('token');
        console.log('Token stored in localStorage:', storedToken ? 'Token exists' : 'No token found');
        
        return response.data;
      } else {
        console.error('No token in login response:', response.data);
        throw new Error('No authentication token received from server');
      }
    } catch (err) {
      console.error('Login error:', {
        error: err,
        response: err.response?.data,
        status: err.response?.status
      });
      
      let errorMsg = 'Login failed. Please check your credentials and try again.';
      
      if (err.response) {
        if (err.response.status === 401) {
          errorMsg = 'Invalid email or password';
        } else if (err.response.data?.message) {
          errorMsg = err.response.data.message;
        }
      } else if (err.message === 'Network Error') {
        errorMsg = 'Cannot connect to the server. Please check your connection.';
      }
      
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setError(null);
  };

  const value = {
    user,
    token,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!token,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};