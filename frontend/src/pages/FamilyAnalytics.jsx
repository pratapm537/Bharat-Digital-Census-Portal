import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { censusAPI } from '../services/api.js';
import {
  ArrowLeft, Users, GraduationCap, Briefcase, Calendar, TrendingUp,
  Bot, Download, Printer, Share2, Filter, CheckCircle, Clock, ArrowRight,
  Home, Heart, Sparkles, Plus, Search, Eye, RefreshCw, FileText, Check,
  Activity, Info, Lock, ChevronRight, X, Sparkle
} from 'lucide-react';

// Helper to calculate age from DOB
const calculateAge = (dobString) => {
  if (!dobString) return 0;
  const dob = new Date(dobString);
  const diff = Date.now() - dob.getTime();
  const ageDate = new Date(diff);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

// SVG Profile Avatars generator helper
const renderAvatarLetter = (fullName) => {
  return fullName ? fullName[0].toUpperCase() : 'U';
};

const FamilyAnalytics = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Data Loading & States
  const [draft, setDraft] = useState(null);
  const [family, setFamily] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDemoMode, setIsDemoMode] = useState(true); // Default to demo mode for rich data view
  const userManuallySelectedMode = React.useRef(false); // Track if user explicitly toggled

  const handleDemoModeToggle = (val) => {
    userManuallySelectedMode.current = true;
    setIsDemoMode(val);
  };

  // Filter States
  const [filterAgeGroup, setFilterAgeGroup] = useState('All');
  const [filterGender, setFilterGender] = useState('All');
  const [filterEducation, setFilterEducation] = useState('All');
  const [filterEmployment, setFilterEmployment] = useState('All');
  const [dateRange, setDateRange] = useState('Last 3 Years');

  // Interactivity States
  const [hoveredAgeCategory, setHoveredAgeCategory] = useState(null);
  const [selectedAgeCategory, setSelectedAgeCategory] = useState(null);
  const [hoveredEducationCategory, setHoveredEducationCategory] = useState(null);
  const [selectedEducationCategory, setSelectedEducationCategory] = useState(null);
  const [hoveredEmploymentCategory, setHoveredEmploymentCategory] = useState(null);
  const [selectedEmploymentCategory, setSelectedEmploymentCategory] = useState(null);
  const [hoveredResource, setHoveredResource] = useState(null);
  const [hoveredGrowthYear, setHoveredGrowthYear] = useState(null);
  
  // Custom View Save Dialog
  const [savedViews, setSavedViews] = useState([]);
  const [showSaveViewModal, setShowSaveViewModal] = useState(false);
  const [newViewName, setNewViewName] = useState('');

  // Export State
  const [exportProgress, setExportProgress] = useState(0);
  const [exportType, setExportType] = useState(null); // 'pdf' | 'excel' | 'csv'
  const [exporting, setExporting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Mock Family Data (8 Members)
  const demoHead = {
    fullName: 'Mohit Pratap Mehra',
    dob: '1991-04-12',
    gender: 'Male',
    relationship: 'Head',
    aadhaar: '548796541258',
    qualification: 'Post Graduate / Master',
    occupation: 'IT Consultant',
    employmentStatus: 'Employed',
    incomeGroup: 'High Income'
  };

  const demoFamily = [
    { id: 'm1', fullName: 'Rajesh Mehra', dob: '1954-08-15', gender: 'Male', relationship: 'Grandfather', qualification: 'Graduate / Bachelor', occupation: 'Retired Government Officer', employmentStatus: 'Retired', incomeGroup: 'Medium Income' },
    { id: 'm2', fullName: 'Savitri Mehra', dob: '1958-02-10', gender: 'Female', relationship: 'Grandmother', qualification: 'Senior Secondary (12th)', occupation: 'Homemaker', employmentStatus: 'Retired', incomeGroup: 'None' },
    { id: 'm3', fullName: 'Anil Mehra', dob: '1971-11-20', gender: 'Male', relationship: 'Father', qualification: 'Graduate / Bachelor', occupation: 'Business Owner', employmentStatus: 'Self Employed', incomeGroup: 'High Income' },
    { id: 'm4', fullName: 'Sunita Mehra', dob: '1974-06-05', gender: 'Female', relationship: 'Mother', qualification: 'Post Graduate / Master', occupation: 'Government Teacher', employmentStatus: 'Employed', incomeGroup: 'Medium Income' },
    { id: 'm5', fullName: 'Priya Mehra', dob: '1994-09-25', gender: 'Female', relationship: 'Spouse', qualification: 'Post Graduate / Master', occupation: 'Doctor (MD)', employmentStatus: 'Employed', incomeGroup: 'High Income' },
    { id: 'm6', fullName: 'Aarav Mehra', dob: '2018-05-18', gender: 'Male', relationship: 'Son', qualification: 'Primary School', occupation: 'Student', employmentStatus: 'Student', incomeGroup: 'None' },
    { id: 'm7', fullName: 'Diya Mehra', dob: '2021-01-30', gender: 'Female', relationship: 'Daughter', qualification: 'Primary School', occupation: 'Student', employmentStatus: 'Student', incomeGroup: 'None' }
  ];

  // Load backend draft and family lists
  const loadFamilyData = async () => {
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
      // Fallback to Demo Mode silently on network/auth issue
      setIsDemoMode(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFamilyData();
  }, []);

  // Assemble active family dataset based on toggle
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
      incomeGroup: draft?.employment_income ? 'Medium Income' : 'Medium Income'
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
      occupation: m.occupation || 'Student',
      employmentStatus: m.occupation?.toLowerCase().includes('student') ? 'Student' : 
                        m.occupation?.toLowerCase().includes('retired') ? 'Retired' : 
                        m.occupation?.toLowerCase().includes('unemployed') || m.occupation?.toLowerCase().includes('homemaker') ? 'Unemployed' : 'Employed',
      incomeGroup: 'Medium Income'
    }));
  }, [isDemoMode, family]);

  const allMembersRaw = useMemo(() => {
    return [activeHead, ...activeFamilyMembers];
  }, [activeHead, activeFamilyMembers]);

  // Apply filters to active members list
  const filteredMembers = useMemo(() => {
    return allMembersRaw.filter(member => {
      const age = calculateAge(member.dob);
      let matchesAge = true;
      if (filterAgeGroup === 'Children') matchesAge = age < 18;
      else if (filterAgeGroup === 'Adults') matchesAge = age >= 18 && age < 60;
      else if (filterAgeGroup === 'Seniors') matchesAge = age >= 60;

      let matchesGender = true;
      if (filterGender !== 'All') matchesGender = member.gender === filterGender;

      let matchesEducation = true;
      if (filterEducation !== 'All') {
        if (filterEducation === 'Higher Ed') {
          matchesEducation = ['Graduate / Bachelor', 'Post Graduate / Master', 'Doctorate (PhD)'].includes(member.qualification);
        } else if (filterEducation === 'School') {
          matchesEducation = ['Illiterate', 'Literate', 'Primary School', 'Middle School', 'High School (10th)', 'Senior Secondary (12th)'].includes(member.qualification);
        } else {
          matchesEducation = member.qualification === filterEducation;
        }
      }

      let matchesEmployment = true;
      if (filterEmployment !== 'All') matchesEmployment = member.employmentStatus === filterEmployment;

      return matchesAge && matchesGender && matchesEducation && matchesEmployment;
    });
  }, [allMembersRaw, filterAgeGroup, filterGender, filterEducation, filterEmployment]);

  // Primary Metrics
  const metrics = useMemo(() => {
    const total = filteredMembers.length;
    if (total === 0) return { total: 0, avgAge: 0, working: 0, students: 0, seniors: 0 };
    
    let totalAge = 0;
    let working = 0;
    let students = 0;
    let seniors = 0;

    filteredMembers.forEach(m => {
      const age = calculateAge(m.dob);
      totalAge += age;
      if (['Employed', 'Self Employed'].includes(m.employmentStatus)) working++;
      if (m.employmentStatus === 'Student' || m.occupation?.toLowerCase() === 'student') students++;
      if (age >= 60) seniors++;
    });

    const avgAge = Math.round(totalAge / total);
    return { total, avgAge, working, students, seniors };
  }, [filteredMembers]);

  // Age Group Aggregation
  const ageDistribution = useMemo(() => {
    let children = 0;
    let adults = 0;
    let seniors = 0;

    filteredMembers.forEach(m => {
      const age = calculateAge(m.dob);
      if (age < 18) children++;
      else if (age < 60) adults++;
      else seniors++;
    });

    const total = filteredMembers.length || 1;
    return [
      { name: 'Children', range: '0 - 17 Years', count: children, pct: Math.round((children / total) * 100), color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
      { name: 'Adults', range: '18 - 59 Years', count: adults, pct: Math.round((adults / total) * 100), color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
      { name: 'Senior Citizens', range: '60+ Years', count: seniors, pct: Math.round((seniors / total) * 100), color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' }
    ];
  }, [filteredMembers]);

  // Education Aggregation
  const educationDistribution = useMemo(() => {
    const counts = {
      'Primary Education': 0,
      'Secondary Education': 0,
      'Higher Secondary': 0,
      'Graduate': 0,
      'Post Graduate': 0,
      'Professional Qualification': 0
    };

    filteredMembers.forEach(m => {
      const qual = m.qualification;
      if (qual === 'Primary School') counts['Primary Education']++;
      else if (['Middle School', 'High School (10th)'].includes(qual)) counts['Secondary Education']++;
      else if (['Senior Secondary (12th)', 'Diploma'].includes(qual)) counts['Higher Secondary']++;
      else if (qual === 'Graduate / Bachelor') counts['Graduate']++;
      else if (qual === 'Post Graduate / Master') counts['Post Graduate']++;
      else if (qual === 'Doctorate (PhD)') counts['Professional Qualification']++;
      else counts['Primary Education']++; // Default fallback
    });

    const total = filteredMembers.length || 1;
    return Object.keys(counts).map(key => ({
      name: key,
      count: counts[key],
      pct: Math.round((counts[key] / total) * 100)
    }));
  }, [filteredMembers]);

  // Employment Status Aggregation
  const employmentDistribution = useMemo(() => {
    const counts = {
      'Employed': 0,
      'Self Employed': 0,
      'Student': 0,
      'Retired': 0,
      'Unemployed': 0
    };

    filteredMembers.forEach(m => {
      const status = m.employmentStatus;
      if (status === 'Employed') counts['Employed']++;
      else if (status === 'Self Employed') counts['Self Employed']++;
      else if (status === 'Student') counts['Student']++;
      else if (status === 'Retired') counts['Retired']++;
      else counts['Unemployed']++;
    });

    const total = filteredMembers.length || 1;
    return Object.keys(counts).map((key, index) => {
      const colors = ['#10b981', '#6366f1', '#3b82f6', '#f59e0b', '#ef4444'];
      return {
        name: key,
        count: counts[key],
        pct: Math.round((counts[key] / total) * 100),
        color: colors[index % colors.length]
      };
    });
  }, [filteredMembers]);

  // Family Size Growth (Line Chart Raw Data)
  const growthData = useMemo(() => {
    // 2022 to 2025 growth simulation
    // Rajesh & Savitri & Head = 3 in 2022
    // Added parents = 5 in 2023
    // Added Priya = 6 in 2024
    // Added Aarav & Diya = 8 in 2025
    return [
      { year: '2022', size: 5, graduates: 2, employed: 2 },
      { year: '2023', size: 6, graduates: 3, employed: 3 },
      { year: '2024', size: 7, graduates: 4, employed: 4 },
      { year: '2025', size: 8, graduates: 5, employed: 4 }
    ];
  }, []);

  // Household Resource Indicators (e.g. Internet, Electricity, Vehicle, House Type)
  const resourceMetrics = useMemo(() => {
    return [
      { name: 'Internet Availability', status: 'High Speed Connection Available', active: true, pct: 100, color: '#3b82f6' },
      { name: 'Electricity Access', status: '24/7 Grid Power Connected', active: true, pct: 100, color: '#10b981' },
      { name: 'Vehicle Ownership', status: '2 Multi-wheel Vehicles Registered', active: true, pct: 75, color: '#f59e0b' },
      { name: 'House Type', status: 'Owned Pucca Concrete structure', active: true, pct: 100, color: '#6366f1' }
    ];
  }, []);

  // AI observations generated dynamically
  const aiInsights = useMemo(() => {
    const list = [];
    const highEducationCount = allMembersRaw.filter(m => 
      ['Graduate / Bachelor', 'Post Graduate / Master', 'Doctorate (PhD)'].includes(m.qualification)
    ).length;
    const higherEducationPct = Math.round((highEducationCount / allMembersRaw.length) * 100);

    if (higherEducationPct > 50) {
      list.push({
        id: 'ai-1',
        title: 'High Educational Achievement Rate',
        desc: `Your family's higher education rate (${higherEducationPct}%) is significantly higher than the national census average of 28%.`,
        type: 'success',
        stat: `${higherEducationPct}%`
      });
    }

    const workingAgeCount = allMembersRaw.filter(m => {
      const age = calculateAge(m.dob);
      return age >= 18 && age < 60;
    }).length;
    const workingAgePct = Math.round((workingAgeCount / allMembersRaw.length) * 100);

    if (workingAgePct >= 50) {
      list.push({
        id: 'ai-2',
        title: 'Working-Age Demographic Strength',
        desc: `Most household members (${workingAgePct}%) fall in the working-age range (18-59 yrs), which strengthens household financial security.`,
        type: 'info',
        stat: `${workingAgePct}%`
      });
    }

    const sizeGrowth = Math.round(((8 - 5) / 5) * 100);
    list.push({
      id: 'ai-3',
      title: 'Steady Household Expansion',
      desc: `Family structure increased by ${sizeGrowth}% over the last 3 years, indicating growth in next-generation representation.`,
      type: 'trend',
      stat: `+${sizeGrowth}%`
    });

    return list;
  }, [allMembersRaw]);

  // Reset all filters
  const handleResetFilters = () => {
    setFilterAgeGroup('All');
    setFilterGender('All');
    setFilterEducation('All');
    setFilterEmployment('All');
    setDateRange('Last 3 Years');
  };

  // Export report mockup with progress animation
  const handleStartExport = (format) => {
    if (exporting) return;
    setExporting(true);
    setExportType(format);
    setExportProgress(0);
    setSuccessMessage('');

    const interval = setInterval(() => {
      setExportProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setExporting(false);
            setSuccessMessage(`Analytics Report exported successfully as ${format.toUpperCase()}!`);
          }, 300);
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  // Saved custom view management
  const handleSaveCustomView = (e) => {
    e.preventDefault();
    if (!newViewName.trim()) return;
    const viewObj = {
      id: Date.now(),
      name: newViewName.trim(),
      filters: { filterAgeGroup, filterGender, filterEducation, filterEmployment, dateRange }
    };
    setSavedViews(prev => [...prev, viewObj]);
    setNewViewName('');
    setShowSaveViewModal(false);
    setSuccessMessage(`Custom View "${viewObj.name}" saved!`);
  };

  const handleApplySavedView = (view) => {
    setFilterAgeGroup(view.filters.filterAgeGroup);
    setFilterGender(view.filters.filterGender);
    setFilterEducation(view.filters.filterEducation);
    setFilterEmployment(view.filters.filterEmployment);
    setDateRange(view.filters.dateRange);
    setSuccessMessage(`Custom View "${view.name}" applied successfully.`);
  };

  const handleDeleteSavedView = (id, e) => {
    e.stopPropagation();
    setSavedViews(prev => prev.filter(v => v.id !== id));
  };

  // Custom donut calculations â€” each segment uses strokeDashoffset to position correctly
  const donutCircles = useMemo(() => {
    const total = ageDistribution.reduce((acc, curr) => acc + curr.count, 0);
    const radius = 40;
    const circumference = 2 * Math.PI * radius; // ~251.33
    let cumulativePercent = 0;

    return ageDistribution.map(cat => {
      const percentage = total === 0 ? 0 : (cat.count / total) * 100;
      // strokeDasharray = [visible length, gap]
      const dashLen = (percentage / 100) * circumference;
      const gapLen = circumference - dashLen;
      // offset moves the start of the dash around the circle;
      // we start at top (-90deg via transform) and advance clockwise
      const rotationDeg = (cumulativePercent / 100) * 360;
      cumulativePercent += percentage;
      return {
        ...cat,
        dashLen,
        gapLen,
        rotationDeg,
        pct: Math.round(percentage)
      };
    });
  }, [ageDistribution]);

  // SVG pie-slice path builder for employment chart
  const buildPieSlices = useMemo(() => {
    const cx = 80, cy = 80, r = 64;
    const total = employmentDistribution.reduce((s, d) => s + d.count, 0) || 1;
    let startAngle = -Math.PI / 2; // start at top

    return employmentDistribution.map((slice, idx) => {
      const fraction = slice.count / total;
      const angle = fraction * 2 * Math.PI;
      const endAngle = startAngle + angle;
      const x1 = cx + r * Math.cos(startAngle);
      const y1 = cy + r * Math.sin(startAngle);
      const x2 = cx + r * Math.cos(endAngle);
      const y2 = cy + r * Math.sin(endAngle);
      const largeArc = angle > Math.PI ? 1 : 0;
      const d = fraction === 0
        ? ''
        : fraction >= 1
          ? `M ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx - 0.001} ${cy - r} Z`
          : `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
      startAngle = endAngle;
      return { ...slice, d, fraction };
    });
  }, [employmentDistribution]);

  // Custom line points calculation for trends
  const linePoints = useMemo(() => {
    const width = 500;
    const height = 150;
    const padding = 30;
    const graphWidth = width - padding * 2;
    const graphHeight = height - padding * 2;

    const maxVal = 9; // Max family size/graduates limit for graph
    const xStep = graphWidth / (growthData.length - 1);

    const sizePoints = growthData.map((d, i) => {
      const x = padding + i * xStep;
      const y = height - padding - (d.size / maxVal) * graphHeight;
      return { x, y, val: d.size, year: d.year };
    });

    const gradPoints = growthData.map((d, i) => {
      const x = padding + i * xStep;
      const y = height - padding - (d.graduates / maxVal) * graphHeight;
      return { x, y, val: d.graduates, year: d.year };
    });

    const empPoints = growthData.map((d, i) => {
      const x = padding + i * xStep;
      const y = height - padding - (d.employed / maxVal) * graphHeight;
      return { x, y, val: d.employed, year: d.year };
    });

    return { sizePoints, gradPoints, empPoints, width, height, padding, graphWidth, graphHeight };
  }, [growthData]);

  return (
    <div className="flex-grow w-full bg-[#f8faff] dark:bg-[#030d1b] min-h-screen pb-16 relative transition-colors duration-300">
      
      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          SECTION 1: PAGE HEADER & BANNER
      â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
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
                Analytical Report
              </span>
              <span className="text-[10px] uppercase font-bold text-[#ff9933] bg-[#ff9933]/15 border border-[#ff9933]/25 px-3 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3 animate-spin" style={{ animationDuration: '4s' }} /> Family Intelligence Center
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 flex items-center gap-2.5">
              <Activity className="w-8 h-8 text-[#ff9933]" /> Family Analytics
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1.5 max-w-2xl font-light leading-relaxed">
              Explore demographic insights, education trends, employment patterns, and household growth statistics for your family.
            </p>
          </div>
          
          <div className="flex items-center flex-wrap gap-3.5">
            {/* Quick Toggle Live vs Demo */}
            <div className="flex items-center bg-white/5 border border-white/10 px-4 py-2 rounded-2xl backdrop-blur-md">
              <div className="text-right mr-3">
                <span className="block text-[8px] text-white/40 uppercase tracking-widest font-extrabold">Analytics Mode</span>
                <span className={`text-xs font-bold ${isDemoMode ? 'text-[#ff9933]' : 'text-[#10b981]'}`}>
                  {isDemoMode ? 'Simulated Demo' : 'Live Registry'}
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

            {/* Date Range Filter Selector */}
            <div className="flex flex-col bg-white/5 border border-white/10 px-4 py-1.5 rounded-2xl backdrop-blur-md">
              <span className="text-[8px] text-slate-350 uppercase tracking-widest font-bold">Analytics Date Range</span>
              <select 
                value={dateRange} 
                onChange={(e) => setDateRange(e.target.value)}
                className="bg-transparent text-white border-none text-xs font-bold focus:ring-0 p-0 cursor-pointer outline-none"
              >
                <option value="Current Year" className="text-[#0b2447] bg-white">Current Year</option>
                <option value="Last 3 Years" className="text-[#0b2447] bg-white">Last 3 Years (2022-2025)</option>
                <option value="All Time" className="text-[#0b2447] bg-white">All Time Records</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8">

        {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
            SYSTEM MESSAGES / TOASTS
        â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        {successMessage && (
          <div className="bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-300 text-xs p-4 rounded-2xl border border-green-200 dark:border-green-800 mb-6 flex items-start justify-between gap-2.5 shadow-sm animate-fade-in">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 shrink-0 mt-0.5 text-green-600 dark:text-green-400" />
              <span>{successMessage}</span>
            </div>
            <button onClick={() => setSuccessMessage('')} className="text-slate-450 hover:text-slate-650 cursor-pointer">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {isDemoMode && (
          <div className="bg-amber-50 dark:bg-amber-950/20 text-amber-900 dark:text-amber-300 text-xs p-4 rounded-2xl border border-amber-250 dark:border-amber-800 mb-6 flex items-start gap-2.5 shadow-sm">
            <Info className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
            <div>
              <p className="font-bold">Demonstration Registry Mode Active</p>
              <p className="text-amber-700 dark:text-amber-400/80 mt-0.5">Showing mock family data (8 members) to demonstrate complex breakdowns, education parameters, and growth line graphs. Toggle "Analytics Mode" above to review your live database submission.</p>
            </div>
          </div>
        )}

        {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
            SECTION 2: FAMILY OVERVIEW SUMMARY (Metric Cards)
        â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {[
            { label: 'Total Family Members', value: metrics.total, desc: 'Registered count', color: '#0b2447', text: 'text-[#0b2447] dark:text-white', icon: Users, bg: 'bg-[#0b2447]/5 dark:bg-blue-950/20' },
            { label: 'Average Family Age', value: metrics.avgAge, desc: 'Years average', color: '#3b82f6', text: 'text-blue-600 dark:text-blue-400', icon: Calendar, bg: 'bg-blue-50 dark:bg-blue-950/20' },
            { label: 'Working Members', value: metrics.working, desc: 'Income contributors', color: '#10b981', text: 'text-green-600 dark:text-green-400', icon: Briefcase, bg: 'bg-green-50 dark:bg-green-950/20' },
            { label: 'Students', value: metrics.students, desc: 'In academic stream', color: '#6366f1', text: 'text-indigo-600 dark:text-indigo-400', icon: GraduationCap, bg: 'bg-indigo-50 dark:bg-indigo-950/20' },
            { label: 'Senior Citizens', value: metrics.seniors, desc: 'Age 60 or above', color: '#f59e0b', text: 'text-amber-600 dark:text-amber-400', icon: Heart, bg: 'bg-amber-50 dark:bg-amber-950/20' }
          ].map((card, i) => {
            const Icon = card.icon;
            return (
              <div key={i} className="bg-white dark:bg-[#09172a] rounded-2xl p-5 border border-slate-100 dark:border-white/10 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider leading-snug">{card.label}</span>
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${card.bg}`}>
                    <Icon className="w-4.5 h-4.5 text-[#ff9933]" />
                  </div>
                </div>
                <div>
                  <h3 className={`text-2xl sm:text-3xl font-extrabold leading-none ${card.text}`}>
                    {card.value}
                  </h3>
                  <p className="text-[9px] text-slate-400 mt-1">{card.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
            SECTION 9: FILTERS & CUSTOMIZATION PANEL
        â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        <div className="bg-white dark:bg-[#09172a] border border-slate-100 dark:border-white/10 rounded-2xl p-5 mb-8 shadow-sm">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-white/5 pb-3">
            <h2 className="text-xs uppercase font-extrabold text-[#0b2447] dark:text-white flex items-center gap-1.5">
              <Filter className="w-4 h-4 text-[#ff9933]" /> Filters & View Settings
            </h2>
            <div className="flex gap-2">
              <button 
                onClick={handleResetFilters}
                className="text-[10px] font-bold text-slate-400 hover:text-primary transition-colors cursor-pointer flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" /> Reset Filters
              </button>
              <button 
                onClick={() => setShowSaveViewModal(true)}
                className="bg-[#0b2447]/5 dark:bg-white/5 text-[#0b2447] dark:text-white hover:bg-[#0b2447]/10 text-[10px] font-bold px-3 py-1 rounded-lg transition-colors cursor-pointer"
              >
                Save View
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Age filter */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Age Bracket</label>
              <select 
                value={filterAgeGroup} 
                onChange={(e) => setFilterAgeGroup(e.target.value)}
                className="bg-slate-50 dark:bg-[#0d1e36] text-xs font-semibold text-[#0b2447] dark:text-white border border-slate-150 dark:border-white/10 rounded-xl px-3 py-2 outline-none focus:border-primary"
              >
                <option value="All">All Ages</option>
                <option value="Children">Children (0 - 17)</option>
                <option value="Adults">Adults (18 - 59)</option>
                <option value="Seniors">Senior Citizens (60+)</option>
              </select>
            </div>

            {/* Gender filter */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Gender</label>
              <select 
                value={filterGender} 
                onChange={(e) => setFilterGender(e.target.value)}
                className="bg-slate-50 dark:bg-[#0d1e36] text-xs font-semibold text-[#0b2447] dark:text-white border border-slate-150 dark:border-white/10 rounded-xl px-3 py-2 outline-none focus:border-primary"
              >
                <option value="All">All Genders</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            {/* Education filter */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Education Stream</label>
              <select 
                value={filterEducation} 
                onChange={(e) => setFilterEducation(e.target.value)}
                className="bg-slate-50 dark:bg-[#0d1e36] text-xs font-semibold text-[#0b2447] dark:text-white border border-slate-150 dark:border-white/10 rounded-xl px-3 py-2 outline-none focus:border-primary"
              >
                <option value="All">All Qualifications</option>
                <option value="School">School Level (K-12)</option>
                <option value="Higher Ed">Higher Education (Graduate+)</option>
                <option value="Graduate / Bachelor">Bachelor's Degree</option>
                <option value="Post Graduate / Master">Master's Degree</option>
                <option value="Primary School">Primary Education</option>
              </select>
            </div>

            {/* Employment filter */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Employment Status</label>
              <select 
                value={filterEmployment} 
                onChange={(e) => setFilterEmployment(e.target.value)}
                className="bg-slate-50 dark:bg-[#0d1e36] text-xs font-semibold text-[#0b2447] dark:text-white border border-slate-150 dark:border-white/10 rounded-xl px-3 py-2 outline-none focus:border-primary"
              >
                <option value="All">All Occupations</option>
                <option value="Employed">Employed</option>
                <option value="Self Employed">Self Employed</option>
                <option value="Student">Student</option>
                <option value="Retired">Retired</option>
                <option value="Unemployed">Unemployed / Homemaker</option>
              </select>
            </div>
          </div>

          {/* Saved Views List */}
          {savedViews.length > 0 && (
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/5">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mr-2">Saved Custom Views:</span>
              <div className="inline-flex gap-2 flex-wrap">
                {savedViews.map(view => (
                  <button
                    key={view.id}
                    onClick={() => handleApplySavedView(view)}
                    className="bg-[#f0f4fa] dark:bg-[#0d1e36] hover:bg-[#e2eaf5] text-[10px] font-semibold text-[#0b2447] dark:text-slate-200 px-2.5 py-1 rounded-full inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>{view.name}</span>
                    <span 
                      onClick={(e) => handleDeleteSavedView(view.id, e)}
                      className="w-3.5 h-3.5 hover:bg-slate-300 dark:hover:bg-slate-700 rounded-full flex items-center justify-center text-slate-450"
                    >
                      <X className="w-2 h-2" />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
            SECTION 3: FAMILY DEMOGRAPHICS & BREAKDOWN
        â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          
          {/* Donut Chart: Age Distribution (7 of 12 Columns) */}
          <div className="lg:col-span-7 bg-white dark:bg-[#09172a] border border-slate-100 dark:border-white/10 rounded-3xl p-6 shadow-sm flex flex-col justify-between min-h-[380px] overflow-hidden">
            <div>
              <div className="flex justify-between items-start border-b border-slate-100 dark:border-white/5 pb-3.5">
                <div>
                  <h3 className="font-extrabold text-sm text-[#0b2447] dark:text-white uppercase tracking-wider">
                    Age Distribution Breakdown
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">Demographic classification segments in your family.</p>
                </div>
                <span className="text-[9px] font-bold text-slate-400 bg-slate-50 dark:bg-[#0d1e36] px-2 py-0.5 rounded">
                  Hover for details
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-6 mt-6">
                
                {/* SVG Donut Chart */}
                <div className="flex justify-center shrink-0">
                  <div className="relative" style={{ width: 180, height: 180 }}>
                    <svg width="180" height="180" viewBox="0 0 100 100">
                      {/* Track ring */}
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#f1f5f9" strokeWidth="12" className="dark:opacity-20" />
                      {donutCircles.map((circle, idx) => {
                        const isHovered = hoveredAgeCategory === circle.name;
                        if (circle.dashLen < 0.1) return null;
                        return (
                          <circle
                            key={idx}
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke={circle.color}
                            strokeWidth={isHovered ? 14 : 12}
                            strokeDasharray={`${circle.dashLen} ${circle.gapLen}`}
                            strokeDashoffset="0"
                            transform={`rotate(${circle.rotationDeg - 90} 50 50)`}
                            className="transition-all duration-300 cursor-pointer"
                            onMouseEnter={() => setHoveredAgeCategory(circle.name)}
                            onMouseLeave={() => setHoveredAgeCategory(null)}
                            onClick={() => {
                              setSelectedAgeCategory(selectedAgeCategory === circle.name ? null : circle.name);
                              setSelectedEducationCategory(null);
                              setSelectedEmploymentCategory(null);
                            }}
                          />
                        );
                      })}
                    </svg>
                    {/* Central Text overlay â€” anchored to SVG bounds */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                      <span className="text-2xl font-extrabold text-[#0b2447] dark:text-white leading-none">{metrics.total}</span>
                      <span className="text-[8px] text-slate-400 uppercase font-bold tracking-wider mt-0.5">Members</span>
                    </div>
                  </div>
                </div>

                {/* Legend list */}
                <div className="flex-1 min-w-0 space-y-3">
                  {donutCircles.map((circle, idx) => {
                    const isHovered = hoveredAgeCategory === circle.name;
                    const isSelected = selectedAgeCategory === circle.name;
                    return (
                      <div 
                        key={idx} 
                        className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                          isHovered ? 'bg-[#f0f4fa]/50 dark:bg-blue-950/20 border-slate-200' : 
                          isSelected ? 'bg-[#0b2447] dark:bg-blue-950 text-white border-transparent' : 
                          'border-transparent hover:bg-slate-50 dark:hover:bg-[#0d1e36]'
                        }`}
                        onMouseEnter={() => setHoveredAgeCategory(circle.name)}
                        onMouseLeave={() => setHoveredAgeCategory(null)}
                        onClick={() => {
                          setSelectedAgeCategory(selectedAgeCategory === circle.name ? null : circle.name);
                          setSelectedEducationCategory(null);
                          setSelectedEmploymentCategory(null);
                        }}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: circle.color }} />
                            <span className="text-xs font-bold truncate leading-none">{circle.name}</span>
                          </div>
                          <span className="text-xs font-mono font-extrabold leading-none">{circle.pct}%</span>
                        </div>
                        <div className="flex justify-between items-center text-[9px] text-slate-400 mt-1.5">
                          <span>{circle.range}</span>
                          <span className="font-bold">{circle.count} Members</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-[11px] text-slate-450 dark:text-slate-400">
              <span className="font-semibold italic">Insight: Most family members belong to the Adult category.</span>
              <span className="text-[10px] text-primary flex items-center gap-0.5">Click legend to filter list</span>
            </div>
          </div>

          {/* Horizontal Bar Chart: Education Distribution (5 of 12 Columns) */}
          <div className="lg:col-span-5 bg-white dark:bg-[#09172a] border border-slate-100 dark:border-white/10 rounded-3xl p-6 shadow-sm flex flex-col justify-between min-h-[380px] overflow-hidden">
            <div>
              <div className="flex justify-between items-start border-b border-slate-100 dark:border-white/5 pb-3.5">
                <div>
                  <h3 className="font-extrabold text-sm text-[#0b2447] dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                    Education Qualifications
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">Educational qualifications of members.</p>
                </div>
              </div>

              <div className="space-y-3.5 mt-5">
                {educationDistribution.map((qual, idx) => {
                  const isHovered = hoveredEducationCategory === qual.name;
                  const isSelected = selectedEducationCategory === qual.name;
                  
                  return (
                    <div 
                      key={idx} 
                      className={`group cursor-pointer rounded-xl p-1 transition-all ${
                        isHovered ? 'bg-[#f0f4fa]/50 dark:bg-blue-950/20' : 
                        isSelected ? 'bg-orange-50 dark:bg-orange-950/20' : ''
                      }`}
                      onMouseEnter={() => setHoveredEducationCategory(qual.name)}
                      onMouseLeave={() => setHoveredEducationCategory(null)}
                      onClick={() => {
                        setSelectedEducationCategory(selectedEducationCategory === qual.name ? null : qual.name);
                        setSelectedAgeCategory(null);
                        setSelectedEmploymentCategory(null);
                      }}
                    >
                      <div className="flex justify-between text-[10px] font-bold text-slate-450 dark:text-slate-450 mb-1">
                        <span className="truncate pr-2 group-hover:text-primary transition-colors text-slate-800 dark:text-slate-200">{qual.name}</span>
                        <span className="font-mono text-slate-900 dark:text-slate-200 font-extrabold">{qual.count} ({qual.pct}%)</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-[#0d1e36] h-2.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-[#ff9933] h-full rounded-full transition-all duration-500" 
                          style={{ width: `${qual.pct}%` }} 
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-white/5 text-[11px] text-slate-450 dark:text-slate-400 italic">
              Insight: 62% of family members have completed higher education.
            </div>
          </div>
        </div>

        {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
            DRILL DOWN DISPLAY FOR ACTIVE SELECTIONS
        â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        {(selectedAgeCategory || selectedEducationCategory || selectedEmploymentCategory) && (
          <div className="bg-[#eff4ff] dark:bg-[#091d38]/50 border border-[#3b82f6]/20 rounded-3xl p-5 mb-8 animate-fade-in flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[9px] uppercase font-bold text-blue-700 dark:text-blue-400 tracking-wider">Filtered Segment Analysis</span>
                <h4 className="text-sm font-extrabold text-[#0b2447] dark:text-white">
                  Members matching: {selectedAgeCategory || selectedEducationCategory || selectedEmploymentCategory}
                </h4>
              </div>
              <button 
                onClick={() => {
                  setSelectedAgeCategory(null);
                  setSelectedEducationCategory(null);
                  setSelectedEmploymentCategory(null);
                }} 
                className="text-slate-450 hover:text-slate-650 dark:hover:text-slate-200 cursor-pointer text-xs font-bold bg-white dark:bg-[#0d1e36] px-3 py-1 rounded-xl shadow-sm"
              >
                Clear Drill-down
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {filteredMembers.filter(m => {
                if (selectedAgeCategory) {
                  const age = calculateAge(m.dob);
                  if (selectedAgeCategory === 'Children') return age < 18;
                  if (selectedAgeCategory === 'Adults') return age >= 18 && age < 60;
                  if (selectedAgeCategory === 'Senior Citizens') return age >= 60;
                }
                if (selectedEducationCategory) {
                  if (selectedEducationCategory === 'Primary Education') return m.qualification === 'Primary School';
                  if (selectedEducationCategory === 'Secondary Education') return ['Middle School', 'High School (10th)'].includes(m.qualification);
                  if (selectedEducationCategory === 'Higher Secondary') return ['Senior Secondary (12th)', 'Diploma'].includes(m.qualification);
                  if (selectedEducationCategory === 'Graduate') return m.qualification === 'Graduate / Bachelor';
                  if (selectedEducationCategory === 'Post Graduate') return m.qualification === 'Post Graduate / Master';
                  if (selectedEducationCategory === 'Professional Qualification') return m.qualification === 'Doctorate (PhD)';
                }
                if (selectedEmploymentCategory) {
                  return m.employmentStatus === selectedEmploymentCategory;
                }
                return true;
              }).map((member, idx) => (
                <div key={idx} className="bg-white dark:bg-[#09172a] rounded-2xl p-4 border border-slate-100 dark:border-white/10 shadow-sm flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#0b2447] text-white flex items-center justify-center font-extrabold text-sm shrink-0">
                    {renderAvatarLetter(member.fullName)}
                  </div>
                  <div className="min-w-0">
                    <h5 className="text-xs font-extrabold text-[#0b2447] dark:text-white truncate">{member.fullName}</h5>
                    <p className="text-[9px] text-slate-400 truncate mt-0.5">{member.relationship} Â· Age {calculateAge(member.dob)}</p>
                    <p className="text-[9px] text-[#ff9933] font-semibold truncate mt-0.5">{member.qualification}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
            EMPLOYMENT DISTRIBUTION & RESOURCE COMPARISON
        â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          
          {/* Employment Cards & Pie */}
          <div className="bg-white dark:bg-[#09172a] border border-slate-100 dark:border-white/10 rounded-3xl p-6 shadow-sm min-h-[380px]">
            <div>
              <div className="flex justify-between items-start border-b border-slate-100 dark:border-white/5 pb-3.5">
                <div>
                  <h3 className="font-extrabold text-sm text-[#0b2447] dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                    Employment distribution
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">Occupational breakdowns and job status indicators.</p>
                </div>
              </div>

              <div className="flex gap-4 mt-6 w-full">
                
                {/* Visual Cards list */}
                <div className="flex-1 min-w-0 space-y-2">
                  {employmentDistribution.map((emp, idx) => {
                    const isHovered = hoveredEmploymentCategory === emp.name;
                    const isSelected = selectedEmploymentCategory === emp.name;
                    
                    return (
                      <div 
                        key={idx}
                        className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                          isHovered ? 'bg-[#f0f4fa]/50 dark:bg-blue-950/20 border-slate-200' : 
                          isSelected ? 'bg-[#0b2447] dark:bg-blue-950 text-white border-transparent' : 
                          'bg-slate-50/50 dark:bg-[#0d1e36]/30 border-slate-100 dark:border-white/5 hover:border-slate-200'
                        }`}
                        onMouseEnter={() => setHoveredEmploymentCategory(emp.name)}
                        onMouseLeave={() => setHoveredEmploymentCategory(null)}
                        onClick={() => {
                          setSelectedEmploymentCategory(selectedEmploymentCategory === emp.name ? null : emp.name);
                          setSelectedAgeCategory(null);
                          setSelectedEducationCategory(null);
                        }}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: emp.color }} />
                          <span className="text-xs font-bold leading-none truncate">{emp.name}</span>
                        </div>
                        <div className="text-right ml-2 shrink-0">
                          <span className="block text-xs font-extrabold font-mono leading-none">{emp.count}</span>
                          <span className="text-[8px] text-slate-400 font-bold block mt-0.5">{emp.pct}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-center shrink-0">
                  <svg width="150" height="150" viewBox="0 0 160 160">
                    {buildPieSlices.map((slice, idx) => (
                      slice.d ? (
                        <path
                          key={idx}
                          d={slice.d}
                          fill={slice.color}
                          opacity={hoveredEmploymentCategory === slice.name ? 1 : 0.85}
                          className="transition-all duration-300 cursor-pointer"
                          onMouseEnter={() => setHoveredEmploymentCategory(slice.name)}
                          onMouseLeave={() => setHoveredEmploymentCategory(null)}
                          onClick={() => {
                            setSelectedEmploymentCategory(selectedEmploymentCategory === slice.name ? null : slice.name);
                            setSelectedAgeCategory(null);
                            setSelectedEducationCategory(null);
                          }}
                        />
                      ) : null
                    ))}
                    {/* Center hole */}
                    <circle cx="80" cy="80" r="36" fill="#ffffff" className="dark:fill-[#09172a]" />
                    {/* Center label */}
                    <text x="80" y="76" textAnchor="middle" fontSize="13" fontWeight="800" fill="#0b2447" className="dark:fill-white">
                      {filteredMembers.length}
                    </text>
                    <text x="80" y="90" textAnchor="middle" fontSize="7" fontWeight="700" fill="#94a3b8">
                      MEMBERS
                    </text>
                  </svg>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-white/5 text-[11px] text-slate-400 italic">
              Insight: 50% of family members are currently employed.
            </div>
          </div>

          {/* Household Resource Analytics */}
          <div className="bg-white dark:bg-[#09172a] border border-slate-100 dark:border-white/10 rounded-3xl p-6 shadow-sm min-h-[380px]">
            <div>
              <div className="flex justify-between items-start border-b border-slate-100 dark:border-white/5 pb-3.5">
                <div>
                  <h3 className="font-extrabold text-sm text-[#0b2447] dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                    Household Resources
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">Living standards, utilities access, and ownership profiles.</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-6">
                {resourceMetrics.map((res, idx) => {
                  const isHovered = hoveredResource === res.name;
                  return (
                    <div 
                      key={idx}
                      className={`p-4 rounded-2xl border transition-all ${
                        isHovered ? 'bg-[#f0f4fa]/50 dark:bg-blue-950/20 border-slate-200' : 'bg-slate-50/50 dark:bg-[#0d1e36]/30 border-slate-100 dark:border-white/5'
                      }`}
                      onMouseEnter={() => setHoveredResource(res.name)}
                      onMouseLeave={() => setHoveredResource(null)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider">{res.name}</span>
                        <Check className="w-3.5 h-3.5 text-[#10b981]" />
                      </div>
                      <p className="text-xs font-semibold text-[#0b2447] dark:text-white truncate leading-relaxed">{res.status}</p>
                      <div className="w-full bg-slate-200/50 dark:bg-[#0d1e36] h-1.5 rounded-full overflow-hidden mt-3">
                        <div 
                          className="h-full rounded-full transition-all" 
                          style={{ width: `${res.pct}%`, backgroundColor: res.color }} 
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-white/5 text-[11px] text-slate-450 dark:text-slate-400 italic">
              Insight: Full utility saturation achieved in energy and internet sectors.
            </div>
          </div>
        </div>

        {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
            SECTION 4: HOUSEHOLD INSIGHTS (Trends Over Time)
        â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        <div className="bg-white dark:bg-[#09172a] border border-slate-100 dark:border-white/10 rounded-3xl p-6 shadow-sm mb-8">
          <div className="flex justify-between items-start border-b border-slate-100 dark:border-white/5 pb-4">
            <div>
              <h3 className="font-extrabold text-sm text-[#0b2447] dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                Household Growth & Progression Timeline
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Demographics, graduates, and employment metrics tracked from 2022 to 2025.</p>
            </div>
            <div className="flex gap-4 text-[9px] font-bold">
              <span className="flex items-center gap-1 text-[#ff9933]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff9933]" /> Family Size
              </span>
              <span className="flex items-center gap-1 text-[#3b82f6]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#3b82f6]" /> Graduates
              </span>
              <span className="flex items-center gap-1 text-[#10b981]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" /> Working Members
              </span>
            </div>
          </div>

          <div className="relative mt-6 flex justify-center">
            {/* Custom Interactive SVG Line Chart */}
            <svg 
              width="100%" 
              height="160" 
              viewBox={`0 0 ${linePoints.width} ${linePoints.height}`}
              preserveAspectRatio="xMidYMid meet"
              className="overflow-visible"
            >
              {/* Grid Lines */}
              {[0, 1, 2, 3].map((val, idx) => {
                const y = linePoints.padding + idx * (linePoints.graphHeight / 3);
                return (
                  <line 
                    key={idx} 
                    x1={linePoints.padding} 
                    y1={y} 
                    x2={linePoints.width - linePoints.padding} 
                    y2={y} 
                    stroke="#e2e8f0" 
                    strokeWidth="0.5" 
                    strokeDasharray="4 4" 
                    className="dark:stroke-white/5"
                  />
                );
              })}

              {/* X Axis Labels */}
              {growthData.map((d, i) => {
                const x = linePoints.padding + i * (linePoints.graphWidth / (growthData.length - 1));
                return (
                  <text 
                    key={i} 
                    x={x} 
                    y={linePoints.height - 10} 
                    textAnchor="middle" 
                    className="fill-slate-400 text-[10px] font-bold"
                  >
                    {d.year}
                  </text>
                );
              })}

              {/* Draw Lines */}
              {/* 1. Family Size Line (Orange) */}
              <path
                d={`M ${linePoints.sizePoints.map(p => `${p.x} ${p.y}`).join(' L ')}`}
                fill="none"
                stroke="#ff9933"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* 2. Graduates Line (Blue) */}
              <path
                d={`M ${linePoints.gradPoints.map(p => `${p.x} ${p.y}`).join(' L ')}`}
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* 3. Employed Line (Green) */}
              <path
                d={`M ${linePoints.empPoints.map(p => `${p.x} ${p.y}`).join(' L ')}`}
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Interactive Hover Dots */}
              {growthData.map((d, i) => {
                const sp = linePoints.sizePoints[i];
                const gp = linePoints.gradPoints[i];
                const ep = linePoints.empPoints[i];
                const isHovered = hoveredGrowthYear === d.year;

                return (
                  <g key={i} className="cursor-pointer" onMouseEnter={() => setHoveredGrowthYear(d.year)} onMouseLeave={() => setHoveredGrowthYear(null)}>
                    {/* Background indicator block on hover */}
                    {isHovered && (
                      <rect 
                        x={sp.x - 18} 
                        y={linePoints.padding} 
                        width="36" 
                        height={linePoints.graphHeight} 
                        fill="rgba(59, 130, 246, 0.05)" 
                        rx="4"
                      />
                    )}
                    {/* Orange Dot */}
                    <circle 
                      cx={sp.x} 
                      cy={sp.y} 
                      r={isHovered ? 6 : 4} 
                      fill="#ff9933" 
                      stroke="#ffffff" 
                      strokeWidth="2" 
                    />
                    {/* Blue Dot */}
                    <circle 
                      cx={gp.x} 
                      cy={gp.y} 
                      r={isHovered ? 5.5 : 4} 
                      fill="#3b82f6" 
                      stroke="#ffffff" 
                      strokeWidth="2" 
                    />
                    {/* Green Dot */}
                    <circle 
                      cx={ep.x} 
                      cy={ep.y} 
                      r={isHovered ? 5.5 : 4} 
                      fill="#10b981" 
                      stroke="#ffffff" 
                      strokeWidth="2" 
                    />
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Interactive Tooltip Card under the graph */}
          <div className="mt-4 p-4 bg-slate-50 dark:bg-[#0d1e36] rounded-2xl border border-slate-100 dark:border-white/5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-[9px] uppercase font-bold text-slate-450 dark:text-slate-400 block tracking-wider">Active Year Focus</span>
              <h4 className="text-xs font-extrabold text-[#0b2447] dark:text-white mt-0.5">
                {hoveredGrowthYear ? `Year ${hoveredGrowthYear} Growth Parameters` : 'Hover graph points to review parameters'}
              </h4>
            </div>

            {hoveredGrowthYear ? (
              <div className="flex gap-6">
                <div className="flex flex-col">
                  <span className="text-[8px] uppercase font-bold text-slate-450 dark:text-slate-400">Family Size</span>
                  <span className="text-xs font-mono font-extrabold text-[#ff9933]">
                    {growthData.find(d => d.year === hoveredGrowthYear)?.size} Members
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[8px] uppercase font-bold text-slate-450 dark:text-slate-400">Total Graduates</span>
                  <span className="text-xs font-mono font-extrabold text-[#3b82f6]">
                    {growthData.find(d => d.year === hoveredGrowthYear)?.graduates} Graduates
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[8px] uppercase font-bold text-slate-450 dark:text-slate-400">Employed</span>
                  <span className="text-xs font-mono font-extrabold text-[#10b981]">
                    {growthData.find(d => d.year === hoveredGrowthYear)?.employed} Working
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-[11px] text-slate-450 italic">
                Family size increased by 60% over the last three years.
              </div>
            )}
          </div>
        </div>

        {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
            SECTION 6: AI FAMILY INSIGHTS & COMPARISON
        â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          
          {/* AI insights list */}
          <div className="bg-white dark:bg-[#09172a] border border-slate-100 dark:border-white/10 rounded-3xl p-6 shadow-sm flex flex-col justify-between min-h-[380px]">
            <div>
              <div className="flex justify-between items-start border-b border-slate-100 dark:border-white/5 pb-3.5">
                <div>
                  <h3 className="font-extrabold text-sm text-[#0b2447] dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Bot className="w-5 h-5 text-[#ff9933] animate-pulse" /> AI Family Insights
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">Demographics and educational milestones analysed by AI.</p>
                </div>
              </div>

              <div className="space-y-3.5 mt-5">
                {aiInsights.map((insight) => (
                  <div 
                    key={insight.id} 
                    className="p-4 rounded-2xl border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-[#0d1e36]/30 flex items-start gap-3.5 group hover:border-[#ff9933]/30 transition-all duration-300"
                  >
                    <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/50 flex items-center justify-center shrink-0">
                      <Sparkles className="w-4.5 h-4.5 text-[#ff9933]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-xs font-bold text-[#0b2447] dark:text-white">{insight.title}</h4>
                        <span className="text-[9px] font-mono font-extrabold px-1.5 py-0.5 bg-orange-100/50 dark:bg-orange-950/50 text-[#ff9933] rounded">
                          {insight.stat}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-450 mt-1 leading-relaxed">{insight.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendation Panel */}
            <div className="mt-5 p-3.5 bg-indigo-50/50 dark:bg-indigo-950/10 border border-indigo-150/20 rounded-2xl flex items-center gap-3">
              <Sparkle className="w-4 h-4 text-indigo-500 shrink-0" />
              <p className="text-[10.5px] text-indigo-900 dark:text-indigo-300 leading-snug">
                <strong>AI recommendation:</strong> Completing further professional registrations for eligible adult members will unlock local government employment benefits.
              </p>
            </div>
          </div>

          {/* FAMILY COMPARISON ANALYTICS */}
          <div className="bg-white dark:bg-[#09172a] border border-slate-100 dark:border-white/10 rounded-3xl p-6 shadow-sm flex flex-col justify-between min-h-[380px]">
            <div>
              <div className="flex justify-between items-start border-b border-slate-100 dark:border-white/5 pb-3.5">
                <div>
                  <h3 className="font-extrabold text-sm text-[#0b2447] dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                    Family Comparison Analytics
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">Side-by-side comparison of internal household profiles.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                
                {/* Age & Gender side-by-side */}
                <div className="bg-slate-50/50 dark:bg-[#0d1e36]/30 border border-slate-100 dark:border-white/5 p-4 rounded-2xl">
                  <span className="text-[9px] uppercase font-bold text-slate-450 dark:text-slate-400 tracking-wider">Gender Ratio</span>
                  <div className="flex items-center gap-3 mt-2.5">
                    <div className="flex-1">
                      <div className="flex justify-between text-[10px] text-slate-450 mb-1">
                        <span>Male (4)</span>
                        <span>Female (4)</span>
                      </div>
                      <div className="w-full h-3 rounded-full flex overflow-hidden">
                        <div className="bg-blue-500 h-full" style={{ width: '50%' }} />
                        <div className="bg-pink-500 h-full" style={{ width: '50%' }} />
                      </div>
                    </div>
                  </div>
                  <p className="text-[9px] text-slate-400 mt-3.5 leading-snug">
                    Perfect gender parity (1:1 ratio) exists within the registered active census registry.
                  </p>
                </div>

                {/* Literacy Benchmarking comparison */}
                <div className="bg-slate-50/50 dark:bg-[#0d1e36]/30 border border-slate-100 dark:border-white/5 p-4 rounded-2xl">
                  <span className="text-[9px] uppercase font-bold text-slate-450 dark:text-slate-400 tracking-wider">Literacy Benchmarking</span>
                  <div className="space-y-2 mt-2">
                    <div>
                      <div className="flex justify-between text-[9px] font-bold text-slate-450 mb-1">
                        <span>Household Literacy</span>
                        <span>100%</span>
                      </div>
                      <div className="w-full bg-slate-200/50 dark:bg-[#0d1e36] h-1.5 rounded-full overflow-hidden">
                        <div className="bg-green-500 h-full" style={{ width: '100%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[9px] font-bold text-slate-450 mb-1">
                        <span>National Average</span>
                        <span>77%</span>
                      </div>
                      <div className="w-full bg-slate-200/50 dark:bg-[#0d1e36] h-1.5 rounded-full overflow-hidden">
                        <div className="bg-indigo-500 h-full" style={{ width: '77%' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-white/5 text-[11px] text-slate-450 dark:text-slate-400 italic">
              Insight: Education rates rank in the top 10% for municipal areas.
            </div>
          </div>
        </div>

        {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
            SECTION 8: REPORT EXPORT CENTER
        â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        <div className="bg-white dark:bg-[#09172a] border border-slate-100 dark:border-white/10 rounded-3xl p-6 shadow-sm mb-8">
          <div className="border-b border-slate-100 dark:border-white/5 pb-3.5 mb-5">
            <h3 className="font-extrabold text-sm text-[#0b2447] dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              Report Export Center
            </h3>
            <p className="text-[10px] text-slate-400 mt-0.5 font-light">Download consolidated demographic profiles and employment trends reports.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { format: 'pdf', label: 'PDF Document (.pdf)', desc: 'Full graphical intelligence report', size: '2.4 MB' },
              { format: 'excel', label: 'Excel Spreadsheet (.xlsx)', desc: 'Raw demographic tabular matrices', size: '1.1 MB' },
              { format: 'csv', label: 'CSV Data Matrix (.csv)', desc: 'Comma-separated values structure', size: '420 KB' }
            ].map((exp, idx) => (
              <div 
                key={idx}
                className="p-4 rounded-2xl border border-slate-150 dark:border-white/10 bg-slate-50/50 dark:bg-[#0d1e36]/30 flex flex-col justify-between gap-3 group hover:border-[#ff9933]/50 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-extrabold text-[#ff9933] uppercase">{exp.format} Format</span>
                    <span className="text-[9px] font-bold text-slate-400">{exp.size}</span>
                  </div>
                  <h4 className="text-xs font-bold text-[#0b2447] dark:text-white mt-1.5">{exp.label}</h4>
                  <p className="text-[9px] text-slate-450 dark:text-slate-400 mt-0.5 leading-snug">{exp.desc}</p>
                </div>

                <div className="mt-3">
                  {exporting && exportType === exp.format ? (
                    <div>
                      <div className="flex justify-between text-[8px] font-bold text-[#ff9933] mb-1">
                        <span>Compiling report data...</span>
                        <span>{exportProgress}%</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-[#0d1e36] h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-[#ff9933] h-full transition-all duration-300" 
                          style={{ width: `${exportProgress}%` }} 
                        />
                      </div>
                    </div>
                  ) : (
                    <button 
                      onClick={() => handleStartExport(exp.format)}
                      disabled={exporting}
                      className="w-full bg-[#0b2447] dark:bg-[#0d1e36] text-white hover:bg-slate-900 text-[10px] font-bold py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm disabled:opacity-50"
                    >
                      <Download className="w-3.5 h-3.5" /> Download Report
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
            SECTION 10: QUICK ACTIONS & CUSTOM VIEWS SHORTCUTS
        â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Quick Actions (7 Columns) */}
          <div className="lg:col-span-7 bg-white dark:bg-[#09172a] border border-slate-100 dark:border-white/10 rounded-3xl p-6 shadow-sm">
            <h3 className="font-extrabold text-sm text-[#0b2447] dark:text-white uppercase tracking-wider mb-4 border-b border-slate-100 dark:border-white/5 pb-3">
              Quick Shortcuts
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: 'View Family Profile', icon: Users, color: '#0b2447', action: () => navigate('/family') },
                { label: 'Add Family Member', icon: Plus, color: '#10b981', action: () => navigate('/family') },
                { label: 'Update Education Info', icon: GraduationCap, color: '#6366f1', action: () => navigate('/wizard?step=6') },
                { label: 'Update Employment Info', icon: Briefcase, color: '#ff9933', action: () => navigate('/wizard?step=7') },
                { label: 'Download Official Analytics', icon: Download, color: '#3b82f6', action: () => handleStartExport('pdf') }
              ].map((act, idx) => {
                const Icon = act.icon;
                return (
                  <button
                    key={idx}
                    onClick={act.action}
                    className="flex flex-col items-start gap-3 bg-[#f8faff] dark:bg-[#0d1e36]/30 hover:bg-[#eff4ff] dark:hover:bg-[#0d1e36]/60 border border-slate-100 dark:border-white/5 rounded-2xl p-4 transition-all hover:-translate-y-0.5 cursor-pointer text-left group"
                  >
                    <div className="w-8.5 h-8.5 rounded-xl flex items-center justify-center shrink-0 bg-white dark:bg-[#09172a] border border-slate-100 dark:border-white/5">
                      <Icon className="w-4 h-4" style={{ color: act.color }} />
                    </div>
                    <span className="text-[10.5px] font-bold text-[#0b2447] dark:text-slate-200 leading-snug group-hover:text-primary transition-colors">
                      {act.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* User Guide panel (5 Columns) */}
          <div className="lg:col-span-5 bg-white dark:bg-[#09172a] border border-slate-100 dark:border-white/10 rounded-3xl p-6 shadow-sm">
            <h3 className="font-extrabold text-sm text-[#0b2447] dark:text-white uppercase tracking-wider mb-3.5 border-b border-slate-100 dark:border-white/5 pb-2.5">
              Demographic Benchmark Guide
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ff9933] mt-1.5 shrink-0" />
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  <strong>Children Segment (0-17):</strong> Focuses on nutritional index and elementary school compliance registry.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#3b82f6] mt-1.5 shrink-0" />
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  <strong>Working-Age Group (18-59):</strong> Assesses workforce integration statistics, EPFO coverage, and skills profiles.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#10b981] mt-1.5 shrink-0" />
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  <strong>Senior Citizens (60+):</strong> Tracks digital pension disbursement verification and geriatric medical access logs.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Save Custom View Dialog Modal */}
      {showSaveViewModal && (
        <div className="fixed inset-0 z-50 bg-[#0b2447]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#09172a] border border-slate-100 dark:border-white/10 rounded-3xl p-6 max-w-sm w-full shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100 dark:border-white/5">
              <h4 className="text-sm font-extrabold text-[#0b2447] dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                Save View Parameters
              </h4>
              <button onClick={() => setShowSaveViewModal(false)} className="text-slate-450 hover:text-slate-650 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <form onSubmit={handleSaveCustomView} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider">Custom View Name</label>
                <input 
                  type="text" 
                  value={newViewName}
                  onChange={(e) => setNewViewName(e.target.value)}
                  placeholder="e.g. Higher Ed & Employed Only"
                  className="bg-slate-50 dark:bg-[#0d1e36] text-xs font-semibold text-[#0b2447] dark:text-white border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2.5 outline-none focus:border-primary w-full"
                  required
                />
              </div>

              <div className="bg-slate-50 dark:bg-[#0d1e36] p-3 rounded-2xl text-[10px] text-slate-500 border border-slate-100 dark:border-white/5 space-y-1">
                <span className="font-bold text-slate-450 dark:text-slate-400 block mb-1">View Parameters Saved:</span>
                <div>Age Bracket: <span className="font-bold text-slate-700 dark:text-slate-350">{filterAgeGroup}</span></div>
                <div>Gender Filter: <span className="font-bold text-slate-700 dark:text-slate-350">{filterGender}</span></div>
                <div>Education Level: <span className="font-bold text-slate-700 dark:text-slate-350">{filterEducation}</span></div>
                <div>Employment Status: <span className="font-bold text-slate-700 dark:text-slate-350">{filterEmployment}</span></div>
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowSaveViewModal(false)}
                  className="px-4 py-2 border border-slate-200 dark:border-white/10 text-[#0b2447] dark:text-white rounded-xl text-xs font-bold hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-[#ff9933] text-white hover:bg-orange-500 rounded-xl text-xs font-bold shadow-sm cursor-pointer border border-transparent"
                >
                  Save Parameter Configuration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default FamilyAnalytics;








