import React from 'react';

interface Service {
  title: string;
  description: string;
  slug: string;
}

interface ServiceSchemaProps {
  service: Service;
}

const ServiceSchema: React.FC<ServiceSchemaProps> = ({ service }) => {
  const serviceUrl = `https://megicode.com/services/${service.slug}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    description: service.description,
    url: serviceUrl,
    provider: {
      '@type': 'Organization',
      name: 'Megicode',
      url: 'https://megicode.com',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
};

export default ServiceSchema;
