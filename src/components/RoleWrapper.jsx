import { useAuth } from '../contexts/AuthContext';

const RoleWrapper = ({ allowedRoles, children }) => {
  const { currentUser } = useAuth();
  
  if (!currentUser || !allowedRoles.includes(currentUser.role)) {
    return null;
  }
  
  return children;
};

export default RoleWrapper;
