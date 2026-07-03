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
    badge: 'Lead automation',
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
    ctaText: 'Automate My Leads',
    href: '/services/ai-automation-agents',
    bestFor: 'Teams losing leads, time, and follow-ups to manual work',
    result: 'Capture, qualify, reply, book, and follow up without staff chasing every task.',
    path: ['Map workflow', 'Build agent', 'Connect tools'],
  },
  {
    slug: 'ai-saas-mvp-development',
    badge: 'AI product build',
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
    ctaText: 'Plan My AI MVP',
    href: '/services/ai-saas-mvp-development',
    bestFor: 'Founders turning an AI idea into a real SaaS MVP',
    result: 'Get the right product architecture, AI features, dashboard, and launch plan.',
    path: ['Roadmap', 'MVP build', 'Launch'],
  },
  {
    slug: 'custom-web-development',
    badge: 'Business platform',
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
    ctaText: 'Build My Platform',
    href: '/services/custom-web-development',
    bestFor: 'Businesses replacing spreadsheets, manual admin, and scattered tools',
    result: 'Turn daily operations into one clear platform your team can actually use.',
    path: ['Model process', 'Build portal', 'Scale ops'],
  },
];

const supportingServices = [
  {
    slug: 'ui-ux-design',
    title: 'UI/UX',
    href: '/services/ui-ux-design',
  },
  {
    slug: 'cloud-devops',
    title: 'DevOps',
    href: '/services/cloud-devops',
  },
  {
    slug: 'mobile-app-development',
    title: 'Mobile Apps',
    href: '/services/mobile-app-development',
  },
  {
    slug: 'data-analytics',
    title: 'Data Dashboards',
    href: '/services/data-analytics',
  },
  {
    slug: 'growth-marketing-seo',
    title: 'SEO',
    href: '/services/growth-marketing-seo',
  },
  {
    slug: 'technical-consulting',
    title: 'Technical Consulting',
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
                ctaText={service.ctaText}
                href={service.href}
                badge={service.badge}
                bestFor={service.bestFor}
                result={service.result}
                path={service.path}
                featured={idx === 0}
                delay={idx * 0.1}
                index={idx}
              />
            ))}
          </div>
        </section>

        <section
          className="services-section supporting-section"
          aria-labelledby="supporting-heading"
        >
          <header className="section-head">
            <span className={`eyebrow ${isDark ? 'eyebrow-dark' : 'eyebrow-light'}`}>
              Supporting work
            </span>
            <h2
              id="supporting-heading"
              className={`section-title ${isDark ? 'title-dark' : 'title-light'}`}
            >
              Added when the build needs it.
            </h2>
            <p className={`section-sub ${isDark ? 'sub-dark' : 'sub-light'}`}>
              These capabilities support the core AI, MVP, and platform work without competing with
              the main buying paths.
            </p>
          </header>

          <div className="supporting-chip-grid">
            {supportingServices.map((service) => (
              <a
                key={service.slug}
                href={service.href}
                className={`supporting-chip ${isDark ? 'supporting-chip-dark' : 'supporting-chip-light'}`}
              >
                {service.title}
              </a>
            ))}
          </div>

          <p className={`delivery-note ${isDark ? 'note-dark' : 'note-light'}`}>
            Need mobile apps, UX design, cloud setup, data, SEO, or roadmap support? These are
            available as part of complete product delivery.
          </p>
          <a href="/pricing" className="services-pricing-cta">
            Compare packages and starting prices →
          </a>
        </section>
      </main>

      <style jsx>{`
        /* ── Section layout ── */
        .services-section {
          padding: 4.5rem 2rem 2.5rem;
          max-width: 1320px;
          margin: 0 auto;
          position: relative;
        }
        .supporting-section {
          padding-top: 2.75rem;
          padding-bottom: 5.5rem;
        }

        /* ── Section header ── */
        .section-head {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          margin-bottom: 2.75rem;
        }

        .eyebrow {
          display: inline-flex;
          align-items: center;
          font-family: var(--font-body), sans-serif;
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
          font-family: var(--font-body), sans-serif;
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
          font-family: var(--font-body), sans-serif;
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
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 1.15rem;
          align-items: stretch;
        }

        #core-heading + .section-sub {
          max-width: 560px;
        }

        /* ── Delivery note ── */
        .delivery-note {
          font-family: var(--font-body), sans-serif;
          font-size: 0.9rem;
          line-height: 1.6;
          text-align: center;
          max-width: 720px;
          margin: 2.5rem auto 0;
          padding: 1rem 1.25rem;
          border-radius: 18px;
        }

        .supporting-chip-grid {
          display: grid;
          grid-template-columns: repeat(6, minmax(0, 1fr));
          gap: 0.8rem;
          max-width: 1120px;
          margin: 0 auto;
        }
        .supporting-chip {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 48px;
          border-radius: 999px;
          padding: 0.75rem 1rem;
          font-size: 0.9rem;
          font-weight: 800;
          line-height: 1.25;
          text-align: center;
          text-decoration: none;
          transition:
            transform 0.2s ease,
            border-color 0.2s ease,
            background 0.2s ease,
            color 0.2s ease;
        }
        .supporting-chip:hover,
        .supporting-chip:focus-visible {
          transform: translateY(-2px);
          outline: none;
        }
        .supporting-chip-light {
          color: #2d4fa2;
          background: rgba(69, 115, 223, 0.07);
          border: 1px solid rgba(69, 115, 223, 0.14);
        }
        .supporting-chip-dark {
          color: #c0d4ff;
          background: rgba(255, 255, 255, 0.055);
          border: 1px solid rgba(255, 255, 255, 0.11);
        }
        .supporting-chip-light:hover,
        .supporting-chip-light:focus-visible,
        .supporting-chip-dark:hover,
        .supporting-chip-dark:focus-visible {
          color: #ff9800;
          border-color: rgba(255, 152, 0, 0.72);
          background: rgba(255, 152, 0, 0.12);
        }
        .services-pricing-cta {
          width: fit-content;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 48px;
          margin: 2rem auto 0;
          padding: 0 22px;
          border-radius: 999px;
          color: ${isDark ? '#f8fafc' : '#1d2127'};
          border: 1px solid rgba(255, 152, 0, 0.72);
          background: ${isDark ? 'rgba(255,255,255,0.055)' : 'rgba(255,255,255,0.78)'};
          box-shadow: ${isDark
            ? '0 14px 30px rgba(0,0,0,0.18)'
            : '0 14px 30px rgba(15,23,42,0.08)'};
          font-weight: 800;
          text-decoration: none;
        }
        .services-pricing-cta:hover,
        .services-pricing-cta:focus-visible {
          color: #ff9800;
          border-color: rgba(255, 152, 0, 0.92);
          background: rgba(255, 152, 0, 0.14);
          box-shadow: 0 16px 30px rgba(249, 115, 22, 0.16);
          outline: none;
        }
        .note-light {
          color: #526070;
          background: rgba(69, 115, 223, 0.06);
          border: 1px solid rgba(69, 115, 223, 0.12);
        }
        .note-dark {
          color: #adb5bd;
          background: rgba(69, 115, 223, 0.1);
          border: 1px solid rgba(69, 115, 223, 0.18);
        }

        /* ── Responsive ── */
        @media (max-width: 1080px) {
          .services-grid {
            grid-template-columns: 1fr 1fr;
            gap: 1.25rem;
          }
          .supporting-chip-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
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
          .supporting-chip-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
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
