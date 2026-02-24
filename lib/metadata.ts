import type { Metadata } from 'next';

// ─── Constants ───────────────────────────────────────────────
export const SITE_URL = 'https://megicode.com';
export const SITE_NAME = 'Megicode';
export const DEFAULT_OG_IMAGE = '/meta/og-image.png';
export const SERVICES_OG_IMAGE = '/meta/services-og.png';

/** Complete list of official social & professional profiles for sameAs */
export const SOCIAL_PROFILES = [
  'https://www.linkedin.com/company/megicode',
  'https://github.com/megicodes',
  'https://x.com/megi_code',
  'https://www.facebook.com/profile.php?id=61576949862372',
  'https://dev.to/megicode',
  'https://medium.com/@megicode',
  'https://www.figma.com/@megicode',
  'https://www.indiehackers.com/megicode',
  'https://www.instagram.com/megicode/',
  'https://wellfound.com/u/megi-code',
  'https://calendly.com/megicode',
] as const;

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
      siteName: SITE_NAME,
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

/** Review / Testimonial structured data for Reviews page */
export function reviewJsonLd(
  reviews: Array<{
    author: string;
    reviewBody: string;
    ratingValue: number;
  }>
): Record<string, unknown> {
  const avgRating =
    reviews.reduce((sum, r) => sum + r.ratingValue, 0) / reviews.length;

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: avgRating.toFixed(1),
      reviewCount: reviews.length,
      bestRating: '5',
      worstRating: '1',
    },
    review: reviews.map((r) => ({
      '@type': 'Review',
      author: { '@type': 'Person', name: r.author },
      reviewBody: r.reviewBody,
      reviewRating: {
        '@type': 'Rating',
        ratingValue: r.ratingValue,
        bestRating: '5',
      },
    })),
  };
}

/** Case study / project structured data */
export function caseStudyJsonLd(opts: {
  title: string;
  description: string;
  path: string;
  image?: string;
  techStack?: string[];
  testimonial?: string;
}): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: opts.title,
    description: opts.description,
    url: canonicalUrl(opts.path),
    creator: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    ...(opts.image && { image: opts.image }),
    ...(opts.techStack && {
      keywords: opts.techStack.join(', '),
    }),
    ...(opts.testimonial && {
      review: {
        '@type': 'Review',
        reviewBody: opts.testimonial,
      },
    }),
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
      'AI-powered software development for startups, founders, and growing businesses. From AI SaaS MVPs and LLM integration to technical co-founder services and intelligent automation.',
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
    knowsAbout: [
      'AI-Powered Software Development',
      'AI SaaS MVP Development',
      'Technical Co-Founder Services',
      'LLM & GPT Integration',
      'RAG System Development',
      'AI Agent Development',
      'Machine Learning',
      'AI Automation for SMEs',
      'SaaS Platform Development',
      'Web Application Development',
      'Mobile App Development',
      'Product Design & UX',
      'Cloud Infrastructure & DevOps',
      'Startup Technical Partnership',
    ],
    sameAs: [...SOCIAL_PROFILES],
  };
}