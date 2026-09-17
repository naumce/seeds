<script setup lang="ts">
const { t, locale, toggle } = useLocale()
const route = useRoute()
const open = ref(false)
watch(() => route.path, () => (open.value = false))

/* The nav is light-on-dark only while the cinematic hero is pinned. */
const HERO_PIN_VH = 9
const pastHero = ref(false)
const dark = computed(() => route.path === '/' && !pastHero.value)
const onScroll = () => {
  pastHero.value = window.scrollY > window.innerHeight * HERO_PIN_VH
}
onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <div class="site">
    <header class="nav" :class="{ 'nav--dark': dark, 'nav--overlay': route.path === '/' }">
      <div class="wrap nav__row">
        <NuxtLink to="/" class="nav__brand serif">terra spice</NuxtLink>
        <nav class="nav__links" :class="{ 'is-open': open }" aria-label="Main">
          <NuxtLink to="/products">{{ t('nav.collection') }}</NuxtLink>
          <NuxtLink to="/about">{{ t('nav.story') }}</NuxtLink>
          <NuxtLink to="/quality">{{ t('nav.quality') }}</NuxtLink>
          <NuxtLink to="/contact">{{ t('nav.contact') }}</NuxtLink>
        </nav>
        <div class="nav__right">
          <button class="nav__lang" type="button" :aria-label="`Switch language, current ${locale}`" @click="toggle">
            <span :class="{ 'is-active': locale === 'mk' }">MK</span> / <span :class="{ 'is-active': locale === 'en' }">EN</span>
          </button>
          <NuxtLink to="/contact" class="nav__cta">{{ t('nav.quote') }}</NuxtLink>
          <button class="nav__burger" type="button" aria-label="Menu" :aria-expanded="open" @click="open = !open">
            <span /><span />
          </button>
        </div>
      </div>
    </header>

    <main>
      <slot />
    </main>

    <footer class="footer">
      <div class="wrap">
        <div class="footer__cta">
          <h2 class="serif t-lg">{{ t('home.ctaTitle') }}</h2>
          <NuxtLink to="/contact" class="btn">{{ t('home.ctaBtn') }} ↗</NuxtLink>
        </div>
        <hr class="rule" />
        <div class="footer__meta">
          <span class="serif footer__brand">terra spice</span>
          <span class="muted">{{ t('footer.tag') }}</span>
          <span class="footer__links">
            <NuxtLink to="/products">{{ t('nav.collection') }}</NuxtLink>
            <span aria-hidden="true">/</span>
            <NuxtLink to="/contact">{{ t('nav.contact') }}</NuxtLink>
          </span>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.nav {
  position: sticky;
  top: 0;
  z-index: 50;
  background: color-mix(in srgb, var(--paper) 88%, transparent);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--rule);
}
.nav {
  transition: background 0.3s var(--ease), color 0.3s var(--ease), border-color 0.3s var(--ease);
}
.nav--overlay {
  position: fixed;
  left: 0;
  right: 0;
}
.nav--dark {
  background: transparent;
  backdrop-filter: none;
  border-bottom-color: rgba(239, 233, 220, 0.12);
  color: var(--bone);
}
.nav__row {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  height: 64px;
}
.nav__brand {
  font-size: 22px;
  letter-spacing: 0.08em;
  font-weight: 400;
}
.nav__links {
  display: flex;
  gap: 28px;
  font-size: 14px;
}
.nav__links a {
  opacity: 0.85;
  transition: opacity 0.2s;
}
.nav__links a:hover,
.nav__links a.router-link-active {
  opacity: 1;
}
.nav__right {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 24px;
  font-size: 13px;
}
.nav__lang span {
  opacity: 0.45;
}
.nav__lang span.is-active {
  opacity: 1;
}
.nav__cta {
  border-bottom: 1px solid currentColor;
  padding-bottom: 1px;
}
.nav__burger {
  display: none;
  width: 28px;
  height: 20px;
  flex-direction: column;
  justify-content: center;
  gap: 6px;
}
.nav__burger span {
  display: block;
  height: 1px;
  background: currentColor;
}

.footer {
  background: var(--footer);
  padding-block: clamp(48px, 7vw, 96px) 32px;
  margin-top: clamp(48px, 8vw, 120px);
}
.footer__cta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  padding-bottom: 48px;
  flex-wrap: wrap;
}
.footer__meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding-top: 28px;
  font-size: 13px;
  flex-wrap: wrap;
}
.footer__brand {
  font-size: 18px;
  letter-spacing: 0.08em;
}
.footer__links {
  display: flex;
  gap: 10px;
}

@media (max-width: 820px) {
  .nav__row {
    grid-template-columns: 1fr auto;
  }
  .nav__links {
    display: none;
    position: absolute;
    left: 0;
    right: 0;
    top: 64px;
    flex-direction: column;
    gap: 0;
    background: var(--paper);
    color: var(--ink);
    border-bottom: 1px solid var(--rule);
  }
  .nav__links.is-open {
    display: flex;
  }
  .nav__links a {
    padding: 16px var(--gutter);
    border-top: 1px solid var(--rule);
  }
  .nav__cta {
    display: none;
  }
  .nav__burger {
    display: flex;
  }
}
</style>
