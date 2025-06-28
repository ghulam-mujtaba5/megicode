import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import servicesData from '../servicesData';

export async function generateStaticParams() {
  return servicesData.map(service => ({ slug: service.slug }));
}



export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = params;
  const service = servicesData.find(s => s.slug === slug);
  if (!service) return {};
  return {
    title: service.title + ' | Megicode',
    description: service.description,
  };
}



export default async function ServiceDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const service = servicesData.find(s => s.slug === slug);
  if (!service) return notFound();

  return (
    <main style={{ maxWidth: 800, margin: '0 auto', padding: '2rem 1rem' }}>
      <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#4ea8ff', marginBottom: '1rem' }}>{service.title}</h1>
      <p style={{ fontSize: '1.15rem', color: '#444', marginBottom: '1.5rem' }}>{service.description}</p>
      <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginTop: '2rem' }}>Key Features</h2>
      <ul style={{ marginBottom: '1.5rem', marginTop: 8 }}>
        {service.features.map((f, i) => (
          <li key={i} style={{ fontSize: '1.05rem', marginBottom: 4 }}>{f}</li>
        ))}
      </ul>
      <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginTop: '1.5rem' }}>Technologies</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
        {service.techs.map((t, i) => (
          <span key={i} style={{ background: '#e3e6ea', color: '#4ea8ff', borderRadius: 8, padding: '0.25rem 0.75rem', fontWeight: 600, fontSize: '1rem' }}>{t}</span>
        ))}
      </div>
    </main>
  );
}
