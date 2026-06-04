import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Search, BarChart2, Download, Landmark,
  MapPin, Users, GraduationCap, Briefcase, Activity,
  Info, MessageSquare, ChevronRight, X, Phone, HelpCircle,
  Sparkles, CheckCircle, TrendingUp, ShieldAlert, Award,
  Send, Eye, Map, Share2, Plus, AlertCircle
} from 'lucide-react';

const CommunityInsights = () => {
  const navigate = useNavigate();

  // Selected Area State
  const [selectedArea, setSelectedArea] = useState('Sector 21, New Delhi');
  const [compareArea, setCompareArea] = useState('Sector 22, New Delhi');
  const [showCompare, setShowCompare] = useState(false);

  // Search & Map Filter Overlays
  const [mapLayer, setMapLayer] = useState('Density'); // 'Density' | 'Development' | 'Facilities'
  const [toastMessage, setToastMessage] = useState('');
  const [exporting, setExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportFormat, setExportFormat] = useState(null);

  // Community Feedback Form State
  const [feedbackForm, setFeedbackForm] = useState({
    category: 'Infrastructure',
    title: '',
    description: '',
    anonymous: false
  });
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  // FAQ Accordion State
  const [faqOpen, setFaqOpen] = useState(null);

  // Map Zoom State
  const [mapZoom, setMapZoom] = useState(1);

  // Dataset based on Area selection
  const areaData = useMemo(() => {
    if (selectedArea === 'Sector 21, New Delhi') {
      return {
        name: 'Sector 21, New Delhi',
        district: 'Central Delhi',
        state: 'Delhi',
        category: 'Urban Community',
        badgeColor: 'bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400',
        stats: {
          totalPopulation: 52450,
          malePopulation: 27200,
          femalePopulation: 25250,
          childrenPopulation: 8500,
          seniorsPopulation: 5800,
          growthRate: '8% Over Last 3 Years',
          history: [48500, 49800, 51100, 52450],
          literacy: 89,
          maleLiteracy: 92,
          femaleLiteracy: 86,
          youthLiteracy: 95,
          employment: 78,
          unemployment: 22,
          workingPop: 35000,
          education: { primary: 15, secondary: 25, graduates: 40, postGraduates: 15, professional: 5 },
          occupation: { agriculture: 2, government: 28, private: 42, business: 15, retired: 13 },
          developmentScore: 88,
          infrastructureScore: 90,
          educationScore: 92,
          healthcareScore: 85,
          digitalScore: 95
        }
      };
    } else if (selectedArea === 'Sector 22, New Delhi') {
      return {
        name: 'Sector 22, New Delhi',
        district: 'Central Delhi',
        state: 'Delhi',
        category: 'Urban Community',
        badgeColor: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400',
        stats: {
          totalPopulation: 45100,
          malePopulation: 23100,
          femalePopulation: 22000,
          childrenPopulation: 7200,
          seniorsPopulation: 4900,
          growthRate: '5% Over Last 3 Years',
          history: [42900, 43700, 44400, 45100],
          literacy: 85,
          maleLiteracy: 88,
          femaleLiteracy: 82,
          youthLiteracy: 91,
          employment: 74,
          unemployment: 26,
          workingPop: 29500,
          education: { primary: 18, secondary: 28, graduates: 35, postGraduates: 14, professional: 5 },
          occupation: { agriculture: 3, government: 24, private: 40, business: 18, retired: 15 },
          developmentScore: 82,
          infrastructureScore: 84,
          educationScore: 86,
          healthcareScore: 80,
          digitalScore: 88
        }
      };
    } else {
      // Rural/Semi-Urban Sector 23
      return {
        name: 'Najafgarh Ward 4, New Delhi',
        district: 'South West Delhi',
        state: 'Delhi',
        category: 'Semi-Urban Ward',
        badgeColor: 'bg-[#ff9933]/15 text-[#ff9933] dark:bg-[#ff9933]/10 dark:text-orange-400',
        stats: {
          totalPopulation: 38200,
          malePopulation: 20100,
          femalePopulation: 18100,
          childrenPopulation: 8900,
          seniorsPopulation: 3800,
          growthRate: '12% Over Last 3 Years',
          history: [34100, 35500, 36800, 38200],
          literacy: 76,
          maleLiteracy: 82,
          femaleLiteracy: 70,
          youthLiteracy: 88,
          employment: 68,
          unemployment: 32,
          workingPop: 22000,
          education: { primary: 25, secondary: 35, graduates: 25, postGraduates: 11, professional: 4 },
          occupation: { agriculture: 15, government: 18, private: 35, business: 20, retired: 12 },
          developmentScore: 71,
          infrastructureScore: 74,
          educationScore: 72,
          healthcareScore: 68,
          digitalScore: 78
        }
      };
    }
  }, [selectedArea]);

  // Comparison details
  const compData = useMemo(() => {
    const sA = areaData;
    const sB = compareArea === 'Sector 22, New Delhi' 
      ? { name: 'Sector 22, New Delhi', stats: { totalPopulation: 45100, literacy: 85, employment: 74, infrastructureScore: 84, healthcareScore: 80 } }
      : { name: 'Najafgarh Ward 4, New Delhi', stats: { totalPopulation: 38200, literacy: 76, employment: 68, infrastructureScore: 74, healthcareScore: 68 } };
    return { sA, sB };
  }, [areaData, compareArea]);

  // Handle Export Sim
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
            setToastMessage(`Community report downloaded successfully as ${format.toUpperCase()}!`);
          }, 300);
          return 100;
        }
        return prev + 20;
      });
    }, 150);
  };

  // Feedback Submission handler
  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    if (!feedbackForm.title.trim() || !feedbackForm.description.trim()) {
      setToastMessage('Please fill in both feedback title and description.');
      return;
    }
    setFeedbackSubmitted(true);
    setToastMessage('Thank you! Your feedback has been registered and pinned to the municipal dashboard.');
    setTimeout(() => {
      setFeedbackForm({ category: 'Infrastructure', title: '', description: '', anonymous: false });
      setFeedbackSubmitted(false);
    }, 4000);
  };

  return (
    <div className="flex-grow w-full bg-[#f8faff] dark:bg-[#030d1b] min-h-screen pb-16 relative transition-colors duration-300">
      
      {/* ══════════════════════════════════════════════════
          SECTION 1: PAGE HEADER & BANNER
      ══════════════════════════════════════════════════ */}
      <div className="bg-[#0b2447] text-white py-12 px-6 sm:px-12 relative overflow-hidden shadow-lg border-b border-white/5">
        <div className="absolute right-0 top-0 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 w-80 h-80 bg-[#ff9933]/10 rounded-full blur-3xl pointer-events-none" />
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
                Sovereign Analytics link
              </span>
              <span className="text-[10px] uppercase font-bold text-[#ff9933] bg-[#ff9933]/15 border border-[#ff9933]/25 px-3 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3 animate-pulse" /> Community Intelligence
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 flex items-center gap-2.5">
              <BarChart2 className="w-8 h-8 text-cyan-400 shrink-0" /> Community Insights
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1.5 max-w-2xl font-light leading-relaxed">
              Explore demographic statistics, development indicators, and community trends for your local area based on national census records.
            </p>
          </div>
          
          <div className="flex items-center flex-wrap gap-3.5">
            {/* Area selection dropdown */}
            <div className="flex items-center bg-white/5 border border-white/10 px-4 py-2 rounded-2xl backdrop-blur-md">
              <div className="text-right mr-3">
                <span className="block text-[8px] text-white/40 uppercase tracking-widest font-extrabold">Active Zone</span>
                <span className="text-xs font-bold text-cyan-400">
                  {selectedArea.split(',')[0]}
                </span>
              </div>
              <select
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                className="bg-transparent text-xs font-bold text-white border-none outline-none cursor-pointer pr-2"
              >
                <option value="Sector 21, New Delhi" className="bg-[#0b2447] text-white">Sector 21, Delhi</option>
                <option value="Sector 22, New Delhi" className="bg-[#0b2447] text-white">Sector 22, Delhi</option>
                <option value="Najafgarh Ward 4, New Delhi" className="bg-[#0b2447] text-white">Najafgarh, Delhi</option>
              </select>
            </div>

            {/* Quick Actions Header Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowCompare(!showCompare)}
                className="bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <Users className="w-4 h-4 shrink-0" />
                {showCompare ? 'Hide Comparison' : 'Compare Areas'}
              </button>

              <button
                onClick={() => handleStartExport('pdf')}
                disabled={exporting}
                className="bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                Download Report
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8 flex flex-col gap-6">

        {/* Toast Messages */}
        {toastMessage && (
          <div className="bg-cyan-50 dark:bg-cyan-950/20 text-cyan-700 dark:text-cyan-300 text-xs p-4 rounded-2xl border border-cyan-200 dark:border-cyan-800 flex items-start justify-between gap-2.5 shadow-sm animate-fade-in">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 shrink-0 mt-0.5 text-cyan-600 dark:text-cyan-400" />
              <span>{toastMessage}</span>
            </div>
            <button onClick={() => setToastMessage('')} className="text-slate-400 hover:text-slate-650 dark:hover:text-slate-200 cursor-pointer">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {exporting && (
          <div className="bg-cyan-50 dark:bg-cyan-950/20 border border-cyan-200 dark:border-cyan-800 text-cyan-800 dark:text-slate-200 p-4 rounded-2xl shadow-sm animate-fade-in">
            <div className="flex justify-between text-xs font-bold mb-1">
              <span>Generating Community Report ({exportFormat?.toUpperCase()})...</span>
              <span>{exportProgress}%</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
              <div className="bg-cyan-600 h-full transition-all duration-150" style={{ width: `${exportProgress}%` }} />
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════
            SECTION 2: COMMUNITY OVERVIEW
        ══════════════════════════════════════════════════ */}
        <div className="bg-white dark:bg-[#09172a] border border-slate-200 dark:border-white/10 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-cyan-50 dark:bg-cyan-950/20 text-cyan-600 rounded-xl flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-sm text-[#0b2447] dark:text-white leading-tight">
                {areaData.name}
              </h2>
              <p className="text-[10px] text-slate-400 mt-0.5">
                District: {areaData.district} · State: {areaData.state}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`text-[9px] font-bold uppercase px-3 py-1 rounded-full ${areaData.badgeColor}`}>
              {areaData.category}
            </span>
            <span className="text-[9px] font-bold uppercase px-3 py-1 rounded-full bg-[#ff9933]/15 text-[#ff9933] border border-[#ff9933]/25">
              Readiness Score: {areaData.stats.developmentScore}%
            </span>
          </div>
        </div>

        {/* Comparative Block Overlay if enabled */}
        {showCompare && (
          <div className="bg-white dark:bg-[#09172a] border border-cyan-200 dark:border-white/10 rounded-2xl p-5 shadow-sm animate-fade-in">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h3 className="font-extrabold text-xs text-[#0b2447] dark:text-white uppercase tracking-wider">Side-by-Side Area Benchmark</h3>
              <div className="flex gap-2 items-center">
                <span className="text-[10px] text-slate-450 uppercase font-bold">Compare with:</span>
                <select
                  value={compareArea}
                  onChange={(e) => setCompareArea(e.target.value)}
                  className="bg-slate-50 dark:bg-[#0d1e36] text-[10px] font-bold text-[#0b2447] dark:text-white border border-slate-200 rounded-xl px-2 py-1 outline-none"
                >
                  <option value="Sector 22, New Delhi">Sector 22, Delhi</option>
                  <option value="Najafgarh Ward 4, New Delhi">Najafgarh, Delhi</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-[11px] border border-slate-200 dark:border-white/5 rounded-xl overflow-hidden">
              <div className="bg-slate-50 dark:bg-[#0d1e36] p-3 font-semibold text-slate-500 border-r border-slate-200 dark:border-white/5 flex flex-col gap-3">
                <div>Metric Parameter</div>
                <div>Population</div>
                <div>Literacy Rate</div>
                <div>Employment Participation</div>
                <div>Infrastructure Index</div>
              </div>
              <div className="p-3 text-slate-700 dark:text-white border-r border-slate-100 dark:border-white/5 flex flex-col gap-3">
                <div className="font-bold text-[#0b2447] dark:text-white">{compData.sA.name.split(',')[0]}</div>
                <div>{compData.sA.stats.totalPopulation.toLocaleString()}</div>
                <div>{compData.sA.stats.literacy}%</div>
                <div>{compData.sA.stats.employment}%</div>
                <div>{compData.sA.stats.infrastructureScore}/100</div>
              </div>
              <div className="p-3 text-slate-700 dark:text-white flex flex-col gap-3">
                <div className="font-bold text-[#0b2447] dark:text-white">{compData.sB.name.split(',')[0]}</div>
                <div>{compData.sB.stats.totalPopulation.toLocaleString()}</div>
                <div>{compData.sB.stats.literacy}%</div>
                <div>{compData.sB.stats.employment}%</div>
                <div>{compData.sB.stats.infrastructureScore}/100</div>
              </div>
            </div>
          </div>
        )}

        {/* main layout grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* LEFT 8-COLUMN MAIN BLOCK */}
          <div className="lg:col-span-8 flex flex-col gap-6">

            {/* ══════════════════════════════════════════════════
                SECTION 3: LOCAL STATISTICS
            ══════════════════════════════════════════════════ */}
            <div className="bg-white dark:bg-[#09172a] border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-sm">
              <div className="border-b border-slate-100 dark:border-white/5 pb-4 mb-4">
                <h3 className="font-extrabold text-sm text-[#0b2447] dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <BarChart2 className="w-5 h-5 text-cyan-500" /> Community Demographic Registers
                </h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Core population, education distribution, and occupation indicators</p>
              </div>

              {/* POPULATION */}
              <div className="mb-8">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Population Statistics</span>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-4">
                  {[
                    { label: 'Total Population', value: areaData.stats.totalPopulation.toLocaleString(), color: 'text-slate-800 dark:text-white' },
                    { label: 'Male Population', value: areaData.stats.malePopulation.toLocaleString(), color: 'text-blue-600 dark:text-blue-400' },
                    { label: 'Female Population', value: areaData.stats.femalePopulation.toLocaleString(), color: 'text-pink-600 dark:text-pink-400' },
                    { label: 'Children', value: areaData.stats.childrenPopulation.toLocaleString(), color: 'text-green-600 dark:text-green-400' },
                    { label: 'Seniors (60+)', value: areaData.stats.seniorsPopulation.toLocaleString(), color: 'text-[#ff9933]' }
                  ].map((p, idx) => (
                    <div key={idx} className="bg-slate-50 dark:bg-[#0d1e36] p-3 rounded-xl border border-slate-200/50 dark:border-white/5">
                      <span className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-snug">{p.label}</span>
                      <span className={`text-sm font-extrabold block mt-1 ${p.color}`}>{p.value}</span>
                    </div>
                  ))}
                </div>

                {/* POPULATION GROWTH (SVG Line Chart) */}
                <div className="bg-slate-50 dark:bg-[#0d1e36] p-4 rounded-xl border border-slate-200/50 dark:border-white/5">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[9px] font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider">Growth Trend Analysis</span>
                    <span className="text-[9px] text-[#ff9933] font-bold flex items-center gap-0.5">
                      <TrendingUp className="w-3.5 h-3.5" /> {areaData.stats.growthRate}
                    </span>
                  </div>

                  <div className="h-32 w-full mt-4 relative">
                    {/* SVG Line path representation */}
                    <svg viewBox="0 0 400 100" className="w-full h-full overflow-visible">
                      {/* Grid Lines */}
                      <line x1="0" y1="90" x2="400" y2="90" stroke="#cbd5e1" strokeWidth="0.5" strokeDasharray="3" />
                      <line x1="0" y1="50" x2="400" y2="50" stroke="#cbd5e1" strokeWidth="0.5" strokeDasharray="3" />
                      
                      {/* Trend Line */}
                      <path
                        d="M 50 80 L 150 65 L 250 50 L 350 30"
                        fill="none"
                        stroke="#06b6d4"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                      
                      {/* Dots on nodes */}
                      <circle cx="50" cy="80" r="4" fill="#06b6d4" />
                      <circle cx="150" cy="65" r="4" fill="#06b6d4" />
                      <circle cx="250" cy="50" r="4" fill="#06b6d4" />
                      <circle cx="350" cy="30" r="4" fill="#06b6d4" />

                      {/* Text tags */}
                      <text x="50" y="98" fontSize="8" textAnchor="middle" fill="#94a3b8">2022</text>
                      <text x="150" y="98" fontSize="8" textAnchor="middle" fill="#94a3b8">2023</text>
                      <text x="250" y="98" fontSize="8" textAnchor="middle" fill="#94a3b8">2024</text>
                      <text x="350" y="98" fontSize="8" textAnchor="middle" fill="#94a3b8">2025</text>
                      
                      <text x="50" y="70" fontSize="7" textAnchor="middle" fill="#0b2447" className="dark:fill-white font-bold">{areaData.stats.history[0].toLocaleString()}</text>
                      <text x="150" y="55" fontSize="7" textAnchor="middle" fill="#0b2447" className="dark:fill-white font-bold">{areaData.stats.history[1].toLocaleString()}</text>
                      <text x="250" y="40" fontSize="7" textAnchor="middle" fill="#0b2447" className="dark:fill-white font-bold">{areaData.stats.history[2].toLocaleString()}</text>
                      <text x="350" y="20" fontSize="7" textAnchor="middle" fill="#0b2447" className="dark:fill-white font-bold">{areaData.stats.history[3].toLocaleString()}</text>
                    </svg>
                  </div>
                </div>
              </div>

              {/* LITERACY RATE & EDUCATION */}
              <div className="mb-8 pt-6 border-t border-slate-100 dark:border-white/5">
                <div className="flex justify-between items-center mb-3">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Literacy Rate indicators</span>
                  <span className="text-[9px] text-[#ff9933] font-bold bg-[#ff9933]/15 px-2.5 py-0.5 rounded-full border border-[#ff9933]/25">
                    Above National average
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  {/* Literacy radial cards */}
                  {[
                    { label: 'Overall Literacy', value: areaData.stats.literacy, color: 'stroke-cyan-500 text-cyan-500' },
                    { label: 'Male Literacy', value: areaData.stats.maleLiteracy, color: 'stroke-blue-500 text-blue-500' },
                    { label: 'Female Literacy', value: areaData.stats.femaleLiteracy, color: 'stroke-pink-500 text-pink-500' },
                    { label: 'Youth Literacy', value: areaData.stats.youthLiteracy, color: 'stroke-green-500 text-green-500' }
                  ].map((lit, idx) => (
                    <div key={idx} className="bg-slate-50 dark:bg-[#0d1e36] p-4 rounded-xl border border-slate-200/50 dark:border-white/5 flex flex-col items-center justify-center">
                      <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest text-center mb-3">{lit.label}</span>
                      
                      <div className="relative w-16 h-16 flex items-center justify-center">
                        <svg width="64" height="64" className="rotate-[-90deg]">
                          <circle cx="32" cy="32" r="25" fill="none" stroke="#e2e8f0" strokeWidth="4" />
                          <circle cx="32" cy="32" r="25" fill="none" className={lit.color.split(' ')[0]} strokeWidth="4" strokeDasharray="157.08" strokeDashoffset={157.08 - (lit.value / 100) * 157.08} strokeLinecap="round" />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className={`text-xs font-extrabold ${lit.color.split(' ')[1]}`}>{lit.value}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* EDUCATION BREAKDOWN */}
                <div className="mt-4 bg-slate-50 dark:bg-[#0d1e36] p-4 rounded-xl border border-slate-200/50 dark:border-white/5">
                  <span className="block text-[9px] font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider mb-3">Academic Qualification Breakdown</span>
                  <div className="flex flex-col gap-2.5">
                    {[
                      { label: 'Primary School', val: areaData.stats.education.primary },
                      { label: 'Secondary / High School', val: areaData.stats.education.secondary },
                      { label: 'Graduates', val: areaData.stats.education.graduates },
                      { label: 'Post Graduates', val: areaData.stats.education.postGraduates },
                      { label: 'Professional Streams (PhD/MD)', val: areaData.stats.education.professional }
                    ].map((edu, idx) => (
                      <div key={idx} className="text-[10px] flex items-center justify-between">
                        <span className="font-semibold text-slate-700 dark:text-slate-300 w-32">{edu.label}:</span>
                        <div className="flex-1 bg-slate-200 dark:bg-[#09172a] h-2 rounded-full overflow-hidden mx-3 border border-slate-200/50 dark:border-white/5">
                          <div className="bg-cyan-500 h-full transition-all" style={{ width: `${edu.val * 2}%` }} />
                        </div>
                        <span className="text-slate-400 w-8 text-right font-mono font-bold">{edu.val}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* EMPLOYMENT RATE */}
              <div className="pt-6 border-t border-slate-100 dark:border-white/5">
                <div className="flex justify-between items-center mb-3">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Workforce Participation</span>
                  <span className="text-[9px] text-[#ff9933] font-bold">
                    Active Workforce: {areaData.stats.workingPop.toLocaleString()}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-slate-50 dark:bg-[#0d1e36] p-4 rounded-xl border border-slate-200/50 dark:border-white/5 flex flex-col justify-between">
                    <div>
                      <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest block">Workforce Index</span>
                      <h4 className="font-extrabold text-sm text-[#0b2447] dark:text-white mt-1">Employment Stability</h4>
                      <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">
                        Approximately {areaData.stats.employment}% of the working-age population is actively employed in structured sectors.
                      </p>
                    </div>

                    <div className="mt-4 flex gap-4 text-xs font-mono font-bold">
                      <div>
                        <span className="text-[8px] text-slate-400 block uppercase font-sans">Employment Rate</span>
                        <span className="text-cyan-600 dark:text-cyan-400">{areaData.stats.employment}%</span>
                      </div>
                      <div>
                        <span className="text-[8px] text-slate-400 block uppercase font-sans">Unemployment</span>
                        <span className="text-red-500">{areaData.stats.unemployment}%</span>
                      </div>
                    </div>
                  </div>

                  {/* OCCUPATION SECTORS */}
                  <div className="bg-slate-50 dark:bg-[#0d1e36] p-4 rounded-xl border border-slate-200/50 dark:border-white/5">
                    <span className="block text-[9px] font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider mb-2">Major Employment Sectors</span>
                    <div className="flex flex-col gap-2 font-mono text-[9px]">
                      {[
                        { label: 'Private Sector Services', val: areaData.stats.occupation.private },
                        { label: 'Govt Employment', val: areaData.stats.occupation.government },
                        { label: 'Self Employed / Business', val: areaData.stats.occupation.business },
                        { label: 'Retired Care Pensioners', val: areaData.stats.occupation.retired },
                        { label: 'Agriculture / Agritech', val: areaData.stats.occupation.agriculture }
                      ].map((occ, idx) => (
                        <div key={idx} className="flex justify-between items-center py-0.5 border-b border-slate-200/30 dark:border-white/5 last:border-b-0">
                          <span className="text-slate-700 dark:text-slate-300 font-sans">{occ.label}</span>
                          <span className="font-bold text-slate-800 dark:text-slate-200">{occ.val}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* ══════════════════════════════════════════════════
                SECTION 4: AREA DEVELOPMENT INDICATORS
            ══════════════════════════════════════════════════ */}
            <div className="bg-white dark:bg-[#09172a] border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-sm">
              <div className="border-b border-slate-100 dark:border-white/5 pb-3.5 mb-4">
                <h3 className="font-extrabold text-sm text-[#0b2447] dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <Activity className="w-5 h-5 text-cyan-500" /> Area Development Indicators
                </h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Development scores and basic amenities indices</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Score meters */}
                <div className="flex flex-col gap-3">
                  {[
                    { label: 'Physical Infrastructure Index', val: areaData.stats.infrastructureScore, desc: 'Roads, power, and water supply availability.' },
                    { label: 'Academic & Educational Access', val: areaData.stats.educationScore, desc: 'Quality educational institutions mapping.' },
                    { label: 'Healthcare Coverage Facility', val: areaData.stats.healthcareScore, desc: 'Hospital beds and medical accessibility logs.' },
                    { label: 'Digital Connectivity Index', val: areaData.stats.digitalScore, desc: 'Internet penetration and public services usage.' }
                  ].map((dev, idx) => (
                    <div key={idx} className="p-3.5 bg-slate-50 dark:bg-[#0d1e36] rounded-xl border border-slate-200/50 dark:border-white/5 text-slate-800 dark:text-white">
                      <div className="flex justify-between items-center text-[10px] font-bold mb-1.5">
                        <span className="text-[#0b2447] dark:text-white">{dev.label}</span>
                        <span className="text-cyan-500">{dev.val}/100</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-[#09172a] h-2 rounded-full overflow-hidden border border-slate-350/10">
                        <div className="bg-cyan-500 h-full transition-all" style={{ width: `${dev.val}%` }} />
                      </div>
                      <span className="text-[8px] text-slate-400 block mt-1">{dev.desc}</span>
                    </div>
                  ))}
                </div>

                {/* Infrastructure indicators details */}
                <div className="flex flex-col gap-4">
                  <div className="bg-slate-50 dark:bg-[#0d1e36] p-4 rounded-xl border border-slate-200/50 dark:border-white/5 text-slate-800 dark:text-white">
                    <span className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-3">Amenity Access Logs</span>
                    <ul className="flex flex-col gap-3.5 text-[10px]">
                      {[
                        { label: 'Road Connectivity', access: '98% Paved Grid' },
                        { label: 'Electricity Access Grid', access: '100% Uninterrupted' },
                        { label: 'Drinkable Water Supply', access: '95% Piped Access' },
                        { label: 'Internet Connectivity Index', access: `${areaData.stats.digitalScore}% Broadband` }
                      ].map((item, idx) => (
                        <li key={idx} className="flex justify-between items-center border-b border-slate-200/25 dark:border-white/5 pb-2 last:border-b-0">
                          <span className="text-slate-700 dark:text-slate-300 font-medium">{item.label}</span>
                          <span className="font-bold text-cyan-600 dark:text-cyan-400">{item.access}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-slate-50 dark:bg-[#0d1e36] p-4 rounded-xl border border-slate-200/50 dark:border-white/5 text-slate-800 dark:text-white flex items-center justify-between gap-4">
                    <div>
                      <span className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest">Digital Penetration</span>
                      <h4 className="font-extrabold text-xs text-[#0b2447] dark:text-white mt-1">Connectivity Status</h4>
                      <p className="text-[10px] text-slate-400 mt-1.5 leading-snug">
                        Ranked #3 in District Central Delhi for high-speed fiber internet adoption and smartphone penetration.
                      </p>
                    </div>
                    
                    <span className="w-12 h-12 bg-cyan-100 dark:bg-cyan-950/20 text-cyan-600 rounded-full flex items-center justify-center shrink-0 border border-cyan-200">
                      <Sparkles className="w-5 h-5 animate-pulse" />
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ══════════════════════════════════════════════════
                SECTION 6: INTERACTIVE COMMUNITY MAP
            ══════════════════════════════════════════════════ */}
            <div className="bg-white dark:bg-[#09172a] border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-white/5 pb-4 mb-4">
                <div>
                  <h3 className="font-extrabold text-sm text-[#0b2447] dark:text-white uppercase tracking-wider flex items-center gap-2">
                    <Map className="w-5 h-5 text-cyan-500" /> Interactive Community Map
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">Toggle map visual overlays to verify density and public utilities</p>
                </div>

                {/* Map layers filter */}
                <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-[#0d1e36] border border-slate-200 dark:border-white/10 p-1 rounded-xl">
                  {['Density', 'Development', 'Facilities'].map((lay) => (
                    <button
                      key={lay}
                      onClick={() => setMapLayer(lay)}
                      className={`text-[9px] font-extrabold px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                        mapLayer === lay 
                          ? 'bg-[#0b2447] text-white dark:bg-cyan-600 dark:text-white' 
                          : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10'
                      }`}
                    >
                      {lay} Layers
                    </button>
                  ))}
                </div>
              </div>

              {/* Map SVG representation */}
              <div className="relative w-full h-64 bg-slate-100 dark:bg-[#0d1e36]/30 border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden flex items-center justify-center">
                <div className="absolute left-3 top-3 z-10 flex flex-col gap-1.5 bg-white/80 dark:bg-[#09172a]/80 backdrop-blur-md border border-slate-200 dark:border-white/10 p-2 rounded-xl text-[8px] text-slate-400">
                  <span className="font-bold text-[#0b2447] dark:text-white uppercase block">Map Legends</span>
                  <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-red-500" /> High Density (ICU Area)</div>
                  <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-cyan-500" /> Residential Clusters</div>
                  <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-[#ff9933]" /> Market Zones</div>
                </div>

                {/* Map zoom controls */}
                <div className="absolute right-3 bottom-3 z-10 flex flex-col gap-1 bg-white/80 dark:bg-[#09172a]/80 backdrop-blur-md border border-slate-200 dark:border-white/10 p-1.5 rounded-xl text-[10px]">
                  <button onClick={() => setMapZoom(prev => Math.min(prev + 0.2, 2))} className="w-6 h-6 border font-extrabold cursor-pointer flex items-center justify-center hover:bg-slate-100 rounded-md">+</button>
                  <button onClick={() => setMapZoom(prev => Math.max(prev - 0.2, 0.6))} className="w-6 h-6 border font-extrabold cursor-pointer flex items-center justify-center hover:bg-slate-100 rounded-md mt-1">-</button>
                </div>

                <div 
                  className="w-full h-full flex items-center justify-center transition-transform duration-300"
                  style={{ transform: `scale(${mapZoom})` }}
                >
                  <svg viewBox="0 0 400 200" className="w-96 h-48 opacity-90">
                    {/* Simulated zones */}
                    <path d="M50 30 Q150 10 250 30 T350 30 L380 170 Q200 190 50 170 Z" fill="none" stroke="#64748b" strokeWidth="1.5" strokeDasharray="3" />
                    
                    {mapLayer === 'Density' && (
                      <>
                        <path d="M80 50 Q160 30 200 60 T320 50 L330 150 Q180 160 80 140 Z" fill="#ef4444" fillOpacity="0.25" />
                        <path d="M120 70 Q180 50 220 80 T280 70 L290 120 Q180 130 120 110 Z" fill="#ef4444" fillOpacity="0.45" />
                      </>
                    )}

                    {mapLayer === 'Development' && (
                      <>
                        <circle cx="200" cy="100" r="45" fill="#06b6d4" fillOpacity="0.25" />
                        <circle cx="100" cy="80" r="30" fill="#10b981" fillOpacity="0.25" />
                        <circle cx="290" cy="120" r="35" fill="#ff9933" fillOpacity="0.25" />
                      </>
                    )}

                    {mapLayer === 'Facilities' && (
                      <>
                        <g transform="translate(150, 60)">
                          <circle cx="0" cy="0" r="6" fill="#06b6d4" />
                          <text x="0" y="2" fontSize="6" fill="white" fontWeight="bold" textAnchor="middle">H</text>
                        </g>
                        <g transform="translate(250, 120)">
                          <circle cx="0" cy="0" r="6" fill="#10b981" />
                          <text x="0" y="2" fontSize="6" fill="white" fontWeight="bold" textAnchor="middle">S</text>
                        </g>
                        <g transform="translate(100, 110)">
                          <circle cx="0" cy="0" r="6" fill="#3b82f6" />
                          <text x="0" y="2" fontSize="6" fill="white" fontWeight="bold" textAnchor="middle">P</text>
                        </g>
                      </>
                    )}
                  </svg>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT 4-COLUMN SIDEBAR BLOCK */}
          <div className="lg:col-span-4 flex flex-col gap-6">

            {/* ══════════════════════════════════════════════════
                SECTION 9: AI COMMUNITY INSIGHTS
            ══════════════════════════════════════════════════ */}
            <div className="bg-white dark:bg-[#09172a] border border-slate-200 dark:border-white/10 rounded-3xl p-5 shadow-sm">
              <h3 className="font-extrabold text-xs text-[#0b2447] dark:text-white uppercase tracking-wider mb-3">
                AI Community Insights
              </h3>

              <div className="flex flex-col gap-3">
                {[
                  { title: 'Educational Excellence', desc: 'Your area registers a higher literacy rate than the neighbouring districts by +4%.', color: 'text-cyan-500' },
                  { title: 'Infrastructure Alert', desc: 'Sewer and piped water indicators have a lower coverage in Sector 23 semi-urban wards.', color: 'text-[#ff9933]' },
                  { title: 'Workforce Trends', desc: 'Digital Connectivity scores are growing steadily, boosting online services usage by 12%.', color: 'text-green-500' }
                ].map((ins, i) => (
                  <div key={i} className="border border-slate-200 dark:border-white/10 p-3.5 rounded-xl bg-slate-50 dark:bg-[#0d1e36] text-slate-800 dark:text-white flex items-start gap-2">
                    <Sparkles className={`w-4 h-4 shrink-0 mt-0.5 ${ins.color}`} />
                    <div>
                      <span className="font-bold text-[10px] text-[#0b2447] dark:text-white block leading-tight">{ins.title}</span>
                      <p className="text-[9px] text-slate-450 dark:text-slate-400 mt-0.5 leading-relaxed">{ins.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ══════════════════════════════════════════════════
                SECTION 5: COMMUNITY REPORTS
            ══════════════════════════════════════════════════ */}
            <div className="bg-white dark:bg-[#09172a] border border-slate-200 dark:border-white/10 rounded-3xl p-5 shadow-sm">
              <h3 className="font-extrabold text-xs text-[#0b2447] dark:text-white uppercase tracking-wider mb-3">
                Community Reports
              </h3>

              <div className="flex flex-col gap-2.5">
                {[
                  { name: 'Demographics & Population Report', type: 'Population Index', date: 'May 2026', size: '1.2 MB' },
                  { name: 'District Literacy & Education Report', type: 'Literacy Register', date: 'May 2026', size: '940 KB' },
                  { name: 'Infrastructure Scorecard PDF', type: 'Development Report', date: 'Jun 2026', size: '2.1 MB' }
                ].map((rep, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 dark:bg-[#0d1e36] border border-slate-200 dark:border-white/10 rounded-xl flex flex-col gap-2 text-slate-800 dark:text-white">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <span className="block font-bold text-[10px] text-[#0b2447] dark:text-white leading-tight">{rep.name}</span>
                        <span className="block text-[8px] text-slate-400">{rep.type} · {rep.size}</span>
                      </div>
                      <span className="text-[8px] font-bold uppercase px-2 py-0.5 rounded bg-cyan-50 text-cyan-700 dark:bg-cyan-950/20">
                        {rep.date}
                      </span>
                    </div>

                    <div className="flex items-center justify-end gap-2 mt-1.5 pt-1.5 border-t border-slate-200/40 text-[8px]">
                      <button
                        onClick={() => handleStartExport('pdf')}
                        className="bg-[#0b2447] hover:bg-opacity-95 text-white dark:bg-[#ff9933] px-2.5 py-1 rounded text-[8px] font-extrabold cursor-pointer transition-colors"
                      >
                        Download PDF
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ══════════════════════════════════════════════════
                SECTION 10: COMMUNITY FEEDBACK
            ══════════════════════════════════════════════════ */}
            <div className="bg-white dark:bg-[#09172a] border border-slate-200 dark:border-white/10 rounded-3xl p-5 shadow-sm">
              <h3 className="font-extrabold text-xs text-[#0b2447] dark:text-white uppercase tracking-wider mb-2">
                Citizen Feedback Center
              </h3>
              <p className="text-[10px] text-slate-400 leading-snug">Report infrastructure faults or suggest community developments</p>

              <form onSubmit={handleFeedbackSubmit} className="mt-4 flex flex-col gap-3">
                <div className="flex flex-col gap-1 text-[10px]">
                  <label className="font-bold text-slate-400">Issue Category</label>
                  <select
                    value={feedbackForm.category}
                    onChange={(e) => setFeedbackForm(prev => ({ ...prev, category: e.target.value }))}
                    className="bg-slate-50 dark:bg-[#0d1e36] text-[10px] text-slate-800 dark:text-white border border-slate-200 dark:border-white/10 rounded-xl px-2.5 py-2 outline-none"
                  >
                    <option value="Infrastructure">Roads & Infrastructure</option>
                    <option value="Sanitation">Municipal Sanitation</option>
                    <option value="Health">Healthcare Subsidies</option>
                    <option value="Digital">Internet connectivity</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1 text-[10px]">
                  <label className="font-bold text-slate-400">Report Subject</label>
                  <input
                    type="text"
                    required
                    value={feedbackForm.title}
                    onChange={(e) => setFeedbackForm(prev => ({ ...prev, title: e.target.value }))}
                    className="bg-slate-50 dark:bg-[#0d1e36] text-[10px] text-slate-800 dark:text-white border border-slate-200 dark:border-white/10 rounded-xl px-2.5 py-2 outline-none"
                    placeholder="e.g. Street Light Fault Sector 21"
                  />
                </div>

                <div className="flex flex-col gap-1 text-[10px]">
                  <label className="font-bold text-slate-400">Detailed Description</label>
                  <textarea
                    required
                    rows="3"
                    value={feedbackForm.description}
                    onChange={(e) => setFeedbackForm(prev => ({ ...prev, description: e.target.value }))}
                    className="bg-slate-50 dark:bg-[#0d1e36] text-[10px] text-slate-800 dark:text-white border border-slate-200 dark:border-white/10 rounded-xl px-2.5 py-2 outline-none resize-none"
                    placeholder="Provide description..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={feedbackSubmitted}
                  className="bg-[#0b2447] text-white hover:bg-opacity-90 dark:bg-[#ff9933] py-2 rounded-xl text-[10px] font-bold cursor-pointer transition-colors"
                >
                  {feedbackSubmitted ? 'Submitting...' : 'Submit Feedback'}
                </button>
              </form>
            </div>

            {/* ══════════════════════════════════════════════════
                SECTION 12: COMMUNITY ACHIEVEMENTS
            ══════════════════════════════════════════════════ */}
            <div className="bg-[#0b2447] text-white rounded-3xl p-5 shadow-lg flex flex-col gap-3">
              <h3 className="font-extrabold text-xs uppercase tracking-widest text-[#ff9933]">Area Achievements</h3>
              
              <div className="flex flex-col gap-3 mt-1">
                {[
                  { title: 'Top Literacy Zone', desc: 'Central Delhi Area Category award.', badge: '🏆 Literacy Leader' },
                  { title: 'Highest Employment Area', desc: 'Recognized for high-yield private sector jobs.', badge: '🌟 Job Center' },
                  { title: 'Digital Adoption Leader', desc: 'Awarded for online public services registration.', badge: '⚡ Digital First' }
                ].map((ach, i) => (
                  <div key={i} className="bg-white/5 border border-white/10 p-3 rounded-xl flex flex-col gap-1 text-[10px]">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-white block leading-tight">{ach.title}</span>
                      <span className="text-[8px] font-bold text-cyan-400">{ach.badge}</span>
                    </div>
                    <p className="text-[9px] text-slate-350">{ach.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ══════════════════════════════════════════════════
                SECTION 13: HELP & SUPPORT FAQ
            ══════════════════════════════════════════════════ */}
            <div className="bg-white dark:bg-[#09172a] border border-slate-200 dark:border-white/10 rounded-3xl p-5 shadow-sm">
              <h3 className="font-extrabold text-xs text-[#0b2447] dark:text-white uppercase tracking-wider mb-3">
                Help & support
              </h3>

              <div className="flex flex-col gap-2.5">
                {[
                  { q: 'How often is data updated?', a: 'Demographic statistics are synced directly with the Census registry archives, updated monthly after local verification visits.' },
                  { q: 'Who tracks development scores?', a: 'Development parameters (Infrastructure, Healthcare, Education) are updated using municipal registries and citizen feedback reports.' },
                  { q: 'Can I request corrections?', a: 'Yes. If you detect census errors in your ward, submit a correction request in the Help Support ticket system.' }
                ].map((faq, i) => (
                  <div key={i} className="border-b border-slate-100 dark:border-white/5 pb-2 last:border-b-0">
                    <button
                      onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                      className="w-full flex justify-between items-center text-[10px] font-bold text-[#0b2447] dark:text-white text-left cursor-pointer"
                    >
                      <span>{faq.q}</span>
                      <ChevronRight className={`w-3.5 h-3.5 text-slate-400 transition-transform ${faqOpen === i ? 'rotate-90' : ''}`} />
                    </button>
                    {faqOpen === i && (
                      <p className="text-[9px] text-slate-400 mt-1 leading-snug">{faq.a}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default CommunityInsights;
