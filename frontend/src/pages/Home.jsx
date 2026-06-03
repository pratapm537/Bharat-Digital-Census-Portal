import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import PopulationGlobe from '../components/dashboard/PopulationGlobe.jsx';
import DashboardCharts from '../components/dashboard/DashboardCharts.jsx';
import { 
  ArrowRight, ShieldCheck, ChevronRight, Activity, Globe, Map, Layers, ZoomIn 
} from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Entrance animation loading sequence states
  const [loadStage, setLoadStage] = useState(0); // Stages 0 to 4
  const [livePopulation, setLivePopulation] = useState(1463857241);
  const [mapboxLayer, setMapboxLayer] = useState('density'); // 'density', 'boundary', 'terrain'

  useEffect(() => {
    // Orchestrate entrance sequence
    const t1 = setTimeout(() => setLoadStage(1), 300);  // Show Globe
    const t2 = setTimeout(() => setLoadStage(2), 1200); // Focus India & Start Odometer
    const t3 = setTimeout(() => setLoadStage(3), 2000); // Show Rankings
    const t4 = setTimeout(() => setLoadStage(4), 2800); // Show Analytics

    // Odometer updates once per second
    const interval = setInterval(() => {
      setLivePopulation(prev => prev + Math.floor(Math.random() * 2) + 1);
    }, 1000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearInterval(interval);
    };
  }, []);

  const formatOdometer = (num) => {
    return num.toLocaleString('en-IN');
  };

  const handleStartFiling = () => {
    if (user) {
      navigate(user.role === 'OFFICER' ? '/admin' : '/wizard');
    } else {
      navigate('/login?mode=signup');
    }
  };

  return (
    <div className="flex-grow w-full bg-[#020617] text-slate-100 flex flex-col items-center">
      <div className="w-full max-w-containerMax px-6 py-8 flex flex-col gap-10">
        
        {/* Real-time National Demographics Hero Console */}
        <section className="relative w-full rounded-md bg-gradient-to-b from-[#0b1b33]/60 to-[#020617] border border-white/10 p-6 md:p-10 shadow-premium flex flex-col lg:flex-row items-center gap-10 min-h-[580px] overflow-hidden">
          
          {/* Subtle Grid backdrop */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none" />
          
          {/* Left Column (40% width) - Core Information & Actions */}
          <div className={`w-full lg:w-[42%] flex flex-col gap-6 z-10 transition-all duration-700 transform ${
            loadStage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            
            {/* National Crest Badge */}
            <div className="flex items-center gap-2 bg-[#ff9933]/10 border border-[#ff9933]/20 px-3 py-1 rounded-full w-max">
              <Activity className="w-3.5 h-3.5 text-[#ff9933] animate-pulse" />
              <span className="text-[10px] font-bold tracking-widest text-[#ff9933] uppercase">Live Demographics Registry</span>
            </div>

            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight">
              Empowering <br className="hidden md:inline" />
              <span className="bg-gradient-to-r from-[#ff9933] via-white to-[#138808] bg-clip-text text-transparent">
                Tomorrow's India
              </span>
            </h2>
            
            <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
              National demographic monitoring command. Real-time intelligence dashboard mapping the digital infrastructure of 1.4+ Billion citizens securely.
            </p>

            {/* Odometer Live India Population Counter */}
            <div className={`glass-panel p-5 rounded-md border border-white/10 shadow-premium relative overflow-hidden transition-all duration-700 transform ${
              loadStage >= 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}>
              <div className="absolute right-3 top-3 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <span className="text-[8px] font-bold text-red-500 uppercase tracking-widest">Live Sync</span>
              </div>
              <span className="text-[10px] font-bold text-[#ff9933] uppercase tracking-widest">India Population</span>
              
              <div className="text-2xl md:text-4xl font-extrabold text-white tracking-wider mt-2 font-mono tabular-nums leading-none">
                {formatOdometer(livePopulation)}
              </div>
              
              <span className="text-[8px] text-slate-400 uppercase tracking-wider block mt-2 font-bold">
                Updating Live • National Census Bureau
              </span>
            </div>

            {/* Action CTAs */}
            <div className="flex flex-wrap gap-4 items-center">
              <button 
                onClick={handleStartFiling}
                className="bg-gradient-to-r from-[#ff9933] to-orange-500 text-white font-bold text-xs px-6 py-3.5 rounded-full flex items-center gap-2 hover:shadow-premium hover:opacity-95 transition-all transform active:scale-95 cursor-pointer"
              >
                Register Census Registry
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Column (58% width) - 3D Globe + Concept Overlay Mapbox */}
          <div className="w-full lg:w-[58%] h-[400px] md:h-[500px] relative flex items-center justify-center">
            
            {/* 3D WebGL Earth Globe Container */}
            <div className={`w-full h-full transition-opacity duration-1000 ${
              loadStage >= 1 ? 'opacity-100' : 'opacity-0'
            }`}>
              {loadStage >= 1 && <PopulationGlobe />}
            </div>

            {/* Mapbox Density Layout Concept layer controls */}
            <div className={`absolute bottom-3 left-3 glass-panel p-3.5 rounded-md border border-white/10 shadow-premium z-20 flex flex-col gap-2 transition-all duration-700 transform ${
              loadStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Map className="w-3 h-3 text-[#ff9933]" /> Mapbox Heatmap Layer
              </span>
              <div className="flex gap-1">
                {[
                  { id: 'density', label: 'Density Grid', icon: Layers },
                  { id: 'boundary', label: 'Boundaries', icon: Globe }
                ].map(tab => {
                  const Icon = tab.icon;
                  const active = mapboxLayer === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setMapboxLayer(tab.id)}
                      className={`px-3 py-1 rounded text-[9px] font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                        active 
                          ? 'bg-[#ff9933]/20 text-[#ff9933] border border-[#ff9933]/30' 
                          : 'bg-white/5 text-slate-400 hover:text-white border border-transparent'
                      }`}
                    >
                      <Icon className="w-2.5 h-2.5" /> {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Floating World Population Ranking Panel */}
            <div className={`absolute right-3 top-3 glass-panel p-4 rounded-md border border-white/10 shadow-premium z-20 w-52 flex flex-col gap-3.5 transition-all duration-700 transform ${
              loadStage >= 3 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
            }`}>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-white/5 pb-1.5 flex items-center justify-between">
                <span>World Ranking</span>
                <span className="text-secondary tracking-normal">Top 5</span>
              </span>
              <div className="flex flex-col gap-2.5">
                {[
                  { rank: '#1', name: 'India', flag: '🇮🇳', pop: '1.46B', growth: '+0.8%', active: true },
                  { rank: '#2', name: 'China', flag: '🇨🇳', pop: '1.41B', growth: '-0.06%', active: false },
                  { rank: '#3', name: 'USA', flag: '🇺🇸', pop: '340M', growth: '+0.5%', active: false },
                  { rank: '#4', name: 'Indonesia', flag: '🇮🇩', pop: '277M', growth: '+0.8%', active: false },
                  { rank: '#5', name: 'Pakistan', flag: '🇵🇰', pop: '240M', growth: '+1.9%', active: false }
                ].map(country => (
                  <div 
                    key={country.name} 
                    className={`flex items-center justify-between text-xs py-0.5 px-1.5 rounded transition-all ${
                      country.active ? 'bg-[#ff9933]/10 border border-[#ff9933]/20 font-bold' : ''
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-400 font-mono text-[10px]">{country.rank}</span>
                      <span className="text-sm leading-none">{country.flag}</span>
                      <span className="text-slate-200">{country.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-100 font-semibold">{country.pop}</span>
                      <span className={`text-[9px] ${country.growth.startsWith('+') ? 'text-success' : 'text-slate-400'}`}>
                        {country.growth}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mapbox Heatmap visual mock layer when Density Grid is selected */}
            {mapboxLayer === 'density' && (
              <div className="absolute inset-0 pointer-events-none opacity-20 bg-radial-gradient flex items-center justify-center">
                {/* Visual mesh overlay */}
                <div className="w-80 h-80 rounded-full border border-success/15 border-dashed animate-spin duration-10000" />
                <div className="absolute w-96 h-96 rounded-full border border-secondary/10 border-dashed animate-spin duration-20000" />
              </div>
            )}

          </div>

        </section>

        {/* ECharts Analytics panels section */}
        <section className={`w-full transition-all duration-700 transform ${
          loadStage >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-3 bg-secondary rounded-full" />
              <h3 className="font-bold text-base text-white uppercase tracking-wider">Registry Analytics Dashboard</h3>
            </div>
            <DashboardCharts />
          </div>
        </section>

      </div>
    </div>
  );
};

export default Home;
