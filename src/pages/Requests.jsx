import React, { useState, useEffect } from 'react';
import Button from '../components/Button';
import SkillTag from '../components/SkillTag';
import { api } from '../services/api';

const Requests = ({ user }) => {
  const [activeTab, setActiveTab] = useState('received');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);
  const [completedRequests, setCompletedRequests] = useState(new Set());

  useEffect(() => {
    if (user) {
      fetchRequests();
    }
  }, [user, activeTab]);

  // Listen for storage changes to update UI when switching users
  useEffect(() => {
    const handleStorageChange = () => {
      if (user) {
        fetchRequests();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom events from user switching
    window.addEventListener('userSwitched', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userSwitched', handleStorageChange);
    };
  }, [user]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await api.getRequests(user.id, activeTab);
      setRequests(response.data);
    } catch (error) {
      console.error('Failed to fetch requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (requestId) => {
    setProcessing(requestId);
    try {
      await api.acceptRequest(requestId);
      
      // Update UI
      setRequests(requests.map(request => 
        request.id === requestId 
          ? { ...request, status: 'accepted' }
          : request
      ));
    } catch (error) {
      console.error('Failed to accept request:', error);
    } finally {
      setProcessing(null);
    }
  };

  const handleRejectRequest = async (requestId) => {
    setProcessing(requestId);
    try {
      await api.rejectRequest(requestId);
      
      // Update UI
      setRequests(requests.map(request => 
        request.id === requestId 
          ? { ...request, status: 'rejected' }
          : request
      ));
    } catch (error) {
      console.error('Failed to reject request:', error);
    } finally {
      setProcessing(null);
    }
  };

  const handleCompleteRequest = async (requestId) => {
    setProcessing(requestId);
    try {
      await api.completeRequest(requestId);
      
      // Update UI
      setRequests(requests.map(request => 
        request.id === requestId 
          ? { ...request, status: 'completed' }
          : request
      ));
      
      // Add to completed requests set to show credit transfer button
      setCompletedRequests(prev => new Set(prev).add(requestId));
      
      // Show success message
      alert('Session completed! You can now transfer credits.');
    } catch (error) {
      console.error('Failed to complete request:', error);
      alert('Failed to complete session. Please try again.');
    } finally {
      setProcessing(null);
    }
  };

  const handleTransferCredit = async (requestId) => {
    setProcessing(requestId);
    try {
      const request = requests.find(req => req.id === requestId);
      if (!request) {
        throw new Error('Request not found');
      }
      
      // Check if credit already given
      if (request.creditGiven) {
        alert('Credit already transferred for this request!');
        return;
      }
      
      // Determine who is the learner (sender) and who is the teacher (receiver)
      // Current user is the one viewing this page
      const fromUserId = activeTab === 'sent' ? request.senderId : request.receiverId;
      const toUserId = activeTab === 'sent' ? request.receiverId : request.senderId;
      
      await api.transferCredits(fromUserId, toUserId);
      
      // Update the request in local state to show credit given
      setRequests(requests.map(req => 
        req.id === requestId 
          ? { ...req, creditGiven: true }
          : req
      ));
      
      // Remove from completed requests set after successful transfer
      setCompletedRequests(prev => {
        const newSet = new Set(prev);
        newSet.delete(requestId);
        return newSet;
      });
      
      // Refresh user credits
      if (window.refreshUserCredits) {
        window.refreshUserCredits();
      }
      
      alert('Credit transferred successfully!');
    } catch (error) {
      console.error('Failed to transfer credit:', error);
      alert('Failed to transfer credit. Please try again.');
    } finally {
      setProcessing(null);
    }
  };

  if (!user) {
    return (
      <div className="container mt-4">
        <div className="card text-center">
          <h3>Please log in to view requests</h3>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="loading">Loading requests...</div>
      </div>
    );
  }

  const receivedRequests = requests.filter(req => activeTab === 'received');
  const sentRequests = requests.filter(req => activeTab === 'sent');
  const displayRequests = activeTab === 'received' ? receivedRequests : sentRequests;

  return (
    <div className="container mt-4">
      <div className="mb-4">
        <h1>Connection Requests</h1>
        <p>Manage your skill exchange requests</p>
      </div>
      
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'received' ? 'active' : ''}`}
          onClick={() => setActiveTab('received')}
        >
          Received ({receivedRequests.length})
        </button>
        <button 
          className={`tab ${activeTab === 'sent' ? 'active' : ''}`}
          onClick={() => setActiveTab('sent')}
        >
          Sent ({sentRequests.length})
        </button>
      </div>
      
      {displayRequests.length === 0 ? (
        <div className="card text-center">
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
            {activeTab === 'received' ? '📥' : '📤'}
          </div>
          <h3>No {activeTab} requests</h3>
          <p>
            {activeTab === 'received' 
              ? 'You haven\'t received any connection requests yet'
              : 'You haven\'t sent any connection requests yet'
            }
          </p>
          {activeTab === 'sent' && (
            <Button variant="primary" className="mt-4">
              Find Matches
            </Button>
          )}
        </div>
      ) : (
        displayRequests.map(request => (
          <div key={request.id} className="request-card">
            <div className="request-header">
              <div className="request-info">
                <h3>
                  {activeTab === 'received' ? request.senderName : request.receiverName}
                </h3>
                <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
                  {request.message}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '1rem' }}>
                  {request.skills.map(skill => (
                    <SkillTag key={skill} skill={skill} />
                  ))}
                </div>
                <small style={{ color: '#9ca3af' }}>
                  {new Date(request.createdAt).toLocaleDateString()} at{' '}
                  {new Date(request.createdAt).toLocaleTimeString()}
                </small>
              </div>
              <span className={`request-status status-${request.status}`}>
                {request.status}
              </span>
            </div>
            
            {request.status === 'pending' && activeTab === 'received' && (
              <div className="request-actions">
                <Button 
                  variant="primary"
                  onClick={() => handleAcceptRequest(request.id)}
                  loading={processing === request.id}
                  disabled={processing === request.id && processing !== null}
                >
                  Accept
                </Button>
                <Button 
                  variant="secondary"
                  onClick={() => handleRejectRequest(request.id)}
                  loading={processing === request.id}
                  disabled={processing === request.id && processing !== null}
                >
                  Decline
                </Button>
              </div>
            )}
            
            {request.status === 'accepted' && (
              <div className="request-actions">
                <Button 
                  variant="success"
                  onClick={() => handleCompleteRequest(request.id)}
                  loading={processing === request.id}
                  disabled={processing === request.id && processing !== null}
                >
                  Complete Session
                </Button>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>
                  Complete this session to enable credit transfer
                </p>
              </div>
            )}
            
            {request.status === 'completed' && !request.creditGiven && (
              <div className="request-actions">
                <Button 
                  variant="primary"
                  onClick={() => handleTransferCredit(request.id)}
                  loading={processing === request.id}
                  disabled={processing === request.id && processing !== null}
                >
                  +1 Credit
                </Button>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>
                  Give credit to {activeTab === 'sent' ? request.receiverName : request.senderName}
                </p>
              </div>
            )}
            
            {request.status === 'completed' && request.creditGiven && (
              <div className="request-actions">
                <p style={{ fontSize: '0.875rem', color: '#10b981', marginTop: '0.5rem' }}>
                  ✓ Credits transferred successfully
                </p>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default Requests;
