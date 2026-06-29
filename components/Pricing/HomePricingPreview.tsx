'use client';

import Link from 'next/link';

import { pricingEntrypoints } from '@/data/pricing';

import { useTheme } from '@/context/ThemeContext';

export default function HomePricingPreview() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <section
      className={`pricing-preview ${isDark ? 'dark' : 'light'}`}
      aria-labelledby="home-pricing-heading"
    >
      <div className="pricing-preview-inner">
        <div className="section-head">
          <span>Clear starting points</span>
          <h2 id="home-pricing-heading">Clear ways to start without guessing the budget</h2>
          <p>
            Start small with a roadmap or automation package, then scale into a full MVP or custom
            platform when the scope is clear.
          </p>
        </div>

        <div className="preview-grid">
          {pricingEntrypoints.map((entry) => (
            <article className="preview-card" key={entry.title}>
              <h3>{entry.title}</h3>
              <strong>{entry.price}</strong>
              <p>{entry.bestFor}</p>
            </article>
          ))}
        </div>

        <div className="preview-actions">
          <Link className="primary-link" href="/pricing">
            View Pricing
          </Link>
          <Link className="secondary-link" href="/contact?source=home-pricing">
            Book Free Fit Call
          </Link>
        </div>
      </div>

      <style jsx>{`
        .pricing-preview {
          width: 100%;
          padding: 5rem 1.25rem;
          font-family: 'Open Sans', sans-serif;
        }
        .pricing-preview-inner {
          width: min(1220px, 100%);
          margin: 0 auto;
        }
        .section-head {
          max-width: 780px;
          margin: 0 auto 2rem;
          text-align: center;
        }
        .section-head span {
          display: inline-flex;
          border-radius: 999px;
          padding: 6px 14px;
          background: ${isDark ? 'rgba(69, 115, 223, 0.18)' : 'rgba(69, 115, 223, 0.1)'};
          color: ${isDark ? '#c0d4ff' : '#4573df'};
          font-size: 0.72rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.12em;
        }
        .section-head h2 {
          margin: 12px 0;
          color: ${isDark ? '#f8fafc' : '#111827'};
          font-size: clamp(1.8rem, 3.2vw, 2.65rem);
          line-height: 1.15;
          letter-spacing: 0;
        }
        .section-head p {
          margin: 0;
          color: ${isDark ? '#cbd5e1' : '#526070'};
          line-height: 1.75;
        }
        .preview-grid {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 14px;
        }
        .preview-card {
          min-height: 210px;
          border-radius: 20px;
          padding: 20px;
          border: 1px solid ${isDark ? 'rgba(255,255,255,0.11)' : 'rgba(69,115,223,0.13)'};
          background: ${isDark ? '#252b34' : 'rgba(255,255,255,0.84)'};
          box-shadow: ${isDark
            ? '0 18px 42px rgba(0,0,0,0.22)'
            : '0 18px 42px rgba(69,115,223,0.08)'};
        }
        .preview-card h3 {
          margin: 0 0 10px;
          color: ${isDark ? '#f8fafc' : '#111827'};
          font-size: 1rem;
          line-height: 1.3;
        }
        .preview-card strong {
          display: block;
          color: #ff9800;
          font-size: 1.22rem;
          line-height: 1.2;
        }
        .preview-card p {
          margin: 14px 0 0;
          color: ${isDark ? '#cbd5e1' : '#526070'};
          font-size: 0.86rem;
          line-height: 1.62;
        }
        .preview-actions {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 12px;
          margin-top: 2rem;
        }
        .primary-link,
        .secondary-link {
          display: inline-flex;
          min-height: 48px;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          padding: 0 22px;
          font-weight: 800;
          text-decoration: none;
        }
        .primary-link {
          color: #fff;
          background: linear-gradient(135deg, #4573df, #2d4fa2);
          box-shadow: 0 16px 34px rgba(69, 115, 223, 0.22);
        }
        .secondary-link {
          color: #fff;
          background: linear-gradient(135deg, #ff9800, #f97316);
          box-shadow: 0 16px 34px rgba(249, 115, 22, 0.24);
        }
        @media (max-width: 1120px) {
          .preview-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }
        @media (max-width: 720px) {
          .pricing-preview {
            padding: 3.5rem 1rem;
          }
          .preview-grid {
            grid-template-columns: 1fr;
          }
          .preview-card {
            min-height: auto;
          }
          .preview-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </section>
  );
}
