import { createContext, useContext, useState, useEffect } from 'react';
import data from '../data/data.json';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [appData, setAppData] = useState(data);

  // Load data from JSON on mount
  useEffect(() => {
    setAppData(data);
    // Check if user is logged in (from localStorage)
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (username, password) => {
    const user = appData.users.find(
      u => u.username === username && u.password === password
    );
    
    if (user) {
      const userWithAvatar = {
        ...user,
        avatar: `https://placehold.co/100x100/4E56C0/FFFFFF?text=${user.name.charAt(0)}`
      };
      setCurrentUser(userWithAvatar);
      localStorage.setItem('currentUser', JSON.stringify(userWithAvatar));
      return { success: true, user: userWithAvatar };
    }
    
    return { success: false, error: 'Invalid credentials' };
  };

  const signup = (userData) => {
    const newId = Math.max(...appData.users.map(u => u.id)) + 1;
    const newUser = {
      id: newId,
      ...userData,
      avatar: `https://placehold.co/100x100/4E56C0/FFFFFF?text=${userData.name.charAt(0)}`
    };
    
    const updatedUsers = [...appData.users, newUser];
    setAppData(prev => ({ ...prev, users: updatedUsers }));
    
    setCurrentUser(newUser);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    
    return { success: true, user: newUser };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const updateData = (key, value) => {
    setAppData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const value = {
    currentUser,
    appData,
    login,
    signup,
    logout,
    updateData,
    setAppData
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

