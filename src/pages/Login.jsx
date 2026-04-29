import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { api } from '../services/api';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const navigate = useNavigate();

  // Gmail validation function
  const validateGmail = (email) => {
    if (!email) return false;
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    return gmailRegex.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setFieldErrors({});

    // Validate Gmail format
    if (!validateGmail(formData.email)) {
      setFieldErrors({ email: 'Only valid Gmail addresses are allowed (must end with @gmail.com)' });
      setLoading(false);
      return;
    }

    try {
      const response = await api.login(formData);
      const { user, token } = response.data;
      
      // Store token
      localStorage.setItem('skillsync_token', token);
      localStorage.setItem('skillsync_user', JSON.stringify(user));
      
      onLogin(user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="card" style={{ maxWidth: '400px', margin: '0 auto' }}>
        <div className="card-header text-center">
          <h2 className="card-title">Welcome Back</h2>
          <p className="card-description">Sign in to your SkillSync account</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email (Gmail only)</label>
            <input
              type="email"
              name="email"
              className={`form-input ${fieldErrors.email ? 'error' : ''}`}
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your Gmail address (username@gmail.com)"
              required
            />
            {fieldErrors.email && (
              <div className="error-message">
                {fieldErrors.email}
              </div>
            )}
          </div>
          
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-input"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>
          
          {error && (
            <div style={{ 
              color: '#dc2626', 
              fontSize: '14px', 
              marginBottom: '16px',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}
          
          <Button 
            type="submit" 
            variant="primary" 
            size="lg"
            loading={loading}
            style={{ width: '100%' }}
          >
            Log in
          </Button>
        </form>
        
        <div className="text-center mt-4">
          <p>
            Don't have an account?{' '}
            <Link to="/signup" style={{ color: '#facc15', fontWeight: '600' }}>
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
