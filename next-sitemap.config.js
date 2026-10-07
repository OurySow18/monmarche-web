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
      '/p',
      // Listés dans le sitemap dynamique ci-dessous, à jour sans redéploiement.
      '/categorie',
      '/categorie/*',
      '/sitemap-catalogue.xml',
    ],
    robotsTxtOptions: {
      policies: [
        // Robots d'entraînement d'IA : ils aspirent tout le site sans apporter de
        // visiteurs. meta-externalagent a causé le pic de lectures Firestore
        // d'octobre 2026. Les moteurs de recherche et les assistants qui citent
        // leurs sources (OAI-SearchBot, ChatGPT-User, PerplexityBot,
        // Claude-SearchBot) restent autorisés : ils font recommander le site.
        ...[
          'meta-externalagent',
          'GPTBot',
          'CCBot',
          'Amazonbot',
          'Bytespider',
          'ClaudeBot',
          'Google-Extended',
          'Applebot-Extended',
        ].map((userAgent) => ({ userAgent, disallow: '/' })),
        { userAgent: '*', allow: '/' },
      ],
      additionalSitemaps: ['https://monmarchegn.com/sitemap-catalogue.xml'],
    },
  };
