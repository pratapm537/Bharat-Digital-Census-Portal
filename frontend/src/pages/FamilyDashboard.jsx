import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { censusAPI } from '../services/api.js';
import {
  Users, UserPlus, Trash2, ArrowLeft, GraduationCap, Briefcase,
  Calendar, Shield, Sparkles, CheckCircle, AlertTriangle, AlertCircle, Info,
  Heart, Bot, Send, Search, Filter, ArrowUpDown, ChevronDown, Check, X,
  FileText, Upload, Plus, Download, Edit, Phone, Eye, Share2, ZoomIn, ZoomOut,
  Maximize2, Mic, Languages, Award, BarChart2
} from 'lucide-react';

/* Qualification list aligned with Wizard.jsx */
const QUALIFICATION_OPTIONS = [
  'Illiterate', 'Literate', 'Primary School', 'Middle School',
  'High School (10th)', 'Senior Secondary (12th)', 'Diploma',
  'Graduate / Bachelor', 'Post Graduate / Master', 'Doctorate (PhD)'
];

const RELATIONSHIP_OPTIONS = [
  'Spouse', 'Son', 'Daughter', 'Father', 'Mother', 'Sibling', 'Grandchild', 'Grandfather', 'Grandmother', 'Other'
];

// Helper to calculate age
const calculateAge = (dobString) => {
  if (!dobString) return 'N/A';
  const dob = new Date(dobString);
  const diff = Date.now() - dob.getTime();
  const ageDate = new Date(diff);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

// SVG Profile Avatars generator helper
const renderAvatarSVG = (relationship, gender, size = 48) => {
  let mainColor = '#0b2447';
  let secondaryColor = '#ff9933';
  
  if (relationship === 'Head' || relationship === 'Citizen') {
    mainColor = 'linear-gradient(135deg, #0b2447, #1f3e6d)';
    secondaryColor = '#ff9933';
  } else if (relationship === 'Spouse') {
    mainColor = 'linear-gradient(135deg, #ec4899, #f43f5e)';
    secondaryColor = '#fbcfe8';
  } else if (relationship === 'Son' || relationship === 'Daughter' || relationship === 'Grandchild') {
    mainColor = 'linear-gradient(135deg, #10b981, #059669)';
    secondaryColor = '#a7f3d0';
  } else if (relationship === 'Father' || relationship === 'Mother') {
    mainColor = 'linear-gradient(135deg, #3b82f6, #2563eb)';
    secondaryColor = '#bfdbfe';
  } else if (relationship === 'Grandfather' || relationship === 'Grandmother') {
    mainColor = 'linear-gradient(135deg, #f59e0b, #d97706)';
    secondaryColor = '#fef3c7';
  }

  // Fallback inline avatar styling
  return (
    <div 
      className="rounded-full flex items-center justify-center text-white font-extrabold shadow-sm transition-all"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        background: mainColor,
        border: `2.5px solid ${secondaryColor}`
      }}
    >
      {relationship ? relationship[0].toUpperCase() : 'C'}
    </div>
  );
};

const FamilyDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // App states
  const [draft, setDraft] = useState(null);
  const [family, setFamily] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Dashboard UI states
  const [activeTab, setActiveTab] = useState('tree'); // 'tree' | 'map' | 'directory'
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // Form input states
  const [newMember, setNewMember] = useState({
    fullName: '',
    dob: '',
    gender: '',
    relationship: '',
    aadhaar: '',
    qualification: '',
    occupation: ''
  });
  
  // PDF Verification proof states
  const [ageProof, setAgeProof] = useState(null);
  const [addressProof, setAddressProof] = useState(null);
  const [qualificationProof, setQualificationProof] = useState(null);

  // Zoom control for family tree visualization
  const [zoomLevel, setZoomLevel] = useState(1);
  const [collapsedBranches, setCollapsedBranches] = useState(new Set());
  const [hoveredNodeId, setHoveredNodeId] = useState(null);

  // AI Family Assistant states
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMsgs, setChatMsgs] = useState([
    { from: 'bot', text: 'Namaste! 🙏 I am your Digital Family Register Assistant. I can help you manage your household members, check verification status, or guide you on uploading documents. How can I assist you today?' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLanguage, setChatLanguage] = useState('en');
  const [isListening, setIsListening] = useState(false);
  const chatEndRef = useRef(null);

  // Directory filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [relationFilter, setRelationFilter] = useState('all');
  const [ageSort, setAgeSort] = useState('none'); // 'none' | 'asc' | 'desc'

  // Household Details states
  const [isEditHouseholdOpen, setIsEditHouseholdOpen] = useState(false);
  const [householdForm, setHouseholdForm] = useState({
    type: 'Owned House',
    rooms: '4 Rooms',
    electricity: 'Electricity Available',
    water: 'Water Connection Available',
    internet: 'Internet Available',
    lpg: 'LPG Connection Available',
    vehicles: '2 Vehicles'
  });

  // Demo Mock Data
  const demoHead = {
    fullName: 'Mohit Pratap Mehra',
    dob: '1991-04-12',
    gender: 'Male',
    relationship: 'Head',
    aadhaar: '548796541258',
    qualification: 'Post Graduate / Master',
    occupation: 'IT Consultant',
    status: 'Verified'
  };

  const demoFamily = [
    { id: 'm1', fullName: 'Rajesh Mehra', dob: '1954-08-15', gender: 'Male', relationship: 'Grandfather', aadhaar: '887766554433', qualification: 'Graduate / Bachelor', occupation: 'Retired Government Officer', status: 'Verified', ageProofPath: '#', addressProofPath: '#', qualificationProofPath: '#' },
    { id: 'm2', fullName: 'Savitri Mehra', dob: '1958-02-10', gender: 'Female', relationship: 'Grandmother', aadhaar: '776655443322', qualification: 'Senior Secondary (12th)', occupation: 'Homemaker', status: 'Verified', ageProofPath: '#', addressProofPath: '#' },
    { id: 'm3', fullName: 'Anil Mehra', dob: '1971-11-20', gender: 'Male', relationship: 'Father', aadhaar: '665544332211', qualification: 'Graduate / Bachelor', occupation: 'Business Owner', status: 'Verified', ageProofPath: '#', addressProofPath: '#', qualificationProofPath: '#' },
    { id: 'm4', fullName: 'Sunita Mehra', dob: '1974-06-05', gender: 'Female', relationship: 'Mother', aadhaar: '554433221100', qualification: 'Post Graduate / Master', occupation: 'Government Teacher', status: 'Verified', ageProofPath: '#', addressProofPath: '#', qualificationProofPath: '#' },
    { id: 'm5', fullName: 'Priya Mehra', dob: '1994-09-25', gender: 'Female', relationship: 'Spouse', aadhaar: '443322110099', qualification: 'Post Graduate / Master', occupation: 'Doctor (MD)', status: 'Verified', ageProofPath: '#', addressProofPath: '#', qualificationProofPath: '#' },
    { id: 'm6', fullName: 'Aarav Mehra', dob: '2018-05-18', gender: 'Male', relationship: 'Son', aadhaar: '332211009988', qualification: 'Primary School', occupation: 'Student', status: 'Verified', ageProofPath: '#', addressProofPath: '#' },
    { id: 'm7', fullName: 'Diya Mehra', dob: '2021-01-30', gender: 'Female', relationship: 'Daughter', aadhaar: '221100998877', qualification: 'Primary School', occupation: 'Student', status: 'Pending Verification', ageProofPath: '#', addressProofPath: '#' }
  ];

  // AI responses dictionary in multiple languages
  const AI_RESPONSES = {
    en: {
      'How do I add a spouse?': 'To add a spouse, click the "Add Family Member" button in the Quick Actions, or click the dotted "+ Add Spouse" placeholder node in the genealogy tree. Fill in their details (Full Name, Date of Birth, Aadhaar) and upload the PDF verification proofs.',
      'How do I update my child\'s information?': 'To edit details, switch to the "Member Directory" tab, locate the child, and click the "Edit" action. Alternatively, click the child node directly on the Family Tree, and click "Edit Details" in the slide-out panel.',
      'Which documents are missing?': 'Based on your current profile, all core documents for the Family Head and dependents Rajesh, Anil, Sunita, and Aarav have been successfully verified. However, Voter ID status for Priya Mehra is currently marked as "Pending Review". Please check the "Document Status" dashboard panel for quick links.',
      'How do I change family head?': 'According to national census regulations, the head of household is designated during initial registration. To transfer the Family Head status, you must submit a signed affidavit and address proof verifying the new head, then coordinate an official verification visit via the Support centre.',
      'default': 'I have received your query. You can manage all family structures, census forms, and uploaded documents in this digital profile. If you have a specific operational question, you can chat with me or contact your local census registrar.'
    },
    hi: {
      'How do I add a spouse?': 'जीवनसाथी (Spouse) को जोड़ने के लिए, त्वरित क्रियाओं (Quick Actions) में "सदस्य जोड़ें" पर क्लिक करें, या परिवार वृक्ष (Family Tree) में "+ जीवनसाथी जोड़ें" कार्ड पर क्लिक करें। उनके विवरण भरें और आवश्यक दस्तावेज़ अपलोड करें।',
      'How do I update my child\'s information?': 'बच्चे की जानकारी अपडेट करने के लिए, "सदस्य निर्देशिका" (Directory) पर जाएं, बच्चे का नाम ढूंढें और "संपादित करें" (Edit) पर क्लिक करें। आप परिवार वृक्ष में बच्चे के कार्ड पर क्लिक करके भी विवरण बदल सकते हैं।',
      'Which documents are missing?': 'आपके वर्तमान रिकॉर्ड के अनुसार, सदस्य दीया मेहरा के लिए "योग्यता प्रमाण पत्र" (Qualification Proof) सत्यापन के लिए लंबित है। कृपया दस्तावेज़ स्थिति पैनल (Document Status Panel) में जाकर लंबित फ़ाइलें पुनः अपलोड करें।',
      'How do I change family head?': 'परिवार के मुखिया को बदलने के लिए आपको सरकारी नियमों के अनुसार एक शपथ पत्र (Affidavit) जमा करना होगा। कृपया सहायता केंद्र के माध्यम से आवेदन करें।',
      'default': 'नमस्ते! मुझे आपका प्रश्न प्राप्त हुआ। डिजिटल परिवार पोर्टल में आप सदस्य जोड़ने, हटाने या उनके दस्तावेजों को सत्यापित करने की जानकारी पा सकते हैं।'
    },
    ta: {
      'How do I add a spouse?': 'துணையைச் சேர்க்க, "Add Family Member" பொத்தானைக் கிளிக் செய்யவும், அல்லது குடும்ப மரத்தில் உள்ள "+ Add Spouse" கார்டைக் கிளிக் செய்யவும்.',
      'How do I update my child\'s information?': 'குழந்தையின் தகவலை மாற்ற, உறுப்பினர் அடைவு (Directory) பகுதிக்குச் சென்று திருத்தவும்.',
      'default': 'வணக்கம்! உங்களது கேள்வி எனக்குப் புரிந்தது. கணக்கெடுப்புத் தரவு மற்றும் குடும்ப உறுப்பினர்களைப் பற்றி ஏதேனும் உதவி தேவைப்படின் கேட்கலாம்.'
    }
  };

  const loadFamilyData = async () => {
    try {
      const response = await censusAPI.getDraft();
      setDraft(response.data.draft);
      
      const dbFamily = response.data.family || [];
      setFamily(dbFamily);

      // Dynamic toggle: if database registry has no family members added, open Demo Mode automatically
      if (dbFamily.length === 0) {
        setIsDemoMode(true);
      }
    } catch (err) {
      setError('Failed to load household details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFamilyData();
  }, []);

  // Auto-scroll chat window
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMsgs]);

  const activeFamily = useMemo(() => {
    return isDemoMode ? demoFamily : family;
  }, [isDemoMode, family]);

  const activeHead = useMemo(() => {
    if (isDemoMode) return demoHead;
    return {
      fullName: draft?.personal_fullName || user?.fullName || 'Family Head',
      dob: draft?.personal_dob || '',
      gender: draft?.personal_gender || 'Male',
      relationship: 'Head',
      aadhaar: draft?.identity_aadhaar || '',
      qualification: draft?.education_highestLevel || 'Graduate',
      occupation: draft?.employment_occupation || 'Self-Employed',
      status: draft?.status === 'APPROVED' ? 'Verified' : 'Pending'
    };
  }, [isDemoMode, draft, user]);

  // Aggregate metrics dynamically
  const metrics = useMemo(() => {
    const total = activeFamily.length + 1; // dependents + head
    let adults = 0;
    let children = 0;
    let seniors = 0;

    // Evaluate head
    const headAge = calculateAge(activeHead.dob);
    if (headAge !== 'N/A') {
      if (headAge < 18) children++;
      else if (headAge <= 60) adults++;
      else seniors++;
    }

    // Evaluate dependents
    activeFamily.forEach(m => {
      const age = calculateAge(m.dob);
      if (age !== 'N/A') {
        if (age < 18) children++;
        else if (age <= 60) adults++;
        else seniors++;
      }
    });

    // Literacy Rate
    const totalMembers = activeFamily.length + 1;
    const literateCount = (activeHead.qualification && activeHead.qualification !== 'Illiterate' ? 1 : 0) +
      activeFamily.filter(m => m.qualification && m.qualification !== 'Illiterate').length;
    const literacyRate = Math.round((literateCount / totalMembers) * 100);

    return { total, adults, children, seniors, literacyRate };
  }, [activeFamily, activeHead]);

  // Family Tree Hierarchical Construction
  const treeLevels = useMemo(() => {
    const levels = {
      grandparents: [],
      parents: [],
      headAndSpouse: [activeHead],
      children: [],
      others: []
    };

    activeFamily.forEach(m => {
      const rel = m.relationship?.toLowerCase();
      if (rel === 'grandfather' || rel === 'grandmother') {
        levels.grandparents.push(m);
      } else if (rel === 'father' || rel === 'mother') {
        levels.parents.push(m);
      } else if (rel === 'spouse') {
        levels.headAndSpouse.push(m);
      } else if (rel === 'son' || rel === 'daughter' || rel === 'grandchild' || rel === 'grandson' || rel === 'granddaughter') {
        levels.children.push(m);
      } else {
        levels.others.push(m);
      }
    });

    return levels;
  }, [activeFamily, activeHead]);

  // Filter and Sort Directory list
  const filteredDirectory = useMemo(() => {
    let result = [activeHead, ...activeFamily];

    // Search query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(m => 
        m.fullName.toLowerCase().includes(q) || 
        m.relationship.toLowerCase().includes(q) ||
        (m.aadhaar && m.aadhaar.includes(q))
      );
    }

    // Relationship filter
    if (relationFilter !== 'all') {
      result = result.filter(m => m.relationship?.toLowerCase() === relationFilter.toLowerCase());
    }

    // Sort by age
    if (ageSort === 'asc') {
      result.sort((a, b) => {
        const ageA = calculateAge(a.dob) === 'N/A' ? 0 : calculateAge(a.dob);
        const ageB = calculateAge(b.dob) === 'N/A' ? 0 : calculateAge(b.dob);
        return ageA - ageB;
      });
    } else if (ageSort === 'desc') {
      result.sort((a, b) => {
        const ageA = calculateAge(a.dob) === 'N/A' ? 0 : calculateAge(a.dob);
        const ageB = calculateAge(b.dob) === 'N/A' ? 0 : calculateAge(b.dob);
        return ageB - ageA;
      });
    }

    return result;
  }, [activeHead, activeFamily, searchQuery, relationFilter, ageSort]);

  // Form input actions
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMember(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAadhaarChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 12);
    setNewMember(prev => ({
      ...prev,
      aadhaar: val
    }));
  };

  const openAddModalWithRelation = (relation) => {
    setNewMember({
      fullName: '',
      dob: '',
      gender: relation === 'Spouse' || relation === 'Mother' || relation === 'Grandmother' || relation === 'Daughter' ? 'Female' : 'Male',
      relationship: relation,
      aadhaar: '',
      qualification: '',
      occupation: ''
    });
    setIsAddModalOpen(true);
  };

  // Submit Family Member Registration
  const handleAddMemberSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validations
    if (!newMember.fullName.trim() || newMember.fullName.trim().length < 3) {
      setError('Please enter a valid full legal name.');
      return;
    }
    if (!newMember.dob) {
      setError('Date of birth is required.');
      return;
    }
    if (!newMember.gender) {
      setError('Please select gender.');
      return;
    }
    if (!newMember.relationship) {
      setError('Please specify relationship.');
      return;
    }
    if (newMember.aadhaar && newMember.aadhaar.length !== 12) {
      setError('Aadhaar number must be exactly 12 numerical digits.');
      return;
    }

    // PDF proofs mandatory in live database mode
    if (!isDemoMode && (!ageProof || !addressProof || !qualificationProof)) {
      setError('All three verification documents (Age, Address, and Qualification proofs) are required in PDF format.');
      return;
    }

    if (isDemoMode) {
      // Mock additions locally
      const mockId = 'm_' + Date.now();
      const mockObj = {
        id: mockId,
        fullName: newMember.fullName,
        dob: newMember.dob,
        gender: newMember.gender,
        relationship: newMember.relationship,
        aadhaar: newMember.aadhaar,
        qualification: newMember.qualification,
        occupation: newMember.occupation,
        status: 'Pending Verification',
        ageProofPath: '#',
        addressProofPath: '#'
      };
      demoFamily.push(mockObj);
      setSuccess('Family member successfully added to Demo Profile!');
      setIsAddModalOpen(false);
      return;
    }

    // Call Real API
    const uploadData = new FormData();
    uploadData.append('fullName', newMember.fullName);
    uploadData.append('dob', newMember.dob);
    uploadData.append('gender', newMember.gender);
    uploadData.append('relationship', newMember.relationship);
    uploadData.append('aadhaar', newMember.aadhaar);
    uploadData.append('qualification', newMember.qualification);
    uploadData.append('occupation', newMember.occupation);
    uploadData.append('ageProof', ageProof);
    uploadData.append('addressProof', addressProof);
    uploadData.append('qualificationProof', qualificationProof);

    setSaving(true);
    try {
      const response = await censusAPI.addFamilyMember(uploadData);
      setSuccess('Family member registered in household successfully!');
      setFamily(prev => [...prev, response.data.member]);
      
      // Reset State
      setIsAddModalOpen(false);
      setAgeProof(null);
      setAddressProof(null);
      setQualificationProof(null);
      loadFamilyData();
    } catch (err) {
      setError(err.response?.data?.message || 'Error occurred while adding family member.');
    } finally {
      setSaving(false);
    }
  };

  // Delete Member Action
  const handleDeleteMember = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove ${name} from your household registry?`)) {
      return;
    }

    setError('');
    setSuccess('');

    if (isDemoMode) {
      const index = demoFamily.findIndex(m => m.id === id);
      if (index !== -1) {
        demoFamily.splice(index, 1);
        setSuccess(`${name} removed successfully from Demo Profile.`);
        setSelectedMember(null);
      }
      return;
    }

    try {
      await censusAPI.deleteFamilyMember(id);
      setSuccess(`${name} removed successfully.`);
      setFamily(prev => prev.filter(m => m.id !== id));
      setSelectedMember(null);
      loadFamilyData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove family member.');
    }
  };

  const handleDownloadDoc = async (memberId, docType, memberName) => {
    if (isDemoMode) {
      alert(`Demo Mode: Downloading simulated ${docType} proof PDF for ${memberName}`);
      return;
    }

    setError('');
    try {
      await censusAPI.downloadFamilyDocument(memberId, docType, memberName);
    } catch (err) {
      setError('Failed to download verification document.');
    }
  };

  // Voice Chat Recognition Simulation
  const startVoiceInput = () => {
    if (isListening) return;
    setIsListening(true);
    setTimeout(() => {
      const questions = ['Which documents are missing?', 'How do I add a spouse?', 'How do I change family head?'];
      const randomQ = questions[Math.floor(Math.random() * questions.length)];
      setChatInput(randomQ);
      setIsListening(false);
    }, 2200);
  };

  // Chat message submission
  const handleSendChat = (text) => {
    const queryText = text || chatInput.trim();
    if (!queryText) return;

    setChatMsgs(prev => [...prev, { from: 'user', text: queryText }]);
    setChatInput('');

    // Locate response matching question & language
    const langResponses = AI_RESPONSES[chatLanguage] || AI_RESPONSES.en;
    let reply = langResponses[queryText] || langResponses['default'];

    setTimeout(() => {
      setChatMsgs(prev => [...prev, { from: 'bot', text: reply }]);
    }, 700);
  };

  // Switch demo data to live data
  const handleToggleMode = (checked) => {
    setIsDemoMode(checked);
    setSelectedMember(null);
    setSuccess(checked ? 'Switched to genealogy demo preview mode' : 'Switched to live database registry');
  };

  const completionPct = draft ? Math.min(((parseInt(draft.step, 10) - 1) / 10) * 100, 100) : 100;
  const systemStatus = draft?.status || 'DRAFT';

  // Toggle Branch Collapse/Expand
  const toggleBranch = (branch) => {
    setCollapsedBranches(prev => {
      const next = new Set(prev);
      if (next.has(branch)) {
        next.delete(branch);
      } else {
        next.add(branch);
      }
      return next;
    });
  };

  return (
    <div className="flex-grow w-full bg-[#f8faff] min-h-screen pb-16 relative">
      
      {/* ══════════════════════════════════════════════════
          HERO BANNER SECTION
      ══════════════════════════════════════════════════ */}
      <div className="bg-[#0b2447] text-white py-10 px-6 sm:px-12 relative overflow-hidden shadow-lg border-b border-white/5">
        <div className="absolute right-0 top-0 w-96 h-96 bg-[#ff9933]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/2 bottom-0 w-80 h-80 bg-[#138808]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 pointer-events-none opacity-5" style={{
          backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }} />
        
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div>
            <button 
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-1.5 text-xs text-slate-350 hover:text-white mb-3 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
            </button>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] uppercase font-bold text-white/50 tracking-widest bg-white/10 px-3 py-0.5 rounded-full">
                Registry ID: CEN-2026-{String(draft?.id || 1).padStart(6, '0')}
              </span>
              <span className="text-[10px] uppercase font-bold text-[#ff9933] bg-[#ff9933]/15 border border-[#ff9933]/25 px-3 py-0.5 rounded-full">
                National Citizen Database
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-2 flex items-center gap-2.5">
              <Users className="w-8 h-8 text-[#ff9933]" /> Digital Family Profile & Genealogy Map
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl font-light">
              Manage complete household relations, visualize lineage trees, audit identification verification states, and download official family certifications.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/family-analytics')}
              className="flex items-center gap-2 bg-[#ff9933] hover:bg-orange-500 text-white font-bold text-xs px-4 py-2.5 rounded-2xl transition-all shadow-md active:scale-95 cursor-pointer border border-transparent"
            >
              <BarChart2 className="w-4 h-4" /> Family Analytics
            </button>

            {/* Live vs Demo Toggle Switch */}
            <div className="flex items-center bg-white/5 border border-white/10 px-4 py-2.5 rounded-2xl backdrop-blur-md">
              <div className="text-right mr-3">
                <span className="block text-[9px] text-white/40 uppercase tracking-widest font-extrabold">Data Source</span>
                <span className={`text-xs font-bold ${isDemoMode ? 'text-[#ff9933]' : 'text-[#10b981]'}`}>
                  {isDemoMode ? 'Genealogy Demo Mode' : 'Live DB Registry'}
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={isDemoMode}
                  onChange={(e) => handleToggleMode(e.target.checked)}
                  className="sr-only peer" 
                />
                <div className="w-9 h-5 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#ff9933]" />
              </label>
            </div>

            <div className="flex items-center gap-2.5 bg-white/10 px-4 py-2.5 rounded-2xl border border-white/10 backdrop-blur-md">
              <Shield className="w-5 h-5 text-[#ff9933]" />
              <div className="text-left">
                <span className="block text-[8px] text-slate-350 uppercase tracking-widest font-bold">Verification Status</span>
                <span className={`text-xs font-bold ${systemStatus === 'APPROVED' ? 'text-[#10b981]' : 'text-amber-500'}`}>
                  {systemStatus === 'APPROVED' ? 'Approved & Certified' : 'Pending Verification'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8">
        
        {/* Dynamic Alerts */}
        {error && (
          <div className="bg-red-50 text-red-750 text-xs p-4 rounded-2xl border border-red-200 mb-6 flex items-start gap-2.5 shadow-sm animate-fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-650" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="bg-green-50 text-green-700 text-xs p-4 rounded-2xl border border-green-200 mb-6 flex items-start gap-2.5 shadow-sm animate-fade-in">
            <CheckCircle className="w-4 h-4 shrink-0 mt-0.5 text-green-600" />
            <span>{success}</span>
          </div>
        )}

        {isDemoMode && (
          <div className="bg-amber-50 text-amber-900 text-xs p-4 rounded-2xl border border-amber-250 mb-6 flex items-start gap-2.5 shadow-sm">
            <Info className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
            <div>
              <p className="font-bold">Genealogy Demo Mode Active</p>
              <p className="text-amber-700 mt-0.5">Showing mock family data (Grandparents ➔ Parents ➔ Citizen ➔ Children) to demonstrate visualization capabilities. Turn off the toggle in the banner to view your live registry.</p>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════
            SECTION 1: FAMILY OVERVIEW METRIC TILES
        ══════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          
          {/* Family Head Info Card */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="shrink-0">
              {renderAvatarSVG('Head', activeHead.gender, 52)}
            </div>
            <div className="min-w-0">
              <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Family Head</span>
              <h3 className="text-sm font-extrabold text-[#0b2447] truncate">{activeHead.fullName}</h3>
              <p className="text-[10px] text-slate-500 mt-0.5">Age: {calculateAge(activeHead.dob)} yrs · {activeHead.gender}</p>
            </div>
          </div>

          {/* Family ID government records */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
            <div className="min-w-0">
              <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Family Tracking ID</span>
              <h3 className="text-sm font-mono font-extrabold text-[#0b2447] tracking-wide mt-1">FAM-IND-2026-45879</h3>
              <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                <Check className="w-3.5 h-3.5 text-[#138808]" /> Linked to Census Portal
              </p>
            </div>
            <div className="w-10 h-10 bg-[#0b2447]/5 rounded-xl flex items-center justify-center text-[#0b2447] shrink-0">
              <Shield className="w-5 h-5" />
            </div>
          </div>

          {/* Total count breakdowns */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Household Size</span>
              <span className="text-xs font-extrabold text-[#0b2447] bg-[#0b2447]/5 px-2 py-0.5 rounded">
                {metrics.total} Members
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
              <div className="bg-blue-50/50 p-1.5 rounded-lg border border-blue-100/50">
                <span className="block font-bold text-blue-700">{metrics.adults}</span>
                <span className="text-[8px] text-slate-400 uppercase font-bold">Adults</span>
              </div>
              <div className="bg-green-50/50 p-1.5 rounded-lg border border-green-150/30">
                <span className="block font-bold text-green-700">{metrics.children}</span>
                <span className="text-[8px] text-slate-400 uppercase font-bold">Children</span>
              </div>
              <div className="bg-amber-50/50 p-1.5 rounded-lg border border-amber-150/30">
                <span className="block font-bold text-amber-700">{metrics.seniors}</span>
                <span className="text-[8px] text-slate-400 uppercase font-bold">Seniors</span>
              </div>
            </div>
          </div>

          {/* Household Census progress */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Household Status</span>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
                  <span className="text-xs font-bold text-[#10b981]">Active & Verified</span>
                </div>
              </div>
              <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                {Math.round(completionPct)}%
              </span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
              <div className="bg-[#10b981] h-full transition-all duration-500" style={{ width: `${completionPct}%` }} />
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════
            MAIN CONTENT AREA GRID
        ══════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT AREA: INTERACTIVE VISUAL PANELS (8 Columns) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* TAB SELECTOR */}
            <div className="bg-white p-2.5 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
              <div className="flex gap-2">
                {[
                  { id: 'tree', label: 'Genealogy Family Tree', icon: Users },
                  { id: 'map', label: 'Relationship mapping', icon: Heart },
                  { id: 'directory', label: 'Member Directory', icon: Filter }
                ].map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        activeTab === tab.id 
                          ? 'bg-[#0b2447] text-white shadow-sm' 
                          : 'text-[#0b2447]/65 hover:bg-slate-50 hover:text-[#0b2447]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {activeTab === 'tree' && (
                <div className="flex items-center gap-1.5 border border-slate-100 bg-slate-50/50 rounded-xl px-2 py-1">
                  <button 
                    onClick={() => setZoomLevel(prev => Math.max(0.6, prev - 0.1))} 
                    className="p-1 text-slate-500 hover:text-[#0b2447] hover:bg-white rounded-lg transition-colors cursor-pointer"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[10px] font-bold text-slate-400 font-mono w-8 text-center">{Math.round(zoomLevel * 100)}%</span>
                  <button 
                    onClick={() => setZoomLevel(prev => Math.min(1.4, prev + 0.1))} 
                    className="p-1 text-slate-500 hover:text-[#0b2447] hover:bg-white rounded-lg transition-colors cursor-pointer"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => setZoomLevel(1)} 
                    className="p-1 text-slate-500 hover:text-[#0b2447] hover:bg-white rounded-lg transition-colors cursor-pointer"
                    title="Reset Zoom"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* TAB CONTAINER SCREEN */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden min-h-[480px] flex flex-col relative bg-dot-pattern">
              
              {/* ──────────────────────────────────────────────────
                  TAB A: GENEALOGY FAMILY TREE
              ────────────────────────────────────────────────── */}
              {activeTab === 'tree' && (
                <div className="flex-grow flex flex-col p-6 overflow-auto">
                  <div className="flex items-center justify-between mb-4 border-b border-slate-150/70 pb-3">
                    <div>
                      <h4 className="font-extrabold text-sm text-[#0b2447]">Household Genealogy Hierarchy</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">Click relative node cards to view verification documents or modify profiles.</p>
                    </div>
                    <div className="flex gap-2 text-[10px]">
                      <span className="flex items-center gap-1 text-[#10b981] font-bold">
                        <span className="w-2 h-2 rounded-full bg-[#10b981]" /> Verified
                      </span>
                      <span className="flex items-center gap-1 text-amber-500 font-bold">
                        <span className="w-2 h-2 rounded-full bg-amber-500" /> Pending Review
                      </span>
                    </div>
                  </div>

                  {/* Render Visual Genealogy Graph */}
                  <div 
                    className="flex-grow flex flex-col items-center justify-center gap-12 transition-all duration-300 py-10 origin-center"
                    style={{ transform: `scale(${zoomLevel})` }}
                  >
                    
                    {/* LEVEL 1: GRANDPARENTS */}
                    {!collapsedBranches.has('grandparents') && (
                      <div className="flex justify-center gap-16 relative">
                        {treeLevels.grandparents.length > 0 ? (
                          treeLevels.grandparents.map(gp => (
                            <div 
                              key={gp.id || gp.fullName} 
                              className={`relative p-3.5 bg-white border rounded-2xl w-44 hover:shadow-md transition-all cursor-pointer ${
                                selectedMember?.fullName === gp.fullName ? 'border-[#ff9933] shadow-premium ring-2 ring-[#ff9933]/15' : 'border-slate-200'
                              }`}
                              onClick={() => setSelectedMember(gp)}
                            >
                              <div className="flex items-center gap-2.5">
                                {renderAvatarSVG(gp.relationship, gp.gender, 34)}
                                <div className="min-w-0">
                                  <h5 className="text-[11px] font-extrabold text-[#0b2447] truncate leading-tight">{gp.fullName}</h5>
                                  <span className="text-[8px] bg-slate-100 text-slate-500 font-bold px-1.5 py-0.5 rounded">{gp.relationship}</span>
                                </div>
                              </div>
                              <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[8px] text-slate-400 font-bold">
                                <span>Age: {calculateAge(gp.dob)}</span>
                                <span className={gp.status?.toLowerCase().includes('pending') ? 'text-amber-500' : 'text-[#10b981]'}>{gp.status || 'Verified'}</span>
                              </div>
                            </div>
                          ))
                        ) : (
                          // Placeholder dotted card in Live Mode
                          <div 
                            className="p-3.5 border-2 border-dashed border-slate-200 rounded-2xl w-44 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#ff9933] transition-colors"
                            onClick={() => openAddModalWithRelation('Grandfather')}
                          >
                            <Plus className="w-5 h-5 text-slate-400 mb-1" />
                            <span className="text-[10px] font-bold text-slate-400">Add Grandfather / Grandmother</span>
                          </div>
                        )}
                        {/* Connection Line */}
                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-0.5 h-8 bg-slate-200" />
                      </div>
                    )}

                    {/* LEVEL 2: PARENTS */}
                    <div className="flex justify-center gap-16 relative">
                      {treeLevels.parents.length > 0 ? (
                        treeLevels.parents.map(p => (
                          <div 
                            key={p.id || p.fullName} 
                            className={`relative p-3.5 bg-white border rounded-2xl w-44 hover:shadow-md transition-all cursor-pointer ${
                              selectedMember?.fullName === p.fullName ? 'border-[#ff9933] shadow-premium ring-2 ring-[#ff9933]/15' : 'border-slate-200'
                            }`}
                            onClick={() => setSelectedMember(p)}
                          >
                            <div className="flex items-center gap-2.5">
                              {renderAvatarSVG(p.relationship, p.gender, 34)}
                              <div className="min-w-0">
                                <h5 className="text-[11px] font-extrabold text-[#0b2447] truncate leading-tight">{p.fullName}</h5>
                                <span className="text-[8px] bg-slate-100 text-slate-500 font-bold px-1.5 py-0.5 rounded">{p.relationship}</span>
                              </div>
                            </div>
                            <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[8px] text-slate-400 font-bold">
                              <span>Age: {calculateAge(p.dob)}</span>
                              <span className={p.status?.toLowerCase().includes('pending') ? 'text-amber-500' : 'text-[#10b981]'}>{p.status || 'Verified'}</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div 
                          className="p-3.5 border-2 border-dashed border-slate-200 rounded-2xl w-44 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#ff9933] transition-colors"
                          onClick={() => openAddModalWithRelation('Father')}
                        >
                          <Plus className="w-5 h-5 text-slate-400 mb-1" />
                          <span className="text-[10px] font-bold text-slate-400">Add Father / Mother</span>
                        </div>
                      )}
                      {/* Connection Line */}
                      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-0.5 h-8 bg-slate-200" />
                    </div>

                    {/* LEVEL 3: CITIZEN & SPOUSE */}
                    <div className="flex justify-center gap-12 relative items-center">
                      
                      {/* Left: Citizen (Head of Family) */}
                      <div 
                        className={`relative p-4 bg-slate-50 border rounded-2xl w-48 hover:shadow-md transition-all cursor-pointer ${
                          selectedMember?.fullName === activeHead.fullName ? 'border-[#ff9933] ring-2 ring-[#ff9933]/15' : 'border-[#0b2447]'
                        }`}
                        onClick={() => setSelectedMember(activeHead)}
                      >
                        <div className="absolute -top-2 -left-2 bg-[#ff9933] text-white text-[7px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full">
                          Household Head
                        </div>
                        <div className="flex items-center gap-2.5">
                          {renderAvatarSVG('Head', activeHead.gender, 36)}
                          <div className="min-w-0">
                            <h5 className="text-[11px] font-extrabold text-[#0b2447] truncate leading-tight">{activeHead.fullName}</h5>
                            <span className="text-[8px] bg-slate-200 text-slate-650 font-bold px-1.5 py-0.5 rounded">Citizen (You)</span>
                          </div>
                        </div>
                        <div className="mt-2 pt-2 border-t border-slate-200 flex items-center justify-between text-[8px] text-slate-400 font-bold">
                          <span>Age: {calculateAge(activeHead.dob)}</span>
                          <span className="text-[#10b981]">Verified</span>
                        </div>
                      </div>

                      {/* Bridge connection between spouse */}
                      <div className="w-8 h-0.5 bg-slate-300" />

                      {/* Right: Spouse */}
                      {treeLevels.headAndSpouse.length > 1 ? (
                        treeLevels.headAndSpouse.slice(1).map(sp => (
                          <div 
                            key={sp.id || sp.fullName} 
                            className={`p-4 bg-white border rounded-2xl w-48 hover:shadow-md transition-all cursor-pointer ${
                              selectedMember?.fullName === sp.fullName ? 'border-[#ff9933] ring-2 ring-[#ff9933]/15' : 'border-slate-200'
                            }`}
                            onClick={() => setSelectedMember(sp)}
                          >
                            <div className="flex items-center gap-2.5">
                              {renderAvatarSVG('Spouse', sp.gender, 36)}
                              <div className="min-w-0">
                                <h5 className="text-[11px] font-extrabold text-[#0b2447] truncate leading-tight">{sp.fullName}</h5>
                                <span className="text-[8px] bg-pink-50 text-pink-650 font-bold px-1.5 py-0.5 rounded">{sp.relationship}</span>
                              </div>
                            </div>
                            <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[8px] text-slate-400 font-bold">
                              <span>Age: {calculateAge(sp.dob)}</span>
                              <span className={sp.status?.toLowerCase().includes('pending') ? 'text-amber-500' : 'text-[#10b981]'}>{sp.status || 'Verified'}</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div 
                          className="p-4 border-2 border-dashed border-slate-200 rounded-2xl w-48 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#ff9933] transition-colors"
                          onClick={() => openAddModalWithRelation('Spouse')}
                        >
                          <Plus className="w-5 h-5 text-slate-400 mb-1" />
                          <span className="text-[10px] font-bold text-slate-400">Add Spouse to Registry</span>
                        </div>
                      )}
                      {/* Connection Line Down to Children */}
                      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-0.5 h-8 bg-slate-200" />
                    </div>

                    {/* LEVEL 4: CHILDREN */}
                    <div className="flex justify-center gap-12 relative">
                      {treeLevels.children.length > 0 ? (
                        treeLevels.children.map(ch => (
                          <div 
                            key={ch.id || ch.fullName} 
                            className={`p-3.5 bg-white border rounded-2xl w-44 hover:shadow-md transition-all cursor-pointer ${
                              selectedMember?.fullName === ch.fullName ? 'border-[#ff9933] ring-2 ring-[#ff9933]/15' : 'border-slate-200'
                            }`}
                            onClick={() => setSelectedMember(ch)}
                          >
                            <div className="flex items-center gap-2.5">
                              {renderAvatarSVG(ch.relationship, ch.gender, 34)}
                              <div className="min-w-0">
                                <h5 className="text-[11px] font-extrabold text-[#0b2447] truncate leading-tight">{ch.fullName}</h5>
                                <span className="text-[8px] bg-green-50 text-green-700 font-bold px-1.5 py-0.5 rounded">{ch.relationship}</span>
                              </div>
                            </div>
                            <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[8px] text-slate-400 font-bold">
                              <span>Age: {calculateAge(ch.dob)}</span>
                              <span className={ch.status?.toLowerCase().includes('pending') ? 'text-amber-500' : 'text-[#10b981]'}>{ch.status || 'Verified'}</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div 
                          className="p-3.5 border-2 border-dashed border-slate-200 rounded-2xl w-44 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#ff9933] transition-colors"
                          onClick={() => openAddModalWithRelation('Son')}
                        >
                          <Plus className="w-5 h-5 text-slate-400 mb-1" />
                          <span className="text-[10px] font-bold text-slate-400">Add Child Node</span>
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              )}

              {/* ──────────────────────────────────────────────────
                  TAB B: RELATIONSHIP RADIAL MAPPING GRAPH
              ────────────────────────────────────────────────── */}
              {activeTab === 'map' && (
                <div className="flex-grow flex flex-col p-6 items-center justify-center">
                  <div className="w-full border-b border-slate-100 pb-3 mb-6">
                    <h4 className="font-extrabold text-sm text-[#0b2447] flex items-center gap-1.5">
                      <Heart className="w-4 h-4 text-[#ff9933]" /> Interactive Household Connections Network
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">Hover or click nodes to visualize animated relationship lines to the household head.</p>
                  </div>

                  {/* SVG Network Graph Center */}
                  <div className="relative w-[360px] h-[360px] flex items-center justify-center shrink-0">
                    <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                      <defs>
                        <radialGradient id="glow" cx="50%" cy="50%" r="50%">
                          <stop offset="0%" stopColor="#ff9933" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#ff9933" stopOpacity="0" />
                        </radialGradient>
                        <filter id="shadow-glow" x="-20%" y="-20%" width="140%" height="140%">
                          <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#ff9933" floodOpacity="0.5" />
                        </filter>
                      </defs>
                      
                      {/* Connection lines from center outwards */}
                      {activeFamily.map((m, idx) => {
                        const count = activeFamily.length;
                        const angle = (idx * 2 * Math.PI) / count;
                        const x2 = 180 + 130 * Math.cos(angle);
                        const y2 = 180 + 130 * Math.sin(angle);
                        const isHovered = hoveredNodeId === m.id;
                        
                        return (
                          <g key={m.id || idx}>
                            <line 
                              x1="180" 
                              y1="180" 
                              x2={x2} 
                              y2={y2} 
                              stroke={isHovered ? '#ff9933' : '#cbd5e1'} 
                              strokeWidth={isHovered ? '2.5' : '1.5'} 
                              strokeDasharray={isHovered ? '4,4' : 'none'}
                              className="transition-all"
                            />
                            {/* Energy pulsing animation */}
                            <circle cx={x2} cy={y2} r="3" fill="#ff9933">
                              <animate 
                                attributeName="cx" 
                                from="180" 
                                to={x2} 
                                dur="2s" 
                                repeatCount="indefinite" 
                              />
                              <animate 
                                attributeName="cy" 
                                from="180" 
                                to={y2} 
                                dur="2s" 
                                repeatCount="indefinite" 
                              />
                            </circle>
                          </g>
                        );
                      })}
                    </svg>

                    {/* Center Node: Citizen (You) */}
                    <div 
                      className="absolute w-20 h-20 bg-slate-50 border-3 border-[#0b2447] rounded-full flex flex-col items-center justify-center text-center shadow-lg hover:scale-105 transition-all z-20 cursor-pointer"
                      onClick={() => setSelectedMember(activeHead)}
                    >
                      {renderAvatarSVG('Head', activeHead.gender, 42)}
                      <span className="text-[8px] font-extrabold text-[#0b2447] uppercase mt-1 leading-none">Citizen</span>
                    </div>

                    {/* Orbiting Relative Nodes */}
                    {activeFamily.map((m, idx) => {
                      const count = activeFamily.length;
                      const angle = (idx * 2 * Math.PI) / count;
                      const leftPos = 180 - 24 + 130 * Math.cos(angle);
                      const topPos = 180 - 24 + 130 * Math.sin(angle);

                      return (
                        <div 
                          key={m.id || idx}
                          className="absolute w-12 h-12 flex flex-col items-center justify-center text-center z-15 group cursor-pointer transition-all hover:scale-115"
                          style={{ left: `${leftPos}px`, top: `${topPos}px` }}
                          onMouseEnter={() => setHoveredNodeId(m.id)}
                          onMouseLeave={() => setHoveredNodeId(null)}
                          onClick={() => setSelectedMember(m)}
                        >
                          {renderAvatarSVG(m.relationship, m.gender, 36)}
                          
                          {/* Floating node label */}
                          <div className="absolute -bottom-5 scale-0 group-hover:scale-100 transition-all bg-[#0b2447] text-white px-2 py-0.5 rounded text-[8px] font-bold whitespace-nowrap shadow z-30">
                            {m.fullName} ({m.relationship})
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ──────────────────────────────────────────────────
                  TAB C: SEARCHABLE MEMBER DIRECTORY
              ────────────────────────────────────────────────── */}
              {activeTab === 'directory' && (
                <div className="flex-grow flex flex-col p-6">
                  
                  {/* Filter panel */}
                  <div className="flex flex-col sm:flex-row gap-3 mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div className="flex-1 relative">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input 
                        type="text" 
                        placeholder="Search members by name, ID or Aadhaar..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs outline-none focus:border-[#0b2447] transition-all"
                      />
                    </div>
                    
                    <div className="flex gap-2 shrink-0">
                      {/* Filter by relationship */}
                      <div className="relative">
                        <select 
                          value={relationFilter}
                          onChange={(e) => setRelationFilter(e.target.value)}
                          className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-600 outline-none focus:border-[#0b2447] cursor-pointer appearance-none pr-8"
                        >
                          <option value="all">All Relationships</option>
                          {RELATIONSHIP_OPTIONS.map(rel => (
                            <option key={rel} value={rel}>{rel}</option>
                          ))}
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>

                      {/* Sort by age */}
                      <button 
                        onClick={() => setAgeSort(prev => prev === 'none' ? 'asc' : prev === 'asc' ? 'desc' : 'none')}
                        className="bg-white border border-slate-200 hover:bg-slate-50 transition-colors rounded-xl px-3 py-2 text-xs text-slate-600 outline-none flex items-center gap-1.5 cursor-pointer"
                      >
                        <ArrowUpDown className="w-3.5 h-3.5" />
                        Age: {ageSort === 'none' ? 'None' : ageSort === 'asc' ? 'Asc' : 'Desc'}
                      </button>
                    </div>
                  </div>

                  {/* Directory Table */}
                  <div className="overflow-x-auto border border-slate-100 rounded-xl">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          <th className="p-3">Member Details</th>
                          <th className="p-3">Relationship</th>
                          <th className="p-3">Age / Gender</th>
                          <th className="p-3">Aadhaar Verification</th>
                          <th className="p-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredDirectory.map((m, idx) => (
                          <tr key={m.id || idx} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                            <td className="p-3">
                              <div className="flex items-center gap-3">
                                {renderAvatarSVG(m.relationship, m.gender, 32)}
                                <div>
                                  <p className="font-extrabold text-[#0b2447]">{m.fullName}</p>
                                  <p className="text-[9px] text-slate-400">UID: FAM-0{idx + 1}</p>
                                </div>
                              </div>
                            </td>
                            <td className="p-3">
                              <span className="bg-slate-100 text-slate-650 font-bold px-2 py-0.5 rounded-full text-[9px] tracking-wide">
                                {m.relationship}
                              </span>
                            </td>
                            <td className="p-3 text-slate-500 font-semibold">
                              {calculateAge(m.dob)} yrs · {m.gender}
                            </td>
                            <td className="p-3">
                              <span className={`inline-flex items-center gap-1 text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                                m.status?.toLowerCase().includes('pending') 
                                  ? 'bg-amber-50 text-amber-600 border border-amber-100' 
                                  : 'bg-green-50 text-green-600 border border-green-100'
                              }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${m.status?.toLowerCase().includes('pending') ? 'bg-amber-500' : 'bg-green-500'}`} />
                                {m.status || 'Verified'}
                              </span>
                            </td>
                            <td className="p-3 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button 
                                  onClick={() => setSelectedMember(m)}
                                  className="p-1.5 text-slate-400 hover:text-[#0b2447] hover:bg-slate-150/40 rounded-lg transition-colors cursor-pointer"
                                  title="View Proofs"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                                {m.relationship !== 'Head' && (
                                  <button 
                                    onClick={() => handleDeleteMember(m.id, m.fullName)}
                                    className="p-1.5 text-slate-400 hover:text-red-650 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                    title="Delete Member"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                        {filteredDirectory.length === 0 && (
                          <tr>
                            <td colSpan="5" className="p-8 text-center text-slate-400 text-xs">
                              No family members match your current filters.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                </div>
              )}

            </div>

            {/* SECTION 7: DETAILED FAMILY DOCUMENT VERIFICATION STATE */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
              <h4 className="font-extrabold text-sm text-[#0b2447] mb-1">Household Document Verification Matrix</h4>
              <p className="text-[10px] text-slate-400 mb-4">Confirm verified identification papers upload statuses. All submitted digital document formats must be PDFs.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                {[
                  { key: 'aadhaar', name: 'Aadhaar Card', desc: 'UIDAI Identity Verification', status: 'Verified' },
                  { key: 'voter', name: 'Voter ID Card', desc: 'Electoral List Enrolment', status: 'Verified' },
                  { key: 'passport', name: 'Indian Passport', desc: 'Travel & Address Enclosures', status: 'Not Uploaded' },
                  { key: 'address', name: 'Address Proof', desc: 'Utility Bill / Rent Deed', status: 'Pending Review' }
                ].map(doc => (
                  <div key={doc.key} className="bg-slate-50/50 p-4 border border-slate-100 rounded-2xl flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <FileText className="w-4 h-4 text-[#0b2447]/60" />
                        <span className={`text-[8px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                          doc.status === 'Verified' ? 'bg-green-50 text-green-600' :
                          doc.status === 'Pending Review' ? 'bg-amber-50 text-amber-600' :
                          'bg-slate-100 text-slate-500'
                        }`}>
                          {doc.status}
                        </span>
                      </div>
                      <h5 className="font-bold text-xs text-[#0b2447] mt-3 leading-tight">{doc.name}</h5>
                      <p className="text-[9px] text-slate-400 mt-0.5">{doc.desc}</p>
                    </div>
                    
                    <div className="mt-4 pt-3 border-t border-slate-150/70 flex gap-2">
                      <button 
                        onClick={() => alert(`Simulated document viewer for: ${doc.name}`)}
                        className="flex-1 bg-white hover:bg-slate-100 text-[#0b2447] border border-slate-200 text-[9px] font-bold py-1 px-2 rounded-lg transition-colors cursor-pointer"
                      >
                        View
                      </button>
                      <button 
                        onClick={() => alert(`Trigger upload dialog for: ${doc.name}`)}
                        className="flex-1 bg-[#0b2447] hover:bg-[#1f3e6d] text-white text-[9px] font-bold py-1 px-2 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1"
                      >
                        <Upload className="w-2.5 h-2.5" /> Upload
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 8: CENSUS HOUSEHOLD STRUCTURE DETAILS */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <div>
                  <h4 className="font-extrabold text-sm text-[#0b2447]">Household & Property Specifications</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Specifications registered in Section 8 of the census documentation.</p>
                </div>
                <button 
                  onClick={() => setIsEditHouseholdOpen(true)}
                  className="bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl text-[10px] font-bold text-[#0b2447] flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Edit className="w-3 h-3" /> Edit Details
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: 'Residence Status', value: householdForm.type },
                  { label: 'Total Rooms', value: householdForm.rooms },
                  { label: 'Electrification', value: householdForm.electricity },
                  { label: 'Water Resource', value: householdForm.water },
                  { label: 'LPG Gas Cylinder', value: householdForm.lpg },
                  { label: 'Broadband Internet', value: householdForm.internet },
                  { label: 'Vehicles Registered', value: householdForm.vehicles }
                ].map((spec, i) => (
                  <div key={i} className="p-3 bg-slate-50/50 border border-slate-100 rounded-2xl">
                    <span className="text-[8px] text-slate-400 uppercase font-extrabold tracking-wider">{spec.label}</span>
                    <p className="text-xs font-extrabold text-[#0b2447] mt-1 truncate">{spec.value}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT AREA: TIMELINE, ANALYTICS & ASSISTANT (4 Columns) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* QUICK ACTIONS HUB */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
              <h4 className="font-extrabold text-sm text-[#0b2447] mb-4">Administrative Controls</h4>
              <div className="grid grid-cols-1 gap-2.5">
                <button 
                  onClick={() => openAddModalWithRelation('Spouse')}
                  className="flex items-center gap-3 p-3 bg-slate-50 hover:bg-[#ff9933]/5 border border-slate-100 hover:border-[#ff9933]/30 rounded-2xl text-left transition-all cursor-pointer group"
                >
                  <div className="w-9 h-9 rounded-xl bg-[#ff9933]/15 text-[#ff9933] flex items-center justify-center shrink-0">
                    <UserPlus className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-extrabold text-xs text-[#0b2447] group-hover:text-[#ff9933] transition-colors">Register New Dependent</h5>
                    <p className="text-[9px] text-slate-400 mt-0.5">Attach age, address & credentials proof PDFs.</p>
                  </div>
                </button>

                <button 
                  onClick={() => setActiveTab('tree')}
                  className="flex items-center gap-3 p-3 bg-slate-50 hover:bg-blue-50 border border-slate-100 hover:border-blue-200 rounded-2xl text-left transition-all cursor-pointer group"
                >
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Share2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-extrabold text-xs text-[#0b2447] group-hover:text-blue-700 transition-colors">Edit Genealogy Structure</h5>
                    <p className="text-[9px] text-slate-400 mt-0.5">Rearrange lineage mappings interactively.</p>
                  </div>
                </button>

                <button 
                  onClick={async () => {
                    try {
                      await censusAPI.downloadCertificate();
                    } catch (e) {
                      alert('Simulating PDF Registry Certificate Generator. Certificate successfully created.');
                    }
                  }}
                  className="flex items-center gap-3 p-3 bg-slate-50 hover:bg-green-50 border border-slate-100 hover:border-green-200 rounded-2xl text-left transition-all cursor-pointer group"
                >
                  <div className="w-9 h-9 rounded-xl bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-extrabold text-xs text-[#0b2447] group-hover:text-green-700 transition-colors">Generate Census Certificate</h5>
                    <p className="text-[9px] text-slate-400 mt-0.5">Download official government-stamped SVG/PDF.</p>
                  </div>
                </button>
              </div>
            </div>

            {/* SECTION 9: INTERACTIVE GRAPHICS & HOUSEHOLD DEMOGRAPHICS */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
              <h4 className="font-extrabold text-sm text-[#0b2447] mb-1">Household Demographics</h4>
              <p className="text-[10px] text-slate-400 mb-6">Interactive metrics analyzing registry profiles data.</p>
              
              <div className="space-y-6">
                
                {/* Age Distribution (SVG Ring Chart) */}
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Age Distributions</span>
                  <div className="flex items-center gap-5 mt-2">
                    <div className="relative shrink-0">
                      {/* Nested Progress Ring Representation */}
                      <svg width="60" height="60" className="-rotate-90">
                        <circle cx="30" cy="30" r="24" fill="none" stroke="#e2e8f0" strokeWidth="4" />
                        <circle 
                          cx="30" 
                          cy="30" 
                          r="24" 
                          fill="none" 
                          stroke="#3b82f6" 
                          strokeWidth="4" 
                          strokeDasharray="150" 
                          strokeDashoffset={150 - (metrics.adults / metrics.total) * 150} 
                          strokeLinecap="round"
                        />
                        <circle 
                          cx="30" 
                          cy="30" 
                          r="18" 
                          fill="none" 
                          stroke="#10b981" 
                          strokeWidth="4" 
                          strokeDasharray="113" 
                          strokeDashoffset={113 - (metrics.children / metrics.total) * 113} 
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                    
                    <div className="flex-grow space-y-1 text-[10px] font-bold text-slate-650">
                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#3b82f6]" /> Adults</span>
                        <span>{Math.round((metrics.adults / metrics.total) * 100)}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#10b981]" /> Children</span>
                        <span>{Math.round((metrics.children / metrics.total) * 100)}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" /> Seniors</span>
                        <span>{Math.round((metrics.seniors / metrics.total) * 100)}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Education Levels */}
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Literacy & Qualifications</span>
                  <div className="space-y-2 mt-2">
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center justify-between text-[11px] font-bold">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-[#ff9933]" />
                        <span className="text-slate-600">Total Literacy Rate</span>
                      </div>
                      <span className="text-[#138808]">{metrics.literacyRate}%</span>
                    </div>
                  </div>
                </div>

                {/* Occupation Distribution */}
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Employment Distribution</span>
                  <div className="mt-2 space-y-2">
                    {[
                      { label: 'Employed / Business', count: 3, color: '#3b82f6' },
                      { label: 'Students', count: 2, color: '#10b981' },
                      { label: 'Retired / Homemakers', count: 3, color: '#f59e0b' }
                    ].map((occ, idx) => (
                      <div key={idx} className="text-[10px]">
                        <div className="flex justify-between font-bold text-slate-600 mb-1">
                          <span>{occ.label}</span>
                          <span>{occ.count} Members</span>
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all duration-500" 
                            style={{ 
                              width: `${(occ.count / metrics.total) * 100}%`,
                              backgroundColor: occ.color 
                            }} 
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* SECTION 5: FAMILY RECENT CHANGES */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
              <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Last Sync Activity</span>
              <h5 className="font-extrabold text-xs text-[#0b2447] mt-1 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-[#10b981]" /> Updated 2 Days Ago
              </h5>
              <div className="mt-3 p-3 bg-slate-50 border border-slate-100 rounded-2xl text-[10px] text-slate-600 font-semibold flex justify-between items-center">
                <span>Recent Mod: Child added to household</span>
                <span className="text-[8px] bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded font-extrabold">Census Audited</span>
              </div>
            </div>

            {/* SECTION 6: CENSUS ACTIVITIES CHRONOLOGICAL TIMELINE */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
              <h4 className="font-extrabold text-sm text-[#0b2447] mb-4">Milestone Timeline</h4>
              
              <div className="relative pl-5 flex flex-col gap-0 border-l border-slate-100 ml-2 text-xs">
                {[
                  { date: 'Jan 12, 2026', title: 'Digital Family Profile Initialised' },
                  { date: 'Jan 13, 2026', title: 'Spouse Added to Registry' },
                  { date: 'Jan 14, 2026', title: 'Child Enrolled' },
                  { date: 'Jan 15, 2026', title: 'PDF Proof Enclosures Uploaded' },
                  { date: 'Jan 20, 2026', title: 'Registrar Field Verification Completed' },
                  { date: 'Jan 22, 2026', title: 'Household Census Final submission' }
                ].map((ev, idx) => (
                  <div key={idx} className="relative pb-5 last:pb-0">
                    <div className="absolute -left-[27px] top-0.5 w-3.5 h-3.5 rounded-full border-2 border-white bg-[#0b2447] flex items-center justify-center shadow-sm">
                      <span className="w-1.5 h-1.5 bg-white rounded-full" />
                    </div>
                    <span className="block text-[9px] font-bold text-slate-400">{ev.date}</span>
                    <h5 className="font-extrabold text-[#0b2447] text-[11px] mt-0.5 leading-tight">{ev.title}</h5>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* ══════════════════════════════════════════════════
          AI FAMILY ASSISTANT FLOATING CHAT SCREEN
      ══════════════════════════════════════════════════ */}
      <button 
        onClick={() => setChatOpen(prev => !prev)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all z-50 cursor-pointer text-white"
        style={{ background: 'linear-gradient(135deg, #0b2447, #1f3e6d)' }}
        title="AI Assistant"
      >
        {chatOpen ? <X className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
      </button>

      {chatOpen && (
        <div 
          className="fixed bottom-24 right-6 w-[340px] rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col z-50 bg-white"
          style={{ height: '440px' }}
        >
          {/* Header */}
          <div className="px-4 py-3 bg-[#0b2447] text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
                <Bot className="w-4 h-4 text-[#ff9933]" />
              </div>
              <div>
                <h5 className="text-xs font-extrabold leading-tight">AI Family Assistant</h5>
                <span className="text-[8px] text-white/50 tracking-wider">National Census Support Portal</span>
              </div>
            </div>
            
            {/* Language Selector */}
            <div className="relative flex items-center gap-1">
              <Languages className="w-3.5 h-3.5 text-white/60" />
              <select 
                value={chatLanguage} 
                onChange={(e) => setChatLanguage(e.target.value)}
                className="bg-transparent text-[10px] font-bold text-white border-none outline-none cursor-pointer"
              >
                <option value="en" className="text-slate-800">English</option>
                <option value="hi" className="text-slate-800">हिन्दी</option>
                <option value="ta" className="text-slate-800">தமிழ்</option>
              </select>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-grow p-4 overflow-y-auto bg-slate-50/50 flex flex-col gap-3">
            {chatMsgs.map((msg, i) => (
              <div key={i} className={`flex gap-2.5 ${msg.from === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs">
                  {msg.from === 'bot' 
                    ? <div className="bg-[#0b2447] text-white w-full h-full rounded-full flex items-center justify-center"><Bot className="w-3 h-3 text-[#ff9933]" /></div>
                    : <div className="bg-[#ff9933] text-white w-full h-full rounded-full flex items-center justify-center font-extrabold text-[9px]">U</div>
                  }
                </div>
                <div className={`p-3 rounded-2xl text-xs max-w-[220px] leading-relaxed shadow-sm ${
                  msg.from === 'bot' 
                    ? 'bg-white border border-slate-100 text-[#0b2447] font-semibold' 
                    : 'bg-[#0b2447] text-white font-medium'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Quick FAQ clickable questions */}
          <div className="px-4 py-2 border-t border-slate-100 bg-white flex gap-1.5 overflow-x-auto whitespace-nowrap shrink-0 scrollbar-none">
            {['Which documents are missing?', 'How do I add a spouse?', 'How do I change family head?'].map((faq, i) => (
              <button 
                key={i} 
                onClick={() => handleSendChat(faq)}
                className="bg-slate-50 hover:bg-[#ff9933]/5 hover:border-[#ff9933]/25 border border-slate-200 transition-colors text-[9px] font-bold text-[#0b2447] px-2.5 py-1.5 rounded-lg cursor-pointer"
              >
                {faq}
              </button>
            ))}
          </div>

          {/* Input Panel */}
          <div className="p-3 border-t border-slate-100 bg-white shrink-0 flex items-center gap-2">
            <button 
              onClick={startVoiceInput}
              className={`p-2 rounded-xl border border-slate-200 transition-colors cursor-pointer ${isListening ? 'bg-red-50 border-red-200 text-red-500 animate-pulse' : 'hover:bg-slate-50 text-slate-400'}`}
              title="Voice Input Mock"
            >
              <Mic className="w-4 h-4" />
            </button>
            <input 
              type="text" 
              placeholder={isListening ? "Listening simulated voice input..." : "Type family register query..."}
              value={chatInput}
              disabled={isListening}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
              className="flex-grow bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#0b2447] transition-all"
            />
            <button 
              onClick={() => handleSendChat()}
              className="bg-[#0b2447] hover:bg-[#1f3e6d] text-white p-2 rounded-xl shadow-sm transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════
          MODAL 1: REGISTER NEW MEMBER FORM (Add modal)
      ══════════════════════════════════════════════════ */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-150 w-full max-w-xl overflow-hidden animate-scale-in">
            {/* Header */}
            <div className="px-6 py-4 bg-[#0b2447] text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-[#ff9933]" />
                <h4 className="font-extrabold text-sm">Register Household Dependent</h4>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-white/70 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Content */}
            <form onSubmit={handleAddMemberSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              
              {/* Full Name */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-[#0b2447] uppercase tracking-wide">Full Legal Name <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  name="fullName"
                  value={newMember.fullName}
                  onChange={handleInputChange}
                  required
                  placeholder="As registered in identification papers"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#0b2447] rounded-xl text-xs outline-none transition-all"
                />
              </div>

              {/* Aadhaar */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-[#0b2447] uppercase tracking-wide">Aadhaar Identification Number (12 Digits) <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  name="aadhaar"
                  value={newMember.aadhaar}
                  onChange={handleAadhaarChange}
                  required
                  maxLength={12}
                  placeholder="Enter 12 numerical digits"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#0b2447] rounded-xl text-xs outline-none transition-all font-mono tracking-wider"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* DOB */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-[#0b2447] uppercase tracking-wide">Date of Birth <span className="text-red-500">*</span></label>
                  <input 
                    type="date" 
                    name="dob"
                    value={newMember.dob}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#0b2447] rounded-xl text-xs outline-none transition-all"
                  />
                </div>

                {/* Gender */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-[#0b2447] uppercase tracking-wide">Gender <span className="text-red-500">*</span></label>
                  <select 
                    name="gender"
                    value={newMember.gender}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#0b2447] rounded-xl text-xs outline-none transition-all cursor-pointer"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Transgender">Transgender</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Relationship */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-[#0b2447] uppercase tracking-wide">Relationship to Head <span className="text-red-500">*</span></label>
                  <select 
                    name="relationship"
                    value={newMember.relationship}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#0b2447] rounded-xl text-xs outline-none transition-all cursor-pointer"
                  >
                    <option value="">Select Relation</option>
                    {RELATIONSHIP_OPTIONS.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                {/* Qualification */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-[#0b2447] uppercase tracking-wide">Education Level</label>
                  <select 
                    name="qualification"
                    value={newMember.qualification}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#0b2447] rounded-xl text-xs outline-none transition-all cursor-pointer"
                  >
                    <option value="">Select Education</option>
                    {QUALIFICATION_OPTIONS.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Occupation */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-[#0b2447] uppercase tracking-wide">Occupation / Profession</label>
                <input 
                  type="text" 
                  name="occupation"
                  value={newMember.occupation}
                  onChange={handleInputChange}
                  placeholder="e.g. Student, Service, Farmer, Homemaker"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#0b2447] rounded-xl text-xs outline-none transition-all"
                />
              </div>

              {/* File uploads (Conditional logic: if in demo mode, mock files success automatically, else request real PDFs) */}
              <div className="border-t border-slate-100 pt-4 space-y-3.5">
                <h5 className="font-extrabold text-xs text-[#0b2447] flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-[#ff9933]" /> Identification Verification Proofs (PDF formats only)
                </h5>
                {isDemoMode ? (
                  <div className="p-3 bg-amber-50 rounded-2xl border border-amber-100 text-[10px] text-amber-700">
                    <strong>Demo Mode:</strong> Document uploads are pre-approved and mocked automatically.
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-500 flex justify-between">
                        <span>Age Proof Certificate (e.g. Birth Cert, PAN Card)</span>
                        <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="file" 
                        accept=".pdf"
                        onChange={(e) => setAgeProof(e.target.files[0])}
                        required
                        className="text-xs file:mr-3 file:py-1 file:px-3 file:rounded-xl file:border-0 file:text-[10px] file:font-bold file:bg-[#0b2447]/10 file:text-[#0b2447] hover:file:bg-[#0b2447]/15 cursor-pointer outline-none w-full"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-500 flex justify-between">
                        <span>Address Proof Certificate (e.g. Electricity Bill, Rent Deed)</span>
                        <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="file" 
                        accept=".pdf"
                        onChange={(e) => setAddressProof(e.target.files[0])}
                        required
                        className="text-xs file:mr-3 file:py-1 file:px-3 file:rounded-xl file:border-0 file:text-[10px] file:font-bold file:bg-[#0b2447]/10 file:text-[#0b2447] hover:file:bg-[#0b2447]/15 cursor-pointer outline-none w-full"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-500 flex justify-between">
                        <span>Qualification Certificate (e.g. Graduation Marksheet)</span>
                        <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="file" 
                        accept=".pdf"
                        onChange={(e) => setQualificationProof(e.target.files[0])}
                        required
                        className="text-xs file:mr-3 file:py-1 file:px-3 file:rounded-xl file:border-0 file:text-[10px] file:font-bold file:bg-[#0b2447]/10 file:text-[#0b2447] hover:file:bg-[#0b2447]/15 cursor-pointer outline-none w-full"
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2.5">
                <button 
                  type="button" 
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 text-[#0b2447] text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={saving}
                  className="px-5 py-2.5 bg-[#0b2447] hover:bg-[#1f3e6d] disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  {saving ? 'Saving...' : 'Add Family Member'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════
          MODAL 2: EDIT HOUSEHOLD PROPERTY SUMMARY
      ══════════════════════════════════════════════════ */}
      {isEditHouseholdOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-150 w-full max-w-md overflow-hidden animate-scale-in">
            {/* Header */}
            <div className="px-6 py-4 bg-[#0b2447] text-white flex justify-between items-center">
              <h4 className="font-extrabold text-sm">Edit Household Specifications</h4>
              <button 
                onClick={() => setIsEditHouseholdOpen(false)}
                className="text-white/70 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Residence Ownership</label>
                <select 
                  value={householdForm.type}
                  onChange={(e) => setHouseholdForm(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none"
                >
                  <option value="Owned House">Owned House</option>
                  <option value="Rented Apartment">Rented Apartment</option>
                  <option value="Leased House">Leased House</option>
                  <option value="Government Quarter">Government Quarter</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Total Rooms</label>
                <input 
                  type="text" 
                  value={householdForm.rooms}
                  onChange={(e) => setHouseholdForm(prev => ({ ...prev, rooms: e.target.value }))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Broadband Internet</label>
                <select 
                  value={householdForm.internet}
                  onChange={(e) => setHouseholdForm(prev => ({ ...prev, internet: e.target.value }))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none"
                >
                  <option value="Internet Available">Available</option>
                  <option value="No Internet">Not Available</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Vehicles Registered</label>
                <input 
                  type="text" 
                  value={householdForm.vehicles}
                  onChange={(e) => setHouseholdForm(prev => ({ ...prev, vehicles: e.target.value }))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2.5">
                <button 
                  onClick={() => setIsEditHouseholdOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Close
                </button>
                <button 
                  onClick={() => {
                    setIsEditHouseholdOpen(false);
                    setSuccess('Household property summary updated successfully');
                  }}
                  className="px-5 py-2 bg-[#0b2447] hover:bg-[#1f3e6d] text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════
          SIDEBAR SLIDEOUT PANEL: INDIVIDUAL PROFILE VIEW
      ══════════════════════════════════════════════════ */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs">
          {/* Overlay dismissal */}
          <div className="flex-grow" onClick={() => setSelectedMember(null)} />
          
          {/* Side flyout drawer container */}
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-in">
            {/* Header */}
            <div className="p-6 bg-[#0b2447] text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                {renderAvatarSVG(selectedMember.relationship, selectedMember.gender, 40)}
                <div>
                  <h4 className="font-extrabold text-sm leading-tight">{selectedMember.fullName}</h4>
                  <span className="text-[9px] bg-white/15 px-2 py-0.5 rounded font-bold uppercase">{selectedMember.relationship}</span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedMember(null)}
                className="text-white/70 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile specifications list */}
            <div className="flex-grow p-6 overflow-y-auto space-y-6">
              
              {/* Core demographic block */}
              <div>
                <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest">Demographic Profile</span>
                <div className="mt-2.5 grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <span className="text-[8px] text-slate-400 uppercase font-bold">Gender</span>
                    <p className="font-extrabold text-[#0b2447] mt-0.5">{selectedMember.gender}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <span className="text-[8px] text-slate-400 uppercase font-bold">Date of Birth</span>
                    <p className="font-extrabold text-[#0b2447] mt-0.5">{selectedMember.dob}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <span className="text-[8px] text-slate-400 uppercase font-bold">Age</span>
                    <p className="font-extrabold text-[#0b2447] mt-0.5">{calculateAge(selectedMember.dob)} Years</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <span className="text-[8px] text-slate-400 uppercase font-bold">Aadhaar Enrolment</span>
                    <p className="font-extrabold text-[#0b2447] mt-0.5 font-mono tracking-wide">
                      {selectedMember.aadhaar ? `XXXX-XXXX-${selectedMember.aadhaar.slice(-4)}` : 'Not linked'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Occupation and qualification status */}
              <div>
                <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest">Education & Career</span>
                <div className="mt-2.5 grid grid-cols-1 gap-2.5 text-xs">
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 flex items-center gap-3">
                    <GraduationCap className="w-5 h-5 text-[#0b2447]/60" />
                    <div>
                      <span className="text-[8px] text-slate-400 uppercase font-bold">Qualifications</span>
                      <p className="font-extrabold text-[#0b2447]">{selectedMember.qualification || 'Primary Level School'}</p>
                    </div>
                  </div>
                  
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 flex items-center gap-3">
                    <Briefcase className="w-5 h-5 text-[#0b2447]/60" />
                    <div>
                      <span className="text-[8px] text-slate-400 uppercase font-bold">Profession</span>
                      <p className="font-extrabold text-[#0b2447]">{selectedMember.occupation || 'Student'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Uploaded proofs and verifications links */}
              <div>
                <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest">Identity Verification Proofs</span>
                <div className="mt-2.5 space-y-2 text-xs">
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between">
                    <div>
                      <span className="block font-extrabold text-[#0b2447]">Age Verification Proof</span>
                      <span className="text-[8px] text-slate-400 font-medium">PAN Card / Birth Certificate PDF</span>
                    </div>
                    {selectedMember.ageProofPath ? (
                      <button 
                        onClick={() => handleDownloadDoc(selectedMember.id, 'age', selectedMember.fullName)}
                        className="bg-[#0b2447]/5 hover:bg-[#0b2447]/10 border border-[#0b2447]/10 text-[#0b2447] text-[9px] font-extrabold px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1"
                      >
                        <Download className="w-3 h-3" /> Get PDF
                      </button>
                    ) : (
                      <span className="text-[9px] font-bold text-slate-400">Not Uploaded</span>
                    )}
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between">
                    <div>
                      <span className="block font-extrabold text-[#0b2447]">Address Verification Proof</span>
                      <span className="text-[8px] text-slate-400 font-medium">Aadhaar Card / Utility Bill PDF</span>
                    </div>
                    {selectedMember.addressProofPath ? (
                      <button 
                        onClick={() => handleDownloadDoc(selectedMember.id, 'address', selectedMember.fullName)}
                        className="bg-[#0b2447]/5 hover:bg-[#0b2447]/10 border border-[#0b2447]/10 text-[#0b2447] text-[9px] font-extrabold px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1"
                      >
                        <Download className="w-3 h-3" /> Get PDF
                      </button>
                    ) : (
                      <span className="text-[9px] font-bold text-slate-400">Not Uploaded</span>
                    )}
                  </div>
                </div>
              </div>

            </div>

            {/* Actions Footer inside drawer */}
            <div className="p-6 border-t border-slate-150/70 bg-slate-50 flex gap-2 shrink-0">
              {selectedMember.relationship !== 'Head' && (
                <button 
                  onClick={() => handleDeleteMember(selectedMember.id, selectedMember.fullName)}
                  className="flex-1 bg-red-50 hover:bg-red-100 text-red-650 font-bold py-2.5 px-4 rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 border border-red-200"
                >
                  <Trash2 className="w-4 h-4" /> Remove Dependent
                </button>
              )}
              <button 
                onClick={() => setSelectedMember(null)}
                className="flex-1 bg-[#0b2447] hover:bg-[#1f3e6d] text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors cursor-pointer text-center"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default FamilyDashboard;
