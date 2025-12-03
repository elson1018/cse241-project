import { createContext, useContext, useState, useEffect } from 'react';
import data from '../data/data.json';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(data.currentUser);
  const [appData, setAppData] = useState(data);

  // Load data from JSON
  useEffect(() => {
    setAppData(data);
    setCurrentUser(data.currentUser);
  }, []);

  const switchRole = (role) => {
    const user = appData.users.find(u => u.role === role);
    if (user) {
      setCurrentUser({
        ...user,
        avatar: `https://placehold.co/100x100/4E56C0/FFFFFF?text=${user.name.charAt(0)}`
      });
    }
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
    switchRole,
    updateData,
    setAppData
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

