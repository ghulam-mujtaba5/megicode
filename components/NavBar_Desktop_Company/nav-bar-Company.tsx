"use client";
import styles from "./nav-bar-Compnay.module.css";
import { useState } from "react";
import { useRouter, usePathname } from 'next/navigation';

const NavBar = () => {
  const [hover, setHover] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  console.log('Current pathname:', pathname);

  const handleLogoClick = () => {
    router.push('/');
  };

  const handleMouseEnter = () => {
    setHover(true);
  };

  const handleMouseLeave = () => {
    setHover(false);
  };

  // Navigation handler for desktop navbar
  const navigateTo = (route) => {
    router.push(route);
  };

  return (
    <header className={styles.header}>
      {/* Home button */}

      <div
        className={`${styles.home} ${(pathname === "/" || pathname === "/megicode" || pathname === "") ? styles.selected : ""}`}
        onClick={() => navigateTo("/")}
        role="button"
        tabIndex={0}
        aria-label="Home"
        onKeyPress={(e) => e.key === 'Enter' && navigateTo("/")}
      >
        <div className={styles.homeText}>Home</div>
      </div>

      {/* About page */}

      <div
        className={`${styles.about} ${pathname === "/about" ? styles.selected : ""}`}
        onClick={() => navigateTo("/about")}
        role="button"
        tabIndex={0}
        aria-label="About"
        onKeyPress={(e) => e.key === 'Enter' && navigateTo("/about")}
      >
        <div className={styles.aboutText}>About</div>
      </div>

      {/* Services page */}

      <div
        className={`${styles.skills} ${pathname === "/services" ? styles.selected : ""}`}
        onClick={() => navigateTo("/services")}
        role="button"
        tabIndex={0}
        aria-label="Services"
        onKeyPress={(e) => e.key === 'Enter' && navigateTo("/services")}
      >
        <div className={styles.skillsText}>Services</div>
      </div>

      {/* Logo and Name Animation (Megicode Icon Component, 100% consistent) */}
      <div
        className={styles.logoAnimation}
        role="button"
        tabIndex={0}
        aria-label="Home"
        onClick={() => navigateTo("/")}
        onKeyPress={(e) => e.key === 'Enter' && navigateTo("/")}
        style={{ cursor: 'pointer' }}
      >
        {/* Use the gmicon component for 100% design and animation parity */}
        {typeof window !== 'undefined' && (
          (() => {
            const GmIcon = require('../Icon/gmicon').default;
            return (
              <GmIcon showOnDesktop={true} />
            );
          })()
        )}
        <div className={styles.typo}>
          <span style={{position: 'relative', display: 'inline-block'}}>
            <img
              className={styles.nameIcon}
              loading="lazy"
              alt="Megicode Name"
              src="/megicode-wordmark.svg"
              style={{ maxWidth: "100%", height: "auto" }}
            />
            <span className="crystal-shine" style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'}}></span>
          </span>
        </div>
      </div>

      {/* Reviews page */}

      <div
        className={`${styles.resume} ${pathname === "/reviews" ? styles.selected : ""}`}
        onClick={() => navigateTo("/reviews")}
        role="button"
        tabIndex={0}
        aria-label="Reviews"
        onKeyPress={(e) => e.key === 'Enter' && navigateTo("/reviews")}
      >
        <div className={styles.resumeText}>Reviews</div>
      </div>

      {/* Project page */}

      <div
        className={`${styles.project} ${pathname === "/project" ? styles.selected : ""}`}
        onClick={() => navigateTo("/project")}
        role="button"
        tabIndex={0}
        aria-label="Project"
        onKeyPress={(e) => e.key === 'Enter' && navigateTo("/project")}
      >
        <div className={styles.projectText}>Project</div>
      </div>

      {/* Contact page */}

      <div
        className={`${styles.contact} ${pathname === "/contact" ? styles.selected : ""}`}
        onClick={() => navigateTo("/contact")}
        role="button"
        tabIndex={0}
        aria-label="Contact"
        onKeyPress={(e) => e.key === 'Enter' && navigateTo("/contact")}
      >
        <div className={styles.contactText}>Contact</div>
      </div>
    </header>
  );
};

export default NavBar;
