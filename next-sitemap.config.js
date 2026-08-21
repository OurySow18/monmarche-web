// next-sitemap.config.js
module.exports = {
    siteUrl: 'https://monmarchegn.com',
    generateRobotsTxt: true,
    sitemapSize: 7000,
    changefreq: 'weekly',
    priority: 0.7,
    exclude: [
      '/Checkout_Paypal',
      '/Check_payment',
      '/cancel',
      '/return',
      '/payement/*',
      '/avis',
    ],
  };
  