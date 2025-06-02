import React from 'react';
import { motion } from 'framer-motion';

interface IconWrapperProps {
  children: React.ReactNode;
  size?: number;
  gradient?: boolean;
  className?: string;
}

const IconWrapper = ({ 
  children, 
  size = 64,
  gradient = true,
  className = ''
}: IconWrapperProps) => {
  return (
    <motion.div
      className={`icon-wrapper ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius: '1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: gradient 
          ? 'linear-gradient(135deg, rgba(69,115,223,0.12) 0%, rgba(69,115,223,0.05) 100%)'
          : 'transparent',
        boxShadow: '0 8px 24px rgba(69,115,223,0.1)',
        border: '1px solid rgba(69,115,223,0.15)',
        transition: 'all 0.3s ease'
      }}
      whileHover={{ 
        y: -5,
        boxShadow: '0 12px 28px rgba(69,115,223,0.15)',
        background: 'linear-gradient(135deg, rgba(69,115,223,0.15) 0%, rgba(69,115,223,0.08) 100%)'
      }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.div>
  );
};

export default IconWrapper;
