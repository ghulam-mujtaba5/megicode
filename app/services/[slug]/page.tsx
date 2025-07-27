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
      </main>
    </>
  );
}
