import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import attendanceService from '../../services/attendanceService';
import marksService from '../../services/marksService';
import Card from '../Card';

const StudentHome = () => {
  const { user } = useContext(AuthContext);
  const [attendance, setAttendance] = useState(null);
  const [cgpa, setCgpa] = useState(null);

  useEffect(() => {
    if (user?.id) {
      fetchStudentData();
    }
  }, [user?.id]);

  const fetchStudentData = async () => {
    try {
      const [attRes, marksRes] = await Promise.all([
        attendanceService.getStudentAttendance(user?.id),
        marksService.getStudentMarks(user?.id)
      ]);
      setAttendance(attRes.data);
      setCgpa(marksRes.data.cgpa);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div>
      <h2 className="section-title">Student Dashboard</h2>
      
      <div className="stats-grid">
        <Card className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>Attendance</h3>
            <div className="stat-number">{attendance?.percentage || 0}%</div>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <h3>CGPA</h3>
            <div className="stat-number">{cgpa || 0}</div>
          </div>
        </Card>
      </div>

      <Card title="Your Information">
        <table style={{ width: '100%' }}>
          <tbody>
            <tr>
              <td><strong>Name:</strong></td>
              <td>{user?.name}</td>
            </tr>
            <tr>
              <td><strong>Email:</strong></td>
              <td>{user?.email}</td>
            </tr>
            <tr>
              <td><strong>Enrollment Number:</strong></td>
              <td>{user?.enrollmentNumber || 'N/A'}</td>
            </tr>
            <tr>
              <td><strong>Semester:</strong></td>
              <td>{user?.semester || 'N/A'}</td>
            </tr>
          </tbody>
        </table>
      </Card>

      <Card title="Quick Links">
        <ul>
          <li>✓ Check your attendance percentage</li>
          <li>✓ View your marks and CGPA</li>
          <li>✓ Read important announcements</li>
          <li>✓ Request leave</li>
        </ul>
      </Card>
    </div>
  );
};

export default StudentHome;