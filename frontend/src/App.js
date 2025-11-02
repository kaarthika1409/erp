import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import FacultyDashboard from './pages/FacultyDashboard';
import StudentDashboard from './pages/StudentDashboard';
import PrivateRoute from './components/PrivateRoute';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          
          <Route 
            path="/admin/*" 
            element={<PrivateRoute requiredRole="admin"><AdminDashboard /></PrivateRoute>} 
          />
          <Route 
            path="/faculty/*" 
            element={<PrivateRoute requiredRole="faculty"><FacultyDashboard /></PrivateRoute>} 
          />
          <Route 
            path="/student/*" 
            element={<PrivateRoute requiredRole="student"><StudentDashboard /></PrivateRoute>} 
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;