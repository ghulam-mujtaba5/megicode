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

      {/* Logo and Wordmark Combined */}
      <div
        className={styles.logoAnimation}
        role="button"
        tabIndex={0}
        aria-label="Home"
        onClick={() => navigateTo("/")}
        onKeyPress={(e) => e.key === 'Enter' && navigateTo("/")}
        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
      >
        <span className={styles.crystalShine} aria-hidden="true"></span>
        <img
          src="/logo-navbar-dark.svg"
          alt="Megicode Logo and Wordmark"
          className={styles.navbarLogo}
          style={{ maxHeight: 48, width: 'auto', display: 'block' }}
          loading="eager"
        />
      </div>

      {/* Article page */}

      <div
        className={`${styles.resume} ${pathname === "/article" ? styles.selected : ""}`}
        onClick={() => navigateTo("/article")}
        role="button"
        tabIndex={0}
        aria-label="Article"
        onKeyPress={(e) => e.key === 'Enter' && navigateTo("/article")}
      >
        <div className={styles.resumeText}>Article</div>
      </div>

      {/* Project page */}

      <div
        className={`${styles.project} ${pathname === "/projects" ? styles.selected : ""}`}
        onClick={() => navigateTo("/projects")}
        role="button"
        tabIndex={0}
        aria-label="Projects"
        onKeyPress={(e) => e.key === 'Enter' && navigateTo("/projects")}
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
