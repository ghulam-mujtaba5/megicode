"use client";
import styles from './ServiceDetail.module.css';
import Image from 'next/image';
import { useCalendlyModal } from '../CalendlyModal';

export default function AIMachineLearningService() {
  const [openCalendly, calendlyModal] = useCalendlyModal();
  return (
    <section className={styles.serviceDetail}>
      {/* Hero Section */}
      <div className={styles.heroSection} style={{ background: 'linear-gradient(90deg, #4573df 0%, #cfe8ef 100%)', borderRadius: '1.5rem', marginBottom: 32, position: 'relative', overflow: 'hidden', minHeight: 220 }}>
        <div className={styles.heroText}>
          <h1 className={styles.heroHeadline}>
            <span>Smarter Business</span> <span className={styles.emphasis}>Starts with Custom <span className={styles.gradientText}>AI</span></span>
          </h1>
          <p className={styles.heroSubtitle} data-animate="typewriter">Integrate AI to automate, predict, and personalize. Megicode delivers intelligent agents, data-driven models, and smart solutions that scale.</p>
          <>
            <button
              type="button"
              className={styles.ctaButton}
              data-animate="cta-bounce"
              onClick={openCalendly}
            >
              <span role="img" aria-label="Talk to AI Consultant" style={{ marginRight: 8 }}>🤖</span>Get Started
            </button>
            {calendlyModal}
          </>
        </div>
        <div className={styles.heroVisual}>
          {/* Lottie animation placeholder */}
          <Image src="/ds&ai-icon.svg" alt="AI Icon" width={120} height={120} data-animate="float" />
        </div>
        {/* Optionally add animated particles or background shapes here */}
      </div>

      {/* Overview */}
      <div className={styles.section} style={{ display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 220 }}>
          <h2>Overview</h2>
          <p>Megicode helps organizations integrate AI into their workflows to automate, predict, and personalize. We deliver intelligent agents, data-driven models, and smart solutions that scale. From custom LLMs to edge AI, our services power forward-thinking companies.</p>
          <p>Our approach ensures that your teams, users, and stakeholders benefit from actionable intelligence, improved efficiency, and future-ready solutions.</p>
        </div>
        <div style={{ flex: 1, minWidth: 120, textAlign: 'center' }}>
          <Image src="/Big Data Analytics.svg" alt="Data to Insights" width={90} height={90} />
        </div>
      </div>

      {/* Why It Matters */}
      <div className={styles.section} style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: 1, minWidth: 180, textAlign: 'center', background: '#e3e6ea', borderRadius: 14, padding: '1.2rem 1.2rem', marginBottom: 10 }}>
          <span className={styles.statNumber} data-animate="countup" data-value="78">78%</span>
          <div style={{ fontSize: '1.01rem', color: '#222b3a', fontWeight: 500, marginTop: 6 }}>of businesses believe AI will impact their industry (PwC)</div>
        </div>
        <div style={{ flex: 1, minWidth: 180, textAlign: 'center', background: '#e3e6ea', borderRadius: 14, padding: '1.2rem 1.2rem', marginBottom: 10 }}>
          <span className={styles.statNumber} data-animate="countup" data-value="2">2x</span>
          <div style={{ fontSize: '1.01rem', color: '#222b3a', fontWeight: 500, marginTop: 6 }}>revenue growth for AI adoption leaders</div>
        </div>
      </div>

      {/* Our Process - horizontal timeline */}
      <div className={styles.section}>
        <h2>Our Process</h2>
        <ol className={styles.processTimeline} data-animate="timeline">
          <li>
            <Image src="/Big Data Analytics.svg" alt="Assessment" width={40} height={40} />
            <span>AI Readiness Assessment</span>
          </li>
          <li>
            <Image src="/data scrapping icon.svg" alt="Data Strategy" width={40} height={40} />
            <span>Data Strategy & Collection</span>
          </li>
          <li>
            <Image src="/devlopment-icon.svg" alt="Model Training" width={40} height={40} />
            <span>Model Selection & Training</span>
          </li>
          <li>
            <Image src="/data visualization icon.svg" alt="Evaluation" width={40} height={40} />
            <span>Evaluation & Explainability</span>
          </li>
          <li>
            <Image src="/Desktop-App-icon.svg" alt="Deployment" width={40} height={40} />
            <span>Deployment & MLOps</span>
          </li>
        </ol>
      </div>

      {/* Deliverables Grid */}
      <div className={styles.section}>
        <h2>What You Get</h2>
        <div className={styles.deliverablesGrid}>
          {[
            { icon: '/IconSystem/checkmark.svg', label: 'Trained models' },
            { icon: '/IconSystem/checkmark.svg', label: 'Dashboards' },
            { icon: '/IconSystem/checkmark.svg', label: 'API endpoints' },
            { icon: '/IconSystem/checkmark.svg', label: 'ML reports' },
            { icon: '/IconSystem/checkmark.svg', label: 'Retraining pipelines' },
          ].map((item, i) => (
            <div key={i} className={styles.deliverableCard} data-animate="fade-in" title={item.label}>
              <Image src={item.icon} alt="Check" width={24} height={24} />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Use Cases & Industries */}
      <div className={styles.section}>
        <h2>Use Cases & Industries</h2>
        <div className={styles.useCasesGrid}>
          {[
            { icon: '/IconSystem/chatbot.svg', label: 'Chatbots' },
            { icon: '/IconSystem/risk.svg', label: 'Risk scoring' },
            { icon: '/IconSystem/recommend.svg', label: 'Recommendation engines' },
            { icon: '/IconSystem/anomaly.svg', label: 'Anomaly detection' },
            { icon: '/IconSystem/document.svg', label: 'Document parsing' },
          ].map((item, i) => (
            <div key={i} className={styles.useCaseCard} data-animate="flip-in" title={item.label}>
              <Image src={item.icon} alt={item.label} width={32} height={32} />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Example Project / Case Study */}
      <div className={styles.section}>
        <h2>Example Project</h2>
        <div className={styles.caseStudyCard} data-animate="overlay">
          <Image src="/meta/ai-case-study.png" alt="Case Study" width={120} height={80} style={{ borderRadius: 10 }} />
          <div className={styles.caseOverlay}>
            <div><strong>AI-powered Customer Support Chatbot</strong></div>
            <div className={styles.kpiRow}>
              <span className={styles.kpiStat} style={{ color: '#38bdf8' }}>↓60% response time</span>
              <span className={styles.kpiStat} style={{ color: '#22c55e' }}>↑30% satisfaction</span>
              <span className={styles.kpiStat} style={{ color: '#f59e42' }}>80% automation</span>
            </div>
          </div>
        </div>
      </div>

      {/* Client Benefits / ROI */}
      <div className={styles.section}>
        <h2>Client Benefits</h2>
        <div className={styles.benefitsTable}>
          <div className={styles.benefitItem} data-animate="fade-in">
            <Image src="/IconSystem/performance.svg" alt="Performance" width={28} height={28} />
            <span>Performance improvement</span>
          </div>
          <div className={styles.benefitItem} data-animate="fade-in">
            <Image src="/IconSystem/automation.svg" alt="Automation" width={28} height={28} />
            <span>Automation gains</span>
          </div>
          <div className={styles.benefitItem} data-animate="fade-in">
            <Image src="/IconSystem/engagement.svg" alt="Engagement" width={28} height={28} />
            <span>User engagement</span>
          </div>
        </div>
      </div>

      {/* Tools & Technologies */}
      <div className={styles.section}>
        <h2>Tools & Technologies</h2>
        <div className={styles.techIcons}>
          <Image src="/meta/TensorFlow.png" alt="TensorFlow" width={40} height={40} title="TensorFlow" />
          <Image src="/meta/PyTorch.png" alt="PyTorch" width={40} height={40} title="PyTorch" />
          <Image src="/meta/OpenAI.png" alt="OpenAI" width={40} height={40} title="OpenAI" />
          <Image src="/meta/Azure.png" alt="Azure AI" width={40} height={40} title="Azure AI" />
          <Image src="/meta/Scikit-learn.png" alt="Scikit-learn" width={40} height={40} title="Scikit-learn" />
        </div>
      </div>

      {/* Certifications, Security & Compliance */}
      <div className={styles.section}>
        <h2>Certifications & Compliance</h2>
        <div className={styles.certGrid}>
          <div className={styles.certBadge} title="ISO 27001" data-animate="pulse">
            <Image src="/meta/iso27001.png" alt="ISO 27001" width={38} height={38} />
            <span>ISO 27001</span>
          </div>
          <div className={styles.certBadge} title="Model Bias Testing" data-animate="pulse">
            <Image src="/IconSystem/security.svg" alt="Model Bias" width={38} height={38} />
            <span>Model Bias Testing</span>
          </div>
          <div className={styles.certBadge} title="Explainable AI" data-animate="pulse">
            <Image src="/IconSystem/explainable.svg" alt="Explainable AI" width={38} height={38} />
            <span>Explainable AI</span>
          </div>
          <div className={styles.certBadge} title="Data Privacy" data-animate="pulse">
            <Image src="/IconSystem/privacy.svg" alt="Data Privacy" width={38} height={38} />
            <span>Data Privacy</span>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className={styles.ctaSection} style={{ background: 'linear-gradient(90deg, #4573df 0%, #cfe8ef 100%)', borderRadius: 12, marginTop: 32, padding: '2rem 1rem' }}>
        <button type="button" className={styles.ctaButton} data-animate="cta-bounce" onClick={openCalendly}>
          <span role="img" aria-label="Talk to AI Consultant" style={{ marginRight: 8 }}>🤖</span>Request Demo
        </button>
        {calendlyModal}
      </div>
    </section>
  );
}
