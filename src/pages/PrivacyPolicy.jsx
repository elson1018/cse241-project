import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { ArrowLeft, Shield } from 'lucide-react';

// Assets
import flowerDeco1 from '../assets/flower-deco1.jpg';
import flowerDeco2 from '../assets/flower-deco2.jpg';

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-orange-50/30 relative overflow-hidden py-12 px-4 sm:px-6">

      {/* --- BACKGROUND DECORATIONS --- */}
      <img src={flowerDeco1} alt="" className="absolute -top-10 -right-10 w-64 h-auto opacity-10 pointer-events-none rotate-12" />
      <img src={flowerDeco2} alt="" className="absolute -bottom-10 -left-10 w-64 h-auto opacity-10 pointer-events-none -rotate-12" />

      <div className="max-w-4xl mx-auto relative z-10">

        {/* Navigation Bar */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-burgundy font-semibold hover:underline transition-all"
          >
            <ArrowLeft size={20} className="mr-2" /> Back
          </button>
        </div>

        {/* Main Document Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-burgundy/5 p-8 md:p-12 border border-burgundy/10">

          <div className="flex items-center gap-4 mb-8 border-b border-gray-100 pb-6">
            <div className="p-3 bg-burgundy/10 rounded-full">
              <Shield className="text-burgundy h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
              <p className="text-gray-500 text-sm">Last updated: December 18, 2024</p>
            </div>
          </div>

          <div className="space-y-8 text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-burgundy mb-3">1. Information We Collect</h2>
              <p>
                At Wonder Women, we collect information you provide directly to us, such as when you create an account, update your profile, or communicate with other users. This may include your name, email address, bio, skills, and professional interests.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-burgundy mb-3">2. How We Use Your Information</h2>
              <p>
                We use the information we collect to provide, maintain, and improve our services. This includes:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Connecting mentors with mentees based on shared interests.</li>
                <li>Personalizing your learning hub recommendations.</li>
                <li>Sending you technical notices and support messages.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-burgundy mb-3">3. Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect your personal information against accidental or unlawful destruction, loss, alteration, or unauthorized disclosure.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-burgundy mb-3">4. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at <span className="font-semibold text-burgundy">support@wonderwomen.com</span>.
              </p>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-100 flex justify-center">
            <Button variant="primary" onClick={() => navigate(-1)} className="px-8 py-3 rounded-xl">
              I Understand
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;