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
import CertificateCenter from './pages/CertificateCenter.jsx';
import AppointmentBooking from './pages/AppointmentBooking.jsx';
import NotificationCenter from './pages/NotificationCenter.jsx';

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

        {/* Private Officer Routes */}
        <Route
          path="/admin"
          element={
            <OfficerRoute>
              <Admin />
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
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
