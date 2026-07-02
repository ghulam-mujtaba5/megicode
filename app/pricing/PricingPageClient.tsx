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

const paymentTerms = [
  {
    title: 'Roadmap packages',
    detail: 'Paid upfront before the planning sprint starts.',
  },
  {
    title: 'Automation and clinic setup',
    detail: 'Usually 60% upfront and 40% before handoff.',
  },
  {
    title: 'MVP and platform builds',
    detail: 'Milestone-based after scope, deliverables, and timeline are approved.',
  },
];

const comparisonRows = [
  {
    feature: 'Best starting point',
    starter: 'Roadmap or one workflow',
    growth: 'Automation, clinic, MVP, or platform build',
    advanced: 'Complex workflows, roles, data, or integrations',
  },
  {
    feature: 'Scope style',
    starter: 'Fixed and narrow',
    growth: 'Fixed package with clear deliverables',
    advanced: 'Milestone-based after scope review',
  },
  {
    feature: 'Typical buyer',
    starter: 'Founder validating scope',
    growth: 'Business ready to implement',
    advanced: 'Team replacing or scaling systems',
  },
  {
    feature: 'Support',
    starter: 'Handoff or light launch support',
    growth: 'Launch support included',
    advanced: 'Monthly support recommended',
  },
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
                <span>Book an Intro Call</span>
                <span className="cta-icon" aria-hidden="true">
                  →
                </span>
              </Link>
              <a className="secondary-cta" href="#packages">
                <span>Compare Packages</span>
                <span className="cta-icon" aria-hidden="true">
                  →
                </span>
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
          <div className="start-guidance">
            <strong>Not sure where to start?</strong>
            <span>Choose MVP Roadmap if the scope is unclear.</span>
          </div>

          <div className="package-grid">
            {activeCategory.packages.map((item) => (
              <article
                className={`package-card ${item.featured ? 'featured' : ''}`}
                key={item.name}
              >
                {item.featured && (
                  <span className="popular-badge">{item.featuredLabel ?? 'Most Popular'}</span>
                )}
                <h3>{item.name}</h3>
                <p className="best-for">{item.bestFor}</p>
                <strong className="price">{item.price}</strong>
                <div className="package-meta" aria-label={`${item.name} delivery details`}>
                  <span>
                    <strong>Timeline</strong>
                    {item.timeline}
                  </span>
                  <span>
                    <strong>Support</strong>
                    {item.support}
                  </span>
                </div>
                <ul>
                  {item.includes.map((include) => (
                    <li key={include}>{include}</li>
                  ))}
                </ul>
                {item.note && <p className="package-note">{item.note}</p>}
                <Link
                  className="pricing-card-button"
                  href={item.href}
                  aria-label={`${item.cta}: ${item.name}`}
                >
                  <span>{item.cta}</span>
                  <span className="pricing-card-button-icon" aria-hidden="true">
                    →
                  </span>
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="comparison-section" aria-labelledby="comparison-heading">
          <div className="section-head">
            <span className="eyebrow">Comparison</span>
            <h2 id="comparison-heading">Choose the safest buying path.</h2>
            <p>
              Start with the smallest useful commitment when scope is unclear. Move into Growth or
              Advanced once the workflow, product, and proof requirements are clear.
            </p>
          </div>
          <div className="comparison-table" role="table" aria-label="Pricing path comparison">
            <div className="comparison-row comparison-head" role="row">
              <span role="columnheader">Feature</span>
              <span role="columnheader">Starter</span>
              <span role="columnheader">Growth</span>
              <span role="columnheader">Advanced</span>
            </div>
            {comparisonRows.map((row) => (
              <div className="comparison-row" role="row" key={row.feature}>
                <span role="cell">{row.feature}</span>
                <span role="cell">{row.starter}</span>
                <span role="cell">{row.growth}</span>
                <span role="cell">{row.advanced}</span>
              </div>
            ))}
          </div>
          <div className="comparison-cards" aria-label="Pricing path comparison">
            {comparisonRows.map((row) => (
              <details key={row.feature}>
                <summary>{row.feature}</summary>
                <div className="comparison-card-body">
                  <p>
                    <strong>Starter:</strong> {row.starter}
                  </p>
                  <p>
                    <strong>Growth:</strong> {row.growth}
                  </p>
                  <p>
                    <strong>Advanced:</strong> {row.advanced}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </section>

        <section className="fit-section" aria-labelledby="fit-heading">
          <div className="section-head">
            <span className="eyebrow">Fit check</span>
            <h2 id="fit-heading">A better fit for serious builds.</h2>
            <p>
              These guidelines keep the first call focused and help both sides avoid mismatched
              expectations.
            </p>
          </div>
          <div className="fit-grid">
            <div className="fit-card fit-positive">
              <h3>Megicode is a good fit if:</h3>
              <ul>
                <li>You want a real business system, not only a demo</li>
                <li>You need AI, automation, SaaS, or custom platform work</li>
                <li>You want clear scope and milestone-based delivery</li>
              </ul>
            </div>
            <div className="fit-card fit-negative">
              <h3>Not the best fit if:</h3>
              <ul>
                <li>You only need a $100 template website</li>
                <li>You want unlimited scope without planning</li>
                <li>You do not want to pay upfront or milestone payments</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="payment-section" aria-labelledby="payment-heading">
          <div className="payment-copy">
            <span className="eyebrow">Payment clarity</span>
            <h2 id="payment-heading">Simple terms before a proposal.</h2>
            <p>Final payment structure is confirmed in the proposal before work starts.</p>
          </div>
          <div className="payment-grid">
            {paymentTerms.map((term, index) => (
              <article key={term.title}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <h3>{term.title}</h3>
                <p>{term.detail}</p>
              </article>
            ))}
          </div>
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
            Book a free intro call and we&apos;ll recommend the safest starting point based on your
            goals, scope, and budget.
          </p>
          <Link className="primary-cta" href="/contact?source=pricing-final">
            <span>Book an Intro Call</span>
            <span className="cta-icon" aria-hidden="true">
              →
            </span>
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
          padding: 90px 0 80px;
        }
        @media (max-width: 768px) {
          .pricing-main {
            padding-top: 18px;
          }
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
        .secondary-cta {
          display: inline-flex;
          box-sizing: border-box;
          min-width: 190px;
          min-height: 48px;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          border-radius: 999px;
          border: 1px solid transparent;
          padding: 0 22px;
          font-weight: 900;
          text-decoration: none;
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            background 0.2s ease,
            border-color 0.2s ease,
            color 0.2s ease;
        }
        .primary-cta:hover,
        .primary-cta:focus-visible,
        .secondary-cta:hover,
        .secondary-cta:focus-visible {
          transform: translateY(-1px);
          outline: none;
        }
        .primary-cta {
          color: ${isDark ? '#f8fafc' : '#1d2127'};
          border-color: rgba(255, 152, 0, 0.72);
          background: ${isDark ? 'rgba(255,255,255,0.055)' : 'rgba(255,255,255,0.78)'};
          box-shadow: ${isDark
            ? '0 14px 30px rgba(0,0,0,0.18)'
            : '0 14px 30px rgba(15,23,42,0.08)'};
        }
        .secondary-cta {
          color: ${isDark ? '#f8fafc' : '#1d2127'};
          border: 1px solid ${isDark ? 'rgba(255,255,255,0.16)' : 'rgba(15,23,42,0.12)'};
          background: ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.72)'};
        }
        .primary-cta:hover,
        .primary-cta:focus-visible,
        .secondary-cta:hover,
        .secondary-cta:focus-visible {
          color: #ff9800;
          border-color: rgba(255, 152, 0, 0.72);
          background: rgba(255, 152, 0, 0.14);
          box-shadow: 0 18px 34px rgba(249, 115, 22, 0.16);
        }
        .cta-icon {
          width: auto;
          height: auto;
          flex: 0 0 auto;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: currentColor;
          background: transparent;
          line-height: 1;
          transition:
            transform 0.2s ease,
            color 0.2s ease;
        }
        .primary-cta span:first-child,
        .secondary-cta span:first-child,
        .pricing-card-button span:first-child {
          min-width: 0;
          overflow-wrap: anywhere;
        }
        .secondary-cta .cta-icon {
          color: #ff9800;
          background: transparent;
        }
        .primary-cta:hover .cta-icon,
        .primary-cta:focus-visible .cta-icon,
        .secondary-cta:hover .cta-icon,
        .secondary-cta:focus-visible .cta-icon {
          transform: translateX(2px);
        }
        .primary-cta:hover .cta-icon,
        .primary-cta:focus-visible .cta-icon,
        .secondary-cta:hover .cta-icon,
        .secondary-cta:focus-visible .cta-icon {
          color: #ff9800;
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
        .comparison-section,
        .fit-section,
        .drivers-section,
        .proof-section,
        .payment-section,
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
        .proof-copy h2,
        .payment-section h2,
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
        .comparison-table,
        .comparison-cards details,
        .fit-card,
        .drivers-section,
        .proof-section,
        .payment-section,
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
          flex-direction: column;
          gap: 16px;
          border-radius: 22px;
          padding: 24px;
        }
        .entry-card {
          min-height: 250px;
        }
        .package-card {
          min-height: 430px;
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
        .package-meta,
        .package-note {
          color: ${isDark ? '#cbd5e1' : '#526070'};
          font-size: 0.92rem;
          line-height: 1.65;
        }
        .package-meta {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
        }
        .package-meta span {
          display: grid;
          gap: 3px;
          border-radius: 14px;
          padding: 12px;
          color: ${isDark ? '#e2e8f0' : '#334155'};
          background: ${isDark ? 'rgba(255,255,255,0.055)' : 'rgba(69,115,223,0.07)'};
        }
        .package-meta strong {
          color: ${isDark ? '#c0d4ff' : '#2d4fa2'};
          font-size: 0.72rem;
          line-height: 1.2;
          text-transform: uppercase;
          letter-spacing: 0.08em;
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
        .pricing-card-button {
          display: inline-flex;
          box-sizing: border-box;
          width: 100%;
          min-height: 46px;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          border-radius: 999px;
          border: 1px solid ${isDark ? 'rgba(255,255,255,0.14)' : 'rgba(15,23,42,0.12)'};
          padding: 0 18px;
          color: ${isDark ? '#f8fafc' : '#1d2127'};
          background: ${isDark ? 'rgba(255,255,255,0.055)' : 'rgba(15,23,42,0.035)'};
          font-size: 0.9rem;
          font-weight: 900;
          line-height: 1.2;
          text-decoration: none;
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            background 0.2s ease,
            border-color 0.2s ease,
            color 0.2s ease;
        }
        .pricing-card-button:hover,
        .pricing-card-button:focus-visible {
          transform: translateY(-1px);
          border-color: rgba(255, 152, 0, 0.72);
          color: #ff9800;
          background: rgba(255, 152, 0, 0.12);
          box-shadow: 0 16px 30px rgba(249, 115, 22, 0.14);
          outline: none;
        }
        .pricing-card-button:focus-visible {
          box-shadow:
            0 0 0 3px rgba(255, 152, 0, 0.22),
            0 16px 30px rgba(249, 115, 22, 0.22);
        }
        .pricing-card-button-icon {
          width: auto;
          height: auto;
          flex: 0 0 auto;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #ff9800;
          background: transparent;
          font-size: 1rem;
          line-height: 1;
          transition:
            transform 0.2s ease,
            color 0.2s ease;
        }
        .pricing-card-button:hover .pricing-card-button-icon,
        .pricing-card-button:focus-visible .pricing-card-button-icon {
          transform: translateX(2px);
          color: #ff9800;
        }
        .comparison-table {
          overflow: hidden;
          border-radius: 22px;
        }
        .comparison-cards {
          display: none;
        }
        .comparison-cards details {
          border-radius: 18px;
          overflow: hidden;
        }
        .comparison-cards summary {
          min-height: 56px;
          padding: 16px 18px;
          color: ${isDark ? '#f8fafc' : '#0f172a'};
          cursor: pointer;
          font-weight: 900;
          line-height: 1.35;
        }
        .comparison-cards summary:focus-visible {
          outline: 3px solid rgba(255, 152, 0, 0.26);
          outline-offset: -3px;
        }
        .comparison-card-body {
          display: grid;
          gap: 10px;
          padding: 0 18px 18px;
        }
        .comparison-card-body p {
          margin: 0;
          color: ${isDark ? '#cbd5e1' : '#526070'};
          line-height: 1.55;
        }
        .comparison-card-body strong {
          color: #4573df;
        }
        .comparison-row {
          display: grid;
          grid-template-columns: 1fr repeat(3, minmax(0, 1.05fr));
          border-bottom: 1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(69,115,223,0.1)'};
        }
        .comparison-row:last-child {
          border-bottom: 0;
        }
        .comparison-row span {
          padding: 16px;
          color: ${isDark ? '#cbd5e1' : '#526070'};
          font-size: 0.92rem;
          line-height: 1.5;
          font-weight: 650;
        }
        .comparison-row span:first-child {
          color: ${isDark ? '#f8fafc' : '#0f172a'};
          font-weight: 900;
        }
        .comparison-head {
          background: ${isDark ? 'rgba(69,115,223,0.16)' : 'rgba(69,115,223,0.08)'};
        }
        .comparison-head span {
          color: ${isDark ? '#f8fafc' : '#1d2127'};
          font-weight: 900;
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
          margin: 22px auto 16px;
          color: ${isDark ? '#cbd5e1' : '#526070'};
          text-align: center;
          line-height: 1.7;
        }
        .start-guidance {
          display: flex;
          flex-wrap: wrap;
          width: fit-content;
          max-width: 100%;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin: 0 auto 28px;
          border-radius: 999px;
          border: 1px solid ${isDark ? 'rgba(255,255,255,0.13)' : 'rgba(69,115,223,0.14)'};
          padding: 10px 16px;
          color: ${isDark ? '#e2e8f0' : '#334155'};
          background: ${isDark ? 'rgba(255,255,255,0.055)' : 'rgba(255,255,255,0.76)'};
          font-size: 0.9rem;
          line-height: 1.4;
        }
        .start-guidance strong {
          color: #ff9800;
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
          color: #ff9800;
          border: 1px solid rgba(255, 152, 0, 0.6);
          background: rgba(255, 152, 0, 0.1);
          font-size: 0.76rem;
          font-weight: 900;
        }
        .drivers-section {
          display: grid;
          grid-template-columns: minmax(0, 0.72fr) minmax(0, 1.28fr);
          gap: 32px;
          align-items: center;
          border-radius: 26px;
          padding: 38px;
          overflow: hidden;
          position: relative;
        }
        .drivers-section::after {
          content: '';
          position: absolute;
          width: 220px;
          height: 220px;
          right: -90px;
          top: -90px;
          border-radius: 999px;
          background: rgba(255, 152, 0, 0.1);
          pointer-events: none;
        }
        .drivers-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
          position: relative;
          z-index: 1;
        }
        .drivers-grid article {
          display: grid;
          grid-template-columns: 38px minmax(0, 1fr);
          gap: 12px;
          min-height: 126px;
          border-radius: 20px;
          border: 1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(69,115,223,0.12)'};
          padding: 18px;
          color: ${isDark ? '#e2e8f0' : '#334155'};
          background: ${isDark ? 'rgba(15,23,42,0.34)' : 'rgba(255,255,255,0.68)'};
          box-shadow: ${isDark
            ? 'inset 0 1px 0 rgba(255,255,255,0.04)'
            : '0 12px 24px rgba(69,115,223,0.06)'};
        }
        .drivers-grid article > span {
          width: 38px;
          height: 38px;
          display: inline-flex;
          border-radius: 14px;
          background:
            linear-gradient(135deg, rgba(255, 152, 0, 0.95), rgba(249, 115, 22, 0.9)), #ff9800;
          box-shadow: 0 12px 22px rgba(249, 115, 22, 0.22);
        }
        .drivers-grid article > span::after {
          content: '';
          width: 16px;
          height: 16px;
          margin: auto;
          border-radius: 5px;
          border: 2px solid rgba(255, 255, 255, 0.9);
        }
        .drivers-grid h3 {
          margin: 0 0 6px;
          color: ${isDark ? '#f8fafc' : '#0f172a'};
          font-size: 0.98rem;
          line-height: 1.3;
        }
        .drivers-grid p {
          margin: 0;
          color: ${isDark ? '#cbd5e1' : '#526070'};
          font-size: 0.9rem;
          line-height: 1.55;
        }
        .proof-section {
          display: grid;
          grid-template-columns: minmax(0, 0.88fr) minmax(0, 1.12fr);
          gap: 34px;
          align-items: start;
          border-radius: 26px;
          padding: 38px;
        }
        .proof-copy p {
          color: ${isDark ? '#cbd5e1' : '#526070'};
          line-height: 1.75;
        }
        .proof-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 22px;
        }
        .proof-panel {
          display: grid;
          gap: 16px;
        }
        .proof-metrics {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          overflow: hidden;
          border-radius: 20px;
          border: 1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(69,115,223,0.1)'};
        }
        .proof-item {
          display: grid;
          align-content: start;
          gap: 6px;
          min-height: 118px;
          padding: 22px;
          border-right: 1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(69,115,223,0.1)'};
          background: ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(69,115,223,0.055)'};
        }
        .proof-item:last-child {
          border-right: 0;
        }
        .proof-item strong {
          color: #ff9800;
          font-size: 1.45rem;
          line-height: 1;
        }
        .proof-item span {
          color: ${isDark ? '#e2e8f0' : '#334155'};
          font-size: 0.92rem;
          font-weight: 800;
          line-height: 1.45;
        }
        .proof-work {
          display: grid;
          gap: 12px;
        }
        .proof-work article {
          border-radius: 18px;
          padding: 18px;
          background: ${isDark ? 'rgba(15,23,42,0.38)' : 'rgba(255,255,255,0.68)'};
          border: 1px solid ${isDark ? 'rgba(255,255,255,0.09)' : 'rgba(69,115,223,0.1)'};
        }
        .proof-work h3 {
          margin: 0 0 8px;
          color: ${isDark ? '#f8fafc' : '#0f172a'};
          font-size: 1rem;
          line-height: 1.3;
        }
        .proof-work p {
          margin: 0;
          color: ${isDark ? '#cbd5e1' : '#526070'};
          line-height: 1.65;
        }
        .payment-section {
          display: grid;
          grid-template-columns: minmax(0, 0.62fr) minmax(0, 1.38fr);
          gap: 28px;
          align-items: center;
          border-radius: 26px;
          padding: 38px;
        }
        .payment-copy p {
          margin: 0;
          color: ${isDark ? '#cbd5e1' : '#526070'};
          line-height: 1.7;
        }
        .payment-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
        }
        .payment-grid article {
          margin: 0;
          min-height: 168px;
          border-radius: 22px;
          border: 1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(69,115,223,0.12)'};
          padding: 20px;
          color: ${isDark ? '#e2e8f0' : '#334155'};
          background: ${isDark ? 'rgba(15,23,42,0.34)' : 'rgba(255,255,255,0.68)'};
        }
        .payment-grid article > span {
          display: inline-flex;
          margin-bottom: 18px;
          color: #ff9800;
          font-size: 0.78rem;
          font-weight: 900;
          letter-spacing: 0.12em;
        }
        .payment-grid h3 {
          margin: 0 0 10px;
          color: ${isDark ? '#f8fafc' : '#0f172a'};
          font-size: 1rem;
          line-height: 1.35;
        }
        .payment-grid p {
          margin: 0;
          color: ${isDark ? '#cbd5e1' : '#526070'};
          line-height: 1.55;
        }
        .fit-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
        }
        .fit-card {
          border-radius: 24px;
          padding: 28px;
        }
        .fit-card h3 {
          margin: 0 0 18px;
          font-size: 1.12rem;
        }
        .fit-card ul {
          display: grid;
          gap: 12px;
          margin: 0;
          padding: 0;
          list-style: none;
        }
        .fit-card li {
          color: ${isDark ? '#e2e8f0' : '#334155'};
          line-height: 1.55;
        }
        .fit-positive li::before,
        .fit-negative li::before {
          margin-right: 9px;
          font-weight: 900;
        }
        .fit-positive li::before {
          content: '✓';
          color: #4573df;
        }
        .fit-negative li::before {
          content: '✕';
          color: #ff9800;
        }
        .faq-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
        }
        .faq-grid details {
          border-radius: 20px;
          padding: 0;
          overflow: hidden;
        }
        .faq-grid summary {
          min-height: 58px;
          padding: 18px 20px;
          cursor: pointer;
          font-weight: 900;
          line-height: 1.35;
          list-style-position: inside;
        }
        .faq-grid details[open] summary {
          color: #ff9800;
          background: ${isDark ? 'rgba(255,255,255,0.045)' : 'rgba(255,152,0,0.08)'};
        }
        .faq-grid summary:focus-visible {
          outline: 3px solid rgba(255, 152, 0, 0.26);
          outline-offset: -3px;
        }
        .faq-grid p {
          margin: 0;
          padding: 0 20px 20px;
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
          .drivers-section,
          .proof-section,
          .payment-section {
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
          .proof-metrics,
          .payment-grid,
          .fit-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
          .proof-item:nth-child(2) {
            border-right: 0;
          }
          .proof-item:nth-child(-n + 2) {
            border-bottom: 1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(69,115,223,0.1)'};
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
          .comparison-section,
          .fit-section,
          .drivers-section,
          .proof-section,
          .payment-section,
          .faq-section,
          .final-cta {
            padding: 46px 0;
          }
          .hero-actions {
            flex-direction: column;
          }
          .primary-cta,
          .secondary-cta,
          .pricing-card-button {
            width: 100%;
          }
          .entry-grid,
          .package-grid,
          .faq-grid,
          .drivers-grid,
          .payment-grid,
          .fit-grid {
            grid-template-columns: 1fr;
          }
          .comparison-table {
            display: none;
          }
          .comparison-cards {
            display: grid;
            gap: 12px;
          }
          .entry-card,
          .package-card {
            min-height: auto;
          }
          .package-meta {
            grid-template-columns: 1fr;
          }
          .package-card.featured {
            transform: none;
          }
          .start-guidance {
            width: 100%;
            border-radius: 18px;
            text-align: center;
          }
          .proof-metrics {
            grid-template-columns: 1fr;
          }
          .proof-item,
          .proof-item:nth-child(2) {
            border-right: 0;
          }
          .proof-item {
            min-height: auto;
            border-bottom: 1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(69,115,223,0.1)'};
          }
          .proof-item:last-child {
            border-bottom: 0;
          }
          .payment-section,
          .drivers-section,
          .proof-section {
            padding: 24px;
          }
          .drivers-grid article,
          .payment-grid article {
            min-height: auto;
          }
          .pricing-stack {
            min-height: 310px;
          }
          .stack-card {
            padding: 18px;
          }
        }
      `}</style>
      <style jsx global>{`
        .pricing-page .primary-cta,
        .pricing-page .secondary-cta {
          display: inline-flex;
          box-sizing: border-box;
          min-width: 190px;
          min-height: 48px;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          border-radius: 999px;
          border: 1px solid transparent;
          padding: 0 22px;
          font-weight: 900;
          text-decoration: none;
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            background 0.2s ease,
            border-color 0.2s ease,
            color 0.2s ease;
        }
        .pricing-page .primary-cta:hover,
        .pricing-page .primary-cta:focus-visible,
        .pricing-page .secondary-cta:hover,
        .pricing-page .secondary-cta:focus-visible {
          transform: translateY(-1px);
          outline: none;
        }
        .pricing-page .primary-cta {
          color: ${isDark ? '#f8fafc' : '#1d2127'};
          border-color: rgba(255, 152, 0, 0.72);
          background: ${isDark ? 'rgba(255,255,255,0.055)' : 'rgba(255,255,255,0.78)'};
          box-shadow: ${isDark
            ? '0 14px 30px rgba(0,0,0,0.18)'
            : '0 14px 30px rgba(15,23,42,0.08)'};
        }
        .pricing-page .secondary-cta {
          color: ${isDark ? '#f8fafc' : '#1d2127'};
          border: 1px solid ${isDark ? 'rgba(255,255,255,0.16)' : 'rgba(15,23,42,0.12)'};
          background: ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.72)'};
        }
        .pricing-page .primary-cta:hover,
        .pricing-page .primary-cta:focus-visible,
        .pricing-page .secondary-cta:hover,
        .pricing-page .secondary-cta:focus-visible {
          color: #ff9800;
          border-color: rgba(255, 152, 0, 0.72);
          background: rgba(255, 152, 0, 0.14);
          box-shadow: 0 18px 34px rgba(249, 115, 22, 0.16);
        }
        .pricing-page .cta-icon {
          width: auto;
          height: auto;
          flex: 0 0 auto;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: currentColor;
          background: transparent;
          line-height: 1;
          transition:
            transform 0.2s ease,
            color 0.2s ease;
        }
        .pricing-page .primary-cta span:first-child,
        .pricing-page .secondary-cta span:first-child,
        .pricing-page .pricing-card-button span:first-child {
          min-width: 0;
          overflow-wrap: anywhere;
        }
        .pricing-page .secondary-cta .cta-icon {
          color: #ff9800;
          background: transparent;
        }
        .pricing-page .primary-cta:hover .cta-icon,
        .pricing-page .primary-cta:focus-visible .cta-icon,
        .pricing-page .secondary-cta:hover .cta-icon,
        .pricing-page .secondary-cta:focus-visible .cta-icon {
          transform: translateX(2px);
        }
        .pricing-page .primary-cta:hover .cta-icon,
        .pricing-page .primary-cta:focus-visible .cta-icon,
        .pricing-page .secondary-cta:hover .cta-icon,
        .pricing-page .secondary-cta:focus-visible .cta-icon {
          color: #ff9800;
        }
        .pricing-page .pricing-card-button {
          display: inline-flex;
          box-sizing: border-box;
          width: 100%;
          min-height: 46px;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          border-radius: 999px;
          border: 1px solid ${isDark ? 'rgba(255,255,255,0.14)' : 'rgba(15,23,42,0.12)'};
          padding: 0 18px;
          color: ${isDark ? '#f8fafc' : '#1d2127'};
          background: ${isDark ? 'rgba(255,255,255,0.055)' : 'rgba(15,23,42,0.035)'};
          font-size: 0.9rem;
          font-weight: 900;
          line-height: 1.2;
          text-decoration: none;
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            background 0.2s ease,
            border-color 0.2s ease,
            color 0.2s ease;
        }
        .pricing-page .pricing-card-button:hover,
        .pricing-page .pricing-card-button:focus-visible {
          transform: translateY(-1px);
          border-color: rgba(255, 152, 0, 0.72);
          color: #ff9800;
          background: rgba(255, 152, 0, 0.12);
          box-shadow: 0 16px 30px rgba(249, 115, 22, 0.14);
          outline: none;
        }
        .pricing-page .pricing-card-button:focus-visible {
          box-shadow:
            0 0 0 3px rgba(255, 152, 0, 0.22),
            0 16px 30px rgba(249, 115, 22, 0.22);
        }
        .pricing-page .pricing-card-button-icon {
          width: auto;
          height: auto;
          flex: 0 0 auto;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #ff9800;
          background: transparent;
          font-size: 1rem;
          line-height: 1;
          transition:
            transform 0.2s ease,
            color 0.2s ease;
        }
        .pricing-page .pricing-card-button:hover .pricing-card-button-icon,
        .pricing-page .pricing-card-button:focus-visible .pricing-card-button-icon {
          transform: translateX(2px);
          color: #ff9800;
        }
        @media (max-width: 680px) {
          .pricing-page .primary-cta,
          .pricing-page .secondary-cta,
          .pricing-page .pricing-card-button {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
