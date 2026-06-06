import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import {
  Bell, Mail, MessageSquare, Smartphone, CheckCircle, AlertTriangle,
  Info, Settings, ChevronRight, Search, Trash2, Clock, ArrowLeft,
  Download, ExternalLink, RefreshCw, Eye, HelpCircle, FileText, Send,
  Sliders, UserCheck, ShieldAlert
} from 'lucide-react';

const NotificationCenter = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Search/Filters states
  const [searchQuery, setSearchQuery] = useState('');
  const [commSearch, setCommSearch] = useState('');
  const [commDateFilter, setCommDateFilter] = useState('all');
  
  // Tab states for Communication History: 'sms' | 'email' | 'app'
  const [activeCommTab, setActiveCommTab] = useState('sms');

  // Success / Error notification alerts
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Preference Settings Open
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Email Viewer Modal target
  const [activeEmailView, setActiveEmailView] = useState(null);

  // Notification Preferences State
  const [preferences, setPreferences] = useState({
    smsVerify: true,
    smsCert: false,
    smsAppt: true,
    emailVerify: true,
    emailCert: true,
    emailAppt: true,
    pushVerify: true,
    pushCert: true,
    pushAppt: false
  });

  // Master Notifications State
  const [appNotifications, setAppNotifications] = useState([
    { id: 'APP-101', title: 'Certificate Available', content: 'Your official household registration certificate is ready for download.', date: 'Today Â· 10:30 AM', read: false, type: 'approval', badgeColor: 'bg-green-50 text-green-600 border border-green-150' },
    { id: 'APP-102', title: 'Field Verification Scheduled', content: 'Census Field Supervisor Amit Sharma will visit your address on 15 June 2026.', date: 'Today Â· 09:15 AM', read: false, type: 'verification', badgeColor: 'bg-blue-50 text-blue-600 border border-blue-150' },
    { id: 'APP-103', title: 'Document Required', content: 'Please upload your updated address proof to verify your local credentials.', date: 'Yesterday Â· 04:20 PM', read: true, type: 'request', badgeColor: 'bg-amber-50 text-amber-600 border border-amber-250', actionRequired: true },
    { id: 'APP-104', title: 'Biometrics Linked', content: 'Aadhaar biometric parameters synced successfully with National Census Registry.', date: '3 Jun 2026', read: true, type: 'verification', badgeColor: 'bg-blue-50 text-blue-600 border border-blue-150' },
    { id: 'APP-105', title: 'Support Ticket Solved', content: 'Helpdesk solved Ticket #TIC-2895 concerning slot alignment errors.', date: '1 Jun 2026', read: true, type: 'system', badgeColor: 'bg-slate-50 text-slate-600 border border-slate-200' }
  ]);

  // SMS History Logs State
  const [smsHistory, setSmsHistory] = useState([
    { id: 'SMS-101', content: 'MHA CENSUS: Field Verification has been scheduled for 15 June 2026 at 10:00 AM. Please keep Aadhaar & DOB ready.', date: '15 June 2026', status: 'Delivered' },
    { id: 'SMS-102', content: 'MHA CENSUS: OTP code for login is 123456. Valid for 10 minutes. Do not share with verification officers.', date: '04 June 2026', status: 'Delivered' },
    { id: 'SMS-103', content: 'MHA CENSUS: Your support query TIC-9854 has been registered with our helpdesk.', date: '15 May 2026', status: 'Delivered' }
  ]);

  // Email History Logs State
  const [emailHistory, setEmailHistory] = useState([
    { 
      id: 'EMAIL-101', 
      subject: 'Application Approved - National Census Registry', 
      date: '15 June 2026', 
      status: 'Delivered', 
      sender: 'registry@census.gov.in',
      body: 'Dear Citizen, We are pleased to inform you that your census registration application has been reviewed by the census supervisor board and is officially APPROVED. Your digital certificate has been linked and is now ready in the Certificate Center. Best Regards, Census Registry Panel.',
      attachments: ['Approval_Notice_APT785.pdf', 'Official_Receipt_CEN.pdf'] 
    },
    { 
      id: 'EMAIL-102', 
      subject: 'Biometric Enrollment Sync Receipt', 
      date: '10 June 2026', 
      status: 'Delivered', 
      sender: 'vault@census.gov.in',
      body: 'Dear Citizen, Cryptographic sync logs verify that your Aadhaar biometric details have been successfully verified. No further action is required.',
      attachments: ['Biometric_Audit_Sync.pdf'] 
    },
    { 
      id: 'EMAIL-103', 
      subject: 'Correction Notice: Action Required', 
      date: '15 May 2026', 
      status: 'Delivered', 
      sender: 'audits@census.gov.in',
      body: 'Dear Citizen, During physical audit checks, inconsistencies were flagged in your address proof sheet. Please upload a valid utility bill or rent agreement inside the dashboard portal.',
      attachments: [] 
    }
  ]);

  // Announcements State
  const [announcements, setAnnouncements] = useState([
    { id: 1, title: 'Census Registration Deadline Extended', content: 'The Ministry of Home Affairs has extended the national registration window to July 31, 2026. Register early to avoid server traffic.', tag: 'Urgent', color: 'bg-red-50 text-red-700 border border-red-200' },
    { id: 2, title: 'New Verification Process Introduced', content: 'Citizens can now utilize secure DigiLocker integration directly inside the profile wizard to auto-verify credentials.', tag: 'New Policy', color: 'bg-blue-50 text-blue-750 border border-blue-200' },
    { id: 3, title: 'Scheduled Maintenance Notice', content: 'Our national credentials vault and verification engines will be undergoing server upgrades on June 6, 2026, from 02:00 AM to 06:00 AM.', tag: 'Maintenance', color: 'bg-amber-50 text-amber-850 border border-amber-250' }
  ]);

  // Timeline logs data
  const timelineLogs = [
    { time: '10:30 AM', title: 'Document Uploaded Successfully', desc: 'Address proof PDF recorded in database vault.', status: 'success' },
    { time: '11:15 AM', title: 'Verification Officer Assigned', desc: 'Supervisor Amit Sharma mapped to household profile.', status: 'info' },
    { time: '02:00 PM', title: 'Verification Completed', desc: 'Physical audit completed with 0 errors.', status: 'success' },
    { time: '04:30 PM', title: 'Application Approved', desc: 'Census registration approved and certificate issued.', status: 'approval' }
  ];

  // Live Helpdesk Ticket submission state
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState('notifications');
  const [ticketDescription, setTicketDescription] = useState('');

  // Live chat state
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { id: 1, text: 'Hello! I am your Notification Assistant. Need help managing alerts or preferences?', sender: 'bot', time: 'Just now' }
  ]);
  const [chatTyping, setChatTyping] = useState(false);

  // Statistics calculation
  const statsOverview = useMemo(() => {
    const unread = appNotifications.filter(n => !n.read).length;
    const critical = appNotifications.filter(n => n.type === 'request' && !n.read).length;
    const important = announcements.length;
    return {
      total: appNotifications.length,
      unread,
      critical,
      important
    };
  }, [appNotifications, announcements]);

  // Mark all as read action
  const handleMarkAllRead = () => {
    setAppNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setSuccess('All notifications marked as read.');
  };

  // Toggle read status of single notification
  const handleToggleRead = (id) => {
    setAppNotifications(prev => prev.map(n => {
      if (n.id === id) return { ...n, read: !n.read };
      return n;
    }));
  };

  // Delete notification action
  const handleDeleteNotification = (id) => {
    setAppNotifications(prev => prev.filter(n => n.id !== id));
    setSuccess('Notification deleted.');
  };

  // Save Preferences Action
  const handleSavePreferences = (e) => {
    e.preventDefault();
    setSuccess('Notification configuration saved successfully.');
    setSettingsOpen(false);
  };

  // Filtered Notifications based on Search query
  const filteredNotifications = useMemo(() => {
    return appNotifications.filter(n => 
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [appNotifications, searchQuery]);

  // Filtered SMS logs search/date
  const filteredSMS = useMemo(() => {
    return smsHistory.filter(sms => {
      const matchesSearch = sms.content.toLowerCase().includes(commSearch.toLowerCase());
      const matchesDate = commDateFilter === 'all' || sms.date.includes(commDateFilter);
      return matchesSearch && matchesDate;
    });
  }, [smsHistory, commSearch, commDateFilter]);

  // Filtered Email logs search/date
  const filteredEmail = useMemo(() => {
    return emailHistory.filter(email => {
      const matchesSearch = email.subject.toLowerCase().includes(commSearch.toLowerCase()) || 
                            email.body.toLowerCase().includes(commSearch.toLowerCase());
      const matchesDate = commDateFilter === 'all' || email.date.includes(commDateFilter);
      return matchesSearch && matchesDate;
    });
  }, [emailHistory, commSearch, commDateFilter]);

  // Download attachment simulator
  const handleDownloadAttachment = (filename) => {
    const blob = new Blob([`Official Attachment Content: ${filename}\nChecksum: Verified`], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setSuccess(`Downloaded document receipt: ${filename}`);
  };

  // Live Helpdesk Ticket Submit
  const handleSupportTicketSubmit = (e) => {
    e.preventDefault();
    if (!ticketSubject || !ticketDescription) return;

    setSuccess(`Support Ticket #TIC-NOTIF-${Math.floor(1000 + Math.random() * 9000)} registered successfully.`);
    setTicketSubject('');
    setTicketDescription('');
  };

  // Live Chat submit
  const handleSendChatMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = { id: Date.now(), text: chatInput, sender: 'user', time: 'Just now' };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setChatTyping(true);

    setTimeout(() => {
      setChatTyping(false);
      let replyText = "I'm sorry, I didn't quite get that. You can ask me to help edit notification preferences, explain alerts, or view SMS history.";
      const query = chatInput.toLowerCase();

      if (query.includes('pref') || query.includes('setting') || query.includes('toggle')) {
        replyText = "You can manage notification channels in the 'Preferences' section. Simply toggle SMS or Email checkboxes and click Save.";
      } else if (query.includes('verification') || query.includes('schedule')) {
        replyText = "Your address verification is scheduled for 15 June 2026. Keep your Aadhaar Card and Address proof ready for verification.";
      } else if (query.includes('email') || query.includes('history')) {
        replyText = "Email communications detail application updates. You can preview email bodies directly and download PDF attachments.";
      } else if (query.includes('deadline') || query.includes('date')) {
        replyText = "The official deadline for census self-registration has been extended to July 31, 2026.";
      }

      setChatMessages(prev => [...prev, { id: Date.now() + 1, text: replyText, sender: 'bot', time: 'Just now' }]);
    }, 1000);
  };

  // Clear alerts banner automatically
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess('');
        setError('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  return (
    <div className="flex-grow w-full bg-[#f8faff] min-h-screen pb-16 relative">
      
      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          SECTION 1: PAGE HEADER
      â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <div className="bg-[#0b2447] text-white py-10 px-6 sm:px-12 relative overflow-hidden shadow-lg border-b border-white/5">
        <div className="absolute right-0 top-0 w-96 h-96 bg-[#ff9933]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/2 bottom-0 w-80 h-80 bg-[#138808]/15 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div>
            <button 
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-1.5 text-xs text-slate-350 hover:text-white mb-3 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
            </button>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] uppercase font-bold text-white/50 tracking-widest bg-white/10 px-3 py-0.5 rounded-full flex items-center gap-1">
                <Bell className="w-3 h-3 text-[#ff9933]" /> Live Alerts Sync
              </span>
              <span className="text-[10px] uppercase font-bold text-[#ff9933] bg-[#ff9933]/15 border border-[#ff9933]/25 px-3 py-0.5 rounded-full">
                MHA Communications
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-2 flex items-center gap-2.5">
              <Bell className="w-8 h-8 text-[#ff9933] animate-pulse" /> Notification Center
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl font-light">
              Stay updated with all census activities, verification updates, approvals, and important government notifications.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto shrink-0 justify-end flex-wrap">
            <button
              onClick={handleMarkAllRead}
              className="bg-white/10 hover:bg-white/15 border border-white/20 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
            >
              Mark All As Read
            </button>
            <button
              onClick={() => setSettingsOpen(!settingsOpen)}
              className="bg-[#ff9933] hover:bg-amber-600 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-sm"
            >
              <Settings className="w-4 h-4" /> Preferences
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8">
        
        {/* Success / Error Toast banners */}
        {success && (
          <div className="bg-green-50 text-green-700 text-xs p-4 rounded-2xl border border-green-200 mb-6 flex items-start gap-2.5 shadow-sm animate-fade-in">
            <CheckCircle className="w-4 h-4 shrink-0 mt-0.5 text-green-600" />
            <span>{success}</span>
          </div>
        )}
        {error && (
          <div className="bg-red-50 text-red-700 text-xs p-4 rounded-2xl border border-red-200 mb-6 flex items-start gap-2.5 shadow-sm animate-fade-in">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-red-650" />
            <span>{error}</span>
          </div>
        )}

        {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
            SECTION 2: NOTIFICATION OVERVIEW
        â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Logs', value: statsOverview.total, icon: Bell, color: '#0b2447', bg: 'rgba(11,36,71,0.06)' },
            { label: 'Unread Messages', value: statsOverview.unread, icon: Eye, color: '#ff9933', bg: 'rgba(255,153,51,0.06)' },
            { label: 'Critical Alerts', value: statsOverview.critical, icon: AlertTriangle, color: '#ef4444', bg: 'rgba(239,68,68,0.06)' },
            { label: 'Announcements', value: statsOverview.important, icon: FileText, color: '#8b5cf6', bg: 'rgba(139,92,246,0.06)' }
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block">{stat.label}</span>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-[#0b2447] mt-1 flex items-center gap-1.5">
                    {stat.value}
                    {i === 1 && stat.value > 0 && (
                      <span className="w-2.5 h-2.5 bg-[#ff9933] rounded-full animate-ping shrink-0" />
                    )}
                  </h3>
                </div>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold" style={{ backgroundColor: stat.bg, color: stat.color }}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
            );
          })}
        </div>

        {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
            SECTION 7: NOTIFICATION PREFERENCES TOGGLES (COLLAPSIBLE)
        â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        {settingsOpen && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 mb-8 animate-fade-in">
            <div className="flex justify-between items-center border-b border-slate-150 pb-3 mb-4">
              <h4 className="font-extrabold text-sm text-[#0b2447] flex items-center gap-1.5"><Settings className="w-4.5 h-4.5 text-primary" /> Edit Notifications Channel Preferences</h4>
              <button onClick={() => setSettingsOpen(false)} className="text-slate-400 hover:text-primary"><Trash2 className="w-4.5 h-4.5" /></button>
            </div>

            <form onSubmit={handleSavePreferences} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-bold text-slate-650">
                {/* SMS Channel */}
                <div className="space-y-3.5 p-4 border border-slate-150 rounded-2xl bg-slate-50/50">
                  <span className="flex items-center gap-1.5 text-xs text-primary font-extrabold"><Smartphone className="w-4 h-4" /> SMS Notifications</span>
                  <div className="flex items-center justify-between">
                    <span>Verification Alerts</span>
                    <input type="checkbox" checked={preferences.smsVerify} onChange={(e) => setPreferences({ ...preferences, smsVerify: e.target.checked })} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Certificate Alerts</span>
                    <input type="checkbox" checked={preferences.smsCert} onChange={(e) => setPreferences({ ...preferences, smsCert: e.target.checked })} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Appointment Alerts</span>
                    <input type="checkbox" checked={preferences.smsAppt} onChange={(e) => setPreferences({ ...preferences, smsAppt: e.target.checked })} />
                  </div>
                </div>

                {/* Email Channel */}
                <div className="space-y-3.5 p-4 border border-slate-150 rounded-2xl bg-slate-50/50">
                  <span className="flex items-center gap-1.5 text-xs text-[#ff9933] font-extrabold"><Mail className="w-4 h-4" /> Email Notifications</span>
                  <div className="flex items-center justify-between">
                    <span>Verification Alerts</span>
                    <input type="checkbox" checked={preferences.emailVerify} onChange={(e) => setPreferences({ ...preferences, emailVerify: e.target.checked })} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Certificate Alerts</span>
                    <input type="checkbox" checked={preferences.emailCert} onChange={(e) => setPreferences({ ...preferences, emailCert: e.target.checked })} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Appointment Alerts</span>
                    <input type="checkbox" checked={preferences.emailAppt} onChange={(e) => setPreferences({ ...preferences, emailAppt: e.target.checked })} />
                  </div>
                </div>

                {/* Push Channel */}
                <div className="space-y-3.5 p-4 border border-slate-150 rounded-2xl bg-slate-50/50">
                  <span className="flex items-center gap-1.5 text-xs text-green-600 font-extrabold"><Bell className="w-4 h-4" /> Push Notifications</span>
                  <div className="flex items-center justify-between">
                    <span>Verification Alerts</span>
                    <input type="checkbox" checked={preferences.pushVerify} onChange={(e) => setPreferences({ ...preferences, pushVerify: e.target.checked })} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Certificate Alerts</span>
                    <input type="checkbox" checked={preferences.pushCert} onChange={(e) => setPreferences({ ...preferences, pushCert: e.target.checked })} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Appointment Alerts</span>
                    <input type="checkbox" checked={preferences.pushAppt} onChange={(e) => setPreferences({ ...preferences, pushAppt: e.target.checked })} />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setSettingsOpen(false)} className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 py-2 px-5 rounded-xl">Dismiss</button>
                <button type="submit" className="bg-[#0b2447] hover:bg-[#1f3e6d] text-white py-2 px-5 rounded-xl shadow-sm">Save Preferences</button>
              </div>
            </form>
          </div>
        )}

        {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
            MAIN CONTENT AREA GRID
        â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COL: ALERTS, CHRONOLOGY & SEARCH HISTORY LOGS (8 Columns) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* SECTION 3: ALERTS CENTER */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4">
              <div className="flex justify-between items-center flex-wrap gap-3">
                <div>
                  <h4 className="font-extrabold text-sm text-[#0b2447]">Alerts Center</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Critical census tasks and updates requiring immediate attention.</p>
                </div>

                <div className="relative w-full sm:w-56">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                    type="text" 
                    placeholder="Search alerts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-1.5 text-xs outline-none focus:border-[#0b2447] transition-all"
                  />
                </div>
              </div>

              <div className="space-y-3">
                {filteredNotifications.length === 0 ? (
                  <div className="text-center py-6 text-slate-400 text-xs font-semibold">
                    No active notifications matching query.
                  </div>
                ) : (
                  filteredNotifications.map((notif) => (
                    <div 
                      key={notif.id} 
                      className={`p-4 border rounded-2xl hover:shadow-sm transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${
                        !notif.read ? 'border-primary/30 bg-primary/2 shadow-[inset_3px_0_0_#0b2447]' : 'border-slate-150 bg-slate-50/50'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-[8px] font-extrabold uppercase px-2 py-0.5 rounded-full ${notif.badgeColor}`}>
                            {notif.type}
                          </span>
                          {!notif.read && (
                            <span className="text-[8px] font-extrabold uppercase px-2 py-0.5 bg-red-50 text-red-500 rounded-full flex items-center gap-0.5">
                              Unread
                            </span>
                          )}
                          {notif.actionRequired && (
                            <span className="text-[8px] font-extrabold uppercase px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-250 rounded-full flex items-center gap-0.5">
                              Action Required
                            </span>
                          )}
                        </div>
                        <h5 className="font-extrabold text-xs text-[#0b2447] pt-1">{notif.title}</h5>
                        <p className="text-[10px] text-slate-550 leading-relaxed font-semibold">{notif.content}</p>
                        <span className="block text-[8px] text-slate-400 font-bold">{notif.date}</span>
                      </div>

                      <div className="flex gap-2 w-full sm:w-auto self-end sm:self-center shrink-0 justify-end">
                        <button
                          onClick={() => handleToggleRead(notif.id)}
                          className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 py-1.5 px-3 rounded-lg text-[9px] font-bold cursor-pointer"
                        >
                          {notif.read ? 'Mark Unread' : 'Mark Read'}
                        </button>
                        <button
                          onClick={() => handleDeleteNotification(notif.id)}
                          className="bg-red-50 hover:bg-red-100 text-red-650 border border-red-100 py-1.5 px-2.5 rounded-lg text-[9px] font-bold cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* SECTION 4: COMMUNICATION HISTORY TABS */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-6">
              <div>
                <h4 className="font-extrabold text-sm text-[#0b2447]">Communication Archive Logs</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Browse history logs across official SMS, Email, or Application pipelines.</p>
              </div>

              {/* Navigation tabs inside communication history */}
              <div className="flex gap-2 border-b border-slate-150 pb-2">
                {[
                  { id: 'sms', label: 'SMS Pipeline', icon: Smartphone },
                  { id: 'email', label: 'Email Outbox', icon: Mail },
                  { id: 'app', label: 'App Notifications', icon: Bell }
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveCommTab(tab.id);
                        setCommSearch('');
                      }}
                      className={`py-1.5 px-4 flex items-center gap-1.5 border-b-2 font-bold text-[10px] cursor-pointer transition-all ${
                        activeCommTab === tab.id 
                          ? 'border-primary text-primary font-extrabold' 
                          : 'border-transparent text-slate-500 hover:text-primary'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Sub Search filters */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-grow relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                    type="text" 
                    placeholder="Search logs by keyword..."
                    value={commSearch}
                    onChange={(e) => setCommSearch(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-1.5 text-[10px] outline-none"
                  />
                </div>

                <select
                  value={commDateFilter}
                  onChange={(e) => setCommDateFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-[10px] text-slate-650 font-bold outline-none cursor-pointer"
                >
                  <option value="all">All Dates</option>
                  <option value="June">June 2026</option>
                  <option value="May">May 2026</option>
                </select>
              </div>

              {/* Tab 1: SMS logs view */}
              {activeCommTab === 'sms' && (
                <div className="space-y-3 font-semibold text-[10px] text-slate-650">
                  {filteredSMS.length === 0 ? (
                    <div className="text-center py-6 text-slate-400 text-xs italic">No matching SMS records found.</div>
                  ) : (
                    filteredSMS.map((sms) => (
                      <div key={sms.id} className="p-4 bg-slate-50/50 border border-slate-150 rounded-2xl space-y-2">
                        <div className="flex justify-between items-center text-[8px] font-bold text-slate-400">
                          <span>{sms.date} Â· Delivery ID: {sms.id}</span>
                          <span className="text-green-600 bg-green-50 px-2 py-0.5 rounded font-extrabold">{sms.status}</span>
                        </div>
                        <p className="leading-relaxed text-[#0b2447] text-xs font-mono">{sms.content}</p>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Tab 2: Email logs view */}
              {activeCommTab === 'email' && (
                <div className="space-y-3 font-semibold text-[10px] text-slate-650">
                  {filteredEmail.length === 0 ? (
                    <div className="text-center py-6 text-slate-400 text-xs italic">No matching Email records found.</div>
                  ) : (
                    filteredEmail.map((email) => (
                      <div key={email.id} className="p-4 bg-slate-50/50 border border-slate-150 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-[8px] font-bold text-slate-455">
                            <span>From: {email.sender}</span>
                            <span>{email.date}</span>
                          </div>
                          <h5 className="font-extrabold text-xs text-[#0b2447] pt-0.5">{email.subject}</h5>
                          <p className="text-[10px] text-slate-500 font-semibold truncate max-w-[280px]">{email.body}</p>
                          {email.attachments.length > 0 && (
                            <div className="flex items-center gap-1.5 pt-1">
                              <span className="text-[8px] text-slate-400 uppercase font-bold">Files ({email.attachments.length}):</span>
                              {email.attachments.map((file, idx) => (
                                <button 
                                  key={idx}
                                  onClick={() => handleDownloadAttachment(file)}
                                  className="text-[8px] font-bold text-blue-600 hover:underline flex items-center gap-0.5 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100 cursor-pointer"
                                >
                                  <Download className="w-2.5 h-2.5" /> {file}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="shrink-0 self-end sm:self-center">
                          <button
                            onClick={() => setActiveEmailView(email)}
                            className="bg-white hover:bg-slate-100 text-primary border border-slate-200 py-1.5 px-3 rounded-lg text-[9px] font-bold cursor-pointer flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" /> Read Email
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Tab 3: App notifications */}
              {activeCommTab === 'app' && (
                <div className="space-y-3 font-semibold text-[10px] text-slate-650">
                  {appNotifications.map((notif) => (
                    <div key={notif.id} className="p-3 bg-slate-50/50 border border-slate-150 rounded-2xl flex justify-between items-center">
                      <div>
                        <span className="text-[8px] font-bold text-slate-400 block">{notif.date}</span>
                        <h6 className="font-extrabold text-[#0b2447] text-xs">{notif.title}</h6>
                        <p className="text-slate-550">{notif.content}</p>
                      </div>
                      <span className={`text-[8px] px-2 py-0.5 rounded font-extrabold ${notif.read ? 'bg-slate-100 text-slate-550' : 'bg-red-50 text-red-500'}`}>
                        {notif.read ? 'Read' : 'Unread'}
                      </span>
                    </div>
                  ))}
                </div>
              )}

            </div>

            {/* SECTION 5: NOTIFICATION TIMELINE */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
              <h4 className="font-extrabold text-sm text-[#0b2447] mb-2">Audit Checkpoint Timeline</h4>
              <p className="text-[10px] text-slate-400 mb-6">Chronological record of recent registry interactions and updates.</p>

              <div className="relative pl-5 flex flex-col gap-0 border-l border-slate-200 text-[10px] ml-2 font-bold text-slate-500">
                {timelineLogs.map((item, idx) => (
                  <div key={idx} className="relative pb-5 last:pb-0">
                    <div className={`absolute -left-[27px] top-0.5 w-3.5 h-3.5 rounded-full border-2 border-white flex items-center justify-center text-white ${
                      item.status === 'success' ? 'bg-green-500' :
                      item.status === 'approval' ? 'bg-blue-600' : 'bg-[#ff9933]'
                    }`}>
                      <CheckCircle className="w-1.5 h-1.5" />
                    </div>
                    <span className="block text-[8px] text-slate-400 font-bold">{item.time}</span>
                    <h5 className="text-[#0b2447] text-[11px] mt-0.5">{item.title}</h5>
                    <p className="text-slate-500 text-[9px] font-medium leading-relaxed mt-0.5">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT COL: OVERVIEW, PREFERENCES, ANNOUNCEMENTS (4 Columns) */}
          <div className="lg:col-span-4 space-y-6">

            {/* SECTION 6: IMPORTANT ANNOUNCEMENTS */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
              <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-2">
                <h4 className="font-extrabold text-sm text-[#0b2447] flex items-center gap-1.5"><Sliders className="w-4.5 h-4.5 text-[#ff9933]" /> Public Announcements</h4>
                <span className="text-[8px] bg-red-50 text-red-500 px-2 py-0.5 rounded font-extrabold">Registry Bulletin</span>
              </div>

              <div className="space-y-4">
                {announcements.map((ann) => (
                  <div key={ann.id} className={`p-4 rounded-2xl space-y-1.5 shadow-[inset_3px_0_0_#ff9933] ${ann.color}`}>
                    <div className="flex justify-between items-center text-[8px] font-bold">
                      <span className="uppercase tracking-wide">{ann.tag}</span>
                      <span>Ministry Desk</span>
                    </div>
                    <h5 className="font-extrabold text-xs text-[#0b2447] leading-tight">{ann.title}</h5>
                    <p className="text-[9.5px] leading-relaxed font-semibold text-slate-650">{ann.content}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 8: QUICK ACTIONS SHORTCUTS */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
              <h4 className="font-extrabold text-sm text-[#0b2447] mb-4">Quick Navigation Portal</h4>
              <div className="flex flex-col gap-2.5">
                <button 
                  onClick={() => navigate('/wizard')} 
                  className="w-full bg-[#0b2447] hover:bg-[#1f3e6d] text-white text-xs font-bold py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                >
                  Upload Documents <ChevronRight className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => navigate('/certificates')} 
                  className="w-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  Download Certificate <ExternalLink className="w-4 h-4 text-slate-400" />
                </button>
                <button 
                  onClick={() => navigate('/appointments')} 
                  className="w-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  Book Appointment <Clock className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>

            {/* SECTION 9: HELP & SUPPORT SHORTCUT */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4">
              <h4 className="font-extrabold text-sm text-[#0b2447] border-b border-slate-100 pb-2">Support Desk & Live Help</h4>
              
              {/* Support ticket submission form */}
              <form onSubmit={handleSupportTicketSubmit} className="space-y-3 font-semibold text-[10px]">
                <div className="flex gap-2">
                  <select 
                    value={ticketCategory} 
                    onChange={(e) => setTicketCategory(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-2 py-1.5 text-[9px] font-bold text-slate-650"
                  >
                    <option value="notifications">Alert Issue</option>
                    <option value="sms">SMS Missing</option>
                    <option value="email">Email bounce</option>
                  </select>
                  <input 
                    type="text" 
                    placeholder="Brief ticket subject..."
                    value={ticketSubject}
                    onChange={(e) => setTicketSubject(e.target.value)}
                    required
                    className="flex-grow bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-[9px] outline-none"
                  />
                </div>
                <textarea 
                  placeholder="Describe your notification delivery problems..."
                  rows="2"
                  value={ticketDescription}
                  onChange={(e) => setTicketDescription(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[9px] outline-none resize-none font-bold"
                />
                <button 
                  type="submit"
                  className="w-full bg-[#0b2447] hover:bg-[#1f3e6d] text-white text-[10px] font-bold py-2 rounded-xl shadow-sm transition-colors cursor-pointer"
                >
                  File Ticket Desk
                </button>
              </form>

              {/* Chatbot support panel */}
              <div className="border border-slate-150 rounded-2xl p-4 flex flex-col justify-between h-[210px] bg-slate-50/30">
                <span className="text-[9px] font-extrabold text-primary border-b border-slate-100 pb-1.5 flex items-center gap-1 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Notification Desk Chat
                </span>
                
                {/* Chat message list */}
                <div className="flex-grow overflow-y-auto py-2 space-y-1.5 text-[9px] font-bold pr-1 my-0.5">
                  {chatMessages.map(msg => (
                    <div 
                      key={msg.id} 
                      className={`p-2 rounded-xl leading-relaxed max-w-[85%] ${
                        msg.sender === 'user' ? 'bg-primary text-white ml-auto' : 'bg-white border border-slate-150 text-slate-650'
                      }`}
                    >
                      <p>{msg.text}</p>
                    </div>
                  ))}
                  {chatTyping && (
                    <div className="text-[8px] text-slate-400 bg-white border border-slate-150 p-2 rounded-xl max-w-[40%] animate-pulse">Typing...</div>
                  )}
                </div>

                {/* Input form */}
                <form onSubmit={handleSendChatMessage} className="flex gap-1 shrink-0 pt-1.5 border-t border-slate-100">
                  <input 
                    type="text" 
                    placeholder="Ask support desk..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    className="flex-grow bg-white border border-slate-200 rounded-xl px-2 py-1 text-[9px] outline-none"
                  />
                  <button type="submit" className="bg-primary text-white p-1 rounded-xl hover:bg-primary-light transition-all cursor-pointer">
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          EMAIL VIEWER MODAL DIALOG (SECTION 4 MODAL)
      â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      {activeEmailView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl p-6 w-full max-w-lg space-y-5 animate-fade-in text-slate-650 font-bold">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h4 className="font-extrabold text-sm text-[#0b2447] flex items-center gap-1.5">
                  <Mail className="w-4.5 h-4.5 text-[#ff9933]" /> Official Census Email
                </h4>
                <span className="text-[8px] text-slate-400 font-mono block mt-0.5">Recipient Delivery Hub</span>
              </div>
              <button 
                onClick={() => setActiveEmailView(null)}
                className="p-1 text-slate-400 hover:text-primary transition-colors cursor-pointer"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="bg-slate-50 p-4 border border-slate-150 rounded-2xl text-[10px] space-y-1.5">
                <p><span className="text-slate-400 text-[8px] uppercase block">Subject</span> {activeEmailView.subject}</p>
                <p><span className="text-slate-400 text-[8px] uppercase block">Sender Desk</span> {activeEmailView.sender}</p>
                <p><span className="text-slate-400 text-[8px] uppercase block">Sent Timestamp</span> {activeEmailView.date}</p>
              </div>

              <div className="p-4 border border-slate-150 rounded-2xl bg-white leading-relaxed text-xs text-[#0b2447] font-medium font-sans max-h-56 overflow-y-auto">
                {activeEmailView.body}
              </div>

              {activeEmailView.attachments.length > 0 && (
                <div className="bg-slate-50/50 p-3 border border-slate-150 rounded-2xl space-y-2">
                  <span className="text-slate-400 text-[8px] uppercase block">Downloadable Email Attachments</span>
                  <div className="flex gap-2 flex-wrap">
                    {activeEmailView.attachments.map((file, idx) => (
                      <button 
                        key={idx}
                        onClick={() => handleDownloadAttachment(file)}
                        className="text-[9px] font-bold text-blue-600 hover:underline flex items-center gap-1 bg-white border border-slate-200 px-3 py-1.5 rounded-xl cursor-pointer shadow-sm"
                      >
                        <Download className="w-3.5 h-3.5 text-slate-400" /> {file}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setActiveEmailView(null)}
                className="bg-[#0b2447] hover:bg-[#1f3e6d] text-white text-xs font-bold py-2.5 px-6 rounded-xl transition-all cursor-pointer shadow-sm"
              >
                Close Email Viewer
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default NotificationCenter;








