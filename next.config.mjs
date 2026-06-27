/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async headers() {
    return [
      {
        // Global security & SEO headers for all pages
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
      {
        // Prevent indexing of internal pages at the HTTP header level
        source: '/internal/:path*',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow',
          },
        ],
      },
      {
        // Prevent indexing of megicode internal pages
        source: '/megicode/:path*',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow',
          },
        ],
      },
      {
        // Prevent indexing of API routes
        source: '/api/:path*',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow',
          },
        ],
      },
      {
        // Cache dynamic OG images for 7 days
        source: '/api/og',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400',
          },
        ],
      },
      {
        // Cache static meta assets for 1 year (immutable)
        source: '/meta/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Cache uploaded blog images for 30 days
        source: '/uploads/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, s-maxage=2592000, stale-while-revalidate=86400',
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      // Common www subdomain mistypes & old URL patterns
      { source: '/home', destination: '/', permanent: true },
      { source: '/index', destination: '/', permanent: true },
      { source: '/index.html', destination: '/', permanent: true },
      // Service slug renames — 301 redirects preserve SEO equity
      { source: '/services/automation-integration', destination: '/services/ai-automation-agents', permanent: true },
      { source: '/services/ai-machine-learning', destination: '/services/ai-saas-mvp-development', permanent: true },
      { source: '/services/mobile-app-solutions', destination: '/services/mobile-app-development', permanent: true },
      { source: '/services/cloud-devops-services', destination: '/services/cloud-devops', permanent: true },
      { source: '/services/ui-ux-product-design', destination: '/services/ui-ux-design', permanent: true },
      { source: '/services/data-analytics-bi', destination: '/services/data-analytics', permanent: true },
      { source: '/services/it-consulting-support', destination: '/services/technical-consulting', permanent: true },
    ];
  },
};

export default nextConfig;
