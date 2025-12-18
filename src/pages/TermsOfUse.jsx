import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { ArrowLeft, FileText } from 'lucide-react';

// Assets
import flowerDeco1 from '../assets/flower-deco1.jpg';
import flowerDeco3 from '../assets/flower-deco3.jpg'; // Using a different flower for variety

const TermsOfUse = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-orange-50/30 relative overflow-hidden py-12 px-4 sm:px-6">

      {/* --- BACKGROUND DECORATIONS --- */}
      <img src={flowerDeco3} alt="" className="absolute -top-20 -left-20 w-80 h-auto opacity-10 pointer-events-none rotate-45" />
      <img src={flowerDeco1} alt="" className="absolute bottom-0 right-0 w-64 h-auto opacity-10 pointer-events-none" />

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
              <FileText className="text-burgundy h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Terms of Use</h1>
              <p className="text-gray-500 text-sm">Please read these terms carefully.</p>
            </div>
          </div>

          <div className="space-y-8 text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-burgundy mb-3">1. Acceptance of Terms</h2>
              <p>
                By accessing or using the Wonder Women platform, you agree to be bound by these Terms of Use and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-burgundy mb-3">2. User Conduct</h2>
              <p>
                You agree to use the platform only for lawful purposes. You are strictly prohibited from:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Harassing, abusing, or harming another person.</li>
                <li>Impersonating any person or entity.</li>
                <li>Posting content that is hateful, threatening, or pornographic.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-burgundy mb-3">3. Intellectual Property</h2>
              <p>
                The content, features, and functionality of Wonder Women (including text, graphics, and logos) are owned by us and are protected by international copyright, trademark, and other intellectual property laws.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-burgundy mb-3">4. Termination</h2>
              <p>
                We reserve the right to terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
              </p>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-100 flex justify-center">
            <Button variant="primary" onClick={() => navigate(-1)} className="px-8 py-3 rounded-xl">
              Accept & Continue
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TermsOfUse;