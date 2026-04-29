import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import SkillTag from '../components/SkillTag';
import { api } from '../services/api';

const Dashboard = ({ user }) => {
  const [credits, setCredits] = useState({ balance: 0, earned: 0, spent: 0 });
  const [loading, setLoading] = useState(true);
  const [teachSkills, setTeachSkills] = useState([]);
  const [learnSkills, setLearnSkills] = useState([]);
  const [availableSkills, setAvailableSkills] = useState([]);
  const [selectedTeachSkill, setSelectedTeachSkill] = useState('');
  const [selectedLearnSkill, setSelectedLearnSkill] = useState('');

  useEffect(() => {
    if (user) {
      fetchCredits();
      loadUserSkills();
      loadAvailableSkills();
    }
  }, [user]);

  const loadAvailableSkills = () => {
    const skills = JSON.parse(localStorage.getItem('skills')) || [];
    setAvailableSkills(skills);
  };

  const fetchCredits = async () => {
    try {
      const response = await api.getCredits(user.id);
      setCredits(response.data);
    } catch (error) {
      console.error('Failed to fetch credits:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserSkills = () => {
    const userSkills = JSON.parse(localStorage.getItem('userSkills')) || [];
    const teach = userSkills.filter(s => s.userId === user.id && s.type === 'teach');
    const learn = userSkills.filter(s => s.userId === user.id && s.type === 'learn');
    
    setTeachSkills(teach);
    setLearnSkills(learn);
  };

  const handleAddTeachSkill = () => {
    if (!selectedTeachSkill) return;
    
    const userSkills = JSON.parse(localStorage.getItem('userSkills')) || [];
    
    // Check for duplicate
    const exists = userSkills.some(s => 
      s.userId === user.id && 
      s.type === 'teach' && 
      s.skill === selectedTeachSkill
    );
    
    if (!exists) {
      const newSkill = {
        userId: user.id,
        skill: selectedTeachSkill,
        type: 'teach'
      };
      
      userSkills.push(newSkill);
      localStorage.setItem('userSkills', JSON.stringify(userSkills));
      
      // Reload skills
      loadUserSkills();
      setSelectedTeachSkill('');
    }
  };

  const handleAddLearnSkill = () => {
    if (!selectedLearnSkill) return;
    
    const userSkills = JSON.parse(localStorage.getItem('userSkills')) || [];
    
    // Check for duplicate
    const exists = userSkills.some(s => 
      s.userId === user.id && 
      s.type === 'learn' && 
      s.skill === selectedLearnSkill
    );
    
    if (!exists) {
      const newSkill = {
        userId: user.id,
        skill: selectedLearnSkill,
        type: 'learn'
      };
      
      userSkills.push(newSkill);
      localStorage.setItem('userSkills', JSON.stringify(userSkills));
      
      // Reload skills
      loadUserSkills();
      setSelectedLearnSkill('');
    }
  };

  if (!user) {
    return (
      <div className="container mt-4">
        <div className="card text-center">
          <h3>Please log in to view your dashboard</h3>
          <Link to="/login">
            <Button variant="primary" className="mt-4">
              Log in
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="loading">Loading dashboard...</div>
      </div>
    );
  }

  const userTeachSkills = teachSkills.map(s => s.skill);
  const userLearnSkills = learnSkills.map(s => s.skill);

  return (
    <div className="container mt-4 bg-dots">
      <div className="mb-4">
        <h1>Welcome back, {user.name}!</h1>
        <p>Ready to exchange skills today?</p>
      </div>
      
      <div className="stats-grid mb-4">
        <div className="stat-card">
          <span className="stat-number">{credits.balance}</span>
          <span className="stat-label">Credit Balance</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">12</span>
          <span className="stat-label">Hours Taught</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">8</span>
          <span className="stat-label">Hours Learned</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">4.8</span>
          <span className="stat-label">Average Rating</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 mb-4">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Skills You Teach</h3>
            <p className="card-description">Share your expertise with others</p>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
            {userTeachSkills.map(skill => (
              <SkillTag key={skill} skill={skill} type="teach" />
            ))}
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <select 
              value={selectedTeachSkill} 
              onChange={(e) => setSelectedTeachSkill(e.target.value)}
              style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #d1d5db' }}
            >
              <option value="">Add Teaching Skill</option>
              {availableSkills.map(skill => (
                <option key={skill} value={skill}>
                  {skill}
                </option>
              ))}
            </select>
            <Button variant="secondary" size="sm" onClick={handleAddTeachSkill}>
              Add
            </Button>
          </div>
        </div>
        
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Skills You Want to Learn</h3>
            <p className="card-description">Grow your knowledge base</p>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
            {userLearnSkills.map(skill => (
              <SkillTag key={skill} skill={skill} type="learn" />
            ))}
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <select 
              value={selectedLearnSkill} 
              onChange={(e) => setSelectedLearnSkill(e.target.value)}
              style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #d1d5db' }}
            >
              <option value="">Add Learning Skill</option>
              {availableSkills.map(skill => (
                <option key={skill} value={skill}>
                  {skill}
                </option>
              ))}
            </select>
            <Button variant="secondary" size="sm" onClick={handleAddLearnSkill}>
              Add
            </Button>
          </div>
        </div>
      </div>
      
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Quick Actions</h3>
          <p className="card-description">Get started with skill exchange</p>
        </div>
        <div className="grid grid-cols-3">
          <Link to="/matching">
            <Button variant="primary" style={{ width: '100%' }}>
              Find Matches
            </Button>
          </Link>
          <Link to="/requests">
            <Button variant="secondary" style={{ width: '100%' }}>
              View Requests
            </Button>
          </Link>
          <Link to="/credits">
            <Button variant="secondary" style={{ width: '100%' }}>
              View Credits
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
