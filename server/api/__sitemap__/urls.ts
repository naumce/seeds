import products from '../../../content/products.json'

/** Sitemap entries for both locales; static pages are discovered from the router. */
export default defineSitemapEventHandler(() =>
  products
    .filter((p) => p.published)
    .flatMap((p) => [
      { loc: `/products/${p.slug}`, changefreq: 'monthly', priority: 0.8 },
      { loc: `/mk/products/${p.slug}`, changefreq: 'monthly', priority: 0.8 },
    ]),
)
