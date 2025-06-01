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
    const height = window.innerHeight;
    setParticles(
      Array.from({ length: PARTICLE_COUNT }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        speed: 0.3 + Math.random() * 0.8,
        radius: 1.2 + Math.random() * 1.8,
        opacity: 0.2 + Math.random() * 0.3,
      }))
    );
  }, []);
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setParticles(prev => 
        prev.map(p => ({
          ...p,
          x: p.x % width,
          y: p.y % height,
        }))
      );
    };

    window.addEventListener('resize', handleResize);
    
    const interval = setInterval(() => {
      setParticles((prev) => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        return prev.map((p) => ({
          ...p,
          y: (p.y + p.speed) % height,
          x: (p.x + Math.sin(p.y / 80) * 0.3) % width,
        }));
      });
    }, 60);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  return (
    <div style={{
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100vh",
      overflow: "hidden",
      pointerEvents: "none",
      zIndex: 0,
    }}>
      <svg
        style={{
          width: "100%",
          height: "100%",
          opacity: 0.8,
        }}
        viewBox={`0 0 ${window.innerWidth} ${window.innerHeight}`}
        preserveAspectRatio="xMidYMid slice"
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
    </div>
  );
};

export default ParticleBackground;
