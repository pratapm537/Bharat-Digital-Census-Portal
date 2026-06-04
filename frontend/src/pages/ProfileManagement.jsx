import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import {
  User, Lock, MapPin, Calendar, RefreshCw, Edit, UserCheck, Shield,
  Bell, Settings, Eye, EyeOff, Search, Plus, CheckCircle, AlertTriangle,
  ChevronRight, Clock, ArrowLeft, Send, Star, UploadCloud, Trash2,
  Phone, Mail, Download, ArrowUpRight, Sliders, X, Check, FileText,
  Smartphone, HelpCircle, Laptop, Globe, Info, Heart
} from 'lucide-react';

const ProfileManagement = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Alert states
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Active Tab state
  const [activeTab, setActiveTab] = useState('overview');

  // Modal / Dialog toggles
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [isRequestingCorrection, setIsRequestingCorrection] = useState(false);
  const [isAddingFamily, setIsAddingFamily] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  // Correction form state
  const [correctionField, setCorrectionField] = useState('name');
  const [correctionProposed, setCorrectionProposed] = useState('');
  const [correctionReason, setCorrectionReason] = useState('');
  const [correctionProofName, setCorrectionProofName] = useState('');

  // Profile avatar photo
  const [profilePhoto, setProfilePhoto] = useState(null);

  // Dynamic user data states
  const [personalInfo, setPersonalInfo] = useState({
    fullName: 'Mohit Pratap Mehra',
    gender: 'Male',
    dob: '15 January 1995',
    age: 31,
    maritalStatus: 'Married',
    nationality: 'Indian'
  });

  const [identities, setIdentities] = useState({
    aadhaar: 'XXXX XXXX 4587',
    aadhaarFull: '1234 5678 4587',
    voterId: 'XXXXXX1234',
    voterIdFull: 'ABC1231234',
    pan: 'XXXXX9876F',
    panFull: 'ABCDE9876F',
    passport: 'XXXXXX789',
    passportFull: 'Z12345789'
  });

  const [maskIdentities, setMaskIdentities] = useState({
    aadhaar: true,
    voterId: true,
    pan: true,
    passport: true
  });

  const [contactInfo, setContactInfo] = useState({
    mobile: '+91 98765 45879',
    alternateMobile: '', // Missing initially
    email: 'mohit.mehra@gov-link.in',
    emergencyName: '', // Missing initially
    emergencyRelation: '',
    emergencyMobile: ''
  });

  const [addressInfo, setAddressInfo] = useState({
    houseNo: 'House No. 45',
    street: 'Sector 21',
    locality: 'Dwarka',
    city: 'New Delhi',
    district: 'South West Delhi',
    state: 'Delhi',
    pinCode: '110001',
    lastVerified: '12 January 2026',
    gps: '28.6139° N, 77.2090° E'
  });

  const [familyMembers, setFamilyMembers] = useState([
    { id: 1, name: 'Amit Mehra', relation: 'Son', verified: true, avatar: 'AM' },
    { id: 2, name: 'Riya Mehra', relation: 'Daughter', verified: true, avatar: 'RM' },
    { id: 3, name: 'Sunita Mehra', relation: 'Spouse', verified: true, avatar: 'SM' },
    { id: 4, name: 'Karan Mehra', relation: 'Brother', verified: true, avatar: 'KM' },
    { id: 5, name: 'Devendra Mehra', relation: 'Father', verified: true, avatar: 'DM' }
  ]);

  const [newFamilyMember, setNewFamilyMember] = useState({
    name: '',
    relation: 'Son',
    verified: true
  });

  const [documents, setDocuments] = useState([
    { id: 'DOC-1', name: 'Aadhaar Card', status: 'Verified', date: '04 Jun 2026', type: 'Identity Proof' },
    { id: 'DOC-2', name: 'Voter ID Card', status: 'Verified', date: '02 Jun 2026', type: 'Identity Proof' },
    { id: 'DOC-3', name: 'Address Proof (Electricity Bill)', status: 'Pending', date: 'Pending Upload', type: 'Address Proof' },
    { id: 'DOC-4', name: 'Passport Copy', status: 'Uploaded', date: '05 Jun 2026', type: 'Identity Proof' }
  ]);

  // Security password change states
  const [passwords, setPasswords] = useState({
    current: '',
    newPass: '',
    confirm: ''
  });

  const [is2FAEnabled, setIs2FAEnabled] = useState(true);

  const [activeSessions, setActiveSessions] = useState([
    { id: 1, device: 'Chrome Browser (Current)', location: 'Delhi, India', time: 'Active Now', current: true },
    { id: 2, device: 'Vite Native App', location: 'Delhi, India', time: '15 June 2026 · 10:45 AM', current: false },
    { id: 3, device: 'Safari Browser - iPhone', location: 'Mumbai, India', time: '12 June 2026 · 09:12 PM', current: false }
  ]);

  const [securityLogs, setSecurityLogs] = useState([
    { id: 1, title: 'Profile Updated', detail: 'Address details updated successfully.', time: 'Today · 12:40 PM', type: 'info' },
    { id: 2, title: 'New Login Detected', detail: 'Successful credentials sign-in from Dwarka.', time: 'Yesterday · 10:45 AM', type: 'warning' },
    { id: 3, title: 'Password Changed', detail: 'Credential security renewal completed.', time: '15 May 2026', type: 'success' }
  ]);

  // Account preferences state
  const [preferences, setPreferences] = useState({
    language: 'English',
    theme: localStorage.getItem('theme') === 'dark' ? 'Dark' : 'Light',
    accessibility: 'Normal Font',
    preferredComm: 'SMS + Email',
    smsAlerts: true,
    emailAlerts: true,
    pushAlerts: false
  });

  // Activity History timeline
  const [activityHistory, setActivityHistory] = useState([
    { id: 1, title: 'Profile Created', desc: 'Citizen registration completed with AADHAAR verification.', date: '12 Jan 2024 · 09:30 AM', icon: 'UserCheck', color: 'bg-green-100 text-green-700' },
    { id: 2, title: 'Address Updated', desc: 'Dwarka residence mapped to national census grid.', date: '12 Jan 2026 · 11:20 AM', icon: 'MapPin', color: 'bg-blue-100 text-blue-700' },
    { id: 3, title: 'Password Changed', desc: 'Secure security credential rotation.', date: '15 May 2026 · 04:50 PM', icon: 'Lock', color: 'bg-amber-100 text-amber-700' },
    { id: 4, title: 'Family Member Added', desc: 'Amit Mehra (Son) linked to household registry.', date: '28 May 2026 · 02:15 PM', icon: 'Plus', color: 'bg-purple-100 text-purple-700' },
    { id: 5, title: 'Document Uploaded', desc: 'Official passport credential synced with vault.', date: '05 Jun 2026 · 10:30 AM', icon: 'FileText', color: 'bg-indigo-100 text-indigo-700' }
  ]);

  // Help desk support ticket state
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState('profile');
  const [ticketDescription, setTicketDescription] = useState('');

  // Live support chat state
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { id: 1, text: 'Namaste! I am the Bharat Census Assistant. How can I help you manage your profile, document vault, or security settings today?', sender: 'bot', time: 'Just now' }
  ]);
  const [chatTyping, setChatTyping] = useState(false);

  // FAQs accordions state
  const [faqOpen, setFaqOpen] = useState({
    0: false,
    1: false,
    2: false,
    3: false,
    4: false
  });

  // Toggle FAQ Accordion
  const toggleFaq = (index) => {
    setFaqOpen(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Toggle identity mask
  const toggleMask = (key) => {
    setMaskIdentities(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Auto clear alerts
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess('');
        setError('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  // Dynamic Profile Completion calculation
  const profileCompletion = useMemo(() => {
    let base = 85;
    let completedSections = 4;
    const missing = [];

    if (contactInfo.alternateMobile) {
      base += 5;
    } else {
      missing.push('Alternate Mobile');
    }

    if (contactInfo.emergencyName && contactInfo.emergencyMobile) {
      base += 10;
      completedSections += 1;
    } else {
      missing.push('Emergency Contact');
    }

    return {
      percentage: base,
      completedCount: completedSections,
      totalCount: 5,
      missingFields: missing
    };
  }, [contactInfo]);

  // Sync theme selection with DOM class for actual live dark/light testing
  useEffect(() => {
    if (preferences.theme === 'Dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [preferences.theme]);

  // Password strength meter logic
  const passwordStrength = useMemo(() => {
    const pass = passwords.newPass;
    if (!pass) return { score: 0, text: 'None', color: 'bg-slate-200' };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 10) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 2) return { score, text: 'Weak', color: 'bg-red-500' };
    if (score <= 4) return { score, text: 'Medium', color: 'bg-amber-500' };
    return { score, text: 'Strong', color: 'bg-[#138808]' };
  }, [passwords.newPass]);

  // Download Profile Summary Simulator
  const handleDownloadSummary = () => {
    const summaryText = `
========================================
    BHARAT NATIONAL CENSUS REGISTRY
       OFFICIAL CITIZEN DOSSIER
========================================
Generated on: ${new Date().toLocaleDateString()}
Citizen Verification ID: CEN-2026-458796
Family Reference ID: FAM-2026-987654
Aadhaar Link: Verified (XXXX XXXX 4587)
----------------------------------------

CITIZEN IDENTIFICATION SUMMARY:
-------------------------------
Full Name: ${personalInfo.fullName}
Gender: ${personalInfo.gender}
Date of Birth: ${personalInfo.dob}
Marital Status: ${personalInfo.maritalStatus}
Nationality: ${personalInfo.nationality}

CONTACT INFORMATION:
--------------------
Primary Mobile: ${contactInfo.mobile}
Alternate Mobile: ${contactInfo.alternateMobile || 'Not Provided'}
Email Address: ${contactInfo.email}

RESIDENCY ADDRESS LOGS:
-----------------------
House No/Details: ${addressInfo.houseNo}
Street / Lane: ${addressInfo.street}
Locality / Village: ${addressInfo.locality}
City / State / PIN: ${addressInfo.city}, ${addressInfo.state} - ${addressInfo.pinCode}
GPS Coordinates: ${addressInfo.gps}
Verification Status: VERIFIED

FAMILY UNIT OVERVIEW:
---------------------
Head of Household: ${personalInfo.fullName}
Total Members: ${familyMembers.length}
Verification Status: Verified Census Household

----------------------------------------
End of Dossier Summary
Ministry of Home Affairs, Government of India
========================================
`;
    const blob = new Blob([summaryText.trim()], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Citizen_Profile_Summary_${personalInfo.fullName.replace(/\s+/g, '_')}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setSuccess('Citizen Profile Summary text dossier generated & downloaded.');
  };

  // Submit Personal Info Edit
  const handleSavePersonalInfo = (e) => {
    e.preventDefault();
    setIsEditingPersonal(false);
    // Add to activity history
    setActivityHistory(prev => [
      {
        id: Date.now(),
        title: 'Profile Updated',
        desc: 'Personal basic records updated by citizen.',
        date: 'Today · Just now',
        icon: 'User',
        color: 'bg-blue-100 text-blue-700'
      },
      ...prev
    ]);
    setSuccess('Basic Identity fields updated successfully in portal memory.');
  };

  // Submit Correction Request
  const handleSaveCorrectionRequest = (e) => {
    e.preventDefault();
    if (!correctionProposed || !correctionReason) {
      setError('Please fill out all request parameters.');
      return;
    }
    setIsRequestingCorrection(false);
    setSuccess(`Verification correction query submitted. Ticket ID: #CORR-${Math.floor(10000 + Math.random() * 90000)} issued.`);
    setCorrectionProposed('');
    setCorrectionReason('');
    setCorrectionProofName('');
  };

  // Upload photo simulation
  const handlePhotoUploadSim = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhoto(URL.createObjectURL(file));
      setSuccess('Profile Avatar photo updated successfully.');
      setIsUploadingPhoto(false);
      // Trigger activity audit
      setActivityHistory(prev => [
        {
          id: Date.now(),
          title: 'Avatar Image Updated',
          desc: 'Citizen uploaded new identity biometric snapshot.',
          date: 'Today · Just now',
          icon: 'User',
          color: 'bg-green-100 text-green-700'
        },
        ...prev
      ]);
    }
  };

  // Save Contact & Emergency Details
  const handleSaveContactDetails = (e) => {
    e.preventDefault();
    // Simulate updating
    setSuccess('Communication preferences & Emergency contacts recorded.');
  };

  // Save Address Details
  const handleSaveAddressDetails = (e) => {
    e.preventDefault();
    setSuccess('Address update request submitted. A field officer verification will be automatically scheduled.');
    setActivityHistory(prev => [
      {
        id: Date.now(),
        title: 'Address Sync Request',
        desc: 'New residential registration coordinates requested.',
        date: 'Today · Just now',
        icon: 'MapPin',
        color: 'bg-amber-100 text-amber-700'
      },
      ...prev
    ]);
  };

  // Mock Upload Address Proof Document
  const handleUploadDoc = (docId) => {
    setDocuments(prev => prev.map(doc => {
      if (doc.id === docId) {
        return { ...doc, status: 'Uploaded', date: 'Today · Just now' };
      }
      return doc;
    }));
    setSuccess('Verification file uploaded to credential vault.');
  };

  // Change Password Submission
  const handleChangePassword = (e) => {
    e.preventDefault();
    if (!passwords.current || !passwords.newPass || !passwords.confirm) {
      setError('Please complete all security credential fields.');
      return;
    }
    if (passwords.newPass !== passwords.confirm) {
      setError('New password and confirmation fields do not match.');
      return;
    }
    if (passwordStrength.score < 3) {
      setError('Password strength must be Medium or Strong.');
      return;
    }
    setPasswords({ current: '', newPass: '', confirm: '' });
    setSecurityLogs(prev => [
      { id: Date.now(), title: 'Password Changed', detail: 'Citizen reset dashboard credentials.', time: 'Today · Just now', type: 'success' },
      ...prev
    ]);
    setActivityHistory(prev => [
      {
        id: Date.now(),
        title: 'Password Changed',
        desc: 'Security credentials renewed successfully.',
        date: 'Today · Just now',
        icon: 'Lock',
        color: 'bg-amber-100 text-amber-700'
      },
      ...prev
    ]);
    setSuccess('Security password updated successfully.');
  };

  // Toggle Two Factor Authentication
  const handleToggle2FA = () => {
    setIs2FAEnabled(prev => {
      const next = !prev;
      setSuccess(`Two-Factor Authentication (2FA) is now ${next ? 'ENABLED' : 'DISABLED'}.`);
      setSecurityLogs(logs => [
        { id: Date.now(), title: next ? '2FA Enabled' : '2FA Disabled', detail: `Two factor validation ${next ? 'activated' : 'deactivated'}.`, time: 'Today · Just now', type: next ? 'success' : 'warning' },
        ...logs
      ]);
      return next;
    });
  };

  // Terminate Single session
  const handleTerminateSession = (sessionId) => {
    setActiveSessions(prev => prev.filter(s => s.id !== sessionId));
    setSuccess('Selected login session terminated.');
    setSecurityLogs(logs => [
      { id: Date.now(), title: 'Session Terminated', detail: 'Revoked access token for selected device.', time: 'Today · Just now', type: 'info' },
      ...logs
    ]);
  };

  // Terminate All sessions
  const handleLogoutAllDevices = () => {
    setActiveSessions(prev => prev.filter(s => s.current));
    setSuccess('All secondary device credentials terminated.');
    setSecurityLogs(logs => [
      { id: Date.now(), title: 'Multiple Sessions Revoked', detail: 'Cleared access sessions globally.', time: 'Today · Just now', type: 'warning' },
      ...logs
    ]);
  };

  // Add mock family member
  const handleAddFamilyMember = (e) => {
    e.preventDefault();
    const trimmedName = newFamilyMember.name.trim();
    if (!trimmedName) {
      setError('Please provide family member name.');
      return;
    }
    const newMember = {
      id: Date.now(),
      name: trimmedName,
      relation: newFamilyMember.relation,
      verified: newFamilyMember.verified,
      avatar: trimmedName.split(/\s+/).map(n => n[0]).join('').toUpperCase().slice(0, 2)
    };
    setFamilyMembers(prev => [...prev, newMember]);
    setNewFamilyMember({ name: '', relation: 'Son', verified: true });
    setIsAddingFamily(false);
    setActivityHistory(prev => [
      {
        id: Date.now(),
        title: 'Family Member Added',
        desc: `${newMember.name} (${newMember.relation}) connected to household portal.`,
        date: 'Today · Just now',
        icon: 'Plus',
        color: 'bg-purple-100 text-purple-700'
      },
      ...prev
    ]);
    setSuccess('Family member linked to household registry.');
  };

  // Submit Support Ticket
  const handleSupportTicketSubmit = (e) => {
    e.preventDefault();
    if (!ticketSubject || !ticketDescription) {
      setError('Please complete all support query parameters.');
      return;
    }
    setSuccess(`Grievance support ticket #TIC-PRFL-${Math.floor(1000 + Math.random() * 9000)} registered successfully.`);
    setTicketSubject('');
    setTicketDescription('');
  };

  // Help Desk Live Chat Bot replies
  const handleSendChatMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = { id: Date.now(), text: chatInput, sender: 'user', time: 'Just now' };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setChatTyping(true);

    setTimeout(() => {
      setChatTyping(false);
      let replyText = "I'm sorry, I couldn't quite resolve that query. You can ask me to help explain profile completion, document vault statuses, or updating secure information.";
      const query = chatInput.toLowerCase();

      if (query.includes('verification') || query.includes('aadhaar') || query.includes('status')) {
        replyText = "Your Aadhaar Card and Voter ID are fully verified and linked to your citizen profile. If you need to fix a spelling mistake, click 'Request Correction' under the Identity panel.";
      } else if (query.includes('address') || query.includes('proof') || query.includes('upload')) {
        replyText = "To update your residential address details, go to the 'Address & Residency' tab. You will need to upload an official utility bill as proof. A supervisor will review and verify details.";
      } else if (query.includes('password') || query.includes('security') || query.includes('2fa')) {
        replyText = "Manage security settings by choosing the 'Security & Credentials' tab. There you can rotate your password, enable 2FA shielding, and terminate unauthorized logged-in devices.";
      } else if (query.includes('family') || query.includes('member') || query.includes('household')) {
        replyText = "Under 'Family & Household' tab you can view the linked status of all members in your unit (FAM-2026-987654). You can also click the 'Open Family Profile' shortcut to manage family declarations.";
      } else if (query.includes('completion') || query.includes('missing')) {
        replyText = "Your profile is currently at 85% completion. To bring it up to 100%, please save an Alternate Mobile number and set up Emergency Contact details under the 'Contact & Alerts' tab.";
      }

      setChatMessages(prev => [...prev, { id: Date.now() + 1, text: replyText, sender: 'bot', time: 'Just now' }]);
    }, 1000);
  };

  // Direct action shortcuts to tabs
  const handleQuickAction = (tabName) => {
    setActiveTab(tabName);
    const element = document.getElementById('tab-content-anchor');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex-grow w-full bg-[#f8faff] min-h-screen pb-16 relative">
      
      {/* Success/Error Alerts */}
      {success && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#138808] text-white px-5 py-3.5 rounded-xl shadow-lg border border-[#138808]/20 flex items-center gap-3 animate-fade-in font-medium max-w-sm">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <span className="text-xs">{success}</span>
        </div>
      )}
      {error && (
        <div className="fixed bottom-6 right-6 z-50 bg-red-600 text-white px-5 py-3.5 rounded-xl shadow-lg border border-red-500/20 flex items-center gap-3 animate-fade-in font-medium max-w-sm">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span className="text-xs">{error}</span>
        </div>
      )}

      {/* ══════════════════════════════════════════════════
          SECTION 1: PAGE HEADER
      ══════════════════════════════════════════════════ */}
      <div className="bg-[#0b2447] text-white py-10 px-6 sm:px-12 relative overflow-hidden shadow-lg border-b border-white/5">
        <div className="absolute right-0 top-0 w-96 h-96 bg-[#ff9933]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/2 bottom-0 w-80 h-80 bg-[#138808]/15 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1.5 text-xs text-slate-350 hover:text-white mb-4 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </button>

          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            
            {/* Citizen Identity Profile */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
              
              {/* Photo Avatar Panel */}
              <div className="relative group shrink-0">
                <div className="w-24 h-24 rounded-full border-4 border-white/20 bg-gradient-to-tr from-[#ff9933]/40 via-white/10 to-[#138808]/40 flex items-center justify-center text-white overflow-hidden shadow-md">
                  {profilePhoto ? (
                    <img src={profilePhoto} alt="Citizen Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl font-bold font-sans tracking-wide">MM</span>
                  )}
                </div>
                <label 
                  htmlFor="photo-upload-input"
                  className="absolute bottom-0 right-0 bg-[#ff9933] hover:bg-amber-600 text-white p-1.5 rounded-full cursor-pointer shadow-md transition-colors"
                  title="Upload Photo"
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                </label>
                <input 
                  id="photo-upload-input"
                  type="file" 
                  accept="image/*"
                  onChange={handlePhotoUploadSim}
                  className="hidden"
                />
              </div>

              {/* Citizen Details */}
              <div className="text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                    {personalInfo.fullName}
                  </h1>
                  <span className="bg-[#138808]/20 border border-[#138808]/30 text-emerald-400 text-[10px] uppercase font-extrabold tracking-widest px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <Check className="w-3 h-3 text-[#138808]" /> Verified
                  </span>
                  <span className="bg-[#ff9933]/20 border border-[#ff9933]/30 text-[#ff9933] text-[10px] uppercase font-extrabold tracking-widest px-2.5 py-0.5 rounded-full">
                    Active Registry
                  </span>
                </div>

                <div className="mt-2.5 space-y-1 text-slate-300 text-xs font-light">
                  <p className="flex items-center justify-center sm:justify-start gap-2">
                    <span className="font-semibold text-white">Citizen ID:</span> 
                    <span className="font-mono bg-white/5 px-2 py-0.5 rounded">CEN-2026-458796</span>
                  </p>
                  <p className="flex items-center justify-center sm:justify-start gap-2">
                    <span className="font-semibold text-white">Family ID:</span> 
                    <span className="font-mono bg-white/5 px-2 py-0.5 rounded">FAM-2026-987654</span>
                  </p>
                </div>
              </div>

            </div>

            {/* Quick Dossier Actions */}
            <div className="flex items-center gap-2.5 w-full lg:w-auto shrink-0 justify-center sm:justify-start lg:justify-end flex-wrap">
              <button 
                onClick={() => setIsEditingPersonal(true)}
                className="bg-white/10 hover:bg-white/15 border border-white/20 px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Edit className="w-3.5 h-3.5" /> Edit Profile
              </button>
              <button
                onClick={handleDownloadSummary}
                className="bg-[#ff9933] hover:bg-amber-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-md active:scale-95"
              >
                <Download className="w-4 h-4" /> Download Summary
              </button>
            </div>

          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* Main Grid Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* ══════════════════════════════════════════════════
              LEFT SIDEBAR: PROGRESS & NAVIGATION TABS
          ══════════════════════════════════════════════════ */}
          <div className="lg:col-span-1 space-y-6">

            {/* SECTION 2: PROFILE COMPLETION STATUS */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm relative overflow-hidden">
              <h3 className="text-sm font-bold text-slate-800 tracking-tight flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-[#ff9933]" /> Completion Score
              </h3>
              
              <div className="flex items-center justify-between mt-4">
                {/* Circular SVG progress */}
                <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-slate-100"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-[#138808] transition-all duration-500 ease-out"
                      strokeWidth="3.5"
                      strokeDasharray={`${profileCompletion.percentage}, 100`}
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <span className="absolute text-sm font-extrabold text-slate-800">
                    {profileCompletion.percentage}%
                  </span>
                </div>

                <div className="text-right">
                  <p className="text-2xl font-black text-slate-800">{profileCompletion.completedCount} of {profileCompletion.totalCount}</p>
                  <p className="text-[10px] text-slate-500 font-semibold uppercase">Profile Cards Done</p>
                </div>
              </div>

              {profileCompletion.missingFields.length > 0 ? (
                <div className="mt-4 pt-3 border-t border-slate-150">
                  <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider">Incomplete Items:</p>
                  <ul className="mt-1 space-y-1 text-xs text-slate-500 font-medium">
                    {profileCompletion.missingFields.map((field, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        {field}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="mt-4 pt-3 border-t border-slate-150 flex items-center gap-1.5 text-xs text-[#138808] font-bold">
                  <CheckCircle className="w-4 h-4 text-[#138808]" /> Citizen Profile Completed!
                </div>
              )}
            </div>

            {/* Dashboard Sidebar Navigation Links */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-3 space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 pt-2 pb-1">
                Citizen Directory
              </p>
              
              {[
                { id: 'overview', label: 'Dashboard Overview', icon: Sliders },
                { id: 'personal', label: 'Identity & Info', icon: User },
                { id: 'contact', label: 'Contact Details', icon: Phone },
                { id: 'address', label: 'Address & Mapping', icon: MapPin },
                { id: 'family', label: 'Family & Household', icon: Heart },
                { id: 'security', label: 'Security & Access', icon: Shield },
                { id: 'preferences', label: 'Settings & Vault', icon: Settings }
              ].map((tab) => {
                const IconComponent = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                      isActive 
                        ? 'bg-[#0b2447] text-white shadow-sm' 
                        : 'text-slate-650 hover:bg-slate-100 hover:text-slate-800'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <IconComponent className={`w-4 h-4 ${isActive ? 'text-[#ff9933]' : 'text-slate-450'}`} />
                      {tab.label}
                    </span>
                    <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isActive ? 'translate-x-0.5' : 'text-slate-300'}`} />
                  </button>
                );
              })}
            </div>

            {/* Quick Actions Shortcuts Widget */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Quick Actions</h4>
              <div className="grid grid-cols-2 gap-2 text-center text-xs">
                <button 
                  onClick={() => handleQuickAction('personal')}
                  className="p-3 bg-[#0b2447]/5 hover:bg-[#0b2447]/10 text-[#0b2447] rounded-xl font-bold transition-all cursor-pointer flex flex-col items-center gap-1.5"
                >
                  <Edit className="w-4 h-4 text-[#ff9933]" />
                  <span>Edit Profile</span>
                </button>
                <button 
                  onClick={() => handleQuickAction('address')}
                  className="p-3 bg-[#0b2447]/5 hover:bg-[#0b2447]/10 text-[#0b2447] rounded-xl font-bold transition-all cursor-pointer flex flex-col items-center gap-1.5"
                >
                  <MapPin className="w-4 h-4 text-[#138808]" />
                  <span>Update Addr</span>
                </button>
                <button 
                  onClick={() => handleQuickAction('security')}
                  className="p-3 bg-[#0b2447]/5 hover:bg-[#0b2447]/10 text-[#0b2447] rounded-xl font-bold transition-all cursor-pointer flex flex-col items-center gap-1.5"
                >
                  <Lock className="w-4 h-4 text-amber-500" />
                  <span>Password</span>
                </button>
                <button 
                  onClick={() => handleQuickAction('preferences')}
                  className="p-3 bg-[#0b2447]/5 hover:bg-[#0b2447]/10 text-[#0b2447] rounded-xl font-bold transition-all cursor-pointer flex flex-col items-center gap-1.5"
                >
                  <UploadCloud className="w-4 h-4 text-blue-500" />
                  <span>Upload Vault</span>
                </button>
              </div>
            </div>

          </div>

          {/* ══════════════════════════════════════════════════
              RIGHT MAIN AREA: DYNAMIC TAB CONTENTS
          ══════════════════════════════════════════════════ */}
          <div id="tab-content-anchor" className="lg:col-span-3 space-y-6">

            {/* TAB CONTENT: 1. OVERVIEW HUB */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                
                {/* Visual Dashboard Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-[#0b2447] to-[#1a3d6c] text-white p-5 rounded-2xl shadow-sm relative overflow-hidden">
                    <span className="text-[10px] uppercase font-bold text-white/50 tracking-wider">Aadhaar Link</span>
                    <p className="text-xl font-extrabold mt-1">Verified & Linked</p>
                    <p className="text-[11px] text-slate-300 font-light mt-1">Synced successfully with UIDAI</p>
                    <UserCheck className="absolute right-4 bottom-4 w-10 h-10 text-white/10" />
                  </div>
                  
                  <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm relative overflow-hidden">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Census Household</span>
                    <p className="text-xl font-extrabold text-slate-800 mt-1">{familyMembers.length} Members</p>
                    <p className="text-[11px] text-[#138808] font-bold mt-1 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Unit Verified
                    </p>
                    <Heart className="absolute right-4 bottom-4 w-10 h-10 text-[#138808]/10" />
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm relative overflow-hidden">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Address Proof</span>
                    <p className="text-xl font-extrabold text-slate-800 mt-1">Last Sync Jan 2026</p>
                    <p className="text-[11px] text-slate-500 font-light mt-1">Annual residency sweep verified</p>
                    <MapPin className="absolute right-4 bottom-4 w-10 h-10 text-[#ff9933]/10" />
                  </div>
                </div>

                {/* Grid summary preview cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Identity Summary Card */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2.5 flex items-center gap-1.5">
                        <User className="w-4 h-4 text-blue-500" /> Identity Information
                      </h3>
                      <ul className="mt-3 space-y-2 text-xs">
                        <li className="flex justify-between">
                          <span className="text-slate-400">Full Name:</span>
                          <span className="font-semibold text-slate-700">{personalInfo.fullName}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-slate-400">Gender:</span>
                          <span className="font-semibold text-slate-700">{personalInfo.gender}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-slate-400">Aadhaar (Masked):</span>
                          <span className="font-mono font-semibold text-slate-700">{identities.aadhaar}</span>
                        </li>
                      </ul>
                    </div>
                    <button
                      onClick={() => setActiveTab('personal')}
                      className="mt-4 w-full bg-[#0b2447]/5 hover:bg-[#0b2447]/10 text-[#0b2447] py-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-center"
                    >
                      View Details
                    </button>
                  </div>

                  {/* Contact Summary Card */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2.5 flex items-center gap-1.5">
                        <Phone className="w-4 h-4 text-emerald-500" /> Primary Contact
                      </h3>
                      <ul className="mt-3 space-y-2 text-xs">
                        <li className="flex justify-between">
                          <span className="text-slate-400">Mobile:</span>
                          <span className="font-mono font-semibold text-slate-700">{contactInfo.mobile}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-slate-400">Email ID:</span>
                          <span className="font-semibold text-slate-700">{contactInfo.email}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-slate-400">Emergency Contact:</span>
                          <span className={`font-semibold ${contactInfo.emergencyName ? 'text-slate-700' : 'text-amber-500 font-bold'}`}>
                            {contactInfo.emergencyName || 'Not Set'}
                          </span>
                        </li>
                      </ul>
                    </div>
                    <button
                      onClick={() => setActiveTab('contact')}
                      className="mt-4 w-full bg-[#0b2447]/5 hover:bg-[#0b2447]/10 text-[#0b2447] py-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-center"
                    >
                      Manage Contacts
                    </button>
                  </div>

                  {/* Address Summary Card */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2.5 flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-[#ff9933]" /> Residential Address
                      </h3>
                      <p className="text-xs text-slate-650 mt-3 leading-relaxed">
                        {addressInfo.houseNo}, {addressInfo.street}, {addressInfo.locality}, {addressInfo.city}, {addressInfo.state} - {addressInfo.pinCode}
                      </p>
                      <div className="mt-3 flex justify-between text-[11px]">
                        <span className="text-slate-400">Verification Status:</span>
                        <span className="text-[#138808] font-bold">Verified</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveTab('address')}
                      className="mt-4 w-full bg-[#0b2447]/5 hover:bg-[#0b2447]/10 text-[#0b2447] py-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-center"
                    >
                      Update Address
                    </button>
                  </div>

                  {/* Security Summary Card */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2.5 flex items-center gap-1.5">
                        <Shield className="w-4 h-4 text-purple-500" /> Account Shield
                      </h3>
                      <ul className="mt-3 space-y-2 text-xs">
                        <li className="flex justify-between">
                          <span className="text-slate-400">2-Factor Authentication:</span>
                          <span className={`font-bold ${is2FAEnabled ? 'text-[#138808]' : 'text-red-500'}`}>
                            {is2FAEnabled ? 'Enabled' : 'Disabled'}
                          </span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-slate-400">Active Devices:</span>
                          <span className="font-semibold text-slate-700">{activeSessions.length} Devices</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-slate-400">Mobile Alerts:</span>
                          <span className="text-[#138808] font-bold">Verified Badge</span>
                        </li>
                      </ul>
                    </div>
                    <button
                      onClick={() => setActiveTab('security')}
                      className="mt-4 w-full bg-[#0b2447]/5 hover:bg-[#0b2447]/10 text-[#0b2447] py-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-center"
                    >
                      Manage Security
                    </button>
                  </div>

                </div>

                {/* Section: Activity logs summary */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
                  <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-1.5">
                    <Clock className="w-4.5 h-4.5 text-blue-500" /> Recent Profile History
                  </h3>
                  <div className="relative border-l border-slate-150 pl-6 space-y-5 mt-4">
                    {activityHistory.slice(0, 3).map((item) => (
                      <div key={item.id} className="relative">
                        {/* Timeline bubble */}
                        <div className={`absolute -left-[31px] top-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ring-4 ring-slate-100/50 ${
                          item.title.includes('Create') ? 'bg-green-500' : 'bg-[#ff9933]'
                        }`} />
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <p className="text-xs font-bold text-slate-800">{item.title}</p>
                            <p className="text-[11px] text-slate-500 font-light mt-0.5">{item.desc}</p>
                          </div>
                          <span className="text-[10px] text-slate-450 font-medium whitespace-nowrap">{item.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* TAB CONTENT: 2. PERSONAL & IDENTITY */}
            {activeTab === 'personal' && (
              <div className="space-y-6">
                
                {/* SECTION 3: PERSONAL INFORMATION */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3.5">
                    <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
                      <User className="w-4.5 h-4.5 text-[#0b2447]" /> Basic Information Dossier
                    </h3>
                    <button
                      onClick={() => setIsEditingPersonal(true)}
                      className="text-xs text-primary font-bold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5" /> Edit Info
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div className="space-y-3.5">
                      <div className="flex justify-between text-xs pb-1.5 border-b border-slate-50">
                        <span className="text-slate-400 font-medium">Citizen Full Name:</span>
                        <span className="font-bold text-slate-700">{personalInfo.fullName}</span>
                      </div>
                      <div className="flex justify-between text-xs pb-1.5 border-b border-slate-50">
                        <span className="text-slate-400 font-medium">Gender:</span>
                        <span className="font-semibold text-slate-700">{personalInfo.gender}</span>
                      </div>
                      <div className="flex justify-between text-xs pb-1.5 border-b border-slate-50">
                        <span className="text-slate-400 font-medium">Date of Birth:</span>
                        <span className="font-semibold text-slate-700">{personalInfo.dob}</span>
                      </div>
                    </div>
                    <div className="space-y-3.5">
                      <div className="flex justify-between text-xs pb-1.5 border-b border-slate-50">
                        <span className="text-slate-400 font-medium">Calculated Age:</span>
                        <span className="font-semibold text-slate-700">{personalInfo.age} Years</span>
                      </div>
                      <div className="flex justify-between text-xs pb-1.5 border-b border-slate-50">
                        <span className="text-slate-400 font-medium">Marital Status:</span>
                        <span className="font-semibold text-slate-700">{personalInfo.maritalStatus}</span>
                      </div>
                      <div className="flex justify-between text-xs pb-1.5 border-b border-slate-50">
                        <span className="text-slate-400 font-medium">Nationality:</span>
                        <span className="font-semibold text-slate-700">{personalInfo.nationality}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Identity Information Card */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3.5">
                    <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
                      <Shield className="w-4.5 h-4.5 text-[#138808]" /> Secure National Credentials
                    </h3>
                    <span className="bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-200 px-3 py-0.5 rounded-full flex items-center gap-1.5">
                      <Lock className="w-3 h-3" /> Secure Data Indicators
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    
                    {/* Aadhaar */}
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-150 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-700">Aadhaar Card</span>
                          <span className="bg-[#138808]/10 text-[#138808] text-[9px] font-bold px-2 py-0.2 rounded-full border border-[#138808]/20">
                            Verified
                          </span>
                        </div>
                        <p className="text-sm font-mono mt-1 text-slate-650">
                          {maskIdentities.aadhaar ? identities.aadhaar : identities.aadhaarFull}
                        </p>
                      </div>
                      <button 
                        onClick={() => toggleMask('aadhaar')}
                        className="p-2 bg-white hover:bg-slate-100 text-slate-600 rounded-lg shadow-sm transition-colors border border-slate-200 cursor-pointer"
                        title={maskIdentities.aadhaar ? "Unmask Aadhaar" : "Mask Aadhaar"}
                      >
                        {maskIdentities.aadhaar ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Voter ID */}
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-150 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-700">Voter ID (EPIC)</span>
                          <span className="bg-[#138808]/10 text-[#138808] text-[9px] font-bold px-2 py-0.2 rounded-full border border-[#138808]/20">
                            Verified
                          </span>
                        </div>
                        <p className="text-sm font-mono mt-1 text-slate-650">
                          {maskIdentities.voterId ? identities.voterId : identities.voterIdFull}
                        </p>
                      </div>
                      <button 
                        onClick={() => toggleMask('voterId')}
                        className="p-2 bg-white hover:bg-slate-100 text-slate-600 rounded-lg shadow-sm transition-colors border border-slate-200 cursor-pointer"
                      >
                        {maskIdentities.voterId ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* PAN */}
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-150 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-700">PAN Number</span>
                          <span className="bg-[#138808]/10 text-[#138808] text-[9px] font-bold px-2 py-0.2 rounded-full border border-[#138808]/20">
                            Verified
                          </span>
                        </div>
                        <p className="text-sm font-mono mt-1 text-slate-650">
                          {maskIdentities.pan ? identities.pan : identities.panFull}
                        </p>
                      </div>
                      <button 
                        onClick={() => toggleMask('pan')}
                        className="p-2 bg-white hover:bg-slate-100 text-slate-600 rounded-lg shadow-sm transition-colors border border-slate-200 cursor-pointer"
                      >
                        {maskIdentities.pan ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Passport */}
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-150 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-700">Passport Number</span>
                          <span className="bg-amber-55 bg-amber-50 text-amber-600 text-[9px] font-bold px-2 py-0.2 rounded-full border border-amber-200">
                            Pending Audit
                          </span>
                        </div>
                        <p className="text-sm font-mono mt-1 text-slate-650">
                          {maskIdentities.passport ? identities.passport : identities.passportFull}
                        </p>
                      </div>
                      <button 
                        onClick={() => toggleMask('passport')}
                        className="p-2 bg-white hover:bg-slate-100 text-slate-600 rounded-lg shadow-sm transition-colors border border-slate-200 cursor-pointer"
                      >
                        {maskIdentities.passport ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                    </div>

                  </div>

                  <div className="flex justify-end gap-3 mt-6 border-t border-slate-100 pt-4 flex-wrap">
                    <button
                      onClick={() => setIsRequestingCorrection(true)}
                      className="bg-[#ff9933]/15 hover:bg-[#ff9933]/25 text-[#ff9933] border border-[#ff9933]/20 px-4.5 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors"
                    >
                      Request Correction
                    </button>
                    <button
                      onClick={() => {
                        setSuccess('Identity verification sweep re-triggered.');
                      }}
                      className="bg-[#0b2447] hover:bg-[#1a3d6c] text-white px-4.5 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors flex items-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> Submit Verification Request
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* TAB CONTENT: 3. CONTACT DETAILS */}
            {activeTab === 'contact' && (
              <div className="space-y-6">
                
                {/* SECTION 4: CONTACT INFORMATION */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
                  <h3 className="text-sm font-extrabold text-slate-800 border-b border-slate-100 pb-3.5 flex items-center gap-2">
                    <Mail className="w-4.5 h-4.5 text-blue-500" /> Communication details & Preferences
                  </h3>

                  <form onSubmit={handleSaveContactDetails} className="space-y-5 mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Primary Mobile</label>
                        <input 
                          type="text" 
                          value={contactInfo.mobile} 
                          onChange={(e) => setContactInfo({...contactInfo, mobile: e.target.value})}
                          className="w-full text-xs font-semibold px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Alternate Mobile</label>
                        <input 
                          type="text" 
                          placeholder="e.g. +91 99999 99999"
                          value={contactInfo.alternateMobile} 
                          onChange={(e) => setContactInfo({...contactInfo, alternateMobile: e.target.value})}
                          className="w-full text-xs font-semibold px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Email Address</label>
                        <input 
                          type="email" 
                          value={contactInfo.email} 
                          onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})}
                          className="w-full text-xs font-semibold px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all"
                        />
                      </div>
                    </div>

                    {/* Communication preferences toggles */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 space-y-3.5">
                      <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Communication Preference Channels
                      </h4>
                      
                      <div className="flex justify-between items-center text-xs">
                        <div>
                          <p className="font-bold text-slate-700">SMS Alerts</p>
                          <p className="text-[10px] text-slate-500 font-light mt-0.5">High-priority transactional alerts</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={preferences.smsAlerts}
                            onChange={(e) => setPreferences({...preferences, smsAlerts: e.target.checked})}
                            className="sr-only peer" 
                          />
                          <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#138808]" />
                        </label>
                      </div>

                      <div className="flex justify-between items-center text-xs pt-2.5 border-t border-slate-150">
                        <div>
                          <p className="font-bold text-slate-700">Email Alerts</p>
                          <p className="text-[10px] text-slate-500 font-light mt-0.5">Monthly reports & certificate updates</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={preferences.emailAlerts}
                            onChange={(e) => setPreferences({...preferences, emailAlerts: e.target.checked})}
                            className="sr-only peer" 
                          />
                          <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#138808]" />
                        </label>
                      </div>

                      <div className="flex justify-between items-center text-xs pt-2.5 border-t border-slate-150">
                        <div>
                          <p className="font-bold text-slate-700">Push Notifications</p>
                          <p className="text-[10px] text-slate-500 font-light mt-0.5">Real-time status tracking updates</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={preferences.pushAlerts}
                            onChange={(e) => setPreferences({...preferences, pushAlerts: e.target.checked})}
                            className="sr-only peer" 
                          />
                          <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#138808]" />
                        </label>
                      </div>
                    </div>

                    {/* Emergency Contact card */}
                    <div className="p-4 border border-red-200/50 bg-red-50/20 rounded-xl space-y-3.5">
                      <div className="flex items-center gap-1.5">
                        <Heart className="w-4 h-4 text-red-500" />
                        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Emergency Contact Cards</h4>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Contact Name</label>
                          <input 
                            type="text" 
                            placeholder="e.g. Sunita Mehra"
                            value={contactInfo.emergencyName}
                            onChange={(e) => setContactInfo({...contactInfo, emergencyName: e.target.value})}
                            className="w-full text-xs font-semibold px-3 py-2 bg-white border border-slate-200 rounded-lg outline-none focus:border-red-500 transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Relationship</label>
                          <select 
                            value={contactInfo.emergencyRelation}
                            onChange={(e) => setContactInfo({...contactInfo, emergencyRelation: e.target.value})}
                            className="w-full text-xs font-semibold px-3 py-2 bg-white border border-slate-200 rounded-lg outline-none focus:border-red-500 transition-all"
                          >
                            <option value="">Select Relation</option>
                            <option value="Spouse">Spouse</option>
                            <option value="Father">Father</option>
                            <option value="Mother">Mother</option>
                            <option value="Son">Son</option>
                            <option value="Daughter">Daughter</option>
                            <option value="Brother">Brother</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Mobile Number</label>
                          <input 
                            type="text" 
                            placeholder="e.g. +91 99999 88888"
                            value={contactInfo.emergencyMobile}
                            onChange={(e) => setContactInfo({...contactInfo, emergencyMobile: e.target.value})}
                            className="w-full text-xs font-semibold px-3 py-2 bg-white border border-slate-200 rounded-lg outline-none focus:border-red-500 transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end pt-3">
                      <button 
                        type="submit"
                        className="bg-[#0b2447] hover:bg-[#1a3d6c] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md"
                      >
                        Save Settings
                      </button>
                    </div>
                  </form>
                </div>

              </div>
            )}

            {/* TAB CONTENT: 4. ADDRESS & RESIDENCY */}
            {activeTab === 'address' && (
              <div className="space-y-6">
                
                {/* SECTION 5: ADDRESS INFORMATION */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3.5 flex-wrap gap-3">
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
                        <MapPin className="w-4.5 h-4.5 text-blue-500" /> Current Address & Geographic Coordinates
                      </h3>
                      <p className="text-[10px] text-slate-400 font-medium mt-0.5">Last Verified: 12 January 2026</p>
                    </div>
                    <span className="bg-[#138808]/10 text-[#138808] border border-[#138808]/20 px-3.5 py-0.5 rounded-full text-xs font-bold">
                      Address Verified
                    </span>
                  </div>

                  <form onSubmit={handleSaveAddressDetails} className="space-y-5 mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase mb-1">House Number</label>
                        <input 
                          type="text" 
                          value={addressInfo.houseNo}
                          onChange={(e) => setAddressInfo({...addressInfo, houseNo: e.target.value})}
                          className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-primary transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Street / Lane</label>
                        <input 
                          type="text" 
                          value={addressInfo.street}
                          onChange={(e) => setAddressInfo({...addressInfo, street: e.target.value})}
                          className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-primary transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Locality / Village</label>
                        <input 
                          type="text" 
                          value={addressInfo.locality}
                          onChange={(e) => setAddressInfo({...addressInfo, locality: e.target.value})}
                          className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-primary transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase mb-1">District</label>
                        <input 
                          type="text" 
                          value={addressInfo.district}
                          onChange={(e) => setAddressInfo({...addressInfo, district: e.target.value})}
                          className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-primary transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase mb-1">State</label>
                        <input 
                          type="text" 
                          value={addressInfo.state}
                          onChange={(e) => setAddressInfo({...addressInfo, state: e.target.value})}
                          className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-primary transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase mb-1">PIN Code</label>
                        <input 
                          type="text" 
                          value={addressInfo.pinCode}
                          onChange={(e) => setAddressInfo({...addressInfo, pinCode: e.target.value})}
                          className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-primary transition-all font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase mb-1">GPS Coordinates</label>
                        <input 
                          type="text" 
                          value={addressInfo.gps}
                          readOnly
                          className="w-full text-xs font-semibold px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg outline-none text-slate-500 font-mono"
                        />
                      </div>
                    </div>

                    {/* Styled Mock Interactive Map */}
                    <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm relative">
                      <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 flex justify-between items-center">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Household Location Marker</span>
                        <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-full">GPS Live Connection</span>
                      </div>
                      
                      {/* Map Drawing Canvas mockup */}
                      <div className="bg-[#e4ece9] h-48 relative flex items-center justify-center overflow-hidden">
                        
                        {/* Fake map drawing patterns */}
                        <div className="absolute inset-0 opacity-40">
                          <div className="absolute w-[2px] h-full bg-white left-1/3" />
                          <div className="absolute w-[2px] h-full bg-white left-2/3" />
                          <div className="absolute h-[2px] w-full bg-white top-1/4" />
                          <div className="absolute h-[2px] w-full bg-white top-3/4" />
                          <div className="absolute w-12 h-12 border-2 border-slate-300 rounded-full left-1/4 top-1/2" />
                          <div className="absolute w-24 h-10 bg-slate-300 transform -rotate-12 left-1/2 top-1/3 rounded" />
                        </div>

                        {/* Interactive Household coordinates pointer */}
                        <div className="relative z-10 flex flex-col items-center animate-bounce">
                          <div className="p-2 bg-[#ff9933] text-white rounded-full shadow-lg border-2 border-white">
                            <MapPin className="w-6 h-6" />
                          </div>
                          <div className="mt-1 bg-[#0b2447] text-white px-2.5 py-1 rounded-md text-[9px] font-extrabold whitespace-nowrap shadow-md">
                            M. Mehra Residence
                          </div>
                        </div>

                        {/* GPS Info panel overlay */}
                        <div className="absolute bottom-2.5 left-2.5 bg-white/95 backdrop-blur-sm border border-slate-200/50 p-2.5 rounded-lg shadow-md max-w-xs text-[10px]">
                          <p className="font-bold text-slate-800">Dwarka Sector 21</p>
                          <p className="text-slate-500 mt-0.5">Plot No 45, Sector 21, New Delhi, Delhi 110001</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 flex-wrap">
                      <label 
                        className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors flex items-center gap-1.5"
                      >
                        <UploadCloud className="w-3.5 h-3.5" /> Upload Address Proof
                        <input 
                          type="file" 
                          onChange={() => handleUploadDoc('DOC-3')}
                          className="hidden" 
                        />
                      </label>
                      <button 
                        type="button"
                        onClick={() => {
                          setSuccess('Geographical re-verification scheduled.');
                        }}
                        className="bg-[#ff9933]/15 hover:bg-[#ff9933]/25 text-[#ff9933] border border-[#ff9933]/20 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors"
                      >
                        Request Reverification
                      </button>
                      <button 
                        type="submit"
                        className="bg-[#0b2447] hover:bg-[#1a3d6c] text-white px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-colors"
                      >
                        Update Address
                      </button>
                    </div>
                  </form>
                </div>

              </div>
            )}

            {/* TAB CONTENT: 5. FAMILY & HOUSEHOLD */}
            {activeTab === 'family' && (
              <div className="space-y-6">
                
                {/* SECTION 6: FAMILY INFORMATION */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3.5">
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
                        <Heart className="w-4.5 h-4.5 text-purple-500" /> Household & Family Summary
                      </h3>
                      <p className="text-[10px] text-slate-400 font-medium mt-0.5">Family ID: FAM-2026-987654</p>
                    </div>
                    <span className="bg-[#138808]/10 text-[#138808] border border-[#138808]/20 px-3.5 py-0.5 rounded-full text-xs font-bold">
                      Household Status: Verified
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-150">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Head of Household</span>
                      <p className="text-sm font-extrabold text-slate-800 mt-1">{personalInfo.fullName}</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-150">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Total Members Linked</span>
                      <p className="text-sm font-extrabold text-slate-800 mt-1">{familyMembers.length} Members</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-150">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Declaration status</span>
                      <p className="text-sm font-extrabold text-[#138808] mt-1 flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" /> Census Confirmed
                      </p>
                    </div>
                  </div>

                  {/* Family members preview lists */}
                  <div className="mt-6 space-y-3">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Family Members Registry Preview</h4>
                    <div className="divide-y divide-slate-100 bg-slate-50/50 rounded-xl border border-slate-200/60 overflow-hidden">
                      {familyMembers.map((member) => (
                        <div key={member.id} className="p-3.5 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#0b2447] to-[#1a3d6c] text-white flex items-center justify-center text-xs font-extrabold">
                              {member.avatar}
                            </div>
                            <div>
                              <p className="text-xs font-extrabold text-slate-800">{member.name}</p>
                              <p className="text-[10px] text-slate-500 font-medium">{member.relation}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2.5">
                            <span className="bg-[#138808]/10 text-[#138808] text-[9px] font-bold px-2 py-0.5 rounded-full border border-[#138808]/20 flex items-center gap-0.5">
                              <Check className="w-2.5 h-2.5" /> Verified
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 mt-6 border-t border-slate-100 pt-4 flex-wrap">
                    <button
                      onClick={() => setIsAddingFamily(true)}
                      className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors"
                    >
                      Add Family Member
                    </button>
                    <button
                      onClick={() => {
                        setSuccess('Requested family record corrections. Auditing in progress.');
                      }}
                      className="bg-[#ff9933]/15 hover:bg-[#ff9933]/25 text-[#ff9933] border border-[#ff9933]/20 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors"
                    >
                      Edit Family Information
                    </button>
                    <button
                      onClick={() => navigate('/family')}
                      className="bg-[#0b2447] hover:bg-[#1a3d6c] text-white px-4.5 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-colors flex items-center gap-1.5"
                    >
                      Open Family Profile <ArrowUpRight className="w-4 h-4 text-[#ff9933]" />
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* TAB CONTENT: 6. SECURITY & ACCESS */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                
                {/* SECTION 7: SECURITY SETTINGS */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
                  <h3 className="text-sm font-extrabold text-slate-800 border-b border-slate-100 pb-3.5 flex items-center gap-2">
                    <Shield className="w-4.5 h-4.5 text-red-500" /> Account Security Shields & Badges
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-150 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400">Mobile Verification</span>
                        <p className="text-sm font-extrabold text-[#138808] mt-1 flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" /> Verified Mobile
                        </p>
                      </div>
                      <span className="w-2.5 h-2.5 rounded-full bg-[#138808]" />
                    </div>

                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-150 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400">Email Verification</span>
                        <p className="text-sm font-extrabold text-[#138808] mt-1 flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" /> Verified Email
                        </p>
                      </div>
                      <span className="w-2.5 h-2.5 rounded-full bg-[#138808]" />
                    </div>

                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-150 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400">2FA Shield Status</span>
                        <p className="text-sm font-extrabold text-slate-800 mt-1">
                          {is2FAEnabled ? 'Protected Account' : 'Vulnerable Account'}
                        </p>
                      </div>
                      <button 
                        onClick={handleToggle2FA}
                        className={`text-xs px-3 py-1 rounded-lg font-bold border transition-colors cursor-pointer ${
                          is2FAEnabled 
                            ? 'bg-red-50 hover:bg-red-100 text-red-600 border-red-200' 
                            : 'bg-green-50 hover:bg-green-100 text-[#138808] border-[#138808]/20'
                        }`}
                      >
                        {is2FAEnabled ? 'Disable 2FA' : 'Enable 2FA'}
                      </button>
                    </div>
                  </div>

                  {/* Password Change Form */}
                  <form onSubmit={handleChangePassword} className="mt-6 pt-5 border-t border-slate-100 space-y-4">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Password Management</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Current Password</label>
                        <input 
                          type="password" 
                          placeholder="••••••••"
                          value={passwords.current}
                          onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                          className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">New Password</label>
                        <input 
                          type="password" 
                          placeholder="Enter strong password"
                          value={passwords.newPass}
                          onChange={(e) => setPasswords({...passwords, newPass: e.target.value})}
                          className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Confirm New Password</label>
                        <input 
                          type="password" 
                          placeholder="Re-enter new password"
                          value={passwords.confirm}
                          onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                          className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-primary"
                        />
                      </div>
                    </div>

                    {/* Password Strength Indicator */}
                    {passwords.newPass && (
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-slate-500 font-medium">Password Strength:</span>
                        <div className="flex gap-1 h-1.5 w-24 rounded-full overflow-hidden bg-slate-100 shrink-0">
                          <div className={`h-full ${passwordStrength.color} ${passwordStrength.score >= 1 ? 'w-1/3' : 'w-0'}`} />
                          <div className={`h-full ${passwordStrength.color} ${passwordStrength.score >= 3 ? 'w-1/3' : 'w-0'}`} />
                          <div className={`h-full ${passwordStrength.color} ${passwordStrength.score >= 5 ? 'w-1/3' : 'w-0'}`} />
                        </div>
                        <span className="font-bold text-slate-700">{passwordStrength.text}</span>
                      </div>
                    )}

                    <div className="flex justify-end">
                      <button 
                        type="submit"
                        className="bg-[#0b2447] hover:bg-[#1a3d6c] text-white px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors"
                      >
                        Change Password
                      </button>
                    </div>
                  </form>
                </div>

                {/* Login Activity & Sessions */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Active Device Sessions</h4>
                    <button 
                      onClick={handleLogoutAllDevices}
                      className="text-[10px] text-red-600 font-bold hover:underline cursor-pointer"
                    >
                      Logout All Devices
                    </button>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {activeSessions.map((session) => (
                      <div key={session.id} className="py-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-slate-100 rounded-lg text-slate-500">
                            {session.device.includes('iPhone') ? <Smartphone className="w-4 h-4" /> : <Laptop className="w-4 h-4" />}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-800">{session.device}</p>
                            <p className="text-[10px] text-slate-500 font-light mt-0.5">{session.location} · {session.time}</p>
                          </div>
                        </div>
                        
                        {!session.current && (
                          <button
                            onClick={() => handleTerminateSession(session.id)}
                            className="bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 px-3 py-1 rounded-lg text-[10px] font-bold cursor-pointer"
                          >
                            Terminate Session
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Security Alerts and Log Feeds */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider border-b border-slate-100 pb-3">
                    Security Alerts Dashboard
                  </h4>

                  <div className="space-y-3">
                    {securityLogs.map((log) => (
                      <div key={log.id} className="p-3 bg-slate-55 bg-slate-50/70 border border-slate-200/50 rounded-xl flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          {log.type === 'success' && <CheckCircle className="w-4 h-4 text-[#138808]" />}
                          {log.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-500" />}
                          {log.type === 'info' && <Info className="w-4 h-4 text-blue-500" />}
                          <div>
                            <p className="font-bold text-slate-800">{log.title}</p>
                            <p className="text-[10px] text-slate-500 font-light mt-0.5">{log.detail}</p>
                          </div>
                        </div>
                        <span className="text-[9px] text-slate-400 font-semibold">{log.time}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* TAB CONTENT: 7. SETTINGS & VAULT */}
            {activeTab === 'preferences' && (
              <div className="space-y-6">
                
                {/* SECTION 8: ACCOUNT PREFERENCES */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-5">
                  <h3 className="text-sm font-extrabold text-slate-800 border-b border-slate-100 pb-3.5 flex items-center gap-2">
                    <Sliders className="w-4.5 h-4.5 text-[#ff9933]" /> Portal Personalization & Theme
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">Portal Language</label>
                      <select 
                        value={preferences.language}
                        onChange={(e) => {
                          setPreferences({...preferences, language: e.target.value});
                          setSuccess(`Preferred interface language configured to ${e.target.value}`);
                        }}
                        className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-primary"
                      >
                        <option value="English">English (United Kingdom)</option>
                        <option value="Hindi">हिन्दी (Hindi)</option>
                        <option value="Tamil">தமிழ் (Tamil)</option>
                        <option value="Telugu">తెలుగు (Telugu)</option>
                        <option value="Bengali">বাংলা (Bengali)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5 font-sans">Theme Selector</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => {
                            setPreferences({...preferences, theme: 'Light'});
                            setSuccess('Light theme style loaded.');
                          }}
                          className={`py-2 px-4 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                            preferences.theme === 'Light' 
                              ? 'bg-[#0b2447] text-white border-transparent shadow-sm' 
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          Light Mode
                        </button>
                        <button
                          onClick={() => {
                            setPreferences({...preferences, theme: 'Dark'});
                            setSuccess('Dark theme style loaded (simulated DOM overlay).');
                          }}
                          className={`py-2 px-4 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                            preferences.theme === 'Dark' 
                              ? 'bg-[#0b2447] text-white border-transparent shadow-sm' 
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          Dark Mode
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">Accessibility font settings</label>
                      <select 
                        value={preferences.accessibility}
                        onChange={(e) => {
                          setPreferences({...preferences, accessibility: e.target.value});
                          setSuccess(`Accessibility layout set to: ${e.target.value}`);
                        }}
                        className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-primary"
                      >
                        <option value="Normal Font">Normal Font Size (14px)</option>
                        <option value="Medium Font">Medium Font Scaling (16px)</option>
                        <option value="Large Font">Large Readable Text (18px)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">Preferred Notification Path</label>
                      <select 
                        value={preferences.preferredComm}
                        onChange={(e) => {
                          setPreferences({...preferences, preferredComm: e.target.value});
                          setSuccess(`Alert route channel set to ${e.target.value}`);
                        }}
                        className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-primary"
                      >
                        <option value="SMS + Email">SMS + Email Alerts</option>
                        <option value="SMS Only">SMS Alerts Only</option>
                        <option value="Email Only">Email Digest Only</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* SECTION 9: DOCUMENT SUMMARY */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3 flex-wrap gap-2">
                    <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
                      <FileText className="w-4.5 h-4.5 text-blue-500" /> Digital Credentials Vault
                    </h3>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => {
                          setSuccess('Vault sync and verification triggered.');
                        }}
                        className="text-[10px] font-bold text-blue-600 hover:underline cursor-pointer"
                      >
                        Sync Vault
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {documents.map((doc) => (
                      <div key={doc.id} className="p-4 bg-slate-50/60 border border-slate-200/70 rounded-xl flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-slate-450 shrink-0" />
                          <div>
                            <p className="font-bold text-slate-800">{doc.name}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">{doc.type} · {doc.date}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2.5">
                          <span className={`text-[9px] font-bold border px-2 py-0.2 rounded-full ${
                            doc.status === 'Verified' 
                              ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                              : doc.status === 'Uploaded' 
                                ? 'bg-blue-50 text-blue-600 border-blue-200'
                                : 'bg-amber-50 text-amber-600 border-amber-200'
                          }`}>
                            {doc.status}
                          </span>
                          
                          {doc.status === 'Pending' ? (
                            <label className="text-[10px] font-bold text-blue-600 hover:underline cursor-pointer">
                              Upload
                              <input 
                                type="file" 
                                onChange={() => handleUploadDoc(doc.id)} 
                                className="hidden" 
                              />
                            </label>
                          ) : (
                            <button
                              onClick={() => {
                                setSuccess(`Simulating download of verified ${doc.name}`);
                              }}
                              className="text-[10px] font-bold text-[#ff9933] hover:underline cursor-pointer"
                            >
                              Download
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* SECTION 10: ACTIVITY HISTORY TIMELINE */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
                  <h3 className="text-sm font-extrabold text-slate-800 border-b border-slate-100 pb-3">
                    Registry Audit Logs & Activity History
                  </h3>

                  <div className="relative border-l border-slate-200 pl-6 space-y-6">
                    {activityHistory.map((item) => (
                      <div key={item.id} className="relative">
                        {/* Custom status icon map */}
                        <div className={`absolute -left-[35px] top-0.5 w-6 h-6 rounded-full border-2 border-white ring-4 ring-slate-100/50 flex items-center justify-center text-xs font-bold shadow-sm ${item.color}`}>
                          {item.icon === 'UserCheck' && <UserCheck className="w-3 h-3" />}
                          {item.icon === 'MapPin' && <MapPin className="w-3 h-3" />}
                          {item.icon === 'Lock' && <Lock className="w-3 h-3" />}
                          {item.icon === 'Plus' && <Plus className="w-3 h-3" />}
                          {item.icon === 'FileText' && <FileText className="w-3 h-3" />}
                          {item.icon === 'User' && <User className="w-3 h-3" />}
                        </div>
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <p className="text-xs font-bold text-slate-800">{item.title}</p>
                            <p className="text-[11px] text-slate-500 font-light mt-0.5">{item.desc}</p>
                          </div>
                          <span className="text-[10px] text-slate-450 font-bold whitespace-nowrap">{item.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* ══════════════════════════════════════════════════
                SECTION 12: HELP & SUPPORT WIDGET
            ══════════════════════════════════════════════════ */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
              
              <div className="border-b border-slate-100 pb-3.5">
                <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
                  <HelpCircle className="w-4.5 h-4.5 text-blue-500" /> Census Helpdesk & Grievance Tickets
                </h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Direct link to registry support teams</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* FAQs Accordion */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Frequently Asked Questions</h4>
                  <div className="space-y-2">
                    {[
                      { q: "How is my Census data secured?", a: "All citizen records are encrypted inside UIDAI-partnered vault environments with biometric key protections." },
                      { q: "Why is Alternate Mobile incomplete?", a: "Saving an alternate mobile provides account recovery channels and raises completion percentages." },
                      { q: "How to correct my name spelling?", a: "Under Identity tab, select 'Request Correction' and upload a gazetted identity card." },
                      { q: "Who updates address statuses?", a: "Once updated online, a field verification supervisor visits to approve physical credentials." }
                    ].map((faq, idx) => (
                      <div key={idx} className="border border-slate-150 rounded-xl overflow-hidden text-xs">
                        <button
                          type="button"
                          onClick={() => toggleFaq(idx)}
                          className="w-full bg-slate-50/50 hover:bg-slate-150/40 p-3 text-left font-bold text-slate-700 flex justify-between items-center cursor-pointer"
                        >
                          <span>{faq.q}</span>
                          <ChevronRight className={`w-3.5 h-3.5 transition-transform text-slate-400 ${faqOpen[idx] ? 'rotate-90' : ''}`} />
                        </button>
                        {faqOpen[idx] && (
                          <div className="p-3 bg-white text-slate-500 font-light border-t border-slate-150 leading-relaxed">
                            {faq.a}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Support Ticket Submission */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Submit Registry Ticket</h4>
                  
                  <form onSubmit={handleSupportTicketSubmit} className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Subject</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Inaccurate verification timestamp"
                        value={ticketSubject}
                        onChange={(e) => setTicketSubject(e.target.value)}
                        className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Category</label>
                      <select 
                        value={ticketCategory}
                        onChange={(e) => setTicketCategory(e.target.value)}
                        className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-primary"
                      >
                        <option value="profile">Profile Inaccuracies</option>
                        <option value="address">Geographic Mapping</option>
                        <option value="documents">Vault Credentials</option>
                        <option value="other">General Registry Support</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Description</label>
                      <textarea 
                        rows={3}
                        placeholder="Detail your request..."
                        value={ticketDescription}
                        onChange={(e) => setTicketDescription(e.target.value)}
                        className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-primary resize-none"
                      />
                    </div>
                    <button 
                      type="submit"
                      className="w-full bg-[#0b2447] hover:bg-[#1a3d6c] text-white py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-sm"
                    >
                      Raise Complaint Ticket
                    </button>
                  </form>
                </div>

              </div>

              {/* Support Assistant Live Chat */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm mt-6">
                <div className="bg-[#0b2447] text-white px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-bold">Bharat Census Assistant</span>
                  </div>
                  <span className="text-[10px] uppercase bg-white/10 px-2 py-0.5 rounded font-extrabold text-[#ff9933]">AI Agent</span>
                </div>

                {/* Message logs */}
                <div className="p-4 h-48 overflow-y-auto bg-[#fdfdfd] space-y-3">
                  {chatMessages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`p-3 rounded-xl max-w-xs text-xs shadow-sm leading-relaxed ${
                        msg.sender === 'user' 
                          ? 'bg-[#0b2447] text-white' 
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  {chatTyping && (
                    <div className="flex justify-start">
                      <div className="p-3 bg-slate-100 text-slate-400 rounded-xl text-xs flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" />
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Input action */}
                <form onSubmit={handleSendChatMessage} className="bg-slate-50 border-t border-slate-200 p-2 flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Ask about details, security, or address proof..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    className="flex-grow px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-[#0b2447]"
                  />
                  <button 
                    type="submit"
                    className="p-1.5 bg-[#0b2447] text-white rounded-lg hover:bg-slate-900 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>

            </div>

          </div>

        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          DIALOG / MODAL POPUPS (Simulated Views)
      ══════════════════════════════════════════════════ */}
      
      {/* 1. EDIT PROFILE MODAL */}
      {isEditingPersonal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xl max-w-md w-full overflow-hidden animate-fade-in">
            <div className="bg-[#0b2447] text-white p-4 flex justify-between items-center">
              <h3 className="font-bold text-sm">Edit Personal Registry Data</h3>
              <button onClick={() => setIsEditingPersonal(false)} className="text-white/80 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <form onSubmit={handleSavePersonalInfo} className="p-5 space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-slate-500 uppercase mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={personalInfo.fullName}
                  onChange={(e) => setPersonalInfo({...personalInfo, fullName: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-250 rounded-lg focus:border-[#0b2447] outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 uppercase mb-1">Gender</label>
                  <select 
                    value={personalInfo.gender}
                    onChange={(e) => setPersonalInfo({...personalInfo, gender: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-250 rounded-lg outline-none"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-500 uppercase mb-1">Marital Status</label>
                  <select 
                    value={personalInfo.maritalStatus}
                    onChange={(e) => setPersonalInfo({...personalInfo, maritalStatus: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-250 rounded-lg outline-none"
                  >
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 uppercase mb-1">Date of Birth</label>
                  <input 
                    type="text" 
                    value={personalInfo.dob}
                    onChange={(e) => setPersonalInfo({...personalInfo, dob: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-250 rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 uppercase mb-1">Nationality</label>
                  <input 
                    type="text" 
                    value={personalInfo.nationality}
                    onChange={(e) => setPersonalInfo({...personalInfo, nationality: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-250 rounded-lg outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setIsEditingPersonal(false)}
                  className="px-4 py-2 border border-slate-250 text-slate-700 rounded-xl hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-[#0b2447] text-white rounded-xl hover:bg-slate-900 cursor-pointer"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. REQUEST IDENTITY CORRECTION MODAL */}
      {isRequestingCorrection && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xl max-w-md w-full overflow-hidden animate-fade-in">
            <div className="bg-[#ff9933] text-white p-4 flex justify-between items-center">
              <h3 className="font-bold text-sm">Identity Verification Correction</h3>
              <button onClick={() => setIsRequestingCorrection(false)} className="text-white hover:text-slate-100 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <form onSubmit={handleSaveCorrectionRequest} className="p-5 space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-slate-500 uppercase mb-1">Target Document / Field</label>
                <select 
                  value={correctionField}
                  onChange={(e) => setCorrectionField(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-250 rounded-lg outline-none"
                >
                  <option value="name">Full Name (Voter/Aadhaar Inconsistency)</option>
                  <option value="dob">Date of Birth (Format Mismatch)</option>
                  <option value="pan">PAN Card Number link error</option>
                  <option value="passport">Passport verification</option>
                </select>
              </div>
              
              <div>
                <label className="block text-slate-500 uppercase mb-1">Proposed Correction Value</label>
                <input 
                  type="text" 
                  placeholder="Enter exact name or parameter"
                  value={correctionProposed}
                  onChange={(e) => setCorrectionProposed(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-250 rounded-lg outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-500 uppercase mb-1">Reason for request</label>
                <textarea 
                  rows={3}
                  placeholder="Explain why correction is needed..."
                  value={correctionReason}
                  onChange={(e) => setCorrectionReason(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-250 rounded-lg outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-slate-500 uppercase mb-1">Proof Attachment (Simulation)</label>
                <input 
                  type="text" 
                  placeholder="e.g. Birth_Certificate_MHA.pdf"
                  value={correctionProofName}
                  onChange={(e) => setCorrectionProofName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-250 rounded-lg outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setIsRequestingCorrection(false)}
                  className="px-4 py-2 border border-slate-250 text-slate-700 rounded-xl hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-[#ff9933] text-white rounded-xl hover:bg-amber-600 cursor-pointer"
                >
                  Submit Query
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. ADD FAMILY MEMBER DIALOG */}
      {isAddingFamily && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xl max-w-sm w-full overflow-hidden animate-fade-in">
            <div className="bg-[#0b2447] text-white p-4 flex justify-between items-center">
              <h3 className="font-bold text-sm">Link Family Member</h3>
              <button onClick={() => setIsAddingFamily(false)} className="text-white/80 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <form onSubmit={handleAddFamilyMember} className="p-5 space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-slate-500 uppercase mb-1">Full Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Sandeep Mehra"
                  value={newFamilyMember.name}
                  onChange={(e) => setNewFamilyMember({...newFamilyMember, name: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-250 rounded-lg focus:border-[#0b2447]"
                />
              </div>

              <div>
                <label className="block text-slate-500 uppercase mb-1">Relationship</label>
                <select 
                  value={newFamilyMember.relation}
                  onChange={(e) => setNewFamilyMember({...newFamilyMember, relation: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-250 rounded-lg outline-none"
                >
                  <option value="Son">Son</option>
                  <option value="Daughter">Daughter</option>
                  <option value="Spouse">Spouse</option>
                  <option value="Brother">Brother</option>
                  <option value="Sister">Sister</option>
                  <option value="Father">Father</option>
                  <option value="Mother">Mother</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="verify-family-check"
                  checked={newFamilyMember.verified}
                  onChange={(e) => setNewFamilyMember({...newFamilyMember, verified: e.target.checked})}
                  className="w-4 h-4 rounded text-[#0b2447] focus:ring-[#0b2447] cursor-pointer"
                />
                <label htmlFor="verify-family-check" className="text-slate-650 cursor-pointer">Verify via Linked Aadhaar Biometrics</label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setIsAddingFamily(false)}
                  className="px-4 py-2 border border-slate-250 text-slate-700 rounded-xl hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-[#0b2447] text-white rounded-xl hover:bg-slate-900 cursor-pointer"
                >
                  Link Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProfileManagement;
