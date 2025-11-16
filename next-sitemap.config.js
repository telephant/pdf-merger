/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://pdfmerge.telephant.club',
  generateRobotsTxt: true,
  sitemapSize: 5000,
  changefreq: 'weekly',
  priority: 0.8,
  exclude: ['/404'],
  robotsTxtOptions: {
    policies: [
      {userAgent: '*', allow: '/'},
    ],
  },
};
