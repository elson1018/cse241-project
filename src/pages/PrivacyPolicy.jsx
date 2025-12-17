import { useNavigate, useLocation } from 'react-router-dom';
import Button from '../components/Button';
import { ArrowLeft } from 'lucide-react';

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const PrivacyPolicy = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const now = new Date();
    const month = monthNames[now.getMonth()];
    const year = now.getFullYear();

    const handleBack = () => {
      // If there's a previous location in history, go back
      // Otherwise, navigate to signup page
      if (window.history.length > 1) {
        navigate(-1);
      } else {
        navigate('/signup', { replace: false });
      }
    };

  return (
    <div className="min-h-screen bg-background py-12 px-6">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={handleBack}
            className="mb-4"
          >
            <ArrowLeft size={18} className="inline mr-2" />
            Back
          </Button>
        </div>
        <h1 className="text-3xl font-bold text-primary mb-6">Privacy Policy</h1>
        
        <p className="mb-4 text-text-main">
          This Privacy Policy explains how we collect, use, and protect your data when using the Wonder Women platform.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">1. Information We Collect</h2>
        <p className="text-text-main mb-3">
          We may collect personal information such as:
        </p>
        <ul className="list-disc pl-6 mb-4 text-text-main">
          <li>Name</li>
          <li>Username</li>
          <li>Email (if provided)</li>
          <li>Profile details such as bio, skills, or goals</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-2">2. How We Use Your Information</h2>
        <p className="text-text-main mb-4">
          Your information is used to:
        </p>
        <ul className="list-disc pl-6 mb-4 text-text-main">
          <li>Create and manage your account</li>
          <li>Support mentor–mentee interactions</li>
          <li>Improve user experience and platform features</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-2">3. Data Protection</h2>
        <p className="text-text-main mb-4">
          We take reasonable security measures to protect your information from unauthorized access.
          However, no method is 100% secure.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">4. Sharing of Information</h2>
        <p className="text-text-main mb-4">
          We do not sell or trade your personal data. Information may be shared only with mentors, mentees,
          or entrepreneurs as part of the platform's core functions.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">5. Your Rights</h2>
        <p className="text-text-main mb-4">
          You may request to update or remove your account information at any time.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">6. Updates to This Policy</h2>
        <p className="text-text-main mb-4">
          We may update this Privacy Policy occasionally. You will be notified of major changes.
        </p>

        <p className="text-sm text-gray-600 mt-10">
          Last updated: {month} {year}
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
