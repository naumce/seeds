<script setup lang="ts">
const { t } = useLocale()
const route = useRoute()
const preset = typeof route.query.product === 'string' ? route.query.product : undefined
useSeoMeta({ title: 'Contact', description: 'Request a quote or information about any product.' })
</script>

<template>
  <div class="wrap section contact">
    <div>
      <p class="eyebrow">{{ t('nav.contact') }}</p>
      <h1 class="serif t-xl">{{ t('form.title') }}</h1>
      <p class="muted meta">{{ t('footer.tag') }}</p>
    </div>
    <InquiryForm :product-slug="preset" />
  </div>
</template>

<style scoped>
.contact {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: clamp(32px, 6vw, 96px);
  align-items: start;
}
.meta {
  margin-top: 16px;
}
@media (max-width: 820px) {
  .contact {
    grid-template-columns: 1fr;
  }
}
</style>
