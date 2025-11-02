import React, { useState, useContext } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import { FiHome, FiUsers, FiBook, FiBookOpen, FiBarChart2, FiBell, FiCalendar } from 'react-icons/fi';
import AdminHome from '../components/Admin/AdminHome';
import UserManagement from '../components/Admin/UserManagement';
import DepartmentManagement from '../components/Admin/DepartmentManagement';
import LeaveManagement from '../components/Admin/LeaveManagement';
import CourseManagement from '../components/Admin/CourseManagement';
import './Dashboard.css';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);

  const menuItems = [
    { path: '/admin', label: 'Home', icon: <FiHome /> },
    { path: '/admin/users', label: 'Manage Users', icon: <FiUsers /> },
    { path: '/admin/departments', label: 'Departments', icon: <FiBook /> },
    { path: '/admin/courses', label: 'Course Management', icon: <FiBookOpen /> },
    { path: '/admin/leaves', label: 'Leave Requests', icon: <FiCalendar /> },
  ];

  return (
    <div className="dashboard">
      <Sidebar role="admin" menuItems={menuItems} />
      <div className="main-content">
        <div className="dashboard-header">
          <h1>Admin Dashboard</h1>
          <p>Welcome, {user?.name}</p>
        </div>
        
        <Routes>
          <Route path="/" element={<AdminHome />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/departments" element={<DepartmentManagement />} />
          <Route path="/courses" element={<CourseManagement />} />
          <Route path="/leaves" element={<LeaveManagement />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;