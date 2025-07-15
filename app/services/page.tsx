"use client";

import React, { Suspense } from "react";
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useTheme } from "../../context/ThemeContext";
import NavBarDesktop from "../../components/NavBar_Desktop_Company/nav-bar-Company";
import NavBarMobile from "../../components/NavBar_Mobile/NavBar-mobile";
import Footer from "../../components/Footer/Footer";
import ThemeToggleIcon from "../../components/Icon/sbicon";
import LoadingAnimation from "@/components/LoadingAnimation/LoadingAnimation";
import servicesData from "./servicesData";

// Dynamic imports for optimized loading
const ServicesHero = dynamic(() => import("../../components/Services/Hero/ServicesHero"), {
  loading: () => <LoadingAnimation size="medium" />
});
const ServiceCard = dynamic(() => import("../../components/Services/Card/ServiceCard"), {
  loading: () => <LoadingAnimation size="medium" />
});

export default function ServicesPage() {
  const { theme } = useTheme();

  const linkedinUrl = "https://www.linkedin.com/company/megicode";
  const instagramUrl = "https://www.instagram.com/megicode/";
  const githubUrl = "https://github.com/megicode";
  const copyrightText = "Copyright 2025 Megicode. All Rights Reserved.";

  const sections = [
    { label: "Home", route: "/" },
    { label: "About", route: "/about" },
    { label: "Services", route: "/services" },
    { label: "Reviews", route: "/reviews" },
    { label: "Project", route: "/project" },
    { label: "Contact", route: "/contact" },
  ];

  return (
    <div style={{ backgroundColor: theme === "dark" ? "#1d2127" : "#ffffff", minHeight: "100vh", overflowX: "hidden" }}>
      {/* Theme Toggle Icon */}
      <div id="theme-toggle" role="button" tabIndex={0}>
        <ThemeToggleIcon />
      </div>

      {/* Desktop NavBar */}
      <nav id="desktop-navbar" aria-label="Main Navigation">
        <NavBarDesktop />
      </nav>

      {/* Mobile NavBar */}
      <nav id="mobile-navbar" aria-label="Mobile Navigation">
        <NavBarMobile />
      </nav>

      <main aria-label="Services Main Content">
        <h1 style={{position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden'}}>Our Services</h1>
        <Suspense fallback={<LoadingAnimation size="medium" />}>
          <ServicesHero />
        </Suspense>
        <section className="services-grid">
          {servicesData.map((service, idx) => (
            <Link href={`/services/${service.slug}`} key={idx} style={{ textDecoration: 'none' }}>
              <div className="service-card" tabIndex={0} role="button" aria-label={service.title} style={{ cursor: 'pointer' }}>
                <div className={`service-card-icon${service.title === 'Cloud & DevOps Services' ? ' cloud-devops' : ''}`}> 
                  <img src={service.icon} alt={service.title + ' icon'} />
                </div>
                <div className="service-card-title">{service.title}</div>
                <div className="service-card-desc">{service.description}</div>
                <ul className="service-card-features">
                  {service.features.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
                <div className="service-card-techs">
                  {service.techs.map((t, i) => (
                    <span className="service-card-tech" key={i}>{t}</span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </section>
      </main>
      <style>{`
        .services-grid {
          padding: 2rem 1.5rem;
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 2rem;
          position: relative;
        }
        .service-card {
          background: ${theme === "dark" ? "linear-gradient(135deg, #181c22 80%, #23272f 100%)" : "linear-gradient(135deg, #f8f9fa 80%, #e3e6ea 100%)"};
          border-radius: 20px;
          box-shadow: 0 4px 24px 0 rgba(78,168,255,0.10), 0 1.5px 8px 0 rgba(0,0,0,0.07);
          padding: 2rem 1.5rem 1.5rem 1.5rem;
          min-height: 460px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          transition: box-shadow 0.2s, transform 0.2s;
          border: 1.5px solid ${theme === "dark" ? "#263040" : "#dbeafe"};
        }
        .service-card:hover {
          box-shadow: 0 8px 32px 0 rgba(78,168,255,0.18), 0 2px 12px 0 rgba(0,0,0,0.10);
          transform: translateY(-6px) scale(1.015);
          border-color: #4ea8ff;
        }
        .service-card-icon {
          width: 64px;
          height: 64px;
          margin-bottom: 1.1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 16px;
          background: ${theme === "dark" ? "#23272f" : "#e3e6ea"};
          box-shadow: 0 4px 16px 0 rgba(78,168,255,0.12);
          border: 1.5px solid ${theme === "dark" ? "#263040" : "#dbeafe"};
          overflow: hidden;
        }
        .service-card-icon img {
          width: 44px;
          height: 44px;
          object-fit: contain;
          display: block;
          margin: auto;
          filter: drop-shadow(0 1px 2px rgba(0,0,0,0.07));
        }
        .service-card-icon.cloud-devops img {
          width: 54px;
          height: 54px;
        }
        .service-card-title {
          font-size: 1.32rem;
          font-weight: 800;
          margin-bottom: 0.45rem;
          color: #4ea8ff;
          letter-spacing: 0.01em;
        }
        .service-card-desc {
          font-size: 1.04rem;
          margin-bottom: 1.1rem;
          color: ${theme === "dark" ? "#cfd8e3" : "#222b3a"};
          font-weight: 500;
        }
        .service-card-features {
          margin-bottom: 1.1rem;
        }
        .service-card-features li {
          font-size: 1.01rem;
          margin-bottom: 0.22rem;
          color: ${theme === "dark" ? "#b0c4d8" : "#3a4a5d"};
        }
        .service-card-techs {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .service-card-tech {
          background: ${theme === "dark" ? "#1d2127" : "#e3e6ea"};
          color: #4ea8ff;
          border-radius: 8px;
          padding: 0.25rem 0.75rem;
          font-size: 0.97rem;
          margin-bottom: 0.25rem;
          font-weight: 600;
          letter-spacing: 0.01em;
          border: 1px solid ${theme === "dark" ? "#263040" : "#dbeafe"};
        }
      `}</style>

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



