import React from 'react';

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

const BASE_URL = 'https://www.megicode.com';

function absoluteUrl(pathOrUrl?: string) {
  if (!pathOrUrl) return `${BASE_URL}/meta/og-image.png`;
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return `${BASE_URL}${pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`}`;
}

const ArticleSchema: React.FC<ArticleSchemaProps> = ({ article }) => {
  const pageUrl = `${BASE_URL}/insights/${article.slug || article.id}`;
  const imageUrl = absoluteUrl(
    article.heroImage?.sizes?.medium?.url ||
      article.heroImage?.url ||
      article.coverImage ||
      '/meta/og-image.png'
  );
  const description = article.seoDescription || article.summary || article.excerpt || article.title;

  const keywords = [
    article.primaryKeyword,
    ...(article.keywords || []),
    ...(article.tags || []),
  ].filter(Boolean);

  const authorName = (
    article.authorName ||
    article.populatedAuthors?.[0]?.name ||
    'Megicode Team'
  ).trim();

  const isPerson = authorName && authorName !== 'Megicode Team';

  const authorObject = isPerson
    ? {
        '@type': 'Person',
        name: authorName,
        url:
          authorName === 'Ghulam Mujtaba'
            ? 'https://www.linkedin.com/in/ghulam-mujtaba5/'
            : `${BASE_URL}/about`,
        jobTitle:
          authorName === 'Ghulam Mujtaba'
            ? 'Founder & Principal Architect'
            : 'Co-Founder & Systems Engineer',
        worksFor: {
          '@type': 'Organization',
          name: 'Megicode',
          url: BASE_URL,
        },
        sameAs:
          authorName === 'Ghulam Mujtaba'
            ? ['https://www.linkedin.com/in/ghulam-mujtaba5/', 'https://github.com/ghulam-mujtaba5']
            : [],
      }
    : {
        '@type': 'Organization',
        name: 'Megicode',
        url: BASE_URL,
        logo: `${BASE_URL}/meta/android-chrome-512x512.png`,
      };

  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': pageUrl,
    },
    headline: article.title,
    description,
    image: [imageUrl],
    datePublished: article.publishedAt || article.createdAt,
    dateModified: article.updatedAt || article.publishedAt || article.createdAt,
    author: [authorObject],
    publisher: {
      '@type': 'Organization',
      name: 'Megicode',
      url: BASE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/meta/android-chrome-512x512.png`,
        width: 512,
        height: 512,
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
