import type { Metadata } from 'next';

// ─── Constants ───────────────────────────────────────────────
export const SITE_URL = 'https://megicode.com';
export const SITE_NAME = 'Megicode';
export const DEFAULT_OG_IMAGE = '/meta/og-image.png';
export const SERVICES_OG_IMAGE = '/meta/services-og.png';

// ─── Canonical URL helper ────────────────────────────────────
/** Always returns https://megicode.com/path (no www, no trailing slash) */
export function canonicalUrl(path: string): string {
  const clean = path === '/' ? '' : path.replace(/\/+$/, '');
  return `${SITE_URL}${clean}`;
}

// ─── Page metadata factory ───────────────────────────────────
export function createPageMetadata(opts: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  ogImage?: string;
  ogImageAlt?: string;
  twitterCard?: 'summary' | 'summary_large_image';
  noindex?: boolean;
}): Metadata {
  const url = canonicalUrl(opts.path);
  const ogImage = opts.ogImage || DEFAULT_OG_IMAGE;

  return {
    title: opts.title,
    description: opts.description,
    ...(opts.keywords && { keywords: opts.keywords }),
    openGraph: {
      title: `${opts.title} | ${SITE_NAME}`,
      description: opts.description,
      url,
      images: [{ url: ogImage, width: 1200, height: 630, alt: opts.ogImageAlt || opts.title }],
    },
    twitter: {
      card: opts.twitterCard || 'summary_large_image',
      title: `${opts.title} | ${SITE_NAME}`,
      description: opts.description,
      images: [ogImage],
    },
    alternates: {
      canonical: url,
    },
    ...(opts.noindex && {
      robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
    }),
  };
}

// ─── JSON-LD Structured Data Generators ──────────────────────

/** Breadcrumb list for any page */
export function breadcrumbJsonLd(
  items: Array<{ name: string; path: string }>
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: canonicalUrl(item.path),
    })),
  };
}

/** Service structured data for individual service pages */
export function serviceJsonLd(opts: {
  name: string;
  description: string;
  path: string;
  category?: string;
}): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: opts.name,
    name: opts.name,
    description: opts.description,
    url: canonicalUrl(opts.path),
    provider: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    areaServed: {
      '@type': 'Place',
      name: 'Worldwide',
    },
    ...(opts.category && { category: opts.category }),
  };
}

/** FAQ structured data */
export function faqJsonLd(
  questions: Array<{ question: string; answer: string }>
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map((q) => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer,
      },
    })),
  };
}

/** Local business / professional service schema */
export function professionalServiceJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/meta/android-chrome-512x512.png`,
    image: `${SITE_URL}${DEFAULT_OG_IMAGE}`,
    email: 'contact@megicode.com',
    description:
      'Custom software development, AI solutions, web and mobile applications, data analytics, and IT consulting services.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Lahore',
      addressCountry: 'PK',
    },
    priceRange: '$$',
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '18:00',
    },
    sameAs: [
      'https://www.linkedin.com/company/megicode',
      'https://www.instagram.com/megicode/',
      'https://github.com/megicodes',
    ],
  };
}