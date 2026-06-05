import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import TopNavBar from './components/layout/TopNavBar.jsx';
import Footer from './components/layout/Footer.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Wizard from './pages/Wizard.jsx';
import Admin from './pages/Admin.jsx';
import FamilyDashboard from './pages/FamilyDashboard.jsx';
import FamilyAnalytics from './pages/FamilyAnalytics.jsx';
import BenefitsEligibility from './pages/BenefitsEligibility.jsx';
import FamilyEmergencyProfile from './pages/FamilyEmergencyProfile.jsx';
import CommunityInsights from './pages/CommunityInsights.jsx';
import CertificateCenter from './pages/CertificateCenter.jsx';
import AppointmentBooking from './pages/AppointmentBooking.jsx';
import NotificationCenter from './pages/NotificationCenter.jsx';
import GrievanceCenter from './pages/GrievanceCenter.jsx';
import ProfileManagement from './pages/ProfileManagement.jsx';
import OfficerManagement from './pages/OfficerManagement.jsx';

// Guard for authenticated Citizen routes
const CitizenRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'CITIZEN') return <Navigate to="/" replace />;
  return children;
};

// Guard for authenticated Officer routes
const OfficerRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'OFFICER') return <Navigate to="/" replace />;
  return children;
};

const AppContent = () => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-primary">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-t-primary border-primary-container rounded-full animate-spin" />
          <p className="text-xs font-semibold tracking-wider">Verifying national credentials...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div id="google_translate_element" style={{ display: 'none' }} />
      <TopNavBar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* Private Citizen Routes */}
        <Route
          path="/dashboard"
          element={
            <CitizenRoute>
              <Dashboard />
            </CitizenRoute>
          }
        />
        <Route
          path="/wizard"
          element={
            <CitizenRoute>
              <Wizard />
            </CitizenRoute>
          }
        />
        <Route
          path="/family"
          element={
            <CitizenRoute>
              <FamilyDashboard />
            </CitizenRoute>
          }
        />
        <Route
          path="/family-analytics"
          element={
            <CitizenRoute>
              <FamilyAnalytics />
            </CitizenRoute>
          }
        />
        <Route
          path="/benefits-eligibility"
          element={
            <CitizenRoute>
              <BenefitsEligibility />
            </CitizenRoute>
          }
        />
        <Route
          path="/family-emergency"
          element={
            <CitizenRoute>
              <FamilyEmergencyProfile />
            </CitizenRoute>
          }
        />
        <Route
          path="/community-insights"
          element={
            <CitizenRoute>
              <CommunityInsights />
            </CitizenRoute>
          }
        />
        <Route
          path="/certificates"
          element={
            <CitizenRoute>
              <CertificateCenter />
            </CitizenRoute>
          }
        />
        <Route
          path="/appointments"
          element={
            <CitizenRoute>
              <AppointmentBooking />
            </CitizenRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <CitizenRoute>
              <NotificationCenter />
            </CitizenRoute>
          }
        />
        <Route
          path="/grievance"
          element={
            <CitizenRoute>
              <GrievanceCenter />
            </CitizenRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <CitizenRoute>
              <ProfileManagement />
            </CitizenRoute>
          }
        />

        {/* Private Officer Routes */}
        <Route
          path="/admin"
          element={
            <OfficerRoute>
              <Admin />
            </OfficerRoute>
          }
        />
        <Route
          path="/admin/officers"
          element={
            <OfficerRoute>
              <OfficerManagement />
            </OfficerRoute>
          }
        />

        {/* Fallback redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </Router>
  );
};

function App() {
  React.useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    const savedFontSize = localStorage.getItem('fontSize');
    if (savedFontSize) {
      document.documentElement.style.fontSize = savedFontSize;
    }

    // Set Translation Cookie from LocalStorage language key
    const savedLang = localStorage.getItem('language') || 'en';
    document.cookie = `googtrans=/en/${savedLang}; path=/`;
    document.cookie = `googtrans=/en/${savedLang}; domain=${window.location.hostname}; path=/`;

    // Initialize Google Translate Element Callback
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'en,hi,bn,ta,te,mr,gu,pa,kn,ml',
        layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false
      }, 'google_translate_element');
    };

    // Append Google Translate Script dynamically
    if (!document.getElementById('google-translate-script')) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      document.body.appendChild(script);
    }
  }, []);

  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
