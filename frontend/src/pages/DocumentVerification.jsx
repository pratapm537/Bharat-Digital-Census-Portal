import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, ClipboardCheck, AlertTriangle, Check, X, ShieldAlert, 
  Clock, Download, Eye, FileText, ExternalLink, Calendar, MapPin, 
  CheckCircle2, AlertCircle, Activity, ChevronRight, HelpCircle, 
  RefreshCw, BarChart2, Award, FileSpreadsheet, Lock, UserCheck, 
  Shield, ZoomIn, ZoomOut, RotateCw, Maximize2, Trash2, Edit2, 
  CheckCircle, Landmark, Upload
} from 'lucide-react';

// ==========================================
// MOCK DOCUMENT REGISTRY DATASET
// ==========================================
const MOCK_DOCUMENTS = [
  {
    docId: 'DOC-2026-09824',
    citizenName: 'Mohit Pratap Mehra',
    citizenId: 'CEN-2026-458796',
    appId: 'APP-2026-458796',
    docType: 'Aadhaar Card',
    submissionDate: '2026-06-15',
    assignedOfficer: 'Rahul Sharma',
    priority: 'High',
    status: 'Approved',
    aiScore: 99,
    confidenceScore: 98,
    faceMatchScore: 97,
    fraudRisk: 'Low',
    refNumber: '1234 5678 4587',
    ocrData: {
      name: 'Mohit Pratap Mehra',
      dob: '1994-04-12',
      gender: 'Male',
      docNumber: '1234 5678 4587',
      address: 'H-452, Sector 21, Dwarka, Central Delhi, Delhi - 110075',
      issueDate: '2018-05-10',
      expiryDate: 'N/A (Lifetime)'
    },
    citizenProfileData: {
      name: 'Mohit Pratap Mehra',
      dob: '1994-04-12',
      gender: 'Male',
      docNumber: '1234 5678 4587',
      address: 'H-452, Sector 21, Dwarka, Central Delhi, Delhi - 110075'
    },
    docPhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    livePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    docUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
    duplicateChecks: {
      aadhaar: 'No Duplicate Found',
      mobile: 'No Duplicate Found',
      family: 'No Duplicate Found',
      face: 'No Duplicate Found'
    },
    tamperingAlerts: [],
    history: [
      { date: '2026-06-15 10:15 AM', event: 'Document Uploaded', actor: 'Citizen Mohit Mehra' },
      { date: '2026-06-15 10:20 AM', event: 'AI OCR Processed', actor: 'AI Auditor Gateway' },
      { date: '2026-06-15 11:30 AM', event: 'Verification Completed', actor: 'Officer Rahul Sharma' }
    ],
    remarks: 'Document verified successfully. OCR data matched citizen profile. Bio matches.'
  },
  {
    docId: 'DOC-2026-04289',
    citizenName: 'Priya Rajan',
    citizenId: 'CEN-2026-124951',
    appId: 'APP-2026-124951',
    docType: 'Voter Identification',
    submissionDate: '2026-06-14',
    assignedOfficer: 'Anjali Desai',
    priority: 'Critical',
    status: 'Pending Review',
    aiScore: 75,
    confidenceScore: 72,
    faceMatchScore: 88,
    fraudRisk: 'High',
    refNumber: 'MH/12/099182',
    ocrData: {
      name: 'Priya Rajan',
      dob: '1989-09-05',
      gender: 'Female',
      docNumber: 'MH/12/099182',
      address: 'Plot 14, Hinjewadi Sector 2, Pune City, Maharashtra - 411057',
      issueDate: '2012-08-15',
      expiryDate: 'N/A'
    },
    citizenProfileData: {
      name: 'Priya Rajan',
      dob: '1989-09-05',
      gender: 'Female',
      docNumber: 'MH/12/099182',
      address: 'Block 4, Cuffe Parade, Colaba, Mumbai City, Maharashtra - 400005'
    },
    docPhoto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80',
    livePhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    docUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    duplicateChecks: {
      aadhaar: 'Duplicate bio matched with active Pune card',
      mobile: 'No Duplicate Found',
      family: 'No Duplicate Found',
      face: 'Face similarity triggers 85% overlap warning'
    },
    tamperingAlerts: [
      { id: 'TAMP-01', msg: 'Metadata issue: Issue date shows conflict with state series database.' }
    ],
    history: [
      { date: '2026-06-14 02:00 PM', event: 'Document Uploaded', actor: 'Citizen Priya Rajan' },
      { date: '2026-06-14 02:10 PM', event: 'AI OCR Processed', actor: 'AI Auditor Gateway' },
      { date: '2026-06-14 02:15 PM', event: 'Flagged & Escalate', actor: 'Anjali Desai (Due to Address Mismatch)' }
    ],
    remarks: 'AI extracted address does not match citizen registered address. Request supervisor manual verification check.'
  },
  {
    docId: 'DOC-2026-10492',
    citizenName: 'Deepak Chawla',
    citizenId: 'CEN-2026-302914',
    appId: 'APP-2026-302914',
    docType: 'Address Proof',
    submissionDate: '2026-06-12',
    assignedOfficer: 'Vikram Singh',
    priority: 'Low',
    status: 'Rejected',
    aiScore: 35,
    confidenceScore: 30,
    faceMatchScore: 0,
    fraudRisk: 'Critical',
    refNumber: 'STAMP-982415',
    ocrData: {
      name: 'Unreadable',
      dob: 'Unreadable',
      gender: 'Unreadable',
      docNumber: 'Unreadable',
      address: 'Unreadable (Contrast too low)',
      issueDate: 'Unreadable',
      expiryDate: 'Unreadable'
    },
    citizenProfileData: {
      name: 'Deepak Chawla',
      dob: '1985-11-30',
      gender: 'Male',
      docNumber: 'STAMP-982415',
      address: '128, Hawa Mahal Rd, Jaipur, Rajasthan - 302002'
    },
    docPhoto: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=150&q=80',
    livePhoto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80',
    docUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80',
    duplicateChecks: {
      aadhaar: 'No Duplicate Found',
      mobile: 'No Duplicate Found',
      family: 'No Duplicate Found',
      face: 'Not Applicable'
    },
    tamperingAlerts: [
      { id: 'TAMP-02', msg: 'Image Quality: High compression rates. Text pixels distorted.' }
    ],
    history: [
      { date: '2026-06-12 04:30 PM', event: 'Document Uploaded', actor: 'Citizen Deepak Chawla' },
      { date: '2026-06-12 04:40 PM', event: 'AI Reject Triggered', actor: 'AI Agent (Low confidence index)' },
      { date: '2026-06-12 04:50 PM', event: 'Rejection Finalized', actor: 'Officer Vikram Singh' }
    ],
    remarks: 'Document scan blurry. Extracted pixels failed baseline text checks. Requesting immediate re-upload.'
  },
  {
    docId: 'DOC-2026-00412',
    citizenName: 'Suresh Kumar Hegde',
    citizenId: 'CEN-2026-004128',
    appId: 'APP-2026-004128',
    docType: 'Passport',
    submissionDate: '2026-06-16',
    assignedOfficer: 'Priyanka Sen',
    priority: 'Medium',
    status: 'Approved',
    aiScore: 98,
    confidenceScore: 96,
    faceMatchScore: 95,
    fraudRisk: 'Low',
    refNumber: 'T9812490',
    ocrData: {
      name: 'Suresh Kumar Hegde',
      dob: '1972-07-20',
      gender: 'Male',
      docNumber: 'T9812490',
      address: '#24, 5th Main Rd, Indiranagar, Bengaluru, Karnataka - 560038',
      issueDate: '2021-04-12',
      expiryDate: '2031-04-11'
    },
    citizenProfileData: {
      name: 'Suresh Kumar Hegde',
      dob: '1972-07-20',
      gender: 'Male',
      docNumber: 'T9812490',
      address: '#24, 5th Main Rd, Indiranagar, Bengaluru, Karnataka - 560038'
    },
    docPhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    livePhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    docUrl: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=800&q=80',
    duplicateChecks: {
      aadhaar: 'No Duplicate Found',
      mobile: 'No Duplicate Found',
      family: 'No Duplicate Found',
      face: 'No Duplicate Found'
    },
    tamperingAlerts: [],
    history: [
      { date: '2026-06-16 11:00 AM', event: 'Document Uploaded', actor: 'Citizen Suresh Hegde' },
      { date: '2026-06-16 11:15 AM', event: 'AI Process Completed', actor: 'AI Agent' },
      { date: '2026-06-16 11:30 AM', event: 'Approved Final', actor: 'Priyanka Sen' }
    ],
    remarks: 'Passport bio-page verified. Perfect data congruence and facial geometry match.'
  },
  {
    docId: 'DOC-2026-89102',
    citizenName: 'Lakshmi Narayanan',
    citizenId: 'CEN-2026-891024',
    appId: 'APP-2026-891024',
    docType: 'Income Certificate',
    submissionDate: '2026-06-15',
    assignedOfficer: 'Rohit Verma',
    priority: 'High',
    status: 'Pending Review',
    aiScore: 89,
    confidenceScore: 87,
    faceMatchScore: 95,
    fraudRisk: 'Low',
    refNumber: 'INC-9821',
    ocrData: {
      name: 'Lakshmi Narayanan',
      dob: '1991-03-18',
      gender: 'Female',
      docNumber: 'INC-9821',
      address: '12, Adyar Canal Bank Rd, Chennai, Tamil Nadu - 600020',
      issueDate: '2025-10-10',
      expiryDate: '2026-10-09'
    },
    citizenProfileData: {
      name: 'Lakshmi Narayanan',
      dob: '1991-03-18',
      gender: 'Female',
      docNumber: 'INC-9821',
      address: '12, Adyar Canal Bank Rd, Chennai, Tamil Nadu - 600020'
    },
    docPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    livePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    docUrl: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?auto=format&fit=crop&w=800&q=80',
    duplicateChecks: {
      aadhaar: 'No Duplicate Found',
      mobile: 'No Duplicate Found',
      family: 'No Duplicate Found',
      face: 'No Duplicate Found'
    },
    tamperingAlerts: [],
    history: [
      { date: '2026-06-15 09:00 AM', event: 'Document Uploaded', actor: 'Citizen Lakshmi Narayanan' },
      { date: '2026-06-15 09:10 AM', event: 'AI OCR Extracted', actor: 'AI Agent' }
    ],
    remarks: 'AI extracted certificate successfully. Reviewing income bracket classification for benefits.'
  }
];

const DocumentVerification = () => {
  const navigate = useNavigate();

  // -------------------------------------------------------------
  // STATES CONTROLLERS
  // -------------------------------------------------------------
  const [documents, setDocuments] = useState(MOCK_DOCUMENTS);
  const [selectedDoc, setSelectedDoc] = useState(MOCK_DOCUMENTS[1]); // Priya Rajan default
  const [activeQueueTab, setActiveQueueTab] = useState('pending'); // 'pending', 'approved', 'rejected'

  // Document Viewer states
  const [zoomScale, setZoomScale] = useState(1);
  const [rotateDeg, setRotateDeg] = useState(0);
  const [fullscreenViewer, setFullscreenViewer] = useState(false);

  // Manual Review and OCR Overrides
  const [ocrForm, setOcrForm] = useState({
    name: '',
    dob: '',
    docNumber: '',
    address: ''
  });
  const [isEditingOcr, setIsEditingOcr] = useState(false);
  const [remarksInput, setRemarksInput] = useState('');
  const [officerNameInput, setOfficerNameInput] = useState('Anjali Desai');

  // Reports Generation center
  const [reportSelection, setReportSelection] = useState('Document Verification Report');
  const [reportStatus, setReportStatus] = useState(null); // 'compiling', 'done'

  // Feedback Notification trigger
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  // Auto clear feedback
  useEffect(() => {
    if (feedback.message) {
      const timer = setTimeout(() => setFeedback({ type: '', message: '' }), 4000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  // Load OCR values and remarks when document changes
  useEffect(() => {
    if (selectedDoc) {
      setOcrForm({
        name: selectedDoc.ocrData.name,
        dob: selectedDoc.ocrData.dob,
        docNumber: selectedDoc.ocrData.docNumber,
        address: selectedDoc.ocrData.address
      });
      setRemarksInput(selectedDoc.remarks || '');
      setOfficerNameInput(selectedDoc.assignedOfficer || 'Anjali Desai');
      // Reset zoom/rotate
      setZoomScale(1);
      setRotateDeg(0);
    }
  }, [selectedDoc]);

  // -------------------------------------------------------------
  // ACTIONS HANDLERS
  // -------------------------------------------------------------
  const handleVerifySubmit = (statusType) => {
    if (!selectedDoc) return;

    let targetStatus = 'Approved';
    let msgType = 'success';
    let alertMsg = '';

    if (statusType === 'approve') {
      targetStatus = 'Approved';
      alertMsg = `Document ${selectedDoc.docId} has been successfully approved!`;
    } else if (statusType === 'reject') {
      targetStatus = 'Rejected';
      alertMsg = `Document ${selectedDoc.docId} has been marked as Rejected.`;
    } else if (statusType === 'reverify') {
      targetStatus = 'Pending Review';
      alertMsg = 'Re-audit request successfully generated and sent to processing.';
    } else if (statusType === 'escalate') {
      targetStatus = 'Pending Review';
      alertMsg = 'Document case escalated to supervisor audit queue.';
    }

    const updatedDb = documents.map(d => {
      if (d.docId === selectedDoc.docId) {
        return {
          ...d,
          status: targetStatus,
          remarks: remarksInput,
          assignedOfficer: officerNameInput,
          ocrData: {
            ...d.ocrData,
            ...ocrForm
          },
          history: [
            { date: 'Just Now', event: `Action: ${targetStatus}`, actor: `Officer: ${officerNameInput}` },
            ...d.history
          ]
        };
      }
      return d;
    });

    setDocuments(updatedDb);
    setSelectedDoc(prev => ({
      ...prev,
      status: targetStatus,
      remarks: remarksInput,
      assignedOfficer: officerNameInput,
      ocrData: {
        ...prev.ocrData,
        ...ocrForm
      },
      history: [
        { date: 'Just Now', event: `Action: ${targetStatus}`, actor: `Officer: ${officerNameInput}` },
        ...prev.history
      ]
    }));

    setFeedback({ type: msgType, message: alertMsg });
  };

  const handleOcrSubmit = (e) => {
    e.preventDefault();
    if (!selectedDoc) return;

    setSelectedDoc(prev => ({
      ...prev,
      ocrData: {
        ...prev.ocrData,
        ...ocrForm
      }
    }));
    setIsEditingOcr(false);
    setFeedback({ type: 'success', message: 'OCR extracted values updated. Comparison logs updated.' });
  };

  const handleCompileReport = (name) => {
    setReportStatus('compiling');
    setTimeout(() => {
      setReportStatus('done');
      setFeedback({ type: 'success', message: `${name} successfully compiled and exported (PDF format).` });
      setTimeout(() => setReportStatus(null), 3000);
    }, 2000);
  };

  // -------------------------------------------------------------
  // DYNAMIC QUEUE FILTERING
  // -------------------------------------------------------------
  const pendingQueue = documents.filter(d => d.status === 'Pending Review');
  const approvedQueue = documents.filter(d => d.status === 'Approved');
  const rejectedQueue = documents.filter(d => d.status === 'Rejected');

  const getActiveQueue = () => {
    if (activeQueueTab === 'approved') return approvedQueue;
    if (activeQueueTab === 'rejected') return rejectedQueue;
    return pendingQueue;
  };

  // -------------------------------------------------------------
  // MISMATCH DETECTION LOGIC (OCR vs Profile)
  // -------------------------------------------------------------
  const checkMismatch = (field) => {
    if (!selectedDoc) return false;
    const ocrVal = ocrForm[field]?.toLowerCase().replace(/\s+/g, '');
    const profileVal = selectedDoc.citizenProfileData[field]?.toLowerCase().replace(/\s+/g, '');
    return ocrVal !== profileVal;
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
            <span className="bg-[#ff9933]/20 border border-[#ff9933]/30 text-[#ff9933] font-bold uppercase text-[9px] px-2.5 py-0.5 rounded-full tracking-wider">
              AI Verification Division
            </span>
            <span className="text-[10px] text-white/70 font-semibold">â€¢ Ministry of Home Affairs</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Document Verification Center</h2>
          <p className="text-xs text-white/80 max-w-xl leading-relaxed">
            Verify citizen documents, perform AI-powered validation, detect fraud, and manage verification workflows.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 relative z-10 shrink-0">
          <button 
            onClick={() => setFeedback({ type: 'success', message: 'Ready to import new citizen compliance scan document.' })}
            className="bg-secondary text-primary-dark font-bold text-xs px-4 py-2.5 rounded-full hover:bg-secondary/90 transition-all flex items-center gap-1.5 active:scale-95 shadow-sm cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" /> Upload Document
          </button>
          <button 
            onClick={() => handleVerifySubmit('approve')}
            className="bg-white/10 hover:bg-white/20 border border-white/25 text-white font-bold text-xs px-4 py-2.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" /> Verify Document
          </button>
          <button 
            onClick={() => handleCompileReport('AI Verification Performance Summary')}
            className="bg-white/10 hover:bg-white/20 border border-white/25 text-white font-bold text-xs px-4 py-2.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> Export Report
          </button>
          <button 
            onClick={() => navigate('/admin/search')}
            className="bg-white/10 hover:bg-white/20 border border-white/25 text-white font-bold text-xs px-4 py-2.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <ShieldAlert className="w-3.5 h-3.5" /> Open Fraud Center
          </button>
        </div>
      </section>

      {/* SECTION 2: DOCUMENT VERIFICATION OVERVIEW STATS */}
      <section className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {[
          { label: 'Documents Submitted', count: '5,200', status: 'Total uploads', icon: FileText, color: 'text-primary' },
          { label: 'Pending Verification', count: '450', status: 'Queue waiting', icon: Clock, color: 'text-amber-500' },
          { label: 'Approved Documents', count: '4,500', status: 'Compliance met', icon: ShieldCheck, color: 'text-success' },
          { label: 'Rejected Documents', count: '250', status: 'Blurs & errors', icon: X, color: 'text-red-500' },
          { label: 'Fraud Alerts Flagged', count: '12 Active', status: 'Duplications', icon: ShieldAlert, color: 'text-red-500' },
          { label: 'AI OCR Success Rate', count: '98.5%', status: 'Accuracy average', icon: Activity, color: 'text-sky-500' }
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

      {/* DUAL WORKSPACE SPLIT LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT PANEL: QUEUE, STATS, SUPPORT (7 COLS) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* SECTION 5: INTERACTIVE VERIFICATION QUEUE */}
          <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
            <h3 className="font-bold text-xs text-primary uppercase tracking-wider">Verification queue manager</h3>
            
            {/* Tab Navigators */}
            <div className="flex border-b border-outlineVariant/20 pb-1 text-xs">
              {[
                { id: 'pending', label: 'Pending Documents', count: pendingQueue.length, icon: Clock, color: 'text-amber-500' },
                { id: 'approved', label: 'Approved Documents', count: approvedQueue.length, icon: ShieldCheck, color: 'text-success' },
                { id: 'rejected', label: 'Rejected Documents', count: rejectedQueue.length, icon: X, color: 'text-red-500' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveQueueTab(tab.id)}
                  className={`flex-grow md:flex-initial px-4 py-2 font-bold flex items-center justify-center gap-1.5 border-b-2 cursor-pointer transition-colors ${
                    activeQueueTab === tab.id 
                      ? 'border-primary text-primary' 
                      : 'border-transparent text-onSurfaceVariant hover:text-primary'
                  }`}
                >
                  <tab.icon className={`w-4 h-4 ${tab.color}`} />
                  {tab.label}
                  <span className="bg-primary-container/20 text-primary text-[9px] px-2 py-0.2 rounded-full">
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Tabbed Queue Table */}
            <div className="overflow-x-auto mt-2">
              <table className="w-full text-left text-[11px] border-collapse">
                <thead>
                  <tr className="bg-surface-low border-b border-outlineVariant/30 text-onSurfaceVariant font-bold uppercase tracking-wider">
                    <th className="py-2.5 px-3">Citizen Name</th>
                    <th className="py-2.5 px-3">Document details</th>
                    <th className="py-2.5 px-3">Submission</th>
                    <th className="py-2.5 px-3 text-center">AI Score</th>
                    <th className="py-2.5 px-3 text-center">Priority</th>
                    <th className="py-2.5 px-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outlineVariant/20">
                  {getActiveQueue().map(doc => (
                    <tr 
                      key={doc.docId}
                      onClick={() => setSelectedDoc(doc)}
                      className={`hover:bg-primary-container/5 transition-colors cursor-pointer ${
                        selectedDoc?.docId === doc.docId ? 'bg-primary-container/10 border-l-4 border-l-primary' : ''
                      }`}
                    >
                      <td className="py-3 px-3 font-semibold text-primary">{doc.citizenName}</td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-primary">{doc.docType}</div>
                        <span className="text-[9px] text-onSurfaceVariant font-mono">ID: {doc.docId}</span>
                      </td>
                      <td className="py-3 px-3 text-onSurfaceVariant">{doc.submissionDate}</td>
                      <td className="py-3 px-3 text-center font-bold text-primary">{doc.aiScore}%</td>
                      <td className="py-3 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded font-bold uppercase text-[8px] ${
                          doc.priority === 'Critical' ? 'bg-red-600 text-white dark:bg-red-950/40 dark:text-red-300' :
                          doc.priority === 'High' ? 'bg-amber-500 text-white dark:bg-amber-950/40 dark:text-amber-300' :
                          'bg-slate-100 text-slate-700 dark:bg-slate-950/40 dark:text-slate-300'
                        }`}>
                          {doc.priority}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                        <button 
                          onClick={() => setSelectedDoc(doc)}
                          className="bg-primary/5 hover:bg-primary hover:text-white px-2 py-1 rounded text-[9px] font-bold"
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  ))}
                  {getActiveQueue().length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-onSurfaceVariant italic">No document files found in this queue.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* SECTION 6 & 7: MANUAL REVIEW CENTER & FRAUD DETECTION */}
          <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
            <h3 className="font-bold text-xs text-primary uppercase tracking-wider flex items-center gap-1.5 text-red-500">
              <ShieldAlert className="w-4 h-4" /> AI OCR Mismatch & Manual Review Workspace
            </h3>

            {selectedDoc && selectedDoc.status === 'Pending Review' ? (
              <div className="p-3.5 bg-red-50 dark:bg-red-950/10 border border-red-200 dark:border-red-900/40 rounded-lg flex flex-col gap-3 text-xs">
                <div className="flex gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-red-800 dark:text-red-300">Data Conflict Flagged</strong>: The AI OCR check detected a significant difference between the submitted document details and the profile details.
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px] bg-surface p-2.5 rounded border border-outlineVariant/20">
                  <div>
                    <span className="text-[8px] text-onSurfaceVariant uppercase">OCR Address Value</span>
                    <p className="font-semibold text-primary mt-0.5 leading-normal">{selectedDoc.ocrData.address}</p>
                  </div>
                  <div>
                    <span className="text-[8px] text-onSurfaceVariant uppercase">Profile Register Address</span>
                    <p className="font-semibold text-primary mt-0.5 leading-normal">{selectedDoc.citizenProfileData.address}</p>
                  </div>
                </div>

                <div className="flex justify-end gap-2 text-[10px] mt-1">
                  <button 
                    onClick={() => handleVerifySubmit('approve')}
                    className="bg-success text-white font-bold px-3 py-1.5 rounded-full hover:bg-success-dark cursor-pointer"
                  >
                    Force Approve Document
                  </button>
                  <button 
                    onClick={() => handleVerifySubmit('reject')}
                    className="bg-red-600 text-white font-bold px-3 py-1.5 rounded-full hover:bg-red-700 cursor-pointer"
                  >
                    Reject Document Scan
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-3.5 bg-green-50 dark:bg-green-950/10 border border-green-200 dark:border-green-900/40 rounded-lg flex items-center gap-2 text-xs text-green-800 dark:text-green-300">
                <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
                <div>
                  No manual reviews or severe OCR data conflicts currently flagged on this record.
                </div>
              </div>
            )}
          </div>

          {/* SECTION 10: DOCUMENT ANALYTICS */}
          <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
            <h3 className="font-bold text-xs text-primary uppercase tracking-wider flex items-center gap-1.5">
              <BarChart2 className="w-4 h-4" /> Operational Document Analytics
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              
              {/* Analytics metrics */}
              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <div className="bg-surface-low p-2.5 rounded border border-outlineVariant/20">
                  <span className="text-[8px] text-onSurfaceVariant uppercase">AI Process Success</span>
                  <div className="text-lg font-bold text-primary mt-0.5">98.5%</div>
                </div>
                <div className="bg-surface-low p-2.5 rounded border border-outlineVariant/20">
                  <span className="text-[8px] text-onSurfaceVariant uppercase">Rejection Rate</span>
                  <div className="text-lg font-bold text-red-600 mt-0.5">4.8%</div>
                </div>
                <div className="bg-surface-low p-2.5 rounded border border-outlineVariant/20">
                  <span className="text-[8px] text-onSurfaceVariant uppercase">Average OCR Speed</span>
                  <div className="text-lg font-bold text-primary mt-0.5">2.4 Seconds</div>
                </div>
                <div className="bg-surface-low p-2.5 rounded border border-outlineVariant/20">
                  <span className="text-[8px] text-onSurfaceVariant uppercase">Tampering Alert Flags</span>
                  <div className="text-lg font-bold text-amber-600 mt-0.5">1.2%</div>
                </div>
              </div>

              {/* Custom SVG Document Distribution Chart */}
              <div className="flex flex-col items-center gap-2">
                <span className="text-[9px] font-bold text-primary uppercase">Submitted Document Type Shares</span>
                <svg viewBox="0 0 160 160" className="w-28 h-28">
                  {/* Pie shares slices */}
                  <circle cx="80" cy="80" r="50" fill="transparent" stroke="#0b2447" strokeWidth="20" strokeDasharray="157 157" strokeDashoffset="0" />
                  <circle cx="80" cy="80" r="50" fill="transparent" stroke="#ff9933" strokeWidth="20" strokeDasharray="94 220" strokeDashoffset="-157" />
                  <circle cx="80" cy="80" r="50" fill="transparent" stroke="#138808" strokeWidth="20" strokeDasharray="63 251" strokeDashoffset="-251" />
                </svg>
                <div className="flex gap-3 text-[8px] font-semibold text-onSurfaceVariant">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 bg-primary rounded-full" /> Aadhaar (50%)</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 bg-secondary rounded-full" /> Voter ID (30%)</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 bg-success rounded-full" /> Other (20%)</span>
                </div>
              </div>

            </div>
          </div>

          {/* SECTION 14: HELP & FAQ SUPPORT */}
          <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-3">
            <h3 className="font-bold text-xs text-primary uppercase tracking-wider flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4" /> Help Center & Verification Guidelines
            </h3>
            
            <div className="space-y-2 text-xs">
              <details className="group border border-outlineVariant/20 rounded p-2.5 cursor-pointer">
                <summary className="font-bold text-primary flex justify-between items-center">
                  <span>How is biometric match percentage calculated?</span>
                  <ChevronRight className="w-3.5 h-3.5 group-open:rotate-90 transition-transform" />
                </summary>
                <p className="text-onSurfaceVariant mt-2 text-[11px] leading-relaxed">
                  The AI matches key nodal facial geometry between the submitted document photograph and the live verification photo. A score above 90% indicates a successful match.
                </p>
              </details>
              
              <details className="group border border-outlineVariant/20 rounded p-2.5 cursor-pointer">
                <summary className="font-bold text-primary flex justify-between items-center">
                  <span>What to do when OCR extraction fails?</span>
                  <ChevronRight className="w-3.5 h-3.5 group-open:rotate-90 transition-transform" />
                </summary>
                <p className="text-onSurfaceVariant mt-2 text-[11px] leading-relaxed">
                  Toggle on the manual review tools, edit the unextracted OCR fields manually based on visual inspection, and press 'Save Updates' before final approval.
                </p>
              </details>
            </div>
          </div>

        </div>

        {/* RIGHT PANEL: SELECTED DOCUMENT REVIEW WORKSPACE (5 COLS) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {selectedDoc ? (
            <div className="flex flex-col gap-6 animate-fade-in">
              
              {/* SECTION 3: AI VERIFICATION SCOREBOARD */}
              <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
                <div className="flex justify-between items-center border-b border-outlineVariant/20 pb-2.5">
                  <div>
                    <h3 className="font-extrabold text-sm text-primary uppercase">{selectedDoc.docType}</h3>
                    <span className="text-[10px] text-onSurfaceVariant font-mono">Ref: {selectedDoc.refNumber}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded font-extrabold uppercase text-[9px] ${
                    selectedDoc.status === 'Approved' ? 'bg-green-50 text-green-700' :
                    selectedDoc.status === 'Rejected' ? 'bg-red-50 text-red-700' :
                    'bg-amber-50 text-amber-700'
                  }`}>
                    {selectedDoc.status}
                  </span>
                </div>

                {/* Score meters grid */}
                <div className="grid grid-cols-3 gap-2.5 text-center text-xs">
                  <div className="p-2.5 bg-surface-low border border-outlineVariant/20 rounded-xl">
                    <span className="text-[8px] text-onSurfaceVariant uppercase">AI Score</span>
                    <div className="text-lg font-bold text-primary mt-1">{selectedDoc.aiScore}%</div>
                  </div>
                  <div className="p-2.5 bg-surface-low border border-outlineVariant/20 rounded-xl">
                    <span className="text-[8px] text-onSurfaceVariant uppercase">Confidence</span>
                    <div className="text-lg font-bold text-success mt-1">{selectedDoc.confidenceScore}%</div>
                  </div>
                  <div className="p-2.5 bg-surface-low border border-outlineVariant/20 rounded-xl">
                    <span className="text-[8px] text-onSurfaceVariant uppercase">Face Match</span>
                    <div className="text-lg font-bold text-primary mt-1">{selectedDoc.faceMatchScore}%</div>
                  </div>
                </div>

                {/* BIOMETRIC FACE COMPONENT */}
                <div className="p-3 bg-surface-low border border-outlineVariant/20 rounded-xl flex items-center justify-between gap-4 text-xs">
                  <div className="flex gap-2">
                    <div className="relative">
                      <img src={selectedDoc.docPhoto} alt="Document" className="w-12 h-12 rounded object-cover border" />
                      <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[7px] text-center">Doc Photo</span>
                    </div>
                    <div className="relative">
                      <img src={selectedDoc.livePhoto} alt="Live" className="w-12 h-12 rounded object-cover border" />
                      <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[7px] text-center">Live Photo</span>
                    </div>
                  </div>

                  <div className="flex-grow">
                    <div className="flex justify-between items-center text-[10px] mb-1">
                      <span className="font-bold text-primary">Biometric Similarity</span>
                      <strong className="text-primary">{selectedDoc.faceMatchScore}%</strong>
                    </div>
                    {/* Progress bar gauge */}
                    <div className="w-full bg-outlineVariant/30 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-primary h-full rounded-full" style={{ width: `${selectedDoc.faceMatchScore}%` }} />
                    </div>
                  </div>
                </div>

                {/* OCR FIELDS COMPARATIVE VALUES */}
                <div className="space-y-3.5 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-bold text-primary uppercase tracking-wider">OCR Extracted Data</span>
                    <button 
                      onClick={() => setIsEditingOcr(!isEditingOcr)}
                      className="text-[9px] text-primary font-bold hover:underline flex items-center gap-1"
                    >
                      <Edit2 className="w-3 h-3" /> Manual Override
                    </button>
                  </div>

                  {isEditingOcr ? (
                    <form onSubmit={handleOcrSubmit} className="space-y-3 text-xs bg-surface-low p-3 rounded-lg border border-outlineVariant/20">
                      <div className="flex flex-col gap-1">
                        <label className="text-[8px] font-bold text-primary uppercase">Name</label>
                        <input type="text" value={ocrForm.name} onChange={(e) => setOcrForm({ ...ocrForm, name: e.target.value })} className="px-2 py-1 bg-surface border rounded" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[8px] font-bold text-primary uppercase">DOB</label>
                        <input type="text" value={ocrForm.dob} onChange={(e) => setOcrForm({ ...ocrForm, dob: e.target.value })} className="px-2 py-1 bg-surface border rounded" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[8px] font-bold text-primary uppercase">Document Number</label>
                        <input type="text" value={ocrForm.docNumber} onChange={(e) => setOcrForm({ ...ocrForm, docNumber: e.target.value })} className="px-2 py-1 bg-surface border rounded font-mono" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[8px] font-bold text-primary uppercase">Address</label>
                        <input type="text" value={ocrForm.address} onChange={(e) => setOcrForm({ ...ocrForm, address: e.target.value })} className="px-2 py-1 bg-surface border rounded" />
                      </div>
                      <div className="flex gap-2">
                        <button type="submit" className="bg-primary text-white font-bold px-3 py-1.5 rounded-full text-[9px]">Save Updates</button>
                        <button type="button" onClick={() => setIsEditingOcr(false)} className="border px-3 py-1.5 rounded-full text-[9px]">Cancel</button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-2 text-xs">
                      {[
                        { key: 'name', label: 'Name extracted', icon: UserCheck },
                        { key: 'dob', label: 'Date of Birth', icon: Calendar },
                        { key: 'docNumber', label: 'Document Number', icon: Lock },
                        { key: 'address', label: 'Zonal Address', icon: MapPin }
                      ].map(field => {
                        const mismatch = checkMismatch(field.key);
                        return (
                          <div key={field.key} className={`p-2 rounded-lg border flex justify-between items-center ${
                            mismatch ? 'bg-red-50/50 border-red-200 text-red-700' : 'bg-surface-low border-outlineVariant/20'
                          }`}>
                            <div className="flex items-center gap-1.5">
                              <field.icon className="w-3.5 h-3.5" />
                              <div>
                                <span className="text-[8px] text-onSurfaceVariant uppercase">{field.label}</span>
                                <div className="font-semibold text-primary mt-0.5">{ocrForm[field.key]}</div>
                              </div>
                            </div>
                            {mismatch && (
                              <span className="bg-red-600 text-white px-1.5 py-0.2 rounded font-extrabold text-[8px] uppercase">
                                Mismatch
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* DUPLICATE RADAR GAUGE */}
                <div className="border-t border-outlineVariant/15 pt-3.5 text-xs">
                  <span className="text-[9px] font-bold text-primary uppercase tracking-wider block mb-2">Duplicate & Risk radar</span>
                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div className="p-2 bg-surface-low rounded border border-outlineVariant/20">
                      <span className="text-[8px] text-onSurfaceVariant uppercase">Aadhaar Check</span>
                      <div className="font-bold text-primary mt-0.5">{selectedDoc.duplicateChecks.aadhaar}</div>
                    </div>
                    <div className="p-2 bg-surface-low rounded border border-outlineVariant/20">
                      <span className="text-[8px] text-onSurfaceVariant uppercase">Facial Check</span>
                      <div className="font-bold text-primary mt-0.5">{selectedDoc.duplicateChecks.face}</div>
                    </div>
                  </div>
                </div>

              </div>

              {/* SECTION 4: INTERACTIVE DOCUMENT VIEWER */}
              <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-xs text-primary uppercase tracking-wider">Document Scan Preview</h3>
                  
                  {/* Viewer Controls */}
                  <div className="flex items-center gap-2 text-primary font-bold">
                    <button 
                      onClick={() => setZoomScale(prev => Math.min(prev + 0.2, 2))} 
                      className="p-1 border hover:bg-surface-low rounded" 
                      title="Zoom In"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setZoomScale(prev => Math.max(prev - 0.2, 0.6))} 
                      className="p-1 border hover:bg-surface-low rounded"
                      title="Zoom Out"
                    >
                      <ZoomOut className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setRotateDeg(prev => (prev + 90) % 360)} 
                      className="p-1 border hover:bg-surface-low rounded"
                      title="Rotate 90Â°"
                    >
                      <RotateCw className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setFullscreenViewer(!fullscreenViewer)} 
                      className="p-1 border hover:bg-surface-low rounded"
                      title="Toggle Fullscreen"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* PREVIEW FRAME */}
                <div className="relative h-56 rounded-xl border border-outlineVariant/30 overflow-hidden bg-slate-950/5 flex items-center justify-center">
                  <img 
                    src={selectedDoc.docUrl} 
                    alt="Document Scan Preview" 
                    className="object-contain max-h-full transition-transform duration-200" 
                    style={{ 
                      transform: `scale(${zoomScale}) rotate(${rotateDeg}deg)` 
                    }} 
                  />
                  <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[9px] px-2 py-0.5 rounded">
                    Scale: {Math.round(zoomScale * 100)}%
                  </div>
                </div>
              </div>

              {/* SECTION 9: OFFICER REMARKS */}
              <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
                <h3 className="font-bold text-xs text-primary uppercase tracking-wider">Officer Verification Decision</h3>
                
                <div className="space-y-3.5 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-primary uppercase text-[8px]">Reviewing Officer</label>
                      <input 
                        type="text" 
                        value={officerNameInput}
                        onChange={(e) => setOfficerNameInput(e.target.value)}
                        className="px-2.5 py-1.5 bg-surface border border-outlineVariant rounded outline-none text-xs focus:border-primary"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-primary uppercase text-[8px]">Audit Date</label>
                      <input 
                        type="date" 
                        value={selectedDoc.submissionDate} 
                        disabled 
                        className="px-2.5 py-1.5 bg-surface-low border border-outlineVariant rounded outline-none text-xs text-onSurfaceVariant"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-primary uppercase text-[8px]">Officer Decision Remarks</label>
                    <textarea 
                      rows={2}
                      value={remarksInput}
                      onChange={(e) => setRemarksInput(e.target.value)}
                      placeholder="Add compliance notes..."
                      className="px-2.5 py-1.5 bg-surface border border-outlineVariant rounded outline-none text-xs focus:border-primary"
                    />
                  </div>

                  {/* Actions Grid */}
                  <div className="grid grid-cols-2 gap-2 border-t border-outlineVariant/15 pt-3">
                    <button 
                      onClick={() => handleVerifySubmit('approve')}
                      className="py-2 bg-success text-white font-bold rounded-full hover:bg-success-dark transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" /> Approve Document
                    </button>
                    <button 
                      onClick={() => handleVerifySubmit('reject')}
                      className="py-2 bg-red-50 text-red-600 border border-red-200 font-bold rounded-full hover:bg-red-100 transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" /> Reject Document
                    </button>
                    <button 
                      onClick={() => handleVerifySubmit('reverify')}
                      className="py-2 bg-amber-50 text-amber-700 border border-amber-200 font-bold rounded-full hover:bg-amber-100 transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" /> Re-audit Document
                    </button>
                    <button 
                      onClick={() => handleVerifySubmit('escalate')}
                      className="py-2 bg-red-600 text-white font-bold rounded-full hover:bg-red-700 transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <ShieldAlert className="w-3.5 h-3.5" /> Escalate Case
                    </button>
                  </div>
                </div>
              </div>

              {/* SECTION 12: REPORTS GENERATOR */}
              <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
                <h3 className="font-bold text-xs text-primary uppercase tracking-wider">Reports compiler</h3>
                
                <div className="text-xs flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-primary uppercase text-[8px]">Select Report Theme</label>
                    <select 
                      value={reportSelection} 
                      onChange={(e) => setReportSelection(e.target.value)}
                      className="px-2.5 py-1.5 bg-surface border border-outlineVariant rounded outline-none"
                    >
                      <option value="Document Verification Report">Document Verification Report</option>
                      <option value="Fraud Detection Report">Fraud Detection Report</option>
                      <option value="Rejected Documents Report">Rejected Documents Report</option>
                      <option value="Officer Verification Report">Officer Verification Report</option>
                      <option value="AI Performance Report">AI Performance Report</option>
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

              {/* SECTION 8: DOCUMENT TIMELINE AUDIT HISTORY */}
              <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
                <h3 className="font-bold text-xs text-primary uppercase tracking-wider">Document History & Audit logs</h3>
                
                <div className="relative border-l border-outlineVariant/40 pl-4 ml-2 space-y-4 text-xs">
                  {selectedDoc.history?.map((act, index) => (
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
              Please select a document from the queue to start AI OCR review.
            </div>
          )}

        </div>

      </div>

      {/* FLOAT SIDEBAR QUICK ACTIONS (SECTION 13) */}
      <div className="fixed bottom-6 left-6 z-40 bg-surface border border-outlineVariant/40 shadow-xl rounded-full p-1.5 flex flex-col gap-1.5">
        <button 
          onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className="p-2 hover:bg-primary/10 text-primary rounded-full transition-colors cursor-pointer"
          title="Upload Document"
        >
          <Upload className="w-4.5 h-4.5" />
        </button>
        <button 
          onClick={() => { setActiveQueueTab('pending'); }}
          className="p-2 hover:bg-primary/10 text-primary rounded-full transition-colors cursor-pointer"
          title="Review Pending Queue"
        >
          <Clock className="w-4.5 h-4.5" />
        </button>
        <button 
          onClick={() => handleCompileReport('Floating verification summary')}
          className="p-2 hover:bg-primary/10 text-primary rounded-full transition-colors cursor-pointer"
          title="Generate Verification Report"
        >
          <FileText className="w-4.5 h-4.5" />
        </button>
      </div>

      {/* FULLSCREEN PREVIEW VIEWER COMPONENT */}
      {fullscreenViewer && selectedDoc && (
        <div className="fixed inset-0 bg-black z-55 flex flex-col text-white text-xs">
          <div className="p-4 border-b border-white/20 flex justify-between items-center bg-black/80 backdrop-blur-xs">
            <span className="font-bold uppercase text-sm">Full Image Frame: {selectedDoc.docType}</span>
            <button 
              onClick={() => setFullscreenViewer(false)}
              className="text-white hover:text-secondary font-bold text-xs flex items-center gap-1 cursor-pointer"
            >
              <X className="w-5 h-5" /> Exit Frame
            </button>
          </div>
          <div className="flex-grow flex items-center justify-center p-6 bg-black/95 overflow-hidden">
            <img src={selectedDoc.docUrl} alt="Fullscreen Preview" className="max-w-full max-h-[85vh] object-contain" />
          </div>
        </div>
      )}

    </div>
  );
};

export default DocumentVerification;








