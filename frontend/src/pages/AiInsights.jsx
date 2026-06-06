import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Zap, Brain, TrendingUp, Compass, Sliders, AlertTriangle, 
  CheckCircle2, AlertCircle, Download, RefreshCw, HelpCircle, 
  MapPin, Clock, ArrowRight, UserCheck, Users, Activity, BarChart2, 
  FileText, Shield, ShieldAlert, ShieldCheck, ChevronRight, Settings, Info,
  Mail, Phone, Globe, Terminal, Server, Plus, Target
} from 'lucide-react';

// ==========================================
// INITIAL MOCK DATASETS
// ==========================================

const INITIAL_OFFICER_SHORTAGE = [
  { district: 'Central Delhi', state: 'Delhi', current: 25, recommended: 40, shortage: 15, risk: 'High' },
  { district: 'Pune Central', state: 'Maharashtra', current: 80, recommended: 110, shortage: 30, risk: 'High' },
  { district: 'Patna North', state: 'Bihar', current: 120, recommended: 135, shortage: 15, risk: 'Medium' },
  { district: 'Dwarka Sub-District', state: 'Delhi', current: 18, recommended: 35, shortage: 17, risk: 'High' }
];

const INITIAL_LOW_REGISTRATION = [
  { area: 'Delhi Ward 4', rate: 52, target: 90, gap: 38, priority: 'Critical' },
  { area: 'Mumbai West Zone 2', rate: 65, target: 90, gap: 25, priority: 'High' },
  { area: 'Patna Sector 12', rate: 58, target: 95, gap: 37, priority: 'Critical' }
];

const INITIAL_BOTTLENECK = [
  { area: 'Dwarka Sector 8', pending: 12500, delay: 14, officers: 6, level: 'High' },
  { area: 'Pune East Sector 3', pending: 8400, delay: 10, officers: 8, level: 'Medium' },
  { area: 'Mumbai South Ward 1', pending: 19800, delay: 21, officers: 12, level: 'Critical' }
];

const INITIAL_ALERTS = [
  { id: 'ALT-301', msg: 'Low Registration rate detected in Delhi Ward 4.', priority: 'Critical', time: '5 mins ago' },
  { id: 'ALT-302', msg: 'Verification bottleneck in Dwarka Sector 8: Delay exceeds 14 days.', priority: 'High', time: '20 mins ago' },
  { id: 'ALT-303', msg: 'Predictive migration surge: Delhi NCR expecting +200k arrivals from UP.', priority: 'Medium', time: '1 hour ago' },
  { id: 'ALT-304', msg: 'Biometric registration anomaly: Duplicate fingerprints cluster in Pune.', priority: 'Critical', time: '2 hours ago' }
];

const INITIAL_ANOMALIES = [
  { id: 'ANM-401', type: 'Registration Spike', details: '+400% registrations in Dwarka Ward 14 within 6 hours.', risk: 'Critical', status: 'Investigating' },
  { id: 'ANM-402', type: 'Duplicate Cluster', details: '85 duplicate Aadhaar submissions detected from same IP subnet.', risk: 'High', status: 'Flagged' },
  { id: 'ANM-403', type: 'Out-of-Hours Verification', details: '32 verifications completed by Officer ID EMP-9082 between 2 AM - 4 AM.', risk: 'Medium', status: 'Reviewing' }
];

const MIGRATION_FLOWS = [
  { source: 'Bihar', dest: 'Delhi', projected: '1.8 Million', driver: 'Employment / Construction', growth: '+12%' },
  { source: 'Uttar Pradesh', dest: 'Maharashtra', projected: '1.5 Million', driver: 'Industrial Opportunities', growth: '+8%' },
  { source: 'West Bengal', dest: 'Delhi', projected: '900,000', driver: 'Higher Education / IT', growth: '+15%' },
  { source: 'Rajasthan', dest: 'Gujarat', projected: '720,000', driver: 'Business & Trade', growth: '+5%' }
];

const AiInsights = () => {
  const navigate = useNavigate();

  // -------------------------------------------------------------
  // STATE MANAGEMENT
  // -------------------------------------------------------------
  const [selectedOverlayTab, setSelectedOverlayTab] = useState('population'); // 'population', 'migration', 'staffing', 'bottlenecks'

  // Scenario Simulator variables
  const [growthVariance, setGrowthVariance] = useState(0); // -50% to +50%
  const [migrationScale, setMigrationScale] = useState(1.0); // 0.5x to 3.0x
  const [registrationDecline, setRegistrationDecline] = useState(0); // -30% to +30%

  // Simulation Outputs (calculated dynamically)
  const [simulatedPopulation, setSimulatedPopulation] = useState(1.46); // Billions
  const [simulatedMigration, setSimulatedMigration] = useState(1.8); // Millions
  const [simulatedShortage, setSimulatedShortage] = useState(15); // Officers

  // Interactive State Selector
  const [compareStateA, setCompareStateA] = useState('Delhi');
  const [compareStateB, setCompareStateB] = useState('Maharashtra');

  // Dynamic Lists
  const [alertsList, setAlertsList] = useState(INITIAL_ALERTS);
  const [anomaliesList, setAnomaliesList] = useState(INITIAL_ANOMALIES);
  const [officerShortage, setOfficerShortage] = useState(INITIAL_OFFICER_SHORTAGE);

  // UI States
  const [runningAnalysis, setRunningAnalysis] = useState(false);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [selectedReportTemplate, setSelectedReportTemplate] = useState('Population Forecast Report');
  const [toast, setToast] = useState({ type: '', message: '' });

  // Auto clear toasts
  useEffect(() => {
    if (toast.message) {
      const timer = setTimeout(() => setToast({ type: '', message: '' }), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Recalculate Scenario Simulator outcomes on slider changes
  useEffect(() => {
    // Baseline calculations
    const basePop = 1.46; // Billion
    const baseMig = 1.8; // Million
    const baseShortage = 15; // Officers

    const calcPop = basePop * (1 + growthVariance / 100);
    const calcMig = baseMig * migrationScale;
    const calcShortage = Math.max(0, Math.round(baseShortage * (1 + registrationDecline / 100) * migrationScale));

    setSimulatedPopulation(Number(calcPop.toFixed(2)));
    setSimulatedMigration(Number(calcMig.toFixed(2)));
    setSimulatedShortage(calcShortage);
  }, [growthVariance, migrationScale, registrationDecline]);

  // -------------------------------------------------------------
  // OPERATIONS HANDLERS
  // -------------------------------------------------------------
  
  const handleRunForecastAnalysis = () => {
    setRunningAnalysis(true);
    setTimeout(() => {
      setRunningAnalysis(false);
      setToast({ 
        type: 'success', 
        message: 'AI Forecasting Models retrained successfully. Active projection baselines updated to 2026-06-06.' 
      });
    }, 2000);
  };

  const handleGenerateAIReport = (templateName) => {
    setGeneratingReport(true);
    setTimeout(() => {
      setGeneratingReport(false);
      setToast({ 
        type: 'success', 
        message: `AI Predictive Intelligence Report "${templateName}" successfully compiled and downloaded (PDF format).` 
      });
    }, 2000);
  };

  const handleResolveAlert = (alertId) => {
    setAlertsList(prev => prev.filter(a => a.id !== alertId));
    setToast({ type: 'success', message: `Alert ${alertId} resolved and logged to Security audit logs.` });
  };

  const handleDismissAnomaly = (anomalyId) => {
    setAnomaliesList(prev => prev.map(anm => {
      if (anm.id === anomalyId) return { ...anm, status: 'Resolved' };
      return anm;
    }));
    setToast({ type: 'warning', message: `Anomaly ${anomalyId} marked as resolved.` });
  };

  const handleTriggerCampaign = (area) => {
    setToast({ type: 'success', message: `Simulated SMS public awareness campaign broadcasted to all unregistered mobile numbers in "${area}".` });
  };

  const handleDeployOfficers = (district, recommended) => {
    setOfficerShortage(prev => prev.map(s => {
      if (s.district === district) {
        return { ...s, current: s.recommended, shortage: 0, risk: 'Low' };
      }
      return s;
    }));
    setToast({ type: 'success', message: `Simulated dispatch of backup officers successfully sent to ${district}.` });
  };

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
      {toast.message && (
        <div className={`fixed bottom-6 right-6 z-50 p-4 rounded-lg shadow-xl flex items-center gap-3 border text-xs max-w-sm animate-fade-in ${
          toast.type === 'success' ? 'bg-green-50 text-green-800 border-green-200 dark:bg-green-950/80 dark:text-green-300 dark:border-green-800' :
          toast.type === 'warning' ? 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-800' :
          'bg-red-50 text-red-800 border-red-200 dark:bg-red-950/80 dark:text-red-300 dark:border-red-800'
        }`}>
          {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 shrink-0 text-success" />}
          {toast.type === 'warning' && <AlertTriangle className="w-5 h-5 shrink-0 text-amber-500" />}
          {toast.type === 'error' && <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* SECTION 1: PAGE HEADER */}
      <section className="relative overflow-hidden rounded-xl border border-outlineVariant/50 bg-primary p-6 text-white shadow-ambient flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex flex-col gap-2 relative z-10">
          <div className="flex items-center gap-2">
            <span className="bg-[#ff9933]/20 border border-[#ff9933]/30 text-[#ff9933] font-bold uppercase text-[9px] px-2.5 py-0.5 rounded-full tracking-wider animate-pulse">
              AI Decision Support System
            </span>
            <span className="text-[10px] text-white/70 font-semibold">â€¢ Ministry of Home Affairs</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
            <Brain className="w-7 h-7" /> AI Insights Dashboard
          </h2>
          <p className="text-xs text-white/80 max-w-xl leading-relaxed">
            Leverage artificial intelligence to predict population growth, identify operational bottlenecks, forecast migration patterns, and optimize census resource allocations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 relative z-10 shrink-0">
          <button 
            onClick={() => handleGenerateAIReport(selectedReportTemplate)}
            className="bg-secondary text-primary-dark font-bold text-xs px-4 py-2.5 rounded-full hover:bg-secondary/90 transition-all flex items-center gap-1.5 active:scale-95 shadow-sm cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5" /> Generate AI Report
          </button>
          <button 
            onClick={handleRunForecastAnalysis}
            disabled={runningAnalysis}
            className="bg-white/10 hover:bg-white/20 border border-white/25 text-white font-bold text-xs px-4 py-2.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {runningAnalysis ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <TrendingUp className="w-3.5 h-3.5" />}
            {runningAnalysis ? 'Running Analysis...' : 'Run Forecast Analysis'}
          </button>
          <button 
            onClick={() => { window.scrollTo({ top: 1200, behavior: 'smooth' }); }}
            className="bg-white/10 hover:bg-white/20 border border-white/25 text-white font-bold text-xs px-4 py-2.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5" /> Open Simulator
          </button>
        </div>
      </section>

      {/* SECTION 2: AI OVERVIEW CENTER */}
      <section className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {[
          { label: 'AI Predictions Generated', count: '1.2 Million', desc: 'Active records scanned', icon: Target, color: 'text-primary' },
          { label: 'Forecast Accuracy', count: '96.8%', desc: 'Machine learning confidence', icon: ShieldCheck, color: 'text-success' },
          { label: 'High Risk Areas', count: '42 Zones', desc: 'Requires staffing attention', icon: AlertTriangle, color: 'text-amber-500 animate-pulse' },
          { label: 'Recommended Actions', count: '18 Actions', desc: 'Pending administrative approval', icon: Activity, color: 'text-primary' },
          { label: 'AI Models Active', count: '12 Models', desc: 'Decision support algorithms', icon: Brain, color: 'text-primary' },
          { label: 'Smart Alerts', count: alertsList.length, desc: 'Unresolved notifications', icon: ShieldAlert, color: 'text-red-500 animate-pulse' }
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-surface p-4 rounded-xl border border-outlineVariant/50 shadow-sm flex flex-col gap-1.5 hover:border-primary/50 transition-colors">
              <span className="text-[10px] font-bold text-onSurfaceVariant uppercase tracking-wider">{stat.label}</span>
              <div className="text-lg font-bold text-primary flex items-end justify-between">
                <span>{stat.count}</span>
                <Icon className="w-4 h-4 opacity-80" />
              </div>
              <p className="text-[9px] text-onSurfaceVariant">{stat.desc}</p>
            </div>
          );
        })}
      </section>

      {/* DYNAMIC TWO-COLUMN AI COMMAND CENTER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: FORECASTS, MAPS, RECOMMENDATIONS (7 COLS) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* SECTION 8: AI GEOGRAPHIC INTELLIGENCE MAP */}
          <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-outlineVariant/15 pb-3">
              <div>
                <h3 className="font-bold text-xs text-primary uppercase tracking-wider flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-primary" /> India AI Zonal Predictions Heatmap
                </h3>
                <span className="text-[9px] text-onSurfaceVariant block">Select forecast layers to render AI prediction matrices.</span>
              </div>
              
              {/* Layer selector */}
              <div className="flex bg-surface-low border border-outlineVariant/10 p-1 rounded-md text-[9px] font-bold gap-1 overflow-x-auto">
                {[
                  { id: 'population', label: 'Population Growth' },
                  { id: 'migration', label: 'Migration Flow' },
                  { id: 'staffing', label: 'Staffing Deficits' },
                  { id: 'bottlenecks', label: 'Verification Delays' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedOverlayTab(tab.id)}
                    className={`px-2 py-1 rounded transition-colors cursor-pointer shrink-0 ${
                      selectedOverlayTab === tab.id ? 'bg-primary text-white' : 'text-onSurfaceVariant hover:text-primary'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom SVG India Map displaying dynamic prediction layers */}
            <div className="flex flex-col items-center gap-2 bg-surface-low/40 p-4 rounded-xl border border-outlineVariant/20 relative">
              <svg viewBox="0 0 160 160" className="w-full max-w-[280px] h-auto">
                {/* Baseline India Map paths outline */}
                <path d="M 80 10 Q 95 20 110 30 Q 120 45 130 50 Q 115 80 120 100 Q 100 130 90 150 Q 80 145 75 140 Q 60 110 50 90 Q 40 85 30 75 Q 35 60 45 50 Q 55 35 80 10 Z" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" />
                
                {/* POPULATION LAYER */}
                {selectedOverlayTab === 'population' && (
                  <>
                    <circle cx="80" cy="50" r="14" fill="#ff9933" opacity="0.35" className="animate-pulse" />
                    <circle cx="100" cy="80" r="18" fill="#ff9933" opacity="0.4" className="animate-pulse" />
                    <circle cx="65" cy="110" r="12" fill="#ff9933" opacity="0.3" />
                  </>
                )}

                {/* MIGRATION FLOW LAYER */}
                {selectedOverlayTab === 'migration' && (
                  <>
                    <path d="M 65 110 Q 75 80 100 80" fill="none" stroke="#3c78d8" strokeWidth="2.5" strokeDasharray="3,3" />
                    <circle cx="100" cy="80" r="4" fill="#3c78d8" />
                    <path d="M 80 50 Q 90 65 100 80" fill="none" stroke="#3c78d8" strokeWidth="2.5" strokeDasharray="3,3" />
                  </>
                )}

                {/* STAFFING DEFICITS LAYER */}
                {selectedOverlayTab === 'staffing' && (
                  <>
                    <circle cx="100" cy="80" r="6" fill="#e06666" />
                    <circle cx="80" cy="50" r="8" fill="#e06666" />
                  </>
                )}

                {/* BOTTLENECKS LAYER */}
                {selectedOverlayTab === 'bottlenecks' && (
                  <>
                    <circle cx="65" cy="110" r="10" fill="#f1c232" opacity="0.6 animate-pulse" />
                    <circle cx="100" cy="80" r="14" fill="#f1c232" opacity="0.5" />
                  </>
                )}
              </svg>

              <div className="absolute bottom-4 left-4 bg-surface p-2.5 rounded-lg border border-outlineVariant/15 text-[9px] space-y-1 font-mono text-onSurfaceVariant">
                <strong className="text-primary block text-[8px] uppercase">Layer Indicators:</strong>
                {selectedOverlayTab === 'population' && <div>Saffron: Projected Growth Density</div>}
                {selectedOverlayTab === 'migration' && <div>Blue arrows: Outward migration vectors</div>}
                {selectedOverlayTab === 'staffing' && <div>Red nodes: Critical officer shortage</div>}
                {selectedOverlayTab === 'bottlenecks' && <div>Yellow circles: Verification backlog centers</div>}
              </div>
            </div>
          </div>

          {/* SECTION 3: AI PREDICTIONS FORECASTS */}
          <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-6">
            <h3 className="font-bold text-xs text-primary uppercase tracking-wider">Demographic Forecast Mappings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              
              {/* Population growth curve */}
              <div className="p-4 bg-surface-low border border-outlineVariant/25 rounded-lg flex flex-col gap-3">
                <div>
                  <strong className="text-primary block font-bold text-[11px]">Population Growth Curve (2026-2035)</strong>
                  <span className="text-[8.5px] text-onSurfaceVariant font-mono">Forecast Confidence: 95.8%</span>
                </div>
                
                {/* SVG curve */}
                <svg viewBox="0 0 160 80" className="w-full h-16">
                  {/* Shaded confidence interval band */}
                  <path d="M 0 70 L 40 55 L 80 40 L 120 25 L 160 10 L 160 25 L 120 40 L 80 55 L 40 70 L 0 78 Z" fill="#ff9933" opacity="0.15" />
                  {/* growth trend line */}
                  <path d="M 0 74 L 40 62 L 80 48 L 120 32 L 160 18" fill="none" stroke="#ff9933" strokeWidth="2.5" />
                  <circle cx="160" cy="18" r="3" fill="#ff9933" />
                </svg>

                <div className="grid grid-cols-5 text-center font-mono text-[7px] text-onSurfaceVariant">
                  <div>2026<br/>1.46B</div>
                  <div>2027<br/>1.48B</div>
                  <div>2028<br/>1.50B</div>
                  <div>2030<br/>1.55B</div>
                  <div>2035<br/>1.65B</div>
                </div>
              </div>

              {/* Urbanization Forecast */}
              <div className="p-4 bg-surface-low border border-outlineVariant/25 rounded-lg flex flex-col gap-3">
                <div>
                  <strong className="text-primary block font-bold text-[11px]">Urban vs Rural Transition Ratios</strong>
                  <span className="text-[8.5px] text-onSurfaceVariant font-mono">Emerging Urban Centers: Tier-2 Hubs</span>
                </div>

                <div className="space-y-2.5 mt-2 font-mono text-[10px] text-onSurfaceVariant">
                  {[
                    { year: '2026 (Current)', urban: '38%', rural: '62%', fill: 'w-[38%]' },
                    { year: '2030 (Projected)', urban: '44%', rural: '56%', fill: 'w-[44%]' },
                    { year: '2035 (Forecast)', urban: '52%', rural: '48%', fill: 'w-[52%]' }
                  ].map(u => (
                    <div key={u.year} className="space-y-1">
                      <div className="flex justify-between text-[9px] font-bold">
                        <span>{u.year}</span>
                        <span>Urban: {u.urban} / Rural: {u.rural}</span>
                      </div>
                      <div className="w-full bg-surface h-2 rounded-full overflow-hidden flex border border-outlineVariant/15">
                        <div className={`bg-primary h-full ${u.fill}`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Migration Forecast table */}
            <div className="bg-surface-low border border-outlineVariant/25 rounded-lg p-4 text-xs flex flex-col gap-3">
              <div>
                <strong className="text-primary block font-bold text-[11px]">Projected State Migration Flow Vectors</strong>
                <span className="text-[8.5px] text-onSurfaceVariant font-mono">Mapping source subnets and primary socioeconomic drivers.</span>
              </div>
              <div className="overflow-x-auto text-[10px]">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-outlineVariant/30 text-onSurfaceVariant font-bold">
                      <th className="py-2 px-2">Source</th>
                      <th className="py-2 px-2">Destination</th>
                      <th className="py-2 px-2">Projected Migrants</th>
                      <th className="py-2 px-2">Socioeconomic Driver</th>
                      <th className="py-2 px-2 text-right">Trend Growth</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outlineVariant/15">
                    {MIGRATION_FLOWS.map((mig, idx) => (
                      <tr key={idx} className="hover:bg-surface/50 transition-colors">
                        <td className="py-2.5 px-2 font-semibold text-primary">{mig.source}</td>
                        <td className="py-2.5 px-2 font-semibold">{mig.dest}</td>
                        <td className="py-2.5 px-2 font-mono">{mig.projected}</td>
                        <td className="py-2.5 px-2 text-onSurfaceVariant">{mig.driver}</td>
                        <td className="py-2.5 px-2 text-right text-success font-mono font-bold">{mig.growth}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* SECTION 4: SMART RECOMMENDATIONS */}
          <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-6">
            <h3 className="font-bold text-xs text-primary uppercase tracking-wider flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-primary" /> AI-Generated Staffing & Registration Recommendations
            </h3>

            {/* staffing optimization list */}
            <div className="space-y-4 text-xs">
              
              <div className="bg-surface-low border border-outlineVariant/25 rounded-lg p-4 space-y-3">
                <div>
                  <strong className="text-primary font-bold text-[11px] block">Officer Shortage Resource Allocations</strong>
                  <span className="text-[8.5px] text-onSurfaceVariant font-mono">Deploys target officers to close verification delay backlogs.</span>
                </div>

                <div className="overflow-x-auto text-[10px]">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-outlineVariant/30 text-onSurfaceVariant font-bold">
                        <th className="py-2 px-2">District Area</th>
                        <th className="py-2 px-2">Current Staff</th>
                        <th className="py-2 px-2">Recommended</th>
                        <th className="py-2 px-2">Shortage</th>
                        <th className="py-2 px-2 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outlineVariant/15">
                      {officerShortage.map((s, idx) => (
                        <tr key={idx} className="hover:bg-surface/50 transition-colors">
                          <td className="py-2.5 px-2">
                            <strong className="text-primary block">{s.district}</strong>
                            <span className="text-[9px] text-onSurfaceVariant">{s.state}</span>
                          </td>
                          <td className="py-2.5 px-2 font-mono">{s.current}</td>
                          <td className="py-2.5 px-2 font-mono">{s.recommended}</td>
                          <td className="py-2.5 px-2 text-red-600 font-bold font-mono">
                            {s.shortage > 0 ? `+${s.shortage}` : 'Optimized'}
                          </td>
                          <td className="py-2.5 px-2 text-right">
                            {s.shortage > 0 ? (
                              <button 
                                onClick={() => handleDeployOfficers(s.district, s.recommended)}
                                className="bg-primary hover:bg-primary-light text-white font-bold text-[8.5px] px-2.5 py-1 rounded cursor-pointer"
                              >
                                Deploy
                              </button>
                            ) : (
                              <span className="text-success font-extrabold text-[8.5px] uppercase">Staffed</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Low registration indicators */}
              <div className="bg-surface-low border border-outlineVariant/25 rounded-lg p-4 space-y-3">
                <div>
                  <strong className="text-primary font-bold text-[11px] block">Unregistered Population Risk Pockets</strong>
                  <span className="text-[8.5px] text-onSurfaceVariant font-mono">Launches transactional campaigns to promote census enrollment.</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {INITIAL_LOW_REGISTRATION.map((low, idx) => (
                    <div key={idx} className="p-3 bg-surface border border-outlineVariant/20 rounded-lg flex flex-col gap-1.5 text-[10px]">
                      <div className="flex justify-between items-center">
                        <strong className="text-primary block font-bold">{low.area}</strong>
                        <span className="bg-red-600 text-white font-extrabold px-1 rounded text-[7px] uppercase">
                          {low.priority}
                        </span>
                      </div>
                      <div className="space-y-1 font-mono text-[9px] text-onSurfaceVariant">
                        <div>Rate: <strong className="text-red-600">{low.rate}%</strong> / Target: {low.target}%</div>
                        <div>Deficit Gap: <strong className="text-red-600">-{low.gap}%</strong></div>
                      </div>
                      <button 
                        onClick={() => handleTriggerCampaign(low.area)}
                        className="bg-primary hover:bg-primary-light text-white font-bold text-[8px] py-1 rounded mt-1.5 cursor-pointer"
                      >
                        Launch Awareness SMS
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* delay bottlenecks */}
              <div className="bg-surface-low border border-outlineVariant/25 rounded-lg p-4 space-y-3">
                <div>
                  <strong className="text-primary font-bold text-[11px] block">Verification Bottlenecks & Backlog delays</strong>
                  <span className="text-[8.5px] text-onSurfaceVariant font-mono">Area queues with high document validation delays.</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {INITIAL_BOTTLENECK.map((bot, idx) => (
                    <div key={idx} className="p-3 bg-surface border border-outlineVariant/20 rounded-lg flex flex-col gap-1.5 text-[10px]">
                      <div className="flex justify-between items-center font-bold">
                        <strong className="text-primary block">{bot.area}</strong>
                        <span className="text-amber-600">{bot.level} delay</span>
                      </div>
                      <div className="space-y-1 font-mono text-[9.5px] text-onSurfaceVariant">
                        <div>Backlog: <strong>{bot.pending.toLocaleString()} files</strong></div>
                        <div>Lags: <strong className="text-red-600">{bot.delay} Days</strong></div>
                        <div>Officers: <strong>{bot.officers} Assigned</strong></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: SCENARIO SIMULATOR, COMPLIANCE ALERTS, TRENDS (5 COLS) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* SECTION 9: AI SCENARIO POLICY SIMULATOR */}
          <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
            <h3 className="font-bold text-xs text-primary uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-primary" /> AI Scenario Policy Simulator
            </h3>

            <p className="text-[10px] text-onSurfaceVariant leading-relaxed">
              Tweak parameters to test hypothetical growth scenarios. Machine learning algorithms will predict outcomes in real time.
            </p>

            <div className="space-y-4 text-xs">
              
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between font-bold text-[9px] text-onSurfaceVariant uppercase">
                  <span>Growth Rate Variance</span>
                  <span className="text-primary font-bold">{growthVariance > 0 ? `+${growthVariance}` : growthVariance}%</span>
                </div>
                <input 
                  type="range"
                  min="-50"
                  max="50"
                  value={growthVariance}
                  onChange={e => setGrowthVariance(Number(e.target.value))}
                  className="w-full accent-primary bg-outlineVariant/30 rounded-lg cursor-pointer h-1.5"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between font-bold text-[9px] text-onSurfaceVariant uppercase">
                  <span>Migration Volume Scale</span>
                  <span className="text-primary font-bold">{migrationScale}x Scale</span>
                </div>
                <input 
                  type="range"
                  min="0.5"
                  max="3.0"
                  step="0.1"
                  value={migrationScale}
                  onChange={e => setMigrationScale(Number(e.target.value))}
                  className="w-full accent-primary bg-outlineVariant/30 rounded-lg cursor-pointer h-1.5"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between font-bold text-[9px] text-onSurfaceVariant uppercase">
                  <span>Registration Rate variance</span>
                  <span className="text-primary font-bold">{registrationDecline > 0 ? `+${registrationDecline}` : registrationDecline}%</span>
                </div>
                <input 
                  type="range"
                  min="-30"
                  max="30"
                  value={registrationDecline}
                  onChange={e => setRegistrationDecline(Number(e.target.value))}
                  className="w-full accent-primary bg-outlineVariant/30 rounded-lg cursor-pointer h-1.5"
                />
              </div>

              {/* Simulation outputs dashboard */}
              <div className="p-3 bg-surface-low border border-outlineVariant/20 rounded-lg space-y-2 text-[10px] text-onSurfaceVariant">
                <strong className="text-primary uppercase text-[8.5px] font-bold block mb-1">Projected Simulation Outcomes:</strong>
                <div className="grid grid-cols-3 gap-2 text-center font-mono">
                  <div className="bg-surface p-2 rounded border border-outlineVariant/10">
                    <span className="text-[7.5px] text-onSurfaceVariant block">Projected Pop</span>
                    <strong className="text-primary block text-xs mt-1">{simulatedPopulation}B</strong>
                  </div>
                  <div className="bg-surface p-2 rounded border border-outlineVariant/10">
                    <span className="text-[7.5px] text-onSurfaceVariant block">Delhi Migrants</span>
                    <strong className="text-primary block text-xs mt-1">{simulatedMigration}M</strong>
                  </div>
                  <div className="bg-surface p-2 rounded border border-outlineVariant/10">
                    <span className="text-[7.5px] text-onSurfaceVariant block">Officer Shortage</span>
                    <strong className="text-red-600 block text-xs mt-1">{simulatedShortage} Staff</strong>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* SECTION 5: STATE COMPARISONS observatory */}
          <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
            <h3 className="font-bold text-xs text-primary uppercase tracking-wider flex items-center gap-1.5">
              <BarChart2 className="w-4 h-4 text-primary" /> State Comparisons Observatory
            </h3>

            <div className="grid grid-cols-2 gap-3.5 text-xs">
              <div className="flex flex-col gap-1">
                <label className="font-bold text-primary uppercase text-[8px]">State A</label>
                <select 
                  value={compareStateA}
                  onChange={e => setCompareStateA(e.target.value)}
                  className="px-2 py-1 bg-surface border border-outlineVariant rounded outline-none text-[11px] focus:border-primary text-onSurface"
                >
                  <option value="Delhi">Delhi</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="Bihar">Bihar</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-primary uppercase text-[8px]">State B</label>
                <select 
                  value={compareStateB}
                  onChange={e => setCompareStateB(e.target.value)}
                  className="px-2 py-1 bg-surface border border-outlineVariant rounded outline-none text-[11px] focus:border-primary text-onSurface"
                >
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="Bihar">Bihar</option>
                </select>
              </div>
            </div>

            {/* Compare data indicators */}
            <div className="p-3 bg-surface-low border border-outlineVariant/20 rounded-lg text-[10px] space-y-2 text-onSurfaceVariant">
              <div className="flex justify-between font-bold text-[9px] uppercase border-b border-outlineVariant/10 pb-1 text-primary">
                <span>Indicator Parameters</span>
                <span>{compareStateA} vs {compareStateB}</span>
              </div>
              <div className="space-y-1.5 font-mono text-[9.5px]">
                <div className="flex justify-between">
                  <span>Digital Registration Adoption</span>
                  <strong>{compareStateA === 'Delhi' ? '92%' : '84%'} vs {compareStateB === 'Delhi' ? '92%' : '84%'}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Verification Completion rate</span>
                  <strong>85% vs 78%</strong>
                </div>
                <div className="flex justify-between">
                  <span>Literacy Cohort index</span>
                  <strong>86.2% vs 82.5%</strong>
                </div>
                <div className="flex justify-between">
                  <span>Employment growth forecast</span>
                  <strong className="text-success">+14% vs +10%</strong>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 6: AI ALERT CENTER */}
          <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
            <h3 className="font-bold text-xs text-primary uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-red-500 animate-pulse" /> Active Smart Alerts Center
            </h3>

            <div className="space-y-3.5 text-xs">
              {alertsList.map(alert => (
                <div key={alert.id} className="p-3 bg-red-500/5 border border-red-500/20 rounded-lg flex flex-col gap-1.5">
                  <div className="flex justify-between items-center">
                    <strong className="text-red-700 dark:text-red-300 font-bold">{alert.msg}</strong>
                    <span className="bg-red-600 text-white font-extrabold px-1.5 py-0.5 rounded text-[8px] uppercase">
                      {alert.priority}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[8.5px] font-bold text-onSurfaceVariant mt-1 border-t border-outlineVariant/10 pt-1.5">
                    <span>Detected: {alert.time}</span>
                    <button 
                      onClick={() => handleResolveAlert(alert.id)}
                      className="text-primary hover:underline cursor-pointer"
                    >
                      Resolve
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 7: AI ANOMALY DETECTION */}
          <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
            <h3 className="font-bold text-xs text-primary uppercase tracking-wider flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-primary animate-pulse" /> AI Anomaly Detection Engine
            </h3>

            <div className="space-y-3.5 text-xs">
              {anomaliesList.map(anm => (
                <div key={anm.id} className="p-3 bg-surface-low border border-outlineVariant/20 rounded-lg flex flex-col gap-1.5">
                  <div className="flex justify-between items-center">
                    <strong className="text-primary font-bold">{anm.type}</strong>
                    <span className="bg-amber-500 text-white font-extrabold px-1.5 py-0.5 rounded text-[8px] uppercase">
                      {anm.risk} Risk
                    </span>
                  </div>
                  <p className="text-[10px] text-onSurfaceVariant leading-normal">{anm.details}</p>
                  
                  <div className="flex justify-between items-center text-[8.5px] font-bold text-onSurfaceVariant mt-1.5 border-t border-outlineVariant/10 pt-1.5">
                    <span>Status: <strong className="text-primary">{anm.status}</strong></span>
                    {anm.status !== 'Resolved' && (
                      <button 
                        onClick={() => handleDismissAnomaly(anm.id)}
                        className="text-primary hover:underline cursor-pointer"
                      >
                        Dismiss anomaly
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 12: AI MODEL PERFORMANCE MONITOR */}
          <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
            <h3 className="font-bold text-xs text-primary uppercase tracking-wider flex items-center gap-1.5">
              <Server className="w-4 h-4 text-primary" /> AI Model training & Performance
            </h3>

            <div className="p-3 bg-surface-low border border-outlineVariant/20 rounded-lg text-[10px] text-onSurfaceVariant grid grid-cols-2 gap-2 font-mono">
              <div>LSTM Growth Model: <strong className="text-success">Trained</strong></div>
              <div>Migration Vector: <strong className="text-success">Operational</strong></div>
              <div>Anomaly Scanner: <strong className="text-success">Active</strong></div>
              <div>ML Pipeline training: <strong className="text-primary">02 AM Daily</strong></div>
            </div>
          </div>

          {/* SECTION 10: AI REPORT CENTER */}
          <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
            <h3 className="font-bold text-xs text-primary uppercase tracking-wider font-bold">Predictive Intelligence Reports</h3>
            
            <div className="flex flex-col md:flex-row gap-3">
              <select 
                value={selectedReportTemplate}
                onChange={e => setSelectedReportTemplate(e.target.value)}
                className="flex-grow px-2.5 py-1.5 bg-surface border border-outlineVariant rounded outline-none text-xs focus:border-primary text-onSurface"
              >
                <option value="Population Forecast Report">Population Forecast Report</option>
                <option value="Migration Intelligence Report">Migration Intelligence Report</option>
                <option value="Officer Allocation Report">Officer Allocation Report</option>
                <option value="Verification Optimization Report">Verification Optimization Report</option>
                <option value="Demographic Forecast Report">Demographic Forecast Report</option>
              </select>
              <button 
                onClick={() => handleGenerateAIReport(selectedReportTemplate)}
                disabled={generatingReport}
                className="bg-primary hover:bg-primary-light text-white font-bold text-xs px-4 py-2 rounded transition-colors shrink-0 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5"
              >
                {generatingReport ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Compiling...
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5" /> Compile PDF
                  </>
                )}
              </button>
            </div>
          </div>

          {/* SECTION 13: QUICK ACTION SHORTCUTS */}
          <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-3.5">
            <h3 className="font-bold text-xs text-primary uppercase tracking-wider">Quick Action Shortcuts</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button 
                onClick={handleRunForecastAnalysis}
                className="p-2 border border-outlineVariant hover:bg-surface-low rounded text-left font-bold text-onSurface cursor-pointer"
              >
                Generate Forecast
              </button>
              <button 
                onClick={() => { window.scrollTo({ top: 700, behavior: 'smooth' }); }}
                className="p-2 border border-outlineVariant hover:bg-surface-low rounded text-left font-bold text-onSurface cursor-pointer"
              >
                View Recommendations
              </button>
              <button 
                onClick={() => { window.scrollTo({ top: 300, behavior: 'smooth' }); }}
                className="p-2 border border-outlineVariant hover:bg-surface-low rounded text-left font-bold text-onSurface cursor-pointer"
              >
                Open Heatmap
              </button>
              <button 
                onClick={() => handleGenerateAIReport(selectedReportTemplate)}
                className="p-2 border border-outlineVariant hover:bg-surface-low rounded text-left font-bold text-onSurface cursor-pointer"
              >
                Export Report
              </button>
            </div>
          </div>

          {/* SECTION 14: HELP & ANALYST DOCUMENTATION */}
          <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
            <h3 className="font-bold text-xs text-primary uppercase tracking-wider flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-primary" /> Modeling Support Guidelines
            </h3>
            
            <div className="space-y-3 text-xs text-onSurfaceVariant">
              <div className="pb-2.5 border-b border-outlineVariant/15">
                <span className="font-bold text-primary block">Active Projection Models</span>
                <p className="text-[10px] leading-relaxed mt-0.5">
                  Projections utilize LSTM and random forest regression pipelines. Models are retrained nightly with whitelisted census registers.
                </p>
              </div>

              <div>
                <span className="font-bold text-primary block">Confidence Interval Bands</span>
                <p className="text-[10px] leading-relaxed mt-0.5">
                  Growth curves visualize a 95% confidence interval shaded margin. Variance parameters can be tested in the Policy Simulator dashboard.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default AiInsights;








