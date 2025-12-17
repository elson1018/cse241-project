import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { GraduationCap, Users, ShoppingBag, MessageSquare, Bell, LogOut } from 'lucide-react';
import { useState , useEffect } from 'react';
import Modal from './Modal';

const Navbar = () => {
  const { currentUser, logout, appData, updateData } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  
  const navItems = [
    { path: '/learning', label: 'SkillUp Learning', icon: GraduationCap },
    { path: '/mentorship', label: 'Mentorship Match', icon: Users },
    { path: '/marketplace', label: 'Marketplace', icon: ShoppingBag },
    { path: '/forum', label: 'Community Forum', icon: MessageSquare },
  ];

  const unreadNotifications = appData.notifications?.filter(
    n => n.userId === currentUser?.id && !n.read
  ) || [];

  const handleConfirmLogout = async () => {
    try {
      await logout();
      navigate('/login', {
        state: { message: 'Logged out successfully!', type: 'success' }
      });
    } catch (err) {
      console.error(err);
    } finally {
      setShowLogoutModal(false);
    }
  };

  const markNotificationAsRead = (notificationId) => {
    const updatedNotifications = appData.notifications.map(n =>
      n.id === notificationId ? { ...n, read: true } : n
    );
    updateData('notifications', updatedNotifications);
  };

  if (!currentUser) {
    return null; // Don't show navbar if not logged in
  }

  return (
    <nav className="bg-cream/90 backdrop-blur-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/dashboard" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-burgundy">Wonder Women ✨</span>
          </Link>

          <div className="flex items-center gap-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-burgundy hover:bg-peach hover:bg-opacity-80'
                  }`}
                >
                  <Icon size={20} />
                  <span className="hidden md:inline">{item.label}</span>
                </Link>
              );
            })}

            <div className="flex items-center gap-3 pl-4 border-l border-accent">
              {/* Notifications Bell */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-text-main hover:bg-accent hover:bg-opacity-30 rounded-lg transition-colors"
                >
                  <Bell size={20} />
                  {unreadNotifications.length > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadNotifications.length}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowNotifications(false)}
                    />
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-accent z-50 max-h-96 overflow-y-auto">
                      <div className="p-4 border-b border-accent">
                        <h3 className="font-bold text-primary">Notifications</h3>
                      </div>
                      {unreadNotifications.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">No new notifications</div>
                      ) : (
                        <div className="divide-y divide-accent">
                          {unreadNotifications.map((notification) => (
                            <div
                              key={notification.id}
                              className="p-4 hover:bg-gray-50 cursor-pointer"
                              onClick={() => {
                                markNotificationAsRead(notification.id);
                                setShowNotifications(false);
                              }}
                            >
                              <p className="text-sm text-text-main">{notification.text}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* User Info */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate('/edit-profile')}
                  className="flex items-center gap-2 hover:bg-accent hover:bg-opacity-30 rounded-lg p-1 transition-colors"
                  title="Edit Profile"
                >
                  <img
                    src={currentUser.avatar || `https://placehold.co/100x100/6A1B9A/FFFFFF?text=${currentUser.name.charAt(0)}`}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full ring-2 ring-accent ring-offset-2 ring-offset-white"
                  />
                  <div className="hidden md:block">
                    <p className="text-sm font-semibold text-text-main">{currentUser.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{currentUser.role}</p>
                  </div>
                </button>
                <button
                  onClick={() => setShowLogoutModal(true)}
                  className="p-2 text-text-main hover:bg-accent hover:bg-opacity-30 rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. ADDED MODAL: The confirmation popup */}
      <Modal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title="Confirm Logout"
      >
        <div className="space-y-4">
          <p className="text-text-main">
            Are you sure you want to log out?
          </p>
          <div className="flex gap-3 justify-end pt-2">
            <button
              onClick={() => setShowLogoutModal(false)}
              className="px-4 py-2 rounded-lg font-semibold text-primary border border-primary hover:bg-primary hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                setShowLogoutModal(false);
                handleConfirmLogout();
              }}
              className="px-4 py-2 rounded-lg font-semibold bg-red-500 text-white hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </Modal>
    </nav>
  );
};

export default Navbar;
