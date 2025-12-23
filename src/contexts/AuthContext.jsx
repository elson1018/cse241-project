import { createContext, useContext, useState } from 'react';
import data from '../data/data.json';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  const login = (username, password) => {
    // Directly search the imported JSON file
    const user = data.users.find(
      u => u.username === username && u.password === password
    );

    if (user) {
      if (user.status === 'banned' || user.isBanned) {
        return { success: false, error: 'Account banned.' };
      }
      const userWithAvatar = { ...user, avatar: `https://placehold.co/100?text=${user.name.charAt(0)}` };
      setCurrentUser(userWithAvatar);
      return { success: true, user: userWithAvatar };
    }
    return { success: false, error: 'Invalid credentials' };
  };

  const logout = () => setCurrentUser(null);

  const value = {
    currentUser,
    appData: data, // Use the static import
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};