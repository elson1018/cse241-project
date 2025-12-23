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

  // Load data on mount
  useEffect(() => {
    const savedData = localStorage.getItem('appData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      // Logic to ensure new users in data.json are merged into existing localStorage data
      const mergedUsers = [...parsedData.users];
      data.users.forEach(jsonUser => {
        if (!mergedUsers.some(u => u.username === jsonUser.username)) {
          mergedUsers.push(jsonUser);
        }
      });

      const updatedData = { ...parsedData, users: mergedUsers };
      setAppData(updatedData);
      localStorage.setItem('appData', JSON.stringify(updatedData));
    } else {
      setAppData(data);
      localStorage.setItem('appData', JSON.stringify(data));
    }

    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (username, password) => {
    // Search in appData (which might contain users loaded from localStorage)
    const user = appData.users.find(
      u => u.username === username && u.password === password
    );

    if (user) {
      if (user.status === 'banned' || user.isBanned) {
        return { success: false, error: 'Your account has been banned. Please contact support.' };
      }

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

    // 1. Create the new list of users
    const updatedUsers = [...appData.users, newUser];

    // 2. Create the new full data object
    const newAppData = { ...appData, users: updatedUsers };

    // 3. Update State
    setAppData(newAppData);

    // 4. SAVE TO LOCAL STORAGE (This was missing!)
    localStorage.setItem('appData', JSON.stringify(newAppData));

    setCurrentUser(newUser);
    localStorage.setItem('currentUser', JSON.stringify(newUser));

    return { success: true, user: newUser };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const updateData = (key, value) => {
    setAppData(prev => {
      const newData = {
        ...prev,
        [key]: value
      };
      // Save any other data changes to storage too
      localStorage.setItem('appData', JSON.stringify(newData));
      return newData;
    });
  };

  const updateCurrentUser = (userData) => {
    const updatedUser = { ...currentUser, ...userData };
    setCurrentUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));

    // Also update the user inside the main appData list
    const updatedUsers = appData.users.map(u =>
      u.id === currentUser.id ? { ...u, ...userData } : u
    );
    const newAppData = { ...appData, users: updatedUsers };
    setAppData(newAppData);
    localStorage.setItem('appData', JSON.stringify(newAppData));
  };

  const value = {
    currentUser,
    appData,
    login,
    signup,
    logout,
    updateData,
    setAppData,
    updateCurrentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};