import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/Button';
import Card from '../components/Card';
import Toast from '../components/Toast';
import { UserPlus, Eye, EyeOff, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

const Signup = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    name: '',
    role: 'mentee',
    bio: '',
    age: '',
    industry: '',
    skills: [],
    experience: '',
    goals: ''
  });
  const [skillInput, setSkillInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [toast, setToast] = useState(null);
  const { signup, appData } = useAuth();
  const navigate = useNavigate();

  // Restore form data from sessionStorage on mount
  useEffect(() => {
    const savedFormData = sessionStorage.getItem('signupFormData');
    if (savedFormData) {
      try {
        const parsed = JSON.parse(savedFormData);
        setFormData(parsed);
        // Determine which step to show based on filled data
        if (parsed.name && parsed.username && parsed.password) {
          if (parsed.bio || parsed.agreement) {
            setCurrentStep(3);
          } else if (parsed.industry || parsed.experience || parsed.age || parsed.goals) {
            setCurrentStep(2);
          }
        }
      } catch (e) {
        console.error('Error restoring form data:', e);
      }
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, skillInput.trim()]
      });
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skill) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(s => s !== skill)
    });
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!formData.name || !formData.username || !formData.password || !formData.confirmPassword) {
        setToast({ message: 'Please fill all required fields', type: 'error' });
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setToast({ message: 'Passwords do not match', type: 'error' });
        return;
      }
    }
    setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
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
      userData.industry = formData.industry || '';
      userData.skills = formData.skills || [];
      userData.experience = formData.experience || '';
      userData.availability = [];
      userData.isApproved = false;
    } else if (formData.role === 'entrepreneur') {
      userData.shopName = '';
      userData.shopDescription = '';
    } else if (formData.role === 'mentee') {
      userData.age = formData.age || '';
      userData.industry = formData.industry || '';
      userData.skills = formData.skills || [];
      userData.experience = formData.experience || '';
      userData.goals = formData.goals || '';
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
            <div className="mt-4 flex justify-center gap-2">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                    step === currentStep
                      ? 'bg-primary text-white'
                      : step < currentStep
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {step}
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <>
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
              <div className="relative">
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all appearance-none cursor-pointer"
                >
                  <option value="mentee">Mentee</option>
                  <option value="mentor">Mentor</option>
                  <option value="entrepreneur">Entrepreneur</option>
                </select>
                
                {/* Custom Arrow Icon */}
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-500">
                  <ChevronDown size={20} />
                </div>
              </div>
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

              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all pr-12"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-text-main transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

                <Button
                  type="button"
                  variant="primary"
                  onClick={handleNext}
                  className="w-full py-3 text-lg font-semibold hover:bg-opacity-90 active:scale-95 transition-transform mt-4"
                >
                  Next
                  <ChevronRight size={20} className="inline ml-2" />
                </Button>
              </>
            )}

            {/* Step 2: Role-specific Information */}
            {currentStep === 2 && (
              <>
                {formData.role === 'mentee' && (
                  <>
                    <div>
                      <label htmlFor="age" className="block text-sm font-semibold text-text-main mb-2">
                        Age
                      </label>
                      <input
                        id="age"
                        name="age"
                        type="number"
                        value={formData.age}
                        onChange={handleChange}
                        min="13"
                        max="100"
                        className="w-full px-4 py-3 border-2 border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        placeholder="Enter your age"
                      />
                    </div>
                    <div>
                      <label htmlFor="industry" className="block text-sm font-semibold text-text-main mb-2">
                        Industry
                      </label>
                      <input
                        id="industry"
                        name="industry"
                        type="text"
                        value={formData.industry}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        placeholder="e.g., Technology, Marketing, Healthcare"
                      />
                    </div>
                    <div>
                      <label htmlFor="skills" className="block text-sm font-semibold text-text-main mb-2">
                        Skills
                      </label>
                      <div className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={skillInput}
                          onChange={(e) => setSkillInput(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddSkill();
                            }
                          }}
                          className="flex-1 px-4 py-3 border-2 border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                          placeholder="Add a skill and press Enter"
                        />
                        <Button type="button" variant="secondary" onClick={handleAddSkill}>
                          Add
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formData.skills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-accent bg-opacity-30 text-secondary rounded-full text-sm font-semibold flex items-center gap-2"
                          >
                            {skill}
                            <button
                              type="button"
                              onClick={() => handleRemoveSkill(skill)}
                              className="text-red-500 hover:text-red-700"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label htmlFor="experience" className="block text-sm font-semibold text-text-main mb-2">
                        Experience
                      </label>
                      <textarea
                        id="experience"
                        name="experience"
                        value={formData.experience}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-4 py-3 border-2 border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                        placeholder="Describe your experience or background"
                      />
                    </div>
                    <div>
                      <label htmlFor="goals" className="block text-sm font-semibold text-text-main mb-2">
                        Goals
                      </label>
                      <textarea
                        id="goals"
                        name="goals"
                        value={formData.goals}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-4 py-3 border-2 border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                        placeholder="What are your career or learning goals?"
                      />
                    </div>
                  </>
                )}
                {formData.role === 'mentor' && (
                  <>
                    <div>
                      <label htmlFor="industry" className="block text-sm font-semibold text-text-main mb-2">
                        Industry *
                      </label>
                      <input
                        id="industry"
                        name="industry"
                        type="text"
                        value={formData.industry}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border-2 border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        placeholder="e.g., Technology, Marketing, Healthcare"
                      />
                    </div>
                    <div>
                      <label htmlFor="skills" className="block text-sm font-semibold text-text-main mb-2">
                        Skills
                      </label>
                      <div className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={skillInput}
                          onChange={(e) => setSkillInput(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddSkill();
                            }
                          }}
                          className="flex-1 px-4 py-3 border-2 border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                          placeholder="Add a skill and press Enter"
                        />
                        <Button type="button" variant="secondary" onClick={handleAddSkill}>
                          Add
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formData.skills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-accent bg-opacity-30 text-secondary rounded-full text-sm font-semibold flex items-center gap-2"
                          >
                            {skill}
                            <button
                              type="button"
                              onClick={() => handleRemoveSkill(skill)}
                              className="text-red-500 hover:text-red-700"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label htmlFor="experience" className="block text-sm font-semibold text-text-main mb-2">
                        Experience *
                      </label>
                      <textarea
                        id="experience"
                        name="experience"
                        value={formData.experience}
                        onChange={handleChange}
                        required
                        rows={3}
                        className="w-full px-4 py-3 border-2 border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                        placeholder="Describe your professional experience"
                      />
                    </div>
                  </>
                )}
                <div className="flex gap-3 mt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevious}
                    className="flex-1"
                  >
                    <ChevronLeft size={20} className="inline mr-2" />
                    Previous
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    onClick={handleNext}
                    className="flex-1"
                  >
                    Next
                    <ChevronRight size={20} className="inline ml-2" />
                  </Button>
                </div>
              </>
            )}

            {/* Step 3: Bio and Agreement */}
            {currentStep === 3 && (
              <>
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
                    <Link to="/privacy-policy" className="text-primary underline" onClick={(e) => {
                      // Store form data in sessionStorage before navigating
                      sessionStorage.setItem('signupFormData', JSON.stringify(formData));
                    }}>
                      Privacy Policy
                    </Link>{' '}
                    and {' '}
                    <Link to="/terms-of-use" className="text-primary underline" onClick={(e) => {
                      // Store form data in sessionStorage before navigating
                      sessionStorage.setItem('signupFormData', JSON.stringify(formData));
                    }}>
                      Terms of Use
                    </Link>
                  </label>
                </div>

                <div className="flex gap-3 mt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevious}
                    className="flex-1"
                  >
                    <ChevronLeft size={20} className="inline mr-2" />
                    Previous
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    className="flex-1"
                  >
                    <UserPlus size={20} className="inline mr-2" />
                    Sign Up
                  </Button>
                </div>
              </>
            )}
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

