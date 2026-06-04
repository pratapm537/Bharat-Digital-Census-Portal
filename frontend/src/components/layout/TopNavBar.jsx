import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { LogOut, User, Menu, X, Landmark, FileText, BarChart2 } from 'lucide-react';

const TopNavBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-surface/90 backdrop-blur-md border-b border-outlineVariant/30 sticky top-0 z-50 shadow-sm transition-all">
      <div className="max-w-containerMax mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <Link to="/" className="flex items-center gap-2 hover:opacity-95 transition-opacity">
          <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white shadow-sm">
            <Landmark className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-semibold text-lg md:text-xl text-primary leading-tight">Bharat Census</h1>
            <p className="text-[10px] text-onSurfaceVariant uppercase font-bold tracking-wider hidden sm:block">Ministry of Home Affairs</p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 h-full font-medium text-sm">
          <Link 
            to="/" 
            className={`flex items-center h-full px-2 text-onSurfaceVariant hover:text-primary transition-colors border-b-2 ${
              isActive('/') ? 'border-primary text-primary' : 'border-transparent'
            }`}
          >
            Home
          </Link>
          
          {user?.role === 'CITIZEN' && (
            <>
              <Link 
                to="/dashboard" 
                className={`flex items-center h-full px-2 text-onSurfaceVariant hover:text-primary transition-colors border-b-2 ${
                  isActive('/dashboard') ? 'border-primary text-primary' : 'border-transparent'
                }`}
              >
                Dashboard
              </Link>
              <Link 
                to="/wizard" 
                className={`flex items-center h-full px-2 text-onSurfaceVariant hover:text-primary transition-colors border-b-2 ${
                  isActive('/wizard') ? 'border-primary text-primary' : 'border-transparent'
                }`}
              >
                File Census
              </Link>
              <Link 
                to="/certificates" 
                className={`flex items-center h-full px-2 text-onSurfaceVariant hover:text-primary transition-colors border-b-2 ${
                  isActive('/certificates') ? 'border-primary text-primary' : 'border-transparent'
                }`}
              >
                Certificates
              </Link>
              <Link 
                to="/appointments" 
                className={`flex items-center h-full px-2 text-onSurfaceVariant hover:text-primary transition-colors border-b-2 ${
                  isActive('/appointments') ? 'border-primary text-primary' : 'border-transparent'
                }`}
              >
                Appointments
              </Link>
            </>
          )}

          {user?.role === 'OFFICER' && (
            <Link 
              to="/admin" 
              className={`flex items-center h-full px-2 text-onSurfaceVariant hover:text-primary transition-colors border-b-2 ${
                isActive('/admin') ? 'border-primary text-primary' : 'border-transparent'
              }`}
            >
              Officer Portal
            </Link>
          )}
        </nav>

        {/* User Session Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex flex-col text-right">
                <span className="text-sm font-semibold text-primary">{user.fullName}</span>
                <span className="text-[10px] bg-primary-container/30 text-primary px-2 py-0.5 rounded-full font-bold uppercase w-max ml-auto">
                  {user.role}
                </span>
              </div>
              <button 
                onClick={handleLogout}
                className="bg-surface border border-outlineVariant/50 text-onSurfaceVariant hover:text-primary hover:border-primary px-4 py-2 rounded-full font-medium text-xs flex items-center gap-2 transition-all hover:shadow-sm"
              >
                <LogOut className="w-3.5 h-3.5" /> Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link 
                to="/login"
                className="text-primary hover:bg-primary-container/10 px-5 py-2 rounded-full font-medium text-sm transition-colors border border-transparent"
              >
                Sign In
              </Link>
              <Link 
                to="/login?mode=signup"
                className="bg-primary text-white hover:bg-primary-light px-5 py-2 rounded-full font-medium text-sm transition-all shadow-sm active:scale-95"
              >
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1 rounded-md text-onSurfaceVariant hover:text-primary hover:bg-primary-container/10 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-outlineVariant/30 bg-surface/95 backdrop-blur-md absolute top-16 left-0 w-full shadow-lg z-40 py-4 px-6 flex flex-col gap-4 animate-fade-in">
          <Link 
            to="/" 
            onClick={() => setMobileMenuOpen(false)}
            className={`font-semibold py-2 border-b border-outlineVariant/20 ${isActive('/') ? 'text-primary' : 'text-onSurfaceVariant'}`}
          >
            Home
          </Link>
          
          {user?.role === 'CITIZEN' && (
            <>
              <Link 
                to="/dashboard" 
                onClick={() => setMobileMenuOpen(false)}
                className={`font-semibold py-2 border-b border-outlineVariant/20 ${isActive('/dashboard') ? 'text-primary' : 'text-onSurfaceVariant'}`}
              >
                Dashboard
              </Link>
              <Link 
                to="/wizard" 
                onClick={() => setMobileMenuOpen(false)}
                className={`font-semibold py-2 border-b border-outlineVariant/20 ${isActive('/wizard') ? 'text-primary' : 'text-onSurfaceVariant'}`}
              >
                File Census
              </Link>
              <Link 
                to="/certificates" 
                onClick={() => setMobileMenuOpen(false)}
                className={`font-semibold py-2 border-b border-outlineVariant/20 ${isActive('/certificates') ? 'text-primary' : 'text-onSurfaceVariant'}`}
              >
                Certificates
              </Link>
              <Link 
                to="/appointments" 
                onClick={() => setMobileMenuOpen(false)}
                className={`font-semibold py-2 border-b border-outlineVariant/20 ${isActive('/appointments') ? 'text-primary' : 'text-onSurfaceVariant'}`}
              >
                Appointments
              </Link>
            </>
          )}

          {user?.role === 'OFFICER' && (
            <Link 
              to="/admin" 
              onClick={() => setMobileMenuOpen(false)}
              className={`font-semibold py-2 border-b border-outlineVariant/20 ${isActive('/admin') ? 'text-primary' : 'text-onSurfaceVariant'}`}
            >
              Officer Portal
            </Link>
          )}

          {user ? (
            <div className="flex flex-col gap-2 pt-2 border-t border-outlineVariant/30">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-bold text-primary">{user.fullName}</p>
                  <p className="text-[10px] text-onSurfaceVariant uppercase font-bold">{user.role}</p>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="w-full bg-primary-container/20 text-primary border border-primary/20 py-2.5 rounded-full font-semibold text-sm flex items-center justify-center gap-2 hover:bg-primary-container/40 transition-colors"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2 pt-2 border-t border-outlineVariant/30">
              <Link 
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-full font-semibold text-sm text-primary hover:bg-primary-container/10 border border-outlineVariant/50 transition-colors"
              >
                Sign In
              </Link>
              <Link 
                to="/login?mode=signup"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-full font-semibold text-sm bg-primary text-white hover:bg-primary-light transition-colors shadow-sm"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default TopNavBar;
