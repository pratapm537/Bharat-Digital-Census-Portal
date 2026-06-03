import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { ArrowRight, CheckCircle, Group, Landmark, TrendingUp, Info } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Population counter state
  const [population, setPopulation] = useState(1428627663);

  // Hover World Map states
  const [hoveredCountry, setHoveredCountry] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

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

  // Map mouse handlers
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleMouseEnter = (e, name, pop, rank, desc) => {
    setHoveredCountry({ name, population: pop, rank, desc });
  };

  const handleMouseLeave = () => {
    setHoveredCountry(null);
  };

  return (
    <div className="flex-grow w-full max-w-containerMax mx-auto px-6 py-8 flex flex-col gap-10">
      
      {/* Dynamic styles for map animation */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulse-ring {
          0% {
            transform: scale(0.3);
            opacity: 0.8;
          }
          100% {
            transform: scale(2.2);
            opacity: 0;
          }
        }
        @keyframes pulse-ring-blue {
          0% {
            transform: scale(0.3);
            opacity: 0.6;
          }
          100% {
            transform: scale(1.8);
            opacity: 0;
          }
        }
        .pulse-ring {
          animation: pulse-ring 2.5s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
          transform-origin: 625px 220px;
        }
        .pulse-ring-blue {
          animation: pulse-ring-blue 2.5s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
        }
      `}} />

      {/* Hero Section */}
      <section className="relative w-full rounded-md overflow-hidden bg-surface-container/30 min-h-[500px] flex flex-col md:flex-row items-center justify-between p-8 md:p-12 ambient-shadow border border-outlineVariant/30 gap-8">
        
        <div className="w-full md:w-2/5 flex flex-col gap-6 z-10 shrink-0">
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

        {/* Interactive World Map Section */}
        <div className="w-full md:w-3/5 relative select-none flex items-center justify-center z-10 bg-white/20 rounded-md p-2 border border-outlineVariant/20 overflow-hidden">
          
          <svg 
            viewBox="0 0 1000 480" 
            className="w-full h-auto drop-shadow-sm select-none"
            onMouseMove={handleMouseMove}
          >
            <defs>
              <filter id="saffron-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur1" />
                <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur2" />
                <feMerge>
                  <feMergeNode in="blur2" />
                  <feMergeNode in="blur1" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Stylized background grid */}
            <g stroke="#cbd5e1" strokeWidth="0.5" strokeDasharray="3 9" opacity="0.3">
              {[...Array(10)].map((_, i) => (
                <line key={`v-${i}`} x1={i * 100} y1={0} x2={i * 100} y2={480} />
              ))}
              {[...Array(6)].map((_, i) => (
                <line key={`h-${i}`} x1={0} y1={i * 80} x2={1000} y2={i * 80} />
              ))}
            </g>

            {/* Stylized Continent Paths Backdrop */}
            <g fill="#0b2447" fillOpacity="0.05" stroke="#0b2447" strokeWidth="1" strokeOpacity="0.15">
              {/* North America */}
              <path d="M 80,100 Q 150,60 280,110 T 260,200 T 220,230 T 170,250 T 130,220 T 70,140 Z" />
              {/* South America */}
              <path d="M 220,230 Q 250,250 260,300 T 230,380 T 190,440 T 170,400 T 180,300 Z" />
              {/* Africa */}
              <path d="M 430,220 Q 480,190 530,210 T 560,260 T 540,340 T 500,380 T 450,330 T 420,240 Z" />
              {/* Eurasia */}
              <path d="M 330,160 Q 400,90 600,80 T 850,90 T 900,180 T 800,240 T 650,260 T 500,240 T 360,210 Z" />
              {/* Australia */}
              <path d="M 760,330 Q 800,320 840,340 T 850,390 T 800,400 T 750,360 Z" />
            </g>

            {/* Glowing Saffron India Shape overlay */}
            <path 
              d="M 605,200 L 625,190 L 640,205 L 655,215 L 645,230 L 635,245 L 620,250 L 605,235 Z" 
              fill="#ff9933" 
              fillOpacity="0.75" 
              stroke="#8f4e00" 
              strokeWidth="1.5" 
              filter="url(#saffron-glow)"
              className="transition-all duration-300 hover:fill-opacity-95 cursor-pointer"
              onMouseEnter={(e) => handleMouseEnter(e, 'India', formatPopulation(population), '1st', 'World\'s largest digital census registration system.')}
              onMouseLeave={handleMouseLeave}
            />

            {/* Interactive Country pulsing markers */}
            {/* 1. India Hotspot */}
            <g 
              className="cursor-pointer group"
              onMouseEnter={(e) => handleMouseEnter(e, 'India', formatPopulation(population), '1st', 'World\'s largest digital census registration system.')}
              onMouseLeave={handleMouseLeave}
            >
              <circle cx="625" cy="220" r="16" fill="#ff9933" fillOpacity="0.3" className="pulse-ring" />
              <circle cx="625" cy="220" r="28" fill="#ff9933" fillOpacity="0.15" className="pulse-ring" style={{ animationDelay: '0.8s' }} />
              <circle cx="625" cy="220" r="6" fill="#ff9933" stroke="#8f4e00" strokeWidth="1" className="group-hover:scale-125 transition-transform" />
            </g>

            {/* 2. China Hotspot */}
            <g 
              className="cursor-pointer group"
              onMouseEnter={(e) => handleMouseEnter(e, 'China', '1,411,750,000', '2nd', 'East Asian demographic giant.')}
              onMouseLeave={handleMouseLeave}
            >
              <circle cx="690" cy="165" r="12" fill="#0b2447" fillOpacity="0.15" className="pulse-ring-blue" style={{ transformOrigin: '690px 165px' }} />
              <circle cx="690" cy="165" r="5" fill="#0b2447" className="group-hover:scale-125 transition-transform" />
            </g>

            {/* 3. United States Hotspot */}
            <g 
              className="cursor-pointer group"
              onMouseEnter={(e) => handleMouseEnter(e, 'United States', '339,996,563', '3rd', 'Third most populated nation.')}
              onMouseLeave={handleMouseLeave}
            >
              <circle cx="180" cy="140" r="12" fill="#0b2447" fillOpacity="0.15" className="pulse-ring-blue" style={{ transformOrigin: '180px 140px' }} />
              <circle cx="180" cy="140" r="5" fill="#0b2447" className="group-hover:scale-125 transition-transform" />
            </g>

            {/* 4. Indonesia Hotspot */}
            <g 
              className="cursor-pointer group"
              onMouseEnter={(e) => handleMouseEnter(e, 'Indonesia', '277,534,122', '4th', 'Largest archipelago population.')}
              onMouseLeave={handleMouseLeave}
            >
              <circle cx="750" cy="275" r="12" fill="#0b2447" fillOpacity="0.15" className="pulse-ring-blue" style={{ transformOrigin: '750px 275px' }} />
              <circle cx="750" cy="275" r="5" fill="#0b2447" className="group-hover:scale-125 transition-transform" />
            </g>

            {/* 5. Pakistan Hotspot */}
            <g 
              className="cursor-pointer group"
              onMouseEnter={(e) => handleMouseEnter(e, 'Pakistan', '240,485,658', '5th', 'Fifth most populated nation.')}
              onMouseLeave={handleMouseLeave}
            >
              <circle cx="590" cy="195" r="12" fill="#0b2447" fillOpacity="0.15" className="pulse-ring-blue" style={{ transformOrigin: '590px 195px' }} />
              <circle cx="590" cy="195" r="5" fill="#0b2447" className="group-hover:scale-125 transition-transform" />
            </g>
          </svg>

          {/* Floating Hover Tooltip */}
          {hoveredCountry && (
            <div 
              style={{ left: tooltipPos.x + 15, top: tooltipPos.y + 15 }}
              className="absolute bg-primary text-white border border-outlineVariant/30 rounded p-3 shadow-premium text-left pointer-events-none z-50 glass-panel animate-fade-in text-xs max-w-xs flex flex-col gap-1"
            >
              <div className="flex items-center justify-between border-b border-white/20 pb-1 mb-1">
                <span className="font-bold text-sm text-secondary">{hoveredCountry.name}</span>
                <span className="font-bold text-[9px] bg-white/20 px-1.5 py-0.5 rounded text-white uppercase tracking-wider">
                  Rank {hoveredCountry.rank}
                </span>
              </div>
              <p className="font-bold text-white text-xs">Population: {hoveredCountry.population}</p>
              <p className="text-[10px] text-slate-300 leading-normal">{hoveredCountry.desc}</p>
            </div>
          )}

        </div>

      </section>

      {/* Stats Bento Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Global Context Panel - Top 5 Countries */}
        <div className="md:col-span-1 bg-surface rounded-md border border-outlineVariant/50 p-6 flex flex-col gap-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-outlineVariant/30 pb-3">
            <h3 className="font-bold text-base text-primary">Global Context</h3>
            <span className="text-xs uppercase font-bold text-outline">Top 5 Nations</span>
          </div>
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between p-3 bg-secondary/15 rounded-md border-l-2 border-secondary animate-pulse">
              <span className="font-semibold text-xs text-primary">1. India</span>
              <span className="font-bold text-xs text-secondary-dark">{formatPopulation(population)}</span>
            </div>
            <div className="flex items-center justify-between p-3 hover:bg-surface-container/30 rounded-md transition-all text-onSurfaceVariant">
              <span className="text-xs font-semibold">2. China</span>
              <span className="text-xs font-bold">~1.41B</span>
            </div>
            <div className="flex items-center justify-between p-3 hover:bg-surface-container/30 rounded-md transition-all text-onSurfaceVariant">
              <span className="text-xs font-semibold">3. United States</span>
              <span className="text-xs font-bold">~340M</span>
            </div>
            <div className="flex items-center justify-between p-3 hover:bg-surface-container/30 rounded-md transition-all text-onSurfaceVariant">
              <span className="text-xs font-semibold">4. Indonesia</span>
              <span className="text-xs font-bold">~278M</span>
            </div>
            <div className="flex items-center justify-between p-3 hover:bg-surface-container/30 rounded-md transition-all text-onSurfaceVariant">
              <span className="text-xs font-semibold">5. Pakistan</span>
              <span className="text-xs font-bold">~240M</span>
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
