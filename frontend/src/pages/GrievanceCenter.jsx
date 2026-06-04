import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import {
  Search, Plus, CheckCircle, AlertTriangle, ChevronRight, Clock, ArrowLeft,
  Send, Star, UploadCloud, Trash2, HelpCircle, Phone, Mail, MessageSquare,
  Download, AlertCircle, Filter, ArrowUpRight, Sliders, X, Check,
  UserCheck, RefreshCw, FileText, Shield
} from 'lucide-react';

const GrievanceCenter = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Active Tabs: 'overview' | 'raise' | 'history' | 'details'
  const [activeTab, setActiveTab] = useState('overview');

  // Search & Filtering States
  const [searchQuery, setSearchQuery] = useState('');
  const [trackIdInput, setTrackIdInput] = useState('');
  const [historySearch, setHistorySearch] = useState('');
  const [historyFilter, setHistoryFilter] = useState('all');
  const [historySort, setHistorySort] = useState('latest');

  // General Notification Banners
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Master Complaints State
  const [complaints, setComplaints] = useState([
    {
      id: 'GRV-2026-458796',
      category: 'Verification Issue',
      subject: 'Unable To Complete Verification',
      description: 'I completed document submission but my verification status has not changed for 15 days.',
      priority: 'High',
      submissionDate: '15 May 2026',
      status: 'Under Review',
      assignedOfficer: 'Rahul Sharma',
      expectedResolutionDate: '10 June 2026',
      timeline: [
        { title: 'Complaint Submitted', desc: 'Grievance recorded in national portal.', date: '15 May 2026 · 09:00 AM', status: 'success' },
        { title: 'Officer Assigned', desc: 'Field Inspector Rahul Sharma mapped to ticket.', date: '16 May 2026 · 11:30 AM', status: 'info' },
        { title: 'Investigation Started', desc: 'Audit review of address logs initiated.', date: '17 May 2026 · 02:15 PM', status: 'success' }
      ],
      chatHistory: [
        { id: 1, text: 'My verification has been pending for 15 days.', sender: 'citizen', timestamp: '15 May 2026 · 09:05 AM' },
        { id: 2, text: 'We are reviewing your application.', sender: 'officer', timestamp: '16 May 2026 · 02:30 PM' }
      ],
      resolution: null,
      escalated: false,
      feedback: null
    },
    {
      id: 'GRV-2026-102547',
      category: 'Registration Issue',
      subject: 'Unable To Register Profile',
      description: 'Getting server timeout error when saving the third step of household census registry.',
      priority: 'Medium',
      submissionDate: '20 May 2026',
      status: 'Resolved',
      assignedOfficer: 'Priya Patel',
      expectedResolutionDate: '24 May 2026',
      timeline: [
        { title: 'Complaint Submitted', desc: 'Profile error ticket lodged.', date: '20 May 2026 · 10:00 AM', status: 'success' },
        { title: 'Officer Assigned', desc: 'Technical analyst Priya Patel assigned.', date: '21 May 2026 · 11:00 AM', status: 'info' },
        { title: 'Investigation Started', desc: 'Server stack traces analysis in progress.', date: '22 May 2026 · 03:00 PM', status: 'success' },
        { title: 'Resolution Proposed', desc: 'Database cache cleared for applicant session.', date: '23 May 2026 · 01:00 PM', status: 'success' },
        { title: 'Complaint Closed', desc: 'Ticket closed after citizen confirmation.', date: '23 May 2026 · 05:00 PM', status: 'approval' }
      ],
      chatHistory: [
        { id: 1, text: 'Unable to save profile, page keeps freezing.', sender: 'citizen', timestamp: '20 May 2026 · 10:05 AM' },
        { id: 2, text: 'Checking server logs for your session.', sender: 'officer', timestamp: '21 May 2026 · 11:15 AM' },
        { id: 3, text: 'The database issue is fixed. Please refresh your browser and try again.', sender: 'officer', timestamp: '23 May 2026 · 12:45 PM' },
        { id: 4, text: 'It works now, thank you!', sender: 'citizen', timestamp: '23 May 2026 · 03:00 PM' }
      ],
      resolution: {
        summary: 'Database session deadlock cleared.',
        notes: 'Cleaned stuck sessions for household registry step 3. Citizen verified successful profile save.',
        date: '23 May 2026'
      },
      escalated: false,
      feedback: {
        rating: 5,
        comments: 'Very quick response and friendly support!',
        solved: 'yes',
        helpful: 'yes',
        recommend: 'yes'
      }
    },
    {
      id: 'GRV-2026-908254',
      category: 'Officer Complaint',
      subject: 'Officer Missed Appointment',
      description: 'Field verification officer missed the scheduled home visit on 12 May 2026 without any notice.',
      priority: 'High',
      submissionDate: '13 May 2026',
      status: 'Resolved',
      assignedOfficer: 'Amit Sharma (Supervisor)',
      expectedResolutionDate: '18 May 2026',
      timeline: [
        { title: 'Complaint Submitted', desc: 'Officer conduct grievance filed.', date: '13 May 2026 · 08:30 AM', status: 'success' },
        { title: 'Officer Assigned', desc: 'Supervisor Amit Sharma mapped to case.', date: '14 May 2026 · 09:30 AM', status: 'info' },
        { title: 'Investigation Started', desc: 'Audit checking tracking logs for missed visits.', date: '15 May 2026 · 04:00 PM', status: 'success' },
        { title: 'Resolution Proposed', desc: 'Visit rescheduled with alternative inspector.', date: '16 May 2026 · 10:00 AM', status: 'success' },
        { title: 'Complaint Closed', desc: 'Ticket marked resolved.', date: '16 May 2026 · 02:00 PM', status: 'approval' }
      ],
      chatHistory: [
        { id: 1, text: 'I waited all day yesterday but no officer came.', sender: 'citizen', timestamp: '13 May 2026 · 08:35 AM' },
        { id: 2, text: 'I am investigating this issue with the assigned field officer.', sender: 'officer', timestamp: '14 May 2026 · 10:15 AM' },
        { id: 3, text: 'The field officer had a medical emergency. I have rescheduled your visit for 22 May with a different officer. Apologies for the inconvenience.', sender: 'officer', timestamp: '16 May 2026 · 09:45 AM' }
      ],
      resolution: {
        summary: 'Appointment rescheduled with new officer.',
        notes: 'Assigned alternative field inspector for visit. Checked status and verified with supervisor board.',
        date: '16 May 2026'
      },
      escalated: false,
      feedback: null
    },
    {
      id: 'GRV-2026-302145',
      category: 'Technical Issue',
      subject: 'Cannot Upload Documents',
      description: 'Uploading address proof PDF fails with file corruption error though file is valid.',
      priority: 'Low',
      submissionDate: '01 Jun 2026',
      status: 'Escalated',
      assignedOfficer: 'Senior Desk Officer Verma',
      expectedResolutionDate: '08 Jun 2026',
      timeline: [
        { title: 'Complaint Submitted', desc: 'Portal uploading issue registered.', date: '01 Jun 2026 · 11:30 AM', status: 'success' },
        { title: 'Under Review', desc: 'Technicians verifying cloud bucket parameters.', date: '02 Jun 2026 · 02:00 PM', status: 'success' },
        { title: 'Officer Assigned', desc: 'Technician desk officer assigned.', date: '03 Jun 2026 · 09:00 AM', status: 'info' },
        { title: 'Escalated to Senior Officer', desc: 'Case transferred to senior inspector for core patch verification.', date: '04 Jun 2026 · 10:00 AM', status: 'warning' }
      ],
      chatHistory: [
        { id: 1, text: 'PDF upload is failing repeatedly. Please fix.', sender: 'citizen', timestamp: '01 Jun 2026 · 11:35 AM' },
        { id: 2, text: 'This file format issue is being audited by our core engineering desk. We have escalated the priority.', sender: 'officer', timestamp: '04 Jun 2026 · 10:10 AM' }
      ],
      resolution: null,
      escalated: true,
      feedback: null
    }
  ]);

  // Active Complaint Detail Target
  const [activeComplaintId, setActiveComplaintId] = useState('GRV-2026-458796');

  const activeComplaint = useMemo(() => {
    return complaints.find(c => c.id === activeComplaintId) || complaints[0];
  }, [complaints, activeComplaintId]);

  // Raise Complaint Wizard States
  const [wizardStep, setWizardStep] = useState(1); // 1: Category selection, 2: Subject & Description, 3: Attachments & Priority, 4: Success confirmation
  const [newCategory, setNewCategory] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newPriority, setNewPriority] = useState('Medium');
  const [newAttachments, setNewAttachments] = useState([]);
  const [generatedId, setGeneratedId] = useState('');
  
  // Drag & drop state
  const [dragActive, setDragActive] = useState(false);

  // Chat interface states
  const [chatInput, setChatInput] = useState('');
  const [chatTyping, setChatTyping] = useState(false);
  const [chatAttachments, setChatAttachments] = useState([]);
  
  // Feedback States
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackComments, setFeedbackComments] = useState('');
  const [fbSolved, setFbSolved] = useState('');
  const [fbHelpful, setFbHelpful] = useState('');
  const [fbRecommend, setFbRecommend] = useState('');

  // Support Ticket Form
  const [supportTicketSubject, setSupportTicketSubject] = useState('');
  const [supportTicketDesc, setSupportTicketDesc] = useState('');

  // FAQ Active Index
  const [activeFaq, setActiveFaq] = useState(null);

  // Chat container reference for auto-scroll
  const chatEndRef = useRef(null);

  // Statistics Calculation
  const statsOverview = useMemo(() => {
    return {
      total: complaints.length,
      open: complaints.filter(c => c.status === 'Under Review' || c.status === 'Submitted' || c.status === 'Assigned To Officer' || c.status === 'Investigation In Progress').length,
      resolved: complaints.filter(c => c.status === 'Resolved').length,
      escalated: complaints.filter(c => c.status === 'Escalated').length
    };
  }, [complaints]);

  // Filtered/Sorted Complaints list
  const filteredHistory = useMemo(() => {
    return complaints.filter(c => {
      const matchesSearch = c.id.toLowerCase().includes(historySearch.toLowerCase()) ||
                            c.subject.toLowerCase().includes(historySearch.toLowerCase());
      const matchesFilter = historyFilter === 'all' || c.status.toLowerCase() === historyFilter.toLowerCase() ||
                            (historyFilter === 'open' && c.status !== 'Resolved');
      return matchesSearch && matchesFilter;
    }).sort((a, b) => {
      const dateA = new Date(a.submissionDate);
      const dateB = new Date(b.submissionDate);
      return historySort === 'latest' ? dateB - dateA : dateA - dateB;
    });
  }, [complaints, historySearch, historyFilter, historySort]);

  // Scroll to bottom of chat
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeComplaint?.chatHistory, chatTyping]);

  // Clear success/error notifications automatically
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess('');
        setError('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  // Help support desk card data
  const faqData = [
    { q: "How long does it take to resolve a census grievance?", a: "Most technical issues and registration errors are addressed within 48 to 72 hours. Officer misconduct or field verification disputes may take 5 to 7 working days to investigate fully." },
    { q: "Can I edit a complaint after submitting?", a: "Direct editing is disabled to ensure registry audit trails. However, you can communicate updates directly with the assigned officer in the integrated ticket chat or upload additional attachments." },
    { q: "What happens if I escalate a complaint?", a: "Escalated complaints bypass the local officer queue and are assigned directly to a Senior Desk Inspector who audits the case history and proposes alternative resolutions." },
    { q: "Are documents uploaded here secure?", a: "Yes, all files are encrypted in transit and at rest within the Ministry of Home Affairs Secure Credentials Vault, and are only accessible by assigned officers." }
  ];

  // Drag and drop handler
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      addFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      addFiles(e.target.files);
    }
  };

  const addFiles = (files) => {
    const uploaded = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      uploaded.push({
        name: file.name,
        size: (file.size / 1024).toFixed(1) + ' KB',
        type: file.type || 'unknown'
      });
    }
    setNewAttachments(prev => [...prev, ...uploaded]);
  };

  const removeFile = (idx) => {
    setNewAttachments(prev => prev.filter((_, i) => i !== idx));
  };

  // Submit new grievance
  const handleSubmitGrievance = (e) => {
    e.preventDefault();
    if (!newCategory) {
      setError('Please select a complaint category.');
      return;
    }
    if (!newSubject.trim()) {
      setError('Please enter a complaint subject.');
      return;
    }
    if (!newDescription.trim()) {
      setError('Please provide a detailed description of your issue.');
      return;
    }

    const randNum = Math.floor(100000 + Math.random() * 900000);
    const code = `GRV-2026-${randNum}`;
    setGeneratedId(code);

    const newTicket = {
      id: code,
      category: newCategory,
      subject: newSubject,
      description: newDescription,
      priority: newPriority,
      submissionDate: '04 Jun 2026',
      status: 'Submitted',
      assignedOfficer: 'Pending Officer Assignment',
      expectedResolutionDate: '09 June 2026',
      timeline: [
        { title: 'Complaint Submitted', desc: 'Grievance recorded in national portal.', date: '04 Jun 2026 · 03:34 PM', status: 'success' }
      ],
      chatHistory: [
        { id: 1, text: `Complaint registered under category "${newCategory}". An officer will contact you shortly.`, sender: 'officer', timestamp: '04 Jun 2026 · 03:34 PM' }
      ],
      resolution: null,
      escalated: false,
      feedback: null
    };

    setComplaints(prev => [newTicket, ...prev]);
    setWizardStep(4);
    setSuccess(`Grievance submitted successfully. Ticket ID: ${code}`);
  };

  // Clear Raise Complaint Form
  const resetRaiseForm = () => {
    setNewCategory('');
    setNewSubject('');
    setNewDescription('');
    setNewPriority('Medium');
    setNewAttachments([]);
    setWizardStep(1);
  };

  // Track Ticket ID Search
  const handleTrackSearch = (e) => {
    e.preventDefault();
    if (!trackIdInput.trim()) return;

    const query = trackIdInput.trim().toUpperCase();
    const found = complaints.find(c => c.id === query);
    if (found) {
      setActiveComplaintId(found.id);
      setActiveTab('details');
      setTrackIdInput('');
      setSuccess(`Tracking ticket details loaded.`);
    } else {
      setError(`No complaint found with ID: ${query}`);
    }
  };

  // Click quick navigation shortcuts
  const triggerQuickAction = (action) => {
    if (action === 'raise') {
      resetRaiseForm();
      setActiveTab('raise');
    } else if (action === 'track') {
      setActiveTab('overview');
      setTimeout(() => {
        const input = document.getElementById('quick-track-input');
        if (input) input.focus();
      }, 100);
    } else if (action === 'history') {
      setActiveTab('history');
    } else if (action === 'support') {
      const section = document.getElementById('support-section');
      if (section) section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Send Message Chat Box
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim() && chatAttachments.length === 0) return;

    let text = chatInput.trim();
    if (chatAttachments.length > 0) {
      const attachDesc = chatAttachments.map(f => `[Attachment: ${f.name}]`).join(' ');
      text = text ? `${text} ${attachDesc}` : attachDesc;
    }

    const newMsg = {
      id: Date.now(),
      text,
      sender: 'citizen',
      timestamp: 'Just now'
    };

    const updatedComplaints = complaints.map(c => {
      if (c.id === activeComplaint.id) {
        return {
          ...c,
          chatHistory: [...c.chatHistory, newMsg]
        };
      }
      return c;
    });

    setComplaints(updatedComplaints);
    setChatInput('');
    setChatAttachments([]);
    setChatTyping(true);

    // Smart bot responder simulation
    setTimeout(() => {
      setChatTyping(false);
      const query = text.toLowerCase();
      let replyText = "We have logged your query. Our team will review the details and respond shortly.";

      if (activeComplaint.status === 'Resolved') {
        replyText = "This grievance is currently closed. If you have further issues, please submit a new ticket or request reinvestigation.";
      } else if (query.includes('pending') || query.includes('status') || query.includes('when') || query.includes('how long')) {
        replyText = `Your ticket ${activeComplaint.id} is currently ${activeComplaint.status}. Our officers are checking the database entries. Expected resolution by ${activeComplaint.expectedResolutionDate}.`;
      } else if (query.includes('reschedule') || query.includes('visit') || query.includes('officer')) {
        replyText = "Verification appointments can also be rescheduled inside the Appointments tab. I will pass on this message to the field coordinator.";
      } else if (query.includes('pdf') || query.includes('document') || query.includes('upload') || query.includes('attached')) {
        replyText = "Additional documents noted and saved to the case vault. We are reviewing them now.";
      } else if (query.includes('escalat') || query.includes('delay') || query.includes('slow')) {
        replyText = "If you feel the resolution is taking too long, you can use the 'Escalate Grievance' action on this page to assign this to a senior officer.";
      }

      const replyMsg = {
        id: Date.now() + 1,
        text: replyText,
        sender: 'officer',
        timestamp: 'Just now'
      };

      setComplaints(prev => prev.map(c => {
        if (c.id === activeComplaint.id) {
          return {
            ...c,
            chatHistory: [...c.chatHistory, replyMsg]
          };
        }
        return c;
      }));
    }, 1200);
  };

  const handleChatFile = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setChatAttachments([{ name: file.name }]);
      setSuccess(`File staged: ${file.name}`);
    }
  };

  // Submit Feedback & rating
  const handleSubmitFeedback = (e) => {
    e.preventDefault();
    if (feedbackRating === 0) {
      setError('Please click on stars to rate your resolution experience.');
      return;
    }

    const updated = complaints.map(c => {
      if (c.id === activeComplaint.id) {
        return {
          ...c,
          feedback: {
            rating: feedbackRating,
            comments: feedbackComments || 'No comments provided.',
            solved: fbSolved || 'yes',
            helpful: fbHelpful || 'yes',
            recommend: fbRecommend || 'yes'
          }
        };
      }
      return c;
    });

    setComplaints(updated);
    setSuccess('Thank you for your valuable feedback! Rating recorded.');
    setFeedbackRating(0);
    setFeedbackComments('');
    setFbSolved('');
    setFbHelpful('');
    setFbRecommend('');
  };

  // Escalate Complaint Action
  const handleEscalateComplaint = (type) => {
    if (activeComplaint.status === 'Resolved') {
      setError('Cannot escalate a resolved complaint.');
      return;
    }

    let escalatedTimeline = [...activeComplaint.timeline];
    let dateStr = '04 Jun 2026 · 03:34 PM';
    
    escalatedTimeline.push({
      title: type === 'appeal' ? 'Resolution Appealed' : 'Escalated to Senior Desk',
      desc: type === 'appeal' 
        ? 'Citizen appealed the initial proposed solution. Transferred to supervisor.' 
        : 'Ticket escalated due to resolution delay. Assigned to Senior Inspector.',
      date: dateStr,
      status: 'warning'
    });

    const updated = complaints.map(c => {
      if (c.id === activeComplaint.id) {
        return {
          ...c,
          status: 'Escalated',
          assignedOfficer: 'Senior Desk Officer Verma',
          expectedResolutionDate: '07 June 2026',
          escalated: true,
          timeline: escalatedTimeline,
          chatHistory: [
            ...c.chatHistory,
            { id: Date.now(), text: `Grievance escalated. Action: ${type}. Assigned to Senior Officer Verma.`, sender: 'officer', timestamp: dateStr }
          ]
        };
      }
      return c;
    });

    setComplaints(updated);
    setSuccess('Grievance successfully escalated to national supervision panel.');
  };

  // Submit Support Ticket from Help Section
  const handleSupportTicketSubmit = (e) => {
    e.preventDefault();
    if (!supportTicketSubject.trim() || !supportTicketDesc.trim()) return;

    setSuccess(`Support Ticket #TIC-GEN-${Math.floor(1000 + Math.random() * 9000)} registered successfully.`);
    setSupportTicketSubject('');
    setSupportTicketDesc('');
  };

  // Download Complaint Report Simulator
  const handleDownloadReport = () => {
    const chatTranscript = activeComplaint.chatHistory
      .map(m => `${m.sender.toUpperCase()} [${m.timestamp}]: ${m.text}`)
      .join('\r\n');

    const timelineTranscript = activeComplaint.timeline
      .map(t => `- [${t.date}] ${t.title}: ${t.desc}`)
      .join('\r\n');

    const reportContent = `--------------------------------------------------------
BHARAT CENSUS REDRESSAL PORTAL
OFFICIAL GRIEVANCE REPORT
--------------------------------------------------------
Ticket ID: ${activeComplaint.id}
Category: ${activeComplaint.category}
Subject: ${activeComplaint.subject}
Submission Date: ${activeComplaint.submissionDate}
Priority Level: ${activeComplaint.priority}
Current Status: ${activeComplaint.status}
Assigned Officer: ${activeComplaint.assignedOfficer}
Expected Resolution: ${activeComplaint.expectedResolutionDate}

COMPLAINT DESCRIPTION:
"${activeComplaint.description}"

--------------------------------------------------------
PROCESSING MILESTONES TIMELINE:
${timelineTranscript}

--------------------------------------------------------
OFFICER & CITIZEN CONVERSATION LOGS:
${chatTranscript}

--------------------------------------------------------
RESOLUTION NOTES:
${activeComplaint.resolution ? `Summary: ${activeComplaint.resolution.summary}\r\nNotes: ${activeComplaint.resolution.notes}\r\nResolved On: ${activeComplaint.resolution.date}` : 'Under Review - Investigation In Progress'}

--------------------------------------------------------
METADATA SIGNATURE:
Report Generated On: 04 June 2026
Verified Registry Vault Sync: Hash_F89E23B
--------------------------------------------------------`;

    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Grievance_Report_${activeComplaint.id}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setSuccess(`Grievance report printed and downloaded: Grievance_Report_${activeComplaint.id}.txt`);
  };

  // Map Category IDs to Visual Config
  const categoryMeta = {
    'Registration Issue': {
      title: 'Registration Issue',
      desc: 'Errors in registration documents, incorrect information fields, or portal profile save failures.',
      examples: ['Unable To Register Profile', 'Profile Information Incorrect', 'Application Not Saving'],
      badgeClass: 'bg-indigo-50 border-indigo-150 text-indigo-700'
    },
    'Verification Issue': {
      title: 'Verification Issue',
      desc: 'Delays in official verification processes, officer rejections, or address disputes.',
      examples: ['Verification Pending for 15 Days', 'Verification Rejected', 'Officer Not Assigned'],
      badgeClass: 'bg-blue-50 border-blue-150 text-blue-700'
    },
    'Officer Complaint': {
      title: 'Officer Complaint',
      desc: 'Misconduct, unprofessional behavior, missed home appointments, or incorrect audits by personnel.',
      examples: ['Officer Missed Appointment', 'Officer Behavior Complaint', 'Incorrect Field Audit'],
      badgeClass: 'bg-red-50 border-red-150 text-red-700'
    },
    'Technical Issue': {
      title: 'Technical Issue',
      desc: 'Website glitches, portal connection drops, upload crashes, or credential login blocks.',
      examples: ['Cannot Upload Documents', 'Website Loading Timeout', 'Portal Login Errors'],
      badgeClass: 'bg-amber-50 border-amber-150 text-amber-700'
    }
  };

  // Convert status to percentage for horizontal tracking line
  const getProgressPercentage = (status) => {
    switch (status) {
      case 'Submitted': return 15;
      case 'Under Review': return 40;
      case 'Assigned':
      case 'Assigned To Officer': return 60;
      case 'Investigation In Progress':
      case 'Investigating': return 80;
      case 'Resolved': return 100;
      case 'Escalated': return 75; // Custom display
      default: return 15;
    }
  };

  return (
    <div className="flex-grow w-full bg-[#f8faff] min-h-screen pb-20 relative">
      
      {/* ══════════════════════════════════════════════════
          SECTION 1: PAGE HEADER
      ══════════════════════════════════════════════════ */}
      <div className="bg-[#0b2447] text-white py-12 px-6 sm:px-12 relative overflow-hidden shadow-lg border-b border-white/5">
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
                <Shield className="w-3 h-3 text-[#ff9933]" /> Ministry Redressal Sync
              </span>
              <span className="text-[10px] uppercase font-bold text-[#ff9933] bg-[#ff9933]/15 border border-[#ff9933]/25 px-3 py-0.5 rounded-full">
                Transparency & Accountability
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-2 flex items-center gap-2.5">
              Grievance Center
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl font-light">
              Raise complaints, track resolution progress, and communicate with support teams regarding census-related issues.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto shrink-0 justify-end flex-wrap">
            {/* Quick Track Input */}
            <form onSubmit={handleTrackSearch} className="relative w-full sm:w-56">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                id="quick-track-input"
                type="text" 
                placeholder="Track ID (e.g. GRV-2026-458796)..."
                value={trackIdInput}
                onChange={(e) => setTrackIdInput(e.target.value)}
                className="w-full bg-white/10 hover:bg-white/15 border border-white/20 rounded-xl pl-9 pr-4 py-2 text-xs outline-none focus:border-[#ff9933] transition-all text-white placeholder-white/50"
              />
            </form>
            <button
              onClick={() => triggerQuickAction('raise')}
              className="bg-[#ff9933] hover:bg-amber-600 text-white px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-sm active:scale-95 w-full sm:w-auto justify-center"
            >
              <Plus className="w-4 h-4" /> Create New Complaint
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

        {/* ══════════════════════════════════════════════════
            SECTION 2: GRIEVANCE OVERVIEW
        ══════════════════════════════════════════════════ */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Complaints', value: statsOverview.total, icon: FileText, color: '#0b2447', bg: 'rgba(11,36,71,0.06)' },
            { label: 'Open Grievances', value: statsOverview.open, icon: Clock, color: '#ff9933', bg: 'rgba(255,153,51,0.06)' },
            { label: 'Resolved Tickets', value: statsOverview.resolved, icon: CheckCircle, color: '#138808', bg: 'rgba(19,136,8,0.06)' },
            { label: 'Escalated Cases', value: statsOverview.escalated, icon: AlertTriangle, color: '#ef4444', bg: 'rgba(239,68,68,0.06)' }
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block">{stat.label}</span>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-[#0b2447] mt-1 flex items-center gap-1.5">
                    {stat.value}
                    {i === 1 && stat.value > 0 && (
                      <span className="w-2 h-2 bg-[#ff9933] rounded-full animate-ping shrink-0" />
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

        {/* ══════════════════════════════════════════════════
            PAGE SUB-NAVIGATION TABS
        ══════════════════════════════════════════════════ */}
        <div className="flex gap-2 border-b border-slate-200 pb-3 mb-6 flex-wrap">
          {[
            { id: 'overview', label: 'Grievance Dashboard' },
            { id: 'raise', label: 'Raise New Complaint' },
            { id: 'history', label: 'Complaint History Logs' },
            { id: 'details', label: `Active Complaint: ${activeComplaint.id}` }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-5 rounded-xl font-bold text-xs cursor-pointer transition-all border ${
                activeTab === tab.id
                  ? 'bg-[#0b2447] text-white border-[#0b2447]'
                  : 'bg-white text-slate-650 hover:bg-slate-50 border-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ══════════════════════════════════════════════════
            TAB PANEL 1: OVERVIEW DASHBOARD
        ══════════════════════════════════════════════════ */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT AREA: Tracking search & History list (8 columns) */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Tracker Quick Search Box */}
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                <div>
                  <h4 className="font-extrabold text-sm text-[#0b2447] flex items-center gap-1.5">
                    <Sliders className="w-4.5 h-4.5 text-[#ff9933]" /> Track Grievance Status
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Quickly query a registered Complaint ID to check timelines and message history.</p>
                </div>

                <form onSubmit={handleTrackSearch} className="flex gap-3">
                  <input 
                    type="text" 
                    placeholder="Enter Complaint ID (e.g. GRV-2026-458796)..."
                    value={trackIdInput}
                    onChange={(e) => setTrackIdInput(e.target.value)}
                    className="flex-grow bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-semibold outline-none focus:border-[#0b2447] text-[#0b2447]"
                  />
                  <button 
                    type="submit"
                    className="bg-[#0b2447] hover:bg-[#1f3e6d] text-white px-6 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
                  >
                    Track Status
                  </button>
                </form>

                {/* Interactive Horizontal Progress Tracker for Selected Complaint */}
                <div className="p-4 bg-slate-50/50 border border-slate-150 rounded-2xl space-y-4">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <div>
                      <span className="text-[9px] text-slate-400 block">CURRENT SEARCHED CASE</span>
                      <button 
                        onClick={() => {
                          setActiveComplaintId(activeComplaint.id);
                          setActiveTab('details');
                        }}
                        className="text-primary hover:underline flex items-center gap-0.5 text-xs text-[#0b2447]"
                      >
                        {activeComplaint.id} : {activeComplaint.subject} <ArrowUpRight className="w-3.5 h-3.5 text-[#ff9933]" />
                      </button>
                    </div>
                    <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded border ${
                      activeComplaint.status === 'Resolved' ? 'bg-green-50 border-green-200 text-green-700' :
                      activeComplaint.status === 'Escalated' ? 'bg-red-50 border-red-200 text-red-700' :
                      'bg-amber-50 border-amber-250 text-amber-800'
                    }`}>
                      {activeComplaint.status}
                    </span>
                  </div>

                  {/* Horizontal Timeline Tracker */}
                  <div className="pt-2">
                    <div className="relative w-full h-2 bg-slate-200 rounded-full">
                      <div 
                        className={`absolute top-0 left-0 h-full rounded-full transition-all duration-500 ${
                          activeComplaint.status === 'Resolved' ? 'bg-green-600' :
                          activeComplaint.status === 'Escalated' ? 'bg-red-500' : 'bg-[#ff9933]'
                        }`}
                        style={{ width: `${getProgressPercentage(activeComplaint.status)}%` }}
                      />
                      <div className="absolute top-1/2 -translate-y-1/2 left-0 w-3 h-3 bg-green-600 border-2 border-white rounded-full" title="Submitted" />
                      <div className={`absolute top-1/2 -translate-y-1/2 left-[40%] w-3 h-3 border-2 border-white rounded-full ${
                        getProgressPercentage(activeComplaint.status) >= 40 ? 'bg-green-600' : 'bg-slate-350'
                      }`} title="Under Review" />
                      <div className={`absolute top-1/2 -translate-y-1/2 left-[60%] w-3 h-3 border-2 border-white rounded-full ${
                        getProgressPercentage(activeComplaint.status) >= 60 ? 'bg-[#ff9933]' : 'bg-slate-350'
                      }`} title="Officer Assigned" />
                      <div className={`absolute top-1/2 -translate-y-1/2 left-[80%] w-3 h-3 border-2 border-white rounded-full ${
                        getProgressPercentage(activeComplaint.status) >= 80 ? 'bg-[#ff9933]' : 'bg-slate-350'
                      }`} title="Investigation" />
                      <div className={`absolute top-1/2 -translate-y-1/2 right-0 w-3 h-3 border-2 border-white rounded-full ${
                        activeComplaint.status === 'Resolved' ? 'bg-green-600' : 'bg-slate-350'
                      }`} title="Resolved" />
                    </div>
                    
                    <div className="flex justify-between items-center text-[8px] font-bold text-slate-400 mt-2">
                      <span>Submitted</span>
                      <span className="pl-6">Under Review</span>
                      <span>Officer Assigned</span>
                      <span>Investigating</span>
                      <span>Resolved</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Simplified complaint summary table */}
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-extrabold text-sm text-[#0b2447]">Recent Grievances</h4>
                  <button 
                    onClick={() => setActiveTab('history')}
                    className="text-xs text-primary hover:underline font-bold text-[#ff9933]"
                  >
                    View All Logs
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-[10px] font-semibold text-slate-650">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 uppercase text-[8px] font-bold tracking-wider">
                        <th className="py-2.5">ID</th>
                        <th>Category</th>
                        <th>Subject</th>
                        <th>Date Submitted</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {complaints.slice(0, 3).map((comp) => (
                        <tr key={comp.id} className="hover:bg-slate-50/50">
                          <td className="py-3.5 font-bold text-[#0b2447]">{comp.id}</td>
                          <td>
                            <span className="text-[8px] bg-slate-100 px-2 py-0.5 rounded font-bold">{comp.category}</span>
                          </td>
                          <td className="truncate max-w-[150px] font-semibold text-[#0b2447]">{comp.subject}</td>
                          <td>{comp.submissionDate}</td>
                          <td>
                            <span className={`text-[8px] font-extrabold px-2 py-0.5 rounded ${
                              comp.status === 'Resolved' ? 'bg-green-50 text-green-600' :
                              comp.status === 'Escalated' ? 'bg-red-50 text-red-500' : 'bg-amber-50 text-amber-700'
                            }`}>
                              {comp.status}
                            </span>
                          </td>
                          <td>
                            <button
                              onClick={() => {
                                setActiveComplaintId(comp.id);
                                setActiveTab('details');
                              }}
                              className="text-blue-600 hover:text-blue-800 font-bold"
                            >
                              Manage
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* SECTION 4: COMPLAINT CATEGORIES INFORMATION CARD */}
              <div className="space-y-4">
                <h4 className="font-extrabold text-sm text-[#0b2447]">Understand Complaint Categories</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.keys(categoryMeta).map((key) => {
                    const info = categoryMeta[key];
                    return (
                      <div key={key} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3">
                        <div className="flex items-center justify-between">
                          <span className={`text-[9px] font-extrabold uppercase px-2.5 py-0.5 rounded border ${info.badgeClass}`}>
                            {info.title}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 leading-relaxed font-semibold">{info.desc}</p>
                        <div className="bg-slate-50/50 p-2.5 rounded-xl border border-slate-150">
                          <span className="text-[8px] font-extrabold text-slate-400 uppercase tracking-wide block mb-1">Common Examples:</span>
                          <ul className="list-disc list-inside text-[9px] text-[#0b2447] space-y-0.5">
                            {info.examples.map((ex, idx) => (
                              <li key={idx} className="font-semibold">{ex}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* RIGHT SIDEBAR: Actions, rating and FAQ (4 columns) */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* SECTION 13: QUICK ACTIONS PANEL */}
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4">
                <h4 className="font-extrabold text-sm text-[#0b2447] border-b border-slate-100 pb-2">Quick Actions Shortcuts</h4>
                <div className="flex flex-col gap-2.5">
                  <button 
                    onClick={() => triggerQuickAction('raise')}
                    className="w-full bg-[#0b2447] hover:bg-[#1f3e6d] text-white text-xs font-bold py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                  >
                    Raise New Grievance <Plus className="w-4 h-4 text-[#ff9933]" />
                  </button>
                  <button 
                    onClick={() => triggerQuickAction('track')}
                    className="w-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    Search Ticket ID <Search className="w-4 h-4 text-slate-400" />
                  </button>
                  <button 
                    onClick={() => triggerQuickAction('history')}
                    className="w-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    Browse History logs <Clock className="w-4 h-4 text-slate-400" />
                  </button>
                  <button 
                    onClick={handleDownloadReport}
                    className="w-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    Download Complaint Report <Download className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
              </div>

              {/* SECTION 14: HELP & GENERAL SUPPORT INFO */}
              <div id="support-section" className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4">
                <h4 className="font-extrabold text-sm text-[#0b2447] border-b border-slate-100 pb-2">Support Desk Contact</h4>
                
                <div className="space-y-2 text-[10px] font-semibold text-slate-650">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#ff9933] shrink-0" />
                    <span>Toll Free Hotline: 1800-11-2026</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#ff9933] shrink-0" />
                    <span>Email Support: grievance@census.gov.in</span>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-4 space-y-3">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wide block">Submit Support Ticket</span>
                  <form onSubmit={handleSupportTicketSubmit} className="space-y-2.5 text-[10px]">
                    <input 
                      type="text" 
                      placeholder="Ticket subject..."
                      value={supportTicketSubject}
                      onChange={(e) => setSupportTicketSubject(e.target.value)}
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 outline-none font-bold text-[#0b2447]"
                    />
                    <textarea 
                      placeholder="Explain your technical query details..."
                      rows="2"
                      value={supportTicketDesc}
                      onChange={(e) => setSupportTicketDesc(e.target.value)}
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none resize-none font-bold text-[#0b2447]"
                    />
                    <button 
                      type="submit"
                      className="w-full bg-[#0b2447] hover:bg-[#1f3e6d] text-white text-[10px] font-bold py-2 rounded-xl transition-colors cursor-pointer"
                    >
                      File Support Ticket
                    </button>
                  </form>
                </div>

                {/* Mini FAQs Accordion */}
                <div className="border-t border-slate-100 pt-4 space-y-2">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wide block mb-2">Frequently Asked Questions</span>
                  <div className="space-y-2">
                    {faqData.map((item, idx) => (
                      <div key={idx} className="border border-slate-150 rounded-xl">
                        <button
                          type="button"
                          onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                          className="w-full text-left px-3 py-2 flex justify-between items-center text-[10px] font-bold text-[#0b2447]"
                        >
                          <span>{item.q}</span>
                          <ChevronRight className={`w-3.5 h-3.5 text-slate-400 transition-all ${activeFaq === idx ? 'rotate-90' : ''}`} />
                        </button>
                        {activeFaq === idx && (
                          <div className="px-3 pb-2.5 pt-0.5 text-[9.5px] leading-relaxed text-slate-550 border-t border-slate-100 font-semibold bg-slate-50/50">
                            {item.a}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ══════════════════════════════════════════════════
            TAB PANEL 2: RAISE COMPLAINT FORM WIZARD
        ══════════════════════════════════════════════════ */}
        {activeTab === 'raise' && (
          <div className="max-w-3xl mx-auto bg-white border border-slate-100 rounded-3xl shadow-sm p-6 sm:p-8">
            <div className="border-b border-slate-150 pb-4 mb-6">
              <h3 className="text-lg font-extrabold text-[#0b2447]">Submit Grievance Form</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Please provide accurate information regarding census registry errors or field officer discrepancies.</p>
            </div>

            {/* Stepper indicators */}
            <div className="flex items-center justify-between mb-8 text-[10px] font-bold max-w-md mx-auto">
              <div className="flex flex-col items-center gap-1">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center border text-xs ${
                  wizardStep >= 1 ? 'bg-[#0b2447] text-white border-[#0b2447]' : 'bg-slate-100 border-slate-200 text-slate-450'
                }`}>1</span>
                <span className={wizardStep >= 1 ? 'text-[#0b2447]' : 'text-slate-400'}>Category</span>
              </div>
              <div className="flex-grow h-0.5 bg-slate-200 mx-2" />
              <div className="flex flex-col items-center gap-1">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center border text-xs ${
                  wizardStep >= 2 ? 'bg-[#0b2447] text-white border-[#0b2447]' : 'bg-slate-100 border-slate-200 text-slate-450'
                }`}>2</span>
                <span className={wizardStep >= 2 ? 'text-[#0b2447]' : 'text-slate-400'}>Details</span>
              </div>
              <div className="flex-grow h-0.5 bg-slate-200 mx-2" />
              <div className="flex flex-col items-center gap-1">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center border text-xs ${
                  wizardStep >= 3 ? 'bg-[#0b2447] text-white border-[#0b2447]' : 'bg-slate-100 border-slate-200 text-slate-450'
                }`}>3</span>
                <span className={wizardStep >= 3 ? 'text-[#0b2447]' : 'text-slate-400'}>Attachments</span>
              </div>
            </div>

            {/* STEP 1: CATEGORY SELECTION */}
            {wizardStep === 1 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-2">Complaint Category</label>
                  <select 
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold outline-none focus:border-[#0b2447] text-[#0b2447]"
                  >
                    <option value="">-- Choose Category --</option>
                    <option value="Registration Issue">Registration Issue</option>
                    <option value="Verification Issue">Verification Issue</option>
                    <option value="Officer Complaint">Officer Complaint</option>
                    <option value="Technical Issue">Technical Issue</option>
                  </select>
                </div>

                {newCategory && (
                  <div className="p-4 bg-slate-50 border border-slate-150 rounded-2xl text-[10px] leading-relaxed text-slate-650 space-y-2">
                    <span className="font-extrabold text-[#0b2447] uppercase tracking-wide">Category scope:</span>
                    <p>{categoryMeta[newCategory]?.desc}</p>
                  </div>
                )}

                <div className="flex justify-end pt-4">
                  <button 
                    onClick={() => {
                      if (!newCategory) {
                        setError('Please select a category first.');
                        return;
                      }
                      setWizardStep(2);
                    }}
                    className="bg-[#0b2447] hover:bg-[#1f3e6d] text-white px-6 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                  >
                    Next Step <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: SUBJECT & DESCRIPTION */}
            {wizardStep === 2 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-2">Complaint Subject</label>
                  <input 
                    type="text"
                    placeholder="Example: Unable To Complete Verification"
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold outline-none focus:border-[#0b2447] text-[#0b2447]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-2">Complaint Description</label>
                  <textarea 
                    rows="5"
                    placeholder="Explain the issue in detail. Example: I completed document submission but my verification status has not changed for 15 days."
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-semibold outline-none focus:border-[#0b2447] text-[#0b2447] resize-none"
                  />
                </div>

                <div className="flex justify-between pt-4">
                  <button 
                    onClick={() => setWizardStep(1)}
                    className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-650 px-6 py-2 rounded-xl text-xs font-bold transition-all"
                  >
                    Back
                  </button>
                  <button 
                    onClick={() => {
                      if (!newSubject.trim()) {
                        setError('Please provide a subject.');
                        return;
                      }
                      if (!newDescription.trim()) {
                        setError('Please provide a detailed description.');
                        return;
                      }
                      setWizardStep(3);
                    }}
                    className="bg-[#0b2447] hover:bg-[#1f3e6d] text-white px-6 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                  >
                    Next Step <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: ATTACHMENTS & PRIORITY */}
            {wizardStep === 3 && (
              <form onSubmit={handleSubmitGrievance} className="space-y-6">
                
                {/* Priority Selection */}
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-2">Priority Selection</label>
                  <div className="flex gap-4">
                    {['Low', 'Medium', 'High'].map((prio) => (
                      <button
                        key={prio}
                        type="button"
                        onClick={() => setNewPriority(prio)}
                        className={`flex-grow py-2.5 px-4 rounded-xl border font-bold text-xs cursor-pointer transition-all ${
                          newPriority === prio
                            ? prio === 'High' ? 'bg-red-550 border-red-550 text-white bg-red-650 border-red-650' :
                              prio === 'Medium' ? 'bg-[#ff9933] border-[#ff9933] text-white' :
                              'bg-[#0b2447] border-[#0b2447] text-white'
                            : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-600'
                        }`}
                      >
                        {prio} Priority
                      </button>
                    ))}
                  </div>
                </div>

                {/* Drag and Drop Attachment upload */}
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-2">Attachments (Screenshots, PDFs, Images)</label>
                  
                  <div 
                    onDragEnter={handleDrag} 
                    onDragOver={handleDrag} 
                    onDragLeave={handleDrag} 
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                      dragActive ? 'border-[#ff9933] bg-[#ff9933]/5' : 'border-slate-300 hover:border-slate-400 bg-slate-50/50'
                    }`}
                  >
                    <UploadCloud className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <span className="block text-[11px] font-bold text-slate-700">Drag & Drop files here, or click to upload</span>
                    <span className="block text-[9px] text-slate-400 mt-1">Accepts images, screenshots, PDFs up to 5MB</span>
                    <input 
                      type="file" 
                      multiple 
                      onChange={handleFileChange}
                      className="hidden" 
                      id="wizard-file-input"
                    />
                    <label 
                      htmlFor="wizard-file-input" 
                      className="mt-3.5 inline-block bg-white hover:bg-slate-50 border border-slate-200 px-4 py-1.5 rounded-lg text-[10px] font-bold text-slate-650 cursor-pointer"
                    >
                      Browse Files
                    </label>
                  </div>

                  {/* Attachment Previews */}
                  {newAttachments.length > 0 && (
                    <div className="mt-4 space-y-2 bg-slate-50/50 border border-slate-150 p-4 rounded-2xl">
                      <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wide block mb-1">Attached Files Preview ({newAttachments.length}):</span>
                      {newAttachments.map((file, idx) => (
                        <div key={idx} className="flex justify-between items-center text-[10px] font-semibold text-slate-650 bg-white border border-slate-150 p-2 rounded-xl">
                          <span className="truncate max-w-[200px] text-[#0b2447]">{file.name} ({file.size})</span>
                          <button 
                            type="button" 
                            onClick={() => removeFile(idx)}
                            className="text-red-500 hover:text-red-700 font-bold"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex justify-between pt-4 border-t border-slate-150">
                  <button 
                    type="button"
                    onClick={() => setWizardStep(2)}
                    className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-650 px-6 py-2 rounded-xl text-xs font-bold transition-all"
                  >
                    Back
                  </button>
                  <button 
                    type="submit"
                    className="bg-[#138808] hover:bg-green-700 text-white px-8 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-sm active:scale-95"
                  >
                    Submit Grievance <CheckCircle className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* STEP 4: SUCCESS CONFIRMATION */}
            {wizardStep === 4 && (
              <div className="text-center py-8 space-y-6">
                <div className="w-16 h-16 rounded-full bg-green-50 text-green-600 border border-green-200 flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle className="w-9 h-9" />
                </div>
                
                <div className="space-y-1.5">
                  <h4 className="text-lg font-extrabold text-[#0b2447]">Grievance Registered Successfully</h4>
                  <p className="text-[11px] text-slate-500 max-w-md mx-auto">
                    Your complaint has been synchronized with the credentials Redressal panel. Keep the ID below for reference.
                  </p>
                </div>

                {/* Complaint ID Card */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl py-3 px-6 max-w-sm mx-auto flex items-center justify-between">
                  <div>
                    <span className="text-[8px] text-slate-400 block font-bold uppercase tracking-wider">COMPLAINT ID</span>
                    <span className="text-sm font-mono font-bold text-[#0b2447]">{generatedId}</span>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(generatedId);
                      setSuccess('Complaint ID copied to clipboard!');
                    }}
                    className="text-[9px] font-bold text-primary hover:underline text-blue-600 bg-blue-50 px-2 py-1 rounded"
                  >
                    Copy
                  </button>
                </div>

                <div className="flex justify-center gap-3 pt-4 border-t border-slate-100 max-w-md mx-auto">
                  <button 
                    onClick={() => {
                      setActiveComplaintId(generatedId);
                      setActiveTab('details');
                    }}
                    className="bg-[#0b2447] hover:bg-[#1f3e6d] text-white px-5 py-2 rounded-xl text-xs font-bold shadow-sm transition-colors cursor-pointer"
                  >
                    Track Status
                  </button>
                  <button 
                    onClick={() => {
                      resetRaiseForm();
                      setActiveTab('overview');
                    }}
                    className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-650 px-5 py-2 rounded-xl text-xs font-bold transition-all"
                  >
                    Go Dashboard
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════════════
            TAB PANEL 3: COMPLAINT HISTORY LOGS
        ══════════════════════════════════════════════════ */}
        {activeTab === 'history' && (
          <div className="bg-white border border-slate-100 rounded-3xl shadow-sm p-6 space-y-6">
            <div className="flex justify-between items-center border-b border-slate-150 pb-4 flex-wrap gap-4">
              <div>
                <h3 className="text-sm font-extrabold text-[#0b2447]">Redressal History Log Sheet</h3>
                <p className="text-[10px] text-slate-400 mt-0.5 font-semibold">Total entries: {filteredHistory.length}</p>
              </div>

              {/* Filters Panel */}
              <div className="flex gap-2.5 flex-wrap font-bold text-[10px]">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                    type="text" 
                    placeholder="Search ID, subject..."
                    value={historySearch}
                    onChange={(e) => setHistorySearch(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-1.5 outline-none font-bold text-[#0b2447]"
                  />
                </div>

                <select 
                  value={historyFilter}
                  onChange={(e) => setHistoryFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 outline-none cursor-pointer text-slate-650"
                >
                  <option value="all">All Statuses</option>
                  <option value="open">All Open</option>
                  <option value="Submitted">Submitted</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Escalated">Escalated</option>
                </select>

                <select 
                  value={historySort}
                  onChange={(e) => setHistorySort(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 outline-none cursor-pointer text-slate-650"
                >
                  <option value="latest">Latest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>
            </div>

            {/* History Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-[10px] font-semibold text-slate-650">
                <thead>
                  <tr className="border-b border-slate-150 text-slate-400 uppercase text-[8px] font-bold tracking-wider">
                    <th className="py-3">Complaint ID</th>
                    <th>Category</th>
                    <th>Subject</th>
                    <th>Priority</th>
                    <th>Submission Date</th>
                    <th>Assigned Officer</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredHistory.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="py-8 text-center text-slate-400 italic">No matching history logs registered in census registry.</td>
                    </tr>
                  ) : (
                    filteredHistory.map((comp) => (
                      <tr key={comp.id} className="hover:bg-slate-50/50">
                        <td className="py-3.5 font-bold text-[#0b2447]">{comp.id}</td>
                        <td>
                          <span className={`text-[8px] px-2 py-0.5 rounded font-bold uppercase ${
                            comp.category === 'Officer Complaint' ? 'bg-red-50 text-red-700' :
                            comp.category === 'Verification Issue' ? 'bg-blue-50 text-blue-700' : 'bg-slate-100'
                          }`}>{comp.category}</span>
                        </td>
                        <td className="truncate max-w-[200px] font-semibold text-[#0b2447]">{comp.subject}</td>
                        <td>
                          <span className={`text-[8px] font-bold px-2 py-0.5 rounded ${
                            comp.priority === 'High' ? 'bg-red-50 text-red-650 font-extrabold' :
                            comp.priority === 'Medium' ? 'bg-amber-50 text-amber-700' : 'bg-slate-100'
                          }`}>{comp.priority}</span>
                        </td>
                        <td>{comp.submissionDate}</td>
                        <td className="font-semibold text-slate-700">{comp.assignedOfficer}</td>
                        <td>
                          <span className={`text-[8px] font-extrabold px-2.5 py-0.5 rounded border uppercase ${
                            comp.status === 'Resolved' ? 'bg-green-50 border-green-200 text-green-700' :
                            comp.status === 'Escalated' ? 'bg-red-50 border-red-200 text-red-600' : 'bg-amber-50 border-amber-250 text-amber-800'
                          }`}>
                            {comp.status}
                          </span>
                        </td>
                        <td>
                          <button
                            onClick={() => {
                              setActiveComplaintId(comp.id);
                              setActiveTab('details');
                            }}
                            className="bg-[#0b2447] hover:bg-[#1f3e6d] text-white px-3 py-1 rounded-lg text-[9px] font-bold cursor-pointer"
                          >
                            Track & Chat
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════
            TAB PANEL 4: ACTIVE COMPLAINT DETAILS & CHAT PIPELINE
        ══════════════════════════════════════════════════ */}
        {activeTab === 'details' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT DETAILS COLUMN: Tracker, Details Card, officer notes (8 columns) */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* SECTION 5: TRACK COMPLAINT (TIMELINE STATUS BAR) */}
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                <div className="flex justify-between items-center text-xs font-bold">
                  <div>
                    <span className="text-[9px] text-slate-400 block">CURRENT TICKET IN FOCUS</span>
                    <h4 className="text-sm font-extrabold text-[#0b2447]">{activeComplaint.id} : {activeComplaint.subject}</h4>
                  </div>
                  <span className={`text-[9px] uppercase font-bold px-2.5 py-0.5 rounded border ${
                    activeComplaint.status === 'Resolved' ? 'bg-green-50 border-green-200 text-green-700' :
                    activeComplaint.status === 'Escalated' ? 'bg-red-50 border-red-200 text-red-700' :
                    'bg-amber-50 border-amber-250 text-amber-800'
                  }`}>
                    {activeComplaint.status}
                  </span>
                </div>

                <div className="pt-2">
                  <div className="relative w-full h-2 bg-slate-200 rounded-full">
                    <div 
                      className={`absolute top-0 left-0 h-full rounded-full transition-all duration-500 ${
                        activeComplaint.status === 'Resolved' ? 'bg-green-600' :
                        activeComplaint.status === 'Escalated' ? 'bg-red-500' : 'bg-[#ff9933]'
                      }`}
                      style={{ width: `${getProgressPercentage(activeComplaint.status)}%` }}
                    />
                    <div className="absolute top-1/2 -translate-y-1/2 left-0 w-3 h-3 bg-green-600 border-2 border-white rounded-full" title="Submitted" />
                    <div className={`absolute top-1/2 -translate-y-1/2 left-[40%] w-3 h-3 border-2 border-white rounded-full ${
                      getProgressPercentage(activeComplaint.status) >= 40 ? 'bg-green-600' : 'bg-slate-350'
                    }`} title="Under Review" />
                    <div className={`absolute top-1/2 -translate-y-1/2 left-[60%] w-3 h-3 border-2 border-white rounded-full ${
                      getProgressPercentage(activeComplaint.status) >= 60 ? 'bg-[#ff9933]' : 'bg-slate-350'
                    }`} title="Officer Assigned" />
                    <div className={`absolute top-1/2 -translate-y-1/2 left-[80%] w-3 h-3 border-2 border-white rounded-full ${
                      getProgressPercentage(activeComplaint.status) >= 80 ? 'bg-[#ff9933]' : 'bg-slate-350'
                    }`} title="Investigation" />
                    <div className={`absolute top-1/2 -translate-y-1/2 right-0 w-3 h-3 border-2 border-white rounded-full ${
                      activeComplaint.status === 'Resolved' ? 'bg-green-600' : 'bg-slate-350'
                    }`} title="Resolved" />
                  </div>
                  
                  <div className="flex justify-between items-center text-[8px] font-bold text-slate-400 mt-2">
                    <span>Submitted</span>
                    <span className="pl-6">Under Review</span>
                    <span>Officer Assigned</span>
                    <span>Investigating</span>
                    <span>Resolved</span>
                  </div>
                </div>
              </div>

              {/* SECTION 6: COMPLAINT DETAILS PANEL CARD */}
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <h4 className="font-extrabold text-sm text-[#0b2447]">Grievance Metadata Parameters</h4>
                  <button 
                    onClick={handleDownloadReport}
                    className="text-xs text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" /> Download Report PDF
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-[10px] font-bold text-slate-600">
                  <div className="bg-slate-50/50 p-3 border border-slate-150 rounded-xl">
                    <span className="text-[8px] text-slate-400 uppercase tracking-wide block mb-0.5">COMPLAINT ID</span>
                    <span className="font-mono text-xs text-[#0b2447]">{activeComplaint.id}</span>
                  </div>
                  <div className="bg-slate-50/50 p-3 border border-slate-150 rounded-xl">
                    <span className="text-[8px] text-slate-400 uppercase tracking-wide block mb-0.5">CATEGORY</span>
                    <span className="text-[#0b2447]">{activeComplaint.category}</span>
                  </div>
                  <div className="bg-slate-50/50 p-3 border border-slate-150 rounded-xl">
                    <span className="text-[8px] text-slate-400 uppercase tracking-wide block mb-0.5">SUBMISSION DATE</span>
                    <span className="text-[#0b2447]">{activeComplaint.submissionDate}</span>
                  </div>
                  <div className="bg-slate-50/50 p-3 border border-slate-150 rounded-xl">
                    <span className="text-[8px] text-slate-400 uppercase tracking-wide block mb-0.5">ASSIGNED OFFICERS</span>
                    <span className="text-[#0b2447]">{activeComplaint.assignedOfficer}</span>
                  </div>
                  <div className="bg-slate-50/50 p-3 border border-slate-150 rounded-xl">
                    <span className="text-[8px] text-slate-400 uppercase tracking-wide block mb-0.5">CURRENT TICKET STATUS</span>
                    <span className="text-[#0b2447]">{activeComplaint.status}</span>
                  </div>
                  <div className="bg-slate-50/50 p-3 border border-slate-150 rounded-xl">
                    <span className="text-[8px] text-slate-400 uppercase tracking-wide block mb-0.5">EXPECTED RESOLUTION</span>
                    <span className="text-[#0b2447]">{activeComplaint.expectedResolutionDate}</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-150 text-[10px] leading-relaxed text-slate-650">
                  <span className="font-extrabold text-[#0b2447] uppercase tracking-wide block mb-1">ORIGINAL CITIZEN BRIEF:</span>
                  <p className="italic">"{activeComplaint.description}"</p>
                </div>
              </div>

              {/* SECTION 7: OFFICER COMMUNICATION CHAT PIPELINE */}
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 flex flex-col justify-between h-[450px]">
                
                {/* Chat Header */}
                <div className="border-b border-slate-150 pb-3 flex justify-between items-center shrink-0">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[#0b2447] font-bold border border-[#0b2447]/10">
                      RC
                    </div>
                    <div>
                      <h4 className="font-extrabold text-xs text-[#0b2447]">{activeComplaint.assignedOfficer}</h4>
                      <span className="text-[8px] text-slate-450 uppercase font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> Active Case Support Officer
                      </span>
                    </div>
                  </div>

                  <span className="text-[8px] uppercase font-bold bg-[#ff9933]/15 text-[#ff9933] border border-[#ff9933]/25 px-3 py-1 rounded-full">
                    Protected National Connection
                  </span>
                </div>

                {/* Chat Messages Console */}
                <div className="flex-grow overflow-y-auto py-4 space-y-3.5 text-[10px] font-semibold pr-2">
                  {activeComplaint.chatHistory.map((msg) => (
                    <div 
                      key={msg.id} 
                      className={`p-3 rounded-2xl leading-relaxed max-w-[80%] border ${
                        msg.sender === 'citizen' 
                          ? 'bg-[#0b2447] border-[#0b2447] text-white ml-auto shadow-[2px_2px_4px_rgba(0,0,0,0.05)]' 
                          : 'bg-slate-50 border-slate-150 text-slate-700'
                      }`}
                    >
                      <div className="flex justify-between items-center text-[7.5px] opacity-70 mb-1 font-bold">
                        <span>{msg.sender === 'citizen' ? 'You (Citizen)' : activeComplaint.assignedOfficer}</span>
                        <span>{msg.timestamp}</span>
                      </div>
                      <p className="text-xs">{msg.text}</p>
                    </div>
                  ))}
                  
                  {chatTyping && (
                    <div className="text-[8px] font-bold text-slate-400 bg-slate-50 border border-slate-150 p-2.5 rounded-xl max-w-[120px] animate-pulse">
                      Officer typing...
                    </div>
                  )}

                  <div ref={chatEndRef} />
                </div>

                {/* Staged file list */}
                {chatAttachments.length > 0 && (
                  <div className="bg-slate-50 p-2 rounded-xl mb-2 flex items-center justify-between text-[8px] font-bold border border-slate-150">
                    <span>Staged Upload: {chatAttachments[0].name}</span>
                    <button onClick={() => setChatAttachments([])} className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Chat input form */}
                <form onSubmit={handleSendMessage} className="flex gap-2 pt-3 border-t border-slate-150 shrink-0">
                  <input 
                    type="text" 
                    placeholder="Type message to redressal officer..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    className="flex-grow bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs outline-none focus:border-[#0b2447] font-semibold text-[#0b2447]"
                  />
                  <input 
                    type="file" 
                    id="chat-file-input" 
                    className="hidden" 
                    onChange={handleChatFile}
                  />
                  <label 
                    htmlFor="chat-file-input"
                    className="bg-white hover:bg-slate-50 border border-slate-200 p-2 rounded-xl flex items-center justify-center cursor-pointer text-slate-500"
                    title="Upload support document"
                  >
                    <UploadCloud className="w-4 h-4" />
                  </label>
                  <button 
                    type="submit"
                    className="bg-[#0b2447] hover:bg-[#1f3e6d] text-white p-2 rounded-xl flex items-center justify-center transition-all cursor-pointer"
                  >
                    <Send className="w-4 h-4 text-[#ff9933]" />
                  </button>
                </form>

              </div>

            </div>

            {/* RIGHT DETAILS COLUMN: Timeline, Resolution summary, Escalation and feedback rating (4 columns) */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* SECTION 8: COMPLAINT PROCESSING TIMELINE */}
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
                <h4 className="font-extrabold text-sm text-[#0b2447] mb-2">Grievance Event Logs</h4>
                <p className="text-[10px] text-slate-400 mb-6">Real-time audit checkpoints for investigation milestones.</p>

                <div className="relative pl-5 flex flex-col gap-0 border-l border-slate-200 text-[10px] ml-2 font-bold text-slate-500">
                  {activeComplaint.timeline.map((item, idx) => (
                    <div key={idx} className="relative pb-5 last:pb-0">
                      <div className={`absolute -left-[27px] top-0.5 w-3.5 h-3.5 rounded-full border-2 border-white flex items-center justify-center text-white ${
                        item.status === 'success' ? 'bg-green-600' :
                        item.status === 'info' ? 'bg-[#ff9933]' :
                        item.status === 'warning' ? 'bg-red-500' : 'bg-blue-600'
                      }`}>
                        <Check className="w-1.5 h-1.5" />
                      </div>
                      <span className="block text-[8px] text-slate-400 font-bold">{item.date}</span>
                      <h5 className="text-[#0b2447] text-[11px] mt-0.5">{item.title}</h5>
                      <p className="text-slate-500 text-[9px] font-medium leading-relaxed mt-0.5">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 10: RESOLUTION CENTER */}
              {activeComplaint.status === 'Resolved' && activeComplaint.resolution && (
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-3.5">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <h4 className="font-extrabold text-sm text-[#0b2447] flex items-center gap-1.5">
                      <CheckCircle className="w-4.5 h-4.5 text-[#138808]" /> Resolution Summary
                    </h4>
                    <span className="text-[8px] bg-green-50 border border-green-200 text-green-700 px-2 py-0.5 rounded font-extrabold uppercase">Resolved</span>
                  </div>

                  <div className="space-y-3 text-[10px] font-semibold text-slate-650">
                    <div>
                      <span className="text-[8px] text-slate-400 uppercase tracking-wide block mb-0.5">DECISION STATEMENT</span>
                      <p className="text-[#0b2447] text-xs font-bold leading-snug">{activeComplaint.resolution.summary}</p>
                    </div>
                    <div>
                      <span className="text-[8px] text-slate-400 uppercase tracking-wide block mb-0.5">OFFICER REDRESSAL NOTES</span>
                      <p className="bg-slate-50 p-3 border border-slate-150 rounded-xl leading-relaxed">{activeComplaint.resolution.notes}</p>
                    </div>
                    <div className="flex justify-between items-center text-[9px] text-slate-400">
                      <span>Closed on: {activeComplaint.resolution.date}</span>
                      <span>Verified: Registry Vault Sync</span>
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 11: ESCALATION CENTER */}
              {activeComplaint.status !== 'Resolved' && (
                <div className="bg-white rounded-3xl border border-[#ef4444]/20 shadow-sm p-6 space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <h4 className="font-extrabold text-sm text-[#0b2447] flex items-center gap-1.5">
                      <AlertTriangle className="w-4.5 h-4.5 text-[#ef4444]" /> Escalation Desk
                    </h4>
                    <span className="text-[8px] bg-red-50 border border-red-200 text-red-500 px-2 py-0.5 rounded font-extrabold uppercase">Urgent actions</span>
                  </div>

                  <div className="bg-red-50/50 p-3.5 border border-red-100 rounded-2xl text-[9.5px] leading-relaxed text-red-800 font-semibold">
                    <span className="font-extrabold uppercase tracking-wide block mb-1">Escalation guidelines:</span>
                    If your ticket has been pending for over 5 days, or you are unsatisfied with the support officer's analysis, you can escalate this query directly to a Senior Desk Inspector.
                  </div>

                  <div className="flex flex-col gap-2 font-bold text-xs">
                    <button 
                      onClick={() => handleEscalateComplaint('senior')}
                      className="w-full bg-[#ef4444] hover:bg-red-700 text-white text-xs font-bold py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 shadow-sm"
                    >
                      Escalate to Senior Officer <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => handleEscalateComplaint('reinvestigate')}
                      className="w-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1"
                    >
                      Request Reinvestigation
                    </button>
                    <button 
                      onClick={() => handleEscalateComplaint('appeal')}
                      className="w-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1"
                    >
                      Appeal Resolution
                    </button>
                  </div>
                </div>
              )}

              {/* SECTION 12: FEEDBACK & RATING (ACTIVE ONCE RESOLVED) */}
              {activeComplaint.status === 'Resolved' && (
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <h4 className="font-extrabold text-sm text-[#0b2447] flex items-center gap-1.5">
                      <Star className="w-4.5 h-4.5 text-[#ff9933] fill-[#ff9933]" /> Rate Experience
                    </h4>
                  </div>

                  {activeComplaint.feedback ? (
                    <div className="space-y-3 text-[10px] font-semibold text-slate-650 bg-green-50/30 p-4 border border-green-150 rounded-2xl">
                      <div className="flex items-center gap-1">
                        <span className="text-[8px] text-slate-400 uppercase tracking-wide block">YOUR RATINGS:</span>
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} className={`w-3.5 h-3.5 ${s <= activeComplaint.feedback.rating ? 'text-[#ff9933] fill-[#ff9933]' : 'text-slate-200'}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-[#0b2447] text-xs font-bold leading-snug">"{activeComplaint.feedback.comments}"</p>
                      <div className="text-[8.5px] text-slate-400 pt-1 border-t border-slate-100 space-y-0.5">
                        <p>Was issue resolved: {activeComplaint.feedback.solved}</p>
                        <p>Was officer helpful: {activeComplaint.feedback.helpful}</p>
                        <p>Recommend service: {activeComplaint.feedback.recommend}</p>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmitFeedback} className="space-y-4 text-[10px] font-semibold text-slate-650">
                      
                      {/* Clickable Star Rating */}
                      <div className="space-y-1 text-center">
                        <span className="block text-[9px] uppercase font-bold text-slate-400">Rate Resolution Experience</span>
                        <div className="flex justify-center gap-1 pt-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setFeedbackRating(star)}
                              className="focus:outline-none cursor-pointer"
                            >
                              <Star className={`w-6 h-6 ${star <= feedbackRating ? 'text-[#ff9933] fill-[#ff9933]' : 'text-slate-350'}`} />
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Multi-choice questionnaires */}
                      <div className="space-y-2 pt-2 border-t border-slate-100">
                        <div className="flex justify-between items-center">
                          <span>Was your issue resolved?</span>
                          <div className="flex gap-2">
                            {['yes', 'no'].map((ans) => (
                              <button
                                key={ans}
                                type="button"
                                onClick={() => setFbSolved(ans)}
                                className={`px-3 py-1 rounded-lg border font-bold text-[9px] cursor-pointer transition-all ${
                                  fbSolved === ans ? 'bg-[#0b2447] border-[#0b2447] text-white' : 'bg-white border-slate-200 hover:bg-slate-50'
                                }`}
                              >
                                {ans.toUpperCase()}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <span>Was the officer helpful?</span>
                          <div className="flex gap-2">
                            {['yes', 'no'].map((ans) => (
                              <button
                                key={ans}
                                type="button"
                                onClick={() => setFbHelpful(ans)}
                                className={`px-3 py-1 rounded-lg border font-bold text-[9px] cursor-pointer transition-all ${
                                  fbHelpful === ans ? 'bg-[#0b2447] border-[#0b2447] text-white' : 'bg-white border-slate-200 hover:bg-slate-50'
                                }`}
                              >
                                {ans.toUpperCase()}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <span>Would you recommend this service?</span>
                          <div className="flex gap-2">
                            {['yes', 'no'].map((ans) => (
                              <button
                                key={ans}
                                type="button"
                                onClick={() => setFbRecommend(ans)}
                                className={`px-3 py-1 rounded-lg border font-bold text-[9px] cursor-pointer transition-all ${
                                  fbRecommend === ans ? 'bg-[#0b2447] border-[#0b2447] text-white' : 'bg-white border-slate-200 hover:bg-slate-50'
                                }`}
                              >
                                {ans.toUpperCase()}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Text Comment field */}
                      <div className="space-y-1 pt-2 border-t border-slate-100">
                        <label className="block text-[8px] text-slate-400 uppercase tracking-wide">Write custom review comments</label>
                        <textarea 
                          placeholder="Tell us what we can improve..."
                          rows="2"
                          value={feedbackComments}
                          onChange={(e) => setFeedbackComments(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none resize-none font-bold text-[#0b2447]"
                        />
                      </div>

                      <button 
                        type="submit"
                        className="w-full bg-[#138808] hover:bg-green-700 text-white text-xs font-bold py-2.5 rounded-xl transition-colors cursor-pointer shadow-sm active:scale-95 text-center block"
                      >
                        Submit Feedback
                      </button>
                    </form>
                  )}
                </div>
              )}

            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default GrievanceCenter;
