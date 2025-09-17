import React from 'react';
import { PWA_ICON } from '@/lib/logo';

// Define a more specific type for the article data
interface Article {
  id: string;
  title: string;
  summary?: string;
  createdAt: string;
  updatedAt?: string; // Add optional 'updatedAt'
  heroImage?: { url?: string; sizes?: { medium?: { url?: string } } };
  coverImage?: string;
  populatedAuthors?: { name?: string }[];
}

interface ArticleSchemaProps {
  article: Article;
}

const ArticleSchema: React.FC<ArticleSchemaProps> = ({ article }) => {
  const pageUrl = `https://megicode.com/article/${article.id}`;
  const imageUrl = article.heroImage?.sizes?.medium?.url || 
                   article.heroImage?.url || 
                   article.coverImage || 
                   "/meta/default-og.jpg";

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': pageUrl,
    },
    'headline': article.title,
    'description': article.summary || article.title,
    'image': [imageUrl],
    'datePublished': article.createdAt,
    'dateModified': article.updatedAt || article.createdAt, // Use 'updatedAt' if available
    'author': {
      '@type': 'Person',
      'name': article.populatedAuthors?.[0]?.name || 'Megicode',
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'Megicode',
  'logo': {
    '@type': 'ImageObject',
    'url': `https://megicode.com${PWA_ICON}`,
  },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
};

export default ArticleSchema;
