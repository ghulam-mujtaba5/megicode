'use client';
import React, { CSSProperties, useEffect, useRef, useState } from 'react';

import Lottie, { LottieRefCurrentProps } from 'lottie-react';

interface LottiePlayerProps {
  /** Path relative to /public, e.g. "/lottie/contact-email.json" */
  src: string;
  loop?: boolean;
  autoplay?: boolean;
  /** Pause when out of viewport (saves CPU). Default: true */
  pauseWhenHidden?: boolean;
  style?: CSSProperties;
  className?: string;
  /** aria-label for assistive tech; defaults to hidden decorative */
  ariaLabel?: string;
  speed?: number;
}

/** Catches any synchronous errors lottie-web throws during setup/layout effects. */
class LottieErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { crashed: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { crashed: false };
  }
  static getDerivedStateFromError() {
    return { crashed: true };
  }
  render() {
    return this.state.crashed ? null : this.props.children;
  }
}

const LottiePlayer: React.FC<LottiePlayerProps> = ({
  src,
  loop = true,
  autoplay = true,
  pauseWhenHidden = true,
  style,
  className,
  ariaLabel,
  speed = 1,
}) => {
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [animationData, setAnimationData] = useState<object | null>(null);
  const [error, setError] = useState(false);

  // Fetch animation JSON client-side
  useEffect(() => {
    let cancelled = false;
    fetch(src)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (!cancelled) {
          setError(false);
          setAnimationData(data);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setAnimationData(null);
          setError(true);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [src]);

  // Adjust playback speed
  useEffect(() => {
    if (lottieRef.current && speed !== 1) {
      lottieRef.current.setSpeed(speed);
    }
  }, [speed, animationData]);

  // Pause when out of viewport to save resources
  useEffect(() => {
    if (!pauseWhenHidden || !containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!lottieRef.current) return;
        if (entry.isIntersecting) {
          lottieRef.current.play();
        } else {
          lottieRef.current.pause();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [pauseWhenHidden, animationData]);

  if (error || !animationData) return null;

  return (
    <LottieErrorBoundary>
      <div
        ref={containerRef}
        className={className}
        style={style}
        aria-hidden={ariaLabel ? undefined : 'true'}
        aria-label={ariaLabel}
        role={ariaLabel ? 'img' : undefined}
      >
        <Lottie
          lottieRef={lottieRef}
          animationData={animationData}
          loop={loop}
          autoplay={autoplay}
          style={{ width: '100%', height: '100%' }}
        />
      </div>
    </LottieErrorBoundary>
  );
};

export default LottiePlayer;
