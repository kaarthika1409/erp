import React, { useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import { FiHome, FiBarChart2, FiEye, FiBell, FiCalendar } from 'react-icons/fi';
import StudentHome from '../components/Student/StudentHome';
import ViewAttendance from '../components/Student/ViewAttendance';
import ViewMarks from '../components/Student/ViewMarks';
import ViewAnnouncements from '../components/Student/ViewAnnouncements';
import LeaveRequest from '../components/Student/LeaveRequest';
import './Dashboard.css';

const StudentDashboard = () => {
  const { user } = useContext(AuthContext);

  const menuItems = [
    { path: '/student', label: 'Home', icon: <FiHome /> },
    { path: '/student/attendance', label: 'View Attendance', icon: <FiEye /> },
    { path: '/student/marks', label: 'View Results', icon: <FiBarChart2 /> },
    { path: '/student/announcements', label: 'Announcements', icon: <FiBell /> },
    { path: '/student/leaves', label: 'Leave Request', icon: <FiCalendar /> },
  ];

  return (
    <div className="dashboard">
      <Sidebar role="student" menuItems={menuItems} />
      <div className="main-content">
        <div className="dashboard-header">
          <h1>Student Dashboard</h1>
          <p>Welcome, {user?.name}</p>
        </div>
        
        <Routes>
          <Route path="/" element={<StudentHome />} />
          <Route path="/attendance" element={<ViewAttendance />} />
          <Route path="/marks" element={<ViewMarks />} />
          <Route path="/announcements" element={<ViewAnnouncements />} />
          <Route path="/leaves" element={<LeaveRequest />} />
        </Routes>
      </div>
    </div>
  );
};

export default StudentDashboard;