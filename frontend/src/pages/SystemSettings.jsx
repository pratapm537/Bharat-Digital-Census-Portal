import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Settings, ShieldCheck, Database, Globe, Sliders, Server, 
  RefreshCw, Download, Play, HelpCircle, Save, CheckCircle2, 
  AlertTriangle, AlertCircle, Calendar, Shield, Lock, Smartphone, 
  Mail, Bell, Cpu, HardDrive, Terminal, Key, Activity, Info, 
  ChevronRight, ArrowRight, Zap, Check, X, ShieldAlert, Network
} from 'lucide-react';

// ==========================================
// INITIAL MOCK DATASETS
// ==========================================

const INITIAL_LANGUAGES = [
  { code: 'hi', name: 'Hindi', enabled: true, isDefault: true, coverage: 'National' },
  { code: 'en', name: 'English', enabled: true, isDefault: false, coverage: 'National' },
  { code: 'bn', name: 'Bengali', enabled: true, isDefault: false, coverage: 'West Bengal & East' },
  { code: 'ta', name: 'Tamil', enabled: true, isDefault: false, coverage: 'Tamil Nadu' },
  { code: 'te', name: 'Telugu', enabled: false, isDefault: false, coverage: 'Andhra & Telangana' },
  { code: 'mr', name: 'Marathi', enabled: true, isDefault: false, coverage: 'Maharashtra' },
  { code: 'gu', name: 'Gujarati', enabled: false, isDefault: false, coverage: 'Gujarat' },
  { code: 'pa', name: 'Punjabi', enabled: false, isDefault: false, coverage: 'Punjab' },
  { code: 'kn', name: 'Kannada', enabled: false, isDefault: false, coverage: 'Karnataka' },
  { code: 'ml', name: 'Malayalam', enabled: false, isDefault: false, coverage: 'Kerala' },
  { code: 'or', name: 'Odia', enabled: false, isDefault: false, coverage: 'Odisha' },
  { code: 'as', name: 'Assamese', enabled: false, isDefault: false, coverage: 'Assam' }
];

const INITIAL_AUDITS = [
  { setting: 'Password Policy Updated', oldValue: 'Min Length: 10 Chars', newValue: 'Min Length: 12 Chars', author: 'Super Admin', time: '2026-06-06 11:30 AM' },
  { setting: 'MFA Enforcement', oldValue: 'Required for Admins', newValue: 'Enforced for All Users', author: 'Super Admin', time: '2026-06-05 03:00 PM' },
  { setting: 'Registration Window', oldValue: 'Closed', newValue: 'Open (Scheduled)', author: 'National Admin', time: '2026-06-04 10:15 AM' },
  { setting: 'Aadhaar Sync Configuration', oldValue: 'Staging Endpoint', newValue: 'Production Gateway Endpoint', author: 'Super Admin', time: '2026-06-02 04:45 PM' }
];

const SystemSettings = () => {
  const navigate = useNavigate();

  // -------------------------------------------------------------
  // STATE MANAGEMENT
  // -------------------------------------------------------------
  const [activeTab, setActiveTab] = useState('general'); // 'general', 'security', 'integration', 'performance', 'backup'

  // General Settings
  const [censusYear, setCensusYear] = useState(2026);
  const [nextCensusYear, setNextCensusYear] = useState(2031);
  const [regStartDate, setRegStartDate] = useState('2026-01-01');
  const [regEndDate, setRegEndDate] = useState('2026-12-31');
  const [isRegOpen, setIsRegOpen] = useState(true);
  const [languages, setLanguages] = useState(INITIAL_LANGUAGES);

  // Security Settings
  const [isMfaEnabled, setIsMfaEnabled] = useState(true);
  const [mfaRequiredRoles, setMfaRequiredRoles] = useState('All Administrative Roles');
  const [minPasswordLength, setMinPasswordLength] = useState(12);
  const [passwordRotationDays, setPasswordRotationDays] = useState(90);
  const [passwordHistoryCount, setPasswordHistoryCount] = useState(5);
  const [isComplexityUppercase, setIsComplexityUppercase] = useState(true);
  const [isComplexityNumber, setIsComplexityNumber] = useState(true);
  const [isComplexitySpecial, setIsComplexitySpecial] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState(30);
  const [ipRestrictions, setIpRestrictions] = useState('192.168.1.0/24, 10.0.0.0/8');

  // Integrations Settings
  const [aadhaarStatus, setAadhaarStatus] = useState('Connected'); // 'Connected', 'Disconnected', 'Testing'
  const [aadhaarRequests, setAadhaarRequests] = useState(145000);
  const [aadhaarSuccessRate, setAadhaarSuccessRate] = useState(99.4);
  const [smsProvider, setSmsProvider] = useState('MSG91');
  const [smsDeliveryRate, setSmsDeliveryRate] = useState(98);
  const [smsStatus, setSmsStatus] = useState('Connected');
  const [emailProvider, setEmailProvider] = useState('SendGrid');
  const [emailDeliveryRate, setEmailDeliveryRate] = useState(99);
  const [emailStatus, setEmailStatus] = useState('Connected');
  const [firebaseStatus, setFirebaseStatus] = useState('Connected');

  // System Performance Settings
  const [cpuUsage, setCpuUsage] = useState(45);
  const [memoryUsage, setMemoryUsage] = useState(62);
  const [databaseUsage, setDatabaseUsage] = useState(28);
  const [apiResponseTime, setApiResponseTime] = useState(115); // in ms
  const [concurrentUsers, setConcurrentUsers] = useState(25000);

  // Backup & Recovery
  const [lastBackupTime, setLastBackupTime] = useState('08:00 PM Today');
  const [backupSize, setBackupSize] = useState('14.2 GB');
  const [backupStatus, setBackupStatus] = useState('Synchronized');

  // Notification settings
  const [notificationPrefs, setNotificationPrefs] = useState({
    registration: { email: true, sms: true, push: false },
    verification: { email: true, sms: true, push: true },
    complaint: { email: true, sms: false, push: true },
    officer: { email: true, sms: true, push: true }
  });

  // System Maintenance
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [scheduledMaintenance, setScheduledMaintenance] = useState('2026-06-15 02:00 AM');
  
  // Audits Timeline List
  const [auditsList, setAuditsList] = useState(INITIAL_AUDITS);

  // UI States
  const [isCompilingBackup, setIsCompilingBackup] = useState(false);
  const [testingConnection, setTestingConnection] = useState({ type: '', state: '' }); // type: 'aadhaar'|'sms'|'email', state: 'testing'|'done'
  const [toast, setToast] = useState({ type: '', message: '' });

  // Auto clear toasts
  useEffect(() => {
    if (toast.message) {
      const timer = setTimeout(() => setToast({ type: '', message: '' }), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Dynamic system metric updates simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setCpuUsage(prev => {
        const delta = Math.floor(Math.random() * 9) - 4;
        return Math.max(10, Math.min(95, prev + delta));
      });
      setMemoryUsage(prev => {
        const delta = Math.floor(Math.random() * 5) - 2;
        return Math.max(40, Math.min(90, prev + delta));
      });
      setApiResponseTime(prev => {
        const delta = Math.floor(Math.random() * 21) - 10;
        return Math.max(80, Math.min(250, prev + delta));
      });
      setConcurrentUsers(prev => {
        const delta = Math.floor(Math.random() * 501) - 250;
        return Math.max(20000, Math.min(30000, prev + delta));
      });
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  // -------------------------------------------------------------
  // ADMINISTRATIVE ACTIONS
  // -------------------------------------------------------------
  
  const handleSaveSettings = () => {
    // Append to audits
    const newLog = {
      setting: 'Global System Configurations Compiled',
      oldValue: 'Active configs state',
      newValue: 'Saved administrative updates',
      author: 'Super Admin',
      time: new Date().toLocaleString()
    };
    setAuditsList([newLog, ...auditsList]);

    setToast({ 
      type: 'success', 
      message: 'All system configurations successfully synchronized and written to database configurations.' 
    });
  };

  const handleResetSettings = () => {
    setCensusYear(2026);
    setNextCensusYear(2031);
    setRegStartDate('2026-01-01');
    setRegEndDate('2026-12-31');
    setIsRegOpen(true);
    setMinPasswordLength(12);
    setSessionTimeout(30);
    setIsMfaEnabled(true);

    setToast({ 
      type: 'warning', 
      message: 'Restored baseline system settings values. Select Save to persist.' 
    });
  };

  const handleExportConfig = () => {
    setToast({ 
      type: 'success', 
      message: 'System JSON Configuration schema downloaded successfully (v2.6.0-config).' 
    });
  };

  const handleImportConfig = () => {
    setToast({ 
      type: 'success', 
      message: 'Mock configuration template successfully parsed and populated. Review values before saving.' 
    });
  };

  // Census Cycle Controls
  const handleUpdateCensusYear = (year) => {
    setCensusYear(year);
    const log = {
      setting: 'Census Active Year Changed',
      oldValue: `${censusYear}`,
      newValue: `${year}`,
      author: 'Super Admin',
      time: new Date().toLocaleString()
    };
    setAuditsList([log, ...auditsList]);
    setToast({ type: 'success', message: `Active platform census year updated to ${year}.` });
  };

  // Multilingual configurations
  const toggleLanguage = (code) => {
    setLanguages(prev => prev.map(lang => {
      if (lang.code === code) {
        const nextState = !lang.enabled;
        setToast({ type: 'success', message: `Language ${lang.name} ${nextState ? 'enabled' : 'disabled'}.` });
        
        // Log event
        const log = {
          setting: `Language ${lang.name} Toggled`,
          oldValue: lang.enabled ? 'Enabled' : 'Disabled',
          newValue: nextState ? 'Enabled' : 'Disabled',
          author: 'Super Admin',
          time: new Date().toLocaleString()
        };
        setAuditsList(prevLogs => [log, ...prevLogs]);

        return { ...lang, enabled: nextState };
      }
      return lang;
    }));
  };

  const setDefaultLanguage = (code) => {
    setLanguages(prev => prev.map(lang => {
      if (lang.code === code) {
        setToast({ type: 'success', message: `${lang.name} successfully set as the system default language.` });
        return { ...lang, enabled: true, isDefault: true };
      }
      return { ...lang, isDefault: false };
    }));
  };

  // Connection testing module
  const runTestConnection = (type, name) => {
    setTestingConnection({ type, state: 'testing' });
    setTimeout(() => {
      setTestingConnection({ type, state: 'done' });
      setToast({ type: 'success', message: `Connection test with ${name} successful. Delivery status: 100% Operational.` });
      
      const log = {
        setting: `Test Connection Triggered`,
        oldValue: 'Pending verification',
        newValue: `Success (${name} online)`,
        author: 'Super Admin',
        time: new Date().toLocaleString()
      };
      setAuditsList(prev => [log, ...prev]);

      setTimeout(() => setTestingConnection({ type: '', state: '' }), 2000);
    }, 2000);
  };

  // Create full system backup
  const handleCreateBackup = () => {
    setIsCompilingBackup(true);
    setTimeout(() => {
      setIsCompilingBackup(false);
      const nowStr = new Date().toLocaleString();
      setLastBackupTime(nowStr);
      setBackupStatus('Synchronized');
      setToast({ type: 'success', message: `Full database archive successfully compiled and backed up (Size: 14.5 GB).` });
      
      const log = {
        setting: 'Database Backup Compiled',
        oldValue: 'Previous backup record',
        newValue: `Created full backup at ${nowStr}`,
        author: 'Super Admin',
        time: nowStr
      };
      setAuditsList(prev => [log, ...prev]);
    }, 3000);
  };

  // Notification Preferences toggle
  const toggleNotificationPref = (category, channel) => {
    setNotificationPrefs(prev => {
      const categoryPrefs = { ...prev[category] };
      categoryPrefs[channel] = !categoryPrefs[channel];
      return {
        ...prev,
        [category]: categoryPrefs
      };
    });
  };

  return (
    <div className="flex-grow w-full max-w-containerMax mx-auto px-6 py-8 flex flex-col gap-8 text-onSurface bg-background">
      
      {/* CSS Dark Mode Overrides */}
      <style>{`
        .dark .flex-grow .bg-surface,
        .dark .flex-grow .bg-surface-low,
        .dark .flex-grow .bg-surface-container,
        .dark .flex-grow .bg-surface-high,
        .dark .flex-grow .bg-surface-highest,
        .dark .flex-grow .bg-white,
        .dark .flex-grow .premium-card,
        .dark .flex-grow .absolute.z-20 {
          background-color: #000000 !important;
        }
        .dark select option {
          background-color: #000000 !important;
          color: #ffffff !important;
        }
        select option {
          background-color: #ffffff;
          color: #191c1e;
        }
      `}</style>

      {/* TOAST FEEDBACK NOTIFICATIONS */}
      {toast.message && (
        <div className={`fixed bottom-6 right-6 z-50 p-4 rounded-lg shadow-xl flex items-center gap-3 border text-xs max-w-sm animate-fade-in ${
          toast.type === 'success' ? 'bg-green-50 text-green-800 border-green-200 dark:bg-green-950/80 dark:text-green-300 dark:border-green-800' :
          toast.type === 'warning' ? 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-800' :
          'bg-red-50 text-red-800 border-red-200 dark:bg-red-950/80 dark:text-red-300 dark:border-red-800'
        }`}>
          {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 shrink-0 text-success" />}
          {toast.type === 'warning' && <AlertTriangle className="w-5 h-5 shrink-0 text-amber-500" />}
          {toast.type === 'error' && <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* SECTION 1: PAGE HEADER */}
      <section className="relative overflow-hidden rounded-xl border border-outlineVariant/50 bg-primary p-6 text-white shadow-ambient flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex flex-col gap-2 relative z-10">
          <div className="flex items-center gap-2">
            <span className="bg-[#ff9933]/20 border border-[#ff9933]/30 text-[#ff9933] font-bold uppercase text-[9px] px-2.5 py-0.5 rounded-full tracking-wider animate-pulse">
              System Administration Panel
            </span>
            <span className="text-[10px] text-white/70 font-semibold">• Ministry of Home Affairs</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
            <Settings className="w-7 h-7" /> System Settings
          </h2>
          <p className="text-xs text-white/80 max-w-xl leading-relaxed">
            Configure global platform parameters, adjust security policies, manage Aadhaar integration tokens, schedule incremental database backups, and monitor system performance.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 relative z-10 shrink-0">
          <button 
            onClick={handleSaveSettings}
            className="bg-secondary text-primary-dark font-bold text-xs px-4 py-2.5 rounded-full hover:bg-secondary/90 transition-all flex items-center gap-1.5 active:scale-95 shadow-sm cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" /> Save Changes
          </button>
          <button 
            onClick={handleResetSettings}
            className="bg-white/10 hover:bg-white/20 border border-white/25 text-white font-bold text-xs px-4 py-2.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reset Settings
          </button>
          <button 
            onClick={handleExportConfig}
            className="bg-white/10 hover:bg-white/20 border border-white/25 text-white font-bold text-xs px-4 py-2.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> Export Configuration
          </button>
          <button 
            onClick={handleImportConfig}
            className="bg-white/10 hover:bg-white/20 border border-white/25 text-white font-bold text-xs px-4 py-2.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5" /> Import Configuration
          </button>
        </div>
      </section>

      {/* SECTION 2: SYSTEM CONFIGURATION OVERVIEW */}
      <section className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {[
          { label: 'Active Modules', count: '14 Core', desc: 'Running system daemons', icon: Shield, color: 'text-primary' },
          { label: 'Enabled Integrations', count: '4 Connected', desc: 'Third-party APIs healthy', icon: Network, color: 'text-success' },
          { label: 'Security Score', count: '96%', desc: 'Access audits baseline met', icon: ShieldCheck, color: 'text-success' },
          { label: 'Active Languages', count: languages.filter(l => l.enabled).length, desc: 'Configured translations', icon: Globe, color: 'text-primary' },
          { label: 'System Uptime', count: '99.99%', desc: 'Consolidated network nodes', icon: Activity, color: 'text-primary' },
          { label: 'Census Year', count: censusYear, desc: 'Active data compilation cycle', icon: Calendar, color: 'text-amber-500' }
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-surface p-4 rounded-xl border border-outlineVariant/50 shadow-sm flex flex-col gap-1.5 hover:border-primary/50 transition-colors">
              <span className="text-[10px] font-bold text-onSurfaceVariant uppercase tracking-wider">{stat.label}</span>
              <div className="text-lg font-bold text-primary flex items-end justify-between">
                <span>{stat.count}</span>
                <Icon className="w-4 h-4 opacity-80" />
              </div>
              <p className="text-[9px] text-onSurfaceVariant">{stat.desc}</p>
            </div>
          );
        })}
      </section>

      {/* DYNAMIC TWO-COLUMN SYSTEM SETTINGS HUB */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: SETTINGS TABS & CONTROLS (7 COLS) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Inner configurations tab bar selector */}
          <div className="flex border-b border-outlineVariant/20 pb-1 text-xs overflow-x-auto gap-2">
            {[
              { id: 'general', label: 'General Parameters', icon: Globe },
              { id: 'security', label: 'Security Policies', icon: Key },
              { id: 'integration', label: 'Integrations & APIs', icon: Network },
              { id: 'performance', label: 'Performance Observability', icon: Server },
              { id: 'backup', label: 'Backup & Notifications', icon: HardDrive }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 font-bold transition-colors cursor-pointer shrink-0 border-b-2 flex items-center gap-1.5 ${
                  activeTab === tab.id 
                    ? 'border-primary text-primary' 
                    : 'border-transparent text-onSurfaceVariant hover:text-primary'
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB LAYOUTS */}
          
          {/* SECTION 3: GENERAL SETTINGS */}
          {activeTab === 'general' && (
            <div className="flex flex-col gap-6">
              
              {/* Census active cycle configuration */}
              <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
                <h3 className="font-bold text-xs text-primary uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-primary" /> Active Census Cycle Selector
                </h3>
                <p className="text-[10px] text-onSurfaceVariant leading-relaxed">
                  Defines the default active data collection cycle across the national database. Changing the active year recalculates statistics projections.
                </p>

                <div className="grid grid-cols-3 gap-4 text-xs mt-1.5">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-primary uppercase text-[8px]">Current Year</label>
                    <select 
                      value={censusYear}
                      onChange={e => handleUpdateCensusYear(Number(e.target.value))}
                      className="px-2 py-1.5 bg-surface border border-outlineVariant rounded outline-none focus:border-primary text-onSurface"
                    >
                      <option value={2026}>2026 Cycle (Active)</option>
                      <option value={2021}>2021 Cycle (Archived)</option>
                      <option value={2011}>2011 Cycle (Historical)</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-primary uppercase text-[8px]">Next Cycle</label>
                    <input 
                      type="number"
                      value={nextCensusYear}
                      onChange={e => setNextCensusYear(Number(e.target.value))}
                      className="px-2 py-1.5 bg-surface border border-outlineVariant rounded outline-none focus:border-primary text-onSurface"
                    />
                  </div>

                  <div className="flex items-end justify-end">
                    <button 
                      onClick={() => handleUpdateCensusYear(censusYear + 1)}
                      className="bg-primary hover:bg-primary-light text-white font-bold px-3 py-1.5 rounded cursor-pointer text-[10px]"
                    >
                      Archive & Increment
                    </button>
                  </div>
                </div>
              </div>

              {/* Registration Window bounds */}
              <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
                <div className="flex justify-between items-center border-b border-outlineVariant/15 pb-2">
                  <h3 className="font-bold text-xs text-primary uppercase tracking-wider flex items-center gap-1.5">
                    <Sliders className="w-4 h-4 text-primary" /> Citizen Registration Period
                  </h3>
                  <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase ${
                    isRegOpen ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    Registration {isRegOpen ? 'Open' : 'Closed'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-primary uppercase text-[8px]">Window Start Date</label>
                    <input 
                      type="date"
                      value={regStartDate}
                      onChange={e => setRegStartDate(e.target.value)}
                      className="px-2.5 py-1.5 bg-surface border border-outlineVariant rounded outline-none focus:border-primary text-onSurface"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-primary uppercase text-[8px]">Window Close Date</label>
                    <input 
                      type="date"
                      value={regEndDate}
                      onChange={e => setRegEndDate(e.target.value)}
                      className="px-2.5 py-1.5 bg-surface border border-outlineVariant rounded outline-none focus:border-primary text-onSurface"
                    />
                  </div>

                  <div className="flex items-end justify-end gap-2">
                    <button 
                      onClick={() => {
                        setIsRegOpen(!isRegOpen);
                        setToast({ type: 'warning', message: `Registration status successfully updated to: ${!isRegOpen ? 'OPEN' : 'CLOSED'}` });
                      }}
                      className={`font-bold px-3 py-1.5 rounded text-[10px] cursor-pointer ${
                        isRegOpen ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-green-500 hover:bg-green-600 text-white'
                      }`}
                    >
                      {isRegOpen ? 'Close Window' : 'Open Window'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Multilingual translations settings */}
              <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
                <h3 className="font-bold text-xs text-primary uppercase tracking-wider flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-primary" /> Supported Languages & Coverage
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5 text-xs">
                  {languages.map(lang => (
                    <div 
                      key={lang.code}
                      className={`p-3 bg-surface-low border rounded-lg flex flex-col gap-2 transition-all ${
                        lang.enabled ? 'border-primary/30' : 'border-outlineVariant/20 opacity-60'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <strong className="text-primary text-[11px]">{lang.name}</strong>
                        {lang.isDefault && (
                          <span className="bg-primary/15 text-primary text-[7px] font-bold px-1.5 py-0.5 rounded uppercase">
                            Default
                          </span>
                        )}
                      </div>
                      <span className="text-[9px] text-onSurfaceVariant">Scope: {lang.coverage}</span>
                      
                      <div className="flex justify-between gap-1.5 pt-1.5 border-t border-outlineVariant/10 mt-1">
                        <button 
                          onClick={() => toggleLanguage(lang.code)}
                          className={`font-bold text-[8px] px-2 py-0.5 rounded cursor-pointer ${
                            lang.enabled ? 'bg-red-500/10 text-red-600' : 'bg-green-500/10 text-green-600'
                          }`}
                        >
                          {lang.enabled ? 'Disable' : 'Enable'}
                        </button>
                        {!lang.isDefault && lang.enabled && (
                          <button 
                            onClick={() => setDefaultLanguage(lang.code)}
                            className="bg-primary/10 text-primary font-bold text-[8px] px-2 py-0.5 rounded cursor-pointer"
                          >
                            Set Default
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* SECTION 4: SECURITY CONFIGURATIONS */}
          {activeTab === 'security' && (
            <div className="flex flex-col gap-6">
              
              {/* Multi-Factor Authentication (MFA) */}
              <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
                <h3 className="font-bold text-xs text-primary uppercase tracking-wider flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-primary" /> Multi-Factor Authentication (MFA)
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-primary uppercase text-[8px]">Enforcement Status</label>
                    <div className="flex items-center gap-3 bg-surface-low p-2 rounded border border-outlineVariant/15">
                      <input 
                        type="checkbox"
                        checked={isMfaEnabled}
                        onChange={e => {
                          setIsMfaEnabled(e.target.checked);
                          setToast({ type: 'warning', message: `MFA enforcement state updated to: ${e.target.checked ? 'ENABLED' : 'DISABLED'}.` });
                        }}
                        className="w-4 h-4 accent-primary cursor-pointer"
                      />
                      <span>Enforce MFA System-Wide</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-primary uppercase text-[8px]">Target Required Roles</label>
                    <select 
                      value={mfaRequiredRoles}
                      onChange={e => setMfaRequiredRoles(e.target.value)}
                      className="px-2.5 py-1.5 bg-surface border border-outlineVariant rounded outline-none focus:border-primary text-onSurface"
                    >
                      <option value="All Administrative Roles">All Administrative Roles</option>
                      <option value="Super Admins Only">Super Admins Only</option>
                      <option value="State Admins & Above">State Admins & Above</option>
                    </select>
                  </div>
                </div>

                <div className="p-3 bg-surface-low border border-outlineVariant/20 rounded-lg text-[10px] text-onSurfaceVariant space-y-1">
                  <div>Verification methods supported: <strong>OTP via SMS, Authenticator App, Email Code</strong></div>
                  <div>Enabled users: <strong>5,920 administrative accounts (100% compliant)</strong></div>
                </div>
              </div>

              {/* Password complexity parameters */}
              <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
                <h3 className="font-bold text-xs text-primary uppercase tracking-wider flex items-center gap-1.5">
                  <Key className="w-4 h-4 text-primary" /> Account Password Policy
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between font-bold text-[8px] text-onSurfaceVariant">
                      <span>Min Length</span>
                      <strong className="text-primary">{minPasswordLength} Chars</strong>
                    </div>
                    <input 
                      type="number"
                      min="8"
                      max="32"
                      value={minPasswordLength}
                      onChange={e => setMinPasswordLength(Number(e.target.value))}
                      className="px-2.5 py-1.5 bg-surface border border-outlineVariant rounded outline-none focus:border-primary text-onSurface"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between font-bold text-[8px] text-onSurfaceVariant">
                      <span>Rotation Cycle</span>
                      <strong className="text-primary">{passwordRotationDays} Days</strong>
                    </div>
                    <input 
                      type="number"
                      min="30"
                      max="360"
                      value={passwordRotationDays}
                      onChange={e => setPasswordRotationDays(Number(e.target.value))}
                      className="px-2.5 py-1.5 bg-surface border border-outlineVariant rounded outline-none focus:border-primary text-onSurface"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between font-bold text-[8px] text-onSurfaceVariant">
                      <span>History Memory</span>
                      <strong className="text-primary">{passwordHistoryCount} Passwords</strong>
                    </div>
                    <input 
                      type="number"
                      min="1"
                      max="10"
                      value={passwordHistoryCount}
                      onChange={e => setPasswordHistoryCount(Number(e.target.value))}
                      className="px-2.5 py-1.5 bg-surface border border-outlineVariant rounded outline-none focus:border-primary text-onSurface"
                    />
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <span className="font-bold text-primary uppercase text-[8px]">Complexity Requirements</span>
                  <div className="flex flex-wrap gap-4 text-[10px] bg-surface-low p-2.5 rounded border border-outlineVariant/15">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={isComplexityUppercase} 
                        onChange={e => setIsComplexityUppercase(e.target.checked)} 
                        className="accent-primary" 
                      />
                      <span>Uppercase character</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={isComplexityNumber} 
                        onChange={e => setIsComplexityNumber(e.target.checked)} 
                        className="accent-primary" 
                      />
                      <span>Number digit (0-9)</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={isComplexitySpecial} 
                        onChange={e => setIsComplexitySpecial(e.target.checked)} 
                        className="accent-primary" 
                      />
                      <span>Special character (@, $, !)</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Idle session timeout */}
              <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
                <h3 className="font-bold text-xs text-primary uppercase tracking-wider flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-primary" /> Session Timeout Limits
                </h3>

                <div className="flex flex-col gap-1.5 text-xs">
                  <div className="flex justify-between font-bold text-[9px] text-onSurfaceVariant">
                    <span>Idle Session timeout: <strong>{sessionTimeout} Minutes</strong></span>
                    <span>Max limit: 120 Mins</span>
                  </div>
                  <input 
                    type="range"
                    min="5"
                    max="120"
                    value={sessionTimeout}
                    onChange={e => setSessionTimeout(Number(e.target.value))}
                    className="w-full accent-primary bg-outlineVariant/30 rounded-lg cursor-pointer h-1.5"
                  />
                </div>
              </div>

              {/* Access controls & IP Whitelists */}
              <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
                <h3 className="font-bold text-xs text-primary uppercase tracking-wider flex items-center gap-1.5">
                  <Network className="w-4 h-4 text-primary" /> Zonal Network Access Control
                </h3>

                <div className="flex flex-col gap-1.5 text-xs">
                  <label className="font-bold text-primary uppercase text-[8px]">Allowed IP Subnets (Comma-separated)</label>
                  <input 
                    type="text" 
                    value={ipRestrictions}
                    onChange={e => setIpRestrictions(e.target.value)}
                    className="px-2.5 py-1.5 bg-surface border border-outlineVariant rounded outline-none font-mono text-xs focus:border-primary text-onSurface"
                  />
                </div>
              </div>

            </div>
          )}

          {/* SECTION 5: INTEGRATION CONFIGURATIONS */}
          {activeTab === 'integration' && (
            <div className="flex flex-col gap-6">
              
              {/* Aadhaar Verification API */}
              <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
                <div className="flex justify-between items-center border-b border-outlineVariant/15 pb-2">
                  <h3 className="font-bold text-xs text-primary uppercase tracking-wider flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-primary" /> Aadhaar UIDAI Verification Gateway
                  </h3>
                  <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase ${
                    aadhaarStatus === 'Connected' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700 animate-pulse'
                  }`}>
                    {aadhaarStatus}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>API Endpoint: <strong className="font-mono text-primary block truncate">https://api.uidai.gov.in/v2/verify</strong></div>
                  <div>Requests Logged: <strong className="font-mono block text-onSurface">{aadhaarRequests.toLocaleString()}</strong></div>
                  <div>Success Rate: <strong className="font-mono block text-success">{aadhaarSuccessRate}%</strong></div>
                  <div>Last Sync: <strong className="block text-onSurface">01 Min Ago</strong></div>
                </div>

                <div className="flex gap-2 justify-end pt-2 border-t border-outlineVariant/10 mt-1">
                  <button 
                    onClick={() => runTestConnection('aadhaar', 'Aadhaar Gateway')}
                    disabled={testingConnection.type === 'aadhaar'}
                    className="bg-primary hover:bg-primary-light text-white font-bold text-[10px] px-3.5 py-1.5 rounded-full cursor-pointer disabled:opacity-50 flex items-center gap-1"
                  >
                    {testingConnection.type === 'aadhaar' ? 'Testing Connection...' : 'Test Connection'}
                  </button>
                </div>
              </div>

              {/* SMS Gateway provider */}
              <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
                <div className="flex justify-between items-center border-b border-outlineVariant/15 pb-2">
                  <h3 className="font-bold text-xs text-primary uppercase tracking-wider flex items-center gap-1.5">
                    <Mail className="w-4 h-4 text-primary" /> Transactional SMS Dispatcher
                  </h3>
                  <span className="bg-green-100 text-green-700 font-extrabold text-[8px] uppercase px-2 py-0.5 rounded">
                    {smsStatus}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-primary uppercase text-[8px]">Active SMS Gateway Provider</label>
                    <select 
                      value={smsProvider}
                      onChange={e => {
                        setSmsProvider(e.target.value);
                        setToast({ type: 'warning', message: `SMS provider set to: ${e.target.value}` });
                      }}
                      className="px-2.5 py-1.5 bg-surface border border-outlineVariant rounded outline-none focus:border-primary text-onSurface"
                    >
                      <option value="MSG91">MSG91 (National Gateway)</option>
                      <option value="Twilio">Twilio Gateway (Fallback)</option>
                      <option value="Gupshup">Gupshup SMS Server</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] bg-surface-low p-2 rounded border border-outlineVariant/10 text-onSurfaceVariant font-mono">
                    <div>Balance: <strong>890,200 SMS</strong></div>
                    <div>Rate: <strong>{smsDeliveryRate}%</strong></div>
                  </div>
                </div>

                <div className="flex gap-2 justify-end pt-2 border-t border-outlineVariant/10 mt-1">
                  <button 
                    onClick={() => runTestConnection('sms', `SMS Provider (${smsProvider})`)}
                    disabled={testingConnection.type === 'sms'}
                    className="bg-primary hover:bg-primary-light text-white font-bold text-[10px] px-3.5 py-1.5 rounded-full cursor-pointer disabled:opacity-50 flex items-center gap-1"
                  >
                    {testingConnection.type === 'sms' ? 'Sending Test SMS...' : 'Send Test SMS'}
                  </button>
                </div>
              </div>

              {/* Email gateway SMTP */}
              <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
                <div className="flex justify-between items-center border-b border-outlineVariant/15 pb-2">
                  <h3 className="font-bold text-xs text-primary uppercase tracking-wider flex items-center gap-1.5">
                    <Bell className="w-4 h-4 text-primary" /> SMTP Email Gateway Provider
                  </h3>
                  <span className="bg-green-100 text-green-700 font-extrabold text-[8px] uppercase px-2 py-0.5 rounded">
                    {emailStatus}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-primary uppercase text-[8px]">SMTP Service Provider</label>
                    <select 
                      value={emailProvider}
                      onChange={e => {
                        setEmailProvider(e.target.value);
                        setToast({ type: 'warning', message: `Email provider updated to: ${e.target.value}` });
                      }}
                      className="px-2.5 py-1.5 bg-surface border border-outlineVariant rounded outline-none focus:border-primary text-onSurface"
                    >
                      <option value="SendGrid">SendGrid API (Production)</option>
                      <option value="Amazon SES">Amazon Simple Email Service</option>
                      <option value="SMTP Server">Internal SMTP Server</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] bg-surface-low p-2 rounded border border-outlineVariant/10 text-onSurfaceVariant font-mono">
                    <div>Bounce rate: <strong>0.12%</strong></div>
                    <div>Rate: <strong>{emailDeliveryRate}%</strong></div>
                  </div>
                </div>

                <div className="flex gap-2 justify-end pt-2 border-t border-outlineVariant/10 mt-1">
                  <button 
                    onClick={() => runTestConnection('email', `Email Gateway (${emailProvider})`)}
                    disabled={testingConnection.type === 'email'}
                    className="bg-primary hover:bg-primary-light text-white font-bold text-[10px] px-3.5 py-1.5 rounded-full cursor-pointer disabled:opacity-50 flex items-center gap-1"
                  >
                    {testingConnection.type === 'email' ? 'Sending Test Email...' : 'Send Test Email'}
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* SECTION 6: SYSTEM PERFORMANCE MONITOR */}
          {activeTab === 'performance' && (
            <div className="flex flex-col gap-6">
              
              {/* Performance details & SVG charts */}
              <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-5">
                <h3 className="font-bold text-xs text-primary uppercase tracking-wider flex items-center gap-1.5">
                  <Server className="w-4 h-4 text-primary" /> Server Hardware Resource monitor
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-center">
                  <div className="p-3 bg-surface-low border border-outlineVariant/15 rounded-lg">
                    <span className="font-bold text-primary block text-[8px] uppercase">CPU Load</span>
                    <strong className="text-sm block font-mono mt-1 text-onSurface">{cpuUsage}%</strong>
                  </div>
                  <div className="p-3 bg-surface-low border border-outlineVariant/15 rounded-lg">
                    <span className="font-bold text-primary block text-[8px] uppercase">RAM Usage</span>
                    <strong className="text-sm block font-mono mt-1 text-onSurface">{memoryUsage}%</strong>
                  </div>
                  <div className="p-3 bg-surface-low border border-outlineVariant/15 rounded-lg">
                    <span className="font-bold text-primary block text-[8px] uppercase">DB Connection</span>
                    <strong className="text-sm block font-mono mt-1 text-onSurface">{databaseUsage}%</strong>
                  </div>
                  <div className="p-3 bg-surface-low border border-outlineVariant/15 rounded-lg">
                    <span className="font-bold text-primary block text-[8px] uppercase">API Latency</span>
                    <strong className="text-sm block font-mono mt-1 text-success">{apiResponseTime} ms</strong>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-1.5 border-t border-outlineVariant/10 pt-4">
                  <span className="text-[8px] font-bold text-primary uppercase">API Response Latency Over Time (Minutes)</span>
                  {/* Inline custom SVG graph */}
                  <svg viewBox="0 0 160 80" className="w-full h-20">
                    <line x1="0" y1="20" x2="160" y2="20" stroke="#eceef0" strokeWidth="0.5" />
                    <line x1="0" y1="40" x2="160" y2="40" stroke="#eceef0" strokeWidth="0.5" />
                    <line x1="0" y1="60" x2="160" y2="60" stroke="#eceef0" strokeWidth="0.5" />
                    {/* trend line */}
                    <path d="M 0 50 L 25 45 L 50 35 L 75 55 L 100 25 L 125 30 L 160 15" fill="none" stroke="#e06666" strokeWidth="2" />
                    <circle cx="160" cy="15" r="3" fill="#e06666" />
                  </svg>
                  <div className="flex justify-between w-full text-[8.5px] font-semibold text-onSurfaceVariant px-1 mt-1">
                    <span>10 mins ago</span>
                    <span>5 mins ago</span>
                    <span>Just Now</span>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* SECTION 7 & 8: BACKUP, RECOVERY & NOTIFICATIONS */}
          {activeTab === 'backup' && (
            <div className="flex flex-col gap-6">
              
              {/* Backups config */}
              <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
                <div className="flex justify-between items-center border-b border-outlineVariant/15 pb-2">
                  <h3 className="font-bold text-xs text-primary uppercase tracking-wider flex items-center gap-1.5">
                    <HardDrive className="w-4 h-4 text-primary" /> Platform Database Backup & recovery
                  </h3>
                  <span className="bg-green-100 text-green-700 font-extrabold text-[8px] uppercase px-2 py-0.5 rounded">
                    {backupStatus}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs text-onSurfaceVariant">
                  <div>Last Full Backup: <strong className="block text-onSurface">{lastBackupTime}</strong></div>
                  <div>Backup Size: <strong className="block text-onSurface">{backupSize}</strong></div>
                  <div>Retention Policy: <strong className="block text-primary">6 Months Archives</strong></div>
                </div>

                <div className="flex gap-2 justify-end pt-2 border-t border-outlineVariant/10 mt-1">
                  <button 
                    onClick={handleCreateBackup}
                    disabled={isCompilingBackup}
                    className="bg-primary hover:bg-primary-light text-white font-bold text-[10px] px-3.5 py-1.5 rounded-full cursor-pointer disabled:opacity-50 flex items-center gap-1"
                  >
                    {isCompilingBackup ? 'Compiling Backup...' : 'Create Full Backup'}
                  </button>
                </div>
              </div>

              {/* Notification routing channels preferences */}
              <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
                <h3 className="font-bold text-xs text-primary uppercase tracking-wider flex items-center gap-1.5">
                  <Bell className="w-4 h-4 text-primary" /> Notification Dispatch preferences
                </h3>

                <div className="overflow-x-auto text-[10px]">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-outlineVariant/30 text-onSurfaceVariant font-bold uppercase tracking-wider">
                        <th className="py-2.5 px-2">Trigger Event</th>
                        <th className="py-2.5 px-2 text-center">Email Channel</th>
                        <th className="py-2.5 px-2 text-center">SMS Channel</th>
                        <th className="py-2.5 px-2 text-center">Push Notification</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outlineVariant/15">
                      {[
                        { id: 'registration', label: 'Citizen Registration Success' },
                        { id: 'verification', label: 'Field Verification Updates' },
                        { id: 'complaint', label: 'Grievance ticket changes' },
                        { id: 'officer', label: 'Administrative updates' }
                      ].map(row => (
                        <tr key={row.id} className="hover:bg-surface-low/50 transition-colors">
                          <td className="py-3 px-2 font-bold text-primary">{row.label}</td>
                          <td className="py-3 px-2 text-center">
                            <input 
                              type="checkbox"
                              checked={notificationPrefs[row.id].email}
                              onChange={() => toggleNotificationPref(row.id, 'email')}
                              className="accent-primary cursor-pointer"
                            />
                          </td>
                          <td className="py-3 px-2 text-center">
                            <input 
                              type="checkbox"
                              checked={notificationPrefs[row.id].sms}
                              onChange={() => toggleNotificationPref(row.id, 'sms')}
                              className="accent-primary cursor-pointer"
                            />
                          </td>
                          <td className="py-3 px-2 text-center">
                            <input 
                              type="checkbox"
                              checked={notificationPrefs[row.id].push}
                              onChange={() => toggleNotificationPref(row.id, 'push')}
                              className="accent-primary cursor-pointer"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* RIGHT COLUMN: HEALTH GAUGES, HISTORY AUDITS, SYSTEM MAINTENANCE (5 COLS) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* SECTION 11: LIVE SYSTEM HEALTH CENTER */}
          <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
            <h3 className="font-bold text-xs text-primary uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-primary" /> Live System Health gauges
            </h3>

            <div className="space-y-3.5 text-xs">
              {[
                { name: 'Core API Endpoint Gateway', status: 'Operational', color: 'bg-green-500' },
                { name: 'Database Cluster instances', status: 'Synchronized', color: 'bg-green-500' },
                { name: 'UIDAI Aadhaar API Sync Gateway', status: 'Operational', color: 'bg-green-500' },
                { name: 'SMS Gateway Gateway (MSG91)', status: 'Operational', color: 'bg-green-500' },
                { name: 'Email SMTP Dispatcher (SendGrid)', status: 'Degraded Load', color: 'bg-amber-500 animate-pulse' }
              ].map((h, idx) => (
                <div key={idx} className="p-3 bg-surface-low border border-outlineVariant/20 rounded-lg flex justify-between items-center gap-4">
                  <div className="font-semibold text-primary">{h.name}</div>
                  <span className="flex items-center gap-1.5 shrink-0 text-[10px] font-bold text-onSurfaceVariant">
                    <span className={`w-2.5 h-2.5 rounded-full ${h.color}`} />
                    {h.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 9: SYSTEM MAINTENANCE */}
          <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
            <h3 className="font-bold text-xs text-primary uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-primary" /> Platform Maintenance settings
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex justify-between items-center p-3 bg-surface-low border border-outlineVariant/20 rounded-lg text-[10px]">
                <div className="flex flex-col">
                  <strong className="text-red-700 dark:text-red-300 font-bold uppercase tracking-wider">Enable Maintenance Mode</strong>
                  <span className="text-onSurfaceVariant text-[9px]">Forces all public census registration windows to temporarily close.</span>
                </div>
                <input 
                  type="checkbox"
                  checked={isMaintenanceMode}
                  onChange={e => {
                    setIsMaintenanceMode(e.target.checked);
                    setToast({ type: 'warning', message: `Maintenance Mode is now: ${e.target.checked ? 'ENABLED' : 'DISABLED'}.` });
                  }}
                  className="w-4 h-4 accent-primary cursor-pointer"
                />
              </div>

              <div className="p-3 bg-surface-low border border-outlineVariant/20 rounded-lg space-y-2 text-[10px] text-onSurfaceVariant">
                <div>Scheduled Maintenance: <strong className="text-primary font-mono">{scheduledMaintenance}</strong></div>
                <div>System Version: <strong className="text-primary">v2.6.0-stable</strong></div>
                <div>Build Version ID: <strong className="text-primary font-mono">B-9028-2026</strong></div>
              </div>
            </div>
          </div>

          {/* SECTION 10: AUDIT & CONFIGURATION HISTORY TIMELINE */}
          <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
            <h3 className="font-bold text-xs text-primary uppercase tracking-wider flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-primary" /> Settings Audit Change History
            </h3>

            <div className="relative border-l-2 border-primary/20 pl-4 ml-2.5 space-y-4 text-xs">
              {auditsList.map((log, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute -left-[23px] top-0.5 w-3 h-3 rounded-full bg-primary border-2 border-surface" />
                  <div className="font-bold text-primary text-[10px]">{log.setting}</div>
                  <div className="text-[8px] text-onSurfaceVariant font-mono font-semibold">{log.time}</div>
                  <div className="text-[9px] text-onSurfaceVariant leading-normal mt-0.5 bg-surface p-1.5 rounded border border-outlineVariant/10 font-mono">
                    <div>Old: <strong className="text-red-600">{log.oldValue}</strong></div>
                    <div>New: <strong className="text-green-600">{log.newValue}</strong></div>
                  </div>
                  <span className="text-[8px] text-onSurfaceVariant font-bold">Modified by: <strong className="text-primary">{log.author}</strong></span>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 12: QUICK ACTION SHORTCUTS */}
          <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-3.5">
            <h3 className="font-bold text-xs text-primary uppercase tracking-wider">Quick Action Shortcuts</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button 
                onClick={handleSaveSettings}
                className="p-2 border border-outlineVariant hover:bg-surface-low rounded text-left font-bold text-onSurface cursor-pointer"
              >
                Save Configuration
              </button>
              <button 
                onClick={handleCreateBackup}
                className="p-2 border border-outlineVariant hover:bg-surface-low rounded text-left font-bold text-onSurface cursor-pointer"
              >
                Create Backup
              </button>
              <button 
                onClick={() => { setActiveTab('integration'); runTestConnection('aadhaar', 'Aadhaar Gateway'); }}
                className="p-2 border border-outlineVariant hover:bg-surface-low rounded text-left font-bold text-onSurface cursor-pointer"
              >
                Test Aadhaar API
              </button>
              <button 
                onClick={() => { setActiveTab('integration'); runTestConnection('sms', 'SMS Provider'); }}
                className="p-2 border border-outlineVariant hover:bg-surface-low rounded text-left font-bold text-onSurface cursor-pointer"
              >
                Test SMS Gateway
              </button>
            </div>
          </div>

          {/* SECTION 13: HELP & COMPLIANCE DOCUMENTATION */}
          <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
            <h3 className="font-bold text-xs text-primary uppercase tracking-wider flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-primary" /> Configuration Support Guidelines
            </h3>
            
            <div className="space-y-3 text-xs text-onSurfaceVariant">
              <div className="pb-2.5 border-b border-outlineVariant/15">
                <span className="font-bold text-primary block">API Connection baselines</span>
                <p className="text-[10px] leading-relaxed mt-0.5">
                  UIDAI and SMS endpoints require SSL verification. Whitelisted IP restrictions are enforced on all staging and production instances.
                </p>
              </div>

              <div>
                <span className="font-bold text-primary block">Security Compliance Best Practices</span>
                <p className="text-[10px] leading-relaxed mt-0.5">
                  Passwords must follow complexity baseline configs. Set a minimum session idle timeout of 30 minutes to comply with security guidelines.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default SystemSettings;
