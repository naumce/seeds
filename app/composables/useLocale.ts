import ui from '~~/content/ui.json'

export type Locale = 'en' | 'mk'
export type Localized<T = string> = Record<Locale, T>

const LOCALES: Locale[] = ['en', 'mk']

/**
 * MK/EN content layer on top of @nuxtjs/i18n. Routing, cookies and hreflang
 * come from the module; copy lives in content/ui.json as `{ en, mk }` objects
 * (the same shape the catalogue uses), so one helper serves both.
 */
export const useLocale = () => {
  const i18n = useI18n()
  const locale = computed<Locale>(() => (i18n.locale.value === 'mk' ? 'mk' : 'en'))

  const setLocale = (next: Locale) => i18n.setLocale(next)
  const toggle = () => setLocale(locale.value === 'en' ? 'mk' : 'en')

  /** Pick the current language from a `{ en, mk }` object. */
  const l = <T>(v: Localized<T> | undefined): T | undefined => v?.[locale.value] ?? v?.en

  /** Dot-path lookup into content/ui.json, e.g. t('nav.collection'). */
  const t = (path: string): string => {
    const node = path.split('.').reduce<unknown>((acc, k) => (acc as Record<string, unknown> | undefined)?.[k], ui)
    const value = l(node as Localized | undefined)
    return typeof value === 'string' ? value : path
  }

  return { locale, locales: LOCALES, setLocale, toggle, l, t }
}
