import React, { useState, useEffect } from 'react'; // Import useState and useEffect
import { Link } from 'react-router-dom';
import {
  Facebook, Twitter, Instagram, Linkedin, Mail, MapPin, Phone,
  Heart, Target, Eye, Sparkles, Globe, Smile, Users, Quote, ArrowUp
} from 'lucide-react';

// Assets
import flowerDeco2 from '../assets/flower-deco2.jpg';

const Footer = () => {
  // State to track if the button should be visible
  const [showScrollButton, setShowScrollButton] = useState(false);

  // Function to handle scrolling
  useEffect(() => {
    const handleScroll = () => {
      // If user scrolls down more than 300px, show the button
      if (window.scrollY > 300) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };

    // Add event listener
    window.addEventListener('scroll', handleScroll);

    // Clean up event listener on component unmount
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="relative bg-[#4A1D24] text-pink-50 pt-24 pb-12 overflow-hidden font-sans">

      {/* --- BACKGROUND DECORATIONS --- */}
      {/* Flower */}
      <img
        src={flowerDeco2}
        alt=""
        className="absolute bottom-0 right-0 w-[600px] h-auto opacity-5 pointer-events-none mix-blend-screen rotate-12 translate-x-20 translate-y-20 blur-[2px]"
      />
      {/* Glow Effect */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-[#4A1D24]/30 via-transparent to-transparent pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* ================= SECTION 1: PURPOSE (About, Mission, Vision) ================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20 pb-16 border-b border-pink-500/20">
            {/* About */}
            <div className="group hover:-translate-y-1 transition-transform duration-300">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-full bg-white/5 border border-white/10 group-hover:bg-yellow-400/20 group-hover:border-yellow-400/50 transition-colors">
                        <Sparkles size={24} className="text-yellow-400" />
                    </div>
                    <h3 className="font-bold font-serif text-2xl tracking-wide text-white">About Us</h3>
                </div>
                <p className="text-pink-100/80 text-sm leading-relaxed">
                    Wonder Women is a digital ecosystem dedicated to bridging the gender gap. We support SDG 5 by connecting women to technology, education, and economic opportunities.
                </p>
            </div>
            {/* Mission */}
            <div className="group hover:-translate-y-1 transition-transform duration-300">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-full bg-white/5 border border-white/10 group-hover:bg-pink-400/20 group-hover:border-pink-400/50 transition-colors">
                        <Target size={24} className="text-pink-300" />
                    </div>
                    <h3 className="font-bold font-serif text-2xl tracking-wide text-white">Our Mission</h3>
                </div>
                <p className="text-pink-100/80 text-sm leading-relaxed">
                    To empower 1 million women by 2030 by providing equitable access to world-class education, career mentorship, and global marketplaces.
                </p>
            </div>
            {/* Vision */}
            <div className="group hover:-translate-y-1 transition-transform duration-300">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-full bg-white/5 border border-white/10 group-hover:bg-purple-400/20 group-hover:border-purple-400/50 transition-colors">
                        <Eye size={24} className="text-purple-300" />
                    </div>
                    <h3 className="font-bold font-serif text-2xl tracking-wide text-white">Our Vision</h3>
                </div>
                <p className="text-pink-100/80 text-sm leading-relaxed">
                    A world where gender is no longer a barrier to leadership. We envision a future where every woman leads with confidence.
                </p>
            </div>
        </div>

        {/* ================= SECTION 2: STATISTICS (Glass Cards) ================= */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center mb-20">
            {[
                { icon: Heart, val: '10k+', label: 'Women Empowered', color: 'text-pink-400' },
                { icon: Globe, val: '25+', label: 'Countries', color: 'text-blue-300' },
                { icon: Users, val: '500+', label: 'Active Mentors', color: 'text-yellow-300' },
                { icon: Smile, val: '99%', label: 'Satisfaction', color: 'text-green-300' },
            ].map((stat, idx) => (
                <div key={idx} className="p-6 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm hover:bg-white/10 hover:border-white/20 transition-all duration-300 transform hover:-translate-y-1 shadow-lg">
                    <stat.icon className={`mx-auto ${stat.color} mb-3`} size={28} />
                    <h4 className="text-3xl font-bold text-white mb-1">{stat.val}</h4>
                    <p className="text-xs uppercase tracking-widest text-pink-200/60 font-semibold">{stat.label}</p>
                </div>
            ))}
        </div>

        {/* ================= SECTION 3: TESTIMONIALS (Full Width) ================= */}
        <div className="mb-20 pb-16 border-b border-pink-500/20 relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#4A1D24] px-4">
                 {/* Decorative divider label */}
            </div>
            <div className="text-center mb-12">
                <h3 className="text-3xl font-bold text-white font-serif">Trusted by <span className="text-pink-300">Leaders</span></h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Testimonial Cards */}
                {[
                    { text: "The mentorship program completely changed my career trajectory. I found a role model who guided me through my first promotion.", name: "Jane Doe", role: "Software Engineer", initials: "JD", color: "bg-pink-500" },
                    { text: "I found my first 100 customers through the Marketplace. The community support here is unlike anywhere else.", name: "Maria R.", role: "Entrepreneur", initials: "MR", color: "bg-purple-500" },
                    { text: "SkillUp Learning gave me the confidence to pivot into Tech. The courses are accessible, fun, and incredibly relevant.", name: "Aisha Khan", role: "Data Analyst", initials: "AK", color: "bg-yellow-500" },
                ].map((t, i) => (
                    <div key={i} className="bg-gradient-to-br from-white/10 to-white/5 p-8 rounded-3xl border border-white/10 relative hover:shadow-xl transition-shadow">
                        <Quote className="absolute top-6 right-6 text-white/10 rotate-180" size={48} />
                        <p className="text-pink-50 italic mb-6 text-sm leading-relaxed relative z-10">"{t.text}"</p>
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center font-bold text-white text-xs shadow-md`}>{t.initials}</div>
                            <div>
                                <p className="font-bold text-white text-sm">{t.name}</p>
                                <p className="text-xs text-pink-300">{t.role}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* ================= SECTION 4: MEET THE INNOVATORS ================= */}
        <div className="mb-20 pb-16 border-b border-pink-500/20">
            <div className="text-center mb-12">
                 <h3 className="text-3xl font-bold text-white font-serif">Meet the <span className="text-pink-300">Innovators</span></h3>
                 <p className="text-xs text-pink-200 mt-2 uppercase tracking-widest font-medium">The minds behind the code</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                {[
                    { name: "Ivan Lim", role: "Project Leader", initials: "Ivan", color: "from-pink-500 to-red-500" },
                    { name: "Elson Ooi", role: "Software Engineer", initials: "Elson", color: "from-blue-500 to-indigo-500" },
                    { name: "Yap Han lim", role: "Software Engineer", initials: "Yap", color: "from-purple-500 to-violet-500" },
                    { name: "Lau Jun Hao", role: "Business Analyst", initials: "Lau", color: "from-green-400 to-emerald-600" }
                ].map((member, i) => (
                    <div key={i} className="group flex flex-col items-center p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 cursor-pointer">
                        <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${member.color} flex items-center justify-center font-bold text-white text-2xl mb-4 shadow-lg`}>
                            {member.initials}
                        </div>
                        <p className="font-bold text-white text-lg">{member.name}</p>
                        <p className="text-sm text-pink-300/80">{member.role}</p>
                    </div>
                ))}
            </div>
        </div>

        {/* ================= SECTION 5: NEWSLETTER ================= */}
        <div className="text-center mb-20 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-pink-500/5 to-transparent blur-3xl"></div>
            <h2 className="text-4xl md:text-5xl font-bold font-serif mb-6 text-white drop-shadow-md relative z-10">
                Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-yellow-200">Scale Up?</span>
            </h2>
            <p className="text-pink-100/80 mb-10 max-w-xl mx-auto text-lg relative z-10">
                Join the ecosystem. Exclusive insights on mentorship, entrepreneurship, and leadership delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-lg mx-auto relative z-10">
                <input
                    type="email"
                    placeholder="Enter your email address"
                    className="w-full px-6 py-4 rounded-full bg-black/20 border border-pink-500/30 text-white placeholder-pink-200/50 focus:outline-none focus:bg-black/40 focus:border-pink-400 transition-all backdrop-blur-md shadow-inner"
                />
                <button className="px-10 py-4 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-full transition-colors shadow-lg shadow-pink-900/20">
                    Subscribe
                </button>
            </div>
        </div>

        {/* ================= SECTION 6: NAVIGATION LINKS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12 pt-12 border-t border-pink-500/20">

          {/* Column 1 */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="w-1.5 h-6 bg-yellow-400 rounded-full shadow-[0_0_10px_rgba(250,204,21,0.5)]"></div>
                <h3 className="text-xl font-bold text-white">Services</h3>
            </div>
            <ul className="space-y-3 text-pink-100/60 text-sm">
              <li><Link to="/learning" className="hover:text-white hover:pl-2 transition-all duration-300 inline-block">SkillUp Learning</Link></li>
              <li><Link to="/mentorship" className="hover:text-white hover:pl-2 transition-all duration-300 inline-block">Mentorship Match</Link></li>
              <li><Link to="/marketplace" className="hover:text-white hover:pl-2 transition-all duration-300 inline-block">Marketplace</Link></li>
              <li><Link to="/forum" className="hover:text-white hover:pl-2 transition-all duration-300 inline-block">Community Forum</Link></li>
            </ul>
          </div>

          {/* Column 2 */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="w-1.5 h-6 bg-pink-400 rounded-full shadow-[0_0_10px_rgba(244,114,182,0.5)]"></div>
                <h3 className="text-xl font-bold text-white">Company</h3>
            </div>
            <ul className="space-y-3 text-pink-100/60 text-sm">
              <li><Link to="/about" className="hover:text-white hover:pl-2 transition-all duration-300 inline-block">Our Story</Link></li>
              <li><Link to="/team" className="hover:text-white hover:pl-2 transition-all duration-300 inline-block">Meet the Team</Link></li>
              <li><Link to="/impact" className="hover:text-white hover:pl-2 transition-all duration-300 inline-block">Impact Report</Link></li>
              <li><Link to="/careers" className="hover:text-white hover:pl-2 transition-all duration-300 inline-block">Careers</Link></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div className="space-y-6">
             <div className="flex items-center gap-3">
                <div className="w-1.5 h-6 bg-purple-400 rounded-full shadow-[0_0_10px_rgba(192,132,252,0.5)]"></div>
                <h3 className="text-xl font-bold text-white">Legal</h3>
            </div>
            <ul className="space-y-3 text-pink-100/60 text-sm">
              <li><Link to="/terms-of-use" className="hover:text-white hover:pl-2 transition-all duration-300 inline-block">Terms of Service</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-white hover:pl-2 transition-all duration-300 inline-block">Privacy Policy</Link></li>
              <li><Link to="/cookies" className="hover:text-white hover:pl-2 transition-all duration-300 inline-block">Cookie Settings</Link></li>
              <li><Link to="/accessibility" className="hover:text-white hover:pl-2 transition-all duration-300 inline-block">Accessibility</Link></li>
            </ul>
          </div>

          {/* Column 4 */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="w-1.5 h-6 bg-red-400 rounded-full shadow-[0_0_10px_rgba(248,113,113,0.5)]"></div>
                <h3 className="text-xl font-bold text-white">Contact</h3>
            </div>
            <ul className="space-y-3 text-pink-100/60 text-sm">
              <li className="block">
                <span className="block text-white font-medium mb-1">Headquarters</span>
                11800 USM<br />Penang Malaysia
              </li>
              <li className="flex items-center gap-2">
                 <Mail size={16} />
                 <a href="mailto:hello@wonderwomen.com" className="hover:text-white transition-colors">hello@wonderwomen.com</a>
              </li>

              <div className="flex gap-4 pt-4">
                <a href="#" className="bg-white/5 p-3 rounded-full hover:bg-white hover:text-[#5D182E] transition-all hover:scale-110"><Facebook size={18} /></a>
                <a href="#" className="bg-white/5 p-3 rounded-full hover:bg-white hover:text-[#5D182E] transition-all hover:scale-110"><Instagram size={18} /></a>
                <a href="#" className="bg-white/5 p-3 rounded-full hover:bg-white hover:text-[#5D182E] transition-all hover:scale-110"><Linkedin size={18} /></a>
              </div>
            </ul>
          </div>
        </div>

        {/* ================= COPYRIGHT & BACK TO TOP ================= */}
        {/* CHANGED: justify-between -> justify-center (Centers everything in this row) */}
        <div className="border-t border-pink-500/10 pt-8 flex flex-col items-center justify-center text-xs text-pink-100/30">

          {/* CHANGED: justify-center (Centers the text group) */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 w-full">
            <p>&copy; {new Date().getFullYear()} Wonder Women. All rights reserved.</p>
            <div className="flex items-center gap-2 bg-black/20 px-4 py-1.5 rounded-full border border-white/5 backdrop-blur-sm">
              <span>Made with</span>
              <Heart size={12} className="text-red-400 fill-current animate-pulse" />
              <span>for SDG 5</span>
            </div>
          </div>

          <button
            onClick={scrollToTop}
            className={`fixed bottom-10 right-10 z-50 w-12 h-12 bg-pink-500 hover:bg-pink-400 rounded-full flex items-center justify-center text-white shadow-lg shadow-pink-500/30 transition-all duration-300 hover:-translate-y-1 animate-bounce ${showScrollButton ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}
            title="Back to Top"
          >
            <ArrowUp size={24} />
          </button>
        </div>

      </div>
    </footer>
  );
};

export default Footer;