import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { ArrowRight, CheckCircle, Group, Landmark, TrendingUp } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Population counter state
  const [population, setPopulation] = useState(1428627663);

  useEffect(() => {
    // Playfully increment population by random small values to feel "live"
    const interval = setInterval(() => {
      setPopulation(prev => prev + Math.floor(Math.random() * 3));
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  const formatPopulation = (num) => {
    return num.toLocaleString('en-IN');
  };

  const handleStartRegistration = () => {
    if (user) {
      if (user.role === 'OFFICER') {
        navigate('/admin');
      } else {
        navigate('/wizard');
      }
    } else {
      navigate('/login?mode=signup');
    }
  };

  return (
    <div className="flex-grow w-full max-w-containerMax mx-auto px-6 py-8 flex flex-col gap-10">
      
      {/* Hero Section */}
      <section className="relative w-full rounded-md overflow-hidden bg-surface-container/30 min-h-[500px] flex flex-col md:flex-row items-center justify-between p-8 md:p-12 ambient-shadow border border-outlineVariant/30">
        
        <div className="z-10 flex flex-col gap-6 max-w-lg">
          <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary-dark px-3 py-1 rounded-full w-max border border-secondary/20">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            <span className="font-semibold text-xs tracking-wider uppercase">Live Updates 2026</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-primary leading-tight">
            Empowering Tomorrow's India
          </h2>
          
          <p className="text-sm md:text-base text-onSurfaceVariant leading-relaxed">
            The digital infrastructure for the world's largest democratic census. Secure, transparent, and built for a modern, progressive nation.
          </p>

          {/* Live Counter */}
          <div className="glass-panel p-6 rounded-md flex flex-col gap-1.5 ambient-shadow border-l-[4px] border-l-secondary">
            <span className="text-xs font-bold text-onSurfaceVariant uppercase tracking-wider">Estimated Population</span>
            <div className="text-2xl md:text-4xl font-bold text-primary tracking-wide tabular-nums">
              {formatPopulation(population)}
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mt-2">
            <button 
              onClick={handleStartRegistration}
              className="bg-primary text-white hover:bg-primary-light px-6 py-3 rounded-full font-bold text-xs flex items-center gap-2 transition-all shadow-ambient active:scale-95 cursor-pointer"
            >
              Register for Census
              <ArrowRight className="w-4 h-4" />
            </button>
            <a 
              href="#process"
              className="bg-surface-high/60 text-primary border border-outlineVariant/50 hover:bg-surface-high hover:border-primary px-6 py-3 rounded-full font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              Learn More
            </a>
          </div>
        </div>

        {/* Map Vector Graphic (Mocked for visual beauty using CSS gradients/shadows instead of image) */}
        <div className="absolute right-0 top-0 w-full md:w-2/3 h-full opacity-10 md:opacity-100 pointer-events-none overflow-hidden select-none">
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent z-10" />
          <div className="w-full h-full flex items-center justify-end pr-8">
            <div className="w-[380px] h-[380px] rounded-full bg-gradient-to-tr from-secondary/15 via-primary/5 to-success/15 filter blur-3xl animate-pulse" />
          </div>
        </div>

      </section>

      {/* Stats Bento Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Global Context Panel */}
        <div className="md:col-span-1 bg-surface rounded-md border border-outlineVariant/50 p-6 flex flex-col gap-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-outlineVariant/30 pb-3">
            <h3 className="font-bold text-base text-primary">Global Context</h3>
            <span className="text-xs uppercase font-bold text-outline">Ranking</span>
          </div>
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between p-3 bg-primary/5 rounded-md border-l-2 border-primary">
              <span className="font-semibold text-xs text-primary">1. India</span>
              <span className="font-bold text-xs text-primary">~1.43B</span>
            </div>
            <div className="flex items-center justify-between p-3 hover:bg-surface-container/30 rounded-md transition-all text-onSurfaceVariant">
              <span className="text-xs font-semibold">2. China</span>
              <span className="text-xs font-bold">~1.41B</span>
            </div>
            <div className="flex items-center justify-between p-3 hover:bg-surface-container/30 rounded-md transition-all text-onSurfaceVariant">
              <span className="text-xs font-semibold">3. United States</span>
              <span className="text-xs font-bold">~340M</span>
            </div>
          </div>
        </div>

        {/* Stats 2 Columns */}
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-surface rounded-md border border-outlineVariant/50 p-6 flex flex-col justify-between gap-4 shadow-sm relative overflow-hidden group">
            <div className="absolute right-4 bottom-4 text-primary/5 group-hover:scale-110 transition-transform duration-300">
              <CheckCircle className="w-24 h-24 stroke-[1]" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-onSurfaceVariant uppercase tracking-widest">Citizens Documented</span>
              <span className="text-2xl font-bold text-primary tracking-wide">45,230,192</span>
            </div>
            <div className="flex items-center gap-1.5 text-success font-semibold text-xs mt-2">
              <TrendingUp className="w-4 h-4" />
              <span>+124,000 this week</span>
            </div>
          </div>

          <div className="bg-surface rounded-md border border-outlineVariant/50 p-6 flex flex-col justify-between gap-4 shadow-sm relative overflow-hidden group">
            <div className="absolute right-4 bottom-4 text-primary/5 group-hover:scale-110 transition-transform duration-300">
              <Group className="w-24 h-24 stroke-[1]" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-onSurfaceVariant uppercase tracking-widest">Families Recorded</span>
              <span className="text-2xl font-bold text-primary tracking-wide">12,845,901</span>
            </div>
            <div className="flex items-center gap-1.5 text-onSurfaceVariant font-semibold text-xs mt-2">
              <span className="w-2 h-2 rounded-full bg-success" />
              <span>Verified via Aadhaar linkage</span>
            </div>
          </div>
        </div>

      </section>

      {/* Registration Process Stepper Flow */}
      <section id="process" className="bg-surface rounded-md border border-outlineVariant/50 p-8 shadow-sm flex flex-col gap-6">
        <div className="text-center max-w-md mx-auto flex flex-col gap-2">
          <h3 className="font-bold text-xl text-primary">Simple Verification Process</h3>
          <p className="text-xs text-onSurfaceVariant">
            Ensure your household participation in the census by following these simple interactive steps.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-6 mt-4 relative">
          
          <div className="flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold shadow-md">1</div>
            <span className="font-semibold text-xs text-primary leading-tight">Aadhaar Validation</span>
          </div>

          <div className="flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 rounded-full bg-surface border-2 border-primary text-primary flex items-center justify-center font-bold">2</div>
            <span className="font-semibold text-xs text-primary leading-tight">OTP Authentication</span>
          </div>

          <div className="flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 rounded-full bg-surface-high text-outline flex items-center justify-center font-bold">3</div>
            <span className="font-semibold text-xs text-outline leading-tight">Filing wizard (10 Steps)</span>
          </div>

          <div className="flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 rounded-full bg-surface-high text-outline flex items-center justify-center font-bold">4</div>
            <span className="font-semibold text-xs text-outline leading-tight">Document Upload</span>
          </div>

          <div className="flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 rounded-full bg-surface-high text-outline flex items-center justify-center font-bold">5</div>
            <span className="font-semibold text-xs text-outline leading-tight">Registry Approval</span>
          </div>

        </div>
      </section>

    </div>
  );
};

export default Home;
