import React from 'react';

import { PWA_ICON } from '@/lib/logo';

// Define a more specific type for the article data
interface Article {
  id: string;
  slug?: string;
  title: string;
  summary?: string;
  excerpt?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt?: string;
  publishedAt?: string | null;
  heroImage?: { url?: string; sizes?: { medium?: { url?: string } } };
  coverImage?: string;
  coverImageAlt?: string;
  coverImageFit?: string;
  authorName?: string;
  tags?: string[];
  keywords?: string[];
  primaryKeyword?: string;
  categories?: string[];
  readingMinutes?: number;
  populatedAuthors?: { name?: string }[];
}

interface ArticleSchemaProps {
  article: Article;
}

function absoluteUrl(pathOrUrl?: string) {
  if (!pathOrUrl) return 'https://www.megicode.com/meta/default-og.jpg';
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return `https://www.megicode.com${pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`}`;
}

const ArticleSchema: React.FC<ArticleSchemaProps> = ({ article }) => {
  const pageUrl = `https://www.megicode.com/article/${article.slug || article.id}`;
  const imageUrl = absoluteUrl(
    article.heroImage?.sizes?.medium?.url ||
      article.heroImage?.url ||
      article.coverImage ||
      '/meta/default-og.jpg'
  );
  const description = article.seoDescription || article.summary || article.excerpt || article.title;

  const keywords = [
    article.primaryKeyword,
    ...(article.keywords || []),
    ...(article.tags || []),
  ].filter(Boolean);

  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': pageUrl,
    },
    headline: article.title,
    description,
    image: [imageUrl],
    datePublished: article.publishedAt || article.createdAt,
    dateModified: article.updatedAt || article.createdAt,
    author: {
      '@type': 'Organization',
      name: 'Megicode',
      url: 'https://www.megicode.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Megicode',
      logo: {
        '@type': 'ImageObject',
        url: `https://www.megicode.com${PWA_ICON}`,
      },
    },
  };

  if (article.categories?.[0]) jsonLd.articleSection = article.categories[0];
  if (keywords.length) jsonLd.keywords = keywords.join(', ');
  if (article.readingMinutes) jsonLd.timeRequired = `PT${article.readingMinutes}M`;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
};

export default ArticleSchema;
