
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
const ServicesHero = dynamic(() => import("../../components/Services/ServicesHero"), {
  loading: () => <Loading />
});
const ServiceCard = dynamic(() => import("../../components/Services/ServiceCard"), {
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
      title: "AI Solutions Development",
      description: "Cutting-edge AI solutions that transform business operations and decision-making processes.",
      features: [
        "Custom AI Models Development",
        "Machine Learning Solutions",
        "Natural Language Processing",
        "Computer Vision Systems",
        "AI-Powered Automation"
      ],
      techs: ["TensorFlow", "PyTorch", "OpenAI", "Scikit-learn", "Azure AI"]
    },
    {
      icon: "/ds&ai-icon.svg",
      title: "Data Science & Analytics",
      description: "Transform your data into actionable insights with our comprehensive data science solutions.",
      features: [
        "Big Data Analytics",
        "Predictive Analytics",
        "Data Visualization",
        "Business Intelligence",
        "Statistical Analysis"
      ],
      techs: ["Python", "R", "Spark", "Tableau", "Power BI"]
    },
    {
      icon: "/web app icon.svg",
      title: "Web Application Development",
      description: "Modern, scalable web applications built with cutting-edge technologies and best practices.",
      features: [
        "Full-Stack Development",
        "Progressive Web Apps",
        "Cloud-Native Solutions",
        "API Development",
        "Performance Optimization"
      ],
      techs: ["React", "Node.js", "Next.js", "TypeScript", "GraphQL"]
    },
    {
      icon: "/mobile app icon.svg",
      title: "Mobile App Development",
      description: "Native and cross-platform mobile applications that deliver exceptional user experiences.",
      features: [
        "iOS Development",
        "Android Development",
        "Cross-Platform Solutions",
        "Mobile UI/UX Design",
        "App Performance Optimization"
      ],
      techs: ["React Native", "Flutter", "Swift", "Kotlin", "Firebase"]
    },
    {
      icon: "/Desktop-App-icon.svg",
      title: "Desktop Applications",
      description: "Powerful desktop applications that enhance productivity and streamline workflows.",
      features: [
        "Cross-Platform Desktop Apps",
        "Native Windows Applications",
        "macOS Applications",
        "System Integration",
        "Performance Optimization"
      ],
      techs: ["Electron", "Qt", ".NET", "C++", "Python"]
    },
    {
      icon: "/Ui&Ux-icon.svg",
      title: "UI/UX Design",
      description: "User-centered design solutions that create engaging and intuitive digital experiences.",
      features: [
        "User Interface Design",
        "User Experience Design",
        "Interaction Design",
        "Design Systems",
        "Usability Testing"
      ],
      techs: ["Figma", "Adobe XD", "Sketch", "InVision", "Protopie"]
    },
    {
      icon: "/data scrapping icon.svg",
      title: "Data Scraping & Automation",
      description: "Automated data collection and process automation solutions for improved efficiency.",
      features: [
        "Web Scraping",
        "Process Automation",
        "Data Extraction",
        "ETL Pipelines",
        "Workflow Automation"
      ],
      techs: ["Python", "Selenium", "BeautifulSoup", "Scrapy", "Puppeteer"]
    },
    {
      icon: "/data visualization icon.svg",
      title: "Data Visualization",
      description: "Transform complex data into clear, actionable visual insights for better decision-making.",
      features: [
        "Interactive Dashboards",
        "Custom Visualizations",
        "Real-time Analytics",
        "Report Generation",
        "Data Storytelling"
      ],
      techs: ["D3.js", "Plotly", "Chart.js", "Three.js", "WebGL"]
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
        <NavBarMobile sections={sections} />
      </nav>      {/* Hero Section */}
      <Suspense fallback={<Loading />}>
        <ServicesHero />
      </Suspense>      {/* Services Grid */}
      <section 
        className="services-grid"
        style={{
          padding: "2rem 1.5rem",
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "1.5rem",
          position: "relative",
        }}
      >
        {services.map((service, idx) => (
          <Suspense key={idx} fallback={<Loading />}>
            <ServiceCard
              icon={service.icon}
              title={service.title}
              description={service.description}
              features={service.features}
              techs={service.techs}
              delay={idx * 0.1}
            />
          </Suspense>
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
