import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import leaveService from '../../services/leaveService';
import Card from '../Card';

const LeaveRequest = () => {
  const { user } = useContext(AuthContext);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    leaveType: 'casual',
    startDate: '',
    endDate: '',
    numberOfDays: '',
    reason: ''
  });

  useEffect(() => {
    fetchMyLeaves();
  }, []);

  const fetchMyLeaves = async () => {
    try {
      setLoading(true);
      const response = await leaveService.getMyLeaves();
      setLeaves(response.data);
    } catch (err) {
      setError('Failed to fetch leaves');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await leaveService.applyLeave(formData);
      setSuccess('Leave request submitted');
      setFormData({
        leaveType: 'casual',
        startDate: '',
        endDate: '',
        numberOfDays: '',
        reason: ''
      });
      setShowForm(false);
      fetchMyLeaves();
    } catch (err) {
      setError('Failed to submit leave request');
    }
  };

  if (loading) return <div className="loading">Loading leaves...</div>;

  return (
    <div>
      <Card title="My Leave Requests">
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <button 
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary"
          style={{ marginBottom: '20px' }}
        >
          {showForm ? '- Hide Form' : '+ Request Leave'}
        </button>

        {showForm && (
          <form onSubmit={handleSubmit} className="form-container">
            <div className="form-group">
              <label>Leave Type</label>
              <select
                value={formData.leaveType}
                onChange={(e) => setFormData({...formData, leaveType: e.target.value})}
              >
                <option value="casual">Casual</option>
                <option value="sick">Sick</option>
                <option value="earned">Earned</option>
                <option value="emergency">Emergency</option>
                <option value="study">Study</option>
              </select>
            </div>

            <div className="form-group">
              <label>Start Date</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                required
              />
            </div>

            <div className="form-group">
              <label>End Date</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                required
              />
            </div>

            <div className="form-group">
              <label>Number of Days</label>
              <input
                type="number"
                value={formData.numberOfDays}
                onChange={(e) => setFormData({...formData, numberOfDays: e.target.value})}
                required
              />
            </div>

            <div className="form-group">
              <label>Reason</label>
              <textarea
                value={formData.reason}
                onChange={(e) => setFormData({...formData, reason: e.target.value})}
                required
              />
            </div>

            <div className="form-buttons">
              <button type="submit" className="btn btn-success">Submit Request</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn btn-secondary">Cancel</button>
            </div>
          </form>
        )}

        {leaves.length === 0 ? (
          <p>No leave requests yet</p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Leave Type</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Days</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {leaves.map((leave) => (
                  <tr key={leave._id}>
                    <td>{leave.leaveType}</td>
                    <td>{new Date(leave.startDate).toLocaleDateString()}</td>
                    <td>{new Date(leave.endDate).toLocaleDateString()}</td>
                    <td>{leave.numberOfDays}</td>
                    <td>
                      <span className={`status-badge status-${leave.status}`}>
                        {leave.status}
                      </span>
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

export default LeaveRequest;