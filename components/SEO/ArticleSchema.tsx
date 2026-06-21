import React from 'react';
import { PWA_ICON } from '@/lib/logo';

// Define a more specific type for the article data
interface Article {
  id: string;
  slug?: string;
  title: string;
  summary?: string;
  excerpt?: string;
  createdAt: string;
  updatedAt?: string; // Add optional 'updatedAt'
  publishedAt?: string | null;
  heroImage?: { url?: string; sizes?: { medium?: { url?: string } } };
  coverImage?: string;
  coverImageAlt?: string;
  coverImageFit?: string;
  authorName?: string;
  tags?: string[];
  categories?: string[];
  populatedAuthors?: { name?: string }[];
}

interface ArticleSchemaProps {
  article: Article;
}

const ArticleSchema: React.FC<ArticleSchemaProps> = ({ article }) => {
  const pageUrl = `https://www.megicode.com/article/${article.slug || article.id}`;
  const imageUrl = article.heroImage?.sizes?.medium?.url || 
                   article.heroImage?.url || 
                   article.coverImage || 
                   "/meta/default-og.jpg";
  const description = article.summary || article.excerpt || article.title;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': pageUrl,
    },
    'headline': article.title,
    'description': description,
    'image': [imageUrl],
    'datePublished': article.publishedAt || article.createdAt,
    'dateModified': article.updatedAt || article.createdAt, // Use 'updatedAt' if available
    'author': {
      '@type': 'Person',
      'name': article.authorName || article.populatedAuthors?.[0]?.name || 'Megicode',
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'Megicode',
  'logo': {
    '@type': 'ImageObject',
    'url': `https://www.megicode.com${PWA_ICON}`,
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
