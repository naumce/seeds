<script setup lang="ts">
const { t, l } = useLocale()
const { bySlug, category, related } = useCatalogue()
const route = useRoute()
const config = useRuntimeConfig()

const product = bySlug(String(route.params.slug))
if (!product) throw createError({ statusCode: 404, statusMessage: 'Product not found', fatal: true })

const cat = category(product.category)
const siblings = related(product)

useSeoMeta({
  title: () => `${l(product.name)} — ${product.latin}`,
  description: () => l(product.description),
  ogImage: () => `${config.public.siteUrl}${product.image}`,
})
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name.en,
        alternateName: product.latin,
        image: `${config.public.siteUrl}${product.image}`,
        description: product.description.en,
        category: cat?.name.en,
        brand: { '@type': 'Organization', name: 'Terra Spice' },
      }),
    },
  ],
})
</script>

<template>
  <article class="wrap section">
    <nav class="crumbs eyebrow" aria-label="Breadcrumb">
      <NuxtLink to="/products">{{ t('products.title') }}</NuxtLink>
      <span aria-hidden="true">/</span>
      <NuxtLink :to="`/products?category=${product.category}`">{{ l(cat?.name) }}</NuxtLink>
    </nav>

    <div class="detail">
      <figure class="detail__media">
        <img :src="product.image" :alt="l(product.name)" width="1600" height="2000" fetchpriority="high" />
      </figure>

      <div class="detail__body">
        <h1 class="serif t-lg">{{ l(product.name) }}</h1>
        <p class="latin">{{ product.latin }}</p>
        <p class="desc">{{ l(product.description) }}</p>

        <dl class="facts">
          <div>
            <dt class="eyebrow">{{ t('products.origin') }}</dt>
            <dd>{{ l(product.origin) }}</dd>
          </div>
          <div>
            <dt class="eyebrow">{{ t('products.forms') }}</dt>
            <dd>{{ l(product.forms)?.join(' · ') }}</dd>
          </div>
          <div>
            <dt class="eyebrow">{{ t('products.packaging') }}</dt>
            <dd>{{ product.packaging.join(' · ') }}</dd>
          </div>
          <div>
            <dt class="eyebrow">{{ t('products.applications') }}</dt>
            <dd>{{ l(product.applications)?.join(' · ') }}</dd>
          </div>
        </dl>

        <h2 class="eyebrow specs__t">{{ t('products.specs') }}</h2>
        <table class="specs">
          <tbody>
            <tr v-for="s in product.specs" :key="s.v">
              <th scope="row">{{ l(s.k) }}</th>
              <td>{{ s.v }}</td>
            </tr>
          </tbody>
        </table>

        <a href="#inquiry" class="btn">{{ t('nav.quote') }} ↗</a>
      </div>
    </div>

    <section id="inquiry" class="inquiry">
      <h2 class="serif t-md">{{ t('form.title') }} — {{ l(product.name) }}</h2>
      <InquiryForm :product-slug="product.slug" />
    </section>

    <section v-if="siblings.length" class="related">
      <h2 class="eyebrow">{{ t('products.related') }}</h2>
      <ul class="related__grid">
        <li v-for="p in siblings" :key="p.slug"><ProductCard :product="p" /></li>
      </ul>
    </section>
  </article>
</template>

<style scoped>
.crumbs {
  display: flex;
  gap: 10px;
  margin-bottom: 32px;
}
.detail {
  display: grid;
  grid-template-columns: 5fr 6fr;
  gap: clamp(32px, 6vw, 96px);
}
.detail__media img {
  width: 100%;
  aspect-ratio: 4 / 5;
  object-fit: cover;
}
.latin {
  font-family: var(--serif);
  font-style: italic;
  color: var(--ink-2);
  margin: 6px 0 24px;
}
.desc {
  max-width: 52ch;
  margin-bottom: 36px;
}
.facts {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px 32px;
  margin: 0 0 36px;
}
.facts dd {
  margin: 6px 0 0;
  font-size: 15px;
}
.specs__t {
  margin-bottom: 10px;
}
.specs {
  width: 100%;
  border-collapse: collapse;
  font-size: 15px;
  margin-bottom: 36px;
}
.specs th,
.specs td {
  text-align: left;
  padding: 10px 0;
  border-top: 1px solid var(--rule);
  font-weight: 400;
}
.specs th {
  color: var(--ink-2);
  width: 45%;
}
.inquiry {
  margin-top: clamp(64px, 8vw, 120px);
  padding-top: clamp(40px, 5vw, 64px);
  border-top: 1px solid var(--rule);
  max-width: 760px;
}
.inquiry h2 {
  margin-bottom: 32px;
}
.related {
  margin-top: clamp(64px, 8vw, 120px);
}
.related__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  margin-top: 20px;
}
@media (max-width: 820px) {
  .detail {
    grid-template-columns: 1fr;
  }
  .related__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
