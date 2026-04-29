// Local Storage Demo API - No backend required

// Helper functions for localStorage
const getData = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch {
    return [];
  }
};

const setData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
};

// Keep old functions for compatibility
const getFromStorage = getData;
const setToStorage = setData;

// Generate unique ID
const generateId = () => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

// Initialize demo data with multiple users and skills
const initializeDemoData = () => {
  // Initialize users if not exists
  if (!localStorage.getItem('users')) {
    const users = [
      { id: 1, name: 'Sehar', credits: 10 },
      { id: 2, name: 'Mayank', credits: 10 },
      { id: 3, name: 'Akshita', credits: 10 },
      { id: 4, name: 'Tanishtha', credits: 10 },
      { id: 5, name: 'Demo User', credits: 10 }
    ];
    setData('users', users);
  }
  
  // Initialize skills if not exists
  if (!localStorage.getItem('skills')) {
    const skills = [
      'Java',
      'React', 
      'Python',
      'UI/UX Design',
      'Data Structures',
      'Machine Learning',
      'Public Speaking'
    ];
    setData('skills', skills);
  }
  
  // Initialize user skills if not exists
  if (!localStorage.getItem('userSkills')) {
    const userSkills = [
      { userId: 1, skill: 'React', type: 'teach' },
      { userId: 1, skill: 'Java', type: 'learn' },
      { userId: 2, skill: 'Python', type: 'teach' },
      { userId: 2, skill: 'Machine Learning', type: 'teach' },
      { userId: 3, skill: 'UI/UX Design', type: 'teach' },
      { userId: 4, skill: 'Data Structures', type: 'teach' },
      { userId: 4, skill: 'Java', type: 'teach' },
      { userId: 5, skill: 'Public Speaking', type: 'teach' }
    ];
    setData('userSkills', userSkills);
  }
  
  // Initialize requests if not exists
  if (!localStorage.getItem('requests')) {
    const sampleRequests = [
      {
        id: generateId(),
        fromUserId: 2, // Mayank
        toUserId: 1,   // Sehar
        message: "Hi Sehar! I'd love to learn React from you. I'm a beginner but very motivated!",
        skills: ['React'],
        status: 'pending',
        creditGiven: false,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago
      },
      {
        id: generateId(),
        fromUserId: 3, // Akshita
        toUserId: 1,   // Sehar
        message: "Hey Sehar! I see you know Java. Would you be interested in teaching me some advanced concepts?",
        skills: ['Java'],
        status: 'accepted',
        creditGiven: false,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // 1 day ago
      },
      {
        id: generateId(),
        fromUserId: 1, // Sehar
        toUserId: 4,   // Tanishtha
        message: "Hi Tanishtha! I need help with Data Structures. Can you teach me?",
        skills: ['Data Structures'],
        status: 'completed',
        creditGiven: false,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days ago
      }
    ];
    setToStorage('requests', sampleRequests);
  }
};

// Reset demo data function
export const resetDemoData = () => {
  localStorage.removeItem('users');
  localStorage.removeItem('skills');
  localStorage.removeItem('userSkills');
  localStorage.removeItem('requests');
  initializeDemoData();
  return Promise.resolve({ data: { success: true, message: 'Demo data reset successfully' } });
};

// Helper functions for new data types
const getSkills = () => {
  return getData('skills');
};

const getUserSkills = (userId) => {
  const userSkills = getData('userSkills');
  return userSkills.filter(skill => skill.userId === userId);
};

// Export helper functions for debugging
export const showStoredData = () => {
  console.log({
    users: getData('users'),
    skills: getData('skills'),
    userSkills: getData('userSkills'),
    requests: getData('requests')
  });
};

// Initialize on import
initializeDemoData();

// Local Storage API Functions
export const api = {
  // Auth functions - simplified for demo
  login: async (credentials) => {
    const users = getData('users');
    return Promise.resolve({ data: users[0] }); // Return first user by default
  },

  register: async (userData) => {
    const users = getData('users');
    return Promise.resolve({ data: users[0] });
  },

  // Get matches - return all other users with their skills
  getMatches: async (userId) => {
    const users = getData('users');
    const otherUsers = users.filter(u => u.id !== userId);
    
    const matches = otherUsers.map(user => {
      const userSkills = getUserSkills(user.id);
      const skillNames = userSkills.map(us => us.skill);
      return {
        id: user.id,
        name: user.name,
        description: `Demo user for skill exchange - skilled in ${skillNames.join(', ')}`,
        matchPercentage: Math.floor(Math.random() * 20) + 75, // 75-95%
        rating: (Math.random() * 2 + 3).toFixed(1), // 3.0-5.0
        hoursTaught: Math.floor(Math.random() * 20) + 5, // 5-25 hours
        skills: skillNames,
        requestSent: false
      };
    });
    
    return Promise.resolve({ data: matches });
  },

  // Request functions
  getRequests: async (userId, type = 'received') => {
    const requests = getData('requests');
    const users = getData('users');
    
    const filteredRequests = requests.filter(req => {
      if (type === 'received') {
        return req.toUserId === userId;
      } else {
        return req.fromUserId === userId;
      }
    });
    
    // Add user names to requests
    const enrichedRequests = filteredRequests.map(req => {
      const fromUser = users.find(u => u.id === req.fromUserId);
      const toUser = users.find(u => u.id === req.toUserId);
      
      return {
        ...req,
        senderName: fromUser?.name || 'Unknown',
        receiverName: toUser?.name || 'Unknown',
        senderId: req.fromUserId,
        receiverId: req.toUserId
      };
    });
    
    return Promise.resolve({ data: enrichedRequests });
  },

  sendRequest: async (requestData) => {
    const requests = getData('requests');
    const newRequest = {
      id: generateId(),
      fromUserId: requestData.senderId,
      toUserId: requestData.receiverId,
      message: requestData.message || 'Hi! I\'d love to learn from you.',
      skills: requestData.skills || ['JavaScript'],
      status: 'pending',
      creditGiven: false,
      createdAt: new Date().toISOString()
    };
    
    requests.push(newRequest);
    setData('requests', requests);
    
    return Promise.resolve({ data: newRequest });
  },

  acceptRequest: async (requestId) => {
    const requests = getData('requests');
    const requestIndex = requests.findIndex(req => req.id === requestId);
    
    if (requestIndex !== -1) {
      requests[requestIndex].status = 'accepted';
      setData('requests', requests);
    }
    
    return Promise.resolve({ data: { success: true } });
  },

  rejectRequest: async (requestId) => {
    const requests = getData('requests');
    const requestIndex = requests.findIndex(req => req.id === requestId);
    
    if (requestIndex !== -1) {
      requests[requestIndex].status = 'rejected';
      setData('requests', requests);
    }
    
    return Promise.resolve({ data: { success: true } });
  },

  completeRequest: async (requestId) => {
    const requests = getData('requests');
    const requestIndex = requests.findIndex(req => req.id === requestId);
    
    if (requestIndex !== -1) {
      requests[requestIndex].status = 'completed';
      setData('requests', requests);
    }
    
    return Promise.resolve({ data: { success: true } });
  },

  // Credits functions
  getCredits: async (userId) => {
    const users = getData('users');
    const user = users.find(u => u.id === userId);
    
    return Promise.resolve({ data: { credits: user?.credits || 0 } });
  },

  getCreditHistory: async (userId) => {
    // Return empty history for demo
    return Promise.resolve({ data: [] });
  },

  transferCredits: async (fromUserId, toUserId) => {
    const users = getData('users');
    const requests = getData('requests');
    
    // Find the request to mark credit as given
    const requestIndex = requests.findIndex(req => 
      req.fromUserId === fromUserId && 
      req.toUserId === toUserId && 
      req.status === 'completed' && 
      !req.creditGiven
    );
    
    if (requestIndex === -1) {
      return Promise.reject(new Error('No valid request found for credit transfer'));
    }
    
    // Update credits
    const fromUser = users.find(u => u.id === fromUserId);
    const toUser = users.find(u => u.id === toUserId);
    
    if (fromUser && toUser && fromUser.credits > 0) {
      fromUser.credits -= 1;
      toUser.credits += 1;
      
      // Mark credit as given
      requests[requestIndex].creditGiven = true;
      
      // Save changes
      setData('users', users);
      setData('requests', requests);
      
      return Promise.resolve({ data: { success: true } });
    }
    
    return Promise.reject(new Error('Insufficient credits'));
  }
};
