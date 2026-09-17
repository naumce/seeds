<script setup lang="ts">
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/**
 * Three image columns drifting in alternate directions as you scroll, with
 * a single headline floating over them (pattern from tashma, but with
 * distinct frames per tile instead of one repeated image).
 */
const { t } = useLocale()

/* dir -1 = column travels upward as you scroll (and slides in from its side); dir 1 = downward. */
const columns = [
  { dir: -1, side: -1, images: ['/images/hero/spice-02-orbit.webp', '/images/hero/spice-08-categories.webp', '/images/hero/spice-05-suspended.webp', '/images/journey/01-plant.webp'] },
  { dir: 1, side: 0, images: ['/images/hero/spice-04-explosion.webp', '/images/hero/spice-01-peppercorn.webp', '/images/hero/spice-07-trade-focus.webp', '/images/hero/spice-03-first-color.webp'] },
  { dir: -1, side: 1, images: ['/images/hero/spice-06-world-map.webp', '/images/journey/02-drying.webp', '/images/hero/spice-04-explosion.webp', '/images/hero/spice-02-orbit.webp'] },
]
const TRAVEL_PERCENT = 28
const SLIDE_PERCENT = 14

const root = ref<HTMLElement | null>(null)
let ctx: gsap.Context | null = null

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  gsap.registerPlugin(ScrollTrigger)
  ctx = gsap.context(() => {
    gsap.utils.toArray<HTMLElement>('.mosaic__col').forEach((col) => {
      const dir = Number(col.dataset.dir) || 1
      const side = Number(col.dataset.side) || 0
      gsap.fromTo(
        col,
        { yPercent: dir * TRAVEL_PERCENT, xPercent: side * SLIDE_PERCENT },
        {
          yPercent: dir * -TRAVEL_PERCENT,
          xPercent: 0,
          ease: 'none',
          scrollTrigger: { trigger: root.value, start: 'top bottom', end: 'bottom top', scrub: true },
        },
      )
    })
    gsap.fromTo(
      '.mosaic__overlay h2',
      { yPercent: 40, opacity: 0 },
      {
        yPercent: -40,
        opacity: 1,
        ease: 'none',
        scrollTrigger: { trigger: root.value, start: 'top 70%', end: 'bottom 30%', scrub: true },
      },
    )
  }, root.value ?? undefined)
})
onBeforeUnmount(() => ctx?.revert())
</script>

<template>
  <section ref="root" class="mosaic" :aria-label="t('home.mosaicTitle')">
    <div v-for="(col, i) in columns" :key="i" class="mosaic__col" :data-dir="col.dir" :data-side="col.side">
      <img v-for="src in col.images" :key="src" :src="src" alt="" loading="lazy" width="2000" height="1131" />
    </div>
    <div class="mosaic__overlay">
      <h2 class="serif t-xl">{{ t('home.mosaicTitle') }}</h2>
    </div>
  </section>
</template>

<style scoped>
.mosaic {
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  height: 170vh;
  overflow: hidden;
  background: var(--charcoal);
}
.mosaic__col {
  display: grid;
  gap: 12px;
  align-content: center;
  will-change: transform;
}
.mosaic__col img {
  width: 100%;
  aspect-ratio: 4 / 5;
  object-fit: cover;
  opacity: 0.6;
}
.mosaic__col:nth-child(2) {
  margin-top: -30vh;
}
.mosaic__overlay {
  position: absolute;
  inset: 0;
  display: grid;
  place-content: center;
  text-align: center;
  color: var(--bone);
  pointer-events: none;
  background: radial-gradient(ellipse at center, rgba(11, 10, 9, 0.55), transparent 60%);
}
.mosaic__overlay h2 {
  font-style: italic;
  font-weight: 300;
  padding-inline: var(--gutter);
  text-shadow: 0 2px 48px rgba(0, 0, 0, 0.85);
}
@media (max-width: 820px) {
  .mosaic {
    height: 130vh;
    gap: 8px;
  }
  .mosaic__col {
    gap: 8px;
  }
  .mosaic__col img {
    aspect-ratio: 3 / 4;
  }
  .mosaic__col:nth-child(2) {
    margin-top: -12vh;
  }
}
</style>
