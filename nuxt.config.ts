import products from "./content/products.json" with { type: "json" }

export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  future: { compatibilityVersion: 4 },
  devtools: { enabled: false },
  modules: ['@nuxtjs/i18n', '@nuxtjs/sitemap'],
  site: { url: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000', name: 'Terra Spice' },
  i18n: {
    locales: [
      { code: 'en', language: 'en', name: 'English' },
      { code: 'mk', language: 'mk', name: 'Македонски' },
    ],
    defaultLocale: 'en',
    strategy: 'prefix_except_default',
    baseUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    detectBrowserLanguage: { useCookie: true, cookieKey: 'ts_locale', redirectOn: 'root', fallbackLocale: 'en' },
    bundle: { optimizeTranslationDirective: false },
  },
  sitemap: { sources: ['/api/__sitemap__/urls'] },
  css: ['~/assets/css/main.css'],
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      htmlAttrs: { lang: 'en' },
      titleTemplate: '%s · Terra Spice',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#0b0a09' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Terra Spice' },
        { property: 'og:image', content: `${process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/og.jpg` },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { name: 'twitter:card', content: 'summary_large_image' },
      ],
      link: [
        { rel: 'icon', href: '/favicon.ico', sizes: '32x32' },
        { rel: 'icon', type: 'image/png', href: '/icon-512.png', sizes: '512x512' },
        { rel: 'apple-touch-icon', href: '/icon-180.png' },
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
    inquiryFromEmail: process.env.INQUIRY_FROM_EMAIL || 'Terra Spice <onboarding@resend.dev>',
    resendApiKey: process.env.RESEND_API_KEY || '',
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      heroFrameCount: 812,
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
        '/mk',
        '/mk/products',
        '/mk/about',
        '/mk/quality',
        '/mk/contact',
        ...products.filter((p) => p.published).map((p) => `/mk/products/${p.slug}`),
      ],
    },
  },
})
