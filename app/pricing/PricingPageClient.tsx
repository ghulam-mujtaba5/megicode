'use client';

import { useMemo, useState } from 'react';

import Link from 'next/link';

import { pricingCategories, pricingEntrypoints, pricingFaqs } from '@/data/pricing';

import { SITE_SOCIAL, getCopyrightText } from '@/lib/constants';

import { useTheme } from '@/context/ThemeContext';

import Footer from '@/components/Footer/Footer';
import ThemeToggleIcon from '@/components/Icon/sbicon';
import NewNavBar from '@/components/NavBar_Desktop_Company/NewNavBar';
import NavBarMobile from '@/components/NavBar_Mobile/NavBar-mobile';
import Breadcrumbs from '@/components/SEO/Breadcrumbs';

const costDrivers = [
  'Number of workflows',
  'AI complexity',
  'Integrations',
  'Dashboard or admin needs',
  'User roles',
  'Data migration',
  'WhatsApp, telephony, or API usage',
  'Support level',
];

const proofStats = [
  '15+ AI & software products built',
  '5+ countries served',
  '10+ startups and businesses partnered',
  'Proof from The Aesthetics Place, CampusAxis, and Wajdan Digital Alchemy',
];

export default function PricingPageClient() {
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState(pricingCategories[0].id);
  const isDark = theme === 'dark';
  const activeCategory = useMemo(
    () => pricingCategories.find((category) => category.id === activeTab) ?? pricingCategories[0],
    [activeTab]
  );
  const { linkedinUrl, instagramUrl, githubUrl } = SITE_SOCIAL;

  return (
    <div className={`pricing-page ${isDark ? 'pricing-dark' : 'pricing-light'}`}>
      <div
        id="theme-toggle"
        role="button"
        tabIndex={0}
        aria-label="Toggle theme"
        onClick={toggleTheme}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            toggleTheme();
          }
        }}
      >
        <ThemeToggleIcon />
      </div>

      <NewNavBar />
      <NavBarMobile />

      <main className="pricing-main">
        <div className="breadcrumb-wrap">
          <Breadcrumbs theme={theme as 'light' | 'dark'} />
        </div>

        <section className="pricing-hero" aria-labelledby="pricing-heading">
          <div className="hero-copy">
            <span className="eyebrow">USD pricing</span>
            <h1 id="pricing-heading">
              Clear pricing for AI automation, MVPs, and business platforms
            </h1>
            <p>
              Fixed-scope entry packages for startups, clinics, and growing businesses, with
              practical timelines, clear deliverables, and transparent starting prices.
            </p>
            <div className="hero-actions">
              <Link className="primary-cta" href="/contact?source=pricing">
                Book Free Fit Call
              </Link>
              <a className="secondary-cta" href="#packages">
                Compare Packages
              </a>
            </div>
            <p className="tool-note">
              Third-party tools, hosting, WhatsApp, telephony, and AI API usage are billed
              separately.
            </p>
          </div>

          <div className="pricing-stack" aria-label="Pricing starting points">
            {pricingEntrypoints.slice(0, 3).map((entry, index) => (
              <div className={`stack-card stack-card-${index + 1}`} key={entry.title}>
                <span>{entry.title}</span>
                <strong>{entry.price}</strong>
              </div>
            ))}
          </div>
        </section>

        <section className="entry-section" aria-labelledby="entry-heading">
          <div className="section-head">
            <span className="eyebrow">Choose how to start</span>
            <h2 id="entry-heading">Start small, then scale when the scope is clear.</h2>
            <p>
              Use these five entry points to self-qualify quickly without reading a giant proposal.
            </p>
          </div>
          <div className="entry-grid">
            {pricingEntrypoints.map((entry) => (
              <article className="entry-card" key={entry.title}>
                <div>
                  <h3>{entry.title}</h3>
                  <strong>{entry.price}</strong>
                  <p>{entry.bestFor}</p>
                </div>
                <ul>
                  {entry.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
                <Link href={entry.href}>{entry.cta}</Link>
              </article>
            ))}
          </div>
        </section>

        <section id="packages" className="packages-section" aria-labelledby="packages-heading">
          <div className="section-head">
            <span className="eyebrow">Packages</span>
            <h2 id="packages-heading">Compare fixed-scope packages by service type.</h2>
            <p>
              Growth packages are highlighted where they are the safest default for most buyers.
            </p>
          </div>

          <div className="tab-list" role="tablist" aria-label="Pricing categories">
            {pricingCategories.map((category) => (
              <button
                key={category.id}
                type="button"
                role="tab"
                aria-selected={activeTab === category.id}
                className={activeTab === category.id ? 'active' : ''}
                onClick={() => setActiveTab(category.id)}
              >
                {category.label}
              </button>
            ))}
          </div>

          <p className="category-summary">{activeCategory.summary}</p>

          <div className="package-grid">
            {activeCategory.packages.map((item) => (
              <article
                className={`package-card ${item.featured ? 'featured' : ''}`}
                key={item.name}
              >
                {item.featured && <span className="popular-badge">Most Popular</span>}
                <h3>{item.name}</h3>
                <p className="best-for">{item.bestFor}</p>
                <strong className="price">{item.price}</strong>
                <p className="timeline">Timeline: {item.timeline}</p>
                <ul>
                  {item.includes.map((include) => (
                    <li key={include}>{include}</li>
                  ))}
                </ul>
                {item.note && <p className="package-note">{item.note}</p>}
                <Link href={item.href}>{item.cta}</Link>
              </article>
            ))}
          </div>
        </section>

        <section className="drivers-section" aria-labelledby="drivers-heading">
          <div className="drivers-copy">
            <span className="eyebrow">Cost drivers</span>
            <h2 id="drivers-heading">What affects final project price?</h2>
            <p>
              Public prices give buyers a clear starting point. Final scope depends on the actual
              product, workflow depth, integrations, and support needs.
            </p>
          </div>
          <div className="drivers-grid">
            {costDrivers.map((driver) => (
              <span key={driver}>{driver}</span>
            ))}
          </div>
        </section>

        <section className="proof-strip" aria-label="Megicode proof">
          {proofStats.map((proof) => (
            <span key={proof}>{proof}</span>
          ))}
        </section>

        <section className="faq-section" aria-labelledby="faq-heading">
          <div className="section-head">
            <span className="eyebrow">FAQ</span>
            <h2 id="faq-heading">Straight answers before the call.</h2>
          </div>
          <div className="faq-grid">
            {pricingFaqs.map((faq) => (
              <details key={faq.question}>
                <summary>{faq.question}</summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="final-cta" aria-labelledby="final-pricing-cta">
          <h2 id="final-pricing-cta">Not sure which package fits?</h2>
          <p>
            Book a free fit call and we&apos;ll recommend the safest starting point based on your
            goals, scope, and budget.
          </p>
          <Link className="primary-cta" href="/contact?source=pricing-final">
            Book Free Fit Call
          </Link>
        </section>
      </main>

      <Footer
        linkedinUrl={linkedinUrl}
        instagramUrl={instagramUrl}
        githubUrl={githubUrl}
        copyrightText={getCopyrightText()}
      />

      <style jsx>{`
        .pricing-page {
          min-height: 100vh;
          font-family: 'Open Sans', sans-serif;
          overflow-x: hidden;
        }
        .pricing-light {
          background: linear-gradient(135deg, #f8fafc 0%, #e8eaf6 100%);
          color: #0f172a;
        }
        .pricing-dark {
          background: #1d2127;
          color: #f8fafc;
        }
        .pricing-main {
          width: min(1240px, calc(100% - 32px));
          margin: 0 auto;
          padding: 18px 0 80px;
        }
        .breadcrumb-wrap {
          margin: 6px 0 24px;
        }
        .pricing-hero {
          display: grid;
          grid-template-columns: minmax(0, 1.08fr) minmax(320px, 0.92fr);
          gap: 42px;
          align-items: center;
          padding: 78px 0 64px;
        }
        .hero-copy h1 {
          max-width: 760px;
          margin: 14px 0 18px;
          font-size: clamp(2.25rem, 5vw, 4.8rem);
          line-height: 1.05;
          letter-spacing: 0;
        }
        .hero-copy p,
        .section-head p,
        .drivers-copy p,
        .final-cta p {
          color: ${isDark ? '#cbd5e1' : '#526070'};
          line-height: 1.75;
        }
        .hero-copy > p {
          max-width: 700px;
          font-size: 1.08rem;
        }
        .eyebrow {
          display: inline-flex;
          width: fit-content;
          align-items: center;
          border-radius: 999px;
          padding: 6px 14px;
          color: ${isDark ? '#c0d4ff' : '#4573df'};
          background: ${isDark ? 'rgba(69, 115, 223, 0.18)' : 'rgba(69, 115, 223, 0.1)'};
          font-size: 0.72rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.12em;
        }
        .hero-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin: 28px 0 14px;
        }
        .primary-cta,
        .secondary-cta,
        .entry-card a,
        .package-card a {
          display: inline-flex;
          min-height: 48px;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          padding: 0 22px;
          font-weight: 800;
          text-decoration: none;
        }
        .primary-cta {
          color: #fff;
          background: linear-gradient(135deg, #ff9800, #f97316);
          box-shadow: 0 18px 34px rgba(249, 115, 22, 0.25);
        }
        .secondary-cta {
          color: ${isDark ? '#f8fafc' : '#1d2127'};
          border: 1px solid ${isDark ? 'rgba(255,255,255,0.16)' : 'rgba(15,23,42,0.12)'};
          background: ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.72)'};
        }
        .tool-note {
          max-width: 620px;
          font-size: 0.9rem;
        }
        .pricing-stack {
          position: relative;
          min-height: 420px;
          border-radius: 26px;
          border: 1px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(69,115,223,0.16)'};
          background:
            linear-gradient(
              145deg,
              ${isDark ? 'rgba(45,79,162,0.22)' : 'rgba(255,255,255,0.8)'},
              transparent
            ),
            ${isDark ? '#252b34' : '#ffffff'};
          box-shadow: ${isDark
            ? '0 28px 70px rgba(0,0,0,0.28)'
            : '0 28px 70px rgba(69,115,223,0.14)'};
          overflow: hidden;
        }
        .pricing-stack::before {
          content: '';
          position: absolute;
          inset: 28px;
          border-radius: 22px;
          border: 1px dashed ${isDark ? 'rgba(255,255,255,0.13)' : 'rgba(69,115,223,0.18)'};
        }
        .stack-card {
          position: absolute;
          left: 44px;
          right: 44px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          border-radius: 20px;
          padding: 24px;
          color: ${isDark ? '#f8fafc' : '#0f172a'};
          background: ${isDark ? '#0f172a' : '#f8fafc'};
          border: 1px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(69,115,223,0.14)'};
          box-shadow: 0 18px 40px rgba(0, 0, 0, 0.16);
        }
        .stack-card span {
          font-weight: 800;
        }
        .stack-card strong {
          color: #ff9800;
          white-space: nowrap;
        }
        .stack-card-1 {
          top: 70px;
        }
        .stack-card-2 {
          top: 168px;
          transform: translateX(20px);
        }
        .stack-card-3 {
          top: 266px;
          transform: translateX(40px);
        }
        .entry-section,
        .packages-section,
        .drivers-section,
        .faq-section,
        .final-cta {
          padding: 72px 0;
        }
        .section-head {
          max-width: 740px;
          margin: 0 auto 34px;
          text-align: center;
        }
        .section-head h2,
        .drivers-copy h2,
        .final-cta h2 {
          margin: 12px 0;
          font-size: clamp(1.8rem, 3.2vw, 2.8rem);
          line-height: 1.15;
          letter-spacing: 0;
        }
        .entry-grid,
        .package-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
        }
        .entry-card,
        .package-card,
        .drivers-section,
        .proof-strip,
        .faq-grid details,
        .final-cta {
          border: 1px solid ${isDark ? 'rgba(255,255,255,0.11)' : 'rgba(69,115,223,0.13)'};
          background: ${isDark ? '#252b34' : 'rgba(255,255,255,0.82)'};
          box-shadow: ${isDark
            ? '0 18px 42px rgba(0,0,0,0.22)'
            : '0 18px 42px rgba(69,115,223,0.09)'};
        }
        .entry-card,
        .package-card {
          display: flex;
          min-height: 350px;
          flex-direction: column;
          gap: 16px;
          border-radius: 22px;
          padding: 24px;
        }
        .entry-card h3,
        .package-card h3 {
          margin: 0;
          font-size: 1.15rem;
          line-height: 1.25;
        }
        .entry-card strong,
        .price {
          display: block;
          margin-top: 10px;
          color: #ff9800;
          font-size: 1.5rem;
          line-height: 1.15;
        }
        .entry-card p,
        .best-for,
        .timeline,
        .package-note {
          color: ${isDark ? '#cbd5e1' : '#526070'};
          font-size: 0.92rem;
          line-height: 1.65;
        }
        .entry-card ul,
        .package-card ul {
          flex: 1;
          margin: 0;
          padding: 0;
          list-style: none;
        }
        .entry-card li,
        .package-card li {
          margin: 0 0 10px;
          color: ${isDark ? '#e2e8f0' : '#334155'};
          font-size: 0.9rem;
        }
        .entry-card li::before,
        .package-card li::before {
          content: '✓';
          margin-right: 8px;
          color: #4573df;
          font-weight: 900;
        }
        .entry-card a,
        .package-card a {
          color: #fff;
          background: linear-gradient(135deg, #4573df, #2d4fa2);
        }
        .tab-list {
          display: flex;
          gap: 10px;
          overflow-x: auto;
          padding: 8px;
          border-radius: 999px;
          background: ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.76)'};
          border: 1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(69,115,223,0.12)'};
        }
        .tab-list button {
          min-height: 44px;
          flex: 1 0 auto;
          border: 0;
          border-radius: 999px;
          padding: 0 18px;
          color: ${isDark ? '#cbd5e1' : '#334155'};
          background: transparent;
          font: inherit;
          font-weight: 800;
          cursor: pointer;
        }
        .tab-list button.active {
          color: #fff;
          background: linear-gradient(135deg, #4573df, #2d4fa2);
          box-shadow: 0 12px 26px rgba(69, 115, 223, 0.24);
        }
        .category-summary {
          max-width: 820px;
          margin: 22px auto 28px;
          color: ${isDark ? '#cbd5e1' : '#526070'};
          text-align: center;
          line-height: 1.7;
        }
        .package-card {
          position: relative;
        }
        .package-card.featured {
          border-color: rgba(255, 152, 0, 0.45);
          box-shadow: ${isDark
            ? '0 24px 56px rgba(0,0,0,0.32)'
            : '0 24px 56px rgba(249,115,22,0.14)'};
          transform: translateY(-6px);
        }
        .popular-badge {
          width: fit-content;
          border-radius: 999px;
          padding: 5px 12px;
          color: #fff;
          background: linear-gradient(135deg, #ff9800, #f97316);
          font-size: 0.76rem;
          font-weight: 900;
        }
        .drivers-section {
          display: grid;
          grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
          gap: 32px;
          align-items: center;
          border-radius: 26px;
          padding: 38px;
        }
        .drivers-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }
        .drivers-grid span,
        .proof-strip span {
          border-radius: 999px;
          padding: 12px 14px;
          color: ${isDark ? '#e2e8f0' : '#334155'};
          background: ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(69,115,223,0.07)'};
          font-weight: 800;
          font-size: 0.88rem;
        }
        .proof-strip {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          align-items: center;
          justify-content: center;
          border-radius: 24px;
          padding: 24px;
        }
        .faq-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
        }
        .faq-grid details {
          border-radius: 18px;
          padding: 18px 20px;
        }
        .faq-grid summary {
          cursor: pointer;
          font-weight: 900;
        }
        .faq-grid p {
          color: ${isDark ? '#cbd5e1' : '#526070'};
          line-height: 1.65;
        }
        .final-cta {
          border-radius: 28px;
          text-align: center;
          padding: 48px 24px;
        }
        @media (max-width: 980px) {
          .pricing-hero,
          .drivers-section {
            grid-template-columns: 1fr;
          }
          .pricing-stack {
            min-height: 340px;
          }
          .stack-card {
            left: 24px;
            right: 24px;
          }
          .stack-card-1 {
            top: 42px;
          }
          .stack-card-2 {
            top: 138px;
            transform: none;
          }
          .stack-card-3 {
            top: 234px;
            transform: none;
          }
          .entry-grid,
          .package-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
        @media (max-width: 680px) {
          .pricing-main {
            width: min(100% - 24px, 1240px);
          }
          .pricing-hero {
            padding: 46px 0 34px;
          }
          .entry-section,
          .packages-section,
          .drivers-section,
          .faq-section,
          .final-cta {
            padding: 46px 0;
          }
          .hero-actions {
            flex-direction: column;
          }
          .entry-grid,
          .package-grid,
          .faq-grid,
          .drivers-grid {
            grid-template-columns: 1fr;
          }
          .entry-card,
          .package-card {
            min-height: auto;
          }
          .package-card.featured {
            transform: none;
          }
          .pricing-stack {
            min-height: 310px;
          }
          .stack-card {
            padding: 18px;
          }
        }
      `}</style>
    </div>
  );
}
