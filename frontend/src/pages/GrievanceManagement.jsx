import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldAlert, AlertTriangle, Check, X, Shield, Lock, Eye, Download, 
  FileText, Activity, Users, UserCheck, RefreshCw, ZoomIn, ZoomOut, 
  MapPin, Clock, ArrowRight, ShieldCheck, ChevronRight, HelpCircle, 
  Maximize2, Plus, Edit2, Play, CheckCircle2, AlertCircle, BarChart2, 
  FileSpreadsheet, Send, TrendingUp, Compass, Network, Landmark,
  MessageSquare, Star, Info, ChevronDown, Trash2, ShieldX, CheckSquare
} from 'lucide-react';

// ==========================================
// MOCK GRIEVANCE DATASET
// ==========================================
const INITIAL_GRIEVANCES = [
  {
    id: 'GRV-2026-458796',
    citizenName: 'Mohit Pratap Mehra',
    category: 'Verification Issue',
    submissionDate: '2026-06-03',
    priority: 'High',
    area: 'Delhi Zone 4',
    status: 'New',
    assignedOfficer: 'Unassigned',
    description: 'Field officer has not visited my premises for physical verification of address, though my portal status shows visited twice. Need immediate redressal.',
    timeline: [
      { event: 'Grievance Submitted', date: '2026-06-03 10:15 AM', notes: 'Complaint initiated by citizen Mohit Pratap Mehra.' }
    ],
    messages: [
      { sender: 'Citizen', text: 'Please resolve this at the earliest. My verification status is blocking my certificate generation.', time: '2026-06-03 10:15 AM' }
    ],
    auditLogs: [
      { action: 'Grievance Created', timestamp: '2026-06-03 10:15 AM', user: 'Mohit Pratap Mehra' }
    ],
    slaDaysTarget: 5,
    slaDaysElapsed: 3,
    slaStatus: 'Within SLA',
    evidence: [],
    investigationNotes: ''
  },
  {
    id: 'GRV-2026-104928',
    citizenName: 'Sunita Sharma',
    category: 'Registration Issue',
    submissionDate: '2026-06-01',
    priority: 'Medium',
    area: 'Mumbai West',
    status: 'In Progress',
    assignedOfficer: 'Rahul Sharma',
    description: 'Unable to save the final step of the Census Wizard. It keeps showing code 500 error on the sub-member database submission screen.',
    timeline: [
      { event: 'Grievance Submitted', date: '2026-06-01 09:00 AM', notes: 'Complaint initiated by Sunita Sharma.' },
      { event: 'Officer Assigned', date: '2026-06-01 02:00 PM', notes: 'Assigned to Rahul Sharma by System Router.' },
      { event: 'Investigation Started', date: '2026-06-02 11:30 AM', notes: 'Database logs examined for user Sunita Sharma.' }
    ],
    messages: [
      { sender: 'Citizen', text: 'I tried 5 times from separate browsers. The error remains.', time: '2026-06-01 09:00 AM' },
      { sender: 'Officer', text: 'We are checking with our database admins. Please wait.', time: '2026-06-02 11:45 AM' }
    ],
    auditLogs: [
      { action: 'Grievance Created', timestamp: '2026-06-01 09:00 AM', user: 'Sunita Sharma' },
      { action: 'Assigned Officer', timestamp: '2026-06-01 02:00 PM', user: 'System' },
      { action: 'Status Updated to In Progress', timestamp: '2026-06-02 11:30 AM', user: 'Rahul Sharma' }
    ],
    slaDaysTarget: 5,
    slaDaysElapsed: 5,
    slaStatus: 'Within SLA',
    evidence: [{ name: 'wizard_error_500.png', size: '240 KB' }],
    investigationNotes: 'Suspect sub-member database indexing failure for Mumbai zone. Contacted DBA.'
  },
  {
    id: 'GRV-2026-890214',
    citizenName: 'Rajesh Kovind',
    category: 'Document Issue',
    submissionDate: '2026-05-28',
    priority: 'High',
    area: 'Pune Central',
    status: 'Resolved',
    assignedOfficer: 'Anjali Desai',
    description: 'Aadhaar document was rejected saying scan is blurry, but the uploaded scan is 300 DPI and crystal clear. Request review.',
    timeline: [
      { event: 'Grievance Submitted', date: '2026-05-28 04:30 PM', notes: 'Grievance logged.' },
      { event: 'Officer Assigned', date: '2026-05-29 10:00 AM', notes: 'Assigned to Anjali Desai.' },
      { event: 'Evidence Reviewed', date: '2026-05-29 02:15 PM', notes: 'Aadhaar document manually inspected and validated.' },
      { event: 'Resolution Proposed', date: '2026-05-30 11:00 AM', notes: 'Approved document override.' },
      { event: 'Grievance Closed', date: '2026-05-30 04:00 PM', notes: 'Citizen confirmed resolution.' }
    ],
    messages: [
      { sender: 'Citizen', text: 'Please check the uploaded PDF file.', time: '2026-05-28 04:30 PM' },
      { sender: 'Officer', text: 'Manual verification completed. Document is approved.', time: '2026-05-29 02:15 PM' }
    ],
    auditLogs: [
      { action: 'Grievance Created', timestamp: '2026-05-28 04:30 PM', user: 'Rajesh Kovind' },
      { action: 'Assigned Officer', timestamp: '2026-05-29 10:00 AM', user: 'System' },
      { action: 'Resolved', timestamp: '2026-05-30 04:00 PM', user: 'Anjali Desai' }
    ],
    slaDaysTarget: 5,
    slaDaysElapsed: 2,
    slaStatus: 'Within SLA',
    evidence: [{ name: 'aadhaar_scan_clean.pdf', size: '1.2 MB' }],
    investigationNotes: 'Resolved by triggering manual override approval.',
    resolutionSummary: 'Aadhaar document scanned cleanly, OCR failed due to background pattern. Manual override triggered and census card cleared.',
    resolutionDate: '2026-05-30 04:00 PM',
    citizenRating: 5,
    citizenFeedback: 'Very prompt response, manual override saved my application. Excellent service.'
  },
  {
    id: 'GRV-2026-902415',
    citizenName: 'Abhishek Kumar',
    category: 'Officer Misconduct',
    submissionDate: '2026-05-20',
    priority: 'Critical',
    area: 'Patna North',
    status: 'Escalated',
    assignedOfficer: 'Vikram Singh',
    description: 'Field officer visited for verification and demanded illegal facilitation fees. When refused, he threatened to report us as absent.',
    timeline: [
      { event: 'Grievance Submitted', date: '2026-05-20 11:00 AM', notes: 'Grievance logged.' },
      { event: 'Officer Assigned', date: '2026-05-20 01:00 PM', notes: 'Assigned to Vikram Singh.' },
      { event: 'Escalated to Supervisor', date: '2026-05-25 09:00 AM', notes: 'Escalated because no action taken within SLA threshold.' }
    ],
    messages: [
      { sender: 'Citizen', text: 'I have audio recording of the incident.', time: '2026-05-20 11:00 AM' },
      { sender: 'Officer', text: 'Please upload the recording to this ticket for analysis.', time: '2026-05-22 03:00 PM' }
    ],
    auditLogs: [
      { action: 'Grievance Created', timestamp: '2026-05-20 11:00 AM', user: 'Abhishek Kumar' },
      { action: 'Assigned Officer', timestamp: '2026-05-20 01:00 PM', user: 'System' },
      { action: 'Escalated', timestamp: '2026-05-25 09:00 AM', user: 'System SLA Router' }
    ],
    slaDaysTarget: 5,
    slaDaysElapsed: 17,
    slaStatus: 'Overdue',
    escalationReason: 'No Resolution Within SLA & Misconduct Allegation',
    assignedSupervisor: 'Regional Director (Patna)',
    escalationLevel: 'Level 2 (Directorate)',
    evidence: [{ name: 'incident_audio.mp3', size: '4.5 MB' }],
    investigationNotes: 'Sensitive misconduct investigation launched. Audio file forwarded to administrative vigilance team.'
  }
];

const INITIAL_OFFICERS = [
  { name: 'Rahul Sharma', designation: 'Verification Officer', openCases: 15, availability: 'Available', rating: 4.8 },
  { name: 'Anjali Desai', designation: 'Grievance Specialist', openCases: 8, availability: 'Available', rating: 4.9 },
  { name: 'Vikram Singh', designation: 'Vigilance Supervisor', openCases: 22, availability: 'Busy', rating: 4.6 },
  { name: 'Rohit Verma', designation: 'IT Support Officer', openCases: 12, availability: 'Available', rating: 4.7 }
];

const CATEGORIES_DATA = {
  'Registration Issue': { open: 45, resolved: 320, avgTime: '2.1 Days', color: 'text-primary' },
  'Verification Issue': { open: 82, resolved: 410, avgTime: '4.2 Days', color: 'text-amber-500' },
  'Document Issue': { open: 18, resolved: 280, avgTime: '1.8 Days', color: 'text-success' },
  'Officer Misconduct': { open: 12, resolved: 45, avgTime: '7.5 Days', color: 'text-red-500' }
};

const GrievanceManagement = () => {
  const navigate = useNavigate();

  // -------------------------------------------------------------
  // STATE VARIABLE BINDINGS
  // -------------------------------------------------------------
  const [grievances, setGrievances] = useState(INITIAL_GRIEVANCES);
  const [selectedGrievance, setSelectedGrievance] = useState(INITIAL_GRIEVANCES[0]);
  const [officers, setOfficers] = useState(INITIAL_OFFICERS);
  
  // Tabs for the main queue
  const [activeQueue, setActiveQueue] = useState('New'); // 'New', 'In Progress', 'Resolved', 'Escalated'

  // Modal displays
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);

  // Form states
  const [createForm, setCreateForm] = useState({
    citizenName: '',
    category: 'Verification Issue',
    priority: 'High',
    area: '',
    description: ''
  });

  const [chatInput, setChatInput] = useState('');
  const [remarksInput, setRemarksInput] = useState('');
  const [assigneeSelect, setAssigneeSelect] = useState('Rahul Sharma');
  
  // Reports Compilation
  const [reportSelection, setReportSelection] = useState('Complaint Summary Report');
  const [reportState, setReportState] = useState(null); // 'compiling', 'done'

  // Toast notifications
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  // Auto clear feedback
  useEffect(() => {
    if (feedback.message) {
      const timer = setTimeout(() => setFeedback({ type: '', message: '' }), 4000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  // Sync details inputs when active complaint changes
  useEffect(() => {
    if (selectedGrievance) {
      setRemarksInput(selectedGrievance.investigationNotes || '');
    }
  }, [selectedGrievance]);

  // -------------------------------------------------------------
  // OPERATIONS ACTIONS
  // -------------------------------------------------------------
  const handleSelectComplaint = (grv) => {
    setSelectedGrievance(grv);
  };

  const handleCreateComplaint = (e) => {
    e.preventDefault();
    if (!createForm.citizenName || !createForm.area || !createForm.description) {
      setFeedback({ type: 'error', message: 'Please fill in all required fields.' });
      return;
    }

    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const newId = `GRV-2026-${randomSuffix}`;
    const timestamp = new Date().toLocaleString();

    const newGrv = {
      id: newId,
      citizenName: createForm.citizenName,
      category: createForm.category,
      submissionDate: new Date().toISOString().split('T')[0],
      priority: createForm.priority,
      area: createForm.area,
      status: 'New',
      assignedOfficer: 'Unassigned',
      description: createForm.description,
      timeline: [
        { event: 'Grievance Submitted', date: timestamp, notes: `Complaint initiated via support desk. Category: ${createForm.category}` }
      ],
      messages: [
        { sender: 'Citizen', text: createForm.description, time: timestamp }
      ],
      auditLogs: [
        { action: 'Grievance Created', timestamp, user: 'Support Desk Agent' }
      ],
      slaDaysTarget: 5,
      slaDaysElapsed: 0,
      slaStatus: 'Within SLA',
      evidence: [],
      investigationNotes: ''
    };

    setGrievances([newGrv, ...grievances]);
    setSelectedGrievance(newGrv);
    setActiveQueue('New');
    setShowCreateModal(false);
    setCreateForm({
      citizenName: '',
      category: 'Verification Issue',
      priority: 'High',
      area: '',
      description: ''
    });
    setFeedback({ type: 'success', message: `Grievance registered successfully with ID ${newId}` });
  };

  const handleAssignOfficer = () => {
    if (!selectedGrievance) return;
    const timestamp = new Date().toLocaleString();

    // Check if reassigning or removing
    const updatedTimeline = [...selectedGrievance.timeline, {
      event: 'Officer Assigned',
      date: timestamp,
      notes: `Assigned to ${assigneeSelect}`
    }];

    const updatedLogs = [...selectedGrievance.auditLogs, {
      action: 'Officer Assigned',
      timestamp,
      user: 'Administrator'
    }];

    const updatedGrv = {
      ...selectedGrievance,
      assignedOfficer: assigneeSelect,
      status: selectedGrievance.status === 'New' ? 'In Progress' : selectedGrievance.status,
      timeline: updatedTimeline,
      auditLogs: updatedLogs
    };

    // Increment workload of assigned officer
    const updatedOfficers = officers.map(o => {
      if (o.name === assigneeSelect) {
        return { ...o, openCases: o.openCases + 1 };
      }
      return o;
    });

    setOfficers(updatedOfficers);
    updateComplaintInList(updatedGrv);
    setShowAssignModal(false);
    setFeedback({ type: 'success', message: `Assigned case ${selectedGrievance.id} to ${assigneeSelect}.` });
  };

  const handleRemoveAssignment = () => {
    if (!selectedGrievance || selectedGrievance.assignedOfficer === 'Unassigned') return;
    const timestamp = new Date().toLocaleString();
    const exOfficer = selectedGrievance.assignedOfficer;

    const updatedTimeline = [...selectedGrievance.timeline, {
      event: 'Assignment Removed',
      date: timestamp,
      notes: `Removed assignment from ${exOfficer}`
    }];

    const updatedLogs = [...selectedGrievance.auditLogs, {
      action: 'Assignment Revoked',
      timestamp,
      user: 'Administrator'
    }];

    const updatedGrv = {
      ...selectedGrievance,
      assignedOfficer: 'Unassigned',
      status: 'New', // Send back to New queue
      timeline: updatedTimeline,
      auditLogs: updatedLogs
    };

    // Decrement workload of officer
    const updatedOfficers = officers.map(o => {
      if (o.name === exOfficer) {
        return { ...o, openCases: Math.max(0, o.openCases - 1) };
      }
      return o;
    });

    setOfficers(updatedOfficers);
    updateComplaintInList(updatedGrv);
    setFeedback({ type: 'warning', message: `Revoked assignment of case ${selectedGrievance.id}.` });
  };

  const handleUpdateStatus = (newStatus) => {
    if (!selectedGrievance) return;
    const timestamp = new Date().toLocaleString();

    let extraDetails = {};
    if (newStatus === 'Resolved') {
      extraDetails = {
        resolutionDate: timestamp,
        resolutionSummary: remarksInput || 'Issue validated and resolved under compliance terms.',
        citizenRating: 5,
        citizenFeedback: 'Closed by Administrator override.'
      };
    } else if (newStatus === 'Escalated') {
      extraDetails = {
        escalationReason: 'Escalated by manual supervisor directive.',
        assignedSupervisor: 'Regional Supervisor',
        escalationLevel: 'Level 1 (Zonal)'
      };
    }

    const updatedTimeline = [...selectedGrievance.timeline, {
      event: newStatus === 'Resolved' ? 'Grievance Closed' : `Status Set: ${newStatus}`,
      date: timestamp,
      notes: `Grievance status modified to ${newStatus}.`
    }];

    const updatedLogs = [...selectedGrievance.auditLogs, {
      action: `Status Updated to ${newStatus}`,
      timestamp,
      user: 'Supervisory Officer'
    }];

    const updatedGrv = {
      ...selectedGrievance,
      status: newStatus,
      investigationNotes: remarksInput,
      timeline: updatedTimeline,
      auditLogs: updatedLogs,
      ...extraDetails
    };

    updateComplaintInList(updatedGrv);
    setFeedback({ type: 'success', message: `Grievance ${selectedGrievance.id} status is now "${newStatus}".` });
  };

  const handleSendChatMessage = () => {
    if (!chatInput.trim() || !selectedGrievance) return;
    const timestamp = new Date().toLocaleString();

    const newMessage = {
      sender: 'Officer',
      text: chatInput,
      time: timestamp
    };

    const updatedGrv = {
      ...selectedGrievance,
      messages: [...selectedGrievance.messages, newMessage],
      auditLogs: [...selectedGrievance.auditLogs, {
        action: 'Message Sent to Citizen',
        timestamp,
        user: 'Officer'
      }]
    };

    updateComplaintInList(updatedGrv);
    setChatInput('');
    setFeedback({ type: 'success', message: 'Message sent and notification dispatched to citizen.' });
  };

  const handleUploadMockEvidence = () => {
    if (!selectedGrievance) return;
    const mockFiles = [
      { name: 'verification_geotag_receipt.pdf', size: '420 KB' },
      { name: 'citizen_residence_photo.jpg', size: '1.8 MB' },
      { name: 'officer_visit_declaration.pdf', size: '610 KB' }
    ];
    const pickedFile = mockFiles[Math.floor(Math.random() * mockFiles.length)];
    const timestamp = new Date().toLocaleString();

    // Check if already uploaded
    if (selectedGrievance.evidence.some(e => e.name === pickedFile.name)) {
      setFeedback({ type: 'warning', message: 'Evidence file already exists in case file.' });
      return;
    }

    const updatedGrv = {
      ...selectedGrievance,
      evidence: [...selectedGrievance.evidence, pickedFile],
      timeline: [...selectedGrievance.timeline, {
        event: 'Evidence Added',
        date: timestamp,
        notes: `Uploaded evidence attachment: ${pickedFile.name}`
      }],
      auditLogs: [...selectedGrievance.auditLogs, {
        action: 'Evidence File Uploaded',
        timestamp,
        user: 'Officer'
      }]
    };

    updateComplaintInList(updatedGrv);
    setFeedback({ type: 'success', message: `Evidence file "${pickedFile.name}" securely attached to case records.` });
  };

  const updateComplaintInList = (updatedGrv) => {
    const updatedList = grievances.map(g => g.id === updatedGrv.id ? updatedGrv : g);
    setGrievances(updatedList);
    setSelectedGrievance(updatedGrv);
  };

  const handleCompileReport = (name) => {
    setReportState('compiling');
    setTimeout(() => {
      setReportState('done');
      setFeedback({ type: 'success', message: `${name} successfully compiled and exported (PDF format).` });
      setTimeout(() => setReportState(null), 3000);
    }, 2000);
  };

  // Filter queues
  const filteredGrievances = grievances.filter(g => {
    if (activeQueue === 'New') return g.status === 'New';
    if (activeQueue === 'In Progress') return g.status === 'In Progress';
    if (activeQueue === 'Resolved') return g.status === 'Resolved';
    if (activeQueue === 'Escalated') return g.status === 'Escalated';
    return true;
  });

  return (
    <div className="flex-grow w-full max-w-containerMax mx-auto px-6 py-8 flex flex-col gap-8 text-onSurface bg-background">
      
      {/* CSS overrides for dark mode solidarity */}
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
              National Grievance Portal
            </span>
            <span className="text-[10px] text-white/70 font-semibold">â€¢ CPGRAMS Dashboard Interface</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Grievance Management</h2>
          <p className="text-xs text-white/80 max-w-xl leading-relaxed">
            Monitor citizen complaints, assign officers, investigate issues, track resolution progress, and improve citizen satisfaction.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 relative z-10 shrink-0">
          <button 
            onClick={() => setShowCreateModal(true)}
            className="bg-secondary text-primary-dark font-bold text-xs px-4 py-2.5 rounded-full hover:bg-secondary/90 transition-all flex items-center gap-1.5 active:scale-95 shadow-sm cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Create Complaint
          </button>
          <button 
            onClick={() => {
              if (selectedGrievance) setShowAssignModal(true);
              else setFeedback({ type: 'warning', message: 'Please select a grievance first.' });
            }}
            className="bg-white/10 hover:bg-white/20 border border-white/25 text-white font-bold text-xs px-4 py-2.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <UserCheck className="w-3.5 h-3.5" /> Assign Officer
          </button>
          <button 
            onClick={() => handleCompileReport(reportSelection)}
            className="bg-white/10 hover:bg-white/20 border border-white/25 text-white font-bold text-xs px-4 py-2.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> Export Complaint Report
          </button>
          <button 
            onClick={() => { window.scrollTo({ top: 900, behavior: 'smooth' }); }}
            className="bg-white/10 hover:bg-white/20 border border-white/25 text-white font-bold text-xs px-4 py-2.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <BarChart2 className="w-3.5 h-3.5" /> Open Analytics
          </button>
        </div>
      </section>

      {/* SECTION 2: GRIEVANCE OVERVIEW */}
      <section className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {[
          { label: 'Total Complaints', count: grievances.length + 12536, status: 'Logged complaints', icon: FileText, color: 'text-primary' },
          { label: 'New Complaints', count: grievances.filter(g => g.status === 'New').length + 241, status: 'Awaiting review', icon: Info, color: 'text-amber-500' },
          { label: 'In Progress Cases', count: grievances.filter(g => g.status === 'In Progress').length + 154, status: 'Under investigation', icon: Activity, color: 'text-primary' },
          { label: 'Resolved Cases', count: grievances.filter(g => g.status === 'Resolved').length + 10799, status: 'Completed SLA', icon: CheckSquare, color: 'text-success' },
          { label: 'Escalated Cases', count: grievances.filter(g => g.status === 'Escalated').length + 116, status: 'Supervisor review', icon: ShieldAlert, color: 'text-red-500' },
          { label: 'Average Resolution', count: '3.2 Days', status: 'National SLA Index', icon: Clock, color: 'text-[#ff9933]' }
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

      {/* SECTION 3: COMPLAINT MANAGEMENT QUEUE */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* COMPLAINT QUEUE LIST (7 COLS) */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          
          <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-outlineVariant/15 pb-2.5">
              <h3 className="font-bold text-xs text-primary uppercase tracking-wider">Complaint Queue Dashboard</h3>
              <span className="text-[9px] text-onSurfaceVariant font-semibold">Track & action tickets</span>
            </div>

            {/* Queue Selector Tabs */}
            <div className="flex border-b border-outlineVariant/20 pb-1 text-xs overflow-x-auto gap-2">
              {['New', 'In Progress', 'Resolved', 'Escalated'].map(statusTab => (
                <button
                  key={statusTab}
                  onClick={() => setActiveQueue(statusTab)}
                  className={`px-4 py-2 font-bold flex items-center justify-center gap-1.5 border-b-2 cursor-pointer transition-colors shrink-0 ${
                    activeQueue === statusTab 
                      ? 'border-primary text-primary' 
                      : 'border-transparent text-onSurfaceVariant hover:text-primary'
                  }`}
                >
                  {statusTab === 'New' && <Info className="w-3.5 h-3.5 text-amber-500" />}
                  {statusTab === 'In Progress' && <Activity className="w-3.5 h-3.5 text-primary" />}
                  {statusTab === 'Resolved' && <CheckCircle2 className="w-3.5 h-3.5 text-success" />}
                  {statusTab === 'Escalated' && <ShieldAlert className="w-3.5 h-3.5 text-red-500" />}
                  {statusTab} ({grievances.filter(g => g.status === statusTab).length})
                </button>
              ))}
            </div>

            {/* Table / List View */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-outlineVariant/30 text-onSurfaceVariant font-bold">
                    <th className="py-2.5 px-2">ID</th>
                    <th className="py-2.5 px-2">Citizen</th>
                    <th className="py-2.5 px-2">Category</th>
                    <th className="py-2.5 px-2">Priority</th>
                    <th className="py-2.5 px-2">Area</th>
                    <th className="py-2.5 px-2">Officer</th>
                    <th className="py-2.5 px-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outlineVariant/15">
                  {filteredGrievances.length > 0 ? (
                    filteredGrievances.map(grv => (
                      <tr 
                        key={grv.id} 
                        onClick={() => handleSelectComplaint(grv)}
                        className={`hover:bg-surface-low/50 cursor-pointer transition-colors ${
                          selectedGrievance?.id === grv.id ? 'bg-primary-container/10 border-l-4 border-l-primary' : ''
                        }`}
                      >
                        <td className="py-3 px-2 font-mono font-bold text-primary">{grv.id.split('-')[2]}</td>
                        <td className="py-3 px-2 font-semibold">{grv.citizenName}</td>
                        <td className="py-3 px-2 text-[11px] text-onSurfaceVariant">{grv.category}</td>
                        <td className="py-3 px-2">
                          <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase ${
                            grv.priority === 'Critical' ? 'bg-red-700 text-red-800' :
                            grv.priority === 'High' ? 'bg-red-50 text-red-700' :
                            'bg-amber-50 text-amber-700'
                          }`}>
                            {grv.priority}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-[10px] text-onSurfaceVariant">{grv.area}</td>
                        <td className="py-3 px-2 font-semibold text-primary">{grv.assignedOfficer}</td>
                        <td className="py-3 px-2 text-right" onClick={e => e.stopPropagation()}>
                          <div className="flex justify-end gap-1">
                            <button 
                              onClick={() => handleSelectComplaint(grv)}
                              className="bg-primary text-white p-1.5 rounded hover:bg-primary-light"
                              title="View Details"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              onClick={() => { setSelectedGrievance(grv); setShowAssignModal(true); }}
                              className="border border-outlineVariant hover:bg-surface-low p-1.5 rounded text-onSurfaceVariant"
                              title="Assign Officer"
                            >
                              <UserCheck className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-10 text-center italic text-onSurfaceVariant">
                        No complaints in this queue category.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

          </div>

          {/* SECTION 4: COMPLAINT CATEGORIES SUMMARY */}
          <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
            <h3 className="font-bold text-xs text-primary uppercase tracking-wider">Complaint Categories Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(CATEGORIES_DATA).map(([catName, data]) => (
                <div key={catName} className="p-3.5 bg-surface-low border border-outlineVariant/20 rounded-lg flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs">{catName}</span>
                    <span className={`text-xs font-bold ${data.color}`}>{data.open} Open</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-onSurfaceVariant">
                    <span>Resolved: <strong className="text-success">{data.resolved}</strong></span>
                    <span>Avg SLA: <strong>{data.avgTime}</strong></span>
                  </div>
                  <div className="flex gap-1.5 mt-2 border-t border-outlineVariant/10 pt-2 text-[9px] font-bold">
                    <button 
                      onClick={() => {
                        setCreateForm(prev => ({ ...prev, category: catName }));
                        setShowCreateModal(true);
                      }}
                      className="text-primary hover:underline"
                    >
                      + File under Category
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 11: GRIEVANCE ANALYTICS (CUSTOM SVG GRAPH) */}
          <div id="analytics" className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-5">
            <h3 className="font-bold text-xs text-primary uppercase tracking-wider flex items-center gap-1.5">
              <BarChart2 className="w-4 h-4 text-primary" /> Grievance Operational Intelligence
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              
              {/* Trends bar indicators */}
              <div className="flex flex-col gap-3.5 text-xs">
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-[10px] font-bold">
                    <span className="text-onSurfaceVariant">Resolution Target SLA Success Rate:</span>
                    <span className="text-success font-mono font-extrabold">95.4%</span>
                  </div>
                  <div className="w-full h-2 bg-outlineVariant/20 rounded-full overflow-hidden">
                    <div className="h-full bg-success rounded-full" style={{ width: '95.4%' }} />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-[10px] font-bold">
                    <span className="text-onSurfaceVariant">Officer Workload Load Factor:</span>
                    <span className="text-amber-500 font-mono font-extrabold">64.0%</span>
                  </div>
                  <div className="w-full h-2 bg-outlineVariant/20 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: '64%' }} />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-[10px] font-bold">
                    <span className="text-onSurfaceVariant">Citizen Ticket Re-open Rate:</span>
                    <span className="text-red-500 font-mono font-extrabold">2.1%</span>
                  </div>
                  <div className="w-full h-2 bg-outlineVariant/20 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500 rounded-full" style={{ width: '2.1%' }} />
                  </div>
                </div>
              </div>

              {/* Custom SVG Trend Map */}
              <div className="flex flex-col items-center gap-2">
                <span className="text-[9px] font-bold text-primary uppercase">Weekly Grievances Volume Timeline</span>
                <svg viewBox="0 0 160 80" className="w-full h-20">
                  <line x1="0" y1="20" x2="160" y2="20" stroke="#eceef0" strokeWidth="0.5" />
                  <line x1="0" y1="40" x2="160" y2="40" stroke="#eceef0" strokeWidth="0.5" />
                  <line x1="0" y1="60" x2="160" y2="60" stroke="#eceef0" strokeWidth="0.5" />
                  {/* Complaint trend graph line */}
                  <path d="M 0 65 L 30 50 L 60 58 L 90 25 L 120 40 L 160 15" fill="none" stroke="#3f51b5" strokeWidth="2.5" />
                  <circle cx="30" cy="50" r="3.5" fill="#3f51b5" />
                  <circle cx="90" cy="25" r="3.5" fill="#3f51b5" />
                  <circle cx="160" cy="15" r="3.5" fill="#3f51b5" />
                </svg>
                <div className="flex justify-between w-full text-[8px] font-semibold text-onSurfaceVariant px-1 mt-1">
                  <span>Week 1 (80)</span>
                  <span>Week 2 (100)</span>
                  <span>Week 3 (210)</span>
                  <span>Week 4 (320)</span>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: DETAIL WORKSPACE (5 COLS) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {selectedGrievance ? (
            <div className="flex flex-col gap-6 animate-fade-in">
              
              {/* SECTION 5: COMPLAINT DETAILS VIEW */}
              <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
                <div className="flex justify-between items-start border-b border-outlineVariant/20 pb-3">
                  <div>
                    <h3 className="font-extrabold text-xs text-primary uppercase">Complaint workspace</h3>
                    <span className="text-[9px] text-onSurfaceVariant font-mono font-bold block mt-0.5">{selectedGrievance.id}</span>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded font-extrabold uppercase text-[8px] ${
                    selectedGrievance.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                    selectedGrievance.status === 'Escalated' ? 'bg-red-700 text-red-800' :
                    selectedGrievance.status === 'In Progress' ? 'bg-primary-container/20 text-primary' :
                    'bg-amber-100 text-amber-800'
                  }`}>
                    {selectedGrievance.status}
                  </span>
                </div>

                {/* Info Block */}
                <div className="space-y-3.5 text-xs">
                  <div className="grid grid-cols-2 gap-3 bg-surface-low border border-outlineVariant/20 p-3 rounded-lg text-[10px]">
                    <div>
                      <span className="text-[8px] text-onSurfaceVariant uppercase font-bold">Citizen Name</span>
                      <div className="font-bold text-primary">{selectedGrievance.citizenName}</div>
                    </div>
                    <div>
                      <span className="text-[8px] text-onSurfaceVariant uppercase font-bold">Jurisdiction Zone</span>
                      <div className="font-bold text-primary">{selectedGrievance.area}</div>
                    </div>
                    <div>
                      <span className="text-[8px] text-onSurfaceVariant uppercase font-bold">Submission Date</span>
                      <div className="font-bold text-primary font-mono">{selectedGrievance.submissionDate}</div>
                    </div>
                    <div>
                      <span className="text-[8px] text-onSurfaceVariant uppercase font-bold">Assigned Handler</span>
                      <div className="font-bold text-primary flex items-center gap-1.5">
                        {selectedGrievance.assignedOfficer}
                        {selectedGrievance.assignedOfficer !== 'Unassigned' && (
                          <button 
                            onClick={handleRemoveAssignment}
                            className="text-red-500 hover:text-red-700 cursor-pointer"
                            title="Remove assignment"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 border-t border-outlineVariant/10 pt-2.5">
                    <span className="font-bold text-primary uppercase text-[8px]">Complaint Description</span>
                    <p className="text-onSurface/90 leading-relaxed text-xs italic bg-slate-50 dark:bg-slate-950/20 p-2.5 rounded border border-outlineVariant/15">
                      "{selectedGrievance.description}"
                    </p>
                  </div>
                </div>

                {/* SECTION 9: SLA MONITORING CENTER */}
                <div className="border-t border-outlineVariant/15 pt-3.5 mt-1.5 flex flex-col gap-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-primary uppercase text-[8px]">SLA Monitoring Status</span>
                    <span className={`px-2 py-0.5 rounded font-bold text-[9px] uppercase ${
                      selectedGrievance.slaStatus === 'Overdue' ? 'bg-red-600 text-white animate-pulse' : 'bg-green-600 text-white'
                    }`}>
                      {selectedGrievance.slaStatus}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[10px] text-onSurfaceVariant">
                    <div>Target Threshold: <strong>{selectedGrievance.slaDaysTarget} Days</strong></div>
                    <div>Elapsed Time: <strong className={selectedGrievance.slaDaysElapsed > selectedGrievance.slaDaysTarget ? 'text-red-500 font-extrabold' : ''}>{selectedGrievance.slaDaysElapsed} Days</strong></div>
                  </div>
                  {/* Visual countdown progress */}
                  <div className="w-full h-1.5 bg-outlineVariant/20 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        selectedGrievance.slaDaysElapsed > selectedGrievance.slaDaysTarget ? 'bg-red-500' : 'bg-success'
                      }`}
                      style={{ width: `${Math.min(100, (selectedGrievance.slaDaysElapsed / selectedGrievance.slaDaysTarget) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* State Actions */}
                <div className="flex justify-between gap-1.5 border-t border-outlineVariant/10 pt-3 text-[10px] mt-2">
                  <div className="flex gap-1.5">
                    <button 
                      onClick={() => handleUpdateStatus('In Progress')}
                      className="bg-primary text-white font-bold px-3 py-1.5 rounded hover:bg-primary-light cursor-pointer"
                    >
                      Investigate
                    </button>
                    <button 
                      onClick={() => handleUpdateStatus('Resolved')}
                      className="bg-success text-white font-bold px-3 py-1.5 rounded hover:bg-success/90 cursor-pointer"
                    >
                      Resolve Case
                    </button>
                  </div>
                  <button 
                    onClick={() => handleUpdateStatus('Escalated')}
                    className="border border-red-200 text-red-600 hover:bg-red-50 px-3 py-1.5 rounded font-bold cursor-pointer"
                  >
                    Escalate Case
                  </button>
                </div>
              </div>

              {/* SECTION 10: INVESTIGATION CENTER */}
              <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
                <h3 className="font-bold text-xs text-primary uppercase tracking-wider flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-primary" /> Active Investigation Log
                </h3>

                <div className="space-y-3.5 text-xs">
                  {/* Remarks input */}
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-primary uppercase text-[8px]">Case investigation notes</label>
                    <textarea
                      rows={2}
                      value={remarksInput}
                      onChange={(e) => setRemarksInput(e.target.value)}
                      placeholder="Append updates, findings, and notes..."
                      className="px-2.5 py-1.5 bg-surface border border-outlineVariant rounded outline-none text-xs focus:border-primary w-full"
                    />
                  </div>

                  {/* Evidence Viewer */}
                  <div>
                    <span className="font-bold text-primary uppercase text-[8px] block mb-1.5">Evidence Files Attached</span>
                    {selectedGrievance.evidence && selectedGrievance.evidence.length > 0 ? (
                      <div className="flex flex-col gap-1.5">
                        {selectedGrievance.evidence.map((file, idx) => (
                          <div key={idx} className="p-2 bg-surface-low border border-outlineVariant/20 rounded flex items-center justify-between text-[10px]">
                            <span className="font-mono flex items-center gap-1.5"><FileText className="w-3.5 h-3.5 text-primary" /> {file.name}</span>
                            <span className="text-onSurfaceVariant font-bold">{file.size}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-3 text-center border border-dashed border-outlineVariant/40 rounded text-onSurfaceVariant italic text-[10px]">
                        No physical evidence has been attached to this ticket.
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 justify-end border-t border-outlineVariant/10 pt-2.5">
                    <button 
                      onClick={handleUploadMockEvidence}
                      className="bg-primary text-white font-bold px-3 py-1.5 rounded hover:bg-primary-light cursor-pointer text-[10px]"
                    >
                      Attach Evidence
                    </button>
                    <button 
                      onClick={() => handleUpdateStatus('Resolved')}
                      className="border border-outlineVariant hover:bg-surface-low px-3 py-1.5 rounded font-bold cursor-pointer text-[10px]"
                    >
                      Close Investigation
                    </button>
                  </div>
                </div>
              </div>

              {/* SECTION 7: CITIZEN COMMUNICATION CENTER */}
              <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
                <h3 className="font-bold text-xs text-primary uppercase tracking-wider flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-primary" /> Citizen Communication Channel
                </h3>

                {/* Conversation timeline */}
                <div className="max-h-48 overflow-y-auto space-y-3 p-3 bg-surface-low border border-outlineVariant/15 rounded-lg text-[11px]">
                  {selectedGrievance.messages && selectedGrievance.messages.map((msg, idx) => (
                    <div 
                      key={idx} 
                      className={`flex flex-col gap-0.5 max-w-[85%] p-2 rounded-lg ${
                        msg.sender === 'Officer' 
                          ? 'bg-primary text-white ml-auto rounded-tr-none' 
                          : 'bg-surface border border-outlineVariant/25 text-onSurface mr-auto rounded-tl-none'
                      }`}
                    >
                      <span className="font-semibold text-[8px] opacity-80">{msg.sender} â€¢ {msg.time}</span>
                      <p className="leading-relaxed">{msg.text}</p>
                    </div>
                  ))}
                </div>

                <div className="flex gap-1.5">
                  <input 
                    type="text" 
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Type message to citizen..."
                    className="flex-grow px-2.5 py-1.5 bg-surface border border-outlineVariant rounded outline-none text-xs focus:border-primary"
                    onKeyDown={e => e.key === 'Enter' && handleSendChatMessage()}
                  />
                  <button 
                    onClick={handleSendChatMessage}
                    className="bg-primary text-white p-2 rounded hover:bg-primary-light shrink-0 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* SECTION 8: COMPLAINT PROGRESS TIMELINE */}
              <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
                <h3 className="font-bold text-xs text-primary uppercase tracking-wider">Complaint Progress Timeline</h3>
                
                <div className="relative border-l-2 border-primary/20 pl-4 ml-2.5 space-y-4 text-xs">
                  {selectedGrievance.timeline.map((step, idx) => (
                    <div key={idx} className="relative">
                      <div className="absolute -left-[23px] top-0.5 w-3 h-3 rounded-full bg-primary border-2 border-surface" />
                      <div className="font-bold text-primary text-[10px]">{step.event}</div>
                      <div className="text-[9px] text-onSurfaceVariant font-mono font-semibold">{step.date}</div>
                      <p className="text-[10px] text-onSurfaceVariant leading-normal mt-0.5">{step.notes}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 12: CITIZEN FEEDBACK & SATISFACTION (ONLY FOR RESOLVED) */}
              {selectedGrievance.status === 'Resolved' && (
                <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-3.5">
                  <h3 className="font-bold text-xs text-primary uppercase tracking-wider flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-[#ff9933] fill-[#ff9933]" /> Citizen Feedback Rating
                  </h3>
                  <div className="flex items-center gap-2">
                    <div className="flex text-[#ff9933]">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < selectedGrievance.citizenRating ? 'fill-[#ff9933]' : 'opacity-20'}`} />
                      ))}
                    </div>
                    <span className="font-bold text-xs text-primary">{selectedGrievance.citizenRating} / 5 Stars</span>
                  </div>
                  {selectedGrievance.citizenFeedback && (
                    <p className="text-[11px] text-onSurfaceVariant italic bg-surface-low border border-outlineVariant/15 p-2 rounded">
                      "{selectedGrievance.citizenFeedback}"
                    </p>
                  )}
                </div>
              )}

              {/* SECTION 13: AUDIT LOGS */}
              <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-3.5">
                <h3 className="font-bold text-xs text-primary uppercase tracking-wider">Case Action Audit Logs</h3>
                <div className="space-y-2 text-[10px] max-h-36 overflow-y-auto">
                  {selectedGrievance.auditLogs.map((log, idx) => (
                    <div key={idx} className="p-2 bg-surface-low border border-outlineVariant/15 rounded flex items-center justify-between text-onSurfaceVariant gap-4">
                      <div>
                        <strong className="text-primary">{log.action}</strong>
                        <div className="text-[8px]">{log.timestamp}</div>
                      </div>
                      <span className="font-semibold text-primary">{log.user}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-surface border border-outlineVariant/50 rounded-xl p-8 text-center italic text-onSurfaceVariant text-xs shadow-sm">
              Select a grievance ticket from the queue list to load complaint detail workspaces.
            </div>
          )}

          {/* SECTION 14: REPORTS CENTER */}
          <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
            <h3 className="font-bold text-xs text-primary uppercase tracking-wider">Reports Center</h3>
            <div className="flex flex-col md:flex-row gap-3">
              <select 
                value={reportSelection}
                onChange={(e) => setReportSelection(e.target.value)}
                className="flex-grow px-2.5 py-1.5 bg-surface border border-outlineVariant rounded outline-none text-xs focus:border-primary text-onSurface"
              >
                <option value="Complaint Summary Report">Complaint Summary Report</option>
                <option value="Resolution Performance Report">Resolution Performance Report</option>
                <option value="Officer Performance Report">Officer Performance Report</option>
                <option value="Escalation Report">Escalation Report</option>
                <option value="Citizen Satisfaction Report">Citizen Satisfaction Report</option>
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
            <h3 className="font-bold text-xs text-primary uppercase tracking-wider">Administrative Quick Shortcuts</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button 
                onClick={() => { setActiveQueue('New'); window.scrollTo({ top: 300, behavior: 'smooth' }); }}
                className="p-2.5 border border-outlineVariant hover:bg-surface-low rounded-lg text-left font-bold transition-all text-onSurface"
              >
                View New Complaints
              </button>
              <button 
                onClick={() => {
                  if (selectedGrievance) setShowAssignModal(true);
                  else setFeedback({ type: 'warning', message: 'Select a grievance ticket first.' });
                }}
                className="p-2.5 border border-outlineVariant hover:bg-surface-low rounded-lg text-left font-bold transition-all text-onSurface"
              >
                Assign/Reassign Officer
              </button>
              <button 
                onClick={() => { setActiveQueue('Escalated'); window.scrollTo({ top: 300, behavior: 'smooth' }); }}
                className="p-2.5 border border-outlineVariant hover:bg-surface-low rounded-lg text-left font-bold transition-all text-onSurface"
              >
                Open Escalated Cases
              </button>
              <button 
                onClick={() => handleCompileReport(reportSelection)}
                className="p-2.5 border border-outlineVariant hover:bg-surface-low rounded-lg text-left font-bold transition-all text-onSurface"
              >
                Generate Custom Report
              </button>
            </div>
          </div>

          {/* SECTION 16: HELP & SECURITY PROCEDURES */}
          <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
            <h3 className="font-bold text-xs text-primary uppercase tracking-wider flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-primary" /> Support & Resolution Guides
            </h3>
            
            <div className="space-y-3 text-xs text-onSurfaceVariant">
              <div className="pb-2.5 border-b border-outlineVariant/15">
                <span className="font-bold text-primary block">CPGRAMS Operational Directive</span>
                <p className="text-[11px] leading-relaxed mt-0.5">
                  All citizen complaints must be acknowledged within 24 hours and resolved or escalated within 5 calendar days.
                </p>
              </div>

              <div className="pb-2.5 border-b border-outlineVariant/15">
                <span className="font-bold text-primary block">Officer Misconduct Protocol</span>
                <p className="text-[11px] leading-relaxed mt-0.5">
                  Misconduct allegations automatically bypass standard workflows and trigger level 2 alerts directly to administrative superintendents.
                </p>
              </div>

              <div>
                <span className="font-bold text-primary block">Document Verification Appeals</span>
                <p className="text-[11px] leading-relaxed mt-0.5">
                  If OCR failures spark a document dispute, officers should review the 300 DPI raw files and apply the "Manual Exception Approval".
                </p>
              </div>
            </div>
          </div>

        </div>

      </section>

      {/* CREATE COMPLAINT MODAL (FORM DIALOG) */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-surface border border-outlineVariant rounded-xl max-w-md w-full p-6 shadow-premium relative animate-scale-in">
            <button 
              onClick={() => setShowCreateModal(false)}
              className="absolute top-4 right-4 p-1 rounded hover:bg-surface-low text-onSurfaceVariant cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h3 className="font-bold text-base text-primary uppercase tracking-wide mb-4">Register New Citizen Complaint</h3>
            
            <form onSubmit={handleCreateComplaint} className="space-y-4 text-xs">
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-primary uppercase text-[8px]">Citizen Name *</label>
                <input 
                  type="text" 
                  value={createForm.citizenName}
                  onChange={e => setCreateForm({...createForm, citizenName: e.target.value})}
                  placeholder="e.g. Mohit Pratap Mehra"
                  className="px-2.5 py-2 bg-surface border border-outlineVariant rounded outline-none focus:border-primary text-onSurface"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-primary uppercase text-[8px]">Category *</label>
                  <select 
                    value={createForm.category}
                    onChange={e => setCreateForm({...createForm, category: e.target.value})}
                    className="px-2.5 py-2 bg-surface border border-outlineVariant rounded outline-none focus:border-primary text-onSurface"
                  >
                    <option value="Registration Issue">Registration Issue</option>
                    <option value="Verification Issue">Verification Issue</option>
                    <option value="Document Issue">Document Issue</option>
                    <option value="Officer Misconduct">Officer Misconduct</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-primary uppercase text-[8px]">Priority *</label>
                  <select 
                    value={createForm.priority}
                    onChange={e => setCreateForm({...createForm, priority: e.target.value})}
                    className="px-2.5 py-2 bg-surface border border-outlineVariant rounded outline-none focus:border-primary text-onSurface"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-primary uppercase text-[8px]">Area / Jurisdiction Zone *</label>
                <input 
                  type="text" 
                  value={createForm.area}
                  onChange={e => setCreateForm({...createForm, area: e.target.value})}
                  placeholder="e.g. Delhi Zone 4"
                  className="px-2.5 py-2 bg-surface border border-outlineVariant rounded outline-none focus:border-primary text-onSurface"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-primary uppercase text-[8px]">Complaint Details / Description *</label>
                <textarea 
                  rows={3}
                  value={createForm.description}
                  onChange={e => setCreateForm({...createForm, description: e.target.value})}
                  placeholder="Enter detailed citizen concern..."
                  className="px-2.5 py-2 bg-surface border border-outlineVariant rounded outline-none focus:border-primary text-onSurface"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 border-t border-outlineVariant/10 pt-4 mt-2">
                <button 
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="border border-outlineVariant hover:bg-surface-low px-4 py-2 rounded-full font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-primary hover:bg-primary-light text-white font-bold px-5 py-2 rounded-full cursor-pointer shadow-sm"
                >
                  Register Complaint
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* OFFICER ASSIGNMENT MODAL (SECTION 6) */}
      {showAssignModal && selectedGrievance && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-surface border border-outlineVariant rounded-xl max-w-md w-full p-6 shadow-premium relative animate-scale-in">
            <button 
              onClick={() => setShowAssignModal(false)}
              className="absolute top-4 right-4 p-1 rounded hover:bg-surface-low text-onSurfaceVariant cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h3 className="font-bold text-base text-primary uppercase tracking-wide mb-1.5">Assign Complaint Officer</h3>
            <span className="text-[10px] text-onSurfaceVariant font-mono font-bold block mb-4">Case reference ID: {selectedGrievance.id}</span>
            
            <div className="space-y-4 text-xs">
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-primary uppercase text-[8px]">Select Officer</label>
                <select 
                  value={assigneeSelect}
                  onChange={(e) => setAssigneeSelect(e.target.value)}
                  className="px-2.5 py-2 bg-surface border border-outlineVariant rounded outline-none focus:border-primary text-onSurface"
                >
                  {officers.map(o => (
                    <option key={o.name} value={o.name}>{o.name} ({o.designation})</option>
                  ))}
                </select>
              </div>

              {/* Workload list */}
              <div>
                <span className="font-bold text-primary uppercase text-[8px] block mb-2">Officer Workload & Stats</span>
                <div className="space-y-2">
                  {officers.map(o => (
                    <div 
                      key={o.name} 
                      onClick={() => setAssigneeSelect(o.name)}
                      className={`p-2.5 border rounded-lg flex items-center justify-between transition-all cursor-pointer ${
                        assigneeSelect === o.name ? 'border-primary bg-primary-container/10' : 'border-outlineVariant/20 hover:bg-surface-low'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-primary">{o.name}</div>
                        <span className="text-[9px] text-onSurfaceVariant">{o.designation}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-xs">{o.openCases} Open Cases</div>
                        <span className={`text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                          o.availability === 'Available' ? 'bg-green-600 text-white' : 'bg-amber-500 text-white'
                        }`}>
                          {o.availability}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-outlineVariant/10 pt-4 mt-2">
                <button 
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className="border border-outlineVariant hover:bg-surface-low px-4 py-2 rounded-full font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="button"
                  onClick={handleAssignOfficer}
                  className="bg-primary hover:bg-primary-light text-white font-bold px-5 py-2 rounded-full cursor-pointer shadow-sm"
                >
                  Confirm Assignment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default GrievanceManagement;








