
import React, { useRef, useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { motion, AnimatePresence, easeInOut } from 'framer-motion';
import styles from './MegicodeHeroAnimation.module.css';

const ORBIT_ICONS = [
  { id: 'uiux', label: 'UI & UX Designing', src: '/Ui&Ux-icon.svg' },
  { id: 'desktop', label: 'Desktop Application', src: '/Desktop-App-icon.svg', darkSrc: '/Desktop App Dark.svg' },
  { id: 'web', label: 'Web Application', src: '/web%20app%20icon.svg' },
  { id: 'mobile', label: 'Mobile App', src: '/mobile%20app%20icon.svg', darkSrc: '/Mobile%20App%20Dark.svg' },
  { id: 'dev', label: 'Development', src: '/devlopment-icon.svg' },
  { id: 'dsai', label: 'Data Science & AI', src: '/ds&ai-icon.svg' },
  { id: 'datascrap', label: 'Data Scraping', src: '/data%20scrapping%20icon.svg' },
  { id: 'dataviz', label: 'Data Visualization', src: '/data%20visualization%20icon.svg' },
  { id: 'bigdata', label: 'Big Data Analytics', src: '/Big%20Data%20Analytics.svg' },
  { id: 'ai', label: 'AI Solution Development', src: '/Ai%20icon.svg' },
];

const ORBIT_RADIUS = 140;
const ORBIT_SPEED = 35;
const PARTICLE_COUNT = 32;
const QUANTUM_PARTICLES = 16;
const ENERGY_FLOW_SPEED = 2;
const WAVE_AMPLITUDE = 3;

const MegicodeHeroAnimationAdvanced: React.FC = () => {
  const themeValue = useTheme()?.theme || 'light';
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);
  const [focusedIcon, setFocusedIcon] = useState<string | null>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [orbitAngle, setOrbitAngle] = useState(0);
  const [particles, setParticles] = useState<Array<{ x: number; y: number; speed: number; angle: number }>>([]);
  const [quantumParticles, setQuantumParticles] = useState<Array<{ x: number; y: number; angle: number; phase: number }>>([]);
  const [energyFlow, setEnergyFlow] = useState<number>(0);
  const svgRef = useRef<SVGSVGElement>(null);

  // Animate orbit angle
  useEffect(() => {
    let frame: number;
    let last = performance.now();
    function animate(now: number) {
      const dt = (now - last) / 1000;
      last = now;
      setOrbitAngle(a => (a + dt * (2 * Math.PI) / ORBIT_SPEED) % (2 * Math.PI));
      frame = requestAnimationFrame(animate);
    }
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  // Mouse parallax
  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (rect) {
      setMouse({
        x: ((e.clientX - rect.left) / rect.width - 0.5) * 2,
        y: ((e.clientY - rect.top) / rect.height - 0.5) * 2,
      });
    }
  };
  // Particles with horizontal movement only
  useEffect(() => {
    setParticles(
      Array.from({ length: PARTICLE_COUNT }, () => ({
        x: Math.random() * 960,
        y: Math.random() * 640,
        angle: Math.random() * Math.PI * 2,
        speed: 0.3 + Math.random() * 0.8
      }))
    );
  }, []);
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev => prev.map(p => ({
        ...p,
        x: (p.x + Math.cos(p.angle) * p.speed + 960) % 960,
        y: p.y
      })));
    }, 60);
    return () => clearInterval(interval);
  }, []);

  // Initialize quantum particles
  useEffect(() => {
    setQuantumParticles(
      Array.from({ length: QUANTUM_PARTICLES }, () => ({
        x: (Math.random() - 0.5) * ORBIT_RADIUS * 2,
        y: (Math.random() - 0.5) * ORBIT_RADIUS * 2,
        angle: Math.random() * Math.PI * 2,
        phase: Math.random() * Math.PI * 2
      }))
    );
  }, []);

  // Animate quantum particles and energy flow
  useEffect(() => {
    const interval = setInterval(() => {
      setQuantumParticles(prev => prev.map(p => ({
        ...p,
        angle: p.angle + 0.02,
        phase: p.phase + 0.03,
        x: p.x + Math.cos(p.angle) * 0.5,
        y: p.y + Math.sin(p.angle) * 0.5
      })).map(p => ({
        ...p,
        x: Math.abs(p.x) > ORBIT_RADIUS ? -p.x : p.x,
        y: Math.abs(p.y) > ORBIT_RADIUS ? -p.y : p.y
      })));
      setEnergyFlow(prev => (prev + ENERGY_FLOW_SPEED) % 360);
    }, 16);
    return () => clearInterval(interval);
  }, []);

  // Only render on desktop/tablet (not mobile)
  const [isMobile, setIsMobile] = React.useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  if (isMobile) return null;

  return (
    <div
      className={styles['megicode-hero-illustration']}
      style={{ position: 'absolute' }}
      onMouseMove={handleMouseMove}
    >
      <motion.svg
        ref={svgRef}
        viewBox="-360 -360 720 720"
        width="100%"
        height="100%"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          transform: `translate(${mouse.x * 15}px, ${mouse.y * 15}px)`
        }}
        aria-label="Megicode quantum animation with orbiting service icons"
        role="img"
      >
        <defs>
          <radialGradient id="quantumGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#4573df" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#4573df" stopOpacity="0" />
          </radialGradient>
          <filter id="quantumBlur">
            <feGaussianBlur stdDeviation="2" />
          </filter>
        </defs>

        {/* Quantum background effect */}
        <motion.path
          d={`M0,-240 L208,-120 L208,120 L0,240 L-208,120 L-208,-120 Z`}
          fill="url(#quantumGlow)"
          opacity="0.15"
          style={{ filter: 'url(#quantumBlur)' }}
          animate={{
            opacity: [0.15, 0.25, 0.15],
            scale: [1, 1.02, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: easeInOut
          }}
        />

        {/* Quantum particles */}
        {quantumParticles.map((particle, i) => (
          <motion.circle
            key={`quantum-${i}`}
            cx={particle.x}
            cy={particle.y}
            r={2}
            fill="#4573df"
            opacity={0.6}
            style={{
              filter: 'url(#quantumBlur)',
            }}
            animate={{
              opacity: [0.6, 0.8, 0.6],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 2 + (i % 3),
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}

        {/* Energy flow lines */}
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i * Math.PI * 2) / 8 + (energyFlow * Math.PI) / 180;
          return (
            <motion.path
              key={`energy-${i}`}
              d={`M${Math.cos(angle) * 80},${Math.sin(angle) * 80} L${Math.cos(angle) * 160},${Math.sin(angle) * 160}`}
              stroke="url(#blueGrad)"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              opacity="0.4"
              style={{ filter: 'url(#quantumBlur)' }}
            />
          );
        })}

        {/* Hexagonal crystal-like background */}
        <motion.path
          d="M0,-240 L208,-120 L208,120 L0,240 L-208,120 L-208,-120 Z"
          fill="url(#blueGrad)"
          opacity="0.08"
          stroke="url(#blueGrad)"
          strokeWidth="1"
        />
        <motion.path
          d="M0,-180 L156,-90 L156,90 L0,180 L-156,90 L-156,-90 Z"
          fill="url(#blueGrad)"
          opacity="0.12"
          stroke="url(#blueGrad)"
          strokeWidth="1"
        />

        {/* Crystal-like connecting lines */}
        {ORBIT_ICONS.map((_, i) => {
          const next = (i + 1) % ORBIT_ICONS.length;
          const angle1 = orbitAngle + (i * (2 * Math.PI) / ORBIT_ICONS.length);
          const angle2 = orbitAngle + (next * (2 * Math.PI) / ORBIT_ICONS.length);
          const x1 = ORBIT_RADIUS * Math.cos(angle1);
          const y1 = ORBIT_RADIUS * Math.sin(angle1);
          const x2 = ORBIT_RADIUS * Math.cos(angle2);
          const y2 = ORBIT_RADIUS * Math.sin(angle2);
          
          return (
            <React.Fragment key={`lines-${i}`}>
              <motion.line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={themeValue === 'dark' ? '#4573df' : '#2d4fa2'}
                strokeWidth={1.2}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.2 }}
                transition={{ duration: 0.5 }}
              />
              <motion.line
                x1={x1}
                y1={y1}
                x2={0}
                y2={0}
                stroke={themeValue === 'dark' ? '#4573df' : '#2d4fa2'}
                strokeWidth={1}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.15 }}
                transition={{ duration: 0.5 }}
                style={{ filter: 'blur(0.3px)' }}
              />
            </React.Fragment>
          );
        })}

        {/* Central M node - proper M shape */}
        <motion.path
          d="M-90 60 L-60 -60 L0 60 L60 -60 L90 60"
          stroke="url(#blueGrad)"
          strokeWidth="12"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2.5, repeat: Infinity, repeatType: 'reverse', ease: easeInOut }}
          filter={(hoveredIcon || focusedIcon) ? 'url(#glow)' : undefined}
        />        {/* Orbiting SVG icons with floating effect */}
        {ORBIT_ICONS.map((item, i) => {          const angle = orbitAngle + (i * (2 * Math.PI) / ORBIT_ICONS.length);
          // Floating effect with reduced amplitude for smoother movement
          const float = Math.sin(orbitAngle + i) * 5;
          const cx = ORBIT_RADIUS * Math.cos(angle);
          const cy = ORBIT_RADIUS * Math.sin(angle) + float;
          const isActive = hoveredIcon === item.id || focusedIcon === item.id;
          const iconSrc = themeValue === 'dark' && item.darkSrc ? item.darkSrc : item.src;
          return (
            <g key={item.id} tabIndex={0}
              aria-label={item.label}
              role="button"
              onMouseEnter={() => setHoveredIcon(item.id)}
              onMouseLeave={() => setHoveredIcon(null)}
              onFocus={() => setFocusedIcon(item.id)}
              onBlur={() => setFocusedIcon(null)}
              style={{ cursor: 'pointer', outline: 'none' }}
            >
              <motion.g
                animate={{
                  scale: isActive ? 1.28 : 1,
                  filter: isActive ? 'drop-shadow(0 0 20px #4573df)' : 'none',
                }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              >
                <svg x={cx - 20} y={cy - 20} width={40} height={40} viewBox="0 0 40 40" style={{ pointerEvents: 'none', display: 'block' }} aria-hidden="true">
                  <image
                    href={iconSrc}
                    width={40}
                    height={40}
                    style={{ filter: themeValue === 'dark' && !item.darkSrc ? 'brightness(1.2)' : undefined }}
                    preserveAspectRatio="xMidYMid meet"
                  />
                </svg>
              </motion.g>
              {/* Enhanced tooltip with glassmorphism */}
              <AnimatePresence>
                {isActive && (
                  <motion.g
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.22 }}
                  >
                    <motion.rect
                      x={cx - 60}
                      y={cy - 48}
                      width={120}
                      height={32}
                      rx={12}
                      fill={themeValue === 'dark' ? 'rgba(30,34,54,0.82)' : 'rgba(255,255,255,0.82)'}
                      style={{ filter: 'blur(1.5px)', stroke: themeValue === 'dark' ? '#4573df' : '#2d4fa2', strokeWidth: 1 }}
                    />
                    <motion.text
                      x={cx}
                      y={cy - 28}
                      textAnchor="middle"
                      fontSize="15"
                      fill={themeValue === 'dark' ? '#fff' : '#222'}
                      style={{ fontWeight: 600, pointerEvents: 'none', userSelect: 'none', letterSpacing: 0.2 }}
                    >
                      {item.label}
                    </motion.text>
                  </motion.g>
                )}
              </AnimatePresence>
            </g>
          );
        })}
        {/* SVG Filters */}
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </motion.svg>
    </div>
  );
};

export default MegicodeHeroAnimationAdvanced;