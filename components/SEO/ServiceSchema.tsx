import React from 'react';

interface Service {
  title: string;
  description: string;
  slug: string;
  features?: string[];
}

interface ServiceSchemaProps {
  service: Service;
}

const ServiceSchema: React.FC<ServiceSchemaProps> = ({ service }) => {
  const serviceUrl = `https://www.megicode.com/services/${service.slug}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    description: service.description,
    url: serviceUrl,
    provider: {
      '@type': 'Organization',
      name: 'Megicode',
      url: 'https://www.megicode.com',
    },
    areaServed: {
      '@type': 'Place',
      name: 'Worldwide',
    },
    ...(service.features && service.features.length > 0 && {
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: `${service.title} Features`,
        itemListElement: service.features.map((feature) => ({
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: feature,
          },
        })),
      },
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
};

export default ServiceSchema;
