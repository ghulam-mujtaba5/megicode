"use client";
import React, { useRef, useEffect, useMemo } from "react";
import { useTheme } from "../../context/ThemeContext";
import styles from './PlexusCanvas.module.css';

interface PlexusCanvasProps {
  maxNodes?: number;
  maxDistance?: number;
  speed?: number;
}

function hexToRgba(hex: string, alpha: number) {
  const c = hex.replace('#','');
  const bigint = parseInt(c, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function PlexusCanvas({
  maxNodes = 200, // Max density
  maxDistance = 100, // Finely tuned distance
  speed = 2, // User preferred speed
}: PlexusCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const { theme } = useTheme();

  const colors = useMemo(() => {
    const brandPrimary = "#4573df";
    const brandAccentWeak = "#667eea";
    if (theme === "dark") {
      return {
        node: brandAccentWeak,
        line: brandPrimary,
        nodeAlpha: 1.0, // Max visibility
        lineAlpha: 0.8, // Max visibility
      };
    }
    return {
      node: brandPrimary,
      line: brandPrimary,
      nodeAlpha: 1.0, // Max visibility
      lineAlpha: 0.9, // Max visibility
    };
  }, [theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0, h = 0;
    const fov = 350; // Max field of view
    const mouse = { x: w / 2, y: h / 2, active: false };
    const mouseRadius = 150; // Max force field

    type Node = { x: number; y: number; z: number; vx: number; vy: number; vz: number; px: number; py: number; scale: number; };
    let nodes: Node[] = [];
    let running = true;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = canvas.width = rect.width;
      h = canvas.height = rect.height;
      nodes = Array.from({ length: maxNodes }, () => ({
        x: (Math.random() - 0.5) * w * 2,
        y: (Math.random() - 0.5) * h * 2,
        z: Math.random() * fov,
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed,
        vz: (Math.random() - 0.5) * speed * 3, // Warp speed effect
        px: 0, py: 0, scale: 0,
      }));
    };

    const project = (node: Node) => {
      node.scale = fov / (fov + node.z);
      node.px = node.x * node.scale + w / 2;
      node.py = node.y * node.scale + h / 2;
    };

    const step = () => {
      if (!running) return;

      ctx.clearRect(0, 0, w, h);

      for (const n of nodes) {
        // Mouse force field
        if (mouse.active) {
            const dx = n.px - mouse.x;
            const dy = n.py - mouse.y;
            const dist = Math.hypot(dx, dy);
            if (dist < mouseRadius) {
                const force = (mouseRadius - dist) / mouseRadius;
                n.vx += dx * force * 0.1;
                n.vy += dy * force * 0.1;
            }
        }

        // Update position
        n.x += n.vx; n.y += n.vy; n.z += n.vz;
        n.vx *= 0.97; n.vy *= 0.97; // Damping

        // Boundary checks (warp effect)
        if (n.z < -fov) n.z = fov;
        else if (n.z > fov) n.z = -fov;

        project(n);
      }

      nodes.sort((a, b) => b.z - a.z);

      // Draw lines and nodes
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const d = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y, nodes[i].z - nodes[j].z);
          if (d < maxDistance) {
            const a = Math.max(0, 1 - d / maxDistance) * colors.lineAlpha * Math.min(nodes[i].scale, nodes[j].scale);
            ctx.strokeStyle = hexToRgba(colors.line, a);
            ctx.lineWidth = 2 * Math.min(nodes[i].scale, nodes[j].scale);
            ctx.beginPath();
            ctx.moveTo(nodes[i].px, nodes[i].py);
            ctx.lineTo(nodes[j].px, nodes[j].py);
            ctx.stroke();
          }
        }
      }
      
      ctx.fillStyle = hexToRgba(colors.node, colors.nodeAlpha);
      for (const n of nodes) {
        if(n.px < 0 || n.px > w || n.py < 0 || n.py > h) continue;
        ctx.beginPath();
        ctx.arc(n.px, n.py, 2.5 * n.scale, 0, Math.PI * 2); // Max size nodes
        ctx.fill();
      }

      animationRef.current = requestAnimationFrame(step);
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };

    const onMouseOut = () => { mouse.active = false; };

    const onVisibilityChange = () => {
      running = !document.hidden;
      if (running) animationRef.current = requestAnimationFrame(step);
    };

    resize();
    step();

    window.addEventListener("resize", resize);
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseout", onMouseOut);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      running = false;
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseout", onMouseOut);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [colors, maxNodes, maxDistance, speed]);

  return <canvas ref={canvasRef} className={styles.plexusCanvas} />;
}
