import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Matching from './pages/Matching';
import Requests from './pages/Requests';
import Sessions from './pages/Sessions';
import Credits from './pages/Credits';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize demo mode - auto-login with first user (Sehar)
    const initializeDemoMode = () => {
      const users = JSON.parse(localStorage.getItem('users')) || [
        { id: 1, name: 'Sehar', credits: 10 },
        { id: 2, name: 'Mayank', credits: 10 },
        { id: 3, name: 'Akshita', credits: 10 },
        { id: 4, name: 'Tanishtha', credits: 10 },
        { id: 5, name: 'Demo User', credits: 10 }
      ];
      
      // Set first user (Sehar) as the current user
      setUser(users[0]);
      
      // Set up global function for user switching
      window.updateCurrentUser = (newUser) => {
        setUser(newUser);
      };
      
      // Set up global function for refreshing credits
      window.refreshUserCredits = () => {
        const updatedUsers = JSON.parse(localStorage.getItem('users')) || [];
        const currentUser = updatedUsers.find(u => u.id === user?.id) || updatedUsers[0];
        setUser(currentUser);
      };
    };

    initializeDemoMode();
    setLoading(false);
  }, []);

  // Update global functions when user changes
  useEffect(() => {
    if (user) {
      window.refreshUserCredits = () => {
        const updatedUsers = JSON.parse(localStorage.getItem('demoUsers')) || [];
        const currentUser = updatedUsers.find(u => u.id === user.id) || user;
        setUser(currentUser);
      };
    }
  }, [user]);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('skillsync_user');
    localStorage.removeItem('skillsync_token');
  };

  // Protected route component
  const ProtectedRoute = ({ children }) => {
    if (loading) {
      return (
        <div className="loading">
          <div>Loading...</div>
        </div>
      );
    }
    
    if (!user) {
      return <Navigate to="/login" replace />;
    }
    
    return children;
  };

  if (loading) {
    return (
      <div className="loading">
        <div>Loading SkillSync...</div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Navbar user={user} onLogout={handleLogout} />
        
        <Routes>
          {/* Public routes */}
          <Route 
            path="/" 
            element={
              user ? <Navigate to="/dashboard" replace /> : <Landing />
            } 
          />
          <Route 
            path="/login" 
            element={
              user ? <Navigate to="/dashboard" replace /> : <Login onLogin={handleLogin} />
            } 
          />
          <Route 
            path="/signup" 
            element={
              user ? <Navigate to="/dashboard" replace /> : <Signup onLogin={handleLogin} />
            } 
          />
          
          {/* Protected routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard user={user} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/matching" 
            element={
              <ProtectedRoute>
                <Matching user={user} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/requests" 
            element={
              <ProtectedRoute>
                <Requests user={user} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/sessions" 
            element={
              <ProtectedRoute>
                <Sessions user={user} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/credits" 
            element={
              <ProtectedRoute>
                <Credits user={user} />
              </ProtectedRoute>
            } 
          />
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
