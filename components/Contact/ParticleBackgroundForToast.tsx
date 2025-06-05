// ParticleBackgroundForToast.tsx
"use client";
import React, { useEffect, useRef } from "react";

const PARTICLE_COUNT = 18;
const colors = ["#fff", "#e3e8f7", "#b3c6f7", "#4573df"];

function random(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

const ParticleBackgroundForToast: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const particles = ref.current?.querySelectorAll<HTMLElement>(".particle");
    if (!particles) return;
    particles.forEach((particle, i) => {
      const duration = random(2.5, 4.5);
      const delay = random(0, 2);
      particle.style.animationDuration = `${duration}s`;
      particle.style.animationDelay = `${delay}s`;
    });
  }, []);

  return (
    <div className="toastParticles" ref={ref} aria-hidden>
      {Array.from({ length: PARTICLE_COUNT }).map((_, i) => (
        <span
          key={i}
          className="particle"
          style={{
            left: `${random(5, 95)}%`,
            top: `${random(10, 90)}%`,
            background: colors[i % colors.length],
            opacity: random(0.12, 0.22),
            width: `${random(6, 14)}px`,
            height: `${random(6, 14)}px`,
            borderRadius: "50%",
            position: "absolute",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
      ))}
    </div>
  );
};

export default ParticleBackgroundForToast;
