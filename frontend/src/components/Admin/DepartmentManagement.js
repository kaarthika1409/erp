import React, { useState, useEffect } from 'react';
import departmentService from '../../services/departmentService';
import './DepartmentManagement.css';

const DepartmentManagement = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch departments on component mount
  useEffect(() => {
    fetchDepartments();
  }, []);

  // Fetch all departments
  const fetchDepartments = async () => {
    try {
      console.log('Fetching departments...');
      setLoading(true);
      setError('');
      
      // Make a direct fetch call to debug the response
      const response = await fetch('http://localhost:5000/api/departments', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const departments = await response.json();
      console.log('Raw departments API response:', departments);
      
      // Ensure we always set an array, even if empty
      const departmentsList = Array.isArray(departments) ? departments : [];
      console.log('Processed departments list:', departmentsList);
      
      setDepartments(departmentsList);
      
    } catch (error) {
      console.error('Error fetching departments:', {
        error: error,
        message: error.message
      });
      setError('Failed to load departments. Please refresh the page or try again later.');
      setDepartments([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name.trim() || !formData.code.trim()) {
      setError('Name and Code are required fields');
      return;
    }

    // Validate code format (uppercase letters and numbers only)
    const codeRegex = /^[A-Z0-9]+$/;
    if (!codeRegex.test(formData.code)) {
      setError('Code must contain only uppercase letters and numbers');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      setSuccess('');
      
      // Prepare department data
      const departmentData = {
        name: formData.name.trim(),
        code: formData.code.trim().toUpperCase(),
        description: formData.description?.trim() || ''
      };
      
      console.log('Creating department with data:', departmentData);
      
      const createdDept = await departmentService.createDepartment(departmentData);
      console.log('Department created:', createdDept);
      
      // Reset form and show success message
      setFormData({ name: '', code: '', description: '' });
      setSuccess('Department created successfully!');
      setShowModal(false);
      
      // Wait a bit before refreshing to ensure the backend has processed the request
      setTimeout(async () => {
        await fetchDepartments();
      }, 500);
      
    } catch (error) {
      console.error('Error creating department:', error);
      setError(error.message || 'Failed to create department. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle department deletion
  const handleDeleteDepartment = async (id) => {
    if (!window.confirm('Are you sure you want to delete this department? This action cannot be undone.')) {
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      
      await departmentService.deleteDepartment(id);
      
      // Update the UI by removing the deleted department
      setDepartments(prevDepartments => 
        prevDepartments.filter(dept => dept._id !== id)
      );
      
      setSuccess('Department deleted successfully!');
      
    } catch (error) {
      console.error('Error deleting department:', error);
      setError(error.message || 'Failed to delete department. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render department rows
  const renderDepartmentRows = () => {
    if (loading) {
      return (
        <tr>
          <td colSpan="4" className="text-center">
            <div className="d-flex justify-content-center align-items-center">
              <div className="spinner-border spinner-border-sm me-2" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              Loading departments...
            </div>
          </td>
        </tr>
      );
    }

    if (departments.length === 0) {
      return (
        <tr>
          <td colSpan="4" className="text-center">
            No departments found. Click 'Add Department' to create one.
          </td>
        </tr>
      );
    }

    return departments.map((dept) => (
      <tr key={dept._id}>
        <td>{dept.name}</td>
        <td>{dept.code}</td>
        <td>{dept.description || '-'}</td>
        <td>
          <button 
            onClick={() => handleDeleteDepartment(dept._id)}
            className="btn btn-danger btn-sm"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Deleting...' : 'Delete'}
          </button>
        </td>
      </tr>
    ));
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Department Management</h2>
        <button 
          className="btn btn-primary"
          onClick={() => {
            setError('');
            setSuccess('');
            setShowModal(true);
          }}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Processing...' : 'Add Department'}
        </button>
      </div>

      {error && (
        <div className="alert alert-danger d-flex align-items-center" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          <div>{error}</div>
        </div>
      )}
      
      {success && (
        <div className="alert alert-success d-flex align-items-center" role="alert">
          <i className="bi bi-check-circle-fill me-2"></i>
          <div>{success}</div>
        </div>
      )}

      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>Name</th>
              <th>Code</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {renderDepartmentRows()}
          </tbody>
        </table>
      </div>

      {/* Add Department Modal */}
      {showModal && (
        <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New Department</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowModal(false)}
                  disabled={isSubmitting}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">Department Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="form-control"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g., Computer Science"
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="code" className="form-label">Department Code *</label>
                    <input
                      type="text"
                      id="code"
                      name="code"
                      className="form-control"
                      value={formData.code}
                      onChange={handleInputChange}
                      placeholder="e.g., CS"
                      required
                      disabled={isSubmitting}
                    />
                    <div className="form-text">Use uppercase letters and numbers only</div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <textarea
                      id="description"
                      name="description"
                      className="form-control"
                      rows="3"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Optional department description"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Creating...' : 'Create Department'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentManagement;