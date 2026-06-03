import React, { useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Html, Line } from '@react-three/drei';
import * as THREE from 'three';

// Lat/Long converter to 3D Sphere Coordinates
const latLongToVector3 = (lat, lon, radius) => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.sin(theta));
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.cos(theta);
  return new THREE.Vector3(x, y, z);
};

// Top 5 Countries details
const COUNTRY_DATA = {
  india: { name: 'India', flag: '🇮🇳', lat: 20.5937, lon: 78.9629, pop: '1.46 Billion', rank: '#1', growth: '0.8%', color: '#ff9933' },
  china: { name: 'China', flag: '🇨🇳', lat: 35.8617, lon: 104.1954, pop: '1.41 Billion', rank: '#2', growth: '-0.06%', color: '#64748b' },
  usa: { name: 'United States', flag: '🇺🇸', lat: 37.0902, lon: -95.7129, pop: '340 Million', rank: '#3', growth: '0.5%', color: '#3b82f6' },
  indonesia: { name: 'Indonesia', flag: '🇮🇩', lat: -0.7893, lon: 113.9213, pop: '277 Million', rank: '#4', growth: '0.8%', color: '#ef4444' },
  pakistan: { name: 'Pakistan', flag: '🇵🇰', lat: 30.3753, lon: 69.3451, pop: '240 Million', rank: '#5', growth: '1.9%', color: '#10b981' }
};

// Global connections targets
const CONNECTIONS = [
  { lat: 37.0902, lon: -95.7129, name: 'USA' },        // USA
  { lat: 55.3781, lon: -3.4360, name: 'UK' },         // UK
  { lat: 23.4241, lon: 53.8478, name: 'UAE' },        // UAE
  { lat: 56.1304, lon: -106.3468, name: 'Canada' },   // Canada
  { lat: -25.2744, lon: 133.7751, name: 'Australia' } // Australia
];

// 3D Earth Globe mesh containing wireframe overlay
const EarthMesh = () => {
  const earthRef = useRef();

  useFrame(() => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.0015; // Slow rotation
    }
  });

  return (
    <group ref={earthRef}>
      {/* Earth Solid sphere core */}
      <mesh>
        <sphereGeometry args={[2, 64, 64]} />
        <meshStandardMaterial 
          color="#0b1e36" 
          roughness={0.8}
          metalness={0.2}
          emissive="#000713"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Futuristic Grid overlay sphere */}
      <mesh scale={[1.002, 1.002, 1.002]}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshBasicMaterial 
          color="#1e293b" 
          wireframe={true} 
          transparent={true} 
          opacity={0.15} 
        />
      </mesh>

      {/* Lat/Long parallel lines */}
      <mesh scale={[1.001, 1.001, 1.001]}>
        <sphereGeometry args={[2.001, 12, 12]} />
        <meshBasicMaterial 
          color="#475569" 
          wireframe={true} 
          transparent={true} 
          opacity={0.06} 
        />
      </mesh>

      {/* Render Hotspots & Radar */}
      {Object.entries(COUNTRY_DATA).map(([key, data]) => (
        <Hotspot key={key} data={data} />
      ))}

      {/* Render Connections from India */}
      {CONNECTIONS.map((target, idx) => (
        <ConnectionLine key={idx} start={COUNTRY_DATA.india} end={target} />
      ))}
    </group>
  );
};

// Pulsing country hotspot node
const Hotspot = ({ data }) => {
  const [hovered, setHovered] = useState(false);
  const pos = latLongToVector3(data.lat, data.lon, 2.02);
  const radarRef = useRef();
  
  // Custom radar expansion
  useFrame(({ clock }) => {
    if (radarRef.current) {
      const elapsed = clock.getElapsedTime() * 1.5;
      const scale = 1 + (elapsed % 1) * 1.5;
      const opacity = 1 - (elapsed % 1);
      radarRef.current.scale.set(scale, scale, 1);
      radarRef.current.material.opacity = opacity;
    }
  });

  const isIndia = data.name === 'India';

  return (
    <group position={pos}>
      {/* Base Point marker */}
      <mesh 
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
        onPointerOut={(e) => { e.stopPropagation(); setHovered(false); }}
      >
        <sphereGeometry args={[isIndia ? 0.07 : 0.04, 16, 16]} />
        <meshBasicMaterial color={isIndia ? '#ff9933' : '#a1a1aa'} />
      </mesh>

      {/* Saffron Glowing Radar for India */}
      {isIndia && (
        <mesh ref={radarRef} rotation-x={Math.PI / 2}>
          <ringGeometry args={[0.08, 0.15, 32]} />
          <meshBasicMaterial color="#ff9933" transparent={true} opacity={0.6} side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* Dynamic Glassmorphism Tooltip card */}
      {hovered && (
        <Html distanceFactor={8} position={[0.1, 0.1, 0]} style={{ pointerEvents: 'none' }}>
          <div className="glass-panel p-4 rounded-md shadow-premium border border-white/20 text-xs flex flex-col gap-1.5 w-48 text-primary backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-primary/10 pb-1">
              <span className="font-bold flex items-center gap-1">
                <span className="text-sm">{data.flag}</span>
                <span>{data.name}</span>
              </span>
              <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-bold">{data.rank}</span>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex justify-between">
                <span className="text-onSurfaceVariant/80 font-medium">Population:</span>
                <span className="font-bold text-primary">{data.pop}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-onSurfaceVariant/80 font-medium">Growth Rate:</span>
                <span className="font-bold text-success">{data.growth}</span>
              </div>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
};

// Curve connection between India and Global Locations
const ConnectionLine = ({ start, end }) => {
  const pStart = latLongToVector3(start.lat, start.lon, 2);
  const pEnd = latLongToVector3(end.lat, end.lon, 2);
  
  // Calculate lifted midpoint to form high 3D bezier arc
  const pMid = new THREE.Vector3().addVectors(pStart, pEnd).multiplyScalar(0.5);
  const distance = pStart.distanceTo(pEnd);
  pMid.normalize().multiplyScalar(2 + distance * 0.25); // Lift based on distance

  // Generate Bezier path points
  const curve = new THREE.QuadraticBezierCurve3(pStart, pMid, pEnd);
  const points = curve.getPoints(50);

  // Animated Flow Indicator dot
  const dotRef = useRef();
  useFrame(({ clock }) => {
    if (dotRef.current) {
      const t = (clock.getElapsedTime() * 0.2) % 1;
      const dotPos = curve.getPointAt(t);
      dotRef.current.position.copy(dotPos);
    }
  });

  return (
    <group>
      {/* Render Arc Line */}
      <Line 
        points={points} 
        color="#ff9933" 
        lineWidth={0.5} 
        transparent={true} 
        opacity={0.25} 
      />

      {/* Traveling Particle Dot */}
      <mesh ref={dotRef}>
        <sphereGeometry args={[0.018, 8, 8]} />
        <meshBasicMaterial color="#ff9933" />
      </mesh>
    </group>
  );
};

// Global Lights and Controls
const Scene = () => {
  const { camera } = useThree();

  useEffect(() => {
    // Look directly at India upon loading
    camera.position.set(2, 2.5, 3.5);
    camera.lookAt(new THREE.Vector3(0.5, 0.7, 1.8));
  }, [camera]);

  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={1.5} />
      <directionalLight position={[-5, 5, -5]} intensity={0.4} />
      <EarthMesh />
      <OrbitControls 
        enableZoom={true} 
        minDistance={2.8} 
        maxDistance={6.0} 
        enablePan={false}
        autoRotate={false}
      />
    </>
  );
};

const PopulationGlobe = () => {
  return (
    <div className="w-full h-full min-h-[400px] md:min-h-[500px]">
      <Canvas camera={{ fov: 45 }}>
        <Scene />
      </Canvas>
    </div>
  );
};

export default PopulationGlobe;
