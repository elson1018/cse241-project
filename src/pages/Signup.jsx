import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/Button';
import Card from '../components/Card';
import Toast from '../components/Toast';
import { UserPlus, Eye, EyeOff } from 'lucide-react';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    name: '',
    role: 'mentee',
    bio: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState(null);
  const { signup, appData } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setToast({ message: 'Passwords do not match', type: 'error' });
      return;
    }

    if (appData.users.find(u => u.username === formData.username)) {
      setToast({ message: 'Username already exists', type: 'error' });
      return;
    }

    const userData = {
      username: formData.username,
      password: formData.password,
      name: formData.name,
      role: formData.role,
      bio: formData.bio
    };

    // Add role-specific fields
    if (formData.role === 'mentor') {
      userData.industry = '';
      userData.skills = [];
      userData.experience = '';
      userData.availability = [];
      userData.isApproved = false;
    } else if (formData.role === 'entrepreneur') {
      userData.shopName = '';
      userData.shopDescription = '';
    } else if (formData.role === 'mentee') {
      userData.skills = [];
      userData.goals = '';
    }

    const result = signup(userData);
    
    if (result.success) {
      setToast({ message: 'Account created successfully!', type: 'success' });
      setTimeout(() => {
        navigate('/dashboard');
      }, 500);
    } else {
      setToast({ message: 'Signup failed. Please try again.', type: 'error' });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <Card>
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-primary mb-2">Join Wonder Women</h1>
            <p className="text-text-main">Create your account to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-text-main mb-2">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-semibold text-text-main mb-2">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="Choose a username"
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-semibold text-text-main mb-2">
                I am a
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              >
                <option value="mentee">Mentee</option>
                <option value="mentor">Mentor</option>
                <option value="entrepreneur">Entrepreneur</option>
              </select>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-text-main mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  className="w-full px-4 py-3 border-2 border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all pr-12"
                  placeholder="Create a password"
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

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-text-main mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="Confirm your password"
              />
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-semibold text-text-main mb-2">
                Bio (Optional)
              </label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 border-2 border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                placeholder="Tell us about yourself"
              />
            </div>

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="agreement"
                name="agreement"
                checked={formData.agreement || false}
                onChange={(e) =>
                  setFormData({ ...formData, agreement: e.target.checked })
                }
                className="mt-1 w-5 h-5 border-2 border-accent rounded focus:ring-primary cursor-pointer"
                required
              />
              <label htmlFor="agreement" className="text-sm text-text-main">
                I have read and agree to the{' '}
                <Link to="/privacy-policy" className="text-primary underline">
                  Privacy Policy
                </Link>{' '}
                and {' '}
                <Link to="/privacy-policy" className="text-primary underline">
                  Terms of Use
                </Link>
              </label>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full py-3 text-lg font-semibold hover:bg-opacity-90 active:scale-95 transition-transform mt-4"
            >
              <UserPlus size={20} className="inline mr-2" />
              Sign Up
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-text-main">
              Already have an account?{' '}
              <Link to="/login" className="text-primary font-semibold hover:underline">
                Login here
              </Link>
            </p>
          </div>
        </Card>
      </div>

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

export default Signup;

