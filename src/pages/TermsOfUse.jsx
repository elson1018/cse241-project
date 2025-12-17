import { useNavigate, useLocation } from 'react-router-dom';
import Button from '../components/Button';
import { ArrowLeft } from 'lucide-react';

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const TermsOfUse = () => {
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
        <h1 className="text-3xl font-bold text-primary mb-6">Terms of Use</h1>
        
        <p className="mb-4 text-text-main">
          By using the Wonder Women platform, you agree to the following terms and conditions.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">1. Acceptance of Terms</h2>
        <p className="text-text-main mb-4">
          By accessing and using this platform, you accept and agree to be bound by the terms and provision of this agreement.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">2. User Responsibilities</h2>
        <p className="text-text-main mb-3">
          Users are responsible for:
        </p>
        <ul className="list-disc pl-6 mb-4 text-text-main">
          <li>Maintaining the confidentiality of account credentials</li>
          <li>Providing accurate and truthful information</li>
          <li>Respecting other users and maintaining professional conduct</li>
          <li>Complying with all applicable laws and regulations</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-2">3. Platform Usage</h2>
        <p className="text-text-main mb-4">
          The platform is intended for educational, mentorship, and business networking purposes. 
          Users must not use the platform for any illegal or unauthorized purpose.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">4. Content and Intellectual Property</h2>
        <p className="text-text-main mb-4">
          Users retain ownership of content they post. By posting content, users grant the platform 
          a license to display and distribute such content within the platform.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">5. Prohibited Activities</h2>
        <p className="text-text-main mb-3">
          Users are prohibited from:
        </p>
        <ul className="list-disc pl-6 mb-4 text-text-main">
          <li>Harassing, threatening, or abusing other users</li>
          <li>Posting false, misleading, or fraudulent information</li>
          <li>Violating any applicable laws or regulations</li>
          <li>Attempting to gain unauthorized access to the platform</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-2">6. Termination</h2>
        <p className="text-text-main mb-4">
          We reserve the right to suspend or terminate accounts that violate these terms or engage 
          in harmful behavior.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">7. Limitation of Liability</h2>
        <p className="text-text-main mb-4">
          The platform is provided "as is" without warranties. We are not liable for any damages 
          arising from the use of the platform.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">8. Changes to Terms</h2>
        <p className="text-text-main mb-4">
          We reserve the right to modify these terms at any time. Continued use of the platform 
          constitutes acceptance of modified terms.
        </p>

        <p className="text-sm text-gray-600 mt-10">
          Last updated: {month} {year}
        </p>
      </div>
    </div>
  );
};

export default TermsOfUse;

