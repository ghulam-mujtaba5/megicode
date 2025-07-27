import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import servicesData from '../servicesData';
import ServiceSchema from '@/components/SEO/ServiceSchema';
import styles from './ServiceDetail.module.css';

export async function generateStaticParams() {
  return servicesData.map(service => ({ slug: service.slug }));
}

// Accept params as a Promise to match generated types
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const service = servicesData.find(s => s.slug === slug);
  if (!service) return {};
  return {
    title: service.title + ' | Megicode',
    description: service.description,
    keywords: service.keywords,
    openGraph: service.openGraph,
    twitter: service.twitter,
  };
}

// Accept params as a Promise to match generated types
export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const service = servicesData.find(s => s.slug === slug);
  if (!service) return notFound();

  return (
    <>
      <ServiceSchema service={service} />
      <main className={styles.serviceContainer}>
        <h1 className={styles.serviceTitle}>{service.title}</h1>
        <p className={styles.serviceDescription}>{service.description}</p>
        <h2 className={styles.featuresTitle}>Key Features</h2>
        <ul className={styles.featuresList}>
          {service.features.map((f, i) => (
            <li key={i} className={styles.featureItem}>{f}</li>
          ))}
        </ul>
        <h2 className={styles.techsTitle}>Technologies</h2>
        <div className={styles.techsContainer}>
          {service.techs.map((t, i) => (
            <span key={i} className={styles.techItem}>{t}</span>
          ))}
        </div>

        {/* Render Process Section */}
        {service.process && (
          <section className={styles.processSection}>
            <h2 className={styles.sectionTitle}>Our Process</h2>
            <ol className={styles.processList}>
              {service.process.map((step, i) => (
                <li key={i} className={styles.processItem}>
                  <h3 className={styles.processItemTitle}>{step.title}</h3>
                  <p>{step.description}</p>
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* Render Benefits Section */}
        {service.benefits && (
          <section className={styles.benefitsSection}>
            <h2 className={styles.sectionTitle}>Key Benefits</h2>
            <div className={styles.benefitsGrid}>
              {service.benefits.map((benefit, i) => (
                <div key={i} className={styles.benefitItem}>
                  <h3 className={styles.benefitItemTitle}>{benefit.title}</h3>
                  <p>{benefit.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Render FAQs Section */}
        {service.faqs && (
          <section className={styles.faqSection}>
            <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
            <div className={styles.faqList}>
              {service.faqs.map((faq, i) => (
                <div key={i} className={styles.faqItem}>
                  <h3 className={styles.faqQuestion}>{faq.question}</h3>
                  <p>{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </>
  );
}
