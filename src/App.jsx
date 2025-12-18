import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import LearningHub from './pages/LearningHub';
import MentorshipMatch from './pages/MentorshipMatch';
import Marketplace from './pages/Marketplace';
import CommunityForum from './pages/CommunityForum';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfUse from './pages/TermsOfUse';
import EditProfile from './pages/EditProfile';
import Footer from './components/Footer'

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-background flex flex-col">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-use" element={<TermsOfUse />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <div className="flex-grow">
                     <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/learning" element={<LearningHub />} />
                     <Route path="/mentorship" element={<MentorshipMatch />} />
                        <Route path="/marketplace" element={<Marketplace />} />
                        <Route path="/forum" element={<CommunityForum />} />
                        <Route path="/edit-profile" element={<EditProfile />} />
                     </Routes>
                  </div>
                  <Footer />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
