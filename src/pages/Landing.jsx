import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';

const Landing = () => {
  return (
    <div className="hero bg-grid">
      <div className="container">
        <div className="hero-content">
          <h1>
            Learn Anything. <br />
            Teach Everything. <br />
            Earn Time.
          </h1>
          <p className="hero-subtitle">
            Connect with skilled individuals, exchange knowledge, and earn time credits through meaningful skill sharing
          </p>
          <div className="hero-buttons">
            <Link to="/signup">
              <Button variant="primary" size="lg">
                Get Started
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg">
                Join Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      <div className="container mt-4">
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-number">Growing</span>
            <span className="stat-label">Active Learners</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">Many</span>
            <span className="stat-label">Skills Available</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">Countless</span>
            <span className="stat-label">Learning Hours</span>
          </div>
        </div>
      </div>
      
      <div className="container mt-4">
        <div className="grid grid-cols-3">
          <div className="card text-center">
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📚</div>
            <h3>Share Your Skills</h3>
            <p>Teach what you know and help others grow their expertise</p>
          </div>
          <div className="card text-center">
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎯</div>
            <h3>Learn New Skills</h3>
            <p>Find experts who can teach you exactly what you want to learn</p>
          </div>
          <div className="card text-center">
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏱️</div>
            <h3>Earn Time Credits</h3>
            <p>Get credits for teaching and spend them to learn from others</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
