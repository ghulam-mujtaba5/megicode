"use client";

import React, { Suspense } from "react";
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useTheme } from "../../context/ThemeContext";
import NewNavBar from "../../components/NavBar_Desktop_Company/NewNavBar";
import NavBarMobile from "../../components/NavBar_Mobile/NavBar-mobile";
import Footer from "../../components/Footer/Footer";
import ThemeToggleIcon from "../../components/Icon/sbicon";
import LoadingAnimation from "@/components/LoadingAnimation/LoadingAnimation";
import servicesData from "./servicesData";
import { SITE_SOCIAL, getCopyrightText } from '@/lib/constants';

// Dynamic imports for optimized loading
const ServicesHero = dynamic(() => import("../../components/Services/Hero/ServicesHero"), {
  loading: () => <LoadingAnimation size="medium" />
});
const ServiceCard = dynamic(() => import("../../components/Services/Card/ServiceCard"), {
  loading: () => <LoadingAnimation size="medium" />
});

export default function ServicesPage() {
  const { theme } = useTheme();

  const { linkedinUrl, instagramUrl, githubUrl } = SITE_SOCIAL;
  const copyrightText = getCopyrightText();

  return (
    <div style={{ backgroundColor: theme === "dark" ? "var(--page-bg-dark, #1d2127)" : "var(--page-bg, #ffffff)", minHeight: "100vh", overflowX: "hidden" }}>
      {/* Theme Toggle Icon */}
      <div id="theme-toggle" role="button" tabIndex={0}>
        <ThemeToggleIcon />
      </div>

      {/* Desktop NavBar */}
      <nav id="desktop-navbar" aria-label="Main Navigation">
        <NewNavBar />
      </nav>

      {/* Mobile NavBar */}
      <nav id="mobile-navbar" aria-label="Mobile Navigation">
        <NavBarMobile />
      </nav>

      <main id="main-content" aria-label="Services Main Content">
        <h1 style={{position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden'}}>Our Services</h1>
        <Suspense fallback={<LoadingAnimation size="medium" />}>
          <ServicesHero />
        </Suspense>
        <section className="services-grid">
          {servicesData.map((service, idx) => (
            <ServiceCard
              key={idx}
              icon={service.icon}
              title={service.title}
              description={service.description}
              features={service.features}
              techs={service.techs}
              href={`/services/${service.slug}`}
              delay={idx * 0.1}
            />
          ))}
        </section>
      </main>
      <style jsx>{`
        .services-grid {
          padding: 4rem 2rem 5rem;
          max-width: 1320px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
          gap: 1.75rem;
          position: relative;
        }
        
        @media (max-width: 860px) {
          .services-grid {
            grid-template-columns: 1fr 1fr;
            gap: 1.25rem;
            padding: 2.5rem 1.25rem 3rem;
          }
        }

        @media (max-width: 640px) {
          .services-grid {
            grid-template-columns: 1fr;
            gap: 1.25rem;
            padding: 2rem 1rem 2.5rem;
          }
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



