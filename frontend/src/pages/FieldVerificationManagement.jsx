import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Users, ClipboardCheck, AlertTriangle, Search, Filter, 
  MapPin, Check, X, ShieldAlert, Clock, ArrowRight, Download, Eye, 
  FileText, ExternalLink, Calendar, Map, Navigation, CheckCircle2, 
  AlertCircle, Activity, ChevronRight, HelpCircle, Send, Play, RefreshCw, 
  BarChart2, Award, FileSpreadsheet, Lock, UserCheck, Shield
} from 'lucide-react';

// ==========================================
// INITIAL VERIFICATION REQUESTS DATA
// ==========================================

const INITIAL_VERIFICATIONS = [
  {
    id: 'APP-2026-458796',
    citizenName: 'Mohit Pratap Mehra',
    familyId: 'FAM-2026-90812',
    assignedOfficer: 'Rahul Sharma',
    verificationDate: '2026-06-15',
    area: 'Sector 21',
    district: 'Central Delhi',
    status: 'Pending Review',
    priority: 'High',
    dob: '1994-04-12',
    gender: 'Male',
    aadhaarStatus: 'Verified',
    address: 'H-452, Sector 21, Dwarka, Central Delhi, Delhi - 110075',
    membersCount: 4,
    familyHead: 'Yes (Self)',
    houseType: 'Owned (Brick/Concrete)',
    notes: 'Ground validation scheduled. Inspect house dimensions and verify family count.',
    duration: '25 Minutes',
    gps: { lat: '28.6139', lng: '77.2090', accuracy: '3.4m', time: '10:45 AM' },
    photos: {
      house: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=400&q=80',
      address: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=400&q=80',
      identity: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80'
    }
  },
  {
    id: 'APP-2026-124951',
    citizenName: 'Priya Rajan',
    familyId: 'FAM-2026-10492',
    assignedOfficer: 'Anjali Desai',
    verificationDate: '2026-06-14',
    area: 'Colaba Coast',
    district: 'Mumbai City',
    status: 'Escalated',
    priority: 'Critical',
    dob: '1989-09-05',
    gender: 'Female',
    aadhaarStatus: 'Verified',
    address: 'Block 4, Cuffe Parade, Colaba, Mumbai City, Maharashtra - 400005',
    membersCount: 5,
    familyHead: 'No (Head: K. Rajan)',
    houseType: 'Rented (Appartment)',
    notes: 'Flagged for identity overlap on Aadhaar profile. Supervisor audit recommended.',
    duration: '40 Minutes',
    gps: { lat: '18.9219', lng: '72.8347', accuracy: '4.1m', time: '02:15 PM' },
    photos: {
      house: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=400&q=80',
      address: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80',
      identity: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80'
    }
  },
  {
    id: 'APP-2026-004128',
    citizenName: 'Suresh Kumar Hegde',
    familyId: 'FAM-2026-78411',
    assignedOfficer: 'Priyanka Sen',
    verificationDate: '2026-06-16',
    area: 'Indiranagar 5th Main',
    district: 'Bengaluru Urban',
    status: 'Approved',
    priority: 'Medium',
    dob: '1972-07-20',
    gender: 'Male',
    aadhaarStatus: 'Verified',
    address: '#24, 5th Main Rd, Indiranagar, Bengaluru, Karnataka - 560038',
    membersCount: 3,
    familyHead: 'Yes (Self)',
    houseType: 'Owned (Independent)',
    notes: 'Verify household rent agreement scan. All criteria matched.',
    duration: '18 Minutes',
    gps: { lat: '12.9716', lng: '77.5946', accuracy: '2.8m', time: '11:30 AM' },
    photos: {
      house: 'https://images.unsplash.com/photo-1513584684374-8bab748fbf90?auto=format&fit=crop&w=400&q=80',
      address: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=400&q=80',
      identity: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80'
    }
  },
  {
    id: 'APP-2026-302914',
    citizenName: 'Deepak Chawla',
    familyId: 'FAM-2026-44910',
    assignedOfficer: 'Vikram Singh',
    verificationDate: '2026-06-12',
    area: 'Hawa Mahal Lane 3',
    district: 'Jaipur',
    status: 'Revisit Required',
    priority: 'Low',
    dob: '1985-11-30',
    gender: 'Male',
    aadhaarStatus: 'Mismatched',
    address: '128, Hawa Mahal Rd, Jaipur, Rajasthan - 302002',
    membersCount: 6,
    familyHead: 'Yes (Self)',
    houseType: 'Owned',
    notes: 'Citizen was not available during scheduled hour. Re-route field inspectors.',
    duration: '0 Minutes (Failed)',
    gps: { lat: '26.9124', lng: '75.7873', accuracy: '15.2m', time: '04:50 PM' },
    photos: {
      house: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=400&q=80',
      address: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=400&q=80',
      identity: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80'
    }
  },
  {
    id: 'APP-2026-891024',
    citizenName: 'Lakshmi Narayanan',
    familyId: 'FAM-2026-33921',
    assignedOfficer: 'Rohit Verma',
    verificationDate: '2026-06-15',
    area: 'Adyar Sector 2',
    district: 'Chennai',
    status: 'Pending Review',
    priority: 'High',
    dob: '1991-03-18',
    gender: 'Female',
    aadhaarStatus: 'Verified',
    address: '12, Adyar Canal Bank Rd, Chennai, Tamil Nadu - 600020',
    membersCount: 4,
    familyHead: 'Yes (Self)',
    houseType: 'Owned (Brick/Concrete)',
    notes: 'Verify coordinates alignment. Visual match required for address scan.',
    duration: '22 Minutes',
    gps: { lat: '13.0067', lng: '80.2578', accuracy: '3.1m', time: '09:20 AM' },
    photos: {
      house: 'https://images.unsplash.com/photo-1576941089067-2de3c901e126?auto=format&fit=crop&w=400&q=80',
      address: 'https://images.unsplash.com/photo-1524813686514-a57563d77965?auto=format&fit=crop&w=400&q=80',
      identity: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
    }
  }
];

const INITIAL_RISKS = [
  { id: 'RSK-101', type: 'Duplicate Address', detail: 'APP-2026-458796 shares exact GPS coordinate with APP-2026-004128.', status: 'Critical', color: 'text-red-500' },
  { id: 'RSK-102', type: 'Identity Conflict', detail: 'Citizen Mohit Pratap Aadhaar biometric ping matched with active Delhi Ward 12 profile.', status: 'High', color: 'text-amber-500' },
  { id: 'RSK-103', type: 'Document Anomaly', detail: 'Uploaded PDF signature does not match verification authority timestamp.', status: 'Medium', color: 'text-yellow-500' }
];

const INITIAL_AUDITS = [
  { id: 1, date: '2026-06-06', officer: 'Rahul Sharma', action: 'Verification Scheduled', status: 'Pending Review', remarks: 'Delhi Sector 21 route plotted.' },
  { id: 2, date: '2026-06-05', officer: 'Anjali Desai', action: 'Identity Escalated', status: 'Escalated', remarks: 'Aadhaar duplication warning triggered.' },
  { id: 3, date: '2026-06-05', officer: 'Priyanka Sen', action: 'Approved Registry', status: 'Approved', remarks: 'Matched documents.' },
  { id: 4, date: '2026-06-04', officer: 'System Gateway', action: 'Validation Initiated', status: 'Submitted', remarks: 'Auto match checks completed.' }
];

const INITIAL_TIMELINE = [
  { id: 1, event: 'Verification Assigned', desc: 'Case APP-2026-458796 allocated to Field Officer Rahul Sharma', time: '10 Mins Ago', icon: UserCheck, color: 'text-primary' },
  { id: 2, event: 'Officer Visit Completed', desc: 'Rahul Sharma submitted field observations and geo-tagged images for Mohit Pratap', time: '2 Hours Ago', icon: ClipboardCheck, color: 'text-success' },
  { id: 3, event: 'Escalation Submitted', desc: 'Priya Rajan case escalated to Senior Supervisor due to identity conflicts', time: 'Yesterday', icon: ShieldAlert, color: 'text-red-500' },
  { id: 4, event: 'Approval Issued', desc: 'Suresh Kumar Hegde application registry certificate compiled and downloaded', time: '2 Days Ago', icon: CheckCircle2, color: 'text-emerald-500' }
];

const FAQS = [
  { q: 'What happens during a Revisit request?', a: 'Setting a Revisit pauses the active review timeline and triggers an automated re-routing task inside the enumerator field app for the next calendar cycle.' },
  { q: 'How is physical location accuracy mapped?', a: 'Locations are calculated using GPS coordinate signals from the field officers device. An accuracy boundary under 5 meters is marked as Optimal.' },
  { q: 'When is a risk alert categorized as Critical?', a: 'Alarms are set to Critical when Aadhaar duplicate biometrics, multiple applications on a single address, or document mismatches occur.' },
  { q: 'Can I perform bulk verification approvals?', a: 'Yes. Check the selectboxes on the pending verification queue table and click "Bulk Approve" in the page header actions.' }
];

const FieldVerificationManagement = () => {
  // Tabs & Views
  const [activeTab, setActiveTab] = useState('queue'); // 'queue', 'map', 'performance', 'reports'
  
  // Data States
  const [verifications, setVerifications] = useState(INITIAL_VERIFICATIONS);
  const [selectedVerification, setSelectedVerification] = useState(INITIAL_VERIFICATIONS[0]);
  const [riskList, setRiskList] = useState(INITIAL_RISKS);
  const [auditLogs, setAuditLogs] = useState(INITIAL_AUDITS);
  const [timeline, setTimeline] = useState(INITIAL_TIMELINE);
  
  // Action state controllers
  const [activeAction, setActiveAction] = useState(null); // 'approve', 'reject', 'revisit', 'escalate'
  const [actionForm, setActionForm] = useState({
    remarks: '',
    reason: '',
    revisitDate: '',
    supervisor: 'Supervisor R. Gowda'
  });

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // Lightbox viewer state
  const [lightboxImg, setLightboxImg] = useState(null);
  
  // Feedback
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  // Report Compiler State
  const [reportState, setReportState] = useState(null); // 'generating', 'done'

  // Chat simulator
  const [chatMessages, setChatMessages] = useState([
    { sender: 'AI Auditor', text: 'Hello Officer. Welcome to the Field Audit console. Ask me anything about verification metrics, address mismatches, or fraud reports.' }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Auto clear feedback
  useEffect(() => {
    if (feedback.message) {
      const timer = setTimeout(() => setFeedback({ type: '', message: '' }), 4000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  // Bulk Approve handler
  const handleBulkApprove = () => {
    const updatedVer = verifications.map(v => {
      if (v.status === 'Pending Review') {
        return { ...v, status: 'Approved' };
      }
      return v;
    });
    setVerifications(updatedVer);
    
    // Add timeline action
    const newTimeline = {
      id: timeline.length + 1,
      event: 'Bulk Approval Issued',
      desc: 'All pending review cases approved in bulk by Administrator',
      time: 'Just Now',
      icon: ClipboardCheck,
      color: 'text-success'
    };
    setTimeline([newTimeline, ...timeline]);

    setFeedback({ type: 'success', message: 'All pending verifications have been approved in bulk!' });
  };

  // Verification Actions submissions
  const handleVerificationAction = (e) => {
    e.preventDefault();
    if (!selectedVerification) return;

    let updatedStatus = 'Approved';
    let actionName = 'Verification Completed';
    let iconType = CheckCircle2;
    let iconColor = 'text-success';

    if (activeAction === 'reject') {
      if (!actionForm.reason) {
        setFeedback({ type: 'error', message: 'Please select a reason for rejection.' });
        return;
      }
      updatedStatus = 'Rejected';
      actionName = 'Verification Rejected';
      iconType = AlertCircle;
      iconColor = 'text-red-500';
    } else if (activeAction === 'revisit') {
      if (!actionForm.reason) {
        setFeedback({ type: 'error', message: 'Please specify reason for revisiting.' });
        return;
      }
      updatedStatus = 'Revisit Required';
      actionName = 'Revisit Scheduled';
      iconType = Clock;
      iconColor = 'text-amber-500';
    } else if (activeAction === 'escalate') {
      if (!actionForm.reason) {
        setFeedback({ type: 'error', message: 'Please select an escalation reason.' });
        return;
      }
      updatedStatus = 'Escalated';
      actionName = 'Case Escalated';
      iconType = ShieldAlert;
      iconColor = 'text-red-500';
    }

    // Update main array
    const updatedList = verifications.map(v => {
      if (v.id === selectedVerification.id) {
        return { 
          ...v, 
          status: updatedStatus,
          notes: actionForm.remarks || v.notes 
        };
      }
      return v;
    });

    setVerifications(updatedList);
    
    // Update selected profile view
    setSelectedVerification(prev => ({ 
      ...prev, 
      status: updatedStatus, 
      notes: actionForm.remarks || prev.notes 
    }));

    // Add audit logs
    const newAudit = {
      id: auditLogs.length + 1,
      date: new Date().toISOString().split('T')[0],
      officer: selectedVerification.assignedOfficer,
      action: actionName,
      status: updatedStatus,
      remarks: actionForm.remarks || 'No remarks added.'
    };
    setAuditLogs([newAudit, ...auditLogs]);

    // Add Timeline Event
    const newTimeline = {
      id: timeline.length + 1,
      event: actionName,
      desc: `Citizen ${selectedVerification.citizenName} status set to "${updatedStatus}". ${actionForm.remarks}`,
      time: 'Just Now',
      icon: iconType,
      color: iconColor
    };
    setTimeline([newTimeline, ...timeline]);

    setFeedback({ type: 'success', message: `Verification status updated to "${updatedStatus}".` });
    setActiveAction(null);
    setActionForm({ remarks: '', reason: '', revisitDate: '', supervisor: 'Supervisor R. Gowda' });
  };

  // Report center submit
  const handleCompileReport = (e) => {
    e.preventDefault();
    setReportState('generating');
    setTimeout(() => {
      setReportState('done');
      setTimeout(() => setReportState(null), 3000);
    }, 2000);
  };

  // Support chat submit
  const handleSendChatMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = { sender: 'You (Auditor)', text: chatInput };
    setChatMessages(prev => [...prev, userMsg]);

    const inputLower = chatInput.toLowerCase();
    let replyText = "Understood. Re-routing query to Field Audit Division.";
    if (inputLower.includes('revisit') || inputLower.includes('schedule')) {
      replyText = 'Revisit triggers automatically schedule a physical check-back during the next verification block. Set a recommended date under Section 5 Actions.';
    } else if (inputLower.includes('risk') || inputLower.includes('fraud')) {
      replyText = 'Fraud radar identifies address anomalies (multiple families claiming a single structure) or Aadhaar biometric overlaps. Mark flagged cases as Escalated.';
    } else if (inputLower.includes('gps') || inputLower.includes('coordinate')) {
      replyText = 'Visits require GPS pings under a 5-meter boundary to approve the submission. Review coordinates in Section 7.';
    }

    setTimeout(() => {
      setChatMessages(prev => [...prev, { sender: 'AI Auditor', text: replyText }]);
    }, 800);

    setChatInput('');
  };

  // Filter listings
  const filteredQueue = verifications.filter(v => {
    const matchesSearch = 
      v.citizenName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.familyId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.assignedOfficer.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = !statusFilter || v.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex-grow w-full max-w-containerMax mx-auto px-6 py-8 flex flex-col gap-8 text-onSurface bg-background">
      
      {/* SOLID BLACK CARDS IN DARK MODE STYLES */}
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
          {feedback.type === 'success' && <CheckCircle2 className="w-5 h-5 shrink-0" />}
          {feedback.type === 'warning' && <AlertTriangle className="w-5 h-5 shrink-0" />}
          {feedback.type === 'error' && <AlertCircle className="w-5 h-5 shrink-0" />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* LIGHTBOX EVIDENCE VIEWER */}
      {lightboxImg && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative max-w-3xl w-full flex flex-col gap-3">
            <button 
              onClick={() => setLightboxImg(null)}
              className="absolute -top-10 right-0 text-white hover:text-[#ff9933] font-bold text-sm flex items-center gap-1.5 cursor-pointer"
            >
              <X className="w-5 h-5" /> Close Preview
            </button>
            <img src={lightboxImg} alt="Evidence Document" className="w-full h-auto rounded-lg border border-white/20 shadow-2xl object-contain max-h-[80vh]" />
          </div>
        </div>
      )}

      {/* SECTION 1: PAGE HEADER */}
      <section className="relative overflow-hidden rounded-xl border border-outlineVariant/50 bg-primary p-6 text-white shadow-ambient flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex flex-col gap-2 relative z-10">
          <div className="flex items-center gap-2">
            <span className="bg-[#ff9933]/20 border border-[#ff9933]/30 text-[#ff9933] font-bold uppercase text-[9px] px-2.5 py-0.5 rounded-full tracking-wider">
              Verification command center
            </span>
            <span className="text-[10px] text-white/70 font-semibold">• Ministry of Home Affairs</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Field Verification Management</h2>
          <p className="text-xs text-white/80 max-w-xl leading-relaxed">
            Manage citizen verification requests, review field reports, track officer activities, and approve verification outcomes.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 relative z-10 shrink-0">
          <button 
            onClick={() => setFeedback({ type: 'success', message: 'Re-routing: Allocate verification boundary task.' })}
            className="bg-secondary text-primary-dark font-bold text-xs px-4 py-2.5 rounded-full hover:bg-secondary/90 transition-all flex items-center gap-1.5 active:scale-95 shadow-sm cursor-pointer"
          >
            <UserCheck className="w-3.5 h-3.5" /> Assign Verification
          </button>
          <button 
            onClick={handleBulkApprove}
            className="bg-white/10 hover:bg-white/20 border border-white/25 text-white font-bold text-xs px-4 py-2.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" /> Bulk Approve
          </button>
          <button 
            onClick={() => setFeedback({ type: 'success', message: 'Downloading: Compiling all verification registry entries.' })}
            className="bg-white/10 hover:bg-white/20 border border-white/25 text-white font-bold text-xs px-4 py-2.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" /> Export Report
          </button>
          <button 
            onClick={() => setActiveTab('performance')}
            className="bg-white/10 hover:bg-white/20 border border-white/25 text-white font-bold text-xs px-4 py-2.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Activity className="w-3.5 h-3.5" /> Open Dashboard
          </button>
        </div>
      </section>

      {/* SECTION 2: VERIFICATION OVERVIEW STATS */}
      <section className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {[
          { label: 'Pending Audits', count: '1,250', status: 'Pending', icon: Clock, color: 'text-amber-500' },
          { label: 'Completed Cases', count: '8,450', status: 'Completed', icon: CheckCircle2, color: 'text-success' },
          { label: 'Rejected Forms', count: '145', status: 'Rejected', icon: X, color: 'text-red-500' },
          { label: 'Escalated Leads', count: '35', status: 'Escalated', icon: ShieldAlert, color: 'text-red-500' },
          { label: 'Active Inspectors', count: '24', status: 'Active', icon: Users, color: 'text-primary' },
          { label: 'Requests Today', count: '120', status: 'Today', icon: Activity, color: 'text-sky-500' }
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-surface p-4 rounded-xl border border-outlineVariant/50 shadow-sm flex flex-col gap-1.5 hover:border-primary/50 transition-colors">
              <span className="text-[10px] font-bold text-onSurfaceVariant uppercase tracking-wider">{stat.label}</span>
              <div className="text-2xl font-bold text-primary flex items-end justify-between">
                <span>{stat.count}</span>
                <Icon className={`w-5 h-5 ${stat.color} opacity-80`} />
              </div>
              <p className="text-[10px] text-onSurfaceVariant">Command Registry logs</p>
            </div>
          );
        })}
      </section>

      {/* NAVIGATION TABS */}
      <section className="flex flex-wrap items-center gap-1 border-b border-outlineVariant/50 pb-2">
        {[
          { id: 'queue', label: 'Verification Queue', icon: ClipboardCheck },
          { id: 'map', label: 'Field Map View', icon: Map },
          { id: 'performance', label: 'Performance & Risks', icon: BarChart2 },
          { id: 'reports', label: 'Reports center', icon: FileText }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-xs font-bold rounded-t-lg transition-all flex items-center gap-2 border-b-2 cursor-pointer ${
                activeTab === tab.id 
                  ? 'border-primary text-primary bg-primary-container/20 dark:bg-primary-container/10' 
                  : 'border-transparent text-onSurfaceVariant hover:text-primary'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </section>

      {/* DYNAMIC VIEW SECTIONS */}
      {activeTab === 'queue' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* VERIFICATION QUEUE COLUMN */}
          <div className="lg:col-span-2 bg-surface border border-outlineVariant/50 rounded-xl p-6 shadow-sm flex flex-col gap-6">
            
            {/* Search and Advanced Filters */}
            <div className="flex flex-col gap-4 border-b border-outlineVariant/20 pb-4">
              <h3 className="font-bold text-base text-primary uppercase tracking-wide">Verification Queue Registry</h3>
              
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="w-4 h-4 text-outline absolute left-3 top-2.5" />
                  <input 
                    type="text"
                    placeholder="Search Citizen, APP ID, Family ID, Officer..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-surface border border-outlineVariant rounded text-xs outline-none focus:border-primary"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-outline" />
                  <select 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 bg-surface border border-outlineVariant rounded text-xs outline-none focus:border-primary font-medium"
                  >
                    <option value="">All Statuses</option>
                    <option value="Pending Review">Pending Review</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Escalated">Escalated</option>
                    <option value="Revisit Required">Revisit Required</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Enterprise Queue Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-surface-low border-b border-outlineVariant/30 text-onSurfaceVariant font-bold uppercase tracking-wider">
                    <th className="py-3 px-4">Citizen Profile</th>
                    <th className="py-3 px-4">Application details</th>
                    <th className="py-3 px-4">Zonal Area</th>
                    <th className="py-3 px-4 text-center">Priority</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-center">Inspection</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outlineVariant/20">
                  {filteredQueue.map(v => (
                    <tr 
                      key={v.id} 
                      className={`hover:bg-primary-container/5 transition-colors cursor-pointer ${selectedVerification?.id === v.id ? 'bg-primary-container/10' : ''}`}
                      onClick={() => {
                        setSelectedVerification(v);
                        setActiveAction(null);
                      }}
                    >
                      <td className="py-3 px-4">
                        <div className="font-semibold text-primary">{v.citizenName}</div>
                        <span className="text-[10px] text-onSurfaceVariant">DOB: {v.dob} • {v.gender}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-primary">{v.id}</div>
                        <span className="text-[10px] text-onSurfaceVariant">Officer: {v.assignedOfficer}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-primary">{v.area}</div>
                        <span className="text-[10px] text-onSurfaceVariant">{v.district}</span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2 py-0.5 rounded font-bold uppercase text-[9px] ${
                          v.priority === 'Critical' ? 'bg-red-100 text-red-700 dark:bg-red-950/45 dark:text-red-300' :
                          v.priority === 'High' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/45 dark:text-amber-300' :
                          v.priority === 'Medium' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/45 dark:text-blue-300' :
                          'bg-slate-100 text-slate-700 dark:bg-slate-950/45 dark:text-slate-300'
                        }`}>
                          {v.priority}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2 py-0.5 rounded-full font-bold uppercase text-[9px] ${
                          v.status === 'Approved' ? 'bg-green-50 text-green-700' :
                          v.status === 'Rejected' ? 'bg-red-50 text-red-700' :
                          v.status === 'Escalated' ? 'bg-red-100 text-red-800 font-extrabold' :
                          v.status === 'Revisit Required' ? 'bg-amber-50 text-amber-700' :
                          'bg-blue-50 text-blue-700'
                        }`}>
                          {v.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button 
                          className="bg-primary/5 hover:bg-primary hover:text-white px-2 py-1 rounded text-[10px] font-bold transition-all cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedVerification(v);
                            setActiveAction(null);
                          }}
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredQueue.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-onSurfaceVariant italic">No applications matching criteria found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

          </div>

          {/* CITIZEN PROFILE VALIDATION & ACTIONS PANEL */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            {selectedVerification ? (
              <div className="flex flex-col gap-6">
                
                {/* PROFILE INFORMATION DETAILS CARD */}
                <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
                  <div className="flex justify-between items-center border-b border-outlineVariant/20 pb-2.5">
                    <div>
                      <h4 className="font-bold text-sm text-primary uppercase">{selectedVerification.citizenName}</h4>
                      <span className="text-[10px] text-onSurfaceVariant font-mono">App ID: {selectedVerification.id}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded font-bold uppercase text-[9px] ${
                      selectedVerification.status === 'Approved' ? 'bg-green-50 text-green-700' :
                      selectedVerification.status === 'Rejected' ? 'bg-red-50 text-red-700' :
                      'bg-amber-50 text-amber-700'
                    }`}>
                      {selectedVerification.status}
                    </span>
                  </div>

                  <div className="space-y-3.5 text-xs">
                    
                    {/* Citizen Details */}
                    <div>
                      <span className="text-[9px] font-bold text-primary uppercase tracking-wider block mb-1">Citizen Personal profile</span>
                      <div className="grid grid-cols-2 gap-2 p-2.5 bg-surface-low border border-outlineVariant/20 rounded-lg">
                        <div>
                          <span className="text-[9px] text-onSurfaceVariant uppercase">DOB / Gender</span>
                          <div className="font-semibold text-primary">{selectedVerification.dob} ({selectedVerification.gender})</div>
                        </div>
                        <div>
                          <span className="text-[9px] text-onSurfaceVariant uppercase">Aadhaar Status</span>
                          <div className="font-semibold text-success flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5" /> {selectedVerification.aadhaarStatus}
                          </div>
                        </div>
                        <div className="col-span-2">
                          <span className="text-[9px] text-onSurfaceVariant uppercase">Family ID</span>
                          <div className="font-semibold text-primary font-mono">{selectedVerification.familyId}</div>
                        </div>
                      </div>
                    </div>

                    {/* Address details */}
                    <div>
                      <span className="text-[9px] font-bold text-primary uppercase tracking-wider block mb-1">Physical Location Address</span>
                      <div className="p-2.5 bg-surface-low border border-outlineVariant/20 rounded-lg">
                        <p className="font-semibold text-primary leading-normal">{selectedVerification.address}</p>
                        <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-outlineVariant/10 text-[10px]">
                          <div>Area: <strong className="text-primary">{selectedVerification.area}</strong></div>
                          <div>District: <strong className="text-primary">{selectedVerification.district}</strong></div>
                        </div>
                      </div>
                    </div>

                    {/* Family & Household details */}
                    <div>
                      <span className="text-[9px] font-bold text-primary uppercase tracking-wider block mb-1">Household demographics</span>
                      <div className="grid grid-cols-3 gap-2 p-2.5 bg-surface-low border border-outlineVariant/20 rounded-lg">
                        <div>
                          <span className="text-[9px] text-onSurfaceVariant uppercase">Head</span>
                          <div className="font-semibold text-primary truncate">{selectedVerification.familyHead}</div>
                        </div>
                        <div>
                          <span className="text-[9px] text-onSurfaceVariant uppercase">Members</span>
                          <div className="font-semibold text-primary">{selectedVerification.membersCount} Persons</div>
                        </div>
                        <div>
                          <span className="text-[9px] text-onSurfaceVariant uppercase">House Type</span>
                          <div className="font-semibold text-primary truncate">{selectedVerification.houseType}</div>
                        </div>
                      </div>
                    </div>

                    {/* Photo Evidence Gallery */}
                    <div>
                      <span className="text-[9px] font-bold text-primary uppercase tracking-wider block mb-1">Visual Evidence Gallery</span>
                      <div className="grid grid-cols-3 gap-2">
                        <div 
                          className="relative rounded overflow-hidden border border-outlineVariant/30 h-16 cursor-zoom-in group"
                          onClick={() => setLightboxImg(selectedVerification.photos.house)}
                        >
                          <img src={selectedVerification.photos.house} alt="House" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                          <span className="absolute bottom-0 inset-x-0 bg-black/70 text-white text-[8px] text-center py-0.5">Household</span>
                        </div>
                        <div 
                          className="relative rounded overflow-hidden border border-outlineVariant/30 h-16 cursor-zoom-in group"
                          onClick={() => setLightboxImg(selectedVerification.photos.address)}
                        >
                          <img src={selectedVerification.photos.address} alt="Address" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                          <span className="absolute bottom-0 inset-x-0 bg-black/70 text-white text-[8px] text-center py-0.5">Address Proof</span>
                        </div>
                        <div 
                          className="relative rounded overflow-hidden border border-outlineVariant/30 h-16 cursor-zoom-in group"
                          onClick={() => setLightboxImg(selectedVerification.photos.identity)}
                        >
                          <img src={selectedVerification.photos.identity} alt="ID" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                          <span className="absolute bottom-0 inset-x-0 bg-black/70 text-white text-[8px] text-center py-0.5">Verification Photo</span>
                        </div>
                      </div>
                    </div>

                    {/* GPS Coordinates Tag */}
                    {selectedVerification.gps && (
                      <div>
                        <span className="text-[9px] font-bold text-primary uppercase tracking-wider block mb-1">Geo-Tag GPS coordinate validation</span>
                        <div className="p-2.5 bg-surface-low border border-outlineVariant/20 rounded-lg flex justify-between items-center text-[10px]">
                          <div>
                            <div>Lat: <strong className="text-primary font-mono">{selectedVerification.gps.lat}</strong></div>
                            <div>Lng: <strong className="text-primary font-mono">{selectedVerification.gps.lng}</strong></div>
                          </div>
                          <div className="text-right">
                            <div>Accuracy: <strong className="text-success">{selectedVerification.gps.accuracy}</strong></div>
                            <span className="text-[9px] text-onSurfaceVariant">Time: {selectedVerification.gps.time}</span>
                          </div>
                        </div>
                      </div>
                    )}

                  </div>

                  {/* ACTION CONTROLS */}
                  <div className="border-t border-outlineVariant/20 pt-4 flex flex-wrap gap-2">
                    <button 
                      onClick={() => setActiveAction('approve')}
                      className="flex-1 py-2 bg-success text-white hover:bg-success-dark font-bold text-xs rounded-full shadow-sm cursor-pointer transition-all active:scale-95 text-center flex items-center justify-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" /> Approve
                    </button>
                    <button 
                      onClick={() => setActiveAction('reject')}
                      className="flex-1 py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold text-xs rounded-full cursor-pointer transition-all active:scale-95 text-center flex items-center justify-center gap-1"
                    >
                      <X className="w-3.5 h-3.5" /> Reject
                    </button>
                    <button 
                      onClick={() => setActiveAction('revisit')}
                      className="flex-1 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 font-bold text-xs rounded-full cursor-pointer transition-all active:scale-95 text-center flex items-center justify-center gap-1"
                    >
                      <Clock className="w-3.5 h-3.5" /> Revisit
                    </button>
                    <button 
                      onClick={() => setActiveAction('escalate')}
                      className="flex-1 py-2 bg-red-100 hover:bg-red-200 text-red-700 font-bold text-xs rounded-full cursor-pointer transition-all active:scale-95 text-center flex items-center justify-center gap-1"
                    >
                      <ShieldAlert className="w-3.5 h-3.5" /> Escalate
                    </button>
                  </div>
                </div>

                {/* DYNAMIC ACTION SUBFORM */}
                {activeAction && (
                  <div className={`bg-surface border rounded-xl p-5 shadow-lg flex flex-col gap-4 animate-fade-in text-xs ${
                    activeAction === 'approve' ? 'border-success' :
                    activeAction === 'reject' ? 'border-red-500' : 'border-amber-500'
                  }`}>
                    
                    <div className="flex justify-between items-center border-b border-outlineVariant/20 pb-2">
                      <span className="font-bold text-primary uppercase text-[10px] tracking-wider">
                        {activeAction === 'approve' && 'Approve Registry Submission'}
                        {activeAction === 'reject' && 'Reject Submission Record'}
                        {activeAction === 'revisit' && 'Schedule Field Revisit'}
                        {activeAction === 'escalate' && 'Escalate Case Audit'}
                      </span>
                      <button onClick={() => setActiveAction(null)} className="text-onSurfaceVariant hover:text-primary"><X className="w-4 h-4" /></button>
                    </div>

                    <form onSubmit={handleVerificationAction} className="space-y-3">
                      
                      {activeAction === 'reject' && (
                        <div className="flex flex-col gap-1.5">
                          <label className="font-bold text-primary uppercase text-[9px]">Rejection Reason</label>
                          <select 
                            value={actionForm.reason}
                            onChange={(e) => setActionForm({ ...actionForm, reason: e.target.value })}
                            className="w-full px-3 py-2 bg-surface border border-outlineVariant rounded outline-none focus:border-primary"
                          >
                            <option value="">Choose Reason...</option>
                            <option value="Incorrect Information">Incorrect Information</option>
                            <option value="Invalid Documents">Invalid Documents</option>
                            <option value="Address Mismatch">Address Mismatch</option>
                            <option value="Duplicate Registration">Duplicate Registration</option>
                          </select>
                        </div>
                      )}

                      {activeAction === 'revisit' && (
                        <>
                          <div className="flex flex-col gap-1.5">
                            <label className="font-bold text-primary uppercase text-[9px]">Reason for Revisit</label>
                            <select 
                              value={actionForm.reason}
                              onChange={(e) => setActionForm({ ...actionForm, reason: e.target.value })}
                              className="w-full px-3 py-2 bg-surface border border-outlineVariant rounded outline-none focus:border-primary"
                            >
                              <option value="">Choose Reason...</option>
                              <option value="Citizen Not Available">Citizen Not Available</option>
                              <option value="Address Locked">Address Locked</option>
                              <option value="Insufficient Evidence">Insufficient Evidence</option>
                            </select>
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="font-bold text-primary uppercase text-[9px]">Suggested Revisit Date</label>
                            <input 
                              type="date"
                              value={actionForm.revisitDate}
                              onChange={(e) => setActionForm({ ...actionForm, revisitDate: e.target.value })}
                              className="w-full px-3 py-2 bg-surface border border-outlineVariant rounded outline-none"
                            />
                          </div>
                        </>
                      )}

                      {activeAction === 'escalate' && (
                        <>
                          <div className="flex flex-col gap-1.5">
                            <label className="font-bold text-primary uppercase text-[9px]">Escalation Grounds</label>
                            <select 
                              value={actionForm.reason}
                              onChange={(e) => setActionForm({ ...actionForm, reason: e.target.value })}
                              className="w-full px-3 py-2 bg-surface border border-outlineVariant rounded outline-none focus:border-primary"
                            >
                              <option value="">Choose Reason...</option>
                              <option value="Fraud Suspected">Fraud Suspected</option>
                              <option value="Identity Conflict">Identity Conflict</option>
                              <option value="High Risk Application">High Risk Application</option>
                            </select>
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="font-bold text-primary uppercase text-[9px]">Assign Supervising Auditor</label>
                            <select 
                              value={actionForm.supervisor}
                              onChange={(e) => setActionForm({ ...actionForm, supervisor: e.target.value })}
                              className="w-full px-3 py-2 bg-surface border border-outlineVariant rounded outline-none focus:border-primary"
                            >
                              <option value="Supervisor R. Gowda">Supervisor R. Gowda</option>
                              <option value="Special Officer Patil">Special Officer Patil</option>
                              <option value="Registrar Vijay">Registrar Vijay</option>
                            </select>
                          </div>
                        </>
                      )}

                      <div className="flex flex-col gap-1.5">
                        <label className="font-bold text-primary uppercase text-[9px]">Remarks / Audit comments</label>
                        <textarea 
                          rows={2.5}
                          placeholder="Provide remarks, inspection notes, or approval logs..."
                          value={actionForm.remarks}
                          onChange={(e) => setActionForm({ ...actionForm, remarks: e.target.value })}
                          className="w-full px-3 py-1.5 bg-surface border border-outlineVariant rounded outline-none focus:border-primary"
                        />
                      </div>

                      <button 
                        type="submit"
                        className={`w-full py-2 text-white font-bold text-xs rounded transition-all active:scale-95 shadow cursor-pointer text-center ${
                          activeAction === 'approve' ? 'bg-success hover:bg-success-dark' :
                          activeAction === 'reject' ? 'bg-red-600 hover:bg-red-700' : 'bg-amber-500 hover:bg-amber-600'
                        }`}
                      >
                        Submit Review decision
                      </button>
                    </form>
                  </div>
                )}

              </div>
            ) : (
              <div className="bg-surface border border-outlineVariant/50 rounded-xl p-6 shadow-sm text-center text-xs text-onSurfaceVariant flex flex-col items-center gap-3">
                <Shield className="w-8 h-8 text-outline" />
                <span>Select a verification application card row from the queue table to audit coordinates, documents, and submit validation decisions.</span>
              </div>
            )}
          </div>

        </div>
      )}

      {/* SECTION 8: FIELD MAP VIEW */}
      {activeTab === 'map' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* MAP CANVAS */}
          <div className="lg:col-span-3 bg-surface border border-outlineVariant/50 rounded-xl overflow-hidden shadow-sm flex flex-col">
            <div className="px-5 py-4 border-b border-outlineVariant/30 bg-surface-low flex items-center justify-between">
              <span className="font-bold text-sm text-primary uppercase tracking-wide flex items-center gap-2">
                <Navigation className="w-4 h-4 text-[#ff9933] animate-pulse" />
                Field Inspector Live routes map
              </span>
              <div className="text-[10px] text-onSurfaceVariant font-mono">
                Projection: EPSG:4326 (WGS84)
              </div>
            </div>

            {/* SVG Interactive GPS Map representation */}
            <div className="relative h-[450px] bg-slate-50 dark:bg-[#071324] overflow-hidden">
              
              {/* Coordinates tracker */}
              <div className="absolute top-4 left-4 z-20 bg-surface/85 backdrop-blur border border-outlineVariant/50 rounded-lg p-2 shadow-sm text-[10px] font-mono">
                Lat: <strong>28.6139° N</strong><br />
                Lng: <strong>77.2090° E</strong>
              </div>

              {/* Map Canvas */}
              <div className="w-full h-full flex items-center justify-center">
                <svg viewBox="0 0 500 400" className="w-full h-full p-6">
                  {/* Grid Lines */}
                  <line x1="20" y1="200" x2="480" y2="200" stroke="#cbd5e1" strokeWidth={0.5} strokeDasharray="3,3" />
                  <line x1="250" y1="20" x2="250" y2="380" stroke="#cbd5e1" strokeWidth={0.5} strokeDasharray="3,3" />
                  
                  {/* Route path */}
                  <path d="M 50,80 L 150,140 L 250,220 L 320,180 L 410,290" fill="none" stroke="#3b82f6" strokeWidth={2} strokeDasharray="4,4" />
                  
                  {/* Active locations circles */}
                  {/* Sector 21 (Mohit Pratap) */}
                  <circle cx="150" cy="140" r="8" fill="#ff9933" stroke="#ffffff" strokeWidth={1.5} className="animate-pulse cursor-pointer" onClick={() => setSelectedVerification(verifications[0])} />
                  <text x="150" y="125" textAnchor="middle" fontSize="9" fill="#0b2447" fontWeight="bold">Mohit Pratap (APP-796)</text>
                  
                  {/* Colaba Point (Priya) */}
                  <circle cx="250" cy="220" r="8" fill="#ef4444" stroke="#ffffff" strokeWidth={1.5} className="cursor-pointer" onClick={() => setSelectedVerification(verifications[1])} />
                  <text x="250" y="205" textAnchor="middle" fontSize="9" fill="#0b2447" fontWeight="bold">Priya Rajan (APP-951)</text>

                  {/* Bengaluru (Suresh) */}
                  <circle cx="320" cy="180" r="8" fill="#10b981" stroke="#ffffff" strokeWidth={1.5} className="cursor-pointer" onClick={() => setSelectedVerification(verifications[2])} />
                  <text x="320" y="165" textAnchor="middle" fontSize="9" fill="#0b2447" fontWeight="bold">Suresh Kumar (APP-128)</text>
                  
                  {/* Active Officer Pin */}
                  <g transform="translate(150,140)">
                    <circle cx="0" cy="0" r="3" fill="#3b82f6" />
                    <path d="M 0,0 L -2,-6 L 2,-6 Z" fill="#3b82f6" />
                  </g>
                </svg>
              </div>
            </div>
          </div>

          {/* MAP SIDEBAR */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
              <h4 className="font-bold text-xs text-primary uppercase border-b border-outlineVariant/20 pb-2">Active Field Officers</h4>
              
              <div className="space-y-3 text-xs">
                {[
                  { name: 'Rahul Sharma', area: 'Sector 21, Delhi', status: 'On Route', time: '10 Mins Ago' },
                  { name: 'Anjali Desai', area: 'Cuffe Parade, Mumbai', status: 'Audit Stop', time: 'Active' },
                  { name: 'Priyanka Sen', area: 'Indiranagar, Bengaluru', status: 'Completed', time: '20 Mins Ago' }
                ].map((off, i) => (
                  <div key={i} className="p-3 bg-surface-low border border-outlineVariant/20 rounded-lg flex flex-col gap-1">
                    <div className="flex justify-between font-bold text-primary">
                      <span>{off.name}</span>
                      <span className="text-[9px] text-success font-bold">{off.status}</span>
                    </div>
                    <div className="text-[10px] text-onSurfaceVariant flex justify-between">
                      <span>Zone: {off.area}</span>
                      <span>{off.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      )}

      {/* SECTION 9 & 10: INSIGHTS & RISKS */}
      {activeTab === 'performance' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* OFFICER PERFORMANCE INSIGHTS */}
          <div className="lg:col-span-2 bg-surface border border-outlineVariant/50 rounded-xl p-6 shadow-sm flex flex-col gap-6">
            <div className="border-b border-outlineVariant/20 pb-4">
              <h3 className="font-bold text-lg text-primary uppercase">Inspector Performance statistics</h3>
              <p className="text-xs text-onSurfaceVariant mt-1">Audit daily validations rate and validation error percentage.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="bg-surface-low border border-outlineVariant/30 p-4 rounded-xl flex flex-col gap-1.5">
                <span className="text-[10px] font-bold text-onSurfaceVariant uppercase">Verifications Completed</span>
                <div className="text-3xl font-extrabold text-primary">245</div>
                <span className="text-[9px] text-success font-bold">+15% vs Last Week</span>
              </div>
              <div className="bg-surface-low border border-outlineVariant/30 p-4 rounded-xl flex flex-col gap-1.5">
                <span className="text-[10px] font-bold text-onSurfaceVariant uppercase">Average Visit duration</span>
                <div className="text-3xl font-extrabold text-primary">25 Mins</div>
                <span className="text-[9px] text-onSurfaceVariant">Optimal target: 20 Mins</span>
              </div>
              <div className="bg-surface-low border border-outlineVariant/30 p-4 rounded-xl flex flex-col gap-1.5">
                <span className="text-[10px] font-bold text-onSurfaceVariant uppercase">Approval Accuracy</span>
                <div className="text-3xl font-extrabold text-success">92.4%</div>
                <span className="text-[9px] text-onSurfaceVariant">8% Rejection Threshold</span>
              </div>
            </div>

            {/* Custom SVG performance comparison charts */}
            <div className="space-y-3 mt-2">
              <span className="text-xs font-bold text-primary uppercase tracking-wider text-[10px]">Daily Completed Verifications Trend</span>
              <div className="bg-surface-low border border-outlineVariant/20 p-4 rounded-xl h-[180px]">
                <svg viewBox="0 0 400 120" className="w-full h-full">
                  <line x1="30" y1="20" x2="380" y2="20" stroke="#cbd5e1" strokeWidth={0.5} strokeDasharray="2,2" />
                  <line x1="30" y1="60" x2="380" y2="60" stroke="#cbd5e1" strokeWidth={0.5} strokeDasharray="2,2" />
                  <line x1="30" y1="100" x2="380" y2="100" stroke="#94a3b8" strokeWidth={1} />
                  
                  {/* Line curve */}
                  <path d="M 50,90 L 100,70 L 150,40 L 200,60 L 250,30 L 300,50 L 350,15" fill="none" stroke="#3b82f6" strokeWidth={2.5} />
                  <circle cx="50" cy="90" r="3" fill="#3b82f6" stroke="#ffffff" />
                  <circle cx="100" cy="70" r="3" fill="#3b82f6" stroke="#ffffff" />
                  <circle cx="150" cy="40" r="3" fill="#3b82f6" stroke="#ffffff" />
                  <circle cx="200" cy="60" r="3" fill="#3b82f6" stroke="#ffffff" />
                  <circle cx="250" cy="30" r="3" fill="#3b82f6" stroke="#ffffff" />
                  <circle cx="300" cy="50" r="3" fill="#3b82f6" stroke="#ffffff" />
                  <circle cx="350" cy="15" r="3" fill="#3b82f6" stroke="#ffffff" />

                  <text x="50" y="112" textAnchor="middle" fontSize="8" fill="#64748b" fontWeight="bold">Mon</text>
                  <text x="100" y="112" textAnchor="middle" fontSize="8" fill="#64748b" fontWeight="bold">Tue</text>
                  <text x="150" y="112" textAnchor="middle" fontSize="8" fill="#64748b" fontWeight="bold">Wed</text>
                  <text x="200" y="112" textAnchor="middle" fontSize="8" fill="#64748b" fontWeight="bold">Thu</text>
                  <text x="250" y="112" textAnchor="middle" fontSize="8" fill="#64748b" fontWeight="bold">Fri</text>
                  <text x="300" y="112" textAnchor="middle" fontSize="8" fill="#64748b" fontWeight="bold">Sat</text>
                  <text x="350" y="112" textAnchor="middle" fontSize="8" fill="#64748b" fontWeight="bold">Sun</text>
                </svg>
              </div>
            </div>
          </div>

          {/* FRAUD & RISK DETECTION PANEL */}
          <div className="lg:col-span-1 bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
            <h4 className="font-bold text-xs text-primary uppercase tracking-wide border-b border-outlineVariant/20 pb-2">Fraud & Risk Alert dashboard</h4>
            
            <div className="space-y-3.5">
              {riskList.map(risk => (
                <div key={risk.id} className="p-3 bg-surface-low border border-outlineVariant/20 rounded-xl flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-primary text-xs">{risk.type}</span>
                    <span className={`px-2 py-0.5 rounded font-bold uppercase text-[8px] ${
                      risk.status === 'Critical' ? 'bg-red-100 text-red-700' :
                      risk.status === 'High' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {risk.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-onSurfaceVariant leading-normal">{risk.detail}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* SECTION 13: REPORTS CENTER */}
      {activeTab === 'reports' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* REPORTS GENERATOR PANEL */}
          <div className="lg:col-span-2 bg-surface border border-outlineVariant/50 rounded-xl p-6 shadow-sm flex flex-col gap-6">
            <div className="border-b border-outlineVariant/20 pb-4">
              <h3 className="font-bold text-lg text-primary">Verification Reports Compiler</h3>
              <p className="text-xs text-onSurfaceVariant mt-1">Compile comprehensive validation records and target statistics.</p>
            </div>

            <form onSubmit={handleCompileReport} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-primary uppercase text-[9px]">Select Report Template</label>
                <select className="w-full px-3 py-2 bg-surface border border-outlineVariant rounded outline-none focus:border-primary">
                  <option value="Verification Summary Report">Verification Summary Report</option>
                  <option value="Officer Activity Report">Officer Activity Report</option>
                  <option value="Area Verification Report">Area Verification Report</option>
                  <option value="Fraud Detection Report">Fraud Detection Report</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-primary uppercase text-[9px]">Report Scope District</label>
                <select className="w-full px-3 py-2 bg-surface border border-outlineVariant rounded outline-none focus:border-primary">
                  <option value="">All Districts</option>
                  <option value="Central Delhi">Central Delhi</option>
                  <option value="Mumbai City">Mumbai City</option>
                  <option value="Bengaluru Urban">Bengaluru Urban</option>
                </select>
              </div>

              <div className="md:col-span-2 flex pt-2 gap-2">
                <button 
                  type="submit" 
                  disabled={!!reportState}
                  className="flex-1 py-2.5 bg-primary text-white hover:bg-primary-light disabled:bg-primary/50 font-bold rounded-lg transition-all shadow flex items-center justify-center gap-2 cursor-pointer"
                >
                  {reportState === 'generating' ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Compiling Registry Database...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      Compile Verification Report
                    </>
                  )}
                </button>
              </div>
            </form>

            {reportState === 'done' && (
              <div className="bg-green-50 text-green-800 border border-green-200 p-4 rounded-lg text-xs flex items-center gap-3 animate-fade-in">
                <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
                <div>
                  <h5 className="font-bold">Compilation completed</h5>
                  <p className="mt-0.5 text-[11px] text-green-700/80">Downloading file in PDF format to local folders.</p>
                </div>
              </div>
            )}
          </div>

          {/* AUDIT LOG TIMELINE */}
          <div className="lg:col-span-1 bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
            <h4 className="font-bold text-xs text-primary uppercase tracking-wide border-b border-outlineVariant/20 pb-2">Verification Timeline log</h4>
            
            <div className="space-y-4">
              {timeline.map(item => {
                const Icon = item.icon;
                return (
                  <div key={item.id} className="flex gap-3 text-xs leading-relaxed items-start">
                    <div className="w-8 h-8 rounded-full bg-primary-container/20 border border-outlineVariant/30 flex items-center justify-center shrink-0">
                      <Icon className={`w-4 h-4 ${item.color}`} />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <strong className="text-primary font-bold text-[11px]">{item.event}</strong>
                        <span className="text-[9px] text-onSurfaceVariant font-semibold">{item.time}</span>
                      </div>
                      <p className="text-[11px] text-onSurfaceVariant mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* SECTION 15: HELP & SUPPORT FAQS */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* FAQS */}
        <div className="lg:col-span-2 bg-surface border border-outlineVariant/50 rounded-xl p-6 shadow-sm flex flex-col gap-5">
          <div className="border-b border-outlineVariant/20 pb-3">
            <h3 className="font-bold text-base text-primary uppercase tracking-wide">Verification manuals & Guidelines</h3>
            <p className="text-xs text-onSurfaceVariant">Officer guidebooks for ground verification and risk classification.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Frequently Asked Questions</span>
              <div className="space-y-3">
                {FAQS.map((faq, i) => (
                  <div key={i} className="text-xs space-y-1.5 p-3 bg-surface-low border border-outlineVariant/20 rounded-lg">
                    <strong className="text-primary font-bold flex items-start gap-1">
                      <HelpCircle className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" /> {faq.q}
                    </strong>
                    <p className="text-onSurfaceVariant leading-relaxed pl-4.5">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Training & Document resources</span>
              <div className="space-y-2">
                {[
                  { title: 'Ground Field Officer Protocol Handbook', author: 'Registrar General Office' },
                  { title: 'Fake Document & Aadhaar Duplicate identification guide', author: 'UIDAI Compliance Division' },
                  { title: 'Standard GPS boundary accuracy rules (EPSG)', author: 'NIC Mapping Board' }
                ].map((doc, i) => (
                  <div key={i} className="p-3 bg-surface-low border border-outlineVariant/20 hover:border-primary/40 rounded-lg flex justify-between items-start gap-2.5 transition-all text-xs">
                    <div className="space-y-1">
                      <strong className="font-bold text-primary block leading-snug">{doc.title}</strong>
                      <span className="text-[9px] text-onSurfaceVariant uppercase font-bold">{doc.author}</span>
                    </div>
                    <button 
                      onClick={() => setFeedback({ type: 'success', message: `Retrieving guide: ${doc.title}` })}
                      className="text-primary hover:underline font-semibold shrink-0 text-[11px]"
                    >
                      Open Guide
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* LIVE SUPPORT CHAT */}
        <div className="lg:col-span-1 bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
          <div className="border-b border-outlineVariant/20 pb-2">
            <h4 className="font-bold text-xs text-primary uppercase tracking-wide">Field Audit Support</h4>
            <p className="text-[10px] text-onSurfaceVariant">Immediate operational guidance.</p>
          </div>

          <div className="bg-surface-low border border-outlineVariant/20 rounded-xl p-3 h-[200px] overflow-y-auto flex flex-col gap-2.5">
            {chatMessages.map((m, i) => (
              <div key={i} className={`p-2.5 rounded-lg text-xs leading-relaxed max-w-[85%] ${
                m.sender.startsWith('You') 
                  ? 'bg-primary text-white ml-auto' 
                  : 'bg-surface border border-outlineVariant/20 mr-auto text-primary'
              }`}>
                <div className="text-[8px] opacity-70 uppercase font-bold mb-0.5">{m.sender}</div>
                <div>{m.text}</div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendChatMessage} className="flex gap-2">
            <input 
              type="text" 
              placeholder="Ask about revisits, GPS offsets..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-1 px-3 py-1.5 bg-surface border border-outlineVariant/50 rounded-lg text-xs outline-none focus:border-primary"
            />
            <button type="submit" className="bg-primary text-white hover:bg-primary-light px-3.5 py-1.5 rounded-lg flex items-center justify-center cursor-pointer">
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

      </section>

    </div>
  );
};

export default FieldVerificationManagement;
