
/**
 * @type {import('next-sitemap').IConfig}
 */
const config = {
  siteUrl: 'https://megicode.com', // Updated to production URL
  generateRobotsTxt: true,
  sitemapSize: 7000,
  exclude: ['/api/*'],
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
    ],
  },
};

module.exports = config;
