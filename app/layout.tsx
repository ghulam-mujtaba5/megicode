import "../styles/global.css";
import React from "react";
import { Providers } from "./providers";
import dynamic from "next/dynamic";
import ClientLayout from "./ClientLayout";
import GoogleAnalytics from "@/components/GoogleAnalytics/GoogleAnalytics";
import { PWA_ICON, LOGO_MAIN_LIGHT, LOGO_MAIN_DARK } from "@/lib/logo";
import { professionalServiceJsonLd, SITE_URL, SOCIAL_PROFILES } from "@/lib/metadata";

if (process.env.NODE_ENV !== 'production' && typeof window !== 'undefined') {
  require('../utils/axe-a11y');
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true
};

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://megicode.com'),
  title: {
    default: "Megicode — Software Development Agency | AI, Web & Mobile Solutions",
    template: "%s | Megicode"
  },
  description: "Megicode is a next-generation software development agency in Lahore, Pakistan. We build custom AI models, scalable web & mobile applications, cloud solutions, and data analytics platforms for startups and enterprises worldwide.",
  keywords: ["software development agency Pakistan", "custom AI development", "web application development", "mobile app development company", "cloud migration services", "data analytics consulting", "hire software developers Pakistan", "startup software agency", "Next.js development", "React development agency", "full-stack development services", "generative AI consulting"],
  authors: [{ name: "Ghulam Mujtaba" }],
  creator: "Ghulam Mujtaba",
  publisher: "Megicode",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      // Theme-aware favicons (both map to PWA icon)
      { url: LOGO_MAIN_LIGHT, media: "(prefers-color-scheme: light)", type: "image/svg+xml" },
      { url: LOGO_MAIN_DARK, media: "(prefers-color-scheme: dark)", type: "image/svg+xml" },
      // Canonical svg + fallbacks
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/meta/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/meta/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/meta/favicon.ico", sizes: "48x48" },
    ],
    apple: [
      { url: "/meta/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { url: "/meta/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/meta/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
  },
  manifest: "/meta/site.webmanifest",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://megicode.com",
    siteName: "Megicode",
    title: "Megicode — Software Development Agency | AI, Web & Mobile Solutions",
    description: "Next-generation software agency in Pakistan. Custom AI, scalable web & mobile apps, cloud solutions & data analytics for startups and enterprises.",
    images: [
      {
        url: "/meta/og-image.png",
        width: 1200,
        height: 630,
        alt: "Megicode - Modern Software Solutions",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Megicode — Software Development Agency | AI, Web & Mobile",
    description: "Next-generation software agency in Pakistan. Custom AI, scalable web & mobile apps, cloud solutions & data analytics.",
    images: ["/meta/twitter-card.png"],
    creator: "@megicode",
  },
  alternates: {
    canonical: 'https://megicode.com',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Megicode",
    "url": "https://megicode.com",
    "logo": `https://megicode.com${PWA_ICON}`,
    "email": "contact@megicode.com",
    "foundingDate": "2024",
    "numberOfEmployees": {
      "@type": "QuantitativeValue",
      "minValue": 2,
      "maxValue": 10
    },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Lahore",
      "addressCountry": "PK"
    },
    "contactPoint": [{
      "@type": "ContactPoint",
      "email": "contact@megicode.com",
      "contactType": "customer support",
      "availableLanguage": ["English", "Urdu"]
    }],
    "knowsAbout": [
      "Custom Software Development",
      "Artificial Intelligence",
      "Machine Learning",
      "Generative AI",
      "LLM Development",
      "Web Application Development",
      "Mobile App Development",
      "React",
      "Next.js",
      "Node.js",
      "TypeScript",
      "UI/UX Design",
      "Cloud Computing",
      "AWS",
      "DevOps",
      "CI/CD",
      "Kubernetes",
      "Data Analytics",
      "Business Intelligence",
      "Power BI",
      "SaaS Development",
      "MVP Development",
      "Startup Software Solutions"
    ],
    "sameAs": [...SOCIAL_PROFILES]
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Megicode",
    "url": "https://megicode.com",
    "description": "Next-generation software development agency in Lahore, Pakistan. Custom AI, scalable web & mobile apps, cloud solutions & data analytics for startups and enterprises worldwide.",
    "publisher": {
      "@type": "Organization",
      "name": "Megicode"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://megicode.com/services?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };

  const professionalService = professionalServiceJsonLd();

  const navJsonLd = {
    "@context": "https://schema.org",
    "@type": "SiteNavigationElement",
    "name": [
      "About",
      "Services",
      "Projects",
      "Reviews",
      "Contact",
      "Privacy Policy"
    ],
    "url": [
      "https://megicode.com/about",
      "https://megicode.com/services",
      "https://megicode.com/projects",
      "https://megicode.com/reviews",
      "https://megicode.com/contact",
      "https://megicode.com/privacy-policy"
    ]
  };

  return (
    <html lang="en">
      <head>
        {/* Dynamic favicons for light/dark mode using user's transparent logo variants */}
        <link
          rel="icon"
          href={PWA_ICON}
          type="image/svg+xml"
          media="(prefers-color-scheme: light)"
        />
        <link
          rel="icon"
          href={PWA_ICON}
          type="image/svg+xml"
          media="(prefers-color-scheme: dark)"
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(professionalService) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(navJsonLd) }} />
        <GoogleAnalytics />
      </head>
      <body>
        <a href="#main-content" className="skip-to-main">Skip to main content</a>
        <Providers>
          <ClientLayout>
            {children}
          </ClientLayout>
        </Providers>
      </body>
    </html>
  );
}
