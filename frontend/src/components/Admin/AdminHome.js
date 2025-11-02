import React, { useState, useEffect } from 'react';
import { FiUsers, FiBook, FiCalendar, FiAlertCircle } from 'react-icons/fi';
import userService from '../../services/userService';
import departmentService from '../../services/departmentService';
import leaveService from '../../services/leaveService';
import Card from '../Card';
//HEELOO
const AdminHome = () => {
  const [stats, setStats] = useState({
    users: 0,
    departments: 0,
    pendingLeaves: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [usersRes, deptsRes, leavesRes] = await Promise.all([
        userService.getAllUsers(),
        departmentService.getAllDepartments(),
        leaveService.getPendingLeaves()
      ]);

      setStats({
        users: usersRes.data.length,
        departments: deptsRes.data.length,
        pendingLeaves: leavesRes.data.length
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div>
      <h2 className="section-title">Dashboard Overview</h2>
      
      <div className="stats-grid">
        <Card className="stat-card">
          <div className="stat-icon"><FiUsers /></div>
          <div className="stat-content">
            <h3>Total Users</h3>
            <div className="stat-number">{stats.users}</div>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-icon"><FiBook /></div>
          <div className="stat-content">
            <h3>Departments</h3>
            <div className="stat-number">{stats.departments}</div>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-icon"><FiCalendar /></div>
          <div className="stat-content">
            <h3>Pending Leaves</h3>
            <div className="stat-number">{stats.pendingLeaves}</div>
          </div>
        </Card>
      </div>

      <Card title="Quick Actions">
        <p>Use the menu on the left to manage users, departments, and leave requests.</p>
      </Card>
    </div>
  );
};

export default AdminHome;