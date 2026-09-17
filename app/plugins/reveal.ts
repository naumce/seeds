/**
 * `v-reveal` — adds `.reveal` and flips to `.is-in` once the element enters
 * the viewport. Optional value is a stagger delay in ms.
 */
export default defineNuxtPlugin((nuxtApp) => {
  if (import.meta.server) {
    /* SSR: render the attribute-free element; the client plugin takes over on hydrate. */
    nuxtApp.vueApp.directive('reveal', { getSSRProps: () => ({}) })
    return
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue
        const el = e.target as HTMLElement
        const delay = Number(el.dataset.revealDelay ?? 0)
        window.setTimeout(() => el.classList.add('is-in'), delay)
        observer.unobserve(el)
      }
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.1 },
  )

  nuxtApp.vueApp.directive('reveal', {
    mounted(el: HTMLElement, binding) {
      el.classList.add('reveal')
      if (typeof binding.value === 'number') el.dataset.revealDelay = String(binding.value)
      observer.observe(el)
    },
    unmounted(el: HTMLElement) {
      observer.unobserve(el)
    },
  })
})
