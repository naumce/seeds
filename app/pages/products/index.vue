<script setup lang="ts">
const { t, l } = useLocale()
const { allCategories, allProducts, byCategory } = useCatalogue()
const route = useRoute()
const router = useRouter()

const active = computed(() => {
  const c = route.query.category
  return typeof c === 'string' && allCategories().some((x) => x.slug === c) ? c : ''
})
const list = computed(() => (active.value ? byCategory(active.value) : allProducts()))
const setFilter = (slug: string) => router.replace({ query: slug ? { category: slug } : {} })

useSeoMeta({
  title: 'Collection',
  description: 'Spices, herbs, dried vegetables and blends for food manufacturers. Request a quote for any product.',
})
</script>

<template>
  <div class="wrap section">
    <p class="eyebrow">{{ t('home.selEyebrow') }}</p>
    <h1 class="serif t-xl">{{ t('products.title') }}</h1>

    <nav class="filters" aria-label="Filter by category">
      <button type="button" :class="{ 'is-active': !active }" @click="setFilter('')">{{ t('products.all') }}</button>
      <button
        v-for="c in allCategories()"
        :key="c.slug"
        type="button"
        :class="{ 'is-active': active === c.slug }"
        @click="setFilter(c.slug)"
      >
        {{ l(c.name) }}
      </button>
    </nav>

    <ul class="grid">
      <li v-for="p in list" :key="p.slug"><ProductCard :product="p" /></li>
    </ul>
  </div>
</template>

<style scoped>
.filters {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  margin: 32px 0 40px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--rule);
  font-size: 14px;
}
.filters button {
  color: var(--ink-2);
  padding-bottom: 2px;
  border-bottom: 1px solid transparent;
}
.filters button.is-active {
  color: var(--ink);
  border-bottom-color: var(--ink);
}
.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px 24px;
}
@media (max-width: 1024px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
@media (max-width: 720px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
