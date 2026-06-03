import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import WorldMap from '../components/dashboard/WorldMap.jsx';
import {
  ArrowRight, ShieldCheck, FileText, Users, Award, CheckCircle,
  Lock, Smartphone, Clock, ChevronRight, TrendingUp, Database, Globe
} from 'lucide-react';

/* ─── Static Data ─────────────────────────────────────────── */
const STATS = [
  { label: 'Registered Citizens',  value: '32.5M+', icon: Users,       color: '#ff9933' },
  { label: 'States & UTs Covered', value: '36',     icon: Globe,       color: '#138808' },
  { label: 'Census Submissions',   value: '28.1M',  icon: FileText,    color: '#3b82f6' },
  { label: 'Completion Rate',      value: '72%',    icon: TrendingUp,  color: '#a855f7' },
];

const FEATURES = [
  {
    icon: ShieldCheck,
    title: 'Aadhaar-Verified Identity',
    desc: 'Secure biometric verification powered by UIDAI ensures every submission is authentic and tamper-proof.',
    accent: '#ff9933',
  },
  {
    icon: Smartphone,
    title: 'Mobile-First Registration',
    desc: 'Complete your census filing from any device. OTP-based login works even on feature phones.',
    accent: '#138808',
  },
  {
    icon: Database,
    title: 'Encrypted Data Storage',
    desc: 'All personal and household data is end-to-end encrypted and stored in compliance with IT Act 2000.',
    accent: '#3b82f6',
  },
  {
    icon: Clock,
    title: 'Save & Resume Drafts',
    desc: '10-step wizard with auto-save. Pick up exactly where you left off — no progress is ever lost.',
    accent: '#a855f7',
  },
  {
    icon: Award,
    title: 'Digital Certificate',
    desc: 'Receive an official census completion certificate instantly upon submission — download anytime.',
    accent: '#ef4444',
  },
  {
    icon: Lock,
    title: 'Officer Verification Portal',
    desc: 'Dedicated officer dashboard for reviewing, approving, and managing citizen submissions securely.',
    accent: '#0ea5e9',
  },
];

const STEPS = [
  { num: '01', title: 'Verify Aadhaar',      desc: 'Enter your 12-digit Aadhaar number to confirm your identity via the UIDAI portal.' },
  { num: '02', title: 'OTP Authentication',  desc: 'A one-time password is sent to your Aadhaar-linked mobile for secure login.' },
  { num: '03', title: 'Fill 10-Step Form',   desc: 'Provide household, demographic, education, and economic information step by step.' },
  { num: '04', title: 'Upload Documents',    desc: 'Attach scanned copies of required documents (optional but recommended).' },
  { num: '05', title: 'Submit & Download',   desc: 'Submit your census form and download your official digital certificate instantly.' },
];

/* ─── Component ───────────────────────────────────────────── */
const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [livePopulation, setLivePopulation] = useState(1463857241);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    const interval = setInterval(() => {
      setLivePopulation(prev => prev + Math.floor(Math.random() * 2) + 1);
    }, 1000);
    return () => { clearTimeout(t); clearInterval(interval); };
  }, []);

  const handleStartFiling = () => {
    if (user) {
      navigate(user.role === 'OFFICER' ? '/admin' : '/wizard');
    } else {
      navigate('/login?mode=signup');
    }
  };

  const fmt = (n) => n.toLocaleString('en-IN');

  return (
    <div className="flex-grow w-full bg-[#f7f9fb] text-[#191c1e] flex flex-col">

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="relative w-full bg-gradient-to-br from-[#0b2447] via-[#0d2e5a] to-[#0b2447] text-white overflow-hidden">

        {/* Subtle dot-grid backdrop */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />

        {/* Saffron glow top-right */}
        <div
          className="absolute -top-32 -right-32 w-[520px] h-[520px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(255,153,51,0.12) 0%, transparent 70%)' }}
        />
        {/* Green glow bottom-left */}
        <div
          className="absolute -bottom-32 -left-32 w-[420px] h-[420px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(19,136,8,0.10) 0%, transparent 70%)' }}
        />

        <div className="relative max-w-7xl mx-auto px-6 py-14 md:py-20 flex flex-col lg:flex-row items-center gap-10 lg:gap-6">

          {/* ── LEFT COLUMN: Copy ── */}
          <div
            className="flex-1 flex flex-col gap-7 lg:max-w-[460px]"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'none' : 'translateY(18px)',
              transition: 'opacity 0.7s ease, transform 0.7s ease',
            }}
          >
            {/* Badge */}
            <div className="flex items-center gap-2 bg-[#ff9933]/10 border border-[#ff9933]/25 px-4 py-1.5 rounded-full w-max">
              <span className="w-2 h-2 rounded-full bg-[#ff9933] animate-pulse" />
              <span className="text-[11px] font-bold tracking-widest text-[#ff9933] uppercase">
                Government of India — Ministry of Home Affairs
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">
              Bharat Digital<br />
              <span
                style={{
                  background: 'linear-gradient(90deg, #ff9933 0%, #ffffff 50%, #138808 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Census 2026
              </span>
            </h1>

            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
              India's first fully digital, Aadhaar-verified national census. Secure,
              transparent, and accessible to every citizen across all 36 states and
              union territories.
            </p>

            {/* Live Population Counter */}
            <div
              className="inline-flex flex-col gap-1 bg-white/5 border border-white/10 rounded-xl px-5 py-4 backdrop-blur-sm w-max"
              style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.9s ease 0.3s' }}
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
                <span className="text-[10px] font-bold text-[#ff9933] uppercase tracking-widest">
                  India Live Population
                </span>
              </div>
              <span className="text-2xl md:text-3xl font-extrabold font-mono tabular-nums tracking-wider text-white leading-none">
                {fmt(livePopulation)}
              </span>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                Updating every second · National Census Bureau
              </span>
            </div>

            {/* Stats mini grid */}
            <div className="grid grid-cols-2 gap-3">
              {STATS.map((s, i) => {
                const Icon = s.icon;
                return (
                  <div
                    key={i}
                    className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3 backdrop-blur-sm"
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: `${s.color}20`, border: `1px solid ${s.color}30` }}
                    >
                      <Icon className="w-4 h-4" style={{ color: s.color }} />
                    </div>
                    <div>
                      <p className="text-base font-extrabold text-white leading-none">{s.value}</p>
                      <p className="text-[10px] text-slate-400 font-semibold mt-0.5 leading-tight">{s.label}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 items-center">
              <button
                id="hero-register-btn"
                onClick={handleStartFiling}
                className="bg-gradient-to-r from-[#ff9933] to-orange-500 text-white font-bold text-sm px-8 py-3.5 rounded-full flex items-center gap-2 shadow-lg hover:shadow-xl hover:opacity-95 transition-all active:scale-95 cursor-pointer"
              >
                Register Now <ArrowRight className="w-4 h-4" />
              </button>
              <Link
                to="/login"
                id="hero-signin-link"
                className="text-slate-300 hover:text-white font-semibold text-sm flex items-center gap-1 transition-colors"
              >
                Already registered? Sign In <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* ── RIGHT COLUMN: Interactive World Map ── */}
          <div
            className="flex-1 w-full"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'none' : 'translateY(18px)',
              transition: 'opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s',
              minHeight: '380px',
            }}
          >
            {/* Map card */}
            <div
              className="relative w-full h-full rounded-2xl overflow-hidden border border-white/10"
              style={{
                background: 'linear-gradient(135deg, rgba(11,28,60,0.95) 0%, rgba(8,20,48,0.98) 100%)',
                minHeight: '400px',
                boxShadow: '0 24px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)',
              }}
            >
              {/* Map header bar */}
              <div className="flex items-center justify-between px-5 pt-4 pb-2 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#ff9933] animate-pulse" />
                  <span className="text-[10px] font-bold text-[#ff9933] uppercase tracking-widest">
                    Live Census Population Map
                  </span>
                </div>
                <span className="text-[9px] text-slate-500 font-semibold uppercase tracking-wider">
                  World · 2026 Estimate
                </span>
              </div>

              {/* Map fills remaining height */}
              <div style={{ height: '340px' }}>
                <WorldMap livePopulation={livePopulation} />
              </div>

              {/* Bottom rank strip */}
              <div className="px-5 py-3 border-t border-white/5 flex items-center gap-4 overflow-x-auto">
                {[
                  { flag: '🇮🇳', name: 'India',     pop: '1.46B', rank: '#1', active: true  },
                  { flag: '🇨🇳', name: 'China',     pop: '1.41B', rank: '#2', active: false },
                  { flag: '🇺🇸', name: 'USA',       pop: '340M',  rank: '#3', active: false },
                  { flag: '🇮🇩', name: 'Indonesia', pop: '277M',  rank: '#4', active: false },
                  { flag: '🇵🇰', name: 'Pakistan',  pop: '240M',  rank: '#5', active: false },
                ].map((c) => (
                  <div
                    key={c.name}
                    className="flex items-center gap-1.5 shrink-0 px-2.5 py-1 rounded-lg"
                    style={{
                      background: c.active ? 'rgba(255,153,51,0.12)' : 'rgba(255,255,255,0.04)',
                      border: c.active ? '1px solid rgba(255,153,51,0.25)' : '1px solid rgba(255,255,255,0.05)',
                    }}
                  >
                    <span className="text-sm leading-none">{c.flag}</span>
                    <div>
                      <p className="text-[10px] font-bold" style={{ color: c.active ? '#ff9933' : '#cbd5e1' }}>
                        {c.rank} {c.name}
                      </p>
                      <p className="text-[9px] text-slate-500 font-semibold leading-none">{c.pop}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────────── */}
      <section className="w-full bg-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-bold tracking-widest text-[#ff9933] uppercase">Why Bharat Census 2026</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0b2447] mt-2">
              Built for Every Indian
            </h2>
            <p className="text-slate-500 text-sm mt-3 max-w-xl mx-auto">
              A modern, secure, and inclusive platform designed to make census filing effortless for 1.4 billion citizens.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={i}
                  id={`feature-card-${i}`}
                  className="group flex flex-col gap-4 bg-[#f7f9fb] border border-slate-100 rounded-xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center"
                    style={{ background: `${f.accent}15`, border: `1.5px solid ${f.accent}25` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: f.accent }} />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#0b2447] text-base mb-1">{f.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────── */}
      <section className="w-full bg-[#f7f9fb] border-t border-slate-100 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-xs font-bold tracking-widest text-[#138808] uppercase">Simple Process</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0b2447] mt-2">
              How to File Your Census
            </h2>
            <p className="text-slate-500 text-sm mt-3 max-w-lg mx-auto">
              Complete the entire census process online in under 15 minutes.
            </p>
          </div>

          <div className="relative flex flex-col md:flex-row items-start gap-0">
            <div className="hidden md:block absolute top-7 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-[#ff9933]/20 via-[#0b2447]/20 to-[#138808]/20" />
            {STEPS.map((step, i) => (
              <div key={i} className="relative flex-1 flex flex-col items-center text-center px-4 py-4">
                <div
                  className="w-14 h-14 rounded-full border-2 flex items-center justify-center mb-4 shadow-sm relative z-10"
                  style={{
                    background: i === 0 ? '#0b2447' : 'white',
                    borderColor: i === 0 ? '#0b2447' : '#e2e8f0',
                  }}
                >
                  <span className="text-sm font-extrabold" style={{ color: i === 0 ? 'white' : '#0b2447' }}>
                    {step.num}
                  </span>
                </div>
                <h3 className="font-bold text-[#0b2447] text-sm mb-1">{step.title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-12">
            <button
              id="steps-cta-btn"
              onClick={handleStartFiling}
              className="bg-[#0b2447] text-white font-bold text-sm px-10 py-4 rounded-full flex items-center gap-2 hover:bg-[#1f3e6d] transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <CheckCircle className="w-4 h-4" />
              Start Filing Census Now
            </button>
          </div>
        </div>
      </section>

      {/* ── TRUST STRIP ───────────────────────────────────────── */}
      <section className="w-full bg-[#0b2447] text-white py-12">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <p className="text-[11px] text-[#ff9933] font-bold uppercase tracking-widest mb-1">Government of India</p>
            <h2 className="text-xl font-extrabold">Official National Census Platform</h2>
            <p className="text-slate-400 text-xs mt-1">Operated by the Office of the Registrar General & Census Commissioner of India</p>
          </div>
          <div className="flex flex-wrap gap-6 justify-center md:justify-end text-center">
            {[
              { label: 'SSL Encrypted', icon: Lock },
              { label: 'UIDAI Verified', icon: ShieldCheck },
              { label: 'ISO 27001', icon: Award },
            ].map((t, i) => {
              const Icon = t.icon;
              return (
                <div key={i} className="flex flex-col items-center gap-1.5">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-[#ff9933]" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">{t.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
