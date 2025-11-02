import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading, error: authError } = useContext(AuthContext);
  const navigate = useNavigate();

  // Update local error state when auth context error changes
  useEffect(() => {
    if (authError) {
      setError(authError);
    }
  }, [authError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Basic validation
    if (!email.trim() || !password) {
      setError('Please enter both email and password');
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      const response = await login(email, password);
      
      // Redirect based on user role
      if (response?.user?.role) {
        switch(response.user.role.toLowerCase()) {
          case 'admin':
            navigate('/admin');
            break;
          case 'faculty':
            navigate('/faculty');
            break;
          case 'student':
            navigate('/student');
            break;
          default:
            navigate('/');
        }
      } else {
        // If no role is defined, redirect to home
        navigate('/');
      }
    } catch (err) {
      // Error is already handled in the AuthContext
      console.error('Login error in component:', err);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h1>College ERP System</h1>
          <p>Integrated Management Solution</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="alert alert-error">
              <i className="fas fa-exclamation-circle"></i>
              <span>{error}</span>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="username">Email Address</label>
            <div className="input-with-icon">
              <i className="fas fa-envelope"></i>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control"
                placeholder="Enter your email"
                disabled={loading}
                autoComplete="username"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="fas fa-lock"></i>
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control"
                placeholder="Enter your password"
                disabled={loading}
                autoComplete="current-password"
              />
              <button 
                type="button" 
                className="btn btn-outline-secondary"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                <i className={`fas fa-eye${showPassword ? '-slash' : ''}`}></i>
              </button>
            </div>
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary btn-block"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Logging in...
              </>
            ) : 'Login'}
          </button>
        </form>

        <div className="demo-credentials">
          <h3>Demo Credentials</h3>
          <div className="credential">
            <span className="role">Admin:</span>
            <span>admin@college.com / admin123</span>
          </div>
          <div className="credential">
            <span className="role">Faculty:</span>
            <span>faculty@college.com / faculty123</span>
          </div>
          <div className="credential">
            <span className="role">Student:</span>
            <span>student@college.com / student123</span>
          </div>
        </div>

        <div className="login-footer">
          <p>© {new Date().getFullYear()} College ERP. All rights reserved.</p>
          <p>Need help? <a href="mailto:support@collegeerp.com">Contact Support</a></p>
        </div>
      </div>
    </div>
  );
};

export default Login;