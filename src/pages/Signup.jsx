import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import SkillTag from '../components/SkillTag';
import { api } from '../services/api';

const Signup = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    linkedin: '',
    teachSkills: [],
    learnSkills: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const navigate = useNavigate();

  const availableSkills = [
    'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'Data Science',
    'Machine Learning', 'Web Design', 'UX/UI', 'Marketing', 'Photography',
    'Writing', 'Music', 'Languages', 'Business', 'Finance', 'AWS',
    'DevOps', 'Docker', 'TypeScript', 'Vue.js', 'Angular', 'MongoDB'
  ];

  // Gmail validation function
  const validateGmail = (email) => {
    if (!email) return false;
    
    // Gmail regex: username@gmail.com
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    return gmailRegex.test(email);
  };

  // Validate email field
  const validateEmail = (email) => {
    if (!email) {
      return 'Email is required';
    }
    
    if (!validateGmail(email)) {
      return 'Only valid Gmail addresses are allowed (must end with @gmail.com)';
    }
    
    // Additional Gmail-specific checks
    const username = email.split('@')[0];
    if (username.length < 6 || username.length > 30) {
      return 'Gmail username must be 6-30 characters long';
    }
    
    if (username.startsWith('.') || username.startsWith('-')) {
      return 'Gmail username cannot start with dot or hyphen';
    }
    
    if (username.includes('..')) {
      return 'Gmail username cannot contain consecutive dots';
    }
    
    return '';
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
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const toggleSkill = (skill, type) => {
    const skills = type === 'teach' ? formData.teachSkills : formData.learnSkills;
    const setSkills = type === 'teach' ? 
      (s) => setFormData({...formData, teachSkills: s}) :
      (s) => setFormData({...formData, learnSkills: s});
    
    if (skills.includes(skill)) {
      setSkills(skills.filter(s => s !== skill));
    } else {
      setSkills([...skills, skill]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setFieldErrors({});

    // Validate Gmail format
    const emailError = validateEmail(formData.email);
    if (emailError) {
      setFieldErrors({ email: emailError });
      setLoading(false);
      return;
    }

    if (formData.name.length < 2) {
      setError('Name must be at least 2 characters long');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    if (formData.teachSkills.length === 0) {
      setError('Please select at least one skill you can teach');
      setLoading(false);
      return;
    }

    if (formData.learnSkills.length === 0) {
      setError('Please select at least one skill you want to learn');
      setLoading(false);
      return;
    }

    try {
      const response = await api.register(formData);
      const { user, token } = response.data;
      
      // Store token
      localStorage.setItem('skillsync_token', token);
      localStorage.setItem('skillsync_user', JSON.stringify(user));
      
      onLogin(user);
      navigate('/dashboard');
    } catch (err) {
      if (err.response?.status === 409) {
        setFieldErrors({ email: 'A Gmail account with this address already exists' });
      } else {
        setError(err.response?.data?.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div className="card-header text-center">
          <h2 className="card-title">Create Your Account</h2>
          <p className="card-description">Join our skill exchange community</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="name"
              className="form-input"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>
          
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
              placeholder="Create a password"
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">LinkedIn Profile (optional)</label>
            <input
              type="text"
              name="linkedin"
              className="form-input"
              value={formData.linkedin}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/yourprofile"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">
              Skills You Can Teach 
              <span style={{ color: '#dc2626', marginLeft: '4px' }}>*</span>
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
              {availableSkills.map(skill => (
                <SkillTag
                  key={`teach-${skill}`}
                  skill={skill}
                  type="teach"
                  selected={formData.teachSkills.includes(skill)}
                  onClick={() => toggleSkill(skill, 'teach')}
                />
              ))}
            </div>
            {formData.teachSkills.length === 0 && (
              <div style={{ color: '#dc2626', fontSize: '14px', marginTop: '4px' }}>
                Please select at least one skill
              </div>
            )}
          </div>
          
          <div className="form-group">
            <label className="form-label">
              Skills You Want to Learn 
              <span style={{ color: '#dc2626', marginLeft: '4px' }}>*</span>
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
              {availableSkills.map(skill => (
                <SkillTag
                  key={`learn-${skill}`}
                  skill={skill}
                  type="learn"
                  selected={formData.learnSkills.includes(skill)}
                  onClick={() => toggleSkill(skill, 'learn')}
                />
              ))}
            </div>
            {formData.learnSkills.length === 0 && (
              <div style={{ color: '#dc2626', fontSize: '14px', marginTop: '4px' }}>
                Please select at least one skill
              </div>
            )}
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
            Create Account
          </Button>
        </form>
        
        <div className="text-center mt-4">
          <p>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#facc15', fontWeight: '600' }}>
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
