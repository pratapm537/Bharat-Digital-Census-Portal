import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { censusAPI } from '../services/api.js';
import {
  ArrowLeft, Search, ShieldCheck, Heart, Users, Landmark,
  RefreshCw, Download, FileText, CheckCircle, Clock, AlertTriangle,
  ArrowRight, Upload, Info, MessageSquare, ChevronRight, X,
  Phone, HelpCircle, Activity, Sparkles, User, Check, Plus,
  Trash2, Edit2, ShieldAlert, MapPin, Share2
} from 'lucide-react';

const FamilyEmergencyProfile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Data Loading & States
  const [draft, setDraft] = useState(null);
  const [family, setFamily] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Demo Mode State
  const [isDemoMode, setIsDemoMode] = useState(true);
  const userManuallySelectedMode = useRef(false);

  // General Page States
  const [toastMessage, setToastMessage] = useState('');
  const [sosTriggered, setSosTriggered] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportFormat, setExportFormat] = useState(null);

  // Contacts State (Editable)
  const [contacts, setContacts] = useState([
    { id: 'c1', name: 'Rakesh Mehra', relationship: 'Father', phone: '+91 98765 43210', altPhone: '+91 98765 43211', isPrimary: true },
    { id: 'c2', name: 'Anita Mehra', relationship: 'Mother', phone: '+91 98765 12345', isSecondary: true },
    { id: 'c3', name: 'Dr. Gupta', relationship: 'Family Doctor', phone: '+91 99999 88888', isAdditional: true },
    { id: 'c4', name: 'Anil Sharma', relationship: 'Neighbor', phone: '+91 98989 89898', isAdditional: true },
    { id: 'c5', name: 'Suresh Mehra', relationship: 'Relative', phone: '+91 97979 79797', isAdditional: true },
    { id: 'c6', name: 'Ritu Kapoor', relationship: 'Family Friend', phone: '+91 96969 69696', isAdditional: true }
  ]);

  // Contact Modal States
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [contactForm, setContactForm] = useState({
    name: '',
    relationship: '',
    phone: '',
    altPhone: '',
    type: 'Additional' // 'Primary' | 'Secondary' | 'Additional'
  });

  // Health summary details
  const [medicalDetails, setMedicalDetails] = useState({
    conditions: 'Diabetes, High Blood Pressure, Asthma',
    allergies: 'Penicillin, Peanuts, Pollen',
    medications: 'Insulin (Rajesh), Amlodipine (Savitri), Inhaler (Mohit)',
    notes: 'Keep sugar tablets in Rakesh\'s medical pouch. Save wheelchair in car trunk.'
  });
  const [isEditingMedical, setIsEditingMedical] = useState(false);

  // Document Vault State
  const fileInputRef = useRef(null);
  const [activeDocToUpload, setActiveDocToUpload] = useState(null);
  const [documents, setDocuments] = useState([
    { id: 'd1', name: 'Medical Reports & Certs', type: 'Medical Certificate', size: '2.4 MB', date: 'May 12, 2026', status: 'Verified' },
    { id: 'd2', name: 'Disability Certificate', type: 'Disability Proof', size: '1.8 MB', date: 'May 18, 2026', status: 'Verified' },
    { id: 'd3', name: 'Health Insurance Card', type: 'Insurance Card', size: '950 KB', date: 'Jun 01, 2026', status: 'Pending Verification' },
    { id: 'd4', name: 'Emergency Identity Card', type: 'Emergency ID', size: '1.2 MB', date: 'Jun 02, 2026', status: 'Verified' }
  ]);

  // Blood group filter
  const [bloodSearch, setBloodSearch] = useState('');

  // AI chat advisor state
  const [advisorInput, setAdvisorInput] = useState('');
  const [chatLog, setChatLog] = useState([
    { role: 'bot', text: 'Emergency Support AI active. Type a medical condition, or ask how to prepare senior care profiles.' }
  ]);

  // FAQs state
  const [openedFaq, setOpenedFaq] = useState(null);

  // Simulated Family Structure
  const demoHead = {
    fullName: 'Mohit Pratap Mehra',
    dob: '1991-04-12',
    gender: 'Male',
    relationship: 'Head',
    bloodGroup: 'B+',
    disabled: false,
    disabilityType: 'None',
    disabilityRatio: 0,
    emergencyMed: 'Inhaler Active (Asthma)'
  };

  const demoFamily = [
    { id: 'm1', fullName: 'Rajesh Mehra', dob: '1954-08-15', gender: 'Male', relationship: 'Grandfather', bloodGroup: 'O+', disabled: false, careNeeded: 'Requires Daily Medication, Insulin Tracking', emergencyMed: 'Insulin (Diabetes)' },
    { id: 'm2', fullName: 'Savitri Mehra', dob: '1958-02-10', gender: 'Female', relationship: 'Grandmother', bloodGroup: 'A+', disabled: true, disabilityType: 'Visual Impairment', disabilityRatio: '60%', supportNeeded: 'Requires Assisted Navigation', emergencyMed: 'Amlodipine (Hypertension)' },
    { id: 'm3', fullName: 'Anil Mehra', dob: '1971-11-20', gender: 'Male', relationship: 'Father', bloodGroup: 'B+', disabled: false },
    { id: 'm4', fullName: 'Sunita Mehra', dob: '1974-06-05', gender: 'Female', relationship: 'Mother', bloodGroup: 'A+', disabled: false },
    { id: 'm5', fullName: 'Priya Mehra', dob: '1994-09-25', gender: 'Female', relationship: 'Spouse', bloodGroup: 'AB+', disabled: false },
    { id: 'm6', fullName: 'Aarav Mehra', dob: '2018-05-18', gender: 'Male', relationship: 'Son', bloodGroup: 'O+', disabled: false },
    { id: 'm7', fullName: 'Diya Mehra', dob: '2021-01-30', gender: 'Female', relationship: 'Daughter', bloodGroup: 'B+', disabled: false }
  ];

  const loadCensusData = async () => {
    try {
      const response = await censusAPI.getDraft();
      setDraft(response.data.draft);
      const dbFamily = response.data.family || [];
      setFamily(dbFamily);

      if (!userManuallySelectedMode.current) {
        if (dbFamily.length === 0) {
          setIsDemoMode(true);
        } else {
          setIsDemoMode(false);
        }
      }
    } catch (err) {
      setIsDemoMode(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCensusData();
  }, []);

  const handleDemoModeToggle = (val) => {
    userManuallySelectedMode.current = true;
    setIsDemoMode(val);
  };

  // Get active members list
  const activeMembers = useMemo(() => {
    if (isDemoMode) return [demoHead, ...demoFamily];
    
    // Convert actual backend data to structure
    const headObj = {
      fullName: draft?.personal_fullName || user?.fullName || 'Family Head',
      dob: draft?.personal_dob || '1990-01-01',
      gender: draft?.personal_gender || 'Male',
      relationship: 'Head',
      bloodGroup: draft?.health_bloodGroup || 'B+',
      disabled: draft?.health_disability === 'Yes' || draft?.health_disability === true,
      disabilityType: draft?.health_disabilityType || 'None',
      disabilityRatio: draft?.health_disabilityRatio || 0,
      emergencyMed: draft?.health_disability === 'Yes' ? 'Special Care Required' : 'None'
    };

    const familyArr = family.map((m) => ({
      id: m.id,
      fullName: m.fullName,
      dob: m.dob,
      gender: m.gender,
      relationship: m.relationship,
      bloodGroup: m.bloodGroup || 'O+',
      disabled: m.disabled || false,
      disabilityType: m.disabilityType || 'None',
      disabilityRatio: m.disabilityRatio || 0,
      emergencyMed: m.medicalCondition || 'None',
      careNeeded: m.disabled ? 'Requires assistance' : ''
    }));

    return [headObj, ...familyArr];
  }, [isDemoMode, draft, family, user]);

  // Compute Statistics
  const stats = useMemo(() => {
    const totalMembers = activeMembers.length;
    const emergencyContactsCount = contacts.length;
    
    // Completed profile calculation
    const medicalProfilesCount = activeMembers.filter(m => m.bloodGroup).length;
    const medicalProgress = totalMembers > 0 ? Math.round((medicalProfilesCount / totalMembers) * 100) : 0;
    
    const bloodGroupCount = activeMembers.filter(m => m.bloodGroup).length;

    // Readiness score calculation: based on contacts count, docs uploaded, and blood groups verified
    let readinessScore = 50;
    if (emergencyContactsCount >= 2) readinessScore += 20;
    if (medicalProgress === 100) readinessScore += 20;
    if (documents.filter(d => d.status === 'Verified').length >= 2) readinessScore += 10;

    return {
      members: totalMembers,
      contactsCount: emergencyContactsCount,
      medicalProgress,
      bloodGroupsCount: bloodGroupCount,
      readinessScore
    };
  }, [activeMembers, contacts, documents]);

  // Blood group breakdown chart helpers
  const bloodBreakdown = useMemo(() => {
    const counts = { 'A+': 0, 'B+': 0, 'O+': 0, 'AB+': 0, 'Others': 0 };
    activeMembers.forEach(m => {
      const bg = m.bloodGroup;
      if (counts[bg] !== undefined) {
        counts[bg]++;
      } else {
        counts['Others']++;
      }
    });
    return counts;
  }, [activeMembers]);

  // Filtered blood directory search
  const filteredBloodRegistry = useMemo(() => {
    return activeMembers.filter(m => {
      const q = bloodSearch.toLowerCase();
      return m.fullName.toLowerCase().includes(q) || m.bloodGroup.toLowerCase().includes(q) || m.relationship.toLowerCase().includes(q);
    });
  }, [activeMembers, bloodSearch]);

  // Action Toggles
  const triggerSos = () => {
    setSosTriggered(true);
    setToastMessage('🚨 EMERGENCY SOS INITIATED! Simulated GPS coordinates and family medical summaries shared with emergency units.');
    setTimeout(() => {
      setSosTriggered(false);
    }, 6000);
  };

  const handleStartExport = (format) => {
    if (exporting) return;
    setExporting(true);
    setExportFormat(format);
    setExportProgress(0);

    const interval = setInterval(() => {
      setExportProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setExporting(false);
            setToastMessage(`Family Emergency Profile exported successfully as ${format.toUpperCase()}!`);
          }, 300);
          return 100;
        }
        return prev + 20;
      });
    }, 150);
  };

  const simulateCall = (name, phone) => {
    setToastMessage(`📞 Connecting voice channel to ${name} (${phone})... Simulated call initiated.`);
  };

  // Contacts Management Action handlers
  const openAddContactModal = () => {
    setEditingContact(null);
    setContactForm({
      name: '',
      relationship: '',
      phone: '',
      altPhone: '',
      type: 'Additional'
    });
    setContactModalOpen(true);
  };

  const openEditContactModal = (c) => {
    setEditingContact(c.id);
    setContactForm({
      name: c.name,
      relationship: c.relationship,
      phone: c.phone,
      altPhone: c.altPhone || '',
      type: c.isPrimary ? 'Primary' : c.isSecondary ? 'Secondary' : 'Additional'
    });
    setContactModalOpen(true);
  };

  const handleSaveContact = (e) => {
    e.preventDefault();
    if (!contactForm.name.trim() || !contactForm.phone.trim()) {
      setToastMessage('Please enter contact name and phone number.');
      return;
    }

    if (editingContact) {
      setContacts(prev => prev.map(c => {
        if (c.id === editingContact) {
          return {
            ...c,
            name: contactForm.name,
            relationship: contactForm.relationship,
            phone: contactForm.phone,
            altPhone: contactForm.altPhone,
            isPrimary: contactForm.type === 'Primary',
            isSecondary: contactForm.type === 'Secondary',
            isAdditional: contactForm.type === 'Additional'
          };
        }
        // If modifying a contact to be primary/secondary, unset others of same type
        if (contactForm.type === 'Primary' && c.isPrimary) return { ...c, isPrimary: false, isAdditional: true };
        if (contactForm.type === 'Secondary' && c.isSecondary) return { ...c, isSecondary: false, isAdditional: true };
        return c;
      }));
      setToastMessage('Emergency contact updated successfully.');
    } else {
      const newId = `c_${Date.now()}`;
      const newContact = {
        id: newId,
        name: contactForm.name,
        relationship: contactForm.relationship,
        phone: contactForm.phone,
        altPhone: contactForm.altPhone,
        isPrimary: contactForm.type === 'Primary',
        isSecondary: contactForm.type === 'Secondary',
        isAdditional: contactForm.type === 'Additional'
      };

      setContacts(prev => {
        let updated = prev;
        if (contactForm.type === 'Primary') {
          updated = updated.map(c => c.isPrimary ? { ...c, isPrimary: false, isAdditional: true } : c);
        } else if (contactForm.type === 'Secondary') {
          updated = updated.map(c => c.isSecondary ? { ...c, isSecondary: false, isAdditional: true } : c);
        }
        return [...updated, newContact];
      });
      setToastMessage('New emergency contact added.');
    }
    setContactModalOpen(false);
  };

  const handleDeleteContact = (id) => {
    setContacts(prev => prev.filter(c => c.id !== id));
    setToastMessage('Emergency contact removed.');
  };

  // Vault upload simulator
  const triggerDocUpload = (docId) => {
    setActiveDocToUpload(docId);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0] && activeDocToUpload) {
      const file = e.target.files[0];
      setDocuments(prev => prev.map(d => {
        if (d.id === activeDocToUpload) {
          return { ...d, name: file.name, size: `${(file.size / 1024 / 1024).toFixed(2)} MB`, status: 'Verified', date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) };
        }
        return d;
      }));
      setToastMessage(`Document ${file.name} uploaded to vault and verified.`);
      setActiveDocToUpload(null);
    }
  };

  // AI Chat Handler
  const handleChatSend = (e) => {
    e.preventDefault();
    if (!advisorInput.trim()) return;

    const userMsg = advisorInput;
    setChatLog(prev => [...prev, { role: 'user', text: userMsg }]);
    setAdvisorInput('');

    let botResponse = 'Reviewing emergency protocols. ';
    const query = userMsg.toLowerCase();

    if (query.includes('diabetes') || query.includes('sugar') || query.includes('insulin')) {
      botResponse += 'For Diabetes emergencies: Rajesh Mehra takes regular insulin. Keep fast-acting glucose tablets, fruit juice, or candy nearby. If unresponsive, call Apollo Hospital helpline immediately.';
    } else if (query.includes('asthma') || query.includes('breath') || query.includes('inhaler')) {
      botResponse += 'For Asthma emergencies: Mohit Pratap Mehra uses a daily inhaler. Ensure the inhaler is kept at bedside. Help the person sit upright, loosen tight clothing, and administer rescue doses.';
    } else if (query.includes('blood') || query.includes('donor') || query.includes('o+')) {
      botResponse += 'Blood Group Profile: 2 members have O+ blood type, which is compatible for emergency donation to O+, A+, B+, and AB+. Savitri Mehra has A+ which is rare in this registry. Keep local blood bank card handy.';
    } else if (query.includes('disability') || query.includes('visual') || query.includes('assisted')) {
      botResponse += 'Disability Profile: Savitri Mehra has 60% Visual impairment. Ensure clear navigation pathways. Keep assistive visual aids in the emergency bag.';
    } else {
      botResponse += 'Emergency action center advice: Verify that offline Emergency ID Cards are printed for all members. Ensure Apollo Hospital helpline number is saved on speed dial.';
    }

    setTimeout(() => {
      setChatLog(prev => [...prev, { role: 'bot', text: botResponse }]);
    }, 700);
  };

  const calculateAge = (dobString) => {
    if (!dobString) return 0;
    const dob = new Date(dobString);
    const diff = Date.now() - dob.getTime();
    const ageDate = new Date(diff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  // Filter seniors and disabled members
  const seniors = useMemo(() => {
    return activeMembers.filter(m => calculateAge(m.dob) >= 60);
  }, [activeMembers]);

  const disabledMembers = useMemo(() => {
    return activeMembers.filter(m => m.disabled === true);
  }, [activeMembers]);

  return (
    <div className="flex-grow w-full bg-[#f8faff] dark:bg-[#030d1b] min-h-screen pb-16 relative transition-colors duration-300">
      
      {/* Hidden file input for vault */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".pdf,.png,.jpg,.jpeg"
      />

      {/* ══════════════════════════════════════════════════
          SECTION 1: PAGE HEADER & BANNER
      ══════════════════════════════════════════════════ */}
      <div className="bg-[#0b2447] text-white py-12 px-6 sm:px-12 relative overflow-hidden shadow-lg border-b border-red-500/30">
        <div className="absolute right-0 top-0 w-96 h-96 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 w-80 h-80 bg-[#ff9933]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 pointer-events-none opacity-5" style={{
          backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }} />
        
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative z-10">
          <div>
            <button 
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white mb-3 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Citizen Dashboard
            </button>
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="text-[10px] uppercase font-bold text-white/50 tracking-widest bg-white/10 px-3 py-0.5 rounded-full">
                Sovereign Citizen Link
              </span>
              <span className="text-[10px] uppercase font-bold text-red-400 bg-red-500/15 border border-red-500/25 px-3 py-0.5 rounded-full flex items-center gap-1">
                <ShieldAlert className="w-3 h-3 animate-pulse" /> Emergency Preparedness Hub
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 flex items-center gap-2.5">
              <Heart className="w-8 h-8 text-red-500 shrink-0" /> Family Emergency Profile
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1.5 max-w-2xl font-light leading-relaxed">
              Maintain emergency contacts, medical records, blood group information, senior citizen details, and disability information for your household.
            </p>
          </div>
          
          <div className="flex items-center flex-wrap gap-3.5">
            {/* Quick Toggle Live vs Demo */}
            <div className="flex items-center bg-white/5 border border-white/10 px-4 py-2 rounded-2xl backdrop-blur-md">
              <div className="text-right mr-3">
                <span className="block text-[8px] text-white/40 uppercase tracking-widest font-extrabold">Data Source</span>
                <span className={`text-xs font-bold ${isDemoMode ? 'text-[#ff9933]' : 'text-[#10b981]'}`}>
                  {isDemoMode ? 'Simulated Mehra Family' : 'Live Census Registry'}
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={isDemoMode}
                  onChange={(e) => handleDemoModeToggle(e.target.checked)}
                  className="sr-only peer" 
                />
                <div className="w-9 h-5 bg-slate-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#ff9933]" />
              </label>
            </div>

            {/* Quick Actions Header Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={triggerSos}
                disabled={sosTriggered}
                className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-1.5 animate-bounce"
              >
                <ShieldAlert className="w-4 h-4 shrink-0" />
                {sosTriggered ? 'SOS Sent!' : 'SOS Alert'}
              </button>

              <button
                onClick={() => handleStartExport('pdf')}
                disabled={exporting}
                className="bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                Download Card
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8 flex flex-col gap-6">

        {/* Toast Messages */}
        {toastMessage && (
          <div className="bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-300 text-xs p-4 rounded-2xl border border-red-200 dark:border-red-800/40 flex items-start justify-between gap-2.5 shadow-md animate-fade-in z-50">
            <div className="flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-red-600 dark:text-red-400" />
              <span className="font-semibold">{toastMessage}</span>
            </div>
            <button onClick={() => setToastMessage('')} className="text-slate-400 hover:text-slate-650 dark:hover:text-slate-200 cursor-pointer">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {isDemoMode && (
          <div className="bg-amber-50 dark:bg-amber-950/20 text-amber-900 dark:text-amber-300 text-xs p-4 rounded-2xl border border-amber-200 dark:border-amber-800/40 flex items-start gap-2.5 shadow-sm">
            <Info className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
            <div>
              <p className="font-bold">Simulated Emergency Demonstration</p>
              <p className="text-amber-700 dark:text-amber-400/80 mt-0.5">Showing mock family data (Head: Mohit, Seniors: Rajesh & Savitri) to showcase health profiles, care diaries, and disability details. Toggle off simulation above to read your actual live census registries.</p>
            </div>
          </div>
        )}

        {exporting && (
          <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-slate-200 p-4 rounded-2xl shadow-sm animate-fade-in">
            <div className="flex justify-between text-xs font-bold mb-1">
              <span>Generating Family Emergency ID Report ({exportFormat?.toUpperCase()})...</span>
              <span>{exportProgress}%</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
              <div className="bg-red-600 h-full transition-all duration-150" style={{ width: `${exportProgress}%` }} />
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════
            SECTION 2: EMERGENCY OVERVIEW
        ══════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Family Members', value: stats.members, color: 'text-slate-800 dark:text-white', labelColor: 'text-slate-400', desc: 'Household count' },
              { label: 'Emergency Contacts', value: stats.contactsCount, color: 'text-red-600 dark:text-red-400', labelColor: 'text-red-500', desc: 'Active contacts log' },
              { label: 'Medical Completed', value: `${stats.medicalProgress}%`, color: 'text-green-600 dark:text-green-400', labelColor: 'text-green-500', desc: 'Health profiles linked' },
              { label: 'Blood Groups Linked', value: `${stats.bloodGroupsCount}/${stats.members}`, color: 'text-[#ff9933]', labelColor: 'text-orange-500', desc: 'Group cards logged' }
            ].map((card, i) => (
              <div key={i} className="bg-white dark:bg-[#09172a] border border-slate-200 dark:border-white/10 rounded-2xl p-4 shadow-sm">
                <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">{card.label}</span>
                <span className={`text-2xl font-extrabold block ${card.color}`}>{card.value}</span>
                <span className="text-[9px] text-slate-400 block mt-1">{card.desc}</span>
              </div>
            ))}
          </div>

          <div className="md:col-span-4 bg-white dark:bg-[#09172a] border border-slate-200 dark:border-white/10 rounded-2xl p-4 shadow-sm flex items-center justify-between gap-4">
            <div>
              <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Emergency Readiness</span>
              <h3 className="text-sm font-bold text-[#0b2447] dark:text-white mt-0.5">Household Safety Status</h3>
              <p className="text-[10px] text-slate-400 mt-1 leading-snug">Emergency details are successfully synced and verified.</p>
            </div>
            
            <div className="relative shrink-0 w-16 h-16 flex items-center justify-center">
              <svg width="64" height="64" className="rotate-[-90deg]">
                <circle cx="32" cy="32" r="25" fill="none" stroke="#e2e8f0" strokeWidth="5" />
                <circle cx="32" cy="32" r="25" fill="none" stroke="#ef4444" strokeWidth="5" strokeDasharray="157.08" strokeDashoffset={157.08 - (stats.readinessScore / 100) * 157.08} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xs font-bold text-[#0b2447] dark:text-white">{stats.readinessScore}%</span>
                <span className="text-[6px] text-slate-400 font-extrabold uppercase">Ready</span>
              </div>
            </div>
          </div>
        </div>

        {/* main layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          <div className="lg:col-span-8 flex flex-col gap-6">

            {/* SECTION 3: EMERGENCY CONTACTS PANEL */}
            <div className="bg-white dark:bg-[#09172a] border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-sm">
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-white/5 pb-4 mb-4">
                <div>
                  <h2 className="font-extrabold text-base text-[#0b2447] dark:text-white uppercase tracking-wider flex items-center gap-2">
                    <Phone className="w-5 h-5 text-red-500" /> Emergency Contacts Registry
                  </h2>
                  <p className="text-[10px] text-slate-400 mt-0.5">Quick access lists to call or edit core contacts</p>
                </div>
                <button
                  onClick={openAddContactModal}
                  className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-100 text-xs font-bold px-3.5 py-1.5 rounded-xl cursor-pointer flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Contact
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {contacts.filter(c => c.isPrimary || c.isSecondary).map((c) => (
                  <div 
                    key={c.id} 
                    className={`border p-4 rounded-2xl relative bg-slate-50 dark:bg-[#0d1e36] text-slate-800 dark:text-white ${
                      c.isPrimary ? 'border-red-350 dark:border-red-900/50' : 'border-slate-200 dark:border-white/10'
                    }`}
                  >
                    <span className={`absolute right-3 top-3 text-[8px] font-bold uppercase px-2 py-0.5 rounded ${
                      c.isPrimary ? 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400' : 'bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400'
                    }`}>
                      {c.isPrimary ? 'Primary SOS Contact' : 'Secondary Contact'}
                    </span>

                    <span className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest">{c.relationship}</span>
                    <h3 className="font-extrabold text-sm text-[#0b2447] dark:text-white mt-0.5">{c.name}</h3>
                    
                    <div className="mt-3 text-[10px] text-slate-400 flex flex-col gap-0.5">
                      <div><strong className="font-semibold text-slate-700 dark:text-slate-300">Call: </strong>{c.phone}</div>
                      {c.altPhone && <div><strong className="font-semibold text-slate-700 dark:text-slate-300">Alt: </strong>{c.altPhone}</div>}
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-200/40 dark:border-white/5 flex gap-2">
                      <button
                        onClick={() => simulateCall(c.name, c.phone)}
                        className="flex-1 text-[10px] font-bold py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1"
                      >
                        <Phone className="w-3 h-3" /> Call Now
                      </button>
                      <button
                        onClick={() => openEditContactModal(c)}
                        className="p-1.5 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-300 hover:text-[#0b2447] dark:hover:text-[#ff9933] rounded-lg transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteContact(c.id)}
                        className="p-1.5 border border-slate-200 dark:border-white/10 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 border-t border-slate-100 dark:border-white/5 pt-4">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Additional Contacts Support</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  {contacts.filter(c => c.isAdditional).map((c) => (
                    <div key={c.id} className="border border-slate-200 dark:border-white/10 p-3.5 rounded-xl bg-slate-50/50 dark:bg-[#0d1e36]/40 text-slate-800 dark:text-white flex flex-col justify-between">
                      <div>
                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{c.relationship}</span>
                        <h4 className="font-bold text-xs text-[#0b2447] dark:text-white truncate">{c.name}</h4>
                        <p className="text-[9px] text-slate-400 dark:text-slate-300 mt-1 font-mono">{c.phone}</p>
                      </div>

                      <div className="mt-3.5 flex gap-1.5 justify-end">
                        <button
                          onClick={() => simulateCall(c.name, c.phone)}
                          className="flex-1 text-[9px] font-bold py-1 bg-[#0b2447] hover:bg-opacity-95 text-white dark:bg-[#ff9933] rounded-md transition-colors cursor-pointer flex items-center justify-center gap-0.5"
                        >
                          <Phone className="w-2.5 h-2.5" /> Call
                        </button>
                        <button
                          onClick={() => openEditContactModal(c)}
                          className="p-1 text-slate-400 hover:text-slate-850 dark:hover:text-white border border-slate-200 dark:border-white/10 rounded-md cursor-pointer"
                        >
                          <Edit2 className="w-2.5 h-2.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteContact(c.id)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded-md cursor-pointer"
                        >
                          <Trash2 className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* SECTION 4: MEDICAL INFORMATION */}
            <div className="bg-white dark:bg-[#09172a] border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-sm">
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-white/5 pb-4 mb-4">
                <div>
                  <h3 className="font-extrabold text-sm text-[#0b2447] dark:text-white uppercase tracking-wider flex items-center gap-2">
                    <Activity className="w-5 h-5 text-red-500" /> Family Medical Registry
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">Chronic medical records and individual medical diagnostics</p>
                </div>
                <button
                  onClick={() => setIsEditingMedical(!isEditingMedical)}
                  className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[#0b2447] dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 text-xs font-bold px-3 py-1 rounded-xl cursor-pointer flex items-center gap-1 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" /> {isEditingMedical ? 'Save Summary' : 'Edit Summary'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-50 dark:bg-[#0d1e36] p-4 rounded-2xl border border-slate-100 dark:border-white/5 text-slate-800 dark:text-white">
                  <span className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest">General Household Summary</span>
                  {isEditingMedical ? (
                    <div className="flex flex-col gap-2 mt-2">
                      <input
                        type="text"
                        value={medicalDetails.conditions}
                        onChange={(e) => setMedicalDetails(prev => ({ ...prev, conditions: e.target.value }))}
                        className="bg-white dark:bg-[#09172a] text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 outline-none"
                        placeholder="Existing Conditions"
                      />
                      <input
                        type="text"
                        value={medicalDetails.allergies}
                        onChange={(e) => setMedicalDetails(prev => ({ ...prev, allergies: e.target.value }))}
                        className="bg-white dark:bg-[#09172a] text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 outline-none"
                        placeholder="Allergies"
                      />
                    </div>
                  ) : (
                    <div className="mt-2.5 text-[10px] text-slate-700 dark:text-slate-300 flex flex-col gap-1.5">
                      <div><strong className="font-semibold text-slate-800 dark:text-white">Conditions: </strong>{medicalDetails.conditions}</div>
                      <div><strong className="font-semibold text-slate-800 dark:text-white">Allergies: </strong>{medicalDetails.allergies}</div>
                    </div>
                  )}
                </div>

                <div className="bg-slate-50 dark:bg-[#0d1e36] p-4 rounded-2xl border border-slate-100 dark:border-white/5 text-slate-800 dark:text-white">
                  <span className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest">Medications & Support Pouch</span>
                  {isEditingMedical ? (
                    <div className="flex flex-col gap-2 mt-2">
                      <input
                        type="text"
                        value={medicalDetails.medications}
                        onChange={(e) => setMedicalDetails(prev => ({ ...prev, medications: e.target.value }))}
                        className="bg-white dark:bg-[#09172a] text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 outline-none"
                        placeholder="Medications"
                      />
                      <input
                        type="text"
                        value={medicalDetails.notes}
                        onChange={(e) => setMedicalDetails(prev => ({ ...prev, notes: e.target.value }))}
                        className="bg-white dark:bg-[#09172a] text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 outline-none"
                        placeholder="Critical Notes"
                      />
                    </div>
                  ) : (
                    <div className="mt-2.5 text-[10px] text-slate-700 dark:text-slate-300 flex flex-col gap-1.5">
                      <div><strong className="font-semibold text-slate-800 dark:text-white">Daily Meds: </strong>{medicalDetails.medications}</div>
                      <div><strong className="font-semibold text-slate-800 dark:text-white">Care Notes: </strong>{medicalDetails.notes}</div>
                    </div>
                  )}
                </div>
              </div>

              <div className="border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden mb-6">
                <span className="block text-[9px] font-bold bg-slate-50 dark:bg-[#0d1e36] px-4 py-2 border-b border-slate-200 dark:border-white/5 text-slate-400 uppercase tracking-wider">Individual Medical Records</span>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[11px]">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-white/5 text-slate-400 font-semibold uppercase text-[9px] bg-slate-50/50 dark:bg-[#0d1e36]/50">
                        <th className="py-2 px-4">Member Name</th>
                        <th className="py-2 px-4">Risk Level</th>
                        <th className="py-2 px-4">Medical Record Details</th>
                        <th className="py-2 px-4 text-right">Care Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-slate-700 dark:text-slate-300">
                      {activeMembers.map((m, i) => {
                        const risk = calculateAge(m.dob) >= 60 || m.disabled ? 'Moderate Risk' : 'Low Risk';
                        return (
                          <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-white/2">
                            <td className="py-2.5 px-4 font-bold text-[#0b2447] dark:text-white">
                              {m.fullName}
                              <span className="block text-[8px] text-slate-400 font-normal">{m.relationship}</span>
                            </td>
                            <td className="py-2.5 px-4">
                              <span className={`px-2 py-0.5 rounded text-[8px] font-bold ${
                                risk === 'Moderate Risk' ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/20' : 'bg-green-50 text-green-700 dark:bg-green-950/20'
                              }`}>
                                {risk}
                              </span>
                            </td>
                            <td className="py-2.5 px-4 max-w-[200px] truncate">{m.emergencyMed || 'No serious history'}</td>
                            <td className="py-2.5 px-4 text-right font-medium">
                              <span className={m.disabled || calculateAge(m.dob) >= 60 ? 'text-[#ff9933]' : 'text-slate-400'}>
                                {m.disabled || calculateAge(m.dob) >= 60 ? 'Medication Active' : 'Normal'}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="border border-slate-200 dark:border-white/10 p-4 rounded-2xl bg-slate-50 dark:bg-[#0d1e36] text-slate-800 dark:text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-red-100 dark:bg-red-950/20 text-red-600 rounded-xl flex items-center justify-center shrink-0">
                    <Landmark className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Preferred ICU Hospital</span>
                    <h4 className="font-extrabold text-sm text-[#0b2447] dark:text-white">Apollo Hospital</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#ff9933]" /> Sarita Vihar, Mathura Road, New Delhi - 110076
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <div className="text-right">
                    <span className="text-[9px] font-bold text-slate-400 block uppercase">Bed Availability</span>
                    <span className="text-xs font-bold text-green-600 flex items-center justify-end gap-1">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> 5 ICU Beds
                    </span>
                  </div>
                  <button
                    onClick={() => simulateCall('Apollo ICU Desk', '+91 11 2692 5801')}
                    className="bg-[#0b2447] hover:bg-opacity-95 text-white dark:bg-[#ff9933] text-[10px] font-bold px-3.5 py-2 rounded-xl cursor-pointer"
                  >
                    Hospital Helpline
                  </button>
                </div>
              </div>
            </div>

            {/* SECTION 5: SENIOR CITIZEN INFORMATION */}
            <div className="bg-white dark:bg-[#09172a] border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-sm">
              <div className="border-b border-slate-100 dark:border-white/5 pb-3.5 mb-4 flex justify-between items-center">
                <div>
                  <h3 className="font-extrabold text-sm text-[#0b2447] dark:text-white uppercase tracking-wider flex items-center gap-2">
                    <Users className="w-5 h-5 text-red-500" /> Senior Citizen Safety logs
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">Medical registers and elder support checklists</p>
                </div>
                <div className="text-right">
                  <span className="text-[9px] font-bold text-[#ff9933] uppercase bg-[#ff9933]/15 border border-[#ff9933]/25 px-2.5 py-0.5 rounded-full">
                    {seniors.length} Elder Members Logged
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {seniors.length > 0 ? (
                  seniors.map((s, idx) => (
                    <div key={idx} className="border border-slate-200 dark:border-white/10 p-4 rounded-2xl bg-slate-50 dark:bg-[#0d1e36] text-slate-800 dark:text-white flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-200 flex items-center justify-center text-xs font-bold font-mono">
                              {s.fullName[0]}
                            </div>
                            <div>
                              <h4 className="font-bold text-xs text-[#0b2447] dark:text-white leading-tight">{s.fullName}</h4>
                              <span className="text-[9px] text-[#ff9933] font-medium">{s.relationship} · Age {calculateAge(s.dob)}</span>
                            </div>
                          </div>
                          <span className="text-[8px] font-bold uppercase px-2 py-0.5 bg-red-50 text-red-700 rounded-full dark:bg-red-950/20 dark:text-red-400">
                            Elder Care Card
                          </span>
                        </div>

                        <div className="mt-3.5 bg-white dark:bg-[#09172a] p-2.5 rounded-xl text-[9px] text-slate-400 flex flex-col gap-1">
                          <div><strong className="text-slate-700 dark:text-slate-200">Conditions: </strong>{s.emergencyMed || 'Normal geriatric observations'}</div>
                          <div><strong className="text-slate-700 dark:text-slate-200">Emergency Care: </strong>{s.careNeeded || 'Requires routine daily checkups'}</div>
                        </div>
                      </div>

                      <button
                        onClick={() => setToastMessage(`Pushed daily insulin log update checklist for ${s.fullName}.`)}
                        className="w-full mt-4 text-[9px] font-bold py-1.5 bg-[#0b2447] text-white hover:bg-opacity-95 dark:bg-[#ff9933] rounded-lg text-center cursor-pointer"
                      >
                        Push Daily Medical Log
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="md:col-span-2 text-center py-6">
                    <p className="text-xs text-slate-400">No senior citizens registered in this family structure.</p>
                  </div>
                )}
              </div>

              <div className="mt-5 bg-slate-50 dark:bg-[#0d1e36] p-4 rounded-2xl flex flex-wrap gap-4 items-center justify-between text-[11px] border border-slate-100 dark:border-white/5">
                <span className="font-bold text-slate-400 uppercase tracking-widest text-[9px]"> Elder Care Badges</span>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-800 dark:bg-amber-950/20 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40 rounded-lg font-semibold">
                    ♿ Wheelchair Required (Rajesh)
                  </span>
                  <span className="px-2.5 py-1 bg-blue-100 text-blue-800 dark:bg-blue-950/20 dark:text-blue-400 border border-blue-200 dark:border-blue-800/40 rounded-lg font-semibold">
                    🏠 Home Care Assistant visits weekly
                  </span>
                  <span className="px-2.5 py-1 bg-green-100 text-green-800 dark:bg-green-950/20 dark:text-green-400 border border-green-200 dark:border-green-800/40 rounded-lg font-semibold">
                    📅 Next ICU Visit: June 15, 2026
                  </span>
                </div>
              </div>
            </div>

            {/* SECTION 6: DISABILITY INFORMATION */}
            <div className="bg-white dark:bg-[#09172a] border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-sm">
              <div className="border-b border-slate-100 dark:border-white/5 pb-3.5 mb-4">
                <h3 className="font-extrabold text-sm text-[#0b2447] dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <Landmark className="w-5 h-5 text-red-500" /> Disability Support Registry
                </h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Accessibility features and registered disability pension logs</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {disabledMembers.length > 0 ? (
                  disabledMembers.map((m, idx) => (
                    <div key={idx} className="border border-slate-200 dark:border-white/10 p-4 rounded-2xl bg-slate-50 dark:bg-[#0d1e36] text-slate-800 dark:text-white flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-2 mb-2">
                          <div>
                            <h4 className="font-bold text-xs text-[#0b2447] dark:text-white leading-tight">{m.fullName}</h4>
                            <span className="text-[9px] text-[#ff9933] font-medium">{m.relationship}</span>
                          </div>
                          <span className="text-[8px] font-bold uppercase px-2.5 py-0.5 bg-red-100 text-red-800 rounded-full dark:bg-red-950/20 dark:text-red-400">
                            Disability {m.disabilityRatio} Ratio
                          </span>
                        </div>

                        <div className="bg-white dark:bg-[#09172a] p-3 rounded-xl text-[10px] mt-2 flex flex-col gap-1 text-slate-400">
                          <div><strong className="text-slate-700 dark:text-slate-300">Category: </strong>{m.disabilityType}</div>
                          <div><strong className="text-slate-700 dark:text-slate-300">Nav Aid: </strong>{m.supportNeeded || 'No specialized device mapped'}</div>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-200/40 dark:border-white/5 flex gap-2">
                        <button
                          onClick={() => navigate('/benefits-eligibility')}
                          className="flex-1 text-[9px] font-bold py-1.5 bg-[#0b2447] hover:bg-opacity-90 text-white dark:bg-[#ff9933] rounded-lg text-center cursor-pointer"
                        >
                          Check Pension Scheme
                        </button>
                        <button
                          onClick={() => setToastMessage('Opening assistive device subsidy page...')}
                          className="flex-1 text-[9px] font-bold py-1.5 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg text-center cursor-pointer transition-colors"
                        >
                          Assistive Devices
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="md:col-span-2 text-center py-6">
                    <p className="text-xs text-slate-400">No disability certifications logged inside this household.</p>
                  </div>
                )}
              </div>
            </div>

            {/* SECTION 7: BLOOD GROUP RECORDS */}
            <div className="bg-white dark:bg-[#09172a] border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-white/5 pb-4 mb-4">
                <div>
                  <h3 className="font-extrabold text-sm text-[#0b2447] dark:text-white uppercase tracking-wider flex items-center gap-2">
                    <Activity className="w-5 h-5 text-red-500" /> Blood Group Directory
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">Search household blood categories and monitor distribution analytics</p>
                </div>
                
                <div className="relative max-w-md w-full md:w-60">
                  <input
                    type="text"
                    placeholder="Search by name or group (e.g., O+)..."
                    value={bloodSearch}
                    onChange={(e) => setBloodSearch(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#0d1e36] text-[10px] px-3 py-1.5 pl-8 rounded-lg border border-slate-200 dark:border-white/10 outline-none focus:border-[#ff9933] dark:text-white"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {filteredBloodRegistry.length > 0 ? (
                  filteredBloodRegistry.map((m, i) => (
                    <div key={i} className="border border-slate-200 dark:border-white/10 p-3 rounded-xl bg-slate-50 dark:bg-[#0d1e36] text-slate-800 dark:text-white flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-xs text-[#0b2447] dark:text-white leading-tight truncate max-w-[80px]">{m.fullName}</h4>
                        <span className="text-[8px] text-slate-400">{m.relationship}</span>
                      </div>
                      
                      <span className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-950/30 text-red-600 dark:text-red-400 flex items-center justify-center text-xs font-extrabold border border-red-200 dark:border-red-900/40">
                        {m.bloodGroup}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="col-span-4 text-center py-6">
                    <p className="text-xs text-slate-400">No match found.</p>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-5 border-t border-slate-100 dark:border-white/5 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Blood Distribution Metrics</span>
                  <div className="flex flex-col gap-2">
                    {Object.entries(bloodBreakdown).map(([group, count]) => {
                      const percentage = stats.members > 0 ? Math.round((count / stats.members) * 100) : 0;
                      return (
                        <div key={group} className="text-[10px] flex items-center justify-between">
                          <span className="font-semibold text-slate-700 dark:text-slate-300 w-10">{group}:</span>
                          <div className="flex-1 bg-slate-100 dark:bg-[#0d1e36] h-2.5 rounded-full overflow-hidden mx-3 border border-slate-200/50 dark:border-white/5">
                            <div className="bg-red-500 h-full transition-all" style={{ width: `${percentage}%` }} />
                          </div>
                          <span className="text-slate-400 w-8 text-right font-mono">{count} ({percentage}%)</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-2xl p-4 flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] font-bold text-red-600 uppercase tracking-widest flex items-center gap-1.5">
                      <ShieldAlert className="w-3.5 h-3.5" /> Rare Blood Alert Warning
                    </span>
                    <p className="text-[10px] text-red-700 dark:text-red-300/80 leading-relaxed mt-2">
                      Savitri Mehra has A+ blood. High priority alerts are configured. Direct compatibility is mapped to Apollo Blood Bank.
                    </p>
                  </div>

                  <button
                    onClick={() => setToastMessage('Locating nearby A+ blood donors from the social registry database...')}
                    className="w-full mt-3.5 bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold py-1.5 rounded-lg text-center cursor-pointer"
                  >
                    Locate Nearby Blood Banks
                  </button>
                </div>
              </div>
            </div>

          </div>

          <div className="lg:col-span-4 flex flex-col gap-6">

            {/* SECTION 10: EMERGENCY ACTION CENTER */}
            <div className="bg-white dark:bg-[#09172a] border border-slate-200 dark:border-white/10 rounded-3xl p-5 shadow-sm text-center">
              <h3 className="font-extrabold text-xs text-red-600 dark:text-red-500 uppercase tracking-widest mb-4">
                Emergency Action Center
              </h3>
              
              <div className="flex flex-col gap-2.5">
                <button
                  onClick={triggerSos}
                  className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wide"
                >
                  <ShieldAlert className="w-4.5 h-4.5 animate-pulse" /> Trigger GPS SOS
                </button>

                <button
                  onClick={() => simulateCall('National Helpline', '112')}
                  className="w-full py-2.5 bg-[#0b2447] text-white hover:bg-opacity-95 dark:bg-[#ff9933] font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4 shrink-0" /> Call National Helpline (112)
                </button>

                <button
                  onClick={() => handleStartExport('print')}
                  className="w-full py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4 text-[#ff9933] shrink-0" /> Print Emergency Records
                </button>
              </div>
            </div>

            {/* SECTION 12: AI EMERGENCY ADVISOR */}
            <div className="bg-white dark:bg-[#09172a] border border-slate-200 dark:border-white/10 rounded-3xl p-5 shadow-sm flex flex-col justify-between min-h-[300px]">
              <div>
                <div className="flex items-center gap-2 border-b border-slate-100 dark:border-white/5 pb-3">
                  <div className="w-8 h-8 rounded-lg bg-[#0b2447]/10 flex items-center justify-center">
                    <Sparkles className="w-4.5 h-4.5 text-red-500" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-xs text-[#0b2447] dark:text-white uppercase">AI Emergency Advisor</h3>
                    <span className="text-[8px] text-red-500 font-bold uppercase tracking-wider">Safety Protocols Active</span>
                  </div>
                </div>

                <div className="mt-3 flex flex-col gap-2 max-h-44 overflow-y-auto pr-1">
                  <div className="bg-slate-50 dark:bg-[#0d1e36] text-[10px] p-2.5 rounded-xl border border-slate-100 text-slate-800 dark:text-white">
                    <p className="font-semibold text-red-500">Preparedness Recommendations:</p>
                    <ul className="list-disc pl-3 mt-1 space-y-1 text-slate-400 leading-snug">
                      <li>Rajesh Mehra (Age 72) has Diabetes. Glucose tablets should be mapped in the emergency kit.</li>
                      <li>Savitri Mehra has registered visual disability. Place home safety signage.</li>
                      <li>Emergency offline profile is ready. Download it to avoid connectivity blocks.</li>
                    </ul>
                  </div>

                  <div className="flex flex-col gap-2 mt-2">
                    {chatLog.map((chat, idx) => (
                      <div key={idx} className={`p-2 rounded-xl text-[10px] leading-snug ${
                        chat.role === 'user'
                          ? 'bg-[#0b2447]/5 text-slate-800 self-end max-w-[85%]'
                          : 'bg-red-50/50 text-[#0b2447] dark:bg-white/5 dark:text-slate-200 self-start max-w-[85%]'
                      }`}>
                        {chat.text}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <form onSubmit={handleChatSend} className="mt-4 flex gap-1.5">
                <input
                  type="text"
                  placeholder="Ask about asthma, insulin log..."
                  value={advisorInput}
                  onChange={(e) => setAdvisorInput(e.target.value)}
                  className="flex-1 bg-slate-50 dark:bg-[#0d1e36] text-[10px] text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 px-2.5 py-2 rounded-xl border border-slate-200 focus:outline-none"
                />
                <button
                  type="submit"
                  className="bg-[#0b2447] text-white hover:bg-opacity-90 dark:bg-[#ff9933] px-3.5 py-2 rounded-xl text-[10px] font-bold cursor-pointer"
                >
                  Ask
                </button>
              </form>
            </div>

            {/* SECTION 9: FAMILY SAFETY INSIGHTS */}
            <div className="bg-white dark:bg-[#09172a] border border-slate-200 dark:border-white/10 rounded-3xl p-5 shadow-sm">
              <h3 className="font-extrabold text-xs text-[#0b2447] dark:text-white uppercase tracking-wider mb-3">
                Family Safety Insights
              </h3>

              <div className="flex flex-col gap-3">
                {[
                  { icon: ShieldAlert, color: 'text-red-500', title: 'High Priority Alert', desc: 'Two senior citizens require regular health monitoring.' },
                  { icon: AlertTriangle, color: 'text-amber-500', title: 'Medical Support Alert', desc: 'One family member has a chronic medical condition (Asthma).' },
                  { icon: CheckCircle, color: 'text-green-500', title: 'Registry Success', desc: 'All blood group records and emergency contacts are successfully updated.' }
                ].map((insight, i) => {
                  const Icon = insight.icon;
                  return (
                    <div key={i} className="border border-slate-200 dark:border-white/10 p-3 rounded-xl bg-slate-50 dark:bg-[#0d1e36] text-slate-800 dark:text-white flex items-start gap-2">
                      <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${insight.color}`} />
                      <div>
                        <span className="font-bold text-[10px] text-[#0b2447] dark:text-white block leading-tight">{insight.title}</span>
                        <p className="text-[9px] text-slate-400 mt-0.5 leading-snug">{insight.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SECTION 8: EMERGENCY DOCUMENT VAULT */}
            <div className="bg-white dark:bg-[#09172a] border border-slate-200 dark:border-white/10 rounded-3xl p-5 shadow-sm">
              <h3 className="font-extrabold text-xs text-[#0b2447] dark:text-white uppercase tracking-wider mb-3">
                Emergency Document Vault
              </h3>

              <div className="flex flex-col gap-2.5">
                {documents.map((doc) => (
                  <div key={doc.id} className="p-3 bg-slate-50 dark:bg-[#0d1e36] border border-slate-200 dark:border-white/10 rounded-xl flex flex-col gap-2 text-slate-800 dark:text-white">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <span className="block font-bold text-[10px] text-[#0b2447] dark:text-white leading-tight">{doc.name}</span>
                        <span className="block text-[8px] text-slate-400">{doc.type} · {doc.size}</span>
                      </div>
                      <span className={`text-[8px] font-bold uppercase px-2 py-0.5 rounded ${
                        doc.status === 'Verified' ? 'bg-green-50 text-green-700 dark:bg-green-950/20' : 'bg-amber-50 text-amber-700 dark:bg-amber-950/20'
                      }`}>
                        {doc.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2 mt-1 pt-1.5 border-t border-slate-200/40 text-[8px] text-slate-400">
                      <span>Updated: {doc.date}</span>
                      <button
                        onClick={() => triggerDocUpload(doc.id)}
                        className="bg-[#0b2447] hover:bg-opacity-95 text-white dark:bg-[#ff9933] px-2.5 py-1 rounded text-[8px] font-extrabold cursor-pointer"
                      >
                        Upload New
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 11: EMERGENCY PROFILE REPORT */}
            <div className="bg-white dark:bg-[#09172a] border border-slate-200 dark:border-white/10 rounded-3xl p-5 shadow-sm">
              <h3 className="font-extrabold text-xs text-[#0b2447] dark:text-white uppercase tracking-wider mb-2">
                Emergency Profile Report
              </h3>
              <p className="text-[10px] text-slate-400 leading-snug">Generate a downloadable verification summary of your medical status</p>
              
              <div className="grid grid-cols-2 gap-2 mt-3.5">
                <button
                  onClick={() => handleStartExport('pdf')}
                  className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10 text-[10px] font-bold py-2 rounded-xl text-center cursor-pointer text-slate-700 dark:text-slate-200 transition-colors"
                >
                  Download Report
                </button>
                <button
                  onClick={() => setToastMessage('Printing card summary...')}
                  className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10 text-[10px] font-bold py-2 rounded-xl text-center cursor-pointer text-slate-700 dark:text-slate-200 transition-colors"
                >
                  Print Report
                </button>
              </div>
            </div>

            {/* SECTION 12: HELP & SUPPORT */}
            <div className="bg-white dark:bg-[#09172a] border border-slate-200 dark:border-white/10 rounded-3xl p-5 shadow-sm">
              <h3 className="font-extrabold text-xs text-[#0b2447] dark:text-white uppercase tracking-wider mb-3">
                Help & Support Center
              </h3>

              <div className="flex flex-col gap-2">
                {[
                  { q: 'How to update blood group?', a: 'Go back to Citizen Dashboard, click Edit Profile, and navigate to Step 9 (Health details) to register correct blood group verification cards.' },
                  { q: 'Can emergency services read this?', a: 'Yes. In emergency events, certified medical agencies and hospital dispatchers can access verified records offline via sovereign card verification tags.' },
                  { q: 'What details are exported in the PDF?', a: 'The exported report bundles all contacts, critical medications, blood group allocations, and assistive disability care requirements.' }
                ].map((faq, i) => (
                  <div key={i} className="border-b border-slate-100 dark:border-white/5 pb-2 last:border-b-0">
                    <button
                      onClick={() => setOpenedFaq(openedFaq === i ? null : i)}
                      className="w-full flex justify-between items-center text-[10px] font-bold text-[#0b2447] dark:text-white text-left cursor-pointer"
                    >
                      <span>{faq.q}</span>
                      <ChevronRight className={`w-3.5 h-3.5 text-slate-400 transition-transform ${openedFaq === i ? 'rotate-90' : ''}`} />
                    </button>
                    {openedFaq === i && (
                      <p className="text-[9px] text-slate-400 mt-1 leading-snug">{faq.a}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* CONTACT ADD/EDIT MODAL */}
      {contactModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#09172a] rounded-3xl border border-slate-200 dark:border-white/10 max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setContactModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-650 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-extrabold text-base text-[#0b2447] dark:text-white uppercase mb-4">
              {editingContact ? 'Edit Emergency Contact' : 'Add Emergency Contact'}
            </h3>

            <form onSubmit={handleSaveContact} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1 text-[11px]">
                <label className="font-bold text-[#0b2447] dark:text-slate-400">Full Name</label>
                <input
                  type="text"
                  required
                  value={contactForm.name}
                  onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                  className="bg-slate-50 dark:bg-[#0d1e36] text-slate-800 dark:text-white border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 outline-none"
                  placeholder="e.g. Rakesh Mehra"
                />
              </div>

              <div className="flex flex-col gap-1 text-[11px]">
                <label className="font-bold text-[#0b2447] dark:text-slate-400">Relationship</label>
                <input
                  type="text"
                  required
                  value={contactForm.relationship}
                  onChange={(e) => setContactForm(prev => ({ ...prev, relationship: e.target.value }))}
                  className="bg-slate-50 dark:bg-[#0d1e36] text-slate-800 dark:text-white border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 outline-none"
                  placeholder="e.g. Father"
                />
              </div>

              <div className="flex flex-col gap-1 text-[11px]">
                <label className="font-bold text-[#0b2447] dark:text-slate-400">Mobile Number</label>
                <input
                  type="text"
                  required
                  value={contactForm.phone}
                  onChange={(e) => setContactForm(prev => ({ ...prev, phone: e.target.value }))}
                  className="bg-slate-50 dark:bg-[#0d1e36] text-slate-800 dark:text-white border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 outline-none"
                  placeholder="e.g. +91 98765 43210"
                />
              </div>

              <div className="flex flex-col gap-1 text-[11px]">
                <label className="font-bold text-[#0b2447] dark:text-slate-400">Alternate Number (Optional)</label>
                <input
                  type="text"
                  value={contactForm.altPhone}
                  onChange={(e) => setContactForm(prev => ({ ...prev, altPhone: e.target.value }))}
                  className="bg-slate-50 dark:bg-[#0d1e36] text-slate-800 dark:text-white border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 outline-none"
                  placeholder="e.g. +91 98765 43211"
                />
              </div>

              <div className="flex flex-col gap-1 text-[11px]">
                <label className="font-bold text-[#0b2447] dark:text-slate-400">Priority Level</label>
                <select
                  value={contactForm.type}
                  onChange={(e) => setContactForm(prev => ({ ...prev, type: e.target.value }))}
                  className="bg-slate-50 dark:bg-[#0d1e36] text-slate-800 dark:text-white border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 outline-none"
                >
                  <option value="Primary">Primary SOS Contact</option>
                  <option value="Secondary">Secondary SOS Contact</option>
                  <option value="Additional">Additional Support Contact</option>
                </select>
              </div>

              <div className="flex gap-3.5 mt-2">
                <button
                  type="button"
                  onClick={() => setContactModalOpen(false)}
                  className="flex-1 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-300 py-2 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#0b2447] text-white hover:bg-opacity-95 dark:bg-[#ff9933] py-2 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Save Contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default FamilyEmergencyProfile;
