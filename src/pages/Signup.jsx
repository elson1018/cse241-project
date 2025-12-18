import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/Button';
import Toast from '../components/Toast';
import { UserPlus, Eye, EyeOff, ChevronLeft, ChevronRight, Check, X, Sparkles } from 'lucide-react';

// --- ASSETS ---
import heroWomanImg from '../assets/hero-woman.jpg';
import logoImg from '../assets/Logo.png';
import flowerDeco1 from '../assets/flower-deco1.jpg';
import flowerDeco2 from '../assets/flower-deco2.jpg';
import flowerDeco3 from '../assets/flower-deco3.jpg';

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
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData({ ...formData, skills: [...formData.skills, skillInput.trim()] });
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skill) => {
    setFormData({ ...formData, skills: formData.skills.filter(s => s !== skill) });
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
      sessionStorage.removeItem('signupFormData'); // Clear storage
      setTimeout(() => {
        navigate('/dashboard');
      }, 500);
    } else {
      setToast({ message: 'Signup failed. Please try again.', type: 'error' });
    }
  };

  // --- STYLING CONSTANTS ---
  const inputClasses = "appearance-none block w-full px-4 py-3.5 border border-burgundy/20 rounded-xl bg-burgundy/5 text-gray-800 placeholder-burgundy/40 focus:outline-none focus:ring-2 focus:ring-burgundy focus:border-transparent focus:bg-white transition-all duration-200 sm:text-sm";
  const labelClasses = "block text-sm font-medium text-burgundy/80 mb-1.5 ml-1";

  // Calculate Progress %
  const progressPercentage = (currentStep / 3) * 100;

  return (
    <div className="min-h-screen flex bg-white">

      {/* ================= LEFT SIDE: Hero Image (Fixed) ================= */}
      <div className="hidden lg:block relative w-0 flex-1 bg-burgundy/5 overflow-hidden">
        <img
          className="absolute inset-0 h-full w-full object-cover animate-slowZoom"
          src={heroWomanImg}
          alt="Wonder Women Background"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/30 mix-blend-multiply"></div>

        {/* Branding Overlay */}
        <div className="absolute top-8 left-8 z-10 flex items-center gap-4 animate-fadeIn delay-100">
             <img
               src="/src/assets/logo.png"
               alt="Logo"
               className="w-32 h-32 inline-block xl:w-36 xl:h-36 flex-shrink-0 drop-shadow-lg"
             />
             <div>
                <h1 className="text-white font-bold text-3xl tracking-wider uppercase drop-shadow-md">Wonder Women</h1>
                <p className="text-white/90 text-sm tracking-widest font-medium drop-shadow-sm">Join the Community.</p>
             </div>
        </div>

        {/* Motivational Quote (Optional Extra Feature) */}
        <div className="absolute bottom-12 left-12 right-12 text-white z-10 animate-slideUp" style={{animationDelay: '0.5s'}}>
            <p className="text-2xl font-serif italic leading-relaxed">"There is no limit to what we, as women, can accomplish."</p>
            <p className="mt-4 font-bold uppercase tracking-widest text-sm">— Michelle Obama</p>
        </div>
      </div>

      {/* ================= RIGHT SIDE: Scrollable Form ================= */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24 bg-white relative overflow-hidden overflow-y-auto">

        {/* --- ANIMATED FLOWERS --- */}
        <img src={flowerDeco1} alt="" className="absolute -top-12 -right-12 w-64 h-auto object-contain opacity-15 pointer-events-none rotate-12 animate-float-slow" />
        <img src={flowerDeco2} alt="" className="absolute -bottom-16 -right-8 w-72 h-auto object-contain opacity-15 pointer-events-none -rotate-45 animate-float-medium" />
        <img src={flowerDeco3} alt="" className="absolute top-1/4 -left-20 w-56 h-auto object-contain opacity-10 pointer-events-none rotate-90 animate-float-fast" />

        <div className="mx-auto w-full max-w-md lg:w-[480px] relative z-10">

          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-4xl font-extrabold text-burgundy mb-2 tracking-tight">Create Account</h2>
            <p className="text-gray-500 text-sm">Join our network of trailblazers today.</p>
          </div>

          {/* --- PROGRESS BAR --- */}
          <div className="mb-8">
            <div className="flex justify-between text-xs font-semibold text-burgundy/60 mb-2 uppercase tracking-wider">
                <span>Account</span>
                <span>Profile</span>
                <span>Finish</span>
            </div>
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div
                    className="h-full bg-burgundy transition-all duration-500 ease-out"
                    style={{ width: `${progressPercentage}%` }}
                ></div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* ================= STEP 1: ACCOUNT INFO ================= */}
            {currentStep === 1 && (
              <div className="space-y-4 animate-slideUp">
                <div>
                  <label htmlFor="name" className={labelClasses}>Full Name</label>
                  <input id="name" name="name" type="text" value={formData.name} onChange={handleChange} required className={inputClasses} placeholder="e.g. Jane Doe" />
                </div>

                <div>
                  <label htmlFor="username" className={labelClasses}>Username</label>
                  <input id="username" name="username" type="text" value={formData.username} onChange={handleChange} required className={inputClasses} placeholder="Enter a username..." />
                </div>

                <div>
                  <label htmlFor="role" className={labelClasses}>I am joining as a...</label>
                  <div className="relative">
                    <select id="role" name="role" value={formData.role} onChange={handleChange} required className={`${inputClasses} appearance-none cursor-pointer hover:bg-burgundy/10 transition-colors`}>
                      <option value="mentee">Mentee (I want to learn)</option>
                      <option value="mentor">Mentor (I want to guide)</option>
                      <option value="entrepreneur">Entrepreneur (I have a business)</option>
                    </select>
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-burgundy">
                        <svg className="h-5 w-5 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="password" className={labelClasses}>Password</label>
                        <div className="relative">
                            <input id="password" name="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleChange} required minLength={6} className={inputClasses} placeholder="••••••" />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-burgundy/50 hover:text-burgundy"><Eye size={18} /></button>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="confirmPassword" className={labelClasses}>Confirm Password</label>
                        <div className="relative">
                            <input id="confirmPassword" name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} value={formData.confirmPassword} onChange={handleChange} required className={inputClasses} placeholder="••••••" />
                            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-burgundy/50 hover:text-burgundy"><Eye size={18} /></button>
                        </div>
                    </div>
                </div>

                <Button type="button" variant="primary" onClick={handleNext} className="w-full py-3.5 mt-4 rounded-xl shadow-lg shadow-burgundy/20 font-bold">
                  Continue <ChevronRight size={18} className="inline ml-1" />
                </Button>
              </div>
            )}

            {/* ================= STEP 2: PROFILE DETAILS ================= */}
            {currentStep === 2 && (
              <div className="space-y-4 animate-slideUp">
                {formData.role === 'mentee' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="age" className={labelClasses}>Age</label>
                            <input id="age" name="age" type="number" value={formData.age} onChange={handleChange} min="13" max="100" className={inputClasses} placeholder="Age" />
                        </div>
                        <div>
                            <label htmlFor="industry" className={labelClasses}>Industry</label>
                            <input id="industry" name="industry" type="text" value={formData.industry} onChange={handleChange} className={inputClasses} placeholder="e.g. Tech" />
                        </div>
                    </div>
                    <div>
                      <label className={labelClasses}>Skills & Interests</label>
                      <div className="flex gap-2 mb-2">
                        <input type="text" value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyPress={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddSkill(); } }} className={inputClasses} placeholder="Type & Press Enter" />
                        <Button type="button" variant="secondary" onClick={handleAddSkill} className="rounded-xl px-6">Add</Button>
                      </div>
                      <div className="flex flex-wrap gap-2 min-h-[40px]">
                        {formData.skills.map((skill, idx) => (
                          <span key={idx} className="px-3 py-1 bg-burgundy/10 text-burgundy rounded-full text-sm font-semibold flex items-center gap-2 animate-fadeIn">
                            {skill}
                            <button type="button" onClick={() => handleRemoveSkill(skill)} className="hover:text-red-500"><X size={14} /></button>
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                        <label htmlFor="goals" className={labelClasses}>Your Goals</label>
                        <textarea id="goals" name="goals" value={formData.goals} onChange={handleChange} rows={3} className={inputClasses} placeholder="What do you hope to achieve?" />
                    </div>
                  </>
                )}

                {formData.role === 'mentor' && (
                    <>
                    {/* Simplified Mentor View for brevity - uses same styling */}
                     <div><label htmlFor="industry" className={labelClasses}>Industry *</label><input id="industry" name="industry" type="text" value={formData.industry} onChange={handleChange} required className={inputClasses} /></div>
                     <div><label htmlFor="experience" className={labelClasses}>Experience *</label><textarea id="experience" name="experience" value={formData.experience} onChange={handleChange} required rows={4} className={inputClasses} placeholder="Share your professional journey..." /></div>
                    </>
                )}

                <div className="flex gap-3 mt-6">
                  <Button type="button" variant="outline" onClick={handlePrevious} className="flex-1 py-3 rounded-xl border-burgundy/30 text-burgundy hover:bg-burgundy/5">Back</Button>
                  <Button type="button" variant="primary" onClick={handleNext} className="flex-1 py-3 rounded-xl shadow-lg shadow-burgundy/20">Next</Button>
                </div>
              </div>
            )}

            {/* ================= STEP 3: FINAL TOUCHES ================= */}
            {currentStep === 3 && (
              <div className="space-y-5 animate-slideUp">
                <div className="text-center mb-6">
                    <div className="inline-block p-4 bg-burgundy/10 rounded-full mb-2">
                        <Sparkles className="text-burgundy h-8 w-8" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800">Almost There!</h3>
                    <p className="text-sm text-gray-500">Just a little bit more about you.</p>
                </div>

                <div>
                  <label htmlFor="bio" className={labelClasses}>Bio (Optional)</label>
                  <textarea id="bio" name="bio" value={formData.bio} onChange={handleChange} rows={4} className={inputClasses} placeholder="Tell the community about yourself..." />
                </div>

                <div className="flex items-start gap-3 p-4 bg-burgundy/5 rounded-xl border border-burgundy/10">
                  <div className="flex h-5 items-center">
                    <input
                        id="agreement"
                        name="agreement"
                        type="checkbox"
                        checked={formData.agreement || false}
                        onChange={(e) => setFormData({ ...formData, agreement: e.target.checked })}
                        className="h-5 w-5 rounded border-burgundy/30 text-burgundy focus:ring-burgundy cursor-pointer"
                        required
                    />
                  </div>
                  <label htmlFor="agreement" className="text-sm text-gray-600">
                    I agree to the{' '}
                    <Link to="/privacy-policy" className="font-bold text-burgundy hover:underline" onClick={() => sessionStorage.setItem('signupFormData', JSON.stringify(formData))}>Privacy Policy</Link>
                    {' '}and{' '}
                    <Link to="/terms-of-use" className="font-bold text-burgundy hover:underline" onClick={() => sessionStorage.setItem('signupFormData', JSON.stringify(formData))}>Terms of Use</Link>.
                  </label>
                </div>

                <div className="flex gap-3 mt-6">
                  <Button type="button" variant="outline" onClick={handlePrevious} className="flex-1 py-3.5 rounded-xl border-burgundy/30 text-burgundy hover:bg-burgundy/5">Back</Button>
                  <Button type="submit" variant="primary" className="flex-1 py-3.5 rounded-xl shadow-xl shadow-burgundy/20 font-bold text-lg">
                    <UserPlus size={20} className="inline mr-2 mb-1" /> Sign Up
                  </Button>
                </div>
              </div>
            )}

          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-burgundy hover:underline underline-offset-4">
                Log in here
              </Link>
            </p>
          </div>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* --- CSS ANIMATIONS --- */}
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slowZoom { from { transform: scale(1); } to { transform: scale(1.1); } }
        @keyframes float { 0%, 100% { transform: translateY(0px) rotate(var(--rot)); } 50% { transform: translateY(-10px) rotate(var(--rot)); } }

        .animate-fadeIn { animation: fadeIn 0.8s ease-out forwards; }
        .animate-slideUp { animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-slowZoom { animation: slowZoom 20s linear infinite alternate; }
        .animate-float-slow { --rot: 12deg; animation: float 6s ease-in-out infinite; }
        .animate-float-medium { --rot: -45deg; animation: float 8s ease-in-out infinite; }
        .animate-float-fast { --rot: 90deg; animation: float 10s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default Signup;