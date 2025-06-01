
import React, { useRef, useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { motion } from 'framer-motion';
import styles from './MegicodeHeroAnimation.module.css';


/**
 * Advanced, interactive, and complex Megicode hero SVG animation.
 * - Nodes and lines react to hover/click
 * - Parallax and floating elements
 * - Animated grid, sparkles, and data streams
 */

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

const ORBIT_RADIUS = 60;
const ORBIT_SPEED = 16; // seconds per full orbit (slow, premium)

const MegicodeHeroAnimationAdvanced: React.FC = () => {
  // Use theme from context, fallback to light
  let themeValue = 'light';
  if (useTheme) {
    try {
      themeValue = useTheme().theme || 'light';
    } catch {
      themeValue = 'light';
    }
  }
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);
  const [focusedIcon, setFocusedIcon] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [orbitAngle, setOrbitAngle] = useState(0);

  // Animate orbit angle (slow, smooth)
  React.useEffect(() => {
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


  // Only render on desktop/tablet (not mobile)
  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  if (isMobile) return null;


  return (
    <div className={styles['megicode-hero-illustration']} style={{ position: 'absolute' }}>
      <svg
        ref={svgRef}
        viewBox="0 0 480 320"
        width="100%"
        height="100%"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block', width: '100%', height: '100%' }}
        aria-label="Megicode hero animation with orbiting service icons"
        role="img"
      >
        {/* Subtle background halo */}
        <ellipse cx={240} cy={160} rx={110} ry={120} fill="url(#blueGrad)" opacity="0.13" />
        <defs>
          <linearGradient id="blueGrad" x1="0" y1="0" x2="480" y2="320" gradientUnits="userSpaceOnUse">
            <stop stopColor="#4573df" />
            <stop offset="1" stopColor="#2d4fa2" />
          </linearGradient>
        </defs>
        {/* Central M node */}
        <motion.path
          d="M120 240 L180 80 L240 240 L300 80 L360 240"
          stroke="url(#blueGrad)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2.5, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
          filter={(hoveredIcon || focusedIcon) ? 'url(#glow)' : undefined}
        />
        {/* Orbiting SVG icons */}
        {ORBIT_ICONS.map((item, i) => {
          const angle = orbitAngle + (i * (2 * Math.PI) / ORBIT_ICONS.length);
          const cx = 240 + ORBIT_RADIUS * Math.cos(angle);
          const cy = 160 + ORBIT_RADIUS * Math.sin(angle);
          const isActive = hoveredIcon === item.id || focusedIcon === item.id;
          // Use dark icon if available and theme is dark
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
                  filter: isActive ? 'drop-shadow(0 0 16px #4573df)' : 'none',
                }}
                transition={{ type: 'spring', stiffness: 220, damping: 18 }}
              >
                {/* Force all icons into a 40x40 viewBox for perfect consistency */}
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
              {/* Tooltip */}
              {isActive && (
                <motion.text
                  x={cx}
                  y={cy - 32}
                  textAnchor="middle"
                  fontSize="15"
                  fill="#fff"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.18 }}
                  style={{ pointerEvents: 'none', userSelect: 'none', fontWeight: 500, textShadow: '0 2px 8px #2d4fa2' }}
                  aria-live="polite"
                >
                  {item.label}
                </motion.text>
              )}
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
      </svg>
    </div>
  );
};

export default MegicodeHeroAnimationAdvanced;
