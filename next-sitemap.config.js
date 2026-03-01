/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl: 'https://www.megicode.com',
  generateRobotsTxt: true,
  changefreq: 'weekly',
  priority: 0.7,
  sitemapSize: 7000,
  exclude: [
    '/internal/*',
    '/internal',
    '/megicode/*',
    '/megicode',
    '/api/*',
    '/api',
    '/error',
    '/loading',
    '/not-found',
    '/404',
    '/500',
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/internal/', '/megicode/', '/api/'],
      },
      // Explicitly allow AI search crawlers for GEO visibility
      { userAgent: 'GPTBot', allow: '/' },
      { userAgent: 'ChatGPT-User', allow: '/' },
      { userAgent: 'Google-Extended', allow: '/' },
      { userAgent: 'PerplexityBot', allow: '/' },
      { userAgent: 'Anthropic-ai', allow: '/' },
      { userAgent: 'ClaudeBot', allow: '/' },
      { userAgent: 'Bytespider', allow: '/' },
      { userAgent: 'CCBot', allow: '/' },
      { userAgent: 'Amazonbot', allow: '/' },
    ],
    additionalSitemaps: [],
  },
  additionalPaths: async (config) => {
    // ── Static pages (explicitly listed for Next.js 15 App Router compatibility) ──
    const staticPages = [
      { loc: '/', changefreq: 'daily', priority: 1.0 },
      { loc: '/services', changefreq: 'weekly', priority: 0.9 },
      { loc: '/about', changefreq: 'monthly', priority: 0.8 },
      { loc: '/projects', changefreq: 'monthly', priority: 0.8 },
      { loc: '/article', changefreq: 'weekly', priority: 0.8 },
      { loc: '/contact', changefreq: 'monthly', priority: 0.7 },
      { loc: '/careers', changefreq: 'monthly', priority: 0.7 },
      { loc: '/reviews', changefreq: 'monthly', priority: 0.6 },
      { loc: '/privacy-policy', changefreq: 'yearly', priority: 0.3 },
    ];

    // ── Service sub-pages ──
    const serviceSlugs = [
      'ai-machine-learning',
      'data-analytics-bi',
      'custom-web-development',
      'mobile-app-solutions',
      'cloud-devops-services',
      'automation-integration',
      'ui-ux-product-design',
      'it-consulting-support',
      'growth-marketing-seo',
    ];

    const servicePages = serviceSlugs.map((slug) => ({
      loc: `/services/${slug}`,
      changefreq: 'weekly',
      priority: 0.9,
      lastmod: new Date().toISOString(),
    }));

    // ── Project detail pages ──
    const projectSlugs = [
      'aesthetics-clinic-platform',
      'campusaxis-university-portal',
      'fintech-uiux-revamp',
      'desktop-pos-javafx',
      'mobile-expense-tracker',
      'ai-hr-attrition-predictor',
      'predictive-pricing-nyc-taxi',
      'market-trends-dashboard',
    ];

    const projectPages = projectSlugs.map((slug) => ({
      loc: `/projects/${slug}`,
      changefreq: 'monthly',
      priority: 0.7,
      lastmod: new Date().toISOString(),
    }));

    return [
      ...staticPages.map((p) => ({ ...p, lastmod: new Date().toISOString() })),
      ...servicePages,
      ...projectPages,
    ];
  },
  transform: async (config, path) => {
    // Skip internal/error/loading paths that might slip through
    if (
      path.startsWith('/internal') ||
      path.startsWith('/megicode') ||
      path.startsWith('/api') ||
      path.includes('/error') ||
      path.includes('/loading') ||
      path === '/not-found' ||
      path === '/404' ||
      path === '/500'
    ) {
      return null;
    }

    // Custom priority and changefreq based on page type
    let priority = 0.7;
    let changefreq = 'weekly';

    if (path === '/') {
      priority = 1.0;
      changefreq = 'daily';
    } else if (path === '/services' || path.startsWith('/services/')) {
      priority = 0.9;
      changefreq = 'weekly';
    } else if (path === '/about' || path === '/projects') {
      priority = 0.8;
      changefreq = 'monthly';
    } else if (path === '/contact' || path === '/careers') {
      priority = 0.7;
      changefreq = 'monthly';
    } else if (path === '/article' || path.startsWith('/article/')) {
      priority = 0.8;
      changefreq = 'weekly';
    } else if (path === '/reviews') {
      priority = 0.6;
      changefreq = 'monthly';
    } else if (path === '/privacy-policy') {
      priority = 0.3;
      changefreq = 'yearly';
    }

    return {
      loc: path,
      changefreq,
      priority,
      lastmod: new Date().toISOString(),
    };
  },
};

module.exports = config;
