<script setup lang="ts">
/**
 * Sticky explainer: the image column pins while text panels scroll past;
 * the visible image swaps to match the panel in view (pattern from tashma).
 */
const { t } = useLocale()

const panels = [
  { key: 'j1', src: '/images/journey/01-plant.webp' },
  { key: 'j2', src: '/images/journey/02-drying.webp' },
  { key: 'j3', src: '/images/journey/03-pallet.webp' },
]
const active = ref(panels[0]!.key)
const panelEls = ref<HTMLElement[]>([])
let observer: IntersectionObserver | null = null

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) active.value = (e.target as HTMLElement).dataset.panel ?? active.value
      }
    },
    { threshold: 0.5 },
  )
  panelEls.value.forEach((el) => observer?.observe(el))
})
onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <section class="journey">
    <div class="wrap journey__grid">
      <div class="journey__media">
        <div class="journey__sticky">
          <img
            v-for="p in panels"
            :key="p.key"
            :src="p.src"
            :alt="t(`home.${p.key}`)"
            :class="{ 'is-active': active === p.key }"
            loading="lazy"
            width="2000"
            height="1131"
          />
        </div>
      </div>

      <div class="journey__panels">
        <div class="journey__head">
          <p class="eyebrow">{{ t('home.journeyEyebrow') }}</p>
          <h2 class="serif t-lg">{{ t('home.journeyTitle') }}</h2>
        </div>
        <div
          v-for="(p, i) in panels"
          :key="p.key"
          ref="panelEls"
          class="panel"
          :data-panel="p.key"
        >
          <p class="eyebrow">0{{ i + 1 }} / 0{{ panels.length }}</p>
          <h3 class="serif t-md">{{ t(`home.${p.key}`) }}</h3>
          <p class="muted">{{ t(`home.${p.key}b`) }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.journey {
  background: var(--charcoal);
  color: var(--bone);
}
.journey .eyebrow,
.journey .muted {
  color: rgba(239, 233, 220, 0.6);
}
.journey__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(32px, 6vw, 96px);
}
.journey__sticky {
  position: sticky;
  top: 0;
  height: 100vh;
  height: 100svh;
  display: grid;
  align-items: center;
}
.journey__sticky img {
  grid-area: 1 / 1;
  width: 100%;
  aspect-ratio: 4 / 5;
  object-fit: cover;
  opacity: 0;
  transform: scale(1.02);
  transition: opacity 0.9s var(--ease), transform 1.4s var(--ease);
}
.journey__sticky img.is-active {
  opacity: 1;
  transform: none;
}
.journey__head {
  padding-top: clamp(64px, 12vh, 140px);
  display: grid;
  gap: 12px;
}
.panel {
  min-height: 80vh;
  display: grid;
  align-content: center;
  gap: 14px;
  max-width: 40ch;
}
.panel:last-child {
  padding-bottom: clamp(64px, 12vh, 140px);
}
@media (max-width: 820px) {
  .journey__grid {
    grid-template-columns: 1fr;
  }
  .journey__sticky {
    height: 56vh;
    top: 64px;
  }
  .journey__sticky img {
    aspect-ratio: 16 / 10;
  }
  .panel {
    min-height: 50vh;
  }
}
</style>
