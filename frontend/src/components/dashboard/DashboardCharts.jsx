import React from 'react';
import { TrendingUp, Award, FileSpreadsheet } from 'lucide-react';

const DashboardCharts = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
      
      {/* 1. Population Growth - Line Chart */}
      <div className="glass-panel p-5 rounded-md border border-white/10 shadow-premium flex flex-col gap-4 text-white">
        <div className="flex items-center justify-between border-b border-white/5 pb-2">
          <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 text-secondary">
            <TrendingUp className="w-4 h-4" /> Population Growth
          </span>
          <span className="text-[10px] text-slate-400">1991 - 2026</span>
        </div>
        
        {/* SVG Line Graph */}
        <div className="relative h-32 w-full mt-2">
          <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
            <defs>
              <linearGradient id="chartAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ff9933" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#ff9933" stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* Grid Lines */}
            <line x1="0" y1="10" x2="100" y2="10" stroke="rgba(255,255,255,0.05)" strokeWidth="0.2" />
            <line x1="0" y1="20" x2="100" y2="20" stroke="rgba(255,255,255,0.05)" strokeWidth="0.2" />
            <line x1="0" y1="30" x2="100" y2="30" stroke="rgba(255,255,255,0.05)" strokeWidth="0.2" />
            
            {/* Fill Area */}
            <path d="M 0,38 L 0,28 Q 25,22 50,15 T 100,5 L 100,38 Z" fill="url(#chartAreaGrad)" />
            {/* Curved Trend Line */}
            <path d="M 0,28 Q 25,22 50,15 T 100,5" fill="none" stroke="#ff9933" strokeWidth="1.2" strokeLinecap="round" />
            {/* Nodes */}
            <circle cx="50" cy="15" r="1.5" fill="#ffffff" stroke="#ff9933" strokeWidth="0.8" />
            <circle cx="100" cy="5" r="1.5" fill="#ffffff" stroke="#ff9933" strokeWidth="0.8" />
          </svg>
        </div>
        
        {/* Axis Labels */}
        <div className="flex justify-between text-[9px] text-slate-400 font-semibold">
          <span>1991</span>
          <span>2001</span>
          <span>2011</span>
          <span>2026 (Est)</span>
        </div>
      </div>

      {/* 2. State Participation - Bar Chart */}
      <div className="glass-panel p-5 rounded-md border border-white/10 shadow-premium flex flex-col gap-4 text-white">
        <div className="flex items-center justify-between border-b border-white/5 pb-2">
          <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 text-secondary">
            <Award className="w-4 h-4" /> State Registrations
          </span>
          <span className="text-[10px] text-slate-400">Top 5 States</span>
        </div>

        {/* Custom Bars layout */}
        <div className="flex flex-col gap-3.5 mt-1.5">
          {[
            { state: 'Uttar Pradesh', rate: '85%', width: 'w-[85%]', color: 'bg-gradient-to-r from-secondary to-orange-400' },
            { state: 'Maharashtra', rate: '78%', width: 'w-[78%]', color: 'bg-gradient-to-r from-secondary to-orange-400' },
            { state: 'Bihar', rate: '74%', width: 'w-[74%]', color: 'bg-gradient-to-r from-secondary to-orange-400' },
            { state: 'West Bengal', rate: '68%', width: 'w-[68%]', color: 'bg-gradient-to-r from-secondary to-orange-400' },
            { state: 'Andhra Pradesh', rate: '65%', width: 'w-[65%]', color: 'bg-gradient-to-r from-secondary to-orange-400' },
          ].map((bar, i) => (
            <div key={i} className="flex flex-col gap-1">
              <div className="flex justify-between text-[10px] font-semibold text-slate-300">
                <span>{bar.state}</span>
                <span>{bar.rate}</span>
              </div>
              <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                <div className={`${bar.color} ${bar.width} h-full rounded-full transition-all duration-500`} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Census Completion Rate - Donut Arc */}
      <div className="glass-panel p-5 rounded-md border border-white/10 shadow-premium flex flex-col gap-4 text-white">
        <div className="flex items-center justify-between border-b border-white/5 pb-2">
          <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 text-secondary">
            <FileSpreadsheet className="w-4 h-4" /> Completion Rate
          </span>
          <span className="text-[10px] text-slate-400">Real-time Sync</span>
        </div>

        <div className="flex items-center justify-center gap-6 mt-1">
          {/* SVG Donut Circle */}
          <div className="relative w-24 h-24 shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              {/* Back track */}
              <path
                className="text-white/5"
                stroke="currentColor"
                strokeWidth="3.5"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              {/* Active arc */}
              <path
                className="text-[#138808]"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeDasharray="72, 100"
                strokeLinecap="round"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-lg font-bold text-white leading-none">72%</span>
              <span className="text-[8px] text-slate-400 mt-0.5 uppercase tracking-widest font-semibold">Done</span>
            </div>
          </div>

          <div className="flex flex-col gap-2.5 text-[11px] font-medium">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-success shrink-0" />
              <div className="flex flex-col">
                <span className="text-slate-400 text-[9px] leading-tight">Submitted</span>
                <span className="font-bold text-white">32.5 Million</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-white/10 shrink-0" />
              <div className="flex flex-col">
                <span className="text-slate-400 text-[9px] leading-tight">In Draft</span>
                <span className="font-bold text-slate-300">12.7 Million</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default DashboardCharts;
