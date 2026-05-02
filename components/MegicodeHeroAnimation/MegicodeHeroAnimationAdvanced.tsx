"use client";
import React, { useRef, useState, useEffect, useMemo, useId, useCallback } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import styles from './MegicodeHeroAnimation.module.css';

type Node = {
  id: string;
  label: string;
  src: string;
  darkSrc?: string;
  x: number;
  y: number;
  ring: 'inner' | 'outer';
  /** visual icon size override — different SVG sources have different intrinsic padding */
  iconScale: number;
};

// Hand-tuned constellation. Vertical extent kept tight (max |y| ≤ 170)
// so the SVG never bleeds into the navbar above. Inner ring is closer & larger.
// iconScale compensates for differing source SVG padding (AI icon viewBox is 31×28; the rest are 48×48 with internal padding).
const NODES: Node[] = [
  { id: 'ai',      label: 'AI / Machine Learning',  src: '/Ai%20icon.svg',                  x:    0, y: -150, ring: 'inner', iconScale: 0.95 },
  { id: 'web',     label: 'Web Applications',       src: '/web%20app%20icon.svg',           x:  170, y:  -30, ring: 'inner', iconScale: 1.25 },
  { id: 'mobile',  label: 'Mobile Apps',            src: '/mobile%20app%20icon.svg',        darkSrc: '/Mobile%20App%20Dark.svg', x:   90, y:  150, ring: 'inner', iconScale: 1.20 },
  { id: 'uiux',    label: 'UI / UX Design',         src: '/Ui&Ux-icon.svg',                 x: -155, y:   55, ring: 'inner', iconScale: 1.25 },
  { id: 'data',    label: 'Data Visualization',     src: '/data%20visualization%20icon.svg', x:  255, y:  150, ring: 'outer', iconScale: 1.30 },
  { id: 'bigdata', label: 'Big Data Analytics',     src: '/Big%20Data%20Analytics.svg',     x:  240, y: -160, ring: 'outer', iconScale: 1.30 },
  { id: 'dev',     label: 'Custom Development',     src: '/devlopment-icon.svg',            x: -255, y: -160, ring: 'outer', iconScale: 1.25 },
  { id: 'desktop', label: 'Desktop Apps',           src: '/Desktop-App-icon.svg',           darkSrc: '/Desktop App Dark.svg', x: -250, y:  170, ring: 'outer', iconScale: 1.25 },
];

const CORE_RADIUS = 46;
const PACKET_PHASES = NODES.map((_, i) => (i * 0.731) % 1);
const PACKET_PERIOD = 4.0;
const THINK_INTERVAL = 2.4;       // seconds between "thinking" pulses
const CLICK_RIPPLE_DURATION = 1.1; // seconds

type Ripple = { id: number; x: number; y: number; t0: number };

const MegicodeHeroAnimationAdvanced: React.FC = () => {
  const themeValue = useTheme()?.theme || 'light';
  const isDark = themeValue === 'dark';
  const prefersReducedMotion = useReducedMotion();
  const uid = useId().replace(/:/g, '');

  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 }); // normalized [-1,1]
  const [t, setT] = useState(0);
  const [thinkingId, setThinkingId] = useState<string | null>(null);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const svgRef = useRef<SVGSVGElement>(null);
  const rippleIdRef = useRef(0);

  // viewBox spans 720 × 480 → mouse [-1,1] maps to ±360 / ±240 SVG units
  const mouseSvgX = mouse.x * 360;
  const mouseSvgY = mouse.y * 240;

  // Single RAF loop drives ambient motion + ripple cleanup
  useEffect(() => {
    if (prefersReducedMotion) return;
    let frame: number;
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = (now - start) / 1000;
      setT(elapsed);
      // Drop ripples older than the duration
      setRipples((prev) => prev.filter((r) => elapsed - r.t0 < CLICK_RIPPLE_DURATION));
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [prefersReducedMotion]);

  // "Thinking" pulse — pick a random node periodically
  useEffect(() => {
    if (prefersReducedMotion) return;
    const pick = () => {
      const others = NODES.filter((n) => n.id !== thinkingId);
      const next = others[Math.floor(Math.random() * others.length)];
      setThinkingId(next.id);
    };
    pick();
    const handle = window.setInterval(pick, THINK_INTERVAL * 1000);
    return () => window.clearInterval(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefersReducedMotion]);

  // Ambient particles
  const particles = useMemo(
    () =>
      Array.from({ length: 24 }, () => ({
        baseX: (Math.random() - 0.5) * 700,
        baseY: (Math.random() - 0.5) * 460,
        phase: Math.random() * Math.PI * 2,
        speed: 0.22 + Math.random() * 0.4,
        radius: 0.7 + Math.random() * 1.6,
        drift: 14 + Math.random() * 26,
      })),
    []
  );

  // Aurora blobs
  const aurora = useMemo(
    () => [
      { x: -180, y: -90,  r: 280, hueShift: 0,   speed: 0.18, color: '#4573df' },
      { x:  170, y:  100, r: 250, hueShift: 80,  speed: 0.13, color: '#7c3aed' },
      { x:  220, y: -130, r: 200, hueShift: 160, speed: 0.20, color: '#06b6d4' },
    ],
    []
  );

  const handleMouseMove = (e: React.MouseEvent) => {
    if (prefersReducedMotion) return;
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMouse({
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 2,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * 2,
    });
  };
  const handleMouseLeave = () => setMouse({ x: 0, y: 0 });

  // Map a client point → SVG-space coords
  const clientToSvg = useCallback((clientX: number, clientY: number) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    const nx = (clientX - rect.left) / rect.width;
    const ny = (clientY - rect.top) / rect.height;
    return { x: -360 + nx * 720, y: -240 + ny * 480 };
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    if (prefersReducedMotion) return;
    const { x, y } = clientToSvg(e.clientX, e.clientY);
    rippleIdRef.current += 1;
    setRipples((prev) => [...prev.slice(-3), { id: rippleIdRef.current, x, y, t0: t }]);
  };

  // Theme palette
  const palette = isDark
    ? {
        accent: '#6ea8ff',
        accentDeep: '#4573df',
        line: 'rgba(110,168,255,0.45)',
        gridDot: 'rgba(148,180,230,0.18)',
        coreInner: '#1e3a8a',
        coreOuter: '#0b1226',
        coreGlow: 'rgba(110,168,255,0.6)',
        nodeHalo: 'rgba(110,168,255,0.65)',
        nodeFill: 'rgba(18,25,44,0.92)',
        nodeStroke: 'rgba(110,168,255,0.38)',
        tooltipBg: 'rgba(14,20,36,0.96)',
        tooltipText: '#eaf6ff',
        tooltipBorder: 'rgba(110,168,255,0.5)',
        packet: '#cfe2ff',
        ringSweep: '#8dbcff',
        shockwave: 'rgba(110,168,255,0.55)',
        thinkGlow: '#a8c8ff',
      }
    : {
        accent: '#4573df',
        accentDeep: '#2d4fa2',
        line: 'rgba(45,79,162,0.42)',
        gridDot: 'rgba(45,79,162,0.18)',
        coreInner: '#2d4fa2',
        coreOuter: '#0f2052',
        coreGlow: 'rgba(69,115,223,0.65)',
        nodeHalo: 'rgba(69,115,223,0.6)',
        nodeFill: 'rgba(255,255,255,0.97)',
        nodeStroke: 'rgba(69,115,223,0.36)',
        tooltipBg: 'rgba(255,255,255,0.97)',
        tooltipText: '#0f2052',
        tooltipBorder: 'rgba(69,115,223,0.45)',
        packet: '#ffffff',
        ringSweep: '#4573df',
        shockwave: 'rgba(69,115,223,0.5)',
        thinkGlow: '#6e9eff',
      };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
  };
  const fadeUp = {
    hidden: { opacity: 0, y: 6, scale: 0.97 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as const } },
  };

  // Periodic intelligence shockwave
  const shockPhase = prefersReducedMotion ? -1 : (t % 7) / 7;
  const shockR = shockPhase * 380;
  const shockOpacity = shockPhase < 0 ? 0 : (1 - shockPhase) * 0.55;

  const ringRotation = (t * 14) % 360;

  // Are we showing any focused state? Used to dim non-active nodes
  const activeId = hoveredId || focusedId;

  return (
    <div
      className={styles.heroIllustration}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <motion.svg
        ref={svgRef}
        viewBox="-360 -240 720 480"
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block', overflow: 'visible' }}
        aria-label="Megicode quantum intelligence core with connected service nodes"
        role="img"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <defs>
          {aurora.map((b, i) => (
            <radialGradient key={`aur-${i}`} id={`aur-${uid}-${i}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={b.color} stopOpacity={isDark ? 0.34 : 0.20} />
              <stop offset="60%" stopColor={b.color} stopOpacity={isDark ? 0.08 : 0.05} />
              <stop offset="100%" stopColor={b.color} stopOpacity="0" />
            </radialGradient>
          ))}

          <radialGradient id={`coreDisc-${uid}`} cx="35%" cy="30%" r="80%">
            <stop offset="0%"  stopColor={palette.coreInner} stopOpacity="1" />
            <stop offset="100%" stopColor={palette.coreOuter} stopOpacity="1" />
          </radialGradient>

          <radialGradient id={`coreGlow-${uid}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%"  stopColor={palette.accent}     stopOpacity="0.6" />
            <stop offset="55%" stopColor={palette.accentDeep} stopOpacity="0.18" />
            <stop offset="100%" stopColor={palette.accentDeep} stopOpacity="0" />
          </radialGradient>

          <linearGradient id={`sweep-${uid}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={palette.ringSweep} stopOpacity="0" />
            <stop offset="50%" stopColor={palette.ringSweep} stopOpacity="0.95" />
            <stop offset="100%" stopColor={palette.ringSweep} stopOpacity="0" />
          </linearGradient>

          <radialGradient id={`nodeHalo-${uid}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%"  stopColor={palette.nodeHalo} stopOpacity="0.6" />
            <stop offset="100%" stopColor={palette.nodeHalo} stopOpacity="0" />
          </radialGradient>

          <radialGradient id={`cursorLight-${uid}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%"  stopColor={palette.accent} stopOpacity={isDark ? 0.22 : 0.14} />
            <stop offset="100%" stopColor={palette.accent} stopOpacity="0" />
          </radialGradient>

          <radialGradient id={`thinkPulse-${uid}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%"  stopColor={palette.thinkGlow} stopOpacity="0.85" />
            <stop offset="60%" stopColor={palette.thinkGlow} stopOpacity="0.35" />
            <stop offset="100%" stopColor={palette.thinkGlow} stopOpacity="0" />
          </radialGradient>

          <filter id={`coreGlowFilter-${uid}`} x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feColorMatrix in="blur" type="matrix"
              values="0 0 0 0 0.27   0 0 0 0 0.45   0 0 0 0 0.87   0 0 0 1 0" result="tinted" />
            <feMerge>
              <feMergeNode in="tinted" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <pattern id={`gridDots-${uid}`} x="0" y="0" width="34" height="34" patternUnits="userSpaceOnUse">
            <circle cx="17" cy="17" r="1" fill={palette.gridDot} />
          </pattern>
        </defs>

        {/* Layer 1 — Aurora */}
        <motion.g variants={fadeUp} style={{ transform: `translate(${mouse.x * 3}px, ${mouse.y * 3}px)` }}>
          {aurora.map((b, i) => {
            const dx = prefersReducedMotion ? 0 : Math.sin(t * b.speed + b.hueShift) * 26;
            const dy = prefersReducedMotion ? 0 : Math.cos(t * b.speed * 0.7 + b.hueShift) * 22;
            return (
              <circle
                key={`aurora-${i}`}
                cx={b.x + dx}
                cy={b.y + dy}
                r={b.r}
                fill={`url(#aur-${uid}-${i})`}
                opacity={0.85}
              />
            );
          })}
        </motion.g>

        {/* Layer 2 — Dot grid */}
        <motion.g variants={fadeUp} style={{ transform: `translate(${mouse.x * 4}px, ${mouse.y * 4}px)` }}>
          <rect x="-700" y="-500" width="1400" height="1000" fill={`url(#gridDots-${uid})`} opacity={0.6} />
        </motion.g>

        {/* Layer 3 — Cursor follow light */}
        {!prefersReducedMotion && (mouse.x !== 0 || mouse.y !== 0) && (
          <circle
            cx={mouseSvgX}
            cy={mouseSvgY}
            r={170}
            fill={`url(#cursorLight-${uid})`}
            style={{ pointerEvents: 'none', transition: 'cx 0.4s ease-out, cy 0.4s ease-out' }}
          />
        )}

        {/* Layer 4 — Click ripples */}
        {ripples.map((r) => {
          const age = (t - r.t0) / CLICK_RIPPLE_DURATION;
          if (age < 0 || age > 1) return null;
          return (
            <circle
              key={r.id}
              cx={r.x}
              cy={r.y}
              r={age * 220}
              fill="none"
              stroke={palette.accent}
              strokeWidth={1.6}
              opacity={(1 - age) * 0.7}
              style={{ pointerEvents: 'none' }}
            />
          );
        })}

        {/* Layer 5 — Ambient particles */}
        <motion.g variants={fadeUp} style={{ transform: `translate(${mouse.x * 6}px, ${mouse.y * 6}px)` }}>
          {particles.map((p, i) => {
            const dx = prefersReducedMotion ? 0 : Math.sin(t * p.speed + p.phase) * p.drift;
            const dy = prefersReducedMotion ? 0 : Math.cos(t * p.speed * 0.8 + p.phase) * p.drift * 0.6;
            const op = 0.22 + (Math.sin(t * 0.8 + p.phase) + 1) * 0.18;
            return (
              <circle
                key={`p-${i}`}
                cx={p.baseX + dx}
                cy={p.baseY + dy}
                r={p.radius}
                fill={palette.accent}
                opacity={prefersReducedMotion ? 0.32 : op}
              />
            );
          })}
        </motion.g>

        {/* Layer 6 — Periodic shockwave */}
        {!prefersReducedMotion && shockPhase >= 0 && (
          <circle cx={0} cy={0} r={shockR} fill="none" stroke={palette.shockwave} strokeWidth={1.4} opacity={shockOpacity} />
        )}

        {/* Layer 7 — Core breathing rings */}
        <motion.g variants={fadeUp} style={{ transform: `translate(${mouse.x * 2}px, ${mouse.y * 2}px)` }}>
          {[0, 1, 2].map((i) => {
            const phase = ((t / 4) + i / 3) % 1;
            return (
              <circle
                key={`pulse-${i}`}
                cx={0}
                cy={0}
                r={CORE_RADIUS + phase * 130}
                fill="none"
                stroke={palette.accent}
                strokeWidth={1.2}
                opacity={prefersReducedMotion ? 0.1 : (1 - phase) * 0.34}
              />
            );
          })}
          <circle cx={0} cy={0} r={CORE_RADIUS * 2.6} fill={`url(#coreGlow-${uid})`} />
        </motion.g>

        {/* Layer 8 — Connections + comet packets (with hover boost & thinking burst) */}
        <motion.g variants={fadeUp} style={{ transform: `translate(${mouse.x * 8}px, ${mouse.y * 8}px)` }}>
          {NODES.map((n, i) => {
            const dx = n.x;
            const dy = n.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const ux = dx / dist;
            const uy = dy / dist;
            const startX = ux * CORE_RADIUS;
            const startY = uy * CORE_RADIUS;
            const nodeR = n.ring === 'inner' ? 32 : 26;
            const endX = n.x - ux * nodeR;
            const endY = n.y - uy * nodeR;
            const isActive = hoveredId === n.id || focusedId === n.id;
            const isThinking = thinkingId === n.id;

            // Active line gets faster packet stream
            const period = isActive ? PACKET_PERIOD * 0.45 : PACKET_PERIOD;
            const phase = prefersReducedMotion ? 0.5 : ((t / period + PACKET_PHASES[i]) % 1);
            const cometCount = isActive ? 6 : 4;

            // Comet head + fading tail
            const cometPositions = Array.from({ length: cometCount }, (_, j) => {
              const tail = j * 0.035;
              const p = phase - tail;
              if (p < 0) return null;
              return {
                x: endX + (startX - endX) * p,
                y: endY + (startY - endY) * p,
                opacity: Math.sin(p * Math.PI) * (1 - tail * 5),
                radius: Math.max(0.4, 2.7 - tail * 4),
              };
            });

            // Line draw-in entrance via stroke-dashoffset (one-shot)
            const lineLen = Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2);
            const drawDelay = 0.4 + i * 0.07;

            return (
              <g key={`conn-${n.id}`}>
                <motion.line
                  x1={startX}
                  y1={startY}
                  x2={endX}
                  y2={endY}
                  stroke={isActive ? palette.accent : palette.line}
                  strokeWidth={isActive ? 2.2 : 1.1}
                  opacity={isActive ? 0.95 : (activeId ? 0.38 : 0.62)}
                  strokeLinecap="round"
                  strokeDasharray={lineLen}
                  initial={{ strokeDashoffset: lineLen }}
                  animate={{ strokeDashoffset: 0 }}
                  transition={{ duration: 0.7, delay: drawDelay, ease: [0.16, 1, 0.3, 1] }}
                />
                {!prefersReducedMotion && cometPositions.map((c, j) =>
                  c && c.opacity > 0.05 ? (
                    <circle
                      key={`comet-${i}-${j}`}
                      cx={c.x}
                      cy={c.y}
                      r={c.radius}
                      fill={palette.packet}
                      opacity={c.opacity * (isActive ? 1 : 0.85)}
                      style={{ filter: j === 0 ? `drop-shadow(0 0 6px ${palette.accent})` : undefined }}
                    />
                  ) : null
                )}
                {/* Thinking burst — extra bright comet on the active "thinking" line */}
                {isThinking && !prefersReducedMotion && (
                  <circle
                    cx={endX + (startX - endX) * (((t * 1.5) % 1))}
                    cy={endY + (startY - endY) * (((t * 1.5) % 1))}
                    r={4}
                    fill={palette.thinkGlow}
                    opacity={0.95}
                    style={{ filter: `drop-shadow(0 0 10px ${palette.thinkGlow})` }}
                  />
                )}
              </g>
            );
          })}
        </motion.g>

        {/* Layer 9 — Core: rotating sweep ring + glass disc + REAL Megicode logo + satellites */}
        <motion.g variants={fadeUp} style={{ transform: `translate(${mouse.x * 3}px, ${mouse.y * 3}px)` }}>
          {!prefersReducedMotion && (
            <g transform={`rotate(${ringRotation})`}>
              <circle
                cx={0}
                cy={0}
                r={CORE_RADIUS + 14}
                fill="none"
                stroke={`url(#sweep-${uid})`}
                strokeWidth={2}
                strokeLinecap="round"
                strokeDasharray={`${(CORE_RADIUS + 14) * 1.4} ${(CORE_RADIUS + 14) * 4.85}`}
                opacity={0.85}
              />
            </g>
          )}

          <circle cx={0} cy={0} r={CORE_RADIUS + 14} fill="none" stroke={palette.accent} strokeWidth={0.8} opacity={0.22} />

          <motion.g
            animate={prefersReducedMotion ? undefined : { scale: [1, 1.05, 1] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: 'center', transformBox: 'fill-box' as React.CSSProperties['transformBox'] } as React.CSSProperties}
          >
            <circle
              cx={0}
              cy={0}
              r={CORE_RADIUS}
              fill={`url(#coreDisc-${uid})`}
              stroke={palette.accent}
              strokeWidth={1.5}
              filter={`url(#coreGlowFilter-${uid})`}
            />
            <image
              href="/logo-icon.svg"
              x={-CORE_RADIUS * 0.78}
              y={-CORE_RADIUS * 0.78}
              width={CORE_RADIUS * 1.56}
              height={CORE_RADIUS * 1.56}
              preserveAspectRatio="xMidYMid meet"
              style={{ pointerEvents: 'none' }}
            />
          </motion.g>

          {/* 3 micro-satellites on a depth-aware orbit */}
          {!prefersReducedMotion && [0, 1, 2].map((i) => {
            const a = t * 0.6 + (i * Math.PI * 2) / 3;
            const sr = CORE_RADIUS + 14;
            const sx = Math.cos(a) * sr;
            const sy = Math.sin(a) * sr * 0.36;
            const z = Math.sin(a);
            return (
              <circle
                key={`sat-${i}`}
                cx={sx}
                cy={sy}
                r={2.4 + z * 0.6}
                fill={palette.accent}
                opacity={0.6 + z * 0.3}
                style={{ filter: `drop-shadow(0 0 4px ${palette.accent})` }}
              />
            );
          })}
        </motion.g>

        {/* Layer 10 — Service nodes */}
        <motion.g style={{ transform: `translate(${mouse.x * 12}px, ${mouse.y * 12}px)` }}>
          {NODES.map((n, i) => {
            // Magnetic attraction
            const dxm = mouseSvgX - n.x;
            const dym = mouseSvgY - n.y;
            const distM = Math.hypot(dxm, dym);
            const threshold = 140;
            let mx = 0, my = 0;
            if (!prefersReducedMotion && distM < threshold && (mouse.x !== 0 || mouse.y !== 0)) {
              const pull = (1 - distM / threshold) * 14;
              mx = (dxm / Math.max(distM, 1)) * pull;
              my = (dym / Math.max(distM, 1)) * pull;
            }

            const float = prefersReducedMotion ? 0 : Math.sin(t * 0.85 + i * 0.7) * 3.5;
            const cx = n.x + mx;
            const cy = n.y + float + my;
            const isActive = hoveredId === n.id || focusedId === n.id;
            const isThinking = thinkingId === n.id;
            const dimmed = !!activeId && !isActive; // dim non-active when something is hovered

            const nodeR = n.ring === 'inner' ? 32 : 26;
            // Each icon's effective size accounts for its source viewBox padding
            const baseSize = (n.ring === 'inner' ? 36 : 30);
            const iconSize = baseSize * n.iconScale;
            const iconSrc = isDark && n.darkSrc ? n.darkSrc : n.src;

            return (
              <motion.g
                key={n.id}
                variants={fadeUp}
                tabIndex={0}
                role="button"
                aria-label={n.label}
                onMouseEnter={() => setHoveredId(n.id)}
                onMouseLeave={() => setHoveredId(null)}
                onFocus={() => setFocusedId(n.id)}
                onBlur={() => setFocusedId(null)}
                style={{ cursor: 'pointer', outline: 'none' }}
                animate={{ opacity: dimmed ? 0.5 : 1 }}
                transition={{ duration: 0.25 }}
              >
                {/* Thinking glow halo (subtle, persistent while node is "thinking") */}
                {isThinking && !prefersReducedMotion && (
                  <motion.circle
                    cx={cx}
                    cy={cy}
                    r={nodeR + 18}
                    fill={`url(#thinkPulse-${uid})`}
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: [0, 0.9, 0], scale: [0.7, 1.15, 1.3] }}
                    transition={{ duration: 1.6, ease: 'easeOut' }}
                  />
                )}

                {/* Hover halo */}
                <AnimatePresence>
                  {isActive && (
                    <motion.circle
                      cx={cx}
                      cy={cy}
                      r={nodeR + 22}
                      fill={`url(#nodeHalo-${uid})`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.25 }}
                    />
                  )}
                </AnimatePresence>

                {/* Glass capsule */}
                <motion.circle
                  cx={cx}
                  cy={cy}
                  r={nodeR}
                  fill={palette.nodeFill}
                  stroke={isActive ? palette.accent : (isThinking ? palette.thinkGlow : palette.nodeStroke)}
                  strokeWidth={isActive ? 2 : (isThinking ? 1.6 : 1.2)}
                  animate={{ scale: isActive ? 1.14 : (isThinking ? 1.06 : 1) }}
                  transition={{ type: 'spring', stiffness: 280, damping: 22 }}
                  style={{
                    transformOrigin: `${cx}px ${cy}px`,
                    filter: isActive
                      ? `drop-shadow(0 8px 22px ${palette.coreGlow})`
                      : isThinking
                      ? `drop-shadow(0 0 12px ${palette.thinkGlow})`
                      : `drop-shadow(0 2px 6px rgba(0,0,0,${isDark ? 0.4 : 0.08}))`,
                  }}
                />

                {/* Icon (per-node sized) */}
                <image
                  href={iconSrc}
                  x={cx - iconSize / 2}
                  y={cy - iconSize / 2}
                  width={iconSize}
                  height={iconSize}
                  style={{
                    pointerEvents: 'none',
                    filter: isDark && !n.darkSrc ? 'brightness(1.18)' : undefined,
                  }}
                  preserveAspectRatio="xMidYMid meet"
                />

                {/* Tooltip */}
                <AnimatePresence>
                  {isActive && (
                    <motion.g
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.18 }}
                      style={{ pointerEvents: 'none' }}
                    >
                      <rect
                        x={cx - n.label.length * 3.7 - 14}
                        y={cy - nodeR - 38}
                        width={n.label.length * 7.4 + 28}
                        height={26}
                        rx={13}
                        fill={palette.tooltipBg}
                        stroke={palette.tooltipBorder}
                        strokeWidth={1}
                        style={{ filter: `drop-shadow(0 6px 18px rgba(0,0,0,${isDark ? 0.5 : 0.12}))` }}
                      />
                      <text
                        x={cx}
                        y={cy - nodeR - 20}
                        textAnchor="middle"
                        fontSize="12"
                        fontWeight={600}
                        fill={palette.tooltipText}
                        style={{ userSelect: 'none', letterSpacing: 0.15 }}
                      >
                        {n.label}
                      </text>
                    </motion.g>
                  )}
                </AnimatePresence>
              </motion.g>
            );
          })}
        </motion.g>
      </motion.svg>
    </div>
  );
};

export default MegicodeHeroAnimationAdvanced;
