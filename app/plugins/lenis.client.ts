import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/**
 * Smooth scroll (Lenis) driving GSAP ScrollTrigger — the same wiring as the
 * honey site. Lenis moves the real window scroll, so native listeners still
 * work. Skipped entirely under prefers-reduced-motion.
 */
export default defineNuxtPlugin(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return { provide: { lenis: null } }
  }

  gsap.registerPlugin(ScrollTrigger)

  const lenis = new Lenis({ lerp: 0.09, smoothWheel: true })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((time) => lenis.raf(time * 1000))
  gsap.ticker.lagSmoothing(0)

  /* Route changes reset the scroll position; Lenis needs to know. */
  const router = useRouter()
  router.afterEach(() => {
    requestAnimationFrame(() => {
      lenis.scrollTo(0, { immediate: true })
      ScrollTrigger.refresh()
    })
  })

  if (import.meta.dev) (window as unknown as { __ST: unknown }).__ST = ScrollTrigger

  return { provide: { lenis } }
})
