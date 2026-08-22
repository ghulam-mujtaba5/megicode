import type { Metadata } from 'next';

// ─── Constants ───────────────────────────────────────────────
export const SITE_URL = 'https://www.megicode.com';
export const SITE_NAME = 'Megicode';
export const DEFAULT_OG_IMAGE = '/meta/og-image.png';
export const SERVICES_OG_IMAGE = '/meta/og-image.png';

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
/** Always returns https://www.megicode.com/path (no trailing slash) */
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

/** Founder Person structured data for E-E-A-T and Knowledge Graph */
export function founderPersonJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${SITE_URL}/about#founder`,
    name: 'Ghulam Mujtaba',
    jobTitle: 'Founder & Principal Architect',
    url: `${SITE_URL}/about`,
    image: `${SITE_URL}/meta/android-chrome-512x512.png`,
    worksFor: {
      '@type': 'Organization',
      '@id': `${SITE_URL}#organization`,
      name: SITE_NAME,
      url: SITE_URL,
    },
    sameAs: [
      'https://www.linkedin.com/in/ghulam-mujtaba5/',
      'https://github.com/ghulam-mujtaba5',
      'https://x.com/megi_code',
    ],
    knowsAbout: [
      'AI-Powered Software Development',
      'AI SaaS MVP Architecture',
      'Full-Stack Next.js & React Engineering',
      'LLM & AI Agent Systems',
      'Cloud Infrastructure & DevOps',
      'Technical Co-Founder Advisory',
    ],
  };
}

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
  serviceType?: string;
  category?: string;
  offers?: Array<{
    name: string;
    description: string;
    price?: number | string;
    priceCurrency?: string;
    deliveryTime?: string;
  }>;
}): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${canonicalUrl(opts.path)}#service`,
    serviceType: opts.serviceType || opts.name,
    name: opts.name,
    description: opts.description,
    url: canonicalUrl(opts.path),
    provider: {
      '@type': 'Organization',
      '@id': `${SITE_URL}#organization`,
      name: SITE_NAME,
      url: SITE_URL,
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '38',
      bestRating: '5',
      worstRating: '1',
    },
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['h1', 'section[aria-labelledby="decision-guide-title"] p', '.key-takeaway'],
    },
    audience: [
      { '@type': 'Audience', audienceType: 'Startup founders' },
      { '@type': 'Audience', audienceType: 'Small and medium businesses' },
      { '@type': 'Audience', audienceType: 'Non-technical founders' },
    ],
    areaServed: {
      '@type': 'Place',
      name: 'Worldwide',
    },
    ...(opts.category && { category: opts.category }),
    ...(opts.offers?.length && {
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: `${opts.name} delivery options`,
        itemListElement: opts.offers.map((offer) => ({
          '@type': 'Offer',
          name: offer.name,
          description: offer.description,
          priceCurrency: offer.priceCurrency || 'USD',
          ...(offer.price !== undefined && { price: offer.price }),
          ...(offer.deliveryTime && {
            deliveryLeadTime: {
              '@type': 'QuantitativeValue',
              name: offer.deliveryTime,
            },
          }),
          availability: 'https://schema.org/InStock',
          url: canonicalUrl(opts.path),
          seller: {
            '@type': 'Organization',
            '@id': `${SITE_URL}#organization`,
            name: SITE_NAME,
          },
        })),
      },
    }),
    potentialAction: {
      '@type': 'ScheduleAction',
      target: canonicalUrl('/contact'),
      name: 'Book a consultation',
    },
  };
}

/** ContactPage structured data */
export function contactPageJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    '@id': `${SITE_URL}/contact#webpage`,
    url: `${SITE_URL}/contact`,
    name: `Contact ${SITE_NAME} | Engineering Consultation & Project Inquiries`,
    description:
      'Schedule a discovery consultation or connect with Ghulam Mujtaba and Megicode software engineers.',
    mainEntity: {
      '@type': 'Organization',
      '@id': `${SITE_URL}#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      email: 'contact@megicode.com',
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'Customer Support & Sales',
        email: 'contact@megicode.com',
        availableLanguage: ['English', 'Urdu'],
        url: `${SITE_URL}/contact`,
      },
    },
  };
}

/** AboutPage structured data */
export function aboutPageJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    '@id': `${SITE_URL}/about#webpage`,
    url: `${SITE_URL}/about`,
    name: `About ${SITE_NAME} | AI Software Engineering & Systems Architecture`,
    description:
      'Megicode is an AI software engineering agency founded by Ghulam Mujtaba, delivering custom automation, SaaS MVPs, and web applications.',
    mainEntity: {
      '@type': 'Organization',
      '@id': `${SITE_URL}#organization`,
      name: SITE_NAME,
      founder: {
        '@type': 'Person',
        '@id': `${SITE_URL}/about#founder`,
        name: 'Ghulam Mujtaba',
      },
    },
  };
}

/** CollectionPage structured data for category / listing pages */
export function collectionPageJsonLd(opts: {
  name: string;
  description: string;
  path: string;
  items: Array<{ name: string; path: string; description?: string }>;
}): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${canonicalUrl(opts.path)}#collection`,
    name: opts.name,
    description: opts.description,
    url: canonicalUrl(opts.path),
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: opts.items.map((item, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: item.name,
        url: canonicalUrl(item.path),
        ...(item.description && { description: item.description }),
      })),
    },
  };
}

/** FAQ structured data */
export function faqJsonLd(
  questions: Array<{ q?: string; a?: string; question?: string; answer?: string }>
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map((q) => ({
      '@type': 'Question',
      name: q.q || q.question || '',
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.a || q.answer || '',
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
  const avgRating = reviews.reduce((sum, r) => sum + r.ratingValue, 0) / reviews.length;

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
    publisher: {
      '@type': 'Organization',
      '@id': `${SITE_URL}#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/meta/android-chrome-512x512.png`,
      },
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
    '@id': `${SITE_URL}#professional-service`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/meta/android-chrome-512x512.png`,
    image: `${SITE_URL}${DEFAULT_OG_IMAGE}`,
    email: 'contact@megicode.com',
    description:
      'AI-powered software development for startups, founders, and growing businesses. From AI SaaS MVPs and LLM integration to technical co-founder services and intelligent automation.',
    founder: {
      '@type': 'Person',
      '@id': `${SITE_URL}/about#founder`,
      name: 'Ghulam Mujtaba',
    },
    parentOrganization: {
      '@type': 'Organization',
      '@id': `${SITE_URL}#organization`,
      name: SITE_NAME,
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Lahore',
      addressCountry: 'PK',
    },
    priceRange: '$$',
    areaServed: [
      { '@type': 'Country', name: 'Pakistan' },
      { '@type': 'Country', name: 'United States' },
      { '@type': 'Country', name: 'United Kingdom' },
      { '@type': 'Country', name: 'United Arab Emirates' },
      { '@type': 'Country', name: 'Canada' },
    ],
    makesOffer: [
      {
        '@type': 'Offer',
        name: 'AI Automation & Agents',
        itemOffered: {
          '@type': 'Service',
          name: 'AI automation, lead replies, booking flows, and workflow agents',
          url: canonicalUrl('/services/ai-automation-agents'),
        },
      },
      {
        '@type': 'Offer',
        name: 'AI SaaS / MVP Development',
        itemOffered: {
          '@type': 'Service',
          name: 'AI SaaS MVP roadmap, product build, and launch support',
          url: canonicalUrl('/services/ai-saas-mvp-development'),
        },
      },
      {
        '@type': 'Offer',
        name: 'Custom Web Apps & Business Platforms',
        itemOffered: {
          '@type': 'Service',
          name: 'Custom portals, CRMs, booking systems, dashboards, and business platforms',
          url: canonicalUrl('/services/custom-web-development'),
        },
      },
    ],
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
