"use client";

import React, { useEffect, useState, useRef } from 'react';

import { useTheme } from '../context/ThemeContext';
import { motion, Variants, easeInOut, easeOut } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import styles from '../styles/404.module.css';
import NewNavBar from '../components/NavBar_Desktop_Company/NewNavBar';
import NavBarMobile from '../components/NavBar_Mobile/NavBar-mobile';
import Footer from '../components/Footer/Footer';
import ThemeToggleIcon from '../components/Icon/sbicon';

// Animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.3,
    }
  }
};

const floatingVariants: Variants = {
  initial: { y: 0 },
  animate: {
    y: [-20, 20],
    transition: {
      duration: 4,
      repeat: Infinity,
      repeatType: "reverse",
      ease: easeInOut
    }
  }
};

const glitchVariants: Variants = {
  initial: { skewX: 0 },
  animate: {
    skewX: [0, -5, 5, 0],
    transition: {
      duration: 0.5,
      repeat: Infinity,
      repeatType: "reverse",
      ease: easeInOut,
      times: [0, 0.2, 0.8, 1]
    }
  }
};


export default function NotFound() {
  // Social/contact info (reuse from other pages)
  const linkedinUrl = "https://www.linkedin.com/company/megicode";
  const instagramUrl = "https://www.instagram.com/megicode/";
  const githubUrl = "https://github.com/megicodes";
  const copyrightText = "Copyright 2025 Megicode. All Rights Reserved.";
  const sections = [
    { id: "home-section", label: "Home" },
    { id: "about-section", label: "About" },
    { id: "services-section", label: "Services" },
    { id: "project-section", label: "Projects" },
    { id: "reviews-section", label: "Reviews" },
    { id: "contact-section", label: "Contact" },
  ];
  const { theme } = useTheme();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [touchStart, setTouchStart] = useState<{x: number, y: number} | null>(null);
  const [touchMove, setTouchMove] = useState<{x: number, y: number} | null>(null);
  const [windowSize, setWindowSize] = useState<{ width: number, height: number } | null>(null);
  const [isClient, setIsClient] = useState(false);
  const particleCount = isMobile ? 10 : 24;
  const [particles, setParticles] = useState<Array<{
    x: number;
    y: number;
    size: number;
    color: string;
    delay: number;
  }>>([]);

  useEffect(() => {
    // Only generate particles on the client to avoid hydration mismatch
    const generated = Array.from({ length: particleCount }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      color: Math.random() > 0.5 ? '#3b82f6' : '#0D47A1',
      delay: Math.random() * 2
    }));
    setParticles(generated);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [particleCount, isMobile]);

  useEffect(() => {
    setIsClient(true);
    const handleResize = () => {
      if (typeof window !== 'undefined') {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        setIsMobile(window.innerWidth < 700);
      }
    };
    handleResize();
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, []);

  useEffect(() => {
    if (!isClient) return;
    if (isMobile) {
      const handleTouchStart = (e: TouchEvent) => {
        if (e.touches.length > 0) {
          setTouchStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
        }
      };
      const handleTouchMove = (e: TouchEvent) => {
        if (e.touches.length > 0) {
          setTouchMove({ x: e.touches[0].clientX, y: e.touches[0].clientY });
        }
      };
      window.addEventListener('touchstart', handleTouchStart);
      window.addEventListener('touchmove', handleTouchMove);
      return () => {
        window.removeEventListener('touchstart', handleTouchStart);
        window.removeEventListener('touchmove', handleTouchMove);
      };
    } else {
      const handleMouseMove = (e: MouseEvent) => {
        setMousePosition({ x: e.clientX, y: e.clientY });
      };
      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, [isMobile, isClient]);

  // Calculate 3D rotation for desktop, or parallax for mobile
  let transformStyle = {};
  if (isClient && windowSize) {
    if (isMobile && touchMove && touchStart) {
      const dx = touchMove.x - touchStart.x;
      const dy = touchMove.y - touchStart.y;
      transformStyle = {
        transform: `translate3d(${dx * 0.1}px, ${dy * 0.1}px, 0)`
      };
    } else if (!isMobile) {
      transformStyle = {
        transform: `rotate3d(
          ${(mousePosition.y / windowSize.height - 0.5) * -10},
          ${(mousePosition.x / windowSize.width - 0.5) * 10},
          0,
          ${Math.min(
            Math.sqrt(
              Math.pow(mousePosition.x - windowSize.width / 2, 2) +
              Math.pow(mousePosition.y - windowSize.height / 2, 2)
            ) * 0.01,
            20
          )}deg
        )`
      };
    }
  }



  return (
    <div 
      style={{ 
        backgroundColor: theme === "dark" ? "#1d2127" : "#ffffff", 
        minHeight: "100vh", 
        overflowX: "hidden",
        perspective: "1000px"
      }}
    >
      {/* Noindex for 404 pages - prevents search engine indexing */}
      <head>
        <meta name="robots" content="noindex, nofollow" />
      </head>
      {/* Desktop NavBar - Always on Top */}
      <nav id="desktop-navbar" aria-label="Main Navigation" className={styles.desktopNavbar}>
        <NewNavBar />
      </nav>
      {/* Mobile NavBar - Always on Top */}
      <nav id="mobile-navbar" aria-label="Mobile Navigation" className={styles.mobileNavbar}>
        <NavBarMobile />
      </nav>
      {/* Theme Toggle Icon - Offset for nav height */}
      <div id="theme-toggle" role="button" tabIndex={0} style={{ position: 'absolute', top: 80, right: 32 }}>
        <ThemeToggleIcon />
      </div>

      {/* Enhanced 404 Content - add top margin for navbar height */}
      <motion.div 
        className={styles.wrapper} 
        data-theme={theme}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{...transformStyle, marginTop: `var(--navbar-height, 72px)`}}
      >
        {/* Parallax/animated background layer */}
        <div className={styles.bgParallax} aria-hidden="true">
          <svg width="100%" height="100%" viewBox="0 0 1440 320" preserveAspectRatio="none" style={{ position: 'absolute', top: 0, left: 0, zIndex: 0 }}>
            <defs>
              <linearGradient id="bg-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={theme === 'dark' ? '#232946' : '#e3f0ff'} />
                <stop offset="100%" stopColor={theme === 'dark' ? '#181c20' : '#f5f5f5'} />
              </linearGradient>
            </defs>
            <motion.path
              d="M0,160L60,170C120,180,240,200,360,192C480,184,600,136,720,128C840,120,960,152,1080,170.7C1200,189,1320,203,1380,210.7L1440,218L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
              fill="url(#bg-gradient)"
              initial={{ y: 0 }}
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: easeInOut }}
              style={{ opacity: 0.7 }}
            />
          </svg>
        </div>

        {/* Particle Effects */}
        <div className={styles.particleContainer}>
          {particles.length > 0 && particles.map((particle, i) => {
            // Generate a deterministic offset for animation per particle (client only)
            const xTarget = particle.x + ((i % 2 === 0 ? 1 : -1) * ((i * 13) % 20 - 10));
            const yTarget = particle.y + ((i % 2 === 1 ? 1 : -1) * ((i * 17) % 20 - 10));
            return (
              <motion.div
                key={i}
                className={styles.particle}
                initial={{ x: particle.x + "%", y: particle.y + "%", scale: 0 }}
                animate={{
                  x: [particle.x + "%", xTarget + "%"],
                  y: [particle.y + "%", yTarget + "%"],
                  scale: [0, particle.size, 0]
                }}
                transition={{
                  duration: 3 + particle.delay,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut",
                  delay: particle.delay
                }}
                style={{
                  backgroundColor: theme === "dark" ? particle.color : (particle.color === '#3b82f6' ? '#0D47A1' : '#3b82f6'),
                  width: isMobile ? '3px' : '5px',
                  height: isMobile ? '3px' : '5px',
                  borderRadius: "50%",
                  position: "absolute"
                }}
              />
            );
          })}
        </div>

        {/* Glitch Effect Text with SVG "broken" overlay */}
        <motion.div
          variants={glitchVariants}
          initial="initial"
          animate="animate"
          className={styles.glitchContainer}
        >
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={styles.glitchText}
            style={{ position: 'relative', zIndex: 2 }}
          >
            404
            {/* SVG "crack" overlay for psychological effect */}
            <svg width="100%" height="100%" viewBox="0 0 320 120" style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>
              <motion.path
                d="M40,60 Q80,80 120,60 Q160,40 200,60 Q240,80 280,60"
                stroke={theme === 'dark' ? '#60a5fa' : '#1565c0'}
                strokeWidth="4"
                fill="none"
                initial={{ pathLength: 0, opacity: 0.7 }}
                animate={{ pathLength: [0, 1, 0.7, 1], opacity: [0.7, 1, 0.7, 1] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: easeInOut }}
              />
            </svg>
          </motion.h1>
        </motion.div>

        {/* Floating Message with motivational text */}
        <motion.div
          variants={floatingVariants}
          initial="initial"
          animate="animate"
          className={styles.messageContainer}
        >
          <h2>Page Not Found</h2>
          <p>The page you're looking for doesn't exist or has been moved.</p>
          <p className={styles.motivate}>
            <span role="img" aria-label="compass">🧭</span> Sometimes the best journeys are the unexpected ones.<br />
            Let’s get you back on track!
          </p>
        </motion.div>


        {/* Interactive Home Button with pulse and glow */}
        <motion.div
          whileHover={{ scale: 1.12, boxShadow: "0 0 24px 6px #3b82f6" }}
          whileTap={{ scale: 0.96 }}
          animate={{
            boxShadow: [
              "0 0 0px 0px #3b82f6",
              "0 0 16px 4px #3b82f6",
              "0 0 0px 0px #3b82f6"
            ]
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut"
          }}
          style={{ marginTop: "2rem", borderRadius: 40 }}
        >
          <Link href="/" className={styles.homeButton}>
            Return Home
          </Link>
        </motion.div>
      </motion.div>

      {/* Footer */}
      <footer id="footer-section" aria-label="Footer" style={{ width: "100%", overflow: "hidden" }}>
        <Footer
          linkedinUrl={linkedinUrl}
          instagramUrl={instagramUrl}
          githubUrl={githubUrl}
          copyrightText={copyrightText}
        />
      </footer>
    </div>
  );
}
