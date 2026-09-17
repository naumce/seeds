<script setup lang="ts">
const { t } = useLocale()
const items = ['q1', 'q2', 'q3']
useSeoMeta({ title: 'Quality', description: 'Traceability, laboratory testing and food-grade packing.' })
</script>

<template>
  <div class="wrap section">
    <p class="eyebrow">{{ t('home.qualityEyebrow') }}</p>
    <h1 class="serif t-xl">{{ t('home.qualityTitle') }}</h1>
    <ul class="list">
      <li v-for="(q, i) in items" :key="q">
        <span class="eyebrow">0{{ i + 1 }}</span>
        <h2 class="serif t-md">{{ t(`home.${q}t`) }}</h2>
        <p class="muted">{{ t(`home.${q}b`) }}</p>
      </li>
    </ul>
    <figure class="media">
      <img src="/images/journey/03-pallet.webp" alt="" width="2688" height="1520" loading="lazy" />
    </figure>
  </div>
</template>

<style scoped>
.list {
  margin-top: 48px;
  display: grid;
  gap: 0;
}
.list li {
  display: grid;
  grid-template-columns: 60px 1fr 2fr;
  gap: 24px;
  padding: 28px 0;
  border-top: 1px solid var(--rule);
  align-items: baseline;
}
.media {
  margin-top: 64px;
}
.media img {
  aspect-ratio: 21 / 9;
  object-fit: cover;
  width: 100%;
}
@media (max-width: 820px) {
  .list li {
    grid-template-columns: 1fr;
    gap: 8px;
  }
}
</style>
