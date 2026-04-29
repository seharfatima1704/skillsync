import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { resetDemoData, showStoredData } from '../services/api';

const Navbar = ({ user, onLogout }) => {
  const location = useLocation();
  const [users, setUsers] = useState([]);

  // Load users from localStorage
  useEffect(() => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    setUsers(users);
  }, []);

  const handleUserSwitch = (userId) => {
    const selectedUser = users.find(u => u.id === parseInt(userId));
    
    if (selectedUser) {
      // Update the user state in parent component
      if (window.updateCurrentUser) {
        window.updateCurrentUser(selectedUser);
      }
      
      // Dispatch custom event to notify components of user switch
      window.dispatchEvent(new CustomEvent('userSwitched', { detail: selectedUser }));
    }
  };

  const handleResetDemo = async () => {
    if (window.confirm('Are you sure you want to reset all demo data? This will clear all requests and reset credits.')) {
      try {
        await resetDemoData();
        // Refresh users list and current user after reset
        const refreshedUsers = JSON.parse(localStorage.getItem('users')) || [];
        setUsers(refreshedUsers);
        
        // Set to first user (Sehar) after reset
        const selectedUser = refreshedUsers[0];
        if (window.updateCurrentUser) {
          window.updateCurrentUser(selectedUser);
        }
        
        alert('Demo data reset successfully!');
      } catch (error) {
        console.error('Failed to reset demo data:', error);
        alert('Failed to reset demo data. Please try again.');
      }
    }
  };

  const handleShowStoredData = () => {
    showStoredData();
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="navbar-brand">
            <div className="navbar-brand-icon">S</div>
            <span>SkillSync</span>
          </Link>
          
          <div className="navbar-nav">
            {user ? (
              <>
                {/* User Switch Dropdown for Demo Mode */}
                <div className="user-switch">
                  <select 
                    value={user?.id || ''} 
                    onChange={(e) => handleUserSwitch(e.target.value)}
                    className="user-switch-dropdown"
                  >
                    <option value="" disabled>Select User</option>
                    {users.map(u => (
                      <option key={u.id} value={u.id}>
                        {u.name} ({u.credits} credits)
                      </option>
                    ))}
                  </select>
                </div>
                
                <Link 
                  to="/dashboard" 
                  className={`navbar-link ${isActive('/dashboard') ? 'active' : ''}`}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/matching" 
                  className={`navbar-link ${isActive('/matching') ? 'active' : ''}`}
                >
                  Matching
                </Link>
                <Link 
                  to="/requests" 
                  className={`navbar-link ${isActive('/requests') ? 'active' : ''}`}
                >
                  Requests
                </Link>
                <Link 
                  to="/sessions" 
                  className={`navbar-link ${isActive('/sessions') ? 'active' : ''}`}
                >
                  Sessions
                </Link>
                <Link 
                  to="/credits" 
                  className={`navbar-link ${isActive('/credits') ? 'active' : ''}`}
                >
                  Credits: {user.credits || 0}
                </Link>
                <button onClick={handleResetDemo} className="btn btn-warning btn-sm" style={{ marginRight: '0.5rem' }}>
                  Reset Demo
                </button>
                <button onClick={handleShowStoredData} className="btn btn-info btn-sm" style={{ marginRight: '0.5rem' }}>
                  Show Stored Data
                </button>
                <button onClick={onLogout} className="btn btn-secondary btn-sm">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className={`navbar-link ${isActive('/login') ? 'active' : ''}`}
                >
                  Log in
                </Link>
                <Link 
                  to="/signup" 
                  className="btn btn-primary btn-sm"
                >
                  Join Now
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
