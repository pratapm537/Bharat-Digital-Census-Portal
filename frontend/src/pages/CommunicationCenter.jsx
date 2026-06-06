import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldAlert, AlertTriangle, Check, X, Shield, Lock, Eye, Download, 
  FileText, Activity, Users, UserCheck, RefreshCw, ZoomIn, ZoomOut, 
  MapPin, Clock, ArrowRight, ShieldCheck, ChevronRight, HelpCircle, 
  Maximize2, Plus, Edit2, Play, CheckCircle2, AlertCircle, BarChart2, 
  FileSpreadsheet, Send, TrendingUp, Compass, Network, Landmark,
  Mail, Phone, Bell, Calendar, Flame, Zap, Copy, File, Paperclip, EyeOff
} from 'lucide-react';

// ==========================================
// MOCK DATASETS
// ==========================================
const INITIAL_CAMPAIGNS = [
  { id: 'CMP-101', name: 'National Census Awareness 2026', type: 'Awareness', duration: 'June 1 - June 30', targetAudience: 'All Citizens', reach: '25 Million Citizens', status: 'Active' },
  { id: 'CMP-102', name: 'Importance of Registration Drive', type: 'Awareness', duration: 'May 15 - June 15', targetAudience: 'Rural Jurisdictions', reach: '12 Million Citizens', status: 'Active' },
  { id: 'CMP-103', name: 'Benefits of Census Participation', type: 'Awareness', duration: 'June 5 - July 5', targetAudience: 'Urban Centered Wards', reach: '8 Million Citizens', status: 'Paused' },
  { id: 'CMP-104', name: 'Registration Deadline Reminder Campaign', type: 'Awareness', duration: 'June 20 - June 30', targetAudience: 'Unregistered Households', reach: '5 Million Citizens', status: 'Scheduled' }
];

const INITIAL_UPDATES = [
  { id: 'UPD-201', title: 'Registration deadline extended until 30 June 2026.', date: '2026-06-05', target: 'All Citizens', priority: 'High', status: 'Published' },
  { id: 'UPD-202', title: 'New offline verification procedures released.', date: '2026-06-02', target: 'Zonal Officers', priority: 'Medium', status: 'Published' },
  { id: 'UPD-203', title: 'Census Web Portal scheduled maintenance on June 12.', date: '2026-06-06', target: 'All Users', priority: 'Low', status: 'Scheduled' }
];

const INITIAL_OFFICER_ANNOUNCEMENTS = [
  { id: 'ANN-301', title: 'Vigilance training session scheduled for Patna North Ward.', officerGroup: 'Verification Officers', priority: 'High', readCount: '45 / 50' },
  { id: 'ANN-302', title: 'Updated Field Verification Guidelines document uploaded.', officerGroup: 'All Supervisors', priority: 'Critical', readCount: '120 / 122' },
  { id: 'ANN-303', title: 'Biometrics capture override procedures modified.', officerGroup: 'Biometric Officers', priority: 'Medium', readCount: '30 / 42' }
];

const INITIAL_TEMPLATES_SMS = [
  { name: 'Verification Reminder', text: 'Dear {Name}, your census address verification is scheduled on {Date}. Please keep Aadhaar card ready.', usage: 145000 },
  { name: 'OTP Code Verification', text: 'Your OTP code for logging into the Bharat Census Portal is {Code}. Valid for 10 minutes.', usage: 980000 },
  { name: 'Registration Confirmation', text: 'Dear {Name}, your census application has been successfully filed with ID {ID}.', usage: 120000 }
];

const INITIAL_TEMPLATES_EMAIL = [
  { name: 'Welcome Onboarding', subject: 'Welcome To Bharat Census Portal', usage: 210000 },
  { name: 'Certificate Ready', subject: 'Your National Census Certificate is Available for Download', usage: 85000 },
  { name: 'Verification Cleared', subject: 'Census Identity and Physical Verification Completed Successfully', usage: 78000 }
];

const INITIAL_HISTORY = [
  { id: 'TX-45812', type: 'SMS', recipientGroup: 'Delhi Wards', status: 'Delivered', date: '2026-06-06 10:30 AM', sender: 'Rahul Sharma' },
  { id: 'TX-45813', type: 'Email', recipientGroup: 'Pune Central (Pending)', status: 'Delivered', date: '2026-06-05 02:15 PM', sender: 'Anjali Desai' },
  { id: 'TX-45814', type: 'Push', recipientGroup: 'All Officers', status: 'Delivered', date: '2026-06-05 09:00 AM', sender: 'System' },
  { id: 'TX-45815', type: 'SMS', recipientGroup: 'Bihar Rural Wards', status: 'Failed', date: '2026-06-04 11:30 AM', sender: 'Vikram Singh' }
];

const CommunicationCenter = () => {
  const navigate = useNavigate();

  // -------------------------------------------------------------
  // STATE MANAGEMENT
  // -------------------------------------------------------------
  const [activeComposeTab, setActiveComposeTab] = useState('sms'); // 'sms', 'email', 'push'
  const [campaigns, setCampaigns] = useState(INITIAL_CAMPAIGNS);
  const [updates, setUpdates] = useState(INITIAL_UPDATES);
  const [officerAnnouncements, setOfficerAnnouncements] = useState(INITIAL_OFFICER_ANNOUNCEMENTS);
  const [historyLogs, setHistoryLogs] = useState(INITIAL_HISTORY);

  // Audience Target Selection
  const [targetState, setTargetState] = useState('All');
  const [targetStatus, setTargetStatus] = useState('All');
  const [targetGroup, setTargetGroup] = useState('All Citizens');
  const [recipientCount, setRecipientCount] = useState(25000000);

  // SMS Composer
  const [smsText, setSmsText] = useState('Dear Citizen, Your census verification is scheduled for 15 June 2026. Please keep original ID ready.');
  const [smsPreviewName, setSmsPreviewName] = useState('Dear Citizen,');
  const [smsScheduledDate, setSmsScheduledDate] = useState('');
  
  // Email Composer
  const [emailSubject, setEmailSubject] = useState('Census Registration Approved');
  const [emailBody, setEmailBody] = useState('<p>Dear Citizen,</p><p>We are pleased to inform you that your census registration application has been verified and approved.</p><p>You can download your certificate from the portal.</p>');
  const [attachmentsList, setAttachmentsList] = useState([]);

  // Push Composer
  const [pushTitle, setPushTitle] = useState('Verification Completed');
  const [pushMessage, setPushMessage] = useState('Your verification has been approved.');

  // Scheduler Form
  const [scheduleDate, setScheduleDate] = useState('2026-06-15');
  const [scheduleTime, setScheduleTime] = useState('10:00');
  const [scheduleZone, setScheduleZone] = useState('IST (UTC+5:30)');
  const [scheduleRecurring, setScheduleRecurring] = useState('Once');

  // Search/Filters for Logs
  const [logSearch, setLogSearch] = useState('');
  const [logFilterType, setLogFilterType] = useState('All');

  // Modal forms
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);

  // Campaign Form State
  const [campaignForm, setCampaignForm] = useState({
    name: '',
    duration: '',
    targetAudience: 'All Citizens',
    reach: ''
  });

  // Announcement Form State
  const [announcementForm, setAnnouncementForm] = useState({
    title: '',
    group: 'Verification Officers',
    priority: 'High'
  });

  // Reports Center Selection
  const [reportSelection, setReportSelection] = useState('Communication Summary Report');
  const [reportState, setReportState] = useState(null); // 'compiling', 'done'

  // Toast Feedback State
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  // Auto clear feedback
  useEffect(() => {
    if (feedback.message) {
      const timer = setTimeout(() => setFeedback({ type: '', message: '' }), 4000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  // Recalculate dynamic recipient count when filters change
  useEffect(() => {
    let baseCount = 25000000;
    
    // Filter State
    if (targetState === 'Delhi') baseCount = Math.floor(baseCount * 0.15);
    else if (targetState === 'Maharashtra') baseCount = Math.floor(baseCount * 0.22);
    else if (targetState === 'Rajasthan') baseCount = Math.floor(baseCount * 0.10);
    else if (targetState === 'Karnataka') baseCount = Math.floor(baseCount * 0.08);

    // Filter Status
    if (targetStatus === 'Pending') baseCount = Math.floor(baseCount * 0.35);
    else if (targetStatus === 'Verified') baseCount = Math.floor(baseCount * 0.60);
    else if (targetStatus === 'Rejected') baseCount = Math.floor(baseCount * 0.05);

    // Filter Recipient Group
    if (targetGroup === 'All Officers') baseCount = Math.floor(baseCount * 0.005);
    else if (targetGroup === 'Supervisors Only') baseCount = Math.floor(baseCount * 0.0005);

    setRecipientCount(baseCount);
  }, [targetState, targetStatus, targetGroup]);

  // -------------------------------------------------------------
  // ACTIONS / HANDLERS
  // -------------------------------------------------------------
  const handleCopyTemplate = (tplText, tplSubject) => {
    if (activeComposeTab === 'sms') {
      setSmsText(tplText);
      setFeedback({ type: 'success', message: 'SMS Template copied to composer.' });
    } else if (activeComposeTab === 'email') {
      if (tplSubject) setEmailSubject(tplSubject);
      setEmailBody(`<p>Dear Citizen,</p><p>This is a standard template for ${tplText || 'notification'}.</p>`);
      setFeedback({ type: 'success', message: 'Email Template copied to composer.' });
    }
  };

  const handleSendInstantNotification = () => {
    const timestamp = new Date().toLocaleString();
    let previewMsg = '';
    
    if (activeComposeTab === 'sms') {
      previewMsg = `SMS Broadcast: "${smsText.substring(0, 30)}..." dispatched to ${recipientCount.toLocaleString()} recipients.`;
    } else if (activeComposeTab === 'email') {
      previewMsg = `Email Broadcast: "${emailSubject}" dispatched to ${recipientCount.toLocaleString()} recipients.`;
    } else {
      previewMsg = `Push Alert: "${pushTitle}" dispatched to ${recipientCount.toLocaleString()} devices.`;
    }

    const newLog = {
      id: `TX-${Math.floor(10000 + Math.random() * 90000)}`,
      type: activeComposeTab.toUpperCase(),
      recipientGroup: `${targetGroup} (${targetState})`,
      status: 'Delivered',
      date: timestamp,
      sender: 'Administrator'
    };

    setHistoryLogs([newLog, ...historyLogs]);
    setFeedback({ type: 'success', message: previewMsg });
  };

  const handleScheduleNotification = () => {
    const timestamp = `${scheduleDate} ${scheduleTime} ${scheduleZone}`;
    let previewMsg = '';

    if (activeComposeTab === 'sms') {
      previewMsg = `SMS scheduled for delivery on ${timestamp}.`;
    } else if (activeComposeTab === 'email') {
      previewMsg = `Email scheduled for delivery on ${timestamp}.`;
    } else {
      previewMsg = `Push alerts scheduled for delivery on ${timestamp}.`;
    }

    setFeedback({ type: 'success', message: previewMsg });
  };

  const handleLaunchCampaign = (e) => {
    e.preventDefault();
    if (!campaignForm.name || !campaignForm.duration || !campaignForm.reach) {
      setFeedback({ type: 'error', message: 'Please fill in all campaign fields.' });
      return;
    }

    const newCampaign = {
      id: `CMP-${Math.floor(100 + Math.random() * 900)}`,
      name: campaignForm.name,
      type: 'Awareness',
      duration: campaignForm.duration,
      targetAudience: campaignForm.targetAudience,
      reach: campaignForm.reach,
      status: 'Active'
    };

    setCampaigns([newCampaign, ...campaigns]);
    setShowCampaignModal(false);
    setCampaignForm({ name: '', duration: '', targetAudience: 'All Citizens', reach: '' });
    setFeedback({ type: 'success', message: `Awareness campaign "${newCampaign.name}" has been launched.` });
  };

  const handleBroadcastAnnouncement = (e) => {
    e.preventDefault();
    if (!announcementForm.title) {
      setFeedback({ type: 'error', message: 'Please enter a title.' });
      return;
    }

    const newAnnouncement = {
      id: `ANN-${Math.floor(300 + Math.random() * 700)}`,
      title: announcementForm.title,
      officerGroup: announcementForm.group,
      priority: announcementForm.priority,
      readCount: '0 / 150'
    };

    setOfficerAnnouncements([newAnnouncement, ...officerAnnouncements]);
    setShowAnnouncementModal(false);
    setAnnouncementForm({ title: '', group: 'Verification Officers', priority: 'High' });
    setFeedback({ type: 'success', message: `Internal announcement broadcasted to ${newAnnouncement.officerGroup}.` });
  };

  const toggleCampaignStatus = (id) => {
    const updated = campaigns.map(c => {
      if (c.id === id) {
        const nextStatus = c.status === 'Active' ? 'Paused' : 'Active';
        setFeedback({ type: 'warning', message: `Campaign "${c.name}" status set to "${nextStatus}".` });
        return { ...c, status: nextStatus };
      }
      return c;
    });
    setCampaigns(updated);
  };

  const handleUploadMockAttachment = () => {
    const docs = ['census_guide_2026.pdf', 'aadhaar_requirements.pdf', 'ward_coordinates_delhi.xlsx'];
    const doc = docs[Math.floor(Math.random() * docs.length)];

    if (attachmentsList.includes(doc)) {
      setFeedback({ type: 'warning', message: 'Attachment file already uploaded.' });
      return;
    }

    setAttachmentsList([...attachmentsList, doc]);
    setFeedback({ type: 'success', message: `File "${doc}" successfully attached to email body.` });
  };

  const handleTriggerEmergencyBroadcast = (group) => {
    const timestamp = new Date().toLocaleString();
    const alertMsg = `CRITICAL: Emergency System Broadcast dispatched instantly to ${
      group === 'citizens' ? 'All Citizens (25M+)' : 'All Operational Officers (5000+)'
    } under administrative override credentials.`;

    const newLog = {
      id: `TX-${Math.floor(10000 + Math.random() * 90000)}`,
      type: 'PUSH/SMS',
      recipientGroup: group === 'citizens' ? 'All Citizens' : 'All Census Officers',
      status: 'Delivered',
      date: timestamp,
      sender: 'Super Administrator'
    };

    setHistoryLogs([newLog, ...historyLogs]);
    setShowEmergencyModal(false);
    setFeedback({ type: 'error', message: alertMsg });
  };

  const handleCompileReport = (name) => {
    setReportState('compiling');
    setTimeout(() => {
      setReportState('done');
      setFeedback({ type: 'success', message: `${name} successfully compiled and exported (PDF format).` });
      setTimeout(() => setReportState(null), 3000);
    }, 2000);
  };

  // Filter History Logs
  const filteredHistory = historyLogs.filter(log => {
    const matchesSearch = log.recipientGroup.toLowerCase().includes(logSearch.toLowerCase()) || 
                          log.sender.toLowerCase().includes(logSearch.toLowerCase());
    const matchesType = logFilterType === 'All' || log.type === logFilterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="flex-grow w-full max-w-containerMax mx-auto px-6 py-8 flex flex-col gap-8 text-onSurface bg-background">
      
      {/* CSS Dark Mode overrides */}
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
      {feedback.message && (
        <div className={`fixed bottom-6 right-6 z-50 p-4 rounded-lg shadow-xl flex items-center gap-3 border text-xs max-w-sm animate-fade-in ${
          feedback.type === 'success' ? 'bg-green-50 text-green-800 border-green-200 dark:bg-green-950/80 dark:text-green-300 dark:border-green-800' :
          feedback.type === 'warning' ? 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-800' :
          'bg-red-50 text-red-800 border-red-200 dark:bg-red-950/80 dark:text-red-300 dark:border-red-800'
        }`}>
          {feedback.type === 'success' && <CheckCircle2 className="w-5 h-5 shrink-0 text-success" />}
          {feedback.type === 'warning' && <AlertTriangle className="w-5 h-5 shrink-0 text-amber-500" />}
          {feedback.type === 'error' && <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* SECTION 1: PAGE HEADER */}
      <section className="relative overflow-hidden rounded-xl border border-outlineVariant/50 bg-primary p-6 text-white shadow-ambient flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex flex-col gap-2 relative z-10">
          <div className="flex items-center gap-2">
            <span className="bg-[#ff9933]/20 border border-[#ff9933]/30 text-[#ff9933] font-bold uppercase text-[9px] px-2.5 py-0.5 rounded-full tracking-wider animate-pulse">
              National Broadcast Center
            </span>
            <span className="text-[10px] text-white/70 font-semibold">• Ministry of Home Affairs</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Communication Center</h2>
          <p className="text-xs text-white/80 max-w-xl leading-relaxed">
            Manage notifications, public awareness campaigns, citizen communications, officer announcements, and messaging templates.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 relative z-10 shrink-0">
          <button 
            onClick={() => { setShowCampaignModal(true); }}
            className="bg-secondary text-primary-dark font-bold text-xs px-4 py-2.5 rounded-full hover:bg-secondary/90 transition-all flex items-center gap-1.5 active:scale-95 shadow-sm cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Create Campaign
          </button>
          <button 
            onClick={() => { setShowAnnouncementModal(true); }}
            className="bg-white/10 hover:bg-white/20 border border-white/25 text-white font-bold text-xs px-4 py-2.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Create Template
          </button>
          <button 
            onClick={() => handleCompileReport(reportSelection)}
            className="bg-white/10 hover:bg-white/20 border border-white/25 text-white font-bold text-xs px-4 py-2.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> Export Comm Report
          </button>
          <button 
            onClick={() => { setShowEmergencyModal(true); }}
            className="bg-[#ef4444]/80 hover:bg-[#ef4444] border border-red-500 text-white font-bold text-xs px-4 py-2.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer animate-pulse"
          >
            <Flame className="w-3.5 h-3.5" /> Emergency Broadcast
          </button>
        </div>
      </section>

      {/* SECTION 2: COMMUNICATION OVERVIEW STATS */}
      <section className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {[
          { label: 'Messages Sent', count: '1,250,000', status: 'Total dispatches', icon: FileText, color: 'text-primary' },
          { label: 'SMS Delivered', count: '985,000', status: '98% Delivery rate', icon: Phone, color: 'text-success' },
          { label: 'Emails Delivered', count: '210,000', status: '82% Open rate', icon: Mail, color: 'text-primary' },
          { label: 'Push Delivered', count: '55,000', status: 'Instant device alerts', icon: Bell, color: 'text-amber-500' },
          { label: 'Active Campaigns', count: campaigns.filter(c => c.status === 'Active').length, status: 'Awareness drives', icon: Activity, color: 'text-success' },
          { label: 'Scheduled Tasks', count: '12 Cases', status: 'Message scheduler queue', icon: Calendar, color: 'text-primary' }
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-surface p-4 rounded-xl border border-outlineVariant/50 shadow-sm flex flex-col gap-1.5 hover:border-primary/50 transition-colors">
              <span className="text-[10px] font-bold text-onSurfaceVariant uppercase tracking-wider">{stat.label}</span>
              <div className="text-lg font-bold text-primary flex items-end justify-between">
                <span>{stat.count}</span>
                <Icon className={`w-4 h-4 ${stat.color} opacity-80`} />
              </div>
              <p className="text-[9px] text-onSurfaceVariant">{stat.status}</p>
            </div>
          );
        })}
      </section>

      {/* DYNAMIC THREE-COLUMN BROADCAST INTERFACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT/MID MAIN COLUMN: COMPOSERS, AUDIENCE, CAMPAIGNS (8 COLS) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* SECTION 4: AUDIENCE MANAGEMENT */}
          <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-outlineVariant/15 pb-2.5">
              <h3 className="font-bold text-xs text-primary uppercase tracking-wider">Target Audience Builder</h3>
              <span className="text-[10px] font-mono bg-primary-container/20 text-primary px-2 py-0.5 rounded font-extrabold">
                Recipients: {recipientCount.toLocaleString()} Citizens
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="flex flex-col gap-1">
                <label className="font-bold text-primary uppercase text-[8px]">Recipient Group</label>
                <select 
                  value={targetGroup}
                  onChange={e => setTargetGroup(e.target.value)}
                  className="px-2.5 py-1.5 bg-surface border border-outlineVariant rounded outline-none text-xs focus:border-primary text-onSurface"
                >
                  <option value="All Citizens">All Citizens</option>
                  <option value="Unregistered Citizens">Unregistered Citizens</option>
                  <option value="All Officers">All Census Officers</option>
                  <option value="Supervisors Only">Zonal Supervisors Only</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-primary uppercase text-[8px]">State Jurisdiction</label>
                <select 
                  value={targetState}
                  onChange={e => setTargetState(e.target.value)}
                  className="px-2.5 py-1.5 bg-surface border border-outlineVariant rounded outline-none text-xs focus:border-primary text-onSurface"
                >
                  <option value="All">All States (National)</option>
                  <option value="Delhi">Delhi NCT</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Rajasthan">Rajasthan</option>
                  <option value="Karnataka">Karnataka</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-primary uppercase text-[8px]">Verification Status</label>
                <select 
                  value={targetStatus}
                  onChange={e => setTargetStatus(e.target.value)}
                  className="px-2.5 py-1.5 bg-surface border border-outlineVariant rounded outline-none text-xs focus:border-primary text-onSurface"
                >
                  <option value="All">All Statuses</option>
                  <option value="Verified">Verified Only</option>
                  <option value="Pending">Pending Verification</option>
                  <option value="Rejected">Rejected Audits</option>
                </select>
              </div>
            </div>
          </div>

          {/* SECTION 3: NOTIFICATIONS CENTER (COMPOSER WIDGET) */}
          <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
            
            <div className="flex justify-between items-center border-b border-outlineVariant/15 pb-2.5">
              <h3 className="font-bold text-xs text-primary uppercase tracking-wider">Direct Notification Center</h3>
              <div className="flex gap-1 text-xs">
                {['sms', 'email', 'push'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveComposeTab(tab)}
                    className={`px-3 py-1 font-bold rounded transition-colors cursor-pointer ${
                      activeComposeTab === tab 
                        ? 'bg-primary text-white' 
                        : 'text-onSurfaceVariant hover:bg-surface-low'
                    }`}
                  >
                    {tab.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Composer Body views */}
            <div className="text-xs">
              
              {/* SMS COMPOSER */}
              {activeComposeTab === 'sms' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-primary uppercase text-[8px]">SMS Content Composer</label>
                    <textarea 
                      rows={3}
                      value={smsText}
                      onChange={e => setSmsText(e.target.value)}
                      placeholder="Compose SMS alert..."
                      className="px-2.5 py-1.5 bg-surface border border-outlineVariant rounded outline-none text-xs focus:border-primary w-full text-onSurface"
                    />
                    <div className="flex justify-between text-[10px] text-onSurfaceVariant font-semibold">
                      <span>Characters: <strong>{smsText.length}</strong> / 160 (1 SMS Credit)</span>
                      <span>Target Count: <strong>{recipientCount.toLocaleString()} Citizens</strong></span>
                    </div>
                  </div>

                  {/* SMS Mobile Preview Simulator */}
                  <div className="p-3 bg-surface-low border border-outlineVariant/20 rounded-lg flex flex-col gap-2">
                    <span className="text-[8px] text-onSurfaceVariant uppercase font-bold">Live Mobile SMS Simulator</span>
                    <div className="max-w-xs mx-auto border-4 border-slate-700 bg-slate-900 rounded-2xl p-3 shadow-md text-white text-[11px] font-sans">
                      <div className="bg-slate-800 text-[9px] py-1 rounded text-center mb-2 font-semibold text-slate-300">
                        💬 +91 BHARAT-CEN
                      </div>
                      <div className="bg-blue-600 text-white p-2.5 rounded-lg text-[10px] leading-relaxed relative">
                        {smsText}
                        <div className="text-[8px] text-blue-200 text-right mt-1.5">Just Now</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* EMAIL COMPOSER */}
              {activeComposeTab === 'email' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-primary uppercase text-[8px]">Email Subject Line</label>
                    <input 
                      type="text" 
                      value={emailSubject}
                      onChange={e => setEmailSubject(e.target.value)}
                      className="px-2.5 py-1.5 bg-surface border border-outlineVariant rounded outline-none text-xs focus:border-primary text-onSurface w-full"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-primary uppercase text-[8px]">Rich Content (HTML simulated)</label>
                    <textarea 
                      rows={4}
                      value={emailBody}
                      onChange={e => setEmailBody(e.target.value)}
                      className="px-2.5 py-1.5 bg-surface border border-outlineVariant rounded outline-none text-xs focus:border-primary w-full font-mono text-onSurface"
                    />
                  </div>

                  {/* Attachments */}
                  <div className="flex flex-col gap-1.5">
                    <span className="font-bold text-primary uppercase text-[8px]">Attachments Manager</span>
                    <div className="flex flex-wrap gap-2 items-center">
                      <button 
                        onClick={handleUploadMockAttachment}
                        className="bg-primary hover:bg-primary-light text-white font-bold px-3 py-1.5 rounded flex items-center gap-1 text-[10px] cursor-pointer"
                      >
                        <Paperclip className="w-3.5 h-3.5" /> Attach Document
                      </button>
                      {attachmentsList.map((file, idx) => (
                        <div key={idx} className="p-1 px-2.5 bg-surface-low border border-outlineVariant/20 rounded flex items-center gap-2 text-[10px]">
                          <span className="font-mono text-[9px]">{file}</span>
                          <button 
                            onClick={() => setAttachmentsList(attachmentsList.filter(f => f !== file))}
                            className="text-red-500 hover:text-red-700 cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* PUSH COMPOSER */}
              {activeComposeTab === 'push' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-primary uppercase text-[8px]">Push Notification Title</label>
                      <input 
                        type="text" 
                        value={pushTitle}
                        onChange={e => setPushTitle(e.target.value)}
                        className="px-2.5 py-1.5 bg-surface border border-outlineVariant rounded outline-none text-xs focus:border-primary text-onSurface w-full"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-primary uppercase text-[8px]">App Target URL / Route</label>
                      <input 
                        type="text" 
                        defaultValue="/dashboard" 
                        className="px-2.5 py-1.5 bg-surface border border-outlineVariant rounded outline-none text-xs focus:border-primary text-onSurface w-full" 
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-primary uppercase text-[8px]">Push Alert Content Message</label>
                    <textarea 
                      rows={2}
                      value={pushMessage}
                      onChange={e => setPushMessage(e.target.value)}
                      className="px-2.5 py-1.5 bg-surface border border-outlineVariant rounded outline-none text-xs focus:border-primary w-full text-onSurface"
                    />
                  </div>

                  {/* Push Mobile Simulator */}
                  <div className="p-3 bg-surface-low border border-outlineVariant/20 rounded-lg flex flex-col gap-2">
                    <span className="text-[8px] text-onSurfaceVariant uppercase font-bold">Push Notification Notification Center Simulator</span>
                    <div className="max-w-xs mx-auto border-4 border-slate-700 bg-slate-950 rounded-2xl p-4 shadow-md text-white text-[11px] font-sans">
                      <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 flex items-start gap-2.5 shadow-sm">
                        <div className="w-6 h-6 rounded bg-primary flex items-center justify-center shrink-0 text-white font-bold text-[10px]">
                          🇮🇳
                        </div>
                        <div className="flex-grow">
                          <div className="flex justify-between items-center text-[9px] font-bold text-slate-300">
                            <span>BHARAT CENSUS PORTAL</span>
                            <span>now</span>
                          </div>
                          <div className="font-bold text-slate-100 text-[10px] mt-0.5">{pushTitle}</div>
                          <p className="text-slate-400 text-[9px] leading-normal">{pushMessage}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Send triggers */}
            <div className="flex justify-end gap-2 border-t border-outlineVariant/10 pt-3 text-[10px]">
              <button 
                onClick={handleSendInstantNotification}
                className="bg-primary hover:bg-primary-light text-white font-bold px-4 py-2 rounded-full cursor-pointer flex items-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5" /> Send Immediately
              </button>
              <button 
                onClick={handleScheduleNotification}
                className="border border-outlineVariant hover:bg-surface-low px-4 py-2 rounded-full font-bold cursor-pointer"
              >
                Schedule Delivery
              </button>
            </div>

          </div>

          {/* SECTION 5: CAMPAIGN MANAGEMENT */}
          <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
            
            {/* Inner sections toggler */}
            <div className="border-b border-outlineVariant/15 pb-2 flex justify-between items-center">
              <h3 className="font-bold text-xs text-primary uppercase tracking-wider">Active Awareness & Broadcast Campaigns</h3>
              <button 
                onClick={() => setShowCampaignModal(true)}
                className="text-primary hover:underline text-xs font-bold cursor-pointer"
              >
                + Launch Campaign
              </button>
            </div>

            {/* Awareness Campaigns cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {campaigns.map(cmp => (
                <div key={cmp.id} className="p-3.5 bg-surface-low border border-outlineVariant/20 rounded-lg flex flex-col gap-2 relative">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="bg-primary-container/20 text-primary font-bold text-[8px] uppercase px-2 py-0.5 rounded tracking-wide">
                        {cmp.type}
                      </span>
                      <h4 className="font-bold text-xs text-primary mt-1.5">{cmp.name}</h4>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase ${
                      cmp.status === 'Active' ? 'bg-green-100 text-green-700' :
                      cmp.status === 'Paused' ? 'bg-amber-100 text-amber-700' :
                      'bg-slate-100 text-slate-500'
                    }`}>
                      {cmp.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px] text-onSurfaceVariant mt-1">
                    <div>Duration: <strong>{cmp.duration}</strong></div>
                    <div>Target: <strong>{cmp.targetAudience}</strong></div>
                    <div>Reach Est: <strong className="text-primary font-bold">{cmp.reach}</strong></div>
                  </div>

                  <div className="flex gap-2 justify-end border-t border-outlineVariant/10 pt-2.5 mt-1 text-[9px] font-semibold">
                    <button 
                      onClick={() => toggleCampaignStatus(cmp.id)}
                      className="text-primary hover:underline cursor-pointer"
                    >
                      {cmp.status === 'Active' ? 'Pause' : 'Resume'}
                    </button>
                    <button 
                      onClick={() => setFeedback({ type: 'success', message: `Campaign "${cmp.name}" details loaded for edit.` })}
                      className="text-onSurfaceVariant hover:underline cursor-pointer"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Official Census Updates list */}
            <div className="border-t border-outlineVariant/10 pt-4 flex flex-col gap-3">
              <span className="font-bold text-[10px] text-primary uppercase">Official Census Announcements & Portal Banners</span>
              <div className="space-y-2.5">
                {updates.map(upd => (
                  <div key={upd.id} className="p-3 bg-surface-low border border-outlineVariant/25 rounded-lg flex justify-between items-center gap-4 text-xs">
                    <div>
                      <div className="font-semibold text-primary">{upd.title}</div>
                      <div className="flex gap-3 text-[9px] text-onSurfaceVariant mt-1">
                        <span>Jurisdiction: <strong>{upd.target}</strong></span>
                        <span>Date: <strong>{upd.date}</strong></span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase ${
                        upd.priority === 'High' ? 'bg-red-100 text-red-700 animate-pulse' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {upd.priority} Priority
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Officer announcements internal */}
            <div className="border-t border-outlineVariant/10 pt-4 flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <span className="font-bold text-[10px] text-primary uppercase">Internal Officer announcements & operational guidelines</span>
                <button 
                  onClick={() => setShowAnnouncementModal(true)}
                  className="text-primary hover:underline text-xs font-bold cursor-pointer"
                >
                  + Broadcast to Officers
                </button>
              </div>
              <div className="space-y-2.5">
                {officerAnnouncements.map(ann => (
                  <div key={ann.id} className="p-3 bg-surface-low border border-outlineVariant/25 rounded-lg flex justify-between items-center gap-4 text-xs">
                    <div>
                      <div className="font-semibold text-red-700 dark:text-red-300 font-mono text-[11px]">{ann.id}: {ann.title}</div>
                      <span className="text-[9px] text-onSurfaceVariant block mt-1">Target Group: <strong className="text-primary">{ann.officerGroup}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] text-onSurfaceVariant font-bold">Read: {ann.readCount}</span>
                      <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded text-[8px] font-extrabold uppercase">
                        {ann.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* RIGHT COLUMN: ANALYTICS, TEMPLATES, SCHEDULER, LOGS (4 COLS) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* SECTION 6: CAMPAIGN ANALYTICS (CUSTOM SVG CHART) */}
          <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
            <h3 className="font-bold text-xs text-primary uppercase tracking-wider flex items-center gap-1.5">
              <BarChart2 className="w-4 h-4 text-primary" /> Delivery & Open Analytics
            </h3>

            {/* Statistics meters */}
            <div className="space-y-3.5 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-outlineVariant/10">
                <span className="text-onSurfaceVariant">Average SMS Open Rate:</span>
                <strong className="text-success font-extrabold">72.0%</strong>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-outlineVariant/10">
                <span className="text-onSurfaceVariant">Average Email Click Rate:</span>
                <strong className="text-primary font-extrabold">18.4%</strong>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-outlineVariant/10">
                <span className="text-onSurfaceVariant">Campaign Conversion rate:</span>
                <strong className="text-primary font-extrabold">34.5%</strong>
              </div>
            </div>

            {/* Custom SVG Open/Click engagement curves */}
            <div className="flex flex-col items-center gap-1">
              <span className="text-[8px] font-bold text-primary uppercase">Month-on-Month Reach Growth</span>
              <svg viewBox="0 0 160 80" className="w-full h-16">
                <line x1="0" y1="15" x2="160" y2="15" stroke="#eceef0" strokeWidth="0.5" />
                <line x1="0" y1="35" x2="160" y2="35" stroke="#eceef0" strokeWidth="0.5" />
                <line x1="0" y1="55" x2="160" y2="55" stroke="#eceef0" strokeWidth="0.5" />
                
                {/* Curve path */}
                <path d="M 0 70 L 30 60 L 60 40 L 90 48 L 120 20 L 160 10" fill="none" stroke="#2563eb" strokeWidth="2.5" />
                <path d="M 0 75 L 30 70 L 60 55 L 90 60 L 120 40 L 160 25" fill="none" stroke="#10b981" strokeWidth="2.0" strokeDasharray="3" />
                
                <circle cx="120" cy="20" r="3.5" fill="#2563eb" />
                <circle cx="160" cy="10" r="3.5" fill="#2563eb" />
              </svg>
              <div className="flex justify-between w-full text-[8px] font-semibold text-onSurfaceVariant px-1 mt-1">
                <span>Jan</span>
                <span>Mar</span>
                <span>May</span>
                <span>Jun (Est)</span>
              </div>
            </div>
          </div>

          {/* SECTION 9: DELIVERY TRACKING STATUS */}
          <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-3.5">
            <h3 className="font-bold text-xs text-primary uppercase tracking-wider">SMS / Email Delivery Tracking</h3>
            <div className="space-y-3 text-xs">
              
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between font-bold text-[10px] text-onSurfaceVariant">
                  <span>DELIVERED (Successful dispatches)</span>
                  <span className="text-success">98.2%</span>
                </div>
                <div className="w-full h-2 bg-outlineVariant/20 rounded-full overflow-hidden">
                  <div className="h-full bg-success rounded-full" style={{ width: '98.2%' }} />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between font-bold text-[10px] text-onSurfaceVariant">
                  <span>PENDING (Carrier queues)</span>
                  <span className="text-amber-500">1.0%</span>
                </div>
                <div className="w-full h-2 bg-outlineVariant/20 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '1%' }} />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between font-bold text-[10px] text-onSurfaceVariant">
                  <span>FAILED (Invalid addresses/numbers)</span>
                  <span className="text-red-500">0.8%</span>
                </div>
                <div className="w-full h-2 bg-outlineVariant/20 rounded-full overflow-hidden">
                  <div className="h-full bg-red-500 rounded-full" style={{ width: '0.8%' }} />
                </div>
              </div>

            </div>
          </div>

          {/* SECTION 7: TEMPLATE MANAGEMENT */}
          <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
            <h3 className="font-bold text-xs text-primary uppercase tracking-wider">Communication Templates Library</h3>
            
            <div className="space-y-4">
              {/* SMS Templates list */}
              <div className="flex flex-col gap-2.5">
                <span className="font-bold text-[9px] text-primary uppercase">SMS Message Templates</span>
                <div className="space-y-2">
                  {INITIAL_TEMPLATES_SMS.map((tpl, idx) => (
                    <div key={idx} className="p-3 bg-surface-low border border-outlineVariant/20 rounded-lg flex flex-col gap-1.5 text-xs">
                      <div className="flex justify-between items-center">
                        <strong className="text-primary">{tpl.name}</strong>
                        <span className="text-[8px] text-onSurfaceVariant font-bold">Usage: {(tpl.usage/1000).toFixed(0)}k</span>
                      </div>
                      <p className="text-[10px] text-onSurfaceVariant font-mono bg-surface p-1.5 rounded leading-normal border border-outlineVariant/10">
                        {tpl.text}
                      </p>
                      <button 
                        onClick={() => handleCopyTemplate(tpl.text)}
                        className="text-primary hover:underline text-[9px] font-bold self-end"
                      >
                        Copy to Composer
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Email Templates list */}
              <div className="flex flex-col gap-2.5 border-t border-outlineVariant/10 pt-3.5">
                <span className="font-bold text-[9px] text-primary uppercase">Email Layout Templates</span>
                <div className="space-y-2">
                  {INITIAL_TEMPLATES_EMAIL.map((tpl, idx) => (
                    <div key={idx} className="p-2.5 bg-surface-low border border-outlineVariant/20 rounded-lg flex items-center justify-between text-xs">
                      <div>
                        <strong className="text-primary text-[11px] block">{tpl.name}</strong>
                        <span className="text-[9px] text-onSurfaceVariant font-mono">Subject: {tpl.subject}</span>
                      </div>
                      <button 
                        onClick={() => handleCopyTemplate(tpl.name, tpl.subject)}
                        className="text-primary hover:underline text-[9px] font-bold shrink-0"
                      >
                        Use
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* SECTION 8: MESSAGE SCHEDULER CONTROL */}
          <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
            <h3 className="font-bold text-xs text-primary uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-primary" /> Delivery Scheduler
            </h3>

            <div className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-primary uppercase text-[8px]">Date Selection</label>
                  <input 
                    type="date" 
                    value={scheduleDate}
                    onChange={e => setScheduleDate(e.target.value)}
                    className="px-2.5 py-1.5 bg-surface border border-outlineVariant rounded outline-none text-xs focus:border-primary text-onSurface"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-primary uppercase text-[8px]">Time Selection</label>
                  <input 
                    type="time" 
                    value={scheduleTime}
                    onChange={e => setScheduleTime(e.target.value)}
                    className="px-2.5 py-1.5 bg-surface border border-outlineVariant rounded outline-none text-xs focus:border-primary text-onSurface"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-primary uppercase text-[8px]">Zone</label>
                  <input 
                    type="text" 
                    value={scheduleZone}
                    onChange={e => setScheduleZone(e.target.value)}
                    className="px-2.5 py-1.5 bg-surface border border-outlineVariant rounded outline-none text-xs focus:border-primary text-onSurface"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-primary uppercase text-[8px]">Recurrence Pattern</label>
                  <select 
                    value={scheduleRecurring}
                    onChange={e => setScheduleRecurring(e.target.value)}
                    className="px-2.5 py-1.5 bg-surface border border-outlineVariant rounded outline-none text-xs focus:border-primary text-onSurface"
                  >
                    <option value="Once">Once-off Delivery</option>
                    <option value="Daily">Daily Broadcast</option>
                    <option value="Weekly">Weekly Digest</option>
                    <option value="Monthly">Monthly Reminder</option>
                  </select>
                </div>
              </div>

              <button 
                onClick={handleScheduleNotification}
                className="w-full bg-primary hover:bg-primary-light text-white font-bold py-2 rounded-lg cursor-pointer"
              >
                Schedule Task
              </button>
            </div>
          </div>

          {/* SECTION 10: COMMUNICATION HISTORY TABLE/LOG */}
          <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
            <h3 className="font-bold text-xs text-primary uppercase tracking-wider">Communication Audit Trails</h3>
            
            {/* Search filter controls */}
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Search recipient group..."
                value={logSearch}
                onChange={e => setLogSearch(e.target.value)}
                className="flex-grow px-2 py-1 bg-surface border border-outlineVariant rounded text-xs outline-none focus:border-primary text-onSurface"
              />
              <select 
                value={logFilterType}
                onChange={e => setLogFilterType(e.target.value)}
                className="px-2 py-1 bg-surface border border-outlineVariant rounded text-xs outline-none focus:border-primary text-onSurface"
              >
                <option value="All">All Types</option>
                <option value="SMS">SMS</option>
                <option value="EMAIL">Email</option>
                <option value="PUSH">Push</option>
              </select>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {filteredHistory.map(log => (
                <div key={log.id} className="p-2.5 bg-surface-low border border-outlineVariant/20 rounded flex items-center justify-between text-[10px] gap-4">
                  <div>
                    <span className="font-bold text-primary font-mono">{log.id} ({log.type})</span>
                    <div className="text-onSurfaceVariant font-semibold">Audience: {log.recipientGroup}</div>
                    <span className="text-[8px] text-onSurfaceVariant">{log.date}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-success font-extrabold uppercase text-[8px] block">{log.status}</span>
                    <span className="text-onSurfaceVariant text-[9px]">Author: {log.sender}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 12: QUICK ACTIONS */}
          <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-3.5">
            <h3 className="font-bold text-xs text-primary uppercase tracking-wider">Quick Shortcuts</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button 
                onClick={() => { setActiveComposeTab('sms'); window.scrollTo({ top: 300, behavior: 'smooth' }); }}
                className="p-2 border border-outlineVariant hover:bg-surface-low rounded text-left font-bold text-onSurface"
              >
                Send SMS
              </button>
              <button 
                onClick={() => { setActiveComposeTab('email'); window.scrollTo({ top: 300, behavior: 'smooth' }); }}
                className="p-2 border border-outlineVariant hover:bg-surface-low rounded text-left font-bold text-onSurface"
              >
                Send Email
              </button>
              <button 
                onClick={() => { setActiveComposeTab('push'); window.scrollTo({ top: 300, behavior: 'smooth' }); }}
                className="p-2 border border-outlineVariant hover:bg-surface-low rounded text-left font-bold text-onSurface"
              >
                Send Push Alert
              </button>
              <button 
                onClick={() => { window.scrollTo({ top: 700, behavior: 'smooth' }); }}
                className="p-2 border border-outlineVariant hover:bg-surface-low rounded text-left font-bold text-onSurface"
              >
                View Analytics
              </button>
            </div>
          </div>

          {/* SECTION 13: HELP & SUPPORT DOCUMENTS */}
          <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
            <h3 className="font-bold text-xs text-primary uppercase tracking-wider flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-primary" /> Training SOPs & FAQs
            </h3>
            
            <div className="space-y-3 text-xs text-onSurfaceVariant">
              <div className="pb-2 border-b border-outlineVariant/15">
                <span className="font-bold text-primary block">SMS Content Compliance Guideline</span>
                <p className="text-[10px] leading-relaxed mt-0.5">
                  All transactional SMS alerts must match DLT registered templates in CPGRAMS standards to bypass network carrier blocks.
                </p>
              </div>

              <div>
                <span className="font-bold text-primary block">Emergency Alert Override</span>
                <p className="text-[10px] leading-relaxed mt-0.5">
                  Emergency broadcasts execute immediately across all gateways without scheduling constraints. Authorized admins only.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* CREATE CAMPAIGN MODAL DIALOG */}
      {showCampaignModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-surface border border-outlineVariant rounded-xl max-w-md w-full p-6 shadow-premium relative animate-scale-in">
            <button 
              onClick={() => setShowCampaignModal(false)}
              className="absolute top-4 right-4 p-1 rounded hover:bg-surface-low text-onSurfaceVariant cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h3 className="font-bold text-base text-primary uppercase tracking-wide mb-4">Launch Census Awareness Campaign</h3>
            
            <form onSubmit={handleLaunchCampaign} className="space-y-4 text-xs">
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-primary uppercase text-[8px]">Campaign Name *</label>
                <input 
                  type="text" 
                  value={campaignForm.name}
                  onChange={e => setCampaignForm({...campaignForm, name: e.target.value})}
                  placeholder="e.g. National Census Drive"
                  className="px-2.5 py-2 bg-surface border border-outlineVariant rounded outline-none focus:border-primary text-onSurface"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-primary uppercase text-[8px]">Duration Period *</label>
                  <input 
                    type="text" 
                    value={campaignForm.duration}
                    onChange={e => setCampaignForm({...campaignForm, duration: e.target.value})}
                    placeholder="e.g. June 15 - July 15"
                    className="px-2.5 py-2 bg-surface border border-outlineVariant rounded outline-none focus:border-primary text-onSurface"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-primary uppercase text-[8px]">Estimated Reach *</label>
                  <input 
                    type="text" 
                    value={campaignForm.reach}
                    onChange={e => setCampaignForm({...campaignForm, reach: e.target.value})}
                    placeholder="e.g. 15 Million"
                    className="px-2.5 py-2 bg-surface border border-outlineVariant rounded outline-none focus:border-primary text-onSurface"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-primary uppercase text-[8px]">Target Audience</label>
                <select 
                  value={campaignForm.targetAudience}
                  onChange={e => setCampaignForm({...campaignForm, targetAudience: e.target.value})}
                  className="px-2.5 py-2 bg-surface border border-outlineVariant rounded outline-none focus:border-primary text-onSurface"
                >
                  <option value="All Citizens">All Citizens</option>
                  <option value="Rural Jurisdictions">Rural Wards only</option>
                  <option value="Urban Centered Wards">Urban Centered only</option>
                  <option value="Unregistered Citizens">Unregistered Households</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 border-t border-outlineVariant/10 pt-4 mt-2">
                <button 
                  type="button"
                  onClick={() => setShowCampaignModal(false)}
                  className="border border-outlineVariant hover:bg-surface-low px-4 py-2 rounded-full font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-primary hover:bg-primary-light text-white font-bold px-5 py-2 rounded-full cursor-pointer shadow-sm"
                >
                  Launch Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE internal announcement modal */}
      {showAnnouncementModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-surface border border-outlineVariant rounded-xl max-w-md w-full p-6 shadow-premium relative animate-scale-in">
            <button 
              onClick={() => setShowAnnouncementModal(false)}
              className="absolute top-4 right-4 p-1 rounded hover:bg-surface-low text-onSurfaceVariant cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h3 className="font-bold text-base text-primary uppercase tracking-wide mb-4">Broadcast Announcement to Officers</h3>
            
            <form onSubmit={handleBroadcastAnnouncement} className="space-y-4 text-xs">
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-primary uppercase text-[8px]">Announcement Title *</label>
                <textarea 
                  rows={2}
                  value={announcementForm.title}
                  onChange={e => setAnnouncementForm({...announcementForm, title: e.target.value})}
                  placeholder="Enter policy update or training notice..."
                  className="px-2.5 py-2 bg-surface border border-outlineVariant rounded outline-none focus:border-primary text-onSurface"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-primary uppercase text-[8px]">Target Officer Group</label>
                  <select 
                    value={announcementForm.group}
                    onChange={e => setAnnouncementForm({...announcementForm, group: e.target.value})}
                    className="px-2.5 py-2 bg-surface border border-outlineVariant rounded outline-none focus:border-primary text-onSurface"
                  >
                    <option value="Verification Officers">Verification Officers</option>
                    <option value="All Supervisors">All Zonal Supervisors</option>
                    <option value="Biometric Officers">Biometric Officers</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-primary uppercase text-[8px]">Priority Level</label>
                  <select 
                    value={announcementForm.priority}
                    onChange={e => setAnnouncementForm({...announcementForm, priority: e.target.value})}
                    className="px-2.5 py-2 bg-surface border border-outlineVariant rounded outline-none focus:border-primary text-onSurface"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-outlineVariant/10 pt-4 mt-2">
                <button 
                  type="button"
                  onClick={() => setShowAnnouncementModal(false)}
                  className="border border-outlineVariant hover:bg-surface-low px-4 py-2 rounded-full font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-primary hover:bg-primary-light text-white font-bold px-5 py-2 rounded-full cursor-pointer shadow-sm"
                >
                  Broadcast Announcement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EMERGENCY BROADCAST MODAL (SECTION 11) */}
      {showEmergencyModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-surface border border-red-500 rounded-xl max-w-md w-full p-6 shadow-premium relative animate-scale-in">
            <button 
              onClick={() => setShowEmergencyModal(false)}
              className="absolute top-4 right-4 p-1 rounded hover:bg-surface-low text-onSurfaceVariant cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h3 className="font-bold text-base text-red-600 uppercase tracking-wide flex items-center gap-1.5 mb-2">
              <Flame className="w-5 h-5 animate-pulse" /> Critical Emergency Broadcast
            </h3>
            <p className="text-xs text-onSurfaceVariant leading-normal mb-4">
              WARNING: This override triggers immediate bulk SMS and push alerts across all gateways to your chosen audience, bypassing scheduling queues.
            </p>

            <div className="flex flex-col gap-3.5 text-xs">
              <button 
                onClick={() => handleTriggerEmergencyBroadcast('citizens')}
                className="w-full bg-[#ef4444] text-white hover:bg-red-700 font-bold py-3 rounded-lg cursor-pointer flex items-center justify-center gap-2"
              >
                🚨 Broadcast to ALL Citizens (25 Million+)
              </button>
              <button 
                onClick={() => handleTriggerEmergencyBroadcast('officers')}
                className="w-full border border-red-600 text-red-600 hover:bg-red-50 font-bold py-3 rounded-lg cursor-pointer flex items-center justify-center gap-2"
              >
                🚨 Broadcast to ALL Census Officers (5000+)
              </button>
            </div>

            <div className="flex justify-end border-t border-outlineVariant/10 pt-4 mt-4">
              <button 
                type="button"
                onClick={() => setShowEmergencyModal(false)}
                className="border border-outlineVariant hover:bg-surface-low px-4 py-2 rounded-full font-bold cursor-pointer text-xs"
              >
                Cancel Override
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default CommunicationCenter;
