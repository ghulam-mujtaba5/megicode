import React from 'react';

interface Faq {
  question: string;
  answer: string;
}

interface FaqSchemaProps {
  faqs?: Faq[];
}

const FaqSchema: React.FC<FaqSchemaProps> = ({ faqs }) => {
  if (!faqs || faqs.length === 0) return null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
};

export default FaqSchema;
