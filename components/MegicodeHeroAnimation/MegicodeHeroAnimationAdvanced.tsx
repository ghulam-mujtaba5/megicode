import React, { useRef, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import styles from './MegicodeHeroAnimation.module.css';

/**
 * Advanced, interactive, and complex Megicode hero SVG animation.
 * - Nodes and lines react to hover/click
 * - Parallax and floating elements
 * - Animated grid, sparkles, and data streams
 */
const NODES = [
  { id: 'n1', cx: 180, cy: 80 },
  { id: 'n2', cx: 240, cy: 240 },
  { id: 'n3', cx: 300, cy: 80 },
  { id: 'n4', cx: 400, cy: 60 },
  { id: 'n5', cx: 420, cy: 120 },
  { id: 'n6', cx: 390, cy: 200 },
];

const MegicodeHeroAnimationAdvanced: React.FC = () => {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [clickedNode, setClickedNode] = useState<string | null>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  // Parallax effect on mouse move
  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (rect) {
      setMouse({
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      });
    }
  };

  // Node interactivity
  const handleNodeEnter = (id: string) => setHoveredNode(id);
  const handleNodeLeave = () => setHoveredNode(null);
  const handleNodeClick = (id: string) => setClickedNode(clickedNode === id ? null : id);

  // Parallax transform helper
  const parallax = (base: number, factor: number) => base + (mouse.x - 0.5) * factor;

  return (
    <div className={styles['megicode-hero-illustration']} style={{ position: 'absolute' }}>
      <svg
        ref={svgRef}
        viewBox="0 0 480 320"
        width="100%"
        height="100%"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block', width: '100%', height: '100%', cursor: 'pointer' }}
        onMouseMove={handleMouseMove}
        tabIndex={0}
        aria-label="Megicode advanced animated digital illustration"
        role="img"
      >
        {/* Animated background grid */}
        <motion.g
          initial={{ opacity: 0.08 }}
          animate={{ opacity: 0.13 + 0.05 * mouse.x }}
          transition={{ duration: 0.5 }}
        >
          <rect x={parallax(60, 10)} y={parallax(40, 10)} width="320" height="240" fill="none" stroke="#4573df" strokeWidth="1" />
          <rect x={parallax(100, 8)} y={parallax(80, 8)} width="240" height="160" fill="none" stroke="#4573df" strokeWidth="1" />
          <rect x={parallax(140, 6)} y={parallax(120, 6)} width="160" height="80" fill="none" stroke="#4573df" strokeWidth="1" />
        </motion.g>
        {/* Glow ellipse */}
        <ellipse cx={parallax(350, 20)} cy={parallax(160, 10)} rx="110" ry="120" fill="url(#blueGrad)" opacity="0.18" />
        <defs>
          <linearGradient id="blueGrad" x1="0" y1="0" x2="480" y2="320" gradientUnits="userSpaceOnUse">
            <stop stopColor="#4573df" />
            <stop offset="1" stopColor="#2d4fa2" />
          </linearGradient>
        </defs>
        {/* Animated M Path */}
        <motion.path
          d="M120 240 L180 80 L240 240 L300 80 L360 240"
          stroke="url(#blueGrad)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2.5, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
          filter={hoveredNode ? 'url(#glow)' : undefined}
        />
        {/* Data Streams */}
        <motion.polyline
          points="180,80 200,40 240,80"
          stroke="#4573df"
          strokeWidth="3"
          fill="none"
          opacity="0.7"
          animate={{ points: hoveredNode === 'n1' ? '180,90 200,30 240,90' : '180,80 200,40 240,80' }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
        />
        <motion.polyline
          points="300,80 320,40 360,80"
          stroke="#4573df"
          strokeWidth="3"
          fill="none"
          opacity="0.7"
          animate={{ points: hoveredNode === 'n3' ? '300,90 320,30 360,90' : '300,80 320,40 360,80' }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
        />
        {/* Interactive Nodes */}
        {NODES.map(node => (
          <motion.circle
            key={node.id}
            cx={parallax(node.cx, hoveredNode === node.id ? 8 : 4)}
            cy={parallax(node.cy, hoveredNode === node.id ? 8 : 4)}
            r={clickedNode === node.id ? 16 : hoveredNode === node.id ? 12 : 8}
            fill={hoveredNode === node.id || clickedNode === node.id ? 'url(#blueGrad)' : '#2d4fa2'}
            style={{ cursor: 'pointer' }}
            initial={{ opacity: 0.8 }}
            animate={{ opacity: hoveredNode === node.id ? 1 : 0.8, filter: clickedNode === node.id ? 'drop-shadow(0 0 24px #4573df)' : 'none' }}
            transition={{ duration: 0.2 }}
            onMouseEnter={() => handleNodeEnter(node.id)}
            onMouseLeave={handleNodeLeave}
            onClick={() => handleNodeClick(node.id)}
          />
        ))}
        {/* Sparkles */}
        {[...Array(8)].map((_, i) => (
          <motion.circle
            key={i}
            cx={parallax(120 + i * 40, 10 - i * 2)}
            cy={parallax(60 + (i % 2) * 120, 8 - i)}
            r={Math.random() * 1.5 + 1}
            fill="#fff"
            opacity={0.18 + 0.1 * (i % 2)}
            animate={{ cy: [parallax(60 + (i % 2) * 120, 8 - i), parallax(80 + (i % 2) * 120, 8 - i), parallax(60 + (i % 2) * 120, 8 - i)] }}
            transition={{ duration: 2 + i * 0.2, repeat: Infinity }}
          />
        ))}
        {/* Tooltip for node */}
        {hoveredNode && (
          <motion.text
            x={NODES.find(n => n.id === hoveredNode)?.cx ?? 0}
            y={(NODES.find(n => n.id === hoveredNode)?.cy ?? 0) - 24}
            textAnchor="middle"
            fontSize="16"
            fill="#fff"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            style={{ pointerEvents: 'none', userSelect: 'none' }}
          >
            {hoveredNode === 'n1' && 'AI Node'}
            {hoveredNode === 'n2' && 'Data Hub'}
            {hoveredNode === 'n3' && 'Cloud'}
            {hoveredNode === 'n4' && 'Analytics'}
            {hoveredNode === 'n5' && 'Security'}
            {hoveredNode === 'n6' && 'IoT'}
          </motion.text>
        )}
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
