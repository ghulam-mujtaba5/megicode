/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl: 'https://megicode.com',
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
    ],
    additionalSitemaps: [],
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
