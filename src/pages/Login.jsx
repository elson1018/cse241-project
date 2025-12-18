import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Toast from '../components/Toast';
import { LogIn, Eye, EyeOff, Sparkles } from 'lucide-react';

// --- ASSETS ---
import heroWomanImg from '../assets/hero-woman.jpg';
import flowerDeco1 from '../assets/flower-deco1.jpg';
import flowerDeco2 from '../assets/flower-deco2.jpg';
import flowerDeco3 from '../assets/flower-deco3.jpg';

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
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = login(username, password);

    if (result.success) {
      setToast({ message: 'Login successful!', type: 'success' });
      setTimeout(() => {
        navigate('/dashboard');
      }, 500);
    } else {
      setToast({ message: result.error || 'Invalid credentials', type: 'error' });
    }
  };

  const inputClasses = "appearance-none block w-full px-4 py-3.5 border border-burgundy/20 rounded-xl bg-burgundy/5 text-gray-800 placeholder-burgundy/40 focus:outline-none focus:ring-2 focus:ring-burgundy focus:border-transparent focus:bg-white transition-all duration-200 sm:text-sm";

  return (
    <div className="min-h-screen flex bg-white">

      {/* ================= LEFT SIDE (Hero) ================= */}
      <div className="hidden lg:block relative w-0 flex-1 bg-burgundy/5 overflow-hidden">
        {/* Added a slow zoom effect to the hero image */}
        <img
          className="absolute inset-0 h-full w-full object-cover animate-slowZoom"
          src={heroWomanImg}
          alt="Wonder Women Background"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/20 mix-blend-multiply"></div>

        {/* Branding Overlay */}
        <div className="absolute top-8 left-8 z-10 flex items-center gap-3 animate-fadeIn delay-100">
            <div className="p-2 bg-white/20 backdrop-blur-md rounded-lg shadow-lg border border-white/10">
                <Sparkles className="text-white h-6 w-6" />
            </div>
             <div>
                <h1 className="text-white font-bold text-3xl tracking-wider uppercase drop-shadow-md">Wonder Women</h1>
                <p className="text-white/90 text-xs tracking-widest font-medium">Empower. Connect. Lead.</p>
             </div>
        </div>
      </div>

      {/* ================= RIGHT SIDE (Form) ================= */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24 bg-white relative overflow-hidden">

        {/* --- ANIMATED FLOWERS --- */}
        {/* Added 'animate-float' classes with different durations */}
        <img src={flowerDeco1} alt="" className="absolute -top-12 -right-12 w-64 h-auto object-contain opacity-15 pointer-events-none rotate-12 animate-float-slow" />
        <img src={flowerDeco2} alt="" className="absolute -bottom-16 -right-8 w-72 h-auto object-contain opacity-15 pointer-events-none -rotate-45 animate-float-medium" />
        <img src={flowerDeco3} alt="" className="absolute top-1/3 -left-20 w-56 h-auto object-contain opacity-10 pointer-events-none rotate-90 animate-float-fast" />

        <div className="mx-auto w-full max-w-sm lg:w-96 relative z-10">

          {/* Header (Slides in first) */}
          <div className="text-center mb-10 animate-slideUp" style={{ animationDelay: '0.1s' }}>
            <div className="inline-block p-3 rounded-full bg-burgundy/5 mb-4">
                <Sparkles size={32} className="text-burgundy" />
            </div>
            <h2 className="text-4xl font-extrabold text-burgundy mb-2 tracking-tight">
              Welcome Back
            </h2>
            <p className="text-gray-500 text-sm">
              Enter your credentials to access your dashboard.
            </p>
          </div>

          <div className="mt-8">
            {/* Form (Slides in second) */}
            <form onSubmit={handleSubmit} className="space-y-5 animate-slideUp" style={{ animationDelay: '0.2s' }}>
              <div>
                <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">
                  Username
                </label>
                <input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required className={inputClasses} placeholder="Enter your username" />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">
                  Password
                </label>
                <div className="relative">
                  <input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required className={`${inputClasses} pr-10`} placeholder="Enter your password" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-burgundy transition-colors">
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end">
                <Link to="/forgot-password" className="text-xs font-medium text-burgundy hover:text-burgundy/80 hover:underline">
                    Forgot password?
                </Link>
              </div>

              <Button type="submit" variant="primary" className="w-full py-3.5 rounded-xl shadow-lg shadow-burgundy/20 hover:shadow-burgundy/40 transition-all transform active:scale-[0.98] font-bold text-base">
                <LogIn size={18} className="inline mr-2 mb-0.5" />
                Sign In
              </Button>
            </form>

            {/* --- NEW: Social Login Section (Slides in third) --- */}
            <div className="mt-8 animate-slideUp" style={{ animationDelay: '0.3s' }}>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-400 uppercase tracking-wider text-xs font-medium">Or continue with</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button type="button" className="w-full inline-flex justify-center py-2.5 px-4 border border-gray-200 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/></svg>
                  <span className="ml-2">Google</span>
                </button>
                <button type="button" className="w-full inline-flex justify-center py-2.5 px-4 border border-gray-200 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05,20.28c-0.98,0.97-2.53,0.86-3.35-0.54l-0.5-0.84c-0.34-0.58-0.94-0.91-1.61-0.91c-0.65,0-1.28,0.36-1.61,0.92l-0.52,0.88c-0.83,1.36-2.34,1.46-3.3,0.5c-0.26-0.26-0.45-0.57-0.57-0.91c-0.68-1.92,1.32-8.08,5.92-8.08c1.32,0,2.5,0.44,3.29,1.08c0.8-0.62,1.96-1.07,3.25-1.07c4.35,0,6.56,6.23,5.93,8.08C23.08,20.89,19.34,22.56,17.05,20.28z M12.03,7.25c-0.12-2.84,2.22-5.21,5.1-5.25C17.29,4.98,14.93,7.34,12.03,7.25z"/></svg>
                  <span className="ml-2">Apple</span>
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-10 text-center animate-slideUp" style={{ animationDelay: '0.4s' }}>
              <p className="text-gray-500 text-sm">
                Don't have an account?{' '}
                <Link to="/signup" className="font-bold text-burgundy hover:text-burgundy/80 transition-colors">
                  Sign up
                </Link>
              </p>
              <button onClick={() => setShowPrivacyModal(true)} className="mt-4 text-xs text-gray-400 hover:text-burgundy transition-colors">
                Privacy & Policy
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={showPrivacyModal} onClose={() => setShowPrivacyModal(false)} title="Privacy & Policy">
        <div className="space-y-4 text-gray-800"><p className="text-sm">Privacy content...</p><div className="pt-4"><Button variant="primary" onClick={() => setShowPrivacyModal(false)} className="w-full">I Understand</Button></div></div>
      </Modal>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* --- CSS ANIMATIONS --- */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slowZoom {
          from { transform: scale(1); }
          to { transform: scale(1.1); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(var(--rot)); }
          50% { transform: translateY(-15px) rotate(var(--rot)); }
        }

        .animate-fadeIn { animation: fadeIn 1s ease-out forwards; opacity: 0; }
        .animate-slideUp { animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
        .animate-slowZoom { animation: slowZoom 20s linear infinite alternate; }

        .animate-float-slow { --rot: 12deg; animation: float 6s ease-in-out infinite; }
        .animate-float-medium { --rot: -45deg; animation: float 8s ease-in-out infinite; }
        .animate-float-fast { --rot: 90deg; animation: float 10s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default Login;