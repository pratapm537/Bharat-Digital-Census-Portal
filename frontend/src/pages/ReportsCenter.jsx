import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldAlert, AlertTriangle, Check, X, Shield, Lock, Eye, Download, 
  FileText, Activity, Users, UserCheck, RefreshCw, ZoomIn, ZoomOut, 
  MapPin, Clock, ArrowRight, ShieldCheck, ChevronRight, HelpCircle, 
  Maximize2, Plus, Edit2, Play, CheckCircle2, AlertCircle, BarChart2, 
  FileSpreadsheet, Send, TrendingUp, Compass, Network, Landmark,
  Mail, Phone, Bell, Calendar, Flame, Zap, Copy, File, Paperclip, Grid,
  Filter, Share2, Clipboard, Printer
} from 'lucide-react';

// ==========================================
// MOCK REPORTING DATASET
// ==========================================
const INITIAL_LIBRARY = [
  { id: 'REP-10492', name: 'National Demographic Profile 2026', type: 'Population', format: 'PDF', createdDate: '2026-06-05', createdBy: 'Anjali Desai', downloads: 320, status: 'Signed' },
  { id: 'REP-10493', name: 'Delhi Address Verification Coverage', type: 'Operational', format: 'Excel', createdDate: '2026-06-04', createdBy: 'Rahul Sharma', downloads: 145, status: 'Archived' },
  { id: 'REP-10494', name: 'Literacy and Education Funnel Analysis', type: 'Education', format: 'PDF', createdDate: '2026-06-02', createdBy: 'System Scheduler', downloads: 820, status: 'Signed' },
  { id: 'REP-10495', name: 'Rural-to-Urban Migration Flow Logs', type: 'Migration', format: 'CSV', createdDate: '2026-05-28', createdBy: 'Vikram Singh', downloads: 95, status: 'Ready' }
];

const INITIAL_SCHEDULED_JOBS = [
  { id: 'JOB-01', name: 'Daily Officer Activity Log', interval: 'Daily (08:00 PM)', format: 'Excel', recipients: 'Zonal Supervisors', status: 'Active' },
  { id: 'JOB-02', name: 'Weekly Census Verification Progress', interval: 'Weekly (Mon 09:00 AM)', format: 'PDF', recipients: 'Directorate Office', status: 'Active' },
  { id: 'JOB-03', name: 'Monthly Executive Population Trends', interval: 'Monthly (1st Day 10:00 AM)', format: 'PDF', recipients: 'Ministry Board', status: 'Active' }
];

const AUDIT_HISTORY = [
  { id: 'AUD-901', action: 'Report Generated', name: 'National Demographic Profile 2026', user: 'Anjali Desai', timestamp: '2026-06-05 02:30 PM' },
  { id: 'AUD-902', action: 'Report Downloaded (Excel)', name: 'Delhi Address Verification Coverage', user: 'Rahul Sharma', timestamp: '2026-06-05 10:15 AM' },
  { id: 'AUD-903', action: 'Report Shared via Email', name: 'Literacy and Education Funnel Analysis', user: 'Anjali Desai', timestamp: '2026-06-03 04:20 PM' },
  { id: 'AUD-904', action: 'Scheduled Job Triggered', name: 'Daily Officer Activity Log', user: 'System Scheduler', timestamp: '2026-06-05 08:00 PM' }
];

const ReportsCenter = () => {
  const navigate = useNavigate();

  // -------------------------------------------------------------
  // STATE VARIABLE BINDINGS
  // -------------------------------------------------------------
  const [activeReportTab, setActiveReportTab] = useState('state'); // 'state', 'district', 'population', 'literacy', 'employment', 'custom'
  const [library, setLibrary] = useState(INITIAL_LIBRARY);
  const [scheduledJobs, setScheduledJobs] = useState(INITIAL_SCHEDULED_JOBS);
  const [audits, setAudits] = useState(AUDIT_HISTORY);

  // Filters Center
  const [filterState, setFilterState] = useState('Delhi');
  const [filterDistrict, setFilterDistrict] = useState('Central Delhi');
  const [filterGender, setFilterGender] = useState('All');
  const [filterAgeGroup, setFilterAgeGroup] = useState('All');
  const [filterEduLevel, setFilterEduLevel] = useState('All');
  const [filterEmpStatus, setFilterEmpStatus] = useState('All');
  const [filterVerification, setFilterVerification] = useState('All');
  const [dateRange, setDateRange] = useState('2026-01-01 to 2026-06-30');

  // Custom Report Builder items
  const [selectedSources, setSelectedSources] = useState(['Population Data', 'Verification Data']);
  const [customReportName, setCustomReportName] = useState('Custom Zonal Census Report');

  // Scheduler Form
  const [schedName, setSchedName] = useState('Weekly Verification Summary');
  const [schedInterval, setSchedInterval] = useState('Weekly');
  const [schedFormat, setSchedFormat] = useState('PDF');
  const [schedRecipients, setSchedRecipients] = useState('State Census Director');

  // Interactive View scale
  const [chartZoom, setChartZoom] = useState(1);
  const [reportState, setReportState] = useState(null); // 'compiling', 'done'
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  // Toast feedback
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  // Auto clear feedback
  useEffect(() => {
    if (feedback.message) {
      const timer = setTimeout(() => setFeedback({ type: '', message: '' }), 4000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  // -------------------------------------------------------------
  // OPERATIONS HANDLERS
  // -------------------------------------------------------------
  const handleGenerateReport = (e) => {
    if (e) e.preventDefault();
    setReportState('compiling');
    
    setTimeout(() => {
      const timestamp = new Date().toLocaleString();
      const randomSuffix = Math.floor(10000 + Math.random() * 90000);
      const newId = `REP-${randomSuffix}`;

      let reportName = '';
      if (activeReportTab === 'state') reportName = `${filterState} Demographic Profile Summary`;
      else if (activeReportTab === 'district') reportName = `${filterDistrict} Operational Summary`;
      else if (activeReportTab === 'population') reportName = 'Demographic Cohort Distribution Chart';
      else if (activeReportTab === 'literacy') reportName = 'National Literacy & Qualification Analysis';
      else if (activeReportTab === 'employment') reportName = 'Workforce sectors and occupation logs';
      else reportName = customReportName || 'Custom Census Data Summary';

      const newRep = {
        id: newId,
        name: reportName,
        type: activeReportTab.charAt(0).toUpperCase() + activeReportTab.slice(1),
        format: schedFormat || 'PDF',
        createdDate: new Date().toISOString().split('T')[0],
        createdBy: 'Administrator',
        downloads: 0,
        status: 'Ready'
      };

      const newAudit = {
        id: `AUD-${Math.floor(900 + Math.random() * 99)}`,
        action: 'Report Generated',
        name: reportName,
        user: 'Administrator',
        timestamp
      };

      setLibrary([newRep, ...library]);
      setAudits([newAudit, ...audits]);
      setReportState(null);
      setShowGenerateModal(false);
      setFeedback({ type: 'success', message: `Report "${reportName}" successfully compiled and signed.` });
    }, 2000);
  };

  const handleScheduleReport = (e) => {
    e.preventDefault();
    if (!schedName) {
      setFeedback({ type: 'error', message: 'Please enter a schedule job name.' });
      return;
    }

    const randomSuffix = Math.floor(10 + Math.random() * 90);
    const newJob = {
      id: `JOB-${randomSuffix}`,
      name: schedName,
      interval: `${schedInterval} (${schedInterval === 'Daily' ? '08:00 PM' : 'Mon 09:00 AM'})`,
      format: schedFormat,
      recipients: schedRecipients,
      status: 'Active'
    };

    setScheduledJobs([newJob, ...scheduledJobs]);
    setShowScheduleModal(false);
    setSchedName('');
    setFeedback({ type: 'success', message: `Scheduled report job "${newJob.name}" successfully registered in cron engine.` });
  };

  const toggleJobStatus = (id) => {
    const updated = scheduledJobs.map(j => {
      if (j.id === id) {
        const nextStatus = j.status === 'Active' ? 'Paused' : 'Active';
        setFeedback({ type: 'warning', message: `Schedule Job "${j.name}" status set to "${nextStatus}".` });
        return { ...c, status: nextStatus };
      }
      return j;
    });
    setScheduledJobs(updated);
  };

  const handleSourceCheckboxToggle = (src) => {
    if (selectedSources.includes(src)) {
      setSelectedSources(selectedSources.filter(s => s !== src));
    } else {
      setSelectedSources([...selectedSources, src]);
    }
  };

  const handleDownloadReport = (rep) => {
    const timestamp = new Date().toLocaleString();
    const updatedLib = library.map(l => l.id === rep.id ? { ...l, downloads: l.downloads + 1 } : l);
    
    const newAudit = {
      id: `AUD-${Math.floor(900 + Math.random() * 99)}`,
      action: `Downloaded (${rep.format})`,
      name: rep.name,
      user: 'Administrator',
      timestamp
    };

    setLibrary(updatedLib);
    setAudits([newAudit, ...audits]);
    setFeedback({ type: 'success', message: `Downloading document file "${rep.name}.${rep.format.toLowerCase()}" to local system.` });
  };

  const handleShareReport = (rep) => {
    const timestamp = new Date().toLocaleString();
    const newAudit = {
      id: `AUD-${Math.floor(900 + Math.random() * 99)}`,
      action: 'Shared Report via Email',
      name: rep.name,
      user: 'Administrator',
      timestamp
    };

    setAudits([newAudit, ...audits]);
    setFeedback({ type: 'success', message: `Report link dispatched to recipients in departments list.` });
  };

  // Filter library
  const filteredLibrary = library.filter(rep => {
    const matchesSearch = rep.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          rep.createdBy.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="flex-grow w-full max-w-containerMax mx-auto px-6 py-8 flex flex-col gap-8 text-onSurface bg-background">
      
      {/* CSS Dark Mode Overrides */}
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

      {/* TOAST FEEDBACK NOTIFICATIONS */}
      {feedback.message && (
        <div className={`fixed bottom-6 right-6 z-50 p-4 rounded-lg shadow-xl flex items-center gap-3 border text-xs max-w-sm animate-fade-in ${
          feedback.type === 'success' ? 'bg-green-50 text-green-800 border-green-200 dark:bg-green-950/80 dark:text-green-300 dark:border-green-800' :
          feedback.type === 'warning' ? 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-800' :
          'bg-red-50 text-red-800 border-red-200 dark:bg-red-950/80 dark:text-red-300 dark:border-red-800'
        }`}>
          {feedback.type === 'success' && <CheckCircle2 className="w-5 h-5 shrink-0 text-success" />}
          {feedback.type === 'warning' && <AlertTriangle className="w-5 h-5 shrink-0 text-amber-500" />}
          {feedback.type === 'error' && <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* SECTION 1: PAGE HEADER */}
      <section className="relative overflow-hidden rounded-xl border border-outlineVariant/50 bg-primary p-6 text-white shadow-ambient flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex flex-col gap-2 relative z-10">
          <div className="flex items-center gap-2">
            <span className="bg-[#ff9933]/20 border border-[#ff9933]/30 text-[#ff9933] font-bold uppercase text-[9px] px-2.5 py-0.5 rounded-full tracking-wider animate-pulse">
              National Intelligence Observatories
            </span>
            <span className="text-[10px] text-white/70 font-semibold">â€¢ Ministry of Home Affairs</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Reports Center</h2>
          <p className="text-xs text-white/80 max-w-xl leading-relaxed">
            Generate, analyze, schedule, export, and distribute census reports across all administrative levels.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 relative z-10 shrink-0">
          <button 
            onClick={() => { setShowGenerateModal(true); }}
            className="bg-secondary text-primary-dark font-bold text-xs px-4 py-2.5 rounded-full hover:bg-secondary/90 transition-all flex items-center gap-1.5 active:scale-95 shadow-sm cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Generate Report
          </button>
          <button 
            onClick={() => { setShowScheduleModal(true); }}
            className="bg-white/10 hover:bg-white/20 border border-white/25 text-white font-bold text-xs px-4 py-2.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5" /> Schedule Report
          </button>
          <button 
            onClick={() => handleCompileReport(reportSelection)}
            className="bg-white/10 hover:bg-white/20 border border-white/25 text-white font-bold text-xs px-4 py-2.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> Export Report
          </button>
          <button 
            onClick={() => { window.scrollTo({ top: 800, behavior: 'smooth' }); }}
            className="bg-white/10 hover:bg-white/20 border border-white/25 text-white font-bold text-xs px-4 py-2.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <BarChart2 className="w-3.5 h-3.5" /> Open Visuals
          </button>
        </div>
      </section>

      {/* SECTION 2: REPORTING OVERVIEW */}
      <section className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {[
          { label: 'Reports Generated', count: '125,000', status: 'Cumulative compiles', icon: FileText, color: 'text-primary' },
          { label: 'Scheduled Reports', count: '3,500', status: 'Active cron plans', icon: Calendar, color: 'text-primary' },
          { label: 'Total Downloads', count: '80,000', status: 'PDF, Excel, CSV formats', icon: Download, color: 'text-success' },
          { label: 'Shared Files', count: '12,400', status: 'Department shares', icon: Share2, color: 'text-amber-500' },
          { label: 'Active Dashboards', count: '14 Board', status: 'Analytics templates', icon: Grid, color: 'text-primary' },
          { label: 'Pending Jobs', count: '8 Jobs', status: 'Awaiting execution', icon: Clock, color: 'text-amber-500' }
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-surface p-4 rounded-xl border border-outlineVariant/50 shadow-sm flex flex-col gap-1.5 hover:border-primary/50 transition-colors">
              <span className="text-[10px] font-bold text-onSurfaceVariant uppercase tracking-wider">{stat.label}</span>
              <div className="text-lg font-bold text-primary flex items-end justify-between">
                <span>{stat.count}</span>
                <Icon className={`w-4 h-4 ${stat.color} opacity-80`} />
              </div>
              <p className="text-[9px] text-onSurfaceVariant">{stat.status}</p>
            </div>
          );
        })}
      </section>

      {/* TWO COLUMN WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: FILTERS, BUILDER, VISUALIZATION (8 COLS) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* SECTION 5: REPORT FILTER CENTER */}
          <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
            <h3 className="font-bold text-xs text-primary uppercase tracking-wider flex items-center gap-1.5">
              <Filter className="w-4 h-4" /> Reports Parameters Filter Center
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div className="flex flex-col gap-1">
                <label className="font-bold text-primary uppercase text-[8px]">State Jurisdiction</label>
                <select 
                  value={filterState}
                  onChange={e => setFilterState(e.target.value)}
                  className="px-2 py-1.5 bg-surface border border-outlineVariant rounded outline-none text-xs focus:border-primary text-onSurface"
                >
                  <option value="Delhi">Delhi NCT</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Rajasthan">Rajasthan</option>
                  <option value="Karnataka">Karnataka</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-primary uppercase text-[8px]">District</label>
                <select 
                  value={filterDistrict}
                  onChange={e => setFilterDistrict(e.target.value)}
                  className="px-2 py-1.5 bg-surface border border-outlineVariant rounded outline-none text-xs focus:border-primary text-onSurface"
                >
                  <option value="Central Delhi">Central Delhi</option>
                  <option value="East Delhi">East Delhi</option>
                  <option value="New Delhi">New Delhi</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-primary uppercase text-[8px]">Verification Status</label>
                <select 
                  value={filterVerification}
                  onChange={e => setFilterVerification(e.target.value)}
                  className="px-2 py-1.5 bg-surface border border-outlineVariant rounded outline-none text-xs focus:border-primary text-onSurface"
                >
                  <option value="All">All Statuses</option>
                  <option value="Verified">Verified Only</option>
                  <option value="Pending">Pending Audit</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-primary uppercase text-[8px]">Date Range</label>
                <input 
                  type="text" 
                  value={dateRange}
                  onChange={e => setDateRange(e.target.value)}
                  className="px-2 py-1.5 bg-surface border border-outlineVariant rounded outline-none text-xs focus:border-primary text-onSurface"
                />
              </div>
            </div>

            {/* Sub demographic filters */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs border-t border-outlineVariant/10 pt-3">
              <div className="flex flex-col gap-1">
                <label className="font-bold text-primary uppercase text-[8px]">Gender Cohort</label>
                <select value={filterGender} onChange={e => setFilterGender(e.target.value)} className="px-2 py-1 bg-surface border border-outlineVariant rounded text-xs text-onSurface">
                  <option value="All">All Genders</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-bold text-primary uppercase text-[8px]">Age cohort</label>
                <select value={filterAgeGroup} onChange={e => setFilterAgeGroup(e.target.value)} className="px-2 py-1 bg-surface border border-outlineVariant rounded text-xs text-onSurface">
                  <option value="All">All Ages</option>
                  <option value="0-14">Children (0-14)</option>
                  <option value="15-35">Youth (15-35)</option>
                  <option value="36-60">Adults (36-60)</option>
                  <option value="60+">Seniors (60+)</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-bold text-primary uppercase text-[8px]">Education level</label>
                <select value={filterEduLevel} onChange={e => setFilterEduLevel(e.target.value)} className="px-2 py-1 bg-surface border border-outlineVariant rounded text-xs text-onSurface">
                  <option value="All">All Levels</option>
                  <option value="Primary">Primary</option>
                  <option value="Secondary">Secondary</option>
                  <option value="Graduate">Graduate</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-bold text-primary uppercase text-[8px]">Workforce Status</label>
                <select value={filterEmpStatus} onChange={e => setFilterEmpStatus(e.target.value)} className="px-2 py-1 bg-surface border border-outlineVariant rounded text-xs text-onSurface">
                  <option value="All">All Statuses</option>
                  <option value="Employed">Employed</option>
                  <option value="Unemployed">Unemployed</option>
                  <option value="Retired">Retired</option>
                </select>
              </div>
            </div>
          </div>

          {/* SECTION 3: GENERATE REPORTS */}
          <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
            
            <div className="flex justify-between items-center border-b border-outlineVariant/15 pb-2.5">
              <h3 className="font-bold text-xs text-primary uppercase tracking-wider">National Report Catalog Templates</h3>
              <span className="text-[10px] text-onSurfaceVariant font-bold">Select template to configure</span>
            </div>

            {/* Sub reports tabs */}
            <div className="flex border-b border-outlineVariant/20 pb-1 text-xs overflow-x-auto gap-2">
              {[
                { id: 'state', label: 'State Report' },
                { id: 'district', label: 'District Report' },
                { id: 'population', label: 'Population' },
                { id: 'literacy', label: 'Literacy' },
                { id: 'employment', label: 'Employment' },
                { id: 'custom', label: 'Custom Builder' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveReportTab(tab.id)}
                  className={`px-3 py-2 font-bold transition-colors cursor-pointer shrink-0 border-b-2 ${
                    activeReportTab === tab.id 
                      ? 'border-primary text-primary' 
                      : 'border-transparent text-onSurfaceVariant hover:text-primary'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Sub report bodies */}
            <div className="text-xs">
              
              {activeReportTab === 'state' && (
                <div className="space-y-3.5 animate-fade-in">
                  <h4 className="font-bold text-xs text-primary uppercase">State-Level Census Synthesis: {filterState}</h4>
                  <div className="p-3.5 bg-surface-low border border-outlineVariant/20 rounded-lg grid grid-cols-2 gap-3 text-[10px] text-onSurfaceVariant">
                    <div>Jurisdiction: <strong className="text-primary">{filterState}</strong></div>
                    <div>Target Period: <strong className="text-primary">{dateRange}</strong></div>
                    <div>Demographics Included: <strong className="text-primary">Population, Literacy, Employment, Housing, Migration</strong></div>
                    <div>Verification Status Filter: <strong className="text-primary">{filterVerification}</strong></div>
                  </div>
                  <div className="flex gap-2 justify-end mt-2">
                    <button 
                      onClick={() => handleGenerateReport()}
                      className="bg-primary hover:bg-primary-light text-white font-bold px-4 py-2 rounded-full cursor-pointer"
                    >
                      Compile State Report
                    </button>
                  </div>
                </div>
              )}

              {activeReportTab === 'district' && (
                <div className="space-y-3.5 animate-fade-in">
                  <h4 className="font-bold text-xs text-primary uppercase">District Operational coverage: {filterDistrict}</h4>
                  <div className="p-3.5 bg-surface-low border border-outlineVariant/20 rounded-lg grid grid-cols-2 gap-3 text-[10px] text-onSurfaceVariant">
                    <div>Jurisdiction: <strong className="text-primary">{filterState} - {filterDistrict}</strong></div>
                    <div>Coverage filters: <strong className="text-primary">Wards, Blocks, Census Coordinates</strong></div>
                    <div>Officer performance audits: <strong className="text-primary">Active</strong></div>
                    <div>Complaint logs summary: <strong className="text-primary">Enabled</strong></div>
                  </div>
                  <div className="flex gap-2 justify-end mt-2">
                    <button 
                      onClick={() => handleGenerateReport()}
                      className="bg-primary hover:bg-primary-light text-white font-bold px-4 py-2 rounded-full cursor-pointer"
                    >
                      Compile District Report
                    </button>
                  </div>
                </div>
              )}

              {activeReportTab === 'population' && (
                <div className="space-y-3.5 animate-fade-in">
                  <h4 className="font-bold text-xs text-primary uppercase">Demographic Cohort & Pyramid observations</h4>
                  <div className="p-3.5 bg-surface-low border border-outlineVariant/20 rounded-lg grid grid-cols-2 gap-3 text-[10px] text-onSurfaceVariant">
                    <div>Filters active: <strong className="text-primary">Age ({filterAgeGroup}), Gender ({filterGender})</strong></div>
                    <div>Demographics pyramid cohorts: <strong className="text-primary">Included</strong></div>
                    <div>Migration patterns tracking: <strong className="text-primary">Enabled</strong></div>
                    <div>Growth forecast projection: <strong className="text-primary">10-Year Index</strong></div>
                  </div>
                  <div className="flex gap-2 justify-end mt-2">
                    <button 
                      onClick={() => handleGenerateReport()}
                      className="bg-primary hover:bg-primary-light text-white font-bold px-4 py-2 rounded-full cursor-pointer"
                    >
                      Compile Population Report
                    </button>
                  </div>
                </div>
              )}

              {activeReportTab === 'literacy' && (
                <div className="space-y-3.5 animate-fade-in">
                  <h4 className="font-bold text-xs text-primary uppercase">National Literacy Ratios & Qualification Levels</h4>
                  <div className="p-3.5 bg-surface-low border border-outlineVariant/20 rounded-lg grid grid-cols-2 gap-3 text-[10px] text-onSurfaceVariant">
                    <div>Education qualification filters: <strong className="text-primary">{filterEduLevel}</strong></div>
                    <div>Male vs Female Literacy gaps: <strong className="text-primary">Enabled</strong></div>
                    <div>School attendance audit: <strong className="text-primary">Included</strong></div>
                    <div>Regional heatmaps overlays: <strong className="text-primary">Delhi, Maharashtra, Karnataka</strong></div>
                  </div>
                  <div className="flex gap-2 justify-end mt-2">
                    <button 
                      onClick={() => handleGenerateReport()}
                      className="bg-primary hover:bg-primary-light text-white font-bold px-4 py-2 rounded-full cursor-pointer"
                    >
                      Compile Literacy Report
                    </button>
                  </div>
                </div>
              )}

              {activeReportTab === 'employment' && (
                <div className="space-y-3.5 animate-fade-in">
                  <h4 className="font-bold text-xs text-primary uppercase">Workforce Participation & Unemployment Analysis</h4>
                  <div className="p-3.5 bg-surface-low border border-outlineVariant/20 rounded-lg grid grid-cols-2 gap-3 text-[10px] text-onSurfaceVariant">
                    <div>Workforce status: <strong className="text-primary">{filterEmpStatus}</strong></div>
                    <div>Occupation categories: <strong className="text-primary">Agriculture, Corporate, Govt, Self-Employed</strong></div>
                    <div>Industry sector shares: <strong className="text-primary">Included</strong></div>
                    <div>Unemployment duration metric: <strong className="text-primary">Enabled</strong></div>
                  </div>
                  <div className="flex gap-2 justify-end mt-2">
                    <button 
                      onClick={() => handleGenerateReport()}
                      className="bg-primary hover:bg-primary-light text-white font-bold px-4 py-2 rounded-full cursor-pointer"
                    >
                      Compile Employment Report
                    </button>
                  </div>
                </div>
              )}

              {/* SECTION 4: CUSTOM REPORT BUILDER */}
              {activeReportTab === 'custom' && (
                <div className="space-y-4 animate-fade-in">
                  <h4 className="font-bold text-xs text-primary uppercase">Simulated Custom Drag & Drop Report Builder</h4>
                  
                  <div className="flex flex-col gap-2">
                    <label className="font-bold text-primary uppercase text-[8px]">Report Name</label>
                    <input 
                      type="text" 
                      value={customReportName}
                      onChange={e => setCustomReportName(e.target.value)}
                      className="px-2.5 py-1.5 bg-surface border border-outlineVariant rounded outline-none text-xs focus:border-primary text-onSurface w-full"
                    />
                  </div>

                  {/* Sources checkboxes */}
                  <div>
                    <span className="font-bold text-primary uppercase text-[8px] block mb-2">Select Data Sources to Drag & Include</span>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {['Population Data', 'Family Data', 'Verification Data', 'Officer Data', 'Complaint Data', 'Benefits Data'].map(src => (
                        <div 
                          key={src} 
                          onClick={() => handleSourceCheckboxToggle(src)}
                          className={`p-2.5 border rounded-lg flex items-center gap-2 cursor-pointer transition-all ${
                            selectedSources.includes(src) 
                              ? 'border-primary bg-primary-container/10 font-bold text-primary' 
                              : 'border-outlineVariant/20 hover:bg-surface-low text-onSurfaceVariant'
                          }`}
                        >
                          <input 
                            type="checkbox" 
                            checked={selectedSources.includes(src)}
                            onChange={() => {}} // handled by parent div click
                            className="pointer-events-none"
                          />
                          <span>{src}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end mt-2">
                    <button 
                      onClick={() => handleGenerateReport()}
                      className="bg-primary hover:bg-primary-light text-white font-bold px-4 py-2 rounded-full cursor-pointer"
                    >
                      Compile Custom Layout
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* SECTION 6: REPORT VISUALIZATION CENTER */}
          <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-outlineVariant/15 pb-2">
              <h3 className="font-bold text-xs text-primary uppercase tracking-wider flex items-center gap-1.5">
                <BarChart2 className="w-4 h-4 text-primary" /> Visual Analytics Center
              </h3>
              <div className="flex gap-2 text-xs font-bold items-center text-onSurfaceVariant">
                <button onClick={() => setChartZoom(prev => Math.max(0.7, prev - 0.15))} className="p-1 border border-outlineVariant hover:bg-surface-low rounded cursor-pointer" title="Zoom Out">-</button>
                <span>Scale: {(chartZoom*100).toFixed(0)}%</span>
                <button onClick={() => setChartZoom(prev => Math.min(1.5, prev + 0.15))} className="p-1 border border-outlineVariant hover:bg-surface-low rounded cursor-pointer" title="Zoom In">+</button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center" style={{ transform: `scale(${chartZoom})`, transformOrigin: 'top left' }}>
              
              {/* Custom SVG line chart (Growth) */}
              <div className="flex flex-col items-center gap-2">
                <span className="text-[9px] font-bold text-primary uppercase">State-wise Census Coverage Rates</span>
                <svg viewBox="0 0 160 80" className="w-full h-24">
                  {/* Grid lines */}
                  <line x1="0" y1="20" x2="160" y2="20" stroke="#eceef0" strokeWidth="0.5" />
                  <line x1="0" y1="40" x2="160" y2="40" stroke="#eceef0" strokeWidth="0.5" />
                  <line x1="0" y1="60" x2="160" y2="60" stroke="#eceef0" strokeWidth="0.5" />
                  {/* Bars comparing Delhi, Maharashtra, Rajasthan, Karnataka */}
                  {/* Delhi */}
                  <rect x="15" y={80 - 65} width="16" height="65" fill="#3f51b5" rounded-t="true" />
                  {/* Maharashtra */}
                  <rect x="50" y={80 - 72} width="16" height="72" fill="#10b981" />
                  {/* Rajasthan */}
                  <rect x="85" y={80 - 45} width="16" height="45" fill="#f59e0b" />
                  {/* Karnataka */}
                  <rect x="120" y={80 - 58} width="16" height="58" fill="#ef4444" />
                </svg>
                <div className="flex justify-between w-full text-[8px] font-semibold text-onSurfaceVariant px-1 mt-1">
                  <span>Delhi (81%)</span>
                  <span>Maha (90%)</span>
                  <span>Raj (56%)</span>
                  <span>Karn (72%)</span>
                </div>
              </div>

              {/* Custom SVG pie chart */}
              <div className="flex flex-col items-center gap-2">
                <span className="text-[9px] font-bold text-primary uppercase">National Gender Cohort Shares</span>
                <svg viewBox="0 0 160 100" className="w-full h-24">
                  {/* Pie segments */}
                  {/* Outer circle base */}
                  <circle cx="80" cy="50" r="38" fill="#e0e3e5" />
                  {/* Slices representation using custom arcs */}
                  <path d="M80,50 L80,12 A38,38 0 0,1 116,38 Z" fill="#3f51b5" /> {/* Male (48%) */}
                  <path d="M80,50 L116,38 A38,38 0 1,1 80,12 Z" fill="#10b981" /> {/* Female (52%) */}
                </svg>
                <div className="flex gap-4 text-[9px] font-bold text-onSurfaceVariant justify-center mt-1">
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-[#3f51b5] rounded-full" /> Male: 48.8%</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-[#10b981] rounded-full" /> Female: 51.2%</span>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: SCHEDULERS, LIBRARY, ACCESS LOGS (4 COLS) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* SECTION 7: EXPORT FORMAT PREVIEWS */}
          <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
            <h3 className="font-bold text-xs text-primary uppercase tracking-wider">Export Document Formats</h3>
            
            <div className="space-y-3.5">
              {/* PDF card */}
              <div className="p-3 bg-surface-low border border-outlineVariant/20 rounded-lg flex items-center justify-between text-xs">
                <div>
                  <strong className="text-primary block flex items-center gap-1"><FileText className="w-3.5 h-3.5" /> PDF Document</strong>
                  <span className="text-[9px] text-onSurfaceVariant">Signed printable sheets, 1.2 MB</span>
                </div>
                <button 
                  onClick={() => handleGenerateReport()}
                  className="bg-primary hover:bg-primary-light text-white font-bold text-[10px] px-3 py-1.5 rounded cursor-pointer"
                >
                  Export PDF
                </button>
              </div>

              {/* Excel card */}
              <div className="p-3 bg-surface-low border border-outlineVariant/20 rounded-lg flex items-center justify-between text-xs">
                <div>
                  <strong className="text-primary block flex items-center gap-1"><FileSpreadsheet className="w-3.5 h-3.5" /> Excel Spreadsheet</strong>
                  <span className="text-[9px] text-onSurfaceVariant">Multi-sheet analysis data grid</span>
                </div>
                <button 
                  onClick={() => handleGenerateReport()}
                  className="bg-primary hover:bg-primary-light text-white font-bold text-[10px] px-3 py-1.5 rounded cursor-pointer"
                >
                  Export Excel
                </button>
              </div>

              {/* CSV card */}
              <div className="p-3 bg-surface-low border border-outlineVariant/20 rounded-lg flex items-center justify-between text-xs">
                <div>
                  <strong className="text-primary block flex items-center gap-1"><File className="w-3.5 h-3.5" /> CSV Raw Output</strong>
                  <span className="text-[9px] text-onSurfaceVariant">Unstructured data tables, 420 KB</span>
                </div>
                <button 
                  onClick={() => handleGenerateReport()}
                  className="bg-primary hover:bg-primary-light text-white font-bold text-[10px] px-3 py-1.5 rounded cursor-pointer"
                >
                  Export CSV
                </button>
              </div>
            </div>
          </div>

          {/* SECTION 8: SCHEDULED REPORTS PLANNER */}
          <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-outlineVariant/15 pb-2">
              <h3 className="font-bold text-xs text-primary uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-primary" /> Scheduled report jobs
              </h3>
              <button 
                onClick={() => setShowScheduleModal(true)}
                className="text-primary hover:underline text-xs font-bold cursor-pointer"
              >
                + Schedule
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              {scheduledJobs.map(job => (
                <div key={job.id} className="p-3.5 bg-surface-low border border-outlineVariant/20 rounded-lg flex flex-col gap-2 relative">
                  <div className="flex justify-between items-start">
                    <strong className="text-primary">{job.name}</strong>
                    <span className="bg-green-150 text-green-700 font-bold text-[8px] uppercase px-1.5 py-0.5 rounded">
                      {job.status}
                    </span>
                  </div>
                  <div className="text-[9px] text-onSurfaceVariant space-y-0.5">
                    <div>Format: <strong>{job.format}</strong></div>
                    <div>Cron Interval: <strong>{job.interval}</strong></div>
                    <div>Recipients: <strong>{job.recipients}</strong></div>
                  </div>
                  <button 
                    onClick={() => toggleJobStatus(job.id)}
                    className="text-red-500 hover:underline text-[9px] font-bold self-end"
                  >
                    Pause Job
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 10: REPORT LIBRARY ARCHIVE */}
          <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
            <h3 className="font-bold text-xs text-primary uppercase tracking-wider">Compiled Reports Library</h3>
            
            <input 
              type="text" 
              placeholder="Search reports in library..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="px-2.5 py-1.5 bg-surface border border-outlineVariant rounded outline-none text-xs focus:border-primary text-onSurface w-full"
            />

            <div className="space-y-3.5 max-h-56 overflow-y-auto">
              {filteredLibrary.map(rep => (
                <div key={rep.id} className="p-3 bg-surface-low border border-outlineVariant/20 rounded flex items-center justify-between text-xs gap-4 hover:border-primary/50 transition-colors">
                  <div>
                    <strong className="text-primary font-mono text-[11px] block">{rep.id}: {rep.name}</strong>
                    <div className="flex gap-2 text-[9px] text-onSurfaceVariant mt-1">
                      <span>Format: <strong>{rep.format}</strong></span>
                      <span>By: <strong>{rep.createdBy}</strong></span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button 
                      onClick={() => handleDownloadReport(rep)}
                      className="bg-primary text-white p-1.5 rounded hover:bg-primary-light cursor-pointer"
                      title="Download File"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => handleShareReport(rep)}
                      className="border border-outlineVariant hover:bg-surface p-1.5 rounded text-onSurfaceVariant cursor-pointer"
                      title="Share link"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 13: AUDIT & COMPLIANCE LOGS */}
          <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
            <h3 className="font-bold text-xs text-primary uppercase tracking-wider">Reporting Access Audit Logs</h3>
            <div className="space-y-2.5 text-[10px] max-h-36 overflow-y-auto">
              {audits.map(aud => (
                <div key={aud.id} className="p-2 bg-surface-low border border-outlineVariant/15 rounded flex justify-between items-center text-onSurfaceVariant gap-4">
                  <div>
                    <strong className="text-primary">{aud.action}</strong>
                    <div className="text-[8px] font-semibold">{aud.name}</div>
                    <div className="text-[7px]">{aud.timestamp}</div>
                  </div>
                  <span className="font-bold text-primary">{aud.user}</span>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 14: QUICK ACTIONS */}
          <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-3.5">
            <h3 className="font-bold text-xs text-primary uppercase tracking-wider">Quick Action Shortcuts</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button 
                onClick={() => { setShowGenerateModal(true); }}
                className="p-2 border border-outlineVariant hover:bg-surface-low rounded text-left font-bold text-onSurface"
              >
                Compile Report
              </button>
              <button 
                onClick={() => { setShowScheduleModal(true); }}
                className="p-2 border border-outlineVariant hover:bg-surface-low rounded text-left font-bold text-onSurface"
              >
                Schedule Task
              </button>
              <button 
                onClick={() => handleGenerateReport()}
                className="p-2 border border-outlineVariant hover:bg-surface-low rounded text-left font-bold text-onSurface"
              >
                Export Excel Sheet
              </button>
              <button 
                onClick={() => { window.scrollTo({ top: 300, behavior: 'smooth' }); }}
                className="p-2 border border-outlineVariant hover:bg-surface-low rounded text-left font-bold text-onSurface"
              >
                Open Parameters
              </button>
            </div>
          </div>

          {/* SECTION 15: HELP & ANALYTICAL GUIDES */}
          <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
            <h3 className="font-bold text-xs text-primary uppercase tracking-wider flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-primary" /> Training SOPs & Observatories Guide
            </h3>
            <div className="space-y-3 text-xs text-onSurfaceVariant">
              <div className="pb-2.5 border-b border-outlineVariant/15">
                <span className="font-bold text-primary block">Official Data Distribution Policy</span>
                <p className="text-[10px] leading-relaxed mt-0.5">
                  State and district-level raw outputs are classified as government security data and can only be exported as Digitally Signed PDFs.
                </p>
              </div>

              <div>
                <span className="font-bold text-primary block">Custom Visuals Mapping</span>
                <p className="text-[10px] leading-relaxed mt-0.5">
                  Use the Custom Report builder to map and select sources. Excel exports will automatically partition selected options into distinct worksheets.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* GENERATE NEW REPORT MODAL */}
      {showGenerateModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-surface border border-outlineVariant rounded-xl max-w-md w-full p-6 shadow-premium relative animate-scale-in">
            <button 
              onClick={() => setShowGenerateModal(false)}
              className="absolute top-4 right-4 p-1 rounded hover:bg-surface-low text-onSurfaceVariant cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h3 className="font-bold text-base text-primary uppercase tracking-wide mb-4">Generate Census Intelligence Report</h3>
            
            <form onSubmit={handleGenerateReport} className="space-y-4 text-xs">
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-primary uppercase text-[8px]">Report Name / Template Title *</label>
                <input 
                  type="text" 
                  value={customReportName}
                  onChange={e => setCustomReportName(e.target.value)}
                  placeholder="e.g. State Population Pyramid Summary"
                  className="px-2.5 py-2 bg-surface border border-outlineVariant rounded outline-none focus:border-primary text-onSurface"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-primary uppercase text-[8px]">Format Type</label>
                  <select 
                    value={schedFormat}
                    onChange={e => setSchedFormat(e.target.value)}
                    className="px-2.5 py-2 bg-surface border border-outlineVariant rounded outline-none focus:border-primary text-onSurface"
                  >
                    <option value="PDF">Signed PDF</option>
                    <option value="Excel">Excel Spreadsheet</option>
                    <option value="CSV">CSV Raw Data</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-primary uppercase text-[8px]">State Scope</label>
                  <select 
                    value={filterState}
                    onChange={e => setFilterState(e.target.value)}
                    className="px-2.5 py-2 bg-surface border border-outlineVariant rounded outline-none focus:border-primary text-onSurface"
                  >
                    <option value="Delhi">Delhi NCT</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Rajasthan">Rajasthan</option>
                    <option value="Karnataka">Karnataka</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-outlineVariant/10 pt-4 mt-2">
                <button 
                  type="button"
                  onClick={() => setShowGenerateModal(false)}
                  className="border border-outlineVariant hover:bg-surface-low px-4 py-2 rounded-full font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-primary hover:bg-primary-light text-white font-bold px-5 py-2 rounded-full cursor-pointer shadow-sm"
                >
                  Generate Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SCHEDULE REPORT MODAL */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-surface border border-outlineVariant rounded-xl max-w-md w-full p-6 shadow-premium relative animate-scale-in">
            <button 
              onClick={() => setShowScheduleModal(false)}
              className="absolute top-4 right-4 p-1 rounded hover:bg-surface-low text-onSurfaceVariant cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h3 className="font-bold text-base text-primary uppercase tracking-wide mb-4">Register Scheduled Report Task</h3>
            
            <form onSubmit={handleScheduleReport} className="space-y-4 text-xs">
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-primary uppercase text-[8px]">Scheduled Job Name *</label>
                <input 
                  type="text" 
                  value={schedName}
                  onChange={e => setSchedName(e.target.value)}
                  placeholder="e.g. Daily Officer Performance Logs"
                  className="px-2.5 py-2 bg-surface border border-outlineVariant rounded outline-none focus:border-primary text-onSurface"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-primary uppercase text-[8px]">Interval Recurrence</label>
                  <select 
                    value={schedInterval}
                    onChange={e => setSchedInterval(e.target.value)}
                    className="px-2.5 py-2 bg-surface border border-outlineVariant rounded outline-none focus:border-primary text-onSurface"
                  >
                    <option value="Daily">Daily Run (08:00 PM)</option>
                    <option value="Weekly">Weekly Run (Mon 09:00 AM)</option>
                    <option value="Monthly">Monthly Run (1st Day 10:00 AM)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-primary uppercase text-[8px]">File Format</label>
                  <select 
                    value={schedFormat}
                    onChange={e => setSchedFormat(e.target.value)}
                    className="px-2.5 py-2 bg-surface border border-outlineVariant rounded outline-none focus:border-primary text-onSurface"
                  >
                    <option value="PDF">Signed PDF</option>
                    <option value="Excel">Excel Spreadsheet</option>
                    <option value="CSV">CSV Raw Data</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-primary uppercase text-[8px]">Primary Recipients List *</label>
                <input 
                  type="text" 
                  value={schedRecipients}
                  onChange={e => setSchedRecipients(e.target.value)}
                  placeholder="e.g. State Census Director, Ministry Board"
                  className="px-2.5 py-2 bg-surface border border-outlineVariant rounded outline-none focus:border-primary text-onSurface"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 border-t border-outlineVariant/10 pt-4 mt-2">
                <button 
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="border border-outlineVariant hover:bg-surface-low px-4 py-2 rounded-full font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-primary hover:bg-primary-light text-white font-bold px-5 py-2 rounded-full cursor-pointer shadow-sm"
                >
                  Schedule Job
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ReportsCenter;








