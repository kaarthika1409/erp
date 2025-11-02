import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import attendanceService from '../../services/attendanceService';
import Card from '../Card';

const ViewAttendance = () => {
  const { user } = useContext(AuthContext);
  const [attendance, setAttendance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.id) {
      fetchAttendance();
    }
  }, [user?.id]);

  const fetchAttendance = async () => {
    try {
      const response = await attendanceService.getStudentAttendance(user?.id);
      setAttendance(response.data);
    } catch (err) {
      setError('Failed to fetch attendance');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading attendance...</div>;

  return (
    <div>
      <Card title="My Attendance">
        {error && <div className="error-message">{error}</div>}

        {attendance && (
          <>
            <div style={{ marginBottom: '20px' }}>
              <h3>Overall Attendance: {attendance.percentage}%</h3>
              <p>Present: {attendance.present} / Total: {attendance.total}</p>
            </div>

            {attendance.attendance.length === 0 ? (
              <p>No attendance records found</p>
            ) : (
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Course</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendance.attendance.map((record) => (
                      <tr key={record._id}>
                        <td>{record.course?.name}</td>
                        <td>{new Date(record.date).toLocaleDateString()}</td>
                        <td>
                          <span className={`status-badge status-${record.status}`}>
                            {record.status}
                          </span>
                        </td>
                        <td>{record.remarks || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
};

export default ViewAttendance;