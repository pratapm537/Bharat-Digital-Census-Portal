import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import {
  Calendar, Clock, MapPin, User, CheckCircle, AlertTriangle, Search,
  MessageSquare, Phone, Mail, FileText, ChevronRight, Info, Lock, Plus,
  Trash2, Settings, ArrowLeft, ArrowRight, Download, RefreshCw, Sliders,
  LifeBuoy, Send, Sparkles, X, Shield, Bell, HelpCircle
} from 'lucide-react';

const AppointmentBooking = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // App Active Tabs: 'dashboard' | 'wizard' | 'history' | 'support'
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [historySearch, setHistorySearch] = useState('');
  const [historyFilter, setHistoryFilter] = useState('all');

  // Master Appointments State
  const [appointments, setAppointments] = useState([
    { id: 'APT-2026-102547', type: 'document', typeLabel: 'Document Verification', date: '12 Jan 2026', time: '10:00 AM', location: 'Delhi Census Help Center', officer: 'Amit Sharma', status: 'Completed' },
    { id: 'APT-2026-302145', type: 'verification', typeLabel: 'Verification Visit', date: '22 Jan 2026', time: '02:00 PM', location: 'Citizen Address', officer: 'Rahul Sharma', status: 'Completed' },
    { id: 'APT-2026-908254', type: 'help', typeLabel: 'Help Center Visit', date: '15 Feb 2026', time: '11:00 AM', location: 'Connaught Place Center', officer: 'Priya Patel', status: 'Completed' },
    { id: 'APT-2026-785412', type: 'document', typeLabel: 'Document Verification', date: '15 Jun 2026', time: '10:00 AM', location: 'Delhi Census Help Center', officer: 'Pending Assignment', status: 'Confirmed' }
  ]);

  // Notifications state
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'Upcoming Appointment: Document Verification on 15 June 2026, 10:00 AM.', date: 'Today · 09:30 AM', read: false, type: 'reminder' },
    { id: 2, text: 'Officer Amit Sharma has been assigned to your verification profile.', date: 'Yesterday · 04:15 PM', read: true, type: 'assignment' },
    { id: 3, text: 'Support Ticket #TIC-9085 solved: Slot corrections synced successfully.', date: '2 Jun 2026', read: true, type: 'system' }
  ]);

  // Booking Wizard States
  const [bookingStep, setBookingStep] = useState(1); // 1: Type selection, 2: Location/Details, 3: Calendar & Slots, 4: Summary, 5: Confirm card
  const [selectedType, setSelectedType] = useState('verification'); // 'verification' | 'help' | 'document'
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  
  // Custom states
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Rescheduling state
  const [rescheduleTarget, setRescheduleTarget] = useState(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('');

  // Cancellation state
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelReason, setCancelReason] = useState('Conflict');
  const [cancelCustomReason, setCancelCustomReason] = useState('');
  const [cancelPolicyChecked, setCancelPolicyChecked] = useState(false);

  // Chatbox simulator states
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { id: 1, text: 'Hello! I am your Bharat Census Assistant. How can I help you with scheduling or appointments today?', sender: 'bot', time: 'Just now' }
  ]);
  const [chatTyping, setChatTyping] = useState(false);

  // Ticket submission state
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState('booking');
  const [ticketDescription, setTicketDescription] = useState('');
  
  // Active tracker appointment
  const trackerAppointment = useMemo(() => {
    return appointments.find(apt => apt.status === 'Confirmed' || apt.status === 'Requested') || appointments[0];
  }, [appointments]);

  // Math stats calculation
  const statsOverview = useMemo(() => {
    return {
      total: appointments.length,
      upcoming: appointments.filter(a => a.status === 'Confirmed' || a.status === 'Requested').length,
      completed: appointments.filter(a => a.status === 'Completed').length,
      cancelled: appointments.filter(a => a.status === 'Cancelled').length
    };
  }, [appointments]);

  // Appointment types details static data mapping
  const appointmentTypeMeta = {
    verification: {
      title: 'Verification Visit',
      subtitle: 'Government officer visits your registered address for verification.',
      usedFor: ['Household Verification', 'Address Proof Validation', 'Family Registry Sync'],
      duration: '30 Minutes',
      locationDesc: 'Home Visit (Your registered address)',
      officerReq: 'Field Verification Officer',
      docs: ['Aadhaar Card', 'Land Registry Copy / Rent Agreement', 'Family Head Identity Proof']
    },
    help: {
      title: 'Help Center Visit',
      subtitle: 'Meet with a support executive at the nearest census support center.',
      usedFor: ['Registration Assistance', 'Technical System Support', 'Profile Correction Queries'],
      duration: '20 Minutes',
      locationDesc: 'Local Government Census Help Center',
      officerReq: 'Support Executive Panel',
      docs: ['Aadhaar Card', 'Proof of Discrepancy (if modifying details)', 'Old Enrollment Slip']
    },
    document: {
      title: 'Document Verification',
      subtitle: 'Submit and verify your documents with an authorized officer.',
      usedFor: ['Aadhaar Validation Check', 'Biometric Enrollment Sync', 'Identity Verification Audit'],
      duration: '15 Minutes',
      locationDesc: 'Delhi Census Audit & Help Center',
      officerReq: 'Authorized Verification Officer',
      docs: ['Aadhaar Card', 'Voter Identity Card', 'Official Address Verification Document']
    }
  };

  // Nearby Centers Data
  const nearbyCenters = [
    { id: 'CP-101', name: 'Delhi Central Census Center', address: 'Block H, Connaught Place, New Delhi', distance: '1.8 KM', slots: 12 },
    { id: 'DWR-102', name: 'Dwarka Sector 6 Support Point', address: 'Plot 4, Sector 6 Main Road, Dwarka', distance: '4.5 KM', slots: 8 },
    { id: 'GK-103', name: 'Greater Kailash Registry Hub', address: 'M-Block Market, GK 2, New Delhi', distance: '6.2 KM', slots: 15 },
    { id: 'ROH-104', name: 'Rohini Sector 11 Audit Center', address: 'Pocket 2, Sector 11, Rohini', distance: '9.4 KM', slots: 0 }
  ];

  // Calendar parameters: June 2026 (Starts on Monday, has 30 days)
  const daysInJune = 30;
  const startOffset = 1; // 1 empty slot for Sunday

  const getDayStatus = (day) => {
    if (day === 13) return { slots: 0, status: 'holiday', label: 'Holiday' };
    if ([7, 14, 21, 28].includes(day)) return { slots: 0, status: 'weekend', label: 'Weekend' };
    if ([6, 20, 27].includes(day)) return { slots: 3, status: 'limited', label: '3 Slots' };
    if (day === 12 || day === 24) return { slots: 0, status: 'full', label: 'Full' };
    if (day === 11 || day === 18) return { slots: 2, status: 'limited', label: '2 Slots' };
    return { slots: 12, status: 'available', label: 'Available' };
  };

  // Time Slots
  const morningSlots = ['09:00 AM', '10:00 AM', '11:00 AM'];
  const afternoonSlots = ['01:00 PM', '02:00 PM', '03:00 PM'];
  const eveningSlots = ['04:00 PM', '05:00 PM', '06:00 PM'];

  // Handle Wizard Submit Step 1
  const handleSelectType = (type) => {
    setSelectedType(type);
    if (type === 'verification') {
      setSelectedCenter({ name: 'Citizen Registered Address', address: user?.address || '12, Pratap Mehra Villa, Sector 4, Dwarka, New Delhi', distance: 'Home Visit' });
    } else {
      setSelectedCenter(null);
    }
    setBookingStep(2);
  };

  // Handle Wizard Submit Step 2
  const handleSelectLocation = (center) => {
    setSelectedCenter(center);
    setBookingStep(3);
  };

  // Handle Wizard Submit Step 3
  const handleSelectSlot = (date, slot) => {
    setSelectedDate(date);
    setSelectedTimeSlot(slot);
    setBookingStep(4);
  };

  // Confirm booking (Step 4 -> 5)
  const handleConfirmBooking = () => {
    const newId = `APT-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const newApt = {
      id: newId,
      type: selectedType,
      typeLabel: appointmentTypeMeta[selectedType].title,
      date: `${selectedDate} Jun 2026`,
      time: selectedTimeSlot,
      location: selectedCenter?.name || 'Citizen Address',
      officer: selectedType === 'verification' ? 'Officer Amit Sharma' : 'Pending Assignment',
      status: 'Confirmed'
    };

    setAppointments(prev => [newApt, ...prev]);
    setNotifications(prev => [
      { id: Date.now(), text: `Appointment ${newId} confirmed for ${selectedDate} June 2026, ${selectedTimeSlot}.`, date: 'Just now', read: false, type: 'reminder' },
      ...prev
    ]);
    setSuccess(`Appointment ${newId} successfully reserved!`);
    setBookingStep(5);
  };

  // Cancel Appointment Form Action
  const handleCancelAppointmentSubmit = (e) => {
    e.preventDefault();
    if (!cancelPolicyChecked) {
      setError('You must read and agree to the cancellation terms.');
      return;
    }

    setAppointments(prev => prev.map(apt => {
      if (apt.id === cancelTarget.id) {
        return { ...apt, status: 'Cancelled' };
      }
      return apt;
    }));

    setNotifications(prev => [
      { id: Date.now(), text: `Appointment ${cancelTarget.id} was cancelled successfully.`, date: 'Just now', read: false, type: 'system' },
      ...prev
    ]);

    setSuccess(`Appointment ${cancelTarget.id} has been cancelled.`);
    setCancelTarget(null);
    setCancelCustomReason('');
    setCancelPolicyChecked(false);
  };

  // Reschedule Form Action
  const handleRescheduleSubmit = (e) => {
    e.preventDefault();
    if (!rescheduleDate || !rescheduleTime) {
      setError('Please select both a date and time slot.');
      return;
    }

    setAppointments(prev => prev.map(apt => {
      if (apt.id === rescheduleTarget.id) {
        return { ...apt, date: `${rescheduleDate} Jun 2026`, time: rescheduleTime };
      }
      return apt;
    }));

    setNotifications(prev => [
      { id: Date.now(), text: `Appointment ${rescheduleTarget.id} rescheduled to ${rescheduleDate} June 2026 at ${rescheduleTime}.`, date: 'Just now', read: false, type: 'system' },
      ...prev
    ]);

    setSuccess(`Appointment ${rescheduleTarget.id} rescheduled successfully.`);
    setRescheduleTarget(null);
    setRescheduleDate('');
    setRescheduleTime('');
  };

  // Reset booking wizard to start again
  const handleResetBooking = () => {
    setSelectedType('verification');
    setSelectedCenter(null);
    setSelectedDate('');
    setSelectedTimeSlot('');
    setBookingStep(1);
    setActiveTab('dashboard');
  };

  // Chat message submit
  const handleSendChatMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = { id: Date.now(), text: chatInput, sender: 'user', time: 'Just now' };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setChatTyping(true);

    setTimeout(() => {
      setChatTyping(false);
      let replyText = "I'm sorry, I didn't quite get that. You can ask me to search centers, describe required documents, or help change slots.";
      const query = chatInput.toLowerCase();

      if (query.includes('document') || query.includes('verify')) {
        replyText = "For Document Verification sessions, you'll need your Aadhaar Card, Voter ID, and Address Proof. A session usually takes 15 minutes.";
      } else if (query.includes('home') || query.includes('visit') || query.includes('address')) {
        replyText = "Verification visits are scheduled at your registered address. An officer visits you to check household records and it takes about 30 minutes.";
      } else if (query.includes('cancel') || query.includes('reschedule')) {
        replyText = "You can manage your bookings directly by clicking 'Reschedule' or 'Cancel' on the cards listed under the 'Upcoming Appointments' tab.";
      } else if (query.includes('center') || query.includes('location')) {
        replyText = "The nearest census helpdesk is the Delhi Central Census Center, located 1.8 KM away, open Mon-Sat from 9 AM to 6 PM.";
      }

      setChatMessages(prev => [...prev, { id: Date.now() + 1, text: replyText, sender: 'bot', time: 'Just now' }]);
    }, 1000);
  };

  // Support ticket form submit
  const handleSupportTicketSubmit = (e) => {
    e.preventDefault();
    if (!ticketSubject || !ticketDescription) return;

    setSuccess(`Support Ticket #TIC-2026-${Math.floor(1000 + Math.random() * 9000)} has been registered. Our desk officer will respond shortly.`);
    setTicketSubject('');
    setTicketDescription('');
  };

  // Clear success notification
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess('');
        setError('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  // Filtered Appointments History
  const filteredHistory = useMemo(() => {
    return appointments.filter(apt => {
      const matchesSearch = apt.id.toLowerCase().includes(historySearch.toLowerCase()) ||
                            apt.typeLabel.toLowerCase().includes(historySearch.toLowerCase()) ||
                            (apt.officer && apt.officer.toLowerCase().includes(historySearch.toLowerCase()));
      const matchesStatus = historyFilter === 'all' || apt.status.toLowerCase() === historyFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    });
  }, [appointments, historySearch, historyFilter]);

  // Search/Navigate from top search bar
  const handleSearchNavigate = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setHistorySearch(searchQuery);
    setActiveTab('history');
    setSearchQuery('');
  };

  // Download logs helper
  const triggerExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["Appointment ID,Type,Date,Time,Location,Officer,Status"].join(",") + "\n"
      + appointments.map(apt => `${apt.id},${apt.typeLabel},${apt.date},${apt.time},${apt.location},${apt.officer},${apt.status}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Census_Appointments_History_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setSuccess('Appointment history log exported successfully.');
  };

  return (
    <div className="flex-grow w-full bg-[#f8faff] min-h-screen pb-16 relative">
      
      {/* ══════════════════════════════════════════════════
          SECTION 1: PAGE HEADER
      ══════════════════════════════════════════════════ */}
      <div className="bg-[#0b2447] text-white py-10 px-6 sm:px-12 relative overflow-hidden shadow-lg border-b border-white/5">
        <div className="absolute right-0 top-0 w-96 h-96 bg-[#ff9933]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/2 bottom-0 w-80 h-80 bg-[#138808]/15 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div>
            <button 
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white mb-3 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
            </button>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] uppercase font-bold text-white/50 tracking-widest bg-white/10 px-3 py-0.5 rounded-full">
                UIDAI Registry Sync
              </span>
              <span className="text-[10px] uppercase font-bold text-[#ff9933] bg-[#ff9933]/15 border border-[#ff9933]/25 px-3 py-0.5 rounded-full">
                Appointment Portal
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-2 flex items-center gap-2.5">
              <Calendar className="w-8 h-8 text-[#ff9933]" /> Appointment Booking Center
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl font-light">
              Schedule verification visits, document verification sessions, and support center appointments.
            </p>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto shrink-0">
            {/* Global Search Bar inside Header */}
            <form onSubmit={handleSearchNavigate} className="relative w-full md:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search appointments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-350 outline-none focus:border-white focus:bg-white/15 transition-all"
              />
            </form>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8">
        
        {/* Success / Error Banners */}
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
            SECTION 2: APPOINTMENT OVERVIEW
        ══════════════════════════════════════════════════ */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Appointments', value: statsOverview.total, icon: Calendar, color: '#0b2447', bg: 'rgba(11,36,71,0.06)' },
            { label: 'Upcoming Slots', value: statsOverview.upcoming, icon: Clock, color: '#ff9933', bg: 'rgba(255,153,51,0.06)' },
            { label: 'Completed Visits', value: statsOverview.completed, icon: CheckCircle, color: '#138808', bg: 'rgba(19,136,8,0.06)' },
            { label: 'Cancelled Request', value: statsOverview.cancelled, icon: AlertTriangle, color: '#ef4444', bg: 'rgba(239,68,68,0.06)' }
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block">{stat.label}</span>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-[#0b2447] mt-1">{stat.value}</h3>
                </div>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: stat.bg, color: stat.color }}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Menu Navigation Tabs */}
        <div className="flex border-b border-slate-200 mb-8 overflow-x-auto whitespace-nowrap">
          {[
            { id: 'dashboard', label: 'Booking Desk', icon: Calendar },
            { id: 'wizard', label: 'Book New Slot', icon: Plus },
            { id: 'history', label: 'Appointment Logs', icon: FileText },
            { id: 'support', label: 'Help & Desk Support', icon: HelpCircle }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (tab.id === 'wizard') handleResetBooking();
                }}
                className={`py-3 px-6 flex items-center gap-2 border-b-2 font-bold text-xs cursor-pointer transition-all ${
                  activeTab === tab.id 
                    ? 'border-primary text-primary font-extrabold' 
                    : 'border-transparent text-slate-500 hover:text-primary hover:border-slate-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ══════════════════════════════════════════════════
            MAIN CONTENT AREA GRID
        ══════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COL: TAB CONTENT (8 Columns) */}
          <div className="lg:col-span-8 space-y-6">

            {/* TAB 1: DASHBOARD VIEW */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                
                {/* SECTION 10: UPCOMING APPOINTMENTS */}
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-extrabold text-sm text-[#0b2447]">Upcoming Appointments</h4>
                    <span className="text-[10px] bg-amber-50 text-amber-700 px-2.5 py-0.5 rounded-full font-bold">Action Needed</span>
                  </div>

                  <div className="space-y-4">
                    {appointments.filter(a => a.status === 'Confirmed' || a.status === 'Requested').length === 0 ? (
                      <div className="text-center py-6 text-slate-400 text-xs">
                        No upcoming appointments. Click 'Book New Slot' to schedule one.
                      </div>
                    ) : (
                      appointments.filter(a => a.status === 'Confirmed' || a.status === 'Requested').map((apt) => (
                        <div key={apt.id} className="p-4 border border-slate-150 bg-slate-50/50 rounded-2xl hover:shadow-sm transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                                {apt.id}
                              </span>
                              <span className="text-[9px] font-bold text-green-600 bg-green-50 border border-green-100 px-2 py-0.5 rounded-full">
                                {apt.status}
                              </span>
                            </div>
                            <h5 className="font-extrabold text-xs text-[#0b2447] pt-1">{apt.typeLabel}</h5>
                            <div className="flex items-center gap-4 text-[10px] text-slate-500 pt-1 flex-wrap">
                              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {apt.date}</span>
                              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {apt.time}</span>
                              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-[#ff9933]" /> {apt.location}</span>
                            </div>
                          </div>

                          <div className="flex gap-2 w-full sm:w-auto self-end sm:self-center shrink-0">
                            <button
                              onClick={() => {
                                setRescheduleTarget(apt);
                                setRescheduleDate('18');
                                setRescheduleTime('11:00 AM');
                              }}
                              className="flex-1 sm:flex-none bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 py-1.5 px-3 rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                            >
                              Reschedule
                            </button>
                            <button
                              onClick={() => {
                                setCancelTarget(apt);
                              }}
                              className="flex-1 sm:flex-none bg-red-50 hover:bg-red-100 text-red-650 border border-red-100 py-1.5 px-3 rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* SECTION 12: APPOINTMENT STATUS TRACKER */}
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
                  <h4 className="font-extrabold text-sm text-[#0b2447] mb-2">Live Appointment Tracker</h4>
                  <p className="text-[10px] text-slate-400 mb-6">Track progress of your upcoming slot in real-time.</p>

                  {trackerAppointment ? (
                    <div className="space-y-6">
                      <div className="bg-[#f8faff] p-4 border border-slate-100 rounded-2xl flex items-center justify-between">
                        <div>
                          <span className="text-[8px] font-bold text-slate-450 uppercase block">Active Track ID</span>
                          <span className="text-xs font-bold text-[#0b2447]">{trackerAppointment.id}</span>
                        </div>
                        <div>
                          <span className="text-[8px] font-bold text-slate-450 uppercase block text-right">Appt Type</span>
                          <span className="text-xs font-bold text-slate-650">{trackerAppointment.typeLabel}</span>
                        </div>
                      </div>

                      <div className="relative flex justify-between items-center w-full px-4">
                        {/* Tracker Line */}
                        <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-slate-200 -z-10">
                          <div className="h-full bg-green-500 rounded transition-all duration-500" 
                            style={{ 
                              width: trackerAppointment.status === 'Completed' ? '100%' : 
                                     trackerAppointment.officer !== 'Pending Assignment' ? '66%' : '33%' 
                            }} 
                          />
                        </div>

                        {/* Tracker Steps */}
                        {[
                          { title: 'Requested', desc: 'Request logged', active: true },
                          { title: 'Confirmed', desc: 'Slot approved', active: trackerAppointment.status !== 'Requested' },
                          { title: 'Officer Assigned', desc: trackerAppointment.officer !== 'Pending Assignment' ? trackerAppointment.officer : 'Matching...', active: trackerAppointment.officer !== 'Pending Assignment' },
                          { title: 'Completed', desc: 'Audit verified', active: trackerAppointment.status === 'Completed' }
                        ].map((step, idx) => (
                          <div key={idx} className="flex flex-col items-center text-center relative">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                              step.active 
                                ? 'bg-green-500 border-green-500 text-white shadow-sm' 
                                : 'bg-white border-slate-300 text-slate-400'
                            }`}>
                              {step.active ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                            </div>
                            <span className="text-[9px] font-extrabold text-[#0b2447] mt-2 block">{step.title}</span>
                            <span className="text-[7px] text-slate-400 block mt-0.5 max-w-[64px] truncate">{step.desc}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4 text-slate-400 text-xs">
                      No active tracking slots available.
                    </div>
                  )}
                </div>

                {/* Quick actions box for quick redirects */}
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
                  <h4 className="font-extrabold text-sm text-[#0b2447] mb-3">Quick Navigation Shortcuts</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                    <button onClick={() => setActiveTab('wizard')} className="p-3 bg-[#f8faff] hover:bg-slate-100 border border-slate-100 rounded-2xl flex flex-col items-center gap-1.5 transition-colors cursor-pointer text-xs font-bold">
                      <Plus className="w-5 h-5 text-blue-600" />
                      <span>Book New</span>
                    </button>
                    <button onClick={() => { setActiveTab('history'); setHistoryFilter('completed'); }} className="p-3 bg-[#f8faff] hover:bg-slate-100 border border-slate-100 rounded-2xl flex flex-col items-center gap-1.5 transition-colors cursor-pointer text-xs font-bold">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span>View History</span>
                    </button>
                    <button onClick={() => {
                      const nextApt = appointments.find(a => a.status === 'Confirmed' || a.status === 'Requested');
                      if (nextApt) setRescheduleTarget(nextApt);
                    }} className="p-3 bg-[#f8faff] hover:bg-slate-100 border border-slate-100 rounded-2xl flex flex-col items-center gap-1.5 transition-colors cursor-pointer text-xs font-bold">
                      <RefreshCw className="w-5 h-5 text-amber-500" />
                      <span>Reschedule Slot</span>
                    </button>
                    <button onClick={() => setActiveTab('support')} className="p-3 bg-[#f8faff] hover:bg-slate-100 border border-slate-100 rounded-2xl flex flex-col items-center gap-1.5 transition-colors cursor-pointer text-xs font-bold">
                      <LifeBuoy className="w-5 h-5 text-purple-600" />
                      <span>Contact Help</span>
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* TAB 2: BOOK NEW SLOT (WIZARD FLOW) */}
            {activeTab === 'wizard' && (
              <div className="space-y-6">
                
                {/* Stepper Header */}
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">Booking Step {bookingStep} of 4</span>
                  
                  {/* Stepper Progress */}
                  <div className="flex gap-2">
                    {[1, 2, 3, 4].map((step) => (
                      <div 
                        key={step} 
                        className={`w-8 h-2 rounded-full transition-all ${
                          bookingStep >= step 
                            ? 'bg-primary' 
                            : 'bg-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* STEP 1: APPOINTMENT TYPE SELECTION */}
                {bookingStep === 1 && (
                  <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-6">
                    <div>
                      <h4 className="font-extrabold text-sm text-[#0b2447]">Select Appointment Type</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">Choose the type of service you wish to schedule with the registry desk.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Card 1: Verification Visit */}
                      <div className={`p-5 border rounded-2xl cursor-pointer hover:shadow-md transition-all flex flex-col justify-between ${
                        selectedType === 'verification' ? 'border-[#ff9933] bg-[#ff9933]/2' : 'border-slate-200 bg-slate-50/50'
                      }`}
                      onClick={() => setSelectedType('verification')}
                      >
                        <div>
                          <User className="w-8 h-8 text-[#ff9933] mb-3" />
                          <h5 className="font-extrabold text-xs text-[#0b2447]">Verification Visit</h5>
                          <p className="text-[9px] text-slate-550 mt-1">Government officer visits your registered address for verification.</p>
                        </div>
                        <div className="pt-4 border-t border-slate-150/60 mt-4 flex items-center justify-between text-[10px] font-bold text-[#0b2447]">
                          <span>Duration: 30 Min</span>
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>

                      {/* Card 2: Help Center Visit */}
                      <div className={`p-5 border rounded-2xl cursor-pointer hover:shadow-md transition-all flex flex-col justify-between ${
                        selectedType === 'help' ? 'border-[#ff9933] bg-[#ff9933]/2' : 'border-slate-200 bg-slate-50/50'
                      }`}
                      onClick={() => setSelectedType('help')}
                      >
                        <div>
                          <MessageSquare className="w-8 h-8 text-blue-600 mb-3" />
                          <h5 className="font-extrabold text-xs text-[#0b2447]">Help Center Visit</h5>
                          <p className="text-[9px] text-slate-550 mt-1">Meet with a support executive at the nearest census support center.</p>
                        </div>
                        <div className="pt-4 border-t border-slate-150/60 mt-4 flex items-center justify-between text-[10px] font-bold text-[#0b2447]">
                          <span>Duration: 20 Min</span>
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>

                      {/* Card 3: Document Verification */}
                      <div className={`p-5 border rounded-2xl cursor-pointer hover:shadow-md transition-all flex flex-col justify-between ${
                        selectedType === 'document' ? 'border-[#ff9933] bg-[#ff9933]/2' : 'border-slate-200 bg-slate-50/50'
                      }`}
                      onClick={() => setSelectedType('document')}
                      >
                        <div>
                          <FileText className="w-8 h-8 text-green-600 mb-3" />
                          <h5 className="font-extrabold text-xs text-[#0b2447]">Document Verification</h5>
                          <p className="text-[9px] text-slate-550 mt-1">Submit and verify your documents with an authorized officer.</p>
                        </div>
                        <div className="pt-4 border-t border-slate-150/60 mt-4 flex items-center justify-between text-[10px] font-bold text-[#0b2447]">
                          <span>Duration: 15 Min</span>
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>

                    {/* SECTION 4: APPOINTMENT TYPE DETAILS DISPLAY */}
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-150 space-y-3">
                      <div className="flex items-center gap-1.5">
                        <Info className="w-4 h-4 text-primary" />
                        <h6 className="font-extrabold text-xs text-primary">{appointmentTypeMeta[selectedType].title} Requirements</h6>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[10px] pt-1">
                        <div className="space-y-1.5">
                          <p><span className="text-slate-400 uppercase font-bold block text-[8px]">Description</span> {appointmentTypeMeta[selectedType].subtitle}</p>
                          <p><span className="text-slate-400 uppercase font-bold block text-[8px]">Available Locations</span> {appointmentTypeMeta[selectedType].locationDesc}</p>
                          <p><span className="text-slate-400 uppercase font-bold block text-[8px]">Expected Officer Role</span> {appointmentTypeMeta[selectedType].officerReq}</p>
                        </div>
                        <div>
                          <span className="text-slate-400 uppercase font-bold block text-[8px] mb-1">Mandatory Documents Checklist</span>
                          <ul className="space-y-1 font-semibold text-slate-650 pl-1">
                            {appointmentTypeMeta[selectedType].docs.map((doc, idx) => (
                              <li key={idx} className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                {doc}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button 
                        onClick={() => handleSelectType(selectedType)}
                        className="bg-primary hover:bg-primary-light text-white text-xs font-bold py-2.5 px-6 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                      >
                        Proceed to Location <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 2: LOCATION SELECTION */}
                {bookingStep === 2 && (
                  <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-extrabold text-sm text-[#0b2447]">Select Booking Location</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">Determine the audit venue or submit address parameters.</p>
                      </div>
                      <button 
                        onClick={() => setBookingStep(1)} 
                        className="text-xs text-slate-500 hover:text-primary flex items-center gap-1"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" /> Back
                      </button>
                    </div>

                    {selectedType === 'verification' ? (
                      /* Home Visit view */
                      <div className="border border-[#ff9933] bg-[#ff9933]/2 p-5 rounded-2xl space-y-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-5 h-5 text-[#ff9933]" />
                          <h5 className="font-extrabold text-xs text-[#0b2447]">Home Visit Option Details</h5>
                        </div>
                        
                        <div className="text-[10px] space-y-2 text-slate-650 font-bold">
                          <div className="bg-white p-3.5 rounded-xl border border-slate-150">
                            <span className="text-slate-400 text-[8px] uppercase block mb-0.5">Registered Address (Destination)</span>
                            <span className="text-[#0b2447] text-xs">{selectedCenter?.address}</span>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="bg-white p-3 rounded-xl border border-slate-150">
                              <span className="text-slate-400 text-[8px] uppercase block mb-0.5">Officer Availability</span>
                              <span className="text-green-600">Mon - Sat (9AM - 6PM)</span>
                            </div>
                            <div className="bg-white p-3 rounded-xl border border-slate-150">
                              <span className="text-slate-400 text-[8px] uppercase block mb-0.5">Estimated Visit Window</span>
                              <span>24 - 48 Hours from reservation</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-end pt-2">
                          <button
                            onClick={() => setBookingStep(3)}
                            className="bg-primary hover:bg-primary-light text-white text-xs font-bold py-2.5 px-6 rounded-xl transition-all cursor-pointer shadow-sm"
                          >
                            Continue to Calendar
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Nearby Centers listing */
                      <div className="space-y-4">
                        <span className="text-xs font-extrabold text-[#0b2447] block">Nearby Available Census Centers</span>
                        
                        <div className="grid grid-cols-1 gap-3">
                          {nearbyCenters.map((center) => (
                            <div 
                              key={center.id} 
                              className={`p-4 border rounded-2xl hover:shadow-md transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${
                                selectedCenter?.id === center.id ? 'border-[#ff9933] bg-[#ff9933]/2' : 'border-slate-200 bg-slate-50/50'
                              }`}
                            >
                              <div>
                                <h5 className="font-extrabold text-xs text-[#0b2447]">{center.name}</h5>
                                <p className="text-[10px] text-slate-550 mt-0.5">{center.address}</p>
                                <div className="flex gap-4 text-[9px] text-slate-400 font-bold mt-1.5">
                                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-[#ff9933]" /> {center.distance}</span>
                                  <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-green-600" /> {center.slots} Slots Available</span>
                                </div>
                              </div>

                              <button
                                onClick={() => handleSelectLocation(center)}
                                disabled={center.slots === 0}
                                className={`w-full sm:w-auto text-[10px] font-bold py-2 px-4 rounded-xl transition-all cursor-pointer ${
                                  center.slots === 0 
                                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                                    : selectedCenter?.id === center.id 
                                      ? 'bg-[#ff9933] text-white' 
                                      : 'bg-primary text-white hover:bg-primary-light'
                                }`}
                              >
                                {center.slots === 0 ? 'Fully Booked' : selectedCenter?.id === center.id ? 'Selected' : 'Select Center'}
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* STEP 3: CALENDAR & TIME SLOT SELECTION */}
                {bookingStep === 3 && (
                  <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-extrabold text-sm text-[#0b2447]">Select Date & Time Slot</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">Determine the specific calendar day and timing window.</p>
                      </div>
                      <button 
                        onClick={() => setBookingStep(2)} 
                        className="text-xs text-slate-500 hover:text-primary flex items-center gap-1"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" /> Back
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                      {/* SECTION 6: INTERACTIVE MONTHLY CALENDAR (7 columns) */}
                      <div className="md:col-span-7 border border-slate-150 p-4 rounded-2xl bg-slate-50/50">
                        <div className="flex justify-between items-center mb-3 px-1">
                          <span className="font-extrabold text-xs text-primary font-sans">June 2026</span>
                          <span className="text-[8px] bg-primary/10 text-primary px-2 py-0.5 rounded font-extrabold">Gov Registry Calendar</span>
                        </div>

                        {/* Calendar Grid */}
                        <div className="grid grid-cols-7 gap-1 text-center">
                          {/* Day names */}
                          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((n, i) => (
                            <span key={i} className="text-[9px] font-bold text-slate-400 py-1">{n}</span>
                          ))}

                          {/* Offset placeholders */}
                          {Array.from({ length: startOffset }).map((_, i) => (
                            <div key={`offset-${i}`} className="p-2" />
                          ))}

                          {/* Days of June */}
                          {Array.from({ length: daysInJune }).map((_, i) => {
                            const dayNum = i + 1;
                            const dayInfo = getDayStatus(dayNum);
                            const isSelected = selectedDate === String(dayNum);
                            
                            return (
                              <button
                                key={dayNum}
                                onClick={() => {
                                  if (dayInfo.status !== 'holiday' && dayInfo.status !== 'weekend' && dayInfo.status !== 'full') {
                                    setSelectedDate(String(dayNum));
                                  }
                                }}
                                disabled={dayInfo.status === 'holiday' || dayInfo.status === 'weekend' || dayInfo.status === 'full'}
                                className={`p-2 border rounded-lg text-xs font-bold flex flex-col justify-between h-12 cursor-pointer transition-all ${dayInfo.bg} ${
                                  isSelected 
                                    ? 'ring-2 ring-primary border-primary bg-primary text-white' 
                                    : ''
                                } ${
                                  dayInfo.status === 'holiday' || dayInfo.status === 'weekend' || dayInfo.status === 'full' 
                                    ? 'opacity-40 cursor-not-allowed bg-slate-100 text-slate-400 border-slate-200' 
                                    : ''
                                }`}
                              >
                                <span className={isSelected ? 'text-white' : 'text-slate-700'}>{dayNum}</span>
                                <span className={`text-[6px] font-extrabold tracking-tight ${
                                  isSelected ? 'text-white' : 
                                  dayInfo.status === 'available' ? 'text-green-600' :
                                  dayInfo.status === 'limited' ? 'text-amber-600' : 'text-slate-400'
                                }`}>
                                  {dayInfo.label}
                                </span>
                              </button>
                            );
                          })}
                        </div>

                        {/* Calendar Legends */}
                        <div className="flex gap-4 justify-center text-[9px] font-bold mt-4 pt-3 border-t border-slate-200">
                          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-green-50 text-green-600 rounded border border-green-200" /> Available</span>
                          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-amber-50 text-amber-600 rounded border border-amber-200" /> Limited Slots</span>
                          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-red-50 text-red-500 rounded border border-red-150" /> Closed/Full</span>
                        </div>
                      </div>

                      {/* SECTION 7: TIME SLOT SELECTION (5 columns) */}
                      <div className="md:col-span-5 space-y-4">
                        <div className="bg-slate-50 border border-slate-150 p-4 rounded-2xl">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Date Selected</span>
                          <span className="text-xs font-extrabold text-[#0b2447]">
                            {selectedDate ? `${selectedDate} June 2026` : 'Please pick a day'}
                          </span>
                        </div>

                        {selectedDate ? (
                          <div className="space-y-4">
                            {/* Morning Slots */}
                            <div className="space-y-2">
                              <span className="text-[9px] font-extrabold text-slate-450 uppercase block">Morning Sessions</span>
                              <div className="grid grid-cols-3 gap-2">
                                {morningSlots.map(slot => (
                                  <button
                                    key={slot}
                                    onClick={() => setSelectedTimeSlot(slot)}
                                    className={`py-2 px-1 text-[10px] font-bold rounded-lg border text-center transition-all cursor-pointer ${
                                      selectedTimeSlot === slot 
                                        ? 'bg-[#ff9933] border-[#ff9933] text-white' 
                                        : 'bg-white border-slate-200 text-slate-650 hover:bg-slate-100'
                                    }`}
                                  >
                                    {slot}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Afternoon Slots */}
                            <div className="space-y-2">
                              <span className="text-[9px] font-extrabold text-slate-450 uppercase block">Afternoon Sessions</span>
                              <div className="grid grid-cols-3 gap-2">
                                {afternoonSlots.map(slot => (
                                  <button
                                    key={slot}
                                    onClick={() => setSelectedTimeSlot(slot)}
                                    className={`py-2 px-1 text-[10px] font-bold rounded-lg border text-center transition-all cursor-pointer ${
                                      selectedTimeSlot === slot 
                                        ? 'bg-[#ff9933] border-[#ff9933] text-white' 
                                        : 'bg-white border-slate-200 text-slate-650 hover:bg-slate-100'
                                    }`}
                                  >
                                    {slot}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Evening Slots */}
                            <div className="space-y-2">
                              <span className="text-[9px] font-extrabold text-slate-450 uppercase block">Evening Sessions</span>
                              <div className="grid grid-cols-3 gap-2">
                                {eveningSlots.map(slot => (
                                  <button
                                    key={slot}
                                    onClick={() => setSelectedTimeSlot(slot)}
                                    className={`py-2 px-1 text-[10px] font-bold rounded-lg border text-center transition-all cursor-pointer ${
                                      selectedTimeSlot === slot 
                                        ? 'bg-[#ff9933] border-[#ff9933] text-white' 
                                        : 'bg-white border-slate-200 text-slate-650 hover:bg-slate-100'
                                    }`}
                                  >
                                    {slot}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-8 text-slate-400 text-[10px] italic">
                            Select a calendar date to view available time slots.
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end pt-4 border-t border-slate-100">
                      <button
                        onClick={() => handleSelectSlot(selectedDate, selectedTimeSlot)}
                        disabled={!selectedDate || !selectedTimeSlot}
                        className={`text-xs font-bold py-2.5 px-6 rounded-xl transition-all cursor-pointer shadow-sm ${
                          !selectedDate || !selectedTimeSlot 
                            ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                            : 'bg-primary text-white hover:bg-primary-light'
                        }`}
                      >
                        Proceed to Summary
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 4: APPOINTMENT SUMMARY REVIEW */}
                {bookingStep === 4 && (
                  <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-6 animate-fade-in">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-extrabold text-sm text-[#0b2447]">Review Appointment Summary</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">Please review reservation entries prior to dispatching confirmation.</p>
                      </div>
                      <button 
                        onClick={() => setBookingStep(3)} 
                        className="text-xs text-slate-500 hover:text-primary flex items-center gap-1"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" /> Back
                      </button>
                    </div>

                    <div className="border border-slate-150 rounded-2xl overflow-hidden divide-y divide-slate-150">
                      <div className="p-4 bg-slate-50/50 flex justify-between items-center">
                        <span className="text-xs font-bold text-[#0b2447]">Selected Service Profile</span>
                        <span className="text-[10px] bg-primary/10 text-primary px-3 py-1 rounded-full font-bold uppercase">
                          {selectedType.toUpperCase()}
                        </span>
                      </div>

                      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-[10px] font-bold text-slate-650">
                        <div>
                          <span className="text-slate-450 block text-[8px] uppercase mb-0.5">Appointment Type</span>
                          <span className="text-xs text-[#0b2447]">{appointmentTypeMeta[selectedType].title}</span>
                        </div>
                        <div>
                          <span className="text-slate-450 block text-[8px] uppercase mb-0.5">Duration</span>
                          <span>{appointmentTypeMeta[selectedType].duration}</span>
                        </div>
                        <div>
                          <span className="text-slate-450 block text-[8px] uppercase mb-0.5">Scheduled Date</span>
                          <span className="text-xs text-[#0b2447]">{selectedDate} June 2026</span>
                        </div>
                        <div>
                          <span className="text-slate-450 block text-[8px] uppercase mb-0.5">Scheduled Time</span>
                          <span className="text-xs text-[#0b2447]">{selectedTimeSlot}</span>
                        </div>
                        <div className="sm:col-span-2">
                          <span className="text-slate-450 block text-[8px] uppercase mb-0.5">Meeting / Visit Venue</span>
                          <span className="text-[#0b2447]">{selectedCenter?.name} ({selectedCenter?.address})</span>
                        </div>
                        <div>
                          <span className="text-slate-450 block text-[8px] uppercase mb-0.5">Assigned Officer Desk</span>
                          <span className="text-slate-600">{selectedType === 'verification' ? 'Officer Amit Sharma (Supervisor)' : 'Auto Assigned on Arrival'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Government Verification Info Box */}
                    <div className="bg-amber-50/40 p-4 border border-amber-200/50 rounded-2xl flex items-start gap-3">
                      <Lock className="w-4.5 h-4.5 text-[#ff9933] shrink-0 mt-0.5" />
                      <div className="text-[10px]">
                        <p className="font-bold text-[#ff9933]">Ministry of Home Affairs Regulations</p>
                        <p className="text-slate-550 mt-0.5 leading-relaxed">
                          Your biometric and official address details are secured in our national vault. Please bring the mandatory proofs mentioned in the checklist to avoid rejection.
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        onClick={handleResetBooking}
                        className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold py-2.5 px-6 rounded-xl transition-all cursor-pointer"
                      >
                        Cancel Booking
                      </button>
                      <button
                        onClick={handleConfirmBooking}
                        className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold py-2.5 px-6 rounded-xl transition-all cursor-pointer shadow-sm"
                      >
                        Confirm Appointment
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 5: FINAL CONFIRMED SCREEN */}
                {bookingStep === 5 && (
                  <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 text-center space-y-6 animate-fade-in">
                    <div className="w-16 h-16 bg-green-50 text-green-600 border border-green-200 rounded-full flex items-center justify-center mx-auto shadow-sm">
                      <CheckCircle className="w-8 h-8" />
                    </div>

                    <div className="space-y-1.5">
                      <h4 className="font-extrabold text-lg text-[#0b2447]">Appointment Successfully Confirmed!</h4>
                      <p className="text-xs text-slate-500">Your reservation details have been stored and synced with DigiLocker registry database.</p>
                    </div>

                    {/* Confirmation ID card */}
                    <div className="max-w-md mx-auto bg-slate-50 border border-slate-150 rounded-2xl p-5 text-left text-[10px] space-y-3.5 font-bold text-slate-650">
                      <div className="flex justify-between border-b border-slate-200 pb-2.5">
                        <div>
                          <span className="text-slate-400 text-[8px] uppercase block">Appointment ID</span>
                          <span className="text-xs text-[#0b2447]">{appointments[0].id}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-slate-400 text-[8px] uppercase block">Current Status</span>
                          <span className="text-green-600 bg-green-50 px-2 py-0.5 rounded font-extrabold">CONFIRMED</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-y-3">
                        <div>
                          <span className="text-slate-400 text-[8px] uppercase block">Scheduled Date</span>
                          <span className="text-[#0b2447]">{appointments[0].date}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[8px] uppercase block">Scheduled Time</span>
                          <span className="text-[#0b2447]">{appointments[0].time}</span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-slate-400 text-[8px] uppercase block">Assigned Location</span>
                          <span className="text-[#0b2447]">{appointments[0].location}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 flex justify-center gap-3">
                      <button
                        onClick={handleResetBooking}
                        className="bg-primary hover:bg-primary-light text-white text-xs font-bold py-2.5 px-6 rounded-xl transition-all cursor-pointer shadow-sm"
                      >
                        Book Another Appointment
                      </button>
                      <button
                        onClick={() => {
                          setActiveTab('dashboard');
                          setBookingStep(1);
                        }}
                        className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold py-2.5 px-6 rounded-xl transition-all cursor-pointer"
                      >
                        Go to Booking Desk
                      </button>
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* TAB 3: APPOINTMENT LOGS (HISTORY) */}
            {activeTab === 'history' && (
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-6">
                
                {/* Search / Filters header */}
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                  <div>
                    <h4 className="font-extrabold text-sm text-[#0b2447]">Appointment Logs</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">Search and inspect all upcoming, historical or cancelled schedules.</p>
                  </div>
                  
                  <div className="flex gap-2 w-full sm:w-auto shrink-0 justify-end">
                    <button 
                      onClick={triggerExport}
                      className="bg-[#0b2447] hover:bg-[#1f3e6d] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm"
                    >
                      <Download className="w-3.5 h-3.5" /> Export Logs
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-grow relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input 
                      type="text" 
                      placeholder="Search history by ID, officer name, service type..."
                      value={historySearch}
                      onChange={(e) => setHistorySearch(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-250 rounded-xl pl-9 pr-4 py-2 text-xs outline-none focus:border-[#0b2447] transition-all"
                    />
                  </div>

                  <select
                    value={historyFilter}
                    onChange={(e) => setHistoryFilter(e.target.value)}
                    className="bg-slate-50 border border-slate-250 rounded-xl px-4 py-2 text-xs text-slate-650 font-bold outline-none cursor-pointer focus:border-[#0b2447]"
                  >
                    <option value="all">All Status Logs</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                {/* History Table */}
                <div className="border border-slate-150 rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-[11px] font-medium text-slate-650 text-left border-collapse">
                      <thead className="bg-slate-550/5 border-b border-slate-150 text-[9px] uppercase font-bold text-slate-450">
                        <tr>
                          <th className="p-3.5 pl-5">Appt ID</th>
                          <th className="p-3.5">Service Type</th>
                          <th className="p-3.5">Date / Time</th>
                          <th className="p-3.5">Venue / Address</th>
                          <th className="p-3.5">Assigned Staff</th>
                          <th className="p-3.5 pr-5">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-150 font-bold">
                        {filteredHistory.length === 0 ? (
                          <tr>
                            <td colSpan="6" className="p-8 text-center text-slate-400 italic text-xs">
                              No matching log entries found.
                            </td>
                          </tr>
                        ) : (
                          filteredHistory.map((apt) => (
                            <tr key={apt.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="p-3.5 pl-5 font-mono text-[10px] text-primary">{apt.id}</td>
                              <td className="p-3.5 text-[#0b2447]">{apt.typeLabel}</td>
                              <td className="p-3.5">
                                <span className="block text-slate-700">{apt.date}</span>
                                <span className="block text-[9px] text-slate-400 font-semibold">{apt.time}</span>
                              </td>
                              <td className="p-3.5 text-slate-600 truncate max-w-[140px]" title={apt.location}>{apt.location}</td>
                              <td className="p-3.5 text-slate-500 font-semibold">{apt.officer || 'Unassigned'}</td>
                              <td className="p-3.5 pr-5">
                                <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                                  apt.status === 'Completed' ? 'bg-green-50 text-green-600 border border-green-100' :
                                  apt.status === 'Cancelled' ? 'bg-red-50 text-red-500 border border-red-100' :
                                  'bg-blue-50 text-blue-600 border border-blue-100'
                                }`}>
                                  {apt.status}
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

            {/* TAB 4: SUPPORT & LIVE HELP */}
            {activeTab === 'support' && (
              <div className="space-y-6">
                
                {/* FAQs Section */}
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
                  <h4 className="font-extrabold text-sm text-[#0b2447] mb-4">Frequently Asked Questions</h4>
                  
                  <div className="space-y-3">
                    {[
                      { q: 'What should I do if I miss my verification appointment?', a: 'If you miss your scheduled field visit, the officer will log it as "Missed". You can reschedule a new slot on this dashboard within 24 hours.' },
                      { q: 'Can I change my appointment location after confirming?', a: 'Yes. Simply click the "Reschedule" button next to your active booking and select an alternative Census Center.' },
                      { q: 'Are there any fees for scheduling appointments?', a: 'No, all census scheduling services, helpdesk sessions, and verification visits are completely free of charge.' }
                    ].map((faq, idx) => (
                      <details key={idx} className="group border border-slate-150 bg-slate-50/40 p-4 rounded-xl [&_summary::-webkit-details-marker]:hidden cursor-pointer">
                        <summary className="flex justify-between items-center text-xs font-bold text-primary list-none">
                          <span>{faq.q}</span>
                          <span className="transition group-open:-rotate-180">
                            <ChevronRight className="w-4 h-4 text-slate-400 rotate-90" />
                          </span>
                        </summary>
                        <p className="text-[10px] text-slate-500 mt-2 leading-relaxed font-medium">
                          {faq.a}
                        </p>
                      </details>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Submit support ticket */}
                  <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4">
                    <div>
                      <h5 className="font-extrabold text-xs text-[#0b2447]">Submit Help Ticket</h5>
                      <p className="text-[9px] text-slate-400 mt-0.5">Directly contact our local desk registry for corrections.</p>
                    </div>

                    <form onSubmit={handleSupportTicketSubmit} className="space-y-3.5">
                      <div className="flex gap-2">
                        <select 
                          value={ticketCategory}
                          onChange={(e) => setTicketCategory(e.target.value)}
                          className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-[10px] font-bold text-slate-650"
                        >
                          <option value="booking">Booking Issue</option>
                          <option value="officer">Officer Absence</option>
                          <option value="reschedule">Rescheduling bug</option>
                        </select>
                        <input 
                          type="text" 
                          placeholder="Subject line..."
                          value={ticketSubject}
                          onChange={(e) => setTicketSubject(e.target.value)}
                          required
                          className="flex-grow bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-[10px] outline-none font-bold"
                        />
                      </div>
                      <textarea 
                        placeholder="Describe scheduling problems in detail..."
                        rows="3"
                        value={ticketDescription}
                        onChange={(e) => setTicketDescription(e.target.value)}
                        required
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[10px] outline-none resize-none font-bold"
                      />
                      <button 
                        type="submit"
                        className="w-full bg-[#0b2447] hover:bg-[#1f3e6d] text-white text-[10px] font-bold py-2 rounded-xl shadow-sm transition-colors cursor-pointer"
                      >
                        Submit Support Case
                      </button>
                    </form>
                  </div>

                  {/* Chatbox Simulator */}
                  <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 flex flex-col justify-between h-[300px]">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-2 shrink-0">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[10px] font-extrabold text-primary">Live Chat Support</span>
                      </div>
                      <span className="text-[8px] font-bold text-slate-400 font-mono">Digital Assistant</span>
                    </div>

                    {/* Chat screen */}
                    <div className="flex-grow overflow-y-auto py-3 space-y-2 text-[10px] font-bold pr-1 my-1">
                      {chatMessages.map((msg) => (
                        <div 
                          key={msg.id} 
                          className={`p-2.5 rounded-xl max-w-[85%] leading-relaxed ${
                            msg.sender === 'user' 
                              ? 'bg-primary text-white ml-auto' 
                              : 'bg-slate-50 border border-slate-150 text-slate-650'
                          }`}
                        >
                          <p>{msg.text}</p>
                          <span className={`block text-[7px] mt-1 text-right ${msg.sender === 'user' ? 'text-white/60' : 'text-slate-400'}`}>
                            {msg.time}
                          </span>
                        </div>
                      ))}
                      {chatTyping && (
                        <div className="bg-slate-50 border border-slate-150 text-slate-400 p-2.5 rounded-xl max-w-[40%] text-[8px] animate-pulse">
                          Assistant typing...
                        </div>
                      )}
                    </div>

                    {/* Input message form */}
                    <form onSubmit={handleSendChatMessage} className="flex gap-1.5 shrink-0 pt-2 border-t border-slate-100">
                      <input 
                        type="text" 
                        placeholder="Ask assistant a question..."
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        className="flex-grow bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[10px] outline-none font-bold"
                      />
                      <button 
                        type="submit" 
                        className="bg-primary text-white p-2 rounded-xl hover:bg-primary-light transition-colors cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </form>
                  </div>
                </div>

              </div>
            )}

          </div>

          {/* RIGHT COL: SIDEBAR SYSTEM (4 Columns) */}
          <div className="lg:col-span-4 space-y-6">

            {/* Quick Actions Panel */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
              <h4 className="font-extrabold text-sm text-[#0b2447] mb-4">Action shortcuts</h4>
              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => { setActiveTab('wizard'); handleResetBooking(); }}
                  className="w-full bg-[#0b2447] hover:bg-[#1f3e6d] text-white text-xs font-bold py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                >
                  <Plus className="w-4 h-4" /> Book Appointment
                </button>
                <button 
                  onClick={() => setActiveTab('support')}
                  className="w-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4 text-primary" /> Live Chat Assistant
                </button>
              </div>
            </div>

            {/* Notifications panel */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-extrabold text-sm text-[#0b2447] flex items-center gap-1.5"><Bell className="w-4.5 h-4.5 text-[#ff9933]" /> Notifications</h4>
                <span className="text-[8px] bg-red-50 text-red-500 px-2 py-0.5 rounded font-extrabold">Reminders</span>
              </div>

              <div className="space-y-3.5">
                {notifications.map((notif) => (
                  <div key={notif.id} className="p-3 bg-slate-50/50 border border-slate-150 rounded-xl space-y-1.5 hover:bg-slate-50 transition-colors">
                    <div className="flex justify-between items-center text-[8px] font-bold text-slate-400">
                      <span>{notif.date}</span>
                      <span className="capitalize">{notif.type}</span>
                    </div>
                    <p className="text-[10px] text-slate-650 font-bold leading-normal">{notif.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Verification center parameters */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
              <h4 className="font-extrabold text-sm text-[#0b2447] mb-2 flex items-center gap-1.5"><Shield className="w-4.5 h-4.5 text-green-600" /> Security & Policy</h4>
              <p className="text-[10px] text-slate-400 mb-4">Guidelines for census identity audits.</p>
              
              <div className="text-[10px] font-semibold text-slate-600 space-y-3">
                <div className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ff9933] mt-1 shrink-0" />
                  <p>Appointments can be rescheduled or cancelled up to 2 hours prior to the slot timing.</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ff9933] mt-1 shrink-0" />
                  <p>For home verification audits, physical presence of the family head is mandatory.</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ff9933] mt-1 shrink-0" />
                  <p>Biometric authentication triggers will be locked upon verification success.</p>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* ══════════════════════════════════════════════════
          RESCHEDULE APPOINTMENT MODAL (SECTION 14)
      ══════════════════════════════════════════════════ */}
      {rescheduleTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl p-6 w-full max-w-md space-y-5 animate-fade-in">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h4 className="font-extrabold text-sm text-[#0b2447] flex items-center gap-1.5">
                <RefreshCw className="w-4.5 h-4.5 text-amber-500" /> Reschedule Appointment
              </h4>
              <button 
                onClick={() => setRescheduleTarget(null)}
                className="p-1 text-slate-400 hover:text-primary transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 p-4 border border-slate-150 rounded-2xl text-[10px] space-y-1.5 font-bold text-slate-650">
              <p><span className="text-slate-450 block text-[8px] uppercase">Service Type</span> {rescheduleTarget.typeLabel}</p>
              <p><span className="text-slate-450 block text-[8px] uppercase">Current Date / Time</span> {rescheduleTarget.date} · {rescheduleTarget.time}</p>
            </div>

            <form onSubmit={handleRescheduleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-550">Choose Alternative Date</label>
                  <select 
                    value={rescheduleDate}
                    onChange={(e) => setRescheduleDate(e.target.value)}
                    required
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-650"
                  >
                    <option value="">Select Date</option>
                    <option value="18">18 June 2026 (Available)</option>
                    <option value="19">19 June 2026 (Available)</option>
                    <option value="20">20 June 2026 (Limited)</option>
                    <option value="22">22 June 2026 (Available)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-550">Choose Time Slot</label>
                  <select 
                    value={rescheduleTime}
                    onChange={(e) => setRescheduleTime(e.target.value)}
                    required
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-650"
                  >
                    <option value="">Select Time</option>
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="04:00 PM">04:00 PM</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setRescheduleTarget(null)}
                  className="flex-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold py-2.5 rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-primary hover:bg-primary-light text-white text-xs font-bold py-2.5 rounded-xl transition-all cursor-pointer shadow-sm"
                >
                  Confirm Reschedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════
          CANCEL APPOINTMENT MODAL (SECTION 15)
      ══════════════════════════════════════════════════ */}
      {cancelTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl p-6 w-full max-w-md space-y-5 animate-fade-in">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h4 className="font-extrabold text-sm text-[#0b2447] flex items-center gap-1.5">
                <Trash2 className="w-4.5 h-4.5 text-red-500" /> Cancel Appointment
              </h4>
              <button 
                onClick={() => setCancelTarget(null)}
                className="p-1 text-slate-400 hover:text-primary transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 p-4 border border-slate-150 rounded-2xl text-[10px] space-y-1.5 font-bold text-slate-650">
              <p><span className="text-slate-450 block text-[8px] uppercase">Service Type</span> {cancelTarget.typeLabel}</p>
              <p><span className="text-slate-450 block text-[8px] uppercase">Scheduled Time</span> {cancelTarget.date} · {cancelTarget.time}</p>
            </div>

            <form onSubmit={handleCancelAppointmentSubmit} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-550">Reason for Cancellation</label>
                <select 
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-650"
                >
                  <option value="Conflict">Scheduling Conflict / Out of Station</option>
                  <option value="Incorrect">Incorrect Appointment Type Chosen</option>
                  <option value="Documents">Documents/Proofs Not Ready Yet</option>
                  <option value="Other">Other Reasons (Specify Below)</option>
                </select>
              </div>

              {cancelReason === 'Other' && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-550">Additional Comments</label>
                  <textarea 
                    placeholder="Describe specific cancellation reasons..."
                    rows="2"
                    value={cancelCustomReason}
                    onChange={(e) => setCancelCustomReason(e.target.value)}
                    required
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[10px] outline-none resize-none font-bold"
                  />
                </div>
              )}

              {/* Cancellation Policy and Fees Checkbox */}
              <div className="bg-amber-50/40 p-4 border border-amber-250/50 rounded-2xl space-y-3">
                <div className="text-[9px] text-slate-550 font-bold leading-normal">
                  <p className="font-extrabold text-[#ff9933]">Cancellation Policy</p>
                  <p className="mt-1">
                    Cancellations are permanently logged in your census audit timeline. No scheduling fee was charged, so no refund is applicable. You can re-book new slots at any time.
                  </p>
                </div>
                
                <label className="flex items-start gap-2 cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={cancelPolicyChecked}
                    onChange={(e) => setCancelPolicyChecked(e.target.checked)}
                    required
                    className="mt-0.5"
                  />
                  <span className="text-[9px] text-[#0b2447] font-extrabold">I understand and agree to the cancellation guidelines.</span>
                </label>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setCancelTarget(null)}
                  className="flex-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold py-2.5 rounded-xl transition-all cursor-pointer"
                >
                  Dismiss
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2.5 rounded-xl transition-all cursor-pointer shadow-sm"
                >
                  Cancel Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AppointmentBooking;
