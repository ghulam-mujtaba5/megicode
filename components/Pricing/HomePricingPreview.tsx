import Link from 'next/link';

import { pricingEntrypoints } from '@/data/pricing';

import styles from './HomePricingPreview.module.css';

const REASSURANCE_CHIPS = [
  'Start small when scope is unclear',
  'Fixed-scope entry packages',
  'Milestone-based larger builds',
  'Third-party tools billed separately',
];

export default function HomePricingPreview() {
  return (
    <section className={styles.section} aria-labelledby="home-pricing-heading">
      <div className={styles.inner}>
        <div className={styles.head}>
          <span className={styles.eyebrow}>Clear starting points</span>
          <h2 id="home-pricing-heading" className={styles.title}>
            Clear ways to start without guessing the budget
          </h2>
          <p className={styles.sub}>
            Choose the first package that matches your scope: roadmap, automation, clinic setup, AI
            MVP, or custom platform.
          </p>
        </div>

        <div className={styles.grid}>
          {pricingEntrypoints.map((entry) => (
            <article className={styles.card} key={entry.title}>
              {'badge' in entry && entry.badge && (
                <span className={styles.badge}>{entry.badge}</span>
              )}
              <div>
                <h3 className={styles.cardName}>{entry.title}</h3>
                <strong className={styles.price}>{entry.price}</strong>
                {'supportText' in entry && entry.supportText && (
                  <span className={styles.supportLine}>{entry.supportText}</span>
                )}
                <p className={styles.bestFor}>{entry.bestFor}</p>
              </div>
              <Link
                className={styles.cardButton}
                href={entry.href}
                aria-label={`${entry.cta}: ${entry.title}`}
              >
                <span>{entry.cta}</span>
                <span className={styles.cardButtonIcon} aria-hidden="true">
                  →
                </span>
              </Link>
            </article>
          ))}
        </div>

        <div className={styles.chips} aria-label="How Megicode pricing works">
          {REASSURANCE_CHIPS.map((chip) => (
            <span key={chip} className={styles.chip}>
              {chip}
            </span>
          ))}
        </div>

        <div className={styles.actions}>
          <Link className={`${styles.button} ${styles.buttonPrimary}`} href="/pricing">
            <span>Compare Packages</span>
            <span className={styles.buttonIcon} aria-hidden="true">
              →
            </span>
          </Link>
          <Link
            className={`${styles.button} ${styles.buttonSecondary}`}
            href="/contact?source=home-pricing"
          >
            <span>Book a Fit Call</span>
            <span className={styles.buttonIcon} aria-hidden="true">
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
