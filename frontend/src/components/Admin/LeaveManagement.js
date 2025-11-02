import React, { useState, useEffect } from 'react';
import leaveService from '../../services/leaveService';
import Card from '../Card';

const LeaveManagement = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchLeaves();
  }, [filter]);

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      let response;
      if (filter === 'pending') {
        response = await leaveService.getPendingLeaves();
      } else {
        response = await leaveService.getAllLeaves();
      }
      setLeaves(response.data);
    } catch (err) {
      setError('Failed to fetch leaves');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await leaveService.approveLeave(id, { remarks: 'Approved by Admin' });
      setSuccess('Leave approved');
      fetchLeaves();
    } catch (err) {
      setError('Failed to approve leave');
    }
  };

  const handleReject = async (id) => {
    try {
      await leaveService.rejectLeave(id, { remarks: 'Rejected by Admin' });
      setSuccess('Leave rejected');
      fetchLeaves();
    } catch (err) {
      setError('Failed to reject leave');
    }
  };

  if (loading) return <div className="loading">Loading leave requests...</div>;

  return (
    <div>
      <Card title="Leave Management">
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <div style={{ marginBottom: '20px' }}>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Leaves</option>
            <option value="pending">Pending Only</option>
          </select>
        </div>

        {leaves.length === 0 ? (
          <p>No leave requests found</p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Leave Type</th>
                  <th>From Date</th>
                  <th>To Date</th>
                  <th>Days</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {leaves.map((leave) => (
                  <tr key={leave._id}>
                    <td>{leave.user?.name}</td>
                    <td>{leave.leaveType}</td>
                    <td>{new Date(leave.startDate).toLocaleDateString()}</td>
                    <td>{new Date(leave.endDate).toLocaleDateString()}</td>
                    <td>{leave.numberOfDays}</td>
                    <td>
                      <span className={`status-badge status-${leave.status}`}>
                        {leave.status}
                      </span>
                    </td>
                    <td>
                      {leave.status === 'pending' && (
                        <div className="action-buttons">
                          <button 
                            onClick={() => handleApprove(leave._id)}
                            className="btn btn-success btn-small"
                          >
                            Approve
                          </button>
                          <button 
                            onClick={() => handleReject(leave._id)}
                            className="btn btn-danger btn-small"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default LeaveManagement;