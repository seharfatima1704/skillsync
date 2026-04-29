import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

const Credits = ({ user }) => {
  const [credits, setCredits] = useState({ balance: 0, earned: 0, spent: 0 });
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchCreditsData();
    }
  }, [user]);

  const fetchCreditsData = async () => {
    try {
      const [creditsResponse, historyResponse] = await Promise.all([
        api.getCredits(user.id),
        api.getCreditHistory(user.id)
      ]);
      
      setCredits(creditsResponse.data);
      setTransactions(historyResponse.data);
    } catch (error) {
      console.error('Failed to fetch credits data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'session':
        return '🎓';
      case 'teaching':
        return '👨‍🏫';
      case 'bonus':
        return '🎁';
      default:
        return '💳';
    }
  };

  if (!user) {
    return (
      <div className="container mt-4">
        <div className="card text-center">
          <h3>Please log in to view your credits</h3>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="loading">Loading credits...</div>
      </div>
    );
  }

  return (
    <div className="container mt-4 bg-dots">
      <div className="mb-4">
        <h1>Your Credits</h1>
        <p>Manage your time credit balance and transactions</p>
      </div>
      
      <div className="credits-grid mb-4">
        <div className="credit-card">
          <div className="credit-amount">{credits.balance}</div>
          <div className="credit-label">Current Balance</div>
          <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '8px' }}>
            Available for learning sessions
          </p>
        </div>
        
        <div className="credit-card">
          <div className="credit-amount positive">+{credits.earned}</div>
          <div className="credit-label">Total Earned</div>
          <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '8px' }}>
            From teaching sessions
          </p>
        </div>
        
        <div className="credit-card">
          <div className="credit-amount negative">-{credits.spent}</div>
          <div className="credit-label">Total Spent</div>
          <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '8px' }}>
            On learning sessions
          </p>
        </div>
      </div>
      
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Transaction History</h3>
          <p className="card-description">Your recent credit activity</p>
        </div>
        
        <div className="transaction-list">
          {transactions.length === 0 ? (
            <div className="text-center" style={{ padding: '40px' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💳</div>
              <h4>No transactions yet</h4>
              <p style={{ color: '#6b7280' }}>
                Start exchanging skills to see your transaction history
              </p>
            </div>
          ) : (
            transactions.map(transaction => (
              <div key={transaction.id} className="transaction-item">
                <div className="transaction-info">
                  <div className="transaction-description">
                    <span style={{ marginRight: '8px' }}>
                      {getTransactionIcon(transaction.type)}
                    </span>
                    {transaction.description}
                  </div>
                  <div className="transaction-date">
                    {formatDate(transaction.date)}
                  </div>
                </div>
                <div className={`transaction-amount ${
                  transaction.amount > 0 ? 'positive' : 'negative'
                }`}>
                  {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      <div className="card mt-4">
        <div className="card-header">
          <h3 className="card-title">How Credits Work</h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '8px' }}>
              💰 Earning Credits
            </h4>
            <ul style={{ color: '#6b7280', paddingLeft: '20px' }}>
              <li>Teach others your skills</li>
              <li>1 hour teaching = 1 credit earned</li>
              <li>Get positive feedback</li>
              <li>Refer new members</li>
            </ul>
          </div>
          
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '8px' }}>
              💸 Spending Credits
            </h4>
            <ul style={{ color: '#6b7280', paddingLeft: '20px' }}>
              <li>Learn from experts</li>
              <li>1 hour learning = 1 credit spent</li>
              <li>Access premium content</li>
              <li>Book specialized sessions</li>
            </ul>
          </div>
          
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '8px' }}>
              🎯 Getting Started
            </h4>
            <ul style={{ color: '#6b7280', paddingLeft: '20px' }}>
              <li>New members get initial credits upon registration</li>
              <li>Complete your profile for bonus credits</li>
              <li>Share skills frequently</li>
              <li>Build your reputation</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Credits;
