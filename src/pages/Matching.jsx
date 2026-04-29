import React, { useState, useEffect } from 'react';
import Button from '../components/Button';
import SkillTag from '../components/SkillTag';
import { api } from '../services/api';

const Matching = ({ user }) => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sendingRequest, setSendingRequest] = useState(null);

  useEffect(() => {
    if (user) {
      fetchMatches();
    }
  }, [user]);

  const fetchMatches = async () => {
    try {
      const response = await api.getMatches(user.id);
      setMatches(response.data);
    } catch (error) {
      console.error('Failed to fetch matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendRequest = async (matchId) => {
    setSendingRequest(matchId);
    try {
      const match = matches.find(m => m.id === matchId);
      await api.sendRequest({
        senderId: user.id,
        receiverId: matchId,
        message: `Hi! I'd love to learn ${match.skills[0]} from you.`,
        skills: match.skills
      });
      
      // Update UI to show request sent
      setMatches(matches.map(match => 
        match.id === matchId 
          ? { ...match, requestSent: true }
          : match
      ));
    } catch (error) {
      console.error('Failed to send request:', error);
    } finally {
      setSendingRequest(null);
    }
  };

  if (!user) {
    return (
      <div className="container mt-4">
        <div className="card text-center">
          <h3>Please log in to view matches</h3>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="loading">Finding matches...</div>
      </div>
    );
  }

  return (
    <div className="container mt-4 bg-dots">
      <div className="mb-4">
        <h1>Skill Matches</h1>
        <p>People who can teach what you want to learn</p>
      </div>
      
      {matches.length === 0 ? (
        <div className="card text-center">
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
          <h3>No matches found yet</h3>
          <p>Try adding more skills to your profile to find better matches</p>
          <Button variant="primary" className="mt-4">
            Update Skills
          </Button>
        </div>
      ) : (
        matches.map(match => (
          <div key={match.id} className="match-card">
            <div className="match-header">
              <div className="match-info">
                <h3>{match.name}</h3>
                <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
                  {match.description}
                </p>
                
                <div className="match-percentage">
                  <span style={{ fontWeight: '600', marginRight: '8px' }}>
                    {match.matchPercentage}% Match
                  </span>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${match.matchPercentage}%` }}
                    />
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '2rem', marginBottom: '1rem' }}>
                  <span>⭐ {match.rating} rating</span>
                  <span>📚 {match.hoursTaught} hours taught</span>
                </div>
                
                <div className="match-skills">
                  {match.skills.map(skill => (
                    <SkillTag key={skill} skill={skill} />
                  ))}
                </div>
              </div>
            </div>
            
            <div className="match-actions">
              <Button 
                variant="primary"
                onClick={() => handleSendRequest(match.id)}
                loading={sendingRequest === match.id}
                disabled={match.requestSent}
              >
                {match.requestSent ? 'Request Sent' : 'Request Connection'}
              </Button>
              <Button variant="secondary">
                View Profile
              </Button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Matching;
