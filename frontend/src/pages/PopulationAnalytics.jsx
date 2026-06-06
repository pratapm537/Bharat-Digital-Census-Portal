import React, { useState, useEffect } from 'react';
import { 
  BarChart2, Globe, TrendingUp, Users, BookOpen, Briefcase, 
  Map, Download, ArrowRight, CheckCircle2, ChevronRight, HelpCircle, 
  Send, RefreshCw, Layers, Grid, Compass, Home, Wifi, Zap, Award, 
  FileSpreadsheet, ArrowLeftRight, Check, X, ShieldAlert, BookCheck
} from 'lucide-react';

// ==========================================
// STATIC/INITIAL DEMO DATA
// ==========================================

const INITIAL_STATES = [
  { id: 'ST-01', name: 'Delhi', population: '32M', registered: '1.2M', families: '8.4M', householdSize: 3.8, literacy: 86, employment: 72, electricity: 99, internet: 88, owned: 68, rented: 28 },
  { id: 'ST-02', name: 'Maharashtra', population: '126M', registered: '4.8M', families: '28.1M', householdSize: 4.5, literacy: 82, employment: 68, electricity: 97, internet: 81, owned: 74, rented: 22 },
  { id: 'ST-03', name: 'Karnataka', population: '68M', registered: '2.5M', families: '15.2M', householdSize: 4.1, literacy: 77, employment: 65, electricity: 96, internet: 79, owned: 70, rented: 26 },
  { id: 'ST-04', name: 'Tamil Nadu', population: '76M', registered: '3.1M', families: '18.4M', householdSize: 4.0, literacy: 80, employment: 67, electricity: 98, internet: 82, owned: 73, rented: 23 },
  { id: 'ST-05', name: 'Uttar Pradesh', population: '241M', registered: '8.9M', families: '52.1M', householdSize: 5.1, literacy: 67, employment: 58, electricity: 91, internet: 64, owned: 82, rented: 15 },
  { id: 'ST-06', name: 'Rajasthan', population: '81M', registered: '2.8M', families: '18.1M', householdSize: 4.8, literacy: 66, employment: 60, electricity: 93, internet: 68, owned: 78, rented: 18 }
];

const AGE_GROUPS_PYRAMID = [
  { cohort: '0–4', male: 4.5, female: 4.2 },
  { cohort: '5–9', male: 4.8, female: 4.5 },
  { cohort: '10–14', male: 5.1, female: 4.8 },
  { cohort: '15–19', male: 5.5, female: 5.1 },
  { cohort: '20–24', male: 6.2, female: 5.8 },
  { cohort: '25–29', male: 6.5, female: 6.1 },
  { cohort: '30–34', male: 6.0, female: 5.6 },
  { cohort: '35–39', male: 5.2, female: 4.9 },
  { cohort: '40–44', male: 4.8, female: 4.5 },
  { cohort: '45–49', male: 4.2, female: 3.9 },
  { cohort: '50–54', male: 3.8, female: 3.5 },
  { cohort: '55–59', male: 3.1, female: 2.9 },
  { cohort: '60–64', male: 2.5, female: 2.3 },
  { cohort: '65–69', male: 1.8, female: 1.7 },
  { cohort: '70–74', male: 1.2, female: 1.1 },
  { cohort: '75–79', male: 0.8, female: 0.7 },
  { cohort: '80+', male: 0.5, female: 0.5 }
];

const MOCK_MIGRATIONS = [
  { origin: 'Bihar', destination: 'Delhi', volume: '1.2M', reason: 'Employment', trend: 'Increasing' },
  { origin: 'Uttar Pradesh', destination: 'Maharashtra', volume: '1.5M', reason: 'Employment', trend: 'Stable' },
  { origin: 'Rajasthan', destination: 'Gujarat', volume: '0.8M', reason: 'Business', trend: 'Increasing' },
  { origin: 'Karnataka', destination: 'Tamil Nadu', volume: '0.4M', reason: 'Education', trend: 'Stable' },
  { origin: 'Kerala', destination: 'Karnataka', volume: '0.6M', reason: 'Employment', trend: 'Increasing' }
];

const AI_INSIGHTS = [
  { title: 'Demographic Youth Dividend', desc: 'The largest population concentration rests within the 20–35 age cohort. High urban concentrations suggest accelerating labor demands.', category: 'Demographics' },
  { title: 'Literacy Transition Acceleration', desc: 'National literacy rates have increased significantly over the last decade, with youth literacy peaking at 89%. Female literacy is growing at 1.4x the rate of male literacy.', category: 'Education' },
  { title: 'Employment Migration Drivers', desc: 'Interstate migration patterns remain heavily employment-driven, with Delhi, Maharashtra, and Karnataka acting as primary economic sinks.', category: 'Migration' },
  { title: 'Digital Housing Footprint', desc: 'Internet adoption within households has reached 78%, showing a direct correlation with municipal sanitary access levels.', category: 'Housing' }
];

const FAQS = [
  { q: 'How frequently is the analytics dashboard updated?', a: 'Stats aggregate in real-time as field officers verify census records. A full database validation sync runs every 24 hours.' },
  { q: 'What defines a household unit?', a: 'A household is defined as a group of individuals living together and sharing a common kitchen facility, regardless of family relationships.' },
  { q: 'Can I export raw demographic tables?', a: 'Yes. Select the Reports Center tab, choose "CSV Format", and click Compile. You can retrieve raw dataset sheets immediately.' }
];

const PopulationAnalytics = () => {
  // Navigation & tabs
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'demographics', 'education', 'employment', 'migration', 'housing', 'comparison'
  
  // Interactive Filters
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  
  // Comparison Center States
  const [compareRegionA, setCompareRegionA] = useState('ST-01'); // Delhi
  const [compareRegionB, setCompareRegionB] = useState('ST-02'); // Maharashtra

  // Report Generator States
  const [reportType, setReportType] = useState('Demographic Report');
  const [reportFormat, setReportFormat] = useState('PDF');
  const [compileState, setCompileState] = useState(null); // 'generating', 'done'

  // Live support chat simulator
  const [chatMessages, setChatMessages] = useState([
    { sender: 'AI Data Scientist', text: 'Hello Analyst. Welcome to the national census observatory. Ask me about demographic pyramids, literacy ratios, or migration flows.' }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Notification feedbacks
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  // Auto clear toast
  useEffect(() => {
    if (feedback.message) {
      const timer = setTimeout(() => setFeedback({ type: '', message: '' }), 4000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  const handleSendChatMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = { sender: 'You (Analyst)', text: chatInput };
    setChatMessages(prev => [...prev, userMsg]);

    const inputLower = chatInput.toLowerCase();
    let replyText = "Routing query to the National Census Data Division.";
    if (inputLower.includes('pyramid') || inputLower.includes('cohort')) {
      replyText = 'The population pyramid represents horizontal age-gender bars. Youth cohorts (20-35) constitute the largest share of the current demographics.';
    } else if (inputLower.includes('migration') || inputLower.includes('interstate')) {
      replyText = 'Interstate migration flow charts track origin-to-destination volumes. Bihar-to-Delhi and UP-to-Mumbai show the largest volumes.';
    } else if (inputLower.includes('export') || inputLower.includes('download')) {
      replyText = 'You can compile and download specific reports in PDF/Excel format using the Section 11 Reports tab.';
    }

    setTimeout(() => {
      setChatMessages(prev => [...prev, { sender: 'AI Data Scientist', text: replyText }]);
    }, 800);

    setChatInput('');
  };

  const handleCompileReportSubmit = (e) => {
    e.preventDefault();
    setCompileState('generating');
    setTimeout(() => {
      setCompileState('done');
      setTimeout(() => setCompileState(null), 3500);
    }, 2000);
  };

  // Compare region objects
  const regionAObj = INITIAL_STATES.find(s => s.id === compareRegionA) || INITIAL_STATES[0];
  const regionBObj = INITIAL_STATES.find(s => s.id === compareRegionB) || INITIAL_STATES[1];

  return (
    <div className="flex-grow w-full max-w-containerMax mx-auto px-6 py-8 flex flex-col gap-8 text-onSurface bg-background">
      
      {/* SOLID BLACK CARDS IN DARK MODE STYLES */}
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

      {/* TOAST FEEDBACKS */}
      {feedback.message && (
        <div className={`fixed bottom-6 right-6 z-50 p-4 rounded-lg shadow-xl flex items-center gap-3 border text-xs max-w-sm animate-fade-in ${
          feedback.type === 'success' ? 'bg-green-50 text-green-800 border-green-200 dark:bg-green-950/80 dark:text-green-300 dark:border-green-800' :
          'bg-red-50 text-red-800 border-red-200 dark:bg-red-950/80 dark:text-red-300 dark:border-red-800'
        }`}>
          {feedback.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <ShieldAlert className="w-5 h-5 shrink-0" />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* SECTION 1: PAGE HEADER */}
      <section className="relative overflow-hidden rounded-xl border border-outlineVariant/50 bg-primary p-6 text-white shadow-ambient flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex flex-col gap-2 relative z-10">
          <div className="flex items-center gap-2">
            <span className="bg-[#ff9933]/20 border border-[#ff9933]/30 text-[#ff9933] font-bold uppercase text-[9px] px-2.5 py-0.5 rounded-full tracking-wider">
              National Observatory
            </span>
            <span className="text-[10px] text-white/70 font-semibold">• Ministry of Home Affairs</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Population Analytics</h2>
          <p className="text-xs text-white/80 max-w-xl leading-relaxed">
            Analyze demographic trends, education levels, employment patterns, migration movements, and housing conditions across regions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 relative z-10 shrink-0">
          <div className="flex items-center gap-2">
            <select 
              value={selectedState} 
              onChange={(e) => {
                setSelectedState(e.target.value);
                setFeedback({ type: 'success', message: `Filtered view by state zone: ${e.target.value ? INITIAL_STATES.find(s => s.id === e.target.value)?.name : 'All Regions'}` });
              }}
              className="px-3 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-lg text-xs outline-none"
            >
              <option value="" className="bg-surface dark:bg-black text-onSurface dark:text-white">Select State</option>
              {INITIAL_STATES.map(s => <option key={s.id} value={s.id} className="bg-surface dark:bg-black text-onSurface dark:text-white">{s.name}</option>)}
            </select>
          </div>

          <button 
            onClick={() => setActiveTab('comparison')}
            className="bg-secondary text-primary-dark font-bold text-xs px-4 py-2.5 rounded-full hover:bg-secondary/90 transition-all flex items-center gap-1.5 active:scale-95 shadow-sm cursor-pointer"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" /> Compare Regions
          </button>
          <button 
            onClick={() => setFeedback({ type: 'success', message: 'Downloading: Compiling population summary observatories.' })}
            className="bg-white/10 hover:bg-white/20 border border-white/25 text-white font-bold text-xs px-4 py-2.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> Download Report
          </button>
        </div>
      </section>

      {/* SECTION 2: ANALYTICS OVERVIEW */}
      <section className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {[
          { label: 'Total Population', value: '1.46 Billion', desc: 'Census Projection', icon: Globe, color: 'text-primary' },
          { label: 'Registered Citizens', value: '32.5 Million', desc: 'Digital registry count', icon: Users, color: 'text-sky-500' },
          { label: 'Total Families', value: '350 Million', desc: 'Household units count', icon: Home, color: 'text-[#ff9933]' },
          { label: 'Avg Household Size', value: '4.2 Members', desc: 'Panchayat average', icon: Grid, color: 'text-amber-500' },
          { label: 'Literacy Rate', value: '78.2%', desc: 'Primary & higher education', icon: BookOpen, color: 'text-success' },
          { label: 'Employment Rate', value: '65.1%', desc: 'Workforce participation', icon: Briefcase, color: 'text-purple-500' }
        ].map((overview) => {
          const Icon = overview.icon;
          return (
            <div key={overview.label} className="bg-surface p-4 rounded-xl border border-outlineVariant/50 shadow-sm flex flex-col gap-1.5 hover:border-primary/50 transition-colors">
              <span className="text-[10px] font-bold text-onSurfaceVariant uppercase tracking-wider">{overview.label}</span>
              <div className="text-2xl font-bold text-primary flex items-end justify-between leading-tight">
                <span>{overview.value}</span>
                <Icon className={`w-5 h-5 ${overview.color} opacity-80`} />
              </div>
              <p className="text-[9px] text-onSurfaceVariant">{overview.desc}</p>
            </div>
          );
        })}
      </section>

      {/* ANALYTICS SECTIONS SELECTOR TABS */}
      <section className="flex flex-wrap items-center gap-1 border-b border-outlineVariant/50 pb-2">
        {[
          { id: 'overview', label: 'Dashboard Overview', icon: BarChart2 },
          { id: 'demographics', label: 'Demographics & Gender', icon: Users },
          { id: 'education', label: 'Education & Literacy', icon: BookOpen },
          { id: 'employment', label: 'Employment & Industry', icon: Briefcase },
          { id: 'migration', label: 'Migration Movements', icon: ArrowLeftRight },
          { id: 'housing', label: 'Housing Conditions', icon: Home },
          { id: 'comparison', label: 'Comparison Center', icon: Layers }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-xs font-bold rounded-t-lg transition-all flex items-center gap-2 border-b-2 cursor-pointer ${
                activeTab === tab.id 
                  ? 'border-primary text-primary bg-primary-container/20 dark:bg-primary-container/10' 
                  : 'border-transparent text-onSurfaceVariant hover:text-primary'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </section>

      {/* DASHBOARD OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* GEOGRAPHIC OBSERVER MAP */}
          <div className="lg:col-span-3 bg-surface border border-outlineVariant/50 rounded-xl overflow-hidden shadow-sm flex flex-col">
            <div className="px-5 py-4 border-b border-outlineVariant/30 bg-surface-low flex items-center justify-between">
              <span className="font-bold text-sm text-primary uppercase tracking-wide flex items-center gap-2">
                <Map className="w-4 h-4 text-[#ff9933]" />
                Interactive National observatory map
              </span>
              <span className="text-[10px] text-onSurfaceVariant">NIC WGS84 Geographic layers</span>
            </div>

            <div className="relative h-[420px] bg-slate-50 dark:bg-[#071324] flex items-center justify-center">
              
              {/* Map overlays coordinates */}
              <div className="absolute top-4 left-4 z-20 bg-surface/85 border border-outlineVariant/50 p-2 rounded text-[10px] font-mono">
                Projection Grid: <strong>EPSG:4326</strong>
              </div>

              {/* Map Canvas */}
              <div className="w-full h-full flex items-center justify-center max-w-[500px]">
                <svg viewBox="0 0 500 450" className="w-full h-full p-4">
                  {/* Maharashtra */}
                  <path 
                    d="M 180,260 L 260,200 L 320,250 L 290,300 L 220,300 Z" 
                    fill={compareRegionA === 'ST-02' || compareRegionB === 'ST-02' ? 'rgba(255,153,51,0.35)' : 'rgba(59, 130, 246, 0.15)'} 
                    stroke="#ff9933" 
                    strokeWidth={1.5} 
                    className="cursor-pointer hover:fill-primary/20 transition-all"
                    onClick={() => {
                      setCompareRegionA('ST-02');
                      setFeedback({ type: 'success', message: 'Region A updated to Maharashtra' });
                    }}
                  />
                  <text x="250" y="250" fontSize="9" fill="#64748b" fontWeight="bold">MH</text>

                  {/* Karnataka */}
                  <path 
                    d="M 230,305 L 290,305 L 320,380 L 260,410 Z" 
                    fill={compareRegionA === 'ST-03' || compareRegionB === 'ST-03' ? 'rgba(255,153,51,0.35)' : 'rgba(59, 130, 246, 0.15)'} 
                    stroke="#ff9933" 
                    strokeWidth={1.5} 
                    className="cursor-pointer hover:fill-primary/20 transition-all"
                    onClick={() => {
                      setCompareRegionA('ST-03');
                      setFeedback({ type: 'success', message: 'Region A updated to Karnataka' });
                    }}
                  />
                  <text x="270" y="340" fontSize="9" fill="#64748b" fontWeight="bold">KA</text>

                  {/* Uttar Pradesh */}
                  <path 
                    d="M 295,60 L 410,60 L 410,150 L 330,150 Z" 
                    fill={compareRegionA === 'ST-05' || compareRegionB === 'ST-05' ? 'rgba(255,153,51,0.35)' : 'rgba(59, 130, 246, 0.15)'} 
                    stroke="#ff9933" 
                    strokeWidth={1.5} 
                    className="cursor-pointer hover:fill-primary/20 transition-all"
                    onClick={() => {
                      setCompareRegionA('ST-05');
                      setFeedback({ type: 'success', message: 'Region A updated to Uttar Pradesh' });
                    }}
                  />
                  <text x="350" y="100" fontSize="9" fill="#64748b" fontWeight="bold">UP</text>

                  {/* Delhi circle */}
                  <circle 
                    cx="300" cy="90" r="10" 
                    fill={compareRegionA === 'ST-01' || compareRegionB === 'ST-01' ? '#ff9933' : '#3b82f6'} 
                    stroke="#ffffff" 
                    strokeWidth={1.5} 
                    className="cursor-pointer animate-pulse"
                    onClick={() => {
                      setCompareRegionA('ST-01');
                      setFeedback({ type: 'success', message: 'Region A updated to Delhi' });
                    }}
                  />
                  <text x="320" y="90" fontSize="9" fill="#ff9933" fontWeight="bold">DL</text>
                </svg>
              </div>

              {/* State quick details overlay */}
              <div className="absolute bottom-4 right-4 z-20 bg-surface border border-outlineVariant/50 p-4 rounded-xl shadow-lg text-xs max-w-[200px] flex flex-col gap-2">
                <span className="font-bold text-primary border-b border-outlineVariant/20 pb-1 uppercase">Map quick select</span>
                <p className="text-[11px] text-onSurfaceVariant leading-normal">Click any state boundary on the GIS Map to assign it as Compare Region A.</p>
              </div>

            </div>
          </div>

          {/* AI POPULATION INSIGHTS SIDEBAR */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            
            {/* AI Insights cards */}
            <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
              <h4 className="font-bold text-xs text-primary uppercase tracking-wide border-b border-outlineVariant/20 pb-2 flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-[#ff9933]" /> AI Population Insights
              </h4>
              
              <div className="space-y-3.5">
                {AI_INSIGHTS.slice(0, 3).map((ins, i) => (
                  <div key={i} className="p-3 bg-surface-low border border-outlineVariant/20 rounded-lg text-xs flex flex-col gap-1.5">
                    <div className="flex justify-between items-center border-b border-outlineVariant/10 pb-1">
                      <span className="font-bold text-primary">{ins.title}</span>
                      <span className="text-[8px] bg-primary/10 text-primary px-2 py-0.5 rounded font-extrabold uppercase">{ins.category}</span>
                    </div>
                    <p className="text-onSurfaceVariant leading-relaxed text-[11px]">{ins.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* QUICK SHORTCUTS */}
            <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-3">
              <h4 className="font-bold text-xs text-primary uppercase border-b border-outlineVariant/20 pb-2">Quick shortcuts</h4>
              <button onClick={() => setActiveTab('demographics')} className="w-full text-left py-2 px-3 bg-surface-low hover:bg-primary-container/20 text-xs font-semibold text-primary rounded border border-outlineVariant/30 flex items-center justify-between">
                <span>View Demographics</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => setActiveTab('migration')} className="w-full text-left py-2 px-3 bg-surface-low hover:bg-primary-container/20 text-xs font-semibold text-primary rounded border border-outlineVariant/30 flex items-center justify-between">
                <span>Open Migration Flows</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => setActiveTab('comparison')} className="w-full text-left py-2 px-3 bg-surface-low hover:bg-primary-container/20 text-xs font-semibold text-primary rounded border border-outlineVariant/30 flex items-center justify-between">
                <span>Side-by-Side Compare</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>
      )}

      {/* DEMOGRAPHIC ANALYTICS SECTION */}
      {activeTab === 'demographics' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* POPULATION PYRAMID CHART */}
          <div className="lg:col-span-2 bg-surface border border-outlineVariant/50 rounded-xl p-6 shadow-sm flex flex-col gap-5">
            <div className="border-b border-outlineVariant/20 pb-3 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-base text-primary uppercase tracking-wide">National Population Pyramid</h3>
                <p className="text-xs text-onSurfaceVariant">Demographic gender cohort distribution by age group.</p>
              </div>
              <span className="text-[10px] text-success font-bold bg-green-50 px-2 py-0.5 rounded">Updated 2026</span>
            </div>

            <div className="bg-surface-low border border-outlineVariant/20 p-4 rounded-xl flex flex-col justify-between h-[360px] overflow-y-auto">
              <div className="space-y-1">
                {/* Headers */}
                <div className="flex justify-between text-[10px] font-bold text-onSurfaceVariant uppercase border-b border-outlineVariant/20 pb-1.5 mb-2">
                  <span className="w-2/5 text-right text-sky-500 pr-4">Male Population (%)</span>
                  <span className="w-1/5 text-center">Age Group</span>
                  <span className="w-2/5 text-left text-pink-500 pl-4">Female Population (%)</span>
                </div>

                {AGE_GROUPS_PYRAMID.map((cohort, i) => (
                  <div key={i} className="flex justify-between items-center text-[10px] py-0.5">
                    {/* Male bar */}
                    <div className="w-2/5 flex items-center justify-end pr-2.5">
                      <div className="bg-sky-500/80 rounded-l h-3" style={{ width: `${cohort.male * 12}%` }} />
                      <span className="text-[9px] font-semibold text-primary ml-1.5">{cohort.male}%</span>
                    </div>

                    {/* Age Cohort */}
                    <div className="w-1/5 text-center font-bold text-primary bg-primary-container/20 py-0.5 rounded">{cohort.cohort}</div>
                    
                    {/* Female bar */}
                    <div className="w-2/5 flex items-center justify-start pl-2.5">
                      <span className="text-[9px] font-semibold text-primary mr-1.5">{cohort.female}%</span>
                      <div className="bg-pink-500/80 rounded-r h-3" style={{ width: `${cohort.female * 12}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="text-[11px] text-onSurfaceVariant leading-normal border-t border-outlineVariant/20 pt-3">
              * The largest cohort represents the youth demographic between <strong>20 and 35 years</strong> (demographic dividend).
            </div>
          </div>

          {/* AGE & GENDER DISTRIBUTION DONUTS */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            
            {/* AGE DISTRIBUTION CARDS */}
            <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
              <h4 className="font-bold text-xs text-primary uppercase border-b border-outlineVariant/20 pb-2">Age Distribution categories</h4>
              
              <div className="space-y-3 text-xs">
                {[
                  { label: 'Children (0–14)', percentage: 25, color: 'bg-primary' },
                  { label: 'Youth (15–34)', percentage: 32, color: 'bg-sky-500' },
                  { label: 'Adults (35–59)', percentage: 33, color: 'bg-emerald-500' },
                  { label: 'Senior Citizens (60+)', percentage: 10, color: 'bg-amber-500' }
                ].map(item => (
                  <div key={item.label} className="space-y-1">
                    <div className="flex justify-between text-[11px] font-semibold text-primary">
                      <span>{item.label}</span>
                      <span>{item.percentage}%</span>
                    </div>
                    <div className="h-2 w-full bg-outlineVariant/20 rounded-full overflow-hidden">
                      <div className={`h-full ${item.color}`} style={{ width: `${item.percentage}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* GENDER RATIO */}
            <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
              <h4 className="font-bold text-xs text-primary uppercase border-b border-outlineVariant/20 pb-2">Gender ratio stats</h4>
              
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-surface-low border border-outlineVariant/20 p-2.5 rounded-lg">
                  <div className="text-xl font-bold text-sky-500">51%</div>
                  <span className="text-[9px] text-onSurfaceVariant">Male</span>
                </div>
                <div className="bg-surface-low border border-outlineVariant/20 p-2.5 rounded-lg">
                  <div className="text-xl font-bold text-pink-500">48%</div>
                  <span className="text-[9px] text-onSurfaceVariant">Female</span>
                </div>
                <div className="bg-surface-low border border-outlineVariant/20 p-2.5 rounded-lg">
                  <div className="text-xl font-bold text-primary">1%</div>
                  <span className="text-[9px] text-onSurfaceVariant">Others</span>
                </div>
              </div>

              <div className="p-3 bg-surface-low border border-outlineVariant/20 rounded-xl text-[11px] text-onSurfaceVariant leading-normal space-y-1">
                <strong className="text-primary font-bold block uppercase text-[9px]">Historical Trend</strong>
                <p>Gender ratio is improving compared to previous census data (currently 940 females per 1000 males nationally).</p>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* EDUCATION ANALYTICS SECTION */}
      {activeTab === 'education' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* LITERACY RATING PROGRESS & HEATMAPS */}
          <div className="lg:col-span-2 bg-surface border border-outlineVariant/50 rounded-xl p-6 shadow-sm flex flex-col gap-5">
            <div className="border-b border-outlineVariant/20 pb-3">
              <h3 className="font-bold text-base text-primary uppercase tracking-wide">National Literacy Rates</h3>
              <p className="text-xs text-onSurfaceVariant">Progress metrics across demographic age groups.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="bg-surface-low border border-outlineVariant/30 p-4 rounded-xl flex flex-col gap-2">
                <span className="text-[10px] font-bold text-onSurfaceVariant uppercase">Overall Literacy</span>
                <div className="text-3xl font-extrabold text-success">78.2%</div>
                <div className="h-1.5 w-full bg-outlineVariant/20 rounded-full overflow-hidden mt-1">
                  <div className="bg-success h-full w-[78.2%]" />
                </div>
              </div>
              <div className="bg-surface-low border border-outlineVariant/30 p-4 rounded-xl flex flex-col gap-2">
                <span className="text-[10px] font-bold text-onSurfaceVariant uppercase">Male Literacy</span>
                <div className="text-3xl font-extrabold text-primary">82.4%</div>
                <div className="h-1.5 w-full bg-outlineVariant/20 rounded-full overflow-hidden mt-1">
                  <div className="bg-primary h-full w-[82.4%]" />
                </div>
              </div>
              <div className="bg-surface-low border border-outlineVariant/30 p-4 rounded-xl flex flex-col gap-2">
                <span className="text-[10px] font-bold text-onSurfaceVariant uppercase">Female Literacy</span>
                <div className="text-3xl font-extrabold text-pink-500">74.0%</div>
                <div className="h-1.5 w-full bg-outlineVariant/20 rounded-full overflow-hidden mt-1">
                  <div className="bg-pink-500 h-full w-[74%]" />
                </div>
              </div>
            </div>

            {/* Custom SVG line chart: educational trends */}
            <div className="space-y-3 mt-4">
              <span className="text-xs font-bold text-primary uppercase tracking-wider text-[10px]">Year-wise Literacy Growth Curve</span>
              <div className="bg-surface-low border border-outlineVariant/20 p-4 rounded-xl h-[180px]">
                <svg viewBox="0 0 400 120" className="w-full h-full">
                  <line x1="30" y1="20" x2="380" y2="20" stroke="#cbd5e1" strokeWidth={0.5} strokeDasharray="2,2" />
                  <line x1="30" y1="60" x2="380" y2="60" stroke="#cbd5e1" strokeWidth={0.5} strokeDasharray="2,2" />
                  <line x1="30" y1="100" x2="380" y2="100" stroke="#94a3b8" strokeWidth={1} />
                  
                  {/* Literacy growth line */}
                  <path d="M 50,90 L 120,82 L 190,71 L 260,54 L 330,28" fill="none" stroke="#10b981" strokeWidth={2} />
                  <circle cx="50" cy="90" r="3" fill="#10b981" stroke="#ffffff" />
                  <circle cx="120" cy="82" r="3" fill="#10b981" stroke="#ffffff" />
                  <circle cx="190" cy="71" r="3" fill="#10b981" stroke="#ffffff" />
                  <circle cx="260" cy="54" r="3" fill="#10b981" stroke="#ffffff" />
                  <circle cx="330" cy="28" r="3" fill="#10b981" stroke="#ffffff" />

                  <text x="50" y="112" textAnchor="middle" fontSize="8" fill="#64748b" fontWeight="bold">1986</text>
                  <text x="120" y="112" textAnchor="middle" fontSize="8" fill="#64748b" fontWeight="bold">1996</text>
                  <text x="190" y="112" textAnchor="middle" fontSize="8" fill="#64748b" fontWeight="bold">2006</text>
                  <text x="260" y="112" textAnchor="middle" fontSize="8" fill="#64748b" fontWeight="bold">2016</text>
                  <text x="330" y="112" textAnchor="middle" fontSize="8" fill="#64748b" fontWeight="bold">2026</text>
                </svg>
              </div>
            </div>
          </div>

          {/* EDUCATION LEVEL DISTRIBUTION CARD */}
          <div className="lg:col-span-1 bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
            <h4 className="font-bold text-xs text-primary uppercase border-b border-outlineVariant/20 pb-2">Education Qualifications Funnel</h4>
            
            <div className="space-y-3 text-xs">
              {[
                { label: 'No Formal Education', percentage: 22 },
                { label: 'Primary Education', percentage: 28 },
                { label: 'Secondary Education', percentage: 20 },
                { label: 'Higher Secondary', percentage: 12 },
                { label: 'Graduates', percentage: 14 },
                { label: 'Post Graduates', percentage: 3 },
                { label: 'Professional Education', percentage: 1 }
              ].map(qual => (
                <div key={qual.label} className="space-y-1">
                  <div className="flex justify-between text-[11px] font-semibold text-primary">
                    <span>{qual.label}</span>
                    <span>{qual.percentage}%</span>
                  </div>
                  <div className="h-2 w-full bg-outlineVariant/20 rounded-full overflow-hidden">
                    <div className="bg-primary h-full" style={{ width: `${qual.percentage * 3}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="p-3 bg-surface-low border border-outlineVariant/20 rounded-xl text-[10px] text-onSurfaceVariant leading-normal mt-2">
              * Graduate demographics have increased by <strong>5.4%</strong> since the last decadal census assessment.
            </div>
          </div>

        </div>
      )}

      {/* EMPLOYMENT ANALYTICS SECTION */}
      {activeTab === 'employment' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* INDUSTRY DISTRIBUTION & WORKFORCE CURVES */}
          <div className="lg:col-span-2 bg-surface border border-outlineVariant/50 rounded-xl p-6 shadow-sm flex flex-col gap-5">
            <div className="border-b border-outlineVariant/20 pb-3">
              <h3 className="font-bold text-base text-primary uppercase tracking-wide">Workforce Industry Distribution</h3>
              <p className="text-xs text-onSurfaceVariant">Demographics partition across economic sectors.</p>
            </div>

            <div className="space-y-3.5">
              {[
                { label: 'Agriculture & allied sectors', share: 45, icon: Compass },
                { label: 'Manufacturing & industries', share: 18, icon: Grid },
                { label: 'Retail & wholesale trade', share: 14, icon: Globe },
                { label: 'Information Technology & communication', share: 11, icon: Wifi },
                { label: 'Healthcare & hospitality services', share: 8, icon: zap => Zap },
                { label: 'Financial & real estate operations', share: 4, icon: zap => Zap }
              ].map(sector => (
                <div key={sector.label} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-primary">
                    <span>{sector.label}</span>
                    <span className="font-bold">{sector.share}% share</span>
                  </div>
                  <div className="h-2 w-full bg-outlineVariant/20 rounded-full overflow-hidden">
                    <div className="bg-primary h-full" style={{ width: `${sector.share}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* OCCUPATION CATEGORIES PIE REPRESENTATION */}
          <div className="lg:col-span-1 bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
            <h4 className="font-bold text-xs text-primary uppercase border-b border-outlineVariant/20 pb-2">Occupation Categories</h4>
            
            <div className="space-y-3 text-xs">
              {[
                { label: 'Agriculture', value: '25%', color: 'bg-primary' },
                { label: 'Private Sector', value: '32%', color: 'bg-sky-500' },
                { label: 'Government Sector', value: '12%', color: 'bg-emerald-500' },
                { label: 'Self Employed', value: '18%', color: 'bg-purple-500' },
                { label: 'Retirees & Pensioners', value: '5%', color: 'bg-amber-500' },
                { label: 'Students / Unpaid', value: '8%', color: 'bg-pink-500' }
              ].map(occ => (
                <div key={occ.label} className="flex justify-between items-center p-2 bg-surface-low border border-outlineVariant/10 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${occ.color}`} />
                    <span className="font-semibold text-primary">{occ.label}</span>
                  </div>
                  <span className="font-bold text-primary">{occ.value}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* MIGRATION OBSERVED TAB */}
      {activeTab === 'migration' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* INTERSTATE MIGRATIONS TABLE */}
          <div className="lg:col-span-2 bg-surface border border-outlineVariant/50 rounded-xl p-6 shadow-sm flex flex-col gap-5">
            <div className="border-b border-outlineVariant/20 pb-3 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-base text-primary uppercase tracking-wide">Interstate Migration flows</h3>
                <p className="text-xs text-onSurfaceVariant">Volume of annual interstate relocation flows.</p>
              </div>
              <span className="text-[10px] text-success font-bold bg-green-50 px-2.5 py-1 rounded-full">Top Flows</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-surface-low border-b border-outlineVariant/30 text-onSurfaceVariant font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-2.5 px-3">Origin State</th>
                    <th className="py-2.5 px-3">Destination</th>
                    <th className="py-2.5 px-3">Annual Volume</th>
                    <th className="py-2.5 px-3">Primary Reason</th>
                    <th className="py-2.5 px-3">Annual Trend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outlineVariant/10">
                  {MOCK_MIGRATIONS.map((mig, i) => (
                    <tr key={i} className="hover:bg-primary-container/5">
                      <td className="py-3 px-3 font-semibold text-primary">{mig.origin}</td>
                      <td className="py-3 px-3 font-semibold text-primary">{mig.destination}</td>
                      <td className="py-3 px-3 text-primary">{mig.volume}</td>
                      <td className="py-3 px-3">
                        <span className="bg-primary-container/30 text-primary px-2.5 py-0.5 rounded-full font-bold text-[9px] uppercase">{mig.reason}</span>
                      </td>
                      <td className="py-3 px-3 text-success font-bold">{mig.trend}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* MIGRATION REASONS PIE CARD */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
              <h4 className="font-bold text-xs text-primary uppercase border-b border-outlineVariant/20 pb-2">Migration Reason breakdown</h4>
              
              <div className="space-y-3 text-xs">
                {[
                  { label: 'Employment search & jobs', share: 48, color: 'bg-primary' },
                  { label: 'Marriage relocation', share: 22, color: 'bg-pink-500' },
                  { label: 'Education / Higher studies', share: 14, color: 'bg-sky-500' },
                  { label: 'Family relocation', share: 10, color: 'bg-emerald-500' },
                  { label: 'Business expansions', share: 6, color: 'bg-amber-500' }
                ].map(reason => (
                  <div key={reason.label} className="space-y-1">
                    <div className="flex justify-between font-semibold text-primary">
                      <span>{reason.label}</span>
                      <span>{reason.share}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-outlineVariant/20 rounded-full overflow-hidden">
                      <div className={`h-full ${reason.color}`} style={{ width: `${reason.share}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      )}

      {/* HOUSING CONDITIONS TAB */}
      {activeTab === 'housing' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* UTILITY ACCESS BAR METERS */}
          <div className="lg:col-span-2 bg-surface border border-outlineVariant/50 rounded-xl p-6 shadow-sm flex flex-col gap-5">
            <div className="border-b border-outlineVariant/20 pb-3">
              <h3 className="font-bold text-base text-primary uppercase tracking-wide">Household Utilities Access</h3>
              <p className="text-xs text-onSurfaceVariant">Proportion of families with basic utility connections.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-surface-low border border-outlineVariant/20 p-4 rounded-xl flex items-center gap-4">
                <Zap className="w-8 h-8 text-amber-500 shrink-0" />
                <div className="flex-grow">
                  <span className="font-bold text-primary">Electricity Access</span>
                  <div className="text-2xl font-extrabold text-primary">96.8%</div>
                  <div className="h-1.5 w-full bg-outlineVariant/20 rounded-full overflow-hidden mt-1">
                    <div className="bg-amber-500 h-full w-[96.8%]" />
                  </div>
                </div>
              </div>

              <div className="bg-surface-low border border-outlineVariant/20 p-4 rounded-xl flex items-center gap-4">
                <Wifi className="w-8 h-8 text-sky-500 shrink-0" />
                <div className="flex-grow">
                  <span className="font-bold text-primary">Digital Connectivity (Internet)</span>
                  <div className="text-2xl font-extrabold text-primary">78.1%</div>
                  <div className="h-1.5 w-full bg-outlineVariant/20 rounded-full overflow-hidden mt-1">
                    <div className="bg-sky-500 h-full w-[78.1%]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Housing Infrastructure checklist scorecards */}
            <div className="space-y-3 mt-4">
              <span className="text-xs font-bold text-primary uppercase tracking-wider text-[10px]">Infrastructure Index Scorecard</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                {[
                  { name: 'Water Supply', score: '84/100', rating: 'Satisfactory' },
                  { name: 'Toilet Access', score: '92/100', rating: 'Optimal' },
                  { name: 'LPG Gas Access', score: '78/100', rating: 'Satisfactory' },
                  { name: 'Waste Disposal', score: '62/100', rating: 'Needs Staff' }
                ].map((infra, i) => (
                  <div key={i} className="p-3 bg-surface-low border border-outlineVariant/20 rounded-lg">
                    <div className="text-xs font-bold text-primary">{infra.name}</div>
                    <div className="text-lg font-extrabold text-primary my-1">{infra.score}</div>
                    <span className="text-[8px] bg-primary/10 text-primary px-2 py-0.5 rounded font-extrabold uppercase">{infra.rating}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* HOUSE OWNERSHIP PIE CARD */}
          <div className="lg:col-span-1 bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
            <h4 className="font-bold text-xs text-primary uppercase border-b border-outlineVariant/20 pb-2">Household Ownership Types</h4>
            
            <div className="space-y-3.5 text-xs">
              {[
                { label: 'Owned households', share: 72, color: 'bg-primary' },
                { label: 'Rented housing space', share: 22, color: 'bg-sky-500' },
                { label: 'Government layouts / quarters', share: 4, color: 'bg-emerald-500' },
                { label: 'Temporary shelter / slums', share: 2, color: 'bg-red-500' }
              ].map(own => (
                <div key={own.label} className="space-y-1">
                  <div className="flex justify-between font-semibold text-primary">
                    <span>{own.label}</span>
                    <span>{own.share}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-outlineVariant/20 rounded-full overflow-hidden">
                    <div className={`h-full ${own.color}`} style={{ width: `${own.share}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* REGIONAL COMPARISON CENTER */}
      {activeTab === 'comparison' && (
        <div className="bg-surface border border-outlineVariant/50 rounded-xl p-6 shadow-sm flex flex-col gap-6">
          <div className="border-b border-outlineVariant/20 pb-4 flex flex-wrap justify-between items-center gap-4">
            <div>
              <h3 className="font-bold text-lg text-primary uppercase">Regional Comparison Center</h3>
              <p className="text-xs text-onSurfaceVariant mt-0.5">Benchmark statistical parameters side-by-side between two States.</p>
            </div>

            {/* Select options */}
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-primary">Region A:</span>
                <select 
                  value={compareRegionA}
                  onChange={(e) => setCompareRegionA(e.target.value)}
                  className="px-2.5 py-1.5 bg-surface border border-outlineVariant rounded outline-none"
                >
                  {INITIAL_STATES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="font-bold text-primary">Region B:</span>
                <select 
                  value={compareRegionB}
                  onChange={(e) => setCompareRegionB(e.target.value)}
                  className="px-2.5 py-1.5 bg-surface border border-outlineVariant rounded outline-none"
                >
                  {INITIAL_STATES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Benchmark matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs">
            
            {/* Region A panel */}
            <div className="p-4 bg-surface-low border border-outlineVariant/20 rounded-xl flex flex-col gap-4">
              <div className="flex justify-between items-center border-b border-outlineVariant/10 pb-2">
                <span className="font-bold text-primary text-base">{regionAObj.name} (Region A)</span>
                <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded font-extrabold uppercase">Reference target</span>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-onSurfaceVariant">Population Size:</span>
                  <strong className="text-primary">{regionAObj.population}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-onSurfaceVariant">Literacy Rate:</span>
                  <strong className="text-success">{regionAObj.literacy}%</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-onSurfaceVariant">Employment Rate:</span>
                  <strong className="text-primary">{regionAObj.employment}%</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-onSurfaceVariant">Electricity Grid:</span>
                  <strong className="text-primary">{regionAObj.electricity}%</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-onSurfaceVariant">Internet Coverage:</span>
                  <strong className="text-primary">{regionAObj.internet}%</strong>
                </div>
              </div>
            </div>

            {/* Region B panel */}
            <div className="p-4 bg-surface-low border border-outlineVariant/20 rounded-xl flex flex-col gap-4">
              <div className="flex justify-between items-center border-b border-outlineVariant/10 pb-2">
                <span className="font-bold text-primary text-base">{regionBObj.name} (Region B)</span>
                <span className="text-[10px] bg-[#ff9933]/10 text-[#ff9933] px-2 py-0.5 rounded font-extrabold uppercase">Comparison target</span>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-onSurfaceVariant">Population Size:</span>
                  <strong className="text-primary">{regionBObj.population}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-onSurfaceVariant">Literacy Rate:</span>
                  <strong className="text-success">{regionBObj.literacy}%</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-onSurfaceVariant">Employment Rate:</span>
                  <strong className="text-primary">{regionBObj.employment}%</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-onSurfaceVariant">Electricity Grid:</span>
                  <strong className="text-primary">{regionBObj.electricity}%</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-onSurfaceVariant">Internet Coverage:</span>
                  <strong className="text-primary">{regionBObj.internet}%</strong>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* SECTION 11 & 14: REPORTS & HELP DESK */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* REPORTS CENTER */}
        <div className="lg:col-span-2 bg-surface border border-outlineVariant/50 rounded-xl p-6 shadow-sm flex flex-col gap-6">
          <div className="border-b border-outlineVariant/20 pb-4">
            <h3 className="font-bold text-lg text-primary uppercase">Analytics Reports Center</h3>
            <p className="text-xs text-onSurfaceVariant mt-1">Compile comprehensive statistical reports for demographic or migration datasets.</p>
          </div>

          <form onSubmit={handleCompileReportSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-primary uppercase text-[9px]">Report Scope Theme</label>
              <select 
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full px-3 py-2 bg-surface border border-outlineVariant rounded outline-none focus:border-primary"
              >
                <option value="Demographic Report">Demographic Report</option>
                <option value="Education Report">Education Level Report</option>
                <option value="Employment Report">Workforce & Employment Report</option>
                <option value="Migration Report">Interstate Migration Report</option>
                <option value="Housing Report">Housing & Utility Access Report</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-primary uppercase text-[9px]">File Format</label>
              <div className="flex items-center gap-4 py-2">
                <label className="flex items-center gap-1.5 font-semibold text-primary cursor-pointer">
                  <input type="radio" checked={reportFormat === 'PDF'} onChange={() => setReportFormat('PDF')} className="text-primary" /> PDF Observatory Format
                </label>
                <label className="flex items-center gap-1.5 font-semibold text-primary cursor-pointer">
                  <input type="radio" checked={reportFormat === 'CSV'} onChange={() => setReportFormat('CSV')} className="text-primary" /> Raw CSV sheet
                </label>
              </div>
            </div>

            <div className="md:col-span-2 pt-2 flex">
              <button 
                type="submit" 
                disabled={!!compileState}
                className="flex-grow py-2.5 bg-primary text-white hover:bg-primary-light disabled:bg-primary/50 font-bold rounded-lg transition-all shadow flex items-center justify-center gap-2 cursor-pointer"
              >
                {compileState === 'generating' ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Compiling Census Datasets...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Compile analytical report
                  </>
                )}
              </button>
            </div>
          </form>

          {compileState === 'done' && (
            <div className="bg-green-50 text-green-800 border border-green-200 p-4 rounded-lg text-xs flex items-center gap-3 animate-fade-in">
              <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
              <div>
                <h5 className="font-bold">Census analysis report compiled</h5>
                <p className="mt-0.5 text-[11px] text-green-700/80">Simulating download for <strong>{reportType}.{reportFormat.toLowerCase()}</strong>. Saved to observatory registry.</p>
              </div>
            </div>
          )}
        </div>

        {/* FAQS & DATA DICTIONARIES */}
        <div className="lg:col-span-1 bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
          <h4 className="font-bold text-xs text-primary uppercase border-b border-outlineVariant/20 pb-2">Glossary FAQs</h4>
          
          <div className="space-y-3.5">
            {FAQS.map((faq, i) => (
              <div key={i} className="text-xs space-y-1.5 p-3 bg-surface-low border border-outlineVariant/20 rounded-lg">
                <strong className="text-primary font-bold flex items-start gap-1">
                  <HelpCircle className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" /> {faq.q}
                </strong>
                <p className="text-onSurfaceVariant leading-relaxed pl-4.5">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

      </section>

      {/* CHATBOT OBSERVATORY DICTIONARY */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Support manual link list */}
        <div className="lg:col-span-2 bg-surface border border-outlineVariant/50 rounded-xl p-6 shadow-sm flex flex-col gap-4">
          <div className="border-b border-outlineVariant/20 pb-2">
            <span className="font-bold text-xs text-primary uppercase tracking-wide">Observatory Manuals</span>
            <p className="text-xs text-onSurfaceVariant mt-0.5">Demographic calculation methods and census definitions.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            {[
              { name: 'Literacy Rate Computation (UN Rules)', link: 'NIC Observatories' },
              { name: 'Workforce Categorization specifications', link: 'Ministry of Labor' },
              { name: 'Interstate Migration tracking standard', link: 'Statistics Board' }
            ].map((manual, i) => (
              <div key={i} className="p-3 bg-surface-low border border-outlineVariant/20 rounded-lg flex flex-col justify-between gap-3 hover:border-primary/40 transition-all">
                <strong className="font-bold text-primary block leading-snug">{manual.name}</strong>
                <span className="text-[9px] text-onSurfaceVariant font-bold uppercase">{manual.link}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Live chat bot box */}
        <div className="lg:col-span-1 bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
          <div className="border-b border-outlineVariant/20 pb-2">
            <h4 className="font-bold text-xs text-primary uppercase">Analytics chatbot support</h4>
            <p className="text-[10px] text-onSurfaceVariant">Immediate queries on census analytical methods.</p>
          </div>

          <div className="bg-surface-low border border-outlineVariant/20 rounded-xl p-3 h-[180px] overflow-y-auto flex flex-col gap-2.5">
            {chatMessages.map((m, i) => (
              <div key={i} className={`p-2.5 rounded-lg text-xs leading-relaxed max-w-[85%] ${
                m.sender.startsWith('You') 
                  ? 'bg-primary text-white ml-auto' 
                  : 'bg-surface border border-outlineVariant/20 mr-auto text-primary'
              }`}>
                <div className="text-[8px] opacity-70 uppercase font-bold mb-0.5">{m.sender}</div>
                <div>{m.text}</div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendChatMessage} className="flex gap-2">
            <input 
              type="text" 
              placeholder="Ask about youth dividend, literacy trends..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-1 px-3 py-1.5 bg-surface border border-outlineVariant/50 rounded-lg text-xs outline-none focus:border-primary"
            />
            <button type="submit" className="bg-primary text-white hover:bg-primary-light px-3.5 py-1.5 rounded-lg flex items-center justify-center cursor-pointer">
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

      </section>

    </div>
  );
};

export default PopulationAnalytics;
