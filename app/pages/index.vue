<script setup lang="ts">
const { t, l } = useLocale()
const { allCategories, featured } = useCatalogue()

useSeoMeta({
  title: 'Spices, herbs & dried vegetables — B2B import-export',
  description:
    'Terra Spice imports, processes and exports spices, herbs and dried vegetables for food manufacturers across the Balkans and Europe.',
})

const quality = ['q1', 'q2', 'q3']
</script>

<template>
  <div>
    <HeroSequence />

    <!-- Intro: the "quiet distinction" hero from mockup v4, now second beat -->
    <section class="section intro">
      <div class="wrap intro__grid">
        <div>
          <p class="eyebrow">{{ t('home.eyebrow') }}</p>
          <h1 class="serif t-xl pre intro__title">{{ t('home.title') }}</h1>
          <p class="pre muted intro__sub">{{ t('home.sub') }}</p>
          <NuxtLinkLocale to="/products" class="link">{{ t('home.explore') }}</NuxtLinkLocale>
        </div>
        <figure class="intro__media">
          <img src="/images/categories/spices.webp" alt="" width="2688" height="2016" loading="lazy" />
          <figcaption class="eyebrow">01 / {{ l(allCategories()[0]?.name) }}</figcaption>
        </figure>
      </div>
    </section>

    <!-- Product families -->
    <section class="section">
      <div class="wrap">
        <div class="head" v-reveal>
          <p class="eyebrow">{{ t('home.catEyebrow') }}</p>
          <h2 class="serif t-lg">{{ t('home.catTitle') }}</h2>
        </div>
        <ul class="families">
          <li v-for="(c, i) in allCategories()" :key="c.slug" v-reveal="i * 90">
            <NuxtLinkLocale :to="`/products?category=${c.slug}`" class="family">
              <img :src="c.image" :alt="l(c.name)" loading="lazy" width="2688" height="2016" />
              <h3 class="family__name">{{ l(c.name) }} <span aria-hidden="true">↗</span></h3>
              <p class="muted family__blurb">{{ l(c.blurb) }}</p>
            </NuxtLinkLocale>
          </li>
        </ul>
      </div>
    </section>

    <!-- Selected products -->
    <section class="section">
      <div class="wrap">
        <div class="head head--row" v-reveal>
          <p class="eyebrow">{{ t('home.selEyebrow') }}</p>
          <h2 class="serif t-lg">{{ t('home.selTitle') }}</h2>
          <NuxtLinkLocale to="/products" class="link">{{ t('home.viewAll') }}</NuxtLinkLocale>
        </div>
        <ul class="grid-4">
          <li v-for="(p, i) in featured()" :key="p.slug" v-reveal="i * 90"><ProductCard :product="p" /></li>
        </ul>
      </div>
    </section>

    <ColumnsMosaic />

    <!-- Approach -->
    <section class="section">
      <div class="wrap approach">
        <figure class="approach__media" v-reveal>
          <img src="/images/products/black-peppercorns.webp" alt="" loading="lazy" width="1600" height="2000" />
        </figure>
        <div v-reveal="120">
          <p class="eyebrow">{{ t('home.aboutEyebrow') }}</p>
          <h2 class="serif t-lg pre">{{ t('home.aboutTitle') }}</h2>
          <p class="muted approach__body">{{ t('home.aboutBody') }}</p>
          <NuxtLinkLocale to="/about" class="link">{{ t('home.aboutLink') }}</NuxtLinkLocale>
        </div>
      </div>
    </section>

    <!-- Origin to destination: sticky explainer -->
    <JourneyExplainer />

    <!-- Quality -->
    <section class="section">
      <div class="wrap">
        <div class="head" v-reveal>
          <p class="eyebrow">{{ t('home.qualityEyebrow') }}</p>
          <h2 class="serif t-lg">{{ t('home.qualityTitle') }}</h2>
        </div>
        <ul class="grid-3 quality">
          <li v-for="(q, i) in quality" :key="q" v-reveal="i * 120">
            <h3 class="quality__t">{{ t(`home.${q}t`) }}</h3>
            <p class="muted">{{ t(`home.${q}b`) }}</p>
          </li>
        </ul>
      </div>
    </section>

    <StatementParallax />
  </div>
</template>

<style scoped>
.intro__grid {
  display: grid;
  grid-template-columns: 43fr 57fr;
  gap: clamp(32px, 6vw, 96px);
  align-items: center;
}
.intro__title {
  margin: 20px 0 22px;
}
.intro__sub {
  margin-bottom: 28px;
}
.intro__media img {
  aspect-ratio: 4 / 3;
  object-fit: cover;
  width: 100%;
}
.intro__media figcaption {
  text-align: right;
  margin-top: 10px;
}

.head {
  display: grid;
  gap: 12px;
  margin-bottom: clamp(28px, 4vw, 48px);
}
.head--row {
  grid-template-columns: 1fr auto 1fr;
  align-items: baseline;
}
.head--row .link {
  justify-self: end;
}

.families {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}
.family img {
  aspect-ratio: 4 / 3;
  object-fit: cover;
  width: 100%;
}
.family__name {
  font-size: 15px;
  font-weight: 500;
  margin-top: 14px;
}
.family__name span {
  font-size: 12px;
  color: var(--ink-2);
}
.family__blurb {
  font-size: 14px;
  margin-top: 4px;
}

.grid-4 {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}
.grid-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
}

.approach {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(32px, 6vw, 96px);
  align-items: center;
}
.approach__media img {
  aspect-ratio: 4 / 5;
  object-fit: cover;
  width: 100%;
  max-width: 480px;
}
.approach__body {
  margin: 20px 0 28px;
  max-width: 48ch;
}

.quality__t {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 8px;
}

@media (max-width: 1024px) {
  .families,
  .grid-4 {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 820px) {
  .intro__grid,
  .approach {
    grid-template-columns: 1fr;
  }
  .approach__media {
    order: 2;
  }
  .head--row {
    grid-template-columns: 1fr;
  }
  .head--row .link {
    justify-self: start;
  }
  .grid-3 {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 520px) {
  .families {
    grid-template-columns: 1fr;
  }
  .grid-4 {
    gap: 16px;
  }
}
</style>
