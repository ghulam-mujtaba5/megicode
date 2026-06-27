'use client';

import React, { Suspense } from 'react';

import dynamic from 'next/dynamic';

import { SITE_SOCIAL, getCopyrightText } from '@/lib/constants';

import LoadingAnimation from '@/components/LoadingAnimation/LoadingAnimation';
import Breadcrumbs from '@/components/SEO/Breadcrumbs';

import Footer from '../../components/Footer/Footer';
import ThemeToggleIcon from '../../components/Icon/sbicon';
import NewNavBar from '../../components/NavBar_Desktop_Company/NewNavBar';
import NavBarMobile from '../../components/NavBar_Mobile/NavBar-mobile';
import { useTheme } from '../../context/ThemeContext';

const ServicesHero = dynamic(() => import('../../components/Services/Hero/ServicesHero'), {
  loading: () => <LoadingAnimation size="medium" />,
});
const ServiceCard = dynamic(() => import('../../components/Services/Card/ServiceCard'), {
  loading: () => <LoadingAnimation size="medium" />,
});

const coreServices = [
  {
    slug: 'ai-automation-agents',
    title: 'AI Automation & Agents',
    description:
      'Automate repetitive business work using AI chatbots, WhatsApp flows, CRMs, booking systems, and workflow agents that save time and capture more leads.',
    features: [
      'AI Chatbots & WhatsApp Flows',
      'CRM & Booking Automation',
      'Workflow Agents',
      'Lead Capture Systems',
    ],
    techs: ['Python', 'OpenAI', 'n8n', 'Zapier', 'Node.js'],
    href: '/services/ai-automation-agents',
  },
  {
    slug: 'ai-saas-mvp-development',
    title: 'AI SaaS & MVP Development',
    description:
      'Turn your AI product idea into a launch-ready MVP with auth, dashboard, database, payments, AI features, admin panel, and deployment.',
    features: [
      'Auth & User Management',
      'AI Feature Integration',
      'Payment Systems',
      'Admin Dashboard',
    ],
    techs: ['Next.js', 'OpenAI', 'Python', 'PostgreSQL', 'Stripe'],
    href: '/services/ai-saas-mvp-development',
  },
  {
    slug: 'custom-web-development',
    title: 'Custom Web Apps & Business Platforms',
    description:
      'Build portals, dashboards, booking systems, CRMs, and management platforms tailored to your business operations.',
    features: [
      'Business Portals & Dashboards',
      'Booking & CRM Systems',
      'Admin Panels & API Integration',
      'Scalable Architecture',
    ],
    techs: ['Next.js', 'React', 'Node.js', 'PostgreSQL', 'TypeScript'],
    href: '/services/custom-web-development',
  },
];

const supportingServices = [
  {
    slug: 'mobile-app-development',
    title: 'Mobile App Development',
    description:
      'Cross-platform iOS & Android apps built with React Native and Flutter, with AI features baked in.',
    features: [
      'React Native & Flutter Apps',
      'AI-Powered Mobile Features',
      'Push Notifications',
      'App Store Optimization',
    ],
    techs: ['React Native', 'Flutter', 'Firebase', 'Node.js', 'TypeScript'],
    href: '/services/mobile-app-development',
  },
  {
    slug: 'cloud-devops',
    title: 'Cloud & DevOps',
    description:
      'Scalable cloud infrastructure, CI/CD pipelines, and auto-scaling setup for growing products.',
    features: [
      'Cloud Architecture Setup',
      'CI/CD Pipeline Automation',
      'Auto-Scaling & Cost Optimization',
      'Security & Compliance',
    ],
    techs: ['AWS', 'Vercel', 'Docker', 'GitHub Actions', 'Terraform'],
    href: '/services/cloud-devops',
  },
  {
    slug: 'ui-ux-design',
    title: 'UI/UX Design',
    description:
      'Conversion-focused design systems and high-fidelity prototypes for SaaS and AI products.',
    features: [
      'UI/UX Design Systems',
      'High-Fidelity Prototyping',
      'Conversion-Focused Design',
      'Usability Testing',
    ],
    techs: ['Figma', 'Framer', 'Storybook', 'Adobe XD'],
    href: '/services/ui-ux-design',
  },
  {
    slug: 'growth-marketing-seo',
    title: 'SEO & Growth Support',
    description:
      'Technical SEO, content strategy, and performance marketing for AI products and SaaS startups.',
    features: [
      'Technical SEO for SaaS',
      'Content Marketing',
      'Google & Meta Ads',
      'Conversion Rate Optimization',
    ],
    techs: ['Google Analytics', 'SEMrush', 'Ahrefs', 'Google Ads', 'HubSpot'],
    href: '/services/growth-marketing-seo',
  },
  {
    slug: 'data-analytics',
    title: 'Data Dashboards',
    description:
      'Intelligent dashboards, analytics integrations, and AI-powered data pipelines for your product.',
    features: [
      'Intelligent Dashboards & Analytics',
      'AI Chatbot Integration',
      'Smart Search & Recommendations',
      'Data Pipeline Automation',
    ],
    techs: ['Python', 'OpenAI', 'Power BI', 'SQL', 'Pandas'],
    href: '/services/data-analytics',
  },
  {
    slug: 'technical-consulting',
    title: 'Technical Consulting',
    description:
      'CTO-level tech strategy, architecture decisions, and investor-ready technical due diligence.',
    features: [
      'CTO-Level Tech Strategy',
      'Architecture & Stack Selection',
      'Product Roadmap Planning',
      'Investor-Ready Due Diligence',
    ],
    techs: ['Architecture', 'Agile', 'Team Management', 'Roadmapping'],
    href: '/services/technical-consulting',
  },
];

export default function ServicesPage() {
  const { theme, toggleTheme } = useTheme();

  const { linkedinUrl, instagramUrl, githubUrl } = SITE_SOCIAL;
  const copyrightText = getCopyrightText();

  const isDark = theme === 'dark';

  return (
    <div
      style={{
        backgroundColor: isDark ? 'var(--page-bg-dark, #1d2127)' : 'var(--page-bg, #ffffff)',
        minHeight: '100vh',
        overflowX: 'hidden',
      }}
    >
      <div
        id="theme-toggle"
        role="button"
        tabIndex={0}
        aria-label="Toggle theme"
        onClick={toggleTheme}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleTheme();
          }
        }}
      >
        <ThemeToggleIcon />
      </div>

      <nav id="desktop-navbar" aria-label="Main Navigation">
        <NewNavBar />
      </nav>

      <nav id="mobile-navbar" aria-label="Mobile Navigation">
        <NavBarMobile />
      </nav>

      <main id="main-content" aria-label="Services Main Content">
        <h1
          style={{
            position: 'absolute',
            left: '-9999px',
            width: '1px',
            height: '1px',
            overflow: 'hidden',
          }}
        >
          Our Services
        </h1>

        <div style={{ maxWidth: '1320px', margin: '20px auto 0', padding: '0 2rem' }}>
          <Breadcrumbs theme={theme as 'light' | 'dark'} />
        </div>

        <Suspense fallback={<LoadingAnimation size="medium" />}>
          <ServicesHero />
        </Suspense>

        {/* ── Core Services ────────────────────────────────────────────────── */}
        <section className="services-section" aria-labelledby="core-heading">
          <header className="section-head">
            <span className={`eyebrow ${isDark ? 'eyebrow-dark' : 'eyebrow-light'}`}>
              Core Services
            </span>
            <h2
              id="core-heading"
              className={`section-title ${isDark ? 'title-dark' : 'title-light'}`}
            >
              What we&apos;re <span className="title-accent">best at</span>
            </h2>
            <p className={`section-sub ${isDark ? 'sub-dark' : 'sub-light'}`}>
              Three focused services that define Megicode&apos;s core strength — pick the one that
              fits your stage.
            </p>
          </header>

          <div className="services-grid">
            {coreServices.map((service, idx) => (
              <ServiceCard
                key={service.slug}
                slug={service.slug}
                title={service.title}
                description={service.description}
                features={service.features}
                techs={service.techs}
                href={service.href}
                delay={idx * 0.1}
                index={idx}
              />
            ))}
          </div>
        </section>

        {/* ── Supporting Capabilities ───────────────────────────────────────── */}
        <section
          className="services-section supporting-section"
          aria-labelledby="supporting-heading"
        >
          <header className="section-head">
            <span className={`eyebrow ${isDark ? 'eyebrow-dark' : 'eyebrow-light'}`}>
              Also Available
            </span>
            <h2
              id="supporting-heading"
              className={`section-title ${isDark ? 'title-dark' : 'title-light'}`}
            >
              Additional Capabilities
            </h2>
            <p className={`section-sub ${isDark ? 'sub-dark' : 'sub-light'}`}>
              Offered as part of comprehensive project delivery — not as standalone services.
            </p>
          </header>

          <div className="services-grid">
            {supportingServices.map((service, idx) => (
              <ServiceCard
                key={service.slug}
                slug={service.slug}
                title={service.title}
                description={service.description}
                features={service.features}
                techs={service.techs}
                href={service.href}
                delay={idx * 0.08}
                index={idx}
              />
            ))}
          </div>

          <p className={`delivery-note ${isDark ? 'note-dark' : 'note-light'}`}>
            Need mobile apps, UX design, cloud setup, or SEO support? These are available as part of
            complete product delivery.
          </p>
        </section>
      </main>

      <style jsx>{`
        /* ── Section layout ── */
        .services-section {
          padding: 4rem 2rem 2rem;
          max-width: 1320px;
          margin: 0 auto;
        }
        .supporting-section {
          padding-top: 2rem;
          padding-bottom: 5rem;
        }

        /* ── Section header ── */
        .section-head {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          margin-bottom: 2.5rem;
        }

        .eyebrow {
          display: inline-flex;
          align-items: center;
          font-family: 'Open Sans', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          padding: 5px 14px;
          border-radius: 100px;
        }
        .eyebrow-light {
          background: rgba(69, 115, 223, 0.1);
          color: #4573df;
        }
        .eyebrow-dark {
          background: rgba(69, 115, 223, 0.18);
          color: #7ba0ff;
        }

        .section-title {
          font-family: 'Open Sans', sans-serif;
          font-size: clamp(1.75rem, 3vw, 2.5rem);
          font-weight: 700;
          line-height: 1.2;
          letter-spacing: -0.025em;
          margin: 0;
        }
        .title-light {
          color: #111827;
        }
        .title-dark {
          color: #f1f5f9;
        }

        .title-accent {
          background: linear-gradient(90deg, #4573df 0%, #2d4fa2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .section-sub {
          font-family: 'Open Sans', sans-serif;
          font-size: 1rem;
          line-height: 1.7;
          max-width: 480px;
          margin: 0;
        }
        .sub-light {
          color: #6b7280;
        }
        .sub-dark {
          color: #94a3b8;
        }

        /* ── Card grid ── */
        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
          gap: 1.75rem;
        }

        /* ── Delivery note ── */
        .delivery-note {
          font-family: 'Open Sans', sans-serif;
          font-size: 0.875rem;
          line-height: 1.6;
          font-style: italic;
          text-align: center;
          margin: 2rem 0 0;
        }
        .note-light {
          color: #9ca3af;
        }
        .note-dark {
          color: #64748b;
        }

        /* ── Responsive ── */
        @media (max-width: 860px) {
          .services-grid {
            grid-template-columns: 1fr 1fr;
            gap: 1.25rem;
          }
        }
        @media (max-width: 640px) {
          .services-section {
            padding: 2.5rem 1rem 1.5rem;
          }
          .supporting-section {
            padding-bottom: 3rem;
          }
          .services-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <footer id="footer-section" aria-label="Footer" style={{ width: '100%', overflow: 'hidden' }}>
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
