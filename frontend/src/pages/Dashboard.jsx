import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { censusAPI } from '../services/api.js';
import {
  FileText, Download, CheckCircle, Clock, AlertTriangle, UserCheck,
  ArrowRight, ShieldCheck, MapPin, Users, Heart, Bell, Activity,
  Briefcase, Home, BookOpen, Upload, MessageCircle, ChevronRight,
  Star, Zap, Eye, Edit, Phone, HelpCircle, Flag, LogOut,
  X, Send, Bot, User, CheckSquare, Circle, TrendingUp, Award, BarChart2
} from 'lucide-react';

/* ─── Helpers ──────────────────────────────────────────────── */
const STEP_LABELS = [
  'Personal Details', 'Identity Proof', 'Contact Details',
  'Address Details', 'Family Structure', 'Education Details',
  'Employment Details', 'Housing Details', 'Health Details', 'Review & Submit'
];

const STATUS_CONFIG = {
  DRAFT:     { label: 'In Progress',    color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.25)' },
  SUBMITTED: { label: 'Under Review',   color: '#3b82f6', bg: 'rgba(59,130,246,0.1)',  border: 'rgba(59,130,246,0.25)' },
  APPROVED:  { label: 'Approved',       color: '#10b981', bg: 'rgba(16,185,129,0.1)',  border: 'rgba(16,185,129,0.25)' },
  REJECTED:  { label: 'Needs Revision', color: '#ef4444', bg: 'rgba(239,68,68,0.1)',   border: 'rgba(239,68,68,0.25)' },
};

const DOC_TYPES = [
  { key: 'aadhaar_proof',  label: 'Aadhaar Card',  icon: ShieldCheck },
  { key: 'address_proof',  label: 'Address Proof', icon: MapPin      },
];

const NOTIFICATIONS = [
  { id: 1, icon: CheckCircle, color: '#10b981', title: 'Form saved successfully', time: '2 mins ago',    read: false },
  { id: 2, icon: Bell,        color: '#3b82f6', title: 'New census update available', time: '1 hour ago', read: false },
  { id: 3, icon: Award,       color: '#f59e0b', title: 'Complete step 5 to unlock certificate', time: 'Yesterday', read: true },
  { id: 4, icon: Flag,        color: '#0b2447', title: 'Verification visit scheduled', time: '2 days ago', read: true },
];

const ACTIVITY = [
  { label: 'Registration Started',    time: 'Jun 03, 2026 · 10:00 AM', icon: Flag,        done: true  },
  { label: 'Personal Details Saved',  time: 'Jun 03, 2026 · 10:12 AM', icon: User,        done: true  },
  { label: 'Identity Proof Verified', time: 'Jun 03, 2026 · 10:15 AM', icon: ShieldCheck, done: true  },
  { label: 'Family Member Added',     time: 'Jun 03, 2026 · 10:22 AM', icon: Users,       done: true  },
  { label: 'Document Uploaded',       time: 'Pending',                  icon: Upload,      done: false },
  { label: 'Verification Completed',  time: 'Pending',                  icon: CheckCircle, done: false },
];

const AI_SUGGESTIONS = [
  'How do I add a family member?',
  'What documents are required?',
  'What is my verification status?',
  'How to download certificate?',
];

const AI_RESPONSES = {
  'How do I add a family member?': 'Go to Step 5 (Family Structure) in the Census Wizard. Click "Add Member", fill in the name, Aadhaar, date of birth, gender, and relationship, then save.',
  'What documents are required?': 'You need to upload: 1) Aadhaar Card scan (mandatory), 2) Address Proof such as a utility bill or rent agreement (recommended). Upload these in Step 7.',
  'What is my verification status?': 'Your verification status is shown in the "Verification Status" card on this dashboard. Once submitted, a Census Officer will review and approve within 3–5 working days.',
  'How to download certificate?': 'Your certificate is available for download once your status changes to "Approved". Click the Download Certificate button that appears on your dashboard.',
};

/* ─── Sub-components ──────────────────────────────────────── */

/* Circular Progress Ring */
const ProgressRing = ({ pct, size = 100, stroke = 8, color = '#0b2447' }) => {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={stroke} />
      <circle
        cx={size/2} cy={size/2} r={r} fill="none"
        stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 1s ease' }}
      />
    </svg>
  );
};

/* Verification Timeline */
const VerifTimeline = ({ status }) => {
  const stages = [
    { key: 'DRAFT',     label: 'Submitted'     },
    { key: 'SUBMITTED', label: 'Under Review'  },
    { key: 'APPROVED',  label: 'Approved'      },
  ];
  const order = { DRAFT: 0, SUBMITTED: 1, APPROVED: 2, REJECTED: 1 };
  const cur = order[status] ?? 0;
  return (
    <div className="flex items-center gap-0 w-full mt-2">
      {stages.map((s, i) => {
        const done = i <= cur;
        const active = i === cur;
        return (
          <React.Fragment key={s.key}>
            <div className="flex flex-col items-center gap-1 shrink-0">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                style={{
                  background: done ? (active ? '#0b2447' : '#10b981') : '#e2e8f0',
                  color: done ? 'white' : '#94a3b8',
                  boxShadow: active ? '0 0 0 3px rgba(11,36,71,0.15)' : 'none',
                }}
              >
                {done && !active ? <CheckCircle size={14} /> : i + 1}
              </div>
              <span className="text-[9px] font-bold whitespace-nowrap" style={{ color: done ? '#0b2447' : '#94a3b8' }}>
                {s.label}
              </span>
            </div>
            {i < stages.length - 1 && (
              <div className="flex-1 h-0.5 mx-1 mb-4" style={{ background: i < cur ? '#10b981' : '#e2e8f0' }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

/* ─── Main Dashboard ──────────────────────────────────────── */
const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [draft, setDraft]       = useState(null);
  const [family, setFamily]     = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [notifs, setNotifs]     = useState(NOTIFICATIONS);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMsgs, setChatMsgs] = useState([
    { from: 'bot', text: 'Namaste! 🙏 I\'m your Census AI Assistant. How can I help you today?' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef(null);

  const [downloading, setDownloading] = useState(false);

  const handleDownloadCertificate = useCallback(async () => {
    if (downloading) return;
    setDownloading(true);
    try {
      await censusAPI.downloadCertificate();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Certificate download failed. Ensure your census is Approved.'
      );
    } finally {
      setDownloading(false);
    }
  }, [downloading]);

  /* Fetch census data */
  useEffect(() => {
    (async () => {
      try {
        const res = await censusAPI.getDraft();
        setDraft(res.data.draft);
        setFamily(res.data.family);
        setDocuments(res.data.documents);
      } catch (err) {
        setError('Could not load census data. Please try again.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* Auto-scroll chat */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMsgs]);

  /* Computed values */
  const step          = parseInt(draft?.step, 10) || 1;
  const pct           = Math.min(((step - 1) / 10) * 100, 100);
  const statusKey     = draft?.status || 'DRAFT';
  const statusCfg     = STATUS_CONFIG[statusKey] || STATUS_CONFIG.DRAFT;
  const completedForms = step - 1;
  const pendingCount  = 10 - completedForms;
  const unreadCount   = notifs.filter(n => !n.read).length;
  const regId         = draft?.id ? `CEN-2026-${String(draft.id).padStart(6, '0')}` : 'CEN-2026-000001';
  const famId         = user?.id  ? `FAM-2026-${String(user.id).padStart(5, '0')}` : 'FAM-2026-00001';

  /* Doc statuses (match uploaded docs against expected types) */
  const docStatus = DOC_TYPES.map(dt => {
    const found = documents.find(d => d.documentType === dt.key);
    return { ...dt, uploaded: !!found, fileName: found?.fileName || null };
  });

  /* Chat send */
  const handleSendChat = (text) => {
    const q = text || chatInput.trim();
    if (!q) return;
    setChatMsgs(m => [...m, { from: 'user', text: q }]);
    setChatInput('');
    const reply = AI_RESPONSES[q] || 'I\'ll connect you to a Census Officer for this query. Meanwhile, check the Help Centre link below.';
    setTimeout(() => setChatMsgs(m => [...m, { from: 'bot', text: reply }]), 700);
  };

  /* Loading */
  if (loading) return (
    <div className="flex-grow flex items-center justify-center p-6">
      <div className="flex flex-col items-center gap-4 text-[#0b2447]">
        <div className="w-12 h-12 border-4 border-t-[#0b2447] border-[#d6e3ff] rounded-full animate-spin" />
        <p className="text-xs font-semibold">Loading your census command center...</p>
      </div>
    </div>
  );

  return (
    <div className="flex-grow w-full bg-[#f0f4fa] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 flex flex-col gap-7">

        {/* ── ERROR ─────────────────────────────────────────── */}
        {error && (
          <div className="bg-red-50 text-red-700 text-xs p-4 rounded-xl border border-red-200 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
          </div>
        )}

        {/* ══════════════════════════════════════════════════════
            SECTION 1 · WELCOME BANNER
        ══════════════════════════════════════════════════════ */}
        <div
          className="relative w-full rounded-2xl overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #0b2447 0%, #0d3170 55%, #0b2447 100%)',
            boxShadow: '0 20px 60px rgba(11,36,71,0.25)',
          }}
        >
          {/* Dot grid */}
          <div className="absolute inset-0 pointer-events-none" style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }} />
          {/* Glow orbs */}
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(255,153,51,0.14) 0%, transparent 65%)' }} />
          <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(19,136,8,0.10) 0%, transparent 65%)' }} />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6 px-6 md:px-10 py-8">
            {/* Avatar */}
            <div className="shrink-0">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-extrabold text-white shadow-lg"
                style={{ background: 'linear-gradient(135deg, #ff9933, #e07000)' }}>
                {(draft?.personal_fullName || user?.fullName || 'U')[0].toUpperCase()}
              </div>
            </div>

            {/* Name & IDs */}
            <div className="flex-1 flex flex-col gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-bold text-[#ff9933] uppercase tracking-widest bg-[#ff9933]/10 border border-[#ff9933]/20 px-3 py-0.5 rounded-full">
                  Verified Citizen
                </span>
                <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider">
                  {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">
                Welcome back, {draft?.personal_fullName || user?.fullName || 'Citizen'} 👋
              </h1>
              <div className="flex flex-wrap gap-4 mt-1">
                {[
                  { label: 'Family ID',     value: famId   },
                  { label: 'Registration',  value: regId   },
                  { label: 'Aadhaar',       value: draft?.identity_aadhaar ? `XXXX-XXXX-${draft.identity_aadhaar.slice(-4)}` : 'Not linked' },
                ].map(item => (
                  <div key={item.label} className="flex flex-col">
                    <span className="text-[9px] text-white/40 font-bold uppercase tracking-wider">{item.label}</span>
                    <span className="text-xs font-bold text-white/80 font-mono">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 shrink-0">
              <button
                onClick={() => navigate('/wizard')}
                className="flex items-center gap-2 bg-[#ff9933] hover:bg-orange-500 text-white font-bold text-xs px-5 py-2.5 rounded-full transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <Edit className="w-3.5 h-3.5" /> Edit Profile
              </button>
              <button
                className="flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white font-bold text-xs px-5 py-2.5 rounded-full border border-white/20 transition-all cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" /> View Profile
              </button>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════
            SECTION 4 · QUICK STATISTICS (above fold)
        ══════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Family Members',     value: family.length || 0,    unit: 'Members',   icon: Users,       color: '#0b2447', bg: '#0b2447' },
            { label: 'Completed Forms',    value: `${completedForms}/10`, unit: 'Sections', icon: CheckSquare, color: '#10b981', bg: '#10b981' },
            { label: 'Pending Actions',    value: pendingCount,           unit: 'Pending',   icon: Clock,       color: '#f59e0b', bg: '#f59e0b' },
            { label: 'Docs Uploaded',      value: documents.length,       unit: 'Documents', icon: Upload,      color: '#8b5cf6', bg: '#8b5cf6' },
          ].map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md hover:-translate-y-0.5 transition-all group">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: `${s.bg}15` }}>
                    <Icon className="w-5 h-5" style={{ color: s.color }} />
                  </div>
                  <TrendingUp className="w-4 h-4 text-slate-300 group-hover:text-slate-400 transition-colors" />
                </div>
                <p className="text-2xl font-extrabold text-[#0b2447] leading-none">{s.value}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">{s.label}</p>
              </div>
            );
          })}
        </div>

        {/* ── TWO-COLUMN LAYOUT ─────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT 2/3 */}
          <div className="lg:col-span-2 flex flex-col gap-6">

            {/* ══════════════════════════════════════════════════
                SECTION 2 · REGISTRATION STATUS
            ══════════════════════════════════════════════════ */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-extrabold text-base text-[#0b2447]">Registration Progress</h2>
                <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full"
                  style={{ color: statusCfg.color, background: statusCfg.bg, border: `1px solid ${statusCfg.border}` }}>
                  {statusCfg.label}
                </span>
              </div>

              <div className="flex items-center gap-6">
                {/* Ring */}
                <div className="relative shrink-0">
                  <ProgressRing pct={pct} size={110} stroke={9} color={statusCfg.color} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xl font-extrabold text-[#0b2447]">{Math.round(pct)}%</span>
                    <span className="text-[9px] text-slate-400 font-bold uppercase">Complete</span>
                  </div>
                </div>

                {/* Steps list */}
                <div className="flex-1">
                  <div className="flex flex-col gap-1.5 max-h-44 overflow-y-auto pr-1">
                    {STEP_LABELS.map((label, i) => {
                      const stepNum = i + 1;
                      const done    = stepNum < step;
                      const active  = stepNum === step;
                      return (
                        <div key={i} className="flex items-center gap-2.5">
                          <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                            style={{
                              background: done ? '#10b981' : active ? '#0b2447' : '#f1f5f9',
                              border: active ? '2px solid #0b2447' : 'none',
                            }}>
                            {done
                              ? <CheckCircle size={10} className="text-white" />
                              : <span className="text-[8px] font-bold" style={{ color: active ? 'white' : '#94a3b8' }}>{stepNum}</span>}
                          </div>
                          <span className="text-xs font-semibold" style={{
                            color: done ? '#10b981' : active ? '#0b2447' : '#94a3b8',
                            fontWeight: active ? 700 : 500,
                          }}>
                            {label}
                          </span>
                          {active && (
                            <span className="text-[9px] font-bold text-[#ff9933] bg-[#ff9933]/10 px-1.5 py-0.5 rounded-full ml-auto">
                              Current
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => navigate(`/wizard?step=${step}`)}
                    className="mt-4 flex items-center gap-1.5 bg-[#0b2447] text-white text-xs font-bold px-5 py-2 rounded-full hover:bg-[#1f3e6d] transition-all shadow-sm active:scale-95 cursor-pointer"
                  >
                    {draft?.status === 'APPROVED' ? 'View Submission' : step > 1 ? 'Continue Registration' : 'Start Registration'}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* ══════════════════════════════════════════════════
                SECTION 3 · VERIFICATION STATUS
            ══════════════════════════════════════════════════ */}
            <div id="verification-status" className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h2 className="font-extrabold text-base text-[#0b2447] mb-4">Verification Status</h2>

              {/* Timeline */}
              <VerifTimeline status={statusKey} />

              {/* Status detail */}
              <div className="mt-5 rounded-xl p-4 flex flex-col gap-3"
                style={{ background: statusCfg.bg, border: `1px solid ${statusCfg.border}` }}>
                <div className="flex items-center gap-3">
                  {statusKey === 'APPROVED' && <CheckCircle className="w-5 h-5" style={{ color: statusCfg.color }} />}
                  {statusKey === 'SUBMITTED' && <Clock className="w-5 h-5 animate-pulse" style={{ color: statusCfg.color }} />}
                  {statusKey === 'DRAFT'     && <Activity className="w-5 h-5" style={{ color: statusCfg.color }} />}
                  {statusKey === 'REJECTED'  && <AlertTriangle className="w-5 h-5" style={{ color: statusCfg.color }} />}
                  <div>
                    <p className="text-sm font-bold" style={{ color: statusCfg.color }}>
                      {statusKey === 'DRAFT'     && 'Complete and submit your census form to begin verification.'}
                      {statusKey === 'SUBMITTED' && 'Your form is under review by a Census Officer.'}
                      {statusKey === 'APPROVED'  && 'Congratulations! Your census has been officially approved.'}
                      {statusKey === 'REJECTED'  && 'Your submission needs revision. See officer remarks.'}
                    </p>
                    {draft?.officerComments && (
                      <p className="text-xs mt-1 text-slate-600">Officer Remark: {draft.officerComments}</p>
                    )}
                  </div>
                </div>

                {statusKey === 'APPROVED' && (
                  <button
                    onClick={handleDownloadCertificate} disabled={downloading}
                    className="flex items-center gap-2 w-max bg-[#10b981] text-white font-bold text-xs px-5 py-2 rounded-full shadow-sm hover:opacity-90 active:scale-95 transition-all cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" /> Download Certificate
                  </button>
                )}
                {statusKey === 'REJECTED' && (
                  <button
                    onClick={() => navigate(`/wizard?step=${step}`)}
                    className="flex items-center gap-2 w-max font-bold text-xs px-5 py-2 rounded-full shadow-sm active:scale-95 transition-all cursor-pointer text-white"
                    style={{ background: statusCfg.color }}
                  >
                    <Edit className="w-3.5 h-3.5" /> Edit & Re-submit
                  </button>
                )}
              </div>
            </div>

            {/* ══════════════════════════════════════════════════
                SECTION 5 · QUICK ACTIONS
            ══════════════════════════════════════════════════ */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h2 className="font-extrabold text-base text-[#0b2447] mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { label: 'Continue Registration', icon: FileText,     color: '#0b2447', action: () => navigate(`/wizard?step=${step}`)      },
                  { label: 'Add Family Member',     icon: Users,        color: '#10b981', action: () => navigate('/family')             },
                  { label: 'Family Analytics',      icon: BarChart2,    color: '#3b82f6', action: () => navigate('/family-analytics')   },
                  { label: 'Upload Documents',      icon: Upload,       color: '#8b5cf6', action: () => navigate('/wizard?step=7')             },
                  { label: 'Certificate Center',  icon: Award,        color: '#f59e0b', action: () => navigate('/certificates')             },
                  { label: 'Track Verification',    icon: Activity,     color: '#3b82f6', action: () => document.getElementById('verification-status')?.scrollIntoView({ behavior: 'smooth', block: 'center' }) },
                  { label: 'AI Census Assistant',   icon: Bot,          color: '#ef4444', action: () => setChatOpen(true)                     },
                ].map((a, i) => {
                  const Icon = a.icon;
                  return (
                    <button
                      key={i}
                      onClick={a.action}
                      className="flex flex-col items-start gap-3 bg-[#f8faff] hover:bg-[#eff4ff] border border-slate-100 hover:border-[#0b2447]/20 rounded-xl p-4 transition-all hover:-translate-y-0.5 hover:shadow-sm group cursor-pointer text-left"
                    >
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                        style={{ background: `${a.color}15` }}>
                        <Icon className="w-4.5 h-4.5" style={{ color: a.color }} />
                      </div>
                      <span className="text-xs font-bold text-[#0b2447] leading-tight">{a.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ══════════════════════════════════════════════════
                SECTION 9 · DOCUMENT STATUS
            ══════════════════════════════════════════════════ */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-extrabold text-base text-[#0b2447]">Document Status</h2>
                <button onClick={() => navigate('/wizard?step=7')}
                  className="text-[11px] font-bold text-[#0b2447] hover:underline flex items-center gap-1 cursor-pointer">
                  Upload More <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex flex-col gap-3">
                {docStatus.map((d, i) => {
                  const Icon = d.icon;
                  return (
                    <div key={i} className="flex items-center justify-between p-3.5 bg-[#f8faff] border border-slate-100 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#0b2447]/8">
                          <Icon className="w-4 h-4 text-[#0b2447]" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#0b2447]">{d.label}</p>
                          {d.fileName && <p className="text-[9px] text-slate-400 truncate max-w-[140px]">{d.fileName}</p>}
                        </div>
                      </div>
                      <span
                        className="text-[9px] font-bold uppercase px-2.5 py-1 rounded-full"
                        style={{
                          background: d.uploaded ? 'rgba(16,185,129,0.12)' : 'rgba(245,158,11,0.12)',
                          color:      d.uploaded ? '#10b981' : '#f59e0b',
                          border:     `1px solid ${d.uploaded ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)'}`,
                        }}
                      >
                        {d.uploaded ? 'Uploaded' : 'Not Uploaded'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ══════════════════════════════════════════════════
                SECTION 8 · ACTIVITY TIMELINE
            ══════════════════════════════════════════════════ */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h2 className="font-extrabold text-base text-[#0b2447] mb-5">Activity Timeline</h2>
              <div className="relative pl-6 flex flex-col gap-0">
                {/* Vertical line */}
                <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-slate-100" />
                {ACTIVITY.map((a, i) => {
                  const Icon = a.icon;
                  return (
                    <div key={i} className="relative flex items-start gap-4 pb-5 last:pb-0">
                      <div
                        className="absolute -left-4 w-5 h-5 rounded-full border-2 flex items-center justify-center z-10 shrink-0"
                        style={{
                          background: a.done ? '#0b2447' : 'white',
                          borderColor: a.done ? '#0b2447' : '#e2e8f0',
                        }}
                      >
                        <Icon className="w-2.5 h-2.5" style={{ color: a.done ? 'white' : '#cbd5e1' }} />
                      </div>
                      <div className="pl-2">
                        <p className="text-xs font-bold" style={{ color: a.done ? '#0b2447' : '#94a3b8' }}>{a.label}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{a.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT 1/3 */}
          <div className="flex flex-col gap-6">

            {/* ══════════════════════════════════════════════════
                SECTION 7 · NOTIFICATIONS
            ══════════════════════════════════════════════════ */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h2 className="font-extrabold text-sm text-[#0b2447]">Notifications</h2>
                  {unreadCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-[#ff9933] text-white text-[9px] font-extrabold flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setNotifs(n => n.map(x => ({ ...x, read: true })))}
                  className="text-[10px] font-bold text-[#0b2447] hover:underline cursor-pointer"
                >
                  Mark all read
                </button>
              </div>
              <div className="flex flex-col gap-2">
                {notifs.map(n => {
                  const Icon = n.icon;
                  return (
                    <div
                      key={n.id}
                      className="flex items-start gap-3 p-3 rounded-xl transition-all cursor-pointer"
                      style={{ background: n.read ? 'transparent' : 'rgba(11,36,71,0.04)' }}
                      onClick={() => setNotifs(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x))}
                    >
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${n.color}15` }}>
                        <Icon className="w-3.5 h-3.5" style={{ color: n.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-[#0b2447] leading-tight">{n.title}</p>
                        <p className="text-[9px] text-slate-400 mt-0.5">{n.time}</p>
                      </div>
                      {!n.read && <span className="w-2 h-2 rounded-full bg-[#ff9933] shrink-0 mt-1" />}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ══════════════════════════════════════════════════
                SECTION 6 · FAMILY OVERVIEW
            ══════════════════════════════════════════════════ */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-extrabold text-sm text-[#0b2447]">Family Overview</h2>
                <button onClick={() => navigate('/family')}
                  className="text-[10px] font-bold text-[#ff9933] hover:underline flex items-center gap-1 cursor-pointer">
                  Add Member <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              {/* Head */}
              <div className="flex items-center gap-3 p-3 bg-[#0b2447]/5 rounded-xl mb-3">
                <div className="w-9 h-9 rounded-full bg-[#0b2447] flex items-center justify-center text-white font-extrabold text-sm">
                  {(draft?.personal_fullName || user?.fullName || 'H')[0]}
                </div>
                <div>
                  <p className="text-xs font-bold text-[#0b2447]">{draft?.personal_fullName || user?.fullName || 'Family Head'}</p>
                  <p className="text-[9px] text-slate-400">Family Head · {draft?.housing_ownership || 'Owner'}</p>
                </div>
              </div>

              {/* Members */}
              {family.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {family.slice(0, 4).map((m, i) => (
                    <div key={i} className="flex items-center gap-2.5 px-2 py-1.5">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                        style={{ background: ['#ff9933','#10b981','#3b82f6','#8b5cf6'][i % 4] }}>
                        {m.fullName?.[0]?.toUpperCase() || '?'}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-[#0b2447] truncate">{m.fullName}</p>
                        <p className="text-[9px] text-slate-400">{m.relationship || 'Member'}</p>
                      </div>
                    </div>
                  ))}
                  {family.length > 4 && (
                    <p className="text-[10px] text-slate-400 text-center">+ {family.length - 4} more members</p>
                  )}
                </div>
              ) : (
                <div className="text-center py-4">
                  <Users className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                  <p className="text-xs text-slate-400">No family members added yet.</p>
                  <button onClick={() => navigate('/family')}
                    className="text-[10px] font-bold text-[#0b2447] hover:underline mt-1 cursor-pointer">
                    Add members in Step 5
                  </button>
                </div>
              )}

              {/* Address */}
              {draft?.address_state && (
                <div className="mt-4 flex items-start gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <MapPin className="w-3.5 h-3.5 text-[#ff9933] mt-0.5 shrink-0" />
                  <p className="text-[10px] text-slate-500 leading-relaxed">
                    {[draft.address_houseDetails, draft.address_district, draft.address_state, draft.address_pinCode].filter(Boolean).join(', ')}
                  </p>
                </div>
              )}
            </div>

            {/* ══════════════════════════════════════════════════
                SECTION 11 · UPCOMING TASKS
            ══════════════════════════════════════════════════ */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
              <h2 className="font-extrabold text-sm text-[#0b2447] mb-4">Upcoming Tasks</h2>
              <div className="flex flex-col gap-2.5">
                {[
                  { label: 'Upload Address Proof',           done: documents.some(d => d.documentType === 'address_proof') },
                  { label: 'Complete Employment Details',    done: !!(draft?.employment_occupation) },
                  { label: 'Verify Family Members',         done: family.length > 0               },
                  { label: 'Submit Census Form',             done: draft?.status !== 'DRAFT'       },
                  { label: 'Download Certificate',           done: draft?.status === 'APPROVED'    },
                ].map((t, i) => (
                  <div key={i} className="flex items-center gap-2.5 p-2.5 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="w-4.5 h-4.5 shrink-0" style={{ color: t.done ? '#10b981' : '#cbd5e1' }}>
                      {t.done
                        ? <CheckCircle className="w-4 h-4" />
                        : <Circle className="w-4 h-4" />}
                    </div>
                    <span className="text-xs font-semibold" style={{ color: t.done ? '#94a3b8' : '#0b2447', textDecoration: t.done ? 'line-through' : 'none' }}>
                      {t.label}
                    </span>
                    {!t.done && (
                      <span className="ml-auto text-[9px] font-bold text-[#ff9933] bg-[#ff9933]/10 px-2 py-0.5 rounded-full">
                        Pending
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* ══════════════════════════════════════════════════
                SECTION 12 · FOOTER ACTION BAR (Card version)
            ══════════════════════════════════════════════════ */}
            <div className="bg-[#0b2447] rounded-2xl p-5 flex flex-col gap-3">
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Support & Actions</p>
              {[
                { label: 'Help Centre',          icon: HelpCircle, action: () => {}                   },
                { label: 'Contact Support',       icon: Phone,      action: () => {}                   },
                { label: 'Raise a Complaint',     icon: Flag,       action: () => {}                   },
                { label: 'Certificate Center',  icon: Award,   action: () => navigate('/certificates') },
                { label: 'Sign Out',              icon: LogOut,     action: () => { logout(); navigate('/'); } },
              ].map((a, i) => {
                const Icon = a.icon;
                return (
                  <button
                    key={i}
                    onClick={a.action}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer text-left group"
                  >
                    <Icon className="w-4 h-4 text-white/50 group-hover:text-white transition-colors" />
                    <span className="text-xs font-semibold text-white/60 group-hover:text-white transition-colors">{a.label}</span>
                    <ChevronRight className="w-3.5 h-3.5 ml-auto text-white/20 group-hover:text-white/50 transition-colors" />
                  </button>
                );
              })}
            </div>

          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          SECTION 10 · AI CENSUS ASSISTANT (Floating Chat)
      ══════════════════════════════════════════════════════ */}
      {/* Toggle Button */}
      <button
        onClick={() => setChatOpen(o => !o)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all active:scale-95 cursor-pointer"
        style={{ background: 'linear-gradient(135deg, #0b2447, #1f3e6d)' }}
      >
        {chatOpen
          ? <X className="w-5 h-5 text-white" />
          : <Bot className="w-5 h-5 text-white" />}
        {!chatOpen && unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#ff9933] text-white text-[8px] font-extrabold flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Chat Window */}
      {chatOpen && (
        <div
          className="fixed bottom-24 right-6 z-50 w-80 rounded-2xl overflow-hidden flex flex-col"
          style={{
            boxShadow: '0 24px 60px rgba(11,36,71,0.25)',
            height: '420px',
          }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3.5"
            style={{ background: 'linear-gradient(135deg, #0b2447, #1f3e6d)' }}>
            <div className="w-8 h-8 rounded-full bg-[#ff9933]/20 flex items-center justify-center">
              <Bot className="w-4 h-4 text-[#ff9933]" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Census AI Assistant</p>
              <p className="text-[9px] text-white/50">Powered by National Census Bureau</p>
            </div>
            <div className="ml-auto flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
              <span className="text-[9px] text-[#10b981] font-bold">Online</span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-[#f8faff]">
            {chatMsgs.map((m, i) => (
              <div key={i} className={`flex gap-2 ${m.from === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center"
                  style={{ background: m.from === 'bot' ? '#0b2447' : '#ff9933' }}>
                  {m.from === 'bot'
                    ? <Bot className="w-3 h-3 text-white" />
                    : <User className="w-3 h-3 text-white" />}
                </div>
                <div
                  className="px-3 py-2 rounded-xl text-xs leading-relaxed max-w-[220px]"
                  style={{
                    background: m.from === 'bot' ? 'white' : '#0b2447',
                    color:      m.from === 'bot' ? '#0b2447' : 'white',
                    border:     m.from === 'bot' ? '1px solid #e2e8f0' : 'none',
                    borderRadius: m.from === 'bot' ? '4px 12px 12px 12px' : '12px 4px 12px 12px',
                  }}
                >
                  {m.text}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Suggestions */}
          <div className="px-3 py-2 flex gap-1.5 overflow-x-auto bg-white border-t border-slate-100">
            {AI_SUGGESTIONS.map((s, i) => (
              <button key={i} onClick={() => handleSendChat(s)}
                className="shrink-0 text-[9px] font-semibold px-2.5 py-1 rounded-full bg-[#0b2447]/6 text-[#0b2447] hover:bg-[#0b2447]/12 transition-colors cursor-pointer whitespace-nowrap">
                {s}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="flex items-center gap-2 px-3 py-3 bg-white border-t border-slate-100">
            <input
              type="text"
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSendChat()}
              placeholder="Ask a question..."
              className="flex-1 text-xs bg-[#f8faff] border border-slate-200 rounded-full px-3 py-2 outline-none focus:border-[#0b2447] transition-colors"
            />
            <button
              onClick={() => handleSendChat()}
              className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer active:scale-95 transition-all"
              style={{ background: '#0b2447' }}
            >
              <Send className="w-3.5 h-3.5 text-white" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
