import React, { useState } from 'react';
import { 
  UserPlus, Upload, Download, FileSpreadsheet, Printer, Users, CheckCircle2, 
  AlertTriangle, Play, Clock, Search, Filter, Eye, Edit, ShieldAlert, 
  ArrowLeftRight, MapPin, Map, Check, X, Megaphone, Bell, AlertOctagon, 
  HelpCircle, FileText, Send, BookOpen, MessageSquare, ChevronDown, ChevronUp, 
  Star, Trash2, ShieldCheck, Activity, MapIcon, Sparkles, Plus, AlertCircle
} from 'lucide-react';

const INITIAL_OFFICERS = [
  {
    id: 1,
    name: 'Rahul Sharma',
    empId: 'OFF-2026-4587',
    designation: 'District Verification Officer',
    state: 'Delhi',
    district: 'Central Delhi',
    mobile: '+91 98765 43210',
    email: 'rahul.sharma@census.gov.in',
    territory: 'Delhi Central - Ward 12',
    status: 'Active',
    photo: 'RS',
    gender: 'Male',
    joinedDate: '2025-03-12',
    bgVerification: 'Verified',
    empVerification: 'Verified',
    householdsAssigned: 500,
    householdsVisited: 420,
    appsAssigned: 450,
    appsVerified: 350,
    appsPending: 45,
    appsRejected: 55,
    dailyTarget: 25,
    dailyCompleted: 18,
    monthlyTarget: 500,
    monthlyCompleted: 425,
    accuracy: 98,
    responseTime: '1.2 days',
    satisfaction: 92,
    route: [
      { x: 100, y: 150, name: 'Daryaganj Block A' },
      { x: 180, y: 120, name: 'Chandni Chowk Sect 3' },
      { x: 250, y: 220, name: 'Pahar Ganj Ward 12' }
    ]
  },
  {
    id: 2,
    name: 'Anjali Desai',
    empId: 'OFF-2026-8912',
    designation: 'Field Enumerator Supervisor',
    state: 'Maharashtra',
    district: 'Mumbai City',
    mobile: '+91 99887 76655',
    email: 'anjali.desai@census.gov.in',
    territory: 'Mumbai South - Colaba Ward',
    status: 'Active',
    photo: 'AD',
    gender: 'Female',
    joinedDate: '2024-08-19',
    bgVerification: 'Verified',
    empVerification: 'Verified',
    householdsAssigned: 600,
    householdsVisited: 580,
    appsAssigned: 500,
    appsVerified: 490,
    appsPending: 5,
    appsRejected: 5,
    dailyTarget: 30,
    dailyCompleted: 29,
    monthlyTarget: 600,
    monthlyCompleted: 580,
    accuracy: 99,
    responseTime: '0.8 days',
    satisfaction: 96,
    route: [
      { x: 400, y: 300, name: 'Colaba Market' },
      { x: 420, y: 350, name: 'Gate of India Area' },
      { x: 380, y: 400, name: 'Cuffe Parade Block 2' }
    ]
  },
  {
    id: 3,
    name: 'Amit Kumar',
    empId: 'OFF-2026-1142',
    designation: 'Field Verification Officer',
    state: 'Delhi',
    district: 'South Delhi',
    mobile: '+91 95601 23456',
    email: 'amit.kumar@census.gov.in',
    territory: 'South Delhi - Saket Sect 4',
    status: 'Active',
    photo: 'AK',
    gender: 'Male',
    joinedDate: '2025-01-10',
    bgVerification: 'Verified',
    empVerification: 'Verified',
    householdsAssigned: 450,
    householdsVisited: 380,
    appsAssigned: 400,
    appsVerified: 310,
    appsPending: 60,
    appsRejected: 30,
    dailyTarget: 20,
    dailyCompleted: 15,
    monthlyTarget: 450,
    monthlyCompleted: 380,
    accuracy: 95,
    responseTime: '1.5 days',
    satisfaction: 89,
    route: [
      { x: 120, y: 320, name: 'Saket Block J' },
      { x: 190, y: 340, name: 'PVR Anupam Block' },
      { x: 150, y: 380, name: 'Pushp Vihar Ward 4' }
    ]
  },
  {
    id: 4,
    name: 'Vikram Singh',
    empId: 'OFF-2026-0951',
    designation: 'District Audit Officer',
    state: 'Rajasthan',
    district: 'Jaipur',
    mobile: '+91 88776 65544',
    email: 'vikram.singh@census.gov.in',
    territory: 'Jaipur East - Hawa Mahal',
    status: 'Suspended',
    photo: 'VS',
    gender: 'Male',
    joinedDate: '2024-05-02',
    bgVerification: 'Verified',
    empVerification: 'Pending Action',
    householdsAssigned: 400,
    householdsVisited: 210,
    appsAssigned: 350,
    appsVerified: 190,
    appsPending: 110,
    appsRejected: 50,
    dailyTarget: 20,
    dailyCompleted: 0,
    monthlyTarget: 400,
    monthlyCompleted: 210,
    accuracy: 88,
    responseTime: '4.2 days',
    satisfaction: 78,
    route: []
  },
  {
    id: 5,
    name: 'Priyanka Sen',
    empId: 'OFF-2026-3021',
    designation: 'Senior Enumerator',
    state: 'West Bengal',
    district: 'Kolkata',
    mobile: '+91 90070 11223',
    email: 'priyanka.sen@census.gov.in',
    territory: 'Salt Lake Sector V',
    status: 'On Leave',
    photo: 'PS',
    gender: 'Female',
    joinedDate: '2023-11-15',
    bgVerification: 'Verified',
    empVerification: 'Verified',
    householdsAssigned: 500,
    householdsVisited: 490,
    appsAssigned: 480,
    appsVerified: 470,
    appsPending: 0,
    appsRejected: 10,
    dailyTarget: 25,
    dailyCompleted: 0,
    monthlyTarget: 500,
    monthlyCompleted: 490,
    accuracy: 97,
    responseTime: '1.1 days',
    satisfaction: 94,
    route: []
  },
  {
    id: 6,
    name: 'Rohan Mehta',
    empId: 'OFF-2026-5591',
    designation: 'Field Enumerator Officer',
    state: 'Gujarat',
    district: 'Ahmedabad',
    mobile: '+91 91234 56789',
    email: 'rohan.mehta@census.gov.in',
    territory: 'Ahmedabad West - Satellite',
    status: 'Pending Assignment',
    photo: 'RM',
    gender: 'Male',
    joinedDate: '2026-05-20',
    bgVerification: 'In Progress',
    empVerification: 'Verified',
    householdsAssigned: 0,
    householdsVisited: 0,
    appsAssigned: 0,
    appsVerified: 0,
    appsPending: 0,
    appsRejected: 0,
    dailyTarget: 20,
    dailyCompleted: 0,
    monthlyTarget: 400,
    monthlyCompleted: 0,
    accuracy: 100,
    responseTime: '0 days',
    satisfaction: 100,
    route: []
  }
];

const INITIAL_TERRITORIES = [
  { id: 1, state: 'Delhi', district: 'Central Delhi', area: 'Ward 12 (Pahar Ganj)', status: 'Assigned', coverage: 75, officer: 'Rahul Sharma' },
  { id: 2, state: 'Maharashtra', district: 'Mumbai City', area: 'Colaba Coastline Block 3', status: 'Assigned', coverage: 96, officer: 'Anjali Desai' },
  { id: 3, state: 'Delhi', district: 'South Delhi', area: 'Saket Sector 4 & 5', status: 'Assigned', coverage: 84, officer: 'Amit Kumar' },
  { id: 4, state: 'Rajasthan', district: 'Jaipur', area: 'Hawa Mahal Ward 2', status: 'Under-Staffed', coverage: 52, officer: 'Vikram Singh' },
  { id: 5, state: 'West Bengal', district: 'Kolkata', area: 'Salt Lake Sector V', status: 'Assigned', coverage: 98, officer: 'Priyanka Sen' },
  { id: 6, state: 'Delhi', district: 'Central Delhi', area: 'Daryaganj Block A', status: 'Unassigned', coverage: 0, officer: 'None' },
  { id: 7, state: 'Gujarat', district: 'Ahmedabad', area: 'Satellite Ward 9', status: 'Pending Assignment', coverage: 0, officer: 'Rohan Mehta' }
];

const INITIAL_ACTIVITIES = [
  { id: 1, type: 'assignment', desc: 'Territory "Delhi Central - Ward 12" allocated to Rahul Sharma', timestamp: 'Today, 10:15 AM', icon: MapPin, color: 'text-primary' },
  { id: 2, type: 'visit', desc: 'Household Census record submitted by Anjali Desai in Colaba Block', timestamp: 'Today, 09:45 AM', icon: CheckCircle2, color: 'text-success' },
  { id: 3, type: 'disciplinary', desc: 'Vikram Singh suspended following field audit compliance issues', timestamp: 'Yesterday, 04:30 PM', icon: AlertOctagon, color: 'text-red-500' },
  { id: 4, type: 'verification', desc: 'Identity credentials verified for newly recruited officer Rohan Mehta', timestamp: 'Yesterday, 11:20 AM', icon: ShieldCheck, color: 'text-blue-500' },
  { id: 5, type: 'communication', desc: 'National Holiday Enumeration Guidelines broadcasted to all zones', timestamp: '04 Jun 2026, 02:00 PM', icon: Megaphone, color: 'text-secondary' }
];

const INITIAL_MESSAGES = [
  { id: 1, type: 'Announcement', sender: 'Chief Census Director', content: 'Submission deadlines for Phase 1 Delhi Urban blocks extended to June 30, 2026.', target: 'All Delhi Officers', date: '05 Jun 2026' },
  { id: 2, type: 'Notification', sender: 'HQ Audit Team', content: 'Updated offline data sync module version 2.4.1 is now live in the Enumerator App.', target: 'All Officers', date: '04 Jun 2026' },
  { id: 3, type: 'Emergency Alert', sender: 'System Operations', content: 'Severe Heatwave Warning: Field enumerators advised to halt outdoor operations between 12:00 PM and 3:30 PM.', target: 'North-West Zone', date: '03 Jun 2026' }
];

const INITIAL_COMPLIANCE = [
  { id: 1, officer: 'Vikram Singh', empId: 'OFF-2026-0951', issue: 'Repeated high-latency verification audits & citizen complaints.', status: 'Suspended', date: '05 Jun 2026' },
  { id: 2, officer: 'Rohan Mehta', empId: 'OFF-2026-5591', issue: 'Initial Background Check pending verification with local authority.', status: 'Investigation', date: '02 Jun 2026' },
  { id: 3, officer: 'Amit Kumar', empId: 'OFF-2026-1142', issue: 'Mismatched census block records (Resolved: Sync delay issue).', status: 'Resolved', date: '28 May 2026' }
];

const FAQS = [
  { q: 'How is the Employee ID generated in the system?', a: 'Employee IDs are automatically generated in the format OFF-2026-[RANDOM] upon successfully submitting the officer registration form.' },
  { q: 'What happens when an officer is suspended?', a: 'Suspension immediately revokes the officer\'s login access and census database write privileges. Their assigned active verify queue is paused and flagged.' },
  { q: 'How are GIS boundaries allocated for field enumerate tracks?', a: 'Boundaries are synchronized with National Informatics Centre (NIC) district ward polygons. Assigned enumerators are restricted to GPS pings within their designated block.' }
];

const OfficerManagement = () => {
  // Main Tab Controller
  const [activeTab, setActiveTab] = useState('dashboard');

  // Core Data Store States
  const [officers, setOfficers] = useState(INITIAL_OFFICERS);
  const [territories, setTerritories] = useState(INITIAL_TERRITORIES);
  const [activities, setActivities] = useState(INITIAL_ACTIVITIES);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [complianceList, setComplianceList] = useState(INITIAL_COMPLIANCE);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [districtFilter, setDistrictFilter] = useState('All');

  // Selected Profile Detail
  const [selectedOfficer, setSelectedOfficer] = useState(INITIAL_OFFICERS[0]);

  // Modal Controllers
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  // Form State: Add Officer
  const [newOfficerForm, setNewOfficerForm] = useState({
    name: '',
    designation: 'Field Verification Officer',
    state: 'Delhi',
    district: 'Central Delhi',
    mobile: '',
    email: '',
    gender: 'Male',
    initialTerritory: ''
  });

  // Form State: Transfer Officer
  const [transferForm, setTransferForm] = useState({
    officerId: '',
    currentTerritory: '',
    newTerritory: '',
    reason: '',
    effectiveDate: ''
  });

  // Form State: Suspend Officer
  const [suspendForm, setSuspendForm] = useState({
    officerId: '',
    reason: 'Latency Issues',
    startDate: '',
    endDate: '',
    remarks: ''
  });

  // Form State: Assign Territory
  const [assignForm, setAssignForm] = useState({
    officerId: '',
    state: 'Delhi',
    district: 'Central Delhi',
    ward: '',
    village: '',
    block: ''
  });

  // Form State: Broadcast Comms
  const [commsForm, setCommsForm] = useState({
    type: 'Announcement',
    target: 'All Officers',
    content: ''
  });

  // Form State: Support Ticket
  const [supportTicket, setSupportTicket] = useState({
    subject: '',
    description: '',
    priority: 'Normal'
  });

  // Report Generator Mocks
  const [reportSuccessMessage, setReportSuccessMessage] = useState('');

  // GPS Map Selection Mocks
  const [mapSelectedOfficer, setMapSelectedOfficer] = useState(INITIAL_OFFICERS[0]);

  // Handle Search & Filter calculations
  const filteredOfficers = officers.filter(off => {
    const matchesSearch = 
      off.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      off.empId.toLowerCase().includes(searchQuery.toLowerCase()) || 
      off.mobile.includes(searchQuery) ||
      off.district.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || off.status === statusFilter;
    const matchesDistrict = districtFilter === 'All' || off.district === districtFilter;

    return matchesSearch && matchesStatus && matchesDistrict;
  });

  // Unique list of districts for filters
  const districts = ['All', ...new Set(officers.map(off => off.district))];

  // Quick Action handler
  const handleQuickAction = (action) => {
    if (action === 'add') setIsAddModalOpen(true);
    if (action === 'transfer') setIsTransferModalOpen(true);
    if (action === 'suspend') setIsSuspendModalOpen(true);
    if (action === 'assign') setIsAssignModalOpen(true);
  };

  // Add Officer Submission
  const handleAddOfficerSubmit = (e) => {
    e.preventDefault();
    if (!newOfficerForm.name || !newOfficerForm.mobile || !newOfficerForm.email) {
      alert('Please fill in all required fields.');
      return;
    }

    const randomId = Math.floor(1000 + Math.random() * 9000);
    const newId = officers.length + 1;
    const newEmpId = `OFF-2026-${randomId}`;

    const newOfficer = {
      id: newId,
      name: newOfficerForm.name,
      empId: newEmpId,
      designation: newOfficerForm.designation,
      state: newOfficerForm.state,
      district: newOfficerForm.district,
      mobile: newOfficerForm.mobile,
      email: newOfficerForm.email,
      territory: newOfficerForm.initialTerritory || 'Unassigned',
      status: 'Active',
      photo: newOfficerForm.name.split(' ').map(n => n[0]).join('').toUpperCase(),
      gender: newOfficerForm.gender,
      joinedDate: new Date().toISOString().split('T')[0],
      bgVerification: 'Verified',
      empVerification: 'Verified',
      householdsAssigned: 400,
      householdsVisited: 0,
      appsAssigned: 300,
      appsVerified: 0,
      appsPending: 0,
      appsRejected: 0,
      dailyTarget: 20,
      dailyCompleted: 0,
      monthlyTarget: 400,
      monthlyCompleted: 0,
      accuracy: 100,
      responseTime: '0 days',
      satisfaction: 100,
      route: []
    };

    setOfficers([newOfficer, ...officers]);

    // Update Territory allocation status
    if (newOfficerForm.initialTerritory) {
      const updatedTerritories = territories.map(t => {
        if (t.area.toLowerCase().includes(newOfficerForm.initialTerritory.toLowerCase())) {
          return { ...t, status: 'Assigned', officer: newOfficer.name, coverage: 10 };
        }
        return t;
      });
      setTerritories(updatedTerritories);
    }

    // Push to Activity Timeline
    const newAct = {
      id: activities.length + 1,
      type: 'assignment',
      desc: `New Officer ${newOfficer.name} added and assigned to ${newOfficer.territory}`,
      timestamp: 'Just Now',
      icon: UserPlus,
      color: 'text-primary'
    };
    setActivities([newAct, ...activities]);

    // Reset Form & Close Modal
    setNewOfficerForm({
      name: '',
      designation: 'Field Verification Officer',
      state: 'Delhi',
      district: 'Central Delhi',
      mobile: '',
      email: '',
      gender: 'Male',
      initialTerritory: ''
    });
    setIsAddModalOpen(false);
  };

  // Transfer Officer Submission
  const handleTransferSubmit = (e) => {
    e.preventDefault();
    if (!transferForm.officerId || !transferForm.newTerritory) {
      alert('Please fill in all fields.');
      return;
    }

    const officerId = parseInt(transferForm.officerId);
    const updatedOfficers = officers.map(off => {
      if (off.id === officerId) {
        return { ...off, territory: transferForm.newTerritory };
      }
      return off;
    });

    setOfficers(updatedOfficers);

    const officerName = officers.find(o => o.id === officerId)?.name || 'Officer';

    // Push to Activity Timeline
    const newAct = {
      id: activities.length + 1,
      type: 'assignment',
      desc: `Officer ${officerName} transferred to ${transferForm.newTerritory}. Reason: ${transferForm.reason || 'General Deployment'}`,
      timestamp: 'Just Now',
      icon: ArrowLeftRight,
      color: 'text-secondary'
    };
    setActivities([newAct, ...activities]);

    // Reset and Close
    setTransferForm({ officerId: '', currentTerritory: '', newTerritory: '', reason: '', effectiveDate: '' });
    setIsTransferModalOpen(false);
  };

  // Suspend Officer Submission
  const handleSuspendSubmit = (e) => {
    e.preventDefault();
    if (!suspendForm.officerId) {
      alert('Please select an officer.');
      return;
    }

    const officerId = parseInt(suspendForm.officerId);
    const updatedOfficers = officers.map(off => {
      if (off.id === officerId) {
        return { ...off, status: 'Suspended' };
      }
      return off;
    });
    setOfficers(updatedOfficers);

    const officerObj = officers.find(o => o.id === officerId);

    // Push to Compliance list
    const newComp = {
      id: complianceList.length + 1,
      officer: officerObj?.name || 'Officer',
      empId: officerObj?.empId || 'N/A',
      issue: suspendForm.reason + '. Admin Remarks: ' + (suspendForm.remarks || 'None'),
      status: 'Suspended',
      date: 'Today'
    };
    setComplianceList([newComp, ...complianceList]);

    // Push to Activity Timeline
    const newAct = {
      id: activities.length + 1,
      type: 'disciplinary',
      desc: `Compliance Action: ${officerObj?.name} suspended due to ${suspendForm.reason}`,
      timestamp: 'Just Now',
      icon: AlertOctagon,
      color: 'text-red-500'
    };
    setActivities([newAct, ...activities]);

    // Reset and Close
    setSuspendForm({ officerId: '', reason: 'Latency Issues', startDate: '', endDate: '', remarks: '' });
    setIsSuspendModalOpen(false);
  };

  // Assign Territory Submission
  const handleAssignSubmit = (e) => {
    e.preventDefault();
    if (!assignForm.officerId || !assignForm.ward) {
      alert('Please fill in required fields.');
      return;
    }

    const officerId = parseInt(assignForm.officerId);
    const territoryStr = `${assignForm.district} - Ward ${assignForm.ward} ${assignForm.village ? `(${assignForm.village})` : ''}`;

    const updatedOfficers = officers.map(off => {
      if (off.id === officerId) {
        return { ...off, territory: territoryStr, status: 'Active' };
      }
      return off;
    });
    setOfficers(updatedOfficers);

    const officerName = officers.find(o => o.id === officerId)?.name || 'Officer';

    // Push to Territory list
    const newTerr = {
      id: territories.length + 1,
      state: assignForm.state,
      district: assignForm.district,
      area: `Ward ${assignForm.ward} ${assignForm.village ? `(${assignForm.village})` : ''} Block ${assignForm.block || '1'}`,
      status: 'Assigned',
      coverage: 15,
      officer: officerName
    };
    setTerritories([newTerr, ...territories]);

    // Push to Activity Timeline
    const newAct = {
      id: activities.length + 1,
      type: 'assignment',
      desc: `Territory assigned to ${officerName}: ${territoryStr}`,
      timestamp: 'Just Now',
      icon: MapPin,
      color: 'text-primary'
    };
    setActivities([newAct, ...activities]);

    // Reset and Close
    setAssignForm({ officerId: '', state: 'Delhi', district: 'Central Delhi', ward: '', village: '', block: '' });
    setIsAssignModalOpen(false);
  };

  // Broadcast Comms Announcement Submission
  const handleCommsSubmit = (e) => {
    e.preventDefault();
    if (!commsForm.content.trim()) return;

    const newMsg = {
      id: messages.length + 1,
      type: commsForm.type,
      sender: 'HQ Administrator',
      content: commsForm.content,
      target: commsForm.target,
      date: 'Today'
    };

    setMessages([newMsg, ...messages]);

    // Push to Activity Timeline
    const newAct = {
      id: activities.length + 1,
      type: 'communication',
      desc: `New ${commsForm.type} broadcasted: "${commsForm.content.slice(0, 45)}..."`,
      timestamp: 'Just Now',
      icon: commsForm.type === 'Emergency Alert' ? AlertTriangle : Megaphone,
      color: commsForm.type === 'Emergency Alert' ? 'text-red-500' : 'text-secondary'
    };
    setActivities([newAct, ...activities]);

    setCommsForm({ ...commsForm, content: '' });
    alert('Message successfully broadcasted to all targets.');
  };

  // Report Generator handler
  const handleGenerateReport = (reportName) => {
    setReportSuccessMessage(`Report "${reportName}" has been queued. Visual files compiled successfully.`);
    setTimeout(() => {
      setReportSuccessMessage('');
    }, 4000);
  };

  return (
    <div className="flex-grow w-full max-w-containerMax mx-auto px-6 py-8 flex flex-col gap-8 text-onSurface">
      
      {/* SECTION 1: PAGE HEADER */}
      <section className="relative overflow-hidden rounded-md border border-outlineVariant/50 bg-primary p-6 text-white shadow-ambient flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none transform translate-x-12 -translate-y-12">
          <LandmarkIconSVG size={220} />
        </div>
        
        <div className="flex flex-col gap-2 relative z-10">
          <div className="flex items-center gap-2">
            <span className="bg-secondary text-primary font-bold uppercase text-[9px] px-2.5 py-0.5 rounded-full tracking-wider shadow-sm">
              Workforce Command
            </span>
            <span className="text-[10px] text-white/70 font-semibold">• Ministry of Home Affairs</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Officer Management Hub</h2>
          <p className="text-xs text-white/80 max-w-lg leading-relaxed">
            Manage census officers, allocate boundaries, monitor daily targets, audit performance parameters, and communicate with field forces.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 relative z-10 shrink-0">
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-secondary text-primary font-bold text-xs px-4 py-2.5 rounded-full hover:bg-secondary/90 transition-all flex items-center gap-1.5 active:scale-95 shadow-sm cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" /> Add New Officer
          </button>
          <button 
            onClick={() => alert('Importing Excel sheets: Validating columns for Names, Designations, Territories.')}
            className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs px-4 py-2.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" /> Import
          </button>
          <button 
            onClick={() => alert('Exporting directory to CSV format: Total 2,450 records included.')}
            className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs px-4 py-2.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> Export Data
          </button>
        </div>
      </section>

      {/* SECTION 2: OFFICER OVERVIEW STATS */}
      <section className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="bg-surface p-4 rounded-md border border-outlineVariant/50 shadow-sm flex flex-col gap-1.5 relative overflow-hidden">
          <span className="text-[10px] font-bold text-onSurfaceVariant uppercase tracking-wider">Total Officers</span>
          <div className="text-2xl font-bold text-primary flex items-end justify-between">
            <span>2,450</span>
            <Users className="w-5 h-5 text-primary/40" />
          </div>
          <div className="h-1 w-full bg-primary-container rounded-full overflow-hidden mt-1">
            <div className="bg-primary h-full w-[85%]" />
          </div>
        </div>
        <div className="bg-surface p-4 rounded-md border border-outlineVariant/50 shadow-sm flex flex-col gap-1.5 relative overflow-hidden">
          <span className="text-[10px] font-bold text-onSurfaceVariant uppercase tracking-wider">Active Force</span>
          <div className="text-2xl font-bold text-success flex items-end justify-between">
            <span>2,320</span>
            <CheckCircle2 className="w-5 h-5 text-success/40" />
          </div>
          <div className="h-1 w-full bg-success/20 rounded-full overflow-hidden mt-1">
            <div className="bg-success h-full w-[94.6%]" />
          </div>
        </div>
        <div className="bg-surface p-4 rounded-md border border-outlineVariant/50 shadow-sm flex flex-col gap-1.5 relative overflow-hidden">
          <span className="text-[10px] font-bold text-onSurfaceVariant uppercase tracking-wider">Online Fields</span>
          <div className="text-2xl font-bold text-sky-600 flex items-end justify-between">
            <span>845</span>
            <Activity className="w-5 h-5 text-sky-500/40 animate-pulse" />
          </div>
          <div className="h-1 w-full bg-sky-200 rounded-full overflow-hidden mt-1">
            <div className="bg-sky-500 h-full w-[36.4%]" />
          </div>
        </div>
        <div className="bg-surface p-4 rounded-md border border-outlineVariant/50 shadow-sm flex flex-col gap-1.5 relative overflow-hidden">
          <span className="text-[10px] font-bold text-onSurfaceVariant uppercase tracking-wider">Suspended Access</span>
          <div className="text-2xl font-bold text-red-500 flex items-end justify-between">
            <span>15</span>
            <AlertOctagon className="w-5 h-5 text-red-500/40" />
          </div>
          <div className="h-1 w-full bg-red-100 rounded-full overflow-hidden mt-1">
            <div className="bg-red-500 h-full w-[8%]" />
          </div>
        </div>
        <div className="bg-surface p-4 rounded-md border border-outlineVariant/50 shadow-sm flex flex-col gap-1.5 relative overflow-hidden">
          <span className="text-[10px] font-bold text-onSurfaceVariant uppercase tracking-wider">Pending Assigns</span>
          <div className="text-2xl font-bold text-amber-500 flex items-end justify-between">
            <span>64</span>
            <Clock className="w-5 h-5 text-amber-500/40" />
          </div>
          <div className="h-1 w-full bg-amber-100 rounded-full overflow-hidden mt-1">
            <div className="bg-amber-500 h-full w-[15%]" />
          </div>
        </div>
        <div className="bg-surface p-4 rounded-md border border-outlineVariant/50 shadow-sm flex flex-col gap-1.5 relative overflow-hidden">
          <span className="text-[10px] font-bold text-onSurfaceVariant uppercase tracking-wider">Covered Zones</span>
          <div className="text-2xl font-bold text-primary flex items-end justify-between">
            <span>92%</span>
            <MapIcon className="w-5 h-5 text-primary/40" />
          </div>
          <div className="h-1 w-full bg-primary-container rounded-full overflow-hidden mt-1">
            <div className="bg-primary h-full w-[92%]" />
          </div>
        </div>
      </section>

      {/* QUICK ACTIONS ROW & TAB TOGGLES */}
      <section className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-outlineVariant/50 pb-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 text-xs font-bold rounded-t-md transition-all cursor-pointer border-b-2 ${
              activeTab === 'dashboard' 
                ? 'border-primary text-primary bg-primary-container/20' 
                : 'border-transparent text-onSurfaceVariant hover:text-primary'
            }`}
          >
            Performance & Analytics
          </button>
          <button 
            onClick={() => setActiveTab('directory')}
            className={`px-4 py-2 text-xs font-bold rounded-t-md transition-all cursor-pointer border-b-2 ${
              activeTab === 'directory' 
                ? 'border-primary text-primary bg-primary-container/20' 
                : 'border-transparent text-onSurfaceVariant hover:text-primary'
            }`}
          >
            Officer Directory
          </button>
          <button 
            onClick={() => setActiveTab('territories')}
            className={`px-4 py-2 text-xs font-bold rounded-t-md transition-all cursor-pointer border-b-2 ${
              activeTab === 'territories' 
                ? 'border-primary text-primary bg-primary-container/20' 
                : 'border-transparent text-onSurfaceVariant hover:text-primary'
            }`}
          >
            Territories & Live Tracks
          </button>
          <button 
            onClick={() => setActiveTab('compliance')}
            className={`px-4 py-2 text-xs font-bold rounded-t-md transition-all cursor-pointer border-b-2 ${
              activeTab === 'compliance' 
                ? 'border-primary text-primary bg-primary-container/20' 
                : 'border-transparent text-onSurfaceVariant hover:text-primary'
            }`}
          >
            Compliance & Comms
          </button>
          <button 
            onClick={() => setActiveTab('reports')}
            className={`px-4 py-2 text-xs font-bold rounded-t-md transition-all cursor-pointer border-b-2 ${
              activeTab === 'reports' 
                ? 'border-primary text-primary bg-primary-container/20' 
                : 'border-transparent text-onSurfaceVariant hover:text-primary'
            }`}
          >
            Reports & Help Desk
          </button>
        </div>

        {/* SECTION 14: QUICK ACTIONS PANEL */}
        <div className="flex items-center gap-2 bg-surface-low border border-outlineVariant/30 px-3 py-1.5 rounded-full shadow-sm ml-auto lg:ml-0">
          <span className="text-[10px] font-bold text-onSurfaceVariant uppercase mr-1">Quick Tasks:</span>
          <button 
            onClick={() => handleQuickAction('add')}
            title="Add Officer"
            className="w-7 h-7 rounded-full bg-white hover:bg-primary hover:text-white border border-outlineVariant/50 text-primary flex items-center justify-center transition-all cursor-pointer shadow-sm active:scale-95"
          >
            <UserPlus className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={() => handleQuickAction('assign')}
            title="Assign Territory"
            className="w-7 h-7 rounded-full bg-white hover:bg-primary hover:text-white border border-outlineVariant/50 text-primary flex items-center justify-center transition-all cursor-pointer shadow-sm active:scale-95"
          >
            <MapPin className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={() => handleQuickAction('transfer')}
            title="Transfer Officer"
            className="w-7 h-7 rounded-full bg-white hover:bg-primary hover:text-white border border-outlineVariant/50 text-primary flex items-center justify-center transition-all cursor-pointer shadow-sm active:scale-95"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={() => handleQuickAction('suspend')}
            title="Suspend Officer"
            className="w-7 h-7 rounded-full bg-white hover:bg-red-500 hover:text-white border border-outlineVariant/50 text-red-500 flex items-center justify-center transition-all cursor-pointer shadow-sm active:scale-95"
          >
            <AlertOctagon className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* DYNAMIC TAB VIEWS */}
      <div className="flex flex-col gap-8">
        
        {/* VIEW A: PERFORMANCE & ANALYTICS */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Left Column: Stats Details */}
            <div className="lg:col-span-2 flex flex-col gap-8">
              
              {/* SECTION 7: OFFICER PERFORMANCE METRICS */}
              <div className="bg-surface border border-outlineVariant/50 rounded-md p-6 shadow-sm flex flex-col gap-6">
                <div>
                  <h3 className="text-base font-bold text-primary flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-primary" /> Active Field Performance Registry
                  </h3>
                  <p className="text-[11px] text-onSurfaceVariant">Productivity scores based on visits, audit compliance, and response times.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Visited progress card */}
                  <div className="bg-surface-low border border-outlineVariant/20 p-4 rounded-md flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-onSurfaceVariant uppercase">Households Visited</span>
                      <span className="text-xs bg-success/10 text-success px-2 py-0.5 rounded font-bold">84%</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-primary">420</span>
                      <span className="text-xs text-onSurfaceVariant">/ 500 Assigned</span>
                    </div>
                    <div className="w-full bg-outlineVariant/30 h-2 rounded-full overflow-hidden">
                      <div className="bg-success h-full rounded-full" style={{ width: '84%' }} />
                    </div>
                    <div className="text-[10px] text-onSurfaceVariant flex justify-between font-medium">
                      <span>Completed: 420</span>
                      <span>Pending: 80</span>
                    </div>
                  </div>

                  {/* Applications verified */}
                  <div className="bg-surface-low border border-outlineVariant/20 p-4 rounded-md flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-onSurfaceVariant uppercase">Applications Audit</span>
                      <span className="text-xs bg-primary-container text-primary px-2 py-0.5 rounded font-bold">77.7%</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-primary">350</span>
                      <span className="text-xs text-onSurfaceVariant">/ 450 Assigned</span>
                    </div>
                    <div className="w-full bg-outlineVariant/30 h-2 rounded-full overflow-hidden">
                      <div className="bg-primary h-full rounded-full" style={{ width: '77.7%' }} />
                    </div>
                    <div className="text-[10px] text-onSurfaceVariant flex justify-between font-medium">
                      <span>Verified: 350</span>
                      <span>Pending: 45</span>
                    </div>
                  </div>

                  {/* Daily Target Progress */}
                  <div className="bg-surface-low border border-outlineVariant/20 p-4 rounded-md flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-onSurfaceVariant uppercase">Daily Target Completion</span>
                      <span className="text-xs bg-secondary/20 text-secondary-dark px-2 py-0.5 rounded font-bold">72%</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-primary">18</span>
                      <span className="text-xs text-onSurfaceVariant">/ 25 Tasks</span>
                    </div>
                    <div className="w-full bg-outlineVariant/30 h-2 rounded-full overflow-hidden">
                      <div className="bg-secondary h-full rounded-full" style={{ width: '72%', backgroundColor: '#ff9933' }} />
                    </div>
                    <div className="text-[10px] text-onSurfaceVariant flex justify-between font-medium">
                      <span>Today Completed: 18</span>
                      <span>Remaining: 7</span>
                    </div>
                  </div>
                </div>

                {/* Efficiency KPI circular progress gauges */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-outlineVariant/20">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="24" cy="24" r="20" className="stroke-outlineVariant/30 fill-none" strokeWidth="4" />
                        <circle cx="24" cy="24" r="20" className="stroke-success fill-none" strokeWidth="4" strokeDasharray="125.6" strokeDashoffset="10" />
                      </svg>
                      <span className="absolute text-[10px] font-bold text-primary">92%</span>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-primary leading-tight">92%</h4>
                      <p className="text-[10px] text-onSurfaceVariant uppercase font-bold">Completion Rate</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="24" cy="24" r="20" className="stroke-outlineVariant/30 fill-none" strokeWidth="4" />
                        <circle cx="24" cy="24" r="20" className="stroke-primary fill-none" strokeWidth="4" strokeDasharray="125.6" strokeDashoffset="2.5" />
                      </svg>
                      <span className="absolute text-[10px] font-bold text-primary">98%</span>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-primary leading-tight">98%</h4>
                      <p className="text-[10px] text-onSurfaceVariant uppercase font-bold">Accuracy Index</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="24" cy="24" r="20" className="stroke-outlineVariant/30 fill-none" strokeWidth="4" />
                        <circle cx="24" cy="24" r="20" className="stroke-secondary fill-none" strokeWidth="4" strokeDasharray="125.6" strokeDashoffset="18" />
                      </svg>
                      <span className="absolute text-[10px] font-bold text-primary">85%</span>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-primary leading-tight">0.9d</h4>
                      <p className="text-[10px] text-onSurfaceVariant uppercase font-bold">Response Speed</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="24" cy="24" r="20" className="stroke-outlineVariant/30 fill-none" strokeWidth="4" />
                        <circle cx="24" cy="24" r="20" className="stroke-success fill-none" strokeWidth="4" strokeDasharray="125.6" strokeDashoffset="6" />
                      </svg>
                      <span className="absolute text-[10px] font-bold text-primary">95%</span>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-primary leading-tight">4.8★</h4>
                      <p className="text-[10px] text-onSurfaceVariant uppercase font-bold">Citizen Score</p>
                    </div>
                  </div>
                </div>

              </div>

              {/* SECTION 8: PERFORMANCE ANALYTICS CHARTS */}
              <div className="bg-surface border border-outlineVariant/50 rounded-md p-6 shadow-sm flex flex-col gap-6">
                <div>
                  <h3 className="text-base font-bold text-primary flex items-center gap-1.5">
                    <BarChart2IconSVG size={16} /> National Verification & Field Trends
                  </h3>
                  <p className="text-[11px] text-onSurfaceVariant">Daily audit volumes completed versus household census registrations received.</p>
                </div>

                {/* SVG Visual Chart */}
                <div className="w-full h-64 border border-outlineVariant/20 rounded p-4 bg-surface-low relative">
                  <div className="absolute top-2 right-4 flex gap-4 text-[10px] font-bold text-onSurfaceVariant">
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-1 bg-primary inline-block" /> Verification Audits
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-1 bg-secondary inline-block" /> Household Visits
                    </div>
                  </div>

                  {/* Raw SVG Chart Line & Bars */}
                  <svg viewBox="0 0 600 200" className="w-full h-full">
                    {/* Grid Lines */}
                    <line x1="40" y1="20" x2="580" y2="20" stroke="#eceef0" strokeWidth="1" />
                    <line x1="40" y1="70" x2="580" y2="70" stroke="#eceef0" strokeWidth="1" />
                    <line x1="40" y1="120" x2="580" y2="120" stroke="#eceef0" strokeWidth="1" />
                    <line x1="40" y1="170" x2="580" y2="170" stroke="#c4c6cf" strokeWidth="1" />

                    {/* Y Axis Labels */}
                    <text x="10" y="25" fill="#74777f" fontSize="8" fontWeight="bold">600</text>
                    <text x="10" y="75" fill="#74777f" fontSize="8" fontWeight="bold">300</text>
                    <text x="10" y="125" fill="#74777f" fontSize="8" fontWeight="bold">100</text>
                    <text x="10" y="175" fill="#74777f" fontSize="8" fontWeight="bold">0</text>

                    {/* Bars - Household Visits */}
                    <rect x="70" y="80" width="16" height="90" fill="#ffb77a" opacity="0.8" rx="2" />
                    <rect x="140" y="60" width="16" height="110" fill="#ffb77a" opacity="0.8" rx="2" />
                    <rect x="210" y="50" width="16" height="120" fill="#ffb77a" opacity="0.8" rx="2" />
                    <rect x="280" y="90" width="16" height="80" fill="#ffb77a" opacity="0.8" rx="2" />
                    <rect x="350" y="40" width="16" height="130" fill="#ffb77a" opacity="0.8" rx="2" />
                    <rect x="420" y="70" width="16" height="100" fill="#ffb77a" opacity="0.8" rx="2" />
                    <rect x="490" y="45" width="16" height="125" fill="#ffb77a" opacity="0.8" rx="2" />

                    {/* Line Path - Verification Audits */}
                    <path d="M 78 130 Q 148 90 218 50 T 358 100 T 498 60" fill="none" stroke="#0b2447" strokeWidth="3" />
                    {/* Line Points */}
                    <circle cx="78" cy="130" r="4" fill="#0b2447" />
                    <circle cx="148" cy="98" r="4" fill="#0b2447" />
                    <circle cx="218" cy="50" r="4" fill="#0b2447" />
                    <circle cx="288" cy="85" r="4" fill="#0b2447" />
                    <circle cx="358" cy="100" r="4" fill="#0b2447" />
                    <circle cx="428" cy="70" r="4" fill="#0b2447" />
                    <circle cx="498" cy="60" r="4" fill="#0b2447" />

                    {/* X Axis Labels */}
                    <text x="65" y="190" fill="#44474e" fontSize="9" fontWeight="bold">Mon</text>
                    <text x="135" y="190" fill="#44474e" fontSize="9" fontWeight="bold">Tue</text>
                    <text x="205" y="190" fill="#44474e" fontSize="9" fontWeight="bold">Wed</text>
                    <text x="275" y="190" fill="#44474e" fontSize="9" fontWeight="bold">Thu</text>
                    <text x="345" y="190" fill="#44474e" fontSize="9" fontWeight="bold">Fri</text>
                    <text x="415" y="190" fill="#44474e" fontSize="9" fontWeight="bold">Sat</text>
                    <text x="485" y="190" fill="#44474e" fontSize="9" fontWeight="bold">Sun</text>
                  </svg>
                </div>
              </div>

            </div>

            {/* Right Column: Timeline activity */}
            <div className="flex flex-col gap-6">
              
              {/* SECTION 9: OFFICER ACTIVITY TIMELINE */}
              <div className="bg-surface border border-outlineVariant/50 rounded-md p-6 shadow-sm flex flex-col gap-4">
                <div>
                  <h3 className="text-base font-bold text-primary flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-primary" /> Operations Activity Timeline
                  </h3>
                  <p className="text-[11px] text-onSurfaceVariant">Audit trails for workforce changes, assignments, and warnings.</p>
                </div>

                <div className="flex flex-col gap-4 relative pl-4 border-l border-outlineVariant/40 py-2">
                  {activities.map((act) => {
                    const Icon = act.icon;
                    return (
                      <div key={act.id} className="relative flex flex-col gap-1.5 leading-relaxed text-xs">
                        <span className="absolute -left-[24px] top-0 w-4 h-4 rounded-full bg-surface border border-outlineVariant flex items-center justify-center">
                          <Icon className={`w-2.5 h-2.5 ${act.color}`} />
                        </span>
                        <p className="font-semibold text-primary">{act.desc}</p>
                        <span className="text-[10px] text-onSurfaceVariant">{act.timestamp}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quick Summary list of online enumerators */}
              <div className="bg-surface border border-outlineVariant/50 rounded-md p-6 shadow-sm flex flex-col gap-4">
                <div>
                  <h3 className="text-xs font-bold text-primary uppercase tracking-wider">Active Field Supervisors</h3>
                  <p className="text-[10px] text-onSurfaceVariant">Current field coverage coordinates active.</p>
                </div>
                <div className="flex flex-col gap-3">
                  {officers.filter(o => o.status === 'Active').slice(0, 3).map(off => (
                    <div key={off.id} className="flex items-center justify-between p-2.5 bg-surface-low border border-outlineVariant/20 rounded">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px]">
                          {off.photo}
                        </span>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-primary">{off.name}</span>
                          <span className="text-[9px] text-onSurfaceVariant">{off.territory}</span>
                        </div>
                      </div>
                      <span className="flex items-center gap-1 text-[10px] text-success font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-success animate-ping" /> Online
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* VIEW B: OFFICER DIRECTORY */}
        {activeTab === 'directory' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start animate-fade-in">
            
            {/* Left Column: List table */}
            <div className="lg:col-span-2 bg-surface border border-outlineVariant/50 rounded-md shadow-sm p-6 flex flex-col gap-6">
              
              {/* Directory Filter / Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-outlineVariant/20 pb-4">
                <div>
                  <h3 className="font-bold text-base text-primary">Officer Directory</h3>
                  <p className="text-[11px] text-onSurfaceVariant">Table containing complete records of active and suspended census officers.</p>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-2">
                  <div className="relative flex-grow">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-outline" />
                    <input 
                      type="text"
                      placeholder="Search name, ID, district..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8 pr-3 py-1.5 bg-surface border border-outlineVariant rounded text-xs outline-none w-full sm:w-44 focus:border-primary"
                    />
                  </div>
                  
                  <select 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-2 py-1.5 bg-surface border border-outlineVariant rounded text-xs outline-none focus:border-primary"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Active">Active</option>
                    <option value="Suspended">Suspended</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Pending Assignment">Pending Assignment</option>
                  </select>

                  <select 
                    value={districtFilter}
                    onChange={(e) => setDistrictFilter(e.target.value)}
                    className="px-2 py-1.5 bg-surface border border-outlineVariant rounded text-xs outline-none focus:border-primary"
                  >
                    <option value="All">All Districts</option>
                    {districts.filter(d => d !== 'All').map(dist => (
                      <option key={dist} value={dist}>{dist}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Officers Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-surface-low border-b border-outlineVariant/30 text-onSurfaceVariant font-bold uppercase tracking-wider">
                      <th className="py-3 px-4">Photo</th>
                      <th className="py-3 px-4">Officer Details</th>
                      <th className="py-3 px-4">State/District</th>
                      <th className="py-3 px-4">Territory</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outlineVariant/20">
                    {filteredOfficers.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-onSurfaceVariant italic">No officers match search criteria.</td>
                      </tr>
                    ) : (
                      filteredOfficers.map(officer => (
                        <tr key={officer.id} className={`hover:bg-surface-container/20 transition-colors ${selectedOfficer?.id === officer.id ? 'bg-primary-container/10' : ''}`}>
                          <td className="py-3 px-4">
                            <span className="w-8 h-8 rounded-full bg-primary-container text-primary font-bold text-xs flex items-center justify-center shadow-sm border border-primary/10">
                              {officer.photo}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex flex-col">
                              <span className="font-bold text-primary text-sm">{officer.name}</span>
                              <span className="text-[10px] text-onSurfaceVariant font-mono">{officer.empId}</span>
                              <span className="text-[9px] text-secondary-dark font-semibold mt-0.5">{officer.designation}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex flex-col text-onSurface">
                              <span>{officer.district}</span>
                              <span className="text-[10px] text-onSurfaceVariant font-medium">{officer.state}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-onSurfaceVariant font-semibold">
                            {officer.territory}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded-full font-bold uppercase text-[9px] ${
                              officer.status === 'Active' ? 'bg-green-50 text-green-700' :
                              officer.status === 'Suspended' ? 'bg-red-50 text-red-700' :
                              officer.status === 'On Leave' ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-700'
                            }`}>
                              {officer.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <button 
                              onClick={() => setSelectedOfficer(officer)}
                              className="bg-primary/5 hover:bg-primary text-primary hover:text-white px-3 py-1 rounded-full font-bold text-[10px] transition-all flex items-center gap-1 mx-auto cursor-pointer"
                            >
                              <Eye className="w-3 h-3" /> Inspect
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

            </div>

            {/* Right Column: Detailed Profile card */}
            <div className="lg:col-span-1 flex flex-col gap-6">
              
              {/* SECTION 4: OFFICER PROFILE VIEW */}
              {selectedOfficer ? (
                <div className="bg-surface border border-outlineVariant/50 rounded-md shadow-sm p-6 flex flex-col gap-5 animate-fade-in">
                  <div className="flex items-center justify-between border-b border-outlineVariant/20 pb-3">
                    <h3 className="font-bold text-sm text-primary uppercase tracking-wider">Officer Profile Details</h3>
                    <span className="text-[9px] text-onSurfaceVariant font-bold">{selectedOfficer.empId}</span>
                  </div>

                  {/* Profile Header */}
                  <div className="flex items-center gap-3">
                    <span className="w-12 h-12 rounded-full bg-primary text-white font-bold text-sm flex items-center justify-center shadow-md">
                      {selectedOfficer.photo}
                    </span>
                    <div className="flex flex-col">
                      <h4 className="text-base font-bold text-primary leading-tight">{selectedOfficer.name}</h4>
                      <p className="text-xs text-onSurfaceVariant font-semibold">{selectedOfficer.designation}</p>
                    </div>
                  </div>

                  {/* Information block */}
                  <div className="space-y-4 text-xs">
                    
                    <div className="bg-surface-low border border-outlineVariant/20 p-3 rounded space-y-2">
                      <span className="text-[9px] font-bold text-primary uppercase block border-b border-outlineVariant/10 pb-1">Personal Details</span>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-[10px] text-onSurfaceVariant block">Gender:</span>
                          <span className="font-semibold text-primary">{selectedOfficer.gender}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-onSurfaceVariant block">Joined Date:</span>
                          <span className="font-semibold text-primary">{selectedOfficer.joinedDate}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-surface-low border border-outlineVariant/20 p-3 rounded space-y-2">
                      <span className="text-[9px] font-bold text-primary uppercase block border-b border-outlineVariant/10 pb-1">Contact Details</span>
                      <div>
                        <span className="text-[10px] text-onSurfaceVariant block">Mobile:</span>
                        <span className="font-semibold text-primary">{selectedOfficer.mobile}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-onSurfaceVariant block">Email:</span>
                        <span className="font-semibold text-primary truncate block">{selectedOfficer.email}</span>
                      </div>
                    </div>

                    <div className="bg-surface-low border border-outlineVariant/20 p-3 rounded space-y-2">
                      <span className="text-[9px] font-bold text-primary uppercase block border-b border-outlineVariant/10 pb-1">Jurisdiction Boundaries</span>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-[10px] text-onSurfaceVariant block">District:</span>
                          <span className="font-semibold text-primary">{selectedOfficer.district}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-onSurfaceVariant block">State:</span>
                          <span className="font-semibold text-primary">{selectedOfficer.state}</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-[10px] text-onSurfaceVariant block">Active Census Block:</span>
                        <span className="font-bold text-secondary-dark">{selectedOfficer.territory}</span>
                      </div>
                    </div>

                    <div className="bg-surface-low border border-outlineVariant/20 p-3 rounded space-y-2">
                      <span className="text-[9px] font-bold text-primary uppercase block border-b border-outlineVariant/10 pb-1">Verification Status</span>
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-onSurfaceVariant">Background Check:</span>
                          <span className={`px-1.5 py-0.5 rounded font-bold uppercase text-[9px] ${
                            selectedOfficer.bgVerification === 'Verified' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
                          }`}>
                            {selectedOfficer.bgVerification}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-onSurfaceVariant">Employment Verification:</span>
                          <span className={`px-1.5 py-0.5 rounded font-bold uppercase text-[9px] ${
                            selectedOfficer.empVerification === 'Verified' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
                          }`}>
                            {selectedOfficer.empVerification}
                          </span>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Profile Actions buttons */}
                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-outlineVariant/20">
                    <button 
                      onClick={() => {
                        setTransferForm({
                          officerId: selectedOfficer.id.toString(),
                          currentTerritory: selectedOfficer.territory,
                          newTerritory: '',
                          reason: '',
                          effectiveDate: ''
                        });
                        setIsTransferModalOpen(true);
                      }}
                      className="bg-surface border border-outlineVariant/50 text-primary font-bold py-2 rounded-full text-xs hover:border-primary hover:bg-primary-container/20 transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <ArrowLeftRight className="w-3.5 h-3.5" /> Transfer
                    </button>
                    <button 
                      onClick={() => {
                        setSuspendForm({
                          officerId: selectedOfficer.id.toString(),
                          reason: 'Latency Issues',
                          startDate: '',
                          endDate: '',
                          remarks: ''
                        });
                        setIsSuspendModalOpen(true);
                      }}
                      className="bg-red-50 text-red-700 border border-red-200 font-bold py-2 rounded-full text-xs hover:bg-red-100 transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <AlertOctagon className="w-3.5 h-3.5" /> Suspend
                    </button>
                  </div>

                </div>
              ) : (
                <div className="bg-surface border border-outlineVariant/50 rounded-md p-6 text-center text-xs text-onSurfaceVariant shadow-sm flex flex-col items-center gap-3">
                  <ShieldAlert className="w-8 h-8 text-outline" />
                  <span>Select an officer from the directory to inspect details.</span>
                </div>
              )}

            </div>
          </div>
        )}

        {/* VIEW C: TERRITORIES & LIVE TRACKS */}
        {activeTab === 'territories' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start animate-fade-in">
            
            {/* Left Column: GIS Map & Live Tracking (Sec 10) */}
            <div className="lg:col-span-2 bg-surface border border-outlineVariant/50 rounded-md shadow-sm p-6 flex flex-col gap-4">
              <div>
                <h3 className="text-base font-bold text-primary flex items-center gap-1.5">
                  <Map className="w-4 h-4 text-primary" /> GIS Boundary & Real-Time Field Tracking Map
                </h3>
                <p className="text-[11px] text-onSurfaceVariant">Select an officer to overlay their daily routing path and active census block.</p>
              </div>

              {/* Stylized Delhi District Map SVG */}
              <div className="w-full h-[400px] border border-outlineVariant/20 rounded-md bg-sky-50/20 relative overflow-hidden flex items-center justify-center">
                
                {/* SVG Vector Map mockup representing Central, South, and West Delhi blocks */}
                <svg viewBox="0 0 600 400" className="w-full h-full p-6">
                  {/* Central Delhi District boundary */}
                  <path 
                    d="M150,80 L250,50 L380,100 L350,220 L220,280 L130,200 Z" 
                    fill="#eceef0" 
                    stroke="#c4c6cf" 
                    strokeWidth="2.5" 
                    className="hover:fill-primary-container/20 transition-all cursor-pointer" 
                  />
                  <text x="240" y="150" fill="#74777f" fontSize="11" fontWeight="bold" opacity="0.6">Central Delhi</text>

                  {/* South Delhi Boundary */}
                  <path 
                    d="M220,280 L350,220 L480,260 L420,380 L250,380 Z" 
                    fill="#eceef0" 
                    stroke="#c4c6cf" 
                    strokeWidth="2.5" 
                    className="hover:fill-primary-container/20 transition-all cursor-pointer" 
                  />
                  <text x="320" y="320" fill="#74777f" fontSize="11" fontWeight="bold" opacity="0.6">South Delhi</text>

                  {/* East Delhi (Colaba mockup boundary) */}
                  <path 
                    d="M380,100 L490,40 L550,150 L480,260 L350,220 Z" 
                    fill="#eceef0" 
                    stroke="#c4c6cf" 
                    strokeWidth="2.5" 
                    className="hover:fill-primary-container/20 transition-all cursor-pointer" 
                  />
                  <text x="460" y="140" fill="#74777f" fontSize="11" fontWeight="bold" opacity="0.6">Jaipur / Outers</text>

                  {/* Daily Route overlay if officer has GPS route coordinates */}
                  {mapSelectedOfficer && mapSelectedOfficer.route && mapSelectedOfficer.route.length > 0 && (
                    <>
                      {/* Draw lines between points */}
                      <polyline 
                        points={mapSelectedOfficer.route.map(pt => `${pt.x},${pt.y}`).join(' ')} 
                        fill="none" 
                        stroke="#ff9933" 
                        strokeWidth="3" 
                        strokeDasharray="6 4" 
                        className="animate-pulse"
                      />
                      
                      {/* Draw route location points */}
                      {mapSelectedOfficer.route.map((pt, idx) => (
                        <g key={idx}>
                          <circle cx={pt.x} cy={pt.y} r="5" fill="#ff9933" />
                          <circle cx={pt.x} cy={pt.y} r="8" fill="none" stroke="#ff9933" strokeWidth="1" className="animate-ping" />
                          <text x={pt.x + 8} y={pt.y + 4} fill="#0b2447" fontSize="9" fontWeight="bold" bg="white">
                            {pt.name}
                          </text>
                        </g>
                      ))}
                    </>
                  )}

                  {/* Live Tracking GPS Pins for Active Officers */}
                  {officers.filter(o => o.status === 'Active' && o.route && o.route.length > 0).map((off) => {
                    const lastPt = off.route[off.route.length - 1];
                    return (
                      <g 
                        key={off.id} 
                        onClick={() => setMapSelectedOfficer(off)}
                        className="cursor-pointer"
                      >
                        <circle cx={lastPt.x} cy={lastPt.y - 12} r="14" fill="#0b2447" className="shadow-premium" />
                        <MapPin className="w-3.5 h-3.5 absolute text-white" style={{ left: `${lastPt.x - 7}px`, top: `${lastPt.y - 20}px` }} />
                        <text x={lastPt.x - 25} y={lastPt.y + 12} fill="#191c1e" fontSize="9" fontWeight="bold" className="bg-white px-1 py-0.5 rounded shadow">
                          {off.name.split(' ')[0]}
                        </text>
                      </g>
                    );
                  })}
                </svg>

                {/* Tracking Dashboard Overlay Info */}
                <div className="absolute bottom-4 left-4 bg-white border border-outlineVariant/50 p-4 rounded-md shadow-premium max-w-xs flex flex-col gap-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-success animate-ping" />
                    <span className="text-[10px] font-bold text-primary uppercase">GPS Active Tracks</span>
                  </div>
                  {mapSelectedOfficer ? (
                    <div className="text-[11px] leading-relaxed">
                      <p className="font-bold text-primary">{mapSelectedOfficer.name} ({mapSelectedOfficer.empId})</p>
                      <p className="text-onSurfaceVariant">Current: <span className="font-bold">{mapSelectedOfficer.route[mapSelectedOfficer.route.length - 1]?.name || 'Base HQ'}</span></p>
                      <p className="text-onSurfaceVariant text-[10px]">District: {mapSelectedOfficer.district}</p>
                    </div>
                  ) : (
                    <p className="text-[11px] text-onSurfaceVariant italic">Select an active tracking pin to inspect current route.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Territories list & coverage (Sec 6) */}
            <div className="lg:col-span-1 flex flex-col gap-6">
              
              {/* SECTION 6: OPERATIONAL TERRITORY DISPLAY */}
              <div className="bg-surface border border-outlineVariant/50 rounded-md shadow-sm p-6 flex flex-col gap-4">
                <div>
                  <h3 className="font-bold text-sm text-primary uppercase tracking-wider">Operational Territories</h3>
                  <p className="text-[10px] text-onSurfaceVariant">Boundaries and supervisor assignment coverages.</p>
                </div>

                <div className="flex flex-col gap-3">
                  {territories.map((terr) => (
                    <div key={terr.id} className="bg-surface-low border border-outlineVariant/20 p-3 rounded flex flex-col gap-2">
                      <div className="flex items-center justify-between text-xs font-bold text-primary">
                        <span>{terr.area}</span>
                        <span className={`px-1.5 py-0.5 rounded text-[9px] uppercase ${
                          terr.status === 'Assigned' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                        }`}>
                          {terr.status}
                        </span>
                      </div>
                      
                      <div className="flex justify-between text-[10px] text-onSurfaceVariant font-medium">
                        <span>Supervisor: {terr.officer}</span>
                        <span>Coverage: {terr.coverage}%</span>
                      </div>

                      <div className="w-full bg-outlineVariant/30 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-primary h-full" style={{ width: `${terr.coverage}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* VIEW D: COMPLIANCE & COMMS */}
        {activeTab === 'compliance' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start animate-fade-in">
            
            {/* Left Column: Disciplinary Management Dashboard (Sec 13) */}
            <div className="lg:col-span-2 bg-surface border border-outlineVariant/50 rounded-md shadow-sm p-6 flex flex-col gap-6">
              <div>
                <h3 className="text-base font-bold text-primary flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-red-500" /> Compliance & Disciplinary Registry
                </h3>
                <p className="text-[11px] text-onSurfaceVariant">Record compliance warnings, suspensions, active investigations, and pending appeals.</p>
              </div>

              {/* Compliance Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-surface-low border-b border-outlineVariant/30 text-onSurfaceVariant font-bold uppercase tracking-wider">
                      <th className="py-3 px-4">Officer name</th>
                      <th className="py-3 px-4">Employee ID</th>
                      <th className="py-3 px-4">Audit Violation / Remarks</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Action Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outlineVariant/20">
                    {complianceList.map((comp) => (
                      <tr key={comp.id} className="hover:bg-surface-container/20 transition-colors">
                        <td className="py-3 px-4 font-bold text-primary">{comp.officer}</td>
                        <td className="py-3 px-4 font-mono">{comp.empId}</td>
                        <td className="py-3 px-4 text-onSurfaceVariant leading-relaxed">{comp.issue}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-full font-bold uppercase text-[9px] ${
                            comp.status === 'Suspended' ? 'bg-red-50 text-red-700' :
                            comp.status === 'Investigation' ? 'bg-amber-50 text-amber-700' : 'bg-green-50 text-green-700'
                          }`}>
                            {comp.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-onSurfaceVariant">{comp.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right Column: Communication Center (Sec 12) */}
            <div className="lg:col-span-1 flex flex-col gap-6">
              
              <div className="bg-surface border border-outlineVariant/50 rounded-md shadow-sm p-6 flex flex-col gap-4">
                <div>
                  <h3 className="font-bold text-sm text-primary uppercase tracking-wider">Communication Center</h3>
                  <p className="text-[10px] text-onSurfaceVariant">Broadcast critical operational commands to field officers.</p>
                </div>

                <form onSubmit={handleCommsSubmit} className="space-y-4 text-xs">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-primary uppercase">Broadcast Type</label>
                    <select 
                      value={commsForm.type}
                      onChange={(e) => setCommsForm({ ...commsForm, type: e.target.value })}
                      className="px-3 py-2 bg-surface border border-outlineVariant rounded outline-none focus:border-primary"
                    >
                      <option value="Announcement">Announcement</option>
                      <option value="Notification">General Notification</option>
                      <option value="Emergency Alert">Emergency Alert (High Priority)</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-primary uppercase">Target Region / Zone</label>
                    <select 
                      value={commsForm.target}
                      onChange={(e) => setCommsForm({ ...commsForm, target: e.target.value })}
                      className="px-3 py-2 bg-surface border border-outlineVariant rounded outline-none focus:border-primary"
                    >
                      <option value="All Officers">All Active Officers</option>
                      <option value="Central Delhi Zone">Central Delhi Zone</option>
                      <option value="South Delhi Zone">South Delhi Zone</option>
                      <option value="Mumbai Region">Mumbai Region</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-primary uppercase">Broadcast Content</label>
                    <textarea 
                      rows={3}
                      value={commsForm.content}
                      onChange={(e) => setCommsForm({ ...commsForm, content: e.target.value })}
                      placeholder="Enter broadcast instructions or alerts..."
                      className="px-3 py-2 bg-surface border border-outlineVariant rounded outline-none focus:border-primary leading-relaxed"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-primary text-white font-bold py-2.5 rounded-full hover:bg-primary-light transition-all flex items-center justify-center gap-1.5 shadow active:scale-95 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" /> Broadcast Command
                  </button>
                </form>
              </div>

              {/* Message History list */}
              <div className="bg-surface border border-outlineVariant/50 rounded-md p-6 shadow-sm flex flex-col gap-4">
                <h3 className="text-xs font-bold text-primary uppercase tracking-wider">Broadcast History</h3>
                <div className="space-y-3">
                  {messages.map((msg) => (
                    <div key={msg.id} className="p-3 bg-surface-low border border-outlineVariant/20 rounded flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                          msg.type === 'Emergency Alert' ? 'bg-red-100 text-red-700' : 'bg-primary-container text-primary'
                        }`}>
                          {msg.type}
                        </span>
                        <span className="text-[9px] text-onSurfaceVariant">{msg.date}</span>
                      </div>
                      <p className="text-xs font-semibold text-primary mt-1">{msg.content}</p>
                      <span className="text-[9px] text-onSurfaceVariant italic">Target: {msg.target} • Issued by: {msg.sender}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* VIEW E: REPORTS & SUPPORT */}
        {activeTab === 'reports' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start animate-fade-in">
            
            {/* Left Column: Report Centre (Sec 11) */}
            <div className="lg:col-span-2 bg-surface border border-outlineVariant/50 rounded-md shadow-sm p-6 flex flex-col gap-6">
              <div>
                <h3 className="text-base font-bold text-primary flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-primary" /> Reports & Analytics Generator
                </h3>
                <p className="text-[11px] text-onSurfaceVariant">Compile and export official workforce performance logs and zone coverages.</p>
              </div>

              {reportSuccessMessage && (
                <div className="bg-green-50 text-green-700 text-xs p-4 rounded border border-green-200 flex items-center gap-2">
                  <CheckCircle2 className="w-4.5 h-4.5 shrink-0" />
                  <span>{reportSuccessMessage}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div className="p-4 border border-outlineVariant/30 rounded flex flex-col justify-between gap-4">
                  <div className="space-y-1.5">
                    <h4 className="text-sm font-bold text-primary">Officer Performance Report</h4>
                    <p className="text-[11px] text-onSurfaceVariant">Detailed logs of household counts visited, audit accuracies, and target metrics.</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleGenerateReport('Officer Performance')}
                      className="bg-primary text-white text-xs font-semibold px-3 py-1.5 rounded hover:bg-primary-light transition-all flex items-center gap-1 cursor-pointer"
                    >
                      Compile
                    </button>
                    <button onClick={() => alert('Downloading PDF: officer_performance_report_2026.pdf')} className="text-primary hover:bg-primary-container/20 border border-primary/20 text-xs font-semibold px-3 py-1.5 rounded transition-all cursor-pointer">
                      PDF
                    </button>
                    <button onClick={() => alert('Downloading Excel: officer_performance_report_2026.xlsx')} className="text-primary hover:bg-primary-container/20 border border-primary/20 text-xs font-semibold px-3 py-1.5 rounded transition-all cursor-pointer">
                      Excel
                    </button>
                  </div>
                </div>

                <div className="p-4 border border-outlineVariant/30 rounded flex flex-col justify-between gap-4">
                  <div className="space-y-1.5">
                    <h4 className="text-sm font-bold text-primary">Territory Coverage Report</h4>
                    <p className="text-[11px] text-onSurfaceVariant">Boundary completions, coverage heatmaps, and pending block audits.</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleGenerateReport('Territory Coverage')}
                      className="bg-primary text-white text-xs font-semibold px-3 py-1.5 rounded hover:bg-primary-light transition-all flex items-center gap-1 cursor-pointer"
                    >
                      Compile
                    </button>
                    <button onClick={() => alert('Downloading PDF: territory_coverage_report.pdf')} className="text-primary hover:bg-primary-container/20 border border-primary/20 text-xs font-semibold px-3 py-1.5 rounded transition-all cursor-pointer">
                      PDF
                    </button>
                  </div>
                </div>

                <div className="p-4 border border-outlineVariant/30 rounded flex flex-col justify-between gap-4">
                  <div className="space-y-1.5">
                    <h4 className="text-sm font-bold text-primary">Verification Audits Report</h4>
                    <p className="text-[11px] text-onSurfaceVariant">Applications approved, rejected, and compliance latency timelines.</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleGenerateReport('Verification Audits')}
                      className="bg-primary text-white text-xs font-semibold px-3 py-1.5 rounded hover:bg-primary-light transition-all flex items-center gap-1 cursor-pointer"
                    >
                      Compile
                    </button>
                    <button onClick={() => alert('Downloading Excel: verification_audits.xlsx')} className="text-primary hover:bg-primary-container/20 border border-primary/20 text-xs font-semibold px-3 py-1.5 rounded transition-all cursor-pointer">
                      Excel
                    </button>
                  </div>
                </div>

                <div className="p-4 border border-outlineVariant/30 rounded flex flex-col justify-between gap-4">
                  <div className="space-y-1.5">
                    <h4 className="text-sm font-bold text-primary">Attendance & Productivity Log</h4>
                    <p className="text-[11px] text-onSurfaceVariant">Field login stamps, active route durations, and daily task checklist ratios.</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleGenerateReport('Attendance & Productivity')}
                      className="bg-primary text-white text-xs font-semibold px-3 py-1.5 rounded hover:bg-primary-light transition-all flex items-center gap-1 cursor-pointer"
                    >
                      Compile
                    </button>
                    <button onClick={() => alert('Downloading PDF: attendance_productivity.pdf')} className="text-primary hover:bg-primary-container/20 border border-primary/20 text-xs font-semibold px-3 py-1.5 rounded transition-all cursor-pointer">
                      PDF
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* Right Column: Help Desk & FAQS (Sec 15) */}
            <div className="lg:col-span-1 flex flex-col gap-6">
              
              {/* Support & Training Accordions */}
              <div className="bg-surface border border-outlineVariant/50 rounded-md shadow-sm p-6 flex flex-col gap-4">
                <div>
                  <h3 className="font-bold text-sm text-primary uppercase tracking-wider">Help & Support Desk</h3>
                  <p className="text-[10px] text-onSurfaceVariant">Officer documentation, FAQS, and support tickets.</p>
                </div>

                {/* FAQ List */}
                <div className="space-y-3 border-b border-outlineVariant/20 pb-4">
                  <span className="text-[10px] font-bold text-primary uppercase block">Frequently Asked Questions</span>
                  {FAQS.map((faq, i) => (
                    <div key={i} className="text-xs space-y-1">
                      <p className="font-bold text-primary">Q: {faq.q}</p>
                      <p className="text-onSurfaceVariant leading-relaxed">{faq.a}</p>
                    </div>
                  ))}
                </div>

                {/* Create Support Ticket */}
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!supportTicket.subject.trim()) return;
                    alert(`Support Ticket #${Math.floor(100000 + Math.random() * 900000)} generated successfully. Live support agent alerted.`);
                    setSupportTicket({ subject: '', description: '', priority: 'Normal' });
                  }}
                  className="space-y-3 text-xs"
                >
                  <span className="text-[10px] font-bold text-primary uppercase block">Generate Support Ticket</span>
                  
                  <div className="flex flex-col gap-1">
                    <label className="text-onSurfaceVariant">Ticket Subject</label>
                    <input 
                      type="text"
                      placeholder="e.g. GIS Sync Delay"
                      value={supportTicket.subject}
                      onChange={(e) => setSupportTicket({ ...supportTicket, subject: e.target.value })}
                      className="px-3 py-1.5 bg-surface border border-outlineVariant rounded outline-none focus:border-primary"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-onSurfaceVariant">Description</label>
                    <textarea 
                      rows={2}
                      placeholder="Explain the technical issue..."
                      value={supportTicket.description}
                      onChange={(e) => setSupportTicket({ ...supportTicket, description: e.target.value })}
                      className="px-3 py-1.5 bg-surface border border-outlineVariant rounded outline-none focus:border-primary"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-primary/10 hover:bg-primary text-primary hover:text-white border border-primary/20 font-bold py-2 rounded-full transition-all cursor-pointer text-center"
                  >
                    Submit Ticket
                  </button>
                </form>

              </div>

            </div>
          </div>
        )}

      </div>

      {/* ======================================================== */}
      {/* MODAL WINDOWS (Section 5 Action Forms) */}
      {/* ======================================================== */}

      {/* 1. ADD OFFICER MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-primary/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-surface border border-outlineVariant/50 rounded-md p-6 max-w-md w-full shadow-premium flex flex-col gap-4 animate-scale-up text-xs">
            <div className="flex items-center justify-between border-b border-outlineVariant/20 pb-3">
              <h3 className="font-bold text-sm text-primary uppercase tracking-wider flex items-center gap-1.5">
                <UserPlus className="w-4.5 h-4.5" /> Register Census Officer
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-onSurfaceVariant hover:text-primary"><X className="w-4 h-4" /></button>
            </div>

            <form onSubmit={handleAddOfficerSubmit} className="space-y-4">
              <div className="flex flex-col gap-1">
                <label className="font-semibold text-primary">Full Name *</label>
                <input 
                  type="text"
                  required
                  placeholder="Enter full name..."
                  value={newOfficerForm.name}
                  onChange={(e) => setNewOfficerForm({ ...newOfficerForm, name: e.target.value })}
                  className="px-3 py-2 bg-surface border border-outlineVariant rounded outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-primary">Designation</label>
                  <select 
                    value={newOfficerForm.designation}
                    onChange={(e) => setNewOfficerForm({ ...newOfficerForm, designation: e.target.value })}
                    className="px-3 py-2 bg-surface border border-outlineVariant rounded outline-none focus:border-primary"
                  >
                    <option value="Field Verification Officer">Field Verification Officer</option>
                    <option value="Field Enumerator Supervisor">Field Enumerator Supervisor</option>
                    <option value="District Audit Officer">District Audit Officer</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-primary">Gender</label>
                  <select 
                    value={newOfficerForm.gender}
                    onChange={(e) => setNewOfficerForm({ ...newOfficerForm, gender: e.target.value })}
                    className="px-3 py-2 bg-surface border border-outlineVariant rounded outline-none focus:border-primary"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-primary">State</label>
                  <input 
                    type="text"
                    value={newOfficerForm.state}
                    disabled
                    className="px-3 py-2 bg-surface-low border border-outlineVariant rounded outline-none cursor-not-allowed"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-primary">District *</label>
                  <select 
                    value={newOfficerForm.district}
                    onChange={(e) => setNewOfficerForm({ ...newOfficerForm, district: e.target.value })}
                    className="px-3 py-2 bg-surface border border-outlineVariant rounded outline-none focus:border-primary"
                  >
                    <option value="Central Delhi">Central Delhi</option>
                    <option value="South Delhi">South Delhi</option>
                    <option value="West Delhi">West Delhi</option>
                    <option value="Jaipur">Jaipur</option>
                    <option value="Mumbai City">Mumbai City</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-primary">Mobile Number *</label>
                  <input 
                    type="tel"
                    required
                    placeholder="+91 XXXXX XXXXX"
                    value={newOfficerForm.mobile}
                    onChange={(e) => setNewOfficerForm({ ...newOfficerForm, mobile: e.target.value })}
                    className="px-3 py-2 bg-surface border border-outlineVariant rounded outline-none focus:border-primary"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-primary">Email Address *</label>
                  <input 
                    type="email"
                    required
                    placeholder="email@census.gov.in"
                    value={newOfficerForm.email}
                    onChange={(e) => setNewOfficerForm({ ...newOfficerForm, email: e.target.value })}
                    className="px-3 py-2 bg-surface border border-outlineVariant rounded outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-semibold text-primary">Assign Initial Territory</label>
                <input 
                  type="text"
                  placeholder="e.g. Ward 12 (Pahar Ganj)"
                  value={newOfficerForm.initialTerritory}
                  onChange={(e) => setNewOfficerForm({ ...newOfficerForm, initialTerritory: e.target.value })}
                  className="px-3 py-2 bg-surface border border-outlineVariant rounded outline-none focus:border-primary"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-outlineVariant/20">
                <button 
                  type="button" 
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-outlineVariant rounded-full hover:bg-surface-low font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 bg-primary text-white rounded-full hover:bg-primary-light font-bold shadow-sm cursor-pointer"
                >
                  Register Officer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. TRANSFER OFFICER MODAL */}
      {isTransferModalOpen && (
        <div className="fixed inset-0 bg-primary/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-surface border border-outlineVariant/50 rounded-md p-6 max-w-sm w-full shadow-premium flex flex-col gap-4 animate-scale-up text-xs">
            <div className="flex items-center justify-between border-b border-outlineVariant/20 pb-3">
              <h3 className="font-bold text-sm text-primary uppercase tracking-wider flex items-center gap-1.5">
                <ArrowLeftRight className="w-4.5 h-4.5" /> Transfer Officer Assignment
              </h3>
              <button onClick={() => setIsTransferModalOpen(false)} className="text-onSurfaceVariant hover:text-primary"><X className="w-4 h-4" /></button>
            </div>

            <form onSubmit={handleTransferSubmit} className="space-y-4">
              <div className="flex flex-col gap-1">
                <label className="font-semibold text-primary">Select Officer</label>
                <select 
                  value={transferForm.officerId}
                  onChange={(e) => {
                    const offObj = officers.find(o => o.id === parseInt(e.target.value));
                    setTransferForm({
                      ...transferForm,
                      officerId: e.target.value,
                      currentTerritory: offObj ? offObj.territory : ''
                    });
                  }}
                  className="px-3 py-2 bg-surface border border-outlineVariant rounded outline-none focus:border-primary"
                >
                  <option value="">-- Choose Officer --</option>
                  {officers.map(o => (
                    <option key={o.id} value={o.id}>{o.name} ({o.empId})</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-semibold text-primary">Current Assigned Territory</label>
                <input 
                  type="text"
                  disabled
                  value={transferForm.currentTerritory}
                  className="px-3 py-2 bg-surface-low border border-outlineVariant rounded outline-none cursor-not-allowed font-semibold text-primary"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-semibold text-primary">New Target Territory *</label>
                <select 
                  value={transferForm.newTerritory}
                  onChange={(e) => setTransferForm({ ...transferForm, newTerritory: e.target.value })}
                  className="px-3 py-2 bg-surface border border-outlineVariant rounded outline-none focus:border-primary font-semibold text-primary"
                >
                  <option value="">-- Choose New Territory --</option>
                  {territories.map(t => (
                    <option key={t.id} value={t.area}>{t.area} ({t.district})</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-semibold text-primary">Reason for Transfer</label>
                <textarea 
                  rows={2}
                  value={transferForm.reason}
                  placeholder="e.g. Boundary redistribution, compliance audit..."
                  onChange={(e) => setTransferForm({ ...transferForm, reason: e.target.value })}
                  className="px-3 py-2 bg-surface border border-outlineVariant rounded outline-none focus:border-primary"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-outlineVariant/20">
                <button 
                  type="button" 
                  onClick={() => setIsTransferModalOpen(false)}
                  className="px-4 py-2 border border-outlineVariant rounded-full hover:bg-surface-low font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 bg-primary text-white rounded-full hover:bg-primary-light font-bold shadow-sm cursor-pointer"
                >
                  Approve Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. SUSPEND OFFICER MODAL */}
      {isSuspendModalOpen && (
        <div className="fixed inset-0 bg-primary/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-surface border border-outlineVariant/50 rounded-md p-6 max-w-sm w-full shadow-premium flex flex-col gap-4 animate-scale-up text-xs">
            <div className="flex items-center justify-between border-b border-outlineVariant/20 pb-3">
              <h3 className="font-bold text-sm text-red-700 uppercase tracking-wider flex items-center gap-1.5">
                <AlertOctagon className="w-4.5 h-4.5" /> Suspend Officer Access
              </h3>
              <button onClick={() => setIsSuspendModalOpen(false)} className="text-onSurfaceVariant hover:text-primary"><X className="w-4 h-4" /></button>
            </div>

            <form onSubmit={handleSuspendSubmit} className="space-y-4">
              <div className="bg-red-50 text-red-800 p-3 rounded border border-red-200 flex items-start gap-2">
                <AlertTriangle className="w-4.5 h-4.5 shrink-0 text-red-600 mt-0.5" />
                <span>
                  <strong>Warning:</strong> Suspend actions immediately revoke biometric and database access tokens of the employee.
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-semibold text-primary">Select Officer to Suspend</label>
                <select 
                  value={suspendForm.officerId}
                  onChange={(e) => setSuspendForm({ ...suspendForm, officerId: e.target.value })}
                  className="px-3 py-2 bg-surface border border-outlineVariant rounded outline-none focus:border-primary"
                >
                  <option value="">-- Choose Officer --</option>
                  {officers.filter(o => o.status !== 'Suspended').map(o => (
                    <option key={o.id} value={o.id}>{o.name} ({o.empId})</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-semibold text-primary">Reason for Compliance Action</label>
                <select 
                  value={suspendForm.reason}
                  onChange={(e) => setSuspendForm({ ...suspendForm, reason: e.target.value })}
                  className="px-3 py-2 bg-surface border border-outlineVariant rounded outline-none focus:border-primary"
                >
                  <option value="Latency Issues">High Latency in Field Visits</option>
                  <option value="Citizen Complaint">Citizen Complaint Registered</option>
                  <option value="Background Fail">Aadhaar/Identity mismatch</option>
                  <option value="Security Policy">Security Policy Infraction</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-primary">Suspension Start</label>
                  <input 
                    type="date"
                    required
                    value={suspendForm.startDate}
                    onChange={(e) => setSuspendForm({ ...suspendForm, startDate: e.target.value })}
                    className="px-3 py-2 bg-surface border border-outlineVariant rounded outline-none focus:border-primary"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-primary">Suspension End</label>
                  <input 
                    type="date"
                    required
                    value={suspendForm.endDate}
                    onChange={(e) => setSuspendForm({ ...suspendForm, endDate: e.target.value })}
                    className="px-3 py-2 bg-surface border border-outlineVariant rounded outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-semibold text-primary">Administrator Remarks</label>
                <textarea 
                  rows={2}
                  value={suspendForm.remarks}
                  placeholder="Specify findings, audit log details..."
                  onChange={(e) => setSuspendForm({ ...suspendForm, remarks: e.target.value })}
                  className="px-3 py-2 bg-surface border border-outlineVariant rounded outline-none focus:border-primary"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-outlineVariant/20">
                <button 
                  type="button" 
                  onClick={() => setIsSuspendModalOpen(false)}
                  className="px-4 py-2 border border-outlineVariant rounded-full hover:bg-surface-low font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 font-bold shadow-sm cursor-pointer"
                >
                  Confirm Suspension
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. ASSIGN TERRITORY MODAL */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 bg-primary/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-surface border border-outlineVariant/50 rounded-md p-6 max-w-sm w-full shadow-premium flex flex-col gap-4 animate-scale-up text-xs">
            <div className="flex items-center justify-between border-b border-outlineVariant/20 pb-3">
              <h3 className="font-bold text-sm text-primary uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-4.5 h-4.5" /> Allocate Operational Territory
              </h3>
              <button onClick={() => setIsAssignModalOpen(false)} className="text-onSurfaceVariant hover:text-primary"><X className="w-4 h-4" /></button>
            </div>

            <form onSubmit={handleAssignSubmit} className="space-y-4">
              <div className="flex flex-col gap-1">
                <label className="font-semibold text-primary">Select Officer</label>
                <select 
                  value={assignForm.officerId}
                  required
                  onChange={(e) => setAssignForm({ ...assignForm, officerId: e.target.value })}
                  className="px-3 py-2 bg-surface border border-outlineVariant rounded outline-none focus:border-primary"
                >
                  <option value="">-- Choose Officer --</option>
                  {officers.map(o => (
                    <option key={o.id} value={o.id}>{o.name} ({o.empId})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-primary">State</label>
                  <input 
                    type="text"
                    disabled
                    value={assignForm.state}
                    className="px-3 py-2 bg-surface-low border border-outlineVariant rounded outline-none cursor-not-allowed"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-primary">District</label>
                  <select 
                    value={assignForm.district}
                    onChange={(e) => setAssignForm({ ...assignForm, district: e.target.value })}
                    className="px-3 py-2 bg-surface border border-outlineVariant rounded outline-none focus:border-primary"
                  >
                    <option value="Central Delhi">Central Delhi</option>
                    <option value="South Delhi">South Delhi</option>
                    <option value="West Delhi">West Delhi</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="flex flex-col gap-1 col-span-1">
                  <label className="font-semibold text-primary">Ward *</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. 12"
                    value={assignForm.ward}
                    onChange={(e) => setAssignForm({ ...assignForm, ward: e.target.value })}
                    className="px-3 py-2 bg-surface border border-outlineVariant rounded outline-none focus:border-primary"
                  />
                </div>
                <div className="flex flex-col gap-1 col-span-2">
                  <label className="font-semibold text-primary">Village / Town</label>
                  <input 
                    type="text"
                    placeholder="e.g. Pahar Ganj"
                    value={assignForm.village}
                    onChange={(e) => setAssignForm({ ...assignForm, village: e.target.value })}
                    className="px-3 py-2 bg-surface border border-outlineVariant rounded outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-semibold text-primary">Census Block Designation</label>
                <input 
                  type="text"
                  placeholder="e.g. Zone 4 Block B"
                  value={assignForm.block}
                  onChange={(e) => setAssignForm({ ...assignForm, block: e.target.value })}
                  className="px-3 py-2 bg-surface border border-outlineVariant rounded outline-none focus:border-primary"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-outlineVariant/20">
                <button 
                  type="button" 
                  onClick={() => setIsAssignModalOpen(false)}
                  className="px-4 py-2 border border-outlineVariant rounded-full hover:bg-surface-low font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 bg-primary text-white rounded-full hover:bg-primary-light font-bold shadow-sm cursor-pointer"
                >
                  Confirm Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

// Raw SVG elements mockups to avoid imports
const LandmarkIconSVG = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="22" x2="21" y2="22" />
    <line x1="6" y1="18" x2="6" y2="11" />
    <line x1="10" y1="18" x2="10" y2="11" />
    <line x1="14" y1="18" x2="14" y2="11" />
    <line x1="18" y1="18" x2="18" y2="11" />
    <polygon points="12 2 2 7 22 7" />
  </svg>
);

const BarChart2IconSVG = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);

export default OfficerManagement;
