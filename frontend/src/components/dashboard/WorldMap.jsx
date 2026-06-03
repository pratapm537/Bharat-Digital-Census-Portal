import React, { useState } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Annotation,
  ZoomableGroup,
} from 'react-simple-maps';

// TopoJSON world atlas (110m resolution — lightweight)
const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

// ISO-3166 numeric code for India
const INDIA_CODE = '356';

const WorldMap = ({ livePopulation }) => {
  const [tooltip, setTooltip] = useState(null);

  const fmt = (n) => n.toLocaleString('en-IN');

  return (
    <div className="relative w-full h-full flex flex-col">
      {/* Map container */}
      <div className="relative flex-1 min-h-0">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ scale: 120, center: [20, 10] }}
          style={{ width: '100%', height: '100%' }}
        >
          <ZoomableGroup zoom={1} minZoom={1} maxZoom={4}>
            <Geographies geography={GEO_URL}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const isIndia = geo.id === INDIA_CODE;
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onMouseEnter={() => {
                        if (isIndia) setTooltip(true);
                      }}
                      onMouseLeave={() => setTooltip(false)}
                      style={{
                        default: {
                          fill: isIndia ? '#ff9933' : '#1e3a5f',
                          stroke: '#0b2447',
                          strokeWidth: 0.4,
                          outline: 'none',
                          filter: isIndia
                            ? 'drop-shadow(0 0 6px rgba(255,153,51,0.75))'
                            : 'none',
                          transition: 'fill 0.2s ease',
                        },
                        hover: {
                          fill: isIndia ? '#ffa94d' : '#2a4e7a',
                          stroke: '#0b2447',
                          strokeWidth: 0.4,
                          outline: 'none',
                          cursor: isIndia ? 'pointer' : 'default',
                        },
                        pressed: {
                          fill: isIndia ? '#ff9933' : '#1e3a5f',
                          outline: 'none',
                        },
                      }}
                    />
                  );
                })
              }
            </Geographies>

            {/* Annotation pin on India */}
            <Annotation
              subject={[78.9629, 22.5937]}
              dx={-45}
              dy={-30}
              connectorProps={{
                stroke: '#ff9933',
                strokeWidth: 1.2,
                strokeLinecap: 'round',
              }}
            >
              <foreignObject x={-120} y={-52} width={120} height={52}>
                <div
                  xmlns="http://www.w3.org/1999/xhtml"
                  style={{
                    background: 'rgba(11,36,71,0.9)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255,153,51,0.35)',
                    borderRadius: '8px',
                    padding: '6px 10px',
                    width: '100%',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
                    <span style={{ fontSize: '12px' }}>🇮🇳</span>
                    <span style={{ color: '#ff9933', fontSize: '9px', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                      India · #1
                    </span>
                  </div>
                  <div style={{ color: '#ffffff', fontSize: '10px', fontWeight: 800, fontFamily: 'monospace', letterSpacing: '0.04em', lineHeight: 1 }}>
                    {fmt(livePopulation)}
                  </div>
                </div>
              </foreignObject>
            </Annotation>
          </ZoomableGroup>
        </ComposableMap>

        {/* Hover tooltip */}
        {tooltip && (
          <div
            style={{
              position: 'absolute',
              bottom: '12px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(11,36,71,0.92)',
              border: '1px solid rgba(255,153,51,0.3)',
              borderRadius: '10px',
              padding: '10px 16px',
              pointerEvents: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
              <span style={{ fontSize: '16px' }}>🇮🇳</span>
              <span style={{ color: '#ff9933', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                India — World Rank #1
              </span>
            </div>
            <div style={{ color: '#fff', fontSize: '13px', fontWeight: 800, fontFamily: 'monospace' }}>
              Population: {fmt(livePopulation)}
            </div>
            <div style={{ color: '#94a3b8', fontSize: '10px', marginTop: '3px' }}>
              Growth Rate: +0.8% · 2026 Estimate
            </div>
          </div>
        )}
      </div>

      {/* Legend row */}
      <div className="flex items-center gap-4 px-2 pt-2 pb-1 justify-center flex-wrap">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm" style={{ background: '#ff9933', boxShadow: '0 0 6px rgba(255,153,51,0.6)' }} />
          <span className="text-[10px] font-bold text-[#ff9933] uppercase tracking-wider">India (Highlighted)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm" style={{ background: '#1e3a5f' }} />
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Other Countries</span>
        </div>
      </div>
    </div>
  );
};

export default WorldMap;
