import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldAlert, AlertTriangle, Check, X, Shield, Lock, Eye, Download, 
  FileText, Activity, Users, UserCheck, RefreshCw, ZoomIn, ZoomOut, 
  MapPin, Clock, ArrowRight, ShieldCheck, ChevronRight, HelpCircle, 
  Maximize2, Plus, Edit2, Play, CheckCircle2, AlertCircle, BarChart2, 
  FileSpreadsheet, Send, TrendingUp, Compass, Network, Landmark,
  Mail, Phone, Bell, Calendar, Flame, Zap, Copy, File, Paperclip, Grid,
  Filter, Share2, Clipboard, Printer, HardDrive, Key, Smartphone, Terminal
} from 'lucide-react';

// ==========================================
// MOCK DATASETS
// ==========================================
const INITIAL_LOGINS = [
  { id: 'LOG-4512', userName: 'Mohit Pratap Mehra', role: 'Citizen', date: '2026-06-06', time: '10:15 AM', ipAddress: '192.168.1.45', device: 'Chrome / Windows', location: 'Delhi NCT', status: 'Successful Login' },
  { id: 'LOG-4513', userName: 'Rahul Sharma', role: 'Officer', date: '2026-06-06', time: '09:00 AM', ipAddress: '192.168.1.12', device: 'Firefox / Android', location: 'Delhi NCT', status: 'Successful Login' },
  { id: 'LOG-4514', userName: 'Sunita Sharma', role: 'Citizen', date: '2026-06-05', time: '02:45 PM', ipAddress: '192.168.4.82', device: 'Safari / iPhone', location: 'Mumbai West', status: 'Successful Login' },
  { id: 'LOG-4515', userName: 'Unknown User', role: 'Citizen', date: '2026-06-05', time: '11:20 PM', ipAddress: '103.45.12.89', device: 'Chrome / Linux', location: 'Patna North', status: 'Failed Login (Invalid Password)' }
];

const INITIAL_DATA_CHANGES = [
  { id: 'CHG-101', record: 'Address Details', oldValue: 'Sector 15, Dwarka, Delhi', newValue: 'Sector 21, Dwarka, Delhi', modifiedBy: 'Citizen (Mohit Pratap Mehra)', date: '2026-06-05 11:30 AM' },
  { id: 'CHG-102', record: 'Mobile Contact', oldValue: '+91 98765 00000', newValue: '+91 98765 43210', modifiedBy: 'Citizen (Sunita Sharma)', date: '2026-06-04 03:00 PM' },
  { id: 'CHG-103', record: 'Family Member Count', oldValue: '4 Members', newValue: '5 Members', modifiedBy: 'Officer (Anjali Desai)', date: '2026-06-03 01:45 PM' }
];

const INITIAL_VERIFICATIONS = [
  { id: 'VER-8902', citizenName: 'Mohit Pratap Mehra', officerName: 'Rahul Sharma', action: 'Verification Started', timestamp: '2026-06-06 11:30 AM', status: 'In Progress' },
  { id: 'VER-8903', citizenName: 'Sunita Sharma', officerName: 'Rahul Sharma', action: 'Verification Approved', timestamp: '2026-06-05 02:00 PM', status: 'Approved' },
  { id: 'VER-8904', citizenName: 'Rajesh Kovind', officerName: 'Anjali Desai', action: 'Revisit Requested', timestamp: '2026-06-04 04:15 PM', status: 'Revisit Pending' },
  { id: 'VER-8905', citizenName: 'Abhishek Kumar', officerName: 'Vikram Singh', action: 'Case Escalated', timestamp: '2026-06-03 09:30 AM', status: 'Escalated' }
];

const INITIAL_OFFICER_LOGS = [
  { id: 'OFC-301', officerName: 'Rahul Sharma', empId: 'EMP-9081', action: 'Household Visit Completed', area: 'Delhi Ward 12', timestamp: '2026-06-06 11:45 AM' },
  { id: 'OFC-302', officerName: 'Anjali Desai', empId: 'EMP-9082', action: 'Approved Certificate Exception', area: 'Pune Central', timestamp: '2026-06-05 03:30 PM' },
  { id: 'OFC-303', officerName: 'Vikram Singh', empId: 'EMP-9083', action: 'Launched Misconduct Audit', area: 'Patna North', timestamp: '2026-06-04 10:00 AM' }
];

const AUDIT_STEPS = [
  { time: '10:00 AM', event: 'Citizen Logged In', desc: 'Mohit Pratap Mehra authenticated successfully from Delhi NCT IP.' },
  { time: '10:15 AM', event: 'Document Uploaded', desc: 'Aadhaar Card copy uploaded to citizen verification file.' },
  { time: '10:45 AM', event: 'Verification Assigned', desc: 'Address verification assigned to Field Officer Rahul Sharma.' },
  { time: '11:30 AM', event: 'Verification Approved', desc: 'Physical verification audit cleared and signed by officer.' },
  { time: '12:00 PM', event: 'Certificate Generated', desc: 'Census Identity Card compiled and digitally signed by MHA Gate.' }
];

const SECURITY_ALERTS = [
  { id: 'SEC-101', type: 'Brute Force Attempt', attempts: 5, risk: 'High', details: '5 failed login attempts detected on Citizen profile from unknown IP.' },
  { id: 'SEC-102', type: 'Multiple Device Login', attempts: 2, risk: 'Medium', details: 'Officer Rahul Sharma active session observed on separate browser agents.' },
  { id: 'SEC-103', type: 'IP Mismatch Alert', attempts: 1, risk: 'High', details: 'Administrator access session initiated outside zonal Delhi subnet.' }
];

const COMPLIANCE_CHECKLIST = [
  { id: 'CMP-01', rule: 'Data Encryption Standard', desc: 'All citizen records protected under 256-bit AES protocol.', status: 'Compliant' },
  { id: 'CMP-02', rule: 'DLT SMS Consent Registry', desc: 'Dispatched transactional alerts matched baseline formats.', status: 'Compliant' },
  { id: 'CMP-03', rule: 'Audit Log Retention Threshold', desc: 'Storage logs retained for minimum 6-month statutory duration.', status: 'Exception Needed' }
];

const INITIAL_INVESTIGATIONS = [
  { caseId: 'INV-2026-01', title: 'Unauthorized Patna Login investigation', date: '2026-06-04', linkedLogs: 3, notes: 'Analyzing source subnets for Patna logins.' },
  { caseId: 'INV-2026-02', title: 'Pune Document Override audit', date: '2026-06-05', linkedLogs: 1, notes: 'Verifying manual override logs for blurry scans.' }
];

const LIVE_EVENTS = [
  { event: 'Citizen Mohit Pratap Mehra logged in', time: '1 Sec Ago' },
  { event: 'Officer Rahul Sharma verified household', time: '15 Sec Ago' },
  { event: 'Document Aadhaar_Card.pdf uploaded by Sunita Sharma', time: '40 Sec Ago' },
  { event: 'Census ID Certificate compiled for Rajesh Kovind', time: '1 Min Ago' }
];

const AuditLogs = () => {
  const navigate = useNavigate();

  // -------------------------------------------------------------
  // STATE MANAGEMENT
  // -------------------------------------------------------------
  const [activeAuditTab, setActiveAuditTab] = useState('logins'); // 'logins', 'data-changes', 'verification', 'officer'
  const [loginsHistory, setLoginsHistory] = useState(INITIAL_LOGINS);
  const [dataChanges, setDataChanges] = useState(INITIAL_DATA_CHANGES);
  const [verifications, setVerifications] = useState(INITIAL_VERIFICATIONS);
  const [officerLogs, setOfficerLogs] = useState(INITIAL_OFFICER_LOGS);
  
  // Real-time Event Feed
  const [liveFeed, setLiveFeed] = useState(LIVE_EVENTS);

  // Filters Center
  const [selectedUserFilter, setSelectedUserFilter] = useState('All');
  const [actionCategoryFilter, setActionCategoryFilter] = useState('All');
  const [dateRangePreset, setDateRangePreset] = useState('All');

  // Selected details
  const [selectedDataChange, setSelectedDataChange] = useState(INITIAL_DATA_CHANGES[0]);
  const [investigationCases, setInvestigationCases] = useState(INITIAL_INVESTIGATIONS);
  const [selectedCaseId, setSelectedCaseId] = useState(INITIAL_INVESTIGATIONS[0].caseId);

  // Storage and Retention Settings
  const [retentionMonths, setRetentionMonths] = useState(6);
  const [reportSelection, setReportSelection] = useState('Login Activity Report');
  const [reportState, setReportState] = useState(null); // 'compiling', 'done'

  // Modals / Overlays
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [newCaseTitle, setNewCaseTitle] = useState('');
  const [showCaseModal, setShowCaseModal] = useState(false);

  // Toast feedback
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  // Auto clear feedback
  useEffect(() => {
    if (feedback.message) {
      const timer = setTimeout(() => setFeedback({ type: '', message: '' }), 4000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  // Simulate Auto-refresh real-time activity feed every 12 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const randomActivities = [
        'Citizen Sunita Sharma updated emergency contacts',
        'Officer Anjali Desai downloaded Delhi coverage reports',
        'Failed login attempt observed from Mumbai IP subnet',
        'Officer Vikram Singh reassigned Ward 14 supervisor logs',
        'Verification status updated for Abhishek Kumar'
      ];
      const picked = randomActivities[Math.floor(Math.random() * randomActivities.length)];
      setLiveFeed(prev => [{ event: picked, time: 'Just Now' }, ...prev.slice(0, 4)]);
    }, 12000);

    return () => clearInterval(interval);
  }, []);

  // -------------------------------------------------------------
  // OPERATIONS HANDLERS
  // -------------------------------------------------------------
  const handleRestoreRecord = () => {
    if (!selectedDataChange) return;
    setReportState('restoring');
    
    setTimeout(() => {
      const timestamp = new Date().toLocaleString();
      
      // Update data change history by appending a restore action
      const restoredItem = {
        id: `CHG-${Math.floor(100 + Math.random() * 900)}`,
        record: selectedDataChange.record,
        oldValue: selectedDataChange.newValue,
        newValue: selectedDataChange.oldValue,
        modifiedBy: 'Super Administrator',
        date: timestamp
      };

      setDataChanges([restoredItem, ...dataChanges]);
      setSelectedDataChange(restoredItem);
      setReportState(null);
      setShowRestoreModal(false);
      setFeedback({ type: 'success', message: `Successfully rolled back "${selectedDataChange.record}" to value "${selectedDataChange.oldValue}".` });
    }, 2000);
  };

  const handleLinkActivityToCase = () => {
    let logRef = '';
    if (activeAuditTab === 'logins') logRef = loginsHistory[0].userName;
    else if (activeAuditTab === 'data-changes') logRef = selectedDataChange.record;
    else if (activeAuditTab === 'verification') logRef = verifications[0].citizenName;
    else logRef = officerLogs[0].officerName;

    const updated = investigationCases.map(c => {
      if (c.caseId === selectedCaseId) {
        setFeedback({ type: 'success', message: `Linked activity context of "${logRef}" into case ${c.caseId}.` });
        return { ...c, linkedLogs: c.linkedLogs + 1 };
      }
      return c;
    });

    setInvestigationCases(updated);
  };

  const handleCreateInvestigationCase = (e) => {
    e.preventDefault();
    if (!newCaseTitle) {
      setFeedback({ type: 'error', message: 'Please enter an investigation title.' });
      return;
    }

    const randomSuffix = Math.floor(10 + Math.random() * 90);
    const newCase = {
      caseId: `INV-2026-${randomSuffix}`,
      title: newCaseTitle,
      date: new Date().toISOString().split('T')[0],
      linkedLogs: 0,
      notes: 'New investigation folder created by auditor.'
    };

    setInvestigationCases([newCase, ...investigationCases]);
    setSelectedCaseId(newCase.caseId);
    setShowCaseModal(false);
    setNewCaseTitle('');
    setFeedback({ type: 'success', message: `Investigation case "${newCase.title}" successfully created.` });
  };

  const handleCompileReport = (name) => {
    setReportState('compiling');
    setTimeout(() => {
      setReportState('done');
      setFeedback({ type: 'success', message: `${name} successfully compiled and exported (PDF format).` });
      setTimeout(() => setReportState(null), 3000);
    }, 2000);
  };

  // Filter queue lists
  const filteredLogins = loginsHistory.filter(log => {
    const matchesUser = selectedUserFilter === 'All' || log.userName.toLowerCase().includes(selectedUserFilter.toLowerCase()) || log.role === selectedUserFilter;
    return matchesUser;
  });

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
              Security Operations Center
            </span>
            <span className="text-[10px] text-white/70 font-semibold">â€¢ Ministry of Home Affairs</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
            <Terminal className="w-7 h-7" /> Audit Logs
          </h2>
          <p className="text-xs text-white/80 max-w-xl leading-relaxed">
            Track user activities, officer actions, verification processes, system changes, and security events across the census platform.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 relative z-10 shrink-0">
          <button 
            onClick={() => handleCompileReport('Bulk Audit Logs Export')}
            className="bg-secondary text-primary-dark font-bold text-xs px-4 py-2.5 rounded-full hover:bg-secondary/90 transition-all flex items-center gap-1.5 active:scale-95 shadow-sm cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> Export Audit Logs
          </button>
          <button 
            onClick={() => handleCompileReport('Regulatory Compliance Report')}
            className="bg-white/10 hover:bg-white/20 border border-white/25 text-white font-bold text-xs px-4 py-2.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5" /> Generate Compliance Report
          </button>
          <button 
            onClick={() => { window.scrollTo({ top: 900, behavior: 'smooth' }); }}
            className="bg-white/10 hover:bg-white/20 border border-white/25 text-white font-bold text-xs px-4 py-2.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Shield className="w-3.5 h-3.5" /> Open Security Board
          </button>
        </div>
      </section>

      {/* SECTION 2: AUDIT OVERVIEW */}
      <section className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {[
          { label: 'Activities Logged', count: '12,500,000', status: 'Cumulative audit trails', icon: FileText, color: 'text-primary' },
          { label: 'Active Users Today', count: '25,000', status: 'Online portal sessions', icon: Users, color: 'text-primary' },
          { label: 'Verification Actions', count: '8,500 Log', status: 'Physical address audits', icon: UserCheck, color: 'text-success' },
          { label: 'Data Modifications', count: '1,420 Edit', status: 'Record updates', icon: Clipboard, color: 'text-amber-500' },
          { label: 'Officer Activities', count: '5,100', status: 'Field officer visits', icon: Activity, color: 'text-primary' },
          { label: 'Security Alerts', count: '12 Lead', status: 'Investigate triggers', icon: ShieldAlert, color: 'text-red-500 animate-pulse' }
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

      {/* DYNAMIC TWO-COLUMN INVESTIGATIVE WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: ACTIVITY TABLES, FILTER drawer, TIMELINE (7 COLS) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* SECTION 5: FILTER CENTER */}
          <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
            <h3 className="font-bold text-xs text-primary uppercase tracking-wider flex items-center gap-1.5">
              <Filter className="w-4 h-4" /> Audit Search & Filters Center
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="flex flex-col gap-1">
                <label className="font-bold text-primary uppercase text-[8px]">User Context Search</label>
                <input 
                  type="text" 
                  value={selectedUserFilter}
                  onChange={e => setSelectedUserFilter(e.target.value)}
                  placeholder="Search user name or role..."
                  className="px-2.5 py-1.5 bg-surface border border-outlineVariant rounded outline-none text-xs focus:border-primary text-onSurface"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-primary uppercase text-[8px]">Action Category</label>
                <select 
                  value={actionCategoryFilter}
                  onChange={e => setActionCategoryFilter(e.target.value)}
                  className="px-2.5 py-1.5 bg-surface border border-outlineVariant rounded outline-none text-xs focus:border-primary text-onSurface"
                >
                  <option value="All">All Categories</option>
                  <option value="Login">Login Activities</option>
                  <option value="Profile Update">Profile Updates</option>
                  <option value="Verification">Verification Actions</option>
                  <option value="Officer">Officer Activities</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-primary uppercase text-[8px]">Date Preset</label>
                <select 
                  value={dateRangePreset}
                  onChange={e => setDateRangePreset(e.target.value)}
                  className="px-2.5 py-1.5 bg-surface border border-outlineVariant rounded outline-none text-xs focus:border-primary text-onSurface"
                >
                  <option value="All">All Logged Dates</option>
                  <option value="Today">Today (June 6)</option>
                  <option value="Yesterday">Yesterday</option>
                  <option value="Last 7 Days">Last 7 Days</option>
                </select>
              </div>
            </div>
          </div>

          {/* SECTION 3: ACTIVITY TRACKING (MAIN TABS & QUEUES) */}
          <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-outlineVariant/15 pb-2.5">
              <h3 className="font-bold text-xs text-primary uppercase tracking-wider">Activity Log Database</h3>
              <span className="text-[9px] text-onSurfaceVariant font-bold">Search results: {filteredLogins.length} events</span>
            </div>

            {/* Inner Queue selector tabs */}
            <div className="flex border-b border-outlineVariant/20 pb-1 text-xs overflow-x-auto gap-2">
              {[
                { id: 'logins', label: 'Login History', icon: Key },
                { id: 'data-changes', label: 'Data Changes', icon: Clipboard },
                { id: 'verification', label: 'Verification Actions', icon: UserCheck },
                { id: 'officer', label: 'Officer Actions', icon: Activity }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveAuditTab(tab.id)}
                  className={`px-3 py-2 font-bold transition-colors cursor-pointer shrink-0 border-b-2 flex items-center gap-1.5 ${
                    activeAuditTab === tab.id 
                      ? 'border-primary text-primary' 
                      : 'border-transparent text-onSurfaceVariant hover:text-primary'
                  }`}
                >
                  <tab.icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab view layouts */}
            <div className="overflow-x-auto text-xs">
              
              {/* LOGIN HISTORY */}
              {activeAuditTab === 'logins' && (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-outlineVariant/30 text-onSurfaceVariant font-bold">
                      <th className="py-2.5 px-2">User Name</th>
                      <th className="py-2.5 px-2">Role</th>
                      <th className="py-2.5 px-2">Timestamp</th>
                      <th className="py-2.5 px-2">IP Subnet</th>
                      <th className="py-2.5 px-2">Device Agent</th>
                      <th className="py-2.5 px-2 text-right font-bold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outlineVariant/15">
                    {filteredLogins.map(log => (
                      <tr key={log.id} className="hover:bg-surface-low/50 transition-colors">
                        <td className="py-3 px-2 font-semibold text-primary">{log.userName}</td>
                        <td className="py-3 px-2 text-onSurfaceVariant">{log.role}</td>
                        <td className="py-3 px-2 font-mono text-[11px]">{log.date} {log.time}</td>
                        <td className="py-3 px-2 font-mono text-onSurfaceVariant">{log.ipAddress}</td>
                        <td className="py-3 px-2 text-onSurfaceVariant flex items-center gap-1">
                          <Smartphone className="w-3 h-3 text-primary shrink-0" /> {log.device}
                        </td>
                        <td className="py-3 px-2 text-right">
                          <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase ${
                            log.status.includes('Successful') ? 'bg-green-600 text-white' : 'bg-red-600 text-white animate-pulse'
                          }`}>
                            {log.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {/* DATA CHANGES */}
              {activeAuditTab === 'data-changes' && (
                <div className="space-y-3">
                  {dataChanges.map(chg => (
                    <div 
                      key={chg.id} 
                      onClick={() => setSelectedDataChange(chg)}
                      className={`p-3 bg-surface-low border rounded-lg flex flex-col gap-2 transition-all cursor-pointer ${
                        selectedDataChange?.id === chg.id ? 'border-primary bg-primary-container/5' : 'border-outlineVariant/20 hover:border-primary/30'
                      }`}
                    >
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="font-bold text-primary font-mono">{chg.id}: {chg.record}</span>
                        <span className="text-onSurfaceVariant">{chg.date}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[10px] bg-surface p-2 rounded border border-outlineVariant/10 font-mono text-onSurfaceVariant">
                        <div>Old: <strong className="text-red-600">{chg.oldValue}</strong></div>
                        <div>New: <strong className="text-green-600">{chg.newValue}</strong></div>
                      </div>
                      <div className="flex justify-between items-center text-[9px] text-onSurfaceVariant font-bold mt-1">
                        <span>Modified By: <strong className="text-primary">{chg.modifiedBy}</strong></span>
                        <button 
                          onClick={(e) => { e.stopPropagation(); setSelectedDataChange(chg); setShowRestoreModal(true); }}
                          className="bg-primary hover:bg-primary-light text-white px-2.5 py-1 rounded cursor-pointer"
                        >
                          Restore Version
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* VERIFICATION ACTIONS */}
              {activeAuditTab === 'verification' && (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-outlineVariant/30 text-onSurfaceVariant font-bold">
                      <th className="py-2.5 px-2">Verification ID</th>
                      <th className="py-2.5 px-2">Citizen Name</th>
                      <th className="py-2.5 px-2">Assigned Officer</th>
                      <th className="py-2.5 px-2">Action logs</th>
                      <th className="py-2.5 px-2">Timestamp</th>
                      <th className="py-2.5 px-2 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outlineVariant/15">
                    {verifications.map(ver => (
                      <tr key={ver.id} className="hover:bg-surface-low/50 transition-colors">
                        <td className="py-3 px-2 font-mono font-bold text-primary">{ver.id}</td>
                        <td className="py-3 px-2 font-semibold">{ver.citizenName}</td>
                        <td className="py-3 px-2 font-semibold text-primary">{ver.officerName}</td>
                        <td className="py-3 px-2 text-onSurfaceVariant">{ver.action}</td>
                        <td className="py-3 px-2 font-mono text-onSurfaceVariant">{ver.timestamp}</td>
                        <td className="py-3 px-2 text-right">
                          <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase ${
                            ver.status === 'Approved' ? 'bg-green-600 text-white' :
                            ver.status === 'Escalated' ? 'bg-red-700 text-red-800 animate-pulse' :
                            'bg-amber-500 text-white'
                          }`}>
                            {ver.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {/* OFFICER ACTIONS */}
              {activeAuditTab === 'officer' && (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-outlineVariant/30 text-onSurfaceVariant font-bold">
                      <th className="py-2.5 px-2">Officer Name</th>
                      <th className="py-2.5 px-2">Employee ID</th>
                      <th className="py-2.5 px-2">Action logs</th>
                      <th className="py-2.5 px-2">Jurisdiction Area</th>
                      <th className="py-2.5 px-2 text-right">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outlineVariant/15">
                    {officerLogs.map(log => (
                      <tr key={log.id} className="hover:bg-surface-low/50 transition-colors">
                        <td className="py-3 px-2 font-semibold text-primary">{log.officerName}</td>
                        <td className="py-3 px-2 font-mono text-onSurfaceVariant">{log.empId}</td>
                        <td className="py-3 px-2 font-semibold text-primary">{log.action}</td>
                        <td className="py-3 px-2 text-onSurfaceVariant">{log.area}</td>
                        <td className="py-3 px-2 text-right font-mono text-onSurfaceVariant">{log.timestamp}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

            </div>
          </div>

          {/* SECTION 4: AUDIT PROGRESS TIMELINE */}
          <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
            <h3 className="font-bold text-xs text-primary uppercase tracking-wider">Historical Transactions Timelines</h3>
            <div className="relative border-l-2 border-primary/20 pl-4 ml-2.5 space-y-4 text-xs">
              {AUDIT_STEPS.map((step, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute -left-[23px] top-0.5 w-3 h-3 rounded-full bg-primary border-2 border-surface" />
                  <div className="font-bold text-primary text-[10px]">{step.event}</div>
                  <div className="text-[8px] text-onSurfaceVariant font-mono font-semibold">{step.time}</div>
                  <p className="text-[10px] text-onSurfaceVariant leading-normal mt-0.5">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: SECURITY, COMPLIANCE, INVESTIGATOR, STORAGE (5 COLS) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* SECTION 10: REAL-TIME ACTIVITY Ticker STREAM */}
          <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-3.5">
            <div className="flex justify-between items-center border-b border-outlineVariant/15 pb-2">
              <h3 className="font-bold text-xs text-primary uppercase tracking-wider flex items-center gap-1.5">
                <RefreshCw className="w-4 h-4 text-primary animate-spin" /> Live Ticker Activity Stream
              </h3>
              <span className="text-[7px] text-onSurfaceVariant uppercase font-bold tracking-wider animate-pulse">Auto Refreshed</span>
            </div>
            
            <div className="space-y-3 max-h-40 overflow-y-auto">
              {liveFeed.map((feed, idx) => (
                <div key={idx} className="p-2.5 bg-surface-low border border-outlineVariant/20 rounded flex items-center justify-between text-[10px] text-onSurfaceVariant gap-4 animate-fade-in">
                  <span className="font-semibold text-primary">{feed.event}</span>
                  <span className="text-[8px] shrink-0 font-bold">{feed.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 7: SECURITY MONITORING ALARMS */}
          <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
            <h3 className="font-bold text-xs text-primary uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-red-500" /> SIEM Security Alarms & Overlaps
            </h3>

            <div className="space-y-3.5 text-xs">
              {SECURITY_ALERTS.map(alert => (
                <div key={alert.id} className="p-3 bg-red-50/10 border border-red-500/20 rounded-lg flex flex-col gap-1.5">
                  <div className="flex justify-between items-center">
                    <strong className="text-red-700 dark:text-red-300 font-bold">{alert.type}</strong>
                    <span className="bg-red-600 text-white font-bold px-1.5 py-0.5 rounded text-[8px] uppercase">
                      {alert.risk} Risk
                    </span>
                  </div>
                  <p className="text-[10px] text-onSurfaceVariant">{alert.details}</p>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 8: REGULATORY COMPLIANCE TRACKING */}
          <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
            <h3 className="font-bold text-xs text-primary uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-primary" /> Regulatory compliance Observatories
            </h3>
            
            <div className="space-y-3 text-xs">
              {COMPLIANCE_CHECKLIST.map(rule => (
                <div key={rule.id} className="p-3 bg-surface-low border border-outlineVariant/25 rounded-lg flex justify-between items-center gap-4">
                  <div>
                    <strong className="text-primary text-[11px] block">{rule.rule}</strong>
                    <p className="text-[10px] text-onSurfaceVariant mt-0.5">{rule.desc}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded font-extrabold text-[8px] uppercase ${
                    rule.status === 'Compliant' ? 'bg-green-600 text-white' : 'bg-amber-500 text-white animate-pulse'
                  }`}>
                    {rule.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 9: INVESTIGATION CENTER linkage */}
          <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-outlineVariant/15 pb-2">
              <h3 className="font-bold text-xs text-primary uppercase tracking-wider flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-primary" /> SOC Investigations Workspace
              </h3>
              <button 
                onClick={() => setShowCaseModal(true)}
                className="text-primary hover:underline text-xs font-bold cursor-pointer"
              >
                + Case Folder
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-primary uppercase text-[8px]">Select Target Investigation Case</label>
                <select 
                  value={selectedCaseId} 
                  onChange={e => setSelectedCaseId(e.target.value)}
                  className="px-2 py-1.5 bg-surface border border-outlineVariant rounded outline-none text-xs focus:border-primary text-onSurface"
                >
                  {investigationCases.map(c => (
                    <option key={c.caseId} value={c.caseId}>{c.title} ({c.caseId})</option>
                  ))}
                </select>
              </div>

              {/* Case details info */}
              {investigationCases.filter(c => c.caseId === selectedCaseId).map(c => (
                <div key={c.caseId} className="p-3 bg-surface-low border border-outlineVariant/20 rounded-lg space-y-2 text-[10px] text-onSurfaceVariant">
                  <div>Investigation Title: <strong className="text-primary">{c.title}</strong></div>
                  <div>Linked Activities: <strong className="text-primary font-bold">{c.linkedLogs} events</strong></div>
                  <div>Audit notes: <em>{c.notes}</em></div>
                </div>
              ))}

              <div className="flex gap-2 justify-end pt-2 border-t border-outlineVariant/10">
                <button 
                  onClick={handleLinkActivityToCase}
                  className="bg-primary hover:bg-primary-light text-white font-bold px-3 py-1.5 rounded-full cursor-pointer text-[10px]"
                >
                  Link Current Activity Log
                </button>
              </div>
            </div>
          </div>

          {/* SECTION 11: ANALYTICS & INSIGHTS (SVG) */}
          <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
            <h3 className="font-bold text-xs text-primary uppercase tracking-wider">Peak Hour Activity Timelines</h3>
            
            <div className="flex flex-col items-center gap-1.5">
              <span className="text-[8px] font-bold text-primary uppercase">Operational Transaction Volume per Hour</span>
              <svg viewBox="0 0 160 80" className="w-full h-16">
                <line x1="0" y1="20" x2="160" y2="20" stroke="#eceef0" strokeWidth="0.5" />
                <line x1="0" y1="40" x2="160" y2="40" stroke="#eceef0" strokeWidth="0.5" />
                <line x1="0" y1="60" x2="160" y2="60" stroke="#eceef0" strokeWidth="0.5" />
                {/* Trend line */}
                <path d="M 0 70 L 25 50 L 50 30 L 75 65 L 100 20 L 125 45 L 160 10" fill="none" stroke="#e06666" strokeWidth="2.5" />
                <circle cx="100" cy="20" r="3.5" fill="#e06666" />
                <circle cx="160" cy="10" r="3.5" fill="#e06666" />
              </svg>
              <div className="flex justify-between w-full text-[8px] font-semibold text-onSurfaceVariant px-1 mt-1">
                <span>08:00 AM</span>
                <span>12:00 PM</span>
                <span>04:00 PM</span>
                <span>08:00 PM</span>
              </div>
            </div>
          </div>

          {/* SECTION 13: DATA RETENTION MANAGEMENT */}
          <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
            <h3 className="font-bold text-xs text-primary uppercase tracking-wider flex items-center gap-1.5">
              <HardDrive className="w-4 h-4 text-primary" /> Storage & Retention settings
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between font-bold text-[10px] text-onSurfaceVariant">
                  <span>Log Retention Period: <strong>{retentionMonths} Months</strong></span>
                  <span>Max: 12 Months</span>
                </div>
                <input 
                  type="range" 
                  min="3" 
                  max="12" 
                  value={retentionMonths}
                  onChange={e => {
                    setRetentionMonths(Number(e.target.value));
                    setFeedback({ type: 'warning', message: `Retention policy updated to ${e.target.value} months. Logs older than this threshold will be archived.` });
                  }}
                  className="w-full accent-primary bg-outlineVariant/30 rounded-lg cursor-pointer h-1.5"
                />
              </div>

              <div className="p-3 bg-surface-low border border-outlineVariant/20 rounded-lg grid grid-cols-2 gap-2 text-[10px] text-onSurfaceVariant">
                <div>Backup status: <strong className="text-success">Synchronized</strong></div>
                <div>Storage size: <strong className="text-primary font-bold">14.2 GB / 50 GB</strong></div>
                <div>Last backup time: <strong className="text-primary">08:00 PM Today</strong></div>
                <div>Archived Logs files: <strong className="text-primary">32 Files</strong></div>
              </div>
            </div>
          </div>

          {/* SECTION 12: AUDIT REPORTS GENERATION */}
          <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
            <h3 className="font-bold text-xs text-primary uppercase tracking-wider">Reports Center</h3>
            <div className="flex flex-col md:flex-row gap-3">
              <select 
                value={reportSelection}
                onChange={(e) => setReportSelection(e.target.value)}
                className="flex-grow px-2.5 py-1.5 bg-surface border border-outlineVariant rounded outline-none text-xs focus:border-primary text-onSurface"
              >
                <option value="Login Activity Report">Login Activity Report</option>
                <option value="Verification Audit Report">Verification Audit Report</option>
                <option value="Officer Activity Report">Officer Activity Report</option>
                <option value="Security Audit Report">Security Audit Report</option>
                <option value="Compliance Report">Compliance Report</option>
              </select>
              <button 
                onClick={() => handleCompileReport(reportSelection)}
                disabled={reportState === 'compiling'}
                className="bg-primary hover:bg-primary-light text-white font-bold text-xs px-4 py-2 rounded transition-colors shrink-0 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5"
              >
                {reportState === 'compiling' ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Compiling...
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5" /> Compile PDF
                  </>
                )}
              </button>
            </div>
          </div>

          {/* SECTION 15: QUICK ACTIONS */}
          <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-3.5">
            <h3 className="font-bold text-xs text-primary uppercase tracking-wider">Quick Action Shortcuts</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button 
                onClick={() => { setActiveAuditTab('logins'); window.scrollTo({ top: 300, behavior: 'smooth' }); }}
                className="p-2 border border-outlineVariant hover:bg-surface-low rounded text-left font-bold text-onSurface"
              >
                Search Logins
              </button>
              <button 
                onClick={() => { setActiveAuditTab('officer'); window.scrollTo({ top: 300, behavior: 'smooth' }); }}
                className="p-2 border border-outlineVariant hover:bg-surface-low rounded text-left font-bold text-onSurface"
              >
                View Officer Actions
              </button>
              <button 
                onClick={() => handleCompileReport(reportSelection)}
                className="p-2 border border-outlineVariant hover:bg-surface-low rounded text-left font-bold text-onSurface"
              >
                Compile Logs Report
              </button>
              <button 
                onClick={() => { window.scrollTo({ top: 700, behavior: 'smooth' }); }}
                className="p-2 border border-outlineVariant hover:bg-surface-low rounded text-left font-bold text-onSurface"
              >
                View Security Board
              </button>
            </div>
          </div>

          {/* SECTION 16: HELP & COMPLIANCE DOCUMENTATION */}
          <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
            <h3 className="font-bold text-xs text-primary uppercase tracking-wider flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-primary" /> Training SOPs & Security Guides
            </h3>
            <div className="space-y-3 text-xs text-onSurfaceVariant">
              <div className="pb-2.5 border-b border-outlineVariant/15">
                <span className="font-bold text-primary block">MHA Cyber Security Guidelines</span>
                <p className="text-[10px] leading-relaxed mt-0.5">
                  Every data modification must have the corresponding citizen/officer session token attached in logs database. Rollbacks must be authorized by Super Administrators.
                </p>
              </div>

              <div>
                <span className="font-bold text-primary block">Compliance Exceptions</span>
                <p className="text-[10px] leading-relaxed mt-0.5">
                  Exceptions to audit log retention regulations are flagged in the compliance observatory panel and must be resolved by Directorate authorization within 30 days.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* RESTORE RECORD OVERLAY MODAL */}
      {showRestoreModal && selectedDataChange && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-surface border border-outlineVariant rounded-xl max-w-md w-full p-6 shadow-premium relative animate-scale-in">
            <button 
              onClick={() => setShowRestoreModal(false)}
              className="absolute top-4 right-4 p-1 rounded hover:bg-surface-low text-onSurfaceVariant cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h3 className="font-bold text-base text-primary uppercase tracking-wide mb-1.5">Restore Record Version</h3>
            <span className="text-[10px] text-onSurfaceVariant font-mono font-bold block mb-4">Case reference ID: {selectedDataChange.id}</span>
            
            <div className="space-y-4 text-xs text-onSurfaceVariant">
              <p className="leading-relaxed">
                WARNING: You are about to roll back the values of record <strong className="text-primary">"{selectedDataChange.record}"</strong>.
              </p>

              <div className="p-3 bg-surface-low border border-outlineVariant/20 rounded-lg flex flex-col gap-2 font-mono text-[10px]">
                <div>Record Type: <strong>{selectedDataChange.record}</strong></div>
                <div>Rolling back to Old value: <strong className="text-green-600">"{selectedDataChange.oldValue}"</strong></div>
                <div>Discarding Current value: <strong className="text-red-600">"{selectedDataChange.newValue}"</strong></div>
                <div>Modified Date: <strong>{selectedDataChange.date}</strong></div>
              </div>

              <div className="flex justify-end gap-2 border-t border-outlineVariant/10 pt-4 mt-2">
                <button 
                  type="button"
                  onClick={() => setShowRestoreModal(false)}
                  className="border border-outlineVariant hover:bg-surface-low px-4 py-2 rounded-full font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="button"
                  onClick={handleRestoreRecord}
                  disabled={reportState === 'restoring'}
                  className="bg-primary hover:bg-primary-light text-white font-bold px-5 py-2 rounded-full cursor-pointer shadow-sm disabled:opacity-50"
                >
                  {reportState === 'restoring' ? 'Restoring...' : 'Confirm Rollback'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CREATE NEW CASE MODAL */}
      {showCaseModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-surface border border-outlineVariant rounded-xl max-w-md w-full p-6 shadow-premium relative animate-scale-in">
            <button 
              onClick={() => setShowCaseModal(false)}
              className="absolute top-4 right-4 p-1 rounded hover:bg-surface-low text-onSurfaceVariant cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h3 className="font-bold text-base text-primary uppercase tracking-wide mb-4">Create Investigation Case Folder</h3>
            
            <form onSubmit={handleCreateInvestigationCase} className="space-y-4 text-xs">
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-primary uppercase text-[8px]">Case Title *</label>
                <input 
                  type="text" 
                  value={newCaseTitle}
                  onChange={e => setNewCaseTitle(e.target.value)}
                  placeholder="e.g. Unusual login subnets investigation"
                  className="px-2.5 py-2 bg-surface border border-outlineVariant rounded outline-none focus:border-primary text-onSurface"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 border-t border-outlineVariant/10 pt-4 mt-2">
                <button 
                  type="button"
                  onClick={() => setShowCaseModal(false)}
                  className="border border-outlineVariant hover:bg-surface-low px-4 py-2 rounded-full font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-primary hover:bg-primary-light text-white font-bold px-5 py-2 rounded-full cursor-pointer shadow-sm"
                >
                  Create Case
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AuditLogs;








