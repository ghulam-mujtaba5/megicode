import React, { useEffect, useState } from "react";

const PARTICLE_COUNT = 50;
const PARTICLE_AREA_HEIGHT = 1200; // px, increased to ensure better coverage

interface Particle {
  x: number;
  y: number;
  speed: number;
  radius: number;
  opacity: number;
}

const ParticleBackground: React.FC = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const width = window.innerWidth;
    setParticles(
      Array.from({ length: PARTICLE_COUNT }, () => ({
        x: Math.random() * width,
        y: Math.random() * PARTICLE_AREA_HEIGHT,
        speed: 0.5 + Math.random() * 1.5,
        radius: 1.5 + Math.random() * 2.5,
        opacity: 0.25 + Math.random() * 0.4,
      }))
    );
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setParticles((prev) => {
        const width = window.innerWidth;
        return prev.map((p) => ({
          ...p,
          y: (p.y + p.speed) % PARTICLE_AREA_HEIGHT,
          x: (p.x + Math.sin(p.y / 80) * 0.5 + width) % width,
        }));
      });
    }, 60);
    return () => clearInterval(interval);
  }, []);

  return (
    <svg
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: PARTICLE_AREA_HEIGHT + "px",
        pointerEvents: "none",
        zIndex: 0,
        opacity: 0.8,
      }}
    >
      {particles.map((particle, i) => (
        <circle
          key={i}
          cx={particle.x}
          cy={particle.y}
          r={particle.radius}
          fill="#4573df"
          opacity={particle.opacity}
        />
      ))}
    </svg>
  );
};

export default ParticleBackground;
