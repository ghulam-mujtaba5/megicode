import React from 'react';
import styles from './MegicodeHeroAnimation.module.css';

/**
 * Interactive, responsive animated SVG for Megicode hero section.
 * Handles hover, click, and keyboard interactivity for accessibility.
 */
const MegicodeHeroAnimation: React.FC = () => {
  // Interactivity handlers for SVG (using ref for direct DOM access)
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Add/remove classes for interactivity
  const handleMouseEnter = () => {
    const svg = containerRef.current?.querySelector('svg');
    if (svg) svg.classList.add('svg-hovered');
  };
  const handleMouseLeave = () => {
    const svg = containerRef.current?.querySelector('svg');
    if (svg) svg.classList.remove('svg-hovered');
  };
  const handleClick = () => {
    const svg = containerRef.current?.querySelector('svg');
    if (svg) svg.classList.toggle('svg-clicked');
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      const svg = containerRef.current?.querySelector('svg');
      if (svg) svg.classList.toggle('svg-clicked');
    }
  };

  return (
    <div
      ref={containerRef}
      className={styles['megicode-hero-illustration']}
      tabIndex={0}
      aria-label="Megicode animated digital illustration"
      role="img"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      {/* Inline SVG for interactivity (injected via object for animation support) */}
      <object
        type="image/svg+xml"
        data="/megicode-hero-animated.svg"
        aria-label="Megicode animated digital illustration"
        tabIndex={-1}
        style={{ width: '100%', height: '100%', pointerEvents: 'auto' }}
      >
        {/* Fallback for browsers that don't support object */}
        <img src="/megicode-hero-animated.svg" alt="Megicode animated digital illustration" style={{ width: '100%', height: '100%' }} />
      </object>
    </div>
  );
};

export default MegicodeHeroAnimation;
