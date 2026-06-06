import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldAlert, AlertTriangle, Check, X, Shield, Lock, Eye, Download, 
  FileText, Activity, Users, UserCheck, RefreshCw, ZoomIn, ZoomOut, 
  MapPin, Clock, ArrowRight, ShieldCheck, ChevronRight, HelpCircle, 
  Maximize2, Plus, Edit2, Play, CheckCircle2, AlertCircle, BarChart2, 
  FileSpreadsheet, Send, TrendingUp, Compass, Network, Landmark
} from 'lucide-react';

// ==========================================
// MOCK FRAUD INTELLIGENCE DATASET
// ==========================================
const MOCK_FRAUD_CASES = [
  {
    caseId: 'FRD-2026-458796',
    citizenName: 'Mohit Pratap Mehra',
    citizenId: 'CEN-2026-458796',
    appId: 'APP-2026-458796',
    assignedOfficer: 'Rahul Sharma',
    status: 'Under Investigation',
    riskScore: 78,
    riskCategory: 'High',
    fraudProbability: 76,
    verificationConfidence: 45,
    indicators: ['Biometric Ping Conflict', 'Duplicate Address Coordinates'],
    duplicateDetails: {
      aadhaar: 'XXXX XXXX 4587 (Linked to 3 other sub-cards)',
      mobile: '+91 98765 43210 (Linked to 4 separate families)',
      family: 'FAM-2026-90812 (Possible overlap with FAM-2026-458796)'
    },
    suspiciousActivities: {
      registrations: 3,
      locations: 'Delhi, Haryana',
      fakeDocScore: 12, // Low
      docTampering: 'None detected',
      identityConflicts: 'Aakash Mehra (Brother) biometric ping matched with active Ward 12 profile.'
    },
    networkNodes: [
      { id: 'Mohit Pratap Mehra', type: 'citizen', group: 1 },
      { id: 'FAM-2026-90812', type: 'family', group: 2 },
      { id: 'Sector 21 Dwarka', type: 'address', group: 3 },
      { id: '9876543210', type: 'phone', group: 4 },
      { id: 'Aakash Mehra (Duplicate)', type: 'conflict', group: 5 }
    ],
    auditHistory: [
      { date: '2026-06-03 02:30 PM', event: 'Case Registered', actor: 'Biometrics Security Gate' },
      { date: '2026-06-05 10:45 AM', event: 'Risk Score Updated (78)', actor: 'AI Risk Engine' },
      { date: '2026-06-06 11:30 AM', event: 'Investigator Assigned', actor: 'Rahul Sharma' }
    ],
    remarksLog: [
      { date: '2026-06-06 11:45 AM', author: 'Rahul Sharma', text: 'Checked Dwarka Sector 21 coordinates. Visual match requested for the third family member.' }
    ]
  },
  {
    caseId: 'FRD-2026-124951',
    citizenName: 'Priya Rajan',
    citizenId: 'CEN-2026-124951',
    appId: 'APP-2026-124951',
    assignedOfficer: 'Anjali Desai',
    status: 'Flagged',
    riskScore: 85,
    riskCategory: 'High',
    fraudProbability: 84,
    verificationConfidence: 30,
    indicators: ['Address Mismatch', 'Voter List Overlap'],
    duplicateDetails: {
      aadhaar: 'XXXX XXXX 1249 (Biometric overlap in Pune Central)',
      mobile: '+91 91234 56780 (Unique)',
      family: 'FAM-2026-10492 (No duplicate household)'
    },
    suspiciousActivities: {
      registrations: 1,
      locations: 'Mumbai City, Pune Central',
      fakeDocScore: 65, // Medium
      docTampering: 'Metadata mismatch: Voter card series conflicts with state records.',
      identityConflicts: 'Profile address is Colaba Cuffe Parade, but Voter ID shows Hinjewadi Pune address.'
    },
    networkNodes: [
      { id: 'Priya Rajan', type: 'citizen', group: 1 },
      { id: 'FAM-2026-10492', type: 'family', group: 2 },
      { id: 'Colaba Cuffe Parade', type: 'address', group: 3 },
      { id: 'Pune Central Overlap', type: 'conflict', group: 5 }
    ],
    auditHistory: [
      { date: '2026-06-05 11:00 AM', event: 'Registry Flagged', actor: 'Voter ID OCR Check' },
      { date: '2026-06-05 11:20 AM', event: 'Escalation to High Risk', actor: 'AI System Gate' }
    ],
    remarksLog: [
      { date: '2026-06-05 11:30 AM', author: 'System', text: 'Address coordinates mismatch exceeds baseline boundary.' }
    ]
  },
  {
    caseId: 'FRD-2026-302914',
    citizenName: 'Deepak Chawla',
    citizenId: 'CEN-2026-302914',
    appId: 'APP-2026-302914',
    assignedOfficer: 'Vikram Singh',
    status: 'Investigation Required',
    riskScore: 92,
    riskCategory: 'Critical',
    fraudProbability: 94,
    verificationConfidence: 15,
    indicators: ['Fake Document Upload', 'Address Unreachable'],
    duplicateDetails: {
      aadhaar: 'XXXX XXXX 3029 (Unique)',
      mobile: '+91 88776 65544 (Linked to 4 other profiles)',
      family: 'FAM-2026-44910 (Shared mobile with 4 other family cards)'
    },
    suspiciousActivities: {
      registrations: 1,
      locations: 'Jaipur, Rajasthan',
      fakeDocScore: 89, // High
      docTampering: 'Image manipulation: Contrast stamp modified. Font inconsistency in address proof scan.',
      identityConflicts: 'Address Proof stamp scan is completely unreadable. Fake stamp suspicion.'
    },
    networkNodes: [
      { id: 'Deepak Chawla', type: 'citizen', group: 1 },
      { id: 'FAM-2026-44910', type: 'family', group: 2 },
      { id: 'Hawa Mahal Jaipur', type: 'address', group: 3 },
      { id: '8877665544', type: 'phone', group: 4 },
      { id: 'Fake Document Alert', type: 'conflict', group: 5 }
    ],
    auditHistory: [
      { date: '2026-06-02 02:00 PM', event: 'Case Registered', actor: 'Image OCR Agent' },
      { date: '2026-06-03 04:50 PM', event: 'Risk Score Set to 92', actor: 'AI Fraud Radar' }
    ],
    remarksLog: [
      { date: '2026-06-04 09:00 AM', author: 'Vikram Singh', text: 'Door locked on multiple visits. Document verified as forged.' }
    ]
  },
  {
    caseId: 'FRD-2026-891024',
    citizenName: 'Lakshmi Narayanan',
    citizenId: 'CEN-2026-891024',
    appId: 'APP-2026-891024',
    assignedOfficer: 'Rohit Verma',
    status: 'Resolved',
    riskScore: 24,
    riskCategory: 'Low',
    fraudProbability: 18,
    verificationConfidence: 94,
    indicators: ['Shared Mobile Number'],
    duplicateDetails: {
      aadhaar: 'XXXX XXXX 8910 (Unique)',
      mobile: '+91 77665 54433 (Shared with husband Ramanathan)',
      family: 'FAM-2026-33921 (Clean record)'
    },
    suspiciousActivities: {
      registrations: 1,
      locations: 'Chennai, Tamil Nadu',
      fakeDocScore: 2, // Safe
      docTampering: 'None',
      identityConflicts: 'None. Mobile number sharing is legitimate.'
    },
    networkNodes: [
      { id: 'Lakshmi Narayanan', type: 'citizen', group: 1 },
      { id: 'FAM-2026-33921', type: 'family', group: 2 },
      { id: 'Ramanathan S.', type: 'citizen', group: 1 },
      { id: '7766554433', type: 'phone', group: 4 }
    ],
    auditHistory: [
      { date: '2026-06-08 10:30 AM', event: 'Case Logged', actor: 'System' },
      { date: '2026-06-15 09:30 AM', event: 'Resolved False Positive', actor: 'Rohit Verma' }
    ],
    remarksLog: [
      { date: '2026-06-15 09:35 AM', author: 'Rohit Verma', text: 'Confirmed marriage records and shared device ownership. Marked clean.' }
    ]
  }
];

// Active Alert Feeds
const INITIAL_ALERTS = [
  { id: 'ALT-101', type: 'Duplicate Aadhaar', desc: 'Aadhaar XXXX XXXX 4587 registered in multiple zones.', priority: 'Critical', time: '5 Mins Ago' },
  { id: 'ALT-102', type: 'Fake Document Upload', desc: 'Deepak Chawla address stamp failed font baseline validation.', priority: 'High', time: '1 Hour Ago' },
  { id: 'ALT-103', type: 'Address Conflict', desc: 'Priya Rajan profile address deviates from Voter ID registry location.', priority: 'Medium', time: '2 Hours Ago' },
  { id: 'ALT-104', type: 'Multiple Registrations', desc: 'Mohit Pratap Mehra linked to registrations in Delhi and Haryana.', priority: 'High', time: '3 Hours Ago' }
];

const STATES_LIST = ['Delhi', 'Maharashtra', 'Karnataka', 'Rajasthan', 'Tamil Nadu', 'Uttar Pradesh'];
const STATE_FRAUD_DENSITY = {
  'Delhi': 'High (Red)',
  'Uttar Pradesh': 'High (Red)',
  'Maharashtra': 'Moderate (Yellow)',
  'Rajasthan': 'Moderate (Yellow)',
  'Karnataka': 'Low (Green)',
  'Tamil Nadu': 'Low (Green)'
};

const FraudDetection = () => {
  const navigate = useNavigate();

  // -------------------------------------------------------------
  // STATE VARIABLE BINDINGS
  // -------------------------------------------------------------
  const [fraudCases, setFraudCases] = useState(MOCK_FRAUD_CASES);
  const [selectedCase, setSelectedCase] = useState(MOCK_FRAUD_CASES[0]);
  const [activeAlerts, setActiveAlerts] = useState(INITIAL_ALERTS);

  // Duplicate Tab selector
  const [duplicateTab, setDuplicateTab] = useState('aadhaar'); // 'aadhaar', 'mobile', 'family'

  // Network Visualizer Scale
  const [networkScale, setNetworkScale] = useState(1);

  // Remarks Form states
  const [remarksInput, setRemarksInput] = useState('');
  const [officerNameInput, setOfficerNameInput] = useState('Rahul Sharma');

  // Reports Center Selection
  const [reportSelection, setReportSelection] = useState('Fraud Detection Report');
  const [reportState, setReportState] = useState(null); // 'compiling', 'done'

  // Feedback Toast
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  // Auto clear feedback
  useEffect(() => {
    if (feedback.message) {
      const timer = setTimeout(() => setFeedback({ type: '', message: '' }), 4000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  // Load remarks and officer inputs when selected case changes
  useEffect(() => {
    if (selectedCase) {
      setRemarksInput('');
      setOfficerNameInput(selectedCase.assignedOfficer || 'Rahul Sharma');
    }
  }, [selectedCase]);

  // -------------------------------------------------------------
  // OPERATIONS ACTIONS
  // -------------------------------------------------------------
  const handleUpdateStatus = (newStatus) => {
    if (!selectedCase) return;

    const alertMsg = `Case ${selectedCase.caseId} status successfully set to "${newStatus}".`;
    
    // Add remarks if present
    const updatedRemarks = [...selectedCase.remarksLog];
    if (remarksInput.trim()) {
      updatedRemarks.push({
        date: 'Just Now',
        author: officerNameInput,
        text: remarksInput
      });
    }

    // Add audit history
    const updatedHistory = [
      { date: 'Just Now', event: `Status Set: ${newStatus}`, actor: officerNameInput },
      ...selectedCase.auditHistory
    ];

    const updatedCases = fraudCases.map(c => {
      if (c.caseId === selectedCase.caseId) {
        return {
          ...c,
          status: newStatus,
          assignedOfficer: officerNameInput,
          remarksLog: updatedRemarks,
          auditHistory: updatedHistory
        };
      }
      return c;
    });

    setFraudCases(updatedCases);
    setSelectedCase(prev => ({
      ...prev,
      status: newStatus,
      assignedOfficer: officerNameInput,
      remarksLog: updatedRemarks,
      auditHistory: updatedHistory
    }));

    setRemarksInput('');
    setFeedback({ type: 'success', message: alertMsg });
  };

  const handleLaunchInvestigation = () => {
    if (!selectedCase) return;
    handleUpdateStatus('Under Investigation');
    setFeedback({ type: 'success', message: `Forensic investigation successfully launched for case ${selectedCase.caseId}.` });
  };

  const handleMarkFalsePositive = () => {
    if (!selectedCase) return;
    
    // Set Risk Score to 0
    const updatedCases = fraudCases.map(c => {
      if (c.caseId === selectedCase.caseId) {
        return {
          ...c,
          status: 'Resolved',
          riskScore: 0,
          riskCategory: 'Low',
          auditHistory: [
            { date: 'Just Now', event: 'Marked False Positive', actor: officerNameInput },
            ...c.auditHistory
          ]
        };
      }
      return c;
    });

    setFraudCases(updatedCases);
    setSelectedCase(prev => ({
      ...prev,
      status: 'Resolved',
      riskScore: 0,
      riskCategory: 'Low',
      auditHistory: [
        { date: 'Just Now', event: 'Marked False Positive', actor: officerNameInput },
        ...prev.auditHistory
      ]
    }));

    setFeedback({ type: 'success', message: `Case ${selectedCase.caseId} marked as Safe (False Positive).` });
  };

  const handleCompileReport = (name) => {
    setReportState('compiling');
    setTimeout(() => {
      setReportState('done');
      setFeedback({ type: 'success', message: `${name} successfully compiled and exported (PDF Format).` });
      setTimeout(() => setReportState(null), 3000);
    }, 2000);
  };

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
          {feedback.type === 'success' && <CheckCircle2 className="w-5 h-5 shrink-0 text-success" />}
          {feedback.type === 'warning' && <AlertTriangle className="w-5 h-5 shrink-0 text-amber-500" />}
          {feedback.type === 'error' && <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* SECTION 1: PAGE HEADER */}
      <section className="relative overflow-hidden rounded-xl border border-outlineVariant/50 bg-primary p-6 text-white shadow-ambient flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex flex-col gap-2 relative z-10">
          <div className="flex items-center gap-2">
            <span className="bg-[#ff9933]/20 border border-[#ff9933]/30 text-[#ff9933] font-bold uppercase text-[9px] px-2.5 py-0.5 rounded-full tracking-wider animate-pulse">
              National Security Center
            </span>
            <span className="text-[10px] text-white/70 font-semibold">â€¢ Ministry of Home Affairs</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Fraud Detection Center</h2>
          <p className="text-xs text-white/80 max-w-xl leading-relaxed">
            Detect duplicate records, investigate suspicious activities, monitor fraud risks, and protect the integrity of census data.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 relative z-10 shrink-0">
          <button 
            onClick={handleLaunchInvestigation}
            className="bg-secondary text-primary-dark font-bold text-xs px-4 py-2.5 rounded-full hover:bg-secondary/90 transition-all flex items-center gap-1.5 active:scale-95 shadow-sm cursor-pointer"
          >
            <Shield className="w-3.5 h-3.5" /> Launch Investigation
          </button>
          <button 
            onClick={() => handleCompileReport(reportSelection)}
            className="bg-white/10 hover:bg-white/20 border border-white/25 text-white font-bold text-xs px-4 py-2.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> Export Fraud Report
          </button>
          <button 
            onClick={() => { window.scrollTo({ top: 350, behavior: 'smooth' }); }}
            className="bg-white/10 hover:bg-white/20 border border-white/25 text-white font-bold text-xs px-4 py-2.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5" /> Open Risk Dashboard
          </button>
          <button 
            onClick={() => { window.scrollTo({ top: 800, behavior: 'smooth' }); }}
            className="bg-white/10 hover:bg-white/20 border border-white/25 text-white font-bold text-xs px-4 py-2.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <ShieldAlert className="w-3.5 h-3.5" /> View Active Alerts
          </button>
        </div>
      </section>

      {/* SECTION 2: FRAUD OVERVIEW DASHBOARD STATS */}
      <section className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {[
          { label: 'Total Fraud Alerts', count: '1,250', status: 'Accumulated logs', icon: ShieldAlert, color: 'text-red-500' },
          { label: 'Active Investigations', count: '320', status: 'Under active audit', icon: Clock, color: 'text-amber-500' },
          { label: 'Duplicates Detected', count: '145 Record', status: 'Aadhaar & mobile', icon: Users, color: 'text-primary' },
          { label: 'Identity Conflicts', count: '58 File', status: 'Data mismatch', icon: AlertTriangle, color: 'text-red-500' },
          { label: 'High Risk Cases', count: '48 Lead', status: 'Investigate queue', icon: Shield, color: 'text-red-600' },
          { label: 'Resolved Cases', count: '920 Case', status: 'Audit cleared', icon: ShieldCheck, color: 'text-success' }
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-surface p-4 rounded-xl border border-outlineVariant/50 shadow-sm flex flex-col gap-1.5 hover:border-primary/50 transition-colors">
              <span className="text-[10px] font-bold text-onSurfaceVariant uppercase tracking-wider">{stat.label}</span>
              <div className="text-xl font-bold text-primary flex items-end justify-between">
                <span>{stat.count}</span>
                <Icon className={`w-4 h-4 ${stat.color} opacity-80`} />
              </div>
              <p className="text-[9px] text-onSurfaceVariant">{stat.status}</p>
            </div>
          );
        })}
      </section>

      {/* DYNAMIC TWO COLUMN INVESTIGATIVE WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: DETECTION ENGINES, GEOGRAPHICS, TRENDS (7 COLS) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* SECTION 3: DUPLICATE DETECTION ENGINES */}
          <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-outlineVariant/15 pb-2.5">
              <h3 className="font-bold text-xs text-primary uppercase tracking-wider">Duplicate records detection engine</h3>
              <span className="text-[9px] text-onSurfaceVariant font-semibold">Real-time system cross-checks</span>
            </div>

            {/* Inner Queue Tabs */}
            <div className="flex border-b border-outlineVariant/20 pb-1 text-xs">
              {[
                { id: 'aadhaar', label: 'Duplicate Aadhaar', icon: Landmark, color: 'text-primary' },
                { id: 'mobile', label: 'Duplicate Mobile', icon: Activity, color: 'text-amber-500' },
                { id: 'family', label: 'Duplicate Family', icon: Users, color: 'text-success' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setDuplicateTab(tab.id)}
                  className={`flex-grow md:flex-initial px-4 py-2 font-bold flex items-center justify-center gap-1.5 border-b-2 cursor-pointer transition-colors ${
                    duplicateTab === tab.id 
                      ? 'border-primary text-primary' 
                      : 'border-transparent text-onSurfaceVariant hover:text-primary'
                  }`}
                >
                  <tab.icon className={`w-4 h-4 ${tab.color}`} />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Duplicate content views */}
            <div className="mt-2 text-xs">
              {duplicateTab === 'aadhaar' && (
                <div className="space-y-3">
                  {fraudCases.filter(c => c.duplicateDetails.aadhaar.includes('XXXX')).map(c => (
                    <div key={c.caseId} className="p-3 bg-surface-low border border-outlineVariant/20 rounded-lg flex items-center justify-between gap-4">
                      <div>
                        <div className="font-bold text-primary font-mono">{c.duplicateDetails.aadhaar.split(' ')[0]} {c.duplicateDetails.aadhaar.split(' ')[1]} {c.duplicateDetails.aadhaar.split(' ')[2]}</div>
                        <span className="text-[10px] text-onSurfaceVariant">Linked Profile: <strong className="text-primary">{c.citizenName}</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded text-[8px] font-extrabold uppercase">{c.riskCategory} Risk</span>
                        <button 
                          onClick={() => setSelectedCase(c)}
                          className="bg-primary text-white font-bold px-3 py-1 rounded text-[9px] cursor-pointer hover:bg-primary-light"
                        >
                          Investigate
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {duplicateTab === 'mobile' && (
                <div className="space-y-3">
                  {fraudCases.map(c => (
                    <div key={c.caseId} className="p-3 bg-surface-low border border-outlineVariant/20 rounded-lg flex items-center justify-between gap-4">
                      <div>
                        <div className="font-bold text-primary font-mono">{c.duplicateDetails.mobile}</div>
                        <span className="text-[10px] text-onSurfaceVariant">Linked card: <strong className="text-primary">{c.citizenName}</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded text-[8px] font-extrabold uppercase">Medium Risk</span>
                        <button 
                          onClick={() => setSelectedCase(c)}
                          className="bg-primary text-white font-bold px-3 py-1 rounded text-[9px] cursor-pointer hover:bg-primary-light"
                        >
                          Investigate
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {duplicateTab === 'family' && (
                <div className="space-y-3">
                  {fraudCases.filter(c => c.duplicateDetails.family.includes('FAM')).map(c => (
                    <div key={c.caseId} className="p-3 bg-surface-low border border-outlineVariant/20 rounded-lg flex items-center justify-between gap-4">
                      <div>
                        <div className="font-bold text-primary font-mono">{c.duplicateDetails.family}</div>
                        <span className="text-[10px] text-onSurfaceVariant">Head: <strong className="text-primary">{c.citizenName}</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded text-[8px] font-extrabold uppercase">High Risk</span>
                        <button 
                          onClick={() => setSelectedCase(c)}
                          className="bg-primary text-white font-bold px-3 py-1 rounded text-[9px] cursor-pointer hover:bg-primary-light"
                        >
                          Investigate
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* SECTION 4: SUSPICIOUS ACTIVITIES VIEW */}
          <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
            <h3 className="font-bold text-xs text-primary uppercase tracking-wider">Suspicious activity alarms</h3>

            {selectedCase ? (
              <div className="space-y-4 text-xs">
                
                {/* Multiple registrations */}
                <div className="p-3 bg-surface-low border border-outlineVariant/20 rounded-lg">
                  <span className="text-[9px] text-onSurfaceVariant uppercase font-bold">Multiple Registrations check</span>
                  <div className="flex justify-between items-center mt-1.5">
                    <div>
                      <div className="font-semibold text-primary">{selectedCase.citizenName} has {selectedCase.suspiciousActivities.registrations} registries</div>
                      <span className="text-[10px] text-onSurfaceVariant">State jurisdictions: {selectedCase.suspiciousActivities.locations}</span>
                    </div>
                    <span className="bg-red-600 text-white px-2 py-0.5 rounded font-bold text-[9px] uppercase">
                      {selectedCase.riskCategory} Flag
                    </span>
                  </div>
                </div>

                {/* Forgery check */}
                <div className="p-3 bg-surface-low border border-outlineVariant/20 rounded-lg">
                  <span className="text-[9px] text-onSurfaceVariant uppercase font-bold">Fake document & manipulation analytics</span>
                  <div className="flex justify-between items-center mt-1.5">
                    <div>
                      <div className="font-semibold text-primary">AI Forgery Probability: {selectedCase.suspiciousActivities.fakeDocScore}%</div>
                      <span className="text-[10px] text-onSurfaceVariant">Details: {selectedCase.suspiciousActivities.docTampering}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded font-bold text-[9px] uppercase ${
                      selectedCase.suspiciousActivities.fakeDocScore > 70 ? 'bg-red-600 text-white' : 'bg-slate-600 text-white'
                    }`}>
                      {selectedCase.suspiciousActivities.fakeDocScore > 70 ? 'Flagged' : 'Passed'}
                    </span>
                  </div>
                  {/* AI checks lists */}
                  <div className="grid grid-cols-4 gap-2 mt-3 pt-2.5 border-t border-outlineVariant/10 text-[9px] font-semibold text-onSurfaceVariant">
                    <div>Image manipulation: <strong className="text-primary">Clean</strong></div>
                    <div>Font check: <strong className="text-primary">Matched</strong></div>
                    <div>Tampering check: <strong className="text-primary">Safe</strong></div>
                    <div>Metadata check: <strong className="text-primary">Audited</strong></div>
                  </div>
                </div>

                {/* Identity conflict comparator */}
                <div className="p-3 bg-surface-low border border-outlineVariant/20 rounded-lg flex flex-col gap-2">
                  <span className="text-[9px] text-onSurfaceVariant uppercase font-bold">Identity conflict validator</span>
                  <p className="font-medium text-red-700 dark:text-red-300 leading-normal bg-red-50 dark:bg-red-950/20 p-2 rounded">
                    {selectedCase.suspiciousActivities.identityConflicts}
                  </p>
                </div>

              </div>
            ) : (
              <div className="p-10 text-center text-onSurfaceVariant italic text-xs">
                Select a fraud case from the queue to view suspicious indicators.
              </div>
            )}
          </div>

          {/* SECTION 8: GEOGRAPHIC FRAUD HEATMAP */}
          <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
            <h3 className="font-bold text-xs text-primary uppercase tracking-wider flex items-center gap-1.5">
              <Compass className="w-4 h-4" /> Regional Fraud Hotspots Heatmap
            </h3>

            {/* Map Contours */}
            <div className="relative h-56 rounded-xl border border-outlineVariant/30 overflow-hidden bg-slate-900/10 flex items-center justify-center">
              <svg viewBox="0 0 400 200" className="w-full h-full object-cover">
                <rect width="400" height="200" fill="#f7f9fb" />
                {/* Hotspot contours */}
                {/* Delhi */}
                <circle cx="100" cy="80" r="30" fill="#ef4444" opacity="0.35" className="animate-pulse" />
                <circle cx="100" cy="80" r="12" fill="#ef4444" opacity="0.8" />
                {/* Maharashtra */}
                <circle cx="180" cy="120" r="45" fill="#f59e0b" opacity="0.25" />
                <circle cx="180" cy="120" r="16" fill="#f59e0b" opacity="0.8" />
                {/* Karnataka */}
                <circle cx="280" cy="140" r="20" fill="#10b981" opacity="0.3" />
                <circle cx="280" cy="140" r="8" fill="#10b981" opacity="0.8" />
                
                {/* Labels */}
                <text x="100" y="60" fontSize="9" fontWeight="bold" fill="#ef4444" textAnchor="middle">Delhi (Critical)</text>
                <text x="180" y="95" fontSize="9" fontWeight="bold" fill="#f59e0b" textAnchor="middle">Mumbai (Medium)</text>
                <text x="280" y="125" fontSize="9" fontWeight="bold" fill="#10b981" textAnchor="middle">Bengaluru (Low)</text>
              </svg>
              
              {/* Heatmap Legend */}
              <div className="absolute top-2 right-2 bg-surface/90 border border-outlineVariant/50 p-2.5 rounded shadow-sm text-[8px] font-bold flex flex-col gap-1.5 text-onSurfaceVariant">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-[#ef4444] rounded-full" /> High Density (&gt;50 Cases)</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-[#f59e0b] rounded-full" /> Moderate Density (20-50)</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-[#10b981] rounded-full" /> Low Density (&lt;20 Cases)</span>
              </div>
            </div>
          </div>

          {/* SECTION 10: FRAUD TREND ANALYTICS */}
          <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
            <h3 className="font-bold text-xs text-primary uppercase tracking-wider flex items-center gap-1.5">
              <BarChart2 className="w-4 h-4" /> Fraud Analytics Trends Dashboard
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              
              <div className="space-y-3.5 text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-outlineVariant/10">
                  <span className="text-onSurfaceVariant">Resolution Success rate:</span>
                  <strong className="text-success font-extrabold">94.2%</strong>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-outlineVariant/10">
                  <span className="text-onSurfaceVariant">Duplicate Detection Trend:</span>
                  <strong className="text-red-600 font-extrabold flex items-center gap-1"><TrendingUp className="w-3.5 h-3.5" /> +2.4% (MoM)</strong>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-outlineVariant/10">
                  <span className="text-onSurfaceVariant">AI Fraud Flag Accuracy:</span>
                  <strong className="text-primary font-extrabold">98.9%</strong>
                </div>
              </div>

              {/* Custom SVG Trend Line chart */}
              <div className="flex flex-col items-center gap-2">
                <span className="text-[8px] font-bold text-primary uppercase">Weekly Fraud Alerts Trigger Timeline</span>
                <svg viewBox="0 0 160 80" className="w-full h-20">
                  {/* Grid background lines */}
                  <line x1="0" y1="20" x2="160" y2="20" stroke="#eceef0" strokeWidth="0.5" />
                  <line x1="0" y1="40" x2="160" y2="40" stroke="#eceef0" strokeWidth="0.5" />
                  <line x1="0" y1="60" x2="160" y2="60" stroke="#eceef0" strokeWidth="0.5" />
                  {/* Trend Path */}
                  <path d="M 0 70 L 30 50 L 60 60 L 90 20 L 120 40 L 160 10" fill="none" stroke="#ef4444" strokeWidth="2.5" />
                  {/* Scatter circle markers */}
                  <circle cx="30" cy="50" r="3" fill="#ef4444" />
                  <circle cx="90" cy="20" r="3" fill="#ef4444" />
                  <circle cx="160" cy="10" r="3" fill="#ef4444" />
                </svg>
                <div className="flex justify-between w-full text-[8px] font-semibold text-onSurfaceVariant px-1 mt-1">
                  <span>Week 1</span>
                  <span>Week 2</span>
                  <span>Week 3</span>
                  <span>Week 4</span>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: RISK ENGINES, INVESTIGATION WORKSPACE, RELATIONSHIP NETWORK (5 COLS) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {selectedCase ? (
            <div className="flex flex-col gap-6 animate-fade-in">
              
              {/* SECTION 5: RISK SCORING Speedometer SPEEDOMETER GAUGE */}
              <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
                <div className="flex justify-between items-center border-b border-outlineVariant/20 pb-2.5">
                  <div>
                    <h3 className="font-extrabold text-xs text-primary uppercase">AI Risk Calculator Index</h3>
                    <span className="text-[9px] text-onSurfaceVariant font-mono">Index ref: CEN-{selectedCase.caseId.split('-')[2]}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded font-extrabold uppercase text-[8px] ${
                    selectedCase.riskCategory === 'Critical' ? 'bg-red-700 text-red-800' :
                    selectedCase.riskCategory === 'High' ? 'bg-red-50 text-red-700' :
                    'bg-amber-50 text-amber-700'
                  }`}>
                    {selectedCase.riskCategory} Risk
                  </span>
                </div>

                <div className="flex items-center gap-6">
                  
                  {/* Custom Speedometer Gauge */}
                  <div className="relative w-28 h-16 flex items-end justify-center overflow-hidden">
                    <svg viewBox="0 0 100 50" className="w-full h-full">
                      {/* Arc backgrounds */}
                      <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#e0e3e5" strokeWidth="10" />
                      {/* Colored Active Arc based on risk score */}
                      <path 
                        d="M 10 50 A 40 40 0 0 1 90 50" 
                        fill="none" 
                        stroke={selectedCase.riskScore > 80 ? '#ef4444' : '#f59e0b'} 
                        strokeWidth="10" 
                        strokeDasharray="125"
                        strokeDashoffset={125 - (125 * selectedCase.riskScore / 100)}
                      />
                    </svg>
                    {/* Gauge needle indicator */}
                    <div 
                      className="absolute bottom-0 w-1.5 h-12 bg-primary origin-bottom transition-transform duration-500 rounded-t"
                      style={{ 
                        transform: `rotate(${(selectedCase.riskScore * 1.8) - 90}deg)` 
                      }} 
                    />
                  </div>

                  <div className="flex-grow text-xs space-y-1">
                    <div>AI Risk Index: <strong className="text-primary text-base font-extrabold">{selectedCase.riskScore} / 100</strong></div>
                    <p className="text-onSurfaceVariant">Probability of fraud: <strong>{selectedCase.fraudProbability}%</strong></p>
                    <p className="text-onSurfaceVariant">Verification Confidence: <strong>{selectedCase.verificationConfidence}%</strong></p>
                  </div>

                </div>

                <div className="flex justify-end gap-2 text-[10px] mt-1.5 border-t border-outlineVariant/10 pt-2.5">
                  <button 
                    onClick={handleLaunchInvestigation}
                    className="bg-primary text-white font-bold px-3 py-1.5 rounded-full hover:bg-primary-light cursor-pointer"
                  >
                    Freeze Record File
                  </button>
                  <button 
                    onClick={handleMarkFalsePositive}
                    className="border border-outlineVariant hover:bg-surface-low px-3 py-1.5 rounded-full font-bold cursor-pointer"
                  >
                    Mark False Positive
                  </button>
                </div>
              </div>

              {/* SECTION 6: FRAUD INVESTIGATION WORKSPACE */}
              <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
                <h3 className="font-bold text-xs text-primary uppercase tracking-wider">Active forensic Investigation</h3>
                
                <div className="space-y-3.5 text-xs">
                  <div className="p-3 bg-surface-low border border-outlineVariant/20 rounded-lg grid grid-cols-2 gap-2 text-[10px]">
                    <div>
                      <span className="text-[8px] text-onSurfaceVariant uppercase">Case ID Ref</span>
                      <div className="font-bold text-primary font-mono">{selectedCase.caseId}</div>
                    </div>
                    <div>
                      <span className="text-[8px] text-onSurfaceVariant uppercase">Assigned Investigator</span>
                      <div className="font-bold text-primary">{officerNameInput}</div>
                    </div>
                    <div>
                      <span className="text-[8px] text-onSurfaceVariant uppercase">Audit Status</span>
                      <span className="bg-primary-container/20 text-primary px-2 py-0.5 rounded font-extrabold uppercase text-[7px] block w-max mt-0.5">
                        {selectedCase.status}
                      </span>
                    </div>
                    <div>
                      <span className="text-[8px] text-onSurfaceVariant uppercase">Citizen Target</span>
                      <div className="font-bold text-primary">{selectedCase.citizenName}</div>
                    </div>
                  </div>

                  {/* Add remarks forms */}
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-primary uppercase text-[8px]">Add Investigation remarks log</label>
                    <textarea 
                      rows={2}
                      value={remarksInput}
                      onChange={(e) => setRemarksInput(e.target.value)}
                      placeholder="Add investigation updates logs..."
                      className="px-2.5 py-1.5 bg-surface border border-outlineVariant rounded outline-none text-xs focus:border-primary"
                    />
                  </div>

                  {/* Remarks update submission */}
                  <div className="grid grid-cols-3 gap-2 border-t border-outlineVariant/15 pt-3">
                    <button 
                      onClick={() => handleUpdateStatus('Under Investigation')}
                      className="py-1.5 bg-primary text-white font-bold rounded-full hover:bg-primary-light transition-all flex items-center justify-center gap-1 cursor-pointer text-[10px]"
                    >
                      <Check className="w-3.5 h-3.5" /> Save Remarks
                    </button>
                    <button 
                      onClick={() => handleUpdateStatus('Escalated')}
                      className="py-1.5 bg-red-600 text-white font-bold rounded-full hover:bg-red-700 transition-all flex items-center justify-center gap-1 cursor-pointer text-[10px]"
                    >
                      <ShieldAlert className="w-3.5 h-3.5" /> Escalate Case
                    </button>
                    <button 
                      onClick={() => handleUpdateStatus('Resolved')}
                      className="py-1.5 bg-success text-white font-bold rounded-full hover:bg-success-dark transition-all flex items-center justify-center gap-1 cursor-pointer text-[10px]"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" /> Close Case
                    </button>
                  </div>
                </div>
              </div>

              {/* SECTION 7: INTERACTIVE FRAUD RELATION NETWORK GRAPH */}
              <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-xs text-primary uppercase tracking-wider flex items-center gap-1.5">
                    <Network className="w-4 h-4 text-primary" /> Forensic Relationship network mapping
                  </h3>
                  
                  {/* Network controls */}
                  <div className="flex items-center gap-2 text-primary font-bold">
                    <button onClick={() => setNetworkScale(prev => Math.min(prev + 0.2, 1.8))} className="p-1 border hover:bg-surface-low rounded" title="Zoom In"><ZoomIn className="w-3.5 h-3.5" /></button>
                    <button onClick={() => setNetworkScale(prev => Math.max(prev - 0.2, 0.6))} className="p-1 border hover:bg-surface-low rounded" title="Zoom Out"><ZoomOut className="w-3.5 h-3.5" /></button>
                    <button onClick={() => setFeedback({ type: 'success', message: 'Relationship nodes map expanded.' })} className="p-1 border hover:bg-surface-low rounded" title="Maximize"><Maximize2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>

                {/* RELATIONS SVG CANVAS */}
                <div className="relative h-44 rounded-xl border border-outlineVariant/30 overflow-hidden bg-slate-950/5 flex items-center justify-center">
                  <svg viewBox="0 0 300 150" className="w-full h-full" style={{ transform: `scale(${networkScale})`, transition: 'transform 0.15s ease' }}>
                    {/* Node link lines */}
                    <line x1="150" y1="75" x2="80" y2="40" stroke="#c4c6cf" strokeWidth="1.5" />
                    <line x1="150" y1="75" x2="220" y2="40" stroke="#c4c6cf" strokeWidth="1.5" />
                    <line x1="150" y1="75" x2="80" y2="110" stroke="#c4c6cf" strokeWidth="1.5" />
                    <line x1="150" y1="75" x2="220" y2="110" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3" />
                    
                    {/* Node points */}
                    {/* Citizen Center Node */}
                    <g transform="translate(150, 75)" className="cursor-pointer" onClick={() => setFeedback({ type: 'success', message: 'Selected Target Node.' })}>
                      <circle cx="0" cy="0" r="10" fill="#0b2447" />
                      <text x="0" y="2" fill="#ffffff" fontSize="6" fontWeight="bold" textAnchor="middle">Target</text>
                    </g>
                    {/* Family Node */}
                    <g transform="translate(80, 40)">
                      <circle cx="0" cy="0" r="8" fill="#138808" />
                      <text x="0" y="2" fill="#ffffff" fontSize="5" fontWeight="bold" textAnchor="middle">Family</text>
                    </g>
                    {/* Address Node */}
                    <g transform="translate(220, 40)">
                      <circle cx="0" cy="0" r="8" fill="#ff9933" />
                      <text x="0" y="2" fill="#ffffff" fontSize="5" fontWeight="bold" textAnchor="middle">Address</text>
                    </g>
                    {/* Phone Node */}
                    <g transform="translate(80, 110)">
                      <circle cx="0" cy="0" r="8" fill="#a855f7" />
                      <text x="0" y="2" fill="#ffffff" fontSize="5" fontWeight="bold" textAnchor="middle">Phone</text>
                    </g>
                    {/* Conflict Node */}
                    <g transform="translate(220, 110)">
                      <circle cx="0" cy="0" r="9" fill="#ef4444" />
                      <text x="0" y="2" fill="#ffffff" fontSize="5" fontWeight="bold" textAnchor="middle">Conflict</text>
                    </g>
                  </svg>
                  <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[7px] px-1.5 py-0.5 rounded">
                    Active case: {selectedCase.citizenName}
                  </div>
                </div>
              </div>

              {/* SECTION 9: REAL-TIME ACTIVE ALERT ALARMS CENTER */}
              <div id="alerts-center" className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
                <h3 className="font-bold text-xs text-primary uppercase tracking-wider flex items-center gap-1.5 text-red-500">
                  <ShieldAlert className="w-4 h-4" /> Live Fraud Alert Feed
                </h3>

                <div className="space-y-2.5 max-h-40 overflow-y-auto pr-1">
                  {activeAlerts.map(alert => (
                    <div key={alert.id} className="p-2.5 bg-surface-low border border-outlineVariant/20 rounded-lg flex items-start justify-between gap-3 text-[10px]">
                      <div className="flex gap-2">
                        <AlertTriangle className="w-4.5 h-4.5 text-red-600 shrink-0 mt-0.5" />
                        <div>
                          <div className="font-bold text-primary">{alert.type}</div>
                          <p className="text-onSurfaceVariant mt-0.5">{alert.desc}</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="bg-red-50 text-red-700 px-1.5 py-0.2 rounded font-extrabold text-[8px] uppercase tracking-wider block">
                          {alert.priority}
                        </span>
                        <span className="text-[8px] text-onSurfaceVariant mt-1 block">{alert.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 12: COMPILATIONS REPORTS CENTER */}
              <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
                <h3 className="font-bold text-xs text-primary uppercase tracking-wider">Reports center</h3>
                
                <div className="text-xs flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-primary uppercase text-[8px]">Select Report Theme</label>
                    <select 
                      value={reportSelection} 
                      onChange={(e) => setReportSelection(e.target.value)}
                      className="px-2.5 py-1.5 bg-surface border border-outlineVariant rounded outline-none"
                    >
                      <option value="Fraud Detection Report">Fraud Detection Report</option>
                      <option value="Duplicate Records Report">Duplicate Records Report</option>
                      <option value="Identity Conflict Report">Identity Conflict Report</option>
                      <option value="Risk Analysis Report">Risk Analysis Report</option>
                      <option value="Investigation Report">Investigation Report</option>
                    </select>
                  </div>
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleCompileReport(reportSelection)}
                      className="flex-1 bg-primary text-white font-bold py-2 rounded-full hover:bg-primary-light transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" /> Download Report
                    </button>
                    <button 
                      onClick={() => setFeedback({ type: 'success', message: `${reportSelection} generated as Excel spreadsheet.` })}
                      className="flex-grow py-2 border border-outlineVariant hover:bg-surface-low font-bold rounded-full flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5" /> Export Excel
                    </button>
                  </div>
                </div>
              </div>

              {/* SECTION 11: AUDIT LOGS TIMELINE */}
              <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
                <h3 className="font-bold text-xs text-primary uppercase tracking-wider">Audit logs Timeline</h3>
                
                <div className="relative border-l border-outlineVariant/40 pl-4 ml-2 space-y-4 text-xs">
                  {selectedCase.auditHistory?.map((act, index) => (
                    <div key={index} className="relative">
                      <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-primary border-2 border-surface" />
                      <div className="text-[9px] text-onSurfaceVariant font-semibold">{act.date}</div>
                      <div className="font-bold text-primary mt-0.5">{act.event}</div>
                      <p className="text-onSurfaceVariant text-[10px] mt-0.5">Actor: {act.actor}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-surface border border-outlineVariant/50 rounded-xl p-10 shadow-sm text-center text-onSurfaceVariant italic text-xs">
              Please select a case from the queue to start risk analytics audits.
            </div>
          )}

        </div>

      </div>

      {/* FLOAT SIDEBAR QUICK ACTIONS (SECTION 13) */}
      <div className="fixed bottom-6 left-6 z-40 bg-surface border border-outlineVariant/40 shadow-xl rounded-full p-1.5 flex flex-col gap-1.5">
        <button 
          onClick={() => { window.scrollTo({ top: 800, behavior: 'smooth' }); }}
          className="p-2 hover:bg-primary/10 text-primary rounded-full transition-colors cursor-pointer"
          title="View Fraud Alerts"
        >
          <ShieldAlert className="w-4.5 h-4.5 text-red-500" />
        </button>
        <button 
          onClick={handleLaunchInvestigation}
          className="p-2 hover:bg-primary/10 text-primary rounded-full transition-colors cursor-pointer"
          title="Open Investigation"
        >
          <ShieldCheck className="w-4.5 h-4.5" />
        </button>
        <button 
          onClick={() => handleCompileReport('Quick Floating Fraud Summary')}
          className="p-2 hover:bg-primary/10 text-primary rounded-full transition-colors cursor-pointer"
          title="Generate Fraud Report"
        >
          <FileText className="w-4.5 h-4.5" />
        </button>
      </div>

    </div>
  );
};

export default FraudDetection;








