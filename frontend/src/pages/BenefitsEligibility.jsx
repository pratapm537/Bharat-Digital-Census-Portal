import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { censusAPI } from '../services/api.js';
import {
  ArrowLeft, Search, Filter, ShieldCheck, Heart, Users, GraduationCap,
  Briefcase, Landmark, RefreshCw, Download, FileText, CheckCircle, Clock,
  AlertCircle, ArrowRight, Upload, Info, MessageSquare, ChevronRight, X,
  UserCheck, Eye, Phone, HelpCircle, Activity, Sparkles, BookOpen, User, Check
} from 'lucide-react';

// Helper to calculate age from DOB
const calculateAge = (dobString) => {
  if (!dobString) return 0;
  const dob = new Date(dobString);
  const diff = Date.now() - dob.getTime();
  const ageDate = new Date(diff);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

const BenefitsEligibility = () => {
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

  // Search & Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  // Export State
  const [exportProgress, setExportProgress] = useState(0);
  const [exporting, setExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState(null); // 'pdf' | 'excel' | 'print'
  const [toastMessage, setToastMessage] = useState('');

  // Scanning animation trigger
  const [isScanning, setIsScanning] = useState(false);

  // Chat/Advisor state
  const [advisorMessage, setAdvisorMessage] = useState('');
  const [chatLog, setChatLog] = useState([
    { role: 'bot', text: 'Namaste! 🙏 I am your Welfare Benefits AI Advisor. Based on your census data, I can guide you through the government schemes you qualify for. Ask me anything!' }
  ]);

  // Comparison State
  const [compareSchemeA, setCompareSchemeA] = useState('Ayushman Bharat');
  const [compareSchemeB, setCompareSchemeB] = useState('State Health Scheme');

  // File Upload State and Ref
  const fileInputRef = useRef(null);
  const [activeDocToUpload, setActiveDocToUpload] = useState(null);

  const triggerFileUpload = (docName) => {
    setActiveDocToUpload(docName);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0] && activeDocToUpload) {
      const file = e.target.files[0];
      handleUploadDocument(activeDocToUpload, file.name);
      setActiveDocToUpload(null);
    }
  };

  // Document Upload Sim State
  const [documentsList, setDocumentsList] = useState([
    { name: 'Aadhaar Card', status: 'Verified', requiredFor: 'All Schemes', file: null },
    { name: 'Income Certificate', status: 'Missing', requiredFor: 'Scholarships & Pensions', file: null },
    { name: 'Land Ownership Proof', status: 'Pending Verification', requiredFor: 'PM Kisan', file: 'land_records_copy.pdf' },
    { name: 'Disability Certificate', status: 'Not Uploaded', requiredFor: 'Disability Pension', file: null },
    { name: 'Age Proof (Birth Certificate)', status: 'Verified', requiredFor: 'Senior Schemes', file: null }
  ]);

  // Mock Family Data (8 Members) for Demo Mode
  const demoHead = {
    fullName: 'Mohit Pratap Mehra',
    dob: '1991-04-12',
    gender: 'Male',
    relationship: 'Head',
    aadhaar: '548796541258',
    qualification: 'Post Graduate / Master',
    occupation: 'IT Consultant',
    employmentStatus: 'Employed',
    incomeGroup: 'Medium Income',
    landOwnership: 'No',
    disabled: false
  };

  const demoFamily = [
    { id: 'm1', fullName: 'Rajesh Mehra', dob: '1954-08-15', gender: 'Male', relationship: 'Grandfather', qualification: 'Graduate / Bachelor', occupation: 'Retired Government Officer', employmentStatus: 'Retired', incomeGroup: 'Medium Income', landOwnership: 'No', disabled: false },
    { id: 'm2', fullName: 'Savitri Mehra', dob: '1958-02-10', gender: 'Female', relationship: 'Grandmother', qualification: 'Senior Secondary (12th)', occupation: 'Homemaker', employmentStatus: 'Retired', incomeGroup: 'None', landOwnership: 'No', disabled: false },
    { id: 'm3', fullName: 'Anil Mehra', dob: '1971-11-20', gender: 'Male', relationship: 'Father', qualification: 'Graduate / Bachelor', occupation: 'Business Owner', employmentStatus: 'Self Employed', incomeGroup: 'High Income', landOwnership: 'Yes', disabled: false },
    { id: 'm4', fullName: 'Sunita Mehra', dob: '1974-06-05', gender: 'Female', relationship: 'Mother', qualification: 'Post Graduate / Master', occupation: 'Government Teacher', employmentStatus: 'Employed', incomeGroup: 'Medium Income', landOwnership: 'No', disabled: false },
    { id: 'm5', fullName: 'Priya Mehra', dob: '1994-09-25', gender: 'Female', relationship: 'Spouse', qualification: 'Post Graduate / Master', occupation: 'Doctor (MD)', employmentStatus: 'Employed', incomeGroup: 'High Income', landOwnership: 'No', disabled: false },
    { id: 'm6', fullName: 'Aarav Mehra', dob: '2018-05-18', gender: 'Male', relationship: 'Son', qualification: 'Primary School', occupation: 'Student', employmentStatus: 'Student', incomeGroup: 'None', landOwnership: 'No', disabled: false },
    { id: 'm7', fullName: 'Diya Mehra', dob: '2021-01-30', gender: 'Female', relationship: 'Daughter', qualification: 'Primary School', occupation: 'Student', employmentStatus: 'Student', incomeGroup: 'None', landOwnership: 'No', disabled: false }
  ];

  // Load backend census draft and family lists
  const loadCensusData = async () => {
    try {
      const response = await censusAPI.getDraft();
      setDraft(response.data.draft);
      const dbFamily = response.data.family || [];
      setFamily(dbFamily);

      // Only auto-switch modes if user hasn't manually selected a mode
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

  // Assemble active dataset based on toggle
  const activeHead = useMemo(() => {
    if (isDemoMode) return demoHead;
    return {
      fullName: draft?.personal_fullName || user?.fullName || 'Family Head',
      dob: draft?.personal_dob || '1990-01-01',
      gender: draft?.personal_gender || 'Male',
      relationship: 'Head',
      aadhaar: draft?.identity_aadhaar || 'XXXX-XXXX-XXXX',
      qualification: draft?.education_highestLevel || 'Graduate / Bachelor',
      occupation: draft?.employment_occupation || 'IT Consultant',
      employmentStatus: draft?.employment_status || 'Employed',
      incomeGroup: draft?.employment_income ? 'Medium Income' : 'Low Income',
      landOwnership: draft?.housing_landOwned === 'Yes' || draft?.housing_landOwned === true ? 'Yes' : 'No',
      disabled: draft?.health_disability === 'Yes' || draft?.health_disability === true
    };
  }, [isDemoMode, draft, user]);

  const activeFamilyMembers = useMemo(() => {
    if (isDemoMode) return demoFamily;
    return family.map(m => ({
      id: m.id,
      fullName: m.fullName,
      dob: m.dob,
      gender: m.gender,
      relationship: m.relationship,
      qualification: m.qualification || 'Secondary School',
      occupation: m.occupation || 'Unemployed',
      employmentStatus: m.occupation?.toLowerCase().includes('student') ? 'Student' : 
                        m.occupation?.toLowerCase().includes('retired') ? 'Retired' : 
                        m.occupation?.toLowerCase().includes('unemployed') || m.occupation?.toLowerCase().includes('homemaker') ? 'Unemployed' : 'Employed',
      incomeGroup: 'Medium Income',
      landOwnership: 'No',
      disabled: m.disabled || false
    }));
  }, [isDemoMode, family]);

  const allMembers = useMemo(() => {
    return [activeHead, ...activeFamilyMembers];
  }, [activeHead, activeFamilyMembers]);

  // Compute stats and variables dynamically
  const studentsCount = useMemo(() => {
    return allMembers.filter(m => m.employmentStatus === 'Student' || m.occupation?.toLowerCase().includes('student')).length;
  }, [allMembers]);

  const seniorsCount = useMemo(() => {
    return allMembers.filter(m => calculateAge(m.dob) >= 60).length;
  }, [allMembers]);

  const farmerStatusCount = useMemo(() => {
    return allMembers.filter(m => 
      m.occupation?.toLowerCase().includes('farmer') || 
      m.occupation?.toLowerCase().includes('agriculture') ||
      m.occupation?.toLowerCase().includes('kisan')
    ).length;
  }, [allMembers]);

  const isLowIncome = useMemo(() => {
    return activeHead.incomeGroup === 'Low Income' || allMembers.some(m => m.incomeGroup === 'Low Income');
  }, [activeHead, allMembers]);

  const hasDisabledMember = useMemo(() => {
    return allMembers.some(m => m.disabled === true);
  }, [allMembers]);

  // Schemes Database and Dynamic Calculation
  const schemesList = useMemo(() => {
    return [
      {
        id: 'scheme-ayushman',
        name: 'Ayushman Bharat (PM-JAY)',
        category: 'Healthcare',
        description: 'Free healthcare cover of ₹5 Lakh per family per year for secondary and tertiary hospitalizations.',
        coverage: '₹5,00,000 Per Family Per Year',
        criteria: ['Family Income below threshold', 'No concrete household fully owned', 'Vulnerable socio-economic status'],
        isEligible: isLowIncome || allMembers.length >= 4 
          ? (documentsList.find(d => d.name === 'Income Certificate')?.status === 'Verified' ? 'Eligible' : 'Partially Eligible (Verify Income)')
          : 'Partially Eligible',
        detailUrl: 'https://pmjay.gov.in',
        benefits: 'Cashless treatment at all empaneled hospitals nationwide.',
        requiredDocs: ['Aadhaar Card', 'Ration Card', 'Income Certificate'],
        appStatus: 'Not Started'
      },
      {
        id: 'scheme-kisan',
        name: 'PM Kisan Samman Nidhi',
        category: 'Agriculture',
        description: 'Direct income support of ₹6,000 per year for landholding farmer families across the country.',
        coverage: '₹6,000 Annually (3 Installments)',
        criteria: ['Small & Marginal Farmer status', 'Agricultural land ownership records verified', 'Not an income tax payer'],
        isEligible: (farmerStatusCount > 0 || activeHead.landOwnership === 'Yes')
          ? (documentsList.find(d => d.name === 'Land Ownership Proof')?.status === 'Verified' ? 'Eligible' : 'Partially Eligible (Upload Land Proof)')
          : 'Not Eligible',
        detailUrl: 'https://pmkisan.gov.in',
        benefits: '₹2,000 directly credited to bank accounts every 4 months.',
        requiredDocs: ['Land Ownership Proof', 'Aadhaar Card', 'Bank Passbook'],
        appStatus: 'Pending Verification'
      },
      {
        id: 'scheme-old-age-pension',
        name: 'Old Age Pension Scheme (IGNOAPS)',
        category: 'Pension',
        description: 'Monthly assistance to senior citizens belonging to low income or below poverty line families.',
        coverage: '₹2,00,005 BPL threshold',
        criteria: ['Applicant age 60 years or above', 'BPL card holder or low income status', 'No regular pension source'],
        isEligible: seniorsCount > 0
          ? (documentsList.find(d => d.name === 'Age Proof (Birth Certificate)')?.status === 'Verified' ? 'Eligible' : 'Partially Eligible (Upload Age Proof)')
          : 'Not Eligible',
        detailUrl: 'https://nsap.nic.in',
        benefits: 'Monthly direct benefit transfer to pension bank account of ₹2,000.',
        requiredDocs: ['Age Proof', 'Income Certificate', 'Aadhaar Card'],
        appStatus: 'Not Started'
      },
      {
        id: 'scheme-widow-pension',
        name: 'Widow Pension Scheme (IGNWPS)',
        category: 'Pension',
        description: 'Financial assistance to destitute widows to ensure a dignified livelihood.',
        coverage: '₹1,500 Per Month',
        criteria: ['Female family head or member', 'Widowed marital status', 'Age group of 40-79 years', 'Low income household'],
        isEligible: allMembers.some(m => m.gender === 'Female' && (m.relationship?.toLowerCase().includes('widow') || m.relationship?.toLowerCase().includes('grandmother')))
          ? (documentsList.find(d => d.name === 'Income Certificate')?.status === 'Verified' ? 'Eligible' : 'Partially Eligible (Upload Income Proof)')
          : 'Not Eligible',
        detailUrl: 'https://nsap.nic.in',
        benefits: 'Monthly social security allowance directly to bank accounts.',
        requiredDocs: ['Death Certificate of Spouse', 'Aadhaar Card', 'Income Certificate'],
        appStatus: 'Not Started'
      },
      {
        id: 'scheme-national-scholarship',
        name: 'National Scholarship Portal (NSP)',
        category: 'Education',
        description: 'Educational financial support for school and college students in pre-matric and post-matric courses.',
        coverage: '₹20,000 Annually',
        criteria: ['Active student enrollment status', 'Annual family income under ₹2.5 Lakhs', 'Previous class academic score > 50%'],
        isEligible: studentsCount > 0
          ? (documentsList.find(d => d.name === 'Income Certificate')?.status === 'Verified' ? 'Eligible' : 'Partially Eligible (Upload Income Proof)')
          : 'Not Eligible',
        detailUrl: 'https://scholarships.gov.in',
        benefits: 'Tuition fee reimbursement and academic maintenance allowance.',
        requiredDocs: ['Student ID Card', 'Income Certificate', 'Previous Year Marksheet'],
        appStatus: 'Approved'
      },
      {
        id: 'scheme-disability-pension',
        name: 'Disability Pension Scheme (IGNDPS)',
        category: 'Pension',
        description: 'Welfare assistance for severely disabled citizens to support their medical and livelihood needs.',
        coverage: '₹1,500 Per Month',
        criteria: ['Applicant age 18-79 years', 'Disability ratio 80% or higher', 'Low family income'],
        isEligible: hasDisabledMember
          ? (documentsList.find(d => d.name === 'Disability Certificate')?.status === 'Verified' ? 'Eligible' : 'Partially Eligible (Upload Disability Proof)')
          : 'Not Eligible',
        detailUrl: 'https://nsap.nic.in',
        benefits: 'Monthly subsistence pension directly credited to the disabled citizen.',
        requiredDocs: ['Disability Certificate', 'Aadhaar Card', 'Income Certificate'],
        appStatus: 'Not Started'
      },
      {
        id: 'scheme-higher-edu-scholarship',
        name: 'Higher Education Scholarship',
        category: 'Education',
        description: 'Special incentives for pursuing technical, vocational, medical, or doctoral education in state institutes.',
        coverage: '₹40,000 Annually',
        criteria: ['Enrolled in Graduate or Master course', 'Income level low/medium', 'Minimum educational marks matching limits'],
        isEligible: studentsCount > 0 && allMembers.some(m => ['Graduate / Bachelor', 'Post Graduate / Master'].includes(m.qualification) && m.employmentStatus === 'Student')
          ? (documentsList.find(d => d.name === 'Income Certificate')?.status === 'Verified' ? 'Eligible' : 'Partially Eligible (Upload Income Proof)')
          : 'Not Eligible',
        detailUrl: 'https://scholarships.gov.in',
        benefits: 'Direct funding support for technical books, equipment, and residential fees.',
        requiredDocs: ['College Admission Receipt', 'Income Certificate', 'Marksheets'],
        appStatus: 'Not Started'
      },
      {
        id: 'scheme-pradhan-mantri-awas-yojana',
        name: 'PM Awas Yojana (Gramin/Urban)',
        category: 'Employment Programs',
        description: 'Financial assistance for construction of pucca houses with clean toilet facilities and utilities.',
        coverage: '₹1,20,000 House Subsidy',
        criteria: ['Houseless families', 'No concrete permanent household', 'Vulnerable demographic profile'],
        isEligible: isLowIncome
          ? (documentsList.find(d => d.name === 'Income Certificate')?.status === 'Verified' ? 'Eligible' : 'Partially Eligible (Upload Income Proof)')
          : 'Partially Eligible',
        detailUrl: 'https://pmayg.nic.in',
        benefits: 'Subsidy credit for direct housing structural upgrades.',
        requiredDocs: ['Aadhaar Card', 'Bank Details', 'Photographs of Existing House'],
        appStatus: 'Not Started'
      }
    ];
  }, [isLowIncome, allMembers, studentsCount, seniorsCount, farmerStatusCount, hasDisabledMember, activeHead, documentsList]);

  // Compute overview card counts
  const overviewStats = useMemo(() => {
    const eligibleCount = schemesList.filter(s => s.isEligible === 'Eligible' || s.isEligible === 'Partially Eligible').length;
    const appliedCount = schemesList.filter(s => s.appStatus !== 'Not Started').length;
    const approvedCount = schemesList.filter(s => s.appStatus === 'Approved').length;
    const pendingCount = schemesList.filter(s => s.appStatus === 'Pending Verification').length;

    return {
      eligible: eligibleCount,
      applied: appliedCount,
      approved: approvedCount,
      pending: pendingCount
    };
  }, [schemesList]);

  // Handle Search and Filter Logic
  const filteredSchemes = useMemo(() => {
    return schemesList.filter(scheme => {
      const matchesSearch = scheme.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            scheme.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = activeCategory === 'All' || scheme.category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [schemesList, searchQuery, activeCategory]);

  // Trigger Eligibility Scanning Animation
  const handleScanEligibility = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setToastMessage('Census Database scanned successfully! Dynamic eligibility updated.');
    }, 1800);
  };

  // Mocks Download Progress
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
            setToastMessage(`Benefits Report exported successfully as ${format.toUpperCase()}!`);
          }, 300);
          return 100;
        }
        return prev + 15;
      });
    }, 150);
  };

  // Chat message send handler
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!advisorMessage.trim()) return;

    const userText = advisorMessage;
    const newChat = [...chatLog, { role: 'user', text: userText }];
    setChatLog(newChat);
    setAdvisorMessage('');

    // Dynamic simple answers matching queries
    let replyText = "I'm checking our central social registry database. Based on your household census, ";
    const cleanUserText = userText.toLowerCase();

    if (cleanUserText.includes('healthcare') || cleanUserText.includes('ayushman') || cleanUserText.includes('health')) {
      replyText += `your family size is ${allMembers.length} and you qualify for Ayushman Bharat (PM-JAY) with ₹5,00,000 cover. Your head income group is ${activeHead.incomeGroup}.`;
    } else if (cleanUserText.includes('farmer') || cleanUserText.includes('kisan') || cleanUserText.includes('land')) {
      replyText += `PM Kisan Samman Nidhi is available for land-owning farmers. We detected ${farmerStatusCount} agricultural occupations in your registry. Eligibility status is: ${farmerStatusCount > 0 ? 'Eligible' : 'Requires verification'}.`;
    } else if (cleanUserText.includes('student') || cleanUserText.includes('scholarship') || cleanUserText.includes('school')) {
      replyText += `we detected ${studentsCount} students in your family. Under the National Scholarship Portal, they qualify for up to ₹20,000 annual assistance. Make sure to upload their latest marksheets.`;
    } else if (cleanUserText.includes('pension') || cleanUserText.includes('old age') || cleanUserText.includes('senior')) {
      replyText += `destitute seniors can apply for Old Age Pension. There are ${seniorsCount} seniors registered in your house, making you ${seniorsCount > 0 ? 'fully eligible for ₹2,000/month Old Age Pension' : 'not eligible directly'}.`;
    } else {
      replyText += `your family registers ${allMembers.length} members. You are eligible for ${overviewStats.eligible} welfare benefits. I recommend ensuring Aadhaar cards are uploaded for all members to avoid application blocks.`;
    }

    setTimeout(() => {
      setChatLog(prev => [...prev, { role: 'bot', text: replyText }]);
    }, 700);
  };

  // Simulating document upload
  const handleUploadDocument = (docName, fileName) => {
    setDocumentsList(prev => prev.map(d => {
      if (d.name === docName) {
        return { ...d, status: 'Verified', file: fileName || `${docName.toLowerCase().replace(/ /g, '_')}_upload.pdf` };
      }
      return d;
    }));
    setToastMessage(`Uploaded file ${fileName || ''} for ${docName}. Automatically verified.`);
  };

  // Comparison details
  const compData = useMemo(() => {
    const sA = schemesList.find(s => s.name.includes(compareSchemeA)) || schemesList[0];
    const sB = schemesList.find(s => s.name.includes(compareSchemeB)) || schemesList[1];
    return { sA, sB };
  }, [schemesList, compareSchemeA, compareSchemeB]);

  return (
    <div className="flex-grow w-full bg-[#f8faff] dark:bg-[#030d1b] min-h-screen pb-16 relative transition-colors duration-300">
      
      {/* Hidden file input for document center */}
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
      <div className="bg-[#0b2447] text-white py-12 px-6 sm:px-12 relative overflow-hidden shadow-lg border-b border-white/5">
        <div className="absolute right-0 top-0 w-96 h-96 bg-[#ff9933]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 w-80 h-80 bg-[#138808]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 pointer-events-none opacity-5" style={{
          backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }} />
        
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative z-10 animate-fade-in">
          <div>
            <button 
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white mb-3 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Citizen Dashboard
            </button>
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="text-[10px] uppercase font-bold text-white/50 tracking-widest bg-white/10 px-3 py-0.5 rounded-full">
                Sovereign Citizen Portal
              </span>
              <span className="text-[10px] uppercase font-bold text-[#ff9933] bg-[#ff9933]/15 border border-[#ff9933]/25 px-3 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3 animate-pulse" /> Welfare Intelligence Link
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 flex items-center gap-2.5">
              <Landmark className="w-8 h-8 text-[#ff9933]" /> Benefits Eligibility Checker
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1.5 max-w-2xl font-light leading-relaxed">
              Discover government schemes, subsidies, healthcare benefits, scholarships, and pension programs that you may qualify for based on census records.
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
                onClick={handleScanEligibility}
                disabled={isScanning}
                className="bg-[#ff9933] hover:bg-orange-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
                {isScanning ? 'Scanning...' : 'Check Eligibility'}
              </button>

              <button
                onClick={() => handleStartExport('pdf')}
                disabled={exporting}
                className="bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                Report
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8 flex flex-col gap-6">

        {/* ══════════════════════════════════════════════════
            SYSTEM MESSAGES / TOASTS
        ══════════════════════════════════════════════════ */}
        {toastMessage && (
          <div className="bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-300 text-xs p-4 rounded-2xl border border-green-200 dark:border-green-800 flex items-start justify-between gap-2.5 shadow-sm animate-fade-in">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 shrink-0 mt-0.5 text-green-600 dark:text-green-400" />
              <span>{toastMessage}</span>
            </div>
            <button onClick={() => setToastMessage('')} className="text-slate-400 hover:text-slate-600 dark:text-slate-550 dark:hover:text-slate-300 cursor-pointer">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {isDemoMode && (
          <div className="bg-amber-50 dark:bg-amber-950/20 text-amber-900 dark:text-amber-300 text-xs p-4 rounded-2xl border border-amber-200 dark:border-amber-800/40 flex items-start gap-2.5 shadow-sm">
            <Info className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
            <div>
              <p className="font-bold">Simulated Demonstration Active</p>
              <p className="text-amber-700 dark:text-amber-400/80 mt-0.5">Showing mock family data (Head: Mohit, Grandparents: Rajesh & Savitri, Students: Aarav & Diya) to demonstrate multiple category qualifications. You can toggle off simulation above to read your actual live submission.</p>
            </div>
          </div>
        )}

        {/* Export progress loader overlay if active */}
        {exporting && (
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 text-[#0b2447] dark:text-slate-200 p-4 rounded-2xl shadow-sm animate-fade-in">
            <div className="flex justify-between text-xs font-bold mb-1">
              <span>Generating Eligibility Report ({exportFormat?.toUpperCase()})...</span>
              <span>{exportProgress}%</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
              <div className="bg-blue-600 h-full transition-all duration-150" style={{ width: `${exportProgress}%` }} />
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════
            SECTION 2: ELIGIBILITY OVERVIEW (STAT STATISTICS)
        ══════════════════════════════════════════════════ */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Eligible Schemes', value: overviewStats.eligible, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-950/20', desc: 'Schemes matched', statusText: 'Qualified' },
            { label: 'Applied Schemes', value: overviewStats.applied, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/20', desc: 'Direct submissions', statusText: 'In Process' },
            { label: 'Approved Schemes', value: overviewStats.approved, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-950/20', desc: 'Sanctioned benefits', statusText: 'Verified' },
            { label: 'Pending Applications', value: overviewStats.pending, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/20', desc: 'Under review', statusText: 'Awaiting Action' }
          ].map((card, i) => (
            <div key={i} className="bg-white dark:bg-[#09172a] border border-slate-100 dark:border-white/10 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{card.label}</span>
                <span className={`text-[8px] font-bold uppercase px-2 py-0.5 rounded ${card.bg} ${card.color}`}>
                  {card.statusText}
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className={`text-3xl font-extrabold ${card.color}`}>{card.value}</span>
                <span className="text-[10px] text-slate-400">{card.desc}</span>
              </div>
            </div>
          ))}
        </div>

        {/* ── main content layout 2-cols (Left 8 Columns, Right 4 Columns) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* LEFT 8-COLUMN MAIN BLOCK */}
          <div className="lg:col-span-8 flex flex-col gap-6">

            {/* ══════════════════════════════════════════════════
                SECTION 3: GOVERNMENT SCHEME DISCOVERY
            ══════════════════════════════════════════════════ */}
            <div className="bg-white dark:bg-[#09172a] border border-slate-100 dark:border-white/10 rounded-3xl p-6 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-white/5 pb-4">
                <div>
                  <h2 className="font-extrabold text-base text-[#0b2447] dark:text-white uppercase tracking-wider flex items-center gap-2">
                    <Search className="w-5 h-5 text-[#ff9933]" /> Scheme Discovery Hub
                  </h2>
                  <p className="text-[10px] text-slate-400 dark:text-slate-300 mt-0.5">Filter schemes and browse qualification metrics</p>
                </div>
                
                {/* Search Bar Input */}
                <div className="relative max-w-md w-full md:w-72">
                  <input
                    type="text"
                    placeholder="Search schemes, key benefits..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#0d1e36] text-xs px-3.5 py-2 pl-9 rounded-xl border border-slate-200 dark:border-white/10 focus:outline-none focus:border-[#ff9933] transition-colors"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              {/* Category Tab Filters */}
              <div className="flex flex-wrap gap-1.5 mt-4 overflow-x-auto pb-1">
                {['All', 'Healthcare', 'Agriculture', 'Education', 'Pension', 'Employment Programs'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`text-[10px] font-bold px-3 py-1.5 rounded-lg border transition-all cursor-pointer whitespace-nowrap ${
                      activeCategory === cat
                        ? 'bg-[#0b2447] text-white border-[#0b2447] dark:bg-[#ff9933] dark:text-white dark:border-[#ff9933]'
                        : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100 dark:bg-white/5 dark:border-white/5 dark:text-slate-300 dark:hover:bg-white/10'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Scheme List Results Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                {filteredSchemes.length > 0 ? (
                  filteredSchemes.map((scheme) => {
                    const isElig = scheme.isEligible === 'Eligible';
                    const isPartial = scheme.isEligible === 'Partially Eligible';
                    const isNot = scheme.isEligible === 'Not Eligible';

                    return (
                      <div
                        key={scheme.id}
                        className="border border-slate-100 dark:border-white/10 rounded-2xl p-4 flex flex-col justify-between hover:shadow-sm hover:border-[#ff9933]/25 transition-all bg-slate-50 dark:bg-[#0d1e36] text-slate-800 dark:text-white"
                      >
                        <div>
                          <div className="flex justify-between items-start mb-2 gap-2">
                            <span className="text-[9px] uppercase font-extrabold text-[#ff9933] tracking-wider">
                              {scheme.category}
                            </span>
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                              isElig ? 'bg-green-100 text-green-700 dark:bg-green-950/20 dark:text-green-400' :
                              isPartial ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400' :
                              'bg-red-100 text-red-700 dark:bg-red-950/20 dark:text-red-400'
                            }`}>
                              {scheme.isEligible}
                            </span>
                          </div>
                          <h3 className="font-extrabold text-xs text-[#0b2447] dark:text-white leading-snug">
                            {scheme.name}
                          </h3>
                          <p className="text-[10px] text-slate-400 dark:text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                            {scheme.description}
                          </p>
                          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-white/5 flex flex-col gap-1 text-[10px]">
                            <div className="flex justify-between">
                              <span className="text-slate-400 dark:text-slate-300 font-medium">Coverage/Benefit:</span>
                              <span className="font-semibold text-slate-800 dark:text-slate-200">{scheme.coverage}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400 dark:text-slate-300 font-medium">App Status:</span>
                              <span className={`font-semibold ${
                                scheme.appStatus === 'Approved' ? 'text-green-600' :
                                scheme.appStatus === 'Pending Verification' ? 'text-amber-500' : 'text-slate-400'
                              }`}>{scheme.appStatus}</span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 pt-3 flex gap-2 border-t border-slate-100 dark:border-white/5">
                          <button
                            onClick={() => window.open(scheme.detailUrl, '_blank')}
                            className="flex-1 text-[10px] font-extrabold text-center text-slate-500 hover:text-[#0b2447] dark:text-slate-300 dark:hover:text-[#ff9933] border border-slate-200 dark:border-white/10 rounded-lg py-1.5 transition-colors cursor-pointer"
                          >
                            Details
                          </button>
                          <button
                            onClick={() => setToastMessage(`Application initiated for ${scheme.name}.`)}
                            disabled={isNot}
                            className={`flex-1 text-[10px] font-extrabold text-center rounded-lg py-1.5 transition-all cursor-pointer ${
                              isNot 
                                ? 'bg-slate-100 text-slate-300 border border-slate-200 cursor-not-allowed dark:bg-white/5 dark:border-none'
                                : 'bg-[#0b2447] text-white hover:bg-opacity-95 dark:bg-[#ff9933]'
                            }`}
                          >
                            Apply Now
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="md:col-span-2 text-center py-12">
                    <Search className="w-12 h-12 text-slate-200 dark:text-white/10 mx-auto mb-2" />
                    <p className="text-xs text-slate-400">No government schemes matched your filters.</p>
                  </div>
                )}
              </div>
            </div>

            {/* ══════════════════════════════════════════════════
                SECTION 4 & 5: SPECIFIC FEATURED SCHEME DETAILS (AYUSHMAN & PM KISAN)
            ══════════════════════════════════════════════════ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Ayushman Bharat Scheme Card */}
              <div className="bg-white dark:bg-[#09172a] border border-slate-100 dark:border-white/10 rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden">
                <div className="absolute right-0 top-0 w-24 h-24 bg-green-500/5 rounded-full blur-xl pointer-events-none" />
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-8 h-8 rounded-lg bg-green-50 dark:bg-green-950/20 flex items-center justify-center text-green-600">
                        <Heart className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <span className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest">Featured Healthcare</span>
                        <h3 className="font-extrabold text-sm text-[#0b2447] dark:text-white">Ayushman Bharat</h3>
                      </div>
                    </div>
                    {/* Eligibility Badge */}
                    <span className="text-[9px] font-bold bg-green-50 text-green-600 dark:bg-green-950/20 dark:text-green-400 border border-green-200 dark:border-green-800/40 px-2.5 py-0.5 rounded-full">
                      Eligible
                    </span>
                  </div>

                  <p className="text-[10px] text-slate-400 dark:text-slate-300 leading-relaxed mt-2">
                    Ayushman Bharat Pradhan Mantri Jan Arogya Yojana is a national health insurance scheme providing cash-free coverage to economically weaker sections.
                  </p>

                  {/* Conditions List */}
                  <div className="mt-4 bg-slate-50 dark:bg-[#0d1e36] p-3 rounded-xl">
                    <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-2">Eligibility Conditions</span>
                    <ul className="flex flex-col gap-1.5">
                      {[
                        { label: 'Family Income Criteria', met: isLowIncome },
                        { label: 'Socio-Economic Classification', met: allMembers.length >= 4 },
                        { label: 'Household Structural Status', met: true }
                      ].map((cond, i) => (
                        <li key={i} className="flex items-center gap-2 text-[10px]">
                          {cond.met ? (
                            <CheckCircle className="w-3.5 h-3.5 text-green-600 shrink-0" />
                          ) : (
                            <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          )}
                          <span className={cond.met ? 'text-slate-800 dark:text-slate-200 font-medium' : 'text-slate-400'}>{cond.label}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Benefit Summary */}
                  <div className="mt-4 flex justify-between items-center text-[10px] py-1 border-b border-slate-100 dark:border-white/5">
                    <span className="text-slate-400 dark:text-slate-300 font-medium">Coverage Limit:</span>
                    <span className="font-bold text-[#138808]">₹5,00,000 Per Family / Year</span>
                  </div>
                </div>

                <div className="mt-6 flex gap-2">
                  <button
                    onClick={() => setToastMessage('Redirecting to Ayushman Bharat Information Guide...')}
                    className="flex-1 text-[10px] font-bold py-2 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-300 hover:text-[#0b2447] dark:hover:text-[#ff9933] rounded-lg transition-colors cursor-pointer text-center"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => setToastMessage('Ayushman Bharat direct application wizard launched.')}
                    className="flex-1 text-[10px] font-bold py-2 bg-[#0b2447] text-white hover:bg-opacity-90 dark:bg-[#ff9933] rounded-lg transition-all cursor-pointer text-center animate-pulse"
                  >
                    Apply Now
                  </button>
                </div>
              </div>

              {/* PM Kisan Scheme Card */}
              <div className="bg-white dark:bg-[#09172a] border border-slate-100 dark:border-white/10 rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden">
                <div className="absolute right-0 top-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl pointer-events-none" />
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/20 flex items-center justify-center text-[#ff9933]">
                        <Landmark className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <span className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest">Featured Agriculture</span>
                        <h3 className="font-extrabold text-sm text-[#0b2447] dark:text-white">PM Kisan Yojana</h3>
                      </div>
                    </div>
                    {/* Eligibility Badge */}
                    <span className="text-[9px] font-bold bg-amber-50 text-[#ff9933] dark:bg-amber-950/20 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40 px-2.5 py-0.5 rounded-full">
                      {farmerStatusCount > 0 ? 'Eligible' : 'Verify Details'}
                    </span>
                  </div>

                  <p className="text-[10px] text-slate-400 dark:text-slate-300 leading-relaxed mt-2">
                    Government scheme that provides financial backing to all landholding farmers families, facilitating direct cash injection.
                  </p>

                  {/* Conditions List */}
                  <div className="mt-4 bg-slate-50 dark:bg-[#0d1e36] p-3 rounded-xl">
                    <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-2">Eligibility Conditions</span>
                    <ul className="flex flex-col gap-1.5">
                      {[
                        { label: 'Agricultural Land Registry Link', met: activeHead.landOwnership === 'Yes' },
                        { label: 'Active Farmer Classification', met: farmerStatusCount > 0 },
                        { label: 'Verified Land Records', met: false }
                      ].map((cond, i) => (
                        <li key={i} className="flex items-center gap-2 text-[10px]">
                          {cond.met ? (
                            <CheckCircle className="w-3.5 h-3.5 text-green-600 shrink-0" />
                          ) : (
                            <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          )}
                          <span className={cond.met ? 'text-slate-800 dark:text-slate-200 font-medium' : 'text-slate-400'}>{cond.label}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Benefit Summary */}
                  <div className="mt-4 flex justify-between items-center text-[10px] py-1 border-b border-slate-100 dark:border-white/5">
                    <span className="text-slate-450 font-medium">Annual Assistance:</span>
                    <span className="font-bold text-[#ff9933]">₹6,000 / Farmer Family</span>
                  </div>
                </div>

                <div className="mt-6 flex gap-2">
                  <button
                    onClick={() => setToastMessage('Redirecting to PM Kisan registry logs...')}
                    className="flex-1 text-[10px] font-bold py-2 border border-slate-200 dark:border-white/10 text-slate-500 hover:text-[#0b2447] rounded-lg transition-colors cursor-pointer text-center"
                  >
                    Check Details
                  </button>
                  <button
                    onClick={() => navigate('/wizard?step=7')}
                    className="flex-1 text-[10px] font-bold py-2 bg-amber-600 text-white hover:bg-opacity-95 rounded-lg transition-all cursor-pointer text-center"
                  >
                    Upload Land Records
                  </button>
                </div>
              </div>

            </div>

            {/* ══════════════════════════════════════════════════
                SECTION 6: PENSION SCHEME ELIGIBILITY
            ══════════════════════════════════════════════════ */}
            <div className="bg-white dark:bg-[#09172a] border border-slate-100 dark:border-white/10 rounded-3xl p-6 shadow-sm">
              <div className="border-b border-slate-100 dark:border-white/5 pb-3.5 mb-4">
                <h3 className="font-extrabold text-sm text-[#0b2447] dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#ff9933]" /> Pension Program Registry
                </h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Explore monthly retirement and social pension parameters</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: 'Old Age Pension (IGNOAPS)', desc: 'For senior citizens above BPL status.', criteria: 'Applicant age >= 60 yrs', eligible: seniorsCount > 0, cash: '₹2,000 / month' },
                  { name: 'Widow Pension (IGNWPS)', desc: 'Livelihood help for destitute widows.', criteria: 'Widowed marital status, female applicant', eligible: allMembers.some(m => m.gender === 'Female' && (m.relationship?.toLowerCase().includes('widow') || m.relationship?.toLowerCase().includes('grandmother'))), cash: '₹1,500 / month' },
                  { name: 'Disability Pension (IGNDPS)', desc: 'Direct transfer to differently-abled members.', criteria: 'Severe medical disability (80%+ Ratio)', eligible: hasDisabledMember, cash: '₹1,500 / month' },
                  { name: 'Senior Citizen Care Assistance', desc: 'Medical subsidies and monthly welfare support.', criteria: 'Household has senior citizens', eligible: seniorsCount > 0, cash: 'Subsidized Medical care' }
                ].map((pen, i) => (
                  <div key={i} className="border border-slate-100 dark:border-white/10 p-4 rounded-2xl flex flex-col justify-between bg-slate-50 dark:bg-[#0d1e36] text-slate-800 dark:text-white">
                    <div>
                      <div className="flex justify-between items-start gap-2 mb-1.5">
                        <h4 className="font-bold text-xs text-[#0b2447] dark:text-white leading-tight">{pen.name}</h4>
                        <span className={`text-[8px] font-bold px-2 py-0.5 rounded ${
                          pen.eligible ? 'bg-green-100 text-green-700 dark:bg-green-950/20' : 'bg-slate-100 text-slate-400'
                        }`}>
                          {pen.eligible ? 'Eligible' : 'Not Eligible'}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 dark:text-slate-300 leading-snug">{pen.desc}</p>
                      <div className="mt-2.5 text-[9px] text-slate-400 dark:text-slate-300 flex flex-col gap-0.5 font-medium">
                        <div><strong className="font-semibold text-slate-700 dark:text-slate-300">Criteria: </strong> {pen.criteria}</div>
                        <div><strong className="font-semibold text-slate-700 dark:text-slate-300">Benefit: </strong> {pen.cash}</div>
                      </div>
                    </div>

                    <button
                      onClick={() => setToastMessage(`Pension application initiated for ${pen.name}.`)}
                      disabled={!pen.eligible}
                      className={`w-full mt-4 text-[9px] font-bold py-1.5 rounded-lg text-center cursor-pointer transition-colors ${
                        pen.eligible 
                          ? 'bg-[#0b2447] text-white hover:bg-opacity-90 dark:bg-[#ff9933]' 
                          : 'bg-slate-100 text-slate-300 cursor-not-allowed dark:bg-white/5 dark:border-none'
                      }`}
                    >
                      Apply Now
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* ══════════════════════════════════════════════════
                SECTION 7: SCHOLARSHIP ELIGIBILITY
            ══════════════════════════════════════════════════ */}
            <div className="bg-white dark:bg-[#09172a] border border-slate-100 dark:border-white/10 rounded-3xl p-6 shadow-sm">
              <div className="border-b border-slate-100 dark:border-white/5 pb-3.5 mb-4">
                <h3 className="font-extrabold text-sm text-[#0b2447] dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-[#ff9933]" /> Academic Scholarships
                </h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Identify direct financial grants for students in the household</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: 'School Education Scholarship', scope: 'Grades 1 to 10', benefit: '₹8,000 / Year', eligible: studentsCount > 0, deadline: 'Sep 30, 2026' },
                  { name: 'National College Scholarship', scope: 'Graduate Bachelor Degrees', benefit: '₹20,000 / Year', eligible: studentsCount > 0 && allMembers.some(m => ['Graduate / Bachelor'].includes(m.qualification) && m.employmentStatus === 'Student'), deadline: 'Oct 15, 2026' },
                  { name: 'Higher Education Scholarship', scope: 'Master & Doctorate Streams', benefit: '₹45,000 / Year', eligible: studentsCount > 0 && allMembers.some(m => ['Post Graduate / Master', 'Doctorate (PhD)'].includes(m.qualification) && m.employmentStatus === 'Student'), deadline: 'Oct 31, 2026' },
                  { name: 'Technical & Skill Scholarship', scope: 'IT / Diploma Programs', benefit: '₹15,000 / Year', eligible: studentsCount > 0, deadline: 'Nov 15, 2026' }
                ].map((sch, i) => (
                  <div key={i} className="border border-slate-100 dark:border-white/10 p-4 rounded-2xl flex flex-col justify-between bg-slate-50 dark:bg-[#0d1e36] text-slate-800 dark:text-white">
                    <div>
                      <div className="flex justify-between items-start gap-2 mb-1.5">
                        <div>
                          <h4 className="font-bold text-xs text-[#0b2447] dark:text-white leading-tight">{sch.name}</h4>
                          <span className="text-[9px] text-[#ff9933] font-medium">{sch.scope}</span>
                        </div>
                        <span className={`text-[8px] font-bold px-2 py-0.5 rounded ${
                          sch.eligible ? 'bg-green-100 text-green-700 dark:bg-green-950/20' : 'bg-slate-100 text-slate-400'
                        }`}>
                          {sch.eligible ? 'Eligible' : 'Not Eligible'}
                        </span>
                      </div>
                      
                      <div className="mt-2.5 text-[9px] text-slate-400 dark:text-slate-300 flex flex-col gap-0.5">
                        <div className="flex justify-between">
                          <span>Grants:</span>
                          <span className="font-semibold text-slate-800 dark:text-slate-200">{sch.benefit}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Apply Deadline:</span>
                          <span className="font-semibold text-red-500">{sch.deadline}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setToastMessage(`Scholarship application page opened for ${sch.name}.`)}
                      disabled={!sch.eligible}
                      className={`w-full mt-4 text-[9px] font-bold py-1.5 rounded-lg text-center cursor-pointer transition-colors ${
                        sch.eligible 
                          ? 'bg-[#0b2447] text-white hover:bg-opacity-90 dark:bg-[#ff9933]' 
                          : 'bg-slate-100 text-slate-300 cursor-not-allowed dark:bg-white/5 dark:border-none'
                      }`}
                    >
                      Apply Online
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* ══════════════════════════════════════════════════
                SECTION 9: ELIGIBILITY STATUS TABLE
            ══════════════════════════════════════════════════ */}
            <div className="bg-white dark:bg-[#09172a] border border-slate-100 dark:border-white/10 rounded-3xl p-6 shadow-sm overflow-hidden">
              <div className="border-b border-slate-100 dark:border-white/5 pb-3.5 mb-4">
                <h3 className="font-extrabold text-sm text-[#0b2447] dark:text-white uppercase tracking-wider">
                  Complete Eligibility Registry
                </h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Central status log of all public welfare schemes</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-[11px] text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-white/10 text-slate-400 font-semibold uppercase text-[9px]">
                      <th className="py-2.5">Scheme Name</th>
                      <th className="py-2.5">Category</th>
                      <th className="py-2.5">Eligibility Status</th>
                      <th className="py-2.5">Required Documents</th>
                      <th className="py-2.5 text-right">Application Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-slate-700 dark:text-slate-300">
                    {schemesList.map((scheme, i) => {
                      const st = scheme.appStatus;
                      return (
                        <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-white/2 transition-colors">
                          <td className="py-3 font-semibold text-[#0b2447] dark:text-white">{scheme.name}</td>
                          <td className="py-3">{scheme.category}</td>
                          <td className="py-3">
                            <span className={`px-2 py-0.5 rounded text-[8px] font-bold ${
                              scheme.isEligible === 'Eligible' ? 'bg-green-50 text-green-700 dark:bg-green-950/20' :
                              scheme.isEligible === 'Partially Eligible' ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/20' :
                              'bg-red-50 text-red-700 dark:bg-red-950/20'
                            }`}>
                              {scheme.isEligible}
                            </span>
                          </td>
                          <td className="py-3 text-[10px] text-slate-400">
                            {scheme.requiredDocs.join(', ')}
                          </td>
                          <td className="py-3 text-right">
                            <span className={`text-[10px] font-bold ${
                              st === 'Approved' ? 'text-green-600' :
                              st === 'Pending Verification' ? 'text-amber-500' :
                              st === 'Applied' ? 'text-blue-500' : 'text-slate-400'
                            }`}>
                              {st}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ══════════════════════════════════════════════════
                SECTION 11: BENEFITS COMPARISON TOOL
            ══════════════════════════════════════════════════ */}
            <div className="bg-white dark:bg-[#09172a] border border-slate-100 dark:border-white/10 rounded-3xl p-6 shadow-sm">
              <div className="border-b border-slate-100 dark:border-white/5 pb-3.5 mb-4">
                <h3 className="font-extrabold text-sm text-[#0b2447] dark:text-white uppercase tracking-wider">
                  Benefits Comparison Tool
                </h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Select two welfare policies to compare criteria side-by-side</p>
              </div>

              {/* Selector Bar */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase">Scheme A</label>
                  <select
                    value={compareSchemeA}
                    onChange={(e) => setCompareSchemeA(e.target.value)}
                    className="bg-slate-50 dark:bg-[#0d1e36] text-[11px] font-semibold text-[#0b2447] dark:text-white border border-slate-200 rounded-xl px-2.5 py-1.5 outline-none"
                  >
                    {schemesList.map((s) => (
                      <option key={s.id} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase">Scheme B</label>
                  <select
                    value={compareSchemeB}
                    onChange={(e) => setCompareSchemeB(e.target.value)}
                    className="bg-slate-50 dark:bg-[#0d1e36] text-[11px] font-semibold text-[#0b2447] dark:text-white border border-slate-200 rounded-xl px-2.5 py-1.5 outline-none"
                  >
                    {schemesList.map((s) => (
                      <option key={s.id} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Side-by-side Comparison Grid */}
              <div className="grid grid-cols-3 gap-3 text-[11px] mt-4 border border-slate-100 dark:border-white/5 rounded-2xl overflow-hidden">
                <div className="bg-slate-50 dark:bg-[#0d1e36] p-3 font-semibold text-slate-500 dark:text-slate-400 border-r border-slate-200 dark:border-white/5 flex flex-col gap-6 justify-around">
                  <div>Benefits</div>
                  <div>Eligibility Rules</div>
                  <div>Documents</div>
                  <div>App Process</div>
                </div>
                <div className="p-3 text-slate-700 dark:text-white border-r border-slate-100 dark:border-white/5 flex flex-col gap-6">
                  <div className="font-bold text-[#0b2447] dark:text-white border-b pb-1">{compData.sA.name}</div>
                  <div>{compData.sA.benefits}</div>
                  <div>{compData.sA.criteria.join(', ')}</div>
                  <div>{compData.sA.requiredDocs.join(', ')}</div>
                  <div>Direct application via sovereign portal link</div>
                </div>
                <div className="p-3 text-slate-700 dark:text-white flex flex-col gap-6">
                  <div className="font-bold text-[#0b2447] dark:text-white border-b pb-1">{compData.sB.name}</div>
                  <div>{compData.sB.benefits || compData.sB.coverage}</div>
                  <div>{compData.sB.criteria.join(', ')}</div>
                  <div>{compData.sB.requiredDocs.join(', ')}</div>
                  <div>State welfare officer physical document review</div>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT 4-COLUMN SIDEBAR BLOCK */}
          <div className="lg:col-span-4 flex flex-col gap-6">

            {/* ══════════════════════════════════════════════════
                SECTION 12: AI BENEFITS ADVISOR
            ══════════════════════════════════════════════════ */}
            <div className="bg-white dark:bg-[#09172a] border border-slate-100 dark:border-white/10 rounded-3xl p-5 shadow-sm flex flex-col justify-between min-h-[300px]">
              <div>
                <div className="flex items-center gap-2 border-b border-slate-100 dark:border-white/5 pb-3">
                  <div className="w-8 h-8 rounded-lg bg-[#0b2447]/10 flex items-center justify-center">
                    <Sparkles className="w-4.5 h-4.5 text-[#ff9933] animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-xs text-[#0b2447] dark:text-white uppercase">AI Welfare Advisor</h3>
                    <span className="text-[8px] text-green-500 font-bold uppercase tracking-wider">Dynamic Scan Active</span>
                  </div>
                </div>

                {/* Suggestions List Panel */}
                <div className="mt-3 flex flex-col gap-2 max-h-40 overflow-y-auto pr-1">
                  <div className="bg-slate-50 dark:bg-[#0d1e36] text-[10px] p-2.5 rounded-xl border border-slate-100">
                    <p className="font-semibold text-[#ff9933]">Household Summary Insights:</p>
                    <ul className="list-disc pl-3 mt-1 space-y-1 text-slate-400">
                      <li>Your family qualifies for {overviewStats.eligible} welfare benefits.</li>
                      <li>{studentsCount} students in your household qualify for NSP scholarships.</li>
                      <li>{seniorsCount > 0 ? `${seniorsCount} senior citizen registered for retirement assistance.` : 'No senior citizen retirement schemes required.'}</li>
                    </ul>
                  </div>

                  {/* Simple chat display */}
                  <div className="flex flex-col gap-2 mt-2">
                    {chatLog.map((chat, idx) => (
                      <div key={idx} className={`p-2 rounded-xl text-[10px] ${
                        chat.role === 'user' 
                          ? 'bg-[#0b2447]/5 text-slate-800 self-end max-w-[85%]' 
                          : 'bg-blue-50/50 text-[#0b2447] dark:bg-white/5 dark:text-slate-200 self-start max-w-[85%]'
                      }`}>
                        {chat.text}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Message input */}
              <form onSubmit={handleSendMessage} className="mt-4 flex gap-1.5">
                <input
                  type="text"
                  placeholder="Ask advisor about pension, health..."
                  value={advisorMessage}
                  onChange={(e) => setAdvisorMessage(e.target.value)}
                  className="flex-1 bg-slate-50 dark:bg-[#0d1e36] text-[10px] text-slate-800 dark:text-white placeholder-slate-450 dark:placeholder-slate-400 px-2.5 py-2 rounded-xl border border-slate-200 dark:border-white/10 focus:outline-none"
                />
                <button
                  type="submit"
                  className="bg-[#0b2447] text-white hover:bg-opacity-90 dark:bg-[#ff9933] px-3 py-2 rounded-xl text-[10px] font-bold cursor-pointer"
                >
                  Ask
                </button>
              </form>
            </div>

            {/* ══════════════════════════════════════════════════
                SECTION 8: RECOMMENDED SCHEMES (AI CARDS)
            ══════════════════════════════════════════════════ */}
            <div className="bg-white dark:bg-[#09172a] border border-slate-100 dark:border-white/10 rounded-3xl p-5 shadow-sm">
              <h3 className="font-extrabold text-xs text-[#0b2447] dark:text-white uppercase tracking-wider mb-3">
                Recommended For You
              </h3>

              <div className="flex flex-col gap-3">
                {[
                  { name: 'Ayushman Bharat', score: 98, reason: 'Family size and dynamic low/medium income levels fit the core secondary healthcare mandate.' },
                  { name: 'National Scholarship', score: 92, reason: `${studentsCount} students detected in current family structure. Meets educational parameters.` },
                  { name: 'Senior Citizen Pension', score: 85, reason: seniorsCount > 0 ? `${seniorsCount} seniors registered. Qualified for Old Age pension assistance.` : 'Eligible once senior citizen age proof is added.' }
                ].map((rec, i) => (
                  <div key={i} className="border border-slate-100 dark:border-white/10 p-3 rounded-xl bg-slate-50 dark:bg-[#0d1e36] text-slate-800 dark:text-white">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-[11px] text-[#0b2447] dark:text-white">{rec.name}</span>
                      <span className="text-[9px] font-bold text-green-600 bg-green-50 dark:bg-green-950/20 px-2 py-0.5 rounded">
                        {rec.score}% Match
                      </span>
                    </div>
                    <p className="text-[9px] text-slate-400 leading-snug">{rec.reason}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ══════════════════════════════════════════════════
                SECTION 10: REQUIRED DOCUMENTS CENTER
            ══════════════════════════════════════════════════ */}
            <div className="bg-white dark:bg-[#09172a] border border-slate-100 dark:border-white/10 rounded-3xl p-5 shadow-sm">
              <h3 className="font-extrabold text-xs text-[#0b2447] dark:text-white uppercase tracking-wider mb-3">
                Required Documents Center
              </h3>

              <div className="flex flex-col gap-2.5">
                {documentsList.map((doc, i) => {
                  const isVerified = doc.status === 'Verified';
                  const isPending = doc.status === 'Pending Verification';
                  const isMissing = doc.status === 'Missing';
                  const isNot = doc.status === 'Not Uploaded';

                  return (
                    <div key={i} className="p-3 bg-slate-50 dark:bg-[#0d1e36] border border-slate-100 dark:border-white/10 rounded-xl flex flex-col gap-2 text-slate-800 dark:text-white">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <span className="block font-bold text-[10px] text-[#0b2447] dark:text-white leading-tight">{doc.name}</span>
                          <span className="block text-[8px] text-slate-400">For: {doc.requiredFor}</span>
                        </div>
                        <span className={`text-[8px] font-bold uppercase px-2 py-0.5 rounded ${
                          isVerified ? 'bg-green-50 text-green-700 dark:bg-green-950/20' :
                          isPending ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/20' :
                          'bg-red-50 text-red-700 dark:bg-red-950/20'
                        }`}>
                          {doc.status}
                        </span>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center justify-between gap-2 mt-1 pt-1.5 border-t border-slate-100/50 text-[9px]">
                        {doc.file ? (
                          <span className="text-slate-400 truncate max-w-[120px]">{doc.file}</span>
                        ) : (
                          <span className="text-red-500 font-medium">Missing File</span>
                        )}
                        <button
                          onClick={() => triggerFileUpload(doc.name)}
                          className="bg-[#0b2447] hover:bg-opacity-95 text-white dark:bg-[#ff9933] px-2.5 py-1 rounded text-[8px] font-extrabold cursor-pointer flex items-center gap-1"
                        >
                          <Upload className="w-2.5 h-2.5" /> Upload
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ══════════════════════════════════════════════════
                SECTION 13: APPLICATION TRACKER
            ══════════════════════════════════════════════════ */}
            <div className="bg-white dark:bg-[#09172a] border border-slate-100 dark:border-white/10 rounded-3xl p-5 shadow-sm">
              <h3 className="font-extrabold text-xs text-[#0b2447] dark:text-white uppercase tracking-wider mb-3">
                Application Tracker
              </h3>

              <div className="flex flex-col gap-3">
                {[
                  { name: 'PM Kisan Yojana', date: 'May 20, 2026', progress: 75, status: 'Under Review' },
                  { name: 'National Scholarship (NSP)', date: 'May 10, 2026', progress: 100, status: 'Approved' }
                ].map((app, i) => (
                  <div key={i} className="p-3 bg-slate-50 dark:bg-[#0d1e36] rounded-xl border border-slate-100 dark:border-white/10 text-slate-800 dark:text-white">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-[10px] text-[#0b2447] dark:text-white leading-tight">{app.name}</span>
                      <span className="text-[8px] font-bold text-slate-400">{app.date}</span>
                    </div>
                    <div className="flex justify-between text-[8px] text-slate-400 mb-1">
                      <span>Status: {app.status}</span>
                      <span>{app.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-green-600 h-full transition-all" style={{ width: `${app.progress}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ══════════════════════════════════════════════════
                SECTION 14: BENEFITS TIMELINE
            ══════════════════════════════════════════════════ */}
            <div className="bg-white dark:bg-[#09172a] border border-slate-100 dark:border-white/10 rounded-3xl p-5 shadow-sm">
              <h3 className="font-extrabold text-xs text-[#0b2447] dark:text-white uppercase tracking-wider mb-4">
                Activity Logs
              </h3>

              <div className="relative pl-4 flex flex-col gap-4 border-l border-slate-100 dark:border-white/10">
                {[
                  { title: 'National Scholarship Approved', date: 'May 25, 2026', desc: 'Central education grant sanction code generated.', done: true },
                  { title: 'Land Documents Verified', date: 'May 20, 2026', desc: 'PM Kisan agricultural land records linking verified.', done: true },
                  { title: 'Ayushman Eligibility Checked', date: 'May 18, 2026', desc: 'Census family composition matches criteria.', done: true },
                  { title: 'Application Submitted', date: 'May 15, 2026', desc: 'Welfare portal links verified.', done: true }
                ].map((act, i) => (
                  <div key={i} className="relative text-[10px]">
                    <div className="absolute -left-[21px] top-0.5 w-2.5 h-2.5 rounded-full bg-[#0b2447] dark:bg-[#ff9933] border-2 border-white dark:border-[#09172a]" />
                    <div className="font-bold text-slate-800 dark:text-slate-200 leading-tight">{act.title}</div>
                    <div className="text-[8px] text-[#ff9933] font-medium mt-0.5">{act.date}</div>
                    <p className="text-[9px] text-slate-400 mt-1">{act.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ══════════════════════════════════════════════════
                SECTION 15: EXPORT ELIGIBILITY REPORT
            ══════════════════════════════════════════════════ */}
            <div className="bg-white dark:bg-[#09172a] border border-slate-100 dark:border-white/10 rounded-3xl p-5 shadow-sm">
              <h3 className="font-extrabold text-xs text-[#0b2447] dark:text-white uppercase tracking-wider mb-3">
                Export Eligibility Report
              </h3>
              <p className="text-[10px] text-slate-400 dark:text-slate-350 leading-snug">Generate a downloadable verification summary of your welfare status</p>
              
              <div className="grid grid-cols-3 gap-2 mt-4">
                <button
                  onClick={() => handleStartExport('pdf')}
                  className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 text-[10px] font-bold py-2 rounded-xl text-center cursor-pointer transition-colors"
                >
                  PDF
                </button>
                <button
                  onClick={() => handleStartExport('excel')}
                  className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 text-[10px] font-bold py-2 rounded-xl text-center cursor-pointer transition-colors"
                >
                  Excel
                </button>
                <button
                  onClick={() => setToastMessage('Printing report summary...')}
                  className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 text-[10px] font-bold py-2 rounded-xl text-center cursor-pointer transition-colors"
                >
                  Print
                </button>
              </div>
            </div>

            {/* ══════════════════════════════════════════════════
                SECTION 16: QUICK ACTIONS
            ══════════════════════════════════════════════════ */}
            <div className="bg-white dark:bg-[#09172a] border border-slate-100 dark:border-white/10 rounded-3xl p-5 shadow-sm">
              <h3 className="font-extrabold text-xs text-[#0b2447] dark:text-white uppercase tracking-wider mb-3">
                Quick Actions
              </h3>

              <div className="flex flex-col gap-2 text-[11px]">
                {[
                  { label: 'Check Scheme Recommendations', icon: Sparkles, action: handleScanEligibility },
                  { label: 'Upload Welfare Proofs', icon: Upload, action: () => navigate('/wizard?step=7') },
                  { label: 'Track Active Submissions', icon: Activity, action: () => {} },
                  { label: 'Connect With Grievance Cell', icon: MessageSquare, action: () => navigate('/grievance') }
                ].map((act, i) => {
                  const Icon = act.icon;
                  return (
                    <button
                      key={i}
                      onClick={act.action}
                      className="w-full flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-white/2 cursor-pointer text-left font-medium text-slate-700 dark:text-slate-300"
                    >
                      <Icon className="w-3.5 h-3.5 text-[#ff9933] shrink-0" />
                      <span>{act.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ══════════════════════════════════════════════════
                SECTION 17: HELP & SUPPORT
            ══════════════════════════════════════════════════ */}
            <div className="bg-[#0b2447] text-white rounded-3xl p-5 shadow-lg flex flex-col gap-4">
              <div>
                <h3 className="font-extrabold text-xs uppercase tracking-widest text-[#ff9933]">Help & Live Support</h3>
                <p className="text-[10px] text-slate-300 leading-relaxed mt-1">Get immediate backing regarding schemes, application rejections, or document verification delays.</p>
              </div>

              <div className="flex flex-col gap-2">
                {[
                  { label: 'Frequently Asked Questions (FAQ)', icon: HelpCircle },
                  { label: 'Toll-Free Call Support (1800-XXX)', icon: Phone },
                  { label: 'Submit Support Ticket', icon: FileText }
                ].map((help, i) => {
                  const Icon = help.icon;
                  return (
                    <button
                      key={i}
                      onClick={() => setToastMessage(`Support shortcut loaded: ${help.label}`)}
                      className="w-full flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-bold cursor-pointer text-left text-slate-200 transition-colors"
                    >
                      <Icon className="w-3.5 h-3.5 text-[#ff9933] shrink-0" />
                      <span>{help.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default BenefitsEligibility;
