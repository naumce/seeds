import products from "./content/products.json" with { type: "json" }

export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  future: { compatibilityVersion: 4 },
  devtools: { enabled: false },
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      titleTemplate: '%s · Terra Spice',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#0b0a09' },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400&family=Instrument+Sans:wght@400;500&display=swap',
        },
      ],
    },
  },
  runtimeConfig: {
    inquiryToEmail: process.env.INQUIRY_TO_EMAIL || '',
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      heroFrameCount: 979,
    },
  },
  routeRules: {
    /* Frames and images are content-addressed by regeneration — cache hard. */
    '/frames/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    '/images/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
  },
  nitro: {
    prerender: {
      crawlLinks: false,
      concurrency: 1,
      routes: [
        '/',
        '/products',
        '/about',
        '/quality',
        '/contact',
        ...products.filter((p) => p.published).map((p) => `/products/${p.slug}`),
      ],
    },
  },
})
