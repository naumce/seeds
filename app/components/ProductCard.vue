<script setup lang="ts">
import type { Product } from '~/composables/useCatalogue'

defineProps<{ product: Product }>()
const { l } = useLocale()
</script>

<template>
  <NuxtLink :to="`/products/${product.slug}`" class="card">
    <div class="card__media">
      <img :src="product.image" :alt="l(product.name)" loading="lazy" width="1600" height="2000" />
    </div>
    <div class="card__meta">
      <div>
        <h3 class="card__name">{{ l(product.name) }}</h3>
        <p class="card__latin">{{ product.latin }}</p>
      </div>
      <span class="card__arrow" aria-hidden="true">↗</span>
    </div>
  </NuxtLink>
</template>

<style scoped>
.card {
  display: block;
}
.card__media {
  aspect-ratio: 4 / 5;
  overflow: hidden;
  background: var(--paper-2);
}
.card__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.8s var(--ease);
}
.card:hover .card__media img {
  transform: scale(1.03);
}
.card__meta {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding-top: 14px;
}
.card__name {
  font-size: 15px;
  font-weight: 500;
}
.card__latin {
  font-family: var(--serif);
  font-style: italic;
  font-size: 14px;
  color: var(--ink-2);
}
.card__arrow {
  font-size: 13px;
  color: var(--ink-2);
}
</style>
