'use client';

import React, { useEffect } from 'react';

import Image from 'next/image';

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';

import { useTheme } from '../../context/ThemeContext';
import styles from './PipelineHero.module.css';

const EASE = [0.22, 1, 0.36, 1] as const;

/* Wire paths in 720×480 canvas space — one input feeding the Megicode core,
   the core fanning out to the three service outcomes. */
const WIRE_IN = 'M 188 228 C 240 228, 268 227, 306 226';
const WIRE_MVP = 'M 368 198 C 404 150, 442 108, 498 88';
const WIRE_AUTOMATION = 'M 380 226 C 424 223, 466 219, 506 216';
const WIRE_ANALYTICS = 'M 362 254 C 400 304, 434 336, 480 356';

/* One shared 5.6s cycle: the brief travels in during the first half,
   the core flashes at the midpoint, the three outcomes travel out in the
   second half. SMIL keyPoints hold each pulse at rest outside its window;
   each pulse is only visible during its own travel window, so the input
   fades out as it enters the core and the outputs stay lit until they
   reach their card (the arrival is the payoff — it must be visible). */
const CYCLE = '5.6s';

/* Decelerate into the destination — pulses "dock" rather than fly past. */
const SPLINE_TRAVEL = '0.45 0 0.25 1';
const SPLINE_REST = '0 0 1 1';

type PulseSpec = {
  path: string;
  r: number;
  keyPoints: string;
  keySplines: string;
  opacityKeys: string;
  opacityTimes: string;
};

const OUTPUT_PULSE = {
  r: 3.6,
  keyPoints: '0;0;1',
  keySplines: `${SPLINE_REST};${SPLINE_TRAVEL}`,
  opacityKeys: '0;0;1;1;0',
  opacityTimes: '0;0.5;0.55;0.94;1',
};

const PULSES: PulseSpec[] = [
  // input: travels 0 → 50% of the cycle, fades right as it enters the core
  {
    path: WIRE_IN,
    r: 4.2,
    keyPoints: '0;1;1',
    keySplines: `${SPLINE_TRAVEL};${SPLINE_REST}`,
    opacityKeys: '0;1;1;0;0',
    opacityTimes: '0;0.05;0.42;0.5;1',
  },
  // outputs: rest first, travel 50% → 100%, visible all the way to arrival
  { path: WIRE_MVP, ...OUTPUT_PULSE },
  { path: WIRE_AUTOMATION, ...OUTPUT_PULSE },
  { path: WIRE_ANALYTICS, ...OUTPUT_PULSE },
];

const MOTION_KEYTIMES = '0;0.5;1';

type FloatCardProps = {
  delay: number;
  floatDuration: number;
  style: React.CSSProperties;
  children: React.ReactNode;
};

/** Card that staggers in, then floats ±4px unless reduced motion is set. */
function FloatCard({ delay, floatDuration, style, children }: FloatCardProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={styles.card}
      style={style}
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.97 }}
      animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.55, delay, ease: EASE }}
    >
      <motion.div
        animate={reduceMotion ? undefined : { y: [0, -4, 0] }}
        transition={
          reduceMotion
            ? undefined
            : { duration: floatDuration, repeat: Infinity, ease: 'easeInOut', delay: delay + 0.6 }
        }
        style={{ display: 'flex', flexDirection: 'column', gap: 6 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

const CheckDot = () => (
  <span className={styles.checkDot}>
    <svg
      width="9"
      height="9"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  </span>
);

/**
 * Hero diagram — "from idea to scale": a client brief flows into the
 * Megicode core (the magic box) and comes out as the three things the
 * studio ships — a launched SaaS MVP, an automated workflow, and growth
 * you can measure. One choreographed pulse cycle carries the story.
 */
export default function PipelineHero() {
  const reduceMotion = useReducedMotion();
  const { theme } = useTheme();
  const logoSrc = theme === 'dark' ? '/logo-navbar-dark.png' : '/logo-navbar-light.png';
  const barHeights = [14, 22, 18, 28, 38];

  /* Cursor-depth parallax: wires sit deepest, the core mid, cards nearest.
     Springed so the diagram drifts rather than tracks. Skipped for touch
     devices and reduced motion. */
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 50, damping: 20 });
  const sy = useSpring(my, { stiffness: 50, damping: 20 });
  const wiresX = useTransform(sx, (v) => v * 5);
  const wiresY = useTransform(sy, (v) => v * 4);
  const coreX = useTransform(sx, (v) => v * 9);
  const coreY = useTransform(sy, (v) => v * 7);
  const cardsX = useTransform(sx, (v) => v * 14);
  const cardsY = useTransform(sy, (v) => v * 11);

  useEffect(() => {
    if (reduceMotion || window.matchMedia('(pointer: coarse)').matches) return;
    const onMove = (e: MouseEvent) => {
      mx.set((e.clientX / window.innerWidth) * 2 - 1);
      my.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [reduceMotion, mx, my]);

  return (
    <div className={styles.canvas} aria-hidden="true">
      {/* Wires draw themselves in, then carry the pulse cycle */}
      <motion.div className={styles.layer} style={{ x: wiresX, y: wiresY }}>
        {/* preserveAspectRatio="none" keeps wire coordinates locked to the same
          percentage space the cards are positioned in, even when the mobile
          canvas uses a taller aspect ratio */}
        <svg className={styles.wires} viewBox="0 0 720 480" preserveAspectRatio="none">
          {[WIRE_IN, WIRE_MVP, WIRE_AUTOMATION, WIRE_ANALYTICS].map((d, i) => (
            <motion.path
              key={d}
              className={styles.wirePath}
              d={d}
              initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7 + i * 0.12, ease: EASE }}
            />
          ))}
          {!reduceMotion &&
            PULSES.map(({ path, r, keyPoints, keySplines, opacityKeys, opacityTimes }) => (
              <g key={path}>
                {/* soft halo trailing the pulse */}
                <circle className={styles.pulseHalo} r={r * 2.4} opacity="0">
                  <animateMotion
                    dur={CYCLE}
                    repeatCount="indefinite"
                    path={path}
                    keyPoints={keyPoints}
                    keyTimes={MOTION_KEYTIMES}
                    keySplines={keySplines}
                    calcMode="spline"
                  />
                  <animate
                    attributeName="opacity"
                    values={opacityKeys.replace(/1/g, '0.35')}
                    keyTimes={opacityTimes}
                    dur={CYCLE}
                    repeatCount="indefinite"
                  />
                </circle>
                <circle className={styles.pulseDot} r={r} opacity="0">
                  <animateMotion
                    dur={CYCLE}
                    repeatCount="indefinite"
                    path={path}
                    keyPoints={keyPoints}
                    keyTimes={MOTION_KEYTIMES}
                    keySplines={keySplines}
                    calcMode="spline"
                  />
                  <animate
                    attributeName="opacity"
                    values={opacityKeys}
                    keyTimes={opacityTimes}
                    dur={CYCLE}
                    repeatCount="indefinite"
                  />
                </circle>
              </g>
            ))}
        </svg>
      </motion.div>

      {/* 1 · The magic box — Megicode designs, builds, automates */}
      <motion.div className={styles.layer} style={{ x: coreX, y: coreY }}>
        <motion.div
          className={styles.coreWrap}
          style={{ left: '39%', top: '33%' }}
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.6, ease: EASE }}
        >
          <span className={styles.coreGlow} />
          <span className={styles.coreBox}>
            <span className={styles.coreRing} />
            <Image
              src={logoSrc}
              alt=""
              width={44}
              height={44}
              className={styles.coreLogo}
              priority
            />
          </span>
          <span className={styles.agentLabel}>Megicode</span>
          <span className={styles.agentChips}>
            <span className={styles.agentChip}>design</span>
            <span className={styles.agentChip}>build</span>
            <span className={styles.agentChip}>automate</span>
          </span>
        </motion.div>
      </motion.div>

      <motion.div className={styles.layer} style={{ x: cardsX, y: cardsY }}>
        {/* 0 · The idea comes in — the brief types itself out as the pulse
          carries it toward the core */}
        <FloatCard
          delay={0.5}
          floatDuration={6.5}
          style={{ left: '1%', top: '33%', width: 'min(182px, 27%)' }}
        >
          <div className={styles.cardHeader}>
            <span className={styles.dotLive} />
            <span className={styles.cardTitle}>Your idea</span>
            <span className={styles.cardMeta}>brief</span>
          </div>
          <div className={styles.cardBody}>
            <span className={styles.typedLine}>bookings · payments · AI assistant</span>
          </div>
        </FloatCard>

        {/* 2 · SaaS MVP ships */}
        <FloatCard
          delay={0.85}
          floatDuration={7.5}
          style={{ left: '70%', top: '5%', width: 'min(186px, 28%)' }}
        >
          <div className={styles.cardHeader}>
            <CheckDot />
            <span className={styles.cardTitle}>SaaS MVP launched</span>
          </div>
          <div className={styles.monoLine}>auth · payments · AI layer</div>
        </FloatCard>

        {/* 3 · Workflow runs itself */}
        <FloatCard
          delay={0.95}
          floatDuration={8}
          style={{ left: '71%', top: '37%', width: 'min(182px, 27%)' }}
        >
          <div className={styles.cardHeader}>
            <CheckDot />
            <span className={styles.cardTitle}>Booking automated</span>
          </div>
          <div className={styles.monoLine}>WhatsApp · Fri 10:30 · reminder</div>
        </FloatCard>

        {/* 4 · Growth you can measure */}
        <FloatCard
          delay={1.05}
          floatDuration={8.5}
          style={{ left: '64%', top: '62%', width: 'min(176px, 27%)' }}
        >
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Scale</span>
            <span className={styles.cardMeta}>live</span>
          </div>
          <div className={styles.chart}>
            {barHeights.map((h, i) => (
              <motion.span
                key={i}
                className={`${styles.bar} ${i === barHeights.length - 1 ? styles.barHot : ''}`}
                style={{ height: h }}
                initial={reduceMotion ? false : { scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.5, delay: 1.2 + i * 0.08, ease: EASE }}
              />
            ))}
          </div>
          <span className={styles.chartCaption}>+38% booked revenue</span>
        </FloatCard>
      </motion.div>
    </div>
  );
}
