import styles from './ServiceDetail.module.css';
import Image from 'next/image';
import { useCalendlyModal } from '../CalendlyModal';

export default function DataAnalyticsBIService() {
  const [openCalendly, calendlyModal] = useCalendlyModal();
  return (
    <section className={styles.serviceDetail}>
      {/* Hero Section */}
      <div className={styles.heroSection} style={{ background: 'linear-gradient(90deg, #4573df 0%, #cfe8ef 100%)', padding: '2rem 1rem', borderRadius: '1rem', marginBottom: '2.5rem' }}>
        <div className={styles.heroText}>
          <h1>Actionable Insights from Complex Data</h1>
          <p>Turn raw data into executive intelligence with custom dashboards, prediction models, and KPI analytics. Empower your team with clean, interactive visualizations and predictive tooling.</p>
          <>
            <button
              type="button"
              className={styles.ctaButton}
              style={{ marginTop: '1.2rem' }}
              onClick={openCalendly}
            >
              Get Started
            </button>
            {calendlyModal}
          </>
        </div>
        <div className={styles.heroVisual}>
          {/* Lottie animation placeholder */}
          <Image src="/Big Data Analytics.svg" alt="Bar Chart Animation" width={96} height={96} />
        </div>
      </div>

      {/* Overview */}
      <div className={styles.section}>
        <h2>Overview</h2>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: 1 }}>
            <p>Megicode turns raw data into executive intelligence through custom dashboards, prediction models, and KPI analytics. We empower teams to make confident decisions using clean, interactive visualizations and predictive tooling.</p>
            <p>Our solutions help users, teams, and stakeholders gain clarity, reduce risk, and drive business growth through actionable insights.</p>
          </div>
          <div style={{ flex: '0 0 120px', textAlign: 'center' }}>
            <Image src="/data visualization icon.svg" alt="Data Visualization" width={80} height={80} />
          </div>
        </div>
      </div>

      {/* Why It Matters */}
      <div className={styles.section}>
        <h2>Why It Matters</h2>
        <ul>
          <li><span data-animate="countup" data-value="23">23x</span> more likely to acquire customers for data-driven companies (McKinsey)</li>
          <li>70% of digital initiatives fail due to poor visibility into metrics</li>
        </ul>
      </div>

      {/* Our Process */}
      <div className={styles.section}>
        <h2>Our Process</h2>
        <ol className={styles.processList}>
          <li>
            <Image src="/data scrapping icon.svg" alt="Data Audit" width={40} height={40} />
            <span>Data Audit & Goal Setting</span>
          </li>
          <li>
            <Image src="/devlopment-icon.svg" alt="Modeling" width={40} height={40} />
            <span>Data Modeling & ETL</span>
          </li>
          <li>
            <Image src="/data visualization icon.svg" alt="Dashboard" width={40} height={40} />
            <span>Dashboard Prototypes</span>
          </li>
          <li>
            <Image src="/ds&ai-icon.svg" alt="Prediction" width={40} height={40} />
            <span>AI-enhanced Prediction Tools</span>
          </li>
          <li>
            <Image src="/Desktop-App-icon.svg" alt="Continuous Insights" width={40} height={40} />
            <span>Continuous Insights & Optimization</span>
          </li>
        </ol>
      </div>

      {/* Deliverables */}
      <div className={styles.section}>
        <h2>What You Get</h2>
        <ul>
          <li>BI dashboards</li>
          <li>SQL pipelines</li>
          <li>Forecasting models</li>
          <li>Self-serve analytics</li>
        </ul>
      </div>

      {/* Use Cases & Industries */}
      <div className={styles.section}>
        <h2>Use Cases & Industries</h2>
        <ul>
          <li>Executive KPIs</li>
          <li>Customer lifetime value</li>
          <li>Fraud detection</li>
          <li>Ops automation</li>
        </ul>
      </div>

      {/* Example Project / Case Study */}
      <div className={styles.section}>
        <h2>Example Project</h2>
        <p><strong>Real-time Sales Analytics Dashboard</strong>: Enabled a retail client to increase upsell revenue by 18% and reduce reporting time from days to minutes.</p>
      </div>

      {/* Client Benefits / ROI */}
      <div className={styles.section}>
        <h2>Client Benefits</h2>
        <ul>
          <li>Faster decision-making</li>
          <li>Improved forecasting</li>
          <li>Reduced operational risk</li>
        </ul>
      </div>

      {/* Tools & Technologies */}
      <div className={styles.section}>
        <h2>Tools & Technologies</h2>
        <div className={styles.techIcons}>
          <Image src="/meta/PowerBI.png" alt="Power BI" width={40} height={40} title="Power BI" />
          <Image src="/meta/Tableau.png" alt="Tableau" width={40} height={40} title="Tableau" />
          <Image src="/meta/SQL.png" alt="SQL" width={40} height={40} title="SQL" />
          <Image src="/meta/Python.png" alt="Python" width={40} height={40} title="Python" />
          <Image src="/meta/Spark.png" alt="Spark" width={40} height={40} title="Spark" />
          <Image src="/meta/Looker.png" alt="Looker" width={40} height={40} title="Looker" />
        </div>
      </div>

      {/* Certifications & Best Practices */}
      <div className={styles.section}>
        <h2>Certifications & Best Practices</h2>
        <ul>
          <li>ISO 27001 data handling practices</li>
        </ul>
      </div>

      {/* Call to Action */}
      <div className={styles.ctaSection}>
        <button type="button" className={styles.ctaButton} onClick={openCalendly}>
          Talk to Us
        </button>
        {calendlyModal}
      </div>
    </section>
  );
}
