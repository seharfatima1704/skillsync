import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

const Sessions = ({ user }) => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchSessions();
    }
  }, [user]);

  const fetchSessions = async () => {
    try {
      // Get accepted requests (these become sessions)
      const response = await api.getRequests(user.id, 'received');
      const acceptedRequests = response.data.filter(request => request.status === 'accepted');
      
      // Transform requests into session format
      const sessions = acceptedRequests.map(request => ({
        id: request.id,
        partnerName: request.senderName,
        partnerEmail: request.senderEmail || `${request.senderName.toLowerCase().replace(' ', '.')}@gmail.com`,
        partnerLinkedin: request.senderLinkedin || `https://linkedin.com/in/${request.senderName.toLowerCase().replace(' ', '')}`,
        skills: request.skills || [],
        status: 'accepted',
        acceptedAt: request.updatedAt || request.createdAt,
        scheduledDate: null
      }));
      
      setSessions(sessions);
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="container mt-4">
        <div className="card text-center">
          <h3>Please log in to view your sessions</h3>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="loading">Loading sessions...</div>
      </div>
    );
  }

  return (
    <div className="container mt-4 bg-dots">
      <div className="mb-4">
        <h1>Your Sessions</h1>
        <p>Connect with your accepted skill exchange partners</p>
      </div>
      
      {sessions.length === 0 ? (
        <div className="card text-center">
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🤝</div>
          <h3>No active sessions</h3>
          <p>Start by finding matches and sending connection requests</p>
        </div>
      ) : (
        <div className="grid grid-cols-2">
          {sessions.map(session => (
            <div key={session.id} className="card">
              <div className="card-header">
                <h3 className="card-title">{session.partnerName}</h3>
                <p className="card-description">
                  Accepted {new Date(session.acceptedAt).toLocaleDateString()}
                </p>
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '8px' }}>
                  Skills to Exchange:
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {session.skills.map(skill => (
                    <span 
                      key={skill}
                      className="skill-tag"
                      style={{ background: '#facc15', color: '#1f2937' }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              {session.scheduledDate ? (
                <div style={{ 
                  background: '#f0fdf4', 
                  padding: '12px', 
                  borderRadius: '8px',
                  marginBottom: '16px',
                  border: '1px solid #bbf7d0'
                }}>
                  <p style={{ 
                    color: '#166534', 
                    fontWeight: '600',
                    margin: '0'
                  }}>
                    📅 Scheduled: {new Date(session.scheduledDate).toLocaleDateString()}
                  </p>
                </div>
              ) : (
                <div style={{ 
                  background: '#fef3c7', 
                  padding: '12px', 
                  borderRadius: '8px',
                  marginBottom: '16px',
                  border: '1px solid #fde68a'
                }}>
                  <p style={{ 
                    color: '#92400e', 
                    fontWeight: '600',
                    margin: '0'
                  }}>
                    ⏰ Not yet scheduled
                  </p>
                </div>
              )}
              
              <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '16px' }}>
                <p style={{ 
                  color: '#6b7280', 
                  fontSize: '14px',
                  marginBottom: '12px',
                  textAlign: 'center'
                }}>
                  Contact via email or LinkedIn to schedule session
                </p>
                
                <div style={{ display: 'flex', gap: '12px' }}>
                  <a 
                    href={`mailto:${session.partnerEmail}`}
                    className="btn btn-primary"
                    style={{ 
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      flex: 1,
                      justifyContent: 'center'
                    }}
                  >
                    📧 Email
                  </a>
                  
                  <a 
                    href={session.partnerLinkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary"
                    style={{ 
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      flex: 1,
                      justifyContent: 'center'
                    }}
                  >
                    💼 LinkedIn
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="card mt-4">
        <div className="card-header">
          <h3 className="card-title">Session Tips</h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '8px' }}>
              📞 Before the Session
            </h4>
            <ul style={{ color: '#6b7280', paddingLeft: '20px' }}>
              <li>Confirm time and format (in-person/video)</li>
              <li>Discuss specific learning goals</li>
              <li>Prepare any materials</li>
            </ul>
          </div>
          
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '8px' }}>
              ⏰ During the Session
            </h4>
            <ul style={{ color: '#6b7280', paddingLeft: '20px' }}>
              <li>Be respectful of each other's time</li>
              <li>Focus on practical learning</li>
              <li>Take notes for future reference</li>
            </ul>
          </div>
          
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '8px' }}>
              ✅ After the Session
            </h4>
            <ul style={{ color: '#6b7280', paddingLeft: '20px' }}>
              <li>Provide feedback on the experience</li>
              <li>Follow up with additional questions</li>
              <li>Consider future skill exchanges</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sessions;
