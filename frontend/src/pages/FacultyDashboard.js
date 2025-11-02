import React, { useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import { FiHome, FiUsers, FiBarChart2, FiCalendar } from 'react-icons/fi';
import FacultyHome from '../components/Faculty/FacultyHome';
import AttendanceManagement from '../components/Faculty/AttendanceManagement';
import MarksManagement from '../components/Faculty/MarksManagement';
import LeaveRequest from '../components/Faculty/LeaveRequest';
import './Dashboard.css';

const FacultyDashboard = () => {
  const { user } = useContext(AuthContext);

  const menuItems = [
    { path: '/faculty', label: 'Home', icon: <FiHome /> },
    { path: '/faculty/attendance', label: 'Manage Attendance', icon: <FiUsers /> },
    { path: '/faculty/marks', label: 'Manage Marks', icon: <FiBarChart2 /> },
    { path: '/faculty/leaves', label: 'Leave Request', icon: <FiCalendar /> },
  ];

  return (
    <div className="dashboard">
      <Sidebar role="faculty" menuItems={menuItems} />
      <div className="main-content">
        <div className="dashboard-header">
          <h1>Faculty Dashboard</h1>
          <p>Welcome, {user?.name}</p>
        </div>
        
        <Routes>
          <Route path="/" element={<FacultyHome />} />
          <Route path="/attendance" element={<AttendanceManagement />} />
          <Route path="/marks" element={<MarksManagement />} />
          <Route path="/leaves" element={<LeaveRequest />} />
        </Routes>
      </div>
    </div>
  );
};

export default FacultyDashboard;