import React from 'react';

interface IconProps {
  size?: number;
  color?: string;
  className?: string;
}

// InnovationIcon — lightbulb with filament cross + ambient sparkles
export const InnovationIcon = ({ size = 24, color = '#4573df', className = '' }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    className={className}
    aria-hidden="true"
  >
    <circle cx="16" cy="16" r="15" fill={color} fillOpacity="0.07" />
    {/* Dome */}
    <circle
      cx="16"
      cy="12"
      r="8"
      fill={color}
      fillOpacity="0.14"
      stroke={color}
      strokeWidth="1.6"
    />
    {/* Neck arch */}
    <path
      d="M12.5 19.5 Q12.5 22.5 16 22.5 Q19.5 22.5 19.5 19.5"
      fill={color}
      fillOpacity="0.1"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    {/* Base stripes */}
    <line
      x1="13.5"
      y1="23.5"
      x2="18.5"
      y2="23.5"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <line
      x1="14.5"
      y1="25.5"
      x2="17.5"
      y2="25.5"
      stroke={color}
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeOpacity={0.55}
    />
    {/* Filament cross inside dome */}
    <line
      x1="16"
      y1="7.5"
      x2="16"
      y2="13.5"
      stroke={color}
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeOpacity={0.7}
    />
    <line
      x1="12.5"
      y1="10.5"
      x2="19.5"
      y2="10.5"
      stroke={color}
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeOpacity={0.6}
    />
    {/* Ambient sparkles */}
    <circle cx="7.5" cy="9" r="1.2" fill={color} fillOpacity="0.4" />
    <circle cx="24.5" cy="9" r="1.2" fill={color} fillOpacity="0.4" />
    <circle cx="7" cy="15" r="0.7" fill={color} fillOpacity="0.25" />
    <circle cx="25" cy="15" r="0.7" fill={color} fillOpacity="0.25" />
  </svg>
);

// ExcellenceIcon — 5-point star with shine and center dot
export const ExcellenceIcon = ({ size = 24, color = '#4573df', className = '' }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    className={className}
    aria-hidden="true"
  >
    <circle cx="16" cy="16" r="15" fill={color} fillOpacity="0.07" />
    {/* 5-point star: outer r=9.5, inner r=3.8, center (16,15) */}
    <polygon
      points="16,5.5 18.5,11.7 25.5,12.1 20.4,16.8 22.1,23.5 16,20 9.9,23.5 11.6,16.8 6.5,12.1 13.5,11.7"
      fill={color}
      fillOpacity="0.15"
      stroke={color}
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    {/* Center glow dot */}
    <circle cx="16" cy="16" r="2.4" fill={color} fillOpacity="0.65" />
    {/* Shine accent top-left of star */}
    <ellipse
      cx="13.8"
      cy="9"
      rx="1.6"
      ry="0.7"
      fill={color}
      fillOpacity="0.28"
      transform="rotate(-30 13.8 9)"
    />
    {/* Corner sparkles */}
    <circle cx="8" cy="8.5" r="0.9" fill={color} fillOpacity="0.35" />
    <circle cx="24" cy="8.5" r="0.9" fill={color} fillOpacity="0.35" />
  </svg>
);

// TeamworkIcon — three people nodes, center is prominent
export const TeamworkIcon = ({ size = 24, color = '#4573df', className = '' }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    className={className}
    aria-hidden="true"
  >
    <circle cx="16" cy="16" r="15" fill={color} fillOpacity="0.07" />
    {/* Left person */}
    <circle
      cx="7.5"
      cy="11"
      r="3.5"
      fill={color}
      fillOpacity="0.18"
      stroke={color}
      strokeWidth="1.5"
    />
    <path
      d="M3 26 Q3.5 20 7.5 20 Q11.5 20 12 26"
      fill={color}
      fillOpacity="0.08"
      stroke={color}
      strokeWidth="1.4"
      strokeLinecap="round"
    />
    {/* Right person */}
    <circle
      cx="24.5"
      cy="11"
      r="3.5"
      fill={color}
      fillOpacity="0.18"
      stroke={color}
      strokeWidth="1.5"
    />
    <path
      d="M20 26 Q20.5 20 24.5 20 Q28.5 20 29 26"
      fill={color}
      fillOpacity="0.08"
      stroke={color}
      strokeWidth="1.4"
      strokeLinecap="round"
    />
    {/* Center person — larger, prominent */}
    <circle
      cx="16"
      cy="9"
      r="4.5"
      fill={color}
      fillOpacity="0.22"
      stroke={color}
      strokeWidth="1.7"
    />
    <path
      d="M10.5 26 Q11 18.5 16 18.5 Q21 18.5 21.5 26"
      fill={color}
      fillOpacity="0.12"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    {/* Connection arcs */}
    <path
      d="M10.5 10.5 Q13 8 16 9"
      stroke={color}
      strokeWidth="1.1"
      strokeDasharray="2 2"
      strokeOpacity="0.55"
      strokeLinecap="round"
    />
    <path
      d="M21.5 10.5 Q19 8 16 9"
      stroke={color}
      strokeWidth="1.1"
      strokeDasharray="2 2"
      strokeOpacity="0.55"
      strokeLinecap="round"
    />
  </svg>
);

// GrowthIcon — ascending bars with trend arrow
export const GrowthIcon = ({ size = 24, color = '#4573df', className = '' }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    className={className}
    aria-hidden="true"
  >
    <circle cx="16" cy="16" r="15" fill={color} fillOpacity="0.07" />
    {/* Baseline axis */}
    <line
      x1="5"
      y1="26.5"
      x2="27"
      y2="26.5"
      stroke={color}
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeOpacity="0.38"
    />
    {/* Bar 1 — short */}
    <rect
      x="5.5"
      y="20"
      width="5"
      height="6.5"
      rx="1.5"
      fill={color}
      fillOpacity="0.17"
      stroke={color}
      strokeWidth="1.4"
    />
    {/* Bar 2 — medium */}
    <rect
      x="13.5"
      y="14"
      width="5"
      height="12.5"
      rx="1.5"
      fill={color}
      fillOpacity="0.24"
      stroke={color}
      strokeWidth="1.5"
    />
    {/* Bar 3 — tall */}
    <rect
      x="21.5"
      y="7"
      width="5"
      height="19.5"
      rx="1.5"
      fill={color}
      fillOpacity="0.32"
      stroke={color}
      strokeWidth="1.6"
    />
    {/* Trend arrow */}
    <path
      d="M8 21 L23 8"
      stroke={color}
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeOpacity="0.8"
    />
    {/* Arrow head */}
    <path
      d="M21.5 5.5 L25.5 9 L21.5 9.5"
      fill="none"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// ClientFocusIcon — heart containing a person silhouette
export const ClientFocusIcon = ({ size = 24, color = '#4573df', className = '' }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    className={className}
    aria-hidden="true"
  >
    <circle cx="16" cy="16" r="15" fill={color} fillOpacity="0.07" />
    {/* Heart */}
    <path
      d="M16 27 C16 27 4 20 4 12.5 C4 8.5 7 6 10.5 6 C12.8 6 14.8 7.5 16 9.5 C17.2 7.5 19.2 6 21.5 6 C25 6 28 8.5 28 12.5 C28 20 16 27 16 27 Z"
      fill={color}
      fillOpacity="0.14"
      stroke={color}
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    {/* Person head */}
    <circle cx="16" cy="13.5" r="3.2" fill={color} fillOpacity="0.5" />
    {/* Person body */}
    <path
      d="M11 22.5 Q11.5 18.5 16 18.5 Q20.5 18.5 21 22.5"
      fill={color}
      fillOpacity="0.3"
      stroke={color}
      strokeWidth="1.4"
      strokeLinecap="round"
    />
    {/* Heart shine */}
    <ellipse
      cx="10.5"
      cy="12"
      rx="2"
      ry="1"
      fill={color}
      fillOpacity="0.22"
      transform="rotate(-30 10.5 12)"
    />
  </svg>
);

// IntegrityIcon — shield with checkmark and sparkle
export const IntegrityIcon = ({ size = 24, color = '#4573df', className = '' }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    className={className}
    aria-hidden="true"
  >
    <circle cx="16" cy="16" r="15" fill={color} fillOpacity="0.07" />
    {/* Shield body */}
    <path
      d="M16 3 L27 7.5 L27 16.5 Q27 23 16 29 Q5 23 5 16.5 L5 7.5 Z"
      fill={color}
      fillOpacity="0.14"
      stroke={color}
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    {/* Inner shield accent line */}
    <path
      d="M16 5.5 L25 9.5 L25 16.5 Q25 21.5 16 26.5"
      fill="none"
      stroke={color}
      strokeWidth="0.8"
      strokeOpacity="0.2"
      strokeLinejoin="round"
    />
    {/* Checkmark */}
    <path
      d="M10.5 16.5 L14.5 20.5 L22 13"
      stroke={color}
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Top-right sparkle */}
    <circle cx="22.5" cy="8.5" r="0.9" fill={color} fillOpacity="0.45" />
    <circle cx="25" cy="12.5" r="0.6" fill={color} fillOpacity="0.3" />
  </svg>
);

// StatIcon, ProjectIcon, ClientIcon — kept for internal dashboard use
export const StatIcon = ({ size = 24, color = 'currentColor', className = '' }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    className={className}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.29 7 12 12 20.71 7" />
    <line x1="12" y1="22" x2="12" y2="12" />
  </svg>
);

export const ProjectIcon = ({ size = 24, color = 'currentColor', className = '' }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    className={className}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 17 12 22 22 17" />
    <polyline points="2 12 12 17 22 12" />
  </svg>
);

export const ClientIcon = ({ size = 24, color = 'currentColor', className = '' }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    className={className}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <circle cx="19" cy="11" r="2" />
    <path d="M19 17v-2" />
  </svg>
);
