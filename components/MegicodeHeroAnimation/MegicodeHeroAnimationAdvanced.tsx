// import React, { useRef, useState } from 'react';
// import { useTheme } from '../../context/ThemeContext';
// import { motion } from 'framer-motion';
// import styles from './MegicodeHconst ORBIT_RADIUS = 140; // Radius matching the hexagonal layoutAnimation.module.css';


// /**
//  * Advanced, interactive, and complex Megicode hero SVG animation.
//  * - Nodes and lines react to hover/c          const float = Math.sin(orbitAngle + i) * 4;ick
//  * - Parallax and floating elements
//  * - Animated grid, sparkles, and data streams
//  */

// const ORBIT_ICONS = [
//   { id: 'uiux', label: 'UI & UX Designing', src: '/Ui&Ux-icon.svg' },
//   { id: 'desktop', label: 'Desktop Application', src: '/Desktop-App-icon.svg', darkSrc: '/Desktop App Dark.svg' },
//   { id: 'web', label: 'Web Application', src: '/web%20app%20icon.svg' },
//   { id: 'mobile', label: 'Mobile App', src: '/mobile%20app%20icon.svg', darkSrc: '/Mobile%20App%20Dark.svg' },
//   { id: 'dev', label: 'Development', src: '/devlopment-icon.svg' },
//   { id: 'dsai', label: 'Data Science & AI', src: '/ds&ai-icon.svg' },
//   { id: 'datascrap', label: 'Data Scraping', src: '/data%20scrapping%20icon.svg' },
//   { id: 'dataviz', label: 'Data Visualization', src: '/data%20visualization%20icon.svg' },
//   { id: 'bigdata', label: 'Big Data Analytics', src: '/Big%20Data%20Analytics.svg' },
//   { id: 'ai', label: 'AI Solution Development', src: '/Ai%20icon.svg' },
// ];

// const ORBIT_RADIUS = 60;
// const ORBIT_SPEED = 16; // seconds per full orbit (slow, premium)

// const MegicodeHeroAnimationAdvanced: React.FC = () => {
//   // Use theme from context, fallback to light
//   let themeValue = 'light';
//   if (useTheme) {
//     try {
//       themeValue = useTheme().theme || 'light';
//     } catch {
//       themeValue = 'light';
//     }
//   }
//   const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);
//   const [focusedIcon, setFocusedIcon] = useState<string | null>(null);
//   const svgRef = useRef<SVGSVGElement>(null);
//   const [orbitAngle, setOrbitAngle] = useState(0);

//   // Animate orbit angle (slow, smooth)
//   React.useEffect(() => {
//     let frame: number;
//     let last = performance.now();
//     function animate(now: number) {
//       const dt = (now - last) / 1000;
//       last = now;
//       setOrbitAngle(a => (a + dt * (2 * Math.PI) / ORBIT_SPEED) % (2 * Math.PI));
//       frame = requestAnimationFrame(animate);
//     }
//     frame = requestAnimationFrame(animate);
//     return () => cancelAnimationFrame(frame);
//   }, []);


//   // Only render on desktop/tablet (not mobile)
//   const [isMobile, setIsMobile] = React.useState(false);
//   React.useEffect(() => {
//     const checkMobile = () => setIsMobile(window.innerWidth <= 768);
//     checkMobile();
//     window.addEventListener('resize', checkMobile);
//     return () => window.removeEventListener('resize', checkMobile);
//   }, []);
//   if (isMobile) return null;


//   return (
//     <div className={styles['megicode-hero-illustration']} style={{ position: 'absolute' }}>
//       <svg
//         ref={svgRef}
//         viewBox="0 0 480 320"
//         width="100%"
//         height="100%"
//         fill="none"
//         xmlns="http://www.w3.org/2000/svg"
//         style={{ display: 'block', width: '100%', height: '100%' }}
//         aria-label="Megicode hero animation with orbiting service icons"
//         role="img"
//       >
//         {/* Subtle background halo */}
//         <ellipse cx={240} cy={160} rx={110} ry={120} fill="url(#blueGrad)" opacity="0.13" />
//         <defs>
//           <linearGradient id="blueGrad" x1="0" y1="0" x2="480" y2="320" gradientUnits="userSpaceOnUse">
//             <stop stopColor="#4573df" />
//             <stop offset="1" stopColor="#2d4fa2" />
//           </linearGradient>
//         </defs>
//         {/* Central M node */}
//         <motion.path
//           d="M120 240 L180 80 L240 240 L300 80 L360 240"
//           stroke="url(#blueGrad)"
//           strokeWidth="10"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           initial={{ pathLength: 0 }}
//           animate={{ pathLength: 1 }}
//           transition={{ duration: 2.5, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
//           filter={(hoveredIcon || focusedIcon) ? 'url(#glow)' : undefined}
//         />
//         {/* Orbiting SVG icons */}
//         {ORBIT_ICONS.map((item, i) => {
//           const angle = orbitAngle + (i * (2 * Math.PI) / ORBIT_ICONS.length);
//           const cx = 240 + ORBIT_RADIUS * Math.cos(angle);
//           const cy = 160 + ORBIT_RADIUS * Math.sin(angle);
//           const isActive = hoveredIcon === item.id || focusedIcon === item.id;
//           // Use dark icon if available and theme is dark
//           const iconSrc = themeValue === 'dark' && item.darkSrc ? item.darkSrc : item.src;
//           return (
//             <g key={item.id} tabIndex={0}
//               aria-label={item.label}
//               role="button"
//               onMouseEnter={() => setHoveredIcon(item.id)}
//               onMouseLeave={() => setHoveredIcon(null)}
//               onFocus={() => setFocusedIcon(item.id)}
//               onBlur={() => setFocusedIcon(null)}
//               style={{ cursor: 'pointer', outline: 'none' }}
//             >
//               <motion.g
//                 animate={{
//                   scale: isActive ? 1.28 : 1,
//                   filter: isActive ? 'drop-shadow(0 0 16px #4573df)' : 'none',
//                 }}
//                 transition={{ type: 'spring', stiffness: 220, damping: 18 }}
//               >
//                 {/* Force all icons into a 40x40 viewBox for perfect consistency */}
//                 <svg x={cx - 20} y={cy - 20} width={40} height={40} viewBox="0 0 40 40" style={{ pointerEvents: 'none', display: 'block' }} aria-hidden="true">
//                   <image
//                     href={iconSrc}
//                     width={40}
//                     height={40}
//                     style={{ filter: themeValue === 'dark' && !item.darkSrc ? 'brightness(1.2)' : undefined }}
//                     preserveAspectRatio="xMidYMid meet"
//                   />
//                 </svg>
//               </motion.g>
//               {/* Tooltip */}
//               {isActive && (
//                 <motion.text
//                   x={cx}
//                   y={cy - 32}
//                   textAnchor="middle"
//                   fontSize="15"
//                   fill="#fff"
//                   initial={{ opacity: 0, y: -10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.18 }}
//                   style={{ pointerEvents: 'none', userSelect: 'none', fontWeight: 500, textShadow: '0 2px 8px #2d4fa2' }}
//                   aria-live="polite"
//                 >
//                   {item.label}
//                 </motion.text>
//               )}
//             </g>
//           );
//         })}
//         {/* SVG Filters */}
//         <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
//           <feGaussianBlur stdDeviation="6" result="coloredBlur" />
//           <feMerge>
//             <feMergeNode in="coloredBlur" />
//             <feMergeNode in="SourceGraphic" />
//           </feMerge>
//         </filter>
//       </svg>
//     </div>
//   );
// };

// export default MegicodeHeroAnimationAdvanced;
import React, { useRef, useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
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
const PARTICLE_COUNT = 24;

const MegicodeHeroAnimationAdvanced: React.FC = () => {
  const themeValue = useTheme()?.theme || 'light';
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);
  const [focusedIcon, setFocusedIcon] = useState<string | null>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [orbitAngle, setOrbitAngle] = useState(0);
  const [particles, setParticles] = useState<Array<{ x: number; y: number; speed: number }>>([]);
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

  // Particles
  useEffect(() => {
    setParticles(
      Array.from({ length: PARTICLE_COUNT }, () => ({        x: Math.random() * 960,
        y: Math.random() * 640,
        speed: 0.5 + Math.random() * 1.5
      }))
    );
  }, []);
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev => prev.map(p => ({ ...p, y: (p.y + p.speed) % 640 })));
    }, 60);
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
        aria-label="Megicode hero animation with orbiting service icons"
        role="img"
      >
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
          transition={{ duration: 2.5, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
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