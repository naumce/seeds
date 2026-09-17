<script setup lang="ts">
const { t } = useLocale()
useSeoMeta({ title: 'Our story', description: 'Who we are and how we source, process and export ingredients.' })
</script>

<template>
  <div class="wrap section about">
    <div>
      <p class="eyebrow">{{ t('home.aboutEyebrow') }}</p>
      <h1 class="serif t-xl pre">{{ t('home.aboutTitle') }}</h1>
      <p class="muted body">{{ t('home.aboutBody') }}</p>
      <p class="muted">{{ t('home.marketsTitle') }}</p>
    </div>
    <figure>
      <img src="/images/journey/02-drying.webp" alt="" width="2688" height="1520" loading="lazy" />
    </figure>
  </div>
</template>

<style scoped>
.about {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(32px, 6vw, 96px);
  align-items: center;
}
.body {
  margin: 24px 0 16px;
  max-width: 52ch;
}
figure img {
  aspect-ratio: 4 / 5;
  object-fit: cover;
  width: 100%;
}
@media (max-width: 820px) {
  .about {
    grid-template-columns: 1fr;
  }
}
</style>
