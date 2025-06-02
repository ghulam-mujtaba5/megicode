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
      d="M26 6H6C4.89543 6 4 6.89543 4 8V24C4 25.1046 4.89543 26 6 26H26C27.1046 26 28 25.1046 28 24V8C28 6.89543 27.1046 6 26 6Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <path
      d="M4 10H28"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle cx="7" cy="8" r="1" fill={color} />
    <circle cx="10" cy="8" r="1" fill={color} />
    <circle cx="13" cy="8" r="1" fill={color} />
    <path
      d="M8 16H24"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M8 20H20"
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
      d="M16 4C20.1 8.5 22 12.5 22 16C22 19.5 20.1 23.5 16 28C11.9 23.5 10 19.5 10 16C10 12.5 11.9 8.5 16 4Z"
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
      d="M8 8C12 12 20 12 24 8"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M8 24C12 20 20 20 24 24"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
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
    <path
      d="M16 4C19.3137 4 22 6.68629 22 10V12H24C26.2091 12 28 13.7909 28 16C28 18.2091 26.2091 20 24 20H22V22C22 25.3137 19.3137 28 16 28C12.6863 28 10 25.3137 10 22V20H8C5.79086 20 4 18.2091 4 16C4 13.7909 5.79086 12 8 12H10V10C10 6.68629 12.6863 4 16 4Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="16" cy="16" r="2" fill={color} />
    <path
      d="M16 14V8"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M16 24V18"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M18 16H24"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M8 16H14"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
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
      d="M25.8 9.2L23.7 11.3"
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
      d="M16 16L16 16.1"
      stroke={color}
      strokeWidth="3"
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
