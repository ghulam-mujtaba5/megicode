"use client";
import React, { useRef, useEffect, useState, CSSProperties } from "react";
import Lottie, { LottieRefCurrentProps } from "lottie-react";

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

/**
 * SSR-safe Lottie animation player that:
 * - Lazy-loads animation JSON on the client only
 * - Pauses when scrolled out of view (IntersectionObserver)
 * - Falls back gracefully on network / parse errors
 */
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
    setAnimationData(null);
    setError(false);
    fetch(src)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (!cancelled) setAnimationData(data);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });
    return () => { cancelled = true; };
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

  if (error || (!animationData && typeof window !== "undefined")) {
    // Render nothing on error – the surrounding layout still shows
    return null;
  }

  if (!animationData) return null;

  return (
    <div
      ref={containerRef}
      className={className}
      style={style}
      aria-hidden={ariaLabel ? undefined : "true"}
      aria-label={ariaLabel}
      role={ariaLabel ? "img" : undefined}
    >
      <Lottie
        lottieRef={lottieRef}
        animationData={animationData}
        loop={loop}
        autoplay={autoplay}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
};

export default LottiePlayer;
