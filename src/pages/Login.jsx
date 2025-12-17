import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation} from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/Button';
import Card from '../components/Card';
import Modal from '../components/Modal';
import Toast from '../components/Toast';
import { LogIn, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [toast, setToast] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.message) {
      setToast({ 
        message: location.state.message, 
        type: location.state.type || 'success' 
      });
      // Clear the state so the toast doesn't show again on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = login(username, password);
    
    if (result.success) {
      setToast({ message: 'Login successful!', type: 'success' });
      // Redirect based on role
      setTimeout(() => {
        navigate('/dashboard');
      }, 500);
    } else {
      setToast({ message: result.error || 'Invalid credentials', type: 'error' });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <Card>
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-primary mb-2">Wonder Women</h1>
            <p className="text-text-main">Welcome back! Please login to continue.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-semibold text-text-main mb-2">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-3 border-2 border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="Enter your username"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-text-main mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 border-2 border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all pr-12"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-text-main transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full py-3 text-lg font-semibold hover:bg-opacity-90 active:scale-95 transition-transform"
            >
              <LogIn size={20} className="inline mr-2" />
              Login
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-text-main">
              Don't have an account?{' '}
              <Link to="/signup" className="text-primary font-semibold hover:underline">
                Sign up here
              </Link>
            </p>
          </div>

          <div className="mt-4 text-center">
            <button
              onClick={() => setShowPrivacyModal(true)}
              className="text-sm text-secondary hover:underline"
            >
              Privacy & Policy
            </button>
          </div>
        </Card>
      </div>

      <Modal
        isOpen={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
        title="Privacy & Policy"
      >
        <div className="space-y-4 text-text-main">
          <section>
            <h3 className="font-bold text-primary mb-2">1. Information We Collect</h3>
            <p className="text-sm">
              We collect information you provide directly to us, including username, password, and profile information.
            </p>
          </section>
          <section>
            <h3 className="font-bold text-primary mb-2">2. How We Use Your Information</h3>
            <p className="text-sm">
              We use your information to provide, maintain, and improve our services, including authentication and personalized experiences.
            </p>
          </section>
          <section>
            <h3 className="font-bold text-primary mb-2">3. Data Security</h3>
            <p className="text-sm">
              We implement appropriate security measures to protect your personal information. However, no method of transmission over the internet is 100% secure.
            </p>
          </section>
          <section>
            <h3 className="font-bold text-primary mb-2">4. Your Rights</h3>
            <p className="text-sm">
              You have the right to access, update, or delete your personal information at any time through your account settings.
            </p>
          </section>
          <div className="pt-4">
            <Button variant="primary" onClick={() => setShowPrivacyModal(false)} className="w-full">
              I Understand
            </Button>
          </div>
        </div>
      </Modal>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default Login;

