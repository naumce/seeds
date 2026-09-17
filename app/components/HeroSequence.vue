<script setup lang="ts">
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const { t } = useLocale()
const config = useRuntimeConfig()
const FRAME_COUNT = Number(config.public.heroFrameCount)
const MOBILE_MAX_WIDTH = 820
/** Scroll distance of the pinned hero, in viewport heights. */
const SCROLL_LENGTH_VH = 5.5

/* Copy beats, as scroll-progress ranges (from the build guide). */
const beats = [
  { key: 'l1', from: 0.08, to: 0.18 },
  { key: 'l2', from: 0.22, to: 0.32 },
  { key: 'l3', from: 0.55, to: 0.65 },
  { key: 'l4', from: 0.68, to: 0.76 },
  { key: 'l5', from: 0.78, to: 0.86 },
] as const

const categoryLabels = [
  { slug: 'spices', x: 13 },
  { slug: 'herbs', x: 38 },
  { slug: 'dried-vegetables', x: 62 },
  { slug: 'blends', x: 87 },
]
const { allCategories } = useCatalogue()
const { l } = useLocale()
const catName = (slug: string) => l(allCategories().find((c) => c.slug === slug)?.name) ?? slug

const root = ref<HTMLElement | null>(null)
const canvas = ref<HTMLCanvasElement | null>(null)
const progress = ref(0)
const ready = ref(false)
const reduced = ref(false)

const beatOpacity = (from: number, to: number) => {
  const p = progress.value
  const fade = 0.03
  if (p < from - fade || p > to + fade) return 0
  if (p < from) return (p - (from - fade)) / fade
  if (p > to) return 1 - (p - to) / fade
  return 1
}
const labelsOpacity = computed(() => Math.max(0, Math.min(1, (progress.value - 0.9) / 0.06)))

let ctx: gsap.Context | null = null
let sequence: ReturnType<typeof useFrameSequence> | null = null
let raf = 0
let currentIndex = 0

const draw = () => {
  const c = canvas.value
  const img = sequence?.nearest(currentIndex)
  if (!c || !img) return
  const g = c.getContext('2d')
  if (!g) return
  const cw = c.width
  const ch = c.height
  const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight)
  const w = img.naturalWidth * scale
  const h = img.naturalHeight * scale
  g.clearRect(0, 0, cw, ch)
  g.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h)
}

const scheduleDraw = () => {
  cancelAnimationFrame(raf)
  raf = requestAnimationFrame(draw)
}

const resize = () => {
  const c = canvas.value
  if (!c) return
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  c.width = Math.round(c.clientWidth * dpr)
  c.height = Math.round(c.clientHeight * dpr)
  scheduleDraw()
}

onMounted(async () => {
  reduced.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduced.value) {
    ready.value = true
    return
  }

  const set = window.innerWidth <= MOBILE_MAX_WIDTH ? 'mobile' : 'desktop'
  sequence = useFrameSequence({
    count: FRAME_COUNT,
    url: (i) => `/frames/${set}/frame_${String(i + 1).padStart(4, '0')}.webp`,
  })
  sequence.onFrame((i) => {
    if (Math.abs(i - currentIndex) <= 1) scheduleDraw()
  })

  gsap.registerPlugin(ScrollTrigger)
  resize()
  window.addEventListener('resize', resize, { passive: true })

  try {
    await sequence.prime()
  } catch {
    /* poster stays visible */
  }
  ready.value = true
  scheduleDraw()

  ctx = gsap.context(() => {
    ScrollTrigger.create({
      trigger: root.value,
      start: 'top top',
      end: () => `+=${window.innerHeight * SCROLL_LENGTH_VH}`,
      pin: true,
      scrub: 0.4,
      anticipatePin: 1,
      onUpdate: (self) => {
        progress.value = self.progress
        const next = Math.round(self.progress * (FRAME_COUNT - 1))
        if (next !== currentIndex) {
          currentIndex = next
          sequence?.seek(next)
          scheduleDraw()
        }
      },
    })
  }, root.value ?? undefined)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  window.removeEventListener('resize', resize)
  ctx?.revert()
  sequence?.dispose()
})
</script>

<template>
  <section ref="root" class="hero" :class="{ 'is-ready': ready, 'is-static': reduced }" aria-label="Terra Spice story">
    <img class="hero__poster" src="/images/hero/poster.jpg" alt="" width="2560" height="1440" fetchpriority="high" />
    <canvas v-if="!reduced" ref="canvas" class="hero__canvas" aria-hidden="true" />

    <div v-if="!reduced" class="hero__copy" aria-live="polite">
      <p
        v-for="b in beats"
        :key="b.key"
        class="hero__line serif"
        :class="{ 'hero__line--long': t(`hero.${b.key}`).length > 18 }"
        :style="{ opacity: beatOpacity(b.from, b.to) }"
      >
        {{ t(`hero.${b.key}`) }}
      </p>

      <ul class="hero__labels" :style="{ opacity: labelsOpacity }">
        <li v-for="c in categoryLabels" :key="c.slug" :style="{ left: `${c.x}%` }">
          <NuxtLink :to="`/products?category=${c.slug}`" class="hero__label">{{ catName(c.slug) }}</NuxtLink>
        </li>
      </ul>

      <p class="hero__scroll eyebrow" :style="{ opacity: progress < 0.03 ? 1 : 0 }">{{ t('hero.scroll') }}</p>
    </div>

    <div v-else class="hero__static">
      <p class="serif t-lg">{{ t('hero.static') }}</p>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  height: 100vh;
  height: 100svh;
  background: var(--charcoal);
  color: var(--bone);
  overflow: hidden;
}
.hero__poster,
.hero__canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.hero__poster {
  transition: opacity 0.6s var(--ease);
}
.is-ready .hero__poster {
  opacity: 0;
}
.hero__copy {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.hero__line {
  position: absolute;
  left: var(--gutter);
  bottom: clamp(56px, 12vh, 140px);
  max-width: 14ch;
  font-size: clamp(36px, 6vw, 88px);
  text-shadow: 0 2px 40px rgba(0, 0, 0, 0.6);
  will-change: opacity;
}
.hero__line--long {
  font-size: clamp(26px, 3.6vw, 52px);
  max-width: 24ch;
}
.hero__labels {
  position: absolute;
  left: 0;
  right: 0;
  bottom: clamp(48px, 14vh, 160px);
  height: 0;
  pointer-events: auto;
}
.hero__labels li {
  position: absolute;
  transform: translateX(-50%);
}
.hero__label {
  font-size: 12px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  border-bottom: 1px solid rgba(239, 233, 220, 0.5);
  padding-bottom: 4px;
  white-space: nowrap;
}
.hero__scroll {
  position: absolute;
  right: var(--gutter);
  bottom: 28px;
  color: var(--bone);
  transition: opacity 0.4s;
}
.hero__static {
  position: absolute;
  inset: auto var(--gutter) clamp(56px, 12vh, 140px);
  max-width: 20ch;
}
@media (max-width: 820px) {
  .hero__labels {
    height: auto;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 18px 12px;
    padding-inline: var(--gutter);
    justify-items: center;
  }
  .hero__labels li {
    position: static;
    transform: none;
  }
}
</style>
