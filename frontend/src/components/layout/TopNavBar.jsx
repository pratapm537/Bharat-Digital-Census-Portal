import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { LogOut, User, Menu, X, Landmark } from 'lucide-react';

const TopNavBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Dynamic customization preferences states sync
  const [lang, setLang] = useState(localStorage.getItem('portal_language') || 'English');
  const [theme, setTheme] = useState(localStorage.getItem('portal_theme') || 'Light');
  const [accessibility, setAccessibility] = useState(localStorage.getItem('portal_accessibility') || 'Normal Font');

  useEffect(() => {
    // Initial sync
    const currentTheme = localStorage.getItem('portal_theme') || 'Light';
    setTheme(currentTheme);
    if (currentTheme === 'Dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    const currentAccess = localStorage.getItem('portal_accessibility') || 'Normal Font';
    setAccessibility(currentAccess);
    const html = document.documentElement;
    if (currentAccess === 'Medium Font') {
      html.style.fontSize = '17px';
    } else if (currentAccess === 'Large Font') {
      html.style.fontSize = '19px';
    } else {
      html.style.fontSize = '15px'; // default
    }

    const currentLang = localStorage.getItem('portal_language') || 'English';
    setLang(currentLang);

    // Dynamic listeners
    const handleLangChange = () => {
      setLang(localStorage.getItem('portal_language') || 'English');
    };
    const handleThemeChange = () => {
      const activeTheme = localStorage.getItem('portal_theme') || 'Light';
      setTheme(activeTheme);
      if (activeTheme === 'Dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };
    const handleAccessChange = () => {
      const activeAccess = localStorage.getItem('portal_accessibility') || 'Normal Font';
      setAccessibility(activeAccess);
      if (activeAccess === 'Medium Font') {
        html.style.fontSize = '17px';
      } else if (activeAccess === 'Large Font') {
        html.style.fontSize = '19px';
      } else {
        html.style.fontSize = '15px';
      }
    };

    window.addEventListener('languageChange', handleLangChange);
    window.addEventListener('themeChange', handleThemeChange);
    window.addEventListener('accessibilityChange', handleAccessChange);

    return () => {
      window.removeEventListener('languageChange', handleLangChange);
      window.removeEventListener('themeChange', handleThemeChange);
      window.removeEventListener('accessibilityChange', handleAccessChange);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  // Translation helpers
  const t = (key) => {
    const translations = {
      English: {
        Home: "Home",
        Dashboard: "Dashboard",
        FileCensus: "File Census",
        Certificates: "Certificates",
        Appointments: "Appointments",
        Notifications: "Notifications",
        Grievances: "Grievances",
        Profile: "Profile",
        OfficerPortal: "Officer Portal",
        SignIn: "Sign In",
        Register: "Register",
        SignOut: "Sign Out",
        Ministry: "Ministry of Home Affairs",
        BrandName: "Bharat Census"
      },
      Hindi: {
        Home: "होम",
        Dashboard: "डैशबोर्ड",
        FileCensus: "जनगणना भरें",
        Certificates: "प्रमाण पत्र",
        Appointments: "नियुक्ति",
        Notifications: "सूचनाएं",
        Grievances: "शिकायतें",
        Profile: "प्रोफ़ाइल",
        OfficerPortal: "अधिकारी पोर्टल",
        SignIn: "साइन इन करें",
        Register: "पंजीकरण",
        SignOut: "साइन आउट",
        Ministry: "गृह मंत्रालय",
        BrandName: "भारत जनगणना"
      },
      Tamil: {
        Home: "முகப்பு",
        Dashboard: "டாஷ்போர்டு",
        FileCensus: "சென்சஸ் தாக்கல்",
        Certificates: "சான்றிதழ்கள்",
        Appointments: "நியமனங்கள்",
        Notifications: "அறிவிப்புகள்",
        Grievances: "புகார்கள்",
        Profile: "சுயவிவரம்",
        OfficerPortal: "அதிகாரி போர்ட்டல்",
        SignIn: "உள்நுழைக",
        Register: "பதிவு",
        SignOut: "வெளியேறு",
        Ministry: "உள்துறை அமைச்சகம்",
        BrandName: "பாரத் சென்சஸ்"
      },
      Telugu: {
        Home: "హోమ్",
        Dashboard: "డ్యాష్‌బోర్డ్",
        FileCensus: "సెన్సస్ ఫైల్",
        Certificates: "ధృవపత్రాలు",
        Appointments: "నియామకాలు",
        Notifications: "నోటిఫికేషన్లు",
        Grievances: "ఫిర్యాదులు",
        Profile: "ప్రొఫైల్",
        OfficerPortal: "అధికారి పోర్టల్",
        SignIn: "సైన్ ఇన్",
        Register: "రిజిస్టర్",
        SignOut: "సైన్ అవుట్",
        Ministry: "హోం వ్యవహారాల మంత్రిత్వ శాఖ",
        BrandName: "భారత్ సెన్సస్"
      },
      Bengali: {
        Home: "হোম",
        Dashboard: "ড্যাশবোর্ড",
        FileCensus: "আবেদনপত্র",
        Certificates: "সার্টিফিকেট",
        Appointments: "অ্যাপয়েন্টমেন্ট",
        Notifications: "বিজ্ঞপ্তি",
        Grievances: "অভিযোগ",
        Profile: "প্রোফাইল",
        OfficerPortal: "অফিসার পোর্টাল",
        SignIn: "সাইন ইন",
        Register: "নিবন্ধন",
        SignOut: "সাইন আউট",
        Ministry: "স্বরাষ্ট্র মন্ত্রক",
        BrandName: "ভারত সেন্সাস"
      }
    };
    const currentLang = lang || 'English';
    if (translations[currentLang] && translations[currentLang][key]) {
      return translations[currentLang][key];
    }
    return translations['English'][key] || key;
  };

  return (
    <header className="bg-surface/90 backdrop-blur-md border-b border-outlineVariant/30 sticky top-0 z-50 shadow-sm transition-all dark:bg-slate-900/90 dark:border-slate-800">
      <div className="max-w-containerMax mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <Link to="/" className="flex items-center gap-2 hover:opacity-95 transition-opacity">
          <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white shadow-sm dark:bg-[#ff9933]">
            <Landmark className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-semibold text-lg md:text-xl text-primary leading-tight dark:text-white">{t('BrandName')}</h1>
            <p className="text-[10px] text-onSurfaceVariant uppercase font-bold tracking-wider hidden sm:block dark:text-slate-400">{t('Ministry')}</p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 h-full font-medium text-sm">
          <Link 
            to="/" 
            className={`flex items-center h-full px-2 text-onSurfaceVariant hover:text-primary transition-colors border-b-2 dark:text-slate-300 dark:hover:text-[#ff9933] ${
              isActive('/') ? 'border-primary text-primary dark:border-[#ff9933] dark:text-[#ff9933]' : 'border-transparent'
            }`}
          >
            {t('Home')}
          </Link>
          
          {user?.role === 'CITIZEN' && (
            <>
              <Link 
                to="/dashboard" 
                className={`flex items-center h-full px-2 text-onSurfaceVariant hover:text-primary transition-colors border-b-2 dark:text-slate-300 dark:hover:text-[#ff9933] ${
                  isActive('/dashboard') ? 'border-primary text-primary dark:border-[#ff9933] dark:text-[#ff9933]' : 'border-transparent'
                }`}
              >
                {t('Dashboard')}
              </Link>
              <Link 
                to="/wizard" 
                className={`flex items-center h-full px-2 text-onSurfaceVariant hover:text-primary transition-colors border-b-2 dark:text-slate-300 dark:hover:text-[#ff9933] ${
                  isActive('/wizard') ? 'border-primary text-primary dark:border-[#ff9933] dark:text-[#ff9933]' : 'border-transparent'
                }`}
              >
                {t('FileCensus')}
              </Link>
              <Link 
                to="/certificates" 
                className={`flex items-center h-full px-2 text-onSurfaceVariant hover:text-primary transition-colors border-b-2 dark:text-slate-300 dark:hover:text-[#ff9933] ${
                  isActive('/certificates') ? 'border-primary text-primary dark:border-[#ff9933] dark:text-[#ff9933]' : 'border-transparent'
                }`}
              >
                {t('Certificates')}
              </Link>
              <Link 
                to="/appointments" 
                className={`flex items-center h-full px-2 text-onSurfaceVariant hover:text-primary transition-colors border-b-2 dark:text-slate-300 dark:hover:text-[#ff9933] ${
                  isActive('/appointments') ? 'border-primary text-primary dark:border-[#ff9933] dark:text-[#ff9933]' : 'border-transparent'
                }`}
              >
                {t('Appointments')}
              </Link>
              <Link 
                to="/notifications" 
                className={`flex items-center h-full px-2 text-onSurfaceVariant hover:text-primary transition-colors border-b-2 dark:text-slate-300 dark:hover:text-[#ff9933] ${
                  isActive('/notifications') ? 'border-primary text-primary dark:border-[#ff9933] dark:text-[#ff9933]' : 'border-transparent'
                }`}
              >
                {t('Notifications')}
              </Link>
              <Link 
                to="/grievance" 
                className={`flex items-center h-full px-2 text-onSurfaceVariant hover:text-primary transition-colors border-b-2 dark:text-slate-300 dark:hover:text-[#ff9933] ${
                  isActive('/grievance') ? 'border-primary text-primary dark:border-[#ff9933] dark:text-[#ff9933]' : 'border-transparent'
                }`}
              >
                {t('Grievances')}
              </Link>
              <Link 
                to="/profile" 
                className={`flex items-center h-full px-2 text-onSurfaceVariant hover:text-primary transition-colors border-b-2 dark:text-slate-300 dark:hover:text-[#ff9933] ${
                  isActive('/profile') ? 'border-primary text-primary dark:border-[#ff9933] dark:text-[#ff9933]' : 'border-transparent'
                }`}
              >
                {t('Profile')}
              </Link>
            </>
          )}

          {user?.role === 'OFFICER' && (
            <Link 
              to="/admin" 
              className={`flex items-center h-full px-2 text-onSurfaceVariant hover:text-primary transition-colors border-b-2 dark:text-slate-300 dark:hover:text-[#ff9933] ${
                isActive('/admin') ? 'border-primary text-primary dark:border-[#ff9933] dark:text-[#ff9933]' : 'border-transparent'
              }`}
            >
              {t('OfficerPortal')}
            </Link>
          )}
        </nav>

        {/* User Session Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex flex-col text-right">
                <span className="text-sm font-semibold text-primary dark:text-white">{user.fullName}</span>
                <span className="text-[10px] bg-primary-container/30 text-primary px-2 py-0.5 rounded-full font-bold uppercase w-max ml-auto dark:bg-[#ff9933]/20 dark:text-[#ff9933]">
                  {user.role}
                </span>
              </div>
              <button 
                onClick={handleLogout}
                className="bg-surface border border-outlineVariant/50 text-onSurfaceVariant hover:text-primary hover:border-primary px-4 py-2 rounded-full font-medium text-xs flex items-center gap-2 transition-all hover:shadow-sm dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:border-[#ff9933] dark:hover:text-[#ff9933]"
              >
                <LogOut className="w-3.5 h-3.5" /> {t('SignOut')}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link 
                to="/login"
                className="text-primary hover:bg-primary-container/10 px-5 py-2 rounded-full font-medium text-sm transition-colors border border-transparent dark:text-slate-300"
              >
                {t('SignIn')}
              </Link>
              <Link 
                to="/login?mode=signup"
                className="bg-primary text-white hover:bg-primary-light px-5 py-2 rounded-full font-medium text-sm transition-all shadow-sm active:scale-95"
              >
                {t('Register')}
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1 rounded-md text-onSurfaceVariant hover:text-primary hover:bg-primary-container/10 transition-colors dark:text-slate-300"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-outlineVariant/30 bg-surface/95 backdrop-blur-md absolute top-16 left-0 w-full shadow-lg z-40 py-4 px-6 flex flex-col gap-4 animate-fade-in dark:bg-slate-900/95 dark:border-slate-800">
          <Link 
            to="/" 
            onClick={() => setMobileMenuOpen(false)}
            className={`font-semibold py-2 border-b border-outlineVariant/20 dark:border-slate-800 ${isActive('/') ? 'text-primary dark:text-[#ff9933]' : 'text-onSurfaceVariant dark:text-slate-300'}`}
          >
            {t('Home')}
          </Link>
          
          {user?.role === 'CITIZEN' && (
            <>
              <Link 
                to="/dashboard" 
                onClick={() => setMobileMenuOpen(false)}
                className={`font-semibold py-2 border-b border-outlineVariant/20 dark:border-slate-800 ${isActive('/dashboard') ? 'text-primary dark:text-[#ff9933]' : 'text-onSurfaceVariant dark:text-slate-300'}`}
              >
                {t('Dashboard')}
              </Link>
              <Link 
                to="/wizard" 
                onClick={() => setMobileMenuOpen(false)}
                className={`font-semibold py-2 border-b border-outlineVariant/20 dark:border-slate-800 ${isActive('/wizard') ? 'text-primary dark:text-[#ff9933]' : 'text-onSurfaceVariant dark:text-slate-300'}`}
              >
                {t('FileCensus')}
              </Link>
              <Link 
                to="/certificates" 
                onClick={() => setMobileMenuOpen(false)}
                className={`font-semibold py-2 border-b border-outlineVariant/20 dark:border-slate-800 ${isActive('/certificates') ? 'text-primary dark:text-[#ff9933]' : 'text-onSurfaceVariant dark:text-slate-300'}`}
              >
                {t('Certificates')}
              </Link>
              <Link 
                to="/appointments" 
                onClick={() => setMobileMenuOpen(false)}
                className={`font-semibold py-2 border-b border-outlineVariant/20 dark:border-slate-800 ${isActive('/appointments') ? 'text-primary dark:text-[#ff9933]' : 'text-onSurfaceVariant dark:text-slate-300'}`}
              >
                {t('Appointments')}
              </Link>
              <Link 
                to="/notifications" 
                onClick={() => setMobileMenuOpen(false)}
                className={`font-semibold py-2 border-b border-outlineVariant/20 dark:border-slate-800 ${isActive('/notifications') ? 'text-primary dark:text-[#ff9933]' : 'text-onSurfaceVariant dark:text-slate-300'}`}
              >
                {t('Notifications')}
              </Link>
              <Link 
                to="/grievance" 
                onClick={() => setMobileMenuOpen(false)}
                className={`font-semibold py-2 border-b border-outlineVariant/20 dark:border-slate-800 ${isActive('/grievance') ? 'text-primary dark:text-[#ff9933]' : 'text-onSurfaceVariant dark:text-slate-300'}`}
              >
                {t('Grievances')}
              </Link>
              <Link 
                to="/profile" 
                onClick={() => setMobileMenuOpen(false)}
                className={`font-semibold py-2 border-b border-outlineVariant/20 dark:border-slate-800 ${isActive('/profile') ? 'text-primary dark:text-[#ff9933]' : 'text-onSurfaceVariant dark:text-slate-300'}`}
              >
                {t('Profile')}
              </Link>
            </>
          )}

          {user?.role === 'OFFICER' && (
            <Link 
              to="/admin" 
              onClick={() => setMobileMenuOpen(false)}
              className={`font-semibold py-2 border-b border-outlineVariant/20 dark:border-slate-800 ${isActive('/admin') ? 'text-primary dark:text-[#ff9933]' : 'text-onSurfaceVariant dark:text-slate-300'}`}
            >
              {t('OfficerPortal')}
            </Link>
          )}

          {user ? (
            <div className="flex flex-col gap-2 pt-2 border-t border-outlineVariant/30 dark:border-slate-800">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary dark:bg-slate-800 dark:text-white">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-bold text-primary dark:text-white">{user.fullName}</p>
                  <p className="text-[10px] text-onSurfaceVariant uppercase font-bold dark:text-slate-400">{user.role}</p>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="w-full bg-primary-container/20 text-primary border border-primary/20 py-2.5 rounded-full font-semibold text-sm flex items-center justify-center gap-2 hover:bg-primary-container/40 transition-colors dark:bg-slate-800 dark:text-[#ff9933] dark:border-slate-700"
              >
                <LogOut className="w-4 h-4" /> {t('SignOut')}
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2 pt-2 border-t border-outlineVariant/30 dark:border-slate-800">
              <Link 
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-full font-semibold text-sm text-primary hover:bg-primary-container/10 border border-outlineVariant/50 transition-colors dark:text-slate-300 dark:border-slate-700"
              >
                {t('SignIn')}
              </Link>
              <Link 
                to="/login?mode=signup"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-full font-semibold text-sm bg-primary text-white hover:bg-primary-light transition-colors shadow-sm"
              >
                {t('Register')}
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default TopNavBar;
