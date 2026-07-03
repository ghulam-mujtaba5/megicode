'use client';

import React from 'react';

import Image from 'next/image';

import { motion, useReducedMotion } from 'framer-motion';

import { useTheme } from '../../context/ThemeContext';
import styles from './PipelineHero.module.css';

const EASE = [0.22, 1, 0.36, 1] as const;

/* Wire paths in 720×480 canvas space — one input feeding the Megicode core,
   the core fanning out to the three service outcomes. */
const WIRE_IN = 'M 188 228 C 240 228, 268 227, 306 226';
const WIRE_MVP = 'M 368 198 C 404 150, 442 108, 498 88';
const WIRE_AUTOMATION = 'M 380 226 C 424 223, 470 219, 526 216';
const WIRE_ANALYTICS = 'M 362 254 C 400 304, 434 336, 480 356';

/* One shared 5.6s cycle: the brief travels in during the first half,
   the core flashes at the midpoint, the three outcomes travel out in the
   second half. SMIL keyPoints hold each pulse at rest outside its window. */
const CYCLE = '5.6s';

type PulseSpec = { path: string; r: number; keyPoints: string; opacityKeys: string };

const PULSES: PulseSpec[] = [
  // input: travels 0 → 50% of the cycle, rests after
  { path: WIRE_IN, r: 4.2, keyPoints: '0;1;1', opacityKeys: '0;1;1;0;0' },
  // outputs: rest first, travel 50% → 100%
  { path: WIRE_MVP, r: 3.6, keyPoints: '0;0;1', opacityKeys: '0;0;1;1;0' },
  { path: WIRE_AUTOMATION, r: 3.6, keyPoints: '0;0;1', opacityKeys: '0;0;1;1;0' },
  { path: WIRE_ANALYTICS, r: 3.6, keyPoints: '0;0;1', opacityKeys: '0;0;1;1;0' },
];

const MOTION_KEYTIMES = '0;0.5;1';
const OPACITY_KEYTIMES = '0;0.06;0.44;0.5;1';

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
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
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

  return (
    <div className={styles.canvas} aria-hidden="true">
      {/* Wires draw themselves in, then carry the pulse cycle */}
      <svg className={styles.wires} viewBox="0 0 720 480" preserveAspectRatio="xMidYMid meet">
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
          PULSES.map(({ path, r, keyPoints, opacityKeys }) => (
            <circle key={path} className={styles.pulseDot} r={r} opacity="0">
              <animateMotion
                dur={CYCLE}
                repeatCount="indefinite"
                path={path}
                keyPoints={keyPoints}
                keyTimes={MOTION_KEYTIMES}
                calcMode="linear"
              />
              <animate
                attributeName="opacity"
                values={opacityKeys}
                keyTimes={OPACITY_KEYTIMES}
                dur={CYCLE}
                repeatCount="indefinite"
              />
            </circle>
          ))}
      </svg>

      {/* 0 · The idea comes in */}
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
        <div className={styles.cardBody}>“We need bookings, payments, and an AI assistant.”</div>
      </FloatCard>

      {/* 1 · The magic box — Megicode designs, builds, automates */}
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
          <Image src={logoSrc} alt="" width={44} height={44} className={styles.coreLogo} priority />
        </span>
        <span className={styles.agentLabel}>Megicode</span>
        <span className={styles.agentChips}>
          <span className={styles.agentChip}>design</span>
          <span className={styles.agentChip}>build</span>
          <span className={styles.agentChip}>automate</span>
        </span>
      </motion.div>

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
        style={{ left: '74%', top: '37%', width: 'min(182px, 27%)' }}
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
    </div>
  );
}
