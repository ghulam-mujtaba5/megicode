import React from 'react';

interface ArticleItem {
  _id?: string;
  id?: string;
  slug?: string;
  title: string;
  excerpt?: string;
  summary?: string;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  categories?: string[];
  coverImage?: string;
}

interface CollectionPageSchemaProps {
  articles: ArticleItem[];
}

function absoluteImageUrl(url?: string) {
  if (!url) return 'https://www.megicode.com/meta/default-og.jpg';
  if (/^https?:\/\//i.test(url)) return url;
  return `https://www.megicode.com${url.startsWith('/') ? url : `/${url}`}`;
}

const CollectionPageSchema: React.FC<CollectionPageSchemaProps> = ({ articles }) => {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': 'https://www.megicode.com/article#collection',
    name: 'Megicode Insights — AI, SaaS & Engineering Articles',
    description:
      'Executive-level guides on AI product development, SaaS engineering, automation, cloud, and growth — written for founders and operators who want practical clarity before they build.',
    url: 'https://www.megicode.com/article',
    inLanguage: 'en-US',
    isPartOf: {
      '@type': 'WebSite',
      '@id': 'https://www.megicode.com/#website',
      name: 'Megicode',
      url: 'https://www.megicode.com',
    },
    publisher: {
      '@type': 'Organization',
      '@id': 'https://www.megicode.com/#organization',
      name: 'Megicode',
      url: 'https://www.megicode.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.megicode.com/meta/logo-dark.png',
      },
    },
    hasPart: articles.slice(0, 60).map((article) => {
      const slug = article.slug || article._id || article.id || '';
      return {
        '@type': 'Article',
        '@id': `https://www.megicode.com/article/${slug}`,
        name: article.title,
        headline: article.title,
        description: article.excerpt || article.summary || '',
        url: `https://www.megicode.com/article/${slug}`,
        datePublished: article.publishedAt || article.createdAt,
        dateModified: article.updatedAt || article.publishedAt || article.createdAt,
        articleSection: article.categories?.[0] || 'Megicode Insights',
        image: absoluteImageUrl(article.coverImage),
        author: {
          '@type': 'Organization',
          name: 'Megicode',
          url: 'https://www.megicode.com',
        },
        publisher: {
          '@type': 'Organization',
          name: 'Megicode',
          url: 'https://www.megicode.com',
        },
      };
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
};

export default CollectionPageSchema;
