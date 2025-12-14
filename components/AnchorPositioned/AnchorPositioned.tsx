"use client";

import React, { ReactNode, useRef, useId, useEffect, useState } from 'react';

interface AnchorPositionedProps {
  children: ReactNode;
  anchor: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end';
  offset?: number;
  className?: string;
  anchorClassName?: string;
  contentClassName?: string;
  fallbackPosition?: 'top' | 'bottom' | 'left' | 'right';
}

/**
 * CSS Anchor Positioning component with fallback for unsupported browsers
 * Uses the new CSS Anchor Positioning API where available
 */
export const AnchorPositioned: React.FC<AnchorPositionedProps> = ({
  children,
  anchor,
  position = 'bottom',
  offset = 8,
  className = '',
  anchorClassName = '',
  contentClassName = '',
  fallbackPosition,
}) => {
  const anchorRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const anchorId = useId();
  const anchorName = `--anchor-${anchorId.replace(/:/g, '')}`;
  
  const [supportsAnchor, setSupportsAnchor] = useState(false);
  const [fallbackStyles, setFallbackStyles] = useState<React.CSSProperties>({});

  useEffect(() => {
    // Check if CSS Anchor Positioning is supported
    const supported = CSS.supports('anchor-name', '--test');
    setSupportsAnchor(supported);
  }, []);

  useEffect(() => {
    if (supportsAnchor || !anchorRef.current || !contentRef.current) return;

    // Fallback positioning using JavaScript
    const updatePosition = () => {
      const anchorRect = anchorRef.current?.getBoundingClientRect();
      const contentRect = contentRef.current?.getBoundingClientRect();
      
      if (!anchorRect || !contentRect) return;

      const pos = fallbackPosition || position;
      let styles: React.CSSProperties = {};

      switch (pos) {
        case 'top':
        case 'top-start':
        case 'top-end':
          styles = {
            position: 'absolute',
            bottom: `calc(100% + ${offset}px)`,
            left: pos === 'top-end' ? 'auto' : 0,
            right: pos === 'top-end' ? 0 : 'auto',
            transform: pos === 'top' ? 'translateX(-50%)' : 'none',
          };
          if (pos === 'top') {
            styles.left = '50%';
          }
          break;
        case 'bottom':
        case 'bottom-start':
        case 'bottom-end':
          styles = {
            position: 'absolute',
            top: `calc(100% + ${offset}px)`,
            left: pos === 'bottom-end' ? 'auto' : 0,
            right: pos === 'bottom-end' ? 0 : 'auto',
            transform: pos === 'bottom' ? 'translateX(-50%)' : 'none',
          };
          if (pos === 'bottom') {
            styles.left = '50%';
          }
          break;
        case 'left':
          styles = {
            position: 'absolute',
            right: `calc(100% + ${offset}px)`,
            top: '50%',
            transform: 'translateY(-50%)',
          };
          break;
        case 'right':
          styles = {
            position: 'absolute',
            left: `calc(100% + ${offset}px)`,
            top: '50%',
            transform: 'translateY(-50%)',
          };
          break;
      }

      setFallbackStyles(styles);
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [supportsAnchor, position, offset, fallbackPosition]);

  const getAnchorStyles = (): React.CSSProperties => {
    if (!supportsAnchor) return { position: 'relative' };
    return {
      anchorName: anchorName,
    } as React.CSSProperties;
  };

  const getContentStyles = (): React.CSSProperties => {
    if (!supportsAnchor) return fallbackStyles;
    
    const positionStyles: Record<string, React.CSSProperties> = {
      'top': {
        positionAnchor: anchorName,
        bottom: `anchor(top)`,
        left: `anchor(center)`,
        translate: '-50% 0',
        marginBottom: offset,
      } as React.CSSProperties,
      'bottom': {
        positionAnchor: anchorName,
        top: `anchor(bottom)`,
        left: `anchor(center)`,
        translate: '-50% 0',
        marginTop: offset,
      } as React.CSSProperties,
      'left': {
        positionAnchor: anchorName,
        right: `anchor(left)`,
        top: `anchor(center)`,
        translate: '0 -50%',
        marginRight: offset,
      } as React.CSSProperties,
      'right': {
        positionAnchor: anchorName,
        left: `anchor(right)`,
        top: `anchor(center)`,
        translate: '0 -50%',
        marginLeft: offset,
      } as React.CSSProperties,
      'top-start': {
        positionAnchor: anchorName,
        bottom: `anchor(top)`,
        left: `anchor(left)`,
        marginBottom: offset,
      } as React.CSSProperties,
      'top-end': {
        positionAnchor: anchorName,
        bottom: `anchor(top)`,
        right: `anchor(right)`,
        marginBottom: offset,
      } as React.CSSProperties,
      'bottom-start': {
        positionAnchor: anchorName,
        top: `anchor(bottom)`,
        left: `anchor(left)`,
        marginTop: offset,
      } as React.CSSProperties,
      'bottom-end': {
        positionAnchor: anchorName,
        top: `anchor(bottom)`,
        right: `anchor(right)`,
        marginTop: offset,
      } as React.CSSProperties,
    };

    return {
      position: 'absolute',
      ...positionStyles[position],
    };
  };

  return (
    <div className={`anchor-container ${className}`} style={{ position: 'relative', display: 'inline-block' }}>
      <div
        ref={anchorRef}
        className={`anchor-element ${anchorClassName}`}
        style={getAnchorStyles()}
      >
        {anchor}
      </div>
      <div
        ref={contentRef}
        className={`anchor-content ${contentClassName}`}
        style={getContentStyles()}
      >
        {children}
      </div>
    </div>
  );
};

export default AnchorPositioned;
