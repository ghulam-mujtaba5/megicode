
"use client";
import React, { Suspense } from "react";
import dynamic from 'next/dynamic';
import { useTheme } from "../../context/ThemeContext";
import NavBarDesktop from "../../components/NavBar_Desktop_Company/nav-bar-Company";
import NavBarMobile from "../../components/NavBar_Mobile/NavBar-mobile";
import Footer from "../../components/Footer/Footer";
import ThemeToggleIcon from "../../components/Icon/sbicon";
import Loading from "../loading";

// Dynamic imports for optimized loading
const ServicesHero = dynamic(() => import("../../components/Services/Hero/ServicesHero"), {
  loading: () => <Loading />
});
const ServiceCard = dynamic(() => import("../../components/Services/Card/ServiceCard"), {
  loading: () => <Loading />
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
  const services = [
    {
      icon: "/Ai icon.svg",
      title: "AI & Machine Learning Solutions",
      description: "Custom AI models, automation, and intelligent systems to drive innovation and efficiency for your business.",
      features: [
        "AI Model Development",
        "Machine Learning Integration",
        "Natural Language Processing",
        "Computer Vision",
        "AI-Powered Automation"
      ],
      techs: ["TensorFlow", "PyTorch", "OpenAI", "Scikit-learn", "Azure AI"]
    },
    {
      icon: "/ds&ai-icon.svg",
      title: "Data Analytics & Business Intelligence",
      description: "Transform data into actionable insights with analytics, dashboards, and business intelligence solutions.",
      features: [
        "Big Data Analytics",
        "Predictive Analytics",
        "BI Dashboards",
        "Data Warehousing",
        "Data Visualization"
      ],
      techs: ["Python", "Power BI", "Tableau", "SQL", "Spark"]
    },
    {
      icon: "/web app icon.svg",
      title: "Custom Web Development",
      description: "Robust, scalable, and secure web applications tailored to your business goals and user needs.",
      features: [
        "Full-Stack Development",
        "API & Microservices",
        "E-commerce Solutions",
        "CMS & Portals",
        "Performance Optimization"
      ],
      techs: ["React", "Next.js", "Node.js", "TypeScript", "GraphQL"]
    },
    {
      icon: "/mobile app icon.svg",
      title: "Mobile App Solutions",
      description: "Native and cross-platform mobile apps for iOS and Android, designed for performance and engagement.",
      features: [
        "iOS & Android Apps",
        "Cross-Platform Development",
        "Mobile UI/UX Design",
        "App Store Launch",
        "Ongoing Support"
      ],
      techs: ["React Native", "Flutter", "Swift", "Kotlin", "Firebase"]
    },
    {
      icon: "/Desktop-App-icon.svg",
      title: "Cloud & DevOps Services",
      description: "Cloud migration, CI/CD, and infrastructure automation for scalable, secure, and efficient operations.",
      features: [
        "Cloud Migration & Management",
        "DevOps Automation",
        "CI/CD Pipeline Setup",
        "Infrastructure as Code",
        "Monitoring & Security"
      ],
      techs: ["AWS", "Azure", "Docker", "Kubernetes", "Terraform"]
    },
    {
      icon: "/data scrapping icon.svg",
      title: "Automation & Integration",
      description: "Workflow automation, data integration, and process optimization to streamline your business.",
      features: [
        "Business Process Automation",
        "API Integration",
        "ETL Pipelines",
        "RPA (Robotic Process Automation)",
        "Custom Scripting"
      ],
      techs: ["Python", "Zapier", "Make", "Node.js", "Selenium"]
    },
    {
      icon: "/Ui&Ux-icon.svg",
      title: "UI/UX & Product Design",
      description: "User-centered design for engaging, intuitive, and accessible digital products.",
      features: [
        "User Research & Personas",
        "Wireframing & Prototyping",
        "UI/UX Design Systems",
        "Usability Testing",
        "Brand Identity Design"
      ],
      techs: ["Figma", "Adobe XD", "Sketch", "InVision", "Zeplin"]
    },
    {
      icon: "/it-consulting-support-icon.svg",
      title: "IT Consulting & Support",
      description: "Expert guidance, security, and ongoing support to help you achieve your technology goals.",
      features: [
        "Technology Strategy & Roadmapping",
        "IT Infrastructure Consulting",
        "Security Audits & Compliance",
        "Ongoing Maintenance & Support",
        "Training & Documentation"
      ],
      techs: ["ITIL", "ISO 27001", "Microsoft 365", "Google Workspace", "Jira"]
    }
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
      </nav>      {/* Hero Section */}
      <Suspense fallback={<Loading />}>
        <ServicesHero />
      </Suspense>      {/* Services Grid */}
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
          width: 54px;
          height: 54px;
          margin-bottom: 1.1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 14px;
          background: ${theme === "dark" ? "#23272f" : "#e3e6ea"};
          box-shadow: 0 2px 8px 0 rgba(78,168,255,0.10);
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
      <section className="services-grid">
        {services.map((service, idx) => (
          <div className="service-card" key={idx}>
            <div className="service-card-icon">
              <img src={service.icon} alt="" style={{width: 32, height: 32, objectFit: 'contain'}} />
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
        ))}
      </section>

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
