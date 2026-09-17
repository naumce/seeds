<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()
const { t } = useLocale()
const notFound = computed(() => props.error.statusCode === 404)
const home = () => clearError({ redirect: '/' })
useHead({ title: () => (notFound.value ? t('error.notFoundTitle') : t('error.genericTitle')) })
</script>

<template>
  <NuxtLayout>
    <section class="err wrap">
      <p class="eyebrow">{{ error.statusCode }}</p>
      <h1 class="serif t-xl">{{ notFound ? t('error.notFoundTitle') : t('error.genericTitle') }}</h1>
      <p class="muted">{{ notFound ? t('error.notFoundBody') : t('error.genericBody') }}</p>
      <div class="err__actions">
        <button class="btn" type="button" @click="home">{{ t('error.home') }}</button>
        <NuxtLinkLocale to="/products" class="link">{{ t('nav.collection') }}</NuxtLinkLocale>
      </div>
      <img src="/images/hero/spice-01-peppercorn.webp" alt="" class="err__img" width="1000" height="563" loading="lazy" />
    </section>
  </NuxtLayout>
</template>

<style scoped>
.err {
  min-height: 70vh;
  display: grid;
  align-content: center;
  gap: 18px;
  padding-block: clamp(64px, 10vw, 140px);
  position: relative;
}
.err__actions {
  display: flex;
  gap: 28px;
  align-items: center;
  margin-top: 12px;
}
.err__img {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: min(38vw, 520px);
  aspect-ratio: 1;
  object-fit: cover;
  opacity: 0.9;
  z-index: -1;
}
@media (max-width: 820px) {
  .err__img {
    display: none;
  }
}
</style>
