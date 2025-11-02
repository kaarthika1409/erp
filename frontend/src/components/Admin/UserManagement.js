import React, { useState, useEffect } from 'react';
import userService from '../../services/userService';
import departmentService from '../../services/departmentService';
import Card from '../Card';
import Modal from '../Modal';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  
  // Debug log to check modal state
  useEffect(() => {
    console.log('Modal state changed:', showModal);
  }, [showModal]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    department: '',
    enrollmentNumber: '',
    employeeId: '',
    semester: ''
  });

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([fetchUsers(), fetchDepartments()]);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await userService.getAllUsers();
      setUsers(response.data || []);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to fetch users');
      setUsers([]);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await departmentService.getAllDepartments();
      setDepartments(response.data || []);
    } catch (err) {
      console.error('Failed to fetch departments:', err);
      setDepartments([]);
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await userService.deleteUser(id);
        setSuccess('User deleted successfully');
        fetchUsers();
      } catch (err) {
        setError('Failed to delete user');
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await userService.updateUserStatus(id, newStatus);
      setSuccess('User status updated');
      fetchUsers();
    } catch (err) {
      setError('Failed to update user status');
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setSuccess('');
      setLoading(true);

      // Basic validation
      if (!formData.email || !formData.email.includes('@')) {
        throw new Error('Please enter a valid email address');
      }

      if (!formData.password) {
        throw new Error('Password is required');
      }

      const userData = {
        name: formData.name,
        email: formData.email, // Make sure email is included
        password: formData.password,
        role: formData.role,
        department: formData.department || undefined,
        ...(formData.role === 'student' && {
          enrollmentNumber: formData.enrollmentNumber,
          semester: formData.semester ? parseInt(formData.semester) : undefined
        }),
        ...(formData.role === 'faculty' && {
          employeeId: formData.employeeId
        })
      };

      console.log('Creating user with data:', userData);

      const response = await userService.createUser(userData);
      console.log('User created successfully:', response);
      
      setSuccess('User created successfully');
      setShowModal(false);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'student',
        department: '',
        enrollmentNumber: '',
        employeeId: '',
        semester: ''
      });
      
      // Refresh user list
      await fetchUsers();
    } catch (err) {
      console.error('Error creating user:', {
        error: err,
        response: err.response?.data,
        status: err.response?.status
      });
      setError(err.response?.data?.message || err.message || 'Failed to create user');
    }
  };

  const handleRoleChange = (role) => {
    setFormData({
      ...formData,
      role,
      enrollmentNumber: role === 'student' ? formData.enrollmentNumber : '',
      employeeId: role === 'faculty' ? formData.employeeId : '',
      semester: role === 'student' ? formData.semester : ''
    });
  };

  if (isLoading) {
    return <div className="loading">Loading users...</div>;
  }

  return (
    <div>
      <Card title="User Management">
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <div className="mb-4">
          <button
            onClick={(e) => {
              e.preventDefault();
              console.log('Add New User button clicked');
              setShowModal(true);
            }}
            className="btn btn-primary"
            style={{ zIndex: 1100 }} // Ensure button is clickable
          >
            Add New User
          </button>
        </div>

        {users.length === 0 ? (
          <p>No users found</p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>
                      <select
                        value={user.status}
                        onChange={(e) => handleStatusChange(user._id, e.target.value)}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </td>
                    <td>
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="btn btn-danger btn-small"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal 
        isOpen={showModal} 
        onClose={() => {
          console.log('Closing modal');
          setShowModal(false);
        }} 
        title="Create New User"
      >
        <form onSubmit={handleCreateUser}>
          <div className="form-group">
            <label htmlFor="name">Name (Username)</label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="Enter full name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              placeholder="Enter email address"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              placeholder="Enter password"
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select
              id="role"
              value={formData.role}
              onChange={(e) => handleRoleChange(e.target.value)}
              required
            >
              <option value="student">Student</option>
              <option value="faculty">Faculty</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="department">Department</label>
            <select
              id="department"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              required
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept._id} value={dept._id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          {formData.role === 'student' && (
            <>
              <div className="form-group">
                <label htmlFor="enrollmentNumber">Enrollment Number</label>
                <input
                  type="text"
                  id="enrollmentNumber"
                  value={formData.enrollmentNumber}
                  onChange={(e) => setFormData({ ...formData, enrollmentNumber: e.target.value })}
                  required
                  placeholder="Enter enrollment number"
                />
              </div>

              <div className="form-group">
                <label htmlFor="semester">Semester</label>
                <input
                  type="number"
                  id="semester"
                  value={formData.semester}
                  onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                  required
                  min="1"
                  max="8"
                  placeholder="Enter semester"
                />
              </div>
            </>
          )}

          {formData.role === 'faculty' && (
            <div className="form-group">
              <label htmlFor="employeeId">Employee ID</label>
              <input
                type="text"
                id="employeeId"
                value={formData.employeeId}
                onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                required
                placeholder="Enter employee ID"
              />
            </div>
          )}

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              Create User
            </button>
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default UserManagement;