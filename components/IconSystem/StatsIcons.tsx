import React from 'react';

interface IconProps {
  size?: number;
  color?: string;
  className?: string;
}

export const ProjectsIcon = ({ size = 32, color = 'currentColor', className = '' }: IconProps) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 32 32" 
    fill="none" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6 8C6 6.89543 6.89543 6 8 6H24C25.1046 6 26 6.89543 26 8V24C26 25.1046 25.1046 26 24 26H8C6.89543 26 6 25.1046 6 24V8Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6 12H26"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle
      cx="9"
      cy="9"
      r="1"
      fill={color}
    />
    <circle
      cx="13"
      cy="9"
      r="1"
      fill={color}
    />
    <path
      d="M10 16H22"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M10 20H18"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export const GlobalIcon = ({ size = 32, color = 'currentColor', className = '' }: IconProps) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 32 32" 
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="16"
      cy="16"
      r="12"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16 4C19.3 7.5 21 11.5 21 16C21 20.5 19.3 24.5 16 28"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16 4C12.7 7.5 11 11.5 11 16C11 20.5 12.7 24.5 16 28"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4 16H28"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5.5 12H26.5"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5.5 20H26.5"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const AiIcon = ({ size = 32, color = 'currentColor', className = '' }: IconProps) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 32 32" 
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="16" cy="7" r="3" stroke={color} strokeWidth="2"/>
    <circle cx="7" cy="16" r="3" stroke={color} strokeWidth="2"/>
    <circle cx="25" cy="16" r="3" stroke={color} strokeWidth="2"/>
    <circle cx="16" cy="25" r="3" stroke={color} strokeWidth="2"/>
    
    <line x1="16" y1="10" x2="16" y2="13" stroke={color} strokeWidth="2"/>
    <line x1="9.5" y1="14.5" x2="13" y2="13" stroke={color} strokeWidth="2"/>
    <line x1="22.5" y1="14.5" x2="19" y2="13" stroke={color} strokeWidth="2"/>
    <line x1="9.5" y1="17.5" x2="13" y2="19" stroke={color} strokeWidth="2"/>
    <line x1="22.5" y1="17.5" x2="19" y2="19" stroke={color} strokeWidth="2"/>
    <line x1="16" y1="22" x2="16" y2="19" stroke={color} strokeWidth="2"/>
    
    <circle cx="16" cy="16" r="1.5" fill={color}/>
  </svg>
);

export const DeliveryIcon = ({ size = 32, color = 'currentColor', className = '' }: IconProps) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 32 32" 
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="16"
      cy="16"
      r="12"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16 10V16L20 18"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16 4V7"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M28 16H25"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M7 16H4"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M16 28V25"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle
      cx="16"
      cy="16"
      r="1.5"
      fill={color}
    />
  </svg>
);
