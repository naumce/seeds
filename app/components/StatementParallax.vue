<script setup lang="ts">
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/** Full-bleed background image drifting slower than the page, with a quote. */
const { t } = useLocale()
const root = ref<HTMLElement | null>(null)
const bg = ref<HTMLImageElement | null>(null)
let ctx: gsap.Context | null = null

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  gsap.registerPlugin(ScrollTrigger)
  ctx = gsap.context(() => {
    gsap.fromTo(
      bg.value,
      { yPercent: -12 },
      {
        yPercent: 12,
        ease: 'none',
        scrollTrigger: { trigger: root.value, start: 'top bottom', end: 'bottom top', scrub: true },
      },
    )
  }, root.value ?? undefined)
})
onBeforeUnmount(() => ctx?.revert())
</script>

<template>
  <section ref="root" class="statement">
    <img ref="bg" class="statement__bg" src="/images/hero/spice-07-trade-focus.webp" alt="" loading="lazy" width="2688" height="1520" />
    <div class="statement__copy">
      <h2 class="serif t-xl">{{ t('hero.l4') }}<br />{{ t('hero.l5') }}</h2>
      <p class="eyebrow">{{ t('home.marketsTitle') }}</p>
    </div>
  </section>
</template>

<style scoped>
.statement {
  position: relative;
  height: 90vh;
  overflow: hidden;
  background: var(--charcoal);
  color: var(--bone);
  display: grid;
  place-content: center;
  text-align: center;
}
.statement__bg {
  position: absolute;
  inset: -15% 0;
  width: 100%;
  height: 130%;
  object-fit: cover;
  opacity: 0.6;
  will-change: transform;
}
.statement__copy {
  position: relative;
  display: grid;
  gap: 20px;
  padding-inline: var(--gutter);
  text-shadow: 0 2px 40px rgba(0, 0, 0, 0.7);
}
.statement__copy .eyebrow {
  color: rgba(239, 233, 220, 0.7);
}
</style>
