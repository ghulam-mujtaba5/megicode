module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://megicode.com',
  generateRobotsTxt: true,
  sitemapSize: 7000,
  exclude: ['/api/*', '/server-sitemap.xml'], // Exclude the server-sitemap from the index
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
    ],
    additionalSitemaps: [
      `${process.env.NEXT_PUBLIC_SITE_URL || 'https://megicode.com'}/server-sitemap.xml`,
    ],
  },
  // Add a transform function to customize fields
  transform: async (config, path) => {
    // Default priority and changefreq
    let priority = 0.7;
    let changefreq = 'daily';

    // Assign priority based on path
    if (path === '/') {
      priority = 1.0;
      changefreq = 'daily';
    } else if (path.startsWith('/services')) {
      priority = 0.9;
      changefreq = 'weekly';
    } else if (path.startsWith('/article')) {
      priority = 0.8;
      changefreq = 'weekly';
    } else if (['/about', '/contact', '/projects'].includes(path)) {
      priority = 0.7;
      changefreq = 'monthly';
    } else {
      priority = 0.5;
      changefreq = 'monthly';
    }

    return {
      loc: path, // => this will be exported as http(s)://<siteUrl>/<path>
      changefreq,
      priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    };
  },
};
