import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { LogOut, User, Menu, X, Landmark, FileText, BarChart2, ChevronDown, ClipboardCheck, Search, ShieldCheck, ShieldAlert, LifeBuoy, Mail, Clipboard } from 'lucide-react';

const TopNavBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [opsDropdownOpen, setOpsDropdownOpen] = useState(false);
  const [mobileOpsOpen, setMobileOpsOpen] = useState(false);

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
                to="/benefits-eligibility" 
                className={`flex items-center h-full px-2 text-onSurfaceVariant hover:text-primary transition-colors border-b-2 ${
                  isActive('/benefits-eligibility') ? 'border-primary text-primary' : 'border-transparent'
                }`}
              >
                Benefits
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
              <Link 
                to="/notifications" 
                className={`flex items-center h-full px-2 text-onSurfaceVariant hover:text-primary transition-colors border-b-2 ${
                  isActive('/notifications') ? 'border-primary text-primary' : 'border-transparent'
                }`}
              >
                Notifications
              </Link>
              <Link 
                to="/grievance" 
                className={`flex items-center h-full px-2 text-onSurfaceVariant hover:text-primary transition-colors border-b-2 ${
                  isActive('/grievance') ? 'border-primary text-primary' : 'border-transparent'
                }`}
              >
                Grievances
              </Link>
              <Link 
                to="/profile" 
                className={`flex items-center h-full px-2 text-onSurfaceVariant hover:text-primary transition-colors border-b-2 ${
                  isActive('/profile') ? 'border-primary text-primary' : 'border-transparent'
                }`}
              >
                Profile
              </Link>
            </>
          )}

          {user?.role === 'OFFICER' && (
            <>
              <Link 
                to="/admin" 
                className={`flex items-center h-full px-2 text-onSurfaceVariant hover:text-primary transition-colors border-b-2 ${
                  isActive('/admin') ? 'border-primary text-primary' : 'border-transparent'
                }`}
              >
                Verification Queue
              </Link>
              <Link 
                to="/admin/officers" 
                className={`flex items-center h-full px-2 text-onSurfaceVariant hover:text-primary transition-colors border-b-2 ${
                  isActive('/admin/officers') ? 'border-primary text-primary' : 'border-transparent'
                }`}
              >
                Officer Management
              </Link>
              <Link 
                to="/admin/territories" 
                className={`flex items-center h-full px-2 text-onSurfaceVariant hover:text-primary transition-colors border-b-2 ${
                  isActive('/admin/territories') ? 'border-primary text-primary' : 'border-transparent'
                }`}
              >
                Territory Management
              </Link>
              <div 
                className="relative h-full flex items-center"
                onMouseEnter={() => setOpsDropdownOpen(true)}
                onMouseLeave={() => setOpsDropdownOpen(false)}
              >
                <button 
                  className={`flex items-center gap-1.5 h-full px-2 text-onSurfaceVariant hover:text-primary transition-colors border-b-2 cursor-pointer outline-none ${
                    isActive('/admin/field-verification') || isActive('/admin/analytics') || isActive('/admin/search') || isActive('/admin/document-verification') || isActive('/admin/fraud-detection') || isActive('/admin/grievance-management') || isActive('/admin/communication-center') || isActive('/admin/reports-center')
                      ? 'border-primary text-primary' 
                      : 'border-transparent'
                  }`}
                >
                  Census Operations <ChevronDown className="w-3.5 h-3.5" />
                </button>
                {opsDropdownOpen && (
                  <div className="absolute top-16 left-0 w-56 bg-surface border border-outlineVariant/30 rounded-lg shadow-premium py-2 flex flex-col z-50 animate-fade-in dark:bg-black">
                    <Link 
                      to="/admin/field-verification" 
                      onClick={() => setOpsDropdownOpen(false)}
                      className={`px-4 py-2 text-xs font-semibold hover:bg-primary/5 transition-colors flex items-center gap-2 ${
                        isActive('/admin/field-verification') ? 'text-primary bg-primary/5' : 'text-onSurfaceVariant'
                      }`}
                    >
                      <ClipboardCheck className="w-4 h-4 text-primary" /> Field Verification
                    </Link>
                    <Link 
                      to="/admin/analytics" 
                      onClick={() => setOpsDropdownOpen(false)}
                      className={`px-4 py-2 text-xs font-semibold hover:bg-primary/5 transition-colors flex items-center gap-2 ${
                        isActive('/admin/analytics') ? 'text-primary bg-primary/5' : 'text-onSurfaceVariant'
                      }`}
                    >
                      <BarChart2 className="w-4 h-4 text-primary" /> Population Analytics
                    </Link>
                    <Link 
                      to="/admin/search" 
                      onClick={() => setOpsDropdownOpen(false)}
                      className={`px-4 py-2 text-xs font-semibold hover:bg-primary/5 transition-colors flex items-center gap-2 ${
                        isActive('/admin/search') ? 'text-primary bg-primary/5' : 'text-onSurfaceVariant'
                      }`}
                    >
                      <Search className="w-4 h-4 text-primary" /> Citizen Search
                    </Link>
                    <Link 
                      to="/admin/document-verification" 
                      onClick={() => setOpsDropdownOpen(false)}
                      className={`px-4 py-2 text-xs font-semibold hover:bg-primary/5 transition-colors flex items-center gap-2 ${
                        isActive('/admin/document-verification') ? 'text-primary bg-primary/5' : 'text-onSurfaceVariant'
                      }`}
                    >
                      <ShieldCheck className="w-4 h-4 text-primary" /> Document Verification
                    </Link>
                    <Link 
                      to="/admin/fraud-detection" 
                      onClick={() => setOpsDropdownOpen(false)}
                      className={`px-4 py-2 text-xs font-semibold hover:bg-primary/5 transition-colors flex items-center gap-2 ${
                        isActive('/admin/fraud-detection') ? 'text-primary bg-primary/5' : 'text-onSurfaceVariant'
                      }`}
                    >
                      <ShieldAlert className="w-4 h-4 text-primary" /> Fraud Detection
                    </Link>
                    <Link 
                      to="/admin/grievance-management" 
                      onClick={() => setOpsDropdownOpen(false)}
                      className={`px-4 py-2 text-xs font-semibold hover:bg-primary/5 transition-colors flex items-center gap-2 ${
                        isActive('/admin/grievance-management') ? 'text-primary bg-primary/5' : 'text-onSurfaceVariant'
                      }`}
                    >
                      <LifeBuoy className="w-4 h-4 text-primary" /> Grievance Management
                    </Link>
                    <Link 
                      to="/admin/communication-center" 
                      onClick={() => setOpsDropdownOpen(false)}
                      className={`px-4 py-2 text-xs font-semibold hover:bg-primary/5 transition-colors flex items-center gap-2 ${
                        isActive('/admin/communication-center') ? 'text-primary bg-primary/5' : 'text-onSurfaceVariant'
                      }`}
                    >
                      <Mail className="w-4 h-4 text-primary" /> Communication Center
                    </Link>
                    <Link 
                      to="/admin/reports-center" 
                      onClick={() => setOpsDropdownOpen(false)}
                      className={`px-4 py-2 text-xs font-semibold hover:bg-primary/5 transition-colors flex items-center gap-2 ${
                        isActive('/admin/reports-center') ? 'text-primary bg-primary/5' : 'text-onSurfaceVariant'
                      }`}
                    >
                      <Clipboard className="w-4 h-4 text-primary" /> Reports Center
                    </Link>
                  </div>
                )}
              </div>
            </>
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
                to="/benefits-eligibility" 
                onClick={() => setMobileMenuOpen(false)}
                className={`font-semibold py-2 border-b border-outlineVariant/20 ${isActive('/benefits-eligibility') ? 'text-primary' : 'text-onSurfaceVariant'}`}
              >
                Benefits
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
              <Link 
                to="/notifications" 
                onClick={() => setMobileMenuOpen(false)}
                className={`font-semibold py-2 border-b border-outlineVariant/20 ${isActive('/notifications') ? 'text-primary' : 'text-onSurfaceVariant'}`}
              >
                Notifications
              </Link>
              <Link 
                to="/grievance" 
                onClick={() => setMobileMenuOpen(false)}
                className={`font-semibold py-2 border-b border-outlineVariant/20 ${isActive('/grievance') ? 'text-primary' : 'text-onSurfaceVariant'}`}
              >
                Grievances
              </Link>
              <Link 
                to="/profile" 
                onClick={() => setMobileMenuOpen(false)}
                className={`font-semibold py-2 border-b border-outlineVariant/20 ${isActive('/profile') ? 'text-primary' : 'text-onSurfaceVariant'}`}
              >
                Profile
              </Link>
            </>
          )}

          {user?.role === 'OFFICER' && (
            <>
              <Link 
                to="/admin" 
                onClick={() => setMobileMenuOpen(false)}
                className={`font-semibold py-2 border-b border-outlineVariant/20 ${isActive('/admin') ? 'text-primary' : 'text-onSurfaceVariant'}`}
              >
                Verification Queue
              </Link>
              <Link 
                to="/admin/officers" 
                onClick={() => setMobileMenuOpen(false)}
                className={`font-semibold py-2 border-b border-outlineVariant/20 ${isActive('/admin/officers') ? 'text-primary' : 'text-onSurfaceVariant'}`}
              >
                Officer Management
              </Link>
              <Link 
                to="/admin/territories" 
                onClick={() => setMobileMenuOpen(false)}
                className={`font-semibold py-2 border-b border-outlineVariant/20 ${isActive('/admin/territories') ? 'text-primary' : 'text-onSurfaceVariant'}`}
              >
                Territory Management
              </Link>
              <button 
                onClick={() => setMobileOpsOpen(!mobileOpsOpen)}
                className="font-semibold py-2 border-b border-outlineVariant/20 text-onSurfaceVariant text-left flex justify-between items-center w-full cursor-pointer outline-none"
              >
                <span>Census Operations</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileOpsOpen ? 'rotate-180' : ''}`} />
              </button>
              {mobileOpsOpen && (
                <div className="flex flex-col pl-4 border-l border-outlineVariant/20 gap-2 mt-1 animate-fade-in">
                  <Link 
                    to="/admin/field-verification" 
                    onClick={() => { setMobileMenuOpen(false); setMobileOpsOpen(false); }}
                    className={`font-semibold py-1.5 text-xs ${isActive('/admin/field-verification') ? 'text-primary' : 'text-onSurfaceVariant'}`}
                  >
                    Field Verification
                  </Link>
                  <Link 
                    to="/admin/analytics" 
                    onClick={() => { setMobileMenuOpen(false); setMobileOpsOpen(false); }}
                    className={`font-semibold py-1.5 text-xs ${isActive('/admin/analytics') ? 'text-primary' : 'text-onSurfaceVariant'}`}
                  >
                    Population Analytics
                  </Link>
                  <Link 
                    to="/admin/search" 
                    onClick={() => { setMobileMenuOpen(false); setMobileOpsOpen(false); }}
                    className={`font-semibold py-1.5 text-xs ${isActive('/admin/search') ? 'text-primary' : 'text-onSurfaceVariant'}`}
                  >
                    Citizen Search
                  </Link>
                  <Link 
                    to="/admin/document-verification" 
                    onClick={() => { setMobileMenuOpen(false); setMobileOpsOpen(false); }}
                    className={`font-semibold py-1.5 text-xs ${isActive('/admin/document-verification') ? 'text-primary' : 'text-onSurfaceVariant'}`}
                  >
                    Document Verification
                  </Link>
                  <Link 
                    to="/admin/fraud-detection" 
                    onClick={() => { setMobileMenuOpen(false); setMobileOpsOpen(false); }}
                    className={`font-semibold py-1.5 text-xs ${isActive('/admin/fraud-detection') ? 'text-primary' : 'text-onSurfaceVariant'}`}
                  >
                    Fraud Detection
                  </Link>
                  <Link 
                    to="/admin/grievance-management" 
                    onClick={() => { setMobileMenuOpen(false); setMobileOpsOpen(false); }}
                    className={`font-semibold py-1.5 text-xs ${isActive('/admin/grievance-management') ? 'text-primary' : 'text-onSurfaceVariant'}`}
                  >
                    Grievance Management
                  </Link>
                  <Link 
                    to="/admin/communication-center" 
                    onClick={() => { setMobileMenuOpen(false); setMobileOpsOpen(false); }}
                    className={`font-semibold py-1.5 text-xs ${isActive('/admin/communication-center') ? 'text-primary' : 'text-onSurfaceVariant'}`}
                  >
                    Communication Center
                  </Link>
                  <Link 
                    to="/admin/reports-center" 
                    onClick={() => { setMobileMenuOpen(false); setMobileOpsOpen(false); }}
                    className={`font-semibold py-1.5 text-xs ${isActive('/admin/reports-center') ? 'text-primary' : 'text-onSurfaceVariant'}`}
                  >
                    Reports Center
                  </Link>
                </div>
              )}
            </>
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
