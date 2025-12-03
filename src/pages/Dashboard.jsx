import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import UserDashboard from '../components/dashboards/UserDashboard';
import AdminDashboard from '../components/dashboards/AdminDashboard';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  if (!currentUser) {
    return null;
  }

  if (currentUser.role === 'admin') {
    return <AdminDashboard />;
  }

  return <UserDashboard />;
};

export default Dashboard;

