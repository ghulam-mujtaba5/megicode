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
  maxNodes = 80,
  maxDistance = 120,
  speed = 0.2,
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
        mouseLine: brandAccentWeak,
        nodeAlpha: 0.9,
        lineAlpha: 0.4, // Increased for visibility
        mouseLineAlpha: 0.6, // Increased for visibility
      };
    }
    return {
      node: brandPrimary,
      line: brandPrimary,
      mouseLine: brandPrimary,
      nodeAlpha: 0.9,
      lineAlpha: 0.5, // Increased for visibility
      mouseLineAlpha: 0.7, // Increased for visibility
    };
  }, [theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const pr = 1;
    let w = 0;
    let h = 0;
    type Node = { x: number; y: number; vx: number; vy: number; radius: number };
    let nodes: Node[] = [];
    let running = true;
    const mouse = { x: -9999, y: -9999 };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = Math.max(1, Math.floor(rect.width));
      h = Math.max(1, Math.floor(rect.height));
      canvas.width = w * pr;
      canvas.height = h * pr;
      ctx.setTransform(pr, 0, 0, pr, 0, 0);

      const area = w * h;
      const heuristic = Math.floor(area / 20000); // Denser nodes
      const targetCount = Math.max(20, Math.min(maxNodes, heuristic));
      nodes = Array.from({ length: targetCount }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed,
        radius: Math.random() * 1.5 + 1, // Larger, more variable radius
      }));
    };

    const step = () => {
      if (!running) return;

      ctx.clearRect(0, 0, w, h);

      // Update & Draw Nodes
      ctx.fillStyle = hexToRgba(colors.node, colors.nodeAlpha);
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw Lines
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const d = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
          if (d < maxDistance) {
            const a = Math.max(0, 1 - d / maxDistance) * colors.lineAlpha;
            ctx.strokeStyle = hexToRgba(colors.line, a);
            ctx.lineWidth = 1.5; // Thicker lines
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
        // Mouse interaction lines
        const dMouse = Math.hypot(nodes[i].x - mouse.x, nodes[i].y - mouse.y);
        if (dMouse < maxDistance * 1.5) {
            const a = Math.max(0, 1 - dMouse / (maxDistance * 1.5)) * colors.mouseLineAlpha;
            ctx.strokeStyle = hexToRgba(colors.mouseLine, a);
            ctx.lineWidth = 2; // Thicker mouse lines
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
        }
      }

      animationRef.current = requestAnimationFrame(step);
    };

    const onMouseMove = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    };

    const onMouseOut = () => {
        mouse.x = -9999;
        mouse.y = -9999;
    };

    const onVisibilityChange = () => {
      running = !document.hidden;
      if (running) {
        animationRef.current = requestAnimationFrame(step);
      }
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
